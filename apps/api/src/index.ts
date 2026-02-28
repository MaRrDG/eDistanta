import 'reflect-metadata';
import dotenv from 'dotenv';
import '@app-types/express'; // Global type augmentation for Express Request

// Load environment variables FIRST
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import { AppDataSource, initializeDatabase, closeDatabase } from '@config/database';
import { logInfo, logError } from '@config/logger';
import { httpLogger, requestIdMiddleware } from '@middleware/httpLogger';
import { apiLimiter } from '@middleware/rateLimiter';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@config/swagger';

// Infrastructure Layer entities (used for TypeORM repositories)
import { FuelPrice } from '@domain/entities/FuelPrice';
import { UserFavorite } from '@domain/entities/UserFavorite';
import { RouteSearch } from '@domain/entities/RouteSearch';

// Repositories (Infrastructure Layer)
import { TypeORMFuelPriceRepository } from '@infrastructure/persistence/TypeORMFuelPriceRepository';
import { TypeORMUserFavoriteRepository } from '@infrastructure/persistence/TypeORMUserFavoriteRepository';
import { TypeORMRouteSearchRepository } from '@infrastructure/persistence/TypeORMRouteSearchRepository';

// Scrapers (Infrastructure Layer)
import { PecoOnlineScraper } from '@infrastructure/adapters/scrapers/PecoOnlineScraper';

// Use Cases (Application Layer)
import { GetFuelPricesUseCase } from '@application/use-cases/GetFuelPricesUseCase';
import { ScrapeFuelPricesUseCase } from '@application/use-cases/ScrapeFuelPricesUseCase';
import { UserFavoriteUseCases } from '@application/use-cases/UserFavoriteUseCases';
import { RouteSearchUseCases } from '@application/use-cases/RouteSearchUseCases';

// Controllers (Web Layer)
import { FuelPriceController } from '@controllers/FuelPriceController';
import { UserFavoriteController } from '@controllers/UserFavoriteController';
import { RouteSearchController } from '@controllers/RouteSearchController';

// Routes (Web Layer)
import { createV1Routes } from '@web/routes/v1';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(requestIdMiddleware);
app.use(httpLogger);
app.use(helmet());
app.use('/api/', apiLimiter);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Health check endpoint
app.get('/health', (req, res) => {
  const isDev = process.env.NODE_ENV !== 'production';
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    ...(isDev && { uptime: process.uptime(), environment: process.env.NODE_ENV || 'development' }),
  });
});

// Composition Root - Wiring all layers together
const bootstrap = () => {
  // 1. Adapters (Infrastructure)
  const fuelPriceRepository = new TypeORMFuelPriceRepository(AppDataSource.getRepository(FuelPrice));
  const favoriteRepository = new TypeORMUserFavoriteRepository(AppDataSource.getRepository(UserFavorite));
  const searchRepository = new TypeORMRouteSearchRepository(AppDataSource.getRepository(RouteSearch));
  const scraper = new PecoOnlineScraper();

  // 2. Use Cases (Application)
  const getFuelPricesUseCase = new GetFuelPricesUseCase(fuelPriceRepository);
  const scrapeFuelPricesUseCase = new ScrapeFuelPricesUseCase(fuelPriceRepository, [scraper]);
  const favoriteUseCases = new UserFavoriteUseCases(favoriteRepository);
  const searchUseCases = new RouteSearchUseCases(searchRepository);

  // 3. Controllers (Web)
  const fuelPriceController = new FuelPriceController(getFuelPricesUseCase, scrapeFuelPricesUseCase);
  const userFavoriteController = new UserFavoriteController(favoriteUseCases);
  const routeSearchController = new RouteSearchController(searchUseCases);

  // 4. Routes
  const v1Routes = createV1Routes({
    fuelPriceController,
    userFavoriteController,
    routeSearchController
  });

  // Mount routes
  app.use('/api/v1', v1Routes);

  // Error handling middleware (MUST be after routes)
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      logError('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        requestId: req.headers['x-request-id'],
      });
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message }),
      });
    }
  );

  // 404 handler (MUST be the absolute last)
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logInfo(`Received ${signal}. Starting graceful shutdown...`);
  await closeDatabase();
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const startServer = async () => {
  try {
    logInfo('Initializing database connection...');
    await initializeDatabase();
    logInfo('Database connection established successfully');

    // Mount root info endpoint
    app.get('/', (req, res) => {
      res.json({
        message: 'eDistanta API',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          v1: '/api/v1',
          favorites: '/api/v1/favorites',
          history: '/api/v1/history',
          fuelPrices: '/api/v1/fuel-prices',
        },
      });
    });

    // Swagger Documentation (Dev only)
    if (process.env.NODE_ENV !== 'production') {
      app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
      logInfo(`Swagger documentation available at http://localhost:${PORT}/api/v1/docs`);
    }

    // Initialize composition root
    bootstrap();

    app.listen(PORT, () => {
      logInfo(`Server is running on port ${PORT}`);
      logInfo(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logInfo(`Health check: http://localhost:${PORT}/health`);
      logInfo(`API v1 endpoints: http://localhost:${PORT}/api/v1`);
      logInfo('Application started successfully');
    });
  } catch (error) {
    logError('Failed to start server:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
};

startServer();
