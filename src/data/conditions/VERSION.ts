/**
 * VA Condition Data Version Tracking
 * Updated by scripts/fetch-ecfr.ts when run
 */

export const CONDITION_DATA_VERSION = {
  version: '2026-02-27',
  ecfrFetchDate: null as string | null,
  localConditionCount: 800,
  ecfrDiagnosticCodeCount: null as number | null,
  discrepancies: null as number | null,
} as const;
