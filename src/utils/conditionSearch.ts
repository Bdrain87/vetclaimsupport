/**
 * Unified VA Condition Search
 *
 * Merges both the rich VACondition data (~790+ from conditions/)
 * and the 780+ VADisability data from vaDisabilities.ts into a
 * single searchable index with deduplication and scored ranking.
 *
 * Features:
 * - Fuzzy matching (Levenshtein distance)
 * - Synonym expansion ("ringing in ears" -> tinnitus, "bad back" -> lumbosacral strain)
 * - Popular conditions shown when search is empty
 */

import { vaConditions } from '../data/vaConditions';
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

// ── Synonym Map ────────────────────────────────────────────────────────
// Maps common layperson phrases to VA condition names/abbreviations.
const SYNONYM_MAP: Record<string, string[]> = {
  'ringing in ears': ['tinnitus'],
  'ringing ears': ['tinnitus'],
  'ear ringing': ['tinnitus'],
  'bad back': ['lumbosacral strain', 'degenerative disc', 'intervertebral disc'],
  'back pain': ['lumbosacral strain', 'degenerative disc', 'thoracolumbar'],
  'lower back': ['lumbosacral strain', 'lumbar'],
  'upper back': ['thoracolumbar', 'cervical'],
  'neck pain': ['cervical strain', 'cervical spine'],
  'bad knee': ['knee strain', 'patellofemoral', 'meniscal'],
  'knee pain': ['knee strain', 'patellofemoral'],
  'knee problems': ['knee strain', 'patellofemoral', 'meniscal'],
  'bad shoulder': ['shoulder strain', 'rotator cuff', 'glenohumeral'],
  'shoulder pain': ['shoulder strain', 'rotator cuff'],
  'headaches': ['migraine', 'tension headache', 'cephalgia'],
  'hearing loss': ['bilateral hearing loss', 'sensorineural hearing', 'auditory'],
  'hard of hearing': ['bilateral hearing loss', 'sensorineural hearing'],
  'cant hear': ['bilateral hearing loss', 'sensorineural hearing'],
  'cant sleep': ['insomnia', 'sleep apnea', 'sleep disturbance'],
  'sleep problems': ['insomnia', 'sleep apnea', 'sleep disturbance'],
  'nightmares': ['ptsd', 'sleep disturbance', 'nightmare disorder'],
  'anxiety': ['generalized anxiety', 'anxiety disorder', 'adjustment disorder'],
  'depression': ['major depressive', 'depressive disorder', 'persistent depressive'],
  'ptsd': ['post-traumatic stress', 'ptsd'],
  'flat feet': ['pes planus', 'flatfoot'],
  'plantar fasciitis': ['plantar fasciitis', 'heel pain'],
  'burn pit': ['burn pit', 'constrictive bronchiolitis', 'sinusitis', 'rhinitis'],
  'agent orange': ['agent orange', 'herbicide', 'ischemic heart', 'diabetes mellitus'],
  'gulf war': ['gulf war illness', 'chronic fatigue', 'fibromyalgia', 'irritable bowel'],
  'heart problems': ['ischemic heart', 'coronary artery', 'hypertension'],
  'high blood pressure': ['hypertension'],
  'diabetes': ['diabetes mellitus'],
  'skin rash': ['dermatitis', 'eczema', 'chloracne', 'skin condition'],
  'gerd': ['gastroesophageal reflux', 'gerd'],
  'acid reflux': ['gastroesophageal reflux', 'gerd'],
  'stomach problems': ['irritable bowel', 'gastroesophageal', 'hiatal hernia'],
  'breathing problems': ['asthma', 'copd', 'restrictive lung', 'sleep apnea'],
  'shortness of breath': ['asthma', 'copd', 'restrictive lung'],
  'carpal tunnel': ['carpal tunnel', 'median nerve'],
  'sciatica': ['sciatica', 'radiculopathy', 'sciatic nerve'],
  'numbness': ['neuropathy', 'radiculopathy', 'nerve damage'],
  'tingling': ['neuropathy', 'radiculopathy', 'peripheral nerve'],
};

// ── Popular conditions (shown when search is empty) ────────────────────
const POPULAR_CONDITION_IDS = [
  'tinnitus',
  'ptsd',
  'lumbosacral-strain',
  'bilateral-hearing-loss',
  'sleep-apnea',
  'knee-strain',
  'migraine',
  'gerd',
  'flatfoot',
  'radiculopathy',
];

// ── Levenshtein distance (fuzzy matching) ──────────────────────────────
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  if (a === b) return 0;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[b.length][a.length];
}

function fuzzyMatch(query: string, target: string, maxDistance = 2): boolean {
  if (target.includes(query)) return true;
  // Only fuzzy match if query is >= 4 chars (short strings produce too many false positives)
  if (query.length < 4) return false;
  // Check each word in the target
  const targetWords = target.split(/\s+/);
  for (const word of targetWords) {
    if (word.length >= query.length - 1 && levenshtein(query, word) <= maxDistance) {
      return true;
    }
  }
  return false;
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
          id: `disability-${d.diagnosticCode}`,
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
 * Get popular conditions for display when search is empty.
 */
export function getPopularConditions(): SearchableCondition[] {
  const index = buildUnifiedIndex();
  return POPULAR_CONDITION_IDS
    .map(id => index.find(c => c.id === id))
    .filter((c): c is SearchableCondition => c !== undefined);
}

/**
 * Search ALL VA conditions (both the rich ~800 and the full 780+ disability list).
 * Deduplicates, scores by relevance, returns top results.
 * Includes fuzzy matching and synonym expansion.
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
      const cat = options.category;
      return index
        .filter(c => c.category.toLowerCase().includes(cat.toLowerCase()))
        .filter(c => !options?.excludeIds?.includes(c.id))
        .slice(0, limit);
    }
    // If looking for secondaries of a primary condition
    if (options?.includeSecondariesOf) {
      const primary = index.find(c => c.id === options.includeSecondariesOf);
      if (primary?.commonSecondaries) {
        const secondaries = primary.commonSecondaries;
        return index.filter(c => secondaries.includes(c.id));
      }
    }
    return [];
  }

  const queryLower = query.toLowerCase().trim();
  const terms = queryLower.split(/\s+/);
  const excludeSet = new Set(options?.excludeIds || []);

  // Expand synonyms: check if the full query matches a synonym
  const synonymExpansions: string[] = [];
  for (const [phrase, expansions] of Object.entries(SYNONYM_MAP)) {
    if (queryLower.includes(phrase) || phrase.includes(queryLower)) {
      synonymExpansions.push(...expansions);
    }
  }

  const scored = index
    .filter(c => !excludeSet.has(c.id))
    .filter(c => !options?.category || c.category.toLowerCase().includes(options.category.toLowerCase()))
    .map(c => {
      let score = 0;
      const nameLower = c.name.toLowerCase();
      const abbrLower = c.abbreviation?.toLowerCase() || '';

      // Synonym match boost
      for (const synonym of synonymExpansions) {
        if (nameLower.includes(synonym.toLowerCase()) || abbrLower.includes(synonym.toLowerCase())) {
          score += 90;
          break;
        }
      }

      for (const term of terms) {
        // Exact diagnostic code match
        if (c.diagnosticCode === term || c.diagnosticCode.includes(term)) score += 80;
        // Exact abbreviation match
        if (abbrLower === term) score += 100;
        // Abbreviation contains
        if (abbrLower.includes(term)) score += 60;
        // Name exact match
        if (nameLower === term) score += 95;
        // Name contains
        if (nameLower.includes(term)) score += 50;
        // Keyword match
        if (c.keywords.some(kw => kw.toLowerCase().includes(term))) score += 40;
        // Description match
        if (c.description?.toLowerCase().includes(term)) score += 20;
        // Category match
        if (c.category.toLowerCase().includes(term)) score += 15;

        // Fuzzy matching for typos (e.g., "tinitus" -> "tinnitus")
        if (score === 0 || !nameLower.includes(term)) {
          if (fuzzyMatch(term, nameLower)) score += 35;
          if (abbrLower && fuzzyMatch(term, abbrLower)) score += 45;
        }
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
