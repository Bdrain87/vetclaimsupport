// DBQ Quick Reference Data
// Source: VA Public DBQ Forms - va.gov

export interface DBQQuestion {
  question: string;
  whyItMatters: string;
  tips?: string[];
}

export interface DBQReference {
  id: string;
  formNumber: string;
  name: string;
  conditionsCovered: string[];
  diagnosticCodes: string[];
  keyQuestions: DBQQuestion[];
  whatDeterminesRating: string[];
  commonMistakes: string[];
  prepTips: string[];
}

export const dbqQuickReference: DBQReference[] = [
  // PTSD DBQ
  {
    id: 'ptsd',
    formNumber: '21-0960P-3',
    name: 'Review Post Traumatic Stress Disorder (PTSD)',
    conditionsCovered: ['PTSD', 'Other trauma/stressor-related disorders'],
    diagnosticCodes: ['9411'],
    keyQuestions: [
      {
        question: 'Does the Veteran have a diagnosis of PTSD that conforms to DSM-5 criteria?',
        whyItMatters: 'Confirms your diagnosis meets VA requirements',
        tips: ['Ensure your diagnosis is properly documented'],
      },
      {
        question: 'Which criteria are met for PTSD diagnosis?',
        whyItMatters: 'Documents specific traumatic events and symptoms',
        tips: ['Be specific about your stressor events', 'Describe all symptom categories'],
      },
      {
        question: 'What level of occupational and social impairment is present?',
        whyItMatters: 'This directly determines your rating percentage',
        tips: ['Describe your WORST functioning, not your best days'],
      },
      {
        question: 'What symptoms are present?',
        whyItMatters: 'Each symptom affects your rating level',
        tips: [
          'Report ALL symptoms even if embarrassing',
          'Include frequency and severity',
          'Mention suicidal ideation if present',
        ],
      },
    ],
    whatDeterminesRating: [
      'Level of occupational and social impairment',
      'Frequency and severity of symptoms',
      'Impact on ability to work',
      'Impact on relationships and social functioning',
      'Whether symptoms require continuous medication',
    ],
    commonMistakes: [
      'Minimizing symptoms to appear "strong"',
      'Describing average days instead of worst days',
      'Not mentioning suicidal thoughts (past or present)',
      'Forgetting to mention nightmares and sleep problems',
      'Not bringing treatment records',
    ],
    prepTips: [
      'Review your stressor statement before the exam',
      'List all symptoms with frequency',
      'Bring treatment records and medication list',
      'Describe your worst days in detail',
      'Have examples ready of how PTSD affects work/relationships',
    ],
  },

  // Back/Spine DBQ
  {
    id: 'back-spine',
    formNumber: '21-0960M-14',
    name: 'Back (Thoracolumbar Spine) Conditions',
    conditionsCovered: [
      'Lumbar strain',
      'Degenerative disc disease',
      'Herniated disc',
      'Spinal stenosis',
      'Spondylolisthesis',
      'Intervertebral disc syndrome (IVDS)',
    ],
    diagnosticCodes: ['5235-5243'],
    keyQuestions: [
      {
        question: 'What is the range of motion (ROM) of the thoracolumbar spine?',
        whyItMatters: 'ROM measurements directly determine rating level',
        tips: [
          'Do NOT push through pain',
          'Stop at the point pain begins',
          'Report where objective evidence of pain begins',
        ],
      },
      {
        question: 'Is there additional functional loss after repetitive use?',
        whyItMatters: 'Can result in higher rating',
        tips: ['Mention if movement gets harder with repetition'],
      },
      {
        question: 'Are there flare-ups that affect function?',
        whyItMatters: 'Flare-ups can warrant higher rating',
        tips: [
          'Describe frequency, duration, and severity',
          'Explain what triggers flare-ups',
          'State how much MORE limited you are during flare-ups',
        ],
      },
      {
        question: 'Is there any neurological abnormality (radiculopathy)?',
        whyItMatters: 'Radiculopathy is rated SEPARATELY',
        tips: ['Report any shooting pain, numbness, or tingling in legs'],
      },
      {
        question: 'Is there IVDS with incapacitating episodes?',
        whyItMatters: 'Can provide alternative higher rating',
        tips: ['Document episodes requiring bed rest prescribed by doctor'],
      },
    ],
    whatDeterminesRating: [
      'Forward flexion of thoracolumbar spine',
      'Combined range of motion',
      'Whether there is abnormal gait or spinal contour',
      'Presence of ankylosis (frozen spine)',
      'Incapacitating episodes from IVDS',
      'Radiculopathy (rated separately)',
    ],
    commonMistakes: [
      'Pushing through pain during ROM testing',
      'Not reporting where pain BEGINS',
      'Forgetting to mention flare-ups',
      'Not mentioning radicular symptoms (leg pain/numbness)',
      'Testing on a "good day"',
    ],
    prepTips: [
      'Do NOT take pain medication before exam if possible',
      'Schedule exam during typical or worse-than-average day',
      'Have specific flare-up data: frequency, duration, triggers',
      'Bring MRI or X-ray reports',
      'Report pain at START of movement, not end',
    ],
  },

  // Hearing Loss and Tinnitus DBQ
  {
    id: 'hearing-tinnitus',
    formNumber: '21-0960N-2',
    name: 'Hearing Loss and Tinnitus',
    conditionsCovered: ['Hearing loss', 'Tinnitus'],
    diagnosticCodes: ['6100', '6260'],
    keyQuestions: [
      {
        question: 'What are the pure tone audiometry results?',
        whyItMatters: 'Decibel loss determines hearing rating',
        tips: ['Results from controlled audiogram required'],
      },
      {
        question: 'What are the speech discrimination scores?',
        whyItMatters: 'Combined with pure tone results for rating',
        tips: ['Maryland CNC word list scores are used'],
      },
      {
        question: 'Does the Veteran have recurrent tinnitus?',
        whyItMatters: 'Tinnitus is rated separately (max 10%)',
        tips: ['Describe the sound and its impact on concentration/sleep'],
      },
      {
        question: 'What is the impact on daily activities?',
        whyItMatters: 'Documents functional impact',
        tips: ['Explain difficulties in conversations, TV, work settings'],
      },
    ],
    whatDeterminesRating: [
      'Pure tone threshold averages at specific frequencies',
      'Speech discrimination scores',
      'Comparison of both ears using Table VI and VII',
      'Tinnitus: 10% maximum regardless of one or both ears',
    ],
    commonMistakes: [
      'Not reporting tinnitus separately from hearing loss',
      'Trying to hear during audiogram instead of responding honestly',
      'Not mentioning exposure to noise in service',
      'Forgetting to describe daily impact',
    ],
    prepTips: [
      'Request copies of in-service audiograms if available',
      'Document noise exposure in service (weapons, machinery, aircraft)',
      'Describe specific situations where hearing affects you',
      'If you have tinnitus, describe the sound and when it occurs',
    ],
  },

  // Knee DBQ
  {
    id: 'knee',
    formNumber: '21-0960M-9',
    name: 'Knee and Lower Leg Conditions',
    conditionsCovered: [
      'Knee instability',
      'Knee limitation of motion',
      'Meniscal conditions',
      'Arthritis',
      'Patellofemoral syndrome',
    ],
    diagnosticCodes: ['5256-5263'],
    keyQuestions: [
      {
        question: 'What is the range of motion of the knee?',
        whyItMatters: 'Flexion and extension limitations rated separately',
        tips: [
          'Stop at point of pain',
          'You can receive separate ratings for flexion AND extension',
        ],
      },
      {
        question: 'Is there objective evidence of painful motion?',
        whyItMatters: 'Pain can support higher rating',
        tips: ['Describe where pain begins during movement'],
      },
      {
        question: 'Is there any joint instability?',
        whyItMatters: 'Instability (5257) is rated SEPARATELY from motion',
        tips: [
          'Report any giving way or locking',
          'Mention if you use a brace',
        ],
      },
      {
        question: 'Is there any meniscal condition?',
        whyItMatters: 'Meniscal issues can warrant separate rating',
        tips: ['Report episodes of locking, pain, effusion'],
      },
    ],
    whatDeterminesRating: [
      'Flexion limitation (5260)',
      'Extension limitation (5261)',
      'Recurrent subluxation/instability (5257)',
      'Meniscal conditions (5258/5259)',
      'All can be rated SEPARATELY if present',
    ],
    commonMistakes: [
      'Not knowing you can get multiple ratings for one knee',
      'Forgetting to mention instability symptoms',
      'Not reporting use of brace or assistive devices',
      'Pushing through pain during ROM testing',
    ],
    prepTips: [
      'Bring any knee braces you use',
      'Document episodes of giving way or locking',
      'Know you may qualify for 3+ separate ratings per knee',
      'Describe impact on walking, stairs, and standing',
    ],
  },

  // Sleep Apnea DBQ
  {
    id: 'sleep-apnea',
    formNumber: '21-0960C-8',
    name: 'Sleep Apnea Syndromes',
    conditionsCovered: ['Obstructive sleep apnea', 'Central sleep apnea', 'Mixed sleep apnea'],
    diagnosticCodes: ['6847'],
    keyQuestions: [
      {
        question: 'What is the current diagnosis?',
        whyItMatters: 'Must have documented sleep apnea diagnosis',
        tips: ['Bring sleep study results'],
      },
      {
        question: 'Does the condition require use of a breathing assistance device?',
        whyItMatters: 'CPAP use warrants minimum 50% rating',
        tips: [
          'Bring CPAP compliance records',
          'If prescribed but cannot tolerate, document this',
        ],
      },
      {
        question: 'Is there persistent daytime hypersomnolence?',
        whyItMatters: 'Without CPAP, this determines 30% rating',
        tips: ['Describe how sleepiness affects work, driving, daily life'],
      },
      {
        question: 'Is there chronic respiratory failure or cor pulmonale?',
        whyItMatters: 'These complications warrant 100% rating',
        tips: ['Document any cardiac complications from sleep apnea'],
      },
    ],
    whatDeterminesRating: [
      '0%: Asymptomatic, documented',
      '30%: Persistent daytime hypersomnolence',
      '50%: Requires CPAP or similar device',
      '100%: Chronic respiratory failure or requires tracheostomy',
    ],
    commonMistakes: [
      'Not bringing sleep study results',
      'Not having CPAP compliance data',
      'Not mentioning that CPAP was prescribed even if not used',
      'Forgetting to mention secondary effects (fatigue, concentration)',
    ],
    prepTips: [
      'Bring official sleep study results',
      'Download CPAP compliance data before exam',
      'If you cannot tolerate CPAP, document why',
      'Describe impact of fatigue on work and driving',
    ],
  },

  // Migraines DBQ
  {
    id: 'migraines',
    formNumber: '21-0960I-6',
    name: 'Headaches (Including Migraine Headaches)',
    conditionsCovered: ['Migraine headaches', 'Tension headaches', 'Cluster headaches'],
    diagnosticCodes: ['8100'],
    keyQuestions: [
      {
        question: 'What is the current diagnosis?',
        whyItMatters: 'Confirms the type of headache disorder',
        tips: ['Migraines have specific criteria'],
      },
      {
        question: 'What is the frequency of headaches?',
        whyItMatters: 'Frequency directly determines rating',
        tips: ['Track every headache in a diary'],
      },
      {
        question: 'Are the attacks prostrating?',
        whyItMatters: 'Prostrating attacks required for higher ratings',
        tips: [
          'Prostrating means you MUST stop activities and lie down',
          'Describe what happens during a prostrating attack',
        ],
      },
      {
        question: 'What is the economic impact?',
        whyItMatters: 'Severe economic impact required for 50% rating',
        tips: [
          'Document missed work days',
          'Explain if migraines affected job loss or reduced hours',
        ],
      },
    ],
    whatDeterminesRating: [
      '0%: Less frequent attacks',
      '10%: Prostrating attacks averaging once per 2 months',
      '30%: Prostrating attacks averaging once per month',
      '50%: Very frequent, prolonged, completely prostrating with severe economic inadaptability',
    ],
    commonMistakes: [
      'Not tracking headache frequency',
      'Not understanding what "prostrating" means',
      'Not documenting economic impact',
      'Forgetting to mention associated symptoms (nausea, light sensitivity)',
    ],
    prepTips: [
      'Keep a detailed headache diary for at least 3 months',
      'Note whether each attack was prostrating',
      'Document work missed and economic impact',
      'List all treatments tried and their effectiveness',
    ],
  },
];

// Get DBQ reference by condition ID
export function getDBQByCondition(conditionId: string): DBQReference | undefined {
  return dbqQuickReference.find(d => d.id === conditionId);
}

// Get DBQ reference by form number
export function getDBQByFormNumber(formNumber: string): DBQReference | undefined {
  return dbqQuickReference.find(d => d.formNumber === formNumber);
}

// Get all DBQ references
export function getAllDBQReferences(): DBQReference[] {
  return dbqQuickReference;
}

// Search DBQ references by condition name
export function searchDBQReferences(query: string): DBQReference[] {
  const lowerQuery = query.toLowerCase();
  return dbqQuickReference.filter(dbq =>
    dbq.name.toLowerCase().includes(lowerQuery) ||
    dbq.conditionsCovered.some(c => c.toLowerCase().includes(lowerQuery)) ||
    dbq.diagnosticCodes.some(dc => dc.includes(query))
  );
}
