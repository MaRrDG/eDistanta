import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormEvent } from 'react';
import type { SearchComponentProps, LocationResult } from '../types/location';
import { useLocationSearch } from '../hooks/useLocationSearch';
import { useWaypoints } from '../hooks/useWaypoints';
import { RouteService } from '../services/routeService';
import LocationInput from './LocationInput';
import WaypointInput from './WaypointInput';

const SearchComponent = ({ onRouteCalculated, onMobileSubmit }: SearchComponentProps) => {
  const { t } = useTranslation();
  
  // State for main inputs
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // State for suggestions
  const [startSuggestions, setStartSuggestions] = useState<LocationResult[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<LocationResult[]>([]);
  const [waypointSuggestions, setWaypointSuggestions] = useState<{[key: string]: LocationResult[]}>({});
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [showWaypointSuggestions, setShowWaypointSuggestions] = useState<{[key: string]: boolean}>({});
  
  // Custom hooks
  const { handleSearch, searchLocation } = useLocationSearch();
  const { 
    waypoints, 
    addWaypoint, 
    removeWaypoint, 
    updateWaypointName, 
    updateWaypointFromLocation, 
    moveWaypoint, 
    getValidWaypoints, 
    getInvalidWaypoints 
  } = useWaypoints();
  
  // Refs for handling click outside
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  // Handle clicks outside of the suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startInputRef.current && 
        !startInputRef.current.contains(event.target as Node)
      ) {
        setShowStartSuggestions(false);
      }
      
      if (
        endInputRef.current && 
        !endInputRef.current.contains(event.target as Node)
      ) {
        setShowEndSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search for start location
  const handleStartSearch = (input: string) => {
    setStartInput(input);
    handleSearch(
      input,
      'start',
      setStartSuggestions,
      setShowStartSuggestions
    );
  };

  // Handle search for end location
  const handleEndSearch = (input: string) => {
    setEndInput(input);
    handleSearch(
      input,
      'end',
      setEndSuggestions,
      setShowEndSuggestions
    );
  };

  // Handle search for waypoint
  const handleWaypointSearch = (waypointId: string, input: string) => {
    updateWaypointName(waypointId, input);
    handleSearch(
      input,
      waypointId,
      (results) => setWaypointSuggestions(prev => ({ ...prev, [waypointId]: results })),
      (show) => setShowWaypointSuggestions(prev => ({ ...prev, [waypointId]: show }))
    );
  };

  // Handle location selection
  const handleLocationSelect = (location: LocationResult, type: 'start' | 'end' | string) => {
    if (type === 'start') {
      setStartInput(location.name);
      setShowStartSuggestions(false);
    } else if (type === 'end') {
      setEndInput(location.name);
      setShowEndSuggestions(false);
    } else {
      // It's a waypoint
      updateWaypointFromLocation(type, location);
      setShowWaypointSuggestions(prev => ({ ...prev, [type]: false }));
    }
  };

  // Handle waypoint removal with cleanup
  const handleWaypointRemove = (waypointId: string) => {
    removeWaypoint(waypointId);
    setWaypointSuggestions(prev => {
      const newSuggestions = { ...prev };
      delete newSuggestions[waypointId];
      return newSuggestions;
    });
    setShowWaypointSuggestions(prev => {
      const newShow = { ...prev };
      delete newShow[waypointId];
      return newShow;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setShowStartSuggestions(false);
    setShowEndSuggestions(false);
    setError(null);
    setIsCalculating(true);
    
    if (onMobileSubmit) {
      onMobileSubmit();
    }
    
    try {
      // Search for start location
      const startResults = await searchLocation(startInput);
      const startLocation = startResults.length > 0 ? startResults[0] : null;
      
      // Search for end location
      const endResults = await searchLocation(endInput);
      const endLocation = endResults.length > 0 ? endResults[0] : null;
      
      if (!startLocation || !endLocation) {
        setError(t('search.validationError'));
        setIsCalculating(false);
        return;
      }

      // Validate waypoints
      const validWaypoints = getValidWaypoints();
      const invalidWaypoints = getInvalidWaypoints();
      
      if (invalidWaypoints.length > 0) {
        setError(t('search.waypointValidationError'));
        setIsCalculating(false);
        return;
      }
      
      // Calculate route
      const routeData = await RouteService.calculateRoute(
        startLocation.coordinates,
        endLocation.coordinates,
        validWaypoints.map(wp => wp.coordinates)
      );
      
      onRouteCalculated(
        startLocation.coordinates,
        endLocation.coordinates,
        validWaypoints,
        routeData.routes,
        0
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-medium text-blue-900 mb-4">{t('search.title')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Start Location Input */}
        <LocationInput
          ref={startInputRef}
          id="start"
          label={t('search.startLocation')}
          value={startInput}
          placeholder={t('search.enterStartLocation')}
          suggestions={startSuggestions}
          showSuggestions={showStartSuggestions}
          markerColor="blue"
          onChange={handleStartSearch}
          onFocus={() => startInput && setShowStartSuggestions(true)}
          onSelectLocation={(location) => handleLocationSelect(location, 'start')}
        />

        {/* Waypoints */}
        {waypoints.map((waypoint, index) => (
          <WaypointInput
            key={waypoint.id}
            waypoint={waypoint}
            index={index}
            suggestions={waypointSuggestions[waypoint.id] || []}
            showSuggestions={showWaypointSuggestions[waypoint.id] || false}
            canMoveUp={index > 0}
            canMoveDown={index < waypoints.length - 1}
            onChange={(value) => handleWaypointSearch(waypoint.id, value)}
            onFocus={() => waypoint.name && setShowWaypointSuggestions(prev => ({ ...prev, [waypoint.id]: true }))}
            onSelectLocation={(location) => handleLocationSelect(location, waypoint.id)}
            onMoveUp={() => moveWaypoint(waypoint.id, 'up')}
            onMoveDown={() => moveWaypoint(waypoint.id, 'down')}
            onRemove={() => handleWaypointRemove(waypoint.id)}
          />
        ))}

        {/* Add Waypoint Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addWaypoint}
            className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t('search.addWaypoint')}
          </button>
        </div>

        {/* Destination Input */}
        <LocationInput
          ref={endInputRef}
          id="destination"
          label={t('search.destination')}
          value={endInput}
          placeholder={t('search.enterDestination')}
          suggestions={endSuggestions}
          showSuggestions={showEndSuggestions}
          markerColor="green"
          onChange={handleEndSearch}
          onFocus={() => endInput && setShowEndSuggestions(true)}
          onSelectLocation={(location) => handleLocationSelect(location, 'end')}
        />

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCalculating || !startInput || !endInput}
          className={`w-full py-2.5 px-4 rounded-md font-medium text-white ${
            isCalculating || !startInput || !endInput
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors flex items-center justify-center`}
        >
          {isCalculating ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('search.calculatingRoute')}
            </>
          ) : (
            t('search.calculateRoute')
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchComponent; 