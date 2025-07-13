import type { LocationResult } from '../types/location';

export class LocationService {
  private static readonly BASE_URL =
    'https://nominatim.openstreetmap.org/search';
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

  static async searchLocation(query: string): Promise<LocationResult[]> {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}?` +
          new URLSearchParams({
            q: `${query}, Romania`,
            format: 'json',
            addressdetails: '1',
            limit: '20', // Increased limit to account for filtering
            'accept-language': 'en',
            class: 'place', // Only search for places, not buildings/amenities
          })
      );

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
        }));
    } catch (error) {
      console.error('Error searching location:', error);
      return [];
    }
  }

  static getSearchDelay(): number {
    return this.SEARCH_DELAY;
  }
}
