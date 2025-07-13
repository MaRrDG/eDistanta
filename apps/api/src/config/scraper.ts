export const SCRAPER_CONFIG = {
  DEFAULT_CRON_SCHEDULE: '0 10 * * *',
  DEFAULT_TIMEOUT: 15000,
  REQUEST_DELAY: 1000,
  DEFAULT_CURRENCY: 'RON',
  MAX_RETRIES: 3,
} as const;

export const PECO_ONLINE_CONFIG = {
  BASE_URL: 'https://www.peco-online.ro/index.php',
  FUEL_TYPES: ['Benzina_Regular', 'Benzina_Premium', 'Motorina_Regular', 'Motorina_Premium', 'GPL'],
  CITIES: ['Bucuresti'],
  NETWORKS: ['Gazprom', 'Lukoil', 'Mol', 'OMV', 'Petrom', 'Rompetrol', 'Socar'],
  HEADERS: {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en-GB;q=0.9,en;q=0.8,ro;q=0.7',
    'cache-control': 'max-age=0',
    'content-type': 'application/x-www-form-urlencoded',
    'origin': 'https://www.peco-online.ro',
    'priority': 'u=0, i',
    'referer': 'https://www.peco-online.ro/index.php',
    'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
  }
} as const;

export const QUERY_DEFAULTS = {
  PAGE: 1,
  LIMIT: 50,
  SORT_BY: 'scrapedAt',
  SORT_ORDER: 'DESC' as const,
  MIN_PRICE: 0,
  MAX_PRICE: 999999,
  LATEST_ONLY: false,
} as const; 