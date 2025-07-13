import { Repository, Between, Like, SelectQueryBuilder } from 'typeorm';
import { FuelPrice } from '../entities/FuelPrice';
import { FuelPriceQuery, PaginationResult } from '../types/scraper';
import { QUERY_DEFAULTS } from '../config/scraper';

export class FuelPriceQueryService {
  constructor(private repository: Repository<FuelPrice>) {}

  async getFuelPrices(query: FuelPriceQuery): Promise<PaginationResult<FuelPrice>> {
    const {
      page = QUERY_DEFAULTS.PAGE,
      limit = QUERY_DEFAULTS.LIMIT,
      latestOnly = QUERY_DEFAULTS.LATEST_ONLY,
      sortBy = QUERY_DEFAULTS.SORT_BY,
      sortOrder = QUERY_DEFAULTS.SORT_ORDER
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let fuelPrices: FuelPrice[];
    let total: number;

    if (latestOnly) {
      const result = await this.getLatestPricesOnly(query, skip, limitNumber);
      fuelPrices = result.data;
      total = result.total;
    } else {
      [fuelPrices, total] = await this.getAllPrices(query, skip, limitNumber, sortBy, sortOrder);
    }

    return {
      data: fuelPrices,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber)
      }
    };
  }

  async getLatestFuelPriceByStationAndFuelType(stationName: string, fuelType?: string): Promise<FuelPrice | null> {
    const whereConditions: any = {
      stationName: Like(`%${stationName}%`)
    };

    if (fuelType) {
      whereConditions.fuelType = fuelType;
    }

    return await this.repository.findOne({
      where: whereConditions,
      order: { scrapedAt: 'DESC' }
    });
  }

  private async getAllPrices(
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
      take
    });
  }

  private async getLatestPricesOnly(
    query: FuelPriceQuery,
    skip: number,
    take: number
  ): Promise<{ data: FuelPrice[]; total: number }> {
    let queryBuilder = this.repository
      .createQueryBuilder('fp')
      .distinctOn(['fp.stationName'])
      .orderBy('fp.stationName')
      .addOrderBy('fp.scrapedAt', 'DESC');

    queryBuilder = this.applyFilters(queryBuilder, query);

    const allLatestPrices = await queryBuilder.getMany();
    const total = allLatestPrices.length;
    const data = allLatestPrices.slice(skip, skip + take);

    return { data, total };
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
      const from = query.dateFrom ? new Date(query.dateFrom) : new Date('1900-01-01');
      const to = query.dateTo ? new Date(query.dateTo) : new Date();
      whereConditions.scrapedAt = Between(from, to);
    }

    return whereConditions;
  }

  private applyFilters(queryBuilder: SelectQueryBuilder<FuelPrice>, query: FuelPriceQuery): SelectQueryBuilder<FuelPrice> {
    if (query.stationName) {
      queryBuilder = queryBuilder.where('fp.stationName ILIKE :stationName', { 
        stationName: `%${query.stationName}%` 
      });
    }

    if (query.fuelType) {
      queryBuilder = queryBuilder.andWhere('fp.fuelType = :fuelType', { 
        fuelType: query.fuelType 
      });
    }

    if (query.location) {
      queryBuilder = queryBuilder.andWhere('fp.location ILIKE :location', { 
        location: `%${query.location}%` 
      });
    }

    if (query.minPrice || query.maxPrice) {
      queryBuilder = queryBuilder.andWhere('fp.price BETWEEN :minPrice AND :maxPrice', {
        minPrice: query.minPrice || QUERY_DEFAULTS.MIN_PRICE,
        maxPrice: query.maxPrice || QUERY_DEFAULTS.MAX_PRICE
      });
    }

    if (query.dateFrom || query.dateTo) {
      const from = query.dateFrom ? new Date(query.dateFrom) : new Date('1900-01-01');
      const to = query.dateTo ? new Date(query.dateTo) : new Date();
      queryBuilder = queryBuilder.andWhere('fp.scrapedAt BETWEEN :from AND :to', { from, to });
    }

    return queryBuilder;
  }
} 