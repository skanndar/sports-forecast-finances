
import { Settings } from '../types';

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
