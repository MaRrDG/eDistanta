import { Router } from 'express';
import { fuelPriceController } from '../../controllers/FuelPriceController';

const router = Router();

// Get all fuel prices with filtering and pagination
router.get('/', fuelPriceController.getFuelPrices);

// Get fuel prices by station name and fuel type
router.get(
  '/station/:stationName/:fuelType',
  fuelPriceController.getLatestFuelPriceByStationAndFuelType
);

// Trigger manual scraping (POST for security)
router.post('/scrape', fuelPriceController.triggerManualScraping);

// Get scraping status
router.get('/scrape/status', fuelPriceController.getScrapingStatus);

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
