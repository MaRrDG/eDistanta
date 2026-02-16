import 'reflect-metadata';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import { initializeDatabase, closeDatabase } from './config/database';
import v1Routes from './routes/v1';
import { logInfo, logError } from './config/logger';
import { httpLogger, requestIdMiddleware } from './middleware/httpLogger';

const app = express();
const PORT = process.env.PORT || 3001;

// Request ID middleware (for tracing requests)
app.use(requestIdMiddleware);

// HTTP request logging middleware
app.use(httpLogger);

// Security middleware
app.use(helmet());

import { apiLimiter } from './middleware/rateLimiter';
app.use('/api/', apiLimiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
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

// API v1 routes
app.use('/api/v1', v1Routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'eDistanta API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      v1: '/api/v1',
      fuelPrices: '/api/v1/fuel-prices',
      documentation: '/api/v1/docs', // Future endpoint for API documentation
    },
  });
});

// Error handling middleware
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logInfo(`Received ${signal}. Starting graceful shutdown...`);

  // Close database connection
  await closeDatabase();

  // Close server
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const startServer = async () => {
  try {
    // Initialize database
    logInfo('Initializing database connection...');
    await initializeDatabase();
    logInfo('Database connection established successfully');

    // Start Express server
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
