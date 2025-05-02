
export type PricingMode = 'daily' | 'monthly';

export type Product = {
  id?: string;
  name: string;
  units: number;
  pricingMode: PricingMode;
  pricePerDay?: number;
  pricePerMonth?: number;
  minDays: number;        // default 15
  variableCost: number;   // €/rental
  occupancy: number;      // 0-1
};

export type Prescriber = { 
  id?: string;
  name: string; 
  commission: number; // 0-1
};

export type Settings = {
  products: Product[];
  prescribers: Prescriber[];
  employees: number; 
  salary: number;
  infraCost: number; 
  webMaint: number;

  marketingSpend: number; 
  newCustomers: number;
  rentalsPerCustomer: number; 
  churn: number;

  growth: number; 
  inflation: number;
  forecastYears: number; 
  discountRate: number;
};

export type YearResult = {
  year: number; 
  revenue: number; 
  variableCosts: number;
  structuralCosts: number; 
  ebitda: number; 
  cash: number;
  revenueByProduct?: Record<string, number>;
};

export type UnitEconomics = { 
  cac: number; 
  ltv: number; 
  paybackMonths: number; 
  breakEvenYear?: number;
  breakEvenUnits?: number;
};

export type MonteCarloResult = { 
  p5: number; 
  p50: number; 
  p95: number;
};

export type TornadoItem = {
  variable: string;
  negativeImpact: number;
  positiveImpact: number;
};

export type ProjectResult = {
  yearlyResults: YearResult[];
  irr: number;
  npv: number;
  unitEconomics: UnitEconomics;
};

export type Scenario = {
  id: string;
  name: string;
  settings: Settings;
  results?: ProjectResult;
};

export type TooltipContent = {
  [key: string]: string;
};
