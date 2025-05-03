
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
  share: number;         // 0-1: portion of revenue attributed to this prescriber  
  commission: number;    // 0-1: commission rate on their portion of revenue
};

export type Settings = {
  products: Product[];
  prescribers: Prescriber[];
  employees: number; 
  salary: number;
  infraCost: number; 
  webMaint: number;
  directorCommission: number; // 0-1: commission rate on total revenue

  marketingSpend: number; 
  newCustomers: number;
  rentalsPerCustomer: number; 
  churn: number;

  growth: number; 
  inflation: number;
  forecastYears: number; 
  discountRate: number;
  initialInvestment: number; // Initial investment (CAPEX) for IRR calculation
};

export type YearResult = {
  year: number; 
  revenue: number; 
  variableCosts: number;
  directorCost?: number;    // Commission for director
  prescriberCosts?: number; // Commission for prescribers
  productCosts?: number;    // Variable costs for products
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
  irr: number | null;
  npv: number;
  unitEconomics: UnitEconomics;
};

export type Scenario = {
  id: string;
  name: string;
  settings: Settings;
  results?: ProjectResult;
  user_id?: string;
  created_at?: string;
};

export type TooltipContent = {
  [key: string]: string;
};

export type LanguageOption = 'es' | 'en';
