import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { FuelPrice } from '@domain/entities/FuelPrice';
import { UserFavorite } from '@domain/entities/UserFavorite';
import { RouteSearch } from '@domain/entities/RouteSearch';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'info_rutier',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: process.env.NODE_ENV === 'development', // Only in development
  logging: process.env.NODE_ENV === 'development',
  entities: [FuelPrice, UserFavorite, RouteSearch],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
  extra: {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.info('Database connection initialized successfully');

    // Enable UUID extension for PostgreSQL


    // Run migrations if in production
    if (process.env.NODE_ENV === 'production') {
      await AppDataSource.runMigrations();
      console.info('Database migrations completed');
    }
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.info('Database connection closed');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};
