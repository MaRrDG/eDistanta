import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Waypoint, LocationResult } from '../types/location';

interface WaypointInputProps {
  waypoint: Waypoint;
  index: number;
  suggestions: LocationResult[];
  showSuggestions: boolean;
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
  canMoveUp,
  canMoveDown,
  onChange,
  onFocus,
  onSelectLocation,
  onMoveUp,
  onMoveDown,
  onRemove
}: WaypointInputProps) => {
  const { t } = useTranslation();
  const suggestionsRef = useRef<HTMLUListElement>(null);

  return (
    <div className="relative">
      <div className="flex items-center mb-1.5">
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-100 mr-2">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-600"></div>
        </div>
        <label className="text-sm font-medium text-slate-700">
          {t('search.waypoint')} {index + 1}
        </label>
        <div className="flex items-center ml-auto space-x-1">
          {canMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              className="p-1 text-slate-400 hover:text-slate-600"
              aria-label="Move waypoint up"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
          {canMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              className="p-1 text-slate-400 hover:text-slate-600"
              aria-label="Move waypoint down"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-red-400 hover:text-red-600"
            aria-label="Remove waypoint"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="relative">
        <input
          type="text"
          value={waypoint.name}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={t('search.enterWaypoint')}
          className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul 
            ref={suggestionsRef}
            className="absolute z-10 w-full bg-white border border-blue-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((location, locationIndex) => (
              <li
                key={locationIndex}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-slate-700"
                onClick={() => onSelectLocation(location)}
              >
                <div className="font-medium">{location.name}</div>
                <div className="text-xs text-slate-500">{location.display_name}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WaypointInput; 