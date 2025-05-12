
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

// Function to extract all t() function calls from codebase
const extractKeysFromCode = () => {
  const result: string[] = [];
  const filesDir = path.resolve(__dirname, '../');
  const tsFiles = getAllFiles(filesDir, ['.ts', '.tsx']);
  
  tsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    // Match all t('key.subkey') or t("key.subkey") patterns
    const matches = content.match(/t\(\s*['"`]([^'"`]+)['"`]\s*(?:,|\))/g) || [];
    
    matches.forEach(match => {
      // Extract the key from t('key')
      const keyMatch = match.match(/t\(\s*['"`]([^'"`]+)['"`]/);
      if (keyMatch && keyMatch[1]) {
        result.push(keyMatch[1]);
      }
    });
  });
  
  return [...new Set(result)]; // Remove duplicates
};

// Utility to get all files with specific extensions
function getAllFiles(dir: string, extensions: string[]): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    
    if (stat && stat.isDirectory() && !file.includes('node_modules')) {
      results = results.concat(getAllFiles(file, extensions));
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(file);
      }
    }
  });
  
  return results;
}

// Add the new keys we're adding to check if they exist
const expectedKeys = [
  'inputs.occupancyCap',
  'dashboard.lostDemand',
  'dashboard.lostDemandDesc'
];

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

// Check for keys that are used in code but not in translations
const codeKeys = [...extractKeysFromCode(), ...expectedKeys];
const missingInTranslations = codeKeys.filter(
  key => !flattenedEnTranslations.hasOwnProperty(key) || !flattenedEsTranslations.hasOwnProperty(key)
);

// Log the results
if (missingInSpanish.length > 0) {
  console.error('Missing Spanish translations:', missingInSpanish);
}

if (missingInEnglish.length > 0) {
  console.error('Missing English translations:', missingInEnglish);
}

if (missingInTranslations.length > 0) {
  console.error('Translation keys used in code but missing in translation files:', missingInTranslations);
}

// Exit with an error code if there are any missing translations
if (missingInSpanish.length > 0 || missingInEnglish.length > 0 || missingInTranslations.length > 0) {
  process.exit(1);
} else {
  console.log('✅ All translation keys are present in both languages');
  process.exit(0);
}
