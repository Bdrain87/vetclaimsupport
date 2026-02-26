/**
 * Deployment Location Search Index
 *
 * Lazy singleton that indexes all locations by name, aliases,
 * country, and individual words for fast scored search.
 * Pattern follows conditionSearch.ts.
 */

import type { EnrichedLocation } from './types';
import { ALL_LOCATIONS } from './_all';

interface SearchEntry {
  location: EnrichedLocation;
  /** All searchable terms: name, aliases, country, words */
  terms: string[];
  /** Lowercase name for exact/starts-with matching */
  nameLower: string;
  /** Lowercase aliases for exact/starts-with matching */
  aliasesLower: string[];
}

let _index: SearchEntry[] | null = null;

function getIndex(): SearchEntry[] {
  if (_index) return _index;

  _index = ALL_LOCATIONS.map((loc) => {
    const nameLower = loc.name.toLowerCase();
    const aliasesLower = loc.alternateNames.map((a) => a.toLowerCase());
    const countryLower = loc.country.toLowerCase();
    const regionLower = (loc.region ?? '').toLowerCase();

    // Build all searchable terms
    const terms = [
      nameLower,
      ...aliasesLower,
      countryLower,
      regionLower,
      // Individual words from name
      ...nameLower.split(/[\s\-—/]+/).filter((w) => w.length > 1),
      // Individual words from aliases
      ...aliasesLower.flatMap((a) => a.split(/[\s\-—/]+/).filter((w) => w.length > 1)),
    ];

    return { location: loc, terms, nameLower, aliasesLower };
  });

  return _index;
}

export interface SearchOptions {
  conflictId?: string;
  limit?: number;
}

/**
 * Search deployment locations by query string.
 * Returns scored results sorted by relevance.
 */
export function searchLocations(
  query: string,
  options?: SearchOptions,
): EnrichedLocation[] {
  const limit = options?.limit ?? 50;
  const q = query.trim().toLowerCase();

  if (!q || q.length < 1) return [];

  const index = getIndex();
  const qWords = q.split(/\s+/);

  const scored = index
    .filter((entry) => !options?.conflictId || entry.location.conflictId === options.conflictId)
    .map((entry) => {
      let score = 0;

      for (const word of qWords) {
        // Exact name match
        if (entry.nameLower === word) {
          score += 100;
        } else if (entry.nameLower.startsWith(word)) {
          score += 70;
        } else if (entry.nameLower.includes(word)) {
          score += 40;
        }

        // Exact alias match (highest priority for abbreviations like BAF, TQ)
        for (const alias of entry.aliasesLower) {
          if (alias === word) {
            score += 100;
          } else if (alias.startsWith(word)) {
            score += 70;
          } else if (alias.includes(word)) {
            score += 40;
          }
        }

        // Country/region match
        if (entry.location.country.toLowerCase().includes(word)) {
          score += 25;
        }
        if (entry.location.region?.toLowerCase().includes(word)) {
          score += 20;
        }

        // Any term contains (catches word-level matches)
        if (score === 0 && entry.terms.some((t) => t.includes(word))) {
          score += 15;
        }
      }

      // Boost: name contains the full query (multi-word)
      if (qWords.length > 1 && entry.nameLower.includes(q)) {
        score += 10;
      }

      return { location: entry.location, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.location);

  return scored;
}

/**
 * Get total location count.
 */
export function getTotalLocationCount(): number {
  return getIndex().length;
}
