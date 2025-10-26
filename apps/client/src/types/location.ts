export interface Waypoint {
  id: string;
  name: string;
  coordinates: [number, number];
}

export interface LocationResult {
  name: string;
  display_name: string;
  coordinates: [number, number];
}

export interface RouteData {
  route: [number, number][];
  distance: number;
  duration: number;
  index: number;
}

export interface RouteResponse {
  routes: {
    geometry: {
      coordinates: [number, number][];
    };
    distance: number;
    duration: number;
  }[];
}

export interface SearchComponentProps {
  onRouteCalculated: (
    startLocation: [number, number],
    endLocation: [number, number],
    waypoints: Waypoint[],
    routes: RouteData[],
    selectedRouteIndex: number
  ) => void;
  onLocationNamesChange?: (startName: string, endName: string) => void;
  onMobileSubmit?: () => void;
  initialStartInput?: string;
  initialEndInput?: string;
  initialStartLocation?: [number, number] | null;
  initialEndLocation?: [number, number] | null;
}
