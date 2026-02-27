import type { WeatherResponse, RouteWeather, LocationWeather } from '@core/entities/weather';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';
const BASE_URL = import.meta.env.VITE_WEATHER_API_URL || 'https://api.weatherapi.com/v1';

export class WeatherService {
    private static cache: Map<string, { data: WeatherResponse; timestamp: number }> = new Map();
    private static CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

    static async getWeather(lat: number, lon: number, days: number = 1): Promise<WeatherResponse> {
        const cacheKey = `${lat},${lon},${days}`;
        const cached = this.cache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.data;
        }

        try {
            const response = await fetch(
                `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=${days}&aqi=no&alerts=yes`
            );

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.statusText}`);
            }

            const data: WeatherResponse = await response.json();
            this.cache.set(cacheKey, { data, timestamp: Date.now() });
            return data;
        } catch (error) {
            console.error('Failed to fetch weather data:', error);
            throw error;
        }
    }

    static async getRouteWeather(
        startCoords: [number, number],
        endCoords: [number, number],
        waypointCoords: [number, number][] = []
    ): Promise<RouteWeather> {
        try {
            // Parallel fetch for start, end, and waypoints
            const [startWeather, endWeather, ...waypointWeathers] = await Promise.all([
                this.getWeather(startCoords[0], startCoords[1]),
                this.getWeather(endCoords[0], endCoords[1], 3), // Get 3 days forecast for destination
                ...waypointCoords.map(coords => this.getWeather(coords[0], coords[1]))
            ]);

            return {
                start: this.mapToLocationWeather('Start', startCoords, startWeather),
                end: this.mapToLocationWeather('Destination', endCoords, endWeather),
                waypoints: waypointWeathers.map((w, i) =>
                    this.mapToLocationWeather(`Waypoint ${i + 1}`, waypointCoords[i], w)
                )
            };
        } catch (error) {
            console.error('Error fetching route weather:', error);
            throw new Error('Failed to load weather data');
        }
    }

    private static mapToLocationWeather(
        name: string,
        coords: [number, number],
        data: WeatherResponse
    ): LocationWeather {
        return {
            locationName: data.location.name || name,
            coordinates: coords,
            current: data.current,
            forecast: data.forecast?.forecastday,
            alerts: data.alerts?.alert || []
        };
    }
}
