import { useState, useCallback } from 'react';
import type { LocationResult } from '../types/location';
import { LocationService } from '../services/locationService';

export const useLocationSearch = () => {
  const [searchTimeouts, setSearchTimeouts] = useState<{
    [key: string]: number;
  }>({});
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const searchLocation = useCallback(
    async (query: string): Promise<LocationResult[]> => {
      return LocationService.searchLocation(query);
    },
    []
  );

  const handleSearch = useCallback(
    async (
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
        setLoadingStates(prev => ({ ...prev, [type]: false }));
        return;
      }

      // Set loading state immediately
      setLoadingStates(prev => ({ ...prev, [type]: true }));

      // Set a timeout to avoid too many API calls
      const timeoutId = window.setTimeout(async () => {
        try {
          const results = await searchLocation(input);
          onResults(results);
          onShowSuggestions(results.length > 0);
        } catch (error) {
          console.error('Search error:', error);
          onResults([]);
          onShowSuggestions(false);
        } finally {
          setLoadingStates(prev => ({ ...prev, [type]: false }));
        }
      }, LocationService.getSearchDelay());

      setSearchTimeouts(prev => ({ ...prev, [type]: timeoutId }));
    },
    [searchTimeouts, searchLocation]
  );

  const clearSearchTimeout = useCallback(
    (type: string) => {
      if (searchTimeouts[type]) {
        clearTimeout(searchTimeouts[type]);
        setSearchTimeouts(prev => {
          const newTimeouts = { ...prev };
          delete newTimeouts[type];
          return newTimeouts;
        });
      }
      setLoadingStates(prev => ({ ...prev, [type]: false }));
    },
    [searchTimeouts]
  );

  const isLoading = useCallback(
    (type: string) => {
      return loadingStates[type] || false;
    },
    [loadingStates]
  );

  return {
    searchLocation,
    handleSearch,
    clearSearchTimeout,
    isLoading,
  };
};
