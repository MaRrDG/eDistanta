import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Waypoint, LocationResult } from '@core/entities/location';
import BaseInput from '@ui/components/base/BaseInput';
import BaseButton from '@ui/components/base/BaseButton';

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
  isSelected: boolean;
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
  isSelected,
}: WaypointInputProps) => {
  const { t } = useTranslation();
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const marker = (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-100 mr-2">
      <div className="w-2.5 h-2.5 rounded-full bg-orange-600"></div>
    </div>
  );

  return (
    <div className="relative">
      <div className="flex items-center mb-1.5 px-1">
        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          {t('search.waypoint')} {index + 1}
        </label>
        <div className="flex items-center ml-auto gap-0.5">
          {canMoveUp && (
            <BaseButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              className="p-1 h-7 w-7 !min-h-0"
              aria-label="Move waypoint up"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </BaseButton>
          )}
          {canMoveDown && (
            <BaseButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              className="p-1 h-7 w-7 !min-h-0"
              aria-label="Move waypoint down"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </BaseButton>
          )}
          <BaseButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="p-1 h-7 w-7 !min-h-0 text-error hover:bg-error/10 hover:text-error"
            aria-label="Remove waypoint"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </BaseButton>
        </div>
      </div>
      <div className="relative">
        <BaseInput
          type="text"
          value={waypoint.name}
          onChange={e => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={t('search.enterWaypoint')}
          isLoading={isLoading}
          className={`${isSelected ? 'border-success bg-green-50 focus:ring-success/10' : 'border-neutral-200'}`}
          leftIcon={marker}
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul
            ref={suggestionsRef}
            className="absolute z-[1000] w-full bg-white border border-neutral-200 rounded-xl mt-1 shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((location, locationIndex) => (
              <li
                key={locationIndex}
                className="px-3 py-2 hover:bg-neutral-50 cursor-pointer text-neutral-900 border-b border-neutral-100 last:border-b-0 select-none"
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelectLocation(location);
                }}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="font-medium pointer-events-none">{location.name}</div>
                <div className="text-xs text-neutral-500 pointer-events-none">
                  {location.display_name}
                </div>
              </li>
            ))}
          </ul>
        )}

        {showSuggestions &&
          suggestions.length === 0 &&
          waypoint.name.trim() &&
          !isLoading && (
            <div className="absolute z-50 w-full bg-white border border-neutral-200 rounded-xl mt-1 shadow-lg p-3">
              <div className="text-sm text-neutral-500 text-center">
                <svg
                  className="w-5 h-5 mx-auto mb-1 text-neutral-500"
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
      </div>
    </div>
  );
};

export default WaypointInput;
