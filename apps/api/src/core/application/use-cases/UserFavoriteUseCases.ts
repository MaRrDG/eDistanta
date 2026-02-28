import { UserFavorite } from '@domain/entities/UserFavorite';
import { IUserFavoriteRepository } from '@domain/ports/IUserFavoriteRepository';
import { CreateFavoriteRequest, UpdateFavoriteRequest } from '@app-types/userFavorite';
import { logInfo, logError } from '@config/logger';

export class UserFavoriteUseCases {
    constructor(private favoriteRepository: IUserFavoriteRepository) { }

    async createFavorite(data: CreateFavoriteRequest): Promise<UserFavorite> {
        try {
            const favorite: Partial<UserFavorite> = {
                fingerprint: data.fingerprint,
                name: data.name,
                startName: data.startName,
                startLat: data.startLat,
                startLng: data.startLng,
                endName: data.endName,
                endLat: data.endLat,
                endLng: data.endLng,
                waypoints: data.waypoints as any,
            };

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

    async getFavoritesByFingerprint(fingerprint: string): Promise<UserFavorite[]> {
        try {
            return await this.favoriteRepository.findByFingerprint(fingerprint);
        } catch (error) {
            logError('Error fetching favorites', {
                error: error instanceof Error ? error.message : 'Unknown error',
                fingerprint,
            });
            throw error;
        }
    }

    async getFavoriteById(
        id: string,
        fingerprint: string
    ): Promise<UserFavorite | null> {
        try {
            return await this.favoriteRepository.findByIdAndFingerprint(id, fingerprint);
        } catch (error) {
            logError('Error fetching favorite', {
                error: error instanceof Error ? error.message : 'Unknown error',
                id,
            });
            throw error;
        }
    }

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
            if (data.waypoints !== undefined) favorite.waypoints = data.waypoints as any;

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
