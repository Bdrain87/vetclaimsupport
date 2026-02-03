// 2024 VA Compensation Rates
// Source: https://www.va.gov/disability/compensation-rates/veteran-rates/

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
    30: 56,
    40: 75,
    50: 94,
    60: 112,
    70: 131,
    80: 150,
    90: 168,
    100: 187.89,
  } as Record<number, number>,

  // Additional amount per child under 18 (only applies at 30%+)
  childUnder18: {
    30: 29,
    40: 38,
    50: 48,
    60: 58,
    70: 67,
    80: 77,
    90: 86,
    100: 96.32,
  } as Record<number, number>,

  // Additional amount per child 18-23 in school (only applies at 30%+)
  childSchool: {
    30: 93,
    40: 124,
    50: 155,
    60: 186,
    70: 217,
    80: 248,
    90: 279,
    100: 310.71,
  } as Record<number, number>,

  // Additional amount per dependent parent (only applies at 30%+)
  dependentParent: {
    30: 44,
    40: 58,
    50: 73,
    60: 87,
    70: 102,
    80: 116,
    90: 131,
    100: 145.70,
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
  const rates = vaCompensationRates2024;

  // Get base rate
  const baseRate = rates.base[rating] || 0;

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
  const spouseAddition = dependents.hasSpouse ? (rates.spouse[rating] || 0) : 0;
  const childrenAddition = dependents.childrenUnder18 * (rates.childUnder18[rating] || 0);
  const schoolChildrenAddition = dependents.childrenInSchool * (rates.childSchool[rating] || 0);
  const parentsAddition = dependents.dependentParents * (rates.dependentParent[rating] || 0);

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
