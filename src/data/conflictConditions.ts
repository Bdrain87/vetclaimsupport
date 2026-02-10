export interface ConditionGroup {
  name: string;
  conditions: string[];
  presumptive: boolean;
  notes?: string;
}

export interface Resource {
  name: string;
  url: string;
}

export interface Conflict {
  id: string;
  name: string;
  years: string;
  icon: string;
  description: string;
  commonConditions: ConditionGroup[];
  exposures: string[];
  resources: Resource[];
}

export const conflicts: Conflict[] = [
  {
    id: 'vietnam',
    name: 'Vietnam War',
    years: '1955-1975',
    icon: 'Flag',
    description: 'Service in Vietnam, Thailand, or Korean DMZ during this period may qualify for Agent Orange presumptive conditions.',
    commonConditions: [
      {
        name: 'Agent Orange Related Conditions',
        conditions: [
          'Type 2 Diabetes',
          'Prostate Cancer',
          'Lung Cancer',
          'Hodgkin\'s Disease',
          'Non-Hodgkin\'s Lymphoma',
          'Soft Tissue Sarcoma',
          'Chronic B-cell Leukemia',
          'Parkinson\'s Disease',
          'Ischemic Heart Disease',
          'Peripheral Neuropathy (Early Onset)',
          'Chloracne',
          'AL Amyloidosis',
          'Bladder Cancer',
          'Hypothyroidism',
          'Parkinsonism',
          'Monoclonal Gammopathy',
          'High Blood Pressure (Hypertension)'
        ],
        presumptive: true,
        notes: 'Presumptive conditions for veterans who served in Vietnam, Thailand (certain bases), or Korean DMZ. No proof of exposure required.'
      },
      {
        name: 'Combat-Related Conditions',
        conditions: [
          'PTSD',
          'Hearing Loss',
          'Tinnitus',
          'Traumatic Brain Injury',
          'Shrapnel/Fragment Wounds'
        ],
        presumptive: false,
        notes: 'Service connection requires evidence of combat stressor or in-service event.'
      },
      {
        name: 'Tropical & Infectious Diseases',
        conditions: [
          'Malaria',
          'Hepatitis B/C',
          'Parasitic Infections',
          'Tuberculosis',
          'Fungal Infections'
        ],
        presumptive: false,
        notes: 'Common due to tropical environment. Medical records showing diagnosis during or shortly after service helpful.'
      }
    ],
    exposures: ['Agent Orange', 'Herbicides', 'Combat', 'Tropical environment', 'Contaminated water'],
    resources: [
      { name: 'VA Agent Orange Page', url: 'https://www.va.gov/disability/eligibility/hazardous-materials-exposure/agent-orange/' },
      { name: 'Agent Orange Registry', url: 'https://www.publichealth.va.gov/exposures/agentorange/registry.asp' },
      { name: 'Vietnam Veterans of America', url: 'https://vva.org/' }
    ]
  },
  {
    id: 'gulf-war',
    name: 'Gulf War',
    years: '1990-1991',
    icon: 'Sun',
    description: 'Operation Desert Shield/Storm veterans may qualify for Gulf War Syndrome presumptive conditions.',
    commonConditions: [
      {
        name: 'Gulf War Syndrome / Undiagnosed Illness',
        conditions: [
          'Chronic Fatigue Syndrome',
          'Fibromyalgia',
          'Functional Gastrointestinal Disorders (IBS)',
          'Undiagnosed Chronic Pain',
          'Undiagnosed Neurological Symptoms',
          'Undiagnosed Respiratory Symptoms',
          'Undiagnosed Skin Conditions',
          'Undiagnosed Cardiovascular Symptoms',
          'Undiagnosed Sleep Disturbances',
          'Undiagnosed Menstrual Disorders'
        ],
        presumptive: true,
        notes: 'Presumptive for Gulf War veterans with qualifying chronic disability manifesting to 10% or more. Symptoms must have persisted 6+ months.'
      },
      {
        name: 'Infectious Diseases (Gulf War)',
        conditions: [
          'Brucellosis',
          'Campylobacter jejuni',
          'Coxiella burnetii (Q fever)',
          'Malaria',
          'Mycobacterium tuberculosis',
          'Nontyphoid Salmonella',
          'Shigella',
          'Visceral leishmaniasis',
          'West Nile virus'
        ],
        presumptive: true,
        notes: 'Presumptive infectious diseases for Gulf War veterans.'
      },
      {
        name: 'Environmental Exposure Conditions',
        conditions: [
          'Respiratory Conditions',
          'Skin Conditions',
          'Neurological Conditions',
          'Chronic Headaches'
        ],
        presumptive: false,
        notes: 'Related to oil well fires, depleted uranium, chemical agents, pesticides. Document exposure and timing of symptoms.'
      }
    ],
    exposures: ['Oil well fires', 'Depleted uranium', 'Chemical agents (Khamisiyah)', 'Pesticides', 'Vaccines', 'Sand/dust'],
    resources: [
      { name: 'VA Gulf War Page', url: 'https://www.va.gov/disability/eligibility/hazardous-materials-exposure/gulf-war-illness-southwest-asia/' },
      { name: 'Gulf War Registry', url: 'https://www.publichealth.va.gov/exposures/gulfwar/registry.asp' }
    ]
  },
  {
    id: 'iraq-afghanistan',
    name: 'Iraq & Afghanistan (OEF/OIF/OND)',
    years: '2001-Present',
    icon: 'Award',
    description: 'Post-9/11 veterans benefit from PACT Act (2022) burn pit presumptives and combat-related condition support.',
    commonConditions: [
      {
        name: 'Burn Pit Exposure (PACT Act)',
        conditions: [
          'Asthma (diagnosed during or after service)',
          'Rhinitis',
          'Sinusitis (including rhinosinusitis)',
          'Pulmonary Fibrosis',
          'Constrictive Bronchiolitis',
          'Granulomatous Disease',
          'Sarcoidosis',
          'Chronic Bronchitis',
          'COPD',
          'Pleural Plaque',
          'Lung Cancer',
          'Laryngeal Cancer',
          'Tracheal Cancer',
          'Bronchial Cancer',
          'Pleural Mesothelioma',
          'Adenocarcinoma of the Lung',
          'Squamous Cell Carcinoma of the Lung',
          'Large Cell Carcinoma of the Lung',
          'Salivary Gland Cancer',
          'Head/Neck Cancers',
          'Lymphoma (any type)',
          'Lymphomatic Cancer',
          'Kidney Cancer',
          'Pancreatic Cancer',
          'Brain Cancer',
          'Melanoma',
          'Reproductive Cancers',
          'Glioblastoma'
        ],
        presumptive: true,
        notes: 'PACT Act (2022) - Presumptive for veterans who served in covered locations. No proof of burn pit exposure required.'
      },
      {
        name: 'TBI & Mental Health',
        conditions: [
          'Traumatic Brain Injury (TBI)',
          'PTSD',
          'Major Depressive Disorder',
          'Generalized Anxiety Disorder',
          'Sleep Disorders (Insomnia, Sleep Apnea)',
          'Adjustment Disorder',
          'Cognitive Disorders',
          'Memory Issues',
          'Migraines/Headaches'
        ],
        presumptive: false,
        notes: 'High rates due to IEDs, blast exposure, and combat trauma. Combat veterans have relaxed evidence requirements for PTSD.'
      },
      {
        name: 'Musculoskeletal Conditions',
        conditions: [
          'Lumbar/Thoracic Spine Conditions',
          'Cervical Spine Conditions',
          'Knee Conditions',
          'Shoulder Conditions',
          'Ankle Conditions',
          'Degenerative Disc Disease',
          'Radiculopathy',
          'Plantar Fasciitis'
        ],
        presumptive: false,
        notes: 'Related to heavy gear (80+ lbs), extended patrols, vehicle vibration, combat landings. Document in-service injuries.'
      }
    ],
    exposures: ['Burn pits', 'IEDs/Blast exposure', 'Combat', 'Extreme temperatures', 'Sandstorms', 'Contaminated water'],
    resources: [
      { name: 'PACT Act Information', url: 'https://www.va.gov/resources/the-pact-act-and-your-va-benefits/' },
      { name: 'Burn Pit Registry', url: 'https://veteran.mobilehealth.va.gov/AHBurnPitRegistry/' },
      { name: 'VA OEF/OIF/OND Page', url: 'https://www.va.gov/health-care/health-needs-conditions/health-issues-related-to-service-era/operation-enduring-freedom/' }
    ]
  },
  {
    id: 'korea',
    name: 'Korean War',
    years: '1950-1953',
    icon: 'Flag',
    description: 'Korean War veterans may qualify for cold injury and POW presumptive conditions.',
    commonConditions: [
      {
        name: 'Cold Injury Residuals',
        conditions: [
          'Frostbite Residuals (any extremity)',
          'Cold Injury to Extremities',
          'Peripheral Neuropathy (cold-related)',
          'Raynaud\'s Phenomenon',
          'Arthritis (cold injury residual)',
          'Skin Cancer (at cold injury site)',
          'Nail/Hair Changes',
          'Hyperhidrosis',
          'Squamous Cell Carcinoma (cold injury site)'
        ],
        presumptive: true,
        notes: 'Presumptive for veterans who experienced cold injury during service. Chosin Reservoir survivors particularly affected.'
      },
      {
        name: 'Combat-Related Conditions',
        conditions: [
          'PTSD',
          'Hearing Loss',
          'Tinnitus',
          'Shrapnel/Fragment Injuries',
          'Gunshot Wound Residuals'
        ],
        presumptive: false,
        notes: 'Intense combat conditions. Document stressors and in-service events.'
      },
      {
        name: 'POW-Related Conditions',
        conditions: [
          'Anxiety Disorders',
          'Dysthymic Disorder',
          'Cold Injury',
          'Malnutrition Effects',
          'Beriberi (including heart disease)',
          'Cirrhosis of the Liver',
          'Ischemic Heart Disease',
          'Stroke',
          'Osteoporosis',
          'Irritable Bowel Syndrome',
          'Peptic Ulcer Disease',
          'Peripheral Neuropathy',
          'Psychosis'
        ],
        presumptive: true,
        notes: 'Presumptive for former POWs detained for any period of time. Relaxed evidence requirements.'
      }
    ],
    exposures: ['Extreme cold', 'Combat', 'POW conditions', 'Malnutrition', 'Contaminated water'],
    resources: [
      { name: 'VA Cold Injury Page', url: 'https://www.publichealth.va.gov/exposures/cold-injuries/' },
      { name: 'Korean War Veterans Association', url: 'https://www.kwva.us/' }
    ]
  },
  {
    id: 'cold-war',
    name: 'Cold War Era',
    years: '1947-1991',
    icon: 'AlertTriangle',
    description: 'Includes atomic veterans, Camp Lejeune contamination, and other Cold War-era exposures.',
    commonConditions: [
      {
        name: 'Radiation Exposure (Atomic Veterans)',
        conditions: [
          'All Cancers',
          'Leukemia (except CLL)',
          'Thyroid Cancer',
          'Breast Cancer',
          'Pharynx Cancer',
          'Esophageal Cancer',
          'Stomach Cancer',
          'Small Intestine Cancer',
          'Pancreatic Cancer',
          'Bile Duct Cancer',
          'Gallbladder Cancer',
          'Salivary Gland Cancer',
          'Urinary Tract Cancer',
          'Brain Cancer',
          'Bone Cancer',
          'Lung Cancer',
          'Colon Cancer',
          'Ovarian Cancer',
          'Lymphomas (except Hodgkin\'s)',
          'Multiple Myeloma',
          'Posterior Subcapsular Cataracts',
          'Non-malignant Thyroid Disease',
          'Parathyroid Adenoma',
          'Tumors of the Brain and CNS'
        ],
        presumptive: true,
        notes: 'Presumptive for "Atomic Veterans" who participated in nuclear testing or Hiroshima/Nagasaki occupation.'
      },
      {
        name: 'Camp Lejeune Water Contamination',
        conditions: [
          'Kidney Cancer',
          'Liver Cancer',
          'Non-Hodgkin\'s Lymphoma',
          'Adult Leukemia',
          'Bladder Cancer',
          'Multiple Myeloma',
          'Parkinson\'s Disease',
          'Aplastic Anemia and Other Myelodysplastic Syndromes',
          'Renal Toxicity',
          'Hepatic Steatosis',
          'Female Infertility',
          'Scleroderma',
          'Miscarriage',
          'Neurobehavioral Effects'
        ],
        presumptive: true,
        notes: 'Presumptive for service at Camp Lejeune for 30+ days between August 1953 and December 1987.'
      },
      {
        name: 'Other Cold War Exposures',
        conditions: [
          'Asbestosis',
          'Mesothelioma',
          'Lung Cancer (asbestos)',
          'Beryllium Disease',
          'Chemical Agent Exposure Effects'
        ],
        presumptive: false,
        notes: 'Document exposure circumstances (shipyard work, maintenance, chemical testing).'
      }
    ],
    exposures: ['Radiation', 'Contaminated water (Camp Lejeune)', 'Chemical testing', 'Asbestos', 'Beryllium'],
    resources: [
      { name: 'VA Radiation Exposure', url: 'https://www.va.gov/disability/eligibility/hazardous-materials-exposure/ionizing-radiation/' },
      { name: 'Camp Lejeune Claims', url: 'https://www.va.gov/disability/eligibility/hazardous-materials-exposure/camp-lejeune-water-contamination/' },
      { name: 'Atomic Veterans Page', url: 'https://www.va.gov/disability/eligibility/hazardous-materials-exposure/ionizing-radiation/' }
    ]
  },
  {
    id: 'peacetime',
    name: 'Peacetime Service',
    years: 'Various',
    icon: 'Shield',
    description: 'All service eras - training injuries, occupational exposures, and MST apply regardless of wartime service.',
    commonConditions: [
      {
        name: 'Training & Service Injuries',
        conditions: [
          'Hearing Loss (noise exposure)',
          'Tinnitus',
          'Back/Spine Injuries',
          'Knee Injuries',
          'Shoulder Injuries',
          'Ankle Injuries',
          'Hip Injuries',
          'Plantar Fasciitis',
          'Pes Planus (flat feet)',
          'Stress Fractures'
        ],
        presumptive: false,
        notes: 'Document in-service injury or repetitive strain. LOD (Line of Duty) determinations helpful.'
      },
      {
        name: 'Occupational Exposures',
        conditions: [
          'Asbestos-Related Conditions',
          'Respiratory Conditions',
          'Skin Conditions (dermatitis)',
          'Hearing Loss (occupational)',
          'Toxic Substance Exposure Effects',
          'Lead Exposure Effects',
          'Jet Fuel Exposure Effects'
        ],
        presumptive: false,
        notes: 'Depends on MOS/rate and documented exposure. Review job duties and known hazards for your specialty.'
      },
      {
        name: 'Military Sexual Trauma (MST)',
        conditions: [
          'PTSD',
          'Major Depressive Disorder',
          'Anxiety Disorders',
          'Eating Disorders',
          'Substance Use Disorders',
          'Sleep Disorders'
        ],
        presumptive: false,
        notes: 'Special evidence rules apply - "markers" in records can substitute for direct evidence. Behavioral changes, requests for transfer, decline in performance all count.'
      }
    ],
    exposures: ['Noise', 'Chemicals', 'Physical training', 'MST', 'Occupational hazards', 'Toxic substances'],
    resources: [
      { name: 'VA MST Information', url: 'https://www.va.gov/health-care/health-needs-conditions/military-sexual-trauma/' },
      { name: 'VA Toxic Exposure Page', url: 'https://www.va.gov/disability/eligibility/hazardous-materials-exposure/' }
    ]
  },
  {
    id: 'wwii',
    name: 'World War II',
    years: '1941-1945',
    icon: 'Star',
    description: 'WWII veterans may qualify for POW presumptives, radiation exposure, and combat-related conditions.',
    commonConditions: [
      {
        name: 'POW Conditions',
        conditions: [
          'Anxiety Disorders',
          'Dysthymic Disorder',
          'Beriberi (including heart disease)',
          'Cirrhosis of the Liver',
          'Cold Injury Residuals',
          'Ischemic Heart Disease',
          'Malnutrition Effects',
          'Stroke',
          'Osteoporosis',
          'Post-Traumatic Osteoarthritis',
          'Irritable Bowel Syndrome',
          'Peptic Ulcer Disease',
          'Peripheral Neuropathy',
          'Psychosis',
          'Helminthiasis'
        ],
        presumptive: true,
        notes: 'Presumptive for former POWs. Extends to conditions developing at any time after service.'
      },
      {
        name: 'Atomic Veterans (Hiroshima/Nagasaki)',
        conditions: [
          'All Cancers',
          'Leukemia',
          'Thyroid Disease',
          'Multiple Myeloma'
        ],
        presumptive: true,
        notes: 'Presumptive for veterans who participated in occupation of Hiroshima/Nagasaki before July 1946.'
      },
      {
        name: 'Combat-Related',
        conditions: [
          'PTSD',
          'Hearing Loss',
          'Tinnitus',
          'Shrapnel Wounds',
          'Gunshot Wound Residuals'
        ],
        presumptive: false,
        notes: 'Combat veterans have relaxed stressor verification requirements.'
      }
    ],
    exposures: ['Combat', 'Radiation (atomic)', 'POW conditions', 'Tropical diseases', 'Cold injuries (European theater)'],
    resources: [
      { name: 'VA WWII Veterans Page', url: 'https://www.va.gov/disability/eligibility/hazardous-materials-exposure/' },
      { name: 'National WWII Museum', url: 'https://www.nationalww2museum.org/' }
    ]
  }
];

// Helper function to get all presumptive conditions across all conflicts
export function getAllPresumptiveConditions(): { condition: string; conflict: string; group: string }[] {
  const result: { condition: string; conflict: string; group: string }[] = [];

  conflicts.forEach(conflict => {
    conflict.commonConditions.forEach(group => {
      if (group.presumptive) {
        group.conditions.forEach(condition => {
          result.push({
            condition,
            conflict: conflict.name,
            group: group.name
          });
        });
      }
    });
  });

  return result;
}

// Helper function to search conditions across all conflicts
export function searchConditions(query: string): { condition: string; conflict: Conflict; group: ConditionGroup }[] {
  const results: { condition: string; conflict: Conflict; group: ConditionGroup }[] = [];
  const lowerQuery = query.toLowerCase();

  conflicts.forEach(conflict => {
    conflict.commonConditions.forEach(group => {
      group.conditions.forEach(condition => {
        if (condition.toLowerCase().includes(lowerQuery)) {
          results.push({ condition, conflict, group });
        }
      });
    });
  });

  return results;
}

// Helper function to get conditions count
export function getConditionStats(conflict: Conflict): { total: number; presumptive: number } {
  let total = 0;
  let presumptive = 0;

  conflict.commonConditions.forEach(group => {
    total += group.conditions.length;
    if (group.presumptive) {
      presumptive += group.conditions.length;
    }
  });

  return { total, presumptive };
}
