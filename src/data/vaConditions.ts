/**
 * VA Conditions Database — Re-export from new modular structure
 *
 * This file preserves backward compatibility for all existing imports.
 * The canonical data source is now `src/data/conditions/`.
 *
 * All types, arrays, and utility functions are re-exported below.
 */

export type {
  VACondition,
  ConditionCategory,
  BodySystem,
} from './conditions/types';

export { categoryLabels } from './conditions/types';

export {
  vaConditions,
  VA_CONDITIONS,
  Conditions,
  getConditionById,
  getConditionsByCategory,
  getSecondaryConditions,
  getConditionDisplayText,
  getConditionShortText,
  totalConditionCount,
} from './conditions';
