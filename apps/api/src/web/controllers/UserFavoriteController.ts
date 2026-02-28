import { Request, Response } from 'express';
import { UserFavoriteUseCases } from '@application/use-cases/UserFavoriteUseCases';
import { logError, logInfo } from '@config/logger';

export class UserFavoriteController {
  constructor(private favoriteUseCases: UserFavoriteUseCases) { }

  // POST /api/v1/favorites - Create new favorite
  public createFavorite = async (req: Request, res: Response): Promise<void> => {
    const requestId = req.headers['x-request-id'];
    try {
      const fingerprint = req.fingerprint || req.body.fingerprint;

      if (!fingerprint) {
        res.status(400).json({
          success: false,
          message: 'Fingerprint is required',
        });
        return;
      }

      const favorite = await this.favoriteUseCases.createFavorite({
        fingerprint,
        name: req.body.name,
        startName: req.body.startName,
        startLat: req.body.startLat,
        startLng: req.body.startLng,
        endName: req.body.endName,
        endLat: req.body.endLat,
        endLng: req.body.endLng,
        waypoints: req.body.waypoints,
      });

      res.status(201).json({
        success: true,
        data: favorite,
      });
    } catch (error) {
      logError('Error creating favorite', {
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId,
      });
      res.status(500).json({
        success: false,
        message: 'Error creating favorite',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // GET /api/v1/favorites - Get all favorites for fingerprint
  public getFavorites = async (req: Request, res: Response): Promise<void> => {
    const requestId = req.headers['x-request-id'];
    try {
      const fingerprint = req.fingerprint || req.headers['x-browser-fingerprint'];

      if (!fingerprint) {
        res.status(400).json({
          success: false,
          message: 'Fingerprint is required',
        });
        return;
      }

      const favorites = await this.favoriteUseCases.getFavoritesByFingerprint(
        fingerprint as string
      );

      res.json({
        success: true,
        data: favorites,
        count: favorites.length,
      });
    } catch (error) {
      logError('Error fetching favorites', {
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId,
      });
      res.status(500).json({
        success: false,
        message: 'Error fetching favorites',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // GET /api/v1/favorites/:id - Get single favorite by ID
  public getFavoriteById = async (req: Request, res: Response): Promise<void> => {
    const requestId = req.headers['x-request-id'];
    try {
      const { id } = req.params;
      const fingerprint = req.fingerprint || req.headers['x-browser-fingerprint'];

      if (!fingerprint) {
        res.status(400).json({
          success: false,
          message: 'Fingerprint is required',
        });
        return;
      }

      const favorite = await this.favoriteUseCases.getFavoriteById(
        id,
        fingerprint as string
      );

      if (!favorite) {
        res.status(404).json({
          success: false,
          message: 'Favorite not found',
        });
        return;
      }

      res.json({
        success: true,
        data: favorite,
      });
    } catch (error) {
      logError('Error fetching favorite', {
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId,
      });
      res.status(500).json({
        success: false,
        message: 'Error fetching favorite',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // PUT /api/v1/favorites/:id - Update favorite
  public updateFavorite = async (req: Request, res: Response): Promise<void> => {
    const requestId = req.headers['x-request-id'];
    try {
      const { id } = req.params;
      const fingerprint = req.fingerprint || req.body.fingerprint;

      if (!fingerprint) {
        res.status(400).json({
          success: false,
          message: 'Fingerprint is required',
        });
        return;
      }

      const favorite = await this.favoriteUseCases.updateFavorite(id, fingerprint, {
        name: req.body.name,
        startName: req.body.startName,
        startLat: req.body.startLat,
        startLng: req.body.startLng,
        endName: req.body.endName,
        endLat: req.body.endLat,
        endLng: req.body.endLng,
        waypoints: req.body.waypoints,
      });

      if (!favorite) {
        res.status(404).json({
          success: false,
          message: 'Favorite not found',
        });
        return;
      }

      res.json({
        success: true,
        data: favorite,
      });
    } catch (error) {
      logError('Error updating favorite', {
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId,
      });
      res.status(500).json({
        success: false,
        message: 'Error updating favorite',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // DELETE /api/v1/favorites/:id - Delete favorite
  public deleteFavorite = async (req: Request, res: Response): Promise<void> => {
    const requestId = req.headers['x-request-id'];
    try {
      const { id } = req.params;
      const fingerprint = req.fingerprint || req.headers['x-browser-fingerprint'];

      if (!fingerprint) {
        res.status(400).json({
          success: false,
          message: 'Fingerprint is required',
        });
        return;
      }

      const deleted = await this.favoriteUseCases.deleteFavorite(
        id,
        fingerprint as string
      );

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Favorite not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Favorite deleted successfully',
      });
    } catch (error) {
      logError('Error deleting favorite', {
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId,
      });
      res.status(500).json({
        success: false,
        message: 'Error deleting favorite',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}
