import { RouteWaypoint } from '../entities/UserFavorite';

export interface CreateFavoriteRequest {
  fingerprint: string;
  name?: string;
  startName: string;
  startLat: number;
  startLng: number;
  endName: string;
  endLat: number;
  endLng: number;
  waypoints?: RouteWaypoint[];
}

export interface UpdateFavoriteRequest {
  name?: string;
  startName?: string;
  startLat?: number;
  startLng?: number;
  endName?: string;
  endLat?: number;
  endLng?: number;
  waypoints?: RouteWaypoint[];
}
