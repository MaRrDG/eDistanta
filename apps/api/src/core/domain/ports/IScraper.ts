import { ScrapedFuelPrice } from '@app-types/scraper';

export interface IScraper {
    scrape(): Promise<ScrapedFuelPrice[]>;
    getName(): string;
}
