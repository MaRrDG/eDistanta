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
