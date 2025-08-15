import 'reflect-metadata';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import { initializeDatabase, closeDatabase } from './config/database';
import fuelPriceRoutes from './routes/FuelPriceRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

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
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/fuel-prices', fuelPriceRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'eDistanta API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      fuelPrices: '/api/fuel-prices',
      documentation: '/api/docs', // Future endpoint for API documentation
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
    console.error('Unhandled error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Something went wrong',
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
  console.info(`Received ${signal}. Starting graceful shutdown...`);

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
    await initializeDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.info(`Server is running on port ${PORT}`);
      console.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.info(`Health check: http://localhost:${PORT}/health`);
      console.info(`API endpoints: http://localhost:${PORT}/api/fuel-prices`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
