import { Router } from 'express';
import { userFavoriteController } from '../../controllers/UserFavoriteController';

const router = Router();

// POST /api/v1/favorites - Create new favorite
router.post('/', userFavoriteController.createFavorite);

// GET /api/v1/favorites - Get all favorites for fingerprint
router.get('/', userFavoriteController.getFavorites);

// GET /api/v1/favorites/:id - Get single favorite by ID
router.get('/:id', userFavoriteController.getFavoriteById);

// PUT /api/v1/favorites/:id - Update favorite
router.put('/:id', userFavoriteController.updateFavorite);

// DELETE /api/v1/favorites/:id - Delete favorite
router.delete('/:id', userFavoriteController.deleteFavorite);

export default router;
