export interface PactActCondition {
  id: string;
  condition: string;
  category: string;
  presumptiveFor: string[];
  effectiveDate: string;
  notes?: string;
}

export const PACT_ACT_CONDITIONS: PactActCondition[] = [
  // Respiratory Conditions
  {
    id: 'asthma',
    condition: 'Asthma',
    category: 'Respiratory',
    presumptiveFor: ['Gulf War', 'Post-9/11', 'Burn Pit Exposure'],
    effectiveDate: '2022-08-10',
    notes: 'Diagnosed during or after service in covered locations'
  },
  {
    id: 'rhinitis',
    condition: 'Rhinitis',
    category: 'Respiratory',
    presumptiveFor: ['Gulf War', 'Post-9/11', 'Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'sinusitis',
    condition: 'Sinusitis (including rhinosinusitis)',
    category: 'Respiratory',
    presumptiveFor: ['Gulf War', 'Post-9/11', 'Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'copd',
    condition: 'Chronic Obstructive Pulmonary Disease (COPD)',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'pulmonary-fibrosis',
    condition: 'Pulmonary Fibrosis',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'constrictive-bronchiolitis',
    condition: 'Constrictive Bronchiolitis',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'granulomatous-disease',
    condition: 'Granulomatous Disease',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'interstitial-lung',
    condition: 'Interstitial Lung Disease',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'pleuritis',
    condition: 'Pleuritis',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'sarcoidosis',
    condition: 'Sarcoidosis',
    category: 'Respiratory',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },

  // Cancers
  {
    id: 'lung-cancer',
    condition: 'Lung Cancer (any type)',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure', 'Agent Orange'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'larynx-cancer',
    condition: 'Cancer of the Larynx',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'trachea-cancer',
    condition: 'Cancer of the Trachea',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'kidney-cancer',
    condition: 'Kidney Cancer',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'head-neck-cancer',
    condition: 'Head Cancer of Any Kind',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure', 'Agent Orange'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'brain-cancer',
    condition: 'Brain Cancer',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'lymphoma',
    condition: 'Lymphoma (any type)',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure', 'Agent Orange'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'pancreatic-cancer',
    condition: 'Pancreatic Cancer',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'melanoma',
    condition: 'Melanoma',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'glioblastoma',
    condition: 'Glioblastoma',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'reproductive-cancer',
    condition: 'Reproductive Cancer (any type)',
    category: 'Cancer',
    presumptiveFor: ['Burn Pit Exposure'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'bladder-cancer',
    condition: 'Bladder Cancer',
    category: 'Cancer',
    presumptiveFor: ['Agent Orange'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'hypothyroidism',
    condition: 'Hypothyroidism',
    category: 'Cancer',
    presumptiveFor: ['Agent Orange'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'parkinsonism',
    condition: 'Parkinsonism',
    category: 'Neurological',
    presumptiveFor: ['Agent Orange'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'monoclonal-gammopathy',
    condition: 'Monoclonal Gammopathy of Undetermined Significance (MGUS)',
    category: 'Blood/Immune',
    presumptiveFor: ['Agent Orange'],
    effectiveDate: '2022-08-10'
  },
  {
    id: 'hypertension',
    condition: 'High Blood Pressure (Hypertension)',
    category: 'Cardiovascular',
    presumptiveFor: ['Agent Orange'],
    effectiveDate: '2022-08-10'
  }
];

// Covered locations for PACT Act
export const COVERED_LOCATIONS = [
  { region: 'Southwest Asia', countries: ['Iraq', 'Kuwait', 'Saudi Arabia', 'Bahrain', 'Qatar', 'UAE', 'Oman'] },
  { region: 'Afghanistan', countries: ['Afghanistan'] },
  { region: 'Other', countries: ['Djibouti', 'Egypt', 'Jordan', 'Lebanon', 'Syria', 'Yemen', 'Uzbekistan', 'Somalia'] }
];
