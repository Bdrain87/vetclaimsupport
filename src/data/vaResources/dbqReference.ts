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

  // Artery and Vein Conditions DBQ
  {
    id: 'artery-vein',
    formNumber: '21-0960A-1',
    name: 'Artery and Vein Conditions',
    conditionsCovered: [
      'Peripheral artery disease',
      'Varicose veins',
      "Raynaud's disease",
      'Post-phlebitic syndrome',
      'Arteriosclerosis obliterans',
    ],
    diagnosticCodes: ['7101-7199'],
    keyQuestions: [
      {
        question: 'What vascular symptoms are present (claudication, rest pain, ulceration)?',
        whyItMatters: 'Severity of symptoms directly determines the rating level',
        tips: [
          'Describe pain at rest vs. during activity',
          'Note any skin changes or ulceration',
        ],
      },
      {
        question: 'Are there trophic changes (thin skin, absence of hair, dystrophic nails)?',
        whyItMatters: 'Trophic changes indicate advanced vascular disease and support higher ratings',
        tips: [
          'Point out any visible skin changes to the examiner',
          'Document nail or hair changes in affected areas',
        ],
      },
      {
        question: 'What is the claudication distance (how far can you walk before pain)?',
        whyItMatters: 'Walking distance thresholds determine specific rating percentages',
        tips: [
          'Be specific about distance in feet or yards',
          'Describe what happens when you exceed that distance',
        ],
      },
      {
        question: 'What are the Ankle/Brachial Index (ABI) measurements?',
        whyItMatters: 'ABI values provide objective evidence of arterial insufficiency',
        tips: [
          'Request ABI testing if not already done',
          'Values below 0.9 indicate peripheral artery disease',
        ],
      },
      {
        question: 'Is there persistent edema or stasis pigmentation?',
        whyItMatters: 'These findings support higher ratings for venous conditions',
        tips: [
          'Describe how often swelling occurs',
          'Note if compression stockings are required',
        ],
      },
    ],
    whatDeterminesRating: [
      'ABI measurement values',
      'Claudication distance on treadmill or measured walking',
      'Presence of trophic changes (skin, hair, nails)',
      'Rest pain or ischemic limb pain',
      'Presence of ulceration or tissue loss',
      'Whether condition requires amputation',
    ],
    commonMistakes: [
      'Not requesting ABI testing before the exam',
      'Describing symptoms only during good days',
      'Failing to mention trophic changes (thin skin, hair loss, nail dystrophy)',
      'Not documenting claudication distance with specifics',
      'Forgetting to report use of compression stockings or other assistive devices',
    ],
    prepTips: [
      'Bring recent ABI or vascular study results',
      'Track your walking distance limitations for at least a month',
      'Photograph any trophic changes, ulcers, or skin discoloration',
      'List all vascular medications and treatments',
      'Describe impact on daily activities like walking, standing, and working',
    ],
  },

  // Heart Conditions DBQ
  {
    id: 'heart',
    formNumber: '21-0960A-2',
    name: 'Heart Conditions',
    conditionsCovered: [
      'Coronary artery disease',
      'Valvular heart disease',
      'Arrhythmias',
      'Heart failure',
      'Cardiomyopathy',
    ],
    diagnosticCodes: ['7000-7020'],
    keyQuestions: [
      {
        question: 'What are the METs (metabolic equivalents) testing results?',
        whyItMatters: 'METs level is the primary factor in determining cardiac disability rating',
        tips: [
          'Exercise stress testing provides the most accurate METs level',
          'If you cannot exercise, an interview-based METs estimate is used',
          'Lower METs = higher rating',
        ],
      },
      {
        question: 'What is the left ventricular ejection fraction (LVEF)?',
        whyItMatters: 'Ejection fraction below certain thresholds qualifies for higher ratings',
        tips: [
          'Bring echocardiogram results',
          'LVEF of 30-50% supports a 60% rating; below 30% supports 100%',
        ],
      },
      {
        question: 'Have there been episodes of congestive heart failure?',
        whyItMatters: 'Frequency of CHF episodes is a key rating criterion',
        tips: [
          'Document every hospitalization or ER visit for heart failure',
          'Note how many episodes occurred in the past year',
        ],
      },
      {
        question: 'Is continuous medication required?',
        whyItMatters: 'Requirement for continuous medication supports a minimum 10% rating',
        tips: [
          'Bring a complete medication list',
          'Note if medications have been adjusted or increased over time',
        ],
      },
      {
        question: 'Is there cardiac hypertrophy or dilation documented?',
        whyItMatters: 'Objective evidence of heart enlargement supports service-connected claims',
        tips: [
          'EKG and echocardiogram can document hypertrophy',
          'Bring imaging or test reports showing cardiac changes',
        ],
      },
    ],
    whatDeterminesRating: [
      'METs level achieved on exercise or interview-based testing',
      'Left ventricular ejection fraction percentage',
      'Frequency of congestive heart failure episodes',
      'Whether continuous medication is required',
      'Presence of cardiac hypertrophy or dilation on diagnostic testing',
      'Whether a workload of greater than 3, 5, or 7 METs produces symptoms',
    ],
    commonMistakes: [
      'Not having recent METs testing or echocardiogram results',
      'Overexerting during stress testing instead of reporting symptom onset accurately',
      'Failing to document all congestive heart failure episodes',
      'Not connecting cardiac symptoms to daily functional limitations',
    ],
    prepTips: [
      'Bring recent echocardiogram and stress test results',
      'Document all cardiac-related hospitalizations and ER visits',
      'List all cardiac medications with dosages and changes over time',
      'Describe specific activities that cause symptoms (dyspnea, fatigue, dizziness)',
      'If unable to exercise for stress test, clearly describe activity limitations',
    ],
  },

  // Hypertension DBQ
  {
    id: 'hypertension',
    formNumber: '21-0960A-3',
    name: 'Hypertension',
    conditionsCovered: [
      'Essential hypertension',
      'Secondary hypertension',
    ],
    diagnosticCodes: ['7101'],
    keyQuestions: [
      {
        question: 'What are the current systolic and diastolic blood pressure readings?',
        whyItMatters: 'Specific BP thresholds determine rating percentages',
        tips: [
          'Multiple readings are taken; the VA uses the average',
          'Diastolic 100+ or systolic 160+ supports a 10% rating',
          'Diastolic 110+ or systolic 200+ supports a 20% rating',
        ],
      },
      {
        question: 'Is continuous medication required for control?',
        whyItMatters: 'History of diastolic 100+ requiring continuous medication supports a 10% rating',
        tips: [
          'Bring your complete medication history',
          'Note if medications have been added or increased over time',
        ],
      },
      {
        question: 'What are the blood pressure readings over time (history)?',
        whyItMatters: 'Pattern of elevated readings is more persuasive than a single measurement',
        tips: [
          'Keep a BP log for several weeks before the exam',
          'Include readings at different times of day',
        ],
      },
      {
        question: 'Are there any complications from hypertension?',
        whyItMatters: 'Complications like heart disease or renal involvement may be rated separately',
        tips: [
          'Report any history of hypertensive crisis',
          'Mention any organ damage attributed to high blood pressure',
        ],
      },
    ],
    whatDeterminesRating: [
      'Diastolic pressure predominantly 100 or more = 10%',
      'Diastolic pressure predominantly 110 or more = 20%',
      'Diastolic pressure predominantly 120 or more = 40%',
      'Systolic pressure predominantly 200 or more = 40%',
      'History of diastolic 100+ requiring continuous medication = minimum 10%',
      'Complications (renal, cardiac) may be rated separately',
    ],
    commonMistakes: [
      'Taking blood pressure medication right before the exam, masking true severity',
      'Not keeping a blood pressure log to show patterns',
      'Failing to mention complications like kidney or heart issues',
      'Not documenting medication history showing escalating treatment',
    ],
    prepTips: [
      'Keep a detailed BP log for at least 2-4 weeks before the exam',
      'Ask your doctor about medication timing relative to the exam',
      'Bring your complete medication history showing changes over time',
      'Document any hypertension-related complications or ER visits',
      'Note any secondary conditions caused by hypertension',
    ],
  },

  // Oral and Dental Conditions DBQ
  {
    id: 'dental-oral',
    formNumber: '21-0960D-1',
    name: 'Oral and Dental Conditions',
    conditionsCovered: [
      'Loss of teeth',
      'Periodontal disease',
      'TMJ (temporomandibular joint)',
      'Oral lesions',
    ],
    diagnosticCodes: ['9900-9916'],
    keyQuestions: [
      {
        question: 'Is there loss of masticatory (chewing) function?',
        whyItMatters: 'Loss of masticatory function is a primary factor in dental disability ratings',
        tips: [
          'Describe which foods you can no longer chew',
          'Explain how tooth loss affects your diet and nutrition',
        ],
      },
      {
        question: 'Is there bone loss in the maxilla or mandible?',
        whyItMatters: 'Bone loss from disease or trauma determines rating for jaw conditions',
        tips: [
          'Bring panoramic X-rays or CT scans showing bone loss',
          'Have your dentist document the extent of bone loss',
        ],
      },
      {
        question: 'Are prosthetics (dentures, implants) required and do they restore function?',
        whyItMatters: 'Whether prosthetics can restore masticatory function affects the rating',
        tips: [
          'Report if dentures fit poorly or cannot be worn',
          'Describe limitations even with prosthetics in place',
        ],
      },
      {
        question: 'What is the range of motion of the jaw (inter-incisal and lateral excursion)?',
        whyItMatters: 'Limited jaw motion is rated based on specific millimeter thresholds',
        tips: [
          'Report pain during jaw opening',
          'Note clicking, popping, or locking of the jaw',
        ],
      },
    ],
    whatDeterminesRating: [
      'Number of teeth lost and whether replaceable by prosthesis',
      'Loss of masticatory surface that cannot be restored',
      'Inter-incisal range of motion (limited opening)',
      'Lateral excursion range of motion',
      'Extent of bone loss in maxilla or mandible',
    ],
    commonMistakes: [
      'Not understanding the difference between dental treatment eligibility and disability compensation',
      'Failing to document loss of masticatory function specifically',
      'Not bringing dental X-rays or panoramic imaging',
      'Forgetting to mention jaw pain, clicking, or locking',
      'Not connecting dental trauma to service events',
    ],
    prepTips: [
      'Bring panoramic dental X-rays and treatment records',
      'Document which teeth were lost during or due to service',
      'Describe specific foods you cannot eat due to dental condition',
      'If you have TMJ symptoms, track jaw pain and locking episodes',
      'Know the difference between dental treatment claims and compensation claims',
    ],
  },

  // Scars/Disfigurement DBQ
  {
    id: 'scars',
    formNumber: '21-0960F-1',
    name: 'Scars/Disfigurement',
    conditionsCovered: [
      'Burn scars',
      'Surgical scars',
      'Traumatic scars',
      'Disfigurement of head, face, or neck',
    ],
    diagnosticCodes: ['7800-7805'],
    keyQuestions: [
      {
        question: 'What are the exact measurements of each scar (length, width, depth)?',
        whyItMatters: 'Scar dimensions determine specific rating criteria thresholds',
        tips: [
          'Scars 6+ inches (15 cm) long or 1+ inch (2.5 cm) wide qualify for higher ratings',
          'Measure at the widest and longest points',
        ],
      },
      {
        question: 'Are any scars painful on examination?',
        whyItMatters: 'Painful scars qualify for a separate 10% rating per DC 7804',
        tips: [
          'Report pain even if it is intermittent',
          'Describe what triggers the pain (touch, clothing, weather)',
        ],
      },
      {
        question: 'Are any scars unstable (frequent loss of covering of skin)?',
        whyItMatters: 'Unstable scars qualify for a separate 10% rating per DC 7804',
        tips: [
          'Document any episodes of the scar breaking open or losing skin covering',
          'Photograph the scar during episodes of instability',
        ],
      },
      {
        question: 'For head/face/neck scars: are there disfiguring characteristics?',
        whyItMatters: 'Disfigurement is rated under DC 7800 with specific characteristics that increase the rating',
        tips: [
          'Characteristics include visible tissue loss, distortion of features, and altered skin color',
          'Each characteristic present increases the rating level',
        ],
      },
      {
        question: 'Do any scars limit the function of the affected body part?',
        whyItMatters: 'Scars that limit motion or function are rated under the limitation they cause',
        tips: [
          'Describe if a scar restricts movement of a joint or limb',
          'This may provide a higher rating than the scar rating alone',
        ],
      },
    ],
    whatDeterminesRating: [
      'Scar location (head/face/neck vs. other areas)',
      'Number of disfiguring characteristics for facial scars (DC 7800)',
      'Total area of deep nonlinear scars (DC 7801)',
      'Total area of superficial nonlinear scars (DC 7802)',
      'Number of painful or unstable scars (DC 7804)',
      'Whether scar limits function of affected body part (DC 7805)',
    ],
    commonMistakes: [
      'Not requesting separate ratings for each qualifying scar',
      'Forgetting to mention pain or instability of scars',
      'Not identifying all disfiguring characteristics for facial scars',
      'Failing to connect scar limitation to reduced function',
      'Not photographing scars during episodes of instability',
    ],
    prepTips: [
      'Photograph all scars with a ruler for scale before the exam',
      'Document episodes of scar pain with dates and triggers',
      'If scars break open, photograph them during those episodes',
      'Note any functional limitations caused by scars (restricted motion)',
      'For facial scars, review the 8 disfiguring characteristics in DC 7800',
    ],
  },

  // Skin Diseases (Other than Scars) DBQ
  {
    id: 'skin-diseases',
    formNumber: '21-0960F-2',
    name: 'Skin Diseases (Other than Scars)',
    conditionsCovered: [
      'Eczema',
      'Psoriasis',
      'Dermatitis',
      'Acne',
      'Chloracne',
      'Urticaria',
    ],
    diagnosticCodes: ['7806-7833'],
    keyQuestions: [
      {
        question: 'What percentage of total body surface area is affected?',
        whyItMatters: 'Body surface area affected is a primary rating criterion',
        tips: [
          'Less than 5% = 0%, 5-20% = 10%, 20-40% = 30%, 40%+ = 60%',
          'Include ALL affected areas, not just currently visible ones',
        ],
      },
      {
        question: 'What percentage of exposed body areas (face, neck, hands) is affected?',
        whyItMatters: 'Exposed area percentage can qualify for a higher rating than total body area',
        tips: [
          'Exposed areas include head, face, neck, and hands',
          'Schedule the exam during a flare if possible',
        ],
      },
      {
        question: 'Has systemic therapy (corticosteroids or immunosuppressives) been required?',
        whyItMatters: 'Systemic therapy for 6+ weeks in a 12-month period supports a 30% rating',
        tips: [
          'Oral or injected steroids count as systemic therapy',
          'Topical steroids alone do NOT count as systemic therapy',
          'Track total weeks of systemic therapy in the past year',
        ],
      },
      {
        question: 'How frequently do flare-ups occur and how long do they last?',
        whyItMatters: 'Flare-up frequency and duration document the chronic nature of the condition',
        tips: [
          'Keep a flare-up diary with dates and photographs',
          'Note triggers and duration of each episode',
        ],
      },
    ],
    whatDeterminesRating: [
      'Percentage of total body surface area affected',
      'Percentage of exposed body areas affected',
      'Whether systemic therapy (corticosteroids/immunosuppressives) is required',
      'Duration of systemic therapy in the past 12 months',
      'Whether the condition is constant or intermittent with flares',
    ],
    commonMistakes: [
      'Scheduling the exam during a period of remission instead of a flare',
      'Not distinguishing between topical and systemic therapy',
      'Underestimating the total body surface area affected',
      'Not photographing skin during flare-ups for documentation',
      'Forgetting to mention all affected body areas',
    ],
    prepTips: [
      'Try to schedule the exam during a flare-up if possible',
      'Photograph affected areas during flares with dates',
      'Keep a log of systemic therapy (oral/injected steroids) with total weeks per year',
      'Know the difference between topical and systemic treatments',
      'Map out all affected body areas, including those not currently flaring',
    ],
  },

  // Diabetes Mellitus DBQ
  {
    id: 'diabetes',
    formNumber: '21-0960E-1',
    name: 'Diabetes Mellitus',
    conditionsCovered: [
      'Type 1 diabetes',
      'Type 2 diabetes',
      'Diabetes complications',
    ],
    diagnosticCodes: ['7913'],
    keyQuestions: [
      {
        question: 'Does the Veteran require insulin, oral medication, or both?',
        whyItMatters: 'Treatment requirements are a primary factor in rating level',
        tips: [
          'Insulin requirement supports a minimum 20% rating',
          'Oral medication alone supports a 10-20% rating',
          'Document all diabetes medications and dosages',
        ],
      },
      {
        question: 'Is regulation of activities required due to diabetes?',
        whyItMatters: 'Medically required regulation of activities is needed for 40%+ ratings',
        tips: [
          'This means a doctor has TOLD you to restrict strenuous activities',
          'Get a written statement from your doctor about activity restrictions',
          '"Regulation of activities" is a specific medical directive, not voluntary lifestyle change',
        ],
      },
      {
        question: 'How many episodes of ketoacidosis or hypoglycemic reactions requiring hospitalization?',
        whyItMatters: 'Frequency of hospitalizations for diabetic crises determines higher ratings',
        tips: [
          'Document every ER visit or hospitalization for blood sugar emergencies',
          '1-2 per year with 1-2 doctor visits per month supports 60%',
        ],
      },
      {
        question: 'Are there diabetic complications (nephropathy, retinopathy, peripheral neuropathy)?',
        whyItMatters: 'Complications are rated SEPARATELY as secondary conditions',
        tips: [
          'Each complication can receive its own disability rating',
          'Common secondary conditions: peripheral neuropathy, kidney disease, eye disease',
          'File secondary claims for each complication',
        ],
      },
    ],
    whatDeterminesRating: [
      '10%: Manageable by restricted diet only',
      '20%: Requires insulin and restricted diet, OR oral medication and restricted diet',
      '40%: Requires insulin, restricted diet, AND regulation of activities',
      '60%: Requires insulin, restricted diet, regulation of activities, AND 1-2 hospitalizations per year',
      '100%: Requires more than one daily insulin injection, restricted diet, regulation of activities, AND 3+ hospitalizations per year or weekly doctor visits',
      'Complications (neuropathy, nephropathy, retinopathy) rated separately',
    ],
    commonMistakes: [
      'Not understanding that "regulation of activities" must be medically prescribed',
      'Failing to file separate secondary claims for diabetic complications',
      'Not documenting all ER visits and hospitalizations for blood sugar emergencies',
      'Assuming oral medication alone qualifies for higher ratings without other criteria',
    ],
    prepTips: [
      'Get a written statement from your doctor about activity restrictions if applicable',
      'Document all ER visits and hospitalizations for diabetic crises',
      'List all diabetic complications and file secondary claims for each',
      'Bring HbA1c results showing blood sugar control history',
      'Have your medication list with dosage changes over time',
    ],
  },

  // Endocrine Diseases (Other) DBQ
  {
    id: 'endocrine-other',
    formNumber: '21-0960E-2',
    name: 'Endocrine Diseases (Other than Thyroid, Parathyroid, or Diabetes)',
    conditionsCovered: [
      "Addison's disease",
      "Cushing's syndrome",
      'Acromegaly',
      'Hyperaldosteronism',
    ],
    diagnosticCodes: ['7900-7919'],
    keyQuestions: [
      {
        question: 'Have there been any adrenal or endocrine crisis episodes?',
        whyItMatters: 'Frequency of crisis episodes is a major factor in higher ratings',
        tips: [
          'Document every crisis event with dates and treatment',
          'Include ER visits and hospitalizations',
          'Note how often crises occur per year',
        ],
      },
      {
        question: 'Is hormone replacement therapy required?',
        whyItMatters: 'Need for continuous hormone replacement supports disability rating',
        tips: [
          'List all hormone medications with dosages',
          'Document medication changes and adjustments over time',
        ],
      },
      {
        question: 'What is the functional impairment caused by the condition?',
        whyItMatters: 'Functional limitations determine the overall disability level',
        tips: [
          'Describe fatigue, weakness, and activity limitations',
          'Explain impact on ability to work and perform daily tasks',
          'Note any muscle wasting or weight changes',
        ],
      },
      {
        question: 'Are there secondary conditions caused by the endocrine disorder?',
        whyItMatters: 'Secondary conditions such as cardiovascular or musculoskeletal effects may be rated separately',
        tips: [
          'Common secondary effects include osteoporosis, hypertension, and muscle weakness',
          'File separate claims for each secondary condition',
        ],
      },
    ],
    whatDeterminesRating: [
      'Frequency of crisis episodes requiring medical intervention',
      'Need for continuous hormone replacement therapy',
      'Level of functional impairment (fatigue, weakness, activity limitations)',
      'Presence of secondary complications (cardiovascular, musculoskeletal)',
      'Whether the condition is controlled or progressive despite treatment',
    ],
    commonMistakes: [
      'Not documenting crisis episodes with specific dates and treatments',
      'Failing to connect secondary conditions to the primary endocrine disorder',
      'Not bringing lab results showing hormone levels over time',
      'Underreporting the impact of fatigue and weakness on daily function',
      'Assuming a controlled condition with medication means no disability',
    ],
    prepTips: [
      'Bring lab results showing hormone levels before and during treatment',
      'Document all crisis episodes with dates, symptoms, and medical response',
      'List all medications including hormone replacements with dosage history',
      'Describe how fatigue and weakness affect your work and daily activities',
      'Identify and file secondary claims for complications like osteoporosis or hypertension',
    ],
  },

  // Thyroid and Parathyroid Conditions DBQ
  {
    id: 'thyroid-parathyroid',
    formNumber: '21-0960E-3',
    name: 'Thyroid and Parathyroid Conditions',
    conditionsCovered: [
      'Hypothyroidism',
      'Hyperthyroidism',
      'Thyroid enlargement',
      "Graves' disease",
      "Hashimoto's thyroiditis",
      'Hyperparathyroidism',
    ],
    diagnosticCodes: ['7900-7905'],
    keyQuestions: [
      {
        question: 'What are the current thyroid function lab results (TSH, T3, T4)?',
        whyItMatters: 'Lab values document the severity and control of the thyroid condition',
        tips: [
          'Bring lab results from the past 1-2 years showing trends',
          'Note any periods where levels were significantly abnormal',
        ],
      },
      {
        question: 'Is continuous medication required for the thyroid condition?',
        whyItMatters: 'Need for continuous medication supports ongoing disability',
        tips: [
          'List all thyroid medications with current dosages',
          'Document dosage changes over time',
          'Note any adverse reactions to medications',
        ],
      },
      {
        question: 'Are there symptoms of cold or heat intolerance, weight changes, or fatigue?',
        whyItMatters: 'These symptoms demonstrate the functional impact of the thyroid disorder',
        tips: [
          'Describe severity and frequency of each symptom',
          'Note how symptoms affect daily activities and work',
          'Mention mental health effects like depression or anxiety',
        ],
      },
      {
        question: 'Are there cardiovascular or muscular complications from the thyroid condition?',
        whyItMatters: 'Complications may warrant separate ratings or support higher overall rating',
        tips: [
          'Heart palpitations, tachycardia, and tremor are common with hyperthyroidism',
          'Muscle weakness and joint pain are common with hypothyroidism',
          'Document any cardiac evaluations related to thyroid disease',
        ],
      },
    ],
    whatDeterminesRating: [
      'Hypothyroidism: rated on fatigability, constipation, mental sluggishness, muscular weakness, mental disturbance, weight gain, cold intolerance, cardiovascular involvement, and muscular weakness',
      'Hyperthyroidism: rated on tachycardia, tremor, increased pulse and blood pressure, emotional instability, fatigability, and weight loss',
      'Whether continuous medication is required',
      'Presence of cardiovascular complications',
      'Level of functional impairment despite treatment',
      'Whether the condition causes secondary mental health effects',
    ],
    commonMistakes: [
      'Not bringing serial lab results showing thyroid function over time',
      'Assuming that controlled thyroid levels with medication means no disability',
      'Failing to report mental health symptoms (depression, anxiety, brain fog) related to thyroid',
      'Not documenting weight changes, temperature intolerance, and fatigue patterns',
    ],
    prepTips: [
      'Bring thyroid lab results (TSH, T3, T4) from the past 1-2 years',
      'Document all symptoms even if medication partially controls the condition',
      'Track weight changes, fatigue patterns, and temperature intolerance',
      'List all thyroid medications with complete dosage adjustment history',
      'Mention any mental health effects (depression, anxiety, cognitive issues) to the examiner',
    ],
  },

  // ============================================================
  // EAR, NOSE, THROAT DBQs
  // ============================================================

  // Loss of Sense of Smell and/or Taste DBQ
  {
    id: 'smell-taste',
    formNumber: '21-0960N-1',
    name: 'Loss of Sense of Smell and/or Taste',
    conditionsCovered: ['Anosmia', 'Hyposmia', 'Ageusia', 'Dysgeusia'],
    diagnosticCodes: ['6275', '6276'],
    keyQuestions: [
      {
        question: 'Is the loss of smell and/or taste complete or partial?',
        whyItMatters: 'Complete loss (anosmia/ageusia) is rated higher than partial loss (hyposmia/dysgeusia)',
        tips: [
          'Be specific about whether you can detect ANY smells or tastes',
          'Describe specific examples of what you cannot smell or taste',
        ],
      },
      {
        question: 'How does the loss impact your daily life and safety?',
        whyItMatters: 'Functional impact supports your claim and may warrant additional consideration',
        tips: [
          'Mention inability to detect gas leaks, smoke, or spoiled food',
          'Describe impact on appetite and nutrition',
        ],
      },
      {
        question: 'When did the loss begin and is it related to service?',
        whyItMatters: 'Establishing nexus to service is critical for service connection',
        tips: [
          'Document any in-service head trauma, chemical exposure, or sinus issues',
          'Note if loss began during or shortly after service',
        ],
      },
      {
        question: 'Have you undergone objective testing for smell and taste function?',
        whyItMatters: 'Objective test results provide measurable evidence for your claim',
        tips: [
          'Request UPSIT or similar standardized smell test',
          'Taste testing should cover sweet, sour, salty, and bitter',
        ],
      },
    ],
    whatDeterminesRating: [
      'Whether loss of smell is complete (anosmia) or partial (hyposmia)',
      'Whether loss of taste is complete (ageusia) or partial (dysgeusia)',
      'DC 6275: Complete loss of smell rated at 10%',
      'DC 6276: Complete loss of taste rated at 10%',
      'Smell and taste can be rated separately if both are affected',
    ],
    commonMistakes: [
      'Not getting objective testing to confirm the diagnosis',
      'Failing to document the connection between service events and onset',
      'Not mentioning safety hazards caused by inability to smell',
      'Overlooking that smell and taste can each be rated separately',
    ],
    prepTips: [
      'Request standardized smell and taste testing before your exam',
      'Document specific incidents in service that may have caused the loss',
      'List all daily life impacts including safety concerns and nutrition',
      'Bring any ENT records or imaging showing sinus or nasal conditions',
    ],
  },

  // Sinusitis, Rhinitis, and Other Conditions DBQ
  {
    id: 'sinusitis-rhinitis',
    formNumber: '21-0960N-3',
    name: 'Sinusitis, Rhinitis, and Other Conditions of the Nose, Throat, Larynx, and Pharynx',
    conditionsCovered: [
      'Chronic sinusitis',
      'Allergic rhinitis',
      'Deviated septum',
      'Laryngitis',
    ],
    diagnosticCodes: ['6502-6524'],
    keyQuestions: [
      {
        question: 'How many incapacitating episodes of sinusitis do you have per year?',
        whyItMatters: 'The number of incapacitating episodes directly determines rating level for sinusitis',
        tips: [
          'An incapacitating episode requires bed rest and treatment by a physician',
          'Track every episode with dates and doctor visits',
        ],
      },
      {
        question: 'How many courses of antibiotics have you needed in the past 12 months?',
        whyItMatters: 'Three or more non-incapacitating episodes with antibiotics per year supports a 10% rating; six or more supports 30%',
        tips: [
          'Keep pharmacy records showing antibiotic prescriptions',
          'Include both oral and nasal antibiotics',
        ],
      },
      {
        question: 'What is the percentage of nasal obstruction on each side?',
        whyItMatters: 'Deviated septum rating requires 50% obstruction of both sides or complete obstruction of one side',
        tips: [
          'Request that the examiner measure obstruction percentage',
          'Note if obstruction worsens with allergies or infections',
        ],
      },
      {
        question: 'Are nasal polyps present?',
        whyItMatters: 'Presence of polyps supports a 30% rating for sinusitis',
        tips: [
          'Request CT scan if polyps are suspected but not confirmed',
          'Document any surgical removal of polyps',
        ],
      },
      {
        question: 'Is there chronic laryngitis with hoarseness or voice changes?',
        whyItMatters: 'Laryngitis with hoarseness, inflammation, and mucous membrane thickening is rated at 10-30%',
        tips: [
          'Describe voice changes and how they affect communication and work',
        ],
      },
    ],
    whatDeterminesRating: [
      'Number of incapacitating episodes per year requiring prolonged antibiotics',
      'Number of non-incapacitating episodes per year requiring antibiotics',
      'Presence of nasal polyps',
      'Degree of nasal obstruction (for deviated septum)',
      'Whether surgery (such as Caldwell-Luc) has been performed',
      'For rhinitis: whether polyps are present or there is greater than 50% obstruction',
    ],
    commonMistakes: [
      'Not tracking antibiotic courses and incapacitating episodes',
      'Failing to get CT scan showing chronic sinus disease',
      'Not mentioning nasal polyps or requesting examination for them',
      'Describing symptoms on a good day instead of typical or worst days',
      'Not claiming rhinitis and sinusitis separately when both are present',
    ],
    prepTips: [
      'Bring a log of all sinus infections and antibiotic treatments for the past year',
      'Obtain recent CT scan of sinuses showing chronic disease',
      'Document how symptoms affect work attendance and daily functioning',
      'List all medications including nasal sprays, antihistamines, and antibiotics',
      'If you have had sinus surgery, bring operative reports',
    ],
  },

  // ============================================================
  // GASTROINTESTINAL DBQs
  // ============================================================

  // Esophageal Conditions DBQ
  {
    id: 'esophageal',
    formNumber: '21-0960G-1',
    name: 'Esophageal Conditions',
    conditionsCovered: [
      'GERD',
      'Esophageal stricture',
      'Hiatal hernia',
      "Barrett's esophagus",
    ],
    diagnosticCodes: ['7203-7205'],
    keyQuestions: [
      {
        question: 'Do you experience dysphagia (difficulty swallowing)?',
        whyItMatters: 'Dysphagia severity directly affects rating level for esophageal conditions',
        tips: [
          'Describe whether difficulty is with solids, liquids, or both',
          'Note if you need to modify your diet due to swallowing problems',
        ],
      },
      {
        question: 'How frequently do you experience regurgitation and substernal pain?',
        whyItMatters: 'Persistent regurgitation with substernal/arm/shoulder pain supports a 30% rating for hiatal hernia',
        tips: [
          'Track frequency and severity of episodes',
          'Note if symptoms occur despite medication',
        ],
      },
      {
        question: 'Have you experienced weight loss due to your esophageal condition?',
        whyItMatters: 'Material weight loss combined with other symptoms supports higher rating levels',
        tips: [
          'Document weight changes over time',
          'Note any dietary restrictions required',
        ],
      },
      {
        question: 'What treatments have been tried and how effective are they?',
        whyItMatters: 'Refractory symptoms despite treatment supports higher ratings',
        tips: [
          'List all medications and dosages',
          'Note if symptoms persist despite maximum medical therapy',
        ],
      },
      {
        question: 'Have you had any esophageal procedures or surgeries?',
        whyItMatters: 'Surgical history and complications affect overall rating consideration',
        tips: [
          'Bring operative reports and post-surgical records',
          'Document any complications from procedures',
        ],
      },
    ],
    whatDeterminesRating: [
      'Severity of dysphagia (liquid vs solid food restriction)',
      'Presence of substernal, arm, or shoulder pain',
      'Frequency and severity of regurgitation',
      'Whether there is material weight loss or hematemesis/melena with anemia',
      'Whether esophageal stricture permits only liquids',
      'Impact on overall health and nutrition',
    ],
    commonMistakes: [
      'Not documenting weight loss with actual numbers and dates',
      'Failing to mention symptoms that persist despite medication',
      'Not describing the full impact on diet and nutrition',
      'Overlooking secondary conditions like anemia or aspiration',
    ],
    prepTips: [
      'Bring endoscopy and barium swallow results',
      'Track weight changes and dietary restrictions',
      'Document frequency and severity of regurgitation episodes',
      'List all medications tried including dosages and effectiveness',
      'Describe how symptoms affect eating, sleeping, and daily life',
    ],
  },

  // Gallbladder and Pancreas Conditions DBQ
  {
    id: 'gallbladder',
    formNumber: '21-0960G-2',
    name: 'Gallbladder and Pancreas Conditions',
    conditionsCovered: [
      'Cholecystitis',
      'Cholelithiasis',
      'Gallbladder removal',
    ],
    diagnosticCodes: ['7314-7318'],
    keyQuestions: [
      {
        question: 'What symptoms persist after gallbladder removal?',
        whyItMatters: 'Post-cholecystectomy syndrome symptoms determine the rating level',
        tips: [
          'Document ongoing digestive issues like diarrhea, bloating, and pain',
          'Note which foods trigger symptoms',
        ],
      },
      {
        question: 'How frequently do you experience abdominal pain episodes?',
        whyItMatters: 'Frequency and severity of pain episodes affect rating determination',
        tips: [
          'Track episodes in a symptom diary',
          'Note if episodes require medical attention or ER visits',
        ],
      },
      {
        question: 'What dietary restrictions are necessary?',
        whyItMatters: 'Required dietary changes document functional impairment from the condition',
        tips: [
          'Be specific about foods you cannot tolerate',
          'Describe how dietary restrictions affect daily life',
        ],
      },
      {
        question: 'Do you have any nutritional deficiencies or weight changes?',
        whyItMatters: 'Nutritional impact and weight loss support higher rating levels',
        tips: [
          'Bring lab results showing any nutritional deficiencies',
          'Document weight changes over time',
        ],
      },
    ],
    whatDeterminesRating: [
      'Severity and frequency of symptoms (mild, moderate, or severe)',
      'Whether gallbladder has been removed and residual symptoms',
      'Presence of colic episodes and their frequency',
      'Dietary restrictions required',
      'Impact on overall health and nutritional status',
    ],
    commonMistakes: [
      'Assuming gallbladder removal means no rating is possible',
      'Not documenting post-surgical digestive symptoms',
      'Failing to track pain episodes and their frequency',
      'Not connecting symptoms to the service-connected condition',
      'Overlooking nutritional deficiencies caused by the condition',
    ],
    prepTips: [
      'Keep a detailed symptom and food diary for at least 3 months',
      'Bring surgical reports and post-operative records',
      'Document all dietary restrictions and their impact',
      'Bring recent lab work showing nutritional or liver function status',
    ],
  },

  // Hernias DBQ
  {
    id: 'hernias',
    formNumber: '21-0960G-3',
    name: 'Hernias (Including Inguinal, Femoral, and Ventral)',
    conditionsCovered: [
      'Inguinal hernia',
      'Femoral hernia',
      'Ventral hernia',
      'Incisional hernia',
    ],
    diagnosticCodes: ['7338-7340'],
    keyQuestions: [
      {
        question: 'Has the hernia recurred after surgical repair?',
        whyItMatters: 'Recurrent hernias, especially post-operative, are rated higher than initial hernias',
        tips: [
          'Document each recurrence with dates and treatment',
          'Note if the hernia is readily reducible or not',
        ],
      },
      {
        question: 'What is the size of the hernia and is it reducible?',
        whyItMatters: 'Large, irremediable hernias that are not well supported by a truss are rated higher',
        tips: [
          'Describe whether the hernia can be pushed back in',
          'Note the size and if it has grown over time',
        ],
      },
      {
        question: 'Do you require a truss or belt for support?',
        whyItMatters: 'Need for a truss or supporting belt is a specific rating criterion',
        tips: [
          'Bring your truss or belt to the exam',
          'Describe how often you need to wear it',
        ],
      },
      {
        question: 'How many surgical repairs have you had?',
        whyItMatters: 'Multiple repairs and recurrences indicate severity and support higher ratings',
        tips: [
          'Bring all operative reports',
          'Document complications from each surgery',
        ],
      },
      {
        question: 'Does the hernia cause pain or functional limitations?',
        whyItMatters: 'Pain and limitations on activity document the impact of the condition',
        tips: [
          'Describe activities you cannot do because of the hernia',
          'Note if heavy lifting or straining worsens the condition',
        ],
      },
    ],
    whatDeterminesRating: [
      'Whether the hernia is reducible or irremediable',
      'Size of the hernia (small, large)',
      'Whether a truss or belt is required for support',
      'Recurrence after surgical repair',
      'For ventral hernias: whether wound is massive with persistent muscle disruption',
    ],
    commonMistakes: [
      'Not documenting hernia recurrence after surgical repair',
      'Failing to mention use of truss or supportive belt',
      'Not describing functional limitations caused by the hernia',
      'Overlooking that different hernia types have separate rating criteria',
    ],
    prepTips: [
      'Bring all surgical records and operative reports',
      'Bring your truss or support belt to the exam',
      'Document each recurrence with dates and treatment received',
      'Describe impact on physical activities and work limitations',
      'Note any complications such as incarceration or bowel involvement',
    ],
  },

  // Intestinal Conditions DBQ
  {
    id: 'intestinal',
    formNumber: '21-0960G-4',
    name: 'Intestinal Conditions (Other than Surgical or Neoplasms)',
    conditionsCovered: [
      'Irritable bowel syndrome (IBS)',
      "Crohn's disease",
      'Ulcerative colitis',
      'Diverticulitis',
    ],
    diagnosticCodes: ['7319-7332'],
    keyQuestions: [
      {
        question: 'How frequently do you experience episodes of bowel disturbance?',
        whyItMatters: 'Frequency of episodes (constant, near-constant, or episodic) directly determines rating level',
        tips: [
          'Track episodes daily in a symptom diary',
          'Note alternating diarrhea and constipation patterns',
        ],
      },
      {
        question: 'Do you have any nutritional deficiency or weight loss?',
        whyItMatters: 'Malnutrition and definite weight loss are criteria for higher ratings (30% and above)',
        tips: [
          'Document weight over time with dates',
          'Bring lab results showing nutritional deficiencies',
        ],
      },
      {
        question: 'Is there a need for continuous medication?',
        whyItMatters: 'Continuous medication requirement supports moderate to severe rating levels',
        tips: [
          'List all GI medications with dosages and frequency',
          'Note if medications have changed due to worsening symptoms',
        ],
      },
      {
        question: 'How do symptoms impact your ability to work and function daily?',
        whyItMatters: 'Marked interference with daily activities and employment supports higher ratings',
        tips: [
          'Describe urgency and frequency of bathroom needs',
          'Note work missed or limitations due to symptoms',
        ],
      },
      {
        question: 'Have you experienced any serious complications (bleeding, obstruction, fistula)?',
        whyItMatters: 'Complications like hemorrhage, obstruction, or fistula indicate severe disease warranting higher ratings',
        tips: [
          'Document any ER visits or hospitalizations',
          'Bring records of any surgical interventions for complications',
        ],
      },
    ],
    whatDeterminesRating: [
      'Frequency and severity of bowel disturbance episodes',
      'Presence of malnutrition and definite weight loss',
      'Need for continuous medication or immunosuppressive therapy',
      'Number of exacerbations per year (for Crohn\'s and ulcerative colitis)',
      'Whether there is marked interference with absorption and nutrition',
      'Presence of serious complications (hemorrhage, obstruction, fistula)',
    ],
    commonMistakes: [
      'Not keeping a symptom diary to document episode frequency',
      'Describing symptoms on a good day instead of typical or worst days',
      'Failing to document weight loss with actual numbers',
      'Not mentioning secondary conditions like anemia or vitamin deficiencies',
      'Overlooking that IBS and inflammatory bowel disease have different rating criteria',
    ],
    prepTips: [
      'Keep a detailed symptom diary for at least 3 months before the exam',
      'Bring colonoscopy and lab results showing disease activity',
      'Document weight changes and any nutritional deficiencies',
      'List all medications including over-the-counter remedies',
      'Describe how symptoms affect work, travel, and social activities',
    ],
  },

  // Liver Conditions DBQ
  {
    id: 'liver',
    formNumber: '21-0960G-5',
    name: 'Liver Conditions',
    conditionsCovered: [
      'Hepatitis B',
      'Hepatitis C',
      'Cirrhosis',
      'Fatty liver disease',
      'Liver transplant',
    ],
    diagnosticCodes: ['7312-7354'],
    keyQuestions: [
      {
        question: 'What are your current liver function test results?',
        whyItMatters: 'Abnormal liver enzymes and function tests document disease severity and activity',
        tips: [
          'Bring recent lab results including AST, ALT, bilirubin, albumin',
          'Bring results from multiple time points to show trends',
        ],
      },
      {
        question: 'Is there hepatomegaly (enlarged liver)?',
        whyItMatters: 'Hepatomegaly is a specific finding that supports rating levels',
        tips: [
          'Request imaging such as ultrasound or CT to document liver size',
        ],
      },
      {
        question: 'Do you experience fatigue, malaise, or other debilitating symptoms?',
        whyItMatters: 'Near-constant debilitating symptoms like fatigue support 40-100% ratings',
        tips: [
          'Describe frequency and severity of fatigue',
          'Note how many days per week symptoms affect your functioning',
        ],
      },
      {
        question: 'What dietary restrictions are required?',
        whyItMatters: 'Required dietary restrictions document functional impact of the condition',
        tips: [
          'Describe any medically prescribed dietary changes',
          'Note if you require a restricted diet for hepatic encephalopathy prevention',
        ],
      },
      {
        question: 'Have you had incapacitating episodes requiring bed rest?',
        whyItMatters: 'Incapacitating episodes of at least one week duration affect rating level',
        tips: [
          'Track all episodes requiring bed rest prescribed by a physician',
          'Document total weeks of incapacitation over the past 12 months',
        ],
      },
    ],
    whatDeterminesRating: [
      'Duration and frequency of incapacitating episodes per year',
      'Presence of near-constant debilitating symptoms (fatigue, malaise, nausea)',
      'Liver function test abnormalities',
      'Whether dietary restriction is required',
      'Presence of hepatomegaly',
      'Whether there is portal hypertension, ascites, or hepatic encephalopathy',
    ],
    commonMistakes: [
      'Not bringing serial lab results showing disease progression',
      'Minimizing fatigue and its impact on daily functioning',
      'Not documenting incapacitating episodes with physician records',
      'Failing to mention dietary restrictions prescribed by doctors',
    ],
    prepTips: [
      'Bring lab results from the past year showing liver function trends',
      'Document all incapacitating episodes with dates and durations',
      'Describe fatigue severity and how many days per week it affects you',
      'Bring imaging results (ultrasound, CT) showing liver condition',
      'List all medications including antiviral treatments',
    ],
  },

  // Pancreas Conditions DBQ
  {
    id: 'pancreas',
    formNumber: '21-0960G-6',
    name: 'Pancreas Conditions',
    conditionsCovered: [
      'Pancreatitis (acute)',
      'Pancreatitis (chronic)',
      'Pancreatic insufficiency',
    ],
    diagnosticCodes: ['7347'],
    keyQuestions: [
      {
        question: 'How frequently do you experience episodes of abdominal pain?',
        whyItMatters: 'Frequency of pain episodes (at least monthly or more) determines rating level',
        tips: [
          'Track pain episodes in a diary with dates and severity',
          'Note if episodes require ER visits or hospitalization',
        ],
      },
      {
        question: 'Do you require enzyme replacement therapy?',
        whyItMatters: 'Need for enzyme replacement indicates pancreatic insufficiency and supports higher ratings',
        tips: [
          'Bring prescription records for pancreatic enzyme supplements',
          'Note dosages and frequency of enzyme use',
        ],
      },
      {
        question: 'Have you experienced weight loss due to your pancreas condition?',
        whyItMatters: 'Malabsorption and weight loss are criteria for higher rating levels',
        tips: [
          'Document weight over time with specific dates',
          'Bring lab results showing nutritional deficiencies',
        ],
      },
      {
        question: 'Do you have nutritional deficiency or steatorrhea?',
        whyItMatters: 'Steatorrhea (fatty stools) and nutritional deficiency indicate malabsorption from pancreatic insufficiency',
        tips: [
          'Describe stool changes including oily or floating stools',
          'Bring lab results for fat-soluble vitamins and fecal fat tests',
        ],
      },
    ],
    whatDeterminesRating: [
      'Frequency of abdominal pain episodes',
      'Need for enzyme replacement or continuous medication',
      'Presence of steatorrhea and malabsorption',
      'Weight loss and nutritional deficiency',
      'Whether symptoms are mild, moderate, or severe',
    ],
    commonMistakes: [
      'Not documenting pain episode frequency with specifics',
      'Failing to mention enzyme replacement therapy',
      'Not tracking weight changes and nutritional status',
      'Overlooking steatorrhea as a symptom to report',
      'Not bringing imaging showing pancreatic changes',
    ],
    prepTips: [
      'Keep a pain diary documenting episode frequency, severity, and triggers',
      'Bring all lab results including lipase, amylase, and nutritional panels',
      'Document weight changes with dates and amounts',
      'Bring imaging results (CT, MRI, MRCP) showing pancreatic condition',
    ],
  },

  // Peritoneal Adhesions DBQ
  {
    id: 'peritoneal-adhesions',
    formNumber: '21-0960G-7',
    name: 'Peritoneal Adhesions',
    conditionsCovered: [
      'Post-surgical adhesions',
      'Bowel obstruction episodes',
    ],
    diagnosticCodes: ['7301'],
    keyQuestions: [
      {
        question: 'How frequently do you experience episodes of colic pain, nausea, and vomiting?',
        whyItMatters: 'The frequency and severity of these episodes directly determines rating level under DC 7301',
        tips: [
          'Track every episode with dates, duration, and severity',
          'Note what triggers each episode',
        ],
      },
      {
        question: 'Have you had partial bowel obstruction episodes?',
        whyItMatters: 'Frequent and prolonged episodes of partial obstruction support a 50% rating',
        tips: [
          'Document any ER visits or hospitalizations for bowel obstruction',
          'Bring imaging that shows obstruction or adhesion-related findings',
        ],
      },
      {
        question: 'Do you experience constipation or alternating constipation and diarrhea?',
        whyItMatters: 'Bowel function disturbances from adhesions document ongoing functional impact',
        tips: [
          'Describe the pattern of bowel disturbance',
          'Note dietary modifications needed to manage symptoms',
        ],
      },
      {
        question: 'What is your surgical history that led to the adhesions?',
        whyItMatters: 'Post-surgical origin helps establish nexus and explains the source of adhesions',
        tips: [
          'Bring all operative reports from abdominal surgeries',
          'Document each surgery with dates and reasons',
        ],
      },
    ],
    whatDeterminesRating: [
      'Pulling pain on attempting work or aggravated by movement',
      'Frequency of episodes of colic pain, nausea, constipation, or vomiting',
      'Whether episodes are occasional, fairly frequent, or frequent and prolonged',
      'Presence of partial obstruction shown by X-ray',
      'Whether there is definite interference with absorption and nutrition',
    ],
    commonMistakes: [
      'Not documenting episode frequency and severity',
      'Failing to bring surgical records establishing the source of adhesions',
      'Not mentioning partial obstruction episodes requiring medical attention',
      'Overlooking dietary modifications needed due to the condition',
    ],
    prepTips: [
      'Keep a detailed diary of colic pain episodes and bowel disturbance',
      'Bring all surgical and operative reports from abdominal surgeries',
      'Bring imaging showing adhesions or bowel obstruction episodes',
      'Document all ER visits and hospitalizations related to adhesion symptoms',
      'Describe how symptoms affect eating, work, and daily activities',
    ],
  },

  // Rectum and Anus Conditions DBQ
  {
    id: 'rectum-anus',
    formNumber: '21-0960G-8',
    name: 'Rectum and Anus Conditions',
    conditionsCovered: [
      'Hemorrhoids',
      'Anal fissure',
      'Rectal prolapse',
      'Fecal incontinence',
    ],
    diagnosticCodes: ['7332-7336'],
    keyQuestions: [
      {
        question: 'Do you have impairment of sphincter control?',
        whyItMatters: 'Sphincter control impairment is rated from 10-100% based on severity and determines separate rating under DC 7332',
        tips: [
          'Be honest about leakage frequency even if embarrassing',
          'Describe whether leakage is occasional, frequent, or constant',
        ],
      },
      {
        question: 'How often do you experience fecal leakage and do you require a pad or appliance?',
        whyItMatters: 'Need for wearing a pad or appliance supports 60% rating; complete loss of sphincter control is 100%',
        tips: [
          'Note how many pads you use per day',
          'Describe any appliances or protective garments needed',
        ],
      },
      {
        question: 'Are hemorrhoids persistent, and do they bleed or require treatment?',
        whyItMatters: 'Large, thrombotic, irreducible hemorrhoids with excessive bleeding support a 20% rating',
        tips: [
          'Document frequency of bleeding episodes',
          'Note if hemorrhoids are reducible or not',
        ],
      },
      {
        question: 'Have you had rectal prolapse and how frequently does it occur?',
        whyItMatters: 'Persistent rectal prolapse with frequent fecal leakage is rated up to 50% under DC 7334',
        tips: [
          'Describe whether prolapse is constant or intermittent',
          'Note if manual reduction is required',
        ],
      },
    ],
    whatDeterminesRating: [
      'Degree of sphincter control impairment (occasional, frequent, or complete loss)',
      'Need for wearing pad or appliance due to leakage',
      'Size, reducibility, and bleeding of hemorrhoids',
      'Frequency and severity of rectal prolapse',
      'Whether anal fissure is mild/moderate or causes heavy leakage',
    ],
    commonMistakes: [
      'Being too embarrassed to fully describe incontinence symptoms',
      'Not documenting pad usage and frequency of changes',
      'Failing to mention bleeding episodes and their severity',
      'Not requesting separate ratings for different conditions when applicable',
    ],
    prepTips: [
      'Document daily pad usage and leakage frequency',
      'Bring records of any surgical procedures for rectal or anal conditions',
      'Be prepared to describe symptoms honestly despite embarrassment',
      'Track hemorrhoid flare-ups including bleeding and pain',
      'Bring any prescriptions for topical treatments or suppositories',
    ],
  },

  // Stomach and Duodenum Conditions DBQ
  {
    id: 'stomach-duodenum',
    formNumber: '21-0960G-9',
    name: 'Stomach and Duodenum Conditions',
    conditionsCovered: [
      'Peptic ulcer',
      'Duodenal ulcer',
      'Vagotomy',
      'Gastrectomy',
    ],
    diagnosticCodes: ['7304-7310'],
    keyQuestions: [
      {
        question: 'How severe and frequent is your abdominal pain?',
        whyItMatters: 'Continuous moderate pain or periodic severe pain is a specific rating criterion',
        tips: [
          'Describe pain frequency, duration, and what triggers it',
          'Note relationship to meals and whether antacids help',
        ],
      },
      {
        question: 'Have you experienced weight loss due to your condition?',
        whyItMatters: 'Weight loss is a key criterion differentiating moderate (20%) from severe (40-60%) ratings',
        tips: [
          'Document weight over time with specific dates and amounts',
          'Note if weight loss is despite eating normally',
        ],
      },
      {
        question: 'Do you have anemia related to your stomach or duodenal condition?',
        whyItMatters: 'Anemia combined with other symptoms supports moderate to severe ratings',
        tips: [
          'Bring CBC lab results showing hemoglobin and hematocrit levels',
          'Document any iron supplementation or transfusions',
        ],
      },
      {
        question: 'How frequently do you experience nausea and vomiting?',
        whyItMatters: 'Periodic or recurring vomiting episodes are specific rating criteria',
        tips: [
          'Track frequency and severity of nausea and vomiting',
          'Note if episodes are incapacitating',
        ],
      },
      {
        question: 'Have you had surgery (vagotomy, gastrectomy) and what are the residual symptoms?',
        whyItMatters: 'Post-surgical conditions like dumping syndrome have specific rating criteria',
        tips: [
          'Describe any dumping syndrome symptoms',
          'Document post-surgical complications and ongoing symptoms',
        ],
      },
    ],
    whatDeterminesRating: [
      'Severity and frequency of pain episodes',
      'Weight loss and nutritional status',
      'Presence of anemia (hematemesis or melena)',
      'Frequency of nausea and vomiting episodes',
      'Post-surgical residuals (dumping syndrome, stricture)',
      'Whether symptoms are recurring and incapacitating',
    ],
    commonMistakes: [
      'Not tracking weight changes with documented evidence',
      'Failing to bring lab results showing anemia',
      'Not describing how pain relates to meals and daily activities',
      'Overlooking post-surgical symptoms like dumping syndrome',
    ],
    prepTips: [
      'Bring endoscopy results and imaging showing ulcer disease',
      'Document weight history over the past year',
      'Bring lab results including CBC and iron studies',
      'Track nausea and vomiting episodes with a symptom diary',
      'If post-surgical, describe all residual symptoms in detail',
    ],
  },

  // ============================================================
  // GENITOURINARY DBQs
  // ============================================================

  // Kidney Conditions DBQ
  {
    id: 'kidney',
    formNumber: '21-0960J-1',
    name: 'Kidney Conditions (Nephrology)',
    conditionsCovered: [
      'Chronic kidney disease',
      'Renal insufficiency',
      'Nephrolithiasis',
      'Nephritis',
    ],
    diagnosticCodes: ['7500-7509'],
    keyQuestions: [
      {
        question: 'What are your current BUN and creatinine levels?',
        whyItMatters: 'BUN and creatinine are objective measures of kidney function that directly affect rating determination',
        tips: [
          'Bring recent lab results from the past 3-6 months',
          'Bring serial results to show trends in kidney function',
        ],
      },
      {
        question: 'Do you require dialysis?',
        whyItMatters: 'Requirement for regular dialysis warrants a high rating (80-100%)',
        tips: [
          'Document dialysis schedule and type (hemodialysis or peritoneal)',
          'Bring records from dialysis center',
        ],
      },
      {
        question: 'Do you have edema (swelling) related to your kidney condition?',
        whyItMatters: 'Persistent edema and albuminuria with poor renal function supports higher ratings',
        tips: [
          'Document where swelling occurs and how it affects mobility',
          'Note if compression garments or diuretics are needed',
        ],
      },
      {
        question: 'Do you have hypertension secondary to your renal disease?',
        whyItMatters: 'Hypertension caused by kidney disease can be rated as a secondary condition',
        tips: [
          'Bring blood pressure logs showing elevated readings',
          'Document antihypertensive medications and their effectiveness',
        ],
      },
      {
        question: 'For kidney stones: how frequently do you pass stones or require treatment?',
        whyItMatters: 'Recurrent stone formation with frequent attacks supports higher ratings under DC 7508',
        tips: [
          'Track every stone episode with dates and treatment needed',
          'Bring imaging showing stones or post-surgical reports',
        ],
      },
    ],
    whatDeterminesRating: [
      'BUN and creatinine levels and overall renal function',
      'Whether dialysis is required',
      'Presence of persistent edema and albuminuria',
      'Whether hypertension is present as a secondary condition',
      'For nephrolithiasis: frequency of stone attacks and need for diet therapy or invasive procedures',
      'Whether the condition requires regular or continuous treatment',
    ],
    commonMistakes: [
      'Not bringing serial lab results showing kidney function trends',
      'Failing to claim hypertension as secondary to kidney disease',
      'Not documenting the frequency of kidney stone episodes',
      'Overlooking edema and its impact on daily functioning',
    ],
    prepTips: [
      'Bring 6-12 months of lab results showing BUN, creatinine, GFR, and urinalysis',
      'If on dialysis, bring schedule and records from dialysis center',
      'Document all related conditions like hypertension and edema',
      'For kidney stones, bring imaging and records of all stone episodes',
      'List all medications related to kidney condition with dosages',
    ],
  },

  // Male Reproductive Organ Conditions DBQ
  {
    id: 'male-reproductive',
    formNumber: '21-0960J-2',
    name: 'Male Reproductive Organ Conditions',
    conditionsCovered: [
      'Erectile dysfunction',
      'Testicular atrophy',
      'Benign prostatic hyperplasia',
      'Prostatitis',
    ],
    diagnosticCodes: ['7520-7529'],
    keyQuestions: [
      {
        question: 'Is there voiding dysfunction present?',
        whyItMatters: 'Voiding dysfunction (urine leakage, frequency, or obstructed voiding) is rated based on severity',
        tips: [
          'Describe daytime and nighttime voiding frequency',
          'Note any need for absorbent materials or appliances',
        ],
      },
      {
        question: 'What is the daytime and nighttime urinary frequency?',
        whyItMatters: 'Urinary frequency criteria specify exact numbers for each rating level',
        tips: [
          'Track voiding times for several days before the exam',
          'Note awakening frequency at night for voiding',
        ],
      },
      {
        question: 'Is there loss of use of a creative organ (erectile dysfunction)?',
        whyItMatters: 'Loss of use of a creative organ qualifies for Special Monthly Compensation (SMC-K)',
        tips: [
          'Be honest about erectile function even if embarrassing',
          'Document any medications tried and their effectiveness',
        ],
      },
      {
        question: 'Is the condition related to a service-connected disability or treatment?',
        whyItMatters: 'Many male reproductive conditions are secondary to other service-connected conditions or their medications',
        tips: [
          'Note if ED is caused by medications for service-connected conditions',
          'Document any connection to PTSD, diabetes, or spinal conditions',
        ],
      },
    ],
    whatDeterminesRating: [
      'Voiding dysfunction severity (leakage requiring absorbent materials, frequency, obstruction)',
      'Urinary frequency (daytime interval and nighttime awakening frequency)',
      'Whether there is obstructed voiding requiring catheterization',
      'Loss of use of creative organ (qualifies for SMC-K)',
      'Presence of urinary tract infections and their frequency',
    ],
    commonMistakes: [
      'Not claiming Special Monthly Compensation for erectile dysfunction',
      'Being too embarrassed to fully describe symptoms',
      'Not connecting the condition to service-connected disabilities as secondary',
      'Failing to document voiding frequency with specific numbers',
      'Not mentioning medications that may contribute to erectile dysfunction',
    ],
    prepTips: [
      'Track urinary frequency for several days before the exam',
      'Be prepared to discuss erectile function honestly',
      'Document all medications that may affect reproductive function',
      'Bring records connecting condition to service-connected disabilities',
    ],
  },

  // Urinary Tract Conditions DBQ
  {
    id: 'urinary-tract',
    formNumber: '21-0960J-3',
    name: 'Urinary Tract (Including Bladder and Urethra)',
    conditionsCovered: [
      'Urinary incontinence',
      'Urinary frequency',
      'Obstructed voiding',
      'UTI recurrence',
    ],
    diagnosticCodes: ['7510-7519'],
    keyQuestions: [
      {
        question: 'How often do you void during the day and how many times do you wake at night?',
        whyItMatters: 'Specific daytime voiding intervals and nighttime frequency determine exact rating levels',
        tips: [
          'Track voiding schedule for at least a week before the exam',
          'Note both the interval between voids and total number',
        ],
      },
      {
        question: 'Do you require absorbent pads or a catheter?',
        whyItMatters: 'Requiring absorbent materials supports 40-60% rating; catheterization supports higher ratings',
        tips: [
          'Document how many pads you use per day',
          'Note the type and frequency of catheterization if applicable',
        ],
      },
      {
        question: 'How many urinary tract infections have you had in the past year?',
        whyItMatters: 'Recurrent UTIs requiring frequent or continuous treatment have specific rating criteria',
        tips: [
          'Bring records of all UTI diagnoses and antibiotic treatments',
          'Note if hospitalization was required for any UTI',
        ],
      },
      {
        question: 'Do you experience obstructed voiding symptoms?',
        whyItMatters: 'Obstructed voiding with urinary retention or requiring catheterization is rated separately',
        tips: [
          'Describe difficulty starting urine stream, weak stream, or incomplete emptying',
          'Note any post-void residual measurements',
        ],
      },
    ],
    whatDeterminesRating: [
      'Voiding frequency: daytime intervals (1-2 hours = 20%, less than 1 hour = 40%)',
      'Nighttime voiding frequency (3-4 times = 20%, 5+ times = 40%)',
      'Need for absorbent materials (number of pad changes per day)',
      'Requirement for catheterization (intermittent or continuous)',
      'Frequency of UTIs requiring treatment',
    ],
    commonMistakes: [
      'Not tracking voiding frequency with specific times and numbers',
      'Underreporting pad usage due to embarrassment',
      'Not documenting all UTIs with treatment records',
      'Failing to mention nighttime voiding frequency',
      'Not requesting evaluation for obstructed voiding separately from incontinence',
    ],
    prepTips: [
      'Keep a voiding diary for at least one week before the exam',
      'Document daily pad usage including number of changes',
      'Bring records of all UTI diagnoses and antibiotic prescriptions',
      'Describe impact on sleep, work, and daily activities',
    ],
  },

  // ============================================================
  // GYNECOLOGICAL DBQs
  // ============================================================

  // Breast Conditions DBQ
  {
    id: 'breast',
    formNumber: '21-0960K-1',
    name: 'Breast Conditions',
    conditionsCovered: [
      'Mastectomy',
      'Breast surgery complications',
    ],
    diagnosticCodes: ['7626-7628'],
    keyQuestions: [
      {
        question: 'What was the extent of the surgical procedure?',
        whyItMatters: 'Rating depends on whether it was a simple mastectomy, radical mastectomy, or other breast surgery',
        tips: [
          'Bring operative reports detailing the exact procedure',
          'Note whether it was unilateral or bilateral',
        ],
      },
      {
        question: 'Is there lymphedema as a result of surgery?',
        whyItMatters: 'Lymphedema can significantly affect function and may warrant additional rating consideration',
        tips: [
          'Document swelling with measurements',
          'Note if compression garments or physical therapy are needed',
        ],
      },
      {
        question: 'What functional impairment results from the surgery?',
        whyItMatters: 'Limitations in arm movement, strength, and daily activities affect overall disability assessment',
        tips: [
          'Describe specific activities limited by surgical complications',
          'Note any range of motion limitations in the affected arm',
        ],
      },
      {
        question: 'Are there ongoing complications or residual effects?',
        whyItMatters: 'Chronic pain, scarring, and nerve damage are separately ratable residual effects',
        tips: [
          'Describe any chronic pain at the surgical site',
          'Note numbness, tingling, or nerve pain in the chest or arm',
        ],
      },
    ],
    whatDeterminesRating: [
      'Type and extent of mastectomy (simple vs radical, unilateral vs bilateral)',
      'Presence of lymphedema and its severity',
      'Functional impairment of the upper extremity',
      'Whether there are residual surgical complications',
      'DC 7626: Mastectomy ratings range from 0% to 80% based on extent and laterality',
    ],
    commonMistakes: [
      'Not claiming residual complications like lymphedema separately',
      'Failing to document functional limitations in the arm and shoulder',
      'Not bringing detailed operative reports',
      'Overlooking chronic pain and nerve damage as separate conditions',
    ],
    prepTips: [
      'Bring all surgical and operative reports',
      'Document lymphedema with measurements and photos if applicable',
      'Describe functional limitations in daily activities',
      'List all residual symptoms including pain, numbness, and limited motion',
      'Bring records of physical therapy or ongoing treatments',
    ],
  },

  // Gynecological Conditions DBQ
  {
    id: 'gynecological',
    formNumber: '21-0960K-2',
    name: 'Gynecological Conditions',
    conditionsCovered: [
      'Endometriosis',
      'Uterine fibroids',
      'Ovarian conditions',
      'Pelvic inflammatory disease (PID)',
    ],
    diagnosticCodes: ['7610-7632'],
    keyQuestions: [
      {
        question: 'Does your condition require continuous treatment?',
        whyItMatters: 'Conditions requiring continuous treatment are rated higher than those controlled by intermittent treatment',
        tips: [
          'List all current treatments including medications, hormonal therapy, and procedures',
          'Note if treatment has been ongoing for 6 months or more',
        ],
      },
      {
        question: 'How frequently do you experience symptoms?',
        whyItMatters: 'Symptom frequency (constant vs intermittent) directly impacts rating level',
        tips: [
          'Track symptoms daily including pain, bleeding, and other symptoms',
          'Document days of work or activity missed due to symptoms',
        ],
      },
      {
        question: 'Have you had surgical interventions for your condition?',
        whyItMatters: 'Surgical procedures (hysterectomy, oophorectomy) have specific rating criteria under the schedule',
        tips: [
          'Bring all operative reports',
          'Document any residual symptoms after surgery',
        ],
      },
      {
        question: 'Does your condition cause pelvic pain or abnormal bleeding?',
        whyItMatters: 'Chronic pelvic pain and heavy/irregular bleeding document severity and functional impact',
        tips: [
          'Describe pain severity, frequency, and duration',
          'Document abnormal bleeding patterns and their impact',
        ],
      },
    ],
    whatDeterminesRating: [
      'Whether symptoms require continuous treatment',
      'Whether symptoms are not controlled by treatment',
      'Surgical history (hysterectomy, oophorectomy) and residuals',
      'Frequency and severity of symptoms',
      'Impact on reproductive function',
      'Whether there are secondary conditions like anemia from heavy bleeding',
    ],
    commonMistakes: [
      'Not documenting that symptoms persist despite treatment',
      'Failing to claim secondary conditions like anemia or depression',
      'Not bringing records showing continuous treatment over time',
      'Overlooking that different gynecological conditions can be rated separately',
    ],
    prepTips: [
      'Keep a symptom diary tracking pain, bleeding, and activity limitations',
      'Bring treatment records spanning at least 6-12 months',
      'Document all surgical procedures with operative reports',
      'List all medications and hormonal treatments with dates',
      'Describe how symptoms affect work, daily activities, and quality of life',
    ],
  },

  // ============================================================
  // HEMATOLOGIC & LYMPHATIC DBQs
  // ============================================================

  // Hematologic and Lymphatic Conditions DBQ
  {
    id: 'hematologic-lymphatic',
    formNumber: '21-0960B-1',
    name: 'Hematologic and Lymphatic Conditions',
    conditionsCovered: [
      'Anemia',
      'Sickle cell disease',
      'Lymphoma (in remission)',
      'Splenomegaly',
      'Thrombocytopenia',
    ],
    diagnosticCodes: ['7700-7725'],
    keyQuestions: [
      {
        question: 'What are your current blood count abnormalities?',
        whyItMatters: 'Specific lab values (hemoglobin, platelet count, WBC) directly determine rating levels for hematologic conditions',
        tips: [
          'Bring CBC results from the past 6-12 months',
          'Bring serial results to show trends and stability',
        ],
      },
      {
        question: 'Do you require blood transfusions?',
        whyItMatters: 'Need for transfusions indicates severe disease and supports higher ratings (70-100%)',
        tips: [
          'Document frequency of transfusions',
          'Bring transfusion records from blood bank',
        ],
      },
      {
        question: 'How frequently do you experience episodes of crisis or exacerbation?',
        whyItMatters: 'For sickle cell disease and other conditions, crisis frequency determines rating level',
        tips: [
          'Track every crisis episode with dates and treatment needed',
          'Note if episodes require ER visits or hospitalization',
        ],
      },
      {
        question: 'Do you require continuous medication for your condition?',
        whyItMatters: 'Need for continuous medication or immunosuppressive therapy supports higher ratings',
        tips: [
          'List all medications with dosages and frequency',
          'Note any chemotherapy or immunosuppressive agents',
        ],
      },
      {
        question: 'Do you experience fatigue or other debilitating symptoms?',
        whyItMatters: 'Fatigue, weakness, and recurrent infections document functional impact of the condition',
        tips: [
          'Describe how fatigue affects your ability to work and function daily',
          'Note frequency of infections or other complications',
        ],
      },
    ],
    whatDeterminesRating: [
      'Specific lab values (hemoglobin for anemia, platelet count for thrombocytopenia)',
      'Need for blood transfusions and their frequency',
      'Frequency of crises or exacerbations requiring medical treatment',
      'Need for continuous medication or immunosuppressive therapy',
      'For lymphoma in remission: any residual symptoms or treatment side effects',
      'Presence of splenomegaly and associated complications',
    ],
    commonMistakes: [
      'Not bringing serial lab results to show disease pattern over time',
      'Failing to document crisis episodes with dates and treatment records',
      'Not mentioning fatigue and its impact on daily functioning',
      'Overlooking residual effects of chemotherapy or radiation',
      'Not claiming secondary conditions caused by the hematologic disorder',
    ],
    prepTips: [
      'Bring 6-12 months of CBC and related lab results',
      'Document all crisis episodes, ER visits, and hospitalizations',
      'List all medications including any chemotherapy or immunosuppressive drugs',
      'Describe fatigue severity and its impact on work and daily activities',
      'If in remission from lymphoma, document any residual symptoms or treatment effects',
    ],
  },

  // HIV-Related Illnesses DBQ
  {
    id: 'hiv',
    formNumber: '21-0960I-1',
    name: 'HIV-Related Illnesses',
    conditionsCovered: ['HIV', 'AIDS', 'Opportunistic infections'],
    diagnosticCodes: ['6351'],
    keyQuestions: [
      {
        question: 'What is the current CD4 count and trend over time?',
        whyItMatters: 'CD4 count is a primary indicator of immune function and disease progression',
        tips: ['Bring recent lab results showing CD4 counts over the past year', 'Note any significant drops or trends'],
      },
      {
        question: 'What is the current viral load?',
        whyItMatters: 'Viral load indicates how well the disease is controlled and treatment effectiveness',
        tips: ['Undetectable viral load still qualifies for rating based on medication requirements', 'Bring lab results showing viral load history'],
      },
      {
        question: 'Have there been any opportunistic infections?',
        whyItMatters: 'Opportunistic infections indicate advanced disease and can warrant higher ratings or separate ratings for residuals',
        tips: ['Document every infection with dates and treatment', 'Include recurrent infections even if resolved'],
      },
      {
        question: 'What antiretroviral therapy is being used and what are the side effects?',
        whyItMatters: 'Medication side effects contribute to functional impairment and overall disability picture',
        tips: ['List all current medications', 'Document side effects like nausea, fatigue, neuropathy'],
      },
      {
        question: 'What functional limitations result from HIV or its treatment?',
        whyItMatters: 'Functional impact on work and daily life directly affects rating level',
        tips: ['Describe fatigue levels, missed work, inability to perform tasks', 'Mention any cognitive effects'],
      },
    ],
    whatDeterminesRating: [
      'Whether HIV is asymptomatic or symptomatic',
      'CD4 count levels and immune function',
      'Presence and frequency of opportunistic infections',
      'Need for approved medications (antiretroviral therapy)',
      'Functional impairment including inability to work',
      'Development of AIDS-defining conditions',
    ],
    commonMistakes: [
      'Assuming undetectable viral load means 0% rating — medication dependence alone supports a rating',
      'Not documenting all opportunistic infections and their residuals',
      'Failing to report medication side effects as part of the disability picture',
      'Not mentioning fatigue and cognitive symptoms that affect daily functioning',
    ],
    prepTips: [
      'Bring comprehensive lab history showing CD4 counts and viral loads over time',
      'List all current and past antiretroviral medications with side effects',
      'Document every opportunistic infection with dates and outcomes',
      'Describe how HIV and its treatment affect your ability to work and perform daily activities',
      'If you have been hospitalized, bring discharge summaries',
    ],
  },

  // Infectious Diseases (General) DBQ
  {
    id: 'infectious-general',
    formNumber: '21-0960I-2',
    name: 'Infectious Diseases (General)',
    conditionsCovered: ['Brucellosis', 'Malaria', 'Leishmaniasis', 'Other tropical diseases', 'Other infectious diseases'],
    diagnosticCodes: ['6300-6354'],
    keyQuestions: [
      {
        question: 'Is the infectious disease currently active or inactive?',
        whyItMatters: 'Active disease is rated differently than inactive disease with residuals',
        tips: ['Provide lab confirmation of active vs inactive status', 'Even inactive disease may have ratable residuals'],
      },
      {
        question: 'Have there been any relapses and how frequently do they occur?',
        whyItMatters: 'Frequency of relapses directly affects the rating level for many infectious diseases',
        tips: ['Track dates and duration of every relapse episode', 'Include relapses that required treatment changes'],
      },
      {
        question: 'What residual symptoms persist from the infection?',
        whyItMatters: 'Residual organ damage or chronic symptoms are rated even after the infection resolves',
        tips: ['Document ongoing fatigue, joint pain, organ dysfunction', 'Each residual may warrant a separate rating'],
      },
      {
        question: 'Is there any organ damage resulting from the infection?',
        whyItMatters: 'Organ damage (liver, spleen, kidneys, etc.) is rated separately under the affected body system',
        tips: ['Bring imaging and lab results showing organ function', 'Mention any secondary conditions caused by the infection'],
      },
    ],
    whatDeterminesRating: [
      'Whether the disease is active or in remission',
      'Frequency and severity of relapses',
      'Residual symptoms and their functional impact',
      'Organ damage rated under appropriate body system codes',
      'Need for continuous or intermittent treatment',
    ],
    commonMistakes: [
      'Assuming the disease must be active to receive a rating — residuals are ratable',
      'Not documenting relapse frequency and pattern over time',
      'Failing to claim separate ratings for organ damage caused by the infection',
      'Not bringing lab work confirming diagnosis and disease status',
      'Overlooking fatigue and constitutional symptoms as ratable residuals',
    ],
    prepTips: [
      'Bring all lab results confirming original diagnosis and current disease status',
      'Create a timeline of relapses with dates, symptoms, and treatments',
      'Document all residual symptoms even if the infection has resolved',
      'Get specialist evaluations for any organ damage (liver function tests, imaging, etc.)',
      'If the disease was contracted in a specific theater of operations, bring service records showing deployment',
    ],
  },

  // Persian Gulf and Afghanistan Infectious Diseases DBQ
  {
    id: 'persian-gulf-infectious',
    formNumber: '21-0960I-3',
    name: 'Persian Gulf and Afghanistan Infectious Diseases',
    conditionsCovered: ['Q fever', 'Brucellosis', 'Malaria from SW Asia/Afghanistan theater'],
    diagnosticCodes: ['6301-6354'],
    keyQuestions: [
      {
        question: 'Did the Veteran serve in the Southwest Asia theater of operations or Afghanistan?',
        whyItMatters: 'Service in these theaters activates Gulf War presumptive provisions that ease the burden of proof',
        tips: ['Bring DD-214 or deployment orders confirming theater of operations', 'Include dates of deployment'],
      },
      {
        question: 'Does the Veteran have an undiagnosed illness with signs or symptoms?',
        whyItMatters: 'Gulf War veterans can be rated for undiagnosed illnesses that cannot be attributed to a known diagnosis',
        tips: ['Document all symptoms even if no firm diagnosis exists', 'Undiagnosed illness must have existed for 6+ months'],
      },
      {
        question: 'Is there a chronic multi-symptom illness present?',
        whyItMatters: 'Chronic multi-symptom illness (like chronic fatigue syndrome, fibromyalgia, or IBS) qualifies under Gulf War presumptives',
        tips: ['Describe all symptom clusters', 'Note how symptoms overlap and interact'],
      },
      {
        question: 'Are there specific infectious diseases contracted during service in the Gulf War theater?',
        whyItMatters: 'Certain infectious diseases are presumptive for Gulf War veterans and do not require direct proof of in-service contraction',
        tips: ['List all infections diagnosed during or after deployment', 'Include lab confirmation where available'],
      },
      {
        question: 'What is the functional impact of the condition on daily life and work?',
        whyItMatters: 'Rating level depends on how much the condition impairs occupational and daily functioning',
        tips: ['Describe limitations in specific activities', 'Mention any accommodations needed at work'],
      },
    ],
    whatDeterminesRating: [
      'Confirmation of service in Southwest Asia theater or Afghanistan',
      'Whether the condition qualifies under Gulf War presumptive provisions',
      'Severity and frequency of symptoms or relapses',
      'Degree of functional impairment in occupational and daily activities',
      'Presence of undiagnosed illness or chronic multi-symptom illness',
      'Residual organ damage rated under appropriate diagnostic codes',
    ],
    commonMistakes: [
      'Not establishing service in the qualifying theater of operations',
      'Trying to get a specific diagnosis when an undiagnosed illness claim may be stronger',
      'Not understanding Gulf War presumptive conditions and their lower evidence threshold',
      'Failing to document all symptoms in a multi-symptom illness',
      'Not connecting the timeline of symptom onset to deployment period',
    ],
    prepTips: [
      'Bring deployment orders, DD-214, or other proof of service in SW Asia/Afghanistan',
      'Document the timeline of when symptoms first appeared relative to deployment',
      'Research Gulf War presumptive conditions to see if your symptoms qualify',
      'Keep a symptom diary showing frequency, severity, and functional impact',
      'If you have multiple unexplained symptoms, consider filing under undiagnosed illness',
    ],
  },

  // Tuberculosis DBQ
  {
    id: 'tuberculosis',
    formNumber: '21-0960I-4',
    name: 'Tuberculosis',
    conditionsCovered: ['Active tuberculosis', 'Inactive tuberculosis', 'Latent TB infection (LTBI)', 'Pulmonary tuberculosis', 'Extrapulmonary tuberculosis'],
    diagnosticCodes: ['6701-6724'],
    keyQuestions: [
      {
        question: 'Is the tuberculosis currently active or inactive?',
        whyItMatters: 'Active TB is rated at 100% during the active phase; inactive TB is rated on residuals',
        tips: ['Bring sputum culture results and chest imaging', 'Document the date TB became inactive'],
      },
      {
        question: 'What is the total duration of treatment?',
        whyItMatters: 'VA provides a graduated rating schedule after active TB becomes inactive, typically stepping down over several years',
        tips: ['Document start and end dates of all TB treatment', 'Include any extended treatment courses'],
      },
      {
        question: 'What are the current pulmonary function test (PFT) results?',
        whyItMatters: 'For inactive pulmonary TB, residual lung function impairment determines the ongoing rating',
        tips: ['Get PFTs done before the exam if possible', 'Report any shortness of breath or exercise limitation'],
      },
      {
        question: 'What do current chest X-rays or imaging show?',
        whyItMatters: 'X-ray findings of scarring, calcification, or cavitation document residual lung damage',
        tips: ['Bring recent chest X-rays or CT scans', 'Note any progressive changes from prior imaging'],
      },
      {
        question: 'Is there any extrapulmonary involvement?',
        whyItMatters: 'Extrapulmonary TB (bone, kidney, lymph nodes, etc.) is rated under the affected organ system',
        tips: ['Document all sites of TB involvement', 'Each affected organ system may warrant a separate rating'],
      },
    ],
    whatDeterminesRating: [
      'Whether TB is currently active or inactive',
      'Duration since TB became inactive (graduated rating schedule)',
      'Pulmonary function test results for residual lung impairment',
      'X-ray evidence of residual lung damage',
      'Extrapulmonary involvement rated under affected organ system',
      'Need for ongoing treatment or monitoring',
    ],
    commonMistakes: [
      'Not understanding the graduated rating schedule that steps down after active TB resolves',
      'Failing to get pulmonary function tests to document residual lung damage',
      'Not claiming separate ratings for extrapulmonary TB sites',
      'Missing the window for higher ratings during the step-down period after active TB',
    ],
    prepTips: [
      'Bring complete treatment records including start/end dates and all medications',
      'Get recent pulmonary function tests and chest imaging',
      'Document all sites of TB involvement (lungs, bones, lymph nodes, etc.)',
      'Know the graduated rating timeline — ratings step down at specific intervals after TB becomes inactive',
      'If you have residual symptoms like chronic cough or shortness of breath, document their frequency and severity',
    ],
  },

  // Amputations DBQ
  {
    id: 'amputations',
    formNumber: '21-0960M-1',
    name: 'Amputations',
    conditionsCovered: ['Upper extremity amputations', 'Lower extremity amputations', 'Amputations at all levels'],
    diagnosticCodes: ['5050-5172'],
    keyQuestions: [
      {
        question: 'What is the exact level of amputation?',
        whyItMatters: 'The specific level (above/below knee, above/below elbow, etc.) directly determines the rating percentage',
        tips: ['Be precise about where the amputation occurred', 'Surgical reports should document the exact level'],
      },
      {
        question: 'Does the Veteran use a prosthetic device and how functional is it?',
        whyItMatters: 'Prosthetic use and fit issues affect functional capacity and may support additional ratings',
        tips: ['Bring your prosthetic to the exam', 'Describe any fit problems, skin breakdown, or limitations'],
      },
      {
        question: 'Is there phantom limb pain?',
        whyItMatters: 'Phantom pain is a recognized complication that affects quality of life and functional ability',
        tips: ['Describe frequency, severity, and triggers', 'Note any treatments tried and their effectiveness'],
      },
      {
        question: 'What is the condition of the residual limb?',
        whyItMatters: 'Skin breakdown, neuromas, bone spurs, or poor healing at the residual limb can warrant additional consideration',
        tips: ['Report any skin problems, pain at the stump, or difficulty with prosthetic fitting'],
      },
      {
        question: 'What functional limitations exist in daily activities?',
        whyItMatters: 'Functional impact determines eligibility for special monthly compensation (SMC) and aid/attendance',
        tips: ['Describe activities you cannot perform or need help with', 'Mention if you need assistance with dressing, bathing, etc.'],
      },
    ],
    whatDeterminesRating: [
      'Exact anatomical level of amputation',
      'Whether it is the dominant or non-dominant extremity (for upper extremity)',
      'Residual limb condition and complications',
      'Eligibility for special monthly compensation (SMC) for loss of use',
      'Combined effect with other service-connected disabilities',
    ],
    commonMistakes: [
      'Not claiming special monthly compensation (SMC) for loss of use',
      'Failing to report residual limb complications as part of the disability',
      'Not documenting phantom limb pain and its functional impact',
      'Overlooking the need for aid and attendance benefits',
    ],
    prepTips: [
      'Bring your prosthetic device to the exam',
      'Document all residual limb complications (skin breakdown, neuromas, bone spurs)',
      'Research special monthly compensation (SMC) — you may qualify for additional benefits',
      'Describe how the amputation affects your ability to work and perform daily tasks',
      'If you have phantom pain, keep a pain diary with frequency and severity',
    ],
  },

  // Ankle Conditions DBQ
  {
    id: 'ankle',
    formNumber: '21-0960M-2',
    name: 'Ankle Conditions',
    conditionsCovered: ['Ankle sprains', 'Ankle fractures', 'Ankle arthritis', 'Ankle instability'],
    diagnosticCodes: ['5270-5274'],
    keyQuestions: [
      {
        question: 'What is the range of motion for dorsiflexion and plantarflexion?',
        whyItMatters: 'ROM measurements directly determine the rating percentage for ankle limitation of motion',
        tips: ['Stop at the point of pain — do not push through', 'Normal dorsiflexion is 20 degrees, plantarflexion is 45 degrees'],
      },
      {
        question: 'Is there joint instability or recurrent giving way?',
        whyItMatters: 'Instability can be rated separately from limitation of motion',
        tips: ['Describe episodes of giving way, rolling, or buckling', 'Mention if you wear an ankle brace'],
      },
      {
        question: 'Is there pain on weight-bearing?',
        whyItMatters: 'Weight-bearing pain affects functional capacity and supports higher ratings',
        tips: ['Describe activities that cause pain (walking, stairs, standing)', 'Note how long you can stand or walk before pain starts'],
      },
      {
        question: 'Is there ankylosis (complete fixation) of the ankle?',
        whyItMatters: 'Ankylosis warrants higher ratings than limitation of motion — up to 40% depending on position',
        tips: ['If your ankle is fused or completely immobile, make sure this is documented'],
      },
    ],
    whatDeterminesRating: [
      'Limitation of dorsiflexion and plantarflexion motion',
      'Whether there is marked or moderate limitation of motion',
      'Presence of ankylosis and the position of fixation',
      'Joint instability rated separately if present',
      'Additional functional loss from pain, weakness, or flare-ups',
    ],
    commonMistakes: [
      'Pushing through pain during range of motion testing',
      'Not reporting instability symptoms separately from pain',
      'Failing to mention the use of ankle braces or supportive footwear',
      'Not describing flare-ups and their impact on ankle function',
      'Forgetting to report how the ankle affects walking and weight-bearing activities',
    ],
    prepTips: [
      'Do not take pain medication before the exam if you can safely avoid it',
      'Bring any ankle braces or supportive devices you use',
      'Document flare-up frequency, duration, and triggers',
      'Describe specific activities limited by your ankle condition (walking distance, stairs, standing time)',
    ],
  },

  // Bones and Other Skeletal Conditions DBQ
  {
    id: 'bones-skeletal',
    formNumber: '21-0960M-3',
    name: 'Bones and Other Skeletal Conditions',
    conditionsCovered: ['Stress fractures', 'Bone disease', 'Nonunion', 'Malunion'],
    diagnosticCodes: ['5000-5024'],
    keyQuestions: [
      {
        question: 'What does current X-ray or imaging evidence show?',
        whyItMatters: 'Imaging evidence of nonunion, malunion, or bone disease is essential for rating',
        tips: ['Bring recent X-rays or MRI reports', 'Compare with earlier imaging to show progression'],
      },
      {
        question: 'Is there any deformity or malalignment of the affected bone?',
        whyItMatters: 'Malunion with deformity is rated based on severity of angulation or shortening',
        tips: ['Document any visible deformity', 'Note if the bone healed in an abnormal position'],
      },
      {
        question: 'What functional limitations result from the bone condition?',
        whyItMatters: 'Functional impact on the affected joint or limb determines the overall disability picture',
        tips: ['Describe limitations in weight-bearing, lifting, or movement', 'Mention if you use assistive devices'],
      },
      {
        question: 'Is there a leg length discrepancy?',
        whyItMatters: 'Shortening of a lower extremity from bone conditions is separately ratable',
        tips: ['Get measured if you suspect one leg is shorter', 'Mention any compensatory gait changes or back pain'],
      },
    ],
    whatDeterminesRating: [
      'X-ray evidence of the bone condition (nonunion, malunion, bone disease)',
      'Severity of deformity or malalignment',
      'Functional limitation of the affected extremity or joint',
      'Leg length discrepancy if applicable',
      'Whether there is loose motion or need for a brace (nonunion)',
    ],
    commonMistakes: [
      'Not getting updated imaging to document current condition',
      'Failing to report leg length discrepancy as a separate ratable condition',
      'Not connecting secondary conditions (gait changes, back pain) to the bone condition',
      'Overlooking the difference between nonunion (higher rating) and malunion ratings',
    ],
    prepTips: [
      'Bring recent X-rays or imaging reports',
      'If you have a leg length discrepancy, get it measured and documented',
      'Document how the condition affects weight-bearing, walking, and daily activities',
      'Note any secondary conditions caused by the bone problem (altered gait, compensatory pain)',
    ],
  },

  // Elbow and Forearm Conditions DBQ
  {
    id: 'elbow-forearm',
    formNumber: '21-0960M-4',
    name: 'Elbow and Forearm Conditions',
    conditionsCovered: ['Tennis elbow (lateral epicondylitis)', 'Golfer\'s elbow (medial epicondylitis)', 'Elbow fractures', 'Elbow arthritis', 'Limited elbow motion'],
    diagnosticCodes: ['5205-5213'],
    keyQuestions: [
      {
        question: 'What is the range of motion for flexion, extension, pronation, and supination?',
        whyItMatters: 'Each movement is rated separately — flexion/extension under one code, pronation/supination under another',
        tips: ['Stop at the point of pain for each movement', 'Normal flexion is 145 degrees, full extension is 0 degrees'],
      },
      {
        question: 'Is this the dominant or non-dominant arm?',
        whyItMatters: 'Dominant arm (major) receives higher rating percentages than non-dominant (minor)',
        tips: ['Clarify which hand is your dominant hand at the start of the exam'],
      },
      {
        question: 'Is there pain with repetitive use, and does motion decrease after repetition?',
        whyItMatters: 'Additional functional loss after repetitive use can support a higher rating',
        tips: ['Report honestly if movements become more painful or limited with repetition'],
      },
      {
        question: 'Is there any ankylosis (complete fixation) of the elbow?',
        whyItMatters: 'Ankylosis is rated at higher percentages than limitation of motion',
        tips: ['If your elbow is fused or cannot move at all, ensure this is documented'],
      },
    ],
    whatDeterminesRating: [
      'Limitation of flexion and extension (rated under DC 5206/5207)',
      'Limitation of pronation and supination (rated under DC 5213)',
      'Whether the dominant or non-dominant arm is affected',
      'Presence of ankylosis and the angle of fixation',
      'Additional functional loss from pain, weakness, fatigue after repetitive use',
      'Flare-ups and their impact on elbow function',
    ],
    commonMistakes: [
      'Not realizing flexion, extension, and pronation/supination can be rated separately',
      'Failing to identify dominant vs non-dominant arm',
      'Pushing through pain during range of motion measurements',
      'Not describing the impact of repetitive motion on elbow function',
    ],
    prepTips: [
      'Know your dominant hand and make sure the examiner records it',
      'Avoid pain medication before the exam if safely possible',
      'Describe how your elbow condition affects daily tasks (lifting, gripping, turning)',
      'Document flare-up frequency and what triggers them',
      'Bring any imaging reports (X-rays, MRI) of the elbow',
    ],
  },

  // Foot Conditions DBQ
  {
    id: 'foot',
    formNumber: '21-0960M-5',
    name: 'Foot Conditions (Including Flatfoot)',
    conditionsCovered: ['Pes planus (flatfoot)', 'Plantar fasciitis', 'Hallux valgus', 'Hammer toes', 'Metatarsalgia'],
    diagnosticCodes: ['5276-5284'],
    keyQuestions: [
      {
        question: 'Is there pain on weight-bearing or manipulation of the feet?',
        whyItMatters: 'Pain on use is a key criterion for pes planus ratings and other foot condition ratings',
        tips: ['Describe pain with standing, walking, and direct pressure', 'Note how long you can stand before pain begins'],
      },
      {
        question: 'Does the Veteran use orthotics, inserts, or special shoes?',
        whyItMatters: 'Need for orthotic devices indicates severity and whether conservative treatment helps',
        tips: ['Bring your orthotics or special shoes to the exam', 'Mention if orthotics help or do not relieve symptoms'],
      },
      {
        question: 'Is there pronation, inward bowing of the Achilles tendon, or characteristic calluses?',
        whyItMatters: 'These are specific criteria for higher pes planus ratings (severe and pronounced)',
        tips: ['Point out any calluses to the examiner', 'Mention if the Achilles tendon bows inward when standing'],
      },
      {
        question: 'Is the condition bilateral (both feet)?',
        whyItMatters: 'Bilateral pes planus is rated on a single scale that accounts for both feet; other foot conditions may be rated per foot',
        tips: ['Report symptoms in both feet even if one is worse', 'Each condition may be rated separately'],
      },
    ],
    whatDeterminesRating: [
      'For pes planus: severity level (mild, moderate, severe, pronounced) based on specific clinical findings',
      'Pain on weight-bearing and whether it is relieved by orthotics',
      'Presence of pronation, inward bowing of Achilles, characteristic calluses',
      'Whether the condition is unilateral or bilateral',
      'For hallux valgus: whether it has been operated on or is equivalent to amputation of great toe',
      'For hammer toes: number of toes affected',
    ],
    commonMistakes: [
      'Not mentioning that orthotics do not fully relieve symptoms',
      'Failing to report bilateral symptoms when both feet are affected',
      'Not pointing out characteristic calluses or Achilles tendon changes to the examiner',
      'Filing only for flatfoot when plantar fasciitis or other conditions may warrant separate ratings',
    ],
    prepTips: [
      'Bring orthotics, inserts, and special shoes to the exam',
      'Describe how far you can walk and how long you can stand before foot pain becomes limiting',
      'Point out calluses, swelling, or visible deformity to the examiner',
      'If you have multiple foot conditions, make sure each one is claimed separately',
    ],
  },

  // Hand and Finger Conditions DBQ
  {
    id: 'hand-finger',
    formNumber: '21-0960M-6',
    name: 'Hand and Finger Conditions',
    conditionsCovered: ['Trigger finger', 'Carpal tunnel (musculoskeletal component)', 'Finger ankylosis', 'Grip strength loss'],
    diagnosticCodes: ['5216-5230'],
    keyQuestions: [
      {
        question: 'What is the grip strength in each hand?',
        whyItMatters: 'Grip strength loss documents functional impairment and supports higher ratings',
        tips: ['Report honestly — do not try to demonstrate maximum grip if it causes pain', 'Note activities where grip weakness is a problem'],
      },
      {
        question: 'What is the range of motion of each affected finger?',
        whyItMatters: 'Individual finger motion limitations are rated based on specific ROM measurements',
        tips: ['Each finger is tested separately', 'Report pain at the start of movement, not the end'],
      },
      {
        question: 'What is the gap measurement between fingertip and palm during flexion?',
        whyItMatters: 'The gap distance (how close you can make a fist) is a key rating measurement',
        tips: ['Do not force your fingers closed if it causes pain', 'A gap of 1 inch or more supports a compensable rating'],
      },
      {
        question: 'How does the hand/finger condition affect daily activities and work?',
        whyItMatters: 'Functional impact on gripping, writing, typing, and manipulating objects affects the overall disability picture',
        tips: ['Describe specific tasks that are difficult or impossible', 'Mention dropping objects, difficulty with buttons, etc.'],
      },
    ],
    whatDeterminesRating: [
      'Range of motion limitation of individual fingers',
      'Gap between fingertip and proximal transverse crease of palm',
      'Whether there is ankylosis (complete fixation) of any fingers',
      'Which fingers are affected and whether it is the dominant hand',
      'Combined effect of multiple finger disabilities',
      'Grip strength and functional impairment',
    ],
    commonMistakes: [
      'Not realizing each finger can be rated separately',
      'Failing to identify dominant vs non-dominant hand for proper rating percentages',
      'Forcing a fist closed during the gap measurement test',
      'Not reporting all affected fingers — claiming only the worst one',
    ],
    prepTips: [
      'Know which is your dominant hand and confirm it with the examiner',
      'Describe specific daily tasks affected: writing, typing, buttoning clothes, opening jars',
      'Do not take pain medication before the exam if safely possible',
      'If multiple fingers are affected, make sure each one is examined and documented',
      'Bring any hand splints or adaptive devices you use',
    ],
  },

  // Hip and Thigh Conditions DBQ
  {
    id: 'hip-thigh',
    formNumber: '21-0960M-7',
    name: 'Hip and Thigh Conditions',
    conditionsCovered: ['Hip arthritis', 'Hip replacement', 'Avascular necrosis', 'Hip fracture residuals'],
    diagnosticCodes: ['5250-5255'],
    keyQuestions: [
      {
        question: 'What is the range of motion for flexion, extension, abduction, adduction, and rotation?',
        whyItMatters: 'ROM measurements determine the rating percentage for hip limitation of motion',
        tips: ['Stop at the point of pain for each movement', 'Normal hip flexion is 125 degrees, abduction is 45 degrees'],
      },
      {
        question: 'Has the Veteran had a hip replacement (prosthetic joint)?',
        whyItMatters: 'Hip replacement has a minimum 30% rating with a 100% rating for 1 year following surgery',
        tips: ['Bring surgical records', 'Note any complications or need for revision surgery'],
      },
      {
        question: 'Is there a positive Trendelenburg sign?',
        whyItMatters: 'Trendelenburg sign indicates hip abductor weakness and supports higher disability ratings',
        tips: ['Mention if your hip drops or pelvis tilts when walking or standing on one leg'],
      },
      {
        question: 'What is your weight-bearing tolerance?',
        whyItMatters: 'Inability to bear weight affects functional capacity and overall rating',
        tips: ['Describe how long you can stand, walk, or climb stairs', 'Mention use of cane, walker, or crutches'],
      },
    ],
    whatDeterminesRating: [
      'Limitation of flexion (DC 5252) and extension (DC 5251)',
      'Limitation of abduction, adduction, or rotation (DC 5253)',
      'Presence of ankylosis (DC 5250)',
      'Prosthetic hip joint status (DC 5054) — minimum 30% after 1-year post-surgical 100%',
      'Flail joint or malunion of the femur',
      'Additional functional loss from pain, weakness, and flare-ups',
    ],
    commonMistakes: [
      'Not knowing that different hip movements can be rated under separate diagnostic codes',
      'Pushing through pain during range of motion testing',
      'Not claiming the 1-year 100% temporary rating after hip replacement surgery',
      'Failing to report use of assistive devices (cane, walker) as evidence of severity',
    ],
    prepTips: [
      'Avoid pain medication before the exam if safely possible',
      'Bring surgical records if you have had a hip replacement',
      'Describe how the hip condition affects walking, sitting, climbing stairs, and sleeping',
      'Document flare-up frequency, triggers, and how much worse your hip becomes during flare-ups',
      'If you use a cane or walker, bring it and explain when and why you need it',
    ],
  },

  // Muscle Injuries DBQ
  {
    id: 'muscle-injuries',
    formNumber: '21-0960M-8',
    name: 'Muscle Injuries',
    conditionsCovered: ['Through-and-through wounds', 'Muscle group injuries', 'Shrapnel/fragment wounds'],
    diagnosticCodes: ['5301-5329'],
    keyQuestions: [
      {
        question: 'Which muscle group is affected?',
        whyItMatters: 'Each muscle group (I through XXIII) has its own diagnostic code and rating criteria',
        tips: ['The examiner should identify the specific muscle group(s) involved', 'Multiple muscle groups can be rated separately'],
      },
      {
        question: 'Are the cardinal signs of muscle disability present (weakness, fatigue-pain, incoordination, uncertainty of movement)?',
        whyItMatters: 'These four cardinal signs determine the severity level (slight, moderate, moderately severe, or severe)',
        tips: ['Report all four symptoms even if some are mild', 'Describe how each sign manifests during activity'],
      },
      {
        question: 'Is there measurable tissue loss or muscle substance loss?',
        whyItMatters: 'Visible or palpable loss of muscle mass supports higher severity ratings',
        tips: ['Compare the injured side to the uninjured side', 'Mention any visible indentation or atrophy'],
      },
      {
        question: 'Is there scar adhesion to bone or deep tissue?',
        whyItMatters: 'Adherent scars that limit underlying muscle function can warrant additional rating consideration',
        tips: ['Report if the scar feels stuck or pulls during movement', 'Scars may also be rated separately'],
      },
    ],
    whatDeterminesRating: [
      'Specific muscle group affected (DC 5301-5329)',
      'Severity level: slight, moderate, moderately severe, or severe',
      'Presence of cardinal signs of muscle disability',
      'Amount of tissue loss and muscle substance loss',
      'Type and velocity of the wounding mechanism (bullet, shrapnel, etc.)',
      'Whether there was through-and-through penetration',
    ],
    commonMistakes: [
      'Not identifying all affected muscle groups for separate ratings',
      'Failing to describe all four cardinal signs of muscle disability',
      'Not documenting the original injury mechanism (important for severity classification)',
      'Overlooking separately ratable scars from the muscle injury',
      'Not comparing the injured limb to the uninjured limb for muscle loss documentation',
    ],
    prepTips: [
      'Bring service records documenting the original injury (wound description, treatment)',
      'Describe all four cardinal signs: weakness, fatigue-pain, incoordination, and uncertainty of movement',
      'Point out any visible tissue loss or atrophy compared to the uninjured side',
      'If you have retained fragments or shrapnel, mention their location and any symptoms they cause',
      'Document any scars from the injury — they may warrant separate ratings',
    ],
  },

  // Neck (Cervical Spine) Conditions DBQ
  {
    id: 'neck-cervical',
    formNumber: '21-0960M-10',
    name: 'Neck (Cervical Spine) Conditions',
    conditionsCovered: ['Cervical strain', 'Cervical degenerative disc disease', 'Cervical radiculopathy'],
    diagnosticCodes: ['5235-5243'],
    keyQuestions: [
      {
        question: 'What is the range of motion of the cervical spine?',
        whyItMatters: 'ROM measurements (forward flexion, extension, lateral flexion, rotation) directly determine the rating percentage',
        tips: ['Stop at the point of pain for each movement', 'Normal forward flexion is 45 degrees, combined ROM is 340 degrees'],
      },
      {
        question: 'Are there flare-ups that affect cervical spine function?',
        whyItMatters: 'Flare-ups can warrant a higher rating if they cause additional functional loss beyond baseline',
        tips: ['Describe frequency, duration, severity, and triggers', 'Estimate how much MORE limited your neck is during a flare-up'],
      },
      {
        question: 'Is there radiculopathy to the upper extremities?',
        whyItMatters: 'Cervical radiculopathy (shooting pain, numbness, or weakness in arms/hands) is rated SEPARATELY from the neck condition',
        tips: ['Report any numbness, tingling, or weakness in arms or hands', 'Note which arm is affected and whether symptoms are constant or intermittent'],
      },
      {
        question: 'Are there IVDS incapacitating episodes requiring prescribed bed rest?',
        whyItMatters: 'Incapacitating episodes from intervertebral disc syndrome can provide an alternative, potentially higher rating',
        tips: ['Episodes must involve bed rest prescribed by a physician', 'Document total weeks of incapacitating episodes over the past 12 months'],
      },
    ],
    whatDeterminesRating: [
      'Forward flexion of the cervical spine (key measurement)',
      'Combined range of motion of the cervical spine',
      'Whether there is muscle spasm or guarding severe enough to cause abnormal gait or spinal contour',
      'Presence of cervical ankylosis (favorable or unfavorable)',
      'IVDS incapacitating episodes (alternative rating formula)',
      'Radiculopathy rated separately under peripheral nerve codes',
    ],
    commonMistakes: [
      'Pushing through pain during cervical ROM testing',
      'Not reporting radiculopathy symptoms in the arms as a separate condition',
      'Failing to describe flare-ups and their additional functional impact',
      'Not mentioning muscle spasm that affects head posture or gait',
      'Taking pain medication before the exam, which masks true limitation',
    ],
    prepTips: [
      'Do not take pain medication before the exam if safely possible',
      'Document flare-up frequency, triggers, and estimated additional ROM loss during flare-ups',
      'Report any arm numbness, tingling, or weakness — this qualifies for a separate radiculopathy rating',
      'Bring MRI or imaging reports showing disc disease or nerve compression',
      'If your doctor has ever prescribed bed rest for your neck, bring documentation',
    ],
  },

  // Osteomyelitis DBQ
  {
    id: 'osteomyelitis',
    formNumber: '21-0960M-11',
    name: 'Osteomyelitis',
    conditionsCovered: ['Acute osteomyelitis', 'Chronic osteomyelitis', 'Bone infection'],
    diagnosticCodes: ['5000'],
    keyQuestions: [
      {
        question: 'Is there active drainage from the affected bone?',
        whyItMatters: 'Active drainage or a draining sinus tract is a key criterion for higher osteomyelitis ratings',
        tips: ['Document any wound drainage, its frequency, and character', 'Photograph drainage if present before the exam'],
      },
      {
        question: 'Is there evidence of involucrum (new bone formation) or sequestrum (dead bone)?',
        whyItMatters: 'These pathological findings indicate chronic active osteomyelitis and support higher ratings',
        tips: ['Bring recent imaging (X-ray, CT, MRI) showing bone involvement', 'Ask your treating physician to document these findings'],
      },
      {
        question: 'How frequently do episodes of active infection occur?',
        whyItMatters: 'Frequency of active episodes directly affects the rating — more frequent episodes warrant higher ratings',
        tips: ['Track every episode with dates, symptoms, and treatment', 'Include episodes treated with antibiotics even without hospitalization'],
      },
      {
        question: 'Which bone is affected and is there associated joint or limb impairment?',
        whyItMatters: 'The affected bone location determines functional impact, and associated joint problems may be rated separately',
        tips: ['Report any joint stiffness, limb weakness, or functional limitation related to the infected bone'],
      },
    ],
    whatDeterminesRating: [
      'Whether osteomyelitis is active or inactive',
      'Presence of active drainage or draining sinus tract',
      'Frequency of episodes of active infection',
      'Evidence of involucrum or sequestrum on imaging',
      'Associated joint or limb functional impairment',
    ],
    commonMistakes: [
      'Not documenting the frequency of active infection episodes over time',
      'Failing to get updated imaging showing current bone status',
      'Not reporting drainage or sinus tract issues to the examiner',
      'Overlooking secondary joint or limb problems caused by the osteomyelitis',
    ],
    prepTips: [
      'Bring imaging reports (X-ray, CT, or MRI) showing the bone condition',
      'Create a log of every episode of active infection with dates and treatments',
      'Document any drainage, its frequency, and any wound care required',
      'Report associated functional limitations in the affected limb or joint',
    ],
  },

  // Shoulder and Arm Conditions DBQ
  {
    id: 'shoulder-arm',
    formNumber: '21-0960M-12',
    name: 'Shoulder and Arm Conditions',
    conditionsCovered: ['Rotator cuff tear/injury', 'Shoulder impingement', 'Frozen shoulder (adhesive capsulitis)', 'Labral tears', 'Shoulder arthritis'],
    diagnosticCodes: ['5200-5203'],
    keyQuestions: [
      {
        question: 'What is the range of motion for flexion and abduction?',
        whyItMatters: 'Shoulder ROM, especially arm elevation (flexion/abduction), directly determines the rating percentage',
        tips: ['Stop at the point of pain', 'Normal flexion and abduction are both 180 degrees', 'Key thresholds are at shoulder level (90 degrees), midway (45 degrees), and 25 degrees from side'],
      },
      {
        question: 'Is this the dominant or non-dominant arm?',
        whyItMatters: 'The dominant arm (major) receives higher rating percentages at every level',
        tips: ['Clearly state which is your dominant hand at the start of the exam'],
      },
      {
        question: 'Are there signs of impingement or instability/dislocation?',
        whyItMatters: 'Impingement and recurrent dislocation/instability can be rated under separate diagnostic codes',
        tips: ['Report any history of dislocations, subluxations, or shoulder popping out', 'Describe any catching or impingement symptoms'],
      },
      {
        question: 'Is there additional functional loss after repetitive use or during flare-ups?',
        whyItMatters: 'Post-repetitive-use pain and flare-ups can support a higher effective rating',
        tips: ['Describe what happens after repeated overhead reaching or lifting', 'Estimate ROM loss during flare-ups'],
      },
    ],
    whatDeterminesRating: [
      'Limitation of arm motion (flexion/abduction) relative to key thresholds: shoulder level, midway, 25 degrees from side',
      'Whether the dominant or non-dominant arm is affected',
      'Recurrent dislocation or subluxation (DC 5202)',
      'Presence of ankylosis (DC 5200)',
      'Additional functional loss from pain, flare-ups, and repetitive use',
      'Impingement or crepitus affecting function',
    ],
    commonMistakes: [
      'Pushing through pain to demonstrate full range of motion',
      'Not reporting the dominant arm correctly',
      'Failing to mention recurrent dislocations or subluxation episodes',
      'Not describing flare-ups and their impact on shoulder function',
      'Testing on a good day — try to schedule during typical or worse-than-average symptoms',
    ],
    prepTips: [
      'Confirm your dominant hand with the examiner at the start',
      'Do not take pain medication before the exam if safely possible',
      'Document flare-up frequency, triggers, and estimated ROM loss during flare-ups',
      'Bring MRI or imaging reports showing rotator cuff or labral pathology',
      'Describe specific functional limitations: reaching overhead, lifting, carrying, dressing',
    ],
  },

  // TMJ Disorders DBQ
  {
    id: 'tmj-disorders',
    formNumber: '21-0960M-13',
    name: 'Temporomandibular Joint (TMJ) Conditions',
    conditionsCovered: ['TMJ dysfunction', 'Jaw clicking/locking', 'Bruxism residuals'],
    diagnosticCodes: ['9905'],
    keyQuestions: [
      {
        question: 'What is the inter-incisal range of motion (how wide can you open your mouth)?',
        whyItMatters: 'Inter-incisal distance directly determines the rating percentage — key thresholds are at 40mm, 30mm, 20mm, and 10mm',
        tips: ['Open only as wide as comfortable — stop at pain', 'Normal opening is approximately 40-50mm'],
      },
      {
        question: 'What is the lateral excursion (side-to-side jaw movement)?',
        whyItMatters: 'Limited lateral excursion (less than 4mm) warrants a 10% rating for each affected direction',
        tips: ['Move your jaw side to side and report where pain or limitation begins'],
      },
      {
        question: 'Is there pain on jaw motion?',
        whyItMatters: 'Painful motion supports the rating and documents functional impairment',
        tips: ['Describe pain with chewing, talking, and yawning', 'Note if pain radiates to the ear, temple, or neck'],
      },
      {
        question: 'Are there diet restrictions due to the jaw condition?',
        whyItMatters: 'Inability to eat certain foods demonstrates functional limitation and severity',
        tips: ['List foods you cannot eat (hard, chewy, or foods requiring wide opening)', 'Mention if you are limited to soft foods'],
      },
    ],
    whatDeterminesRating: [
      'Inter-incisal range of motion: 0-10mm (40%), 11-20mm (30%), 21-30mm (20%), 31-40mm (10%)',
      'Lateral excursion: 0-4mm range warrants 10% per affected side',
      'Pain on motion and functional impact on chewing and speaking',
      'Whether the condition is related to dental trauma in service',
    ],
    commonMistakes: [
      'Forcing the jaw open wider than comfortable during the measurement',
      'Not reporting lateral excursion limitation — only focusing on opening distance',
      'Failing to describe diet modifications and impact on eating',
      'Not connecting TMJ to in-service dental trauma or bruxism from stress/PTSD',
    ],
    prepTips: [
      'Do not force your jaw open — let the examiner measure your comfortable maximum opening',
      'Describe specific foods you can no longer eat due to jaw limitations',
      'Document clicking, locking, or popping episodes and their frequency',
      'If TMJ is related to bruxism from PTSD or service-related stress, make that connection in your claim',
    ],
  },

  // Wrist Conditions DBQ
  {
    id: 'wrist',
    formNumber: '21-0960M-15',
    name: 'Wrist Conditions',
    conditionsCovered: ['Carpal tunnel syndrome (musculoskeletal)', 'Wrist fracture residuals', 'De Quervain\'s tenosynovitis', 'Wrist arthritis'],
    diagnosticCodes: ['5214-5215'],
    keyQuestions: [
      {
        question: 'What is the range of motion for dorsiflexion (extension) and palmar flexion?',
        whyItMatters: 'ROM measurements determine limitation of motion ratings for the wrist',
        tips: ['Stop at the point of pain', 'Normal dorsiflexion is 70 degrees, palmar flexion is 80 degrees'],
      },
      {
        question: 'Is there grip weakness or loss of hand strength?',
        whyItMatters: 'Grip weakness from wrist conditions documents functional impairment beyond ROM alone',
        tips: ['Report difficulties with gripping, twisting, and lifting objects', 'Mention dropping items'],
      },
      {
        question: 'Is there ankylosis (complete fixation) of the wrist?',
        whyItMatters: 'Ankylosis (favorable or unfavorable) is rated at higher percentages than limitation of motion',
        tips: ['If your wrist is fused or surgically fixed in position, ensure the examiner documents the angle'],
      },
      {
        question: 'Is this the dominant hand?',
        whyItMatters: 'Dominant hand (major) ratings are higher than non-dominant (minor) for wrist conditions',
        tips: ['Clarify your dominant hand with the examiner at the start'],
      },
    ],
    whatDeterminesRating: [
      'Limitation of dorsiflexion and palmar flexion',
      'Whether ankylosis is present and at what angle (favorable vs unfavorable)',
      'Dominant vs non-dominant hand for rating percentages',
      'Additional functional loss from pain, weakness, and repetitive use',
      'Flare-ups and their impact on wrist function',
    ],
    commonMistakes: [
      'Not identifying dominant vs non-dominant hand for proper rating',
      'Pushing through pain during wrist ROM testing',
      'Not mentioning grip weakness and its impact on daily activities',
      'Failing to report flare-ups and repetitive use impact on wrist function',
      'Not claiming carpal tunnel separately under peripheral nerve codes if neurological symptoms exist',
    ],
    prepTips: [
      'Confirm your dominant hand with the examiner',
      'Avoid pain medication before the exam if safely possible',
      'Describe how the wrist condition affects daily tasks: writing, typing, cooking, lifting',
      'If you have numbness or tingling (neurological symptoms), mention this — it may warrant a separate peripheral nerve rating',
      'Bring X-rays or imaging showing fracture residuals, arthritis, or other pathology',
    ],
  },

  // NEUROLOGICAL (Headaches/Migraines already exist) ─────
  {
    id: 'als',
    formNumber: '21-0960C-1',
    name: 'Amyotrophic Lateral Sclerosis (ALS)',
    conditionsCovered: ['ALS', 'Lou Gehrig\'s disease'],
    diagnosticCodes: ['8017'],
    keyQuestions: [
      {
        question: 'Has ALS been diagnosed by a qualified neurologist?',
        whyItMatters: 'ALS is automatically rated 100% for veterans',
        tips: ['Bring neurologist diagnosis confirmation'],
      },
      {
        question: 'What is the current stage of symptom progression?',
        whyItMatters: 'Documents functional limitations for special monthly compensation',
        tips: ['Describe all affected body systems'],
      },
      {
        question: 'Does the Veteran require aid and attendance?',
        whyItMatters: 'May qualify for additional special monthly compensation',
        tips: ['Document need for help with daily activities'],
      },
    ],
    whatDeterminesRating: [
      'ALS diagnosis = automatic 100% rating',
      'Presumptive service connection for all veterans',
      'Special monthly compensation based on functional loss',
      'Aid and attendance needs',
    ],
    commonMistakes: [
      'Not knowing ALS is presumptive for all veterans',
      'Failing to apply for special monthly compensation',
      'Not documenting progressive functional decline',
      'Delay in filing after diagnosis',
    ],
    prepTips: [
      'File immediately upon diagnosis — ALS is 100% presumptive',
      'Bring neurologist diagnostic report',
      'Apply for special monthly compensation simultaneously',
      'Document all functional limitations for SMC evaluation',
    ],
  },
  {
    id: 'cns-neuromuscular',
    formNumber: '21-0960C-2',
    name: 'Central Nervous System and Neuromuscular Diseases',
    conditionsCovered: ['Myasthenia gravis', 'Cerebellar disease', 'Huntington\'s chorea', 'Syringomyelia'],
    diagnosticCodes: ['8000-8025'],
    keyQuestions: [
      {
        question: 'What is the current level of neurological impairment?',
        whyItMatters: 'Impairment level directly determines rating',
        tips: ['Describe balance, coordination, speech, and swallowing ability'],
      },
      {
        question: 'Are assistive devices required?',
        whyItMatters: 'Need for assistive devices indicates severity',
        tips: ['Bring all devices you use (cane, walker, wheelchair)'],
      },
      {
        question: 'Is there any bowel or bladder dysfunction?',
        whyItMatters: 'Bowel/bladder dysfunction rated separately',
        tips: ['Report incontinence and frequency with specifics'],
      },
    ],
    whatDeterminesRating: [
      'Level of neurological impairment',
      'Impact on mobility and balance',
      'Speech and swallowing function',
      'Need for assistive devices',
      'Bowel/bladder dysfunction (rated separately)',
    ],
    commonMistakes: [
      'Not bringing assistive devices to the exam',
      'Minimizing balance and coordination problems',
      'Forgetting to mention bowel/bladder issues',
      'Not describing impact on daily activities',
    ],
    prepTips: [
      'Bring all assistive devices you use',
      'Describe your worst days in detail',
      'Document falls and near-falls with dates',
      'Report all neurological symptoms including subtle ones',
    ],
  },
  {
    id: 'cranial-nerves',
    formNumber: '21-0960C-3',
    name: 'Cranial Nerve Conditions',
    conditionsCovered: ['Trigeminal neuralgia', 'Bell\'s palsy', 'Other cranial nerve palsies'],
    diagnosticCodes: ['8205-8412'],
    keyQuestions: [
      {
        question: 'Which cranial nerve(s) are affected?',
        whyItMatters: 'Each cranial nerve has its own diagnostic code and rating',
        tips: ['Know which nerve(s) from your medical records'],
      },
      {
        question: 'Is the paralysis complete or incomplete?',
        whyItMatters: 'Complete paralysis receives higher rating than incomplete',
        tips: ['Describe all sensory and motor deficits'],
      },
      {
        question: 'What functional deficits are present?',
        whyItMatters: 'Functional impact determines severity rating',
        tips: ['Describe impact on eating, speaking, facial expression, vision'],
      },
    ],
    whatDeterminesRating: [
      'Specific cranial nerve affected',
      'Complete vs incomplete paralysis',
      'Sensory vs motor involvement',
      'Unilateral vs bilateral',
      'Functional impact on eating, speaking, vision',
    ],
    commonMistakes: [
      'Not identifying the specific cranial nerve',
      'Failing to describe functional impact',
      'Not distinguishing between sensory and motor loss',
      'Forgetting to mention pain episodes (trigeminal neuralgia)',
    ],
    prepTips: [
      'Know which cranial nerve(s) are affected from records',
      'Describe specific functional limitations clearly',
      'For trigeminal neuralgia, track pain episode frequency',
      'Bring neurologist evaluation reports',
    ],
  },
  {
    id: 'diabetic-neuropathy',
    formNumber: '21-0960C-4',
    name: 'Diabetic Peripheral Neuropathy',
    conditionsCovered: ['Diabetic sensory neuropathy', 'Diabetic motor neuropathy', 'Peripheral neuropathy of extremities'],
    diagnosticCodes: ['8520-8730'],
    keyQuestions: [
      {
        question: 'Which nerves and extremities are affected?',
        whyItMatters: 'Each nerve and extremity is rated separately',
        tips: ['Report all four extremities if affected'],
      },
      {
        question: 'What is the severity — mild, moderate, or severe?',
        whyItMatters: 'Severity classification directly sets the rating',
        tips: ['Describe numbness, tingling, burning, and weakness specifically'],
      },
      {
        question: 'Are there EMG/nerve conduction study results?',
        whyItMatters: 'Objective testing confirms diagnosis and severity',
        tips: ['Bring EMG/NCS reports if available'],
      },
      {
        question: 'How does neuropathy affect gait and balance?',
        whyItMatters: 'Lower extremity neuropathy affecting gait increases severity',
        tips: ['Report falls, tripping, and difficulty with stairs'],
      },
    ],
    whatDeterminesRating: [
      'Which specific nerve(s) affected',
      'Severity: mild, moderate, moderately severe, or severe',
      'Complete vs incomplete paralysis',
      'Sensory vs motor involvement',
      'Each extremity rated separately',
    ],
    commonMistakes: [
      'Not claiming each extremity separately',
      'Minimizing symptoms',
      'Not getting EMG/nerve conduction studies',
      'Forgetting to link to diabetes as secondary condition',
    ],
    prepTips: [
      'Get EMG/nerve conduction studies before the exam',
      'File as secondary to diabetes if applicable',
      'Report symptoms in each extremity separately',
      'Describe impact on walking, balance, and daily tasks',
    ],
  },
  {
    id: 'fibromyalgia',
    formNumber: '21-0960C-5',
    name: 'Fibromyalgia',
    conditionsCovered: ['Fibromyalgia', 'Chronic widespread pain'],
    diagnosticCodes: ['5025'],
    keyQuestions: [
      {
        question: 'Are symptoms widespread and affecting multiple body areas?',
        whyItMatters: 'Widespread musculoskeletal pain is required for diagnosis',
        tips: ['Document pain in all four quadrants of the body'],
      },
      {
        question: 'Are symptoms constant, nearly constant, or episodic?',
        whyItMatters: 'Frequency directly determines rating level',
        tips: ['Describe typical week vs flare-up week'],
      },
      {
        question: 'Are symptoms refractory to therapy?',
        whyItMatters: 'Refractory symptoms warrant higher (40%) rating',
        tips: ['List all treatments tried and their effectiveness'],
      },
      {
        question: 'What are the associated symptoms?',
        whyItMatters: 'Fatigue, sleep disturbance, cognitive issues support rating',
        tips: ['Report ALL associated symptoms including "fibro fog"'],
      },
    ],
    whatDeterminesRating: [
      '10%: Symptoms that require continuous medication for control',
      '20%: Episodic, with exacerbations often precipitated by stress',
      '40%: Constant or nearly constant, refractory to therapy',
      'Widespread musculoskeletal pain and tender points',
      'Associated fatigue, sleep disturbance, stiffness',
    ],
    commonMistakes: [
      'Not documenting all trigger/tender points',
      'Minimizing fatigue and cognitive symptoms',
      'Not listing all treatments tried',
      'Failing to describe impact on daily functioning',
    ],
    prepTips: [
      'Keep a symptom diary for at least 3 months',
      'List all treatments tried and results',
      'Describe cognitive symptoms (memory, concentration)',
      'Document impact on work, sleep, and daily activities',
    ],
  },
  {
    id: 'multiple-sclerosis',
    formNumber: '21-0960C-6',
    name: 'Multiple Sclerosis (MS)',
    conditionsCovered: ['Relapsing-remitting MS', 'Primary progressive MS', 'Secondary progressive MS'],
    diagnosticCodes: ['8018'],
    keyQuestions: [
      {
        question: 'What is the frequency of exacerbations?',
        whyItMatters: 'Exacerbation frequency is a key rating factor',
        tips: ['Document every exacerbation with dates and duration'],
      },
      {
        question: 'What residual disability exists between episodes?',
        whyItMatters: 'Residual disability between relapses increases rating',
        tips: ['Describe your baseline between attacks'],
      },
      {
        question: 'What functional limitations are present?',
        whyItMatters: 'Overall functional impairment determines rating',
        tips: ['Describe mobility, vision, bowel/bladder, and cognitive issues'],
      },
    ],
    whatDeterminesRating: [
      'Minimum 30% rating for MS diagnosis',
      'Frequency and severity of exacerbations',
      'Residual disability between episodes',
      'Functional limitations (mobility, vision, cognition)',
      'Bowel/bladder dysfunction (rated separately)',
    ],
    commonMistakes: [
      'Not documenting every exacerbation',
      'Failing to describe residual deficits between episodes',
      'Not reporting cognitive symptoms',
      'Forgetting to claim bowel/bladder dysfunction separately',
    ],
    prepTips: [
      'Keep detailed records of every exacerbation',
      'Describe your baseline functioning between attacks',
      'Report ALL symptoms including cognitive and fatigue',
      'Bring neurologist reports and MRI results',
    ],
  },
  {
    id: 'narcolepsy',
    formNumber: '21-0960C-7',
    name: 'Narcolepsy',
    conditionsCovered: ['Narcolepsy', 'Cataplexy', 'Excessive daytime sleepiness'],
    diagnosticCodes: ['8108'],
    keyQuestions: [
      {
        question: 'How frequent are sleep attacks?',
        whyItMatters: 'Frequency of sleep attacks determines rating level',
        tips: ['Track every sleep attack with date, time, and duration'],
      },
      {
        question: 'Are there cataplexy episodes?',
        whyItMatters: 'Cataplexy adds to severity assessment',
        tips: ['Describe triggers and frequency of muscle weakness episodes'],
      },
      {
        question: 'How does narcolepsy affect driving and work?',
        whyItMatters: 'Functional impact on employment is critical',
        tips: ['Report if you can no longer drive or had to change jobs'],
      },
    ],
    whatDeterminesRating: [
      'Frequency of minor seizure-like sleep attacks',
      'Frequency of major attacks with cataplexy',
      'Impact on ability to drive and work',
      'Effectiveness of medication',
      'Residual functional impairment',
    ],
    commonMistakes: [
      'Not tracking sleep attack frequency',
      'Failing to document cataplexy episodes',
      'Not reporting driving restrictions',
      'Minimizing impact on employment',
    ],
    prepTips: [
      'Keep a daily log of sleep attacks for 3+ months',
      'Document cataplexy episodes with triggers',
      'Bring sleep study results',
      'Report all medications and their effectiveness',
    ],
  },
  {
    id: 'parkinsons',
    formNumber: '21-0960C-8a',
    name: 'Parkinson\'s Disease',
    conditionsCovered: ['Parkinson\'s disease', 'Parkinsonism'],
    diagnosticCodes: ['8004'],
    keyQuestions: [
      {
        question: 'What is the severity of tremor?',
        whyItMatters: 'Tremor severity affects functional assessment',
        tips: ['Describe which limbs are affected and impact on daily tasks'],
      },
      {
        question: 'Is there rigidity or bradykinesia?',
        whyItMatters: 'Motor symptoms determine overall impairment',
        tips: ['Describe stiffness and slowness of movement'],
      },
      {
        question: 'Is there postural instability?',
        whyItMatters: 'Balance problems indicate advanced disease',
        tips: ['Report falls and near-falls with frequency'],
      },
      {
        question: 'What impact on activities of daily living?',
        whyItMatters: 'ADL impact determines need for special monthly compensation',
        tips: ['Describe difficulty with dressing, eating, hygiene'],
      },
    ],
    whatDeterminesRating: [
      'Minimum 30% rating for Parkinson\'s diagnosis',
      'Severity of motor symptoms (tremor, rigidity, bradykinesia)',
      'Postural instability and fall risk',
      'Impact on activities of daily living',
      'Need for aid and attendance',
    ],
    commonMistakes: [
      'Not applying for presumptive service connection if applicable',
      'Failing to document progressive decline',
      'Not applying for special monthly compensation',
      'Minimizing daily living difficulties',
    ],
    prepTips: [
      'Bring neurologist evaluation reports',
      'Document ADL difficulties with specific examples',
      'Report all motor and non-motor symptoms',
      'Apply for special monthly compensation if applicable',
    ],
  },
  {
    id: 'peripheral-nerves',
    formNumber: '21-0960C-9',
    name: 'Peripheral Nerve Conditions (Not Diabetic)',
    conditionsCovered: ['Sciatic nerve', 'Ulnar nerve', 'Median nerve', 'Peroneal nerve', 'Other peripheral neuropathies'],
    diagnosticCodes: ['8510-8730'],
    keyQuestions: [
      {
        question: 'Which specific nerve(s) are affected?',
        whyItMatters: 'Each nerve has its own diagnostic code and rating schedule',
        tips: ['Know specific nerve from EMG/NCS results'],
      },
      {
        question: 'Is the paralysis complete or incomplete?',
        whyItMatters: 'Complete paralysis receives much higher rating',
        tips: ['Describe all sensory and motor deficits'],
      },
      {
        question: 'What are the EMG/nerve conduction study results?',
        whyItMatters: 'Objective testing confirms nerve involvement and severity',
        tips: ['Bring EMG/NCS reports — these are critical evidence'],
      },
    ],
    whatDeterminesRating: [
      'Specific nerve affected',
      'Complete vs incomplete paralysis',
      'Severity: mild, moderate, moderately severe, or severe',
      'Sensory vs motor involvement',
      'Dominant vs non-dominant (for upper extremity nerves)',
    ],
    commonMistakes: [
      'Not getting EMG/nerve conduction studies',
      'Failing to identify the specific nerve',
      'Not claiming each affected nerve separately',
      'Forgetting to distinguish dominant vs non-dominant arm',
    ],
    prepTips: [
      'Get EMG/NCS testing before your exam',
      'Know which specific nerve(s) are affected',
      'Describe sensory and motor deficits separately',
      'State dominant hand for upper extremity nerve conditions',
    ],
  },
  {
    id: 'seizure-disorders',
    formNumber: '21-0960C-10',
    name: 'Seizure Disorders (Epilepsy)',
    conditionsCovered: ['Grand mal seizures', 'Petit mal seizures', 'Psychomotor epilepsy', 'Jacksonian epilepsy'],
    diagnosticCodes: ['8910-8914'],
    keyQuestions: [
      {
        question: 'What type of seizures does the Veteran have?',
        whyItMatters: 'Major (grand mal) and minor (petit mal) have different rating criteria',
        tips: ['Describe exactly what happens during a seizure'],
      },
      {
        question: 'How frequent are the seizures?',
        whyItMatters: 'Frequency directly determines rating percentage',
        tips: ['Track every seizure with date, time, and duration'],
      },
      {
        question: 'When was the last seizure?',
        whyItMatters: 'Recent seizure activity supports higher rating',
        tips: ['Bring seizure log or diary'],
      },
      {
        question: 'What medications are used and are they effective?',
        whyItMatters: 'Medication control affects rating assessment',
        tips: ['List all anti-epileptic medications and dosages'],
      },
    ],
    whatDeterminesRating: [
      'Major seizures: 1/year=20%, 1/4months=40%, 1/month=60%, 1+/month=80-100%',
      'Minor seizures: 1-2/week=40%, 5+/week=60%, 10+/week=80%',
      'Type of seizure (major vs minor)',
      'Impact on employment and driving',
      'Continuous medication requirement',
    ],
    commonMistakes: [
      'Not keeping a seizure diary',
      'Failing to document witnesses to seizures',
      'Not reporting all seizure types',
      'Minimizing post-seizure symptoms (confusion, fatigue)',
    ],
    prepTips: [
      'Keep detailed seizure diary with dates, times, and descriptions',
      'Have witness statements about seizure episodes',
      'Bring EEG and neurologist reports',
      'Document driving restrictions and employment impact',
    ],
  },

  // NUTRITIONAL ──────────────────────────────────────────
  {
    id: 'nutritional-deficiencies',
    formNumber: '21-0960H-1',
    name: 'Nutritional Deficiencies',
    conditionsCovered: ['Beriberi', 'Pellagra', 'Malnutrition residuals'],
    diagnosticCodes: ['6313-6314'],
    keyQuestions: [
      {
        question: 'What specific nutritional deficiency is present?',
        whyItMatters: 'Specific deficiency determines applicable rating criteria',
        tips: ['Bring lab results confirming the deficiency'],
      },
      {
        question: 'What symptoms result from the deficiency?',
        whyItMatters: 'Residual symptoms are rated under affected body system',
        tips: ['Describe neurological, skin, and GI symptoms'],
      },
      {
        question: 'Is treatment correcting the deficiency?',
        whyItMatters: 'Ongoing treatment need affects rating',
        tips: ['Document all supplements and dietary treatments'],
      },
    ],
    whatDeterminesRating: [
      'Specific deficiency identified',
      'Residual symptoms and organ damage',
      'Need for ongoing treatment',
      'Functional limitations from residuals',
    ],
    commonMistakes: [
      'Not bringing lab results',
      'Failing to document all residual symptoms',
      'Not linking deficiency to service conditions',
      'Assuming corrected deficiency means no rating',
    ],
    prepTips: [
      'Bring lab results showing deficiency levels',
      'Document all symptoms related to the deficiency',
      'Link to service conditions (POW, restricted diet, exposures)',
      'Describe functional impact of residual symptoms',
    ],
  },

  // OPHTHALMOLOGICAL ─────────────────────────────────────
  {
    id: 'eye-conditions',
    formNumber: '21-0960N-4',
    name: 'Eye Conditions',
    conditionsCovered: ['Glaucoma', 'Cataracts', 'Macular degeneration', 'Diabetic retinopathy', 'Visual field loss'],
    diagnosticCodes: ['6000-6092'],
    keyQuestions: [
      {
        question: 'What is the corrected visual acuity in each eye?',
        whyItMatters: 'Visual acuity measurements directly determine rating',
        tips: ['Bring recent eye exam results with best corrected acuity'],
      },
      {
        question: 'Is there visual field loss?',
        whyItMatters: 'Visual field defects are rated separately from acuity',
        tips: ['Bring visual field testing results'],
      },
      {
        question: 'Are there incapacitating episodes?',
        whyItMatters: 'Some eye conditions rate based on incapacitating episodes',
        tips: ['Document episodes requiring bed rest prescribed by doctor'],
      },
      {
        question: 'How do eye conditions affect daily activities?',
        whyItMatters: 'Functional impact supports rating determination',
        tips: ['Describe difficulty with reading, driving, and recognizing faces'],
      },
    ],
    whatDeterminesRating: [
      'Corrected visual acuity in each eye',
      'Visual field defects (contraction)',
      'Incapacitating episodes for certain conditions',
      'Combination of acuity and field loss',
      'Unilateral vs bilateral involvement',
    ],
    commonMistakes: [
      'Not bringing recent comprehensive eye exam',
      'Forgetting visual field test results',
      'Not reporting each eye separately',
      'Failing to describe functional impact',
    ],
    prepTips: [
      'Get comprehensive eye exam within 3 months of C&P exam',
      'Bring visual field test results',
      'Report acuity for each eye separately',
      'Describe specific daily activities affected by vision loss',
    ],
  },

  // PSYCHOLOGICAL (PTSD already exists) ──────────────────
  {
    id: 'eating-disorders',
    formNumber: '21-0960P-1',
    name: 'Eating Disorders',
    conditionsCovered: ['Anorexia nervosa', 'Bulimia nervosa'],
    diagnosticCodes: ['9520-9521'],
    keyQuestions: [
      {
        question: 'What is the current diagnosis?',
        whyItMatters: 'Confirms qualifying eating disorder diagnosis',
        tips: ['Bring mental health treatment records'],
      },
      {
        question: 'What is the frequency of episodes?',
        whyItMatters: 'Episode frequency and severity affect rating',
        tips: ['Track episodes with dates and descriptions'],
      },
      {
        question: 'What is the level of occupational and social impairment?',
        whyItMatters: 'Same General Rating Formula as other mental disorders',
        tips: ['Describe worst functioning, not best days'],
      },
    ],
    whatDeterminesRating: [
      'Level of occupational and social impairment',
      'Frequency and severity of episodes',
      'Hospitalization history',
      'Impact on physical health (weight, dental, cardiac)',
      'Need for continuous treatment',
    ],
    commonMistakes: [
      'Minimizing episode frequency',
      'Not reporting physical complications',
      'Failing to describe occupational impact',
      'Not bringing treatment records',
    ],
    prepTips: [
      'Track episode frequency for at least 3 months',
      'Bring all mental health and medical treatment records',
      'Describe impact on work and relationships',
      'Document any hospitalizations or ER visits',
    ],
  },
  {
    id: 'mental-disorders-other',
    formNumber: '21-0960P-2',
    name: 'Mental Disorders (Other than PTSD)',
    conditionsCovered: [
      'Major depressive disorder', 'Generalized anxiety disorder', 'Bipolar disorder',
      'OCD', 'Schizophrenia', 'Schizoaffective disorder', 'Panic disorder',
    ],
    diagnosticCodes: ['9201-9440'],
    keyQuestions: [
      {
        question: 'What level of occupational and social impairment is present?',
        whyItMatters: 'This directly determines your rating percentage',
        tips: ['Describe your WORST functioning, not your best days'],
      },
      {
        question: 'What symptoms are present?',
        whyItMatters: 'Each symptom supports the impairment level determination',
        tips: [
          'Report ALL symptoms',
          'Include sleep disturbance, concentration problems, memory issues',
          'Mention suicidal ideation if present (past or current)',
        ],
      },
      {
        question: 'How do symptoms affect work and relationships?',
        whyItMatters: 'Occupational and social impairment is the core rating factor',
        tips: ['Describe difficulty maintaining work, relationships, and daily routines'],
      },
      {
        question: 'What treatment is current?',
        whyItMatters: 'Treatment requirements support rating level',
        tips: ['List all medications, therapy frequency, and hospitalizations'],
      },
    ],
    whatDeterminesRating: [
      'Level of occupational and social impairment (same criteria as PTSD)',
      '10%: Mild symptoms controlled by medication',
      '30%: Occasional decrease in work efficiency',
      '50%: Reduced reliability and productivity',
      '70%: Deficiencies in most areas',
      '100%: Total occupational and social impairment',
    ],
    commonMistakes: [
      'Minimizing symptoms to appear "fine"',
      'Describing average days instead of worst days',
      'Not mentioning suicidal thoughts (past or present)',
      'Forgetting to report panic attacks, memory lapses, or isolation',
      'Not bringing treatment records and medication list',
    ],
    prepTips: [
      'List all symptoms with frequency and severity',
      'Describe your worst days and worst episodes',
      'Bring treatment records, medication list, and therapy notes',
      'Have examples of how mental health affects work and relationships',
      'Report hospitalizations and ER visits for mental health',
    ],
  },

  // RESPIRATORY (Sleep Apnea already exists) ─────────────
  {
    id: 'respiratory-other',
    formNumber: '21-0960L-1',
    name: 'Respiratory Conditions (Other than TB and Sleep Apnea)',
    conditionsCovered: ['Asthma', 'COPD', 'Restrictive lung disease', 'Interstitial lung disease', 'Bronchiectasis', 'Sarcoidosis'],
    diagnosticCodes: ['6600-6847'],
    keyQuestions: [
      {
        question: 'What are the pulmonary function test (PFT) results?',
        whyItMatters: 'FEV-1, FEV-1/FVC ratio, and DLCO directly determine rating',
        tips: ['Get PFTs within 3 months of exam if possible'],
      },
      {
        question: 'What medications are required?',
        whyItMatters: 'Need for inhalers, oral steroids, or oxygen affects rating',
        tips: ['List all respiratory medications including rescue vs maintenance'],
      },
      {
        question: 'How frequent are exacerbations?',
        whyItMatters: 'Frequency of attacks and ER visits support higher rating',
        tips: ['Track every exacerbation, ER visit, and steroid burst'],
      },
      {
        question: 'Is oxygen therapy required?',
        whyItMatters: 'Continuous oxygen use warrants 100% for some conditions',
        tips: ['Document oxygen prescription and usage'],
      },
    ],
    whatDeterminesRating: [
      'FEV-1 percentage predicted',
      'FEV-1/FVC ratio',
      'DLCO percentage predicted',
      'Need for systemic corticosteroids or immunosuppressive medications',
      'Frequency of physician visits for exacerbations',
      'Oxygen therapy requirement',
    ],
    commonMistakes: [
      'Not getting PFTs before the exam',
      'Using bronchodilator before PFT (pre-bronchodilator values used for rating)',
      'Not documenting exacerbation frequency',
      'Failing to bring medication list',
    ],
    prepTips: [
      'Get PFTs completed — this is the most important evidence',
      'Do NOT use bronchodilator before PFT unless instructed',
      'Track exacerbations, ER visits, and steroid courses for 12 months',
      'List all respiratory medications with dosages and frequency',
    ],
  },

  // RHEUMATOLOGICAL ──────────────────────────────────────
  {
    id: 'arthritis',
    formNumber: '21-0960M-16',
    name: 'Arthritis',
    conditionsCovered: ['Rheumatoid arthritis', 'Degenerative arthritis (osteoarthritis)', 'Gouty arthritis'],
    diagnosticCodes: ['5002-5010'],
    keyQuestions: [
      {
        question: 'Which joints are affected?',
        whyItMatters: 'Each major joint group can be rated separately',
        tips: ['Report ALL affected joints, not just the worst one'],
      },
      {
        question: 'Is there X-ray evidence of arthritis?',
        whyItMatters: 'X-ray evidence is required for degenerative arthritis rating',
        tips: ['Bring X-ray reports for all affected joints'],
      },
      {
        question: 'Are there incapacitating exacerbations?',
        whyItMatters: 'For RA: frequency of exacerbations determines rating',
        tips: ['Document flares that require bed rest or work absence'],
      },
      {
        question: 'Is there limitation of motion in affected joints?',
        whyItMatters: 'Degenerative arthritis is rated on limitation of motion',
        tips: ['Each joint measured on its own ROM criteria'],
      },
    ],
    whatDeterminesRating: [
      'Rheumatoid arthritis: active process with exacerbations',
      'Degenerative arthritis: X-ray evidence + limitation of motion',
      'Number of major joint groups affected',
      'Constitutional symptoms (weight loss, anemia) for RA',
      'Individual joint ROM limitations',
    ],
    commonMistakes: [
      'Not claiming each affected joint separately',
      'Not having X-ray evidence for osteoarthritis',
      'Failing to document incapacitating exacerbations',
      'Not reporting systemic symptoms for RA',
    ],
    prepTips: [
      'Get X-rays of all affected joints',
      'List every affected joint and its limitations',
      'Document flares with dates and duration',
      'For RA: bring lab results (RF, anti-CCP, CRP, ESR)',
    ],
  },
  {
    id: 'chronic-fatigue',
    formNumber: '21-0960Q-1',
    name: 'Chronic Fatigue Syndrome',
    conditionsCovered: ['Chronic fatigue syndrome', 'Myalgic encephalomyelitis'],
    diagnosticCodes: ['6354'],
    keyQuestions: [
      {
        question: 'Are debilitating fatigue symptoms nearly constant?',
        whyItMatters: 'Constant symptoms warrant higher (40%) rating',
        tips: ['Describe fatigue that is not relieved by rest'],
      },
      {
        question: 'What are the associated symptoms?',
        whyItMatters: 'At least 6 of 10 specified symptoms must be documented',
        tips: [
          'Report: low-grade fever, sore throat, lymph node pain, muscle/joint pain',
          'Also: generalized weakness, headaches, sleep disturbance',
          'Also: neuropsychological complaints, sensitivity to bright light',
        ],
      },
      {
        question: 'Do symptoms restrict routine daily activities?',
        whyItMatters: 'Restriction level determines between 20% and 40% rating',
        tips: ['Describe specific activities you can no longer do or must limit'],
      },
    ],
    whatDeterminesRating: [
      '10%: Symptoms controlled by continuous medication',
      '20%: Nearly constant, restrict routine activities by less than 25%',
      '40%: Nearly constant, restrict routine activities to 50-75% of pre-illness level',
      '60%: Restrict routine activities to less than 50%',
      '100%: So severe as to restrict activities almost completely',
    ],
    commonMistakes: [
      'Not documenting at least 6 of the specified associated symptoms',
      'Failing to quantify restriction of daily activities',
      'Not bringing treatment records showing ongoing care',
      'Minimizing cognitive symptoms',
    ],
    prepTips: [
      'Track daily activity levels and limitations for 3+ months',
      'Document all associated symptoms with frequency',
      'Quantify what percentage of normal activities you can maintain',
      'Bring treatment records showing continuous care',
    ],
  },
  {
    id: 'lupus-autoimmune',
    formNumber: '21-0960Q-2',
    name: 'Systemic Lupus Erythematosus and Autoimmune Diseases',
    conditionsCovered: ['SLE', 'Lupus nephritis', 'Other autoimmune conditions'],
    diagnosticCodes: ['6350'],
    keyQuestions: [
      {
        question: 'How frequent are exacerbations?',
        whyItMatters: 'Exacerbation frequency directly determines rating',
        tips: ['Track every flare with dates, duration, and symptoms'],
      },
      {
        question: 'Which organ systems are involved?',
        whyItMatters: 'Organ involvement (renal, cardiac, CNS) may warrant separate ratings',
        tips: ['Document all organ complications'],
      },
      {
        question: 'What immunosuppressive therapy is required?',
        whyItMatters: 'Immunosuppressive medication requirement affects rating',
        tips: ['List all medications including dosages and side effects'],
      },
    ],
    whatDeterminesRating: [
      'Frequency of exacerbations',
      'Organ system involvement',
      'Need for immunosuppressive therapy',
      'Joint involvement (rated like rheumatoid arthritis)',
      'Skin, renal, and CNS manifestations (may be rated separately)',
    ],
    commonMistakes: [
      'Not tracking exacerbation frequency',
      'Failing to claim organ complications separately',
      'Not documenting medication side effects',
      'Minimizing fatigue and joint symptoms',
    ],
    prepTips: [
      'Keep flare diary with dates, duration, and affected systems',
      'Bring all lab results (ANA, anti-dsDNA, complement levels)',
      'Document all organ system complications',
      'List all medications with dosages and side effects',
    ],
  },

  // SPINA BIFIDA ─────────────────────────────────────────
  {
    id: 'spina-bifida',
    formNumber: '21-0960Q-3',
    name: 'Spina Bifida',
    conditionsCovered: ['Spina bifida occulta', 'Meningocele', 'Myelomeningocele'],
    diagnosticCodes: ['8520-8540'],
    keyQuestions: [
      {
        question: 'What is the level of the spinal defect?',
        whyItMatters: 'Level of lesion determines which nerves are affected',
        tips: ['Bring MRI or surgical reports showing lesion level'],
      },
      {
        question: 'What neurological deficits are present?',
        whyItMatters: 'Each neurological deficit rated under specific nerve code',
        tips: ['Report motor and sensory deficits in all affected areas'],
      },
      {
        question: 'Is there bladder or bowel dysfunction?',
        whyItMatters: 'Bladder/bowel dysfunction rated separately and can add significant percentage',
        tips: ['Report incontinence, catheterization needs, and frequency'],
      },
      {
        question: 'What are the mobility limitations?',
        whyItMatters: 'Mobility impairment affects overall rating and SMC eligibility',
        tips: ['Describe use of wheelchair, braces, or other devices'],
      },
    ],
    whatDeterminesRating: [
      'Level of spinal defect',
      'Neurological deficits (rated by nerve involvement)',
      'Bladder dysfunction (rated separately)',
      'Bowel dysfunction (rated separately)',
      'Mobility limitations and assistive device needs',
    ],
    commonMistakes: [
      'Not claiming each neurological deficit separately',
      'Failing to claim bowel and bladder dysfunction separately',
      'Not reporting all mobility limitations',
      'Missing special monthly compensation eligibility',
    ],
    prepTips: [
      'Bring MRI or surgical reports',
      'Document all neurological deficits by nerve/area',
      'Report bladder and bowel function separately',
      'Describe all assistive devices used',
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
