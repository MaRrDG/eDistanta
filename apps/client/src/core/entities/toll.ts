import type { VehicleType } from './vehicle';

export interface TollBridge {
  id: string;
  name: string;
  nameRo: string;
  coordinates: [number, number];
  tollEUR: number;
  tollRON: number;
  description: string;
  descriptionRo: string;
  highway?: string;
  crossesBorder: boolean;
  vehicleRates?: {
    car: { ron: number; eur: number };
    minibus: { ron: number; eur: number };
    bus: { ron: number; eur: number };
  };
  northSide?: [number, number];
  southSide?: [number, number];
  detectionRadius?: number;
}

export interface TollSummary {
  totalRON: number;
  totalEUR: number;
  bridges: TollBridge[];
  hasTolls: boolean;
  vehicleType: VehicleType;
}
