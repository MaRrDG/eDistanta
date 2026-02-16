import { Router, Request, Response, NextFunction } from 'express';
import { fuelPriceController } from '../../controllers/FuelPriceController';

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

// Get all fuel prices with filtering and pagination
router.get('/', fuelPriceController.getFuelPrices);

// Get fuel prices by station name and fuel type
router.get(
  '/station/:stationName/:fuelType',
  fuelPriceController.getLatestFuelPriceByStationAndFuelType
);

// Trigger manual scraping (protected with API key)
router.post('/scrape', requireApiKey, fuelPriceController.triggerManualScraping);

// Get scraping status (protected with API key)
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

export default router;
