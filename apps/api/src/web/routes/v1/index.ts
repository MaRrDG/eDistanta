import { Router } from 'express';
import { createFuelPriceRoutes } from './fuelPrices';
import { createUserFavoriteRoutes } from './favorites';
import { createRouteSearchRoutes } from './history';
import { FuelPriceController } from '@controllers/FuelPriceController';
import { UserFavoriteController } from '@controllers/UserFavoriteController';
import { RouteSearchController } from '@controllers/RouteSearchController';

export function createV1Routes(controllers: {
  fuelPriceController: FuelPriceController;
  userFavoriteController: UserFavoriteController;
  routeSearchController: RouteSearchController;
}): Router {
  const router = Router();

  // Mount all v1 routes
  router.use('/fuel-prices', createFuelPriceRoutes(controllers.fuelPriceController));
  router.use('/favorites', createUserFavoriteRoutes(controllers.userFavoriteController));
  router.use('/history', createRouteSearchRoutes(controllers.routeSearchController));

  // V1 API info endpoint
  router.get('/', (req, res) => {
    res.json({
      message: 'eDistanta API v1',
      version: '1.0.0',
      endpoints: {
        fuelPrices: '/api/v1/fuel-prices',
        favorites: '/api/v1/favorites',
        history: '/api/v1/history',
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

  return router;
}
