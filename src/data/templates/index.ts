/**
 * Template System - Category templates + condition overrides + resolvers
 * Provides 100% coverage of all 792 VA conditions.
 */

export { categoryTemplates, findTemplateForCondition } from './categoryTemplates';
export type {
  CategoryTemplate,
  EvidenceTemplate,
  ExamTemplate,
  RatingTemplate,
  LiteratureTemplate,
} from './categoryTemplates';

export { conditionOverrides, getConditionOverride } from './conditionOverrides';
export type { ConditionOverride } from './conditionOverrides';

export {
  resolveEvidence,
  resolveCPExam,
  resolveRatingCriteria,
  resolveLiterature,
} from './resolvers';

export type {
  ResolvedEvidence,
  ResolvedCPExam,
  ResolvedRatingCriteria,
  ResolvedCitation,
} from './resolvers';
