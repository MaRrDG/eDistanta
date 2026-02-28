import { FuelPrice } from '@domain/entities/FuelPrice';
import { FuelPriceQuery } from '@app-types/scraper';

export interface IFuelPriceRepository {
    findAll(query: FuelPriceQuery, skip: number, take: number, sortBy: string, sortOrder: 'ASC' | 'DESC'): Promise<[FuelPrice[], number]>;
    findLatestOnly(query: FuelPriceQuery, skip: number, take: number): Promise<{ data: FuelPrice[]; total: number }>;
    findOneByStationAndFuelType(stationName: string, fuelType?: string): Promise<FuelPrice | null>;
    save(fuelPrice: Partial<FuelPrice>): Promise<FuelPrice>;
    saveMany(fuelPrices: Partial<FuelPrice>[]): Promise<FuelPrice[]>;
}
