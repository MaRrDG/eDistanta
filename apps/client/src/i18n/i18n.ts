import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const enTranslations = {
  app: {
    name: 'eDistanta'
  },
  header: {
    title: 'eDistanta'
  },
  search: {
    title: 'Plan Your Route',
    startLocation: 'Start Location',
    destination: 'Destination',
    enterStartLocation: 'Enter start location',
    enterDestination: 'Enter destination',
    calculateRoute: 'Calculate Fastest Route',
    calculatingRoute: 'Calculating Route...',
    loadingCities: 'Loading cities...',
    validationError: 'Please select valid start and destination cities from the suggestions.'
  },
  routeDetails: {
    title: 'Route Details',
    distance: 'Distance',
    estimatedTime: 'Estimated Time',
    fuelConsumption: 'Fuel Consumption',
    co2Emissions: 'CO₂ Emissions',
    fuel: 'Fuel',
    co2: 'CO₂',
    estimateNote: '* Estimates based on average consumption for the selected fuel type',
    alternatives: 'Alternative Routes',
    route: 'Route',
    fuelSettings: 'Fuel Settings',
    consumption: 'Consumption',
    fuelType: 'Fuel Type'
  },
  fuelTypes: {
    benzina: 'Gasoline',
    motorina: 'Diesel',
    gpl: 'LPG',
    cng: 'CNG'
  },
  map: {
    startLocation: 'Start Location',
    destination: 'Destination',
    routeDisplayed: 'Route displayed',
    selectLocations: 'Select start and destination',
    loadingRoute: 'Loading route...'
  },
  units: {
    km: 'km',
    min: 'min',
    hour: 'h',
    liters: 'L',
    kg: 'kg',
    currency: 'RON'
  },
  languageSelector: {
    language: 'Language',
    english: 'English',
    romanian: 'Romanian'
  }
};

// Romanian translations
const roTranslations = {
  app: {
    name: 'eDistanta'
  },
  header: {
    title: 'eDistanta'
  },
  search: {
    title: 'Planifică Ruta',
    startLocation: 'Locație de Pornire',
    destination: 'Destinație',
    enterStartLocation: 'Introduceți locația de pornire',
    enterDestination: 'Introduceți destinația',
    calculateRoute: 'Calculează Ruta Rapidă',
    calculatingRoute: 'Se calculează ruta...',
    loadingCities: 'Se încarcă orașele...',
    validationError: 'Vă rugăm să selectați orașe valide pentru pornire și destinație din sugestii.'
  },
  routeDetails: {
    title: 'Detalii Rută',
    distance: 'Distanță',
    estimatedTime: 'Timp Estimat',
    fuelConsumption: 'Consum Combustibil',
    co2Emissions: 'Emisii CO₂',
    fuel: 'Combustibil',
    co2: 'CO₂',
    estimateNote: '* Estimări bazate pe consumul mediu pentru tipul de combustibil selectat',
    alternatives: 'Rute Alternative',
    route: 'Ruta',
    fuelSettings: 'Setări Combustibil',
    consumption: 'Consum',
    fuelType: 'Tip Combustibil'
  },
  fuelTypes: {
    benzina: 'Benzină',
    motorina: 'Motorină',
    gpl: 'GPL',
    cng: 'GNC'
  },
  map: {
    startLocation: 'Locație Pornire',
    destination: 'Destinație',
    routeDisplayed: 'Rută afișată',
    selectLocations: 'Selectați locația de pornire și destinația',
    loadingRoute: 'Se încarcă ruta...'
  },
  units: {
    km: 'km',
    min: 'min',
    hour: 'h',
    liters: 'L',
    kg: 'kg',
    currency: 'RON'
  },
  languageSelector: {
    language: 'Limbă',
    english: 'Engleză',
    romanian: 'Română'
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      ro: {
        translation: roTranslations
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage']
    }
  });

export default i18n; 