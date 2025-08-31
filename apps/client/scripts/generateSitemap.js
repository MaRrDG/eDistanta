import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the data (we'll need to compile this or use a different approach)
const POPULAR_ROUTES = [
  // Bucharest routes (highest priority)
  { from: "bucuresti", to: "cluj-napoca", slug: "bucuresti-cluj-napoca", searchVolume: 8900, priority: 10 },
  { from: "bucuresti", to: "timisoara", slug: "bucuresti-timisoara", searchVolume: 6700, priority: 9 },
  { from: "bucuresti", to: "iasi", slug: "bucuresti-iasi", searchVolume: 5800, priority: 9 },
  { from: "bucuresti", to: "constanta", slug: "bucuresti-constanta", searchVolume: 12000, priority: 10 },
  { from: "bucuresti", to: "brasov", slug: "bucuresti-brasov", searchVolume: 9200, priority: 10 },
  { from: "bucuresti", to: "craiova", slug: "bucuresti-craiova", searchVolume: 4500, priority: 8 },
  { from: "bucuresti", to: "galati", slug: "bucuresti-galati", searchVolume: 3200, priority: 7 },
  { from: "bucuresti", to: "ploiesti", slug: "bucuresti-ploiesti", searchVolume: 2800, priority: 7 },
  { from: "bucuresti", to: "pitesti", slug: "bucuresti-pitesti", searchVolume: 2400, priority: 7 },
  { from: "bucuresti", to: "sibiu", slug: "bucuresti-sibiu", searchVolume: 3100, priority: 7 },
  
  // Major inter-city routes
  { from: "cluj-napoca", to: "timisoara", slug: "cluj-napoca-timisoara", searchVolume: 2800, priority: 8 },
  { from: "cluj-napoca", to: "iasi", slug: "cluj-napoca-iasi", searchVolume: 2200, priority: 7 },
  { from: "cluj-napoca", to: "brasov", slug: "cluj-napoca-brasov", searchVolume: 2600, priority: 7 },
  { from: "timisoara", to: "arad", slug: "timisoara-arad", searchVolume: 1800, priority: 6 },
  { from: "timisoara", to: "craiova", slug: "timisoara-craiova", searchVolume: 1500, priority: 6 },
  { from: "iasi", to: "bacau", slug: "iasi-bacau", searchVolume: 1600, priority: 6 },
  { from: "iasi", to: "suceava", slug: "iasi-suceava", searchVolume: 1400, priority: 6 },
  { from: "constanta", to: "galati", slug: "constanta-galati", searchVolume: 1200, priority: 6 },
  { from: "constanta", to: "braila", slug: "constanta-braila", searchVolume: 900, priority: 5 },
  { from: "craiova", to: "galati", slug: "craiova-galati", searchVolume: 800, priority: 5 },
  { from: "brasov", to: "sibiu", slug: "brasov-sibiu", searchVolume: 1100, priority: 6 },
  
  // Tourist routes (seasonal high search volume)
  { from: "bucuresti", to: "mamaia", slug: "bucuresti-mamaia", searchVolume: 4500, priority: 8 },
  { from: "bucuresti", to: "sinaia", slug: "bucuresti-sinaia", searchVolume: 2200, priority: 7 },
  { from: "bucuresti", to: "predeal", slug: "bucuresti-predeal", searchVolume: 1800, priority: 6 },
  { from: "bucuresti", to: "poiana-brasov", slug: "bucuresti-poiana-brasov", searchVolume: 1600, priority: 6 },
  { from: "cluj-napoca", to: "mamaia", slug: "cluj-napoca-mamaia", searchVolume: 1200, priority: 5 },
  { from: "timisoara", to: "mamaia", slug: "timisoara-mamaia", searchVolume: 1000, priority: 5 },
  { from: "constanta", to: "vama-veche", slug: "constanta-vama-veche", searchVolume: 800, priority: 5 },
  
  // Regional routes
  { from: "oradea", to: "cluj-napoca", slug: "oradea-cluj-napoca", searchVolume: 1500, priority: 6 },
  { from: "oradea", to: "timisoara", slug: "oradea-timisoara", searchVolume: 1200, priority: 5 },
  { from: "targu-mures", to: "cluj-napoca", slug: "targu-mures-cluj-napoca", searchVolume: 1100, priority: 5 },
  { from: "baia-mare", to: "cluj-napoca", slug: "baia-mare-cluj-napoca", searchVolume: 1000, priority: 5 },
  { from: "satu-mare", to: "oradea", slug: "satu-mare-oradea", searchVolume: 800, priority: 4 },
  { from: "deva", to: "timisoara", slug: "deva-timisoara", searchVolume: 700, priority: 4 },
  { from: "alba-iulia", to: "cluj-napoca", slug: "alba-iulia-cluj-napoca", searchVolume: 900, priority: 4 },
  
  // Reverse routes (important for SEO)
  { from: "cluj-napoca", to: "bucuresti", slug: "cluj-napoca-bucuresti", searchVolume: 8900, priority: 10 },
  { from: "timisoara", to: "bucuresti", slug: "timisoara-bucuresti", searchVolume: 6700, priority: 9 },
  { from: "iasi", to: "bucuresti", slug: "iasi-bucuresti", searchVolume: 5800, priority: 9 },
  { from: "constanta", to: "bucuresti", slug: "constanta-bucuresti", searchVolume: 12000, priority: 10 },
  { from: "brasov", to: "bucuresti", slug: "brasov-bucuresti", searchVolume: 9200, priority: 10 },
  { from: "craiova", to: "bucuresti", slug: "craiova-bucuresti", searchVolume: 4500, priority: 8 },
  { from: "galati", to: "bucuresti", slug: "galati-bucuresti", searchVolume: 3200, priority: 7 },
  { from: "mamaia", to: "bucuresti", slug: "mamaia-bucuresti", searchVolume: 4500, priority: 8 },
];

const generateSitemapUrls = (baseUrl = 'https://edistanta.ro') => {
  const urls = [];
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

const generateSitemapXml = (urls) => {
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

const generateRobotsTxt = (baseUrl = 'https://edistanta.ro') => {
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

// Generate and save files
const publicDir = path.join(__dirname, '..', 'public');

// Generate sitemap
const urls = generateSitemapUrls();
const sitemapXml = generateSitemapXml(urls);
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);

// Generate robots.txt
const robotsTxt = generateRobotsTxt();
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);

console.log(`Generated sitemap with ${urls.length} URLs`);
console.log('Files created:');
console.log('- public/sitemap.xml');
console.log('- public/robots.txt');
