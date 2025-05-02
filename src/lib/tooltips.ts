
import { TooltipContent } from './types';

export const tooltips: TooltipContent = {
  "product-units": "Number of machines available for rent.",
  "product-pricing-mode": "Choose 'daily' to price per day or 'monthly' to price per month.",
  "product-price-per-day": "Rental fee (VAT excl.). Example: €5 /day.",
  "product-price-per-month": "Rental fee (VAT excl.). Example: €1 000 /month.",
  "product-min-days": "Minimum rental length. Default 15 days. Adjust for larger equipment if needed.",
  "product-variable-cost": "Direct cost per rental: consumables, shipping, cleaning, etc.",
  "product-occupancy": "Average % of time the machine is rented (0-100 %).",
  "prescriber-commission": "Share of revenue paid to the prescriber. Can be 0 %.",
  "employees": "Full-time staff on payroll.",
  "salary": "Total annual cost per employee (gross salary + taxes).",
  "infra-cost": "Annual infrastructure costs: warehouse, office, insurance.",
  "web-maint": "Yearly cost to run and maintain the web/app platform.",
  "marketing-spend": "Annual marketing & sales budget (ads, events, etc.).",
  "new-customers": "Estimated new customers acquired each year.",
  "rentals-per-customer": "Total rentals one customer is expected to make during their lifetime.",
  "churn": "% of customers that stop renting each year (lower = better retention).",
  "growth": "Annual growth rate applied to demand (units rented).",
  "inflation": "Annual increase applied to costs (salaries, variableCost, etc.).",
  "forecast-years": "Projection horizon in years (3-5).",
  "discount-rate": "Weighted Average Cost of Capital. Used to discount cash-flows in NPV/IRR calculations."
};
