export type VehicleType = 'car' | 'bus' | 'minibus';
export type FuelType = 'benzina' | 'motorina' | 'gpl';

export interface FuelPriceData {
  price: number | string;
  currency: string;
  stationName: string;
  fuelType: string;
  scrapedAt: string;
}

export interface FuelStation {
  stationName: string;
}

export const VEHICLE_TYPES = ['car', 'minibus', 'bus'] as const;
export const FUEL_TYPES = ['benzina', 'motorina', 'gpl'] as const;