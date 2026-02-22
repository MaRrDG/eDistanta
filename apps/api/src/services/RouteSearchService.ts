import { Repository } from 'typeorm';
import { RouteSearch } from '../entities/RouteSearch';
import { logInfo, logError } from '../config/logger';
import { RouteWaypoint } from '../entities/RouteSearch';

export interface RecordSearchRequest {
    fingerprint: string;
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

export class RouteSearchService {
    constructor(private searchRepository: Repository<RouteSearch>) { }

    /**
     * Record a new route search asynchronously
     */
    async recordSearch(data: RecordSearchRequest): Promise<RouteSearch> {
        try {
            // Deduplicate: delete any existing search with the exact same start and end names
            // for this fingerprint to avoid duplicate history entries cluttering the list.
            await this.searchRepository.delete({
                fingerprint: data.fingerprint,
                startName: data.startName,
                endName: data.endName
            });

            const search = this.searchRepository.create({
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
            });

            const savedSearch = await this.searchRepository.save(search);

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

    /**
     * Get recent searches for a specific fingerprint with pagination
     */
    async getRecentSearches(fingerprint: string, page: number = 1, limit: number = 5): Promise<{ data: RouteSearch[], total: number }> {
        try {
            const [searches, total] = await this.searchRepository.findAndCount({
                where: { fingerprint },
                order: { createdAt: 'DESC' },
                take: limit,
                skip: (page - 1) * limit,
            });

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
