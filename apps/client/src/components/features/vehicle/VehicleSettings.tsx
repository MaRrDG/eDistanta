import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteDetails, VEHICLE_TYPES, FUEL_TYPES, DEFAULT_FUEL_CONSUMPTION } from '../../../contexts/RouteDetailsContext';
import PriceHistoryModal from '../../modals/PriceHistoryModal';

const getPriceAsNumber = (price: number | string | undefined): number => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price);
  return 0;
};

const VehicleSettings = () => {
  const { t } = useTranslation();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const {
    vehicleType,
    setVehicleType,
    fuelConsumption,
    setFuelConsumption,
    fuelType,
    setFuelType,
    selectedStation,
    setSelectedStation,
    isApiAvailable,
    availableStations,
    isLoadingStations,
    stationsError,
    fuelPriceData,
    isLoadingPrice,
    priceError,
  } = useRouteDetails();

  const handleVehicleTypeChange = (selectedValue: string) => {
    if (VEHICLE_TYPES.includes(selectedValue as typeof VEHICLE_TYPES[number])) {
      const vehicleType = selectedValue as typeof VEHICLE_TYPES[number];
      setVehicleType(vehicleType);
      setFuelConsumption(DEFAULT_FUEL_CONSUMPTION[vehicleType]);
    }
  };

  const handleFuelTypeChange = (selectedValue: string) => {
    if (FUEL_TYPES.includes(selectedValue as typeof FUEL_TYPES[number])) {
      setFuelType(selectedValue as typeof FUEL_TYPES[number]);
    }
  };

  if (!isApiAvailable) {
    return (
      <div className="mb-4 px-4 md:px-0">
        <p className="text-sm text-slate-800 mb-2">
          {t('routeDetails.basicVehicleSettings')}
        </p>
        <div className="grid grid-cols-1 gap-3 mb-3">
          <div>
            <label
              htmlFor="vehicleTypeBasic"
              className="block text-xs text-slate-700 mb-1 min-h-[1.25rem]"
            >
              {t('routeDetails.vehicleType')}
            </label>
            <select
              id="vehicleTypeBasic"
              value={vehicleType}
              onChange={e => handleVehicleTypeChange(e.target.value)}
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
              className="block text-xs text-slate-700 mb-1 min-h-[1.25rem]"
            >
              {t('routeDetails.fuelType')}
            </label>
            <select
              id="fuelTypeBasic"
              value={fuelType}
              onChange={e => handleFuelTypeChange(e.target.value)}
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
              className="block text-xs text-slate-700 mb-1 min-h-[1.25rem]"
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
    );
  }

  return (
    <div className="mb-4 px-4 md:px-0">
      <p className="text-sm text-slate-800 mb-2">
        {t('routeDetails.vehicleSettings')}
      </p>
      <div className="grid grid-cols-1 gap-3 mb-3">
        <div>
          <label
            htmlFor="vehicleType"
            className="block text-xs text-slate-700 mb-1 min-h-[1.25rem]"
          >
            {t('routeDetails.vehicleType')}
          </label>
          <select
            id="vehicleType"
            value={vehicleType}
            onChange={e => handleVehicleTypeChange(e.target.value)}
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
            className="block text-xs text-slate-700 mb-1 min-h-[1.25rem]"
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
            className="block text-xs text-slate-700 mb-1 min-h-[1.25rem]"
          >
            {t('routeDetails.fuelType')}
          </label>
          <select
            id="fuelType"
            value={fuelType}
            onChange={e => handleFuelTypeChange(e.target.value)}
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
            className="block text-xs text-slate-700 mb-1 min-h-[1.25rem]"
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

      {selectedStation && (
        <div className="mt-3 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-800">
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
            <div className="text-xs text-slate-700 mt-1">
              {t('routeDetails.lastUpdated')}:{' '}
              {new Date(fuelPriceData.scrapedAt).toLocaleString()}
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-blue-200 flex justify-end">
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 transition-colors px-2 py-1 hover:bg-blue-100 rounded cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              {t('routeDetails.viewHistory', 'View Price History')}
            </button>
          </div>
        </div>
      )}

      {selectedStation && (
        <PriceHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          stationName={selectedStation}
          fuelType={fuelType}
        />
      )}
    </div>
  );
};

export default VehicleSettings;
