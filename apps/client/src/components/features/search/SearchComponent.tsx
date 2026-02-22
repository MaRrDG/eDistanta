import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import type { FormEvent } from 'react';
import type { SearchComponentProps, LocationResult } from '../../../types/location';
import type { FavoriteRoute } from '../../../services/favoritesService';
import { useLocationSearch } from '../../../hooks/useLocationSearch';
import { useWaypoints } from '../../../hooks/useWaypoints';
import { RouteService } from '../../../services/routeService';
import { useRouteDetails } from '../../../contexts/RouteDetailsContext';
import LocationInput from './LocationInput';
import WaypointInput from './WaypointInput';
import { FavoritesSection } from '../favorites';
import { useSaveRouteSearch } from '../../../hooks/useRouteHistory';
import { RecentSearchesSection } from '../history/RecentSearchesSection';
import type { RouteSearchRecord } from '../../../services/historyService';

const SearchComponent = ({
  onRouteCalculated,
  onMobileSubmit,
  onLocationNamesChange,
  initialStartInput = '',
  initialEndInput = '',
  initialStartLocation = null,
  initialEndLocation = null,
}: SearchComponentProps) => {
  const { t } = useTranslation();
  const { setIsRomaniaRoute, isRoundTrip, setIsRoundTrip } = useRouteDetails();
  const { mutate: saveSearch } = useSaveRouteSearch();

  const [startInput, setStartInput] = useState(initialStartInput);
  const [endInput, setEndInput] = useState(initialEndInput);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasRouteChanges, setHasRouteChanges] = useState(false);
  const [hasCalculatedRoute, setHasCalculatedRoute] = useState(false);

  const [hasStartSelection, setHasStartSelection] = useState(false);
  const [hasEndSelection, setHasEndSelection] = useState(false);
  const [hasWaypointSelection, setHasWaypointSelection] = useState<{
    [key: string]: boolean;
  }>({});
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
  const hasAutoCalculatedRef = useRef(false);

  const isLocationInRomania = (coords: [number, number] | null) => {
    if (!coords) return false;
    const [lat, lng] = coords;
    return lat >= 43.6 && lat <= 48.3 && lng >= 20.2 && lng <= 29.7;
  };

  // Reset auto-calculation flag when route changes
  useEffect(() => {
    hasAutoCalculatedRef.current = false;
  }, [initialStartInput, initialEndInput]);

  // Update inputs when initial values change (for URL-based routes)
  useEffect(() => {
    if (initialStartInput !== startInput) {
      setStartInput(initialStartInput);
      setHasStartSelection(!!initialStartInput);
    }
    if (initialEndInput !== endInput) {
      setEndInput(initialEndInput);
      setHasEndSelection(!!initialEndInput);
    }
  }, [initialStartInput, initialEndInput]);

  // Auto-calculate route when both initial locations are provided
  useEffect(() => {
    if (
      initialStartLocation &&
      initialEndLocation &&
      initialStartInput &&
      initialEndInput &&
      !hasAutoCalculatedRef.current
    ) {
      // Auto-trigger route calculation for URL-based routes
      const autoCalculateRoute = async () => {
        hasAutoCalculatedRef.current = true;
        setIsCalculating(true);
        setError(null);

        try {
          const routeData = await RouteService.calculateRoute(
            initialStartLocation,
            initialEndLocation,
            []
          );

          onRouteCalculated(
            initialStartLocation,
            initialEndLocation,
            [],
            routeData.routes,
            0
          );

          setHasCalculatedRoute(true);

          const isRomania = isLocationInRomania(initialStartLocation) || isLocationInRomania(initialEndLocation);
          setIsRomaniaRoute(isRomania);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'An unknown error occurred'
          );
        } finally {
          setIsCalculating(false);
        }
      };

      // Small delay to ensure UI is ready
      const timer = setTimeout(autoCalculateRoute, 100);
      return () => clearTimeout(timer);
    }
  }, [initialStartLocation, initialEndLocation, initialStartInput, initialEndInput]);

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
    setHasStartSelection(false);
    handleSearch(input, 'start', setStartSuggestions, setShowStartSuggestions);
  };

  const handleEndSearch = (input: string) => {
    setEndInput(input);
    setHasEndSelection(false);
    handleSearch(input, 'end', setEndSuggestions, setShowEndSuggestions);
  };

  const handleWaypointSearch = (waypointId: string, input: string) => {
    updateWaypointName(waypointId, input);
    setHasWaypointSelection(prev => ({ ...prev, [waypointId]: false }));
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
      setHasStartSelection(true);
    } else if (type === 'end') {
      setEndInput(location.name);
      setHasRouteChanges(true);
      setShowEndSuggestions(false);
      setHasEndSelection(true);
    } else {
      setHasWaypointSelection(prev => ({ ...prev, [type]: true }));
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

  const handleFavoriteSelect = async (favorite: FavoriteRoute) => {
    setStartInput(favorite.startName);
    setEndInput(favorite.endName);
    setHasStartSelection(true);
    setHasEndSelection(true);
    setError(null);
    setIsCalculating(true);

    if (onMobileSubmit) {
      onMobileSubmit();
    }

    try {
      const startCoords: [number, number] = [favorite.startLat, favorite.startLng];
      const endCoords: [number, number] = [favorite.endLat, favorite.endLng];

      const waypointsList = favorite.waypoints || [];

      const routeData = await RouteService.calculateRoute(
        startCoords,
        endCoords,
        waypointsList.map(wp => wp.coordinates)
      );

      onRouteCalculated(
        startCoords,
        endCoords,
        waypointsList,
        routeData.routes,
        0
      );

      setHasCalculatedRoute(true);

      const isRomania = isLocationInRomania(startCoords) || isLocationInRomania(endCoords);
      setIsRomaniaRoute(isRomania);

      saveSearch({
        startName: favorite.startName,
        startLat: favorite.startLat,
        startLng: favorite.startLng,
        endName: favorite.endName,
        endLat: favorite.endLat,
        endLng: favorite.endLng,
        waypoints: waypointsList,
        isRoundTrip,
        distanceKm: Number((routeData.routes[0]?.distance || 0).toFixed(2)),
        estimatedTimeMins: Math.round((routeData.routes[0]?.duration || 0)),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setIsCalculating(false);
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

      // Update location names in parent
      if (onLocationNamesChange) {
        onLocationNamesChange(startLocation.name, endLocation.name);
      }

      // Check if route involves Romania
      const isRomania =
        startLocation.country?.toLowerCase().includes('romania') ||
        startLocation.country?.toLowerCase().includes('românia') ||
        endLocation.country?.toLowerCase().includes('romania') ||
        endLocation.country?.toLowerCase().includes('românia') ||
        isLocationInRomania(startLocation.coordinates) ||
        isLocationInRomania(endLocation.coordinates);

      setIsRomaniaRoute(!!isRomania);
      setHasCalculatedRoute(true);

      saveSearch({
        startName: startLocation.name,
        startLat: startLocation.coordinates[0],
        startLng: startLocation.coordinates[1],
        endName: endLocation.name,
        endLat: endLocation.coordinates[0],
        endLng: endLocation.coordinates[1],
        waypoints: validWaypoints,
        isRoundTrip,
        distanceKm: Number((routeData.routes[0]?.distance || 0).toFixed(2)),
        estimatedTimeMins: Math.round((routeData.routes[0]?.duration || 0)),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setIsCalculating(false);
    }
  };

  const handleHistorySelect = async (record: RouteSearchRecord) => {
    // Similar to handleFavoriteSelect, populate inputs and calculate
    setStartInput(record.startName);
    setEndInput(record.endName);
    setHasStartSelection(true);
    setHasEndSelection(true);
    setIsRoundTrip(record.isRoundTrip || false);
    setError(null);
    setIsCalculating(true);

    if (onMobileSubmit) {
      onMobileSubmit();
    }

    try {
      const startCoords: [number, number] = [record.startLat, record.startLng];
      const endCoords: [number, number] = [record.endLat, record.endLng];
      const waypointsList = record.waypoints || [];

      const routeData = await RouteService.calculateRoute(
        startCoords,
        endCoords,
        waypointsList.map(wp => wp.coordinates)
      );

      onRouteCalculated(
        startCoords,
        endCoords,
        waypointsList,
        routeData.routes,
        0
      );

      setHasCalculatedRoute(true);
      const isRomania = isLocationInRomania(startCoords) || isLocationInRomania(endCoords);
      setIsRomaniaRoute(isRomania);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-medium text-blue-900 mb-4">
        {t('search.title')}
      </h2>

      <RecentSearchesSection onHistorySelect={handleHistorySelect} />
      <FavoritesSection onFavoriteSelect={handleFavoriteSelect} />

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
          isSelected={hasStartSelection}
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
                isSelected={hasWaypointSelection[waypoint.id] || false}
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
          isSelected={hasEndSelection}
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

        {/* Round Trip Toggle */}
        <motion.div
          onClick={() => setIsRoundTrip(!isRoundTrip)}
          className={`flex items-center justify-between p-3.5 border rounded-xl shadow-sm transition-all cursor-pointer ${isRoundTrip
            ? 'bg-gradient-to-r from-blue-50/50 to-white border-blue-200 hover:shadow-md'
            : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isRoundTrip ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 select-none">
                {t('routeDetails.roundTrip', 'Drum dus-întors')}
              </p>
              <p className="text-xs text-slate-500 select-none mt-0.5">
                {t('routeDetails.roundTripDesc', 'Calculează distanța și timpul pentru ambele sensuri')}
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isRoundTrip}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ml-2 ${isRoundTrip ? 'bg-blue-600' : 'bg-slate-200'
              }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isRoundTrip ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
          </button>
        </motion.div>

        <motion.button
          type="submit"
          disabled={isCalculating || !startInput || !endInput}
          className={`w-full py-3.5 px-4 rounded-xl font-medium text-white transition-colors flex items-center justify-center shadow-md shadow-blue-600/20 active:scale-95 text-base ${isCalculating || !startInput || !endInput
            ? 'bg-blue-300 cursor-not-allowed shadow-none'
            : hasRouteChanges && hasCalculatedRoute
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
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
