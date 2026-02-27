import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useFuelPrice, useAvailableStations, useApiHealth } from '@ui/hooks/useFuelPrice';

export const VEHICLE_TYPES = ['car', 'bus', 'minibus'] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const FUEL_TYPES = [
  'benzina-regular',
  'benzina-premium',
  'motorina-regular',
  'motorina-premium',
  'gpl',
] as const;
export type FuelType = (typeof FUEL_TYPES)[number];

export const DEFAULT_FUEL_CONSUMPTION: Record<VehicleType, number> = {
  car: 6.5,
  minibus: 9.5,
  bus: 25.0,
};

interface RouteDetailsContextType {
  // Vehicle settings
  vehicleType: VehicleType;
  setVehicleType: (type: VehicleType) => void;
  fuelConsumption: number;
  setFuelConsumption: (consumption: number) => void;
  fuelType: FuelType;
  setFuelType: (type: FuelType) => void;
  selectedStation: string;
  setSelectedStation: (station: string) => void;

  // API data
  isApiHealthy: boolean | undefined;
  isCheckingHealth: boolean;
  healthError: any;
  availableStations: any[];
  isLoadingStations: boolean;
  stationsError: any;
  fuelPriceData: any;
  isLoadingPrice: boolean;
  priceError: any;

  // Computed values
  isApiAvailable: boolean;
  isRomaniaRoute: boolean;
  setIsRomaniaRoute: (isRomania: boolean) => void;
  isRoundTrip: boolean;
  setIsRoundTrip: (isRoundTrip: boolean) => void;
}

const RouteDetailsContext = createContext<RouteDetailsContextType | undefined>(undefined);

interface RouteDetailsProviderProps {
  children: ReactNode;
}

export const RouteDetailsProvider = ({ children }: RouteDetailsProviderProps) => {
  const [vehicleType, setVehicleType] = useState<VehicleType>(() => {
    const savedVehicleType = localStorage.getItem('vehicleType') as VehicleType;
    return VEHICLE_TYPES.includes(savedVehicleType) ? savedVehicleType : 'car';
  });

  const [fuelConsumption, setFuelConsumption] = useState<number>(() => {
    const savedConsumption = localStorage.getItem('fuelConsumption');
    const savedVehicleType = localStorage.getItem('vehicleType') as VehicleType;
    const defaultForVehicle = VEHICLE_TYPES.includes(savedVehicleType)
      ? DEFAULT_FUEL_CONSUMPTION[savedVehicleType]
      : DEFAULT_FUEL_CONSUMPTION.car;
    return savedConsumption ? parseFloat(savedConsumption) : defaultForVehicle;
  });

  const [fuelType, setFuelType] = useState<FuelType>(() => {
    const savedFuelType = localStorage.getItem('fuelType') as FuelType;
    return FUEL_TYPES.includes(savedFuelType) ? savedFuelType : 'benzina-regular';
  });

  const [selectedStation, setSelectedStation] = useState<string>(() => {
    return localStorage.getItem('selectedStation') || '';
  });

  const [isRomaniaRoute, setIsRomaniaRoute] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  // API hooks
  const { data: isApiHealthy, isLoading: isCheckingHealth, error: healthError } = useApiHealth();
  const {
    data: availableStations = [],
    isLoading: isLoadingStations,
    error: stationsError
  } = useAvailableStations();
  const {
    data: fuelPriceData,
    isLoading: isLoadingPrice,
    error: priceError
  } = useFuelPrice(selectedStation, fuelType);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('vehicleType', vehicleType);
  }, [vehicleType]);

  useEffect(() => {
    localStorage.setItem('fuelConsumption', fuelConsumption.toString());
  }, [fuelConsumption]);

  useEffect(() => {
    localStorage.setItem('fuelType', fuelType);
  }, [fuelType]);

  useEffect(() => {
    localStorage.setItem('selectedStation', selectedStation);
  }, [selectedStation]);

  // Update fuel consumption when vehicle type changes
  useEffect(() => {
    const savedConsumption = localStorage.getItem('fuelConsumption');
    if (!savedConsumption) {
      setFuelConsumption(DEFAULT_FUEL_CONSUMPTION[vehicleType]);
    }
  }, [vehicleType]);

  const isApiAvailable = isApiHealthy !== false && !healthError;

  const value: RouteDetailsContextType = {
    vehicleType,
    setVehicleType,
    fuelConsumption,
    setFuelConsumption,
    fuelType,
    setFuelType,
    selectedStation,
    setSelectedStation,
    isApiHealthy,
    isCheckingHealth,
    healthError,
    availableStations,
    isLoadingStations,
    stationsError,
    fuelPriceData,
    isLoadingPrice,
    priceError,
    isApiAvailable,
    isRomaniaRoute,
    setIsRomaniaRoute,
    isRoundTrip,
    setIsRoundTrip,
  };

  return (
    <RouteDetailsContext.Provider value={value}>
      {children}
    </RouteDetailsContext.Provider>
  );
};

export const useRouteDetails = () => {
  const context = useContext(RouteDetailsContext);
  if (context === undefined) {
    throw new Error('useRouteDetails must be used within a RouteDetailsProvider');
  }
  return context;
};
