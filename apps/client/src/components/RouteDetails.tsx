import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';
import { useFuelPrice, useAvailableStations, useApiHealth } from '../hooks/useFuelPrice';
import { TollService, type VehicleType as TollVehicleType } from '../services/tollService';

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

// Route colors for alternatives - keep in sync with MapComponent
const ROUTE_COLORS = ['#2563eb', '#9333ea', '#16a34a', '#f59e0b'];

// Vehicle types
const VEHICLE_TYPES = [
  'car',
  'bus',
  'minibus',
] as const;
type VehicleType = (typeof VEHICLE_TYPES)[number];

// Fuel types and their CO2 emission factors
const FUEL_TYPES = [
  'benzina-regular',
  'benzina-premium',
  'motorina-regular',
  'motorina-premium',
  'gpl',
] as const;
type FuelType = (typeof FUEL_TYPES)[number];

// Default fuel consumption by vehicle type (L/100km)
const DEFAULT_FUEL_CONSUMPTION: Record<VehicleType, number> = {
  car: 6.5,
  minibus: 9.5,
  bus: 25.0,
};

/**3
 * Calculate CO2 emissions based on fuel consumption and type
 * @param consumL_per_100km Fuel consumption in L/100km
 * @param distantaKm Distance in kilometers
 * @param tipCarburant Fuel type (benzina, motorina, gpl, cng)
 * @returns CO2 emissions in kg
 */
function calculeazaEmisiiCO2(
  consumL_per_100km: number,
  distantaKm: number,
  tipCarburant: string
): number {
  // Factori de emisii CO2 (kg CO2 / litru)
  const factoriEmisii: Record<string, number> = {
    'benzina-regular': 2.31,
    'benzina-premium': 2.31,
    'motorina-regular': 2.68,
    'motorina-premium': 2.68,
    gpl: 1.51,
  };

  // Verificăm dacă tipul carburantului este valid
  const fuelTypeLower = tipCarburant.toLowerCase();
  if (!factoriEmisii.hasOwnProperty(fuelTypeLower)) {
    throw new Error('Tip carburant necunoscut');
  }

  // Calculăm cantitatea de carburant consumată
  const consumTotalLitri = (consumL_per_100km * distantaKm) / 100;

  // Calculăm emisiile
  const emisiiCO2 = consumTotalLitri * factoriEmisii[fuelTypeLower];

  return emisiiCO2; // kg CO2
}

// Helper function to safely convert price to number
const getPriceAsNumber = (price: number | string | undefined): number => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price);
  return 0;
};

const RouteDetails = ({
  routes,
  selectedRouteIndex,
  onRouteSelected,
  waypoints = [],
  onTollModalOpen,
}: RouteDetailsProps) => {
  const { t } = useTranslation();
  
  const [vehicleType, setVehicleType] = useState<VehicleType>(() => {
    const savedVehicleType = localStorage.getItem('vehicleType') as VehicleType;
    return VEHICLE_TYPES.includes(savedVehicleType)
      ? savedVehicleType
      : 'car';
  });

  const [fuelConsumption, setFuelConsumption] = useState<number>(() => {
    const savedConsumption = localStorage.getItem('fuelConsumption');
    const savedVehicleType = localStorage.getItem('vehicleType') as VehicleType;
    const defaultForVehicle = VEHICLE_TYPES.includes(savedVehicleType) 
      ? DEFAULT_FUEL_CONSUMPTION[savedVehicleType]
      : DEFAULT_FUEL_CONSUMPTION.car;
    return savedConsumption ? parseFloat(savedConsumption) : defaultForVehicle;
  });
  
  const [fuelType, setFuelType] = useState<FuelType>(() => {
    const savedFuelType = localStorage.getItem('fuelType') as FuelType;
    return FUEL_TYPES.includes(savedFuelType)
      ? savedFuelType
      : 'benzina-regular';
  });

  const [selectedStation, setSelectedStation] = useState<string>(() => {
    return localStorage.getItem('selectedStation') || '';
  });



  // Check API health
  const { data: isApiHealthy, isLoading: isCheckingHealth, error: healthError } = useApiHealth();

  // Fetch available stations
  const { 
    data: availableStations = [], 
    isLoading: isLoadingStations, 
    error: stationsError 
  } = useAvailableStations();

  // Fetch fuel price for selected station and fuel type
  const { 
    data: fuelPriceData, 
    isLoading: isLoadingPrice, 
    error: priceError 
  } = useFuelPrice(selectedStation, fuelType);

  // Save settings to local storage when they change
  useEffect(() => {
    localStorage.setItem('vehicleType', vehicleType);
  }, [vehicleType]);

  useEffect(() => {
    localStorage.setItem('fuelConsumption', fuelConsumption.toString());
  }, [fuelConsumption]);

  useEffect(() => {
    localStorage.setItem('fuelType', fuelType);
  }, [fuelType]);

  useEffect(() => {
    localStorage.setItem('selectedStation', selectedStation);
  }, [selectedStation]);

  // Update fuel consumption when vehicle type changes (if user hasn't customized it)
  useEffect(() => {
    const savedConsumption = localStorage.getItem('fuelConsumption');
    if (!savedConsumption) {
      setFuelConsumption(DEFAULT_FUEL_CONSUMPTION[vehicleType]);
    }
  }, [vehicleType]);

  if (!routes || routes.length === 0) {
    return null;
  }

  // API Error States
  if (isCheckingHealth) {
    return (
      <div className="w-full md:mt-6 md:pt-5 md:border-t md:border-blue-100">
        <div className="px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Check if API is available for fuel pricing features
  const isApiAvailable = isApiHealthy !== false && !healthError;

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

  // Round distance to 1 decimal place
  const formattedDistance = distance.toFixed(1);

  // Calculate fuel consumption based on user input
  const totalFuelConsumption = ((distance * fuelConsumption) / 100).toFixed(1);

  // Format duration in hours and minutes
  const hours = Math.floor(duration / 60);
  const minutes = Math.round(duration % 60);
  const formattedDuration =
    hours > 0
      ? `${hours}${t('units.hour')} ${minutes}${t('units.min')}`
      : `${minutes}${t('units.min')}`;

  // Calculate estimated CO2 emissions using our function
  const co2Emissions = calculeazaEmisiiCO2(
    fuelConsumption,
    distance,
    fuelType
  ).toFixed(1);

  // Calculate fuel cost based on selected station price (only when API is available)
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

      {/* Route alternatives selector */}
      {routes.length > 1 && (
        <div className="mb-4 px-4 md:px-0">
          <p className="text-sm text-slate-600 mb-2">
            {t('routeDetails.alternatives')}
          </p>
          <div className="flex flex-wrap gap-2">
            {routes.map((route, index) => {
              const routeHours = Math.floor(route.duration / 60);
              const routeMinutes = Math.round(route.duration % 60);
              const routeDuration =
                routeHours > 0
                  ? `${routeHours}${t('units.hour')} ${routeMinutes}${t('units.min')}`
                  : `${routeMinutes}${t('units.min')}`;

              return (
                <button
                  key={index}
                  onClick={() => onRouteSelected(index)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm ${
                    selectedRouteIndex === index
                      ? 'bg-slate-100 border border-slate-300'
                      : 'bg-white border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor:
                        ROUTE_COLORS[index % ROUTE_COLORS.length],
                    }}
                  ></span>
                  <span className="font-medium">
                    {t('routeDetails.route')} {index + 1}
                  </span>
                  <span className="mx-1.5 text-slate-400">•</span>
                  <span className="text-slate-600">{routeDuration}</span>
                  <span className="mx-1.5 text-slate-400">•</span>
                  <span className="text-slate-600">
                    {route.distance.toFixed(1)} {t('units.km')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Waypoints summary */}
      {waypoints.length > 0 && (
        <div className="mb-4 px-4 md:px-0">
          <p className="text-sm text-slate-600 mb-2">
            {t('routeDetails.waypoints')}
          </p>
          <div className="space-y-2">
            {waypoints.map((waypoint, index) => (
              <div key={waypoint.id} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full mr-2 bg-orange-500"></span>
                <span className="text-slate-700">
                  {t('search.waypoint')} {index + 1}: {waypoint.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Status Warning */}
      {!isApiAvailable && (
        <div className="mb-4 px-4 md:px-0">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                <svg
                  className="w-4 h-4 text-yellow-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-yellow-800 text-sm">
                {t('routeDetails.fuelPricesUnavailable')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bridge tolls information */}
      {tollSummary.hasTolls && (
        <div className="mb-4 px-4 md:px-0">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mr-2 mt-0.5">
                <svg
                  className="w-4 h-4 text-orange-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-orange-800 text-sm font-medium mb-2">
                  {t('routeDetails.tollBridgesDetected')}
                </p>
                <div className="space-y-1">
                  {tollSummary.bridges.map((bridge) => (
                    <div key={bridge.id} className="text-xs text-orange-700">
                      <span className="font-medium">{bridge.nameRo}</span>
                      <span className="text-orange-600 ml-2">
                        {bridge.tollRON > 0 ? `${bridge.tollRON} RON` : `${bridge.tollEUR} EUR`}
                      </span>
                      {bridge.crossesBorder && (
                        <span className="text-orange-500 ml-1">
                          ({t('routeDetails.internationalBridge')})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fuel consumption and type selectors - only show if API is available */}
      {isApiAvailable && (
        <div className="mb-4 px-4 md:px-0">
          <p className="text-sm text-slate-600 mb-2">
            {t('routeDetails.vehicleSettings')}
          </p>
          <div className="grid grid-cols-1 gap-3 mb-3">
            <div>
              <label
                htmlFor="vehicleType"
                className="block text-xs text-slate-500 mb-1 min-h-[1.25rem]"
              >
                {t('routeDetails.vehicleType')}
              </label>
              <select
                id="vehicleType"
                value={vehicleType}
                onChange={e => {
                  const selectedValue = e.target.value;
                  if (VEHICLE_TYPES.includes(selectedValue as VehicleType)) {
                    setVehicleType(selectedValue as VehicleType);
                    // Update fuel consumption to default for new vehicle type
                    setFuelConsumption(DEFAULT_FUEL_CONSUMPTION[selectedValue as VehicleType]);
                  }
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              >
                {VEHICLE_TYPES.map(type => (
                  <option key={type} value={type}>
                    {t(`vehicleTypes.${type}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="fuelStation"
                className="block text-xs text-slate-500 mb-1 min-h-[1.25rem]"
              >
                {t('routeDetails.fuelStation')}
              </label>
              <select
                id="fuelStation"
                value={selectedStation}
                onChange={e => setSelectedStation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm capitalize"
                disabled={isLoadingStations}
              >
                <option value="">
                  {isLoadingStations
                    ? t('common.loading')
                    : stationsError
                      ? t('routeDetails.stationsError')
                      : t('routeDetails.selectStation')}
                </option>
                {!stationsError && availableStations.map(station => (
                  <option
                    className="capitalize"
                    key={station.stationName}
                    value={station.stationName}
                  >
                    {station.stationName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="fuelType"
                className="block text-xs text-slate-500 mb-1 min-h-[1.25rem]"
              >
                {t('routeDetails.fuelType')}
              </label>
              <select
                id="fuelType"
                value={fuelType}
                onChange={e => {
                  // Validate that the selected value is a valid fuel type
                  const selectedValue = e.target.value;
                  if (FUEL_TYPES.includes(selectedValue as FuelType)) {
                    setFuelType(selectedValue as FuelType);
                  }
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              >
                {FUEL_TYPES.map(type => (
                  <option key={type} value={type}>
                    {t(`fuelTypes.${type}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="fuelConsumption"
                className="block text-xs text-slate-500 mb-1 min-h-[1.25rem]"
              >
                {t('routeDetails.consumption')}{' '}
                <span className="text-[9px]">(L/100km)</span>
              </label>
              <input
                id="fuelConsumption"
                type="number"
                min="1"
                max="30"
                step="0.1"
                value={fuelConsumption}
                onChange={e => setFuelConsumption(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Fuel price display */}
          {selectedStation && (
            <div className="mt-3 p-3 bg-blue-50 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  {t('routeDetails.currentPrice')} ({t(`fuelTypes.${fuelType}`)}):
                </span>
                <span className="text-sm font-medium text-slate-900">
                  {isLoadingPrice
                    ? t('common.loading')
                    : priceError
                      ? t('routeDetails.priceError')
                      : fuelPriceData?.price
                        ? `${getPriceAsNumber(fuelPriceData.price).toFixed(2)} ${fuelPriceData.currency}/L`
                        : t('routeDetails.priceNotAvailable')}
                </span>
              </div>
              {fuelPriceData?.scrapedAt && (
                <div className="text-xs text-slate-500 mt-1">
                  {t('routeDetails.lastUpdated')}:{' '}
                  {new Date(fuelPriceData.scrapedAt).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Basic vehicle and fuel consumption settings when API is unavailable */}
      {!isApiAvailable && (
        <div className="mb-4 px-4 md:px-0">
          <p className="text-sm text-slate-600 mb-2">
            {t('routeDetails.basicVehicleSettings')}
          </p>
          <div className="grid grid-cols-1 gap-3 mb-3">
            <div>
              <label
                htmlFor="vehicleTypeBasic"
                className="block text-xs text-slate-500 mb-1 min-h-[1.25rem]"
              >
                {t('routeDetails.vehicleType')}
              </label>
              <select
                id="vehicleTypeBasic"
                value={vehicleType}
                onChange={e => {
                  const selectedValue = e.target.value;
                  if (VEHICLE_TYPES.includes(selectedValue as VehicleType)) {
                    setVehicleType(selectedValue as VehicleType);
                    // Update fuel consumption to default for new vehicle type
                    setFuelConsumption(DEFAULT_FUEL_CONSUMPTION[selectedValue as VehicleType]);
                  }
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              >
                {VEHICLE_TYPES.map(type => (
                  <option key={type} value={type}>
                    {t(`vehicleTypes.${type}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="fuelTypeBasic"
                className="block text-xs text-slate-500 mb-1 min-h-[1.25rem]"
              >
                {t('routeDetails.fuelType')}
              </label>
              <select
                id="fuelTypeBasic"
                value={fuelType}
                onChange={e => {
                  const selectedValue = e.target.value;
                  if (FUEL_TYPES.includes(selectedValue as FuelType)) {
                    setFuelType(selectedValue as FuelType);
                  }
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              >
                {FUEL_TYPES.map(type => (
                  <option key={type} value={type}>
                    {t(`fuelTypes.${type}`)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="fuelConsumptionBasic"
                className="block text-xs text-slate-500 mb-1 min-h-[1.25rem]"
              >
                {t('routeDetails.consumption')}{' '}
                <span className="text-[9px]">(L/100km)</span>
              </label>
              <input
                id="fuelConsumptionBasic"
                type="number"
                min="1"
                max="30"
                step="0.1"
                value={fuelConsumption}
                onChange={e => setFuelConsumption(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop layout - vertical stack */}
      <div className="hidden md:block bg-white rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-blue-50">
          <div className="flex items-center p-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-blue-600"
              >
                <path
                  fillRule="evenodd"
                  d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">
                {t('routeDetails.distance')}
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {formattedDistance} {t('units.km')}
              </p>
            </div>
          </div>

          <div className="flex items-center p-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-blue-600"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">
                {t('routeDetails.estimatedTime')}
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {formattedDuration}
              </p>
            </div>
          </div>

          {/* Fuel cost display - only show when API is available and price is loaded */}
          {isApiAvailable && selectedStation && fuelCost && (
            <div className="flex items-center p-3.5">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-blue-600"
                >
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9H21ZM12 7C14.8 7 17 9.2 17 12S14.8 17 12 17S7 14.8 7 12S9.2 7 12 7ZM12 9C10.3 9 9 10.3 9 12S10.3 15 12 15S15 13.7 15 12S13.7 9 12 9Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">
                  {t('routeDetails.fuelCost')}
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {fuelCost} {fuelPriceData?.currency || 'RON'}
                </p>
              </div>
            </div>
          )}

          {/* Bridge tolls display - show when tolls are detected */}
          {tollSummary.hasTolls && (
            <button
              onClick={() => onTollModalOpen?.(tollSummary)}
              className="flex items-center p-3.5 w-full hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-blue-600"
                >
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2ZM8 21V19H16V21H8Z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-slate-500">
                  {t('routeDetails.bridgeTolls')}
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {tollSummary.totalRON} RON
                  {tollSummary.totalEUR > 0 && (
                    <span className="text-sm text-slate-600 ml-1">
                      (~{tollSummary.totalEUR} EUR)
                    </span>
                  )}
                </p>
              </div>
              <div className="ml-2">
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          )}

          <div className="flex items-center p-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-blue-600"
              >
                <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
                <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">
                {t('routeDetails.fuelConsumption')}
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {totalFuelConsumption} {t('units.liters')}
              </p>
            </div>
          </div>

          <div className="flex items-center p-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-blue-600"
              >
                <path
                  fillRule="evenodd"
                  d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">
                {t('routeDetails.co2Emissions')}
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {co2Emissions} {t('units.kg')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout - horizontal cards */}
      <div className="md:hidden px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5 text-blue-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-xs text-slate-500">
                {t('routeDetails.estimatedTime')}
              </p>
            </div>
            <p className="text-base font-semibold text-slate-900">
              {formattedDuration}
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5 text-blue-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-xs text-slate-500">
                {t('routeDetails.distance')}
              </p>
            </div>
            <p className="text-base font-semibold text-slate-900">
              {formattedDistance} {t('units.km')}
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5 text-blue-600"
                >
                  <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
                  <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                  <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                </svg>
              </div>
              <p className="text-xs text-slate-500">{t('routeDetails.fuel')}</p>
            </div>
            <p className="text-base font-semibold text-slate-900">
              {totalFuelConsumption} {t('units.liters')}
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5 text-blue-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
                  />
                </svg>
              </div>
              <p className="text-xs text-slate-500">{t('routeDetails.co2')}</p>
            </div>
            <p className="text-base font-semibold text-slate-900">
              {co2Emissions} {t('units.kg')}
            </p>
          </div>

          {/* Fuel cost display for mobile - only show when API is available */}
          {isApiAvailable && selectedStation && fuelCost && (
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center mb-1">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3.5 h-3.5 text-blue-600"
                  >
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9H21ZM12 7C14.8 7 17 9.2 17 12S14.8 17 12 17S7 14.8 7 12S9.2 7 12 7ZM12 9C10.3 9 9 10.3 9 12S10.3 15 12 15S15 13.7 15 12S13.7 9 12 9Z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-500">
                  {t('routeDetails.cost')}
                </p>
              </div>
              <p className="text-base font-semibold text-slate-900">
                {fuelCost} {fuelPriceData?.currency || 'RON'}
              </p>
            </div>
          )}

          {/* Bridge tolls display for mobile - show when tolls are detected */}
          {tollSummary.hasTolls && (
            <button
              onClick={() => onTollModalOpen?.(tollSummary)}
              className="bg-white rounded-lg p-3 shadow-sm w-full hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center mb-1">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3.5 h-3.5 text-blue-600"
                  >
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2ZM8 21V19H16V21H8Z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-500">
                  {t('routeDetails.tolls')}
                </p>
                <div className="ml-auto">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <p className="text-base font-semibold text-slate-900 text-left">
                {tollSummary.totalRON} RON
              </p>
            </button>
          )}
        </div>

        <div className="mt-3 text-xs text-slate-500 text-center">
          <p>{t('routeDetails.estimateNote')}</p>
        </div>
      </div>

      {/* Desktop footnote */}
      <div className="hidden md:block mt-4 px-2 text-xs text-slate-500">
        <p>{t('routeDetails.estimateNote')}</p>
      </div>


    </div>
  );
};

export default RouteDetails;
