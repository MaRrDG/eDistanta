import type { Waypoint, RouteData } from './location';

// Re-export for convenience
export type { Waypoint, RouteData };

export const calculateCO2Emissions = (
  consumptionL_per_100km: number,
  distanceKm: number,
  fuelType: string
): number => {
  const emissionFactors: Record<string, number> = {
    'benzina-regular': 2.31,
    'benzina-premium': 2.31,
    'motorina-regular': 2.68,
    'motorina-premium': 2.68,
    gpl: 1.51,
  };

  const fuelTypeLower = fuelType.toLowerCase();
  const factor = emissionFactors[fuelTypeLower] || 2.31; // Default to petrol if unknown

  const totalConsumptionLiters = (consumptionL_per_100km * distanceKm) / 100;
  return totalConsumptionLiters * factor;
};