/**
 * Condition-Centric Export System
 *
 * All exports are "patient-organized clinical information" per 38 CFR Part 14.
 * Every page includes the disclaimer. Doctor-facing documents get PATIENT-PREPARED watermark.
 */

// Core assembler
export { assembleConditionData, assembleAllConditionData } from './conditionDataAssembler';
export type {
  ConditionDataBundle,
  ConditionExportCategory,
  VeteranInfo,
  LogCoverage,
  SymptomFrequencyStat,
  SeverityTrend,
} from './conditionDataAssembler';

// Strategy pattern
export { getConditionStrategy } from './conditionTypeStrategies';
export type { ConditionStrategy } from './conditionTypeStrategies';

// Export generators
export { generateDoctorSummaryPDF, getDoctorSummaryFilename } from './doctorSummaryOutline';
export { generateConditionEvidencePackagePDF, getEvidencePackageFilename } from './conditionEvidencePackage';
export { generateDBQPrepSheetPDF, getDBQPrepSheetFilename } from './dbqPrepSheet';
export { generateUnifiedClaimPacketPDF, getUnifiedPacketFilename } from './unifiedClaimPacket';
