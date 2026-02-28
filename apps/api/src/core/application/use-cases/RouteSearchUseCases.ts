import { RouteSearch } from '@domain/entities/RouteSearch';
import { IRouteSearchRepository } from '@domain/ports/IRouteSearchRepository';
import { logInfo, logError } from '@config/logger';

export interface RecordSearchRequest {
    fingerprint: string;
    startName: string;
    startLat: number;
    startLng: number;
    endName: string;
    endLat: number;
    endLng: number;
    waypoints?: any[]; // Simplified for now
    isRoundTrip?: boolean;
    distanceKm?: number;
    estimatedTimeMins?: number;
}

export class RouteSearchUseCases {
    constructor(private repository: IRouteSearchRepository) { }

    async recordSearch(data: RecordSearchRequest): Promise<RouteSearch> {
        try {
            await this.repository.deleteByCriteria(data.fingerprint, data.startName, data.endName);

            const search: Partial<RouteSearch> = {
                fingerprint: data.fingerprint,
                startName: data.startName,
                startLat: data.startLat,
                startLng: data.startLng,
                endName: data.endName,
                endLat: data.endLat,
                endLng: data.endLng,
                waypoints: data.waypoints,
                isRoundTrip: data.isRoundTrip || false,
                distanceKm: data.distanceKm,
                estimatedTimeMins: data.estimatedTimeMins,
            };

            const savedSearch = await this.repository.save(search);

            logInfo('Route search recorded', {
                id: savedSearch.id,
                fingerprint: data.fingerprint,
            });

            return savedSearch;
        } catch (error) {
            logError('Error recording route search', {
                error: error instanceof Error ? error.message : 'Unknown error',
                fingerprint: data.fingerprint,
            });
            throw error;
        }
    }

    async getRecentSearches(fingerprint: string, page: number = 1, limit: number = 5): Promise<{ data: RouteSearch[], total: number }> {
        try {
            const skip = (page - 1) * limit;
            const [searches, total] = await this.repository.findAndCountByFingerprint(fingerprint, limit, skip);

            return { data: searches, total };
        } catch (error) {
            logError('Error fetching recent searches', {
                error: error instanceof Error ? error.message : 'Unknown error',
                fingerprint,
            });
            throw error;
        }
    }
}
