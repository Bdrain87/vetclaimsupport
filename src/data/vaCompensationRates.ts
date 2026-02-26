// ========================================================================
// WARNING: These are 2024 rates, retained for historical reference.
// Active rates live in compRates2026.ts (effective Dec 1, 2025).
// calculateCompensation() below uses the 2026 rates.
// ========================================================================
//
// 2024 VA Compensation Rates (Effective December 1, 2023)
// Source: https://www.va.gov/disability/compensation-rates/veteran-rates/
// Last verified: February 2024

import {
  COMP_RATES_2026,
  SPOUSE_ADDITION_BY_RATING,
  CHILD_ADDITION_BY_RATING,
  SCHOOL_CHILD_ADDITION_BY_RATING,
  PARENT_ADDITION_BY_RATING,
} from './compRates2026';

export const vaCompensationRates2024 = {
  // Base rates for veteran alone (no dependents)
  base: {
    10: 171.23,
    20: 338.49,
    30: 524.31,
    40: 755.28,
    50: 1075.16,
    60: 1361.88,
    70: 1716.28,
    80: 1995.01,
    90: 2241.91,
    100: 3737.85,
  } as Record<number, number>,

  // Additional amount for spouse (only applies at 30%+)
  spouse: {
    30: 62,
    40: 82,
    50: 104,
    60: 125,
    70: 144.93,
    80: 166,
    90: 187,
    100: 208.40,
  } as Record<number, number>,

  // Additional amount per child under 18 (only applies at 30%+)
  childUnder18: {
    30: 31,
    40: 41,
    50: 51,
    60: 62,
    70: 72,
    80: 82,
    90: 93,
    100: 103.55,
  } as Record<number, number>,

  // Additional amount per child 18-23 in school (only applies at 30%+)
  childSchool: {
    30: 100,
    40: 133,
    50: 167,
    60: 200,
    70: 234,
    80: 267,
    90: 301,
    100: 334.49,
  } as Record<number, number>,

  // Additional amount per dependent parent (only applies at 30%+)
  // Note: Rate is per parent (multiply by number of dependent parents)
  dependentParent: {
    30: 57,
    40: 76,
    50: 95,
    60: 114,
    70: 134,
    80: 153,
    90: 172,
    100: 191.14,
  } as Record<number, number>,
};

export interface DependentsInfo {
  hasSpouse: boolean;
  childrenUnder18: number;
  childrenInSchool: number;
  dependentParents: number;
}

export function calculateCompensation(
  rating: number,
  dependents: DependentsInfo
): {
  baseRate: number;
  spouseAddition: number;
  childrenAddition: number;
  schoolChildrenAddition: number;
  parentsAddition: number;
  totalMonthly: number;
  totalYearly: number;
} {
  const baseRate = COMP_RATES_2026[rating] || 0;

  // Dependents only apply at 30%+
  if (rating < 30) {
    return {
      baseRate,
      spouseAddition: 0,
      childrenAddition: 0,
      schoolChildrenAddition: 0,
      parentsAddition: 0,
      totalMonthly: baseRate,
      totalYearly: baseRate * 12,
    };
  }

  // Calculate dependent additions
  const spouseAddition = dependents.hasSpouse ? (SPOUSE_ADDITION_BY_RATING[rating] || 0) : 0;
  const childrenAddition = dependents.childrenUnder18 * (CHILD_ADDITION_BY_RATING[rating] || 0);
  const schoolChildrenAddition = dependents.childrenInSchool * (SCHOOL_CHILD_ADDITION_BY_RATING[rating] || 0);
  const parentsAddition = dependents.dependentParents * (PARENT_ADDITION_BY_RATING[rating] || 0);

  const totalMonthly = baseRate + spouseAddition + childrenAddition + schoolChildrenAddition + parentsAddition;

  return {
    baseRate,
    spouseAddition,
    childrenAddition,
    schoolChildrenAddition,
    parentsAddition,
    totalMonthly,
    totalYearly: totalMonthly * 12,
  };
}
