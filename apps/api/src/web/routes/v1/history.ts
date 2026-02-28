import { Router } from 'express';
import { RouteSearchController } from '@controllers/RouteSearchController';

export function createRouteSearchRoutes(routeSearchController: RouteSearchController): Router {
    const router = Router();

    /**
     * @openapi
     * /api/v1/history/record:
     *   post:
     *     summary: Record a new route search
     *     tags: [History]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RouteSearch'
     *     responses:
     *       201:
     *         description: Search recorded
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   $ref: '#/components/schemas/RouteSearch'
     */
    router.post('/record', routeSearchController.recordSearch);

    /**
     * @openapi
     * /api/v1/history/{fingerprint}:
     *   get:
     *     summary: Get search history for a user
     *     tags: [History]
     *     parameters:
     *       - in: path
     *         name: fingerprint
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: List of previous searches
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
     *                     $ref: '#/components/schemas/RouteSearch'
     */
    router.get('/:fingerprint', routeSearchController.getHistory);

    return router;
}
