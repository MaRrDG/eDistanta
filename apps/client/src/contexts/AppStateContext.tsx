import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { RouteData, Waypoint } from '../types/route';
import { RouteService } from '../services/routeService';

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
  
  // UI state
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isDetailsExpanded: boolean;
  setIsDetailsExpanded: (expanded: boolean) => void;
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
  
  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);
  
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
    setIsDetailsExpanded(true);
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
    
    // UI state
    isSidebarOpen,
    setIsSidebarOpen,
    isDetailsExpanded,
    setIsDetailsExpanded,
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
