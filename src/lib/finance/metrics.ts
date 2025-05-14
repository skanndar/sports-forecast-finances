
import { Settings, YearResult, UnitEconomics } from '../types';

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
    return total + (s.marketingSpend * prescriber.share * prescriber.commission) / customersPerYear[year];
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
  if (s.products.length === 0) return 0;
  
  const firstYearStructuralCosts = s.employees * s.salary + s.infraCost + s.webMaint + s.marketingSpend;
  
  // Calculate weighted average contribution margin per unit
  let totalUnits = 0;
  let totalContributionMargin = 0;
  
  s.products.forEach(product => {
    totalUnits += product.units;
    
    // Simple estimation for contribution margin per unit
    const pricePerRental = product.pricingMode === 'daily' ? product.pricePerDay! * product.minDays : product.pricePerMonth!;
    const revenuePerUnit = pricePerRental * (product.occupancyCap || 0.85);
    const costPerUnit = product.variableCost * (product.occupancyCap || 0.85);
    const contributionMarginPerUnit = revenuePerUnit - costPerUnit;
    
    totalContributionMargin += contributionMarginPerUnit * product.units;
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
