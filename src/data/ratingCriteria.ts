/**
 * Expanded VA Disability Rating Criteria Database
 * Based on 38 CFR Part 4 — Schedule for Rating Disabilities
 *
 * Sources:
 *   - 38 CFR Part 4, Subpart B (Schedule of Ratings)
 *   - eCFR: https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-B
 *
 * IMPORTANT: All criteria text below is a plain-language summary of the actual
 * 38 CFR rating schedule. Consult the full regulatory text for authoritative language.
 * Rating decisions are made by VA raters based on the totality of evidence.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RatingLevel {
  /** Disability percentage for this level */
  percent: number;
  /** Plain-language summary of what is required at this rating level */
  criteria: string;
  /** Key terms / evidence items to document for this level */
  keywords: string[];
}

export interface ConditionRatingCriteria {
  /** Matches the id field from the vaConditions / condition database */
  conditionId: string;
  /** Display name */
  conditionName: string;
  /** Primary VA diagnostic code(s) */
  diagnosticCode: string;
  /** CFR citation */
  cfrReference: string;
  /** Link to the eCFR schedule page */
  scheduleUrl: string;
  /** Rating levels from lowest to highest */
  ratingLevels: RatingLevel[];
  /** Tips for the C&P exam */
  examTips?: string[];
  /** Common mistakes that lead to lower ratings */
  commonMistakes?: string[];
}

// ---------------------------------------------------------------------------
// eCFR base URL
// ---------------------------------------------------------------------------

const ECFR_BASE = 'https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-B';

// ---------------------------------------------------------------------------
// Rating Criteria Data — 40+ Conditions
// ---------------------------------------------------------------------------

export const conditionRatingCriteria: ConditionRatingCriteria[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // MENTAL HEALTH — General Rating Formula for Mental Disorders (38 CFR § 4.130)
  // All mental-health conditions share the same General Rating Formula.
  // ═══════════════════════════════════════════════════════════════════════════

  // 1. PTSD
  {
    conditionId: 'ptsd',
    conditionName: 'Post-Traumatic Stress Disorder (PTSD)',
    diagnosticCode: '9411',
    cfrReference: '38 CFR § 4.130, DC 9411',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria:
          'A mental condition has been formally diagnosed, but symptoms are not severe enough either to interfere with occupational and social functioning or to require continuous medication.',
        keywords: ['diagnosed', 'no medication', 'minimal symptoms', 'no functional impairment'],
      },
      {
        percent: 10,
        criteria:
          'Occupational and social impairment due to mild or transient symptoms which decrease work efficiency and ability to perform occupational tasks only during periods of significant stress, or symptoms controlled by continuous medication.',
        keywords: [
          'mild symptoms',
          'transient',
          'continuous medication',
          'significant stress periods',
        ],
      },
      {
        percent: 30,
        criteria:
          'Occupational and social impairment with occasional decrease in work efficiency and intermittent periods of inability to perform occupational tasks (although generally functioning satisfactorily, with routine behavior, self-care, and conversation normal), due to such symptoms as: depressed mood, anxiety, suspiciousness, panic attacks (weekly or less often), chronic sleep impairment, mild memory loss (such as forgetting names, directions, recent events).',
        keywords: [
          'occasional decrease in work efficiency',
          'depressed mood',
          'anxiety',
          'suspiciousness',
          'weekly panic attacks',
          'chronic sleep impairment',
          'mild memory loss',
        ],
      },
      {
        percent: 50,
        criteria:
          'Occupational and social impairment with reduced reliability and productivity due to such symptoms as: flattened affect; circumstantial, circumlocutory, or stereotyped speech; panic attacks more than once a week; difficulty in understanding complex commands; impairment of short- and long-term memory (e.g., retention of only highly learned material, forgetting to complete tasks); impaired judgment; impaired abstract thinking; disturbances of motivation and mood; difficulty in establishing and maintaining effective work and social relationships.',
        keywords: [
          'reduced reliability',
          'flattened affect',
          'panic attacks more than weekly',
          'memory impairment',
          'impaired judgment',
          'difficulty maintaining relationships',
          'motivation disturbances',
        ],
      },
      {
        percent: 70,
        criteria:
          'Occupational and social impairment, with deficiencies in most areas, such as work, school, family relations, judgment, thinking, or mood, due to such symptoms as: suicidal ideation; obsessional rituals which interfere with routine activities; speech intermittently illogical, obscure, or irrelevant; near-continuous panic or depression affecting the ability to function independently, appropriately and effectively; impaired impulse control (such as unprovoked irritability with periods of violence); spatial disorientation; neglect of personal appearance and hygiene; difficulty in adapting to stressful circumstances (including work or a worklike setting); inability to establish and maintain effective relationships.',
        keywords: [
          'deficiencies in most areas',
          'suicidal ideation',
          'obsessional rituals',
          'near-continuous panic or depression',
          'impaired impulse control',
          'spatial disorientation',
          'neglect of hygiene',
          'inability to maintain relationships',
        ],
      },
      {
        percent: 100,
        criteria:
          'Total occupational and social impairment, due to such symptoms as: gross impairment in thought processes or communication; persistent delusions or hallucinations; grossly inappropriate behavior; persistent danger of hurting self or others; intermittent inability to perform activities of daily living (including maintenance of minimal personal hygiene); disorientation to time or place; memory loss for names of close relatives, own occupation, or own name.',
        keywords: [
          'total occupational and social impairment',
          'persistent delusions or hallucinations',
          'danger to self or others',
          'cannot perform ADLs',
          'disorientation to time or place',
          'severe memory loss',
          'grossly inappropriate behavior',
        ],
      },
    ],
    examTips: [
      'Describe your WORST days, not your best or average days',
      'Be specific about frequency of symptoms (daily, weekly, monthly)',
      'Give concrete examples: missed work, relationship breakdowns, isolation',
      'Mention nightmares, flashbacks, avoidance behaviors, and hypervigilance',
      'Discuss any suicidal thoughts (past or present) honestly — this is critical for 70%',
      'If you have panic attacks, describe frequency and duration',
      'Describe how PTSD affects your work, family, and social life separately',
      'Bring buddy/lay statements from family describing behavioral changes',
    ],
    commonMistakes: [
      'Minimizing symptoms to appear "tough" or "functional"',
      'Describing only average days instead of worst days',
      'Not mentioning suicidal ideation (past or present)',
      'Failing to connect symptoms to specific functional impairments',
      'Not keeping a symptom log before the exam',
      'Showering and dressing up for the exam when you normally neglect hygiene',
    ],
  },

  // 2. Major Depressive Disorder
  {
    conditionId: 'depression',
    conditionName: 'Major Depressive Disorder (MDD)',
    diagnosticCode: '9434',
    cfrReference: '38 CFR § 4.130, DC 9434',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria:
          'A mental condition has been formally diagnosed, but symptoms are not severe enough either to interfere with occupational and social functioning or to require continuous medication.',
        keywords: ['diagnosed', 'minimal symptoms', 'no medication required'],
      },
      {
        percent: 10,
        criteria:
          'Occupational and social impairment due to mild or transient symptoms which decrease work efficiency and ability to perform occupational tasks only during periods of significant stress, or symptoms controlled by continuous medication.',
        keywords: ['mild symptoms', 'controlled by medication', 'stress-related decrease'],
      },
      {
        percent: 30,
        criteria:
          'Occupational and social impairment with occasional decrease in work efficiency and intermittent inability to perform tasks due to depressed mood, anxiety, chronic sleep impairment, and mild memory loss.',
        keywords: [
          'occasional decrease in work efficiency',
          'depressed mood',
          'chronic sleep impairment',
          'mild memory loss',
          'anxiety',
        ],
      },
      {
        percent: 50,
        criteria:
          'Occupational and social impairment with reduced reliability and productivity due to flattened affect, panic attacks more than weekly, memory impairment, impaired judgment, disturbances of motivation and mood, and difficulty in establishing and maintaining effective relationships.',
        keywords: [
          'reduced reliability',
          'flattened affect',
          'motivation disturbance',
          'difficulty maintaining relationships',
          'impaired judgment',
        ],
      },
      {
        percent: 70,
        criteria:
          'Occupational and social impairment with deficiencies in most areas (work, family, judgment, thinking, mood) due to suicidal ideation, near-continuous depression affecting ability to function, impaired impulse control, neglect of hygiene, and inability to maintain effective relationships.',
        keywords: [
          'suicidal ideation',
          'near-continuous depression',
          'deficiencies in most areas',
          'impaired impulse control',
          'neglect of hygiene',
          'inability to maintain relationships',
        ],
      },
      {
        percent: 100,
        criteria:
          'Total occupational and social impairment due to gross impairment in thought processes, persistent danger of hurting self or others, inability to perform activities of daily living, disorientation, and severe memory loss.',
        keywords: [
          'total impairment',
          'persistent danger',
          'cannot perform ADLs',
          'disorientation',
          'severe memory loss',
        ],
      },
    ],
  },

  // 3. Generalized Anxiety Disorder
  {
    conditionId: 'anxiety',
    conditionName: 'Generalized Anxiety Disorder (GAD)',
    diagnosticCode: '9400',
    cfrReference: '38 CFR § 4.130, DC 9400',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria:
          'Diagnosed but symptoms not severe enough to interfere with occupational and social functioning or require continuous medication.',
        keywords: ['diagnosed', 'minimal symptoms'],
      },
      {
        percent: 10,
        criteria:
          'Mild or transient symptoms decreasing work efficiency only during significant stress, or symptoms controlled by continuous medication.',
        keywords: ['mild', 'transient', 'medication controlled', 'stress-triggered'],
      },
      {
        percent: 30,
        criteria:
          'Occasional decrease in work efficiency with intermittent inability to perform tasks due to anxiety, depressed mood, chronic sleep impairment, panic attacks weekly or less, and mild memory loss.',
        keywords: [
          'occasional decrease',
          'weekly panic attacks or less',
          'chronic sleep impairment',
          'mild memory loss',
        ],
      },
      {
        percent: 50,
        criteria:
          'Reduced reliability and productivity due to panic attacks more than weekly, memory impairment, impaired judgment, disturbances of motivation and mood, and difficulty establishing and maintaining relationships.',
        keywords: [
          'reduced reliability',
          'panic attacks more than weekly',
          'memory impairment',
          'difficulty with relationships',
        ],
      },
      {
        percent: 70,
        criteria:
          'Deficiencies in most areas due to suicidal ideation, obsessional rituals, near-continuous panic or depression, impaired impulse control, neglect of hygiene, and inability to maintain effective relationships.',
        keywords: [
          'deficiencies in most areas',
          'suicidal ideation',
          'obsessional rituals',
          'near-continuous panic',
          'neglect of hygiene',
        ],
      },
      {
        percent: 100,
        criteria:
          'Total occupational and social impairment due to gross impairment in thought processes, persistent delusions or hallucinations, persistent danger to self or others, inability to perform ADLs, disorientation, and severe memory loss.',
        keywords: [
          'total impairment',
          'persistent delusions',
          'danger to self/others',
          'cannot perform ADLs',
        ],
      },
    ],
  },

  // 4. Bipolar Disorder
  {
    conditionId: 'bipolar',
    conditionName: 'Bipolar Disorder',
    diagnosticCode: '9432',
    cfrReference: '38 CFR § 4.130, DC 9432',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria: 'Diagnosed but symptoms not severe enough to interfere with functioning or require continuous medication.',
        keywords: ['diagnosed', 'minimal symptoms'],
      },
      {
        percent: 10,
        criteria: 'Mild or transient symptoms decreasing work efficiency only during significant stress, or symptoms controlled by continuous medication.',
        keywords: ['mild', 'transient', 'medication controlled'],
      },
      {
        percent: 30,
        criteria: 'Occasional decrease in work efficiency with intermittent inability to perform tasks due to mood episodes, sleep impairment, and mild memory loss.',
        keywords: ['occasional decrease', 'mood episodes', 'sleep impairment'],
      },
      {
        percent: 50,
        criteria: 'Reduced reliability and productivity due to mood episodes, panic attacks, impaired judgment, motivation disturbances, and difficulty maintaining relationships.',
        keywords: ['reduced reliability', 'mood instability', 'impaired judgment'],
      },
      {
        percent: 70,
        criteria: 'Deficiencies in most areas due to manic/depressive episodes, suicidal ideation, impaired impulse control, neglect of hygiene, and inability to maintain relationships.',
        keywords: ['deficiencies in most areas', 'suicidal ideation', 'impaired impulse control'],
      },
      {
        percent: 100,
        criteria: 'Total occupational and social impairment from severe manic or depressive episodes with psychotic features, persistent danger, inability to perform ADLs.',
        keywords: ['total impairment', 'psychotic features', 'persistent danger'],
      },
    ],
  },

  // 5. OCD
  {
    conditionId: 'ocd',
    conditionName: 'Obsessive-Compulsive Disorder (OCD)',
    diagnosticCode: '9404',
    cfrReference: '38 CFR § 4.130, DC 9404',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria: 'Diagnosed but symptoms not severe enough to interfere with functioning or require continuous medication.',
        keywords: ['diagnosed', 'minimal symptoms'],
      },
      {
        percent: 10,
        criteria: 'Mild or transient obsessions/compulsions decreasing work efficiency only during significant stress, or controlled by medication.',
        keywords: ['mild', 'transient', 'medication controlled'],
      },
      {
        percent: 30,
        criteria: 'Occasional decrease in work efficiency due to obsessional thoughts, compulsive rituals, anxiety, sleep impairment, and mild memory loss.',
        keywords: ['occasional decrease', 'obsessional thoughts', 'compulsive rituals'],
      },
      {
        percent: 50,
        criteria: 'Reduced reliability and productivity due to time-consuming rituals, disturbances of motivation and mood, difficulty maintaining relationships.',
        keywords: ['reduced reliability', 'time-consuming rituals', 'difficulty with relationships'],
      },
      {
        percent: 70,
        criteria: 'Deficiencies in most areas due to obsessional rituals interfering with routine activities, suicidal ideation, near-continuous anxiety, inability to maintain relationships.',
        keywords: ['obsessional rituals interfering with routine', 'suicidal ideation', 'near-continuous anxiety'],
      },
      {
        percent: 100,
        criteria: 'Total occupational and social impairment due to all-consuming rituals, persistent danger to self or others, inability to perform ADLs.',
        keywords: ['total impairment', 'all-consuming rituals', 'cannot perform ADLs'],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MUSCULOSKELETAL — 38 CFR § 4.71a
  // ═══════════════════════════════════════════════════════════════════════════

  // 6. Lumbar Spine (General Rating Formula for Diseases and Injuries of the Spine)
  {
    conditionId: 'lumbar-strain',
    conditionName: 'Lumbosacral Strain / Degenerative Disc Disease',
    diagnosticCode: '5237/5243',
    cfrReference: '38 CFR § 4.71a, DC 5237/5243',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria:
          'Forward flexion of the thoracolumbar spine greater than 60 degrees but not greater than 85 degrees; or, combined range of motion of the thoracolumbar spine greater than 120 degrees but not greater than 235 degrees; or, muscle spasm, guarding, or localized tenderness not resulting in abnormal gait or abnormal spinal contour; or, vertebral body fracture with loss of 50 percent or more of the height.',
        keywords: [
          'flexion 60-85 degrees',
          'combined ROM 120-235',
          'muscle spasm',
          'guarding',
          'localized tenderness',
          'no abnormal gait',
        ],
      },
      {
        percent: 20,
        criteria:
          'Forward flexion of the thoracolumbar spine greater than 30 degrees but not greater than 60 degrees; or, combined range of motion not greater than 120 degrees; or, muscle spasm or guarding severe enough to result in an abnormal gait or abnormal spinal contour such as scoliosis, reversed lordosis, or abnormal kyphosis.',
        keywords: [
          'flexion 30-60 degrees',
          'combined ROM 120 or less',
          'abnormal gait',
          'scoliosis',
          'reversed lordosis',
          'abnormal kyphosis',
        ],
      },
      {
        percent: 40,
        criteria:
          'Forward flexion of the thoracolumbar spine 30 degrees or less; or, favorable ankylosis of the entire thoracolumbar spine.',
        keywords: ['flexion 30 degrees or less', 'favorable ankylosis', 'severely limited'],
      },
      {
        percent: 50,
        criteria: 'Unfavorable ankylosis of the entire thoracolumbar spine.',
        keywords: ['unfavorable ankylosis', 'thoracolumbar spine fixed'],
      },
      {
        percent: 100,
        criteria:
          'Unfavorable ankylosis of the entire spine (cervical + thoracolumbar).',
        keywords: ['unfavorable ankylosis of entire spine', 'complete fixation'],
      },
    ],
    examTips: [
      'Do NOT stretch or warm up before the exam — the VA should measure your actual state',
      'Stop movement at the point pain begins; do not push through it',
      'Mention flare-ups: how often, how long they last, and how they limit ROM',
      'Describe radiculopathy symptoms (shooting pain, numbness, tingling in legs)',
      'Report how your back affects daily activities: bending, lifting, sitting, driving',
      'If you have incapacitating episodes from IVDS, report frequency and duration',
      'Note: IVDS can also be rated under the Formula for Incapacitating Episodes (DC 5243)',
      'Bring recent MRI or imaging if available',
    ],
    commonMistakes: [
      'Warming up or stretching before the exam, which artificially increases ROM',
      'Pushing through pain to demonstrate toughness',
      'Not mentioning flare-ups or how ROM decreases during them',
      'Forgetting to describe radiculopathy (which warrants a separate rating)',
      'Not mentioning incapacitating episodes requiring bed rest prescribed by a doctor',
    ],
  },

  // 7. Cervical Spine
  {
    conditionId: 'cervical-strain',
    conditionName: 'Cervical Strain / Degenerative Disc Disease',
    diagnosticCode: '5237/5242',
    cfrReference: '38 CFR § 4.71a, DC 5237/5242',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria:
          'Forward flexion of the cervical spine greater than 30 degrees but not greater than 40 degrees; or, combined range of motion of the cervical spine greater than 170 degrees but not greater than 335 degrees; or, muscle spasm, guarding, or localized tenderness not resulting in abnormal gait or abnormal spinal contour.',
        keywords: [
          'flexion 30-40 degrees',
          'combined ROM 170-335',
          'muscle spasm',
          'guarding',
          'localized tenderness',
        ],
      },
      {
        percent: 20,
        criteria:
          'Forward flexion of the cervical spine greater than 15 degrees but not greater than 30 degrees; or, combined range of motion of the cervical spine not greater than 170 degrees; or, muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour.',
        keywords: [
          'flexion 15-30 degrees',
          'combined ROM 170 or less',
          'abnormal gait',
          'abnormal spinal contour',
        ],
      },
      {
        percent: 30,
        criteria:
          'Forward flexion of the cervical spine 15 degrees or less; or, favorable ankylosis of the entire cervical spine.',
        keywords: ['flexion 15 degrees or less', 'favorable ankylosis of cervical spine'],
      },
      {
        percent: 40,
        criteria: 'Unfavorable ankylosis of the entire cervical spine.',
        keywords: ['unfavorable ankylosis', 'cervical spine fixed'],
      },
      {
        percent: 100,
        criteria: 'Unfavorable ankylosis of the entire spine.',
        keywords: ['unfavorable ankylosis of entire spine', 'complete fixation'],
      },
    ],
  },

  // 8. Knee — Limitation of Flexion (DC 5260)
  {
    conditionId: 'knee-limited-flexion',
    conditionName: 'Knee — Limitation of Flexion',
    diagnosticCode: '5260',
    cfrReference: '38 CFR § 4.71a, DC 5260',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria: 'Flexion limited to 60 degrees.',
        keywords: ['flexion limited to 60'],
      },
      {
        percent: 10,
        criteria: 'Flexion limited to 45 degrees.',
        keywords: ['flexion limited to 45'],
      },
      {
        percent: 20,
        criteria: 'Flexion limited to 30 degrees.',
        keywords: ['flexion limited to 30'],
      },
      {
        percent: 30,
        criteria: 'Flexion limited to 15 degrees.',
        keywords: ['flexion limited to 15'],
      },
    ],
    examTips: [
      'You can receive SEPARATE ratings for limited flexion (DC 5260) and limited extension (DC 5261)',
      'Knee instability/subluxation (DC 5257) is rated SEPARATELY from limited motion',
      'Do not push through pain — stop at the point pain begins',
      'Report any locking, clicking, giving way, or catching',
      'Describe use of knee braces or assistive devices',
      'Mention the impact on walking, stairs, squatting, kneeling',
      'Note pain after repetitive use and during flare-ups',
    ],
    commonMistakes: [
      'Not knowing that flexion and extension limitations can be rated separately',
      'Forgetting to report instability, which warrants an additional separate rating',
      'Pushing through pain during ROM testing',
      'Not describing flare-ups and how they further limit motion',
      'Failing to bring your knee brace to the exam',
    ],
  },

  // 9. Knee — Limitation of Extension (DC 5261)
  {
    conditionId: 'knee-limited-extension',
    conditionName: 'Knee — Limitation of Extension',
    diagnosticCode: '5261',
    cfrReference: '38 CFR § 4.71a, DC 5261',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria: 'Extension limited to 5 degrees.',
        keywords: ['extension limited to 5'],
      },
      {
        percent: 10,
        criteria: 'Extension limited to 10 degrees.',
        keywords: ['extension limited to 10'],
      },
      {
        percent: 20,
        criteria: 'Extension limited to 15 degrees.',
        keywords: ['extension limited to 15'],
      },
      {
        percent: 30,
        criteria: 'Extension limited to 20 degrees.',
        keywords: ['extension limited to 20'],
      },
      {
        percent: 40,
        criteria: 'Extension limited to 30 degrees.',
        keywords: ['extension limited to 30'],
      },
      {
        percent: 50,
        criteria: 'Extension limited to 45 degrees.',
        keywords: ['extension limited to 45'],
      },
    ],
  },

  // 10. Knee — Instability (DC 5257)
  {
    conditionId: 'knee-instability',
    conditionName: 'Knee — Recurrent Subluxation or Lateral Instability',
    diagnosticCode: '5257',
    cfrReference: '38 CFR § 4.71a, DC 5257',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Slight recurrent subluxation or lateral instability.',
        keywords: ['slight instability', 'slight subluxation'],
      },
      {
        percent: 20,
        criteria: 'Moderate recurrent subluxation or lateral instability.',
        keywords: ['moderate instability', 'moderate subluxation', 'giving way'],
      },
      {
        percent: 30,
        criteria: 'Severe recurrent subluxation or lateral instability.',
        keywords: ['severe instability', 'severe subluxation', 'frequent giving way', 'falls'],
      },
    ],
  },

  // 11. Knee — Combined entry for general reference
  {
    conditionId: 'knee-strain',
    conditionName: 'Knee Conditions (General)',
    diagnosticCode: '5260/5261/5257',
    cfrReference: '38 CFR § 4.71a, DC 5260/5261/5257',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria: 'Flexion limited to 60 degrees or extension limited to 5 degrees (DC 5260/5261).',
        keywords: ['near-normal ROM'],
      },
      {
        percent: 10,
        criteria: 'Flexion limited to 45 degrees (DC 5260); or extension limited to 10 degrees (DC 5261); or slight recurrent subluxation/instability (DC 5257).',
        keywords: ['flexion 45', 'extension 10', 'slight instability'],
      },
      {
        percent: 20,
        criteria: 'Flexion limited to 30 degrees (DC 5260); or extension limited to 15 degrees (DC 5261); or moderate subluxation/instability (DC 5257).',
        keywords: ['flexion 30', 'extension 15', 'moderate instability'],
      },
      {
        percent: 30,
        criteria: 'Flexion limited to 15 degrees (DC 5260); or extension limited to 20 degrees (DC 5261); or severe subluxation/instability (DC 5257).',
        keywords: ['flexion 15', 'extension 20', 'severe instability'],
      },
    ],
    examTips: [
      'You can receive SEPARATE ratings for flexion limitation, extension limitation, AND instability',
      'Do not push through pain during ROM testing',
      'Report locking, clicking, giving way, and catching',
      'Bring your knee brace if you use one',
      'Mention the impact on walking, stairs, squatting, kneeling',
    ],
    commonMistakes: [
      'Not requesting separate ratings for flexion, extension, and instability',
      'Pushing through pain during the exam',
      'Not describing flare-ups and their impact on function',
      'Failing to mention instability or giving way episodes',
    ],
  },

  // 12. Shoulder — Limitation of Arm Motion (DC 5201)
  {
    conditionId: 'shoulder-strain',
    conditionName: 'Shoulder — Limitation of Motion of Arm',
    diagnosticCode: '5201',
    cfrReference: '38 CFR § 4.71a, DC 5201',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 20,
        criteria:
          'Arm limited to shoulder level (90 degrees abduction). Same rating for dominant and non-dominant arm at this level.',
        keywords: ['arm at shoulder level', 'abduction to 90 degrees', 'limited overhead'],
      },
      {
        percent: 30,
        criteria:
          'Arm limited midway between side and shoulder level (45 degrees abduction) — dominant arm. (20% for non-dominant.)',
        keywords: [
          'midway between side and shoulder',
          'abduction to 45 degrees',
          'dominant arm 30%',
          'non-dominant 20%',
        ],
      },
      {
        percent: 40,
        criteria:
          'Motion limited to 25 degrees from side — dominant arm. (30% for non-dominant.)',
        keywords: [
          'motion to 25 degrees from side',
          'dominant arm 40%',
          'non-dominant 30%',
          'severely restricted',
        ],
      },
    ],
  },

  // 13. Ankle — Limited Motion (DC 5271)
  {
    conditionId: 'ankle-strain',
    conditionName: 'Ankle — Limited Motion',
    diagnosticCode: '5271',
    cfrReference: '38 CFR § 4.71a, DC 5271',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Moderate limitation of ankle motion.',
        keywords: ['moderate limitation', 'dorsiflexion', 'plantar flexion'],
      },
      {
        percent: 20,
        criteria: 'Marked limitation of ankle motion.',
        keywords: ['marked limitation', 'severely restricted', 'dorsiflexion', 'plantar flexion'],
      },
    ],
  },

  // 14. Hip — Limitation of Flexion (DC 5252)
  {
    conditionId: 'hip-strain',
    conditionName: 'Hip — Limitation of Flexion of Thigh',
    diagnosticCode: '5252',
    cfrReference: '38 CFR § 4.71a, DC 5252',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Flexion of thigh limited to 45 degrees.',
        keywords: ['flexion limited to 45'],
      },
      {
        percent: 20,
        criteria: 'Flexion of thigh limited to 30 degrees.',
        keywords: ['flexion limited to 30'],
      },
      {
        percent: 30,
        criteria: 'Flexion of thigh limited to 20 degrees.',
        keywords: ['flexion limited to 20'],
      },
      {
        percent: 40,
        criteria: 'Flexion of thigh limited to 10 degrees.',
        keywords: ['flexion limited to 10'],
      },
    ],
  },

  // 15. Plantar Fasciitis (DC 5276 - flatfoot, often analogous)
  {
    conditionId: 'plantar-fasciitis',
    conditionName: 'Bilateral Plantar Fasciitis / Pes Planus',
    diagnosticCode: '5276',
    cfrReference: '38 CFR § 4.71a, DC 5276',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria: 'Mild: symptoms relieved by built-up shoe or arch support.',
        keywords: ['mild', 'relieved by arch support'],
      },
      {
        percent: 10,
        criteria: 'Moderate: weight-bearing line over or medial to the great toe, inward bowing of the tendo achillis, pain on manipulation and use of the feet (bilateral or unilateral).',
        keywords: ['moderate', 'weight-bearing line medial', 'pain on use', 'inward bowing achilles'],
      },
      {
        percent: 30,
        criteria: 'Severe bilateral (20% unilateral): objective evidence of marked deformity (pronation, abduction), pain on manipulation and use accentuated, indication of swelling on use, characteristic callosities.',
        keywords: ['severe', 'marked deformity', 'pronation', 'swelling on use', 'callosities'],
      },
      {
        percent: 50,
        criteria: 'Pronounced bilateral (30% unilateral): marked pronation, extreme tenderness of plantar surfaces of feet, marked inward displacement and severe spasm of the tendo achillis on manipulation, not improved by orthopedic shoes or appliances.',
        keywords: ['pronounced', 'marked pronation', 'extreme tenderness', 'not improved by orthotics'],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AUDITORY — 38 CFR § 4.85–4.87
  // ═══════════════════════════════════════════════════════════════════════════

  // 16. Tinnitus
  {
    conditionId: 'tinnitus',
    conditionName: 'Tinnitus',
    diagnosticCode: '6260',
    cfrReference: '38 CFR § 4.87, DC 6260',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria:
          'Recurrent tinnitus. Note: A single 10% evaluation is assigned for tinnitus, whether the sound is perceived in one ear, both ears, or in the head. 10% is the maximum schedular rating.',
        keywords: [
          'recurrent',
          'ringing',
          'buzzing',
          'hissing',
          'maximum 10%',
          'one rating regardless of ears',
        ],
      },
    ],
    examTips: [
      '10% is the MAXIMUM schedular rating for tinnitus — there is no higher rating',
      'Describe the sound: ringing, buzzing, hissing, roaring, clicking',
      'Report whether it is constant or recurrent',
      'Explain the impact on concentration, sleep, and daily life',
      'Mention noise exposure history in service (MOS, weapons, aircraft, machinery)',
      'Note: tinnitus is a subjective condition — your report is the primary evidence',
    ],
    commonMistakes: [
      'Expecting a rating higher than 10% — it is the maximum for tinnitus',
      'Not describing the functional impact (sleep disruption, concentration)',
      'Failing to document in-service noise exposure',
    ],
  },

  // 17. Hearing Loss
  {
    conditionId: 'hearing-loss',
    conditionName: 'Bilateral Hearing Loss',
    diagnosticCode: '6100',
    cfrReference: '38 CFR § 4.85–4.86, DC 6100',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria:
          'Hearing levels that correspond to Level I in both ears per Table VI (based on puretone threshold averages and speech discrimination scores). Most mild-to-moderate hearing loss falls at 0%.',
        keywords: [
          'Level I both ears',
          'puretone threshold average',
          'speech discrimination',
          'Table VI',
          'Table VII',
        ],
      },
      {
        percent: 10,
        criteria:
          'Various combinations of hearing levels per Tables VI and VII. Example: Level II in one ear and Level V in the other, or Level III in each ear. Rating is mechanical — derived from audiometric test results.',
        keywords: ['Table VI', 'Table VII', 'audiogram', 'speech discrimination', 'CNC test'],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RESPIRATORY — 38 CFR § 4.97
  // ═══════════════════════════════════════════════════════════════════════════

  // 18. Sleep Apnea
  {
    conditionId: 'sleep-apnea',
    conditionName: 'Obstructive Sleep Apnea',
    diagnosticCode: '6847',
    cfrReference: '38 CFR § 4.97, DC 6847',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria: 'Asymptomatic but with documented sleep disorder breathing.',
        keywords: ['asymptomatic', 'documented disorder', 'no treatment'],
      },
      {
        percent: 30,
        criteria: 'Persistent day-time hypersomnolence.',
        keywords: ['daytime sleepiness', 'hypersomnolence', 'persistent fatigue'],
      },
      {
        percent: 50,
        criteria: 'Requires use of breathing assistance device such as continuous airway pressure (CPAP) machine.',
        keywords: ['CPAP', 'BiPAP', 'breathing assistance device', 'prescribed device'],
      },
      {
        percent: 100,
        criteria:
          'Chronic respiratory failure with carbon dioxide retention or cor pulmonale, or; requires tracheostomy.',
        keywords: [
          'chronic respiratory failure',
          'CO2 retention',
          'cor pulmonale',
          'tracheostomy',
        ],
      },
    ],
    examTips: [
      'CPAP prescription = automatic 50% rating — bring the prescription and compliance records',
      'Bring your sleep study results (polysomnography) to the exam',
      'Describe daytime symptoms: excessive sleepiness, fatigue, difficulty concentrating',
      'If your spouse or partner witnesses apnea episodes, bring a buddy statement',
      'Mention any cardiac complications (hypertension, heart failure) related to apnea',
      'If you cannot tolerate CPAP, mention that — you may still qualify for 50%',
    ],
    commonMistakes: [
      'Not bringing the CPAP prescription or sleep study to the exam',
      'Not mentioning CPAP use when it is prescribed',
      'Failing to describe daytime functional impairment',
      'Not connecting secondary conditions (hypertension, depression) to sleep apnea',
    ],
  },

  // 19. Asthma
  {
    conditionId: 'asthma',
    conditionName: 'Bronchial Asthma',
    diagnosticCode: '6602',
    cfrReference: '38 CFR § 4.97, DC 6602',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria:
          'FEV-1 of 71- to 80-percent predicted, or; FEV-1/FVC of 71 to 80 percent, or; intermittent inhalational or oral bronchodilator therapy.',
        keywords: [
          'FEV-1 71-80% predicted',
          'FEV-1/FVC 71-80%',
          'intermittent bronchodilator',
          'inhaler use',
        ],
      },
      {
        percent: 30,
        criteria:
          'FEV-1 of 56- to 70-percent predicted, or; FEV-1/FVC of 56 to 70 percent, or; daily inhalational or oral bronchodilator therapy, or; inhalational anti-inflammatory medication.',
        keywords: [
          'FEV-1 56-70% predicted',
          'FEV-1/FVC 56-70%',
          'daily bronchodilator',
          'daily inhaler',
          'anti-inflammatory inhaler',
        ],
      },
      {
        percent: 60,
        criteria:
          'FEV-1 of 40- to 55-percent predicted, or; FEV-1/FVC of 40 to 55 percent, or; at least monthly visits to a physician for required care of exacerbations, or; intermittent (at least three per year) courses of systemic (oral or parenteral) corticosteroids.',
        keywords: [
          'FEV-1 40-55% predicted',
          'FEV-1/FVC 40-55%',
          'monthly physician visits',
          'systemic corticosteroids 3+ per year',
          'oral steroids',
        ],
      },
      {
        percent: 100,
        criteria:
          'FEV-1 less than 40-percent predicted, or; FEV-1/FVC less than 40 percent, or; more than one attack per week with episodes of respiratory failure, or; requires daily use of systemic (oral or parenteral) high dose corticosteroids or immuno-suppressive medications.',
        keywords: [
          'FEV-1 less than 40%',
          'FEV-1/FVC less than 40%',
          'weekly attacks with respiratory failure',
          'daily systemic corticosteroids',
          'immuno-suppressive medications',
        ],
      },
    ],
  },

  // 20. Sinusitis
  {
    conditionId: 'sinusitis',
    conditionName: 'Chronic Sinusitis',
    diagnosticCode: '6510-6514',
    cfrReference: '38 CFR § 4.97, DC 6510-6514',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria: 'Detected by X-ray only.',
        keywords: ['X-ray only', 'no symptoms', 'incidental finding'],
      },
      {
        percent: 10,
        criteria:
          'One or two incapacitating episodes per year of sinusitis requiring prolonged (lasting four to six weeks) antibiotic treatment, or; three to six non-incapacitating episodes per year of sinusitis characterized by headaches, pain, and purulent discharge or crusting.',
        keywords: [
          '1-2 incapacitating episodes',
          'prolonged antibiotics',
          '3-6 non-incapacitating episodes',
          'headaches',
          'purulent discharge',
          'crusting',
        ],
      },
      {
        percent: 30,
        criteria:
          'Three or more incapacitating episodes per year of sinusitis requiring prolonged (lasting four to six weeks) antibiotic treatment, or; more than six non-incapacitating episodes per year of sinusitis characterized by headaches, pain, and purulent discharge or crusting.',
        keywords: [
          '3+ incapacitating episodes',
          '6+ non-incapacitating episodes',
          'prolonged antibiotics',
          'frequent headaches',
        ],
      },
      {
        percent: 50,
        criteria:
          'Following radical surgery with chronic osteomyelitis, or; near constant sinusitis characterized by headaches, pain and tenderness of affected sinus, and purulent discharge or crusting after repeated surgeries.',
        keywords: [
          'radical surgery',
          'chronic osteomyelitis',
          'near constant sinusitis',
          'repeated surgeries',
          'constant purulent discharge',
        ],
      },
    ],
  },

  // 21. Rhinitis (allergic)
  {
    conditionId: 'rhinitis',
    conditionName: 'Allergic or Vasomotor Rhinitis',
    diagnosticCode: '6522',
    cfrReference: '38 CFR § 4.97, DC 6522',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria:
          'Without polyps, but with greater than 50-percent obstruction of nasal passage on both sides or complete obstruction on one side.',
        keywords: ['50% obstruction both sides', 'complete obstruction one side', 'no polyps'],
      },
      {
        percent: 30,
        criteria: 'With polyps.',
        keywords: ['nasal polyps', 'polyposis'],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DIGESTIVE — 38 CFR § 4.114
  // ═══════════════════════════════════════════════════════════════════════════

  // 22. GERD
  {
    conditionId: 'gerd',
    conditionName: 'Gastroesophageal Reflux Disease (GERD) / Hiatal Hernia',
    diagnosticCode: '7346',
    cfrReference: '38 CFR § 4.114, DC 7346',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria:
          'Two or more of the symptoms for the 30 percent evaluation of less severity.',
        keywords: [
          'pain',
          'vomiting',
          'material weight loss',
          'hematemesis',
          'melena',
          'anemia',
          'less severity',
        ],
      },
      {
        percent: 30,
        criteria:
          'Persistently recurrent epigastric distress with dysphagia, pyrosis, and regurgitation, accompanied by substernal or arm or shoulder pain, productive of considerable impairment of health.',
        keywords: [
          'persistently recurrent',
          'dysphagia',
          'pyrosis',
          'regurgitation',
          'substernal pain',
          'arm or shoulder pain',
          'considerable impairment of health',
        ],
      },
      {
        percent: 60,
        criteria:
          'Symptoms of pain, vomiting, material weight loss and hematemesis or melena with moderate anemia; or other symptom combinations productive of severe impairment of health.',
        keywords: [
          'pain',
          'vomiting',
          'material weight loss',
          'hematemesis',
          'melena',
          'moderate anemia',
          'severe impairment of health',
        ],
      },
    ],
    examTips: [
      'Document all symptoms: heartburn, regurgitation, difficulty swallowing, chest/arm pain',
      'Describe frequency: daily, multiple times daily, nightly',
      'Report impact on sleep (waking up choking), diet (foods you avoid), and weight',
      'Mention all medications and whether they control symptoms',
      'If you have had an endoscopy, bring the results',
      'Describe how GERD affects your work and daily activities',
    ],
    commonMistakes: [
      'Only describing heartburn without mentioning regurgitation, dysphagia, or pain radiating to arm/shoulder',
      'Not documenting weight loss or nutritional impact',
      'Failing to describe how symptoms impair health overall',
      'Not mentioning nightly symptoms that disrupt sleep',
    ],
  },

  // 23. Irritable Bowel Syndrome
  {
    conditionId: 'ibs',
    conditionName: 'Irritable Bowel Syndrome (IBS)',
    diagnosticCode: '7319',
    cfrReference: '38 CFR § 4.114, DC 7319',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria: 'Mild: disturbances of bowel function with occasional episodes of abdominal distress.',
        keywords: ['mild', 'occasional episodes', 'abdominal distress'],
      },
      {
        percent: 10,
        criteria: 'Moderate: frequent episodes of bowel disturbance with abdominal distress.',
        keywords: ['moderate', 'frequent episodes', 'bowel disturbance'],
      },
      {
        percent: 30,
        criteria:
          'Severe: diarrhea, or alternating diarrhea and constipation, with more or less constant abdominal distress.',
        keywords: [
          'severe',
          'diarrhea',
          'alternating diarrhea and constipation',
          'constant abdominal distress',
        ],
      },
    ],
  },

  // 24. Gastritis
  {
    conditionId: 'gastritis',
    conditionName: 'Chronic Hypertrophic Gastritis',
    diagnosticCode: '7307',
    cfrReference: '38 CFR § 4.114, DC 7307',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Chronic gastritis with small nodular lesions and symptoms.',
        keywords: ['small nodular lesions', 'chronic symptoms'],
      },
      {
        percent: 30,
        criteria: 'Chronic gastritis with multiple small eroded or ulcerated areas and symptoms.',
        keywords: ['eroded areas', 'ulcerated areas', 'multiple lesions'],
      },
      {
        percent: 60,
        criteria: 'Chronic gastritis with severe hemorrhages, or large ulcerated or eroded areas.',
        keywords: ['severe hemorrhages', 'large ulcerated areas'],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NEUROLOGICAL — 38 CFR § 4.124a
  // ═══════════════════════════════════════════════════════════════════════════

  // 25. Migraine Headaches
  {
    conditionId: 'migraines',
    conditionName: 'Migraine Headaches',
    diagnosticCode: '8100',
    cfrReference: '38 CFR § 4.124a, DC 8100',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria: 'With less frequent attacks.',
        keywords: ['infrequent', 'less frequent', 'mild headaches'],
      },
      {
        percent: 10,
        criteria:
          'With characteristic prostrating attacks averaging one in 2 months over last several months.',
        keywords: [
          'prostrating',
          'one in 2 months',
          '6 per year',
          'characteristic attacks',
        ],
      },
      {
        percent: 30,
        criteria:
          'With characteristic prostrating attacks occurring on an average once a month over last several months.',
        keywords: [
          'prostrating monthly',
          'once a month',
          '12 per year',
          'regular debilitating attacks',
        ],
      },
      {
        percent: 50,
        criteria:
          'With very frequent completely prostrating and prolonged attacks productive of severe economic inadaptability.',
        keywords: [
          'very frequent',
          'completely prostrating',
          'prolonged attacks',
          'severe economic inadaptability',
          'cannot work',
          'missed work',
        ],
      },
    ],
    examTips: [
      '"Prostrating" means you MUST lie down and cannot function — use this word explicitly',
      'Keep a detailed migraine diary: date, duration, severity (1-10), symptoms, what you had to stop doing',
      'Document missed work or reduced productivity with specifics (dates, hours lost)',
      'Describe associated symptoms: aura, nausea, vomiting, photophobia, phonophobia',
      'List all triggers: light, noise, stress, weather, foods',
      'Mention ALL medications tried and whether they provide relief',
      '"Severe economic inadaptability" does not mean you must be unemployed — it means your earning capacity is severely impacted',
    ],
    commonMistakes: [
      'Not using the word "prostrating" when describing attacks',
      'Not keeping a headache diary before the exam',
      'Failing to document the economic impact (missed work, reduced hours)',
      'Describing only the headache pain without mentioning nausea, photophobia, etc.',
      'Not differentiating prostrating attacks from regular headaches',
    ],
  },

  // 26. Radiculopathy — Sciatic Nerve (DC 8520)
  {
    conditionId: 'radiculopathy',
    conditionName: 'Radiculopathy — Sciatic Nerve (Lower Extremity)',
    diagnosticCode: '8520',
    cfrReference: '38 CFR § 4.124a, DC 8520',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Mild incomplete paralysis of the sciatic nerve.',
        keywords: ['mild', 'incomplete paralysis', 'sciatic nerve', 'occasional numbness'],
      },
      {
        percent: 20,
        criteria: 'Moderate incomplete paralysis of the sciatic nerve.',
        keywords: ['moderate', 'incomplete paralysis', 'numbness', 'tingling', 'pain radiating down leg'],
      },
      {
        percent: 40,
        criteria: 'Moderately severe incomplete paralysis of the sciatic nerve.',
        keywords: ['moderately severe', 'significant weakness', 'sensory loss', 'shooting pain'],
      },
      {
        percent: 60,
        criteria: 'Severe incomplete paralysis of the sciatic nerve, with marked muscular atrophy.',
        keywords: ['severe', 'marked muscular atrophy', 'significant weakness', 'foot drop possible'],
      },
      {
        percent: 80,
        criteria: 'Complete paralysis of the sciatic nerve: the foot dangles and drops, no active movement possible of muscles below the knee, flexion of knee weakened or (very rarely) lost.',
        keywords: ['complete paralysis', 'foot drop', 'no active movement below knee', 'knee flexion weakened'],
      },
    ],
  },

  // 27. Peripheral Neuropathy — External Popliteal (Common Peroneal) Nerve (DC 8521)
  {
    conditionId: 'peripheral-neuropathy',
    conditionName: 'Peripheral Neuropathy — Common Peroneal Nerve',
    diagnosticCode: '8521',
    cfrReference: '38 CFR § 4.124a, DC 8521',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Mild incomplete paralysis of the external popliteal (common peroneal) nerve.',
        keywords: ['mild', 'incomplete paralysis', 'numbness', 'tingling'],
      },
      {
        percent: 20,
        criteria: 'Moderate incomplete paralysis of the external popliteal nerve.',
        keywords: ['moderate', 'numbness', 'pain', 'decreased sensation'],
      },
      {
        percent: 30,
        criteria: 'Severe incomplete paralysis of the external popliteal nerve.',
        keywords: ['severe', 'significant sensory loss', 'weakness', 'impaired function'],
      },
      {
        percent: 40,
        criteria: 'Complete paralysis of the external popliteal nerve: foot drop and slight droop of first phalanges of all toes, cannot dorsiflex the foot, extension (dorsal flexion) of proximal phalanges of toes lost; abduction of foot lost, adduction weakened; anesthesia covers entire dorsum of foot and toes.',
        keywords: ['complete paralysis', 'foot drop', 'cannot dorsiflex', 'anesthesia of dorsum'],
      },
    ],
  },

  // 28. Traumatic Brain Injury (TBI)
  {
    conditionId: 'tbi',
    conditionName: 'Traumatic Brain Injury (TBI)',
    diagnosticCode: '8045',
    cfrReference: '38 CFR § 4.124a, DC 8045',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria:
          'TBI with residuals evaluated under DC 8045 using a special multi-faceted evaluation. Three main areas are evaluated: (1) cognitive impairment, (2) emotional/behavioral dysfunction, and (3) physical dysfunction. Each facet is assigned a severity level (0, 1, 2, 3, or total). The highest facet level determines the overall rating. Level 0 = 0%, Level 1 = 10%, Level 2 = 40%, Level 3 = 70%, Total = 100%. At Level 0: no impairment in any facet.',
        keywords: ['no impairment', 'Level 0', 'no residuals'],
      },
      {
        percent: 10,
        criteria:
          'Level 1 impairment in the highest-severity facet. Facets include: memory/attention/concentration, judgment, social interaction, orientation, motor activity, visual-spatial orientation, communication, consciousness, and subjective symptoms (three or more subjective symptoms that mildly interfere with work, daily activities, or close relationships).',
        keywords: ['Level 1', 'mild impairment', 'three or more subjective symptoms', 'mild interference'],
      },
      {
        percent: 40,
        criteria:
          'Level 2 impairment in the highest-severity facet. Examples: moderately impaired memory/attention; occasionally inappropriate judgment; social interaction is frequently inappropriate; mild or occasional disorientation; motor activity mildly decreased; moderately impaired communication.',
        keywords: ['Level 2', 'moderate impairment', 'occasionally inappropriate', 'frequently inappropriate social interaction'],
      },
      {
        percent: 70,
        criteria:
          'Level 3 impairment in the highest-severity facet. Examples: severely impaired memory (unable to attend to more than one unrelated task); markedly impaired judgment; social interaction inappropriate most or all of the time; often disoriented; motor activity moderately decreased; severely impaired communication.',
        keywords: ['Level 3', 'severe impairment', 'markedly impaired judgment', 'often disoriented'],
      },
      {
        percent: 100,
        criteria:
          'Total impairment in one or more facets. Examples: completely unable to attend to any task; totally inappropriate social interaction; consistently disoriented; near-total decrease in motor activity; complete inability to communicate; persistently altered state of consciousness (coma, vegetative state).',
        keywords: ['total impairment', 'unable to attend to any task', 'consistently disoriented', 'altered consciousness'],
      },
    ],
  },

  // 29. Epilepsy / Seizures (DC 8910/8911)
  {
    conditionId: 'epilepsy',
    conditionName: 'Epilepsy (Grand Mal / Petit Mal)',
    diagnosticCode: '8910/8911',
    cfrReference: '38 CFR § 4.124a, DC 8910/8911',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'A confirmed diagnosis of epilepsy with a history of seizures (grand mal: at least 1 major seizure in last 2 years, or at least 2 minor seizures in last 6 months).',
        keywords: ['confirmed diagnosis', 'history of seizures'],
      },
      {
        percent: 20,
        criteria: 'Grand mal: at least 1 major seizure in the last year, or at least 2 in the last 2 years. Petit mal: minor seizure frequency assessed similarly.',
        keywords: ['1 major seizure per year', '2 in 2 years'],
      },
      {
        percent: 40,
        criteria: 'Grand mal: at least 1 major seizure in last 6 months, or 2 in last year. Petit mal: more frequent minor seizures.',
        keywords: ['1 major seizure in 6 months', '2 per year'],
      },
      {
        percent: 60,
        criteria: 'Grand mal: averaging at least 1 major seizure in 4 months over the last year, or; more than 10 minor seizures weekly.',
        keywords: ['1 major seizure every 4 months', '10+ minor seizures weekly'],
      },
      {
        percent: 80,
        criteria: 'Grand mal: averaging at least 1 major seizure in 3 months over the last year.',
        keywords: ['1 major seizure every 3 months', 'frequent major seizures'],
      },
      {
        percent: 100,
        criteria: 'Grand mal: averaging at least 1 major seizure per month over the last year.',
        keywords: ['1 major seizure per month', 'monthly seizures'],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SKIN — 38 CFR § 4.118
  // ═══════════════════════════════════════════════════════════════════════════

  // 30. Eczema / Dermatitis
  {
    conditionId: 'eczema',
    conditionName: 'Eczema (Dermatitis / Atopic Dermatitis)',
    diagnosticCode: '7806',
    cfrReference: '38 CFR § 4.118, DC 7806',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria: 'Less than 5 percent of the entire body, or less than 5 percent of exposed areas affected, and; no more than topical therapy required during the past 12-month period.',
        keywords: ['less than 5% body', 'less than 5% exposed', 'topical therapy only'],
      },
      {
        percent: 10,
        criteria: 'At least 5 percent, but less than 20 percent, of the entire body, or at least 5 percent, but less than 20 percent, of exposed areas affected, or; intermittent systemic therapy such as corticosteroids or other immunosuppressive drugs required for a total duration of less than six weeks during the past 12-month period.',
        keywords: ['5-20% body', '5-20% exposed', 'intermittent systemic therapy', 'less than 6 weeks corticosteroids'],
      },
      {
        percent: 30,
        criteria: '20 to 40 percent of the entire body or 20 to 40 percent of exposed areas affected, or; systemic therapy such as corticosteroids or other immunosuppressive drugs required for a total duration of six weeks or more, but not constantly, during the past 12-month period.',
        keywords: ['20-40% body', '20-40% exposed', 'systemic therapy 6+ weeks', 'corticosteroids'],
      },
      {
        percent: 60,
        criteria: 'More than 40 percent of the entire body, or more than 40 percent of exposed areas affected, or; constant or near-constant systemic therapy such as corticosteroids or other immunosuppressive drugs required during the past 12-month period.',
        keywords: ['more than 40% body', 'more than 40% exposed', 'constant systemic therapy'],
      },
    ],
  },

  // 31. Scars
  {
    conditionId: 'scars',
    conditionName: 'Scars (General)',
    diagnosticCode: '7801-7805',
    cfrReference: '38 CFR § 4.118, DC 7801-7805',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria:
          'DC 7801 (deep, nonlinear scars not of head/face/neck): area of at least 6 square inches (39 sq. cm) but less than 12 sq. in. (77 sq. cm). DC 7802 (superficial, nonlinear scars not of head/face/neck): area of 144 square inches (929 sq. cm) or greater. DC 7804 (unstable or painful scars): one or two scars that are unstable or painful. DC 7805: scars rated on limitation of function of the affected part.',
        keywords: [
          'deep scar 6+ sq in',
          'superficial scar 144+ sq in',
          '1-2 painful or unstable scars',
          'limitation of function',
        ],
      },
      {
        percent: 20,
        criteria:
          'DC 7801: area of at least 12 sq. in. (77 sq. cm) but less than 72 sq. in. (465 sq. cm). DC 7804: three or four scars that are unstable or painful.',
        keywords: ['deep scar 12-72 sq in', '3-4 painful or unstable scars'],
      },
      {
        percent: 30,
        criteria:
          'DC 7801: area of at least 72 sq. in. (465 sq. cm) but less than 144 sq. in. (929 sq. cm). DC 7804: five or more scars that are unstable or painful.',
        keywords: ['deep scar 72-144 sq in', '5+ painful or unstable scars'],
      },
      {
        percent: 40,
        criteria:
          'DC 7801: area of 144 sq. in. (929 sq. cm) or greater.',
        keywords: ['deep scar 144+ sq in'],
      },
    ],
  },

  // 32. Psoriasis
  {
    conditionId: 'psoriasis',
    conditionName: 'Psoriasis',
    diagnosticCode: '7816',
    cfrReference: '38 CFR § 4.118, DC 7816',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria: 'Less than 5 percent of entire body or exposed areas, topical therapy only in past 12 months.',
        keywords: ['less than 5%', 'topical therapy only'],
      },
      {
        percent: 10,
        criteria: 'At least 5 but less than 20 percent of entire body or exposed areas, or; intermittent systemic therapy for less than 6 weeks in past 12 months.',
        keywords: ['5-20%', 'intermittent systemic therapy'],
      },
      {
        percent: 30,
        criteria: '20 to 40 percent of entire body or exposed areas, or; systemic therapy for 6+ weeks but not constantly in past 12 months.',
        keywords: ['20-40%', 'systemic therapy 6+ weeks'],
      },
      {
        percent: 60,
        criteria: 'More than 40 percent of entire body or exposed areas, or; constant or near-constant systemic therapy in past 12 months.',
        keywords: ['more than 40%', 'constant systemic therapy'],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ENDOCRINE — 38 CFR § 4.119
  // ═══════════════════════════════════════════════════════════════════════════

  // 33. Diabetes Mellitus Type II
  {
    conditionId: 'diabetes',
    conditionName: 'Diabetes Mellitus Type II',
    diagnosticCode: '7913',
    cfrReference: '38 CFR § 4.119, DC 7913',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Manageable by restricted diet only.',
        keywords: ['diet controlled', 'restricted diet', 'no medication'],
      },
      {
        percent: 20,
        criteria: 'Requiring insulin and restricted diet, or; oral hypoglycemic agent and restricted diet.',
        keywords: ['insulin', 'oral hypoglycemic', 'metformin', 'restricted diet', 'medication required'],
      },
      {
        percent: 40,
        criteria: 'Requiring insulin, restricted diet, and regulation of activities.',
        keywords: ['insulin', 'restricted diet', 'regulation of activities', 'doctor-ordered activity restriction'],
      },
      {
        percent: 60,
        criteria: 'Requiring insulin, restricted diet, and regulation of activities with episodes of ketoacidosis or hypoglycemic reactions requiring one or two hospitalizations per year or twice a month visits to a diabetic care provider, plus complications that would not be compensable if separately evaluated.',
        keywords: [
          'ketoacidosis',
          'hypoglycemic reactions',
          'hospitalizations',
          'twice monthly visits',
          'non-compensable complications',
        ],
      },
      {
        percent: 100,
        criteria: 'Requiring more than one daily injection of insulin, restricted diet, and regulation of activities (avoidance of strenuous occupational and recreational activities) with episodes of ketoacidosis or hypoglycemic reactions requiring at least three hospitalizations per year or weekly visits to a diabetic care provider, plus either progressive loss of weight and strength or complications that would be compensable if separately evaluated.',
        keywords: [
          'multiple daily insulin injections',
          '3+ hospitalizations per year',
          'weekly visits',
          'progressive weight loss',
          'compensable complications',
        ],
      },
    ],
  },

  // 34. Hypothyroidism
  {
    conditionId: 'hypothyroidism',
    conditionName: 'Hypothyroidism',
    diagnosticCode: '7903',
    cfrReference: '38 CFR § 4.119, DC 7903',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Fatigability, or; continuous medication required for control.',
        keywords: ['fatigability', 'continuous medication', 'levothyroxine', 'Synthroid'],
      },
      {
        percent: 30,
        criteria: 'Mental sluggishness and muscular weakness, constipation, and weight gain.',
        keywords: ['mental sluggishness', 'muscular weakness', 'constipation', 'weight gain'],
      },
      {
        percent: 60,
        criteria: 'Muscular weakness, mental disturbance, and weight gain.',
        keywords: ['muscular weakness', 'mental disturbance', 'weight gain', 'cognitive impairment'],
      },
      {
        percent: 100,
        criteria: 'Cold intolerance, muscular weakness, cardiovascular involvement, mental disturbance (dementia, slowing of thought, depression), bradycardia (less than 60 beats per minute), and sleepiness.',
        keywords: [
          'cold intolerance',
          'cardiovascular involvement',
          'dementia',
          'bradycardia',
          'sleepiness',
          'mental disturbance',
        ],
      },
    ],
  },

  // 35. Hyperthyroidism
  {
    conditionId: 'hyperthyroidism',
    conditionName: 'Hyperthyroidism (Graves Disease)',
    diagnosticCode: '7900',
    cfrReference: '38 CFR § 4.119, DC 7900',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Tachycardia, which may be intermittent, and tremor, or; continuous medication required for control.',
        keywords: ['tachycardia', 'tremor', 'continuous medication'],
      },
      {
        percent: 30,
        criteria: 'Tachycardia, tremor, and increased pulse pressure or blood pressure.',
        keywords: ['tachycardia', 'tremor', 'increased pulse pressure', 'hypertension'],
      },
      {
        percent: 60,
        criteria: 'Emotional instability, tachycardia, fatigability, and increased pulse pressure or blood pressure.',
        keywords: ['emotional instability', 'tachycardia', 'fatigability', 'increased pulse pressure'],
      },
      {
        percent: 100,
        criteria: 'Thyroid enlargement, tachycardia (more than 150 beats per minute), eye involvement, muscular weakness, loss of weight, and sympathetic nervous system, cardiovascular, or gastrointestinal symptoms.',
        keywords: ['thyroid enlargement', 'tachycardia 150+', 'eye involvement', 'weight loss', 'muscular weakness'],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CARDIOVASCULAR — 38 CFR § 4.104
  // ═══════════════════════════════════════════════════════════════════════════

  // 36. Hypertension
  {
    conditionId: 'hypertension',
    conditionName: 'Hypertension',
    diagnosticCode: '7101',
    cfrReference: '38 CFR § 4.104, DC 7101',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria:
          'Diastolic pressure predominantly 100 or more, or; systolic pressure predominantly 160 or more, or; minimum evaluation for an individual with a history of diastolic pressure predominantly 100 or more who requires continuous medication for control.',
        keywords: [
          'diastolic 100+',
          'systolic 160+',
          'continuous medication',
          'history of diastolic 100+',
        ],
      },
      {
        percent: 20,
        criteria: 'Diastolic pressure predominantly 110 or more, or; systolic pressure predominantly 200 or more.',
        keywords: ['diastolic 110+', 'systolic 200+'],
      },
      {
        percent: 40,
        criteria: 'Diastolic pressure predominantly 120 or more.',
        keywords: ['diastolic 120+'],
      },
      {
        percent: 60,
        criteria: 'Diastolic pressure predominantly 130 or more.',
        keywords: ['diastolic 130+'],
      },
    ],
  },

  // 37. Coronary Artery Disease / Ischemic Heart Disease
  {
    conditionId: 'heart-disease',
    conditionName: 'Coronary Artery Disease (Ischemic Heart Disease)',
    diagnosticCode: '7005',
    cfrReference: '38 CFR § 4.104, DC 7005',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Workload of greater than 7 METs but not greater than 10 METs results in dyspnea, fatigue, angina, dizziness, or syncope, or; continuous medication required.',
        keywords: ['7-10 METs', 'continuous medication', 'dyspnea', 'fatigue'],
      },
      {
        percent: 30,
        criteria: 'Workload of greater than 5 METs but not greater than 7 METs results in dyspnea, fatigue, angina, dizziness, or syncope, or; evidence of cardiac hypertrophy or dilatation on electrocardiogram, echocardiogram, or X-ray.',
        keywords: ['5-7 METs', 'cardiac hypertrophy', 'cardiac dilatation'],
      },
      {
        percent: 60,
        criteria: 'More than one episode of acute congestive heart failure in the past year, or; workload of greater than 3 METs but not greater than 5 METs results in dyspnea, fatigue, angina, dizziness, or syncope, or; left ventricular dysfunction with an ejection fraction of 30 to 50 percent.',
        keywords: ['3-5 METs', 'congestive heart failure', 'ejection fraction 30-50%'],
      },
      {
        percent: 100,
        criteria: 'Chronic congestive heart failure, or; workload of 3 METs or less results in dyspnea, fatigue, angina, dizziness, or syncope, or; left ventricular dysfunction with an ejection fraction of less than 30 percent.',
        keywords: ['chronic CHF', '3 METs or less', 'ejection fraction less than 30%'],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GENITOURINARY — 38 CFR § 4.115
  // ═══════════════════════════════════════════════════════════════════════════

  // 38. Erectile Dysfunction
  {
    conditionId: 'erectile-dysfunction',
    conditionName: 'Erectile Dysfunction',
    diagnosticCode: '7522',
    cfrReference: '38 CFR § 4.115b, DC 7522',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 0,
        criteria:
          'Loss of erectile power without penis deformity. Typically rated at 0% but eligible for Special Monthly Compensation (SMC-K) for loss of use of a creative organ, which provides an additional monthly payment (approximately $131/month in 2026). Note: DC 7522 provides a 20% rating only when there is deformity of the penis with loss of erectile power.',
        keywords: [
          '0% rating',
          'SMC-K',
          'loss of use of creative organ',
          'special monthly compensation',
          'additional payment',
          'no deformity required for SMC-K',
        ],
      },
      {
        percent: 20,
        criteria: 'Deformity of the penis with loss of erectile power.',
        keywords: ['penis deformity', 'loss of erectile power', 'Peyronie disease'],
      },
    ],
  },

  // 39. Urinary Frequency
  {
    conditionId: 'urinary-frequency',
    conditionName: 'Urinary Frequency',
    diagnosticCode: '7541',
    cfrReference: '38 CFR § 4.115a',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Daytime voiding interval between two and three hours, or; awakening to void two times per night.',
        keywords: ['voiding every 2-3 hours', 'nocturia 2x'],
      },
      {
        percent: 20,
        criteria: 'Daytime voiding interval between one and two hours, or; awakening to void three to four times per night.',
        keywords: ['voiding every 1-2 hours', 'nocturia 3-4x'],
      },
      {
        percent: 40,
        criteria: 'Daytime voiding interval less than one hour, or; awakening to void five or more times per night.',
        keywords: ['voiding less than hourly', 'nocturia 5+ times'],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EYE CONDITIONS — 38 CFR § 4.79
  // ═══════════════════════════════════════════════════════════════════════════

  // 40. Dry Eye Syndrome
  {
    conditionId: 'dry-eye',
    conditionName: 'Dry Eye Syndrome (Keratoconjunctivitis Sicca)',
    diagnosticCode: '6025',
    cfrReference: '38 CFR § 4.79, DC 6025',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria:
          'Dry eye requiring the use of artificial tears. Rated based on visual impairment due to the condition, but a minimum 10% rating is assignable under the General Rating Formula for Diseases of the Eye when the condition requires continuous treatment.',
        keywords: ['artificial tears', 'continuous treatment', 'visual impairment'],
      },
      {
        percent: 20,
        criteria:
          'Rated based on visual impairment or disfigurement when symptoms are more significant. May include corrected visual acuity reduction or visual field defects attributable to the condition.',
        keywords: ['visual acuity reduction', 'visual field defect', 'disfigurement'],
      },
      {
        percent: 30,
        criteria:
          'Based on more significant visual impairment (reduced visual acuity or visual field loss) attributable to the dry eye condition, per the General Rating Formula for Diseases of the Eye.',
        keywords: ['significant visual impairment', 'visual field loss'],
      },
    ],
  },

  // 41. Glaucoma
  {
    conditionId: 'glaucoma',
    conditionName: 'Glaucoma, Open-Angle',
    diagnosticCode: '6013',
    cfrReference: '38 CFR § 4.79, DC 6013',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Minimum rating with continuous medication for control. Otherwise rated on visual impairment.',
        keywords: ['continuous medication', 'eye drops', 'visual impairment'],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL COMMON CONDITIONS
  // ═══════════════════════════════════════════════════════════════════════════

  // 42. Fibromyalgia (DC 5025)
  {
    conditionId: 'fibromyalgia',
    conditionName: 'Fibromyalgia',
    diagnosticCode: '5025',
    cfrReference: '38 CFR § 4.71a, DC 5025',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Widespread musculoskeletal pain and tender points, with or without associated fatigue, sleep disturbance, stiffness, paresthesias, headache, irritable bowel symptoms, depression, anxiety, or Raynaud-like symptoms, that require continuous medication for control.',
        keywords: ['widespread pain', 'tender points', 'continuous medication', 'fatigue'],
      },
      {
        percent: 20,
        criteria: 'Symptoms as above that are episodic, with exacerbations often precipitated by environmental or emotional stress or by overexertion, but that are present more than one-third of the time.',
        keywords: ['episodic', 'exacerbations', 'present more than one-third of time', 'stress-triggered'],
      },
      {
        percent: 40,
        criteria: 'Symptoms as above that are constant, or nearly so, and refractory to therapy. 40% is the maximum schedular rating.',
        keywords: ['constant symptoms', 'refractory to therapy', 'maximum 40%', 'near-constant'],
      },
    ],
  },

  // 43. Chronic Fatigue Syndrome (DC 6354)
  {
    conditionId: 'chronic-fatigue',
    conditionName: 'Chronic Fatigue Syndrome',
    diagnosticCode: '6354',
    cfrReference: '38 CFR § 4.88b, DC 6354',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Signs and symptoms of CFS that wax and wane but result in periods of incapacitation of at least one but less than two weeks total duration per year, or; symptoms controlled by continuous medication.',
        keywords: ['waxing and waning', '1-2 weeks incapacitation per year', 'continuous medication'],
      },
      {
        percent: 20,
        criteria: 'Signs and symptoms are nearly constant and restrict routine daily activities by less than 25 percent of the pre-illness level, or; incapacitating episodes of at least two but less than four weeks total duration per year.',
        keywords: ['nearly constant', 'restrict activities less than 25%', '2-4 weeks incapacitation'],
      },
      {
        percent: 40,
        criteria: 'Signs and symptoms are nearly constant and restrict routine daily activities to 50 to 75 percent of the pre-illness level, or; incapacitating episodes of at least four but less than six weeks total duration per year.',
        keywords: ['restrict activities 50-75%', '4-6 weeks incapacitation'],
      },
      {
        percent: 60,
        criteria: 'Signs and symptoms are nearly constant and so severe as to restrict routine daily activities to less than 50 percent of the pre-illness level, or; incapacitating episodes of at least six weeks total duration per year.',
        keywords: ['restrict activities less than 50%', '6+ weeks incapacitation'],
      },
      {
        percent: 100,
        criteria: 'Signs and symptoms are nearly constant and so severe as to restrict routine daily activities almost completely and which may occasionally preclude self-care.',
        keywords: ['nearly complete restriction', 'may preclude self-care', 'total impairment'],
      },
    ],
  },

  // 44. Flatfoot / Pes Planus (already added as #15, adding here for bilateral-specific entry)
  // Covered above under plantar-fasciitis / DC 5276

  // 45. Carpal Tunnel Syndrome — Median Nerve (DC 8515)
  {
    conditionId: 'carpal-tunnel',
    conditionName: 'Carpal Tunnel Syndrome — Median Nerve',
    diagnosticCode: '8515',
    cfrReference: '38 CFR § 4.124a, DC 8515',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Mild incomplete paralysis of the median nerve (same for dominant and non-dominant hand).',
        keywords: ['mild', 'incomplete paralysis', 'numbness', 'tingling'],
      },
      {
        percent: 30,
        criteria: 'Moderate incomplete paralysis of the median nerve — dominant hand. (20% non-dominant.)',
        keywords: ['moderate', 'dominant 30%', 'non-dominant 20%', 'grip weakness'],
      },
      {
        percent: 50,
        criteria: 'Severe incomplete paralysis of the median nerve — dominant hand. (40% non-dominant.)',
        keywords: ['severe', 'dominant 50%', 'non-dominant 40%', 'significant weakness'],
      },
      {
        percent: 70,
        criteria: 'Complete paralysis of the median nerve — dominant hand. (60% non-dominant.) The hand inclined to the ulnar side, the index and middle fingers more extended than normally, cannot make a fist, index and middle fingers remain extended; cannot flex distal phalanx of thumb, defective opposition and abduction of the thumb at right angles to palm; weakened flexion of wrist; pain with trophic disturbances.',
        keywords: ['complete paralysis', 'dominant 70%', 'non-dominant 60%', 'cannot make fist'],
      },
    ],
  },

  // 46. Intervertebral Disc Syndrome — Incapacitating Episodes Formula (DC 5243)
  {
    conditionId: 'lumbar-ddd',
    conditionName: 'Intervertebral Disc Syndrome (IVDS) — Incapacitating Episodes',
    diagnosticCode: '5243',
    cfrReference: '38 CFR § 4.71a, DC 5243',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Incapacitating episodes having a total duration of at least one week but less than 2 weeks during the past 12 months.',
        keywords: ['1-2 weeks incapacitating episodes', 'bed rest prescribed by physician'],
      },
      {
        percent: 20,
        criteria: 'Incapacitating episodes having a total duration of at least 2 weeks but less than 4 weeks during the past 12 months.',
        keywords: ['2-4 weeks incapacitating episodes'],
      },
      {
        percent: 40,
        criteria: 'Incapacitating episodes having a total duration of at least 4 weeks but less than 6 weeks during the past 12 months.',
        keywords: ['4-6 weeks incapacitating episodes'],
      },
      {
        percent: 60,
        criteria: 'Incapacitating episodes having a total duration of at least 6 weeks during the past 12 months. Note: An incapacitating episode is defined as a period of acute signs and symptoms due to IVDS that requires bed rest prescribed by a physician and treatment by a physician.',
        keywords: ['6+ weeks incapacitating episodes', 'physician-prescribed bed rest'],
      },
    ],
  },

  // 47. Rotator Cuff Tear / Shoulder Impingement
  {
    conditionId: 'shoulder-impingement',
    conditionName: 'Shoulder Impingement / Rotator Cuff',
    diagnosticCode: '5201/5200',
    cfrReference: '38 CFR § 4.71a, DC 5201',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 20,
        criteria: 'Arm motion limited at shoulder level (90 degrees). Same for dominant/non-dominant.',
        keywords: ['arm at shoulder level', 'abduction to 90'],
      },
      {
        percent: 30,
        criteria: 'Arm motion limited midway between side and shoulder level — dominant (20% non-dominant).',
        keywords: ['midway between side and shoulder', 'dominant 30%'],
      },
      {
        percent: 40,
        criteria: 'Motion limited to 25 degrees from side — dominant (30% non-dominant).',
        keywords: ['25 degrees from side', 'dominant 40%'],
      },
    ],
  },

  // 48. Lumbar Radiculopathy (specific entry)
  {
    conditionId: 'lumbar-radiculopathy',
    conditionName: 'Lumbar Radiculopathy (Sciatica)',
    diagnosticCode: '8520',
    cfrReference: '38 CFR § 4.124a, DC 8520',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Mild incomplete paralysis of the sciatic nerve.',
        keywords: ['mild', 'incomplete paralysis', 'occasional numbness', 'tingling in leg'],
      },
      {
        percent: 20,
        criteria: 'Moderate incomplete paralysis of the sciatic nerve.',
        keywords: ['moderate', 'frequent pain radiating down leg', 'numbness'],
      },
      {
        percent: 40,
        criteria: 'Moderately severe incomplete paralysis of the sciatic nerve.',
        keywords: ['moderately severe', 'significant weakness', 'sensory loss'],
      },
      {
        percent: 60,
        criteria: 'Severe incomplete paralysis with marked muscular atrophy.',
        keywords: ['severe', 'marked muscular atrophy', 'significant functional loss'],
      },
      {
        percent: 80,
        criteria: 'Complete paralysis: foot dangles and drops, no active movement below knee.',
        keywords: ['complete paralysis', 'foot drop', 'no movement below knee'],
      },
    ],
  },

  // 49. Cervical Radiculopathy (Upper Extremity)
  {
    conditionId: 'cervical-radiculopathy',
    conditionName: 'Cervical Radiculopathy — Upper Extremity',
    diagnosticCode: '8510-8519',
    cfrReference: '38 CFR § 4.124a, DC 8510-8519',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Mild incomplete paralysis of the affected upper extremity nerve (e.g., upper/middle/lower radicular group).',
        keywords: ['mild', 'incomplete paralysis', 'numbness in arm/hand'],
      },
      {
        percent: 20,
        criteria: 'Moderate incomplete paralysis — non-dominant. (Varies by nerve: dominant arm ratings are higher.)',
        keywords: ['moderate', 'non-dominant 20%', 'grip weakness'],
      },
      {
        percent: 30,
        criteria: 'Moderate incomplete paralysis — dominant hand (for certain nerve groups).',
        keywords: ['moderate', 'dominant 30%'],
      },
      {
        percent: 40,
        criteria: 'Moderate incomplete paralysis of upper radicular group — dominant, or severe incomplete paralysis of various nerves — non-dominant.',
        keywords: ['moderate upper radicular dominant', 'severe non-dominant'],
      },
      {
        percent: 50,
        criteria: 'Severe incomplete paralysis — dominant hand (for certain nerve groups).',
        keywords: ['severe', 'dominant 50%', 'significant functional impairment'],
      },
    ],
  },

  // 50. Gastric / Duodenal Ulcer
  {
    conditionId: 'peptic-ulcer-disease',
    conditionName: 'Duodenal / Gastric Ulcer',
    diagnosticCode: '7305/7306',
    cfrReference: '38 CFR § 4.114, DC 7305/7306',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      {
        percent: 10,
        criteria: 'Mild: recurring at least once a year but less than the criteria for 20%.',
        keywords: ['mild', 'recurring yearly'],
      },
      {
        percent: 20,
        criteria: 'Moderate: recurring episodes of severe symptoms two or three times a year averaging 10 days or more; or, continuous moderate manifestations.',
        keywords: ['moderate', 'recurring 2-3 times per year', 'continuous moderate symptoms'],
      },
      {
        percent: 40,
        criteria: 'Moderately severe: less than severe but with impairment of health manifested by anemia and weight loss; or, recurrent incapacitating episodes averaging 10 days or more at least four times a year.',
        keywords: ['moderately severe', 'anemia', 'weight loss', 'incapacitating episodes 4x/year'],
      },
      {
        percent: 60,
        criteria: 'Severe: pain only partially relieved by standard therapy, periodic vomiting, recurrent hematemesis or melena, with manifestations of anemia and weight loss productive of definite impairment of health.',
        keywords: ['severe', 'partially relieved', 'vomiting', 'hematemesis', 'melena', 'definite impairment of health'],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Look up rating criteria by the conditionId field (matches id from vaConditions).
 */
export function getRatingCriteria(
  conditionId: string,
): ConditionRatingCriteria | undefined {
  return conditionRatingCriteria.find(
    (c) => c.conditionId === conditionId,
  );
}

/**
 * Look up rating criteria by diagnostic code.
 * Checks whether the provided code appears anywhere in the diagnosticCode string
 * (handles compound codes like "5260/5261").
 */
export function getRatingCriteriaByDC(
  diagnosticCode: string,
): ConditionRatingCriteria | undefined {
  return conditionRatingCriteria.find(
    (c) => c.diagnosticCode.includes(diagnosticCode),
  );
}

/**
 * Get all conditions that belong to a given body-system CFR section.
 */
export function getRatingCriteriaByCfrSection(
  sectionFragment: string,
): ConditionRatingCriteria[] {
  return conditionRatingCriteria.filter((c) =>
    c.cfrReference.includes(sectionFragment),
  );
}

/**
 * Return all rating criteria entries. Useful for iteration / search.
 */
export function getAllRatingCriteria(): ConditionRatingCriteria[] {
  return conditionRatingCriteria;
}
