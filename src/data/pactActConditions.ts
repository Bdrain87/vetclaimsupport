/**
 * PACT Act (Promise to Address Comprehensive Toxics Act) Conditions Database
 * Signed into law August 10, 2022
 *
 * The PACT Act expands VA healthcare and benefits for veterans exposed to:
 * - Burn pits and other toxic substances
 * - Agent Orange and herbicides
 * - Radiation
 * - Gulf War hazards
 */

export interface PACTCondition {
  id: string;
  condition: string;
  category: 'Respiratory' | 'Cancer' | 'Other';
  presumptiveFor: ('Burn Pit Exposure' | 'Agent Orange' | 'Gulf War' | 'Radiation' | 'Post-9/11')[];
  description?: string;
  diagnosticCode?: string;
}

export interface CoveredLocation {
  region: string;
  countries: string[];
  dateRange?: { start: string; end?: string };
  exposureType: string;
}

/**
 * PACT Act Presumptive Conditions
 * These conditions are presumed to be service-connected for veterans who served
 * in qualifying locations during qualifying time periods
 */
export const PACT_ACT_CONDITIONS: PACTCondition[] = [
  // ============ RESPIRATORY CONDITIONS ============
  {
    id: 'asthma',
    condition: 'Asthma',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11', 'Gulf War'],
    description: 'Chronic respiratory condition diagnosed after deployment',
    diagnosticCode: '6602'
  },
  {
    id: 'rhinitis',
    condition: 'Rhinitis',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11', 'Gulf War'],
    description: 'Chronic nasal inflammation',
    diagnosticCode: '6522'
  },
  {
    id: 'sinusitis',
    condition: 'Sinusitis',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11', 'Gulf War'],
    description: 'Chronic sinus inflammation',
    diagnosticCode: '6513'
  },
  {
    id: 'constrictive-bronchiolitis',
    condition: 'Constrictive Bronchiolitis',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11'],
    description: 'Scarring of small airways',
    diagnosticCode: '6600'
  },
  {
    id: 'interstitial-lung-disease',
    condition: 'Interstitial Lung Disease',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11'],
    description: 'Group of disorders causing progressive scarring of lung tissue',
    diagnosticCode: '6825'
  },
  {
    id: 'pleuritis',
    condition: 'Pleuritis',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11'],
    description: 'Inflammation of the tissue around the lungs',
    diagnosticCode: '6845'
  },
  {
    id: 'pulmonary-fibrosis',
    condition: 'Pulmonary Fibrosis',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11', 'Agent Orange'],
    description: 'Lung scarring that causes breathing difficulties',
    diagnosticCode: '6825'
  },
  {
    id: 'sarcoidosis',
    condition: 'Sarcoidosis',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11'],
    description: 'Inflammatory disease affecting multiple organs',
    diagnosticCode: '6846'
  },
  {
    id: 'copd',
    condition: 'Chronic Obstructive Pulmonary Disease (COPD)',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11', 'Gulf War'],
    description: 'Progressive lung disease causing breathing difficulties',
    diagnosticCode: '6604'
  },
  {
    id: 'bronchiectasis',
    condition: 'Bronchiectasis',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11'],
    description: 'Permanent widening and damage to airways',
    diagnosticCode: '6601'
  },

  // ============ CANCERS ============
  // Agent Orange Presumptive Cancers
  {
    id: 'soft-tissue-sarcoma',
    condition: 'Soft Tissue Sarcoma',
    category: 'Cancer',
    presumptiveFor: ['Agent Orange'],
    description: 'Cancer of soft tissues (muscle, fat, blood vessels)',
    diagnosticCode: '7819'
  },
  {
    id: 'non-hodgkins-lymphoma',
    condition: "Non-Hodgkin's Lymphoma",
    category: 'Cancer',
    presumptiveFor: ['Agent Orange'],
    description: 'Cancer of the lymphatic system',
    diagnosticCode: '7715'
  },
  {
    id: 'hodgkins-disease',
    condition: "Hodgkin's Disease",
    category: 'Cancer',
    presumptiveFor: ['Agent Orange'],
    description: 'Cancer of the lymphatic system',
    diagnosticCode: '7709'
  },
  {
    id: 'lung-cancer',
    condition: 'Lung Cancer',
    category: 'Cancer',
    presumptiveFor: ['Agent Orange', 'Burn Pit Exposure', 'Radiation'],
    description: 'Malignant tumor of the lung',
    diagnosticCode: '6819'
  },
  {
    id: 'prostate-cancer',
    condition: 'Prostate Cancer',
    category: 'Cancer',
    presumptiveFor: ['Agent Orange'],
    description: 'Cancer of the prostate gland',
    diagnosticCode: '7528'
  },
  {
    id: 'bladder-cancer',
    condition: 'Bladder Cancer',
    category: 'Cancer',
    presumptiveFor: ['Agent Orange'],
    description: 'Cancer of the bladder (added by PACT Act)',
    diagnosticCode: '7528'
  },
  {
    id: 'multiple-myeloma',
    condition: 'Multiple Myeloma',
    category: 'Cancer',
    presumptiveFor: ['Agent Orange'],
    description: 'Blood cancer affecting plasma cells',
    diagnosticCode: '7709'
  },
  {
    id: 'chronic-b-cell-leukemia',
    condition: 'Chronic B-Cell Leukemia',
    category: 'Cancer',
    presumptiveFor: ['Agent Orange'],
    description: 'Blood cancer affecting B lymphocytes',
    diagnosticCode: '7703'
  },
  {
    id: 'throat-cancer',
    condition: 'Respiratory Cancers (Throat)',
    category: 'Cancer',
    presumptiveFor: ['Agent Orange', 'Burn Pit Exposure'],
    description: 'Cancer of the larynx, trachea, bronchus',
    diagnosticCode: '6819'
  },

  // Burn Pit / Post-9/11 Cancers (Added by PACT Act)
  {
    id: 'head-neck-cancer',
    condition: 'Head and Neck Cancer',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11'],
    description: 'Cancer of the head and neck region',
    diagnosticCode: '6819'
  },
  {
    id: 'kidney-cancer',
    condition: 'Kidney Cancer',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11'],
    description: 'Cancer of the kidney (renal cell carcinoma)',
    diagnosticCode: '7528'
  },
  {
    id: 'pancreatic-cancer',
    condition: 'Pancreatic Cancer',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11'],
    description: 'Cancer of the pancreas',
    diagnosticCode: '7343'
  },
  {
    id: 'reproductive-cancers',
    condition: 'Reproductive Cancers',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11'],
    description: 'Cancers of reproductive organs',
    diagnosticCode: '7528'
  },
  {
    id: 'melanoma',
    condition: 'Melanoma',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11'],
    description: 'Skin cancer (malignant melanoma)',
    diagnosticCode: '7833'
  },
  {
    id: 'gastrointestinal-cancer',
    condition: 'Gastrointestinal Cancer',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11'],
    description: 'Cancer of the esophagus, stomach, small intestine, colon',
    diagnosticCode: '7343'
  },
  {
    id: 'lymphoma-any-type',
    condition: 'Lymphoma (any type)',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11'],
    description: 'Cancer of the lymphatic system',
    diagnosticCode: '7715'
  },
  {
    id: 'brain-cancer',
    condition: 'Brain Cancer (Glioblastoma)',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure', 'Post-9/11'],
    description: 'Malignant brain tumor',
    diagnosticCode: '8045'
  },

  // ============ OTHER CONDITIONS ============
  // Agent Orange Other Conditions
  {
    id: 'type-2-diabetes',
    condition: 'Type 2 Diabetes Mellitus',
    category: 'Other',
    presumptiveFor: ['Agent Orange'],
    description: 'Blood sugar disorder',
    diagnosticCode: '7913'
  },
  {
    id: 'ischemic-heart-disease',
    condition: 'Ischemic Heart Disease',
    category: 'Other',
    presumptiveFor: ['Agent Orange'],
    description: 'Heart disease caused by reduced blood flow',
    diagnosticCode: '7005'
  },
  {
    id: 'peripheral-neuropathy',
    condition: 'Peripheral Neuropathy (Early Onset)',
    category: 'Other',
    presumptiveFor: ['Agent Orange'],
    description: 'Nerve damage causing numbness and tingling',
    diagnosticCode: '8520'
  },
  {
    id: 'parkinsons-disease',
    condition: "Parkinson's Disease",
    category: 'Other',
    presumptiveFor: ['Agent Orange'],
    description: 'Progressive nervous system disorder',
    diagnosticCode: '8004'
  },
  {
    id: 'chloracne',
    condition: 'Chloracne',
    category: 'Other',
    presumptiveFor: ['Agent Orange'],
    description: 'Skin condition caused by dioxin exposure',
    diagnosticCode: '7829'
  },
  {
    id: 'porphyria-cutanea-tarda',
    condition: 'Porphyria Cutanea Tarda',
    category: 'Other',
    presumptiveFor: ['Agent Orange'],
    description: 'Disorder affecting skin and liver',
    diagnosticCode: '7815'
  },
  {
    id: 'als',
    condition: 'Amyotrophic Lateral Sclerosis (ALS)',
    category: 'Other',
    presumptiveFor: ['Agent Orange', 'Gulf War'],
    description: 'Progressive neurodegenerative disease',
    diagnosticCode: '8017'
  },
  {
    id: 'hypertension',
    condition: 'Hypertension (High Blood Pressure)',
    category: 'Other',
    presumptiveFor: ['Agent Orange'],
    description: 'High blood pressure (added by PACT Act)',
    diagnosticCode: '7101'
  },
  {
    id: 'monoclonal-gammopathy',
    condition: 'Monoclonal Gammopathy of Undetermined Significance',
    category: 'Other',
    presumptiveFor: ['Agent Orange'],
    description: 'Blood condition that can lead to cancer',
    diagnosticCode: '7700'
  }
];

/**
 * Covered Locations for PACT Act Presumptive Benefits
 */
export const COVERED_LOCATIONS: CoveredLocation[] = [
  // Post-9/11 / Burn Pit Locations
  {
    region: 'Southwest Asia',
    countries: [
      'Afghanistan',
      'Iraq',
      'Kuwait',
      'Saudi Arabia',
      'Bahrain',
      'Qatar',
      'United Arab Emirates',
      'Oman',
      'Jordan',
      'Syria',
      'Yemen'
    ],
    dateRange: { start: '2001-09-11' },
    exposureType: 'Burn Pit Exposure'
  },
  {
    region: 'Africa',
    countries: [
      'Egypt',
      'Djibouti',
      'Somalia',
      'Libya',
      'Tunisia',
      'Niger',
      'Chad',
      'Mali',
      'Cameroon'
    ],
    dateRange: { start: '2001-09-11' },
    exposureType: 'Burn Pit Exposure'
  },
  {
    region: 'Central Asia',
    countries: [
      'Uzbekistan',
      'Pakistan',
      'Tajikistan',
      'Turkmenistan',
      'Kyrgyzstan'
    ],
    dateRange: { start: '2001-09-11' },
    exposureType: 'Burn Pit Exposure'
  },

  // Agent Orange Locations
  {
    region: 'Vietnam',
    countries: ['Vietnam', 'Republic of Vietnam'],
    dateRange: { start: '1962-01-09', end: '1975-05-07' },
    exposureType: 'Agent Orange'
  },
  {
    region: 'Thailand',
    countries: ['Thailand'],
    dateRange: { start: '1962-02-28', end: '1975-05-07' },
    exposureType: 'Agent Orange'
  },
  {
    region: 'Laos & Cambodia',
    countries: ['Laos', 'Cambodia'],
    dateRange: { start: '1962-01-09', end: '1975-05-07' },
    exposureType: 'Agent Orange'
  },
  {
    region: 'Korean DMZ',
    countries: ['South Korea', 'Korea'],
    dateRange: { start: '1968-04-01', end: '1971-08-31' },
    exposureType: 'Agent Orange'
  },
  {
    region: 'Guam',
    countries: ['Guam'],
    dateRange: { start: '1962-01-09', end: '1975-05-07' },
    exposureType: 'Agent Orange'
  },

  // Gulf War Locations
  {
    region: 'Persian Gulf',
    countries: [
      'Iraq',
      'Kuwait',
      'Saudi Arabia',
      'Bahrain',
      'Qatar',
      'United Arab Emirates',
      'Oman',
      'Persian Gulf Waters'
    ],
    dateRange: { start: '1990-08-02' },
    exposureType: 'Gulf War'
  }
];

/**
 * Get conditions by exposure type
 */
export function getConditionsByExposure(exposureType: string): PACTCondition[] {
  return PACT_ACT_CONDITIONS.filter(c =>
    c.presumptiveFor.includes(exposureType as any)
  );
}

/**
 * Get all unique exposure types
 */
export function getExposureTypes(): string[] {
  const types = new Set<string>();
  PACT_ACT_CONDITIONS.forEach(c => {
    c.presumptiveFor.forEach(p => types.add(p));
  });
  return Array.from(types);
}

/**
 * Check if a location qualifies for a specific exposure type
 */
export function checkLocationEligibility(
  country: string,
  serviceDate?: Date
): CoveredLocation | undefined {
  const lowerCountry = country.toLowerCase();

  return COVERED_LOCATIONS.find(loc => {
    const countryMatch = loc.countries.some(
      c => c.toLowerCase() === lowerCountry ||
           lowerCountry.includes(c.toLowerCase())
    );

    if (!countryMatch) return false;

    if (serviceDate && loc.dateRange) {
      const startDate = new Date(loc.dateRange.start);
      if (serviceDate < startDate) return false;

      if (loc.dateRange.end) {
        const endDate = new Date(loc.dateRange.end);
        if (serviceDate > endDate) return false;
      }
    }

    return true;
  });
}

/**
 * Get all covered countries as a flat array
 */
export function getAllCoveredCountries(): string[] {
  const countries = new Set<string>();
  COVERED_LOCATIONS.forEach(loc => {
    loc.countries.forEach(c => countries.add(c));
  });
  return Array.from(countries).sort();
}
