/**
 * Unified VA Condition Search
 *
 * Merges both the rich VACondition data (~800+ from conditions/)
 * and the 780+ VADisability data from vaDisabilities.ts into a
 * single searchable index with deduplication and scored ranking.
 */

import { vaConditions, type VACondition } from '../data/vaConditions';
import { vaDisabilitiesBySystem } from '../data/vaDisabilities';

export interface SearchableCondition {
  id: string;
  name: string;
  abbreviation?: string;
  diagnosticCode: string;
  category: string;
  description?: string;
  typicalRatings?: string;
  keywords: string[];
  source: 'primary' | 'disability';
  commonSecondaries?: string[];
  nexusTip?: string;
  ratingCriteria?: string;
  bodySystem?: string;
}

// Build the unified index ONCE at module load time
let _unifiedIndex: SearchableCondition[] | null = null;

function buildUnifiedIndex(): SearchableCondition[] {
  if (_unifiedIndex) return _unifiedIndex;

  const seen = new Set<string>();
  const results: SearchableCondition[] = [];

  // Add vaConditions first (they have richer metadata)
  for (const c of vaConditions) {
    const key = `${c.name.toLowerCase()}-${c.diagnosticCode}`;
    if (!seen.has(key)) {
      seen.add(key);
      results.push({
        id: c.id,
        name: c.name,
        abbreviation: c.abbreviation,
        diagnosticCode: c.diagnosticCode,
        category: c.category,
        description: c.description,
        typicalRatings: c.typicalRatings,
        keywords: c.keywords || [],
        source: 'primary',
        commonSecondaries: c.commonSecondaries,
        nexusTip: c.nexusTip,
        bodySystem: c.bodySystem,
      });
    }
  }

  // Add vaDisabilities (780+ entries), deduplicating against what's already in
  for (const system of vaDisabilitiesBySystem) {
    for (const d of system.conditions) {
      const key = `${d.name.toLowerCase()}-${d.diagnosticCode}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          id: `disability-${d.diagnosticCode}-${d.name.replace(/\s+/g, '-').toLowerCase()}`,
          name: d.name,
          diagnosticCode: d.diagnosticCode,
          category: system.name,
          description: d.description,
          typicalRatings: d.typicalRatings,
          keywords: [],
          source: 'disability',
          ratingCriteria: d.ratingCriteria,
          bodySystem: system.name,
        });
      }
    }
  }

  _unifiedIndex = results;
  return results;
}

/**
 * Search ALL VA conditions (both the rich ~800 and the full 780+ disability list).
 * Deduplicates, scores by relevance, returns top results.
 */
export function searchAllConditions(
  query: string,
  options?: {
    excludeIds?: string[];
    category?: string;
    limit?: number;
    includeSecondariesOf?: string;
  }
): SearchableCondition[] {
  const index = buildUnifiedIndex();
  const limit = options?.limit ?? 25;

  if (!query || query.trim().length < 1) {
    // If no query but category filter, return all in that category
    if (options?.category) {
      return index
        .filter(c => c.category.toLowerCase().includes(options.category!.toLowerCase()))
        .filter(c => !options?.excludeIds?.includes(c.id))
        .slice(0, limit);
    }
    // If looking for secondaries of a primary condition
    if (options?.includeSecondariesOf) {
      const primary = index.find(c => c.id === options.includeSecondariesOf);
      if (primary?.commonSecondaries) {
        return index.filter(c => primary.commonSecondaries!.includes(c.id));
      }
    }
    return [];
  }

  const terms = query.toLowerCase().trim().split(/\s+/);
  const excludeSet = new Set(options?.excludeIds || []);

  const scored = index
    .filter(c => !excludeSet.has(c.id))
    .filter(c => !options?.category || c.category.toLowerCase().includes(options.category.toLowerCase()))
    .map(c => {
      let score = 0;

      for (const term of terms) {
        // Exact diagnostic code match
        if (c.diagnosticCode === term || c.diagnosticCode.includes(term)) score += 80;
        // Exact abbreviation match
        if (c.abbreviation?.toLowerCase() === term) score += 100;
        // Abbreviation contains
        if (c.abbreviation?.toLowerCase().includes(term)) score += 60;
        // Name match
        if (c.name.toLowerCase().includes(term)) score += 50;
        // Keyword match
        if (c.keywords.some(kw => kw.toLowerCase().includes(term))) score += 40;
        // Description match
        if (c.description?.toLowerCase().includes(term)) score += 20;
        // Category match
        if (c.category.toLowerCase().includes(term)) score += 15;
      }

      // Boost "primary" source conditions (they have better metadata)
      if (c.source === 'primary') score += 5;

      return { condition: c, score };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.condition);

  return scored;
}

/**
 * Get the total count of searchable conditions.
 */
export function getTotalConditionCount(): number {
  return buildUnifiedIndex().length;
}

/**
 * Get all unique categories from the unified index.
 */
export function getAllCategories(): string[] {
  const index = buildUnifiedIndex();
  return [...new Set(index.map(c => c.category))].sort();
}
