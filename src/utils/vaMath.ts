/**
 * VA Rating Logic with 10% Bilateral Factor (Bilateral Bump)
 */
export const calculatePlatinumRating = (ratings: number[], bilateralPairs: number[]) => {
  let bilateralValue = 0;
  if (bilateralPairs.length > 0) {
    const combined = bilateralPairs.reduce((acc, r) => acc * (1 - r / 100), 1);
    const baseBilateral = (1 - combined) * 100;
    // Apply the mandatory 10% Bilateral Factor bump
    bilateralValue = baseBilateral + (baseBilateral * 0.1);
  }

  const allRatings = bilateralValue > 0 ? [...ratings, bilateralValue] : ratings;
  const sorted = allRatings.sort((a, b) => b - a);

  let currentEfficiency = 100;
  let combinedRating = 0;

  sorted.forEach(rating => {
    const value = (rating * currentEfficiency) / 100;
    combinedRating += value;
    currentEfficiency -= value;
  });

  return Math.round(combinedRating / 10) * 10;
};
