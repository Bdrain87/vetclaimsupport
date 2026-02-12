import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBilateralDetector } from '../useBilateralDetector';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeClaim(id: string, rating: number) {
  return { id, rating };
}

// ===========================================================================
// useBilateralDetector
// ===========================================================================
describe('useBilateralDetector', () => {
  // --- Empty input ---

  it('returns empty arrays when given no claims', () => {
    const { result } = renderHook(() => useBilateralDetector([]));
    expect(result.current.bilateralRatings).toEqual([]);
    expect(result.current.standardRatings).toEqual([]);
    expect(result.current.detectedPairs).toEqual([]);
  });

  // --- No bilateral pairs ---

  it('puts all claims into standardRatings when none form a bilateral pair', () => {
    const claims = [
      makeClaim('ptsd', 50),
      makeClaim('tinnitus', 10),
      makeClaim('back-strain', 20),
    ];
    const { result } = renderHook(() => useBilateralDetector(claims));

    expect(result.current.bilateralRatings).toEqual([]);
    expect(result.current.standardRatings).toEqual([50, 10, 20]);
    expect(result.current.detectedPairs).toEqual([]);
  });

  it('treats a single side of a pair as standard (not bilateral)', () => {
    const claims = [makeClaim('knee-left', 30)];
    const { result } = renderHook(() => useBilateralDetector(claims));

    expect(result.current.bilateralRatings).toEqual([]);
    expect(result.current.standardRatings).toEqual([30]);
    expect(result.current.detectedPairs).toEqual([]);
  });

  // --- Bilateral pair detection ---

  it('detects a knee bilateral pair', () => {
    const claims = [
      makeClaim('knee-left', 30),
      makeClaim('knee-right', 20),
    ];
    const { result } = renderHook(() => useBilateralDetector(claims));

    expect(result.current.bilateralRatings).toEqual([30, 20]);
    expect(result.current.standardRatings).toEqual([]);
    expect(result.current.detectedPairs).toEqual(['Knees']);
  });

  it('detects a shoulder bilateral pair', () => {
    const claims = [
      makeClaim('shoulder-left', 40),
      makeClaim('shoulder-right', 10),
    ];
    const { result } = renderHook(() => useBilateralDetector(claims));

    expect(result.current.bilateralRatings).toEqual([40, 10]);
    expect(result.current.standardRatings).toEqual([]);
    expect(result.current.detectedPairs).toEqual(['Shoulders']);
  });

  it('detects an ankle bilateral pair', () => {
    const claims = [
      makeClaim('ankle-left', 20),
      makeClaim('ankle-right', 20),
    ];
    const { result } = renderHook(() => useBilateralDetector(claims));

    expect(result.current.bilateralRatings).toEqual([20, 20]);
    expect(result.current.standardRatings).toEqual([]);
    expect(result.current.detectedPairs).toEqual(['Ankles']);
  });

  it('detects a hip bilateral pair', () => {
    const claims = [
      makeClaim('hip-left', 10),
      makeClaim('hip-right', 30),
    ];
    const { result } = renderHook(() => useBilateralDetector(claims));

    expect(result.current.bilateralRatings).toEqual([10, 30]);
    expect(result.current.standardRatings).toEqual([]);
    expect(result.current.detectedPairs).toEqual(['Hips']);
  });

  it('detects a radiculopathy (lower) bilateral pair', () => {
    const claims = [
      makeClaim('sciatic-nerve-left', 20),
      makeClaim('sciatic-nerve-right', 20),
    ];
    const { result } = renderHook(() => useBilateralDetector(claims));

    expect(result.current.bilateralRatings).toEqual([20, 20]);
    expect(result.current.standardRatings).toEqual([]);
    expect(result.current.detectedPairs).toEqual(['Radiculopathy (Lower Extremity)']);
  });

  // --- Mix of bilateral and standard ---

  it('correctly separates bilateral and standard claims in a mixed set', () => {
    const claims = [
      makeClaim('ptsd', 70),
      makeClaim('knee-left', 30),
      makeClaim('knee-right', 20),
      makeClaim('tinnitus', 10),
    ];
    const { result } = renderHook(() => useBilateralDetector(claims));

    expect(result.current.bilateralRatings).toEqual([30, 20]);
    expect(result.current.standardRatings).toEqual([70, 10]);
    expect(result.current.detectedPairs).toEqual(['Knees']);
  });

  it('handles multiple bilateral pairs with standard claims', () => {
    const claims = [
      makeClaim('knee-left', 30),
      makeClaim('knee-right', 20),
      makeClaim('shoulder-left', 40),
      makeClaim('shoulder-right', 10),
      makeClaim('ptsd', 50),
      makeClaim('back-strain', 20),
    ];
    const { result } = renderHook(() => useBilateralDetector(claims));

    expect(result.current.bilateralRatings).toEqual(
      expect.arrayContaining([30, 20, 40, 10]),
    );
    expect(result.current.bilateralRatings).toHaveLength(4);
    expect(result.current.standardRatings).toEqual(
      expect.arrayContaining([50, 20]),
    );
    expect(result.current.standardRatings).toHaveLength(2);
    expect(result.current.detectedPairs).toEqual(
      expect.arrayContaining(['Knees', 'Shoulders']),
    );
    expect(result.current.detectedPairs).toHaveLength(2);
  });

  it('handles multiple bilateral pairs with no standard claims', () => {
    const claims = [
      makeClaim('ankle-left', 10),
      makeClaim('ankle-right', 10),
      makeClaim('hip-left', 20),
      makeClaim('hip-right', 30),
    ];
    const { result } = renderHook(() => useBilateralDetector(claims));

    expect(result.current.bilateralRatings).toHaveLength(4);
    expect(result.current.standardRatings).toEqual([]);
    expect(result.current.detectedPairs).toHaveLength(2);
    expect(result.current.detectedPairs).toEqual(
      expect.arrayContaining(['Ankles', 'Hips']),
    );
  });

  // --- Edge case: unknown IDs ---

  it('treats claims with unrecognized IDs as standard', () => {
    const claims = [
      makeClaim('foo-left', 10),
      makeClaim('foo-right', 20),
    ];
    const { result } = renderHook(() => useBilateralDetector(claims));

    expect(result.current.bilateralRatings).toEqual([]);
    expect(result.current.standardRatings).toEqual([10, 20]);
    expect(result.current.detectedPairs).toEqual([]);
  });

  // --- Memoization: same reference on same input ---

  it('returns the same object reference when called with the same claims array', () => {
    const claims = [makeClaim('ptsd', 50)];
    const { result, rerender } = renderHook(() => useBilateralDetector(claims));

    const first = result.current;
    rerender();
    const second = result.current;

    // useMemo should return the same reference since `claims` reference is stable
    expect(first).toBe(second);
  });
});
