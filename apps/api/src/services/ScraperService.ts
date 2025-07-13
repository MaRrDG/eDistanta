import cron from 'node-cron';
import { AppDataSource } from '../config/database';
import { FuelPrice } from '../entities/FuelPrice';
import { ScrapedFuelPrice, ScrapingResult, ScrapingStatus } from '../types/scraper';
import { SCRAPER_CONFIG } from '../config/scraper';
import { PecoOnlineScraper } from '../scrapers/PecoOnlineScraper';

export class ScraperService {
  private fuelPriceRepository = AppDataSource.getRepository(FuelPrice);
  private isRunning = false;
  private scrapers = [new PecoOnlineScraper()];

  constructor() {
    this.initializeScheduler();
  }

  private initializeScheduler(): void {
    const cronSchedule = process.env.SCRAPING_CRON_SCHEDULE || SCRAPER_CONFIG.DEFAULT_CRON_SCHEDULE;
    const scrapingEnabled = process.env.SCRAPING_ENABLED === 'true';

    if (scrapingEnabled) {
      cron.schedule(cronSchedule, async () => {
        console.info('Starting scheduled fuel price scraping');
        await this.scrapeFuelPrices();
      });
      
      console.info(`Fuel price scraping scheduled with cron: ${cronSchedule}`);
    } else {
      console.info('Fuel price scraping is disabled');
    }
  }

  public async scrapeFuelPrices(): Promise<void> {
    if (this.isRunning) {
      console.warn('Scraping is already running, skipping this execution');
      return;
    }

    this.isRunning = true;
    
    try {
      console.info('Starting fuel price scraping');
      
      const scrapedPrices = await Promise.allSettled(
        this.scrapers.map(scraper => scraper.scrape())
      );

      const allPrices: ScrapedFuelPrice[] = [];
      
      scrapedPrices.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allPrices.push(...result.value);
        } else {
          console.error(`Scraping failed for source ${index}:`, result.reason);
        }
      });

      if (allPrices.length > 0) {
        await this.saveFuelPrices(allPrices);
        console.info(`Successfully scraped and saved ${allPrices.length} fuel prices`);
      } else {
        console.warn('No fuel prices were scraped');
      }
      
    } catch (error) {
      console.error('Error during fuel price scraping:', error);
    } finally {
      this.isRunning = false;
    }
  }



  private async saveFuelPrices(prices: ScrapedFuelPrice[]): Promise<void> {
    try {
      const fuelPriceEntities = prices.map(price => {
        const fuelPrice = new FuelPrice();
        fuelPrice.stationName = price.stationName;
        fuelPrice.fuelType = price.fuelType;
        fuelPrice.price = price.price;
        fuelPrice.currency = price.currency || SCRAPER_CONFIG.DEFAULT_CURRENCY;
        fuelPrice.location = price.location;
        fuelPrice.address = price.address;
        fuelPrice.scrapedAt = new Date();
        
        return fuelPrice;
      });

      await this.fuelPriceRepository.save(fuelPriceEntities);
      console.info(`Saved ${fuelPriceEntities.length} fuel prices to database`);
    } catch (error) {
      console.error('Error saving fuel prices to database:', error);
      throw error;
    }
  }

  public async manualScrape(): Promise<ScrapingResult> {
    try {
      if (this.isRunning) {
        return { success: false, message: 'Scraping is already running' };
      }

      await this.scrapeFuelPrices();
      const count = await this.fuelPriceRepository.count();
      
      return { 
        success: true, 
        message: 'Manual scraping completed successfully',
        count 
      };
    } catch (error) {
      console.error('Error during manual scraping:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  public getScrapingStatus(): ScrapingStatus {
    return {
      isRunning: this.isRunning,
    };
  }
}

export const scraperService = new ScraperService(); 