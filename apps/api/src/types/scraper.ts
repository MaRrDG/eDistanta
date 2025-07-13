export interface ScrapedFuelPrice {
  stationName: string;
  fuelType: string;
  price: number;
  currency?: string;
  location?: string;
  address?: string;
}

export interface ScrapingResult {
  success: boolean;
  message: string;
  count?: number;
}

export interface ScrapingStatus {
  isRunning: boolean;
  lastRun?: Date;
}

export interface ScraperConfig {
  cronSchedule: string;
  enabled: boolean;
  timeout: number;
  requestDelay: number;
}

export interface FuelPriceQuery {
  page?: number;
  limit?: number;
  stationName?: string;
  fuelType?: string;
  location?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  minPrice?: number;
  maxPrice?: number;
  dateFrom?: string;
  dateTo?: string;
  latestOnly?: boolean;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
} 