import { useMemo } from 'react';
import { BILATERAL_PAIRS } from '@/data/bilateralMap';

export const useBilateralDetector = (activeClaims: { id: string, rating: number }[]) => {
  return useMemo(() => {
    const bilateralRatings: number[] = [];
    const standardRatings: number[] = [];
    const detectedPairs: string[] = [];

    // Check each pair in the map
    BILATERAL_PAIRS.forEach(pair => {
      const matchedClaims = activeClaims.filter(c => pair.ids.includes(c.id));

      if (matchedClaims.length >= 2) {
        // We have a bilateral pair!
        matchedClaims.forEach(c => bilateralRatings.push(c.rating));
        detectedPairs.push(pair.name);
      }
    });

    // Everything else goes to standard
    activeClaims.forEach(c => {
      const hasPair = detectedPairs.some(name =>
        BILATERAL_PAIRS.find(p => p.name === name)?.ids.includes(c.id)
      );

      if (!hasPair) {
        standardRatings.push(c.rating);
      }
    });

    return { bilateralRatings, standardRatings, detectedPairs };
  }, [activeClaims]);
};
