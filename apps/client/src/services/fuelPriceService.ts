const API_BASE_URL = 'http://localhost:9002';
// const API_BASE_URL = 'https://api.edistanta.ro';

export interface FuelPrice {
  id: number;
  stationName: string;
  fuelType: string;
  price: number | string; 
  currency: string;
  location: string;
  address: string;
  scrapedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export interface FuelStation {
  stationName: string;
  location: string;
}

export class FuelPriceService {
  static async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/fuel-prices/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return false;
      }
      
      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }

  static async getFuelPriceByStationAndType(
    stationName: string,
    fuelType: string
  ): Promise<FuelPrice | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/fuel-prices/station/${encodeURIComponent(stationName)}/${encodeURIComponent(fuelType)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<FuelPrice> = await response.json();

      if (result.success) {
        return result.data || null;
      } else {
        throw new Error(result.message || 'Failed to fetch fuel price');
      }
    } catch (error) {
      console.error('Error fetching fuel price:', error);
      throw error;
    }
  }

  static async getAvailableStations(): Promise<FuelStation[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/fuel-prices?latestOnly=true`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<FuelPrice[]> = await response.json();

      if (result.success && result.data) {
        // Extract unique stations from the data
        const stationsSet = new Set<string>();
        const uniqueStations: FuelStation[] = [];

        result.data.forEach(price => {
          const normalizedStationName = price.stationName.toLowerCase().trim();
          if (!stationsSet.has(normalizedStationName)) {
            stationsSet.add(normalizedStationName);
            uniqueStations.push({
              stationName: normalizedStationName,
              location: price.location || 'Unknown',
            });
          }
        });

        return uniqueStations.sort((a, b) =>
          a.stationName.localeCompare(b.stationName)
        );
      } else {
        throw new Error(result.message || 'Failed to fetch stations');
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw error;
    }
  }
}
