import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '@contexts/FavoritesContext';

interface SaveFavoriteButtonProps {
  startName: string;
  startCoords: [number, number];
  endName: string;
  endCoords: [number, number];
  waypoints?: Array<{
    id: string;
    name: string;
    coordinates: [number, number];
  }>;
  onSaved?: () => void;
}

const SaveFavoriteButton = ({
  startName,
  startCoords,
  endName,
  endCoords,
  waypoints = [],
  onSaved,
}: SaveFavoriteButtonProps) => {
  const { t } = useTranslation();
  const { addFavorite } = useFavorites();
  const [isSaving, setIsSaving] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [customName, setCustomName] = useState('');

  const defaultName = `${startName} → ${endName}`;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: customName.trim() || defaultName,
        startName,
        startLat: startCoords[0],
        startLng: startCoords[1],
        endName,
        endLat: endCoords[0],
        endLng: endCoords[1],
        waypoints: waypoints.length > 0 ? waypoints : undefined,
      };

      const result = await addFavorite(payload);

      if (result) {
        setShowNameInput(false);
        setCustomName('');
        onSaved?.();
      }
    } catch (error) {
      console.error('Failed to save favorite:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (showNameInput) {
    return (
      <div className="bg-white rounded-lg border border-blue-200 p-3 shadow-sm">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('favorites.nameYourRoute', 'Name your route (optional)')}
        </label>
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder={defaultName}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          autoFocus
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {isSaving ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
          </button>
          <button
            onClick={() => {
              setShowNameInput(false);
              setCustomName('');
            }}
            disabled={isSaving}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors text-sm font-medium text-slate-700"
          >
            {t('common.cancel', 'Cancel')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowNameInput(true)}
      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
      {t('favorites.saveRoute', 'Save this route')}
    </button>
  );
};

export default SaveFavoriteButton;
