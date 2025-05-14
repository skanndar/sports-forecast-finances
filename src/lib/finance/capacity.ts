
import { Product } from '../types';

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
 * Calculate real occupancy based on demand, potential capacity, and occupancy cap
 */
export function calculateRealOccupancy(demandRentals: number, potentialCapacity: number, occupancyCap: number): number {
  return Math.min(occupancyCap, demandRentals / potentialCapacity);
}

/**
 * Calculate actual rentals based on real occupancy and potential capacity
 */
export function calculateActualRentals(realOccupancy: number, potentialCapacity: number): number {
  return realOccupancy * potentialCapacity;
}

/**
 * Calculate lost demand (demand that couldn't be fulfilled due to capacity constraints)
 */
export function calculateLostDemand(demandRentals: number, actualRentals: number): number {
  return Math.max(0, demandRentals - actualRentals);
}
