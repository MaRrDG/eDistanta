import type { LocationResult } from '@core/entities/location';

export class LocationService {
  private static readonly BASE_URL =
    import.meta.env.VITE_NOMINATIM_URL || 'https://nominatim.openstreetmap.org/search';
  private static readonly SEARCH_DELAY = 300;

  // Valid place types for localities
  private static readonly VALID_PLACE_TYPES = [
    'city',
    'town',
    'village',
    'hamlet',
    'municipality',
    'commune',
    'locality',
    'administrative',
  ];

  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY_MS = 200;

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async searchLocation(query: string): Promise<LocationResult[]> {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    const url =
      `${this.BASE_URL}?` +
      new URLSearchParams({
        q: `${query}`,
        format: 'json',
        addressdetails: '1',
        limit: '20', // Increased limit to account for filtering
        'accept-language': 'en',
        class: 'place', // Only search for places, not buildings/amenities
      });

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url);

        // Retry on 425 (Too Early) status
        if (response.status === 425) {
          console.warn(
            `Nominatim returned 425 (Too Early), retrying... (attempt ${attempt + 1}/${this.MAX_RETRIES})`
          );
          await this.delay(this.RETRY_DELAY_MS * (attempt + 1));
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Filter results to only include valid locality types
        const filteredData = data.filter((location: any) => {
          const placeType = location.type?.toLowerCase();
          const placeClass = location.class?.toLowerCase();

          // Check if it's a valid place type
          const isValidPlaceType = this.VALID_PLACE_TYPES.includes(placeType);

          // Check if it's a place class (not building, amenity, etc.)
          const isPlaceClass =
            placeClass === 'place' || placeClass === 'boundary';

          // Additional check: ensure it has administrative level or is a settlement
          const hasAdminLevel =
            location.address?.city ||
            location.address?.town ||
            location.address?.village ||
            location.address?.municipality ||
            location.address?.commune;

          return isValidPlaceType && isPlaceClass && hasAdminLevel;
        });

        return filteredData
          .slice(0, 10) // Limit to 10 results after filtering
          .map((location: any) => ({
            name: location.display_name?.split(',')[0]?.trim() || location.name,
            display_name: location.display_name,
            coordinates: [parseFloat(location.lat), parseFloat(location.lon)] as [
              number,
              number,
            ],
            country: location.address?.country,
          }));
      } catch (error) {
        lastError = error as Error;
        console.error(`Error searching location (attempt ${attempt + 1}):`, error);

        // Only retry on network errors, not on other failures
        if (attempt < this.MAX_RETRIES) {
          await this.delay(this.RETRY_DELAY_MS * (attempt + 1));
          continue;
        }
      }
    }

    console.error('All retry attempts failed for location search:', lastError);
    return [];
  }

  static getSearchDelay(): number {
    return this.SEARCH_DELAY;
  }
}
