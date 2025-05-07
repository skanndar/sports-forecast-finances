
// This script validates that all translations exist in both language files
import fs from 'fs';
import path from 'path';

// Load English and Spanish translations
const enTranslations = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../locales/en.json'), 'utf8'));
const esTranslations = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../locales/es.json'), 'utf8'));

// Function to flatten the translation objects
const flattenTranslations = (obj: any, prefix = '') => {
  return Object.keys(obj).reduce((acc: Record<string, string>, key: string) => {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenTranslations(obj[key], newPrefix));
    } else {
      acc[newPrefix] = obj[key];
    }
    return acc;
  }, {});
};

// Flatten the translations
const flattenedEnTranslations = flattenTranslations(enTranslations);
const flattenedEsTranslations = flattenTranslations(esTranslations);

// Find missing keys in Spanish translation
const missingInSpanish = Object.keys(flattenedEnTranslations).filter(
  key => !flattenedEsTranslations.hasOwnProperty(key)
);

// Find missing keys in English translation
const missingInEnglish = Object.keys(flattenedEsTranslations).filter(
  key => !flattenedEnTranslations.hasOwnProperty(key)
);

// Log the results
if (missingInSpanish.length > 0) {
  console.error('Missing Spanish translations:', missingInSpanish);
}

if (missingInEnglish.length > 0) {
  console.error('Missing English translations:', missingInEnglish);
}

// Exit with an error code if there are any missing translations
if (missingInSpanish.length > 0 || missingInEnglish.length > 0) {
  process.exit(1);
} else {
  console.log('✅ All translation keys are present in both languages');
  process.exit(0);
}
