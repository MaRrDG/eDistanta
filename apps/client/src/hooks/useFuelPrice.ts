import { useQuery } from '@tanstack/react-query';
import {
  FuelPriceService,
  type FuelPrice,
  type FuelStation,
} from '../services/fuelPriceService';

export const useFuelPrice = (stationName: string, fuelType: string) => {
  return useQuery<FuelPrice | null>({
    queryKey: ['fuelPrice', stationName, fuelType],
    queryFn: () =>
      FuelPriceService.getFuelPriceByStationAndType(stationName, fuelType),
    enabled: !!stationName && !!fuelType,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useAvailableStations = () => {
  return useQuery<FuelStation[]>({
    queryKey: ['availableStations'],
    queryFn: FuelPriceService.getAvailableStations,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};
