import { describe, it, expect } from 'vitest';
import {
  calculateMonthlyCompensation,
  monthsBetween,
  formatCurrency,
  formatCurrencyExact,
  calculateBackPay,
  BASE_RATES,
} from '@/utils/backPayCalc';
import { SPOUSE_ADDITION_BY_RATING, CHILD_ADDITION_BY_RATING } from '@/data/compRates2026';

// ---------------------------------------------------------------------------
// calculateMonthlyCompensation
// ---------------------------------------------------------------------------
describe('calculateMonthlyCompensation', () => {
  describe('base rates (no dependents)', () => {
    it('returns $0 for 0% rating', () => {
      expect(calculateMonthlyCompensation(0, false, 0)).toBe(0);
    });

    it('returns correct base for 10% rating', () => {
      expect(calculateMonthlyCompensation(10, false, 0)).toBe(BASE_RATES[10]);
    });

    it('returns correct base for 30% rating', () => {
      expect(calculateMonthlyCompensation(30, false, 0)).toBe(BASE_RATES[30]);
    });

    it('returns correct base for 50% rating', () => {
      expect(calculateMonthlyCompensation(50, false, 0)).toBe(BASE_RATES[50]);
    });

    it('returns correct base for 70% rating', () => {
      expect(calculateMonthlyCompensation(70, false, 0)).toBe(BASE_RATES[70]);
    });

    it('returns correct base for 100% rating', () => {
      expect(calculateMonthlyCompensation(100, false, 0)).toBe(BASE_RATES[100]);
    });
  });

  describe('dependent adjustments below 30%', () => {
    it('does NOT add spouse addition at 10%', () => {
      // Below 30%, dependents do not increase compensation
      expect(calculateMonthlyCompensation(10, true, 0)).toBe(BASE_RATES[10]);
    });

    it('does NOT add dependent addition at 20%', () => {
      expect(calculateMonthlyCompensation(20, false, 3)).toBe(BASE_RATES[20]);
    });

    it('does NOT add spouse or dependent additions at 0%', () => {
      expect(calculateMonthlyCompensation(0, true, 5)).toBe(0);
    });
  });

  describe('dependent adjustments at 30% and above', () => {
    it('adds spouse addition at 30%', () => {
      expect(calculateMonthlyCompensation(30, true, 0)).toBe(
        BASE_RATES[30] + SPOUSE_ADDITION_BY_RATING[30]
      );
    });

    it('adds dependent additions at 50%', () => {
      const deps = 3;
      expect(calculateMonthlyCompensation(50, false, deps)).toBe(
        BASE_RATES[50] + deps * CHILD_ADDITION_BY_RATING[50]
      );
    });

    it('adds both spouse and dependent additions at 70%', () => {
      const deps = 2;
      expect(calculateMonthlyCompensation(70, true, deps)).toBe(
        BASE_RATES[70] + SPOUSE_ADDITION_BY_RATING[70] + deps * CHILD_ADDITION_BY_RATING[70]
      );
    });

    it('adds both spouse and dependent additions at 100%', () => {
      const deps = 4;
      expect(calculateMonthlyCompensation(100, true, deps)).toBe(
        BASE_RATES[100] + SPOUSE_ADDITION_BY_RATING[100] + deps * CHILD_ADDITION_BY_RATING[100]
      );
    });

    it('handles zero dependents with spouse at 90%', () => {
      expect(calculateMonthlyCompensation(90, true, 0)).toBe(
        BASE_RATES[90] + SPOUSE_ADDITION_BY_RATING[90]
      );
    });
  });

  describe('edge cases', () => {
    it('returns 0 for an unknown rating', () => {
      // Rating not in the table (e.g. 15) falls back to 0 via ?? 0
      expect(calculateMonthlyCompensation(15, false, 0)).toBe(0);
    });
  });
});

// ---------------------------------------------------------------------------
// monthsBetween
// ---------------------------------------------------------------------------
describe('monthsBetween', () => {
  it('returns 0 for the same date', () => {
    const d = new Date('2024-06-15T00:00:00');
    expect(monthsBetween(d, d)).toBe(0);
  });

  it('returns 1 for exactly one month apart (same day)', () => {
    const start = new Date('2024-01-15T00:00:00');
    const end = new Date('2024-02-15T00:00:00');
    expect(monthsBetween(start, end)).toBe(1);
  });

  it('returns 12 for exactly one year apart', () => {
    const start = new Date('2023-03-01T00:00:00');
    const end = new Date('2024-03-01T00:00:00');
    expect(monthsBetween(start, end)).toBe(12);
  });

  it('returns 6 for six months apart', () => {
    const start = new Date('2024-01-10T00:00:00');
    const end = new Date('2024-07-10T00:00:00');
    expect(monthsBetween(start, end)).toBe(6);
  });

  it('subtracts 1 for partial month where end day < start day', () => {
    const start = new Date('2024-01-20T00:00:00');
    const end = new Date('2024-02-10T00:00:00');
    // totalMonths = 1, but end.getDate() (10) < start.getDate() (20) => partialAdjust = -1
    expect(monthsBetween(start, end)).toBe(0);
  });

  it('counts correctly across year boundaries', () => {
    const start = new Date('2023-11-01T00:00:00');
    const end = new Date('2024-02-01T00:00:00');
    expect(monthsBetween(start, end)).toBe(3);
  });

  it('returns 0 when end is before start', () => {
    const start = new Date('2025-06-01T00:00:00');
    const end = new Date('2025-01-01T00:00:00');
    // Negative totalMonths, Math.max(0, ...) clamps to 0
    expect(monthsBetween(start, end)).toBe(0);
  });

  it('handles last day of month correctly', () => {
    const start = new Date('2024-01-31T00:00:00');
    const end = new Date('2024-03-31T00:00:00');
    expect(monthsBetween(start, end)).toBe(2);
  });

  it('handles 24-month span', () => {
    const start = new Date('2022-06-15T00:00:00');
    const end = new Date('2024-06-15T00:00:00');
    expect(monthsBetween(start, end)).toBe(24);
  });
});

// ---------------------------------------------------------------------------
// formatCurrency / formatCurrencyExact
// ---------------------------------------------------------------------------
describe('formatCurrency', () => {
  it('formats whole dollar amounts', () => {
    expect(formatCurrency(1500)).toBe('$1,500');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('rounds to nearest dollar', () => {
    // minimumFractionDigits: 0, maximumFractionDigits: 0
    const result = formatCurrency(1234.56);
    expect(result).toBe('$1,235');
  });
});

describe('formatCurrencyExact', () => {
  it('includes cents', () => {
    expect(formatCurrencyExact(1234.56)).toBe('$1,234.56');
  });

  it('pads to two decimal places', () => {
    expect(formatCurrencyExact(100)).toBe('$100.00');
  });

  it('formats zero with cents', () => {
    expect(formatCurrencyExact(0)).toBe('$0.00');
  });
});

// ---------------------------------------------------------------------------
// calculateBackPay (integration of the helpers)
// ---------------------------------------------------------------------------
describe('calculateBackPay', () => {
  it('returns null when new rating is not higher than current rating', () => {
    expect(calculateBackPay(50, 30, '2024-01-01', false, 0)).toBeNull();
  });

  it('returns null when ratings are equal', () => {
    expect(calculateBackPay(50, 50, '2024-01-01', false, 0)).toBeNull();
  });

  it('returns null for an invalid date string', () => {
    expect(calculateBackPay(10, 50, 'not-a-date', false, 0)).toBeNull();
  });

  it('returns null for a future effective date', () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 2);
    const dateStr = future.toISOString().split('T')[0];
    expect(calculateBackPay(10, 50, dateStr, false, 0)).toBeNull();
  });

  it('calculates correct back pay for simple case', () => {
    // Use a date far enough in the past to guarantee a known month count
    const start = new Date();
    start.setMonth(start.getMonth() - 12);
    // Make sure day-of-month matches to avoid partial-month adjustment
    const dateStr = start.toISOString().split('T')[0];

    const result = calculateBackPay(0, 50, dateStr, false, 0);
    expect(result).not.toBeNull();
    expect(result!.months).toBe(12);
    expect(result!.monthlyBefore).toBe(0);
    expect(result!.monthlyAfter).toBe(BASE_RATES[50]);
    expect(result!.monthlyDifference).toBe(BASE_RATES[50]);
    expect(result!.totalBackPay).toBe(BASE_RATES[50] * 12);
  });

  it('calculates monthly difference correctly with dependents', () => {
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    const dateStr = start.toISOString().split('T')[0];

    const result = calculateBackPay(30, 70, dateStr, true, 2);
    expect(result).not.toBeNull();

    const expectedBefore = BASE_RATES[30] + SPOUSE_ADDITION_BY_RATING[30] + 2 * CHILD_ADDITION_BY_RATING[30];
    const expectedAfter = BASE_RATES[70] + SPOUSE_ADDITION_BY_RATING[70] + 2 * CHILD_ADDITION_BY_RATING[70];
    expect(result!.monthlyBefore).toBe(expectedBefore);
    expect(result!.monthlyAfter).toBe(expectedAfter);
    expect(result!.monthlyDifference).toBe(expectedAfter - expectedBefore);
  });

  it('produces zero back pay when months is zero', () => {
    // Use today's date
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const result = calculateBackPay(10, 50, dateStr, false, 0);
    expect(result).not.toBeNull();
    expect(result!.months).toBe(0);
    expect(result!.totalBackPay).toBe(0);
  });

  it('totalBackPay equals monthlyDifference * months', () => {
    const start = new Date();
    start.setMonth(start.getMonth() - 18);
    const dateStr = start.toISOString().split('T')[0];

    const result = calculateBackPay(10, 100, dateStr, false, 0);
    expect(result).not.toBeNull();
    expect(result!.totalBackPay).toBe(result!.monthlyDifference * result!.months);
  });

  it('dependent adjustments only apply when both ratings are 30%+', () => {
    // Going from 10% to 50% with spouse and dependents
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    const dateStr = start.toISOString().split('T')[0];

    const result = calculateBackPay(10, 50, dateStr, true, 2);
    expect(result).not.toBeNull();
    // At 10%, no dependent additions => monthlyBefore = base rate only
    expect(result!.monthlyBefore).toBe(BASE_RATES[10]);
    // At 50%, dependent additions apply
    expect(result!.monthlyAfter).toBe(
      BASE_RATES[50] + SPOUSE_ADDITION_BY_RATING[50] + 2 * CHILD_ADDITION_BY_RATING[50]
    );
  });
});
