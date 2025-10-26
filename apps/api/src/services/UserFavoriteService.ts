import { Repository } from 'typeorm';
import { UserFavorite } from '../entities/UserFavorite';
import { CreateFavoriteRequest, UpdateFavoriteRequest } from '../types/userFavorite';
import { logInfo, logError, logDebug } from '../config/logger';

export class UserFavoriteService {
  constructor(private favoriteRepository: Repository<UserFavorite>) {}

  /**
   * Create a new favorite route for a user (identified by fingerprint)
   */
  async createFavorite(data: CreateFavoriteRequest): Promise<UserFavorite> {
    try {
      const favorite = this.favoriteRepository.create({
        fingerprint: data.fingerprint,
        name: data.name,
        startName: data.startName,
        startLat: data.startLat,
        startLng: data.startLng,
        endName: data.endName,
        endLat: data.endLat,
        endLng: data.endLng,
        waypoints: data.waypoints,
      });

      const savedFavorite = await this.favoriteRepository.save(favorite);

      logInfo('Favorite created', {
        id: savedFavorite.id,
        fingerprint: data.fingerprint,
      });

      return savedFavorite;
    } catch (error) {
      logError('Error creating favorite', {
        error: error instanceof Error ? error.message : 'Unknown error',
        fingerprint: data.fingerprint,
      });
      throw error;
    }
  }

  /**
   * Get all favorites for a specific fingerprint
   */
  async getFavoritesByFingerprint(fingerprint: string): Promise<UserFavorite[]> {
    try {
      const favorites = await this.favoriteRepository.find({
        where: { fingerprint },
        order: { createdAt: 'DESC' },
      });

      return favorites;
    } catch (error) {
      logError('Error fetching favorites', {
        error: error instanceof Error ? error.message : 'Unknown error',
        fingerprint,
      });
      throw error;
    }
  }

  /**
   * Get a single favorite by ID (with fingerprint validation for security)
   */
  async getFavoriteById(
    id: string,
    fingerprint: string
  ): Promise<UserFavorite | null> {
    try {
      const favorite = await this.favoriteRepository.findOne({
        where: { id, fingerprint },
      });

      return favorite;
    } catch (error) {
      logError('Error fetching favorite', {
        error: error instanceof Error ? error.message : 'Unknown error',
        id,
      });
      throw error;
    }
  }

  /**
   * Update an existing favorite
   */
  async updateFavorite(
    id: string,
    fingerprint: string,
    data: UpdateFavoriteRequest
  ): Promise<UserFavorite | null> {
    try {
      const favorite = await this.getFavoriteById(id, fingerprint);

      if (!favorite) {
        return null;
      }

      if (data.name !== undefined) favorite.name = data.name;
      if (data.startName !== undefined) favorite.startName = data.startName;
      if (data.startLat !== undefined) favorite.startLat = data.startLat;
      if (data.startLng !== undefined) favorite.startLng = data.startLng;
      if (data.endName !== undefined) favorite.endName = data.endName;
      if (data.endLat !== undefined) favorite.endLat = data.endLat;
      if (data.endLng !== undefined) favorite.endLng = data.endLng;
      if (data.waypoints !== undefined) favorite.waypoints = data.waypoints;

      const updatedFavorite = await this.favoriteRepository.save(favorite);

      logInfo('Favorite updated', { id });

      return updatedFavorite;
    } catch (error) {
      logError('Error updating favorite', {
        error: error instanceof Error ? error.message : 'Unknown error',
        id,
      });
      throw error;
    }
  }

  /**
   * Delete a favorite
   */
  async deleteFavorite(id: string, fingerprint: string): Promise<boolean> {
    try {
      const favorite = await this.getFavoriteById(id, fingerprint);

      if (!favorite) {
        return false;
      }

      await this.favoriteRepository.remove(favorite);

      logInfo('Favorite deleted', { id });

      return true;
    } catch (error) {
      logError('Error deleting favorite', {
        error: error instanceof Error ? error.message : 'Unknown error',
        id,
      });
      throw error;
    }
  }
}
