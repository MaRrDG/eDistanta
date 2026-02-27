import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '@contexts/FavoritesContext';
import { ConfirmationModal } from '@ui/components/common';
import type { FavoriteRoute } from '@core/entities/favorite';

interface FavoritesListProps {
  onFavoriteSelect: (favorite: FavoriteRoute) => void;
  onClose?: () => void;
}

const FavoritesList = ({ onFavoriteSelect, onClose }: FavoritesListProps) => {
  const { t } = useTranslation();
  const { favorites, isLoading, removeFavorite, updateFavoriteName } = useFavorites();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (favorite: FavoriteRoute) => {
    setEditingId(favorite.id);
    setEditName(favorite.name || `${favorite.startName} → ${favorite.endName}`);
  };

  const handleSaveEdit = async (id: string) => {
    const success = await updateFavoriteName(id, editName);
    if (success) {
      setEditingId(null);
      setEditName('');
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    setDeletingId(deleteConfirmId);
    const success = await removeFavorite(deleteConfirmId);
    if (success) {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-slate-300 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
        <p className="text-slate-500 text-sm">
          {t('favorites.noFavorites')}
        </p>
        <p className="text-slate-400 text-xs mt-1">
          {t('favorites.noFavoritesDesc')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-1.5">
        {favorites.map((favorite) => {
          const displayName = favorite.name || `${favorite.startName} → ${favorite.endName}`;
          const isEditing = editingId === favorite.id;
          const isDeleting = deletingId === favorite.id;

          return (
            <div
              key={favorite.id}
              className="bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
            >
              {isEditing ? (
                <div className="p-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs mb-2"
                    autoFocus
                  />
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleSaveEdit(favorite.id)}
                      className="cursor-pointer flex-1 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs font-medium"
                    >
                      {t('common.save')}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditName('');
                      }}
                      className="cursor-pointer px-2 py-1 border border-slate-300 rounded hover:bg-slate-50 text-xs font-medium"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2">
                  <div
                    onClick={() => {
                      onFavoriteSelect(favorite);
                      onClose?.();
                    }}
                    className="flex-1 cursor-pointer min-w-0"
                  >
                    <div className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div className="flex-1 min-w-0 text-xs">
                        <div className="font-medium text-slate-900 truncate mb-0.5">
                          {displayName}
                        </div>
                        <div className="text-slate-600 flex items-center gap-1 flex-wrap">
                          <span className="truncate">{favorite.startName}</span>
                          <span className="text-slate-400">→</span>
                          <span className="truncate">{favorite.endName}</span>
                          {favorite.waypoints && favorite.waypoints.length > 0 && (
                            <span className="text-slate-400 text-[10px] whitespace-nowrap">
                              ({favorite.waypoints.length} {favorite.waypoints.length === 1 ? t('favorites.waypoint') : t('favorites.waypoints')})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(favorite)}
                      className="cursor-pointer p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title={t('common.edit')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(favorite.id)}
                      disabled={isDeleting}
                      className="cursor-pointer p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={t('common.delete')}
                    >
                      {isDeleting ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-red-600"></div>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmationModal
        isOpen={deleteConfirmId !== null}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={t('favorites.deleteConfirmTitle')}
        message={t('favorites.deleteConfirmMessage')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        isLoading={deletingId !== null}
        variant="danger"
      />
    </>
  );
};

export default FavoritesList;
