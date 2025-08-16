import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const enTranslations = {
  app: {
    name: 'eDistanta',
  },
  header: {
    title: 'eDistanta',
  },
  search: {
    title: 'Plan Your Route',
    startLocation: 'Start Location',
    destination: 'Destination',
    waypoint: 'Waypoint',
    enterStartLocation: 'Enter start location',
    enterDestination: 'Enter destination',
    enterWaypoint: 'Enter waypoint location',
    addWaypoint: 'Add Waypoint',
    calculateRoute: 'Calculate Fastest Route',
    calculatingRoute: 'Calculating Route...',
    loadingCities: 'Loading cities...',
    validationError:
      'Please select valid start and destination cities from the suggestions.',
    waypointValidationError:
      'Please select valid cities for all waypoints from the suggestions.',
    clickToSelect: 'Click on a location to select it',
    clearSelection: 'Clear selection',
    selected: 'Selected',
    noResults: 'No locations found. Try a different search term.',
    recalculateNeeded: 'Route needs recalculation',
    recalculateHint: 'Click to recalculate route with changes',
  },
  routeDetails: {
    title: 'Route Details',
    distance: 'Distance',
    estimatedTime: 'Estimated Time',
    fuelConsumption: 'Fuel Consumption',
    co2Emissions: 'CO₂ Emissions',
    fuel: 'Fuel',
    co2: 'CO₂',
    cost: 'Cost',
    fuelCost: 'Fuel Cost',
    estimateNote:
      '* Estimates based on average consumption for the selected fuel type',
    alternatives: 'Alternative Routes',
    route: 'Route',
    waypoints: 'Waypoints',
    fuelSettings: 'Fuel Settings',
    consumption: 'Consumption',
    fuelType: 'Fuel Type',
    fuelStation: 'Fuel Station',
    selectStation: 'Select a station',
    currentPrice: 'Current Price',
    priceNotAvailable: 'Price not available',
    lastUpdated: 'Last updated',
    stationsError: 'Error loading stations',
    priceError: 'Error loading price',
    apiError: {
      title: 'Service Unavailable',
      description: 'The fuel price service is currently unavailable. Please try again later.',
      retry: 'Retry',
    },
    fuelPricesUnavailable: 'Fuel price data is temporarily unavailable. Basic estimates are shown.',
    basicFuelSettings: 'Basic Fuel Settings',
  },
  fuelTypes: {
    'benzina-regular': 'Gasoline',
    'benzina-premium': 'Gasoline Premium',
    'motorina-regular': 'Diesel',
    'motorina-premium': 'Diesel Premium',
    gpl: 'LPG',
  },
  map: {
    startLocation: 'Start Location',
    destination: 'Destination',
    waypoint: 'Waypoint',
    routeDisplayed: 'Route displayed',
    selectLocations: 'Select start and destination',
    loadingRoute: 'Loading route...',
    fitToRoute: 'Fit to Route',
  },
  units: {
    km: 'km',
    min: 'min',
    hour: 'h',
    liters: 'L',
    kg: 'kg',
    currency: 'RON',
  },
  languageSelector: {
    language: 'Language',
    english: 'English',
    romanian: 'Romanian',
  },
  common: {
    loading: 'Loading...',
  },
  terms: {
    button: 'Terms & Conditions',
    title: 'Terms and Conditions',
    routePlanning:
      'These directions are intended for planning purposes only. You may find that construction projects, traffic, weather, or other events may cause conditions to differ from the map results, and you should plan your route accordingly. You must obey all signs or notices regarding your route.',
    fuelPriceTitle: 'Fuel Price Information',
    fuelPriceInfo:
      'Fuel prices are updated every 12 hours at 12:00 AM and 12:00 PM. Prices are sourced from Bucharest and may vary in different cities across Romania.',
    disclaimerTitle: 'Important Disclaimers',
    disclaimer1:
      'Route calculations are estimates and actual travel time may vary',
    disclaimer2:
      'Fuel consumption calculations are based on average vehicle consumption',
    disclaimer3: 'Always follow local traffic laws and road signs',
    disclaimer4:
      'The application is not responsible for any route-related incidents',
    lastUpdated: 'Last updated: January 2025',
    close: 'Close',
  },
  info: {
    title: 'About eDistanta',
    subtitle: 'Smart Route Planning for Romania',
    description:
      'Discover the most efficient routes between all cities in Romania. Calculate precise road distances, compare alternative routes, and get detailed fuel consumption estimates for your journey.',
    featuresTitle: 'What We Offer',
    feature1: 'Accurate distances between Romanian cities',
    feature2: 'Multiple route alternatives with detailed comparisons',
    feature3: 'Real-time fuel prices and consumption estimates',
    feature4: 'Elevation profiles and route statistics',
    close: 'Close',
  },
  404: {
    title: 'Page Not Found',
    description: 'Sorry, but the page you are looking for does not exist or has been moved.',
    goHome: 'Back to Homepage',
    goBack: 'Go Back',
    helpfulLinks: 'You might be interested in:',
    linkHome: 'Homepage',
    contact: 'If the problem persists, please contact us.',
  },
};

// Romanian translations
const roTranslations = {
  app: {
    name: 'eDistanta',
  },
  header: {
    title: 'eDistanta',
  },
  search: {
    title: 'Planifică Ruta',
    startLocation: 'Locație de Pornire',
    destination: 'Destinație',
    waypoint: 'Punct Intermediar',
    enterStartLocation: 'Introduceți locația de pornire',
    enterDestination: 'Introduceți destinația',
    enterWaypoint: 'Introduceți punctul intermediar',
    addWaypoint: 'Adaugă Punct Intermediar',
    calculateRoute: 'Calculează Ruta Rapidă',
    calculatingRoute: 'Se calculează ruta...',
    loadingCities: 'Se încarcă orașele...',
    validationError:
      'Vă rugăm să selectați orașe valide pentru pornire și destinație din sugestii.',
    waypointValidationError:
      'Vă rugăm să selectați orașe valide pentru toate punctele intermediare din sugestii.',
    clickToSelect: 'Faceți clic pe o locație pentru a o selecta',
    clearSelection: 'Șterge selecția',
    selected: 'Selectat',
    noResults: 'Nu s-au găsit locații. Încercați un termen de căutare diferit.',
    recalculateNeeded: 'Ruta necesită recalculare',
    recalculateHint: 'Faceți clic pentru a recalcula ruta cu modificările',
  },
  routeDetails: {
    title: 'Detalii Rută',
    distance: 'Distanță',
    estimatedTime: 'Timp Estimat',
    fuelConsumption: 'Consum Combustibil',
    co2Emissions: 'Emisii CO₂',
    fuel: 'Combustibil',
    co2: 'CO₂',
    cost: 'Cost',
    fuelCost: 'Cost Combustibil',
    estimateNote:
      '* Estimări bazate pe consumul mediu pentru tipul de combustibil selectat',
    alternatives: 'Rute Alternative',
    route: 'Ruta',
    waypoints: 'Puncte Intermediare',
    fuelSettings: 'Setări Combustibil',
    consumption: 'Consum',
    fuelType: 'Tip Combustibil',
    fuelStation: 'Stație Combustibil',
    selectStation: 'Selectați o stație',
    currentPrice: 'Preț Curent',
    priceNotAvailable: 'Preț indisponibil',
    lastUpdated: 'Actualizat ultima dată',
    stationsError: 'Eroare la încărcarea stațiilor',
    priceError: 'Eroare la încărcarea prețului',
    apiError: {
      title: 'Serviciu Indisponibil',
      description: 'Serviciul de preturi combustibil este temporar indisponibil. Vă rugăm să încercați din nou mai târziu.',
      retry: 'Încearcă din nou',
    },
    fuelPricesUnavailable: 'Datele de preț combustibil sunt temporar indisponibile. Se afișează estimări de bază.',
    basicFuelSettings: 'Setări Combustibil de Bază',
  },
  fuelTypes: {
    'benzina-regular': 'Benzină',
    'benzina-premium': 'Benzină Premium',
    'motorina-regular': 'Motorină',
    'motorina-premium': 'Motorină Premium',
    gpl: 'GPL',
  },
  map: {
    startLocation: 'Locație Pornire',
    destination: 'Destinație',
    waypoint: 'Punct Intermediar',
    routeDisplayed: 'Rută afișată',
    selectLocations: 'Selectați locația de pornire și destinația',
    loadingRoute: 'Se încarcă ruta...',
    fitToRoute: 'Potrivește Ruta',
  },
  units: {
    km: 'km',
    min: 'min',
    hour: 'h',
    liters: 'L',
    kg: 'kg',
    currency: 'RON',
  },
  languageSelector: {
    language: 'Limbă',
    english: 'Engleză',
    romanian: 'Română',
  },
  common: {
    loading: 'Se încarcă...',
  },
  terms: {
    button: 'Termeni şi Condiţii',
    title: 'Termeni şi Condiţii',
    routePlanning:
      'Aceste indicaţii au ca scop unic planificarea. Se poate să constataţi că proiectele de construcţie, traficul, vremea sau alte evenimente pot determina condiţiile de trafic să difere faţă de rezultatele oferite de hartă; prin urmare, planificarea traseului trebuie efectuată ţinând cont de cele menţionate. Trebuie să respectaţi toate semnele de circulaţie şi anunţurile referitoare la traseul dvs.',
    fuelPriceTitle: 'Informaţii despre Preţurile Combustibilului',
    fuelPriceInfo:
      'Preţurile combustibilului sunt actualizate la fiecare 12 ore, la orele 00:00 şi 12:00. Preţurile sunt preluate din Bucureşti şi pot varia în diferite oraşe din România.',
    disclaimerTitle: 'Clauze de Exonerare Importante',
    disclaimer1:
      'Calculele rutelor sunt estimări şi timpul real de călătorie poate varia',
    disclaimer2:
      'Calculele de consum de combustibil se bazează pe consumul mediu al vehiculelor',
    disclaimer3:
      'Respectaţi întotdeauna legile locale de circulaţie şi indicatoarele rutiere',
    disclaimer4:
      'Aplicaţia nu îşi asumă responsabilitatea pentru incidentele legate de traseu',
    lastUpdated: 'Ultima actualizare: Ianuarie 2025',
    close: 'Închide',
  },
  info: {
    title: 'Despre eDistanta',
    subtitle: 'Planificare Inteligentă de Rute în România',
    description:
      'Descoperiţi cele mai eficiente rute între toate oraşele din România. Calculaţi distanţe rutiere precise, comparaţi trasee alternative şi obţineţi estimări detaliate de consum pentru călătoria dumneavoastră.',
    featuresTitle: 'Ce Oferim',
    feature1: 'Distanţe precise între oraşele româneşti',
    feature2: 'Multiple alternative de rute cu comparaţii detaliate',
    feature3: 'Preţuri actuale la combustibil şi estimări de consum',
    feature4: 'Profile de elevaţie şi statistici de traseu',
    close: 'Închide',
  },
  404: {
    title: 'Pagina nu a fost găsită',
    description: 'Ne pare rău, dar pagina pe care o căutați nu există sau a fost mutată.',
    goHome: 'Înapoi la pagina principală',
    goBack: 'Înapoi',
    helpfulLinks: 'Poate te interesează:',
    linkHome: 'Pagina principală',
    contact: 'Dacă problema persistă, vă rugăm să ne contactați.',
  },
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      ro: {
        translation: roTranslations,
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
  });

export default i18n;
