import cron from 'node-cron';
import { ScrapeFuelPricesUseCase } from '@application/use-cases/ScrapeFuelPricesUseCase';
import { SCRAPER_CONFIG } from '@config/scraper';
import { logInfo, logError } from '@config/logger';

export class FuelPriceScraperScheduler {
    constructor(private scrapeFuelPricesUseCase: ScrapeFuelPricesUseCase) { }

    public initialize(): void {
        const cronSchedule1 = process.env.SCRAPING_CRON_SCHEDULE_1 || SCRAPER_CONFIG.DEFAULT_CRON_SCHEDULE;
        const cronSchedule2 = process.env.SCRAPING_CRON_SCHEDULE_2 || '0 22 * * *';
        const scrapingEnabled = process.env.SCRAPING_ENABLED === 'true';

        if (scrapingEnabled) {
            // First cron job
            cron.schedule(cronSchedule1, async () => {
                logInfo('Starting scheduled fuel price scraping (Schedule 1)');
                try {
                    await this.scrapeFuelPricesUseCase.execute();
                } catch (error) {
                    logError('Error in scheduled scraping (Schedule 1)', {
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            });

            // Second cron job
            cron.schedule(cronSchedule2, async () => {
                logInfo('Starting scheduled fuel price scraping (Schedule 2)');
                try {
                    await this.scrapeFuelPricesUseCase.execute();
                } catch (error) {
                    logError('Error in scheduled scraping (Schedule 2)', {
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            });

            logInfo(`Fuel price scraping scheduled with cron 1: ${cronSchedule1}`);
            logInfo(`Fuel price scraping scheduled with cron 2: ${cronSchedule2}`);
        } else {
            logInfo('Fuel price scraping is disabled');
        }
    }
}
