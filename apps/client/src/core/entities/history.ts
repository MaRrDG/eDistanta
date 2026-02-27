import type { RouteWaypoint } from './favorite';

export interface RouteSearchRecord {
    id: string;
    fingerprint: string;
    startName: string;
    startLat: number;
    startLng: number;
    endName: string;
    endLat: number;
    endLng: number;
    waypoints?: RouteWaypoint[];
    isRoundTrip: boolean;
    distanceKm?: number;
    estimatedTimeMins?: number;
    createdAt: string;
    updatedAt: string;
}

export interface RecordSearchPayload {
    startName: string;
    startLat: number;
    startLng: number;
    endName: string;
    endLat: number;
    endLng: number;
    waypoints?: RouteWaypoint[];
    isRoundTrip?: boolean;
    distanceKm?: number;
    estimatedTimeMins?: number;
}

export interface PaginatedRouteHistory {
    data: RouteSearchRecord[];
    totalPages: number;
    currentPage: number;
    total: number;
}
