/**
 * Condition ID Resolution Utility
 *
 * Single source of truth for converting condition names/strings → database IDs.
 * Every code path that produces a conditionId MUST use resolveConditionId().
 */

import { getConditionById, vaConditions } from '@/data/vaConditions';
import type { VACondition } from '@/data/vaConditions';
import { searchAllConditions } from '@/utils/conditionSearch';
import type { UserCondition } from '@/store/useAppStore';

export interface ResolvedCondition {
  conditionId: string;
  displayName: string;
}

/**
 * Resolve a free-text condition name or partial ID to a valid database conditionId.
 *
 * Resolution order:
 * 1. Direct ID match via getConditionById()
 * 2. Exact name/abbreviation match in vaConditions
 * 3. Fuzzy search via searchAllConditions()
 * 4. Fallback: slugified input + preserve original as displayName
 */
export function resolveConditionId(input: string): ResolvedCondition {
  if (!input || !input.trim()) {
    return { conditionId: '', displayName: input };
  }

  const trimmed = input.trim();

  // 1. Direct ID match
  const byId = getConditionById(trimmed);
  if (byId) {
    return {
      conditionId: byId.id,
      displayName: byId.abbreviation || byId.name,
    };
  }

  // Also try lowercased slug as ID
  const slugId = trimmed.toLowerCase().replace(/\s+/g, '-');
  const bySlugId = getConditionById(slugId);
  if (bySlugId) {
    return {
      conditionId: bySlugId.id,
      displayName: bySlugId.abbreviation || bySlugId.name,
    };
  }

  // 2. Exact name/abbreviation match
  const lower = trimmed.toLowerCase();
  const byName = vaConditions.find(
    (c) =>
      c.name.toLowerCase() === lower ||
      c.abbreviation.toLowerCase() === lower,
  );
  if (byName) {
    return {
      conditionId: byName.id,
      displayName: byName.abbreviation || byName.name,
    };
  }

  // 3. Fuzzy search (top-1 result)
  const results = searchAllConditions(trimmed, { limit: 1 });
  if (results.length > 0) {
    const match = results[0];
    // Only accept fuzzy match if the name substantially overlaps
    const matchLower = match.name.toLowerCase();
    if (
      matchLower.includes(lower) ||
      lower.includes(matchLower) ||
      match.abbreviation?.toLowerCase() === lower
    ) {
      return {
        conditionId: match.id,
        displayName: match.abbreviation || match.name,
      };
    }
  }

  // 4. Fallback: slug the input, preserve original as displayName
  const fallbackId = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    conditionId: fallbackId,
    displayName: trimmed,
  };
}

/**
 * Universal display-name helper for a UserCondition.
 * Replaces all ad-hoc fallback chains like:
 *   details?.abbreviation || details?.name || uc.conditionId
 */
export function getConditionDisplayName(uc: UserCondition): string {
  // 1. Explicit displayName on the UserCondition
  if (uc.displayName) return uc.displayName;

  // 2. Look up in VA database
  const details = getConditionById(uc.conditionId);
  if (details) return details.abbreviation || details.name;

  // 3. Humanize the conditionId as a last resort
  return humanizeConditionId(uc.conditionId);
}

/**
 * Get full condition details text (abbreviation - full name) for a UserCondition.
 */
export function getConditionFullDisplayName(uc: UserCondition): string {
  const details = getConditionById(uc.conditionId);
  if (details) {
    if (details.abbreviation !== details.name) {
      return `${details.abbreviation} - ${details.name}`;
    }
    return details.name;
  }
  return uc.displayName || humanizeConditionId(uc.conditionId);
}

/**
 * Get VACondition details for a UserCondition, with null safety.
 */
export function getConditionDetails(uc: UserCondition): VACondition | undefined {
  return getConditionById(uc.conditionId);
}

/**
 * Turn a slug like "gerd" or "sleep-apnea" into "Gerd" or "Sleep Apnea".
 */
function humanizeConditionId(id: string): string {
  return id
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Check if a conditionId looks suspicious (likely a bad slug from old code).
 * Used for migration and dev-mode warnings.
 */
export function isSuspiciousConditionId(conditionId: string): boolean {
  return (
    conditionId.includes('(') ||
    conditionId.includes(')') ||
    conditionId.includes(' ') ||
    conditionId.length > 60
  );
}
