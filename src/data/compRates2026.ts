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
  30: 61.00,
  40: 81.00,
  50: 101.00,
  60: 121.00,
  70: 141.00,
  80: 161.00,
  90: 181.00,
  100: 201.41,
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

/**
 * Additional monthly compensation per child 18-23 in school (ratings 30%+).
 * Source: https://www.va.gov/disability/compensation-rates/veteran-rates/
 */
export const SCHOOL_CHILD_ADDITION_BY_RATING: Record<number, number> = {
  30: 105.00,
  40: 140.00,
  50: 176.00,
  60: 211.00,
  70: 246.00,
  80: 281.00,
  90: 317.00,
  100: 352.45,
};

/**
 * Additional monthly compensation per dependent parent (ratings 30%+).
 * Source: https://www.va.gov/disability/compensation-rates/veteran-rates/
 */
export const PARENT_ADDITION_BY_RATING: Record<number, number> = {
  30: 52.00,
  40: 70.00,
  50: 88.00,
  60: 105.00,
  70: 123.00,
  80: 140.00,
  90: 158.00,
  100: 176.24,
};
