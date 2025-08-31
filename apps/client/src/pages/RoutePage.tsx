import { useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFoundPage from '../components/NotFoundPage';
import RoutePageSEO from '../components/RoutePageSEO';
import { parseRouteSlug } from '../data/popularRoutes';
import { useRouteFromUrl } from '../hooks/useRouteFromUrl';
import type { RouteData, Waypoint } from '../types/route';
import AppLayout from '../components/AppLayout';

const RoutePage = () => {
  const { routeSlug } = useParams<{ routeSlug: string }>();
  const [startLocation, setStartLocation] = useState<[number, number] | null>(null);
  const [endLocation, setEndLocation] = useState<[number, number] | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [routes, setRoutes] = useState<RouteData[] | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);

  const routeData = routeSlug ? parseRouteSlug(routeSlug) : null;
  
  const {
    startInput: initialStartInput,
    endInput: initialEndInput,
    startLocation: initialStartLocation,
    endLocation: initialEndLocation,
  } = useRouteFromUrl(routeData?.from, routeData?.to);

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

  const currentRoute = routes && routes.length > 0 ? routes[selectedRouteIndex] : null;
  const distance = currentRoute ? currentRoute.distance : null;
  const duration = currentRoute ? currentRoute.duration : null;

  if (!routeData) {
    return <NotFoundPage />;
  }

  return (
    <>
      <RoutePageSEO 
        fromCity={routeData.from} 
        toCity={routeData.to}
      />
      <AppLayout
        startLocation={startLocation}
        endLocation={endLocation}
        waypoints={waypoints}
        routes={routes}
        selectedRouteIndex={selectedRouteIndex}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isDetailsExpanded={isDetailsExpanded}
        setIsDetailsExpanded={setIsDetailsExpanded}
        safeAreaBottom={safeAreaBottom}
        setSafeAreaBottom={setSafeAreaBottom}
        onRouteCalculated={handleRouteCalculated}
        onRouteSelected={handleRouteSelected}
        distance={distance}
        duration={duration}
        initialStartInput={initialStartInput}
        initialEndInput={initialEndInput}
        initialStartLocation={initialStartLocation}
        initialEndLocation={initialEndLocation}
      />
    </>
  );
};

export default RoutePage;
