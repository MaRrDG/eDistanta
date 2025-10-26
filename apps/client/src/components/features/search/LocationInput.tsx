import { useRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { LocationResult } from '../../../types/location';

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

    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center mb-1.5 z-[1]">
          <div
            className={`w-6 h-6 flex items-center justify-center rounded-full ${markerColorClasses[markerColor]} mr-2`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${markerDotClasses[markerColor]}`}
            ></div>
          </div>
          <label htmlFor={id} className="text-sm font-medium text-slate-900">
            {label}
          </label>
        </div>
        <div className="relative">
          <input
            ref={ref}
            type="text"
            id={id}
            autoComplete="off"
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={onFocus}
            placeholder={placeholder}
            className={`w-full z-0 px-3 py-2 ${isSelected ? 'pr-16' : 'pr-10'} border ${
              isSelected ? 'border-green-300 bg-green-50' : 'border-blue-200'
            } rounded-md focus:outline-none focus:ring-2 ${
              isSelected ? 'focus:ring-green-500' : 'focus:ring-blue-500'
            } text-slate-900 placeholder:text-slate-600 ${isLoading ? 'bg-blue-50' : ''}`}
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
              className="absolute z-[1000] w-full bg-white border border-blue-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
            >
              {suggestions.map((location, index) => (
                <li
                  key={index}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-slate-900 border-b border-blue-50 last:border-b-0 select-none"
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
                  <div className="text-xs text-slate-700 pointer-events-none">
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
              <div className="absolute z-50 w-full bg-white border border-blue-200 rounded-md mt-1 shadow-lg p-3">
                <div className="text-sm text-slate-700 text-center">
                  <svg
                    className="w-5 h-5 mx-auto mb-1 text-slate-700"
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
          {value.trim() &&
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
  }
);

LocationInput.displayName = 'LocationInput';

export default LocationInput;
