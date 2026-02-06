/**
 * Presumptive Conditions — VA recognized conditions linked to specific exposures
 * These conditions are automatically service-connected for qualifying veterans
 */

import type { PresumptiveCondition } from './types';

export const presumptiveConditions: PresumptiveCondition[] = [
  // ============================================
  // AGENT ORANGE / HERBICIDE EXPOSURE
  // Vietnam, Thailand, Korea DMZ, C-123 aircraft, test/storage sites
  // ============================================
  { conditionName: 'AL Amyloidosis', conditionId: 'al-amyloidosis', program: 'agent-orange', description: 'Rare disease caused by abnormal protein deposits' },
  { conditionName: 'Bladder Cancer', conditionId: 'bladder-cancer', program: 'agent-orange', description: 'Cancer of the bladder (added under PACT Act)' },
  { conditionName: 'Chronic B-Cell Leukemia', conditionId: 'chronic-b-cell-leukemia', program: 'agent-orange', description: 'Cancer affecting white blood cells' },
  { conditionName: 'Chloracne', conditionId: 'chloracne', program: 'agent-orange', description: 'Skin condition from dioxin exposure (must manifest within 1 year)' },
  { conditionName: 'Diabetes Mellitus Type II', conditionId: 'diabetes', program: 'agent-orange', description: 'Insulin resistance and high blood sugar' },
  { conditionName: 'Hodgkin\'s Disease', conditionId: 'hodgkins-disease', program: 'agent-orange', description: 'Cancer of the lymphatic system' },
  { conditionName: 'Hypertension', conditionId: 'hypertension', program: 'agent-orange', description: 'High blood pressure (added under PACT Act)' },
  { conditionName: 'Ischemic Heart Disease', conditionId: 'heart-disease', program: 'agent-orange', description: 'Includes coronary artery disease, angina, myocardial infarction' },
  { conditionName: 'Monoclonal Gammopathy of Undetermined Significance (MGUS)', conditionId: 'mgus', program: 'agent-orange', description: 'Abnormal protein in blood (added under PACT Act)' },
  { conditionName: 'Multiple Myeloma', conditionId: 'multiple-myeloma', program: 'agent-orange', description: 'Cancer of plasma cells' },
  { conditionName: 'Non-Hodgkin\'s Lymphoma', conditionId: 'non-hodgkins-lymphoma', program: 'agent-orange', description: 'Group of blood cancers' },
  { conditionName: 'Parkinson\'s Disease', conditionId: 'parkinsons', program: 'agent-orange', description: 'Progressive nervous system movement disorder' },
  { conditionName: 'Parkinsonism', conditionId: 'parkinsonism', program: 'agent-orange', description: 'Parkinson-like symptoms (added under PACT Act)' },
  { conditionName: 'Peripheral Neuropathy, Early-Onset', conditionId: 'peripheral-neuropathy', program: 'agent-orange', description: 'Nerve damage manifesting within 1 year of exposure' },
  { conditionName: 'Porphyria Cutanea Tarda', conditionId: 'porphyria-cutanea-tarda', program: 'agent-orange', description: 'Liver condition causing skin blisters (must manifest within 1 year)' },
  { conditionName: 'Prostate Cancer', conditionId: 'prostate-condition', program: 'agent-orange', description: 'Cancer of the prostate gland' },
  { conditionName: 'Respiratory Cancers', conditionId: 'lung-cancer', program: 'agent-orange', description: 'Cancers of the lung, bronchus, larynx, or trachea' },
  { conditionName: 'Soft Tissue Sarcomas', conditionId: 'soft-tissue-sarcoma', program: 'agent-orange', description: 'Various cancers of body soft tissues' },

  // ============================================
  // PACT ACT / BURN PIT EXPOSURE
  // Post-9/11 veterans (Iraq, Afghanistan, SW Asia)
  // ============================================
  { conditionName: 'Constrictive Bronchiolitis', conditionId: 'constrictive-bronchiolitis', program: 'pact-act', description: 'Small airway damage from toxic inhalation' },
  { conditionName: 'Constrictive Pericarditis', conditionId: 'constrictive-pericarditis', program: 'pact-act', description: 'Inflammation of heart lining' },
  { conditionName: 'COPD', conditionId: 'copd', program: 'pact-act', description: 'Chronic obstructive pulmonary disease from toxic exposure' },
  { conditionName: 'Desquamative Interstitial Pneumonia', conditionId: 'desquamative-pneumonia', program: 'pact-act', description: 'Rare lung condition from toxic inhalation' },
  { conditionName: 'Diffuse Alveolar Damage', conditionId: 'diffuse-alveolar-damage', program: 'pact-act', description: 'Widespread lung tissue damage' },
  { conditionName: 'Hypersensitivity Pneumonitis', conditionId: 'hypersensitivity-pneumonitis', program: 'pact-act', description: 'Allergic lung reaction to inhaled substances' },
  { conditionName: 'Organizing Pneumonia', conditionId: 'organizing-pneumonia', program: 'pact-act', description: 'Inflammatory lung condition' },
  { conditionName: 'Pulmonary Fibrosis', conditionId: 'pulmonary-fibrosis', program: 'pact-act', description: 'Lung tissue scarring' },
  { conditionName: 'Sarcoidosis', conditionId: 'sarcoidosis', program: 'pact-act', description: 'Inflammatory disease affecting multiple organs' },
  { conditionName: 'Chronic Sinusitis', conditionId: 'sinusitis', program: 'pact-act', description: 'Chronic sinus inflammation from toxic exposure' },
  { conditionName: 'Chronic Rhinitis', conditionId: 'rhinitis', program: 'pact-act', description: 'Chronic nasal inflammation' },
  { conditionName: 'Chronic Laryngitis', conditionId: 'chronic-laryngitis', program: 'pact-act', description: 'Chronic voice box inflammation' },
  { conditionName: 'Glioblastoma', conditionId: 'glioblastoma', program: 'pact-act', description: 'Aggressive brain cancer' },
  { conditionName: 'Head Cancer of Any Type', conditionId: 'head-cancer', program: 'pact-act', description: 'Any cancer of head region' },
  { conditionName: 'Neck Cancer of Any Type', conditionId: 'neck-cancer', program: 'pact-act', description: 'Any cancer of neck region' },
  { conditionName: 'Respiratory Cancer of Any Type', conditionId: 'respiratory-cancer', program: 'pact-act', description: 'Any respiratory system cancer' },
  { conditionName: 'Gastrointestinal Cancer of Any Type', conditionId: 'gi-cancer', program: 'pact-act', description: 'Any gastrointestinal cancer' },
  { conditionName: 'Reproductive Cancer of Any Type', conditionId: 'reproductive-cancer', program: 'pact-act', description: 'Any reproductive system cancer' },
  { conditionName: 'Lymphatic Cancer of Any Type', conditionId: 'lymphatic-cancer', program: 'pact-act', description: 'Any lymphatic system cancer' },
  { conditionName: 'Kidney Cancer', conditionId: 'kidney-cancer', program: 'pact-act', description: 'Cancer of the kidneys' },
  { conditionName: 'Urinary Cancer of Any Type', conditionId: 'urinary-cancer', program: 'pact-act', description: 'Any urinary system cancer' },
  { conditionName: 'Melanoma', conditionId: 'melanoma', program: 'pact-act', description: 'Malignant skin cancer' },
  { conditionName: 'Pancreatic Cancer', conditionId: 'pancreatic-cancer', program: 'pact-act', description: 'Cancer of the pancreas' },
  { conditionName: 'Any Illnesses VA Determines Are Caused by Burn Pits', program: 'pact-act', description: 'Catch-all for future conditions linked to burn pit exposure' },

  // ============================================
  // GULF WAR ILLNESS
  // Southwest Asia service (1990-present)
  // ============================================
  { conditionName: 'Chronic Fatigue Syndrome', conditionId: 'chronic-fatigue', program: 'gulf-war', description: 'Persistent fatigue not relieved by rest' },
  { conditionName: 'Fibromyalgia', conditionId: 'fibromyalgia', program: 'gulf-war', description: 'Widespread musculoskeletal pain' },
  { conditionName: 'Functional Gastrointestinal Disorders (IBS)', conditionId: 'ibs', program: 'gulf-war', description: 'Includes IBS and functional dyspepsia' },
  { conditionName: 'Undiagnosed Illness with Chronic Symptoms', conditionId: 'gulf-war-syndrome', program: 'gulf-war', description: 'Qualifying chronic symptoms without diagnosis: fatigue, headaches, joint pain, neurological symptoms, sleep disturbances, GI symptoms, cardiovascular symptoms, weight loss, menstrual disorders' },

  // ============================================
  // CAMP LEJEUNE WATER CONTAMINATION
  // Service at Camp Lejeune for 30+ days (Aug 1953 - Dec 1987)
  // ============================================
  { conditionName: 'Adult Leukemia', program: 'camp-lejeune', description: 'Blood cancer from contaminated water' },
  { conditionName: 'Aplastic Anemia and Other Myelodysplastic Syndromes', program: 'camp-lejeune', description: 'Bone marrow failure conditions' },
  { conditionName: 'Bladder Cancer', program: 'camp-lejeune', description: 'Cancer from water contamination' },
  { conditionName: 'Kidney Cancer', program: 'camp-lejeune', description: 'Renal cell carcinoma from TCE exposure' },
  { conditionName: 'Liver Cancer', program: 'camp-lejeune', description: 'Hepatic cancer from contaminated water' },
  { conditionName: 'Multiple Myeloma', program: 'camp-lejeune', description: 'Plasma cell cancer' },
  { conditionName: 'Non-Hodgkin\'s Lymphoma', program: 'camp-lejeune', description: 'Blood cancer from water contamination' },
  { conditionName: 'Parkinson\'s Disease', conditionId: 'parkinsons', program: 'camp-lejeune', description: 'Neurological disorder from toxic exposure' },

  // ============================================
  // RADIATION EXPOSURE
  // Atomic veterans, nuclear weapons testing, Hiroshima/Nagasaki occupation
  // ============================================
  { conditionName: 'All Forms of Leukemia', program: 'radiation', description: 'Except chronic lymphocytic leukemia' },
  { conditionName: 'Thyroid Cancer', program: 'radiation', description: 'Radiation-induced thyroid malignancy' },
  { conditionName: 'Breast Cancer', program: 'radiation', description: 'Radiation exposure increases risk' },
  { conditionName: 'Lung Cancer', program: 'radiation', description: 'Radiation-induced lung malignancy' },
  { conditionName: 'Bone Cancer', program: 'radiation', description: 'Primary bone cancer from radiation' },
  { conditionName: 'Liver Cancer', program: 'radiation', description: 'Radiation-induced hepatic cancer' },
  { conditionName: 'Skin Cancer', program: 'radiation', description: 'Radiation-induced skin malignancy' },
  { conditionName: 'Esophageal Cancer', program: 'radiation', description: 'GI tract radiation effects' },
  { conditionName: 'Stomach Cancer', program: 'radiation', description: 'Gastric radiation effects' },
  { conditionName: 'Colon Cancer', program: 'radiation', description: 'Intestinal radiation effects' },
  { conditionName: 'Pancreatic Cancer', program: 'radiation', description: 'Radiation-induced pancreatic cancer' },
  { conditionName: 'Kidney/Renal Cancer', program: 'radiation', description: 'Renal cell carcinoma from radiation' },
  { conditionName: 'Urinary/Bladder Cancer', program: 'radiation', description: 'Radiation-induced bladder cancer' },
  { conditionName: 'Salivary Gland Cancer', program: 'radiation', description: 'Head/neck radiation effects' },
  { conditionName: 'Multiple Myeloma', program: 'radiation', description: 'Plasma cell cancer from radiation' },
  { conditionName: 'Lymphomas (except Hodgkin\'s)', program: 'radiation', description: 'Blood cancers from radiation' },
  { conditionName: 'Brain Cancer', program: 'radiation', description: 'CNS malignancy from radiation' },
  { conditionName: 'Ovarian Cancer', program: 'radiation', description: 'Reproductive cancer from radiation' },
  { conditionName: 'Small Intestine Cancer', program: 'radiation', description: 'Radiation-induced intestinal cancer' },
  { conditionName: 'Bile Duct Cancer', program: 'radiation', description: 'Cholangiocarcinoma from radiation' },
  { conditionName: 'Gallbladder Cancer', program: 'radiation', description: 'Radiation-induced gallbladder cancer' },

  // ============================================
  // FORMER PRISONERS OF WAR (POW)
  // ============================================
  { conditionName: 'Psychosis', program: 'pow', description: 'Any psychotic disorder' },
  { conditionName: 'Dysthymic Disorder', program: 'pow', description: 'Persistent depressive disorder' },
  { conditionName: 'Post-Traumatic Stress Disorder', conditionId: 'ptsd', program: 'pow', description: 'Trauma from captivity' },
  { conditionName: 'Any of the Anxiety States', program: 'pow', description: 'Anxiety disorders from captivity' },
  { conditionName: 'Cold Injury Residuals', program: 'pow', description: 'Frostbite and cold exposure effects' },
  { conditionName: 'Nutritional Deficiency Residuals (Beriberi, Pellagra)', program: 'pow', description: 'Malnutrition effects including beriberi heart disease' },
  { conditionName: 'Peptic Ulcer Disease', program: 'pow', description: 'Stress and malnutrition-related ulcers' },
  { conditionName: 'Peripheral Neuropathy', conditionId: 'peripheral-neuropathy', program: 'pow', description: 'Nerve damage from captivity conditions' },
  { conditionName: 'Chronic Dysentery', program: 'pow', description: 'Persistent GI dysfunction' },
  { conditionName: 'Irritable Bowel Syndrome', conditionId: 'ibs', program: 'pow', description: 'GI dysfunction from captivity stress' },
  { conditionName: 'Cirrhosis of the Liver', program: 'pow', description: 'Hepatic disease from captivity conditions' },
  { conditionName: 'Stroke', conditionId: 'stroke', program: 'pow', description: 'Cerebrovascular effects' },
  { conditionName: 'Heart Disease', conditionId: 'heart-disease', program: 'pow', description: 'Cardiovascular effects of captivity' },
  { conditionName: 'Osteoporosis', program: 'pow', description: 'Bone loss from malnutrition and captivity' },
];

/** Group presumptive conditions by program */
export function getPresumptiveByProgram(program: PresumptiveCondition['program']): PresumptiveCondition[] {
  return presumptiveConditions.filter(c => c.program === program);
}

/** Check if a condition ID has presumptive eligibility */
export function getPresumptivePrograms(conditionId: string): string[] {
  return presumptiveConditions
    .filter(c => c.conditionId === conditionId)
    .map(c => c.program);
}

/** Program display labels */
export const programLabels: Record<PresumptiveCondition['program'], string> = {
  'agent-orange': 'Agent Orange / Herbicide Exposure',
  'pact-act': 'PACT Act / Burn Pit Exposure',
  'gulf-war': 'Gulf War Illness (Southwest Asia)',
  'camp-lejeune': 'Camp Lejeune Water Contamination',
  'radiation': 'Radiation Exposure',
  'pow': 'Former Prisoner of War',
};
