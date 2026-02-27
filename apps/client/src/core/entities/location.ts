export interface Waypoint {
  id: string;
  name: string;
  coordinates: [number, number];
}

export interface LocationResult {
  name: string;
  display_name: string;
  coordinates: [number, number];
  country?: string;
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
export const isLocationInRomania = (coords: [number, number] | null): boolean => {
  if (!coords) return false;
  const [lat, lng] = coords;
  // Romania approximate rectangular boundaries
  return lat >= 43.6 && lat <= 48.3 && lng >= 20.2 && lng <= 29.7;
};
