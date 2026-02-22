import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import { useApiHealth } from '../../hooks/useFuelPrice';
import { ApiStatusBanner, InstallPrompt } from '../common';
import { SearchComponent } from '../features/search';
import { MobileRoutePanel, RouteDetails } from '../features/route';
import { MapComponent } from '../features/map';
import { ProjectInfoModal, TermsAndConditionsModal, TollInfoModal } from '../modals';
import { useAppState } from '../../contexts/AppStateContext';
import { useRouteDetails } from '../../contexts/RouteDetailsContext';

interface AppLayoutProps {
  initialStartInput?: string;
  initialEndInput?: string;
}

const AppLayout = ({
  initialStartInput = '',
  initialEndInput = '',
}: AppLayoutProps) => {
  const { t } = useTranslation();
  const { data: isApiHealthy } = useApiHealth();
  const [startName, setStartName] = useState(initialStartInput);
  const [endName, setEndName] = useState(initialEndInput);

  const {
    // Route state
    startLocation,
    endLocation,
    waypoints,
    routes,
    selectedRouteIndex,

    // UI state
    isSidebarOpen,
    setIsSidebarOpen,
    isDetailsExpanded,
    setIsDetailsExpanded,
    isSidebarRight,
    setIsSidebarRight,
    safeAreaBottom,

    // Modal state
    isTermsModalOpen,
    setIsTermsModalOpen,
    isInfoModalOpen,
    setIsInfoModalOpen,
    isTollModalOpen,
    setIsTollModalOpen,
    tollModalData,

    // Computed values
    distance,
    duration,

    // Actions
    handleRouteCalculated,
    handleRouteSelected,
    handleTollModalOpen,
  } = useAppState();

  const { isRoundTrip } = useRouteDetails();

  const activeDistance = distance !== null ? distance * (isRoundTrip ? 2 : 1) : null;
  const activeDuration = duration !== null ? duration * (isRoundTrip ? 2 : 1) : null;

  return (
    <div className="h-screen h-[100dvh] flex flex-col bg-slate-50">
      <Header
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsTermsModalOpen={setIsTermsModalOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
        setIsDetailsExpanded={setIsDetailsExpanded}
        isSidebarRight={isSidebarRight}
        setIsSidebarRight={setIsSidebarRight}
      />

      <ApiStatusBanner isApiHealthy={isApiHealthy} />
      <InstallPrompt />

      <main className={`flex flex-1 overflow-hidden transition-all duration-300 ${isSidebarRight ? 'md:flex-row-reverse' : ''}`}>
        <div
          className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 transition-transform duration-300 absolute md:relative z-10 w-full md:w-80 h-[calc(100%-3.5rem)] md:h-auto bg-white border-r border-blue-100 shadow-lg md:shadow-none flex flex-col overflow-visible ${isSidebarRight ? 'md:border-l md:border-r-0' : 'md:border-r'}`}
        >
          <div className="p-4 flex-1 overflow-y-auto overflow-x-visible">
            <SearchComponent
              onRouteCalculated={(start, end, waypointsList, routesData, selectedIdx) => {
                // Get location names from waypoints if available, otherwise use initial values
                handleRouteCalculated(start, end, waypointsList, routesData, selectedIdx);
              }}
              onLocationNamesChange={(start, end) => {
                setStartName(start);
                setEndName(end);
              }}
              onMobileSubmit={() => {
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
              }}
              initialStartInput={initialStartInput}
              initialEndInput={initialEndInput}
            />
            <div className="hidden md:block">
              {routes && routes.length > 0 && (
                <RouteDetails
                  routes={routes}
                  selectedRouteIndex={selectedRouteIndex}
                  onRouteSelected={handleRouteSelected}
                  waypoints={waypoints}
                  startLocation={startLocation}
                  endLocation={endLocation}
                  startName={startName}
                  endName={endName}
                  onTollModalOpen={handleTollModalOpen}
                />
              )}
            </div>

            <div className="sm:hidden mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsTermsModalOpen(true);
                  setIsSidebarOpen(false);
                }}
                className="w-full text-left text-sm text-blue-700 hover:text-blue-900 transition-colors cursor-pointer py-3 px-2 min-h-[44px] flex items-center"
              >
                {t('terms.button')}
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 p-3 rounded-full text-white min-w-[48px] min-h-[48px] flex items-center justify-center z-20"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 relative">
          <MapComponent
            startLocation={startLocation}
            endLocation={endLocation}
            waypoints={waypoints}
            routes={routes}
            selectedRouteIndex={selectedRouteIndex}
            onRouteSelected={handleRouteSelected}
            isSidebarRight={isSidebarRight}
            weatherData={useAppState().weatherData}
          />

          {!isSidebarOpen && (
            <button
              onClick={() => {
                setIsSidebarOpen(true);
                setIsDetailsExpanded(false);
              }}
              className="md:hidden absolute top-4 left-4 z-10 bg-blue-600 hover:bg-blue-700 shadow-lg p-3 rounded-full text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Open search sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          )}

          {routes && routes.length > 0 && (
            <MobileRoutePanel
              routes={routes}
              selectedRouteIndex={selectedRouteIndex}
              onRouteSelected={handleRouteSelected}
              waypoints={waypoints}
              startLocation={startLocation}
              endLocation={endLocation}
              startName={startName}
              endName={endName}
              isDetailsExpanded={isDetailsExpanded}
              setIsDetailsExpanded={setIsDetailsExpanded}
              setIsSidebarOpen={setIsSidebarOpen}
              safeAreaBottom={safeAreaBottom}
              distance={activeDistance}
              duration={activeDuration}
              onTollModalOpen={handleTollModalOpen}
            />
          )}
        </div>
      </main>

      {isTermsModalOpen && (
        <TermsAndConditionsModal setIsTermsModalOpen={setIsTermsModalOpen} />
      )}

      {isInfoModalOpen && (
        <ProjectInfoModal setIsInfoModalOpen={setIsInfoModalOpen} />
      )}

      {isTollModalOpen && tollModalData && (
        <TollInfoModal
          setIsTollModalOpen={setIsTollModalOpen}
          bridges={tollModalData.bridges}
          totalRON={tollModalData.totalRON}
          totalEUR={tollModalData.totalEUR}
          vehicleType={tollModalData.vehicleType}
        />
      )}
    </div>
  );
};

export default AppLayout;
