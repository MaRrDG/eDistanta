import { IScraper } from '@domain/ports/IScraper';
import { IFuelPriceRepository } from '@domain/ports/IFuelPriceRepository';
import { ScrapedFuelPrice, ScrapingResult, ScrapingStatus } from '@app-types/scraper';
import { SCRAPER_CONFIG } from '@config/scraper';
import { logInfo, logError, logWarn } from '@config/logger';

export class ScrapeFuelPricesUseCase {
    private isRunning = false;

    constructor(
        private fuelPriceRepository: IFuelPriceRepository,
        private scrapers: IScraper[]
    ) { }

    public async execute(): Promise<void> {
        if (this.isRunning) {
            logWarn('Scraping is already running, skipping this execution');
            return;
        }

        this.isRunning = true;

        try {
            logInfo('Starting fuel price scraping');

            const scrapedPrices = await Promise.allSettled(
                this.scrapers.map(scraper => scraper.scrape())
            );

            const allPrices: ScrapedFuelPrice[] = [];

            scrapedPrices.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    allPrices.push(...result.value);
                } else {
                    logError(`Scraping failed for source ${this.scrapers[index].getName()}:`, { error: result.reason });
                }
            });

            if (allPrices.length > 0) {
                await this.fuelPriceRepository.saveMany(allPrices);
                logInfo(`Successfully scraped and saved ${allPrices.length} fuel prices`);
            } else {
                logWarn('No fuel prices were scraped');
            }
        } catch (error) {
            logError('Error during fuel price scraping:', { error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
            this.isRunning = false;
        }
    }

    public getStatus(): ScrapingStatus {
        return {
            isRunning: this.isRunning,
        };
    }
}
