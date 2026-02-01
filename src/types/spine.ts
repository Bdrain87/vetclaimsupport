// Spine/Back types based on 38 CFR 4.71a
// VA Rating Criteria for Spine Conditions

// Spine regions per VA standards
export type SpineRegion = 'Cervical' | 'Thoracolumbar';

// Range of motion measurements (in degrees)
// Cervical: Forward flexion 0-45°, Extension 0-45°, Lateral flexion 0-45°, Rotation 0-80°
// Thoracolumbar: Forward flexion 0-90°, Extension 0-30°, Lateral flexion 0-30°, Rotation 0-30°
export interface SpineROM {
  forwardFlexion: number | null;
  extension: number | null;
  leftLateralFlexion: number | null;
  rightLateralFlexion: number | null;
  leftRotation: number | null;
  rightRotation: number | null;
  painOnMotion: boolean;
  painStartsDegree?: number; // Degree at which pain begins
}

// Incapacitating episode as defined by VA (requires bed rest prescribed by physician)
export interface IncapacitatingEpisode {
  startDate: string;
  endDate: string;
  durationDays: number;
  prescribedByDoctor: boolean;
  doctorName?: string;
  notes: string;
}

// Radiculopathy symptoms (nerve involvement)
export type RadiculopathySeverity = 'None' | 'Mild' | 'Moderate' | 'Severe';
export type RadiculopathySide = 'Left' | 'Right' | 'Bilateral';

export interface RadiculopathySymptom {
  affected: boolean;
  side?: RadiculopathySide;
  severity?: RadiculopathySeverity;
  symptoms: string[]; // numbness, tingling, weakness, etc.
  affectedNerveGroup?: string; // sciatic, femoral, etc.
}

// Muscle spasm severity for VA rating
export type MuscleSpasm = 'None' | 'Present but no abnormal gait' | 'Present with abnormal gait or spinal contour';

// Guarding severity for VA rating
export type Guarding = 'None' | 'Present but no abnormal gait' | 'Present with abnormal gait or spinal contour';

// Main spine symptom entry
export interface SpineSymptomEntry {
  id: string;
  date: string;
  region: SpineRegion;
  
  // Pain assessment
  painLevel: number; // 1-10
  painType: string[]; // sharp, dull, burning, aching, radiating
  painConstant: boolean;
  
  // Range of motion (VA-critical)
  rangeOfMotion: SpineROM;
  combinedROM?: number; // Total of all movements
  
  // Functional limitations
  muscleSpasm: MuscleSpasm;
  guarding: Guarding;
  abnormalSpinalContour: boolean;
  
  // Radiculopathy (nerve symptoms)
  upperExtremityRadiculopathy: RadiculopathySymptom;
  lowerExtremityRadiculopathy: RadiculopathySymptom;
  
  // Incapacitating episodes (last 12 months)
  hadIncapacitatingEpisode: boolean;
  incapacitatingEpisode?: IncapacitatingEpisode;
  
  // Daily impact (VA-relevant)
  impactOnWork: string;
  impactOnDaily: string;
  usesAssistiveDevice: boolean;
  assistiveDevices?: string[]; // cane, walker, brace, etc.
  
  // Flare-ups
  hadFlareUp: boolean;
  flareUpFrequency?: string;
  flareUpDuration?: string;
  flareUpSeverity?: number;
  flareUpTriggers?: string[];
  
  // DeLuca Factors - Functional Loss During Flares (38 CFR 4.40, 4.45, 4.59)
  flareUpROMReduction?: number; // Additional degrees of ROM loss during flares
  flareUpFunctionalCapacity?: number; // 0-100% functional capacity during flares
  flareUpPainIncrease?: number; // Pain level increase during flares (1-10)
  flareUpWeakness?: boolean;
  flareUpFatigability?: boolean;
  flareUpIncoordination?: boolean;
  flareUpDurationHours?: number; // How long flares typically last
  
  // Additional notes
  notes: string;
}

// VA Rating criteria reference (38 CFR 4.71a)
export const SPINE_RATING_CRITERIA = {
  thoracolumbar: {
    // Forward flexion limits for ratings
    '100': 'Unfavorable ankylosis of entire spine',
    '50': 'Unfavorable ankylosis of entire thoracolumbar spine',
    '40': 'Forward flexion 30° or less OR favorable ankylosis',
    '20': 'Forward flexion greater than 30° but not greater than 60°, OR combined ROM not greater than 120°, OR muscle spasm/guarding severe enough to result in abnormal gait or abnormal spinal contour',
    '10': 'Forward flexion greater than 60° but not greater than 85°, OR combined ROM greater than 120° but not greater than 235°, OR muscle spasm/guarding/localized tenderness not resulting in abnormal gait or spinal contour',
  },
  cervical: {
    '100': 'Unfavorable ankylosis of entire spine',
    '40': 'Unfavorable ankylosis of entire cervical spine',
    '30': 'Forward flexion 15° or less OR favorable ankylosis',
    '20': 'Forward flexion greater than 15° but not greater than 30°, OR combined ROM not greater than 170°',
    '10': 'Forward flexion greater than 30° but not greater than 40°, OR combined ROM greater than 170° but not greater than 335°',
  },
  incapacitatingEpisodes: {
    '60': '6 weeks or more during past 12 months',
    '40': 'At least 4 weeks but less than 6 weeks',
    '20': 'At least 2 weeks but less than 4 weeks',
    '10': 'At least 1 week but less than 2 weeks',
  },
};

// Normal ROM values for reference
export const NORMAL_ROM = {
  cervical: {
    forwardFlexion: 45,
    extension: 45,
    lateralFlexion: 45,
    rotation: 80,
    combinedMax: 340,
  },
  thoracolumbar: {
    forwardFlexion: 90,
    extension: 30,
    lateralFlexion: 30,
    rotation: 30,
    combinedMax: 240,
  },
};
