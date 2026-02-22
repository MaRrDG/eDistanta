import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { TollService, type VehicleType as TollVehicleType } from '../../../services/tollService';
import { useRouteDetails } from '../../../contexts/RouteDetailsContext';
import { useAppState } from '../../../contexts/AppStateContext';
import RouteAlternatives from './RouteAlternatives';
import VehicleSettings from '../vehicle/VehicleSettings';
import RouteMetrics from './RouteMetrics';
import { AlertBanner } from '../../common';
import { TollInfo } from '../toll';
import { SaveFavoriteButton } from '../favorites';

interface RouteData {
  route: [number, number][];
  distance: number;
  duration: number;
  index: number;
}

interface Waypoint {
  id: string;
  name: string;
  coordinates: [number, number];
}

interface RouteDetailsProps {
  routes: RouteData[] | null;
  selectedRouteIndex: number;
  onRouteSelected: (index: number) => void;
  waypoints?: Waypoint[];
  startLocation?: [number, number] | null;
  endLocation?: [number, number] | null;
  startName?: string;
  endName?: string;
  onTollModalOpen?: (tollSummary: {
    bridges: any[];
    totalRON: number;
    totalEUR: number;
    vehicleType: TollVehicleType;
  }) => void;
}

const RouteDetails = ({
  routes,
  selectedRouteIndex,
  onRouteSelected,
  waypoints = [],
  startLocation,
  endLocation,
  startName,
  endName,
  onTollModalOpen,
}: RouteDetailsProps) => {
  const { t } = useTranslation();
  const {
    vehicleType,
    fuelConsumption,
    fuelPriceData,
    priceError,
    isApiAvailable,
    isCheckingHealth,
    isRomaniaRoute,
    isRoundTrip
  } = useRouteDetails();
  const { weatherData } = useAppState();
  const [showSaved, setShowSaved] = useState(false);

  // Calculate toll bridges for the selected route
  // This hook must be called before any conditional returns
  const selectedRoute = routes?.[selectedRouteIndex];
  const tollSummary = useMemo(() => {
    if (!selectedRoute?.route) return {
      totalRON: 0,
      totalEUR: 0,
      bridges: [],
      hasTolls: false,
      vehicleType: vehicleType as TollVehicleType
    };

    const detectedBridges = TollService.detectTollBridges(selectedRoute.route);
    const summary = TollService.getTollSummary(detectedBridges, vehicleType as TollVehicleType);

    if (isRoundTrip) {
      summary.totalRON *= 2;
      summary.totalEUR *= 2;
    }

    return summary;
  }, [selectedRoute, vehicleType, isRoundTrip]);

  if (!routes || routes.length === 0 || !selectedRoute) {
    return null;
  }

  if (isCheckingHealth) {
    return (
      <div className="w-full md:mt-6 md:pt-5 md:border-t md:border-blue-100">
        <div className="px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-800">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const distance = selectedRoute.distance * (isRoundTrip ? 2 : 1);
  const duration = selectedRoute.duration * (isRoundTrip ? 2 : 1);

  // Helper function to safely convert price to number
  const getPriceAsNumber = (price: number | string | undefined): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseFloat(price);
    return 0;
  };

  // Calculate fuel cost based on selected station price (only when API is available)
  const totalFuelConsumption = ((distance * fuelConsumption) / 100).toFixed(1);
  const fuelCost = isApiAvailable && isRomaniaRoute && fuelPriceData?.price && !priceError
    ? (
      parseFloat(totalFuelConsumption) * getPriceAsNumber(fuelPriceData.price)
    ).toFixed(2)
    : null;

  return (
    <div className="w-full md:mt-6 md:pt-5 md:border-t md:border-blue-100">
      <div className="flex items-center gap-2 mb-4 px-4 pt-2 md:px-0 md:pt-0">
        <h3 className="text-lg font-medium text-blue-900">
          {t('routeDetails.title')}
        </h3>
        {isRoundTrip && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-xs font-medium text-blue-700 border border-blue-100">
            {t('routeDetails.roundTripPriceNote')}
          </span>
        )}
      </div>

      {/* Weather Summary UX Hint */}
      {weatherData && (
        <div className="mx-4 md:mx-0 mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl flex items-center gap-3">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <img
              src={weatherData.start.current.condition.icon}
              alt="Weather"
              className="w-6 h-6"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-0.5">
              {t('weather.routeForecast', 'Route Forecast')}
            </p>
            <p className="text-sm text-slate-700 flex items-center gap-2">
              <span>{Math.round(weatherData.start.current.temp_c)}°C</span>
              <span className="text-slate-400">→</span>
              <span>{Math.round(weatherData.end.current.temp_c)}°C</span>
              <span className="text-xs text-slate-500 ml-1">
                ({t(`weather.conditions.${weatherData.end.current.condition.text.replace(/ /g, '_')}`, weatherData.end.current.condition.text)})
              </span>
            </p>
          </div>
          {weatherData.end.alerts && weatherData.end.alerts.length > 0 && (
            <div className="animate-pulse text-red-500 text-xl" title="Severe Weather Alerts">
              ⚠️
            </div>
          )}
        </div>
      )}

      <RouteAlternatives
        routes={routes}
        selectedRouteIndex={selectedRouteIndex}
        onRouteSelected={onRouteSelected}
      />

      {/* Waypoints summary */}
      {waypoints.length > 0 && (
        <div className="mb-4 px-4 md:px-0">
          <p className="text-sm text-slate-800 mb-2">
            {t('routeDetails.waypoints')}
          </p>
          <div className="space-y-2">
            {waypoints.map((waypoint, index) => (
              <div key={waypoint.id} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full mr-2 bg-orange-500"></span>
                <span className="text-slate-900">
                  {t('search.waypoint')} {index + 1}: {waypoint.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Status Warning */}
      {!isApiAvailable && (
        <AlertBanner
          type="warning"
          message={t('routeDetails.fuelPricesUnavailable')}
        />
      )}

      <TollInfo tollSummary={tollSummary} />

      <VehicleSettings />

      <RouteMetrics
        distance={distance}
        duration={duration}
        fuelCost={fuelCost}
        tollSummary={tollSummary}
        onTollModalOpen={onTollModalOpen}
      />

      {/* Save to Favorites */}
      {startLocation && endLocation && startName && endName && (
        <div className="mt-4 px-4 md:px-0">
          {showSaved ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {t('favorites.saved', 'Route saved to favorites!')}
            </div>
          ) : (
            <SaveFavoriteButton
              startName={startName}
              startCoords={startLocation}
              endName={endName}
              endCoords={endLocation}
              waypoints={waypoints}
              onSaved={() => setShowSaved(true)}
            />
          )}
        </div>
      )}

      {/* Desktop footnote */}
      <div className="hidden md:block mt-4 px-2 text-xs text-slate-700">
        <p>{t('routeDetails.estimateNote')}</p>
      </div>
    </div>
  );
};

export default RouteDetails;
