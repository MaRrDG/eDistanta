import { POPULAR_ROUTES, ROMANIAN_CITIES } from '../data/popularRoutes';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export const generateSitemapUrls = (baseUrl: string = 'https://edistanta.ro'): SitemapUrl[] => {
  const urls: SitemapUrl[] = [];
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  // Homepage
  urls.push({
    loc: baseUrl,
    lastmod: currentDate,
    changefreq: 'daily',
    priority: '1.0'
  });

  // Popular routes - sorted by priority
  const sortedRoutes = [...POPULAR_ROUTES].sort((a, b) => b.priority - a.priority);
  
  sortedRoutes.forEach(route => {
    const priority = route.priority >= 9 ? '0.9' : 
                    route.priority >= 7 ? '0.8' : 
                    route.priority >= 5 ? '0.7' : '0.6';
    
    urls.push({
      loc: `${baseUrl}/ruta/${route.slug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority
    });
  });

  return urls;
};

export const generateSitemapXml = (urls: SitemapUrl[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';
  const urlsetClose = '</urlset>';

  const urlElements = urls.map(url => `
   <url>
      <loc>${url.loc}</loc>
      <lastmod>${url.lastmod}</lastmod>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
   </url>`).join('');

  return `${xmlHeader}
${urlsetOpen}${urlElements}

${urlsetClose}`;
};

// Generate robots.txt content
export const generateRobotsTxt = (baseUrl: string = 'https://edistanta.ro'): string => {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Block access to API endpoints and admin areas
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/

# Allow important pages
Allow: /ruta/
Allow: /

# Block common bot traps
Disallow: /*?*
Disallow: /*#*
Disallow: /*.json$
Disallow: /*.xml$
`;
};

// SEO meta tags for different route types
export const getRouteMetaTags = (fromCity: string, toCity: string) => {
  const fromCityData = ROMANIAN_CITIES.find(city => city.slug === fromCity);
  const toCityData = ROMANIAN_CITIES.find(city => city.slug === toCity);
  
  if (!fromCityData || !toCityData) {
    return {
      title: 'Calculează Distanța - eDistanta',
      description: 'Calculează distanțele rutiere în România cu informații despre combustibil și costuri de călătorie.',
      keywords: 'distante rutiere, romania, calculator rute, combustibil, preturi carburant'
    };
  }

  const title = `Distanța ${fromCityData.name} - ${toCityData.name} | Rută Optimizată | eDistanta`;
  const description = `Calculează distanța rutieră ${fromCityData.name} - ${toCityData.name}. Găsește cea mai bună rută, timpul de călătorie, consumul de combustibil și costurile. Informații actualizate despre prețurile carburantului în România.`;
  const keywords = `distanta ${fromCityData.name} ${toCityData.name}, distante rutiere ${fromCityData.name} ${toCityData.name}, ruta ${fromCityData.name} ${toCityData.name}, ${fromCityData.name} ${toCityData.name} km, calculator distante romania, combustibil ${fromCityData.name} ${toCityData.name}`;

  return { title, description, keywords };
};

// Generate structured data for routes
export const generateRouteStructuredData = (fromCity: string, toCity: string, distance?: number, duration?: number) => {
  const fromCityData = ROMANIAN_CITIES.find(city => city.slug === fromCity);
  const toCityData = ROMANIAN_CITIES.find(city => city.slug === toCity);
  
  if (!fromCityData || !toCityData) return null;

  const baseData = {
    "@context": "https://schema.org",
    "@type": "TravelAction",
    "name": `Ruta ${fromCityData.name} - ${toCityData.name}`,
    "description": `Calculează distanța rutieră între ${fromCityData.name} și ${toCityData.name}`,
    "fromLocation": {
      "@type": "Place",
      "name": fromCityData.name,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "RO",
        "addressRegion": fromCityData.county
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": fromCityData.coordinates[0],
        "longitude": fromCityData.coordinates[1]
      }
    },
    "toLocation": {
      "@type": "Place",
      "name": toCityData.name,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "RO",
        "addressRegion": toCityData.county
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": toCityData.coordinates[0],
        "longitude": toCityData.coordinates[1]
      }
    },
    "provider": {
      "@type": "Organization",
      "name": "eDistanta",
      "url": "https://edistanta.ro"
    }
  };

  // Add distance and duration if available
  if (distance && duration) {
    return {
      ...baseData,
      "distance": `${distance.toFixed(1)} km`,
      "duration": `PT${Math.floor(duration)}M` // ISO 8601 duration format
    };
  }

  return baseData;
};
