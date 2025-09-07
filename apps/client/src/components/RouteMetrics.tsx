import { useTranslation } from 'react-i18next';
import { useRouteDetails } from '../contexts/RouteDetailsContext';

interface RouteMetricsProps {
  distance: number;
  duration: number;
  fuelCost?: string | null;
  tollSummary: {
    totalRON: number;
    totalEUR: number;
    hasTolls: boolean;
  };
  onTollModalOpen?: (tollSummary: any) => void;
}

const calculeazaEmisiiCO2 = (
  consumL_per_100km: number,
  distantaKm: number,
  tipCarburant: string
): number => {
  const factoriEmisii: Record<string, number> = {
    'benzina-regular': 2.31,
    'benzina-premium': 2.31,
    'motorina-regular': 2.68,
    'motorina-premium': 2.68,
    gpl: 1.51,
  };

  const fuelTypeLower = tipCarburant.toLowerCase();
  if (!factoriEmisii.hasOwnProperty(fuelTypeLower)) {
    throw new Error('Tip carburant necunoscut');
  }

  const consumTotalLitri = (consumL_per_100km * distantaKm) / 100;
  const emisiiCO2 = consumTotalLitri * factoriEmisii[fuelTypeLower];

  return emisiiCO2;
};

const RouteMetrics = ({ distance, duration, fuelCost, tollSummary, onTollModalOpen }: RouteMetricsProps) => {
  const { t } = useTranslation();
  const { fuelConsumption, fuelType, fuelPriceData, isApiAvailable, selectedStation } = useRouteDetails();

  const formattedDistance = distance.toFixed(1);
  const totalFuelConsumption = ((distance * fuelConsumption) / 100).toFixed(1);
  
  const hours = Math.floor(duration / 60);
  const minutes = Math.round(duration % 60);
  const formattedDuration =
    hours > 0
      ? `${hours}${t('units.hour')} ${minutes}${t('units.min')}`
      : `${minutes}${t('units.min')}`;

  const co2Emissions = calculeazaEmisiiCO2(
    fuelConsumption,
    distance,
    fuelType
  ).toFixed(1);

  return (
    <>
      {/* Desktop layout */}
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

      {/* Mobile layout */}
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
    </>
  );
};

export default RouteMetrics;
