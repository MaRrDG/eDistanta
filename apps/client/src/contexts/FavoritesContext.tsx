import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { FavoriteRoute, CreateFavoritePayload } from '../services/favoritesService';
import { FavoritesService } from '../services/favoritesService';

interface FavoritesContextType {
  favorites: FavoriteRoute[];
  isLoading: boolean;
  error: string | null;
  fetchFavorites: () => Promise<void>;
  addFavorite: (payload: CreateFavoritePayload) => Promise<FavoriteRoute | null>;
  removeFavorite: (id: string) => Promise<boolean>;
  updateFavoriteName: (id: string, name: string) => Promise<boolean>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteRoute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await FavoritesService.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
      console.error('Error fetching favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (payload: CreateFavoritePayload): Promise<FavoriteRoute | null> => {
    setError(null);
    try {
      const newFavorite = await FavoritesService.createFavorite(payload);
      setFavorites((prev) => [newFavorite, ...prev]);
      return newFavorite;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add favorite');
      console.error('Error adding favorite:', err);
      return null;
    }
  };

  const removeFavorite = async (id: string): Promise<boolean> => {
    setError(null);
    try {
      const success = await FavoritesService.deleteFavorite(id);
      if (success) {
        setFavorites((prev) => prev.filter((fav) => fav.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove favorite');
      console.error('Error removing favorite:', err);
      return false;
    }
  };

  const updateFavoriteName = async (id: string, name: string): Promise<boolean> => {
    setError(null);
    try {
      const updated = await FavoritesService.updateFavorite(id, { name });
      setFavorites((prev) =>
        prev.map((fav) => (fav.id === id ? updated : fav))
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update favorite');
      console.error('Error updating favorite:', err);
      return false;
    }
  };

  // Load favorites on mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  const value: FavoritesContextType = {
    favorites,
    isLoading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    updateFavoriteName,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
