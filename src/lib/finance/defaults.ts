
import { Settings } from '../types';

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
        occupancyCap: 0.85,
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
