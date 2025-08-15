import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MapComponent from './components/MapComponent';
import SearchComponent from './components/SearchComponent';
import RouteDetails from './components/RouteDetails';
import TermsAndConditionsModal from './components/TermsAndConditionsModal';
import ProjectInfoModal from './components/ProjectInfoModal';
import Header from './components/Header';

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

function App() {
  const [startLocation, setStartLocation] = useState<[number, number] | null>(
    null
  );
  const [endLocation, setEndLocation] = useState<[number, number] | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [routes, setRoutes] = useState<RouteData[] | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);
  const { t } = useTranslation();

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
  }, []);

  const handleRouteCalculated = (
    start: [number, number],
    end: [number, number],
    waypointsList: Waypoint[],
    routesData: RouteData[],
    initialRouteIndex: number
  ) => {
    setStartLocation(start);
    setEndLocation(end);
    setWaypoints(waypointsList);
    setRoutes(routesData);
    setSelectedRouteIndex(initialRouteIndex);
    setIsDetailsExpanded(true);
  };

  const handleRouteSelected = (index: number) => {
    setSelectedRouteIndex(index);
  };

  // Get current route details for mobile display
  const currentRoute =
    routes && routes.length > 0 ? routes[selectedRouteIndex] : null;
  const distance = currentRoute ? currentRoute.distance : null;
  const duration = currentRoute ? currentRoute.duration : null;

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <Header
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsTermsModalOpen={setIsTermsModalOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
        setIsDetailsExpanded={setIsDetailsExpanded}
      />

      <main className="flex flex-1 overflow-hidden">
        <div
          className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 absolute md:relative z-10 w-80 h-[calc(100%-3.5rem)] md:h-auto bg-white border-r border-blue-100 shadow-lg md:shadow-none flex flex-col overflow-visible`}
        >
          <div className="p-4 flex-1 overflow-y-auto overflow-x-visible">
            <SearchComponent
              onRouteCalculated={handleRouteCalculated}
              onMobileSubmit={() => {
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
              }}
            />
            <div className="hidden md:block">
              {routes && routes.length > 0 && (
                <RouteDetails
                  routes={routes}
                  selectedRouteIndex={selectedRouteIndex}
                  onRouteSelected={handleRouteSelected}
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
                className="w-full text-left text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                {t('terms.button')}
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden absolute top-2 right-2 bg-blue-50 hover:bg-blue-100 p-1 rounded-full text-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
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
          />

          {!isSidebarOpen && (
            <button
              onClick={() => {
                setIsSidebarOpen(true);
                setIsDetailsExpanded(false);
              }}
              className="md:hidden absolute top-4 left-4 z-10 bg-white shadow-lg p-3 rounded-full text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
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
            <div
              className={`md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg transition-transform duration-300 z-10 ${isDetailsExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'}`}
              style={{ paddingBottom: `${safeAreaBottom}px` }}
            >
              <div
                className="flex justify-between items-center px-4 py-2 border-b border-blue-100 cursor-pointer"
                onClick={() => {
                  const isExpanded = !isDetailsExpanded;
                  setIsDetailsExpanded(isExpanded);

                  if (isExpanded) {
                    setIsSidebarOpen(false);
                  }
                }}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5 text-blue-600"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <span className="font-medium text-blue-800">
                    {t('routeDetails.title')}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-blue-600 mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {Math.floor(duration! / 60)}
                      {t('units.hour')} {Math.round(duration! % 60)}
                      {t('units.min')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-blue-600 mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {distance!.toFixed(1)} {t('units.km')}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-5 h-5 text-blue-600 transform transition-transform ${isDetailsExpanded ? 'rotate-180' : ''}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                <RouteDetails
                  routes={routes}
                  selectedRouteIndex={selectedRouteIndex}
                  onRouteSelected={handleRouteSelected}
                  waypoints={waypoints}
                />
              </div>
            </div>
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
}

export default App;
