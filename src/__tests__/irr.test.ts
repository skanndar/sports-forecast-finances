
import { describe, test, expect } from 'vitest';
import { calculateIRR, buildCashFlows } from '@/lib/finance';

describe('IRR Calculation', () => {
  test('should return a valid IRR for valid cash flows', () => {
    // Initial investment (negative) and subsequent positive cash flows
    const cashFlows = [-1000, 300, 400, 500];
    const result = calculateIRR(cashFlows);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(1); // IRR should be between 0 and 1 (0-100%)
  });

  test('should handle complex cash flow patterns', () => {
    // More complex pattern with multiple sign changes
    const cashFlows = [-1000, 500, -200, 1000];
    const result = calculateIRR(cashFlows);
    expect(result).not.toBeNull();
  });

  test('should return null when IRR is undefined', () => {
    // All positive cash flows - IRR is undefined
    const allPositive = [1000, 500, 600];
    expect(calculateIRR(allPositive)).toBeNull();
    
    // All negative cash flows - IRR is undefined
    const allNegative = [-1000, -500, -600];
    expect(calculateIRR(allNegative)).toBeNull();
  });

  test('should handle edge cases where division by zero might occur', () => {
    // Cash flows that might cause division by zero in naive implementations
    const edgeCaseFlows = [-1000, 0, 0, 2000];
    // Should not throw and should return a valid IRR
    expect(() => calculateIRR(edgeCaseFlows)).not.toThrow();
    expect(calculateIRR(edgeCaseFlows)).not.toBeNull();
  });

  test('should handle non-convergent cases gracefully', () => {
    // A case where Newton-Raphson might not converge
    const nonConvergent = [-1000000, 0, 0, 0, 0, 1000100];
    // Should return null instead of -∞
    expect(calculateIRR(nonConvergent)).not.toBe(-Infinity);
  });
  
  test('should calculate correct IRR for typical investment scenario', () => {
    // Initial investment of 100,000 and 30,000 annual cash flows for 5 years
    // Should yield approximately 18% IRR
    const cashFlows = [-100000, 30000, 30000, 30000, 30000, 30000];
    const result = calculateIRR(cashFlows);
    expect(result).toBeGreaterThan(0.17); // 17%
    expect(result).toBeLessThan(0.19); // 19%
  });
  
  test('should build cash flows correctly with initial investment', () => {
    const yearlyResults = [
      { year: 0, cash: 10000, revenue: 0, variableCosts: 0, structuralCosts: 0, ebitda: 0 },
      { year: 1, cash: 20000, revenue: 0, variableCosts: 0, structuralCosts: 0, ebitda: 0 },
      { year: 2, cash: 30000, revenue: 0, variableCosts: 0, structuralCosts: 0, ebitda: 0 }
    ];
    
    const initialInvestment = 50000;
    
    const cashFlows = buildCashFlows(yearlyResults, initialInvestment);
    
    expect(cashFlows).toEqual([-50000, 10000, 20000, 30000]);
  });
});
