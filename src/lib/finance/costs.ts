
import { Product, Settings } from '../types';
import { 
  calculatePotentialCapacity, 
  calculateDemandRentals, 
  calculateRealOccupancy, 
  calculateActualRentals 
} from './capacity';

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
  
  // Calculate real occupancy with occupancy cap
  const realOccupancy = calculateRealOccupancy(demandRentals, potentialCapacity, p.occupancyCap);
  
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
