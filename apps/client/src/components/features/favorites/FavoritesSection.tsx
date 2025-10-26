import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../../../contexts/FavoritesContext';
import FavoritesList from './FavoritesList';
import type { FavoriteRoute } from '../../../services/favoritesService';

interface FavoritesSectionProps {
  onFavoriteSelect: (favorite: FavoriteRoute) => void;
}

const FavoritesSection = ({ onFavoriteSelect }: FavoritesSectionProps) => {
  const { t } = useTranslation();
  const { favorites } = useFavorites();
  const [isExpanded, setIsExpanded] = useState(false);

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <motion.button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-lg transition-colors group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="text-left">
            <div className="font-medium text-slate-900 text-sm">
              {t('favorites.myFavorites', 'My Favorite Routes')}
            </div>
            <div className="text-xs text-slate-600">
              {favorites.length} {favorites.length === 1 ? t('favorites.route', 'route') : t('favorites.routes', 'routes')}
            </div>
          </div>
        </div>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              <FavoritesList
                onFavoriteSelect={onFavoriteSelect}
                onClose={() => setIsExpanded(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FavoritesSection;
