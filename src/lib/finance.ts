import { Settings, Product, YearResult, UnitEconomics, ProjectResult, TornadoItem, MonteCarloResult } from './types';

/**
 * Calculate customers per year based on new customers, growth rate, and churn rate
 */
export function calculateCustomersPerYear(s: Settings): number[] {
  const customersPerYear: number[] = [];
  
  // First year is just the new customers
  customersPerYear[0] = s.newCustomers;
  
  // Calculate customers for subsequent years
  for (let year = 1; year < s.forecastYears; year++) {
    // Retained customers from previous year plus new customers with growth
    customersPerYear[year] = customersPerYear[year - 1] * (1 - s.churn) + 
      s.newCustomers * Math.pow(1 + s.growth, year);
  }
  
  return customersPerYear;
}

/**
 * Calculate maximum rentals per unit without occupancy
 */
export function calculateMaxRentalsPerUnit(p: Product): number {
  return p.pricingMode === 'daily'
    ? 365 / p.minDays
    : 12;
}

/**
 * Calculate potential capacity based on units and max rentals per unit
 */
export function calculatePotentialCapacity(p: Product): number {
  const maxRentalsPerUnit = calculateMaxRentalsPerUnit(p);
  return p.units * maxRentalsPerUnit;
}

/**
 * Calculate demand for rentals based on customers and rentals per customer
 */
export function calculateDemandRentals(customersCount: number, rentalsPerCustomer: number): number {
  return customersCount * rentalsPerCustomer;
}

/**
 * Calculate real occupancy based on demand and potential capacity
 */
export function calculateRealOccupancy(demandRentals: number, potentialCapacity: number): number {
  return Math.min(1, demandRentals / potentialCapacity);
}

/**
 * Calculate actual rentals based on real occupancy and potential capacity
 */
export function calculateActualRentals(realOccupancy: number, potentialCapacity: number): number {
  return realOccupancy * potentialCapacity;
}

/**
 * Calculate revenue for a specific product in a given year
 */
export function revenueForProduct(p: Product, year: number, s: Settings, customersPerYear: number[]): number {
  const growthFactor = Math.pow(1 + s.growth, year);
  
  // Calculate potential capacity for this product
  const potentialCapacity = calculatePotentialCapacity(p);
  
  // Calculate demand for rentals
  const demandRentals = calculateDemandRentals(customersPerYear[year], s.rentalsPerCustomer);
  
  // Calculate real occupancy
  const realOccupancy = calculateRealOccupancy(demandRentals, potentialCapacity);
  
  // Calculate actual rentals based on real occupancy and potential capacity
  const actualRentals = calculateActualRentals(realOccupancy, potentialCapacity);
  
  // Calculate price per rental based on pricing mode
  const pricePerRental =
    p.pricingMode === 'daily'
      ? p.pricePerDay! * p.minDays
      : p.pricePerMonth!;
  
  // Calculate rental revenue
  const rentalRevenue = actualRentals * pricePerRental * growthFactor;
  
  // Add shipping income if defined
  const shippingIncome = actualRentals * (p.shippingIncome || 0) * growthFactor;
  
  return rentalRevenue + shippingIncome;
}

/**
 * Calculate variable costs for a specific product in a given year
 */
export function variableCostsForProduct(p: Product, year: number, s: Settings, customersPerYear: number[]): number {
  const inflationFactor = Math.pow(1 + s.inflation, year);
  const growthFactor = Math.pow(1 + s.growth, year);
  
  // Calculate potential capacity for this product
  const potentialCapacity = calculatePotentialCapacity(p);
  
  // Calculate demand for rentals
  const demandRentals = calculateDemandRentals(customersPerYear[year], s.rentalsPerCustomer);
  
  // Calculate real occupancy
  const realOccupancy = calculateRealOccupancy(demandRentals, potentialCapacity);
  
  // Calculate actual rentals based on real occupancy and potential capacity
  const actualRentals = calculateActualRentals(realOccupancy, potentialCapacity);
  
  // Base variable cost from product
  const baseVariableCost = actualRentals * p.variableCost * inflationFactor * growthFactor;
  
  // Add shipping cost if defined
  const shippingCost = actualRentals * (p.shippingCost || 0) * inflationFactor * growthFactor;
  
  return baseVariableCost + shippingCost;
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
  
  // Calculate commissions based on share and commission rate for each prescriber
  return s.prescribers.reduce((total, p) => total + (revenue * p.share * p.commission), 0);
}

/**
 * Calculate director commission for given revenue
 */
export function calculateDirectorCommission(revenue: number, s: Settings): number {
  return revenue * s.directorCommission;
}

/**
 * Calculate results for a specific year
 */
export function calculateYearResult(year: number, s: Settings, customersPerYear: number[]): YearResult {
  let totalRevenue = 0;
  let totalProductCosts = 0;
  const revenueByProduct: Record<string, number> = {};
  const actualRentalsByProduct: Record<string, number> = {};
  const demandRentalsByProduct: Record<string, number> = {};
  const potentialCapacityByProduct: Record<string, number> = {};
  const realOccupancyByProduct: Record<string, number> = {};
  const maxRentalsPerUnitByProduct: Record<string, number> = {};

  // Calculate revenue and variable costs for each product
  s.products.forEach((product, index) => {
    // Calculate key metrics
    const potentialCapacity = calculatePotentialCapacity(product);
    const demandRentals = calculateDemandRentals(customersPerYear[year], s.rentalsPerCustomer);
    const realOccupancy = calculateRealOccupancy(demandRentals, potentialCapacity);
    const actualRentals = calculateActualRentals(realOccupancy, potentialCapacity);
    const maxRentalsPerUnit = calculateMaxRentalsPerUnit(product);
    
    // Calculate financials
    const productRevenue = revenueForProduct(product, year, s, customersPerYear);
    const productVariableCosts = variableCostsForProduct(product, year, s, customersPerYear);
    
    totalRevenue += productRevenue;
    totalProductCosts += productVariableCosts;
    
    // Store revenue by product for reporting
    const productName = product.name || `Product ${index + 1}`;
    revenueByProduct[productName] = productRevenue;
    
    // Store capacity metrics by product for reporting
    actualRentalsByProduct[productName] = actualRentals;
    demandRentalsByProduct[productName] = demandRentals;
    potentialCapacityByProduct[productName] = potentialCapacity;
    realOccupancyByProduct[productName] = realOccupancy;
    maxRentalsPerUnitByProduct[productName] = maxRentalsPerUnit;
  });

  // Calculate commission costs
  const prescriberCommissions = calculateCommissions(totalRevenue, s);
  const directorCommission = calculateDirectorCommission(totalRevenue, s);
  
  // Total variable costs
  const totalVariableCosts = totalProductCosts + prescriberCommissions + directorCommission;

  // Calculate structural costs
  const yearStructuralCosts = structuralCosts(year, s);

  // Calculate EBITDA and cash flow
  const ebitda = totalRevenue - totalVariableCosts - yearStructuralCosts;
  const cash = ebitda; // Simplified: cash = EBITDA (ignoring taxes, CAPEX, etc.)

  return {
    year,
    revenue: totalRevenue,
    variableCosts: totalVariableCosts,
    productCosts: totalProductCosts,
    prescriberCosts: prescriberCommissions,
    directorCost: directorCommission,
    structuralCosts: yearStructuralCosts,
    ebitda,
    cash,
    revenueByProduct,
    customersCount: customersPerYear[year],
    actualRentals: actualRentalsByProduct,
    demandRentals: demandRentalsByProduct,
    potentialCapacity: potentialCapacityByProduct,
    realOccupancy: realOccupancyByProduct,
    maxRentalsPerUnit: maxRentalsPerUnitByProduct
  };
}

/**
 * Build cash flows array including initial investment for IRR calculation
 */
export function buildCashFlows(yearlyResults: YearResult[], initialInvestment: number): number[] {
  const cashFlows = [-Math.abs(initialInvestment)]; // Initial investment as negative in year 0
  
  // Add cash flows from each subsequent year
  yearlyResults.forEach(result => {
    cashFlows.push(result.cash);
  });
  
  return cashFlows;
}

/**
 * Calculate project financial results
 */
export function calculateProjectResults(s: Settings): ProjectResult {
  // Calculate customers per year
  const customersPerYear = calculateCustomersPerYear(s);
  
  const yearlyResults: YearResult[] = [];
  
  // Calculate results for each year
  for (let year = 0; year < s.forecastYears; year++) {
    yearlyResults.push(calculateYearResult(year, s, customersPerYear));
  }

  // Build cash flows array including initial investment
  const cashFlows = buildCashFlows(yearlyResults, s.initialInvestment);
  
  // Calculate NPV
  const npv = calculateNPV(cashFlows, s.discountRate);
  
  // Calculate IRR
  const irr = calculateIRR(cashFlows);

  // Calculate unit economics
  const unitEconomics = calculateUnitEconomics(s, yearlyResults, customersPerYear);

  return {
    yearlyResults,
    npv,
    irr,
    unitEconomics,
    customersPerYear
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
 * Using improved algorithm to avoid -∞ results
 */
export function calculateIRR(cashFlows: number[], guess = 0.1): number | null {
  // Check if we have necessary condition for IRR calculation:
  // at least one negative and one positive value
  let hasPositive = false;
  let hasNegative = false;
  
  for (const flow of cashFlows) {
    if (flow > 0) hasPositive = true;
    if (flow < 0) hasNegative = true;
    if (hasPositive && hasNegative) break;
  }
  
  // If we don't have both signs, IRR is not defined
  if (!hasPositive || !hasNegative) {
    return null;
  }
  
  const maxIterations = 100;
  let rate = guess;
  
  // Newton-Raphson method
  for (let i = 0; i < maxIterations; i++) {
    const npv = cashFlows.reduce((sum, flow, t) => sum + flow / Math.pow(1 + rate, t), 0);
    
    // If NPV is close to zero, we found our IRR
    if (Math.abs(npv) < 1e-6) {
      return rate;
    }
    
    // Calculate derivative
    let derivative = cashFlows.reduce(
      (sum, flow, t) => sum - (t * flow) / Math.pow(1 + rate, t + 1),
      0
    );
    
    // Protect against division by zero
    if (Math.abs(derivative) < 1e-10) {
      derivative = 1e-10;
    }
    
    // Update rate estimate
    rate -= npv / derivative;
    
    // Guard against irr heading towards -∞
    if (rate <= -1) {
      return null;
    }
  }
  
  // If we didn't converge, return null
  return null;
}

/**
 * Calculate Customer Acquisition Cost (CAC) for a specific year
 */
export function calculateCAC(s: Settings, year: number, customersPerYear: number[]): number {
  if (customersPerYear[year] <= 0) return 0;
  
  // Calculate marketing CAC for this year
  const marketingCAC = s.marketingSpend / customersPerYear[year];
  
  // Calculate prescriber commissions attributable to new customer acquisition
  // We assume all prescribers contribute proportionally to new customers
  const prescriberCAC = s.prescribers.reduce((total, prescriber) => {
    // Revenue attributed to this prescriber for first-year customers
    const firstYearRevenueShare = s.products.reduce((revenue, product) => {
      // Calculate revenue for this product
      const maxRentalsPerUnit = calculateMaxRentalsPerUnit(product);
      const potentialCapacity = product.units * maxRentalsPerUnit;
      const demandRentals = calculateDemandRentals(customersPerYear[year], s.rentalsPerCustomer);
      const realOccupancy = calculateRealOccupancy(demandRentals, potentialCapacity);
      const actualRentals = calculateActualRentals(realOccupancy, potentialCapacity);
      
      // Calculate price per rental based on pricing mode
      const pricePerRental =
        product.pricingMode === 'daily'
          ? product.pricePerDay! * product.minDays
          : product.pricePerMonth!;
      
      // Product revenue
      const productRevenue = actualRentals * pricePerRental;
      
      return revenue + productRevenue * prescriber.share * prescriber.commission;
    }, 0);
    
    return total + (firstYearRevenueShare / customersPerYear[year]);
  }, 0);
  
  // Total CAC includes both marketing and prescriber commissions
  return marketingCAC + prescriberCAC;
}

/**
 * Calculate Customer Lifetime Value (LTV) with discounted cash flow
 */
export function calculateLTV(s: Settings, yearlyResults: YearResult[]): number {
  if (!yearlyResults.length || yearlyResults[0].revenue <= 0 || !yearlyResults[0].customersCount || yearlyResults[0].customersCount <= 0) {
    return 0;
  }
  
  // Customer lifetime based on churn rate (in years)
  const customerLifespan = 1 / s.churn;
  
  // Maximum years to consider for LTV calculation (avoid infinite series)
  const maxYears = Math.min(20, Math.ceil(customerLifespan * 3)); // Cap at 3x lifespan or 20 years
  
  // First year's values as baseline
  const firstYearResult = yearlyResults[0];
  const revenuePerCustomer = firstYearResult.revenue / firstYearResult.customersCount;
  const variableCostPerCustomer = firstYearResult.variableCosts / firstYearResult.customersCount;
  const grossMargin = 1 - variableCostPerCustomer / revenuePerCustomer;
  
  // Calculate LTV using discounted cash flow method
  let ltv = 0;
  let survivalRate = 1; // Start with 100% of customers
  
  for (let year = 0; year < maxYears; year++) {
    // Discount factor for this year
    const discountFactor = 1 / Math.pow(1 + s.discountRate, year);
    
    // Revenue for this cohort in this year
    const yearRevenue = revenuePerCustomer * s.rentalsPerCustomer * survivalRate * discountFactor;
    
    // Gross profit for this cohort in this year
    const yearGrossProfit = yearRevenue * grossMargin;
    
    // Add to lifetime value
    ltv += yearGrossProfit;
    
    // Reduce survival rate for next year due to churn
    survivalRate *= (1 - s.churn);
    
    // Stop if virtually all customers have churned
    if (survivalRate < 0.01) break;
  }
  
  return ltv;
}

/**
 * Calculate Payback Period (in months)
 */
export function calculatePaybackMonths(cac: number, s: Settings, yearlyResults: YearResult[]): number {
  if (!yearlyResults.length || !yearlyResults[0].customersCount || yearlyResults[0].customersCount <= 0) {
    return 0;
  }

  // Monthly gross profit per customer
  const firstYearResult = yearlyResults[0];
  const monthlyRevenuePerCustomer = firstYearResult.revenue / firstYearResult.customersCount / 12;
  const monthlyVariableCostPerCustomer = firstYearResult.variableCosts / firstYearResult.customersCount / 12;
  const monthlyGrossProfitPerCustomer = monthlyRevenuePerCustomer - monthlyVariableCostPerCustomer;
  
  return monthlyGrossProfitPerCustomer > 0 ? cac / monthlyGrossProfitPerCustomer : Infinity;
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
export function calculateBreakEvenUnits(s: Settings, customersPerYear: number[]): number {
  // Simple approach: Find number of units where revenue = costs
  // For the first year only, averaged across products
  
  if (s.products.length === 0) return 0;
  
  const firstYearStructuralCosts = structuralCosts(0, s);
  
  // Calculate weighted average contribution margin per unit
  let totalUnits = 0;
  let totalContributionMargin = 0;
  
  s.products.forEach(product => {
    totalUnits += product.units;
    
    const maxRentalsPerUnit = calculateMaxRentalsPerUnit(product);
    const potentialCapacity = product.units * maxRentalsPerUnit;
    const demandRentals = calculateDemandRentals(customersPerYear[0], s.rentalsPerCustomer);
    const realOccupancy = calculateRealOccupancy(demandRentals, potentialCapacity);
    const actualRentals = calculateActualRentals(realOccupancy, potentialCapacity);
    
    // Calculate revenue and costs for this product
    const pricePerRental = product.pricingMode === 'daily' ? product.pricePerDay! * product.minDays : product.pricePerMonth!;
    const revenuePerUnit = actualRentals * pricePerRental / product.units;
    
    const variableCostPerRental = product.variableCost;
    const shippingCostPerRental = product.shippingCost || 0;
    const variableCostPerUnit = actualRentals * (variableCostPerRental + shippingCostPerRental) / product.units;
    
    totalContributionMargin += (revenuePerUnit - variableCostPerUnit) * product.units;
  });
  
  const avgContributionMarginPerUnit = totalContributionMargin / totalUnits;
  
  // Break-Even Units = Fixed Costs / Contribution Margin per Unit
  return firstYearStructuralCosts / avgContributionMarginPerUnit;
}

/**
 * Calculate Unit Economics
 */
export function calculateUnitEconomics(s: Settings, yearlyResults: YearResult[], customersPerYear: number[]): UnitEconomics {
  const cac = calculateCAC(s, 0, customersPerYear); // First year CAC
  const ltv = calculateLTV(s, yearlyResults);
  const paybackMonths = calculatePaybackMonths(cac, s, yearlyResults);
  const breakEvenYear = calculateBreakEvenYear(yearlyResults);
  const breakEvenUnits = calculateBreakEvenUnits(s, customersPerYear);
  
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
        occupancy: 0.7,
        shippingIncome: 0,
        shippingCost: 0
      }
    ],
    prescribers: [
      {
        id: crypto.randomUUID(),
        name: 'Clinician',
        share: 0.2,
        commission: 0.1
      }
    ],
    employees: 2,
    salary: 50000,
    infraCost: 24000,
    webMaint: 12000,
    directorCommission: 0.03, // 3% commission on total revenue
    marketingSpend: 30000,
    newCustomers: 100,
    rentalsPerCustomer: 2,
    churn: 0.2,
    growth: 0.15,
    inflation: 0.03,
    forecastYears: 5,
    discountRate: 0.1,
    initialInvestment: 100000 // Default initial investment of 100k
  };
}
