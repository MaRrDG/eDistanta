import { Router } from 'express';
import { UserFavoriteController } from '@controllers/UserFavoriteController';

export function createUserFavoriteRoutes(userFavoriteController: UserFavoriteController): Router {
    const router = Router();

    /**
     * @openapi
     * /api/v1/favorites:
     *   post:
     *     summary: Create a new route favorite
     *     tags: [Favorites]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserFavorite'
     *     responses:
     *       201:
     *         description: Favorite created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   $ref: '#/components/schemas/UserFavorite'
     */
    router.post('/', userFavoriteController.createFavorite);

    /**
     * @openapi
     * /api/v1/favorites:
     *   get:
     *     summary: Get all favorites for a user
     *     tags: [Favorites]
     *     parameters:
     *       - in: header
     *         name: x-browser-fingerprint
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: List of favorites
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/UserFavorite'
     */
    router.get('/', userFavoriteController.getFavorites);

    /**
     * @openapi
     * /api/v1/favorites/{id}:
     *   get:
     *     summary: Get a specific favorite by ID
     *     tags: [Favorites]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *       - in: header
     *         name: x-browser-fingerprint
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Favorite details
     *       404:
     *         description: Favorite not found
     */
    router.get('/:id', userFavoriteController.getFavoriteById);

    /**
     * @openapi
     * /api/v1/favorites/{id}:
     *   put:
     *     summary: Update an existing favorite
     *     tags: [Favorites]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserFavorite'
     *     responses:
     *       200:
     *         description: Favorite updated
     *       404:
     *         description: Favorite not found
     */
    router.put('/:id', userFavoriteController.updateFavorite);

    /**
     * @openapi
     * /api/v1/favorites/{id}:
     *   delete:
     *     summary: Delete a favorite
     *     tags: [Favorites]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *       - in: header
     *         name: x-browser-fingerprint
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Favorite deleted
     *       404:
     *         description: Favorite not found
     */
    router.delete('/:id', userFavoriteController.deleteFavorite);

    return router;
}
