/**
 * Back Pay Estimator calculation utilities.
 *
 * Extracted from BackPayEstimator.tsx so they can be unit-tested independently.
 */

import { COMP_RATES_2026, SPOUSE_ADDITION_BY_RATING, CHILD_ADDITION_BY_RATING } from '@/data/compRates2026';

// ---------------------------------------------------------------------------
// Rate constants
// ---------------------------------------------------------------------------

export const BASE_RATES: Record<number, number> = {
  0: 0,
  ...COMP_RATES_2026,
};

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

export function calculateMonthlyCompensation(
  rating: number,
  hasSpouse: boolean,
  dependentCount: number
): number {
  const base = BASE_RATES[rating] ?? 0;
  if (rating < 30) return base;
  const spouseAdd = hasSpouse ? (SPOUSE_ADDITION_BY_RATING[rating] ?? 0) : 0;
  const depAdd = dependentCount * (CHILD_ADDITION_BY_RATING[rating] ?? 0);
  return base + spouseAdd + depAdd;
}

export function monthsBetween(start: Date, end: Date): number {
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  const totalMonths = years * 12 + months;

  // If end day >= start day, a full month has elapsed — no adjustment.
  if (end.getDate() >= start.getDate()) {
    return Math.max(0, totalMonths);
  }

  // End-of-month edge case: if the end date is the last day of its month
  // and the start date's day exceeds the number of days in the end month,
  // treat it as a full month (e.g. Jan 31 → Feb 28 = 1 month).
  const lastDayOfEndMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
  if (end.getDate() === lastDayOfEndMonth && start.getDate() > lastDayOfEndMonth) {
    return Math.max(0, totalMonths);
  }

  return Math.max(0, totalMonths - 1);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyExact(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculateBackPay(
  currentRating: number,
  newRating: number,
  effectiveDate: string,
  hasSpouse: boolean,
  dependentCount: number
): {
  monthlyBefore: number;
  monthlyAfter: number;
  monthlyDifference: number;
  totalBackPay: number;
  months: number;
} | null {
  if (newRating <= currentRating) return null;

  const parsed = new Date(effectiveDate + 'T00:00:00Z');

  if (isNaN(parsed.getTime())) return null;

  // Work in UTC so calendar-date strings (often produced via toISOString)
  // are compared consistently regardless of the local timezone.
  const startDate = new Date(
    parsed.getUTCFullYear(),
    parsed.getUTCMonth(),
    parsed.getUTCDate()
  );

  const now = new Date();
  const today = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );

  if (startDate > today) return null;

  const months = monthsBetween(startDate, today);
  const monthlyBefore = calculateMonthlyCompensation(currentRating, hasSpouse, dependentCount);
  const monthlyAfter = calculateMonthlyCompensation(newRating, hasSpouse, dependentCount);
  const monthlyDifference = monthlyAfter - monthlyBefore;
  const totalBackPay = monthlyDifference * months;

  return { monthlyBefore, monthlyAfter, monthlyDifference, totalBackPay, months };
}
