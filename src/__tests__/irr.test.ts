
import { describe, test, expect } from 'vitest';
import { calculateIRR } from '@/lib/finance';

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
});
