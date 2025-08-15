import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import type { FormEvent } from 'react';
import type { SearchComponentProps, LocationResult } from '../types/location';
import { useLocationSearch } from '../hooks/useLocationSearch';
import { useWaypoints } from '../hooks/useWaypoints';
import { RouteService } from '../services/routeService';
import LocationInput from './LocationInput';
import WaypointInput from './WaypointInput';

const SearchComponent = ({
  onRouteCalculated,
  onMobileSubmit,
}: SearchComponentProps) => {
  const { t } = useTranslation();

  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasRouteChanges, setHasRouteChanges] = useState(false);
  const [hasCalculatedRoute, setHasCalculatedRoute] = useState(false);

  const [startSuggestions, setStartSuggestions] = useState<LocationResult[]>(
    []
  );
  const [endSuggestions, setEndSuggestions] = useState<LocationResult[]>([]);
  const [waypointSuggestions, setWaypointSuggestions] = useState<{
    [key: string]: LocationResult[];
  }>({});
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);
  const [showWaypointSuggestions, setShowWaypointSuggestions] = useState<{
    [key: string]: boolean;
  }>({});

  const { handleSearch, searchLocation, isLoading } = useLocationSearch();
  const {
    waypoints,
    addWaypoint,
    removeWaypoint,
    updateWaypointName,
    updateWaypointFromLocation,
    moveWaypoint,
    getValidWaypoints,
    getInvalidWaypoints,
  } = useWaypoints();

  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

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

  const handleStartSearch = (input: string) => {
    setStartInput(input);
    handleSearch(input, 'start', setStartSuggestions, setShowStartSuggestions);
  };

  const handleEndSearch = (input: string) => {
    setEndInput(input);
    handleSearch(input, 'end', setEndSuggestions, setShowEndSuggestions);
  };

  const handleWaypointSearch = (waypointId: string, input: string) => {
    updateWaypointName(waypointId, input);

    handleSearch(
      input,
      waypointId,
      results =>
        setWaypointSuggestions(prev => ({ ...prev, [waypointId]: results })),
      show =>
        setShowWaypointSuggestions(prev => ({ ...prev, [waypointId]: show }))
    );
  };

  const handleLocationSelect = (
    location: LocationResult,
    type: 'start' | 'end' | string
  ) => {
    if (type === 'start') {
      setHasRouteChanges(true);
      setStartInput(location.name);
      setShowStartSuggestions(false);
    } else if (type === 'end') {
      setEndInput(location.name);
      setHasRouteChanges(true);
      setShowEndSuggestions(false);
    } else {
      updateWaypointFromLocation(type, location);
      setShowWaypointSuggestions(prev => ({ ...prev, [type]: false }));
    }
    if (hasCalculatedRoute) {
      setHasRouteChanges(true);
    }
  };

  const handleWaypointRemove = (waypointId: string) => {
    removeWaypoint(waypointId);
    if (hasCalculatedRoute) {
      setHasRouteChanges(true);
    }
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

  const handleWaypointAdd = () => {
    addWaypoint();
  };

  const handleWaypointMove = (waypointId: string, direction: 'up' | 'down') => {
    moveWaypoint(waypointId, direction);
    if (hasCalculatedRoute) {
      setHasRouteChanges(true);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setShowStartSuggestions(false);
    setShowEndSuggestions(false);
    setError(null);
    setIsCalculating(true);
    setHasRouteChanges(false);

    if (onMobileSubmit) {
      onMobileSubmit();
    }

    try {
      const startResults = await searchLocation(startInput);
      const startLocation = startResults.length > 0 ? startResults[0] : null;

      const endResults = await searchLocation(endInput);
      const endLocation = endResults.length > 0 ? endResults[0] : null;

      if (!startLocation || !endLocation) {
        setError(t('search.validationError'));
        setIsCalculating(false);
        return;
      }

      const validWaypoints = getValidWaypoints();
      const invalidWaypoints = getInvalidWaypoints();

      if (invalidWaypoints.length > 0) {
        setError(t('search.waypointValidationError'));
        setIsCalculating(false);
        return;
      }

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

      setHasCalculatedRoute(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-medium text-blue-900 mb-4">
        {t('search.title')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 pb-12 md:pb-4">
        <LocationInput
          ref={startInputRef}
          id="start"
          label={t('search.startLocation')}
          value={startInput}
          placeholder={t('search.enterStartLocation')}
          suggestions={startSuggestions}
          showSuggestions={showStartSuggestions}
          isLoading={isLoading('start')}
          markerColor="blue"
          onChange={handleStartSearch}
          onFocus={() => startInput && setShowStartSuggestions(true)}
          onSelectLocation={location => handleLocationSelect(location, 'start')}
        />

        <AnimatePresence mode="popLayout">
          {waypoints.map((waypoint, index) => (
            <motion.div
              key={waypoint.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
            >
              <WaypointInput
                waypoint={waypoint}
                index={index}
                suggestions={waypointSuggestions[waypoint.id] || []}
                showSuggestions={showWaypointSuggestions[waypoint.id] || false}
                isLoading={isLoading(waypoint.id)}
                canMoveUp={index > 0}
                canMoveDown={index < waypoints.length - 1}
                onChange={value => handleWaypointSearch(waypoint.id, value)}
                onFocus={() =>
                  waypoint.name &&
                  setShowWaypointSuggestions(prev => ({
                    ...prev,
                    [waypoint.id]: true,
                  }))
                }
                onSelectLocation={location =>
                  handleLocationSelect(location, waypoint.id)
                }
                onMoveUp={() => handleWaypointMove(waypoint.id, 'up')}
                onMoveDown={() => handleWaypointMove(waypoint.id, 'down')}
                onRemove={() => handleWaypointRemove(waypoint.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex justify-center">
          <motion.button
            type="button"
            onClick={handleWaypointAdd}
            className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <motion.svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              whileHover={{ rotate: 90 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </motion.svg>
            {t('search.addWaypoint')}
          </motion.button>
        </div>

        <LocationInput
          ref={endInputRef}
          id="destination"
          label={t('search.destination')}
          value={endInput}
          placeholder={t('search.enterDestination')}
          suggestions={endSuggestions}
          showSuggestions={showEndSuggestions}
          isLoading={isLoading('end')}
          markerColor="green"
          onChange={handleEndSearch}
          onFocus={() => endInput && setShowEndSuggestions(true)}
          onSelectLocation={location => handleLocationSelect(location, 'end')}
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}

        {hasRouteChanges && hasCalculatedRoute && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <div className="font-medium">{t('search.recalculateNeeded')}</div>
              <div className="text-xs mt-1">{t('search.recalculateHint')}</div>
            </div>
          </motion.div>
        )}
  
        <motion.button
          type="submit"
          disabled={isCalculating || !startInput || !endInput}
          className={`w-full py-2.5 px-4 rounded-md font-medium text-white transition-colors flex items-center justify-center ${
            isCalculating || !startInput || !endInput
              ? 'bg-blue-300 cursor-not-allowed'
              : hasRouteChanges && hasCalculatedRoute
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-blue-600 hover:bg-blue-700'
          }`}
          whileHover={
            !isCalculating && startInput && endInput ? { scale: 1.02 } : {}
          }
          whileTap={
            !isCalculating && startInput && endInput ? { scale: 0.98 } : {}
          }
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          {isCalculating ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2"
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
              {t('search.calculatingRoute')}
            </>
          ) : hasRouteChanges && hasCalculatedRoute ? (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {t('search.recalculateNeeded')}
            </>
          ) : (
            t('search.calculateRoute')
          )}
        </motion.button>
      </form>
    </div>
  );
};
export default SearchComponent;
