import { useRef, forwardRef } from 'react';
import type { LocationResult } from '../types/location';

interface LocationInputProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  suggestions: LocationResult[];
  showSuggestions: boolean;
  markerColor: 'blue' | 'green' | 'orange';
  onChange: (value: string) => void;
  onFocus: () => void;
  onSelectLocation: (location: LocationResult) => void;
}

const LocationInput = forwardRef<HTMLInputElement, LocationInputProps>(({
  id,
  label,
  value,
  placeholder,
  suggestions,
  showSuggestions,
  markerColor,
  onChange,
  onFocus,
  onSelectLocation
}, ref) => {
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const markerColorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    orange: 'bg-orange-100'
  };

  const markerDotClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600'
  };

  return (
    <div className="relative">
      <div className="flex items-center mb-1.5">
        <div className={`w-6 h-6 flex items-center justify-center rounded-full ${markerColorClasses[markerColor]} mr-2`}>
          <div className={`w-2.5 h-2.5 rounded-full ${markerDotClasses[markerColor]}`}></div>
        </div>
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      </div>
      <div className="relative">
        <input
          ref={ref}
          type="text"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul 
            ref={suggestionsRef}
            className="absolute z-10 w-full bg-white border border-blue-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((location, index) => (
              <li
                key={index}
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
});

LocationInput.displayName = 'LocationInput';

export default LocationInput; 