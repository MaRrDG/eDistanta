import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { TollService, type VehicleType as TollVehicleType } from '../../../services/tollService';
import { useRouteDetails } from '../../../contexts/RouteDetailsContext';
import RouteAlternatives from './RouteAlternatives';
import VehicleSettings from '../vehicle/VehicleSettings';
import RouteMetrics from './RouteMetrics';
import { AlertBanner } from '../../common';
import { TollInfo } from '../toll';

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
  onTollModalOpen,
}: RouteDetailsProps) => {
  const { t } = useTranslation();
  const { 
    vehicleType, 
    fuelConsumption, 
    fuelPriceData,
    priceError,
    isApiAvailable,
    isCheckingHealth
  } = useRouteDetails();

  if (!routes || routes.length === 0) {
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

  const selectedRoute = routes[selectedRouteIndex];
  const distance = selectedRoute.distance;
  const duration = selectedRoute.duration;

  // Calculate toll bridges for the selected route
  const tollSummary = useMemo(() => {
    if (!selectedRoute?.route) return {
      totalRON: 0,
      totalEUR: 0,
      bridges: [],
      hasTolls: false,
      vehicleType: vehicleType as TollVehicleType
    };

    const detectedBridges = TollService.detectTollBridges(selectedRoute.route);
    return TollService.getTollSummary(detectedBridges, vehicleType as TollVehicleType);
  }, [selectedRoute, vehicleType]);

  // Helper function to safely convert price to number
  const getPriceAsNumber = (price: number | string | undefined): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseFloat(price);
    return 0;
  };

  // Calculate fuel cost based on selected station price (only when API is available)
  const totalFuelConsumption = ((distance * fuelConsumption) / 100).toFixed(1);
  const fuelCost = isApiAvailable && fuelPriceData?.price && !priceError
    ? (
        parseFloat(totalFuelConsumption) * getPriceAsNumber(fuelPriceData.price)
      ).toFixed(2)
    : null;

  return (
    <div className="w-full md:mt-6 md:pt-5 md:border-t md:border-blue-100">
      <h3 className="text-lg font-medium text-blue-900 mb-4 px-4 pt-2 md:px-0 md:pt-0">
        {t('routeDetails.title')}
      </h3>

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

      {/* Desktop footnote */}
      <div className="hidden md:block mt-4 px-2 text-xs text-slate-700">
        <p>{t('routeDetails.estimateNote')}</p>
      </div>
    </div>
  );
};

export default RouteDetails;
