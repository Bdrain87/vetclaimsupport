/**
 * VA Condition Database — Master Index
 * 800+ conditions across 15 body systems
 *
 * This is the canonical import path for all condition data.
 * All old imports from '@/data/vaConditions' are re-exported here for backward compatibility.
 */

// Re-export types
export type {
  VACondition,
  ConditionCategory,
  BodySystem,
  SecondaryConnection,
  ConditionSecondaryProfile,
  PresumptiveCondition,
} from './types';

export { categoryLabels } from './types';

// Import all body system condition arrays
import { musculoskeletalConditions } from './musculoskeletal';
import { neurologicalConditions } from './neurological';
import { cardiovascularConditions } from './cardiovascular';
import { digestiveConditions } from './digestive';
import { respiratoryConditions } from './respiratory';
import { skinConditions } from './skin';
import { mentalHealthConditions } from './mental-disorders';
import { auditoryConditions } from './auditory';
import { eyeConditions } from './eyes';
import { endocrineConditions } from './endocrine';
import { genitourinaryConditions } from './genitourinary';
import { gynecologicalConditions } from './gynecological';
import { hemicLymphaticConditions } from './hemic-lymphatic';
import { dentalConditions } from './dental-oral';
import { infectiousConditions } from './infectious-immune';

import type { VACondition } from './types';

// Re-export individual system arrays for targeted imports
export {
  musculoskeletalConditions,
  neurologicalConditions,
  cardiovascularConditions,
  digestiveConditions,
  respiratoryConditions,
  skinConditions,
  mentalHealthConditions,
  auditoryConditions,
  eyeConditions,
  endocrineConditions,
  genitourinaryConditions,
  gynecologicalConditions,
  hemicLymphaticConditions,
  dentalConditions,
  infectiousConditions,
};

// Re-export presumptive conditions
export {
  presumptiveConditions,
  getPresumptiveByProgram,
  getPresumptivePrograms,
  programLabels,
} from './presumptive-conditions';

// ============================================
// MASTER CONDITIONS ARRAY
// ============================================

/** All VA conditions from all body systems */
export const vaConditions: VACondition[] = [
  ...musculoskeletalConditions,
  ...neurologicalConditions,
  ...cardiovascularConditions,
  ...digestiveConditions,
  ...respiratoryConditions,
  ...skinConditions,
  ...mentalHealthConditions,
  ...auditoryConditions,
  ...eyeConditions,
  ...endocrineConditions,
  ...genitourinaryConditions,
  ...gynecologicalConditions,
  ...hemicLymphaticConditions,
  ...dentalConditions,
  ...infectiousConditions,
];

/** Uppercase alias for backward compatibility */
export const VA_CONDITIONS = vaConditions;

/** Alias for backward compatibility */
export const Conditions = vaConditions;

// ============================================
// ID LOOKUP MAP (O(1) access)
// ============================================

const conditionMap = new Map<string, VACondition>();
for (const c of vaConditions) {
  conditionMap.set(c.id, c);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/** Get a condition by ID — O(1) lookup */
export function getConditionById(id: string): VACondition | undefined {
  return conditionMap.get(id);
}

/** Get conditions by category */
export function getConditionsByCategory(category: string): VACondition[] {
  return vaConditions.filter(c => c.category === category);
}

/** @deprecated Use searchAllConditions from utils/conditionSearch.ts instead */
export function searchConditions(query: string, excludeIds: string[] = []): VACondition[] {
  if (!query.trim()) return [];

  const searchTerms = query.toLowerCase().split(' ').filter(Boolean);

  return vaConditions
    .filter(condition => {
      if (excludeIds.includes(condition.id)) return false;

      const searchText = [
        condition.abbreviation,
        condition.name,
        condition.description || '',
        ...condition.keywords,
        ...(condition.misspellings || []),
      ].join(' ').toLowerCase();

      return searchTerms.every(term => searchText.includes(term));
    })
    .sort((a, b) => {
      const aAbbr = a.abbreviation.toLowerCase();
      const bAbbr = b.abbreviation.toLowerCase();
      const queryLower = query.toLowerCase();

      if (aAbbr === queryLower) return -1;
      if (bAbbr === queryLower) return 1;
      if (aAbbr.startsWith(queryLower)) return -1;
      if (bAbbr.startsWith(queryLower)) return 1;

      return a.name.localeCompare(b.name);
    })
    .slice(0, 20);
}

/** Get secondary conditions for a primary condition */
export function getSecondaryConditions(primaryId: string): VACondition[] {
  const primary = getConditionById(primaryId);
  if (!primary) return [];

  return primary.commonSecondaries
    .map(id => getConditionById(id))
    .filter((c): c is VACondition => c !== undefined);
}

/** Get display text for a condition (abbreviation - name) */
export function getConditionDisplayText(condition: VACondition): string {
  if (condition.abbreviation === condition.name) {
    return condition.name;
  }
  return `${condition.abbreviation} - ${condition.name}`;
}

/** Get short display text for a condition (abbreviation only) */
export function getConditionShortText(condition: VACondition): string {
  return condition.abbreviation;
}

/** Total condition count for marketing/display */
export const totalConditionCount = vaConditions.length;
