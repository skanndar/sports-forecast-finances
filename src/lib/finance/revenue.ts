
import { Product, Settings } from '../types';
import { 
  calculatePotentialCapacity, 
  calculateDemandRentals, 
  calculateRealOccupancy, 
  calculateActualRentals 
} from './capacity';

/**
 * Calculate revenue for a specific product in a given year
 */
export function revenueForProduct(p: Product, year: number, s: Settings, customersPerYear: number[]): number {
  const growthFactor = Math.pow(1 + s.growth, year);
  
  // Calculate potential capacity for this product
  const potentialCapacity = calculatePotentialCapacity(p);
  
  // Calculate demand for rentals
  const demandRentals = calculateDemandRentals(customersPerYear[year], s.rentalsPerCustomer);
  
  // Calculate real occupancy with occupancy cap
  const realOccupancy = calculateRealOccupancy(demandRentals, potentialCapacity, p.occupancyCap);
  
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
