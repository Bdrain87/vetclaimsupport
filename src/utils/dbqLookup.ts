/**
 * DBQ & Rating Criteria Lookup Utilities
 *
 * Resolves a VACondition to the matching DBQ reference and/or rating criteria
 * using multi-strategy matching (id, diagnostic codes, name fuzzy match).
 * Replaces the old hardcoded regex approach in ConditionDetail.
 */
import { dcMatches } from '@/utils/dcMatch';
import {
  dbqQuickReference,
  type DBQReference,
} from '@/data/vaResources/dbqReference';
import {
  getRatingCriteriaByCondition,
  getRatingCriteriaByDiagnosticCode,
  type RatingCriteria,
} from '@/data/vaResources/ratingCriteria';
import {
  conditionRatingCriteria,
  type ConditionRatingCriteria,
} from '@/data/ratingCriteria';

// ── DBQ Lookup ────────────────────────────────────────────────

/**
 * Find the DBQ reference for a condition using multiple strategies:
 * 1. Direct id match (condition.id === dbq.id)
 * 2. Diagnostic code overlap
 * 3. Fuzzy name match against conditionsCovered
 */
export function resolveDBQ(condition: {
  id: string;
  name: string;
  diagnosticCode?: string;
  diagnosticCodes?: string[];
  formNumber?: string;
}): DBQReference | undefined {
  // Strategy 0: form number match (most reliable for uploaded DBQs)
  if (condition.formNumber) {
    const normalized = condition.formNumber.replace(/\s+/g, '').toUpperCase();
    const byForm = dbqQuickReference.find((d) => d.formNumber.replace(/\s+/g, '').toUpperCase() === normalized);
    if (byForm) return byForm;
  }

  // Strategy 1: direct id match
  const byId = dbqQuickReference.find((d) => d.id === condition.id);
  if (byId) return byId;

  // Collect all diagnostic codes for this condition
  const codes = new Set<string>();
  if (condition.diagnosticCode) codes.add(condition.diagnosticCode);
  if (condition.diagnosticCodes) condition.diagnosticCodes.forEach((c) => codes.add(c));

  // Strategy 2: diagnostic code overlap (range-aware)
  if (codes.size > 0) {
    const byCode = dbqQuickReference.find((d) =>
      d.diagnosticCodes.some((dc) =>
        Array.from(codes).some((code) =>
          dcMatches(dc, code),
        ),
      ),
    );
    if (byCode) return byCode;
  }

  // Strategy 3: fuzzy name match against conditionsCovered
  const nameLower = condition.name.toLowerCase();
  const nameWords = nameLower.split(/[\s,/()-]+/).filter((w) => w.length > 2);

  let bestMatch: DBQReference | undefined;
  let bestScore = 0;

  for (const dbq of dbqQuickReference) {
    for (const covered of dbq.conditionsCovered) {
      const coveredLower = covered.toLowerCase();
      // Check if condition name contains the covered term or vice versa
      if (nameLower.includes(coveredLower) || coveredLower.includes(nameLower)) {
        return dbq; // Strong match
      }
      // Word overlap scoring
      const coveredWords = coveredLower.split(/[\s,/()-]+/).filter((w) => w.length > 2);
      const overlap = nameWords.filter((w) => coveredWords.some((cw) => cw.includes(w) || w.includes(cw))).length;
      const score = overlap / Math.max(nameWords.length, coveredWords.length);
      if (score > bestScore && score >= 0.4) {
        bestScore = score;
        bestMatch = dbq;
      }
    }
  }

  return bestMatch;
}

// ── Rating Criteria Lookup (vaResources) ──────────────────────

/**
 * Find vaResources rating criteria for a condition.
 * Tries: direct conditionId match, then diagnostic code match.
 */
export function resolveRatingCriteria(condition: {
  id: string;
  diagnosticCode?: string;
  diagnosticCodes?: string[];
}): RatingCriteria | undefined {
  // Direct id match
  const byId = getRatingCriteriaByCondition(condition.id);
  if (byId) return byId;

  // Diagnostic code match
  if (condition.diagnosticCode) {
    const byCode = getRatingCriteriaByDiagnosticCode(condition.diagnosticCode);
    if (byCode) return byCode;
  }
  if (condition.diagnosticCodes) {
    for (const code of condition.diagnosticCodes) {
      const byCode = getRatingCriteriaByDiagnosticCode(code);
      if (byCode) return byCode;
    }
  }

  return undefined;
}

// ── Legacy Rating Criteria Lookup (ratingCriteria.ts) ─────────

/**
 * Find legacy conditionRatingCriteria for a condition.
 * Tries: conditionId match, then diagnostic code match.
 */

export function resolveLegacyRatingCriteria(condition: {
  id: string;
  diagnosticCode?: string;
  diagnosticCodes?: string[];
}): ConditionRatingCriteria | undefined {
  // Direct conditionId match
  const byId = conditionRatingCriteria.find((c) => c.conditionId === condition.id);
  if (byId) return byId;

  // Diagnostic code match (range-aware)
  const codes = new Set<string>();
  if (condition.diagnosticCode) codes.add(condition.diagnosticCode);
  if (condition.diagnosticCodes) condition.diagnosticCodes.forEach((c) => codes.add(c));

  if (codes.size > 0) {
    const byCode = conditionRatingCriteria.find((c) =>
      Array.from(codes).some((code) =>
        dcMatches(c.diagnosticCode, code),
      ),
    );
    if (byCode) return byCode;
  }

  return undefined;
}

/**
 * Resolve ALL matching rating criteria for a DBQ that covers multiple conditions.
 * For example, the "Respiratory Conditions" DBQ (DC 6600-6847) covers Sleep Apnea,
 * Asthma, COPD, etc. Returns all matching ConditionRatingCriteria entries.
 */
export function resolveAllMatchingCriteria(dbq: {
  diagnosticCodes: string[];
  conditionsCovered: string[];
}): ConditionRatingCriteria[] {
  const results: ConditionRatingCriteria[] = [];
  const seen = new Set<string>();

  for (const criteria of conditionRatingCriteria) {
    if (seen.has(criteria.conditionId)) continue;

    // Check DC match (range-aware)
    const codeMatch = dbq.diagnosticCodes.some((dc) =>
      dcMatches(dc, criteria.diagnosticCode),
    );
    if (codeMatch) {
      results.push(criteria);
      seen.add(criteria.conditionId);
      continue;
    }

    // Name-based fallback: fuzzy match conditionsCovered against conditionName
    const criteriaNameLower = criteria.conditionName.toLowerCase();
    const nameMatch = dbq.conditionsCovered.some((covered) => {
      const coveredLower = covered.toLowerCase();
      return coveredLower.includes(criteriaNameLower) || criteriaNameLower.includes(coveredLower);
    });
    if (nameMatch) {
      results.push(criteria);
      seen.add(criteria.conditionId);
    }
  }

  return results;
}

// ── DBQ match for UserCondition (used in DBQAnalyzer) ─────────

/**
 * Find DBQs matching a user condition by displayName or conditionId.
 */
export function findDBQsForUserCondition(uc: {
  conditionId: string;
  displayName?: string;
}): DBQReference[] {
  const name = (uc.displayName || uc.conditionId).toLowerCase();
  return dbqQuickReference.filter((dbq) =>
    dbq.id === uc.conditionId ||
    dbq.conditionsCovered.some(
      (c) => c.toLowerCase().includes(name) || name.includes(c.toLowerCase()),
    ),
  );
}
