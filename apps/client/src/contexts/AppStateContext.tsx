import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { RouteData, Waypoint } from '../types/route';
import type { RouteWeather } from '../types/weather';
import { RouteService } from '../services/routeService';
import { WeatherService } from '../services/weatherService';

interface AppStateContextType {
  // Route state
  startLocation: [number, number] | null;
  setStartLocation: (location: [number, number] | null) => void;
  endLocation: [number, number] | null;
  setEndLocation: (location: [number, number] | null) => void;
  waypoints: Waypoint[];
  setWaypoints: (waypoints: Waypoint[]) => void;
  routes: RouteData[] | null;
  setRoutes: (routes: RouteData[] | null) => void;
  selectedRouteIndex: number;
  setSelectedRouteIndex: (index: number) => void;

  // Weather state
  weatherData: RouteWeather | null;
  isLoadingWeather: boolean;

  // UI state
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isDetailsExpanded: boolean;
  setIsDetailsExpanded: (expanded: boolean) => void;
  isSidebarRight: boolean;
  setIsSidebarRight: (isRight: boolean) => void;
  safeAreaBottom: number;
  setSafeAreaBottom: (bottom: number) => void;

  // Modal state
  isTermsModalOpen: boolean;
  setIsTermsModalOpen: (open: boolean) => void;
  isInfoModalOpen: boolean;
  setIsInfoModalOpen: (open: boolean) => void;
  isTollModalOpen: boolean;
  setIsTollModalOpen: (open: boolean) => void;
  tollModalData: {
    bridges: any[];
    totalRON: number;
    totalEUR: number;
    vehicleType: 'car' | 'bus' | 'minibus';
  } | null;
  setTollModalData: (data: any) => void;

  // Computed values
  currentRoute: RouteData | null;
  distance: number | null;
  duration: number | null;

  // Actions
  handleRouteCalculated: (
    start: [number, number],
    end: [number, number],
    waypointsList: Waypoint[],
    routesData: RouteData[],
    initialRouteIndex: number
  ) => void;
  handleRouteSelected: (index: number) => void;
  handleTollModalOpen: (tollSummary: any) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

interface AppStateProviderProps {
  children: ReactNode;
  // Optional initial values for route pages
  initialStartInput?: string;
  initialEndInput?: string;
  initialStartLocation?: [number, number] | null;
  initialEndLocation?: [number, number] | null;
}

export const AppStateProvider = ({
  children,
  initialStartInput = '',
  initialEndInput = '',
  initialStartLocation = null,
  initialEndLocation = null
}: AppStateProviderProps) => {
  // Route state
  const [startLocation, setStartLocation] = useState<[number, number] | null>(initialStartLocation);
  const [endLocation, setEndLocation] = useState<[number, number] | null>(initialEndLocation);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [routes, setRoutes] = useState<RouteData[] | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);

  // Weather state
  const [weatherData, setWeatherData] = useState<RouteWeather | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isSidebarRight, setIsSidebarRightState] = useState(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarPosition');
      return saved === 'right';
    }
    return false;
  });
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);

  const setIsSidebarRight = (isRight: boolean) => {
    setIsSidebarRightState(isRight);
    localStorage.setItem('sidebarPosition', isRight ? 'right' : 'left');
  };

  // Modal state
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isTollModalOpen, setIsTollModalOpen] = useState(false);
  const [tollModalData, setTollModalData] = useState<{
    bridges: any[];
    totalRON: number;
    totalEUR: number;
    vehicleType: 'car' | 'bus' | 'minibus';
  } | null>(null);

  // Computed values
  const currentRoute = routes && routes.length > 0 ? routes[selectedRouteIndex] : null;
  const distance = currentRoute ? currentRoute.distance : null;
  const duration = currentRoute ? currentRoute.duration : null;

  // Actions
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
    setSelectedRouteIndex(initialRouteIndex);
    setIsDetailsExpanded(true);

    // Fetch weather data
    setIsLoadingWeather(true);
    WeatherService.getRouteWeather(start, end, waypointsList.map(w => w.coordinates))
      .then(data => setWeatherData(data))
      .catch(err => console.error('Failed to fetch weather:', err))
      .finally(() => setIsLoadingWeather(false));
  };

  const handleRouteSelected = (index: number) => {
    setSelectedRouteIndex(index);
  };

  const handleTollModalOpen = (tollSummary: {
    bridges: any[];
    totalRON: number;
    totalEUR: number;
    vehicleType: 'car' | 'bus' | 'minibus';
  }) => {
    setTollModalData(tollSummary);
    setIsTollModalOpen(true);
  };

  // Auto-calculate route when initial locations are provided (for URL-based routes)
  useEffect(() => {
    if (
      initialStartLocation &&
      initialEndLocation &&
      initialStartInput &&
      initialEndInput &&
      !routes // Only if no routes are already calculated
    ) {
      // Auto-trigger route calculation for URL-based routes
      const autoCalculateRoute = async () => {
        try {
          const routeData = await RouteService.calculateRoute(
            initialStartLocation,
            initialEndLocation,
            []
          );

          handleRouteCalculated(
            initialStartLocation,
            initialEndLocation,
            [],
            routeData.routes,
            0
          );
        } catch (error) {
          console.error('Auto route calculation failed:', error);
        }
      };

      // Small delay to ensure UI is ready
      const timer = setTimeout(autoCalculateRoute, 500);
      return () => clearTimeout(timer);
    }
  }, [initialStartLocation, initialEndLocation, initialStartInput, initialEndInput, routes, handleRouteCalculated]);

  // Mobile detection and safe area handling
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      // Try to get CSS env variable first (most reliable)
      const computedStyle = getComputedStyle(document.documentElement);
      const cssEnvValue = computedStyle.getPropertyValue('--safe-area-bottom');

      if (cssEnvValue && cssEnvValue !== '0px') {
        // CSS env() is available and has a value
        setSafeAreaBottom(parseInt(cssEnvValue, 10) || 0);
      } else {
        // Fallback to browser-specific detection
        const isSamsungBrowser = /SamsungBrowser/i.test(navigator.userAgent);
        const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) &&
          !(window as any).MSStream;

        // Set initial safe area based on browser
        if (isSamsungBrowser) {
          setSafeAreaBottom(16); // Samsung Internet bottom bar
        } else if (isIOSSafari) {
          setSafeAreaBottom(20); // iOS Safari gesture bar
        } else {
          setSafeAreaBottom(0);
        }

        // Handle dynamic browser UI (Samsung Internet, Chrome Android)
        const handleResize = () => {
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.clientHeight;
          const heightDifference = windowHeight - documentHeight;

          // Only adjust if there's a significant difference (browser UI present)
          if (heightDifference > 30 && isSamsungBrowser) {
            setSafeAreaBottom(heightDifference + 16);
          } else if (isSamsungBrowser && heightDifference <= 30) {
            // Browser UI hidden, reset to base value
            setSafeAreaBottom(16);
          }
        };

        // Listen to various events that might affect safe area
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        // Initial calculation
        handleResize();

        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('orientationchange', handleResize);
        };
      }
    }
  }, []);

  // Collapse route panel when any modal opens
  useEffect(() => {
    if (isTermsModalOpen || isInfoModalOpen || isTollModalOpen) {
      setIsDetailsExpanded(false);
    }
  }, [isTermsModalOpen, isInfoModalOpen, isTollModalOpen]);

  const value: AppStateContextType = {
    // Route state
    startLocation,
    setStartLocation,
    endLocation,
    setEndLocation,
    waypoints,
    setWaypoints,
    routes,
    setRoutes,
    selectedRouteIndex,
    setSelectedRouteIndex,

    // Weather state
    weatherData,
    isLoadingWeather,

    // UI state
    isSidebarOpen,
    setIsSidebarOpen,
    isDetailsExpanded,
    setIsDetailsExpanded,
    isSidebarRight,
    setIsSidebarRight,
    safeAreaBottom,
    setSafeAreaBottom,

    // Modal state
    isTermsModalOpen,
    setIsTermsModalOpen,
    isInfoModalOpen,
    setIsInfoModalOpen,
    isTollModalOpen,
    setIsTollModalOpen,
    tollModalData,
    setTollModalData,

    // Computed values
    currentRoute,
    distance,
    duration,

    // Actions
    handleRouteCalculated,
    handleRouteSelected,
    handleTollModalOpen,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
