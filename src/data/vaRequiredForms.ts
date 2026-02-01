// Required VA Forms by Disability Category / Diagnostic Code
// Maps conditions to the forms needed to file a claim

export interface VAForm {
  formNumber: string;
  name: string;
  description: string;
  url?: string;
}

// DBQ (Disability Benefits Questionnaire) Forms by body system/condition
export const dbqForms: Record<string, VAForm[]> = {
  // Mental Health Conditions
  'mental_health': [
    { formNumber: '21-0781', name: 'Statement in Support of Claim for PTSD', description: 'Describes stressor events that caused PTSD', url: 'https://www.va.gov/find-forms/about-form-21-0781/' },
    { formNumber: '21-0781a', name: 'Statement in Support of Claim for PTSD Secondary to Personal Assault', description: 'For MST or personal assault related PTSD', url: 'https://www.va.gov/find-forms/about-form-21-0781a/' },
    { formNumber: '21-0960P-3', name: 'DBQ - Review PTSD', description: 'Medical evaluation for PTSD diagnosis', url: 'https://www.va.gov/find-forms/' },
    { formNumber: '21-0960P-4', name: 'DBQ - Mental Disorders (Other Than PTSD and Eating Disorders)', description: 'For anxiety, depression, bipolar, etc.', url: 'https://www.va.gov/find-forms/' },
  ],
  'ptsd': [
    { formNumber: '21-0781', name: 'Statement in Support of Claim for PTSD', description: 'Describes stressor events that caused PTSD', url: 'https://www.va.gov/find-forms/about-form-21-0781/' },
    { formNumber: '21-0781a', name: 'Statement in Support of Claim for PTSD Secondary to Personal Assault', description: 'For MST or personal assault related PTSD (if applicable)', url: 'https://www.va.gov/find-forms/about-form-21-0781a/' },
    { formNumber: '21-0960P-3', name: 'DBQ - Review PTSD', description: 'Medical evaluation for PTSD diagnosis', url: 'https://www.va.gov/find-forms/' },
  ],
  'anxiety': [
    { formNumber: '21-0960P-4', name: 'DBQ - Mental Disorders (Other Than PTSD)', description: 'For anxiety disorders', url: 'https://www.va.gov/find-forms/' },
  ],
  'depression': [
    { formNumber: '21-0960P-4', name: 'DBQ - Mental Disorders (Other Than PTSD)', description: 'For depressive disorders', url: 'https://www.va.gov/find-forms/' },
  ],
  'eating_disorders': [
    { formNumber: '21-0960P-1', name: 'DBQ - Eating Disorders', description: 'For anorexia, bulimia, etc.', url: 'https://www.va.gov/find-forms/' },
  ],

  // Musculoskeletal - Spine
  'spine': [
    { formNumber: '21-0960M-14', name: 'DBQ - Back (Thoracolumbar Spine) Conditions', description: 'For lower/mid back conditions', url: 'https://www.va.gov/find-forms/' },
    { formNumber: '21-0960M-13', name: 'DBQ - Neck (Cervical Spine) Conditions', description: 'For neck conditions', url: 'https://www.va.gov/find-forms/' },
  ],
  'lumbar': [
    { formNumber: '21-0960M-14', name: 'DBQ - Back (Thoracolumbar Spine) Conditions', description: 'For lower back conditions', url: 'https://www.va.gov/find-forms/' },
  ],
  'cervical': [
    { formNumber: '21-0960M-13', name: 'DBQ - Neck (Cervical Spine) Conditions', description: 'For neck conditions', url: 'https://www.va.gov/find-forms/' },
  ],

  // Musculoskeletal - Joints
  'shoulder': [
    { formNumber: '21-0960M-12', name: 'DBQ - Shoulder and Arm Conditions', description: 'For shoulder injuries and conditions', url: 'https://www.va.gov/find-forms/' },
  ],
  'elbow': [
    { formNumber: '21-0960M-12', name: 'DBQ - Shoulder and Arm Conditions', description: 'For elbow conditions', url: 'https://www.va.gov/find-forms/' },
  ],
  'wrist': [
    { formNumber: '21-0960M-7', name: 'DBQ - Wrist Conditions', description: 'For wrist injuries and conditions', url: 'https://www.va.gov/find-forms/' },
  ],
  'hand': [
    { formNumber: '21-0960M-8', name: 'DBQ - Hand and Finger Conditions', description: 'For hand and finger conditions', url: 'https://www.va.gov/find-forms/' },
  ],
  'hip': [
    { formNumber: '21-0960M-11', name: 'DBQ - Hip and Thigh Conditions', description: 'For hip conditions', url: 'https://www.va.gov/find-forms/' },
  ],
  'knee': [
    { formNumber: '21-0960M-9', name: 'DBQ - Knee and Lower Leg Conditions', description: 'For knee conditions', url: 'https://www.va.gov/find-forms/' },
  ],
  'ankle': [
    { formNumber: '21-0960M-2', name: 'DBQ - Ankle Conditions', description: 'For ankle injuries and conditions', url: 'https://www.va.gov/find-forms/' },
  ],
  'foot': [
    { formNumber: '21-0960M-6', name: 'DBQ - Foot Conditions Including Flatfoot (Pes Planus)', description: 'For foot conditions including flat feet', url: 'https://www.va.gov/find-forms/' },
  ],
  'arthritis': [
    { formNumber: '21-0960M-1', name: 'DBQ - Amputations', description: 'For amputation-related claims (if applicable)', url: 'https://www.va.gov/find-forms/' },
    { formNumber: '21-0960M-3', name: 'DBQ - Non-Degenerative Arthritis', description: 'For rheumatoid, gout, etc.', url: 'https://www.va.gov/find-forms/' },
  ],

  // Hearing & Ears
  'hearing': [
    { formNumber: '21-0960A-1', name: 'DBQ - Hearing Loss and Tinnitus', description: 'For hearing loss claims - requires audiogram', url: 'https://www.va.gov/find-forms/' },
  ],
  'tinnitus': [
    { formNumber: '21-0960A-1', name: 'DBQ - Hearing Loss and Tinnitus', description: 'For tinnitus claims', url: 'https://www.va.gov/find-forms/' },
  ],
  'ear': [
    { formNumber: '21-0960A-2', name: 'DBQ - Ear Conditions', description: 'For ear diseases other than hearing loss', url: 'https://www.va.gov/find-forms/' },
  ],

  // Eyes
  'eye': [
    { formNumber: '21-0960B-1', name: 'DBQ - Eye Conditions', description: 'For eye diseases and vision problems', url: 'https://www.va.gov/find-forms/' },
  ],

  // Respiratory
  'respiratory': [
    { formNumber: '21-0960G-5', name: 'DBQ - Respiratory Conditions', description: 'For asthma, COPD, bronchitis, etc.', url: 'https://www.va.gov/find-forms/' },
  ],
  'sleep_apnea': [
    { formNumber: '21-0960G-3', name: 'DBQ - Sleep Apnea', description: 'For sleep apnea - requires sleep study', url: 'https://www.va.gov/find-forms/' },
  ],
  'sinusitis': [
    { formNumber: '21-0960G-4', name: 'DBQ - Sinusitis, Rhinitis, and Other Conditions of the Nose', description: 'For sinus conditions', url: 'https://www.va.gov/find-forms/' },
  ],

  // Cardiovascular
  'heart': [
    { formNumber: '21-0960C-1', name: 'DBQ - Heart Conditions', description: 'For heart disease, arrhythmias, etc.', url: 'https://www.va.gov/find-forms/' },
  ],
  'hypertension': [
    { formNumber: '21-0960C-4', name: 'DBQ - Hypertension', description: 'For high blood pressure claims', url: 'https://www.va.gov/find-forms/' },
  ],
  'vascular': [
    { formNumber: '21-0960C-6', name: 'DBQ - Artery and Vein Conditions', description: 'For PAD, varicose veins, DVT, etc.', url: 'https://www.va.gov/find-forms/' },
  ],

  // Digestive
  'digestive': [
    { formNumber: '21-0960D-1', name: 'DBQ - Esophageal Conditions', description: 'For GERD, hiatal hernia, etc.', url: 'https://www.va.gov/find-forms/' },
    { formNumber: '21-0960D-2', name: 'DBQ - Stomach and Duodenal Conditions', description: 'For ulcers, gastritis, etc.', url: 'https://www.gov/find-forms/' },
    { formNumber: '21-0960D-3', name: 'DBQ - Intestinal Conditions', description: 'For IBS, Crohns, colitis, etc.', url: 'https://www.va.gov/find-forms/' },
  ],
  'gerd': [
    { formNumber: '21-0960D-1', name: 'DBQ - Esophageal Conditions', description: 'For GERD, hiatal hernia, etc.', url: 'https://www.va.gov/find-forms/' },
  ],
  'liver': [
    { formNumber: '21-0960D-4', name: 'DBQ - Hepatitis, Cirrhosis, and Other Liver Conditions', description: 'For liver conditions', url: 'https://www.va.gov/find-forms/' },
  ],
  'hernia': [
    { formNumber: '21-0960D-5', name: 'DBQ - Hernias', description: 'For inguinal, ventral, hiatal hernias', url: 'https://www.va.gov/find-forms/' },
  ],
  'hemorrhoids': [
    { formNumber: '21-0960D-6', name: 'DBQ - Rectum and Anus Conditions', description: 'For hemorrhoids, fissures, etc.', url: 'https://www.va.gov/find-forms/' },
  ],

  // Genitourinary
  'kidney': [
    { formNumber: '21-0960E-1', name: 'DBQ - Kidney Conditions', description: 'For kidney disease', url: 'https://www.va.gov/find-forms/' },
  ],
  'prostate': [
    { formNumber: '21-0960E-4', name: 'DBQ - Prostate Cancer', description: 'For prostate cancer claims', url: 'https://www.va.gov/find-forms/' },
    { formNumber: '21-0960E-3', name: 'DBQ - Male Reproductive System Conditions', description: 'For BPH, ED, etc.', url: 'https://www.va.gov/find-forms/' },
  ],
  'bladder': [
    { formNumber: '21-0960E-2', name: 'DBQ - Bladder and Urethra Conditions', description: 'For bladder conditions, incontinence', url: 'https://www.va.gov/find-forms/' },
  ],
  'gynecological': [
    { formNumber: '21-0960E-5', name: 'DBQ - Gynecological Conditions', description: 'For female reproductive conditions', url: 'https://www.va.gov/find-forms/' },
  ],

  // Neurological
  'headache': [
    { formNumber: '21-0960N-1', name: 'DBQ - Headaches (Including Migraine Headaches)', description: 'For migraine and headache claims', url: 'https://www.va.gov/find-forms/' },
  ],
  'migraine': [
    { formNumber: '21-0960N-1', name: 'DBQ - Headaches (Including Migraine Headaches)', description: 'For migraine claims - log is essential', url: 'https://www.va.gov/find-forms/' },
  ],
  'peripheral_nerve': [
    { formNumber: '21-0960N-2', name: 'DBQ - Peripheral Nerves Conditions', description: 'For neuropathy, radiculopathy, carpal tunnel', url: 'https://www.va.gov/find-forms/' },
  ],
  'tbi': [
    { formNumber: '21-0960N-3', name: 'DBQ - Traumatic Brain Injury (TBI)', description: 'For TBI claims', url: 'https://www.va.gov/find-forms/' },
    { formNumber: '21-0960N-4', name: 'DBQ - TBI Review Examination', description: 'For TBI re-evaluation', url: 'https://www.va.gov/find-forms/' },
  ],
  'seizures': [
    { formNumber: '21-0960N-5', name: 'DBQ - Seizure Disorders (Epilepsy)', description: 'For epilepsy and seizure claims', url: 'https://www.va.gov/find-forms/' },
  ],
  'parkinsons': [
    { formNumber: '21-0960N-6', name: 'DBQ - Parkinsons Disease', description: 'For Parkinsons claims', url: 'https://www.va.gov/find-forms/' },
  ],
  'als': [
    { formNumber: '21-0960N-7', name: 'DBQ - Amyotrophic Lateral Sclerosis (ALS)', description: 'For ALS claims (presumptive)', url: 'https://www.va.gov/find-forms/' },
  ],
  'ms': [
    { formNumber: '21-0960N-8', name: 'DBQ - Multiple Sclerosis (MS)', description: 'For MS claims', url: 'https://www.va.gov/find-forms/' },
  ],

  // Skin
  'skin': [
    { formNumber: '21-0960F-1', name: 'DBQ - Skin Diseases', description: 'For eczema, psoriasis, dermatitis, etc.', url: 'https://www.va.gov/find-forms/' },
  ],
  'scars': [
    { formNumber: '21-0960F-2', name: 'DBQ - Scars/Disfigurement', description: 'For scar-related claims', url: 'https://www.va.gov/find-forms/' },
  ],

  // Endocrine
  'diabetes': [
    { formNumber: '21-0960H-1', name: 'DBQ - Diabetes Mellitus', description: 'For Type 1 and Type 2 diabetes', url: 'https://www.va.gov/find-forms/' },
  ],
  'thyroid': [
    { formNumber: '21-0960H-2', name: 'DBQ - Thyroid and Parathyroid Conditions', description: 'For thyroid conditions', url: 'https://www.va.gov/find-forms/' },
  ],

  // Dental/Oral
  'dental': [
    { formNumber: '21-0960I-1', name: 'DBQ - Dental and Oral Conditions', description: 'For dental trauma, TMJ, etc.', url: 'https://www.va.gov/find-forms/' },
  ],
  'tmj': [
    { formNumber: '21-0960I-1', name: 'DBQ - Dental and Oral Conditions', description: 'For TMJ/jaw conditions', url: 'https://www.va.gov/find-forms/' },
  ],

  // Hematologic/Lymphatic
  'hematologic': [
    { formNumber: '21-0960J-1', name: 'DBQ - Hematologic and Lymphatic Conditions', description: 'For blood disorders, anemia, etc.', url: 'https://www.va.gov/find-forms/' },
  ],

  // Infectious Disease
  'infectious': [
    { formNumber: '21-0960K-1', name: 'DBQ - Infectious Diseases', description: 'For chronic infections', url: 'https://www.va.gov/find-forms/' },
  ],
  'gulf_war': [
    { formNumber: '21-0960K-2', name: 'DBQ - Gulf War General Medical Examination', description: 'For Gulf War undiagnosed illness', url: 'https://www.va.gov/find-forms/' },
  ],

  // Fibromyalgia / Chronic Fatigue
  'fibromyalgia': [
    { formNumber: '21-0960L-1', name: 'DBQ - Fibromyalgia', description: 'For fibromyalgia claims', url: 'https://www.va.gov/find-forms/' },
  ],
  'chronic_fatigue': [
    { formNumber: '21-0960L-2', name: 'DBQ - Chronic Fatigue Syndrome', description: 'For CFS claims', url: 'https://www.va.gov/find-forms/' },
  ],
};

// Universal forms everyone should submit
export const universalForms: VAForm[] = [
  { formNumber: '21-526EZ', name: 'Application for Disability Compensation', description: 'Main claim application - required for all claims', url: 'https://www.va.gov/find-forms/about-form-21-526ez/' },
  { formNumber: '21-4138', name: 'Statement in Support of Claim', description: 'Personal statement describing your condition and service connection', url: 'https://www.va.gov/find-forms/about-form-21-4138/' },
  { formNumber: '21-4142', name: 'Authorization to Disclose Information', description: 'Allows VA to obtain your private medical records', url: 'https://www.va.gov/find-forms/about-form-21-4142/' },
  { formNumber: '21-4142a', name: 'General Release for Medical Provider Information', description: 'General medical records release', url: 'https://www.va.gov/find-forms/about-form-21-4142a/' },
];

// Intent to file
export const intentToFileForms: VAForm[] = [
  { formNumber: '21-0966', name: 'Intent to File a Claim for Compensation', description: 'Locks in your effective date - gives you 1 year to submit full claim', url: 'https://www.va.gov/find-forms/about-form-21-0966/' },
];

// Evidence support forms
export const evidenceForms: VAForm[] = [
  { formNumber: '21-10210', name: 'Lay/Witness Statement', description: 'Buddy statement template for witnesses', url: 'https://www.va.gov/find-forms/about-form-21-10210/' },
];

// Function to get required forms for a condition
export function getRequiredFormsForCondition(conditionName: string, diagnosticCode?: string): VAForm[] {
  const name = conditionName.toLowerCase();
  const forms: VAForm[] = [];
  
  // Check for specific condition matches
  if (name.includes('ptsd') || name.includes('post-traumatic') || name.includes('posttraumatic')) {
    forms.push(...(dbqForms['ptsd'] || []));
  } else if (name.includes('anxiety') || name.includes('panic')) {
    forms.push(...(dbqForms['anxiety'] || []));
  } else if (name.includes('depression') || name.includes('major depressive') || name.includes('mood')) {
    forms.push(...(dbqForms['depression'] || []));
  } else if (name.includes('bipolar') || name.includes('schizo') || name.includes('mental')) {
    forms.push(...(dbqForms['mental_health'] || []));
  }
  
  // Spine conditions
  if (name.includes('lumbar') || name.includes('lower back') || name.includes('lumbosacral') || name.includes('thoracolumbar')) {
    forms.push(...(dbqForms['lumbar'] || []));
  } else if (name.includes('cervical') || name.includes('neck')) {
    forms.push(...(dbqForms['cervical'] || []));
  } else if (name.includes('spine') || name.includes('back') || name.includes('disc') || name.includes('spondyl')) {
    forms.push(...(dbqForms['spine'] || []));
  }
  
  // Joint conditions
  if (name.includes('shoulder') || name.includes('rotator')) {
    forms.push(...(dbqForms['shoulder'] || []));
  }
  if (name.includes('elbow') || name.includes('epicondyl') || name.includes('cubital')) {
    forms.push(...(dbqForms['elbow'] || []));
  }
  if (name.includes('wrist') || name.includes('carpal tunnel')) {
    forms.push(...(dbqForms['wrist'] || []));
  }
  if (name.includes('hand') || name.includes('finger') || name.includes('thumb') || name.includes('trigger')) {
    forms.push(...(dbqForms['hand'] || []));
  }
  if (name.includes('hip') || name.includes('thigh')) {
    forms.push(...(dbqForms['hip'] || []));
  }
  if (name.includes('knee') || name.includes('patell')) {
    forms.push(...(dbqForms['knee'] || []));
  }
  if (name.includes('ankle')) {
    forms.push(...(dbqForms['ankle'] || []));
  }
  if (name.includes('foot') || name.includes('plantar') || name.includes('flat') || name.includes('pes planus')) {
    forms.push(...(dbqForms['foot'] || []));
  }
  
  // Arthritis
  if (name.includes('arthritis') || name.includes('osteoarthritis') || name.includes('rheumatoid') || name.includes('gout')) {
    forms.push(...(dbqForms['arthritis'] || []));
  }
  
  // Hearing
  if (name.includes('hearing') || name.includes('deaf')) {
    forms.push(...(dbqForms['hearing'] || []));
  }
  if (name.includes('tinnitus') || name.includes('ringing')) {
    forms.push(...(dbqForms['tinnitus'] || []));
  }
  if (name.includes('ear') || name.includes('vertigo') || name.includes('meniere')) {
    forms.push(...(dbqForms['ear'] || []));
  }
  
  // Eyes
  if (name.includes('eye') || name.includes('vision') || name.includes('blind') || name.includes('glaucoma') || name.includes('cataract') || name.includes('macular')) {
    forms.push(...(dbqForms['eye'] || []));
  }
  
  // Respiratory
  if (name.includes('sleep apnea') || name.includes('cpap')) {
    forms.push(...(dbqForms['sleep_apnea'] || []));
  } else if (name.includes('sinus') || name.includes('rhinitis')) {
    forms.push(...(dbqForms['sinusitis'] || []));
  } else if (name.includes('asthma') || name.includes('copd') || name.includes('bronch') || name.includes('lung') || name.includes('pulmonary') || name.includes('respiratory')) {
    forms.push(...(dbqForms['respiratory'] || []));
  }
  
  // Cardiovascular
  if (name.includes('hypertension') || name.includes('high blood pressure')) {
    forms.push(...(dbqForms['hypertension'] || []));
  } else if (name.includes('heart') || name.includes('cardiac') || name.includes('coronary') || name.includes('arrhythmia') || name.includes('afib')) {
    forms.push(...(dbqForms['heart'] || []));
  } else if (name.includes('vein') || name.includes('artery') || name.includes('varicose') || name.includes('dvt') || name.includes('peripheral arterial')) {
    forms.push(...(dbqForms['vascular'] || []));
  }
  
  // Digestive
  if (name.includes('gerd') || name.includes('reflux') || name.includes('hiatal') || name.includes('esophag')) {
    forms.push(...(dbqForms['gerd'] || []));
  } else if (name.includes('liver') || name.includes('hepat') || name.includes('cirrhosis')) {
    forms.push(...(dbqForms['liver'] || []));
  } else if (name.includes('hernia')) {
    forms.push(...(dbqForms['hernia'] || []));
  } else if (name.includes('hemorrhoid') || name.includes('rectal') || name.includes('anal')) {
    forms.push(...(dbqForms['hemorrhoids'] || []));
  } else if (name.includes('ibs') || name.includes('crohn') || name.includes('colitis') || name.includes('bowel') || name.includes('intestin') || name.includes('stomach') || name.includes('gastri') || name.includes('ulcer')) {
    forms.push(...(dbqForms['digestive'] || []));
  }
  
  // Genitourinary
  if (name.includes('kidney') || name.includes('renal')) {
    forms.push(...(dbqForms['kidney'] || []));
  }
  if (name.includes('prostate') || name.includes('erectile')) {
    forms.push(...(dbqForms['prostate'] || []));
  }
  if (name.includes('bladder') || name.includes('incontinence') || name.includes('urinary')) {
    forms.push(...(dbqForms['bladder'] || []));
  }
  if (name.includes('gynecolog') || name.includes('endometri') || name.includes('ovarian') || name.includes('uterine')) {
    forms.push(...(dbqForms['gynecological'] || []));
  }
  
  // Neurological
  if (name.includes('migraine') || name.includes('headache')) {
    forms.push(...(dbqForms['migraine'] || []));
  }
  if (name.includes('neuropathy') || name.includes('radiculopathy') || name.includes('nerve') || name.includes('sciatica')) {
    forms.push(...(dbqForms['peripheral_nerve'] || []));
  }
  if (name.includes('tbi') || name.includes('traumatic brain') || name.includes('concussion')) {
    forms.push(...(dbqForms['tbi'] || []));
  }
  if (name.includes('seizure') || name.includes('epilepsy')) {
    forms.push(...(dbqForms['seizures'] || []));
  }
  if (name.includes('parkinson')) {
    forms.push(...(dbqForms['parkinsons'] || []));
  }
  if (name.includes('als') || name.includes('amyotrophic')) {
    forms.push(...(dbqForms['als'] || []));
  }
  if (name.includes('multiple sclerosis') || name.includes(' ms ') || name.endsWith(' ms')) {
    forms.push(...(dbqForms['ms'] || []));
  }
  
  // Skin
  if (name.includes('scar') || name.includes('disfigur')) {
    forms.push(...(dbqForms['scars'] || []));
  } else if (name.includes('skin') || name.includes('dermat') || name.includes('eczema') || name.includes('psoriasis') || name.includes('acne') || name.includes('rash')) {
    forms.push(...(dbqForms['skin'] || []));
  }
  
  // Endocrine
  if (name.includes('diabetes') || name.includes('diabetic')) {
    forms.push(...(dbqForms['diabetes'] || []));
  }
  if (name.includes('thyroid') || name.includes('hypothyroid') || name.includes('hyperthyroid') || name.includes('hashimoto') || name.includes('graves')) {
    forms.push(...(dbqForms['thyroid'] || []));
  }
  
  // Dental
  if (name.includes('dental') || name.includes('tooth') || name.includes('tmj') || name.includes('jaw')) {
    forms.push(...(dbqForms['dental'] || []));
  }
  
  // Fibromyalgia / CFS
  if (name.includes('fibromyalgia')) {
    forms.push(...(dbqForms['fibromyalgia'] || []));
  }
  if (name.includes('chronic fatigue') || name.includes('cfs')) {
    forms.push(...(dbqForms['chronic_fatigue'] || []));
  }
  
  // Gulf War
  if (name.includes('gulf war') || name.includes('undiagnosed illness')) {
    forms.push(...(dbqForms['gulf_war'] || []));
  }
  
  // Remove duplicates
  const uniqueForms = forms.filter((form, index, self) => 
    index === self.findIndex(f => f.formNumber === form.formNumber)
  );
  
  return uniqueForms;
}
