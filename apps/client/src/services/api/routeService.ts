import type { RouteData, RouteResponse } from '@core/entities/location';

export class RouteService {
  private static readonly BASE_URL =
    import.meta.env.VITE_OSRM_URL || 'https://router.project-osrm.org/route/v1/driving';

  static async calculateRoute(
    startCoords: [number, number],
    endCoords: [number, number],
    waypointCoords: [number, number][] = []
  ): Promise<{ routes: RouteData[] }> {
    try {
      const startLng = startCoords[1];
      const startLat = startCoords[0];
      const endLng = endCoords[1];
      const endLat = endCoords[0];

      // Build coordinates string with waypoints
      let coordinatesStr = `${startLng},${startLat}`;

      // Add waypoints
      waypointCoords.forEach(([lat, lng]) => {
        coordinatesStr += `;${lng},${lat}`;
      });

      coordinatesStr += `;${endLng},${endLat}`;

      const url = `${this.BASE_URL}/${coordinatesStr}?overview=full&geometries=geojson&alternatives=${waypointCoords.length === 0 ? 'true' : 'false'}`;

      const response = await fetch(url);
      const data: RouteResponse = await response.json();

      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }

      // Process all routes
      const processedRoutes = data.routes.map((route, index) => {
        // OSRM returns coordinates as [longitude, latitude], but our app uses [latitude, longitude]
        const formattedRoute = route.geometry.coordinates.map(
          coord => [coord[1], coord[0]] as [number, number]
        );

        // Convert distance from meters to kilometers
        const distanceInKm = route.distance / 1000;

        // Convert duration from seconds to minutes
        const durationInMinutes = route.duration / 60;

        return {
          route: formattedRoute,
          distance: distanceInKm,
          duration: durationInMinutes,
          index,
        };
      });

      return { routes: processedRoutes };
    } catch (error) {
      console.error('Error calculating route:', error);
      throw new Error('Failed to calculate route. Please try again.');
    }
  }
}
