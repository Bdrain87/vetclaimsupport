// Related conditions that follow VA anti-pyramiding rules (38 CFR 4.14)
// Only suggests conditions with DIFFERENT symptoms, not overlapping ones
// Example: PTSD -> Sleep Apnea (physical symptom), NOT PTSD -> Depression (same mental health symptoms)

export interface AntiPyramidingRelation {
  primaryCondition: string;
  relatedConditions: {
    name: string;
    reason: string;
    category: string;
  }[];
}

// Matching uses lowercase includes() - add common variations
export const antiPyramidingConditions: AntiPyramidingRelation[] = [
  // Mental Health -> Physical
  {
    primaryCondition: 'ptsd',
    relatedConditions: [
      { name: 'Sleep Apnea', reason: 'Stress hormones affect breathing patterns during sleep', category: 'Respiratory' },
      { name: 'GERD', reason: 'Chronic stress increases stomach acid production', category: 'Digestive' },
      { name: 'Migraines', reason: 'Muscle tension and stress hormones trigger headaches', category: 'Neurological' },
      { name: 'Hypertension', reason: 'Chronic stress elevates blood pressure long-term', category: 'Cardiovascular' },
      { name: 'Tinnitus', reason: 'Stress and anxiety can worsen or cause ringing in ears', category: 'Hearing' },
    ],
  },
  {
    primaryCondition: 'anxiety',
    relatedConditions: [
      { name: 'IBS', reason: 'Gut-brain axis dysfunction from chronic anxiety', category: 'Digestive' },
      { name: 'Tension Headaches', reason: 'Chronic muscle tension causes headaches', category: 'Neurological' },
      { name: 'TMJ Disorder', reason: 'Jaw clenching from stress damages joint', category: 'Dental' },
      { name: 'Hypertension', reason: 'Sustained anxiety elevates blood pressure', category: 'Cardiovascular' },
    ],
  },
  {
    primaryCondition: 'depression',
    relatedConditions: [
      { name: 'Sleep Apnea', reason: 'Weight changes and inactivity affect breathing', category: 'Respiratory' },
      { name: 'Chronic Fatigue', reason: 'Physical exhaustion from mental health condition', category: 'Systemic' },
      { name: 'Obesity', reason: 'Reduced activity and medication side effects', category: 'Endocrine' },
    ],
  },

  // Spine/Back -> Neurological
  {
    primaryCondition: 'back',
    relatedConditions: [
      { name: 'Radiculopathy', reason: 'Nerve root compression causes radiating pain/numbness', category: 'Neurological' },
      { name: 'Sciatica', reason: 'Disc herniation compresses sciatic nerve', category: 'Neurological' },
      { name: 'Erectile Dysfunction', reason: 'Lumbar nerve damage affects sexual function', category: 'Genitourinary' },
      { name: 'Bladder Dysfunction', reason: 'Spinal nerve compression affects bladder control', category: 'Genitourinary' },
    ],
  },
  {
    primaryCondition: 'lumbar',
    relatedConditions: [
      { name: 'Radiculopathy', reason: 'Nerve root compression from spinal degeneration', category: 'Neurological' },
      { name: 'Sciatica', reason: 'Lower spine issues compress sciatic nerve', category: 'Neurological' },
      { name: 'Neurogenic Bladder', reason: 'Nerve damage affects bladder control', category: 'Genitourinary' },
    ],
  },
  {
    primaryCondition: 'cervical',
    relatedConditions: [
      { name: 'Upper Extremity Radiculopathy', reason: 'Neck nerve compression causes arm symptoms', category: 'Neurological' },
      { name: 'Migraines', reason: 'Cervical issues trigger cervicogenic headaches', category: 'Neurological' },
      { name: 'Vertigo', reason: 'Cervical proprioception issues affect balance', category: 'Vestibular' },
    ],
  },
  {
    primaryCondition: 'neck',
    relatedConditions: [
      { name: 'Radiculopathy', reason: 'Cervical nerve compression radiates to arms', category: 'Neurological' },
      { name: 'Tension Headaches', reason: 'Neck muscle strain triggers headaches', category: 'Neurological' },
      { name: 'Thoracic Outlet Syndrome', reason: 'Neck issues compress nerves/vessels to arms', category: 'Neurological' },
    ],
  },

  // Hearing
  {
    primaryCondition: 'tinnitus',
    relatedConditions: [
      { name: 'Hearing Loss', reason: 'Same noise exposure damages hearing', category: 'Hearing' },
      { name: 'Migraines', reason: 'Tinnitus can trigger or worsen migraines', category: 'Neurological' },
      { name: 'TMJ Disorder', reason: 'Jaw joint dysfunction can cause/worsen tinnitus', category: 'Dental' },
    ],
  },
  {
    primaryCondition: 'hearing loss',
    relatedConditions: [
      { name: 'Tinnitus', reason: 'Common co-occurring condition from noise damage', category: 'Hearing' },
      { name: 'Vertigo', reason: 'Inner ear damage affects balance', category: 'Vestibular' },
      { name: 'Social Anxiety', reason: 'Communication difficulties cause isolation', category: 'Mental Health' },
    ],
  },

  // Sleep
  {
    primaryCondition: 'sleep apnea',
    relatedConditions: [
      { name: 'Hypertension', reason: 'Oxygen deprivation strains cardiovascular system', category: 'Cardiovascular' },
      { name: 'GERD', reason: 'Negative pressure from apnea events causes reflux', category: 'Digestive' },
      { name: 'Chronic Fatigue', reason: 'Poor sleep quality causes daytime exhaustion', category: 'Systemic' },
      { name: 'Atrial Fibrillation', reason: 'Oxygen desaturation affects heart rhythm', category: 'Cardiovascular' },
    ],
  },
  {
    primaryCondition: 'insomnia',
    relatedConditions: [
      { name: 'Chronic Fatigue', reason: 'Sleep deprivation causes persistent exhaustion', category: 'Systemic' },
      { name: 'Migraines', reason: 'Poor sleep is a major migraine trigger', category: 'Neurological' },
      { name: 'Hypertension', reason: 'Sleep deprivation elevates blood pressure', category: 'Cardiovascular' },
    ],
  },

  // Migraines
  {
    primaryCondition: 'migraine',
    relatedConditions: [
      { name: 'TMJ Disorder', reason: 'Jaw tension triggers or worsens migraines', category: 'Dental' },
      { name: 'Vertigo', reason: 'Vestibular migraines cause balance issues', category: 'Vestibular' },
      { name: 'Cervical Strain', reason: 'Neck tension from migraine posturing', category: 'Musculoskeletal' },
    ],
  },

  // TBI
  {
    primaryCondition: 'tbi',
    relatedConditions: [
      { name: 'Migraines', reason: 'Brain injury commonly triggers chronic headaches', category: 'Neurological' },
      { name: 'Tinnitus', reason: 'Auditory pathway damage from head trauma', category: 'Hearing' },
      { name: 'Vertigo', reason: 'Vestibular system damage affects balance', category: 'Vestibular' },
      { name: 'Sleep Apnea', reason: 'Brainstem changes affect breathing control', category: 'Respiratory' },
    ],
  },
  {
    primaryCondition: 'traumatic brain',
    relatedConditions: [
      { name: 'Post-Traumatic Headaches', reason: 'Direct result of brain injury', category: 'Neurological' },
      { name: 'Hearing Loss', reason: 'Temporal bone or auditory cortex damage', category: 'Hearing' },
      { name: 'Pituitary Dysfunction', reason: 'TBI frequently damages pituitary gland', category: 'Endocrine' },
    ],
  },

  // Knee
  {
    primaryCondition: 'knee',
    relatedConditions: [
      { name: 'Hip Condition', reason: 'Altered gait strains hip joint', category: 'Musculoskeletal' },
      { name: 'Lower Back Pain', reason: 'Compensating for knee causes spine stress', category: 'Musculoskeletal' },
      { name: 'Opposite Knee Condition', reason: 'Favoring one knee strains the other', category: 'Musculoskeletal' },
    ],
  },

  // Hip
  {
    primaryCondition: 'hip',
    relatedConditions: [
      { name: 'Lower Back Pain', reason: 'Hip dysfunction affects spinal alignment', category: 'Musculoskeletal' },
      { name: 'Knee Condition', reason: 'Altered gait strains knee joints', category: 'Musculoskeletal' },
      { name: 'Sciatica', reason: 'Hip tightness can compress sciatic nerve', category: 'Neurological' },
    ],
  },

  // Shoulder
  {
    primaryCondition: 'shoulder',
    relatedConditions: [
      { name: 'Cervical Strain', reason: 'Shoulder problems strain neck compensating', category: 'Musculoskeletal' },
      { name: 'Thoracic Outlet Syndrome', reason: 'Shoulder issues compress nerve bundle', category: 'Neurological' },
      { name: 'Upper Back Pain', reason: 'Compensatory posture strains thoracic spine', category: 'Musculoskeletal' },
    ],
  },

  // Diabetes
  {
    primaryCondition: 'diabetes',
    relatedConditions: [
      { name: 'Peripheral Neuropathy', reason: 'High blood sugar damages nerves', category: 'Neurological' },
      { name: 'Erectile Dysfunction', reason: 'Nerve and blood vessel damage', category: 'Genitourinary' },
      { name: 'Diabetic Retinopathy', reason: 'Microvascular damage to eyes', category: 'Eyes' },
      { name: 'Hypertension', reason: 'Insulin resistance affects blood pressure', category: 'Cardiovascular' },
    ],
  },

  // Respiratory/Burn Pit
  {
    primaryCondition: 'sinusitis',
    relatedConditions: [
      { name: 'Sleep Apnea', reason: 'Nasal obstruction affects breathing', category: 'Respiratory' },
      { name: 'Migraines', reason: 'Sinus pressure triggers headaches', category: 'Neurological' },
      { name: 'Asthma', reason: 'Upper and lower airway connection', category: 'Respiratory' },
    ],
  },
  {
    primaryCondition: 'asthma',
    relatedConditions: [
      { name: 'GERD', reason: 'Acid reflux triggers asthma symptoms', category: 'Digestive' },
      { name: 'Sinusitis', reason: 'Connected respiratory inflammation', category: 'Respiratory' },
      { name: 'Sleep Apnea', reason: 'Airway inflammation affects sleep breathing', category: 'Respiratory' },
    ],
  },

  // Burn pit / toxic exposure
  {
    primaryCondition: 'burn pit',
    relatedConditions: [
      { name: 'Chronic Sinusitis', reason: 'Toxic inhalation damages sinuses', category: 'Respiratory' },
      { name: 'Asthma', reason: 'Airway damage from toxic exposure', category: 'Respiratory' },
      { name: 'GERD', reason: 'Toxic exposure affects GI tract', category: 'Digestive' },
    ],
  },
];

/**
 * Get anti-pyramiding compliant related conditions for a given condition name
 * Returns conditions with DIFFERENT symptoms to avoid 38 CFR 4.14 issues
 */
export function getRelatedConditions(conditionName: string, maxResults: number = 3) {
  const lowerName = conditionName.toLowerCase();
  
  // Find matching relations
  for (const relation of antiPyramidingConditions) {
    if (lowerName.includes(relation.primaryCondition) || relation.primaryCondition.includes(lowerName)) {
      return relation.relatedConditions.slice(0, maxResults);
    }
  }
  
  // Check for partial matches
  for (const relation of antiPyramidingConditions) {
    const words = lowerName.split(' ');
    for (const word of words) {
      if (word.length > 3 && relation.primaryCondition.includes(word)) {
        return relation.relatedConditions.slice(0, maxResults);
      }
    }
  }
  
  return [];
}
