import { Request, Response } from 'express';
import { FuelPrice } from '@domain/entities/FuelPrice';
import { GetFuelPricesUseCase } from '@application/use-cases/GetFuelPricesUseCase';
import { ScrapeFuelPricesUseCase } from '@application/use-cases/ScrapeFuelPricesUseCase';
import { FuelPriceQuery, ApiResponse } from '@app-types/scraper';
import { logError, logInfo, logDebug } from '@config/logger';

export class FuelPriceController {
  constructor(
    private getFuelPricesUseCase: GetFuelPricesUseCase,
    private scrapeFuelPricesUseCase: ScrapeFuelPricesUseCase
  ) { }

  public getFuelPrices = async (req: Request, res: Response): Promise<void> => {
    const requestId = req.headers['x-request-id'];
    try {
      const query: FuelPriceQuery = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        stationName: req.query.stationName as string,
        fuelType: req.query.fuelType as string,
        location: req.query.location as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC',
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        latestOnly: req.query.latestOnly === 'true',
      };

      logDebug('Fetching fuel prices', { query, requestId });

      const result = await this.getFuelPricesUseCase.execute(query);

      logInfo('Fuel prices fetched successfully', {
        count: result.data.length,
        requestId,
      });

      const response: ApiResponse<FuelPrice[]> = {
        success: true,
        data: result.data,
        ...(result.pagination && { pagination: result.pagination }),
      };

      res.json(response);
    } catch (error) {
      logError('Error fetching fuel prices', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        requestId,
      });
      const response: ApiResponse<never> = {
        success: false,
        message: 'Error fetching fuel prices',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      res.status(500).json(response);
    }
  };

  public getLatestFuelPriceByStationAndFuelType = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const requestId = req.headers['x-request-id'];
    try {
      const { stationName, fuelType } = req.params;

      logDebug('Fetching latest fuel price by station and fuel type', {
        stationName,
        fuelType,
        requestId,
      });

      const fuelPrice =
        await this.getFuelPricesUseCase.getLatestByStation(
          stationName,
          fuelType
        );

      logInfo('Latest fuel price fetched successfully', {
        stationName,
        fuelType,
        found: !!fuelPrice,
        requestId,
      });

      const response: ApiResponse<FuelPrice | null> = {
        success: true,
        data: fuelPrice,
        count: fuelPrice ? 1 : 0,
      };

      res.json(response);
    } catch (error) {
      logError('Error fetching fuel prices by station', {
        stationName: req.params.stationName,
        fuelType: req.params.fuelType,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        requestId,
      });
      const response: ApiResponse<never> = {
        success: false,
        message: 'Error fetching fuel prices by station',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      res.status(500).json(response);
    }
  };

  public triggerManualScraping = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const requestId = req.headers['x-request-id'];
    try {
      logInfo('Manual scraping triggered', { requestId });

      await this.scrapeFuelPricesUseCase.execute();

      logInfo('Manual scraping completed', {
        requestId,
      });

      const response: ApiResponse<never> = {
        success: true,
        message: 'Manual scraping triggered successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      logError('Error triggering manual scraping', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        requestId,
      });
      const response: ApiResponse<never> = {
        success: false,
        message: 'Error triggering manual scraping',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      res.status(500).json(response);
    }
  };

  public getScrapingStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const requestId = req.headers['x-request-id'];
    try {
      logDebug('Fetching scraping status', { requestId });

      const status = this.scrapeFuelPricesUseCase.getStatus();

      const response: ApiResponse<typeof status> = {
        success: true,
        data: status,
      };

      res.json(response);
    } catch (error) {
      logError('Error getting scraping status', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        requestId,
      });
      const response: ApiResponse<never> = {
        success: false,
        message: 'Error getting scraping status',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      res.status(500).json(response);
    }
  };
}
