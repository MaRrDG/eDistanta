import { Router, Request, Response, NextFunction } from 'express';
import { FuelPriceController } from '@controllers/FuelPriceController';

export function createFuelPriceRoutes(fuelPriceController: FuelPriceController): Router {
  const router = Router();

  // API key middleware for protected endpoints
  const requireApiKey = (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.headers['x-api-key'] as string;
    const validKey = process.env.SCRAPE_API_KEY;

    if (!validKey || apiKey !== validKey) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: invalid or missing API key',
      });
      return;
    }
    next();
  };

  /**
   * @openapi
   * /api/v1/fuel-prices:
   *   get:
   *     summary: Get all fuel prices
   *     tags: [Fuel Prices]
   *     parameters:
   *       - in: query
   *         name: latestOnly
   *         schema:
   *           type: boolean
   *         description: If true, only return the latest price for each station/fuel type
   *     responses:
   *       200:
   *         description: List of fuel prices
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
   *                     $ref: '#/components/schemas/FuelPrice'
   */
  router.get('/', fuelPriceController.getFuelPrices);

  /**
   * @openapi
   * /api/v1/fuel-prices/station/{stationName}/{fuelType}:
   *   get:
   *     summary: Get latest fuel price by station and type
   *     tags: [Fuel Prices]
   *     parameters:
   *       - in: path
   *         name: stationName
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: fuelType
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: The latest fuel price
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/FuelPrice'
   */
  router.get(
    '/station/:stationName/:fuelType',
    fuelPriceController.getLatestFuelPriceByStationAndFuelType
  );

  /**
   * @openapi
   * /api/v1/fuel-prices/scrape:
   *   post:
   *     summary: Trigger manual fuel price scraping
   *     tags: [Fuel Prices]
   *     security:
   *       - ApiKeyAuth: []
   *     responses:
   *       202:
   *         description: Scraping task started
   *       403:
   *         description: Forbidden - Invalid API key
   */
  router.post('/scrape', requireApiKey, fuelPriceController.triggerManualScraping);

  /**
   * @openapi
   * /api/v1/fuel-prices/scrape/status:
   *   get:
   *     summary: Get status of the last scraping task
   *     tags: [Fuel Prices]
   *     security:
   *       - ApiKeyAuth: []
   *     responses:
   *       200:
   *         description: Current scraping status
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 status:
   *                   type: string
   */
  router.get('/scrape/status', requireApiKey, fuelPriceController.getScrapingStatus);

  // API health check endpoint for fuel prices service
  router.get('/health', (req, res) => {
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'fuel-price-api',
      version: 'v1'
    });
  });

  return router;
}
