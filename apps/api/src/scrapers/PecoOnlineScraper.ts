import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedFuelPrice } from '../types/scraper';
import { PECO_ONLINE_CONFIG, SCRAPER_CONFIG } from '../config/scraper';

export class PecoOnlineScraper {
  async scrape(): Promise<ScrapedFuelPrice[]> {
    try {
      const stationMap = new Map<string, ScrapedFuelPrice>();

      for (const fuelType of PECO_ONLINE_CONFIG.FUEL_TYPES) {
        for (const city of PECO_ONLINE_CONFIG.CITIES) {
          try {
            const prices = await this.scrapeFuelTypeForCity(fuelType, city);

            prices.forEach(price => {
              const stationKey = `${price.stationName}_${fuelType}`;
              if (!stationMap.has(stationKey)) {
                stationMap.set(stationKey, price);
              }
            });

            await this.delay(SCRAPER_CONFIG.REQUEST_DELAY);
          } catch (error) {
            console.error(
              `Error scraping ${fuelType} prices for ${city}:`,
              error instanceof Error ? error.message : 'Unknown error'
            );
          }
        }
      }

      const allPrices = Array.from(stationMap.values());
      console.info(
        `Successfully scraped ${allPrices.length} unique stations from PECO Online`
      );
      return allPrices;
    } catch (error) {
      console.error('Error scraping PECO Online:', error);
      return [];
    }
  }

  private async scrapeFuelTypeForCity(
    fuelType: string,
    city: string
  ): Promise<ScrapedFuelPrice[]> {
    const formData = this.buildFormData(fuelType, city);

    const response = await axios.post(PECO_ONLINE_CONFIG.BASE_URL, formData, {
      timeout: SCRAPER_CONFIG.DEFAULT_TIMEOUT,
      headers: PECO_ONLINE_CONFIG.HEADERS,
    });

    return this.parseResponse(response.data, fuelType, city);
  }

  private buildFormData(fuelType: string, city: string): URLSearchParams {
    const formData = new URLSearchParams();
    formData.append('carburant', fuelType);
    formData.append('locatie', 'Oras');
    formData.append('nume_locatie', city.toLowerCase());

    PECO_ONLINE_CONFIG.NETWORKS.forEach(network => {
      formData.append('retele[]', network);
    });

    return formData;
  }

  private parseResponse(
    html: string,
    fuelType: string,
    city: string
  ): ScrapedFuelPrice[] {
    const $ = cheerio.load(html);
    const prices: ScrapedFuelPrice[] = [];

    $('.rezultat').each((index, element) => {
      const $element = $(element);

      const priceText = $element.find('h5.pret strong').text().trim();
      const price = parseFloat(priceText.replace(',', '.'));

      const stationName = $element.find('img').attr('alt')?.trim() || '';

      const locationSpans = $element.find('.small.d-block.text-muted');
      const locationText =
        locationSpans.length > 0 ? locationSpans.text().trim() : city;

      const addressSpans = $element
        .find('.flex-grow-1 span')
        .not('.d-block')
        .not('.small');
      const address =
        addressSpans.length > 0 ? addressSpans.last().text().trim() : '';

      if (this.isValidPrice(stationName, price)) {
        prices.push({
          stationName: stationName.toLowerCase(),
          fuelType: fuelType.replace('_', '-').toLowerCase(),
          price: price,
          currency: SCRAPER_CONFIG.DEFAULT_CURRENCY,
          location: locationText,
          address: address,
        });
      }
    });

    return prices;
  }

  private isValidPrice(stationName: string, price: number): boolean {
    return !!(stationName && price && !isNaN(price) && price > 0);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
