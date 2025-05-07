
import { vi, describe, expect, it } from 'vitest';
import i18n from '@/lib/i18n';
import enTranslation from '../locales/en.json';
import esTranslation from '../locales/es.json';

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

describe('Translations', () => {
  it('should have all keys in both languages', () => {
    const flattenedEn = flattenTranslations(enTranslation);
    const flattenedEs = flattenTranslations(esTranslation);
    
    const enKeys = Object.keys(flattenedEn);
    const esKeys = Object.keys(flattenedEs);
    
    // Check if all English keys exist in Spanish
    for (const key of enKeys) {
      expect(esKeys).toContain(key);
    }
    
    // Check if all Spanish keys exist in English
    for (const key of esKeys) {
      expect(enKeys).toContain(key);
    }
  });
  
  it('should not have UI elements showing translation keys', () => {
    // Test navigation keys
    const navDashboard = i18n.t('nav.dashboard');
    const navInputs = i18n.t('nav.inputs');
    const navScenarioLab = i18n.t('nav.scenarioLab');
    const navSensitivity = i18n.t('nav.sensitivity');
    const navInvestorPacket = i18n.t('nav.investorPacket');
    
    // Test methodology keys
    const maxRentalsFormula = i18n.t('investorPacket.maxRentalsFormula');
    const potentialCapacityFormula = i18n.t('investorPacket.potentialCapacityFormula');
    const demandFormula = i18n.t('investorPacket.demandFormula');
    const realOccupancyFormula = i18n.t('investorPacket.realOccupancyFormula');
    const actualRentalsFormula = i18n.t('investorPacket.actualRentalsFormula');
    
    // Test Scenario Lab keys
    const saveCurrentBtn = i18n.t('scenarioLab.saveCurrentBtn');
    const compareScenarios = i18n.t('scenarioLab.compareScenarios');
    
    // Ensure these don't just return the keys
    expect(navDashboard).not.toBe('nav.dashboard');
    expect(navInputs).not.toBe('nav.inputs');
    expect(navScenarioLab).not.toBe('nav.scenarioLab');
    expect(navSensitivity).not.toBe('nav.sensitivity');
    expect(navInvestorPacket).not.toBe('nav.investorPacket');
    
    expect(maxRentalsFormula).not.toBe('investorPacket.maxRentalsFormula');
    expect(potentialCapacityFormula).not.toBe('investorPacket.potentialCapacityFormula');
    expect(demandFormula).not.toBe('investorPacket.demandFormula');
    expect(realOccupancyFormula).not.toBe('investorPacket.realOccupancyFormula');
    expect(actualRentalsFormula).not.toBe('investorPacket.actualRentalsFormula');
    
    expect(saveCurrentBtn).not.toBe('scenarioLab.saveCurrentBtn');
    expect(compareScenarios).not.toBe('scenarioLab.compareScenarios');
  });
  
  it('should have all method section formulas translated', () => {
    const formulaKeys = [
      'maxRentalsFormula',
      'potentialCapacityFormula',
      'demandFormula',
      'realOccupancyFormula',
      'actualRentalsFormula',
      'rentalsPerYearDaily',
      'revenueDailyFormula',
      'rentalsPerYearMonthly',
      'revenueMonthlyFormula',
      'productCostsFormula',
      'cacFormula',
      'ltvFormula',
      'paybackFormula',
      'irrFormula',
      'npvFormula',
      'ebitdaMarginFormula',
      'grossMarginFormula',
      'ebitdaFormula',
      'cashFlowFormula'
    ];
    
    for (const key of formulaKeys) {
      const fullKey = `investorPacket.${key}`;
      const enTranslation = i18n.t(fullKey, { lng: 'en' });
      const esTranslation = i18n.t(fullKey, { lng: 'es' });
      
      expect(enTranslation).not.toBe(fullKey);
      expect(esTranslation).not.toBe(fullKey);
      expect(enTranslation.length).toBeGreaterThan(0);
      expect(esTranslation.length).toBeGreaterThan(0);
    }
  });
});
