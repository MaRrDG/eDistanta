import { useState, useCallback } from 'react';
import type { LocationResult } from '../types/location';
import { LocationService } from '../services/locationService';

export const useLocationSearch = () => {
  const [searchTimeouts, setSearchTimeouts] = useState<{[key: string]: number}>({});

  const searchLocation = useCallback(async (query: string): Promise<LocationResult[]> => {
    return LocationService.searchLocation(query);
  }, []);

  const handleSearch = useCallback(async (
    input: string,
    type: string,
    onResults: (results: LocationResult[]) => void,
    onShowSuggestions: (show: boolean) => void
  ) => {
    // Clear previous timeout
    if (searchTimeouts[type]) {
      clearTimeout(searchTimeouts[type]);
    }

    if (!input.trim()) {
      onResults([]);
      onShowSuggestions(false);
      return;
    }

    // Set a timeout to avoid too many API calls
    const timeoutId = window.setTimeout(async () => {
      const results = await searchLocation(input);
      onResults(results);
      onShowSuggestions(true);
    }, LocationService.getSearchDelay());

    setSearchTimeouts(prev => ({ ...prev, [type]: timeoutId }));
  }, [searchTimeouts, searchLocation]);

  const clearSearchTimeout = useCallback((type: string) => {
    if (searchTimeouts[type]) {
      clearTimeout(searchTimeouts[type]);
      setSearchTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[type];
        return newTimeouts;
      });
    }
  }, [searchTimeouts]);

  return {
    searchLocation,
    handleSearch,
    clearSearchTimeout
  };
}; 