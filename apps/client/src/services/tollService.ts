// Romanian Bridge Toll Service
// Handles detection and calculation of bridge tolls (excluding ROVinieta)

export interface TollBridge {
  id: string;
  name: string;
  nameRo: string;
  coordinates: [number, number]; // [lat, lng]
  tollEUR: number; // Toll in EUR for passenger cars
  tollRON: number; // Toll in RON for passenger cars
  description: string;
  descriptionRo: string;
  highway?: string; // Associated highway/road
  crossesBorder: boolean; // Whether it crosses international border
  vehicleRates?: { // Optional vehicle-specific rates
    car: { ron: number; eur: number };
    minibus: { ron: number; eur: number };
    bus: { ron: number; eur: number };
  };
}

export type VehicleType = 'car' | 'bus' | 'minibus';

// Romanian bridge tolls as of 2024
export const ROMANIAN_TOLL_BRIDGES: TollBridge[] = [
  {
    id: 'fetesti-cernavoda',
    name: 'Fetești–Cernavodă Bridge',
    nameRo: 'Podul Fetești–Cernavodă',
    coordinates: [44.3833, 27.8167], // Approximate coordinates
    tollEUR: 0, // Paid in RON only
    tollRON: 13, // Car rate
    description: 'Bridge on A2 Motorway crossing the Danube',
    descriptionRo: 'Podul de pe Autostrada A2 care traversează Dunărea',
    highway: 'A2',
    crossesBorder: false,
    vehicleRates: {
      car: { ron: 13, eur: 3 },
      minibus: { ron: 47, eur: 10 },
      bus: { ron: 64, eur: 13 },
    },
  },
  {
    id: 'giurgeni-vadu-oii',
    name: 'Giurgeni–Vadu Oii Bridge',
    nameRo: 'Podul Giurgeni–Vadu Oii',
    coordinates: [44.9167, 27.5833], // Approximate coordinates
    tollEUR: 0, // Paid in RON only
    tollRON: 16, // Updated rate as of 2024
    description: 'Bridge on DN2A crossing the Danube',
    descriptionRo: 'Podul de pe DN2A care traversează Dunărea',
    highway: 'DN2A',
    crossesBorder: false,
  },
  {
    id: 'giurgiu-ruse',
    name: 'Giurgiu–Ruse Bridge (Danube Bridge)',
    nameRo: 'Podul Giurgiu–Ruse (Podul Prieteniei)',
    coordinates: [43.8333, 25.9667], // Approximate coordinates
    tollEUR: 6, // International bridge - EUR
    tollRON: 30, // Approximate RON equivalent
    description: 'International bridge to Bulgaria on DN5/E70/E85',
    descriptionRo: 'Pod internațional către Bulgaria pe DN5/E70/E85',
    highway: 'DN5',
    crossesBorder: true,
  },
  {
    id: 'calafat-vidin',
    name: 'Calafat–Vidin Bridge (New Europe Bridge)',
    nameRo: 'Podul Calafat–Vidin (Podul Noua Europă)',
    coordinates: [44.0167, 22.9667], // Approximate coordinates
    tollEUR: 6, // International bridge - EUR
    tollRON: 30, // Approximate RON equivalent
    description: 'International bridge to Bulgaria on DN56/E79',
    descriptionRo: 'Pod internațional către Bulgaria pe DN56/E79',
    highway: 'DN56',
    crossesBorder: true,
  },
];

export class TollService {
  /**
   * Calculate the distance between two coordinates using Haversine formula
   */
  private static calculateDistance(
    coord1: [number, number],
    coord2: [number, number]
  ): number {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Check if a route passes near any toll bridges
   * Uses a proximity threshold to determine if the route likely crosses a bridge
   */
  static detectTollBridges(routeCoordinates: [number, number][]): TollBridge[] {
    const detectedBridges: TollBridge[] = [];
    const proximityThreshold = 2; // 2km threshold for bridge detection

    for (const bridge of ROMANIAN_TOLL_BRIDGES) {
      let isNearBridge = false;

      // Check if any point in the route is near the bridge
      for (const routePoint of routeCoordinates) {
        const distance = this.calculateDistance(routePoint, bridge.coordinates);
        
        if (distance <= proximityThreshold) {
          isNearBridge = true;
          break;
        }
      }

      if (isNearBridge) {
        detectedBridges.push(bridge);
      }
    }

    return detectedBridges;
  }

  /**
   * Calculate total toll cost for detected bridges with vehicle-specific pricing
   */
  static calculateTotalTollCost(
    bridges: TollBridge[],
    vehicleType: VehicleType = 'car',
    currency: 'RON' | 'EUR' = 'RON'
  ): number {
    return bridges.reduce((total, bridge) => {
      // Use vehicle-specific rates if available, otherwise use base toll
      if (bridge.vehicleRates) {
        const vehicleRate = bridge.vehicleRates[vehicleType];
        const toll = currency === 'EUR' ? vehicleRate.eur : vehicleRate.ron;
        return total + toll;
      } else {
        // For bridges without vehicle-specific rates, use base toll (car rate)
        const baseToll = currency === 'EUR' ? bridge.tollEUR : bridge.tollRON;
        return total + baseToll;
      }
    }, 0);
  }

  /**
   * Get toll summary for display with vehicle-specific pricing
   */
  static getTollSummary(bridges: TollBridge[], vehicleType: VehicleType = 'car'): {
    totalRON: number;
    totalEUR: number;
    bridges: TollBridge[];
    hasTolls: boolean;
    vehicleType: VehicleType;
  } {
    const totalRON = this.calculateTotalTollCost(bridges, vehicleType, 'RON');
    const totalEUR = this.calculateTotalTollCost(bridges, vehicleType, 'EUR');
    
    return {
      totalRON,
      totalEUR,
      bridges,
      hasTolls: bridges.length > 0,
      vehicleType,
    };
  }
}
