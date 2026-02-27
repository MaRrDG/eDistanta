export interface RouteWaypoint {
    id: string;
    name: string;
    coordinates: [number, number];
}

export interface FavoriteRoute {
    id: string;
    fingerprint: string;
    name?: string;
    startName: string;
    startLat: number;
    startLng: number;
    endName: string;
    endLat: number;
    endLng: number;
    waypoints?: RouteWaypoint[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateFavoritePayload {
    name?: string;
    startName: string;
    startLat: number;
    startLng: number;
    endName: string;
    endLat: number;
    endLng: number;
    waypoints?: RouteWaypoint[];
}

export interface UpdateFavoritePayload {
    name?: string;
    startName?: string;
    startLat?: number;
    startLng?: number;
    endName?: string;
    endLat?: number;
    endLng?: number;
    waypoints?: RouteWaypoint[];
}
