export interface RouteData {
  route: [number, number][];
  distance: number;
  duration: number;
  index: number;
}

export interface Waypoint {
  id: string;
  name: string;
  coordinates: [number, number];
}

export interface AppLayoutProps {
  startLocation: [number, number] | null;
  endLocation: [number, number] | null;
  waypoints: Waypoint[];
  routes: RouteData[] | null;
  selectedRouteIndex: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isDetailsExpanded: boolean;
  setIsDetailsExpanded: (expanded: boolean) => void;
  safeAreaBottom: number;
  setSafeAreaBottom: (bottom: number) => void;
  onRouteCalculated: (start: [number, number], end: [number, number], waypoints: Waypoint[], routes: RouteData[], index: number) => void;
  onRouteSelected: (index: number) => void;
  distance: number | null;
  duration: number | null;
  initialStartInput?: string;
  initialEndInput?: string;
  initialStartLocation?: [number, number] | null;
  initialEndLocation?: [number, number] | null;
}
