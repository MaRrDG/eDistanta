import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the data (we'll need to compile this or use a different approach)
const POPULAR_ROUTES = [
  // Bucharest ↔ major cities
  { from: "bucuresti", to: "cluj-napoca", slug: "bucuresti-cluj-napoca", searchVolume: 8900, priority: 10 },
  { from: "bucuresti", to: "timisoara", slug: "bucuresti-timisoara", searchVolume: 6700, priority: 9 },
  { from: "bucuresti", to: "iasi", slug: "bucuresti-iasi", searchVolume: 5800, priority: 9 },
  { from: "bucuresti", to: "constanta", slug: "bucuresti-constanta", searchVolume: 12000, priority: 10 },
  { from: "bucuresti", to: "brasov", slug: "bucuresti-brasov", searchVolume: 9200, priority: 10 },
  { from: "bucuresti", to: "sibiu", slug: "bucuresti-sibiu", searchVolume: 3100, priority: 8 },
  { from: "bucuresti", to: "oradea", slug: "bucuresti-oradea", searchVolume: 2000, priority: 7 },

  // Tourist routes
  { from: "bucuresti", to: "sinaia", slug: "bucuresti-sinaia", searchVolume: 2200, priority: 8 },
  { from: "bucuresti", to: "busteni", slug: "bucuresti-busteni", searchVolume: 2100, priority: 8 },
  { from: "bucuresti", to: "bran", slug: "bucuresti-bran", searchVolume: 2500, priority: 8 },
  { from: "bucuresti", to: "sighisoara", slug: "bucuresti-sighisoara", searchVolume: 1800, priority: 7 },
  { from: "bucuresti", to: "murighiol", slug: "bucuresti-delta-dunarii", searchVolume: 2000, priority: 8 },
  { from: "bucuresti", to: "mamaia", slug: "bucuresti-mamaia", searchVolume: 4500, priority: 8 },

  // Regional routes
  { from: "cluj-napoca", to: "timisoara", slug: "cluj-napoca-timisoara", searchVolume: 2800, priority: 8 },
  { from: "cluj-napoca", to: "iasi", slug: "cluj-napoca-iasi", searchVolume: 2200, priority: 7 },
  { from: "cluj-napoca", to: "brasov", slug: "cluj-napoca-brasov", searchVolume: 2600, priority: 7 },
  { from: "iasi", to: "suceava", slug: "iasi-suceava", searchVolume: 1400, priority: 6 },
  { from: "timisoara", to: "arad", slug: "timisoara-arad", searchVolume: 1800, priority: 6 },

  // Reverse (important SEO)
  { from: "cluj-napoca", to: "bucuresti", slug: "cluj-napoca-bucuresti", searchVolume: 8900, priority: 10 },
  { from: "constanta", to: "bucuresti", slug: "constanta-bucuresti", searchVolume: 12000, priority: 10 },
  { from: "brasov", to: "bucuresti", slug: "brasov-bucuresti", searchVolume: 9200, priority: 10 },
  { from: "bran", to: "bucuresti", slug: "bran-bucuresti", searchVolume: 2500, priority: 8 },
  { from: "sinaia", to: "bucuresti", slug: "sinaia-bucuresti", searchVolume: 2200, priority: 8 },
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
