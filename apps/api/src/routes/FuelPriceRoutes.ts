import { Router } from 'express';
import { fuelPriceController } from '../controllers/FuelPriceController';

const router = Router();

// Get all fuel prices with filtering and pagination
router.get('/', fuelPriceController.getFuelPrices);

// Get fuel prices by station name and fuel type
router.get('/station/:stationName/:fuelType', fuelPriceController.getLatestFuelPriceByStationAndFuelType);


// Trigger manual scraping (POST for security)
router.post('/scrape', fuelPriceController.triggerManualScraping);

// Get scraping status
router.get('/scrape/status', fuelPriceController.getScrapingStatus);

export default router; 