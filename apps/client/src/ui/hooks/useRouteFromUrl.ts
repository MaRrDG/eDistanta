import { useEffect, useState } from 'react';
import { getCityBySlug } from '@data/popularRoutes';
import { LocationService } from '@services/api/locationService';
import type { LocationResult } from '@core/entities/location';

interface RouteFromUrlResult {
  startInput: string;
  endInput: string;
  startLocation: [number, number] | null;
  endLocation: [number, number] | null;
  isLoading: boolean;
}

export const useRouteFromUrl = (fromCitySlug?: string, toCitySlug?: string): RouteFromUrlResult => {
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [startLocation, setStartLocation] = useState<[number, number] | null>(null);
  const [endLocation, setEndLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!fromCitySlug || !toCitySlug) {
      // Reset if no route specified
      setStartInput('');
      setEndInput('');
      setStartLocation(null);
      setEndLocation(null);
      return;
    }

    const loadCityData = async () => {
      setIsLoading(true);

      try {
        const fromCity = getCityBySlug(fromCitySlug);
        const toCity = getCityBySlug(toCitySlug);

        if (fromCity && toCity) {
          // Set the input values to city names
          setStartInput(fromCity.name);
          setEndInput(toCity.name);

          // Set coordinates directly from our data
          setStartLocation(fromCity.coordinates);
          setEndLocation(toCity.coordinates);
        } else {
          // Fallback: try to search for the cities
          console.warn('Cities not found in database, trying search fallback');

          if (fromCitySlug) {
            const results = await LocationService.searchLocation(fromCitySlug.replace(/-/g, ' '));
            const fromResults: LocationResult[] = results;
            if (fromResults.length > 0) {
              setStartInput(fromResults[0].name);
              setStartLocation(fromResults[0].coordinates);
            }
          }

          if (toCitySlug) {
            const results = await LocationService.searchLocation(toCitySlug.replace(/-/g, ' '));
            const toResults: LocationResult[] = results;
            if (toResults.length > 0) {
              setEndInput(toResults[0].name);
              setEndLocation(toResults[0].coordinates);
            }
          }
        }
      } catch (error) {
        console.error('Error loading city data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCityData();
  }, [fromCitySlug, toCitySlug]);

  return {
    startInput,
    endInput,
    startLocation,
    endLocation,
    isLoading
  };
};
