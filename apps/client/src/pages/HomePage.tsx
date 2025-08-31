import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import type { RouteData, Waypoint } from '../types/route';

const HomePage = () => {
  const [startLocation, setStartLocation] = useState<[number, number] | null>(null);
  const [endLocation, setEndLocation] = useState<[number, number] | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [routes, setRoutes] = useState<RouteData[] | null>(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);

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

  return (
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
    />
  );
};

export default HomePage;
