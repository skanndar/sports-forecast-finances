
/**
 * Format a number as a currency
 */
export function formatCurrency(value: number | string, minimumFractionDigits = 0): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '€0';
  
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(numValue);
}

/**
 * Format a number as a percentage
 */
export function formatPercentage(value: number | string, minimumFractionDigits = 1): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0%';
  
  return new Intl.NumberFormat('en-EU', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits: 1,
  }).format(numValue);
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number | string, minimumFractionDigits = 0): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0';
  
  return new Intl.NumberFormat('en-EU', {
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(numValue);
}
