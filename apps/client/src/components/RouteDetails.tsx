import { useTranslation } from 'react-i18next';

interface RouteDetailsProps {
  distance: number | null;
  duration: number | null;
}

const RouteDetails = ({ distance, duration }: RouteDetailsProps) => {
  const { t } = useTranslation();

  if (!distance || !duration) {
    return null;
  }

  // Round distance to 1 decimal place
  const formattedDistance = distance.toFixed(1);
  
  // Calculate fuel consumption (assuming 6.5L/100km)
  const fuelConsumption = (distance * 6.5 / 100).toFixed(1);
  
  // Format duration in hours and minutes
  const hours = Math.floor(duration / 60);
  const minutes = Math.round(duration % 60);
  const formattedDuration = hours > 0 
    ? `${hours}${t('units.hour')} ${minutes}${t('units.min')}` 
    : `${minutes}${t('units.min')}`;
    
  // Calculate estimated CO2 emissions (average 120g/km)
  const co2Emissions = (distance * 0.12).toFixed(1);
  
  // Calculate estimated toll costs (very rough estimate for Romania)
  const estimatedTollCost = Math.ceil(distance * 0.05);

  return (
    <div className="w-full md:mt-6 md:pt-5 md:border-t md:border-blue-100">
      <h3 className="text-lg font-medium text-blue-900 mb-4 px-4 pt-2 md:px-0 md:pt-0">{t('routeDetails.title')}</h3>
      
      {/* Desktop layout - vertical stack */}
      <div className="hidden md:block bg-white rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-blue-50">
          <div className="flex items-center p-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('routeDetails.distance')}</p>
              <p className="text-lg font-semibold text-slate-900">{formattedDistance} {t('units.km')}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('routeDetails.estimatedTime')}</p>
              <p className="text-lg font-semibold text-slate-900">{formattedDuration}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
                <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('routeDetails.fuelConsumption')}</p>
              <p className="text-lg font-semibold text-slate-900">{fuelConsumption} {t('units.liters')}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                <path fillRule="evenodd" d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('routeDetails.co2Emissions')}</p>
              <p className="text-lg font-semibold text-slate-900">{co2Emissions} {t('units.kg')}</p>
            </div>
          </div>
          
          <div className="flex items-center p-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
                <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('routeDetails.estimatedTollCost')}</p>
              <p className="text-lg font-semibold text-slate-900">{estimatedTollCost} {t('units.currency')}</p>
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-blue-600">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs text-slate-500">{t('routeDetails.estimatedTime')}</p>
            </div>
            <p className="text-base font-semibold text-slate-900">{formattedDuration}</p>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-blue-600">
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs text-slate-500">{t('routeDetails.distance')}</p>
            </div>
            <p className="text-base font-semibold text-slate-900">{formattedDistance} {t('units.km')}</p>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-blue-600">
                  <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
                  <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                  <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                </svg>
              </div>
              <p className="text-xs text-slate-500">{t('routeDetails.fuel')}</p>
            </div>
            <p className="text-base font-semibold text-slate-900">{fuelConsumption} {t('units.liters')}</p>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-blue-600">
                  <path fillRule="evenodd" d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z" />
                </svg>
              </div>
              <p className="text-xs text-slate-500">{t('routeDetails.co2')}</p>
            </div>
            <p className="text-base font-semibold text-slate-900">{co2Emissions} {t('units.kg')}</p>
          </div>
          
          <div className="bg-white rounded-lg p-3 shadow-sm col-span-2">
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-blue-600">
                  <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                  <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                  <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                </svg>
              </div>
              <p className="text-xs text-slate-500">{t('routeDetails.estimatedTollCost')}</p>
            </div>
            <p className="text-base font-semibold text-slate-900">{estimatedTollCost} {t('units.currency')}</p>
          </div>
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