import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { Waypoint, LocationResult } from '../types/location';

interface WaypointInputProps {
  waypoint: Waypoint;
  index: number;
  suggestions: LocationResult[];
  showSuggestions: boolean;
  isLoading?: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onChange: (value: string) => void;
  onFocus: () => void;
  onSelectLocation: (location: LocationResult) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

const WaypointInput = ({
  waypoint,
  index,
  suggestions,
  showSuggestions,
  isLoading = false,
  canMoveUp,
  canMoveDown,
  onChange,
  onFocus,
  onSelectLocation,
  onMoveUp,
  onMoveDown,
  onRemove,
}: WaypointInputProps) => {
  const { t } = useTranslation();
  const suggestionsRef = useRef<HTMLUListElement>(null);

  return (
    <div className="relative">
      <div className="flex items-center mb-1.5">
        <motion.div
          className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-100 mr-2"
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-orange-600"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          ></motion.div>
        </motion.div>
        <label className="text-sm font-medium text-slate-700">
          {t('search.waypoint')} {index + 1}
        </label>
        <div className="flex items-center ml-auto space-x-1">
          {canMoveUp && (
            <motion.button
              type="button"
              onClick={onMoveUp}
              className="p-1 text-slate-400 hover:text-slate-600"
              aria-label="Move waypoint up"
              whileHover={{ scale: 1.1, y: -1 }}
              whileTap={{ scale: 0.95, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ y: -1 }}
                transition={{ type: 'spring', stiffness: 600, damping: 15 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </motion.svg>
            </motion.button>
          )}
          {canMoveDown && (
            <motion.button
              type="button"
              onClick={onMoveDown}
              className="p-1 text-slate-400 hover:text-slate-600"
              aria-label="Move waypoint down"
              whileHover={{ scale: 1.1, y: 1 }}
              whileTap={{ scale: 0.95, y: 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ y: 1 }}
                transition={{ type: 'spring', stiffness: 600, damping: 15 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </motion.button>
          )}
          <motion.button
            type="button"
            onClick={onRemove}
            className="p-1 text-red-400 hover:text-red-600"
            aria-label="Remove waypoint"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </div>
      </div>
      <div className="relative">
        <motion.input
          type="text"
          value={waypoint.name}
          onChange={e => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={t('search.enterWaypoint')}
          className={`w-full px-3 py-2 pr-10 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 ${
            isLoading ? 'bg-blue-50' : ''
          }`}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="animate-spin h-4 w-4 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul
            ref={suggestionsRef}
            className="absolute z-10 w-full bg-white border border-blue-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((location, locationIndex) => (
              <li
                key={locationIndex}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-slate-700 border-b border-blue-50 last:border-b-0"
                onClick={() => onSelectLocation(location)}
              >
                <div className="font-medium">{location.name}</div>
                <div className="text-xs text-slate-500">
                  {location.display_name}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* No results message */}
        {showSuggestions &&
          suggestions.length === 0 &&
          waypoint.name.trim() &&
          !isLoading && (
            <div className="absolute z-10 w-full bg-white border border-blue-200 rounded-md mt-1 shadow-lg p-3">
              <div className="text-sm text-slate-500 text-center">
                <svg
                  className="w-5 h-5 mx-auto mb-1 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {t('search.noResults')}
              </div>
            </div>
          )}

        {/* Instruction hint - positioned below suggestions */}
        {waypoint.name.trim() &&
          !isLoading &&
          suggestions.length > 0 &&
          showSuggestions && (
            <div
              className="absolute z-5 w-full bg-blue-50 border border-blue-200 rounded-md shadow-lg p-2 text-xs text-blue-700"
              style={{
                top: `calc(100% + 1rem + ${Math.min(suggestions.length * 60, 240)}px)`,
              }}
            >
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t('search.clickToSelect')}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default WaypointInput;
