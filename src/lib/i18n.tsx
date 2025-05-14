
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import React from 'react';
import MissingTranslation from '@/components/ui/missing-translation';

// Import translations
import enTranslation from '../locales/en.json';
import esTranslation from '../locales/es.json';

// Add new translation entries
const enAdditions = {
  inputs: {
    occupancyCap: "Max Operational Occupancy"
  },
  dashboard: {
    lostDemand: "Lost Demand",
    lostDemandDesc: "Demand that could not be fulfilled"
  }
};

const esAdditions = {
  inputs: {
    occupancyCap: "Ocupación Operativa Máx."
  },
  dashboard: {
    lostDemand: "Demanda Perdida",
    lostDemandDesc: "Demanda que no pudo ser satisfecha"
  }
};

// Merge translations with new additions
const enhancedEnTranslation = { ...enTranslation, ...enAdditions };
const enhancedEsTranslation = { ...esTranslation, ...esAdditions };

// Create a wrapper function for the t function that shows missing translations visually
export const createSafeTFunction = (t: typeof i18n.t) => {
  return (key: string, options?: any) => {
    const translation = t(key, options);
    
    // If the translation is the same as the key, it's probably missing
    if (translation === key && key.includes('.')) {
      console.warn(`Missing translation key: ${key}`);
      // For development, show visual indicator
      if (process.env.NODE_ENV === 'development') {
        return `🔴 ${key}`;
      }
    }
    
    return translation;
  };
};

// Enhanced function to safely get translation
export const getSafeTranslation = (key: string, options?: any) => {
  const translation = i18n.t(key, options);
  
  // Handle missing translations
  if (translation === key && key.includes('.')) {
    console.warn(`Missing translation key: ${key}`);
    return React.createElement(MissingTranslation, { translationKey: key });
  }
  
  return translation;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enhancedEnTranslation
      },
      es: {
        translation: enhancedEsTranslation
      }
    },
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // React already escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    parseMissingKeyHandler: (key) => {
      console.warn(`Missing translation key: ${key}`);
      return key;
    },
    // Add these configurations to ensure namespace resolution
    defaultNS: 'common',
    fallbackNS: ['dashboard', 'inputs', 'investorPacket', 'table', 'kpis'],
  });

// Add this function to help detect missing translations
i18n.on('missingKey', (lngs, namespace, key) => {
  console.warn(`Missing translation key: ${key} for languages: ${lngs.join(', ')}`);
});

export default i18n;
