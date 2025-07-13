import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useFuelPrice, useAvailableStations } from '../hooks/useFuelPrice';
import type { FuelStation } from '../services/fuelPriceService';

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
}

// Route colors for alternatives - keep in sync with MapComponent
const ROUTE_COLORS = ['#2563eb', '#9333ea', '#16a34a', '#f59e0b'];

// Fuel types and their CO2 emission factors
const FUEL_TYPES = [
  'benzina-regular',
  'benzina-premium',
  'motorina-regular',
  'motorina-premium',
  'gpl',
] as const;
type FuelType = (typeof FUEL_TYPES)[number];

// Map frontend fuel types to backend fuel types
const FUEL_TYPE_MAP: Record<FuelType, string> = {
  'benzina-regular': 'benzina',
  'benzina-premium': 'benzina',
  'motorina-regular': 'motorina',
  'motorina-premium': 'motorina',
  gpl: 'gpl',
};

/**
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
}: RouteDetailsProps) => {
  const { t } = useTranslation();
  const [fuelConsumption, setFuelConsumption] = useState<number>(() => {
    const savedConsumption = localStorage.getItem('fuelConsumption');
    return savedConsumption ? parseFloat(savedConsumption) : 6.5;
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

  // Fetch available stations
  const { data: availableStations = [], isLoading: isLoadingStations } =
    useAvailableStations();

  // Fetch fuel price for selected station and fuel type
  const { data: fuelPriceData, isLoading: isLoadingPrice } = useFuelPrice(
    selectedStation,
    fuelType
  );

  // Save fuel settings to local storage when they change
  useEffect(() => {
    localStorage.setItem('fuelConsumption', fuelConsumption.toString());
  }, [fuelConsumption]);

  useEffect(() => {
    localStorage.setItem('fuelType', fuelType);
  }, [fuelType]);

  useEffect(() => {
    localStorage.setItem('selectedStation', selectedStation);
  }, [selectedStation]);

  if (!routes || routes.length === 0) {
    return null;
  }

  const selectedRoute = routes[selectedRouteIndex];
  const distance = selectedRoute.distance;
  const duration = selectedRoute.duration;

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

  // Calculate fuel cost based on selected station price
  const fuelCost = fuelPriceData?.price
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

      {/* Fuel consumption and type selectors */}
      <div className="mb-4 px-4 md:px-0">
        <p className="text-sm text-slate-600 mb-2">
          {t('routeDetails.fuelSettings')}
        </p>
        <div className="grid grid-cols-1 gap-3 mb-3">
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
                  : t('routeDetails.selectStation')}
              </option>
              {availableStations.map(station => (
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

          {/* Fuel cost display */}
          {selectedStation && fuelCost && (
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

          {/* Fuel cost display for mobile */}
          {selectedStation && fuelCost && (
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
