import { getBrowserFingerprint } from '../../utils/fingerprint';
import type {
    RouteSearchRecord,
    RecordSearchPayload,
    PaginatedRouteHistory
} from '../../core/entities/history';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9002';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    count?: number;
    total?: number;
    totalPages?: number;
    currentPage?: number;
}

export class HistoryService {
    private static getHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json',
            'X-Browser-Fingerprint': getBrowserFingerprint(),
        };
    }

    static async recordSearch(payload: RecordSearchPayload): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/history/record`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    fingerprint: getBrowserFingerprint(),
                    ...payload,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error recording route search:', error);
            throw error;
        }
    }

    static async getHistory(page: number = 1, limit: number = 5): Promise<PaginatedRouteHistory> {
        try {
            const fingerprint = getBrowserFingerprint();
            const response = await fetch(`${API_BASE_URL}/api/v1/history/${fingerprint}?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: ApiResponse<RouteSearchRecord[]> = await response.json();

            if (result.success && result.data) {
                return {
                    data: result.data,
                    totalPages: result.totalPages || 1,
                    currentPage: result.currentPage || 1,
                    total: result.total || 0,
                };
            } else {
                throw new Error(result.message || 'Failed to fetch history');
            }
        } catch (error) {
            console.error('Error fetching search history:', error);
            throw error;
        }
    }
}
