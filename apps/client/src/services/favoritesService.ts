import { getBrowserFingerprint } from '../utils/fingerprint';

// const API_BASE_URL = 'http://localhost:9002';
const API_BASE_URL = 'https://api.edistanta.ro';

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

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export class FavoritesService {
  private static getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'X-Browser-Fingerprint': getBrowserFingerprint(),
    };
  }

  /**
   * Get all favorites for current browser
   */
  static async getFavorites(): Promise<FavoriteRoute[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/favorites`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<FavoriteRoute[]> = await response.json();

      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch favorites');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  /**
   * Get a single favorite by ID
   */
  static async getFavoriteById(id: string): Promise<FavoriteRoute | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/favorites/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<FavoriteRoute> = await response.json();

      if (result.success && result.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Error fetching favorite:', error);
      throw error;
    }
  }

  /**
   * Create a new favorite
   */
  static async createFavorite(
    payload: CreateFavoritePayload
  ): Promise<FavoriteRoute> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/favorites`, {
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

      const result: ApiResponse<FavoriteRoute> = await response.json();

      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to create favorite');
      }
    } catch (error) {
      console.error('Error creating favorite:', error);
      throw error;
    }
  }

  /**
   * Update an existing favorite
   */
  static async updateFavorite(
    id: string,
    payload: UpdateFavoritePayload
  ): Promise<FavoriteRoute> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/favorites/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          fingerprint: getBrowserFingerprint(),
          ...payload,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<FavoriteRoute> = await response.json();

      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to update favorite');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      throw error;
    }
  }

  /**
   * Delete a favorite
   */
  static async deleteFavorite(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/favorites/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<never> = await response.json();

      return result.success;
    } catch (error) {
      console.error('Error deleting favorite:', error);
      throw error;
    }
  }
}
