// DBQ Rating Criteria Database
// Based on 38 CFR Part 4 - Schedule for Rating Disabilities

export interface RatingLevel {
  percentage: number;
  criteria: string;
  keyEvidence: string[];
}

export interface DBQCondition {
  name: string;
  diagnosticCode: string;
  description: string;
  ratings: RatingLevel[];
  examTips: string[];
  secondaryConditions: string[];
}

export const dbqConditions: Record<string, DBQCondition> = {
  'tinnitus': {
    name: 'Tinnitus',
    diagnosticCode: '6260',
    description: 'Ringing, buzzing, or other sounds in the ears',
    ratings: [
      {
        percentage: 10,
        criteria: 'Recurrent tinnitus (maximum schedular rating)',
        keyEvidence: ['Diagnosis of tinnitus', 'Statement of recurrent symptoms', 'Noise exposure history'],
      },
    ],
    examTips: [
      'Tinnitus is a "presumptive" condition for combat veterans',
      'No audiometric testing required - it\'s based on your report',
      'Describe if constant or recurrent, and which ear(s)',
    ],
    secondaryConditions: ['Hearing loss', 'Anxiety', 'Sleep disturbance', 'Depression'],
  },

  'lumbar spine': {
    name: 'Lumbosacral Strain / Degenerative Disc Disease',
    diagnosticCode: '5237/5242',
    description: 'Lower back conditions including strain, DDD, and IVDS',
    ratings: [
      {
        percentage: 10,
        criteria: 'Forward flexion greater than 60° but not greater than 85°; OR combined ROM greater than 120° but not greater than 235°; OR muscle spasm/guarding not resulting in abnormal gait',
        keyEvidence: ['Range of motion measurements', 'X-ray or MRI findings', 'Pain on movement documentation'],
      },
      {
        percentage: 20,
        criteria: 'Forward flexion greater than 30° but not greater than 60°; OR combined ROM not greater than 120°; OR muscle spasm/guarding severe enough to result in abnormal gait or abnormal spinal contour',
        keyEvidence: ['Limited ROM documentation', 'Abnormal gait observation', 'Muscle spasm records'],
      },
      {
        percentage: 40,
        criteria: 'Forward flexion 30° or less; OR favorable ankylosis of entire thoracolumbar spine',
        keyEvidence: ['Severely limited flexion', 'Ankylosis diagnosis', 'Functional impairment documentation'],
      },
      {
        percentage: 50,
        criteria: 'Unfavorable ankylosis of entire thoracolumbar spine',
        keyEvidence: ['Complete fusion documentation', 'Fixed posture observations'],
      },
      {
        percentage: 100,
        criteria: 'Unfavorable ankylosis of entire spine',
        keyEvidence: ['Total spine fusion', 'Complete immobility of spine'],
      },
    ],
    examTips: [
      'Don\'t stretch or warm up before the exam',
      'Stop movement when pain begins, don\'t push through',
      'Mention flare-ups and how they affect ROM',
      'Describe radiculopathy (leg pain/numbness) if present',
    ],
    secondaryConditions: ['Radiculopathy', 'Sciatica', 'Erectile dysfunction', 'Bladder dysfunction', 'Depression'],
  },

  'migraine': {
    name: 'Migraine Headaches',
    diagnosticCode: '8100',
    description: 'Chronic migraine headaches',
    ratings: [
      {
        percentage: 0,
        criteria: 'Less frequent attacks',
        keyEvidence: ['Occasional headaches', 'No prostrating episodes'],
      },
      {
        percentage: 10,
        criteria: 'Characteristic prostrating attacks averaging one in 2 months over last several months',
        keyEvidence: ['6+ prostrating attacks per year', 'Duration and severity logs'],
      },
      {
        percentage: 30,
        criteria: 'Characteristic prostrating attacks occurring on average once a month over last several months',
        keyEvidence: ['12+ prostrating attacks per year', 'Monthly migraine documentation'],
      },
      {
        percentage: 50,
        criteria: 'Very frequent completely prostrating and prolonged attacks productive of severe economic inadaptability',
        keyEvidence: ['Multiple prostrating attacks per month', 'Missed work documentation', 'Economic impact evidence'],
      },
    ],
    examTips: [
      '"Prostrating" means you MUST lie down and cannot function',
      'Keep a detailed migraine log with dates, duration, severity',
      'Document missed work or reduced productivity',
      'List all triggers, symptoms (aura, nausea, sensitivity)',
    ],
    secondaryConditions: ['Anxiety', 'Depression', 'Insomnia', 'GERD (from medications)'],
  },

  'ptsd': {
    name: 'Post-Traumatic Stress Disorder',
    diagnosticCode: '9411',
    description: 'Trauma-related mental health condition',
    ratings: [
      {
        percentage: 0,
        criteria: 'Diagnosis confirmed but symptoms not severe enough to interfere with occupational and social functioning or require continuous medication',
        keyEvidence: ['PTSD diagnosis', 'Minimal symptoms'],
      },
      {
        percentage: 10,
        criteria: 'Occupational and social impairment due to mild or transient symptoms which decrease work efficiency only during periods of significant stress',
        keyEvidence: ['Mild symptoms', 'Controlled with medication'],
      },
      {
        percentage: 30,
        criteria: 'Occupational and social impairment with occasional decrease in work efficiency due to symptoms such as depressed mood, anxiety, suspiciousness, chronic sleep impairment, mild memory loss',
        keyEvidence: ['Sleep problems', 'Anxiety', 'Mood changes', 'Mild memory issues'],
      },
      {
        percentage: 50,
        criteria: 'Occupational and social impairment with reduced reliability and productivity due to symptoms such as flattened affect, circumstantial speech, panic attacks, difficulty understanding complex commands, impaired judgment, disturbances of motivation and mood, difficulty in establishing relationships',
        keyEvidence: ['Panic attacks', 'Relationship difficulties', 'Work problems', 'Mood disturbances'],
      },
      {
        percentage: 70,
        criteria: 'Occupational and social impairment with deficiencies in most areas such as work, school, family relations, judgment, thinking, or mood',
        keyEvidence: ['Suicidal ideation', 'Obsessional rituals', 'Impaired impulse control', 'Neglect of hygiene', 'Difficulty adapting'],
      },
      {
        percentage: 100,
        criteria: 'Total occupational and social impairment due to symptoms such as gross impairment in thought or communication, persistent danger to self or others, inability to perform ADLs, disorientation, memory loss for close relatives or own name',
        keyEvidence: ['Cannot work', 'Cannot maintain relationships', 'Danger to self/others', 'Severe disorientation'],
      },
    ],
    examTips: [
      'Be honest about your worst days, not just average days',
      'Describe specific examples of how PTSD affects work/relationships',
      'Mention nightmares, flashbacks, avoidance behaviors',
      'Discuss any suicidal thoughts (past or present) honestly',
    ],
    secondaryConditions: ['Depression', 'Anxiety', 'Sleep apnea', 'Substance abuse', 'Hypertension', 'GERD'],
  },

  'sleep apnea': {
    name: 'Sleep Apnea',
    diagnosticCode: '6847',
    description: 'Obstructive sleep apnea syndrome',
    ratings: [
      {
        percentage: 0,
        criteria: 'Asymptomatic but with documented sleep disorder breathing',
        keyEvidence: ['Sleep study showing mild apnea', 'No treatment required'],
      },
      {
        percentage: 30,
        criteria: 'Persistent day-time hypersomnolence',
        keyEvidence: ['Daytime sleepiness', 'No CPAP required'],
      },
      {
        percentage: 50,
        criteria: 'Requires use of breathing assistance device such as CPAP',
        keyEvidence: ['CPAP prescription', 'CPAP compliance records', 'Sleep study'],
      },
      {
        percentage: 100,
        criteria: 'Chronic respiratory failure with carbon dioxide retention or cor pulmonale, or requires tracheostomy',
        keyEvidence: ['Respiratory failure diagnosis', 'Tracheostomy'],
      },
    ],
    examTips: [
      'CPAP use = automatic 50% rating',
      'Bring your sleep study results',
      'Describe daytime fatigue and how it affects function',
      'Mention if your spouse witnesses apnea episodes',
    ],
    secondaryConditions: ['Hypertension', 'Heart disease', 'Diabetes', 'Depression', 'Erectile dysfunction'],
  },

  'knee': {
    name: 'Knee Conditions',
    diagnosticCode: '5260/5261',
    description: 'Knee limitation of motion, instability, or arthritis',
    ratings: [
      {
        percentage: 0,
        criteria: 'Flexion limited to 60° or more; Extension limited to 5° or less',
        keyEvidence: ['Near-normal range of motion'],
      },
      {
        percentage: 10,
        criteria: 'Flexion limited to 45°; Extension limited to 10°; OR slight recurrent subluxation/instability',
        keyEvidence: ['Limited flexion/extension', 'Mild instability', 'Pain on movement'],
      },
      {
        percentage: 20,
        criteria: 'Flexion limited to 30°; Extension limited to 15°; OR moderate recurrent subluxation/instability',
        keyEvidence: ['Moderate ROM limitation', 'Use of knee brace', 'Giving way episodes'],
      },
      {
        percentage: 30,
        criteria: 'Flexion limited to 15°; Extension limited to 20°; OR severe recurrent subluxation/instability',
        keyEvidence: ['Severe ROM limitation', 'Frequent instability', 'Falls'],
      },
    ],
    examTips: [
      'You can get separate ratings for limitation AND instability',
      'Demonstrate actual limitation - don\'t force through pain',
      'Mention any locking, clicking, or giving way',
      'Bring your brace if you use one',
    ],
    secondaryConditions: ['Hip pain (altered gait)', 'Back pain (compensation)', 'Depression', 'Obesity'],
  },

  'hearing loss': {
    name: 'Hearing Loss',
    diagnosticCode: '6100',
    description: 'Bilateral sensorineural hearing loss',
    ratings: [
      {
        percentage: 0,
        criteria: 'Level I hearing in both ears',
        keyEvidence: ['Audiogram showing mild loss'],
      },
      {
        percentage: 10,
        criteria: 'Various combinations of hearing levels (see 38 CFR 4.85 Table VII)',
        keyEvidence: ['Audiogram results', 'Speech discrimination scores'],
      },
    ],
    examTips: [
      'Rating is based on audiogram numbers, not subjective complaints',
      'Don\'t wear hearing aids to the exam',
      'Describe situations where you struggle to hear',
      'Maryland CNC word test is used for speech discrimination',
    ],
    secondaryConditions: ['Tinnitus', 'Vertigo/balance issues', 'Social isolation', 'Depression'],
  },
};

// Get condition by name (fuzzy match)
export function getDBQCondition(conditionName: string): DBQCondition | null {
  const name = conditionName.toLowerCase();
  
  if (name.includes('tinnitus') || name.includes('ringing')) {
    return dbqConditions['tinnitus'];
  }
  if (name.includes('back') || name.includes('lumbar') || name.includes('spine') || name.includes('disc')) {
    return dbqConditions['lumbar spine'];
  }
  if (name.includes('migraine') || name.includes('headache')) {
    return dbqConditions['migraine'];
  }
  if (name.includes('ptsd') || name.includes('trauma') || name.includes('anxiety') || name.includes('depression')) {
    return dbqConditions['ptsd'];
  }
  if (name.includes('sleep') || name.includes('apnea') || name.includes('cpap')) {
    return dbqConditions['sleep apnea'];
  }
  if (name.includes('knee')) {
    return dbqConditions['knee'];
  }
  if (name.includes('hearing')) {
    return dbqConditions['hearing loss'];
  }
  
  return null;
}
