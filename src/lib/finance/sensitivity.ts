
import { Settings, TornadoItem, MonteCarloResult, Product } from '../types';
import { calculateProjectResults } from './engine';

/**
 * Run Tornado Analysis
 */
export function runTornadoAnalysis(baseSettings: Settings): TornadoItem[] {
  const baseResult = calculateProjectResults(baseSettings);
  const baseEbitda = baseResult.yearlyResults[baseResult.yearlyResults.length - 1].ebitda;
  const variationPercent = 0.1; // 10% variation
  
  const results: TornadoItem[] = [];
  
  // Test variation for key parameters
  const parametersToTest = [
    { name: 'Occupancy', key: 'products', subKey: 'occupancy' },
    { name: 'Price', key: 'products', subKey: 'pricePerDay' },
    { name: 'Variable Cost', key: 'products', subKey: 'variableCost' },
    { name: 'Marketing', key: 'marketingSpend' },
    { name: 'Growth', key: 'growth' },
    { name: 'Salary', key: 'salary' },
    { name: 'Churn', key: 'churn' }
  ];
  
  parametersToTest.forEach(param => {
    let lowerSettings = JSON.parse(JSON.stringify(baseSettings));
    let upperSettings = JSON.parse(JSON.stringify(baseSettings));
    
    // Update the settings for the parameter variation
    if (param.key === 'products') {
      lowerSettings.products.forEach((p: Product) => {
        if (param.subKey === 'pricePerDay' && p.pricingMode === 'daily') {
          p.pricePerDay = (p.pricePerDay || 0) * (1 - variationPercent);
        } else if (param.subKey === 'pricePerMonth' && p.pricingMode === 'monthly') {
          p.pricePerMonth = (p.pricePerMonth || 0) * (1 - variationPercent);
        } else {
          // @ts-ignore
          p[param.subKey] = p[param.subKey] * (1 - variationPercent);
        }
      });
      
      upperSettings.products.forEach((p: Product) => {
        if (param.subKey === 'pricePerDay' && p.pricingMode === 'daily') {
          p.pricePerDay = (p.pricePerDay || 0) * (1 + variationPercent);
        } else if (param.subKey === 'pricePerMonth' && p.pricingMode === 'monthly') {
          p.pricePerMonth = (p.pricePerMonth || 0) * (1 + variationPercent);
        } else {
          // @ts-ignore
          p[param.subKey] = p[param.subKey] * (1 + variationPercent);
        }
      });
    } else {
      // @ts-ignore
      lowerSettings[param.key] = baseSettings[param.key] * (1 - variationPercent);
      // @ts-ignore
      upperSettings[param.key] = baseSettings[param.key] * (1 + variationPercent);
    }
    
    const lowerResult = calculateProjectResults(lowerSettings);
    const upperResult = calculateProjectResults(upperSettings);
    
    const lowerEbitda = lowerResult.yearlyResults[lowerResult.yearlyResults.length - 1].ebitda;
    const upperEbitda = upperResult.yearlyResults[upperResult.yearlyResults.length - 1].ebitda;
    
    results.push({
      variable: param.name,
      negativeImpact: (lowerEbitda - baseEbitda) / Math.abs(baseEbitda),
      positiveImpact: (upperEbitda - baseEbitda) / Math.abs(baseEbitda)
    });
  });
  
  // Sort by absolute impact
  return results.sort((a, b) => 
    (Math.abs(b.positiveImpact) + Math.abs(b.negativeImpact)) - 
    (Math.abs(a.positiveImpact) + Math.abs(a.negativeImpact))
  );
}

/**
 * Run Monte Carlo simulation
 */
export function runMonteCarloSimulation(baseSettings: Settings, runs = 1000): MonteCarloResult {
  const results: number[] = [];
  const variationRange = 0.2; // 20% random variation
  
  for (let i = 0; i < runs; i++) {
    const randomSettings = JSON.parse(JSON.stringify(baseSettings));
    
    // Apply random variations to key parameters
    randomSettings.products.forEach((p: Product) => {
      p.occupancy *= 1 + (Math.random() * 2 - 1) * variationRange;
      
      if (p.pricingMode === 'daily' && p.pricePerDay) {
        p.pricePerDay *= 1 + (Math.random() * 2 - 1) * variationRange;
      } else if (p.pricingMode === 'monthly' && p.pricePerMonth) {
        p.pricePerMonth *= 1 + (Math.random() * 2 - 1) * variationRange;
      }
      
      p.variableCost *= 1 + (Math.random() * 2 - 1) * variationRange;
    });
    
    randomSettings.growth *= 1 + (Math.random() * 2 - 1) * variationRange;
    randomSettings.marketingSpend *= 1 + (Math.random() * 2 - 1) * variationRange;
    randomSettings.churn *= 1 + (Math.random() * 2 - 1) * variationRange;
    
    const randomResult = calculateProjectResults(randomSettings);
    const finalEbitda = randomResult.yearlyResults[randomResult.yearlyResults.length - 1].ebitda;
    
    results.push(finalEbitda);
  }
  
  // Sort results for percentile calculation
  results.sort((a, b) => a - b);
  
  return {
    p5: results[Math.floor(runs * 0.05)],
    p50: results[Math.floor(runs * 0.5)],
    p95: results[Math.floor(runs * 0.95)]
  };
}
