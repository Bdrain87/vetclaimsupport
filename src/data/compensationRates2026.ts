// 2026 VA Disability Compensation Rates (effective December 1, 2025)
// Based on projected 2.5% COLA increase from 2025 rates
// Source: VA.gov/disability/compensation-rates

export interface CompensationRate {
  rating: number;
  veteranAlone: number;
  withSpouse: number;
  withSpouseAndOneChild: number;
  withSpouseAndTwoChildren: number;
  withOneChild: number;
  withTwoChildren: number;
  additionalChild: number;
  aidAndAttendanceSpouse: number;
}

// 2026 VA Disability Compensation Rates
export const COMPENSATION_RATES_2026: CompensationRate[] = [
  {
    rating: 10,
    veteranAlone: 175.51,
    withSpouse: 175.51,
    withSpouseAndOneChild: 175.51,
    withSpouseAndTwoChildren: 175.51,
    withOneChild: 175.51,
    withTwoChildren: 175.51,
    additionalChild: 0,
    aidAndAttendanceSpouse: 0
  },
  {
    rating: 20,
    veteranAlone: 347.08,
    withSpouse: 347.08,
    withSpouseAndOneChild: 347.08,
    withSpouseAndTwoChildren: 347.08,
    withOneChild: 347.08,
    withTwoChildren: 347.08,
    additionalChild: 0,
    aidAndAttendanceSpouse: 0
  },
  {
    rating: 30,
    veteranAlone: 537.69,
    withSpouse: 601.35,
    withSpouseAndOneChild: 651.35,
    withSpouseAndTwoChildren: 701.35,
    withOneChild: 581.35,
    withTwoChildren: 631.35,
    additionalChild: 32.00,
    aidAndAttendanceSpouse: 57.00
  },
  {
    rating: 40,
    veteranAlone: 774.82,
    withSpouse: 858.82,
    withSpouseAndOneChild: 922.82,
    withSpouseAndTwoChildren: 986.82,
    withOneChild: 838.82,
    withTwoChildren: 902.82,
    additionalChild: 43.00,
    aidAndAttendanceSpouse: 76.00
  },
  {
    rating: 50,
    veteranAlone: 1102.83,
    withSpouse: 1207.83,
    withSpouseAndOneChild: 1285.83,
    withSpouseAndTwoChildren: 1363.83,
    withOneChild: 1180.83,
    withTwoChildren: 1258.83,
    additionalChild: 54.00,
    aidAndAttendanceSpouse: 95.00
  },
  {
    rating: 60,
    veteranAlone: 1395.93,
    withSpouse: 1521.93,
    withSpouseAndOneChild: 1613.93,
    withSpouseAndTwoChildren: 1705.93,
    withOneChild: 1487.93,
    withTwoChildren: 1579.93,
    additionalChild: 65.00,
    aidAndAttendanceSpouse: 114.00
  },
  {
    rating: 70,
    veteranAlone: 1759.93,
    withSpouse: 1907.93,
    withSpouseAndOneChild: 2013.93,
    withSpouseAndTwoChildren: 2119.93,
    withOneChild: 1865.93,
    withTwoChildren: 1971.93,
    additionalChild: 75.00,
    aidAndAttendanceSpouse: 133.00
  },
  {
    rating: 80,
    veteranAlone: 2044.93,
    withSpouse: 2213.93,
    withSpouseAndOneChild: 2333.93,
    withSpouseAndTwoChildren: 2453.93,
    withOneChild: 2164.93,
    withTwoChildren: 2284.93,
    additionalChild: 86.00,
    aidAndAttendanceSpouse: 152.00
  },
  {
    rating: 90,
    veteranAlone: 2298.02,
    withSpouse: 2488.02,
    withSpouseAndOneChild: 2622.02,
    withSpouseAndTwoChildren: 2756.02,
    withOneChild: 2432.02,
    withTwoChildren: 2566.02,
    additionalChild: 97.00,
    aidAndAttendanceSpouse: 171.00
  },
  {
    rating: 100,
    veteranAlone: 3830.42,
    withSpouse: 4041.91,
    withSpouseAndOneChild: 4189.91,
    withSpouseAndTwoChildren: 4337.91,
    withOneChild: 3978.42,
    withTwoChildren: 4126.42,
    additionalChild: 108.38,
    aidAndAttendanceSpouse: 190.19
  }
];

/**
 * Get compensation rate for a specific rating percentage
 */
export function getCompensationRate(rating: number): CompensationRate | undefined {
  // Round to nearest 10
  const roundedRating = Math.round(rating / 10) * 10;
  return COMPENSATION_RATES_2026.find(r => r.rating === roundedRating);
}

/**
 * Format a number as US currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Calculate estimated annual compensation
 */
export function getAnnualCompensation(monthlyAmount: number): number {
  return monthlyAmount * 12;
}

/**
 * Get all available ratings
 */
export function getAvailableRatings(): number[] {
  return COMPENSATION_RATES_2026.map(r => r.rating);
}
