// Romanian Bridge Toll Service
// Handles detection and calculation of bridge tolls (excluding ROVinieta)

export interface TollBridge {
  id: string;
  name: string;
  nameRo: string;
  coordinates: [number, number]; // [lat, lng] - Primary toll booth location
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
  // Additional coordinates for more accurate detection
  northSide?: [number, number]; // Coordinates on north side of bridge
  southSide?: [number, number]; // Coordinates on south side of bridge
  detectionRadius?: number; // Custom detection radius in km (default: 0.5)
}

export type VehicleType = 'car' | 'bus' | 'minibus';

// Romanian bridge tolls as of 2024
export const ROMANIAN_TOLL_BRIDGES: TollBridge[] = [
  {
    id: 'fetesti-cernavoda',
    name: 'Fetești–Cernavodă Bridge',
    nameRo: 'Podul Fetești–Cernavodă',
    coordinates: [44.3843, 27.8252], // Toll booth on A2 (more precise location)
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
    northSide: [44.3950, 27.8350], // North approach (Fetești side)
    southSide: [44.3736, 27.8154], // South approach (Cernavodă side)
    detectionRadius: 2.0, // Increased radius to ensure detection on A2
  },
  {
    id: 'giurgeni-vadu-oii',
    name: 'Giurgeni–Vadu Oii Bridge',
    nameRo: 'Podul Giurgeni–Vadu Oii',
    coordinates: [44.9050, 27.5817], // More precise toll booth location
    tollEUR: 0, // Paid in RON only
    tollRON: 16, // Updated rate as of 2024
    description: 'Bridge on DN2A crossing the Danube',
    descriptionRo: 'Podul de pe DN2A care traversează Dunărea',
    highway: 'DN2A',
    crossesBorder: false,
    northSide: [44.9100, 27.5850], // North side (Giurgeni)
    southSide: [44.9000, 27.5784], // South side (Vadu Oii)
    detectionRadius: 0.5, // Tighter detection radius
  },
  {
    id: 'giurgiu-ruse',
    name: 'Giurgiu–Ruse Bridge (Danube Bridge)',
    nameRo: 'Podul Giurgiu–Ruse (Podul Prieteniei)',
    coordinates: [43.8440, 25.9700], // Romanian toll booth
    tollEUR: 6, // International bridge - EUR
    tollRON: 30, // Approximate RON equivalent
    description: 'International bridge to Bulgaria on DN5/E70/E85',
    descriptionRo: 'Pod internațional către Bulgaria pe DN5/E70/E85',
    highway: 'DN5',
    crossesBorder: true,
    northSide: [43.8500, 25.9720], // Romanian side
    southSide: [43.8380, 25.9680], // Bulgarian side
    detectionRadius: 0.6,
  },
  {
    id: 'calafat-vidin',
    name: 'Calafat–Vidin Bridge (New Europe Bridge)',
    nameRo: 'Podul Calafat–Vidin (Podul Noua Europă)',
    coordinates: [44.0100, 22.9650], // Romanian toll booth
    tollEUR: 6, // International bridge - EUR
    tollRON: 30, // Approximate RON equivalent
    description: 'International bridge to Bulgaria on DN56/E79',
    descriptionRo: 'Pod internațional către Bulgaria pe DN56/E79',
    highway: 'DN56',
    crossesBorder: true,
    northSide: [44.0150, 22.9670], // Romanian side
    southSide: [44.0050, 22.9630], // Bulgarian side
    detectionRadius: 0.6,
  },
];

export class TollService {
  /**
   * Calculate the distance between two coordinates using Haversine formula
   * Returns distance in kilometers
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
   * Check if a route crosses from one side of a bridge to the other
   * This helps prevent false positives when a route passes near but doesn't cross the bridge
   */
  private static detectsBridgeCrossing(
    routeCoordinates: [number, number][],
    bridge: TollBridge
  ): boolean {
    // If we don't have both sides defined, fall back to simple proximity check
    if (!bridge.northSide || !bridge.southSide) {
      return false;
    }

    let foundNorthSide = false;
    let foundSouthSide = false;
    let minDistanceNorth = Infinity;
    let minDistanceSouth = Infinity;

    // Use a larger radius for side detection (3x the bridge detection radius)
    // This accounts for routes that pass through the bridge but not exactly through the checkpoint coordinates
    const sideDetectionRadius = (bridge.detectionRadius || 0.5) * 1.5;

    // Check if the route passes near both sides of the bridge
    for (const routePoint of routeCoordinates) {
      const distanceToNorth = this.calculateDistance(routePoint, bridge.northSide);
      const distanceToSouth = this.calculateDistance(routePoint, bridge.southSide);

      if (distanceToNorth < minDistanceNorth) {
        minDistanceNorth = distanceToNorth;
      }
      if (distanceToSouth < minDistanceSouth) {
        minDistanceSouth = distanceToSouth;
      }

      if (distanceToNorth <= sideDetectionRadius) {
        foundNorthSide = true;
      }
      if (distanceToSouth <= sideDetectionRadius) {
        foundSouthSide = true;
      }

      // Early exit if we found both sides
      if (foundNorthSide && foundSouthSide) {
        return true;
      }
    }

    // Route crosses the bridge if it passes near both sides
    return foundNorthSide && foundSouthSide;
  }

  /**
   * Check if a route passes near any toll bridges
   * Uses improved detection with tighter proximity and crossing validation
   */
  static detectTollBridges(routeCoordinates: [number, number][]): TollBridge[] {
    const detectedBridges: TollBridge[] = [];

    for (const bridge of ROMANIAN_TOLL_BRIDGES) {
      const detectionRadius = bridge.detectionRadius || 0.5; // Default 500m radius
      let minDistanceFound = Infinity;

      // Find the closest point on the route to the bridge
      for (const routePoint of routeCoordinates) {
        const distance = this.calculateDistance(routePoint, bridge.coordinates);

        if (distance < minDistanceFound) {
          minDistanceFound = distance;
        }
      }

      // Check if the route is within detection radius
      const isNearBridge = minDistanceFound <= detectionRadius;

      // Second check: If near the bridge, verify it actually crosses (if crossing data available)
      if (isNearBridge) {
        // If we have crossing detection data, use it for additional validation
        if (bridge.northSide && bridge.southSide) {
          const crossesBridge = this.detectsBridgeCrossing(routeCoordinates, bridge);
          if (crossesBridge) {
            detectedBridges.push(bridge);
          } else {
          }
        } else {
          // No crossing data available, trust the proximity check
          detectedBridges.push(bridge);
        }
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
