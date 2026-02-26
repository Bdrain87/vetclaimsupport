/**
 * 2026 VA Compensation Rates (Veteran Only, No Dependents)
 * Effective December 1, 2025 — 2.8% COLA
 * Source: https://www.va.gov/disability/compensation-rates/veteran-rates/
 */
export const COMP_RATES_2026: Record<number, number> = {
  10: 180.42,
  20: 356.66,
  30: 552.47,
  40: 795.84,
  50: 1132.90,
  60: 1435.02,
  70: 1808.45,
  80: 2102.15,
  90: 2362.30,
  100: 3938.58,
};

/**
 * Additional monthly compensation for a spouse (ratings 30%+).
 * Source: https://www.va.gov/disability/compensation-rates/veteran-rates/
 */
export const SPOUSE_ADDITION_BY_RATING: Record<number, number> = {
  30: 65.00,
  40: 87.00,
  50: 109.00,
  60: 131.00,
  70: 153.00,
  80: 175.00,
  90: 197.00,
  100: 219.59,
};

/**
 * Additional monthly compensation per child under 18 (ratings 30%+).
 * Source: https://www.va.gov/disability/compensation-rates/veteran-rates/
 */
export const CHILD_ADDITION_BY_RATING: Record<number, number> = {
  30: 32.00,
  40: 43.00,
  50: 54.00,
  60: 65.00,
  70: 76.00,
  80: 87.00,
  90: 98.00,
  100: 109.11,
};
