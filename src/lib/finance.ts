
import { Settings, Product, YearResult, UnitEconomics, ProjectResult, TornadoItem, MonteCarloResult } from './types';

/**
 * Calculate revenue for a specific product in a given year
 */
export function revenueForProduct(p: Product, year: number, s: Settings): number {
  const growthFactor = Math.pow(1 + s.growth, year);
  const daysPerYear = 365;
  const monthsPerYear = 12;

  const rentalsPerYear =
    p.pricingMode === 'daily'
      ? (p.occupancy * daysPerYear) / p.minDays
      : p.occupancy * monthsPerYear;

  const price =
    p.pricingMode === 'daily'
      ? p.pricePerDay! * p.minDays
      : p.pricePerMonth!;

  return p.units * rentalsPerYear * price * growthFactor;
}

/**
 * Calculate variable costs for a specific product in a given year
 */
export function variableCostsForProduct(p: Product, year: number, s: Settings): number {
  const inflationFactor = Math.pow(1 + s.inflation, year);
  const growthFactor = Math.pow(1 + s.growth, year);
  const daysPerYear = 365;
  const monthsPerYear = 12;

  const rentalsPerYear =
    p.pricingMode === 'daily'
      ? (p.occupancy * daysPerYear) / p.minDays
      : p.occupancy * monthsPerYear;

  return p.units * rentalsPerYear * p.variableCost * inflationFactor * growthFactor;
}

/**
 * Calculate structural costs for a given year
 */
export function structuralCosts(year: number, s: Settings): number {
  const inflationFactor = Math.pow(1 + s.inflation, year);
  
  const employeeCosts = s.employees * s.salary * inflationFactor;
  const infraCosts = s.infraCost * inflationFactor;
  const webCosts = s.webMaint * inflationFactor;
  const marketingCosts = s.marketingSpend * inflationFactor;
  
  return employeeCosts + infraCosts + webCosts + marketingCosts;
}

/**
 * Calculate prescriber commissions for a given revenue
 */
export function calculateCommissions(revenue: number, s: Settings): number {
  if (!s.prescribers.length) return 0;
  
  // Assume revenue is equally distributed among prescribers
  // or use a more complex model if needed
  return s.prescribers.reduce((total, p) => total + (revenue * p.commission / s.prescribers.length), 0);
}

/**
 * Calculate results for a specific year
 */
export function calculateYearResult(year: number, s: Settings): YearResult {
  let totalRevenue = 0;
  let totalVariableCosts = 0;
  const revenueByProduct: Record<string, number> = {};

  // Calculate revenue and variable costs for each product
  s.products.forEach((product, index) => {
    const productRevenue = revenueForProduct(product, year, s);
    const productVariableCosts = variableCostsForProduct(product, year, s);
    
    totalRevenue += productRevenue;
    totalVariableCosts += productVariableCosts;
    
    revenueByProduct[product.name || `Product ${index + 1}`] = productRevenue;
  });

  // Add commission costs as part of variable costs
  const commissionCosts = calculateCommissions(totalRevenue, s);
  totalVariableCosts += commissionCosts;

  // Calculate structural costs
  const yearStructuralCosts = structuralCosts(year, s);

  // Calculate EBITDA and cash flow
  const ebitda = totalRevenue - totalVariableCosts - yearStructuralCosts;
  const cash = ebitda; // Simplified: cash = EBITDA (ignoring taxes, CAPEX, etc.)

  return {
    year,
    revenue: totalRevenue,
    variableCosts: totalVariableCosts,
    structuralCosts: yearStructuralCosts,
    ebitda,
    cash,
    revenueByProduct
  };
}

/**
 * Calculate project financial results
 */
export function calculateProjectResults(s: Settings): ProjectResult {
  const yearlyResults: YearResult[] = [];
  
  // Calculate results for each year
  for (let year = 0; year < s.forecastYears; year++) {
    yearlyResults.push(calculateYearResult(year, s));
  }

  // Calculate NPV
  const npv = calculateNPV(yearlyResults.map(y => y.cash), s.discountRate);
  
  // Calculate IRR
  const irr = calculateIRR(yearlyResults.map(y => y.cash));

  // Calculate unit economics
  const unitEconomics = calculateUnitEconomics(s, yearlyResults);

  return {
    yearlyResults,
    npv,
    irr,
    unitEconomics
  };
}

/**
 * Calculate Net Present Value (NPV)
 */
export function calculateNPV(cashFlows: number[], discountRate: number): number {
  return cashFlows.reduce((npv, cashFlow, year) => {
    return npv + cashFlow / Math.pow(1 + discountRate, year);
  }, 0);
}

/**
 * Calculate Internal Rate of Return (IRR)
 * Using Newton-Raphson method for numerical approximation
 */
export function calculateIRR(cashFlows: number[]): number {
  // Start with guess of 10%
  let guess = 0.1;
  const maxIterations = 100;
  const tolerance = 0.0001;
  
  // Implementation of Newton-Raphson method
  for (let i = 0; i < maxIterations; i++) {
    const npv = cashFlows.reduce((acc, cf, j) => acc + cf / Math.pow(1 + guess, j), 0);
    const derivative = cashFlows.reduce((acc, cf, j) => acc - j * cf / Math.pow(1 + guess, j + 1), 0);
    
    const newGuess = guess - npv / derivative;
    
    if (Math.abs(newGuess - guess) < tolerance) {
      return newGuess;
    }
    
    guess = newGuess;
  }
  
  return guess; // Return best guess if max iterations reached
}

/**
 * Calculate Customer Acquisition Cost (CAC)
 */
export function calculateCAC(s: Settings): number {
  return s.marketingSpend / s.newCustomers;
}

/**
 * Calculate Customer Lifetime Value (LTV)
 */
export function calculateLTV(s: Settings, yearlyResults: YearResult[]): number {
  // Average annual revenue per customer
  const avgYearlyRevenue = yearlyResults[0].revenue / s.newCustomers;
  
  // Average gross margin
  const avgGrossMargin = 1 - yearlyResults[0].variableCosts / yearlyResults[0].revenue;
  
  // Customer lifespan (years) based on churn rate
  const customerLifespan = 1 / s.churn;
  
  // LTV = Annual Revenue per customer × Gross Margin × Customer Lifespan
  return avgYearlyRevenue * avgGrossMargin * customerLifespan;
}

/**
 * Calculate Payback Period (in months)
 */
export function calculatePaybackMonths(cac: number, s: Settings, yearlyResults: YearResult[]): number {
  // Monthly gross profit per customer
  const monthlyRevenuePerCustomer = yearlyResults[0].revenue / s.newCustomers / 12;
  const monthlyVariableCostPerCustomer = yearlyResults[0].variableCosts / s.newCustomers / 12;
  const monthlyGrossProfitPerCustomer = monthlyRevenuePerCustomer - monthlyVariableCostPerCustomer;
  
  return cac / monthlyGrossProfitPerCustomer;
}

/**
 * Calculate Break-Even Year
 */
export function calculateBreakEvenYear(yearlyResults: YearResult[]): number | undefined {
  for (let i = 0; i < yearlyResults.length; i++) {
    if (yearlyResults[i].ebitda >= 0) {
      return i;
    }
  }
  
  return undefined; // Break-even not reached in the forecast period
}

/**
 * Calculate Break-Even Units
 */
export function calculateBreakEvenUnits(s: Settings): number {
  // Simple approach: Find number of units where revenue = costs
  // For the first year only, averaged across products
  
  if (s.products.length === 0) return 0;
  
  const firstYearStructuralCosts = structuralCosts(0, s);
  
  // Calculate weighted average contribution margin per unit
  let totalUnits = 0;
  let totalContributionMargin = 0;
  
  s.products.forEach(product => {
    totalUnits += product.units;
    
    const revenuePerUnit = revenueForProduct(product, 0, s) / product.units;
    const variableCostPerUnit = variableCostsForProduct(product, 0, s) / product.units;
    
    totalContributionMargin += (revenuePerUnit - variableCostPerUnit) * product.units;
  });
  
  const avgContributionMarginPerUnit = totalContributionMargin / totalUnits;
  
  // Break-Even Units = Fixed Costs / Contribution Margin per Unit
  return firstYearStructuralCosts / avgContributionMarginPerUnit;
}

/**
 * Calculate Unit Economics
 */
export function calculateUnitEconomics(s: Settings, yearlyResults: YearResult[]): UnitEconomics {
  const cac = calculateCAC(s);
  const ltv = calculateLTV(s, yearlyResults);
  const paybackMonths = calculatePaybackMonths(cac, s, yearlyResults);
  const breakEvenYear = calculateBreakEvenYear(yearlyResults);
  const breakEvenUnits = calculateBreakEvenUnits(s);
  
  return {
    cac,
    ltv,
    paybackMonths,
    breakEvenYear,
    breakEvenUnits
  };
}

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

/**
 * Default settings for a new project
 */
export function getDefaultSettings(): Settings {
  return {
    products: [
      {
        id: crypto.randomUUID(),
        name: 'Standard Unit',
        units: 10,
        pricingMode: 'daily',
        pricePerDay: 50,
        minDays: 15,
        variableCost: 10,
        occupancy: 0.7
      }
    ],
    prescribers: [
      {
        id: crypto.randomUUID(),
        name: 'Clinician',
        commission: 0.1
      }
    ],
    employees: 2,
    salary: 50000,
    infraCost: 24000,
    webMaint: 12000,
    marketingSpend: 30000,
    newCustomers: 100,
    rentalsPerCustomer: 2,
    churn: 0.2,
    growth: 0.15,
    inflation: 0.03,
    forecastYears: 5,
    discountRate: 0.1
  };
}
