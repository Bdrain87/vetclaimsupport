// PACT Act Data - Toxic Exposure Presumptive Conditions
// Source: Public Law 117-168 - Honoring our PACT Act of 2022

export interface PresumptiveCondition {
  id: string;
  name: string;
  category: 'burn-pit' | 'agent-orange' | 'radiation' | 'gulf-war';
  icd10Code?: string;
  description: string;
  addedDate?: string; // When added to presumptive list
}

export interface EligibleLocation {
  id: string;
  name: string;
  country: string;
  region: string;
  exposureType: 'burn-pit' | 'agent-orange' | 'radiation' | 'gulf-war';
  startDate: string; // YYYY-MM-DD
  endDate: string | 'present'; // YYYY-MM-DD or 'present'
  notes?: string;
}

// Burn Pit Presumptive Conditions (23+ conditions)
export const burnPitPresumptives: PresumptiveCondition[] = [
  // Respiratory Conditions
  {
    id: 'asthma',
    name: 'Asthma',
    category: 'burn-pit',
    description: 'Chronic respiratory condition causing airway inflammation',
  },
  {
    id: 'rhinitis',
    name: 'Rhinitis',
    category: 'burn-pit',
    description: 'Inflammation of the nasal passages',
  },
  {
    id: 'sinusitis',
    name: 'Sinusitis',
    category: 'burn-pit',
    description: 'Chronic inflammation of the sinuses',
  },
  {
    id: 'constrictive-bronchiolitis',
    name: 'Constrictive Bronchiolitis',
    category: 'burn-pit',
    description: 'Scarring of the small airways in the lungs',
  },
  {
    id: 'copd',
    name: 'Chronic Obstructive Pulmonary Disease (COPD)',
    category: 'burn-pit',
    description: 'Chronic inflammatory lung disease causing obstructed airflow',
  },
  {
    id: 'emphysema',
    name: 'Emphysema',
    category: 'burn-pit',
    description: 'Damage to the air sacs in the lungs',
  },
  {
    id: 'interstitial-lung-disease',
    name: 'Interstitial Lung Disease',
    category: 'burn-pit',
    description: 'Group of disorders causing progressive scarring of lung tissue',
  },
  {
    id: 'pleuritis',
    name: 'Pleuritis',
    category: 'burn-pit',
    description: 'Inflammation of the tissue lining the lungs and chest cavity',
  },
  {
    id: 'chronic-bronchitis',
    name: 'Chronic Bronchitis',
    category: 'burn-pit',
    description: 'Long-term inflammation of the bronchial tubes',
  },
  {
    id: 'bronchiectasis',
    name: 'Bronchiectasis',
    category: 'burn-pit',
    description: 'Permanent enlargement of parts of the airways',
  },
  {
    id: 'sarcoidosis',
    name: 'Sarcoidosis',
    category: 'burn-pit',
    description: 'Growth of inflammatory cells in different parts of the body',
  },
  {
    id: 'pulmonary-fibrosis',
    name: 'Pulmonary Fibrosis',
    category: 'burn-pit',
    description: 'Scarring and thickening of lung tissue',
  },
  {
    id: 'granulomatous-disease',
    name: 'Granulomatous Disease',
    category: 'burn-pit',
    description: 'Disease characterized by formation of granulomas in organs',
  },

  // Cancers
  {
    id: 'lung-cancer',
    name: 'Lung Cancer (any type)',
    category: 'burn-pit',
    description: 'Malignant tumor of the lungs',
  },
  {
    id: 'larynx-cancer',
    name: 'Cancer of the Larynx',
    category: 'burn-pit',
    description: 'Cancer of the voice box',
  },
  {
    id: 'trachea-cancer',
    name: 'Cancer of the Trachea',
    category: 'burn-pit',
    description: 'Cancer of the windpipe',
  },
  {
    id: 'head-cancer',
    name: 'Head Cancer',
    category: 'burn-pit',
    description: 'Cancers of the head region',
  },
  {
    id: 'neck-cancer',
    name: 'Neck Cancer',
    category: 'burn-pit',
    description: 'Cancers of the neck region',
  },
  {
    id: 'mesothelioma',
    name: 'Mesothelioma',
    category: 'burn-pit',
    description: 'Cancer of tissue lining internal organs (often from asbestos)',
  },
  {
    id: 'kidney-cancer',
    name: 'Kidney Cancer',
    category: 'burn-pit',
    description: 'Malignant tumor of the kidney',
  },
  {
    id: 'melanoma',
    name: 'Melanoma',
    category: 'burn-pit',
    description: 'Aggressive form of skin cancer',
  },
  {
    id: 'pancreatic-cancer',
    name: 'Pancreatic Cancer',
    category: 'burn-pit',
    description: 'Cancer of the pancreas',
  },
  {
    id: 'brain-cancer',
    name: 'Brain Cancer',
    category: 'burn-pit',
    description: 'Malignant tumor in the brain',
  },
  {
    id: 'reproductive-cancer',
    name: 'Reproductive System Cancer',
    category: 'burn-pit',
    description: 'Cancers affecting reproductive organs',
  },
  {
    id: 'lymphatic-cancer',
    name: 'Lymphatic Cancer / Lymphoma',
    category: 'burn-pit',
    description: 'Cancer of the lymphatic system',
  },
  {
    id: 'gastrointestinal-cancer',
    name: 'Gastrointestinal Cancer (any type)',
    category: 'burn-pit',
    description: 'Cancers of the digestive system including stomach, colon, etc.',
  },
];

// Agent Orange Presumptive Conditions (including 2025 additions)
export const agentOrangePresumptives: PresumptiveCondition[] = [
  // Original Presumptives
  {
    id: 'ao-prostate-cancer',
    name: 'Prostate Cancer',
    category: 'agent-orange',
    description: 'Cancer of the prostate gland',
  },
  {
    id: 'ao-respiratory-cancers',
    name: 'Respiratory Cancers',
    category: 'agent-orange',
    description: 'Cancers of the lung, bronchus, larynx, and trachea',
  },
  {
    id: 'ao-soft-tissue-sarcoma',
    name: 'Soft Tissue Sarcoma',
    category: 'agent-orange',
    description: 'Cancer of soft tissues (excluding osteosarcoma, chondrosarcoma, etc.)',
  },
  {
    id: 'ao-hodgkins',
    name: "Hodgkin's Disease",
    category: 'agent-orange',
    description: 'Cancer of the lymphatic system',
  },
  {
    id: 'ao-nhl',
    name: 'Non-Hodgkin Lymphoma',
    category: 'agent-orange',
    description: 'Group of blood cancers',
  },
  {
    id: 'ao-cll',
    name: 'Chronic B-Cell Leukemias',
    category: 'agent-orange',
    description: 'Including chronic lymphocytic leukemia and hairy cell leukemia',
  },
  {
    id: 'ao-myeloma',
    name: 'Multiple Myeloma',
    category: 'agent-orange',
    description: 'Cancer of plasma cells',
  },
  {
    id: 'ao-diabetes',
    name: 'Type 2 Diabetes',
    category: 'agent-orange',
    description: 'Diabetes mellitus type 2',
  },
  {
    id: 'ao-chloracne',
    name: 'Chloracne',
    category: 'agent-orange',
    description: 'Skin condition caused by dioxin exposure',
  },
  {
    id: 'ao-ischemic-heart',
    name: 'Ischemic Heart Disease',
    category: 'agent-orange',
    description: 'Coronary artery disease and related conditions',
  },
  {
    id: 'ao-parkinsons',
    name: "Parkinson's Disease",
    category: 'agent-orange',
    description: 'Progressive nervous system disorder',
  },
  {
    id: 'ao-peripheral-neuropathy',
    name: 'Early-Onset Peripheral Neuropathy',
    category: 'agent-orange',
    description: 'Nerve damage appearing within one year of exposure',
  },
  {
    id: 'ao-porphyria-cutanea-tarda',
    name: 'Porphyria Cutanea Tarda',
    category: 'agent-orange',
    description: 'Disorder affecting skin and liver',
  },
  {
    id: 'ao-als',
    name: 'AL Amyloidosis',
    category: 'agent-orange',
    description: 'Abnormal protein buildup in organs',
  },
  {
    id: 'ao-bladder-cancer',
    name: 'Bladder Cancer',
    category: 'agent-orange',
    description: 'Cancer of the urinary bladder',
    addedDate: '2021-08-10',
  },
  {
    id: 'ao-hypothyroidism',
    name: 'Hypothyroidism',
    category: 'agent-orange',
    description: 'Underactive thyroid gland',
    addedDate: '2021-08-10',
  },
  {
    id: 'ao-parkinsonism',
    name: 'Parkinsonism',
    category: 'agent-orange',
    description: 'Movement disorders similar to Parkinson\'s',
    addedDate: '2021-08-10',
  },
  // PACT Act additions
  {
    id: 'ao-monoclonal-gammopathy',
    name: 'Monoclonal Gammopathy of Undetermined Significance (MGUS)',
    category: 'agent-orange',
    description: 'Abnormal protein in blood, precursor to myeloma',
    addedDate: '2022-08-10',
  },
  {
    id: 'ao-hypertension',
    name: 'Hypertension (High Blood Pressure)',
    category: 'agent-orange',
    description: 'Elevated blood pressure requiring treatment',
    addedDate: '2022-08-10',
  },
];

// Eligible Locations for Toxic Exposure
export const pactActLocations: EligibleLocation[] = [
  // Middle East - Burn Pits
  {
    id: 'iraq',
    name: 'Iraq',
    country: 'Iraq',
    region: 'Middle East',
    exposureType: 'burn-pit',
    startDate: '1990-08-02',
    endDate: 'present',
    notes: 'Includes Operations Desert Shield, Desert Storm, Iraqi Freedom, New Dawn',
  },
  {
    id: 'afghanistan',
    name: 'Afghanistan',
    country: 'Afghanistan',
    region: 'Middle East',
    exposureType: 'burn-pit',
    startDate: '2001-10-07',
    endDate: 'present',
    notes: 'Operation Enduring Freedom and subsequent operations',
  },
  {
    id: 'kuwait',
    name: 'Kuwait',
    country: 'Kuwait',
    region: 'Middle East',
    exposureType: 'burn-pit',
    startDate: '1990-08-02',
    endDate: 'present',
  },
  {
    id: 'saudi-arabia',
    name: 'Saudi Arabia',
    country: 'Saudi Arabia',
    region: 'Middle East',
    exposureType: 'burn-pit',
    startDate: '1990-08-02',
    endDate: 'present',
  },
  {
    id: 'bahrain',
    name: 'Bahrain',
    country: 'Bahrain',
    region: 'Middle East',
    exposureType: 'burn-pit',
    startDate: '1990-08-02',
    endDate: 'present',
  },
  {
    id: 'qatar',
    name: 'Qatar',
    country: 'Qatar',
    region: 'Middle East',
    exposureType: 'burn-pit',
    startDate: '1990-08-02',
    endDate: 'present',
  },
  {
    id: 'uae',
    name: 'United Arab Emirates',
    country: 'UAE',
    region: 'Middle East',
    exposureType: 'burn-pit',
    startDate: '1990-08-02',
    endDate: 'present',
  },
  {
    id: 'jordan',
    name: 'Jordan',
    country: 'Jordan',
    region: 'Middle East',
    exposureType: 'burn-pit',
    startDate: '2003-03-19',
    endDate: 'present',
  },
  {
    id: 'syria',
    name: 'Syria',
    country: 'Syria',
    region: 'Middle East',
    exposureType: 'burn-pit',
    startDate: '2014-09-22',
    endDate: 'present',
  },
  {
    id: 'yemen',
    name: 'Yemen',
    country: 'Yemen',
    region: 'Middle East',
    exposureType: 'burn-pit',
    startDate: '2002-01-01',
    endDate: 'present',
  },
  {
    id: 'djibouti',
    name: 'Djibouti',
    country: 'Djibouti',
    region: 'Africa',
    exposureType: 'burn-pit',
    startDate: '2001-10-07',
    endDate: 'present',
  },
  {
    id: 'egypt',
    name: 'Egypt',
    country: 'Egypt',
    region: 'Middle East',
    exposureType: 'burn-pit',
    startDate: '2001-09-11',
    endDate: 'present',
    notes: 'Sinai Peninsula operations',
  },
  {
    id: 'lebanon',
    name: 'Lebanon',
    country: 'Lebanon',
    region: 'Middle East',
    exposureType: 'burn-pit',
    startDate: '1982-08-25',
    endDate: 'present',
  },
  {
    id: 'oman',
    name: 'Oman',
    country: 'Oman',
    region: 'Middle East',
    exposureType: 'burn-pit',
    startDate: '1990-08-02',
    endDate: 'present',
  },
  {
    id: 'somalia',
    name: 'Somalia',
    country: 'Somalia',
    region: 'Africa',
    exposureType: 'burn-pit',
    startDate: '1992-12-05',
    endDate: 'present',
  },
  {
    id: 'uzbekistan',
    name: 'Uzbekistan',
    country: 'Uzbekistan',
    region: 'Central Asia',
    exposureType: 'burn-pit',
    startDate: '2001-10-07',
    endDate: 'present',
    notes: 'K2 Karshi-Khanabad Air Base',
  },

  // Vietnam - Agent Orange
  {
    id: 'vietnam',
    name: 'Vietnam',
    country: 'Vietnam',
    region: 'Southeast Asia',
    exposureType: 'agent-orange',
    startDate: '1962-01-09',
    endDate: '1975-05-07',
    notes: 'Republic of Vietnam including territorial waters',
  },
  {
    id: 'thailand-ao',
    name: 'Thailand (Air Bases)',
    country: 'Thailand',
    region: 'Southeast Asia',
    exposureType: 'agent-orange',
    startDate: '1962-02-28',
    endDate: '1975-05-07',
    notes: 'Royal Thai Air Force Bases: U-Tapao, Korat, Nakhon Phanom, Udorn, Takhli, Don Muang',
  },
  {
    id: 'laos',
    name: 'Laos',
    country: 'Laos',
    region: 'Southeast Asia',
    exposureType: 'agent-orange',
    startDate: '1962-01-09',
    endDate: '1975-05-07',
  },
  {
    id: 'cambodia',
    name: 'Cambodia',
    country: 'Cambodia',
    region: 'Southeast Asia',
    exposureType: 'agent-orange',
    startDate: '1969-04-16',
    endDate: '1975-04-17',
  },
  {
    id: 'guam-ao',
    name: 'Guam',
    country: 'USA',
    region: 'Pacific',
    exposureType: 'agent-orange',
    startDate: '1962-01-09',
    endDate: '1975-05-07',
    notes: 'Andersen Air Force Base',
  },
  {
    id: 'korea-dmz',
    name: 'Korean DMZ',
    country: 'South Korea',
    region: 'East Asia',
    exposureType: 'agent-orange',
    startDate: '1968-04-01',
    endDate: '1971-08-31',
    notes: 'Demilitarized Zone area',
  },
];

// Eligibility Checker Function
export interface EligibilityResult {
  isEligible: boolean;
  matchedLocations: EligibleLocation[];
  exposureTypes: string[];
  eligibleConditions: PresumptiveCondition[];
  notes: string[];
}

export function checkPACTActEligibility(
  serviceLocations: string[],
  startDate: Date,
  endDate: Date
): EligibilityResult {
  const result: EligibilityResult = {
    isEligible: false,
    matchedLocations: [],
    exposureTypes: [],
    eligibleConditions: [],
    notes: [],
  };

  // Check each location
  for (const locationId of serviceLocations) {
    const location = pactActLocations.find(l =>
      l.id === locationId ||
      l.name.toLowerCase() === locationId.toLowerCase() ||
      l.country.toLowerCase() === locationId.toLowerCase()
    );

    if (!location) continue;

    // Check if service dates overlap with exposure period
    const locationStart = new Date(location.startDate);
    const locationEnd = location.endDate === 'present' ? new Date() : new Date(location.endDate);

    const overlaps = startDate <= locationEnd && endDate >= locationStart;

    if (overlaps) {
      result.matchedLocations.push(location);
      if (!result.exposureTypes.includes(location.exposureType)) {
        result.exposureTypes.push(location.exposureType);
      }
    }
  }

  // Determine eligible conditions based on exposure types
  if (result.exposureTypes.includes('burn-pit')) {
    result.eligibleConditions.push(...burnPitPresumptives);
    result.notes.push('You may be eligible for burn pit presumptive conditions under the PACT Act.');
  }

  if (result.exposureTypes.includes('agent-orange')) {
    result.eligibleConditions.push(...agentOrangePresumptives);
    result.notes.push('You may be eligible for Agent Orange presumptive conditions.');
  }

  result.isEligible = result.matchedLocations.length > 0;

  if (result.isEligible) {
    result.notes.push('File your claim as soon as possible to maximize potential back pay.');
  }

  return result;
}

// Get all burn pit conditions
export function getBurnPitConditions(): PresumptiveCondition[] {
  return burnPitPresumptives;
}

// Get all Agent Orange conditions
export function getAgentOrangeConditions(): PresumptiveCondition[] {
  return agentOrangePresumptives;
}

// Get all eligible locations
export function getAllEligibleLocations(): EligibleLocation[] {
  return pactActLocations;
}

// Get locations by exposure type
export function getLocationsByExposure(type: EligibleLocation['exposureType']): EligibleLocation[] {
  return pactActLocations.filter(l => l.exposureType === type);
}
