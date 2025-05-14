
import { ProjectResult, Settings, YearResult } from '../types';
import { calculateCustomersPerYear } from './customers';
import { 
  calculatePotentialCapacity, 
  calculateDemandRentals, 
  calculateRealOccupancy, 
  calculateActualRentals,
  calculateLostDemand,
  calculateMaxRentalsPerUnit
} from './capacity';
import { revenueForProduct } from './revenue';
import { 
  variableCostsForProduct, 
  structuralCosts, 
  calculateCommissions, 
  calculateDirectorCommission 
} from './costs';
import { calculateUnitEconomics } from './metrics';

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
  const lostDemandByProduct: Record<string, number> = {};

  // Calculate revenue and variable costs for each product
  s.products.forEach((product, index) => {
    // Calculate key metrics
    const potentialCapacity = calculatePotentialCapacity(product);
    const demandRentals = calculateDemandRentals(customersPerYear[year], s.rentalsPerCustomer);
    const realOccupancy = calculateRealOccupancy(demandRentals, potentialCapacity, product.occupancyCap);
    const actualRentals = calculateActualRentals(realOccupancy, potentialCapacity);
    const maxRentalsPerUnit = calculateMaxRentalsPerUnit(product);
    const lostDemand = calculateLostDemand(demandRentals, actualRentals);
    
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
    lostDemandByProduct[productName] = lostDemand;
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
    maxRentalsPerUnit: maxRentalsPerUnitByProduct,
    lostDemand: lostDemandByProduct
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
