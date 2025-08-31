// Popular Romanian cities and routes for SEO optimization
export interface City {
  name: string;
  slug: string;
  coordinates: [number, number]; // [latitude, longitude]
  county: string;
  population?: number;
}

export interface PopularRoute {
  from: string;
  to: string;
  slug: string;
  searchVolume?: number; // Estimated monthly searches
  priority: number; // 1-10, 10 being highest
}

// Major Romanian cities with coordinates
export const ROMANIAN_CITIES: City[] = [
  // Major cities (population > 200k)
  { name: "București", slug: "bucuresti", coordinates: [44.4268, 26.1025], county: "București", population: 1883425 },
  { name: "Cluj-Napoca", slug: "cluj-napoca", coordinates: [46.7712, 23.6236], county: "Cluj", population: 324576 },
  { name: "Timișoara", slug: "timisoara", coordinates: [45.7489, 21.2087], county: "Timiș", population: 319279 },
  { name: "Iași", slug: "iasi", coordinates: [47.1585, 27.6014], county: "Iași", population: 290422 },
  { name: "Constanța", slug: "constanta", coordinates: [44.1598, 28.6348], county: "Constanța", population: 283872 },
  { name: "Craiova", slug: "craiova", coordinates: [44.3302, 23.7949], county: "Dolj", population: 269506 },
  { name: "Brașov", slug: "brasov", coordinates: [45.6427, 25.5887], county: "Brașov", population: 253200 },
  { name: "Galați", slug: "galati", coordinates: [45.4353, 28.0080], county: "Galați", population: 249432 },
  { name: "Ploiești", slug: "ploiesti", coordinates: [44.9404, 26.0266], county: "Prahova", population: 201226 },
  
  // Important regional centers (population 100k-200k)
  { name: "Oradea", slug: "oradea", coordinates: [47.0465, 21.9189], county: "Bihor", population: 196367 },
  { name: "Brăila", slug: "braila", coordinates: [45.2692, 27.9574], county: "Brăila", population: 180302 },
  { name: "Arad", slug: "arad", coordinates: [46.1866, 21.3123], county: "Arad", population: 159704 },
  { name: "Pitești", slug: "pitesti", coordinates: [44.8565, 24.8692], county: "Argeș", population: 155383 },
  { name: "Sibiu", slug: "sibiu", coordinates: [45.7983, 24.1256], county: "Sibiu", population: 147245 },
  { name: "Bacău", slug: "bacau", coordinates: [46.5670, 26.9146], county: "Bacău", population: 144307 },
  { name: "Târgu Mureș", slug: "targu-mures", coordinates: [46.5427, 24.5574], county: "Mureș", population: 134290 },
  { name: "Baia Mare", slug: "baia-mare", coordinates: [47.6587, 23.5681], county: "Maramureș", population: 123738 },
  { name: "Buzău", slug: "buzau", coordinates: [45.1500, 26.8203], county: "Buzău", population: 115494 },
  { name: "Satu Mare", slug: "satu-mare", coordinates: [47.7910, 22.8571], county: "Satu Mare", population: 102441 },
  
  // Other important cities (50k-100k)
  { name: "Suceava", slug: "suceava", coordinates: [47.6635, 26.2535], county: "Suceava", population: 92121 },
  { name: "Piatra Neamț", slug: "piatra-neamt", coordinates: [46.9226, 26.3712], county: "Neamț", population: 85055 },
  { name: "Târgu Jiu", slug: "targu-jiu", coordinates: [45.0428, 23.2739], county: "Gorj", population: 82504 },
  { name: "Tulcea", slug: "tulcea", coordinates: [45.1784, 28.8009], county: "Tulcea", population: 73707 },
  { name: "Focșani", slug: "focsani", coordinates: [45.6947, 27.1836], county: "Vrancea", population: 72669 },
  { name: "Târgoviște", slug: "targoviste", coordinates: [44.9248, 25.4608], county: "Dâmbovița", population: 72564 },
  { name: "Deva", slug: "deva", coordinates: [45.8647, 22.9018], county: "Hunedoara", population: 61123 },
  { name: "Reșița", slug: "resita", coordinates: [45.3005, 21.8892], county: "Caraș-Severin", population: 73282 },
  { name: "Slatina", slug: "slatina", coordinates: [44.4297, 24.3681], county: "Olt", population: 70293 },
  { name: "Alba Iulia", slug: "alba-iulia", coordinates: [46.0667, 23.5833], county: "Alba", population: 63536 },
  
  // Tourist destinations and important smaller cities
  { name: "Mamaia", slug: "mamaia", coordinates: [44.2500, 28.6167], county: "Constanța" },
  { name: "Sinaia", slug: "sinaia", coordinates: [45.3500, 25.5500], county: "Prahova" },
  { name: "Predeal", slug: "predeal", coordinates: [45.5167, 25.5667], county: "Brașov" },
  { name: "Poiana Brașov", slug: "poiana-brasov", coordinates: [45.5833, 25.5333], county: "Brașov" },
  { name: "Vama Veche", slug: "vama-veche", coordinates: [43.7667, 28.5667], county: "Constanța" },
  { name: "Eforie Nord", slug: "eforie-nord", coordinates: [44.0833, 28.6333], county: "Constanța" },
  { name: "Mangalia", slug: "mangalia", coordinates: [43.8167, 28.5833], county: "Constanța" },
  { name: "Neptun", slug: "neptun", coordinates: [44.1167, 28.6000], county: "Constanța" },
];

// Most searched routes in Romania (based on typical search patterns)
export const POPULAR_ROUTES: PopularRoute[] = [
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

// Helper functions
export const getCityBySlug = (slug: string): City | undefined => {
  return ROMANIAN_CITIES.find(city => city.slug === slug);
};

export const getRouteBySlug = (slug: string): PopularRoute | undefined => {
  return POPULAR_ROUTES.find(route => route.slug === slug);
};

export const getCityCoordinates = (citySlug: string): [number, number] | null => {
  const city = getCityBySlug(citySlug);
  return city ? city.coordinates : null;
};

export const generateRouteSlug = (fromSlug: string, toSlug: string): string => {
  return `${fromSlug}-${toSlug}`;
};

export const parseRouteSlug = (slug: string): { from: string; to: string } | null => {
  const parts = slug.split('-');
  if (parts.length < 2) return null;
  
  // Handle multi-word city names (e.g., "cluj-napoca-bucuresti")
  for (let i = 1; i < parts.length; i++) {
    const fromSlug = parts.slice(0, i).join('-');
    const toSlug = parts.slice(i).join('-');
    
    const fromCity = getCityBySlug(fromSlug);
    const toCity = getCityBySlug(toSlug);
    
    if (fromCity && toCity) {
      return { from: fromSlug, to: toSlug };
    }
  }
  
  return null;
};

// SEO-related functions
export const getRouteTitle = (fromCity: string, toCity: string): string => {
  const from = getCityBySlug(fromCity);
  const to = getCityBySlug(toCity);
  
  if (!from || !to) return "Calculează Distanța - eDistanta";
  
  return `Distanța ${from.name} - ${to.name} | Rută Optimizată | eDistanta`;
};

export const getRouteDescription = (fromCity: string, toCity: string): string => {
  const from = getCityBySlug(fromCity);
  const to = getCityBySlug(toCity);
  
  if (!from || !to) return "Calculează distanțele rutiere în România cu informații despre combustibil și costuri de călătorie.";
  
  return `Calculează distanța rutieră ${from.name} - ${to.name}. Găsește cea mai bună rută, timpul de călătorie, consumul de combustibil și costurile. Informații actualizate despre prețurile carburantului în România.`;
};

export const getRouteKeywords = (fromCity: string, toCity: string): string => {
  const from = getCityBySlug(fromCity);
  const to = getCityBySlug(toCity);
  
  if (!from || !to) return "distante rutiere, romania, calculator rute, combustibil, preturi carburant";
  
  return `distanta ${from.name} ${to.name}, distante rutiere ${from.name} ${to.name}, ruta ${from.name} ${to.name}, ${from.name} ${to.name} km, calculator distante romania, combustibil ${from.name} ${to.name}`;
};
