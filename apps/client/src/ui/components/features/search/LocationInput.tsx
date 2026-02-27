import { useRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { LocationResult } from '@core/entities/location';
import BaseInput from '@ui/components/base/BaseInput';

interface LocationInputProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  suggestions: LocationResult[];
  showSuggestions: boolean;
  isLoading?: boolean;
  markerColor: 'blue' | 'green' | 'orange';
  onChange: (value: string) => void;
  onFocus: () => void;
  onSelectLocation: (location: LocationResult) => void;
  className?: string;
  isSelected?: boolean;
}

const LocationInput = forwardRef<HTMLInputElement, LocationInputProps>(
  (
    {
      id,
      label,
      value,
      placeholder,
      suggestions,
      showSuggestions,
      isLoading = false,
      markerColor,
      onChange,
      onFocus,
      onSelectLocation,
      className,
      isSelected,
    },
    ref
  ) => {
    const suggestionsRef = useRef<HTMLUListElement>(null);
    const { t } = useTranslation();

    const markerColorClasses = {
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      orange: 'bg-orange-100',
    };

    const markerDotClasses = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      orange: 'bg-orange-600',
    };

    const marker = (
      <div
        className={`w-6 h-6 flex items-center justify-center rounded-full ${markerColorClasses[markerColor]} mr-2`}
      >
        <div
          className={`w-2.5 h-2.5 rounded-full ${markerDotClasses[markerColor]}`}
        ></div>
      </div>
    );

    return (
      <div className={`relative ${className}`}>
        <BaseInput
          ref={ref}
          id={id}
          label={label}
          autoComplete="off"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          isLoading={isLoading}
          className={`
            ${isSelected ? 'pr-16 border-success bg-green-50 focus:ring-success/10' : 'border-neutral-200'}
          `}
          leftIcon={marker}
        />

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul
            ref={suggestionsRef}
            className="absolute z-[1000] w-full bg-white border border-neutral-200 rounded-xl mt-1 shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((location, index) => (
              <li
                key={index}
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

        {/* No results message */}
        {showSuggestions &&
          suggestions.length === 0 &&
          value.trim() &&
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
    );
  }
);

LocationInput.displayName = 'LocationInput';

export default LocationInput;
