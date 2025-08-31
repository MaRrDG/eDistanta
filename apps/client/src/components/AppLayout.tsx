import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MapComponent from './MapComponent';
import SearchComponent from './SearchComponent';
import RouteDetails from './RouteDetails';
import TermsAndConditionsModal from './TermsAndConditionsModal';
import ProjectInfoModal from './ProjectInfoModal';
import Header from './Header';
import ApiStatusBanner from './ApiStatusBanner';
import MobileRoutePanel from './MobileRoutePanel';
import { useApiHealth } from '../hooks/useFuelPrice';
import type { AppLayoutProps } from '../types/route';

const AppLayout = ({
  startLocation,
  endLocation,
  waypoints,
  routes,
  selectedRouteIndex,
  isSidebarOpen,
  setIsSidebarOpen,
  isDetailsExpanded,
  setIsDetailsExpanded,
  safeAreaBottom,
  setSafeAreaBottom,
  onRouteCalculated,
  onRouteSelected,
  distance,
  duration,
  initialStartInput = '',
  initialEndInput = '',
  initialStartLocation = null,
  initialEndLocation = null
}: AppLayoutProps) => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { t } = useTranslation();

  const { data: isApiHealthy } = useApiHealth();

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      setSafeAreaBottom(0);

      const isSamsungBrowser = /SamsungBrowser/i.test(navigator.userAgent);
      if (isSamsungBrowser) {
        setSafeAreaBottom(16);
      }

      const handleResize = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.clientHeight;

        if (windowHeight - documentHeight > 30 && isSamsungBrowser) {
          setSafeAreaBottom(windowHeight - documentHeight + 16);
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [setSafeAreaBottom]);

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <Header
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsTermsModalOpen={setIsTermsModalOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
        setIsDetailsExpanded={setIsDetailsExpanded}
      />

      <ApiStatusBanner isApiHealthy={isApiHealthy} />

      <main className="flex flex-1 overflow-hidden">
        <div
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 absolute md:relative z-10 w-full md:w-80 h-[calc(100%-3.5rem)] md:h-auto bg-white border-r border-blue-100 shadow-lg md:shadow-none flex flex-col overflow-visible`}
        >
          <div className="p-4 flex-1 overflow-y-auto overflow-x-visible">
            <SearchComponent
              onRouteCalculated={onRouteCalculated}
              onMobileSubmit={() => {
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
              }}
              initialStartInput={initialStartInput}
              initialEndInput={initialEndInput}
              initialStartLocation={initialStartLocation}
              initialEndLocation={initialEndLocation}
            />
            <div className="hidden md:block">
              {routes && routes.length > 0 && (
                <RouteDetails
                  routes={routes}
                  selectedRouteIndex={selectedRouteIndex}
                  onRouteSelected={onRouteSelected}
                  waypoints={waypoints}
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
            className="md:hidden absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 p-3 rounded-full text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
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
            onRouteSelected={onRouteSelected}
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
              onRouteSelected={onRouteSelected}
              waypoints={waypoints}
              isDetailsExpanded={isDetailsExpanded}
              setIsDetailsExpanded={setIsDetailsExpanded}
              setIsSidebarOpen={setIsSidebarOpen}
              safeAreaBottom={safeAreaBottom}
              distance={distance}
              duration={duration}
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
    </div>
  );
};

export default AppLayout;
