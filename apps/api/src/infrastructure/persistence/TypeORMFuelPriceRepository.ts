import { Repository, Between, Like } from 'typeorm';
import { FuelPrice } from '@domain/entities/FuelPrice';
import { IFuelPriceRepository } from '@domain/ports/IFuelPriceRepository';
import { FuelPriceQuery } from '@app-types/scraper';
import { QUERY_DEFAULTS } from '@config/scraper';

export class TypeORMFuelPriceRepository implements IFuelPriceRepository {
    constructor(private repository: Repository<FuelPrice>) { }

    async findAll(
        query: FuelPriceQuery,
        skip: number,
        take: number,
        sortBy: string,
        sortOrder: 'ASC' | 'DESC'
    ): Promise<[FuelPrice[], number]> {
        const whereConditions = this.buildWhereConditions(query);

        return await this.repository.findAndCount({
            where: whereConditions,
            order: { [sortBy]: sortOrder },
            skip,
            take,
        });
    }

    async findLatestOnly(
        query: FuelPriceQuery,
        skip: number,
        take: number
    ): Promise<{ data: FuelPrice[]; total: number }> {
        let queryBuilder = this.repository
            .createQueryBuilder('fp')
            .distinctOn(['fp.stationName'])
            .orderBy('fp.stationName')
            .addOrderBy('fp.scrapedAt', 'DESC');

        if (query.stationName) {
            queryBuilder = queryBuilder.andWhere('fp.stationName ILIKE :stationName', {
                stationName: `%${query.stationName}%`,
            });
        }

        if (query.fuelType) {
            queryBuilder = queryBuilder.andWhere('fp.fuelType = :fuelType', {
                fuelType: query.fuelType,
            });
        }

        if (query.location) {
            queryBuilder = queryBuilder.andWhere('fp.location ILIKE :location', {
                location: `%${query.location}%`,
            });
        }

        if (query.minPrice || query.maxPrice) {
            queryBuilder = queryBuilder.andWhere(
                'fp.price BETWEEN :minPrice AND :maxPrice',
                {
                    minPrice: query.minPrice || QUERY_DEFAULTS.MIN_PRICE,
                    maxPrice: query.maxPrice || QUERY_DEFAULTS.MAX_PRICE,
                }
            );
        }

        if (query.dateFrom || query.dateTo) {
            const from = query.dateFrom
                ? new Date(query.dateFrom)
                : new Date('1900-01-01');
            const to = query.dateTo ? new Date(query.dateTo) : new Date();
            queryBuilder = queryBuilder.andWhere(
                'fp.scrapedAt BETWEEN :from AND :to',
                { from, to }
            );
        }

        const allLatestPrices = await queryBuilder.getMany();
        const total = allLatestPrices.length;
        const data = allLatestPrices.slice(skip, skip + take);

        return { data, total };
    }

    async findOneByStationAndFuelType(
        stationName: string,
        fuelType?: string
    ): Promise<FuelPrice | null> {
        const whereConditions: any = {
            stationName: Like(`%${stationName}%`),
        };

        if (fuelType) {
            whereConditions.fuelType = fuelType;
        }

        return await this.repository.findOne({
            where: whereConditions,
            order: { scrapedAt: 'DESC' },
        });
    }

    async save(fuelPrice: Partial<FuelPrice>): Promise<FuelPrice> {
        return await this.repository.save(fuelPrice as FuelPrice);
    }

    async saveMany(fuelPrices: Partial<FuelPrice>[]): Promise<FuelPrice[]> {
        return await this.repository.save(fuelPrices as FuelPrice[]);
    }

    private buildWhereConditions(query: FuelPriceQuery): any {
        const whereConditions: any = {};

        if (query.stationName) {
            whereConditions.stationName = Like(`%${query.stationName}%`);
        }

        if (query.fuelType) {
            whereConditions.fuelType = query.fuelType;
        }

        if (query.location) {
            whereConditions.location = Like(`%${query.location}%`);
        }

        if (query.minPrice || query.maxPrice) {
            whereConditions.price = Between(
                query.minPrice || QUERY_DEFAULTS.MIN_PRICE,
                query.maxPrice || QUERY_DEFAULTS.MAX_PRICE
            );
        }

        if (query.dateFrom || query.dateTo) {
            const from = query.dateFrom
                ? new Date(query.dateFrom)
                : new Date('1900-01-01');
            const to = query.dateTo ? new Date(query.dateTo) : new Date();
            whereConditions.scrapedAt = Between(from, to);
        }

        return whereConditions;
    }
}
