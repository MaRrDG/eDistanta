import { FuelPrice } from '@domain/entities/FuelPrice';
import { IFuelPriceRepository } from '@domain/ports/IFuelPriceRepository';
import { FuelPriceQuery, PaginationResult } from '@app-types/scraper';
import { QUERY_DEFAULTS } from '@config/scraper';

export class GetFuelPricesUseCase {
    constructor(private fuelPriceRepository: IFuelPriceRepository) { }

    async execute(
        query: FuelPriceQuery
    ): Promise<PaginationResult<FuelPrice>> {
        const {
            page = QUERY_DEFAULTS.PAGE,
            limit = QUERY_DEFAULTS.LIMIT,
            latestOnly = QUERY_DEFAULTS.LATEST_ONLY,
            sortBy = QUERY_DEFAULTS.SORT_BY,
            sortOrder = QUERY_DEFAULTS.SORT_ORDER,
        } = query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        let fuelPrices: FuelPrice[];
        let total: number;

        if (latestOnly) {
            const result = await this.fuelPriceRepository.findLatestOnly(query, skip, limitNumber);
            fuelPrices = result.data;
            total = result.total;
        } else {
            [fuelPrices, total] = await this.fuelPriceRepository.findAll(
                query,
                skip,
                limitNumber,
                sortBy,
                sortOrder
            );
        }

        return {
            data: fuelPrices,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber),
            },
        };
    }

    async getLatestByStation(
        stationName: string,
        fuelType?: string
    ): Promise<FuelPrice | null> {
        return await this.fuelPriceRepository.findOneByStationAndFuelType(stationName, fuelType);
    }
}
