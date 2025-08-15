import { Router } from 'express';
import fuelPricesRoutes from './fuelPrices';

const router = Router();

// Mount all v1 routes
router.use('/fuel-prices', fuelPricesRoutes);

// V1 API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'eDistanta API v1',
    version: '1.0.0',
    endpoints: {
      fuelPrices: '/api/v1/fuel-prices',
      health: '/health'
    },
    documentation: '/api/v1/docs' // Future endpoint for API documentation
  });
});

// V1 Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    version: 'v1',
    timestamp: new Date().toISOString(),
    services: ['fuel-price-api']
  });
});

export default router;
