/**
 * Back Pay Estimator calculation utilities.
 *
 * Extracted from BackPayEstimator.tsx so they can be unit-tested independently.
 */

import { COMP_RATES_2026 } from '@/data/compRates2026';

// ---------------------------------------------------------------------------
// Rate constants
// ---------------------------------------------------------------------------

export const BASE_RATES: Record<number, number> = {
  0: 0,
  ...COMP_RATES_2026,
};

export const SPOUSE_ADDITION = 100;
export const DEPENDENT_ADDITION = 50;

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
  const spouseAdd = hasSpouse ? SPOUSE_ADDITION : 0;
  const depAdd = dependentCount * DEPENDENT_ADDITION;
  return base + spouseAdd + depAdd;
}

export function monthsBetween(start: Date, end: Date): number {
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  const totalMonths = years * 12 + months;
  // Include partial month if the end day is past the start day
  const partialAdjust = end.getDate() >= start.getDate() ? 0 : -1;
  return Math.max(0, totalMonths + partialAdjust);
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

  const startDate = new Date(effectiveDate + 'T00:00:00');
  const today = new Date();

  if (isNaN(startDate.getTime()) || startDate > today) return null;

  const months = monthsBetween(startDate, today);
  const monthlyBefore = calculateMonthlyCompensation(currentRating, hasSpouse, dependentCount);
  const monthlyAfter = calculateMonthlyCompensation(newRating, hasSpouse, dependentCount);
  const monthlyDifference = monthlyAfter - monthlyBefore;
  const totalBackPay = monthlyDifference * months;

  return { monthlyBefore, monthlyAfter, monthlyDifference, totalBackPay, months };
}
