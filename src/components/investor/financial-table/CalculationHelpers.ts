
import { YearResult } from '@/lib/types';

// Calculate gross margin for each year
export const calculateGrossMargin = (year: YearResult): number => {
  return year.revenue - year.variableCosts;
};

// Calculate gross margin percentage for each year
export const calculateGrossMarginPct = (year: YearResult): number => {
  if (year.revenue === 0) return 0;
  return (calculateGrossMargin(year) / year.revenue) * 100;
};
