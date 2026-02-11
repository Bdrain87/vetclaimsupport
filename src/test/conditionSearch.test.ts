/**
 * conditionSearch — unit tests
 *
 * Tests the unified condition search that merges vaConditions (~800+)
 * and vaDisabilities (780+) into a single searchable index.
 */

import { describe, it, expect } from 'vitest';
import {
  searchAllConditions,
  getTotalConditionCount,
  getAllCategories,
} from '@/utils/conditionSearch';

describe('conditionSearch', () => {
  // -------------------------------------------------------------------------
  // getTotalConditionCount
  // -------------------------------------------------------------------------
  describe('getTotalConditionCount', () => {
    it('returns a number greater than zero', () => {
      const count = getTotalConditionCount();
      expect(count).toBeGreaterThan(0);
    });

    it('returns a consistent value on repeated calls (index is cached)', () => {
      const a = getTotalConditionCount();
      const b = getTotalConditionCount();
      expect(a).toBe(b);
    });
  });

  // -------------------------------------------------------------------------
  // getAllCategories
  // -------------------------------------------------------------------------
  describe('getAllCategories', () => {
    it('returns a non-empty array of category strings', () => {
      const categories = getAllCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(typeof categories[0]).toBe('string');
    });

    it('returns sorted categories', () => {
      const categories = getAllCategories();
      const sorted = [...categories].sort();
      expect(categories).toEqual(sorted);
    });

    it('contains no duplicates', () => {
      const categories = getAllCategories();
      const unique = [...new Set(categories)];
      expect(categories).toEqual(unique);
    });
  });

  // -------------------------------------------------------------------------
  // searchAllConditions — empty / blank query
  // -------------------------------------------------------------------------
  describe('empty query handling', () => {
    it('returns empty array for empty string query', () => {
      const results = searchAllConditions('');
      expect(results).toEqual([]);
    });

    it('returns empty array for whitespace-only query', () => {
      const results = searchAllConditions('   ');
      expect(results).toEqual([]);
    });

    it('returns results when empty query but category is given', () => {
      const categories = getAllCategories();
      // Pick the first available category and search with an empty query
      const results = searchAllConditions('', { category: categories[0] });
      expect(results.length).toBeGreaterThan(0);
      results.forEach((r) => {
        expect(r.category.toLowerCase()).toContain(categories[0].toLowerCase());
      });
    });
  });

  // -------------------------------------------------------------------------
  // Basic search
  // -------------------------------------------------------------------------
  describe('basic search', () => {
    it('returns results for a well-known condition like "PTSD"', () => {
      const results = searchAllConditions('PTSD');
      expect(results.length).toBeGreaterThan(0);
      // At least one result should have PTSD in the name or keywords
      const hasPTSD = results.some(
        (r) =>
          r.name.toLowerCase().includes('ptsd') ||
          r.abbreviation?.toLowerCase().includes('ptsd') ||
          r.keywords.some((k) => k.toLowerCase().includes('ptsd')),
      );
      expect(hasPTSD).toBe(true);
    });

    it('returns results for "tinnitus"', () => {
      const results = searchAllConditions('tinnitus');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.name.toLowerCase().includes('tinnitus'))).toBe(true);
    });

    it('returns results for "knee"', () => {
      const results = searchAllConditions('knee');
      expect(results.length).toBeGreaterThan(0);
    });

    it('respects the limit option', () => {
      const results = searchAllConditions('back', { limit: 3 });
      expect(results.length).toBeLessThanOrEqual(3);
    });
  });

  // -------------------------------------------------------------------------
  // Case insensitivity
  // -------------------------------------------------------------------------
  describe('case insensitivity', () => {
    it('returns the same results for "ptsd", "PTSD", and "Ptsd"', () => {
      const lower = searchAllConditions('ptsd');
      const upper = searchAllConditions('PTSD');
      const mixed = searchAllConditions('Ptsd');

      // They should return the same condition ids
      const ids = (arr: typeof lower) => arr.map((r) => r.id).sort();
      expect(ids(lower)).toEqual(ids(upper));
      expect(ids(lower)).toEqual(ids(mixed));
    });

    it('handles mixed-case multi-word queries', () => {
      const results = searchAllConditions('Sleep Apnea');
      const results2 = searchAllConditions('sleep apnea');
      const ids = (arr: typeof results) => arr.map((r) => r.id).sort();
      expect(ids(results)).toEqual(ids(results2));
    });
  });

  // -------------------------------------------------------------------------
  // Partial matches
  // -------------------------------------------------------------------------
  describe('partial matches', () => {
    it('matches partial name "tin" for tinnitus', () => {
      const results = searchAllConditions('tin');
      const hasTinnitus = results.some((r) => r.name.toLowerCase().includes('tinnitus'));
      expect(hasTinnitus).toBe(true);
    });

    it('matches partial diagnostic code', () => {
      // Code 6260 is tinnitus; search for just "6260"
      const results = searchAllConditions('6260');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.diagnosticCode.includes('6260'))).toBe(true);
    });

    it('matches via keywords', () => {
      // "ringing" is a common keyword for tinnitus
      const results = searchAllConditions('ringing');
      // Should return at least one result (tinnitus or hearing-related)
      expect(results.length).toBeGreaterThan(0);
    });
  });

  // -------------------------------------------------------------------------
  // excludeIds option
  // -------------------------------------------------------------------------
  describe('excludeIds', () => {
    it('filters out conditions with the given ids', () => {
      const all = searchAllConditions('tinnitus');
      expect(all.length).toBeGreaterThan(0);

      const firstId = all[0].id;
      const filtered = searchAllConditions('tinnitus', { excludeIds: [firstId] });

      expect(filtered.every((r) => r.id !== firstId)).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // category filter
  // -------------------------------------------------------------------------
  describe('category filter', () => {
    it('filters results to the given category', () => {
      const categories = getAllCategories();
      // Pick a category that is likely to have conditions
      const category = categories.find((c) => c.toLowerCase().includes('musculoskeletal')) || categories[0];

      const results = searchAllConditions('pain', { category });
      results.forEach((r) => {
        expect(r.category.toLowerCase()).toContain(category.toLowerCase());
      });
    });
  });

  // -------------------------------------------------------------------------
  // Result shape
  // -------------------------------------------------------------------------
  describe('result shape', () => {
    it('returns objects with required SearchableCondition fields', () => {
      const results = searchAllConditions('PTSD');
      expect(results.length).toBeGreaterThan(0);

      const result = results[0];
      expect(result.id).toBeTruthy();
      expect(typeof result.name).toBe('string');
      expect(typeof result.diagnosticCode).toBe('string');
      expect(typeof result.category).toBe('string');
      expect(Array.isArray(result.keywords)).toBe(true);
      expect(['primary', 'disability']).toContain(result.source);
    });
  });

  // -------------------------------------------------------------------------
  // Scoring / relevance
  // -------------------------------------------------------------------------
  describe('scoring / relevance', () => {
    it('exact abbreviation match scores higher than partial name match', () => {
      const results = searchAllConditions('PTSD');
      // The first result should be the exact PTSD condition
      expect(
        results[0].name.toLowerCase().includes('ptsd') ||
        results[0].abbreviation?.toLowerCase() === 'ptsd',
      ).toBe(true);
    });

    it('primary source conditions get a small boost', () => {
      // If a condition exists in both sources, the primary one should appear
      const results = searchAllConditions('tinnitus');
      if (results.length >= 2) {
        const primaryIdx = results.findIndex((r) => r.source === 'primary');
        const disabilityIdx = results.findIndex((r) => r.source === 'disability');
        // Primary should appear before disability for same relevance
        if (primaryIdx !== -1 && disabilityIdx !== -1) {
          expect(primaryIdx).toBeLessThan(disabilityIdx);
        }
      }
    });
  });
});
