import { dcMatches } from '@/utils/dcMatch';

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

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL MUSCULOSKELETAL — 38 CFR § 4.71a
  // ═══════════════════════════════════════════════════════════════════════════

  {
    conditionId: 'thoracolumbar-ddd',
    conditionName: 'Thoracolumbar Spine Degenerative Arthritis',
    diagnosticCode: '5242',
    cfrReference: '38 CFR § 4.71a, DC 5242',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Forward flexion greater than 60° but not greater than 85°; or, combined range of motion greater than 120° but not greater than 235°; or, muscle spasm, guarding, or localized tenderness not resulting in abnormal gait or spinal contour.', keywords: ['flexion >60°', 'combined ROM >120°', 'muscle spasm', 'guarding'] },
      { percent: 20, criteria: 'Forward flexion greater than 30° but not greater than 60°; or, combined range of motion not greater than 120°; or, muscle spasm or guarding severe enough to result in an abnormal gait or abnormal spinal contour.', keywords: ['flexion 30-60°', 'combined ROM ≤120°', 'abnormal gait', 'abnormal spinal contour'] },
      { percent: 40, criteria: 'Forward flexion of the thoracolumbar spine 30° or less; or, favorable ankylosis of the entire thoracolumbar spine.', keywords: ['flexion ≤30°', 'favorable ankylosis'] },
      { percent: 50, criteria: 'Unfavorable ankylosis of the entire thoracolumbar spine.', keywords: ['unfavorable ankylosis', 'thoracolumbar'] },
      { percent: 100, criteria: 'Unfavorable ankylosis of the entire spine.', keywords: ['unfavorable ankylosis', 'entire spine'] },
    ],
    examTips: ['Report worst-day ROM', 'Document pain on motion and where pain begins', 'Describe flare-ups: frequency, duration, additional limitation', 'Mention radicular symptoms separately'],
    commonMistakes: ['Not reporting flare-up impact on ROM', 'Forgetting to mention radiculopathy symptoms', 'Testing on a good day after taking pain medication'],
  },
  {
    conditionId: 'cervical-ddd',
    conditionName: 'Cervical Spine Degenerative Disc Disease',
    diagnosticCode: '5243',
    cfrReference: '38 CFR § 4.71a, DC 5243',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Forward flexion greater than 30° but not greater than 40°; or, combined ROM greater than 170° but not greater than 335°; or, muscle spasm/guarding not causing abnormal gait or contour.', keywords: ['cervical flexion >30°', 'combined ROM >170°'] },
      { percent: 20, criteria: 'Forward flexion greater than 15° but not greater than 30°; or, combined ROM not greater than 170°; or, muscle spasm/guarding causing abnormal gait or spinal contour.', keywords: ['cervical flexion 15-30°', 'combined ROM ≤170°', 'abnormal gait'] },
      { percent: 30, criteria: 'Forward flexion of the cervical spine 15° or less; or, favorable ankylosis of the entire cervical spine.', keywords: ['cervical flexion ≤15°', 'favorable ankylosis'] },
      { percent: 40, criteria: 'Unfavorable ankylosis of the entire cervical spine.', keywords: ['unfavorable ankylosis', 'cervical'] },
      { percent: 100, criteria: 'Unfavorable ankylosis of the entire spine.', keywords: ['unfavorable ankylosis', 'entire spine'] },
    ],
    examTips: ['Report worst-day ROM', 'Document pain onset during ROM testing', 'Describe radicular symptoms into arms/hands', 'Note any incapacitating episodes requiring bed rest prescribed by a physician'],
    commonMistakes: ['Not distinguishing cervical from lumbar symptoms', 'Failing to mention numbness/tingling in upper extremities'],
  },
  {
    conditionId: 'ivds',
    conditionName: 'Intervertebral Disc Syndrome (IVDS)',
    diagnosticCode: '5243',
    cfrReference: '38 CFR § 4.71a, DC 5243',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Incapacitating episodes having a total duration of at least one week but less than 2 weeks during the past 12 months.', keywords: ['incapacitating episodes', '1 week', 'bed rest prescribed'] },
      { percent: 20, criteria: 'Incapacitating episodes having a total duration of at least 2 weeks but less than 4 weeks during the past 12 months.', keywords: ['2 weeks', 'incapacitating', 'prescribed bed rest'] },
      { percent: 40, criteria: 'Incapacitating episodes having a total duration of at least 4 weeks but less than 6 weeks during the past 12 months.', keywords: ['4 weeks', 'incapacitating episodes'] },
      { percent: 60, criteria: 'Incapacitating episodes having a total duration of at least 6 weeks during the past 12 months.', keywords: ['6+ weeks', 'incapacitating episodes', 'physician-prescribed bed rest'] },
    ],
    examTips: ['An "incapacitating episode" requires bed rest PRESCRIBED by a physician', 'Keep a log of doctor-prescribed bed rest episodes', 'Get your doctor to document each episode in your records'],
    commonMistakes: ['Self-prescribed bed rest does not count', 'Not having physician documentation of prescribed bed rest'],
  },
  {
    conditionId: 'flatfoot',
    conditionName: 'Flatfoot (Pes Planus)',
    diagnosticCode: '5276',
    cfrReference: '38 CFR § 4.71a, DC 5276',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Mild: symptoms relieved by built-up shoe or arch support.', keywords: ['mild', 'arch support', 'built-up shoe'] },
      { percent: 10, criteria: 'Moderate: weight-bearing line over or medial to great toe, inward bowing of the Achilles tendon, pain on manipulation and use of the feet (bilateral or unilateral).', keywords: ['moderate', 'weight-bearing line', 'inward bowing', 'pain on manipulation'] },
      { percent: 30, criteria: 'Severe bilateral: objective evidence of marked deformity (pronation, abduction), pain on manipulation and use accentuated, indication of swelling on use, characteristic callosities.', keywords: ['severe', 'marked deformity', 'pronation', 'callosities', 'swelling'] },
      { percent: 50, criteria: 'Pronounced bilateral: marked pronation, extreme tenderness of plantar surfaces, marked inward displacement and severe spasm of the Achilles tendon on manipulation, not improved by orthopedic shoes or appliances.', keywords: ['pronounced', 'extreme tenderness', 'marked inward displacement', 'severe spasm', 'not improved by orthotics'] },
    ],
    examTips: ['Describe pain with standing and walking', 'Note if orthotics fail to relieve symptoms', 'Document calluses and swelling'],
    commonMistakes: ['Not noting bilateral vs unilateral (ratings differ)', 'Failing to mention orthotic ineffectiveness'],
  },
  {
    conditionId: 'hallux-valgus',
    conditionName: 'Hallux Valgus (Bunion)',
    diagnosticCode: '5280',
    cfrReference: '38 CFR § 4.71a, DC 5280',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Operated with resection of metatarsal head; or, severe, equivalent to amputation of great toe.', keywords: ['resection metatarsal head', 'severe', 'equivalent to amputation'] },
    ],
    examTips: ['Maximum schedular rating is 10% per foot', 'Document if condition causes secondary gait abnormality affecting knees/hips/back', 'Consider secondary conditions from altered gait'],
    commonMistakes: ['Not claiming bilateral (each foot rated separately)', 'Not claiming secondary conditions from altered gait'],
  },
  {
    conditionId: 'hallux-rigidus',
    conditionName: 'Hallux Rigidus',
    diagnosticCode: '5281',
    cfrReference: '38 CFR § 4.71a, DC 5281',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Unilateral, severe. Rate as hallux valgus, severe.', keywords: ['severe', 'unilateral', 'rigid great toe'] },
    ],
    examTips: ['Maximum schedular is 10% per foot', 'Document impact on gait and walking', 'Note any secondary conditions from altered gait'],
    commonMistakes: ['Not claiming bilateral when both feet affected', 'Not pursuing secondary claims for knee/hip/back from gait changes'],
  },
  {
    conditionId: 'hammer-toes',
    conditionName: 'Hammer Toes',
    diagnosticCode: '5282',
    cfrReference: '38 CFR § 4.71a, DC 5282',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Single toes.', keywords: ['single toe', 'hammer toe'] },
      { percent: 10, criteria: 'All toes, unilateral, without claw foot.', keywords: ['all toes', 'unilateral'] },
    ],
    examTips: ['Document which toes are affected', 'Note pain with walking and shoe wear', 'Consider secondary conditions'],
    commonMistakes: ['Not claiming bilateral', 'Not documenting functional impact on walking'],
  },
  {
    conditionId: 'elbow-flexion',
    conditionName: 'Elbow Limitation of Flexion',
    diagnosticCode: '5206',
    cfrReference: '38 CFR § 4.71a, DC 5206',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Flexion limited to 110°.', keywords: ['flexion 110°'] },
      { percent: 10, criteria: 'Flexion limited to 100°.', keywords: ['flexion 100°'] },
      { percent: 20, criteria: 'Flexion limited to 90°.', keywords: ['flexion 90°'] },
      { percent: 30, criteria: 'Flexion limited to 70° (major) / 20% (minor).', keywords: ['flexion 70°'] },
      { percent: 40, criteria: 'Flexion limited to 55° (major) / 30% (minor).', keywords: ['flexion 55°'] },
      { percent: 50, criteria: 'Flexion limited to 45° (major) / 40% (minor).', keywords: ['flexion 45°'] },
    ],
    examTips: ['Specify dominant vs non-dominant arm', 'Report ROM after repetitive use', 'Document pain onset'],
    commonMistakes: ['Not specifying major/minor extremity', 'Not documenting painful motion'],
  },
  {
    conditionId: 'elbow-extension',
    conditionName: 'Elbow Limitation of Extension',
    diagnosticCode: '5207',
    cfrReference: '38 CFR § 4.71a, DC 5207',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Extension limited to 45° or 60°.', keywords: ['extension 45-60°'] },
      { percent: 20, criteria: 'Extension limited to 75°.', keywords: ['extension 75°'] },
      { percent: 30, criteria: 'Extension limited to 90° (major) / 20% (minor).', keywords: ['extension 90°'] },
      { percent: 40, criteria: 'Extension limited to 100° (major) / 30% (minor).', keywords: ['extension 100°'] },
      { percent: 50, criteria: 'Extension limited to 110° (major) / 40% (minor).', keywords: ['extension 110°'] },
    ],
    examTips: ['Specify dominant arm', 'Document functional loss', 'Note repetitive use impact'],
    commonMistakes: ['Not specifying major/minor arm', 'Not testing after repetitive motion'],
  },
  {
    conditionId: 'wrist-limited-motion',
    conditionName: 'Wrist Limitation of Motion',
    diagnosticCode: '5215',
    cfrReference: '38 CFR § 4.71a, DC 5215',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Dorsiflexion less than 15°; or, palmar flexion limited in line with forearm.', keywords: ['dorsiflexion <15°', 'palmar flexion limited'] },
    ],
    examTips: ['Max schedular is 10% — consider ankylosis rating if worse', 'Document pain and functional loss', 'Note impact on grip strength'],
    commonMistakes: ['Not considering higher rating under ankylosis DC 5214', 'Not documenting impact on daily activities'],
  },
  {
    conditionId: 'hip-flexion',
    conditionName: 'Hip Limitation of Flexion',
    diagnosticCode: '5252',
    cfrReference: '38 CFR § 4.71a, DC 5252',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Flexion limited to 45°.', keywords: ['hip flexion 45°'] },
      { percent: 20, criteria: 'Flexion limited to 30°.', keywords: ['hip flexion 30°'] },
      { percent: 30, criteria: 'Flexion limited to 20°.', keywords: ['hip flexion 20°'] },
      { percent: 40, criteria: 'Flexion limited to 10°.', keywords: ['hip flexion 10°'] },
    ],
    examTips: ['Document pain onset during ROM', 'Report flare-up impact', 'Note difficulty with stairs, sitting, bending'],
    commonMistakes: ['Not documenting additional limitation during flare-ups', 'Not claiming bilateral when both hips affected'],
  },
  {
    conditionId: 'hip-extension',
    conditionName: 'Hip Limitation of Extension',
    diagnosticCode: '5251',
    cfrReference: '38 CFR § 4.71a, DC 5251',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Extension limited to 5°.', keywords: ['hip extension 5°'] },
    ],
    examTips: ['Max schedular is 10%', 'Document impact on walking and standing', 'Consider other hip DCs for higher rating'],
    commonMistakes: ['Not combining with flexion limitation for separate rating', 'Not documenting gait abnormality'],
  },
  {
    conditionId: 'ankle-limited-motion',
    conditionName: 'Ankle Limited Motion',
    diagnosticCode: '5271',
    cfrReference: '38 CFR § 4.71a, DC 5271',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Moderate limitation of ankle motion.', keywords: ['moderate', 'ankle limitation'] },
      { percent: 20, criteria: 'Marked limitation of ankle motion.', keywords: ['marked', 'ankle limitation'] },
    ],
    examTips: ['Normal dorsiflexion is 0-20°, normal plantar flexion is 0-45°', 'Document instability and giving way', 'Note impact on walking, running, stairs'],
    commonMistakes: ['Not documenting specific ROM measurements', 'Not reporting flare-up frequency and additional limitation'],
  },
  {
    conditionId: 'rotator-cuff-tear',
    conditionName: 'Rotator Cuff Tear / Shoulder Limited Motion',
    diagnosticCode: '5201',
    cfrReference: '38 CFR § 4.71a, DC 5201',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'Arm limited to shoulder level (90°).', keywords: ['arm at shoulder level', '90°', 'major', 'minor'] },
      { percent: 30, criteria: 'Arm limited to midway between side and shoulder level (45°) — major arm. (20% for minor arm.)', keywords: ['midway', '45°', 'major arm'] },
      { percent: 40, criteria: 'Arm limited to 25° from side — major arm. (30% for minor arm.)', keywords: ['25° from side', 'major arm'] },
    ],
    examTips: ['Specify dominant arm', 'Document overhead reach limitation', 'Describe impact on daily activities (dressing, reaching, lifting)', 'Note night pain and sleep disruption'],
    commonMistakes: ['Not specifying dominant arm', 'Testing on a good day', 'Not documenting painful arc of motion'],
  },
  {
    conditionId: 'frozen-shoulder',
    conditionName: 'Frozen Shoulder (Adhesive Capsulitis)',
    diagnosticCode: '5200/5201',
    cfrReference: '38 CFR § 4.71a, DC 5200/5201',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'Arm limited to shoulder level (90°) under DC 5201.', keywords: ['arm at shoulder level', 'adhesive capsulitis'] },
      { percent: 30, criteria: 'Favorable ankylosis of scapulohumeral articulation — major arm. Abduction to 60°, can reach mouth and head.', keywords: ['favorable ankylosis', 'abduction 60°'] },
      { percent: 40, criteria: 'Intermediate ankylosis between favorable and unfavorable — major arm.', keywords: ['intermediate ankylosis'] },
      { percent: 50, criteria: 'Unfavorable ankylosis of scapulohumeral articulation — major arm. Abduction limited to 25°.', keywords: ['unfavorable ankylosis', 'abduction 25°'] },
    ],
    examTips: ['Report all planes of motion (flexion, abduction, rotation)', 'Document if you cannot reach overhead or behind back', 'Note if condition is bilateral'],
    commonMistakes: ['Not getting rated under ankylosis when ROM is severely limited', 'Not specifying dominant arm'],
  },
  {
    conditionId: 'tmj-disorder',
    conditionName: 'Temporomandibular Joint Disorder (TMJ)',
    diagnosticCode: '9905',
    cfrReference: '38 CFR § 4.150, DC 9905',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Inter-incisal range of 31-40mm; or, lateral excursion of 0-4mm.', keywords: ['inter-incisal 31-40mm', 'lateral excursion 0-4mm'] },
      { percent: 20, criteria: 'Inter-incisal range of 21-30mm.', keywords: ['inter-incisal 21-30mm'] },
      { percent: 30, criteria: 'Inter-incisal range of 11-20mm.', keywords: ['inter-incisal 11-20mm'] },
      { percent: 40, criteria: 'Inter-incisal range of 0-10mm.', keywords: ['inter-incisal 0-10mm'] },
    ],
    examTips: ['Report jaw opening measurement in mm', 'Describe clicking, popping, locking', 'Note impact on eating and speaking'],
    commonMistakes: ['Not measuring actual inter-incisal range', 'Not connecting to dental trauma or bruxism in service'],
  },
  {
    conditionId: 'degenerative-arthritis',
    conditionName: 'Degenerative Arthritis (General)',
    diagnosticCode: '5003',
    cfrReference: '38 CFR § 4.71a, DC 5003',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'X-ray evidence of involvement of 2 or more major joints or 2 or more minor joint groups. Or, when limitation of motion is noncompensable, 10% for each major joint or group of minor joints.', keywords: ['x-ray evidence', 'degenerative changes', '2+ major joints'] },
      { percent: 20, criteria: 'X-ray evidence of involvement of 2 or more major joints or joint groups, with occasional incapacitating exacerbations.', keywords: ['incapacitating exacerbations', 'x-ray evidence', 'multiple joints'] },
    ],
    examTips: ['Get X-rays showing degenerative changes', 'Document each joint affected separately', 'Each joint with compensable ROM limitation should be rated under its own DC'],
    commonMistakes: ['Not getting separate ratings for each affected joint', 'Not getting X-rays to document arthritic changes'],
  },
  {
    conditionId: 'rheumatoid-arthritis',
    conditionName: 'Rheumatoid Arthritis',
    diagnosticCode: '5002',
    cfrReference: '38 CFR § 4.71a, DC 5002',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'One or two exacerbations a year in a well-established diagnosis.', keywords: ['1-2 exacerbations per year', 'well-established'] },
      { percent: 40, criteria: 'Symptom combinations productive of definite impairment of health objectively supported by exam findings or incapacitating exacerbations occurring 3 or more times a year.', keywords: ['3+ exacerbations per year', 'impairment of health'] },
      { percent: 60, criteria: 'Less than total but with weight loss and anemia, or severely incapacitating exacerbations 4 or more times a year or a lesser number over prolonged periods.', keywords: ['weight loss', 'anemia', '4+ exacerbations'] },
      { percent: 100, criteria: 'Constitutional manifestations associated with active joint involvement, totally incapacitating.', keywords: ['totally incapacitating', 'constitutional manifestations', 'active joint involvement'] },
    ],
    examTips: ['Document frequency and duration of flare-ups', 'Get labs (sed rate, CRP, RF) during active flares', 'Note weight changes and fatigue'],
    commonMistakes: ['Not documenting constitutional symptoms (fatigue, fever, weight loss)', 'Not getting rated for individual joint limitations as well'],
  },
  {
    conditionId: 'gout',
    conditionName: 'Gout',
    diagnosticCode: '5017',
    cfrReference: '38 CFR § 4.71a, DC 5017',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'One or two exacerbations a year in a well-established diagnosis.', keywords: ['1-2 exacerbations per year'] },
      { percent: 40, criteria: 'Symptom combinations productive of definite impairment of health or incapacitating exacerbations 3+ times/year.', keywords: ['3+ exacerbations', 'impairment of health'] },
      { percent: 60, criteria: 'Weight loss and anemia or severely incapacitating exacerbations 4+ times/year.', keywords: ['weight loss', 'anemia', '4+ exacerbations'] },
      { percent: 100, criteria: 'Totally incapacitating constitutional manifestations with active joint involvement.', keywords: ['totally incapacitating'] },
    ],
    examTips: ['Document frequency of gout attacks', 'Note which joints affected', 'Get uric acid levels documented during flares'],
    commonMistakes: ['Not documenting attack frequency', 'Not noting impact on employment'],
  },
  {
    conditionId: 'pes-cavus',
    conditionName: 'Claw Foot (Pes Cavus)',
    diagnosticCode: '5278',
    cfrReference: '38 CFR § 4.71a, DC 5278',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Bilateral: great toe dorsiflexed, some limitation of dorsiflexion at ankle, definite tenderness under metatarsal heads.', keywords: ['bilateral', 'great toe dorsiflexed', 'metatarsal tenderness'] },
      { percent: 20, criteria: 'Unilateral: all toes tending to dorsiflexion, limitation of dorsiflexion at ankle to right angle, shortened plantar fascia, marked tenderness under metatarsal heads.', keywords: ['all toes dorsiflexion', 'shortened plantar fascia'] },
      { percent: 30, criteria: 'Bilateral: all toes dorsiflexion, limitation dorsiflexion at ankle, shortened plantar fascia, marked tenderness.', keywords: ['bilateral', 'marked tenderness'] },
      { percent: 50, criteria: 'Bilateral: marked contraction of plantar fascia with dropped forefoot, all toes hammer toes, very painful callosities, marked varus deformity.', keywords: ['marked contraction', 'dropped forefoot', 'hammer toes', 'varus deformity'] },
    ],
    examTips: ['Document calluses and deformity', 'Note impact on walking and standing', 'Describe shoe wear problems'],
    commonMistakes: ['Not documenting bilateral involvement', 'Not describing functional limitations'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL NEUROLOGICAL — 38 CFR § 4.124a
  // ═══════════════════════════════════════════════════════════════════════════

  {
    conditionId: 'sciatic-nerve',
    conditionName: 'Sciatic Nerve Paralysis',
    diagnosticCode: '8520',
    cfrReference: '38 CFR § 4.124a, DC 8520',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the sciatic nerve.', keywords: ['mild', 'incomplete paralysis', 'sciatic'] },
      { percent: 20, criteria: 'Moderate incomplete paralysis.', keywords: ['moderate', 'incomplete paralysis'] },
      { percent: 40, criteria: 'Moderately severe incomplete paralysis.', keywords: ['moderately severe', 'incomplete paralysis'] },
      { percent: 60, criteria: 'Severe incomplete paralysis with marked muscular atrophy.', keywords: ['severe', 'marked muscular atrophy'] },
      { percent: 80, criteria: 'Complete paralysis: foot dangles and drops, no active movement possible below knee, flexion of knee weakened or lost.', keywords: ['complete paralysis', 'foot drop', 'no active movement below knee'] },
    ],
    examTips: ['Get EMG/nerve conduction studies', 'Document specific muscle weakness', 'Note areas of numbness/tingling', 'Describe impact on walking and balance'],
    commonMistakes: ['Not getting EMG to document severity', 'Not distinguishing from radiculopathy rating'],
  },
  {
    conditionId: 'peroneal-nerve',
    conditionName: 'Common Peroneal (External Popliteal) Nerve Paralysis',
    diagnosticCode: '8521',
    cfrReference: '38 CFR § 4.124a, DC 8521',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis.', keywords: ['mild', 'peroneal nerve'] },
      { percent: 20, criteria: 'Moderate incomplete paralysis.', keywords: ['moderate'] },
      { percent: 30, criteria: 'Severe incomplete paralysis.', keywords: ['severe', 'incomplete'] },
      { percent: 40, criteria: 'Complete paralysis: foot drop and slight droop of first phalanges of all toes, cannot dorsiflex the foot, loss of extension of proximal phalanges.', keywords: ['complete paralysis', 'foot drop', 'cannot dorsiflex'] },
    ],
    examTips: ['Document foot drop', 'Get EMG studies', 'Note if brace/AFO is required for walking'],
    commonMistakes: ['Not documenting complete vs incomplete paralysis', 'Not noting bilateral involvement'],
  },
  {
    conditionId: 'median-nerve',
    conditionName: 'Median Nerve Paralysis',
    diagnosticCode: '8515',
    cfrReference: '38 CFR § 4.124a, DC 8515',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis.', keywords: ['mild', 'median nerve'] },
      { percent: 30, criteria: 'Moderate incomplete paralysis — major hand. (20% minor.)', keywords: ['moderate', 'major hand'] },
      { percent: 50, criteria: 'Severe incomplete paralysis — major hand. (40% minor.)', keywords: ['severe', 'major hand'] },
      { percent: 70, criteria: 'Complete paralysis — major hand: hand inclined to ulnar side, index/middle fingers more extended than normal, cannot flex distal phalanx of thumb, weakened flexion of wrist. (60% minor.)', keywords: ['complete paralysis', 'major hand'] },
    ],
    examTips: ['Specify dominant hand', 'Get EMG/NCS', 'Document grip strength loss', 'Note dropping objects, numbness pattern'],
    commonMistakes: ['Not specifying dominant hand', 'Not getting nerve conduction studies'],
  },
  {
    conditionId: 'ulnar-nerve',
    conditionName: 'Ulnar Nerve Paralysis',
    diagnosticCode: '8516',
    cfrReference: '38 CFR § 4.124a, DC 8516',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis.', keywords: ['mild', 'ulnar nerve'] },
      { percent: 30, criteria: 'Moderate incomplete paralysis — major. (20% minor.)', keywords: ['moderate', 'major'] },
      { percent: 40, criteria: 'Severe incomplete paralysis — major. (30% minor.)', keywords: ['severe'] },
      { percent: 60, criteria: 'Complete paralysis — major: "griffin claw" deformity, loss of flexion of ring and little fingers, weakened wrist flexion, loss of adduction of thumb. (50% minor.)', keywords: ['complete paralysis', 'griffin claw', 'major'] },
    ],
    examTips: ['Document grip strength and pinch strength', 'Note hand dexterity issues', 'Get EMG/NCS', 'Describe occupational impact'],
    commonMistakes: ['Not documenting dominant hand', 'Not getting objective nerve testing'],
  },
  {
    conditionId: 'trigeminal-neuralgia',
    conditionName: 'Trigeminal Neuralgia (Tic Douloureux)',
    diagnosticCode: '8205',
    cfrReference: '38 CFR § 4.124a, DC 8205',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Moderate incomplete paralysis of the fifth cranial nerve.', keywords: ['moderate', 'trigeminal', 'fifth cranial nerve'] },
      { percent: 30, criteria: 'Severe incomplete paralysis.', keywords: ['severe', 'incomplete paralysis'] },
      { percent: 50, criteria: 'Complete paralysis of the fifth cranial nerve.', keywords: ['complete paralysis'] },
    ],
    examTips: ['Document frequency and severity of pain episodes', 'Note trigger zones', 'Describe impact on eating, talking, and daily function'],
    commonMistakes: ['Not documenting episode frequency', 'Not describing functional impact'],
  },
  {
    conditionId: 'facial-nerve-paralysis',
    conditionName: 'Facial Nerve (7th Cranial) Paralysis',
    diagnosticCode: '8207',
    cfrReference: '38 CFR § 4.124a, DC 8207',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Moderate incomplete paralysis of the seventh cranial nerve.', keywords: ['moderate', 'facial nerve', 'Bell palsy'] },
      { percent: 20, criteria: 'Severe incomplete paralysis.', keywords: ['severe', 'incomplete'] },
      { percent: 30, criteria: 'Complete paralysis of the seventh cranial nerve.', keywords: ['complete paralysis', 'facial nerve'] },
    ],
    examTips: ['Document facial asymmetry', 'Note impact on eating, drinking, eye closure', 'Describe social/emotional impact'],
    commonMistakes: ['Not documenting residual facial weakness', 'Not claiming secondary mental health condition from disfigurement'],
  },
  {
    conditionId: 'multiple-sclerosis',
    conditionName: 'Multiple Sclerosis',
    diagnosticCode: '8018',
    cfrReference: '38 CFR § 4.124a, DC 8018',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 30, criteria: 'Minimum rating for MS.', keywords: ['multiple sclerosis', 'minimum 30%'] },
      { percent: 100, criteria: 'Rate on residuals; minimum is 30%. Ascertainable disability within 7 years of separation may establish presumptive service connection.', keywords: ['residuals', 'presumptive 7 years'] },
    ],
    examTips: ['MS has a 30% minimum floor rating', 'Each residual (vision loss, weakness, bladder issues) can be rated separately', 'Document all neurological deficits at each exam'],
    commonMistakes: ['Not getting separate ratings for each MS residual', 'Not knowing the 7-year presumptive window'],
  },
  {
    conditionId: 'parkinsons',
    conditionName: "Parkinson's Disease",
    diagnosticCode: '8004',
    cfrReference: '38 CFR § 4.124a, DC 8004',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 30, criteria: 'Minimum rating. Ascertainable residuals present.', keywords: ['minimum 30%', 'residuals'] },
      { percent: 100, criteria: 'Rate on residuals; minimum 30%. Presumptive for Agent Orange exposure.', keywords: ['Agent Orange presumptive', 'residuals'] },
    ],
    examTips: ['Each residual rated separately (tremor, gait, cognitive, etc.)', 'Document all functional limitations', 'Presumptive for Agent Orange/herbicide exposure'],
    commonMistakes: ['Not rating each residual separately', 'Not claiming presumptive service connection for Agent Orange veterans'],
  },
  {
    conditionId: 'vestibular-disorder',
    conditionName: 'Peripheral Vestibular Disorder (Vertigo)',
    diagnosticCode: '6204',
    cfrReference: '38 CFR § 4.87, DC 6204',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Occasional dizziness.', keywords: ['occasional dizziness', 'vertigo'] },
      { percent: 30, criteria: 'Dizziness and occasional staggering.', keywords: ['dizziness', 'staggering', 'balance issues'] },
    ],
    examTips: ['Document frequency of vertigo episodes', 'Note falls or near-falls', 'Describe nausea and functional impact', 'Get vestibular function testing'],
    commonMistakes: ['Not documenting episode frequency', 'Not noting fall risk and safety concerns'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL MENTAL HEALTH — 38 CFR § 4.130 (General Rating Formula)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    conditionId: 'somatic-symptom',
    conditionName: 'Somatic Symptom Disorder',
    diagnosticCode: '9421',
    cfrReference: '38 CFR § 4.130, DC 9421',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Diagnosed but symptoms not severe enough to interfere with occupational/social functioning or require continuous medication.', keywords: ['diagnosed', 'minimal symptoms'] },
      { percent: 10, criteria: 'Occupational and social impairment due to mild or transient symptoms which decrease work efficiency during periods of significant stress, or symptoms controlled by continuous medication.', keywords: ['mild', 'transient', 'controlled by medication'] },
      { percent: 30, criteria: 'Occupational and social impairment with occasional decrease in work efficiency and intermittent periods of inability to perform occupational tasks due to depressed mood, anxiety, suspiciousness, panic attacks, chronic sleep impairment, mild memory loss.', keywords: ['occasional decrease', 'depressed mood', 'sleep impairment', 'mild memory loss'] },
      { percent: 50, criteria: 'Occupational and social impairment with reduced reliability and productivity due to flattened affect, circumstantial/stereotyped speech, panic attacks >1/week, difficulty understanding complex commands, memory impairment, impaired judgment, impaired abstract thinking, disturbances of motivation and mood, difficulty establishing and maintaining effective work and social relationships.', keywords: ['reduced reliability', 'panic attacks weekly', 'difficulty with relationships', 'impaired judgment'] },
      { percent: 70, criteria: 'Occupational and social impairment with deficiencies in most areas (work, school, family relations, judgment, thinking, or mood) due to suicidal ideation, obsessional rituals, illogical/obscure/irrelevant speech, near-continuous panic or depression, impaired impulse control, spatial disorientation, neglect of personal appearance and hygiene, difficulty adapting to stressful circumstances, inability to establish and maintain effective relationships.', keywords: ['deficiencies in most areas', 'suicidal ideation', 'near-continuous depression', 'inability to maintain relationships'] },
      { percent: 100, criteria: 'Total occupational and social impairment due to gross impairment in thought processes/communication, persistent delusions/hallucinations, grossly inappropriate behavior, persistent danger of hurting self or others, intermittent inability to perform activities of daily living, disorientation, memory loss for names of close relatives or own name.', keywords: ['total impairment', 'persistent danger', 'gross impairment', 'memory loss for own name'] },
    ],
    examTips: ['Describe somatic symptoms and their impact on functioning', 'Document distress and functional impairment', 'Note relationship between physical complaints and psychological factors'],
    commonMistakes: ['Minimizing mental health component', 'Not connecting somatic symptoms to service'],
  },
  {
    conditionId: 'eating-disorder',
    conditionName: 'Eating Disorders (Anorexia Nervosa / Bulimia Nervosa)',
    diagnosticCode: '9520/9521',
    cfrReference: '38 CFR § 4.130, DC 9520/9521',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Diagnosed but symptoms not severe enough to interfere with functioning.', keywords: ['diagnosed', 'minimal'] },
      { percent: 10, criteria: 'Mild symptoms controlled by continuous medication or causing mild occupational impairment during stress.', keywords: ['mild', 'controlled'] },
      { percent: 30, criteria: 'Occasional decrease in work efficiency with depressed mood, anxiety, sleep impairment.', keywords: ['occasional decrease', 'depressed mood'] },
      { percent: 50, criteria: 'Reduced reliability and productivity due to disturbances of motivation, mood, and difficulty maintaining relationships.', keywords: ['reduced reliability', 'motivation disturbance'] },
      { percent: 70, criteria: 'Deficiencies in most areas due to suicidal ideation, near-continuous depression, inability to maintain relationships.', keywords: ['deficiencies in most areas', 'suicidal ideation'] },
      { percent: 100, criteria: 'Total occupational and social impairment.', keywords: ['total impairment'] },
    ],
    examTips: ['Document weight fluctuations and BMI', 'Describe purging behaviors if applicable', 'Note hospitalization history', 'Describe social isolation from eating behaviors'],
    commonMistakes: ['Not disclosing severity of behaviors', 'Not connecting onset to military service stressors'],
  },
  {
    conditionId: 'schizophrenia',
    conditionName: 'Schizophrenia',
    diagnosticCode: '9204',
    cfrReference: '38 CFR § 4.130, DC 9204',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild/transient symptoms decreasing work efficiency during stress, or controlled by continuous medication.', keywords: ['mild', 'controlled medication'] },
      { percent: 30, criteria: 'Occasional decrease in work efficiency with depressed mood, anxiety, sleep impairment, mild memory loss.', keywords: ['occasional decrease', 'mild memory loss'] },
      { percent: 50, criteria: 'Reduced reliability with flattened affect, panic attacks, impaired judgment, difficulty with relationships.', keywords: ['reduced reliability', 'flattened affect'] },
      { percent: 70, criteria: 'Deficiencies in most areas with suicidal ideation, obsessional rituals, near-continuous panic/depression, neglect of hygiene.', keywords: ['deficiencies most areas', 'suicidal ideation'] },
      { percent: 100, criteria: 'Total impairment with persistent delusions/hallucinations, persistent danger to self/others, gross impairment in communication.', keywords: ['total impairment', 'persistent delusions', 'hallucinations', 'danger to self'] },
    ],
    examTips: ['Document hallucinations and delusions honestly', 'Describe medication side effects', 'Note hospitalizations and crisis episodes', 'Describe occupational and social functioning'],
    commonMistakes: ['Minimizing symptoms out of stigma', 'Not documenting medication side effects'],
  },
  {
    conditionId: 'persistent-depressive',
    conditionName: 'Persistent Depressive Disorder (Dysthymia)',
    diagnosticCode: '9433',
    cfrReference: '38 CFR § 4.130, DC 9433',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Diagnosed but minimal functional impact.', keywords: ['diagnosed', 'minimal'] },
      { percent: 10, criteria: 'Mild symptoms controlled by medication or causing impairment only during significant stress.', keywords: ['mild', 'controlled'] },
      { percent: 30, criteria: 'Occasional decrease in work efficiency with depressed mood, sleep impairment, mild memory loss.', keywords: ['occasional decrease', 'chronic depressed mood'] },
      { percent: 50, criteria: 'Reduced reliability with disturbances of motivation and mood, difficulty maintaining relationships.', keywords: ['reduced reliability', 'motivation disturbance'] },
      { percent: 70, criteria: 'Deficiencies in most areas, near-continuous depression, inability to maintain relationships.', keywords: ['deficiencies most areas', 'near-continuous depression'] },
      { percent: 100, criteria: 'Total occupational and social impairment.', keywords: ['total impairment'] },
    ],
    examTips: ['Describe the chronic, persistent nature of symptoms', 'Note duration (must be 2+ years for diagnosis)', 'Document worst-day symptoms'],
    commonMistakes: ['Describing only average days', 'Not documenting chronicity'],
  },
  {
    conditionId: 'panic-disorder',
    conditionName: 'Panic Disorder',
    diagnosticCode: '9412',
    cfrReference: '38 CFR § 4.130, DC 9412',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild symptoms controlled by medication.', keywords: ['mild', 'controlled'] },
      { percent: 30, criteria: 'Occasional decrease in work efficiency with panic attacks weekly or less, sleep impairment.', keywords: ['occasional decrease', 'panic attacks'] },
      { percent: 50, criteria: 'Reduced reliability with panic attacks more than once per week.', keywords: ['panic attacks >1/week', 'reduced reliability'] },
      { percent: 70, criteria: 'Near-continuous panic affecting ability to function independently, appropriately, and effectively.', keywords: ['near-continuous panic', 'deficiencies most areas'] },
      { percent: 100, criteria: 'Total impairment.', keywords: ['total impairment'] },
    ],
    examTips: ['Document panic attack frequency, duration, and triggers', 'Describe avoidance behaviors', 'Note emergency room visits for panic', 'Describe impact on driving, work, social situations'],
    commonMistakes: ['Not tracking panic attack frequency', 'Not describing avoidance behaviors and their functional impact'],
  },
  {
    conditionId: 'insomnia',
    conditionName: 'Insomnia Disorder',
    diagnosticCode: '9440',
    cfrReference: '38 CFR § 4.130, DC 9440',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Diagnosed but no significant functional impact.', keywords: ['diagnosed', 'minimal'] },
      { percent: 10, criteria: 'Chronic sleep impairment with mild occupational impact during stress.', keywords: ['chronic sleep impairment', 'mild impact'] },
      { percent: 30, criteria: 'Occupational impairment with chronic sleep impairment contributing to mood and cognitive changes.', keywords: ['chronic sleep', 'mood changes', 'cognitive impact'] },
      { percent: 50, criteria: 'Reduced reliability due to chronic sleep deprivation causing memory impairment, impaired judgment.', keywords: ['reduced reliability', 'sleep deprivation', 'memory impairment'] },
      { percent: 70, criteria: 'Deficiencies in most areas due to severe chronic insomnia with near-continuous fatigue affecting all function.', keywords: ['deficiencies most areas', 'severe insomnia'] },
    ],
    examTips: ['Keep a sleep log before the exam', 'Document sleep study results', 'Note caffeine dependence and medication use', 'Describe daytime functioning impact'],
    commonMistakes: ['Not keeping a sleep diary', 'Not connecting insomnia to service-connected conditions'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL RESPIRATORY — 38 CFR § 4.97
  // ═══════════════════════════════════════════════════════════════════════════

  {
    conditionId: 'copd',
    conditionName: 'Chronic Obstructive Pulmonary Disease (COPD)',
    diagnosticCode: '6604',
    cfrReference: '38 CFR § 4.97, DC 6604',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'FEV-1 of 71-80% predicted; or, FEV-1/FVC of 71-80%; or, DLCO (SB) 66-80% predicted.', keywords: ['FEV-1 71-80%', 'FEV-1/FVC 71-80%', 'DLCO 66-80%'] },
      { percent: 30, criteria: 'FEV-1 of 56-70% predicted; or, FEV-1/FVC of 56-70%; or, DLCO (SB) 56-65% predicted.', keywords: ['FEV-1 56-70%', 'FEV-1/FVC 56-70%'] },
      { percent: 60, criteria: 'FEV-1 of 40-55% predicted; or, FEV-1/FVC of 40-55%; or, DLCO (SB) of 40-55% predicted; or, maximum oxygen consumption of 15-20 ml/kg/min (with cardiorespiratory limit).', keywords: ['FEV-1 40-55%', 'max O2 15-20'] },
      { percent: 100, criteria: 'FEV-1 less than 40% predicted; or, FEV-1/FVC less than 40%; or, DLCO (SB) less than 40% predicted; or, maximum oxygen consumption less than 15 ml/kg/min; or, cor pulmonale; or, right ventricular hypertrophy; or, pulmonary hypertension; or, episodes of acute respiratory failure; or, requires outpatient oxygen therapy.', keywords: ['FEV-1 <40%', 'oxygen therapy', 'cor pulmonale', 'respiratory failure'] },
    ],
    examTips: ['Get current PFTs (pulmonary function tests)', 'Test both pre and post bronchodilator', 'Document oxygen use', 'Note exercise limitations'],
    commonMistakes: ['Not getting PFTs before the exam', 'Using only post-bronchodilator values when pre-bronchodilator is worse'],
  },
  {
    conditionId: 'bronchiectasis',
    conditionName: 'Bronchiectasis',
    diagnosticCode: '6601',
    cfrReference: '38 CFR § 4.97, DC 6601',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Intermittent productive cough with acute infections requiring antibiotics lasting 4-6 weeks up to 3 times/year.', keywords: ['intermittent cough', 'antibiotics 4-6 weeks', '3x/year'] },
      { percent: 30, criteria: 'Daily productive cough with incapacitating episodes 4-6 times/year.', keywords: ['daily cough', 'incapacitating 4-6x/year'] },
      { percent: 60, criteria: 'Near-constant findings of cough with purulent sputum with incapacitating episodes occurring at least 6 times/year.', keywords: ['near-constant cough', 'purulent sputum', '6+ episodes/year'] },
      { percent: 100, criteria: 'Incapacitating episodes occurring at least 6 times/year with multiple complications.', keywords: ['6+ episodes', 'multiple complications'] },
    ],
    examTips: ['Document antibiotic courses per year', 'Note hospitalization frequency', 'Get current PFTs', 'Describe daily sputum production'],
    commonMistakes: ['Not documenting antibiotic treatment frequency', 'Not describing daily symptoms'],
  },
  {
    conditionId: 'deviated-septum',
    conditionName: 'Deviated Nasal Septum',
    diagnosticCode: '6502',
    cfrReference: '38 CFR § 4.97, DC 6502',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Traumatic only, with no obstruction on either side.', keywords: ['no obstruction'] },
      { percent: 10, criteria: '50% obstruction of nasal passage on both sides or complete obstruction on one side.', keywords: ['50% obstruction bilateral', 'complete obstruction one side'] },
    ],
    examTips: ['Document degree of obstruction', 'Note impact on breathing and sleep', 'Describe any related sinusitis'],
    commonMistakes: ['Max schedular is 10% — consider secondary sleep apnea or sinusitis claims'],
  },
  {
    conditionId: 'sarcoidosis',
    conditionName: 'Sarcoidosis',
    diagnosticCode: '6846',
    cfrReference: '38 CFR § 4.97, DC 6846',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Chronic hilar adenopathy; stable lung infiltrates without symptoms or physiologic impairment.', keywords: ['asymptomatic', 'stable infiltrates'] },
      { percent: 30, criteria: 'Pulmonary involvement with persistent symptoms requiring chronic low-dose or intermittent corticosteroids.', keywords: ['chronic corticosteroids', 'persistent symptoms'] },
      { percent: 60, criteria: 'Pulmonary involvement requiring systemic high-dose corticosteroids for control.', keywords: ['high-dose corticosteroids', 'systemic therapy'] },
      { percent: 100, criteria: 'Cor pulmonale; or cardiac involvement with congestive heart failure; or progressive pulmonary disease with fever, night sweats, and weight loss despite treatment.', keywords: ['cor pulmonale', 'CHF', 'progressive despite treatment'] },
    ],
    examTips: ['Document medication regimen', 'Get current PFTs and chest imaging', 'Note extrapulmonary involvement (skin, eyes, joints)'],
    commonMistakes: ['Not claiming separate ratings for extrapulmonary manifestations', 'Not documenting steroid use'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL CARDIOVASCULAR — 38 CFR § 4.104
  // ═══════════════════════════════════════════════════════════════════════════

  {
    conditionId: 'coronary-artery-disease',
    conditionName: 'Coronary Artery Disease',
    diagnosticCode: '7005',
    cfrReference: '38 CFR § 4.104, DC 7005',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Workload of greater than 7 METs but not greater than 10 METs resulting in dyspnea, fatigue, angina, dizziness, or syncope; or, continuous medication required.', keywords: ['METs >7-10', 'continuous medication'] },
      { percent: 30, criteria: 'Workload of greater than 5 METs but not greater than 7 METs; or, evidence of cardiac hypertrophy or dilatation on EKG, echocardiogram, or X-ray.', keywords: ['METs 5-7', 'cardiac hypertrophy'] },
      { percent: 60, criteria: 'More than one episode of acute congestive heart failure in the past year; or, workload of greater than 3 METs but not greater than 5 METs; or, left ventricular dysfunction with ejection fraction of 30-50%.', keywords: ['CHF episode', 'METs 3-5', 'EF 30-50%'] },
      { percent: 100, criteria: 'Chronic CHF; or, workload of 3 METs or less; or, left ventricular dysfunction with EF less than 30%.', keywords: ['chronic CHF', 'METs ≤3', 'EF <30%'] },
    ],
    examTips: ['Get exercise stress test with METs documented', 'Get echocardiogram with ejection fraction', 'Document all cardiac medications', 'Note any surgical interventions (stents, CABG)'],
    commonMistakes: ['Not getting METs-level testing', 'Not documenting medication side effects'],
  },
  {
    conditionId: 'arrhythmia',
    conditionName: 'Supraventricular Arrhythmia',
    diagnosticCode: '7010',
    cfrReference: '38 CFR § 4.104, DC 7010',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Permanent atrial fibrillation (lone AF) or 1-4 paroxysmal episodes per year documented by ECG or Holter monitor.', keywords: ['AF', 'paroxysmal', '1-4 episodes/year'] },
      { percent: 30, criteria: 'Paroxysmal atrial fibrillation or other supraventricular tachycardia with more than 4 episodes/year documented by ECG or Holter monitor.', keywords: ['4+ episodes/year', 'SVT', 'documented ECG'] },
    ],
    examTips: ['Get ECG and Holter monitor documentation', 'Keep a symptom log with dates', 'Document palpitation episodes'],
    commonMistakes: ['Not having ECG documentation of episodes', 'Not logging episode dates'],
  },
  {
    conditionId: 'valvular-heart-disease',
    conditionName: 'Valvular Heart Disease',
    diagnosticCode: '7000',
    cfrReference: '38 CFR § 4.104, DC 7000',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Workload >7 METs but ≤10 METs with dyspnea, fatigue, angina, or syncope; or, continuous medication required.', keywords: ['METs 7-10', 'continuous medication'] },
      { percent: 30, criteria: 'Workload >5 METs but ≤7 METs; or, cardiac hypertrophy/dilatation on testing.', keywords: ['METs 5-7', 'hypertrophy'] },
      { percent: 60, criteria: 'More than one CHF episode in past year; or, workload >3 METs but ≤5 METs; or, EF 30-50%.', keywords: ['CHF', 'METs 3-5', 'EF 30-50%'] },
      { percent: 100, criteria: 'Chronic CHF; or, workload ≤3 METs; or, EF <30%. During active infection, rate 100%.', keywords: ['chronic CHF', 'METs ≤3', 'EF <30%'] },
    ],
    examTips: ['Get echocardiogram', 'Document exercise capacity', 'Note valve replacement history'],
    commonMistakes: ['Not getting METs testing', 'Not documenting surgical history'],
  },
  {
    conditionId: 'varicose-veins',
    conditionName: 'Varicose Veins',
    diagnosticCode: '7120',
    cfrReference: '38 CFR § 4.104, DC 7120',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Asymptomatic, palpable or visible varicose veins.', keywords: ['asymptomatic', 'visible'] },
      { percent: 10, criteria: 'Intermittent edema of extremity or aching and fatigue in leg after prolonged standing or walking, with symptoms relieved by elevation or compression hosiery.', keywords: ['intermittent edema', 'aching', 'fatigue', 'relieved by elevation'] },
      { percent: 20, criteria: 'Persistent edema, incompletely relieved by elevation; stasis pigmentation or eczema, with or without intermittent ulceration.', keywords: ['persistent edema', 'stasis pigmentation', 'eczema'] },
      { percent: 40, criteria: 'Persistent edema and stasis pigmentation or eczema, with or without intermittent ulceration.', keywords: ['persistent edema', 'stasis pigmentation', 'ulceration'] },
      { percent: 60, criteria: 'Persistent edema or subcutaneous induration, stasis pigmentation or eczema, and persistent ulceration.', keywords: ['persistent ulceration', 'subcutaneous induration'] },
      { percent: 100, criteria: 'Massive board-like edema with constant pain at rest, with or without stasis pigmentation, eczema, ulceration.', keywords: ['massive edema', 'constant pain at rest'] },
    ],
    examTips: ['Document each leg separately', 'Note compression stocking use', 'Describe ulceration history'],
    commonMistakes: ['Not claiming bilateral (each leg rated separately)', 'Not documenting skin changes'],
  },
  {
    conditionId: 'peripheral-vascular-disease',
    conditionName: 'Peripheral Vascular Disease / Arteriosclerosis Obliterans',
    diagnosticCode: '7114',
    cfrReference: '38 CFR § 4.104, DC 7114',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'Claudication on walking more than 100 yards; diminished peripheral pulses or ABI of 0.9 or less.', keywords: ['claudication >100 yards', 'ABI 0.9', 'diminished pulses'] },
      { percent: 40, criteria: 'Claudication on walking between 25-100 yards on a level grade at 2 mph; trophic changes; or, ABI of 0.7 or less.', keywords: ['claudication 25-100 yards', 'trophic changes', 'ABI 0.7'] },
      { percent: 60, criteria: 'Claudication on walking less than 25 yards on a level grade at 2 mph; persistent coldness of the extremity; one or more deep ischemic ulcers; or, ABI of 0.5 or less.', keywords: ['claudication <25 yards', 'ischemic ulcers', 'ABI 0.5'] },
      { percent: 100, criteria: 'Ischemic limb pain at rest and either deep ischemic ulcers or ankle/brachial index of 0.4 or less.', keywords: ['ischemic pain at rest', 'ABI 0.4', 'deep ulcers'] },
    ],
    examTips: ['Get ABI (ankle-brachial index) testing', 'Document walking distance before claudication', 'Note any ulcers or trophic skin changes'],
    commonMistakes: ['Not getting ABI documented', 'Not reporting claudication distance accurately'],
  },
  {
    conditionId: 'raynauds',
    conditionName: "Raynaud's Syndrome",
    diagnosticCode: '7117',
    cfrReference: '38 CFR § 4.104, DC 7117',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Characteristic attacks occurring one to three times per week.', keywords: ['attacks 1-3x/week'] },
      { percent: 20, criteria: 'Characteristic attacks occurring four to six times per week.', keywords: ['attacks 4-6x/week'] },
      { percent: 40, criteria: 'Characteristic attacks occurring at least daily.', keywords: ['daily attacks'] },
      { percent: 60, criteria: 'Two or more digital ulcers plus autoamputation of one or more digits and history of characteristic attacks.', keywords: ['digital ulcers', 'autoamputation'] },
      { percent: 100, criteria: 'Two or more digital ulcers and autoamputation of two or more digits and history of characteristic attacks.', keywords: ['2+ ulcers', '2+ autoamputations'] },
    ],
    examTips: ['Document attack frequency and triggers', 'Photograph color changes during attacks', 'Note digital ulcers'],
    commonMistakes: ['Not documenting attack frequency', 'Not photographing episodes'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL DIGESTIVE — 38 CFR § 4.114
  // ═══════════════════════════════════════════════════════════════════════════

  {
    conditionId: 'crohns-disease',
    conditionName: "Crohn's Disease / Ulcerative Colitis",
    diagnosticCode: '7323',
    cfrReference: '38 CFR § 4.114, DC 7323',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Moderate: infrequent exacerbations.', keywords: ['moderate', 'infrequent exacerbations'] },
      { percent: 30, criteria: 'Moderately severe: frequent exacerbations.', keywords: ['moderately severe', 'frequent exacerbations'] },
      { percent: 60, criteria: 'Severe: numerous attacks per year with malnutrition, health only fair during remissions.', keywords: ['severe', 'numerous attacks', 'malnutrition'] },
      { percent: 100, criteria: 'Pronounced: resulting in marked malnutrition, anemia, and general debility, or with serious complication as liver abscess.', keywords: ['pronounced', 'marked malnutrition', 'anemia', 'general debility'] },
    ],
    examTips: ['Document flare frequency and duration', 'Note weight loss and nutritional deficiencies', 'Record hospitalization history', 'Describe bowel movement frequency on worst days'],
    commonMistakes: ['Not documenting flare frequency', 'Not reporting weight changes'],
  },
  {
    conditionId: 'hiatal-hernia',
    conditionName: 'Hiatal Hernia',
    diagnosticCode: '7346',
    cfrReference: '38 CFR § 4.114, DC 7346',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Two or more of the symptoms for the 30% rating of less severity.', keywords: ['2+ symptoms', 'less severity'] },
      { percent: 30, criteria: 'Persistently recurrent epigastric distress with dysphagia, pyrosis, and regurgitation, accompanied by substernal or arm or shoulder pain, productive of considerable impairment of health.', keywords: ['dysphagia', 'pyrosis', 'regurgitation', 'substernal pain'] },
      { percent: 60, criteria: 'Symptoms of pain, vomiting, material weight loss and hematemesis or melena with moderate anemia; or other symptom combinations productive of severe impairment of health.', keywords: ['pain', 'vomiting', 'weight loss', 'hematemesis', 'anemia'] },
    ],
    examTips: ['Document all symptoms: reflux, pain, swallowing difficulty', 'Note medication use', 'Report sleep disruption from symptoms'],
    commonMistakes: ['Not reporting all symptoms', 'Not documenting weight loss or anemia if present'],
  },
  {
    conditionId: 'hemorrhoids',
    conditionName: 'Hemorrhoids (External or Internal)',
    diagnosticCode: '7336',
    cfrReference: '38 CFR § 4.114, DC 7336',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Mild or moderate.', keywords: ['mild', 'moderate'] },
      { percent: 10, criteria: 'Large or thrombotic, irreducible, with excessive redundant tissue evidencing frequent recurrences.', keywords: ['large', 'thrombotic', 'irreducible', 'frequent recurrences'] },
      { percent: 20, criteria: 'With persistent bleeding and with secondary anemia, or with fissures.', keywords: ['persistent bleeding', 'secondary anemia', 'fissures'] },
    ],
    examTips: ['Document bleeding frequency', 'Note if hemorrhoids are reducible', 'Report impact on daily activities'],
    commonMistakes: ['Not documenting bleeding history', 'Not reporting lab work showing anemia'],
  },
  {
    conditionId: 'hepatitis-c',
    conditionName: 'Hepatitis C',
    diagnosticCode: '7354',
    cfrReference: '38 CFR § 4.114, DC 7354',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Nonsymptomatic.', keywords: ['nonsymptomatic'] },
      { percent: 10, criteria: 'Intermittent fatigue, malaise, and anorexia; or, incapacitating episodes (with symptoms such as fatigue, malaise, nausea, vomiting, anorexia, arthralgia, and right upper quadrant pain) having a total duration of at least one week but less than two weeks during the past 12-month period.', keywords: ['intermittent fatigue', 'incapacitating 1-2 weeks/year'] },
      { percent: 20, criteria: 'Daily fatigue, malaise, and anorexia (without weight loss or hepatomegaly), requiring dietary restriction or continuous medication; or, incapacitating episodes 2-4 weeks/year.', keywords: ['daily fatigue', 'dietary restriction', 'incapacitating 2-4 weeks'] },
      { percent: 40, criteria: 'Daily fatigue, malaise, anorexia, with minor weight loss and hepatomegaly; or, incapacitating episodes 4-6 weeks/year.', keywords: ['minor weight loss', 'hepatomegaly', 'incapacitating 4-6 weeks'] },
      { percent: 60, criteria: 'Daily fatigue, malaise, anorexia, with substantial weight loss or other indication of malnutrition and hepatomegaly; or, incapacitating episodes 6+ weeks/year.', keywords: ['substantial weight loss', 'malnutrition', '6+ weeks incapacitating'] },
      { percent: 100, criteria: 'Near-constant debilitating symptoms (fatigue, malaise, nausea, vomiting, anorexia, arthralgia, right upper quadrant pain).', keywords: ['near-constant debilitating', 'total impairment'] },
    ],
    examTips: ['Document treatment history and response', 'Get current liver function tests', 'Note fatigue and its impact on work', 'Record weight changes'],
    commonMistakes: ['Not documenting ongoing symptoms after treatment', 'Not reporting fatigue severity'],
  },
  {
    conditionId: 'diverticulitis',
    conditionName: 'Diverticulitis / Diverticular Disease',
    diagnosticCode: '7327',
    cfrReference: '38 CFR § 4.114, DC 7327',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Moderate: infrequent episodes of bowel disturbance with occasional abdominal distress.', keywords: ['moderate', 'infrequent episodes', 'occasional distress'] },
      { percent: 30, criteria: 'Moderately severe: frequent episodes with abdominal distress.', keywords: ['moderately severe', 'frequent episodes'] },
    ],
    examTips: ['Document flare frequency', 'Note hospitalization history', 'Describe dietary restrictions'],
    commonMistakes: ['Not documenting episode frequency', 'Not considering rating under colitis DC 7323 if more severe'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL SKIN — 38 CFR § 4.118
  // ═══════════════════════════════════════════════════════════════════════════

  {
    conditionId: 'chloracne',
    conditionName: 'Chloracne / Acne',
    diagnosticCode: '7829',
    cfrReference: '38 CFR § 4.118, DC 7829',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Superficial acne (comedones, papules, pustules) of any extent.', keywords: ['superficial', 'comedones'] },
      { percent: 10, criteria: 'Deep acne (inflamed nodules and pus-filled cysts) affecting less than 40% of face and neck; or, deep acne other than on face and neck.', keywords: ['deep acne', '<40% face/neck'] },
      { percent: 30, criteria: 'Deep acne affecting 40% or more of face and neck.', keywords: ['deep acne', '40%+ face/neck'] },
    ],
    examTips: ['Document body surface area affected', 'Note if Agent Orange presumptive', 'Photograph affected areas'],
    commonMistakes: ['Not claiming Agent Orange presumptive connection for chloracne', 'Not documenting body surface area percentage'],
  },
  {
    conditionId: 'dermatitis',
    conditionName: 'Dermatitis / Contact Dermatitis',
    diagnosticCode: '7806',
    cfrReference: '38 CFR § 4.118, DC 7806',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Less than 5% of entire body or exposed areas affected; no more than topical therapy required.', keywords: ['<5% body', 'topical therapy only'] },
      { percent: 10, criteria: 'At least 5% but less than 20% of entire body or exposed areas; or, intermittent systemic therapy (corticosteroids, immunosuppressants) required for less than 6 weeks during a 12-month period.', keywords: ['5-20% body', 'intermittent systemic therapy'] },
      { percent: 30, criteria: '20-40% of entire body or exposed areas; or, systemic therapy required for 6 weeks or more (but not constantly) during a 12-month period.', keywords: ['20-40% body', 'systemic therapy 6+ weeks'] },
      { percent: 60, criteria: 'More than 40% of entire body or exposed areas; or, constant/near-constant systemic therapy required during the past 12-month period.', keywords: ['>40% body', 'constant systemic therapy'] },
    ],
    examTips: ['Document body surface area affected during flares', 'Get photos during active outbreaks', 'Record all medications including steroids', 'Note if you use immunosuppressants'],
    commonMistakes: ['Being examined during remission — document worst periods', 'Not counting topical steroid use as systemic therapy when appropriate'],
  },
  {
    conditionId: 'urticaria',
    conditionName: 'Chronic Urticaria (Hives)',
    diagnosticCode: '7825',
    cfrReference: '38 CFR § 4.118, DC 7825',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Recurrent episodes occurring at least four times during the past 12-month period responding to treatment with antihistamines or sympathomimetics.', keywords: ['4+ episodes/year', 'antihistamines'] },
      { percent: 30, criteria: 'Recurrent debilitating episodes occurring at least four times during the past 12-month period requiring intermittent systemic immunosuppressive therapy.', keywords: ['debilitating episodes', 'systemic immunosuppressive'] },
      { percent: 60, criteria: 'Recurrent debilitating episodes occurring at least four times per year despite continuous immunosuppressive therapy.', keywords: ['despite continuous therapy', 'debilitating'] },
    ],
    examTips: ['Document episode frequency', 'Record all medications', 'Note triggers and severity', 'Photograph episodes'],
    commonMistakes: ['Not documenting treatment failure', 'Not recording episode dates'],
  },
  {
    conditionId: 'burn-scars',
    conditionName: 'Burn Scars',
    diagnosticCode: '7801/7802',
    cfrReference: '38 CFR § 4.118, DC 7801/7802',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Deep nonlinear scars of area at least 6 sq. in. (39 sq. cm) but less than 12 sq. in. (77 sq. cm); or superficial nonlinear scars of 144+ sq. in. (929+ sq. cm).', keywords: ['deep scar 6-12 sq in', 'superficial 144+ sq in'] },
      { percent: 20, criteria: 'Deep nonlinear scars of 12-72 sq. in.', keywords: ['deep scar 12-72 sq in'] },
      { percent: 30, criteria: 'Deep nonlinear scars of 72-144 sq. in.', keywords: ['deep scar 72-144 sq in'] },
      { percent: 40, criteria: 'Deep nonlinear scars of 144+ sq. in.', keywords: ['deep scar 144+ sq in'] },
    ],
    examTips: ['Get scars measured by examiner', 'Note pain, instability, or limitation of function', 'Each functional limitation can be rated separately'],
    commonMistakes: ['Not getting separate ratings for painful and unstable scars', 'Not documenting functional limitation'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL ENDOCRINE — 38 CFR § 4.119
  // ═══════════════════════════════════════════════════════════════════════════

  {
    conditionId: 'diabetes-type-1',
    conditionName: 'Diabetes Mellitus Type 1',
    diagnosticCode: '7913',
    cfrReference: '38 CFR § 4.119, DC 7913',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Manageable by restricted diet only.', keywords: ['diet only', 'manageable'] },
      { percent: 20, criteria: 'Requiring insulin and restricted diet, or oral hypoglycemic agent and restricted diet.', keywords: ['insulin', 'restricted diet', 'oral medication'] },
      { percent: 40, criteria: 'Requiring insulin, restricted diet, and regulation of activities.', keywords: ['insulin', 'regulation of activities'] },
      { percent: 60, criteria: 'Requiring insulin, restricted diet, and regulation of activities with episodes of ketoacidosis or hypoglycemic reactions requiring 1-2 hospitalizations per year or twice-a-month visits to a diabetic care provider, plus complications that would not be compensable if separately evaluated.', keywords: ['hospitalizations', 'ketoacidosis', 'hypoglycemic reactions', 'twice-monthly visits'] },
      { percent: 100, criteria: 'Requiring more than one daily injection of insulin, restricted diet, and regulation of activities with episodes of ketoacidosis or hypoglycemic reactions requiring at least 3 hospitalizations per year or weekly visits to a diabetic care provider, plus progressive loss of weight and strength.', keywords: ['3+ hospitalizations', 'weekly visits', 'progressive weight loss'] },
    ],
    examTips: ['Document insulin regimen', 'Note activity restrictions from doctor', '"Regulation of activities" means doctor-prescribed avoidance of strenuous activities', 'Document all complications separately (neuropathy, retinopathy, nephropathy)'],
    commonMistakes: ['Not getting doctor to document "regulation of activities" in writing', 'Not claiming diabetic complications as separate secondary conditions'],
  },
  {
    conditionId: 'addisons-disease',
    conditionName: "Addison's Disease (Adrenal Insufficiency)",
    diagnosticCode: '7911',
    cfrReference: '38 CFR § 4.119, DC 7911',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 60, criteria: 'One or two adrenal crises in the past year, or requiring hormone replacement.', keywords: ['1-2 adrenal crises', 'hormone replacement'] },
      { percent: 100, criteria: 'Three or more adrenal crises in the past year.', keywords: ['3+ adrenal crises per year'] },
    ],
    examTips: ['Document adrenal crisis episodes', 'Note all replacement medications', 'Describe daily fatigue and weakness'],
    commonMistakes: ['Not documenting crisis episodes', 'Not reporting medication dependence'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL GENITOURINARY — 38 CFR § 4.115a/4.115b
  // ═══════════════════════════════════════════════════════════════════════════

  {
    conditionId: 'kidney-stones',
    conditionName: 'Nephrolithiasis (Kidney Stones)',
    diagnosticCode: '7508',
    cfrReference: '38 CFR § 4.115b, DC 7508',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Recurrent stone formation requiring diet therapy, drug therapy, or invasive/non-invasive procedures more than twice per year.', keywords: ['recurrent stones', 'diet therapy', '2+ procedures/year'] },
      { percent: 30, criteria: 'Recurrent stone formation requiring one or more of the following: diet therapy, drug therapy, or invasive/non-invasive procedures more than twice per year with frequent attacks of colic.', keywords: ['frequent attacks', 'colic', '2+ procedures'] },
    ],
    examTips: ['Document stone passage episodes per year', 'Note lithotripsy or surgical procedures', 'Describe pain episodes'],
    commonMistakes: ['Not documenting episode frequency', 'Not claiming secondary conditions (urinary obstruction)'],
  },
  {
    conditionId: 'urinary-incontinence',
    conditionName: 'Urinary Incontinence',
    diagnosticCode: '7542',
    cfrReference: '38 CFR § 4.115a',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'Requiring the wearing of absorbent materials which must be changed less than 2 times per day.', keywords: ['absorbent materials', '<2 changes/day'] },
      { percent: 40, criteria: 'Requiring the wearing of absorbent materials which must be changed 2-4 times per day.', keywords: ['2-4 changes/day'] },
      { percent: 60, criteria: 'Requiring the use of an appliance or the wearing of absorbent materials which must be changed more than 4 times per day.', keywords: ['4+ changes/day', 'appliance required'] },
    ],
    examTips: ['Document pad/diaper usage per day', 'Note any catheter or appliance use', 'Describe impact on work and social activities'],
    commonMistakes: ['Not reporting actual daily absorbent material changes', 'Not connecting to service-connected condition as secondary'],
  },
  {
    conditionId: 'bph',
    conditionName: 'Benign Prostatic Hyperplasia (BPH)',
    diagnosticCode: '7527',
    cfrReference: '38 CFR § 4.115b, DC 7527',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Daytime voiding interval between 2-3 hours; or, awakening to void 2 times per night.', keywords: ['voiding 2-3 hours', 'nocturia 2x'] },
      { percent: 20, criteria: 'Daytime voiding interval between 1-2 hours; or, awakening to void 3-4 times per night; or, obstructed voiding with symptoms.', keywords: ['voiding 1-2 hours', 'nocturia 3-4x'] },
      { percent: 40, criteria: 'Daytime voiding interval less than 1 hour; or, awakening to void 5+ times per night.', keywords: ['voiding <1 hour', 'nocturia 5+'] },
      { percent: 60, criteria: 'Requiring absorbent materials changed more than 4 times/day; or, requiring catheterization.', keywords: ['absorbent materials', 'catheterization'] },
    ],
    examTips: ['Track voiding frequency for 2 weeks before exam', 'Note nighttime awakenings', 'Document any catheter use or pad use'],
    commonMistakes: ['Not tracking voiding frequency before the exam', 'Not reporting nighttime awakenings'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL EYE — 38 CFR § 4.79
  // ═══════════════════════════════════════════════════════════════════════════

  {
    conditionId: 'macular-degeneration',
    conditionName: 'Macular Degeneration',
    diagnosticCode: '6006',
    cfrReference: '38 CFR § 4.79, DC 6006',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Based on visual acuity impairment or visual field loss. Minimum 10% during active pathology with incapacitating episodes.', keywords: ['visual acuity loss', 'visual field loss'] },
      { percent: 20, criteria: 'Incapacitating episodes having a total duration of at least 2 weeks but less than 4 weeks during past 12 months.', keywords: ['incapacitating 2-4 weeks'] },
      { percent: 40, criteria: 'Incapacitating episodes having a total duration of at least 4 weeks but less than 6 weeks during past 12 months.', keywords: ['incapacitating 4-6 weeks'] },
      { percent: 60, criteria: 'Incapacitating episodes having a total duration of at least 6 weeks during past 12 months.', keywords: ['incapacitating 6+ weeks'] },
    ],
    examTips: ['Get visual acuity and visual field testing', 'Document impact on driving and reading', 'Note progression and treatment history'],
    commonMistakes: ['Not getting formal visual field testing', 'Not claiming based on visual acuity loss tables'],
  },
  {
    conditionId: 'visual-field-loss',
    conditionName: 'Visual Field Loss',
    diagnosticCode: '6080',
    cfrReference: '38 CFR § 4.79, DC 6080',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Unilateral concentric contraction to 46-60°; or bilateral concentric contraction to 46-60°.', keywords: ['concentric contraction', '46-60°'] },
      { percent: 20, criteria: 'Unilateral concentric contraction to 31-45°.', keywords: ['concentric contraction', '31-45°'] },
      { percent: 30, criteria: 'Bilateral concentric contraction to 31-45°; or, homonymous hemianopsia.', keywords: ['bilateral 31-45°', 'hemianopsia'] },
      { percent: 50, criteria: 'Unilateral concentric contraction to 16-30°.', keywords: ['concentric contraction', '16-30°'] },
      { percent: 70, criteria: 'Bilateral concentric contraction to 16-30°.', keywords: ['bilateral 16-30°'] },
      { percent: 100, criteria: 'Concentric contraction to 5° bilateral.', keywords: ['bilateral 5°', 'near total loss'] },
    ],
    examTips: ['Get Goldman or Humphrey visual field testing', 'Document impact on driving, reading, navigation', 'Note any legal blindness determination'],
    commonMistakes: ['Not getting formal visual field testing', 'Not understanding the visual field measurement system'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL AUDITORY — 38 CFR § 4.85-4.87
  // ═══════════════════════════════════════════════════════════════════════════

  {
    conditionId: 'menieres-disease',
    conditionName: "Meniere's Disease",
    diagnosticCode: '6205',
    cfrReference: '38 CFR § 4.87, DC 6205',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 30, criteria: 'Hearing impairment with vertigo less than once a month, with or without tinnitus.', keywords: ['hearing loss', 'vertigo <1x/month'] },
      { percent: 60, criteria: 'Hearing impairment with attacks of vertigo and cerebellar gait occurring from one to four times a month, with or without tinnitus.', keywords: ['vertigo 1-4x/month', 'cerebellar gait'] },
      { percent: 100, criteria: 'Hearing impairment with attacks of vertigo and cerebellar gait occurring more than once weekly, with or without tinnitus.', keywords: ['vertigo >1x/week', 'cerebellar gait', 'frequent attacks'] },
    ],
    examTips: ['Document vertigo attack frequency', 'Get audiometric testing', 'Note falls and balance issues', 'Describe nausea and functional impact'],
    commonMistakes: ['Not documenting attack frequency', 'Not claiming tinnitus and hearing loss separately if applicable'],
  },
  {
    conditionId: 'otitis-media',
    conditionName: 'Chronic Otitis Media',
    diagnosticCode: '6200',
    cfrReference: '38 CFR § 4.87, DC 6200',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'During suppuration or with aural polyps.', keywords: ['suppuration', 'aural polyps', 'chronic drainage'] },
    ],
    examTips: ['Document drainage episodes', 'Get audiometric testing for hearing loss', 'Note any surgical history'],
    commonMistakes: ['Max is 10% under this DC — claim hearing loss separately under DC 6100', 'Not claiming secondary tinnitus'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL HEMIC & LYMPHATIC — 38 CFR § 4.117
  // ═══════════════════════════════════════════════════════════════════════════

  {
    conditionId: 'sickle-cell-anemia',
    conditionName: 'Sickle Cell Anemia',
    diagnosticCode: '7714',
    cfrReference: '38 CFR § 4.117, DC 7714',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Asymptomatic, established case in remission with identifiable organ damage.', keywords: ['asymptomatic', 'remission', 'organ damage'] },
      { percent: 30, criteria: 'Not having crises, but with symptomatic disease (joint pain, etc.) and identifiable organ impairment.', keywords: ['symptomatic', 'no crises', 'organ impairment'] },
      { percent: 60, criteria: 'Painful crises, with or without identifiable organ involvement, occurring less than 3 times in the last 12 months.', keywords: ['painful crises', '<3 crises/year'] },
      { percent: 100, criteria: 'Repeated painful crises occurring 3 or more times in the past 12 months; or, with cerebrovascular accident, end-organ damage, or requiring hospitalization 3 or more times.', keywords: ['3+ crises/year', 'CVA', 'hospitalization', 'end-organ damage'] },
    ],
    examTips: ['Document crisis frequency and duration', 'Note all organ systems affected', 'Record hospitalization dates'],
    commonMistakes: ['Not documenting crisis frequency', 'Not claiming secondary organ damage separately'],
  },
  {
    conditionId: 'splenectomy',
    conditionName: 'Splenectomy',
    diagnosticCode: '7706',
    cfrReference: '38 CFR § 4.117, DC 7706',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'Spleen removal — minimum rating.', keywords: ['spleen removal', 'splenectomy'] },
      { percent: 30, criteria: 'With complications such as systemic infections with encapsulated bacteria.', keywords: ['complications', 'systemic infections'] },
    ],
    examTips: ['Document reason for splenectomy', 'Note vaccination requirements', 'Report any post-splenectomy infections'],
    commonMistakes: ['Not knowing the automatic 20% minimum', 'Not documenting complications from being asplenic'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INFECTIOUS / IMMUNE — 38 CFR § 4.88b
  // ═══════════════════════════════════════════════════════════════════════════

  {
    conditionId: 'hiv',
    conditionName: 'HIV/AIDS',
    diagnosticCode: '6351',
    cfrReference: '38 CFR § 4.88b, DC 6351',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Asymptomatic, following initial diagnosis of HIV infection, with or without lymphadenopathy or decreased T4 cell count.', keywords: ['asymptomatic', 'HIV positive'] },
      { percent: 10, criteria: 'Following development of definite medical symptoms, T4 cell of 200 or more and less than 500, and on approved medication(s); or, with evidence of depression or memory loss with employment limitations.', keywords: ['symptomatic', 'T4 200-500', 'medication'] },
      { percent: 30, criteria: 'Recurrent constitutional symptoms, intermittent diarrhea, and on approved medication(s); or, minimum rating with T4 cell count less than 200; or, hairy cell leukoplakia; or, oral candidiasis.', keywords: ['T4 <200', 'recurrent symptoms', 'oral candidiasis'] },
      { percent: 60, criteria: 'Refractory constitutional symptoms, diarrhea, and pathological weight loss; or, minimum rating following development of AIDS-related opportunistic infection or neoplasm.', keywords: ['AIDS', 'opportunistic infection', 'weight loss', 'refractory'] },
      { percent: 100, criteria: 'AIDS with recurrent opportunistic infections or with secondary diseases afflicting multiple body systems; HIV-related illness with debility and progressive weight loss, without remission, or few or brief remissions.', keywords: ['recurrent opportunistic infections', 'multiple body systems', 'progressive debility'] },
    ],
    examTips: ['Document CD4/T4 counts over time', 'Note all opportunistic infections', 'Record medication regimen and side effects', 'Describe functional limitations'],
    commonMistakes: ['Not documenting T4 cell count trends', 'Not claiming medication side effects'],
  },
  {
    conditionId: 'lupus',
    conditionName: 'Systemic Lupus Erythematosus (SLE)',
    diagnosticCode: '6350',
    cfrReference: '38 CFR § 4.88b, DC 6350',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Exacerbations once or twice per year or symptomatic during past 2 years.', keywords: ['1-2 exacerbations/year', 'symptomatic'] },
      { percent: 60, criteria: 'Exacerbations lasting a week or more, 2-3 times per year.', keywords: ['exacerbations 2-3x/year', 'lasting 1+ week'] },
      { percent: 100, criteria: 'Acute, with frequent exacerbations, producing severe impairment of health.', keywords: ['acute', 'frequent exacerbations', 'severe impairment'] },
    ],
    examTips: ['Document flare frequency and duration', 'Note all organ systems involved', 'Record medication regimen including immunosuppressants', 'Describe skin, joint, and kidney involvement'],
    commonMistakes: ['Not claiming separate ratings for individual organ manifestations', 'Not documenting flare frequency'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL MUSCULOSKELETAL — Lateralized & New Entries
  // ═══════════════════════════════════════════════════════════════════════════

  // Thoracolumbar Strain (DC 5237)
  {
    conditionId: 'thoracolumbar-strain',
    conditionName: 'Thoracolumbar Strain',
    diagnosticCode: '5237',
    cfrReference: '38 CFR § 4.71a, DC 5237',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Forward flexion of the thoracolumbar spine greater than 60 degrees but not greater than 85 degrees; or, combined range of motion greater than 120 degrees but not greater than 235 degrees; or, muscle spasm, guarding, or localized tenderness not resulting in abnormal gait or abnormal spinal contour.', keywords: ['flexion 60-85°', 'combined ROM 120-235°', 'muscle spasm', 'guarding'] },
      { percent: 20, criteria: 'Forward flexion of the thoracolumbar spine greater than 30 degrees but not greater than 60 degrees; or, combined range of motion not greater than 120 degrees; or, muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour.', keywords: ['flexion 30-60°', 'combined ROM ≤120°', 'abnormal gait', 'abnormal spinal contour'] },
      { percent: 40, criteria: 'Forward flexion of the thoracolumbar spine 30 degrees or less; or, favorable ankylosis of the entire thoracolumbar spine.', keywords: ['flexion ≤30°', 'favorable ankylosis'] },
      { percent: 50, criteria: 'Unfavorable ankylosis of the entire thoracolumbar spine.', keywords: ['unfavorable ankylosis', 'thoracolumbar'] },
      { percent: 100, criteria: 'Unfavorable ankylosis of the entire spine.', keywords: ['unfavorable ankylosis', 'entire spine'] },
    ],
    examTips: ['Do not stretch or warm up before the exam', 'Stop movement at pain onset', 'Report flare-up frequency, duration, and ROM impact', 'Describe how it affects bending, lifting, sitting, driving'],
    commonMistakes: ['Warming up before the exam', 'Pushing through pain during ROM testing', 'Not mentioning flare-ups'],
  },
  // Degenerative Disc Disease Cervical (DC 5242)
  {
    conditionId: 'degenerative-disc-disease-cervical',
    conditionName: 'Degenerative Disc Disease - Cervical Spine',
    diagnosticCode: '5242',
    cfrReference: '38 CFR § 4.71a, DC 5242',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Forward flexion of the cervical spine greater than 30 degrees but not greater than 40 degrees; or, combined ROM greater than 170 degrees but not greater than 335 degrees; or, muscle spasm/guarding not resulting in abnormal gait or contour.', keywords: ['cervical flexion 30-40°', 'combined ROM 170-335°', 'muscle spasm'] },
      { percent: 20, criteria: 'Forward flexion of the cervical spine greater than 15 degrees but not greater than 30 degrees; or, combined ROM not greater than 170 degrees; or, muscle spasm or guarding severe enough to result in abnormal gait or spinal contour.', keywords: ['cervical flexion 15-30°', 'combined ROM ≤170°', 'abnormal gait'] },
      { percent: 30, criteria: 'Forward flexion of the cervical spine 15 degrees or less; or, favorable ankylosis of the entire cervical spine.', keywords: ['cervical flexion ≤15°', 'favorable ankylosis'] },
      { percent: 40, criteria: 'Unfavorable ankylosis of the entire cervical spine.', keywords: ['unfavorable ankylosis', 'cervical'] },
      { percent: 100, criteria: 'Unfavorable ankylosis of the entire spine.', keywords: ['unfavorable ankylosis', 'entire spine'] },
    ],
    examTips: ['Report worst-day ROM', 'Document where pain begins during ROM testing', 'Describe radicular symptoms into arms/hands', 'Note incapacitating episodes'],
    commonMistakes: ['Not distinguishing cervical from lumbar symptoms', 'Failing to mention upper extremity numbness/tingling'],
  },
  // Degenerative Disc Disease Lumbar (DC 5242)
  {
    conditionId: 'degenerative-disc-disease-lumbar',
    conditionName: 'Degenerative Disc Disease - Lumbar Spine',
    diagnosticCode: '5242',
    cfrReference: '38 CFR § 4.71a, DC 5242',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Forward flexion of the thoracolumbar spine greater than 60 degrees but not greater than 85 degrees; or, combined ROM greater than 120 degrees but not greater than 235 degrees; or, muscle spasm, guarding, or localized tenderness not resulting in abnormal gait or contour.', keywords: ['flexion 60-85°', 'combined ROM 120-235°', 'muscle spasm'] },
      { percent: 20, criteria: 'Forward flexion of the thoracolumbar spine greater than 30 degrees but not greater than 60 degrees; or, combined ROM not greater than 120 degrees; or, muscle spasm or guarding severe enough to result in abnormal gait or spinal contour.', keywords: ['flexion 30-60°', 'combined ROM ≤120°', 'abnormal gait'] },
      { percent: 40, criteria: 'Forward flexion 30 degrees or less; or, favorable ankylosis of the entire thoracolumbar spine.', keywords: ['flexion ≤30°', 'favorable ankylosis'] },
      { percent: 50, criteria: 'Unfavorable ankylosis of the entire thoracolumbar spine.', keywords: ['unfavorable ankylosis', 'thoracolumbar'] },
      { percent: 100, criteria: 'Unfavorable ankylosis of the entire spine.', keywords: ['unfavorable ankylosis', 'entire spine'] },
    ],
    examTips: ['Report worst-day ROM', 'Document pain on motion', 'Describe flare-ups and additional limitation', 'Mention radicular symptoms separately for separate rating'],
    commonMistakes: ['Not reporting flare-up impact on ROM', 'Forgetting radiculopathy symptoms', 'Testing after taking pain medication'],
  },
  // Right Shoulder Impingement (DC 5201)
  {
    conditionId: 'right-shoulder-impingement',
    conditionName: 'Right Shoulder Impingement Syndrome',
    diagnosticCode: '5201',
    cfrReference: '38 CFR § 4.71a, DC 5201',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'Arm limited in motion at shoulder level (90 degrees abduction).', keywords: ['arm at shoulder level', '90° abduction', 'limited overhead'] },
      { percent: 30, criteria: 'Arm limited in motion midway between side and shoulder level (45 degrees abduction) - major extremity.', keywords: ['midway between side and shoulder', '45° abduction', 'major'] },
      { percent: 40, criteria: 'Arm limited in motion to 25 degrees from side - major extremity.', keywords: ['25° from side', 'major', 'severely limited'] },
    ],
    examTips: ['Specify if this is your dominant arm', 'Report pain onset during abduction testing', 'Describe difficulty with overhead activities', 'Document flare-ups and their impact on ROM'],
    commonMistakes: ['Not specifying dominant vs non-dominant arm', 'Not reporting pain on motion and where it begins', 'Not mentioning functional loss during flare-ups'],
  },
  // Left Shoulder Impingement (DC 5201)
  {
    conditionId: 'left-shoulder-impingement',
    conditionName: 'Left Shoulder Impingement Syndrome',
    diagnosticCode: '5201',
    cfrReference: '38 CFR § 4.71a, DC 5201',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'Arm limited in motion at shoulder level (90 degrees abduction).', keywords: ['arm at shoulder level', '90° abduction', 'limited overhead'] },
      { percent: 20, criteria: 'Arm limited in motion midway between side and shoulder level (45 degrees abduction) - minor extremity.', keywords: ['midway between side and shoulder', '45° abduction', 'minor'] },
      { percent: 30, criteria: 'Arm limited in motion to 25 degrees from side - minor extremity.', keywords: ['25° from side', 'minor', 'severely limited'] },
    ],
    examTips: ['Specify if this is your dominant arm', 'Report pain onset during abduction testing', 'Describe difficulty with overhead activities', 'Document flare-ups and their impact on ROM'],
    commonMistakes: ['Not specifying dominant vs non-dominant arm', 'Not reporting pain on motion', 'Not mentioning functional loss during flare-ups'],
  },
  // Right Shoulder Rotator Cuff (DC 5201/5200)
  {
    conditionId: 'right-shoulder-rotator-cuff',
    conditionName: 'Right Shoulder Rotator Cuff Tear/Injury',
    diagnosticCode: '5201/5200',
    cfrReference: '38 CFR § 4.71a, DC 5201/5200',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'Arm limited in motion at shoulder level (90 degrees abduction). Minimum compensable rating for limitation of arm motion.', keywords: ['arm at shoulder level', '90° abduction'] },
      { percent: 30, criteria: 'Arm limited in motion midway between side and shoulder level - major extremity; or favorable ankylosis of scapulohumeral articulation (abduction to 60 degrees, can reach mouth/head).', keywords: ['midway side-shoulder', 'major', 'favorable ankylosis'] },
      { percent: 40, criteria: 'Arm limited to 25 degrees from side - major extremity; or intermediate ankylosis of scapulohumeral articulation.', keywords: ['25° from side', 'major', 'intermediate ankylosis'] },
      { percent: 50, criteria: 'Unfavorable ankylosis of scapulohumeral articulation (abduction limited to 25 degrees) - major extremity.', keywords: ['unfavorable ankylosis', 'major', '25° abduction max'] },
    ],
    examTips: ['Specify dominant arm', 'Report all ROM planes: flexion, abduction, internal/external rotation', 'Describe weakness, instability, and giving way', 'Document surgical history and MRI findings'],
    commonMistakes: ['Not claiming ankylosis when shoulder is essentially frozen', 'Not requesting separate rating for surgical scars', 'Not reporting instability or subluxation'],
  },
  // Left Shoulder Rotator Cuff (DC 5201/5200)
  {
    conditionId: 'left-shoulder-rotator-cuff',
    conditionName: 'Left Shoulder Rotator Cuff Tear/Injury',
    diagnosticCode: '5201/5200',
    cfrReference: '38 CFR § 4.71a, DC 5201/5200',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'Arm limited in motion at shoulder level (90 degrees abduction). Minimum compensable rating for limitation of arm motion.', keywords: ['arm at shoulder level', '90° abduction'] },
      { percent: 20, criteria: 'Arm limited in motion midway between side and shoulder level - minor extremity.', keywords: ['midway side-shoulder', 'minor'] },
      { percent: 30, criteria: 'Arm limited to 25 degrees from side - minor extremity; or favorable ankylosis of scapulohumeral articulation - minor.', keywords: ['25° from side', 'minor', 'favorable ankylosis'] },
      { percent: 40, criteria: 'Unfavorable ankylosis of scapulohumeral articulation - minor extremity.', keywords: ['unfavorable ankylosis', 'minor'] },
    ],
    examTips: ['Specify dominant arm', 'Report all ROM planes', 'Describe weakness, instability, and giving way', 'Document surgical history and MRI findings'],
    commonMistakes: ['Not claiming ankylosis when shoulder is essentially frozen', 'Not requesting separate rating for surgical scars'],
  },
  // Right Elbow Tendinitis (DC 5206/5207)
  {
    conditionId: 'right-elbow-tendinitis',
    conditionName: 'Right Elbow Tendinitis',
    diagnosticCode: '5206/5207',
    cfrReference: '38 CFR § 4.71a, DC 5206/5207',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Flexion limited to 110 degrees (DC 5206); or extension limited to 45 degrees or less (DC 5207).', keywords: ['flexion to 110°', 'extension to 45°'] },
      { percent: 10, criteria: 'Flexion limited to 100 degrees; or extension limited to 45 degrees to 60 degrees.', keywords: ['flexion to 100°', 'extension to 60°'] },
      { percent: 20, criteria: 'Flexion limited to 90 degrees (major); or extension limited to 75 degrees.', keywords: ['flexion to 90°', 'extension to 75°', 'major'] },
      { percent: 30, criteria: 'Flexion limited to 70 degrees (major); or extension limited to 90 degrees (major).', keywords: ['flexion to 70°', 'extension to 90°', 'major'] },
      { percent: 40, criteria: 'Flexion limited to 55 degrees (major); or extension limited to 100 degrees (major).', keywords: ['flexion to 55°', 'extension to 100°', 'major'] },
      { percent: 50, criteria: 'Flexion limited to 45 degrees (major); or extension limited to 110 degrees (major).', keywords: ['flexion to 45°', 'extension to 110°', 'major'] },
    ],
    examTips: ['Specify dominant arm', 'Report both flexion and extension ROM', 'Describe pain on gripping and lifting', 'Note repetitive-use impact on ROM'],
    commonMistakes: ['Not reporting both flexion and extension limitations', 'Not claiming the more favorable DC code', 'Not specifying dominant extremity'],
  },
  // Left Elbow Tendinitis (DC 5206/5207)
  {
    conditionId: 'left-elbow-tendinitis',
    conditionName: 'Left Elbow Tendinitis',
    diagnosticCode: '5206/5207',
    cfrReference: '38 CFR § 4.71a, DC 5206/5207',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Flexion limited to 110 degrees (DC 5206); or extension limited to 45 degrees or less (DC 5207).', keywords: ['flexion to 110°', 'extension to 45°'] },
      { percent: 10, criteria: 'Flexion limited to 100 degrees; or extension limited to 45 degrees to 60 degrees.', keywords: ['flexion to 100°', 'extension to 60°'] },
      { percent: 20, criteria: 'Flexion limited to 90 degrees (minor); or extension limited to 75 degrees (minor).', keywords: ['flexion to 90°', 'extension to 75°', 'minor'] },
      { percent: 30, criteria: 'Flexion limited to 70 degrees (minor); or extension limited to 90 degrees (minor).', keywords: ['flexion to 70°', 'extension to 90°', 'minor'] },
      { percent: 40, criteria: 'Flexion limited to 55 degrees (minor); or extension limited to 100 degrees (minor).', keywords: ['flexion to 55°', 'extension to 100°', 'minor'] },
      { percent: 50, criteria: 'Flexion limited to 45 degrees (minor); or extension limited to 110 degrees (minor).', keywords: ['flexion to 45°', 'extension to 110°', 'minor'] },
    ],
    examTips: ['Specify dominant arm', 'Report both flexion and extension ROM', 'Describe pain on gripping and lifting', 'Note repetitive-use impact on ROM'],
    commonMistakes: ['Not reporting both flexion and extension limitations', 'Not claiming the more favorable DC code'],
  },
  // Carpal Tunnel Right (DC 8515)
  {
    conditionId: 'carpal-tunnel-right',
    conditionName: 'Carpal Tunnel Syndrome - Right Wrist',
    diagnosticCode: '8515',
    cfrReference: '38 CFR § 4.124a, DC 8515',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the median nerve.', keywords: ['mild', 'incomplete paralysis', 'median nerve', 'intermittent numbness'] },
      { percent: 30, criteria: 'Moderate incomplete paralysis of the median nerve - major extremity.', keywords: ['moderate', 'incomplete paralysis', 'major', 'frequent numbness', 'grip weakness'] },
      { percent: 50, criteria: 'Severe incomplete paralysis of the median nerve - major extremity.', keywords: ['severe', 'incomplete paralysis', 'major', 'constant numbness', 'significant grip weakness'] },
      { percent: 70, criteria: 'Complete paralysis of the median nerve - major extremity. The hand inclined to the ulnar side, the index and middle fingers more extended than normally, considerable atrophy of the muscles of the thenar eminence, inability to flex the distal phalanx of the thumb, weakened flexion of index finger, inability to make a fist.', keywords: ['complete paralysis', 'major', 'thenar atrophy', 'cannot make fist'] },
    ],
    examTips: ['Specify dominant hand', 'Report grip strength measurements', 'Describe numbness/tingling pattern (thumb, index, middle fingers)', 'Document nerve conduction study results', 'Report dropping objects and fine motor difficulty'],
    commonMistakes: ['Not specifying dominant hand', 'Not providing nerve conduction study results', 'Understating severity of symptoms'],
  },
  // Carpal Tunnel Left (DC 8515)
  {
    conditionId: 'carpal-tunnel-left',
    conditionName: 'Carpal Tunnel Syndrome - Left Wrist',
    diagnosticCode: '8515',
    cfrReference: '38 CFR § 4.124a, DC 8515',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the median nerve.', keywords: ['mild', 'incomplete paralysis', 'median nerve', 'intermittent numbness'] },
      { percent: 20, criteria: 'Moderate incomplete paralysis of the median nerve - minor extremity.', keywords: ['moderate', 'incomplete paralysis', 'minor', 'frequent numbness'] },
      { percent: 40, criteria: 'Severe incomplete paralysis of the median nerve - minor extremity.', keywords: ['severe', 'incomplete paralysis', 'minor', 'constant numbness'] },
      { percent: 60, criteria: 'Complete paralysis of the median nerve - minor extremity.', keywords: ['complete paralysis', 'minor', 'thenar atrophy', 'cannot make fist'] },
    ],
    examTips: ['Specify dominant hand', 'Report grip strength measurements', 'Describe numbness/tingling pattern', 'Document nerve conduction study results'],
    commonMistakes: ['Not specifying dominant hand', 'Not providing nerve conduction study results'],
  },
  // Right Hip Strain (DC 5252/5253)
  {
    conditionId: 'right-hip-strain',
    conditionName: 'Right Hip Strain',
    diagnosticCode: '5252/5253',
    cfrReference: '38 CFR § 4.71a, DC 5252/5253',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Flexion of the thigh limited to 45 degrees (DC 5252); or limitation of rotation of the thigh, cannot toe-out more than 15 degrees on the affected leg; or limitation of adduction, cannot cross legs (DC 5253).', keywords: ['flexion to 45°', 'toe-out ≤15°', 'cannot cross legs'] },
      { percent: 20, criteria: 'Flexion of the thigh limited to 30 degrees (DC 5252); or limitation of abduction, motion lost beyond 10 degrees (DC 5253).', keywords: ['flexion to 30°', 'abduction lost beyond 10°'] },
      { percent: 30, criteria: 'Flexion of the thigh limited to 20 degrees.', keywords: ['flexion to 20°', 'severely limited'] },
      { percent: 40, criteria: 'Flexion of the thigh limited to 10 degrees.', keywords: ['flexion to 10°', 'nearly immobile'] },
    ],
    examTips: ['Report ROM in all planes: flexion, extension, abduction, adduction, rotation', 'Describe gait abnormality', 'Mention use of assistive devices', 'Document impact on walking, stairs, sitting'],
    commonMistakes: ['Not testing all ROM planes', 'Not reporting gait problems', 'Not claiming separate DC codes for different planes of limitation'],
  },
  // Left Hip Strain (DC 5252/5253)
  {
    conditionId: 'left-hip-strain',
    conditionName: 'Left Hip Strain',
    diagnosticCode: '5252/5253',
    cfrReference: '38 CFR § 4.71a, DC 5252/5253',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Flexion of the thigh limited to 45 degrees (DC 5252); or limitation of rotation of the thigh, cannot toe-out more than 15 degrees on the affected leg; or limitation of adduction, cannot cross legs (DC 5253).', keywords: ['flexion to 45°', 'toe-out ≤15°', 'cannot cross legs'] },
      { percent: 20, criteria: 'Flexion of the thigh limited to 30 degrees (DC 5252); or limitation of abduction, motion lost beyond 10 degrees (DC 5253).', keywords: ['flexion to 30°', 'abduction lost beyond 10°'] },
      { percent: 30, criteria: 'Flexion of the thigh limited to 20 degrees.', keywords: ['flexion to 20°', 'severely limited'] },
      { percent: 40, criteria: 'Flexion of the thigh limited to 10 degrees.', keywords: ['flexion to 10°', 'nearly immobile'] },
    ],
    examTips: ['Report ROM in all planes', 'Describe gait abnormality', 'Mention use of assistive devices', 'Document impact on daily activities'],
    commonMistakes: ['Not testing all ROM planes', 'Not reporting gait problems'],
  },
  // Right Ankle Strain (DC 5271)
  {
    conditionId: 'right-ankle-strain',
    conditionName: 'Right Ankle Strain',
    diagnosticCode: '5271',
    cfrReference: '38 CFR § 4.71a, DC 5271',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Moderate limited motion of the ankle.', keywords: ['moderate', 'limited motion', 'dorsiflexion reduced', 'plantar flexion reduced'] },
      { percent: 20, criteria: 'Marked limited motion of the ankle.', keywords: ['marked', 'severely limited', 'near immobile'] },
    ],
    examTips: ['Report dorsiflexion and plantar flexion ROM', 'Describe instability and giving way', 'Mention use of ankle brace', 'Document impact on walking and standing'],
    commonMistakes: ['Not reporting instability separately (DC 5262)', 'Not documenting flare-up impact on ROM'],
  },
  // Left Ankle Strain (DC 5271)
  {
    conditionId: 'left-ankle-strain',
    conditionName: 'Left Ankle Strain',
    diagnosticCode: '5271',
    cfrReference: '38 CFR § 4.71a, DC 5271',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Moderate limited motion of the ankle.', keywords: ['moderate', 'limited motion', 'dorsiflexion reduced', 'plantar flexion reduced'] },
      { percent: 20, criteria: 'Marked limited motion of the ankle.', keywords: ['marked', 'severely limited', 'near immobile'] },
    ],
    examTips: ['Report dorsiflexion and plantar flexion ROM', 'Describe instability and giving way', 'Mention use of ankle brace'],
    commonMistakes: ['Not reporting instability separately', 'Not documenting flare-up impact on ROM'],
  },
  // Plantar Fasciitis Right (DC 5276)
  {
    conditionId: 'plantar-fasciitis-right',
    conditionName: 'Plantar Fasciitis - Right Foot',
    diagnosticCode: '5276',
    cfrReference: '38 CFR § 4.71a, DC 5276',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Mild: symptoms relieved by built-up shoe or arch support (unilateral).', keywords: ['mild', 'arch support', 'built-up shoe'] },
      { percent: 10, criteria: 'Moderate: weight-bearing line over or medial to great toe, inward bowing of the tendo Achillis, pain on manipulation and use of the feet (unilateral).', keywords: ['moderate', 'weight-bearing line medial', 'inward bowing', 'pain on use'] },
      { percent: 20, criteria: 'Severe: objective evidence of marked deformity (pronation, abduction, etc.), pain on manipulation and use accentuated, indication of swelling on use, characteristic callosities (unilateral).', keywords: ['severe', 'marked deformity', 'pronation', 'swelling', 'callosities'] },
      { percent: 30, criteria: 'Pronounced: marked pronation, extreme tenderness of plantar surfaces of the feet, marked inward displacement and severe spasm of the tendo Achillis on manipulation, not improved by orthopedic shoes or appliances (unilateral).', keywords: ['pronounced', 'extreme tenderness', 'marked pronation', 'not improved by orthotics'] },
    ],
    examTips: ['Describe pain with first steps in the morning', 'Report pain level after prolonged standing/walking', 'Document use of orthotics, inserts, or special footwear', 'Describe impact on ability to walk, stand, and exercise'],
    commonMistakes: ['Not documenting pain on manipulation during exam', 'Not mentioning failure of conservative treatments'],
  },
  // Plantar Fasciitis Left (DC 5276)
  {
    conditionId: 'plantar-fasciitis-left',
    conditionName: 'Plantar Fasciitis - Left Foot',
    diagnosticCode: '5276',
    cfrReference: '38 CFR § 4.71a, DC 5276',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Mild: symptoms relieved by built-up shoe or arch support (unilateral).', keywords: ['mild', 'arch support', 'built-up shoe'] },
      { percent: 10, criteria: 'Moderate: weight-bearing line over or medial to great toe, inward bowing of the tendo Achillis, pain on manipulation and use of the feet (unilateral).', keywords: ['moderate', 'weight-bearing line medial', 'inward bowing', 'pain on use'] },
      { percent: 20, criteria: 'Severe: objective evidence of marked deformity, pain on manipulation and use accentuated, swelling on use, characteristic callosities (unilateral).', keywords: ['severe', 'marked deformity', 'pronation', 'swelling', 'callosities'] },
      { percent: 30, criteria: 'Pronounced: marked pronation, extreme tenderness of plantar surfaces, marked inward displacement and severe spasm of the tendo Achillis on manipulation, not improved by orthopedic shoes or appliances (unilateral).', keywords: ['pronounced', 'extreme tenderness', 'marked pronation', 'not improved by orthotics'] },
    ],
    examTips: ['Describe pain with first steps in the morning', 'Report pain level after prolonged standing/walking', 'Document use of orthotics'],
    commonMistakes: ['Not documenting pain on manipulation during exam', 'Not mentioning failure of conservative treatments'],
  },
  // Hallux Valgus Right (DC 5280)
  {
    conditionId: 'hallux-valgus-right',
    conditionName: 'Hallux Valgus (Bunion) - Right Foot',
    diagnosticCode: '5280',
    cfrReference: '38 CFR § 4.71a, DC 5280',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Operated with resection of metatarsal head; or, severe, if equivalent to amputation of great toe (unilateral).', keywords: ['resection', 'metatarsal head', 'severe', 'equivalent to amputation'] },
    ],
    examTips: ['Document surgical history', 'Describe pain with weight-bearing and shoe wear', 'Note if condition is equivalent in severity to amputation of the great toe'],
    commonMistakes: ['Not filing for surgical scar separately', 'Not claiming secondary conditions like altered gait causing knee/hip problems'],
  },
  // Hallux Valgus Left (DC 5280)
  {
    conditionId: 'hallux-valgus-left',
    conditionName: 'Hallux Valgus (Bunion) - Left Foot',
    diagnosticCode: '5280',
    cfrReference: '38 CFR § 4.71a, DC 5280',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Operated with resection of metatarsal head; or, severe, if equivalent to amputation of great toe (unilateral).', keywords: ['resection', 'metatarsal head', 'severe', 'equivalent to amputation'] },
    ],
    examTips: ['Document surgical history', 'Describe pain with weight-bearing and shoe wear', 'Note if condition is equivalent in severity to amputation of the great toe'],
    commonMistakes: ['Not filing for surgical scar separately', 'Not claiming secondary conditions like altered gait'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL NEUROLOGICAL — Lateralized & New Entries
  // ═══════════════════════════════════════════════════════════════════════════

  // Sciatic Nerve Right (DC 8520)
  {
    conditionId: 'sciatic-nerve-right',
    conditionName: 'Sciatic Nerve Paralysis - Right Lower Extremity',
    diagnosticCode: '8520',
    cfrReference: '38 CFR § 4.124a, DC 8520',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the sciatic nerve.', keywords: ['mild', 'incomplete paralysis', 'intermittent pain', 'slight sensory deficit'] },
      { percent: 20, criteria: 'Moderate incomplete paralysis of the sciatic nerve.', keywords: ['moderate', 'incomplete paralysis', 'frequent numbness', 'reduced reflexes'] },
      { percent: 40, criteria: 'Moderately severe incomplete paralysis of the sciatic nerve.', keywords: ['moderately severe', 'muscle weakness', 'foot drop tendency', 'significant sensory loss'] },
      { percent: 60, criteria: 'Severe incomplete paralysis with marked muscular atrophy.', keywords: ['severe', 'marked atrophy', 'significant weakness', 'foot drop'] },
      { percent: 80, criteria: 'Complete paralysis of the sciatic nerve; the foot dangles and drops, no active movement possible of muscles below the knee, flexion of knee weakened or (very rarely) lost.', keywords: ['complete paralysis', 'foot drop', 'no active movement below knee'] },
    ],
    examTips: ['Report specific nerve distribution affected', 'Document muscle strength testing results', 'Describe numbness/tingling pattern in leg/foot', 'Provide EMG/NCS results'],
    commonMistakes: ['Not distinguishing from radiculopathy (can be rated separately)', 'Not providing nerve conduction study results'],
  },
  // Sciatic Nerve Left (DC 8520)
  {
    conditionId: 'sciatic-nerve-left',
    conditionName: 'Sciatic Nerve Paralysis - Left Lower Extremity',
    diagnosticCode: '8520',
    cfrReference: '38 CFR § 4.124a, DC 8520',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the sciatic nerve.', keywords: ['mild', 'incomplete paralysis', 'intermittent pain', 'slight sensory deficit'] },
      { percent: 20, criteria: 'Moderate incomplete paralysis of the sciatic nerve.', keywords: ['moderate', 'incomplete paralysis', 'frequent numbness', 'reduced reflexes'] },
      { percent: 40, criteria: 'Moderately severe incomplete paralysis of the sciatic nerve.', keywords: ['moderately severe', 'muscle weakness', 'foot drop tendency'] },
      { percent: 60, criteria: 'Severe incomplete paralysis with marked muscular atrophy.', keywords: ['severe', 'marked atrophy', 'significant weakness', 'foot drop'] },
      { percent: 80, criteria: 'Complete paralysis of the sciatic nerve; the foot dangles and drops, no active movement possible of muscles below the knee, flexion of knee weakened or (very rarely) lost.', keywords: ['complete paralysis', 'foot drop', 'no active movement below knee'] },
    ],
    examTips: ['Report specific nerve distribution affected', 'Document muscle strength testing results', 'Describe numbness/tingling pattern', 'Provide EMG/NCS results'],
    commonMistakes: ['Not distinguishing from radiculopathy', 'Not providing nerve conduction study results'],
  },
  // Median Nerve Right (DC 8515)
  {
    conditionId: 'median-nerve-right',
    conditionName: 'Median Nerve Paralysis - Right Upper Extremity',
    diagnosticCode: '8515',
    cfrReference: '38 CFR § 4.124a, DC 8515',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the median nerve.', keywords: ['mild', 'incomplete paralysis', 'intermittent numbness'] },
      { percent: 30, criteria: 'Moderate incomplete paralysis of the median nerve - major extremity.', keywords: ['moderate', 'major', 'grip weakness', 'frequent numbness'] },
      { percent: 50, criteria: 'Severe incomplete paralysis of the median nerve - major extremity.', keywords: ['severe', 'major', 'significant grip loss', 'constant numbness'] },
      { percent: 70, criteria: 'Complete paralysis of the median nerve - major extremity. The hand inclined to the ulnar side; the index and middle fingers more extended than normally; considerable atrophy of the muscles of the thenar eminence; the thumb in the plane of the hand; pronation incomplete and defective; absence of flexion of index finger and feeble flexion of middle finger; inability to make a fist; index and middle fingers remain extended; cannot flex distal phalanx of thumb; defective opposition and abduction of the thumb at right angles to palm; weakened wrist flexion; pain with trophic disturbances.', keywords: ['complete paralysis', 'major', 'thenar atrophy', 'cannot make fist', 'trophic changes'] },
    ],
    examTips: ['Specify dominant hand', 'Document grip and pinch strength', 'Describe thenar muscle atrophy', 'Provide nerve conduction study results'],
    commonMistakes: ['Not specifying dominant extremity', 'Not distinguishing from carpal tunnel syndrome'],
  },
  // Median Nerve Left (DC 8515)
  {
    conditionId: 'median-nerve-left',
    conditionName: 'Median Nerve Paralysis - Left Upper Extremity',
    diagnosticCode: '8515',
    cfrReference: '38 CFR § 4.124a, DC 8515',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the median nerve.', keywords: ['mild', 'incomplete paralysis', 'intermittent numbness'] },
      { percent: 20, criteria: 'Moderate incomplete paralysis of the median nerve - minor extremity.', keywords: ['moderate', 'minor', 'grip weakness'] },
      { percent: 40, criteria: 'Severe incomplete paralysis of the median nerve - minor extremity.', keywords: ['severe', 'minor', 'significant grip loss'] },
      { percent: 60, criteria: 'Complete paralysis of the median nerve - minor extremity.', keywords: ['complete paralysis', 'minor', 'thenar atrophy', 'cannot make fist'] },
    ],
    examTips: ['Specify dominant hand', 'Document grip and pinch strength', 'Describe thenar muscle atrophy', 'Provide nerve conduction study results'],
    commonMistakes: ['Not specifying dominant extremity', 'Not distinguishing from carpal tunnel syndrome'],
  },
  // Ulnar Nerve Right (DC 8516)
  {
    conditionId: 'ulnar-nerve-right',
    conditionName: 'Ulnar Nerve Paralysis - Right Upper Extremity',
    diagnosticCode: '8516',
    cfrReference: '38 CFR § 4.124a, DC 8516',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the ulnar nerve.', keywords: ['mild', 'incomplete paralysis', 'intermittent tingling ring/little finger'] },
      { percent: 30, criteria: 'Moderate incomplete paralysis of the ulnar nerve - major extremity.', keywords: ['moderate', 'major', 'grip weakness', 'claw hand tendency'] },
      { percent: 40, criteria: 'Severe incomplete paralysis of the ulnar nerve - major extremity.', keywords: ['severe', 'major', 'significant weakness', 'muscle wasting'] },
      { percent: 60, criteria: 'Complete paralysis of the ulnar nerve - major extremity. "Griffin claw" deformity due to flexor contraction of ring and little fingers, atrophy very marked in dorsal interspace and thenar and hypothenar eminences; loss of extension of ring and little fingers; inability to spread fingers (or reverse); inability to adduct thumb; flexion of wrist weakened.', keywords: ['complete paralysis', 'major', 'griffin claw', 'atrophy', 'cannot spread fingers'] },
    ],
    examTips: ['Specify dominant hand', 'Document interosseous muscle strength', 'Describe ring and little finger sensation', 'Provide EMG/NCS results'],
    commonMistakes: ['Not specifying dominant extremity', 'Confusing ulnar with median nerve distribution'],
  },
  // Ulnar Nerve Left (DC 8516)
  {
    conditionId: 'ulnar-nerve-left',
    conditionName: 'Ulnar Nerve Paralysis - Left Upper Extremity',
    diagnosticCode: '8516',
    cfrReference: '38 CFR § 4.124a, DC 8516',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the ulnar nerve.', keywords: ['mild', 'incomplete paralysis', 'intermittent tingling ring/little finger'] },
      { percent: 20, criteria: 'Moderate incomplete paralysis of the ulnar nerve - minor extremity.', keywords: ['moderate', 'minor', 'grip weakness'] },
      { percent: 30, criteria: 'Severe incomplete paralysis of the ulnar nerve - minor extremity.', keywords: ['severe', 'minor', 'significant weakness'] },
      { percent: 50, criteria: 'Complete paralysis of the ulnar nerve - minor extremity.', keywords: ['complete paralysis', 'minor', 'griffin claw', 'atrophy'] },
    ],
    examTips: ['Specify dominant hand', 'Document interosseous muscle strength', 'Describe ring and little finger sensation', 'Provide EMG/NCS results'],
    commonMistakes: ['Not specifying dominant extremity', 'Confusing ulnar with median nerve distribution'],
  },
  // Cluster Headaches (DC 8100)
  {
    conditionId: 'cluster-headaches',
    conditionName: 'Cluster Headaches',
    diagnosticCode: '8100',
    cfrReference: '38 CFR § 4.124a, DC 8100',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'With less frequent attacks than required for a 10% rating.', keywords: ['infrequent', 'rare attacks'] },
      { percent: 10, criteria: 'With characteristic prostrating attacks averaging one in 2 months over the last several months.', keywords: ['prostrating', '1 per 2 months', 'characteristic attacks'] },
      { percent: 30, criteria: 'With characteristic prostrating attacks occurring on an average once a month over the last several months.', keywords: ['prostrating', 'monthly', 'once per month'] },
      { percent: 50, criteria: 'With very frequent completely prostrating and prolonged attacks productive of severe economic inadaptability.', keywords: ['very frequent', 'completely prostrating', 'prolonged', 'severe economic inadaptability'] },
    ],
    examTips: ['Keep a detailed headache diary with frequency and duration', 'Document prostrating nature: must lie down, cannot function', 'Describe impact on work: missed days, reduced productivity', 'Report associated symptoms: tearing, nasal congestion, eye pain'],
    commonMistakes: ['Not keeping a headache diary', 'Not documenting that attacks are prostrating', 'Not connecting headaches to economic impact'],
  },
  // Tension Headaches (DC 8100)
  {
    conditionId: 'tension-headaches',
    conditionName: 'Tension Headaches',
    diagnosticCode: '8100',
    cfrReference: '38 CFR § 4.124a, DC 8100',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'With less frequent attacks than required for a 10% rating.', keywords: ['infrequent', 'rare attacks'] },
      { percent: 10, criteria: 'With characteristic prostrating attacks averaging one in 2 months over the last several months.', keywords: ['prostrating', '1 per 2 months'] },
      { percent: 30, criteria: 'With characteristic prostrating attacks occurring on an average once a month over the last several months.', keywords: ['prostrating', 'monthly'] },
      { percent: 50, criteria: 'With very frequent completely prostrating and prolonged attacks productive of severe economic inadaptability.', keywords: ['very frequent', 'completely prostrating', 'prolonged', 'severe economic inadaptability'] },
    ],
    examTips: ['Keep a headache diary', 'Document prostrating nature of attacks', 'Describe impact on work and daily activities', 'Report medication usage and effectiveness'],
    commonMistakes: ['Not documenting that headaches are prostrating', 'Not tracking frequency consistently'],
  },
  // Epilepsy Grand Mal (DC 8910)
  {
    conditionId: 'epilepsy-grand-mal',
    conditionName: 'Epilepsy - Grand Mal (Tonic-Clonic Seizures)',
    diagnosticCode: '8910',
    cfrReference: '38 CFR § 4.124a, DC 8910',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'A confirmed diagnosis of epilepsy with a history of seizures.', keywords: ['confirmed diagnosis', 'history of seizures'] },
      { percent: 20, criteria: 'At least 1 major seizure in the last 2 years; or at least 2 minor seizures in the last 6 months.', keywords: ['1 major/2 years', '2 minor/6 months'] },
      { percent: 40, criteria: 'At least 1 major seizure in the last 6 months or 2 in the last year; or averaging at least 5 to 8 minor seizures weekly.', keywords: ['1 major/6 months', '5-8 minor/week'] },
      { percent: 60, criteria: 'Averaging at least 1 major seizure in 4 months over the last year; or 9-10 minor seizures per week.', keywords: ['1 major/4 months', '9-10 minor/week'] },
      { percent: 80, criteria: 'Averaging at least 1 major seizure in 3 months over the last year; or more than 10 minor seizures weekly.', keywords: ['1 major/3 months', '10+ minor/week'] },
      { percent: 100, criteria: 'Averaging at least 1 major seizure per month over the last year.', keywords: ['1+ major/month', 'monthly seizures'] },
    ],
    examTips: ['Keep a detailed seizure diary', 'Document seizure type, duration, and recovery time', 'Report medication regimen and side effects', 'Describe any driving restrictions or employment limitations'],
    commonMistakes: ['Not keeping a seizure log', 'Not documenting post-ictal symptoms and recovery time', 'Not reporting medication side effects separately'],
  },
  // Epilepsy Petit Mal (DC 8911)
  {
    conditionId: 'epilepsy-petit-mal',
    conditionName: 'Epilepsy - Petit Mal (Absence Seizures)',
    diagnosticCode: '8911',
    cfrReference: '38 CFR § 4.124a, DC 8911',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'A confirmed diagnosis of epilepsy with a history of seizures.', keywords: ['confirmed diagnosis', 'history of seizures'] },
      { percent: 20, criteria: 'At least 1 major seizure in the last 2 years; or at least 2 minor seizures in the last 6 months.', keywords: ['1 major/2 years', '2 minor/6 months'] },
      { percent: 40, criteria: 'At least 1 major seizure in the last 6 months or 2 in the last year; or averaging at least 5 to 8 minor seizures weekly.', keywords: ['1 major/6 months', '5-8 minor/week'] },
      { percent: 60, criteria: 'Averaging at least 1 major seizure in 4 months over the last year; or 9-10 minor seizures per week.', keywords: ['1 major/4 months', '9-10 minor/week'] },
      { percent: 80, criteria: 'Averaging at least 1 major seizure in 3 months over the last year; or more than 10 minor seizures weekly.', keywords: ['1 major/3 months', '10+ minor/week'] },
      { percent: 100, criteria: 'Averaging at least 1 major seizure per month over the last year.', keywords: ['1+ major/month'] },
    ],
    examTips: ['Document frequency and duration of absence episodes', 'Report impact on daily functioning and safety', 'Note medication regimen and side effects', 'Describe any witnessed episodes'],
    commonMistakes: ['Not tracking minor seizure episodes', 'Not documenting impact on driving and employment'],
  },
  // Restless Leg Syndrome (DC 8620)
  {
    conditionId: 'restless-leg-syndrome',
    conditionName: 'Restless Leg Syndrome',
    diagnosticCode: '8620',
    cfrReference: '38 CFR § 4.124a, DC 8620',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis (neuritis) of the sciatic nerve. Mild sensory disturbance with uncomfortable leg sensations.', keywords: ['mild', 'sensory disturbance', 'uncomfortable sensations', 'intermittent'] },
      { percent: 20, criteria: 'Moderate incomplete paralysis (neuritis) of the sciatic nerve. Moderate symptoms disrupting sleep regularly.', keywords: ['moderate', 'sleep disruption', 'regular symptoms'] },
      { percent: 40, criteria: 'Moderately severe incomplete paralysis (neuritis). Frequent symptoms significantly disrupting sleep and daily function.', keywords: ['moderately severe', 'frequent', 'significant sleep disruption', 'daily impact'] },
      { percent: 60, criteria: 'Severe incomplete paralysis (neuritis) with marked impact on sleep and daily activities.', keywords: ['severe', 'marked impact', 'constant symptoms'] },
    ],
    examTips: ['Document sleep study results', 'Describe frequency and severity of symptoms', 'Report impact on sleep quality and duration', 'Note medications tried and their effectiveness'],
    commonMistakes: ['Not documenting sleep disruption', 'Not connecting to secondary insomnia or fatigue claims'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL MENTAL HEALTH — 38 CFR § 4.130
  // ═══════════════════════════════════════════════════════════════════════════

  // Schizoaffective Disorder (DC 9211)
  {
    conditionId: 'schizoaffective-disorder',
    conditionName: 'Schizoaffective Disorder',
    diagnosticCode: '9211',
    cfrReference: '38 CFR § 4.130, DC 9211',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'A mental condition has been formally diagnosed, but symptoms are not severe enough either to interfere with occupational and social functioning or to require continuous medication.', keywords: ['diagnosed', 'no functional impairment', 'no medication needed'] },
      { percent: 10, criteria: 'Occupational and social impairment due to mild or transient symptoms which decrease work efficiency and ability to perform occupational tasks only during periods of significant stress; or, symptoms controlled by continuous medication.', keywords: ['mild symptoms', 'stress-related', 'controlled by medication'] },
      { percent: 30, criteria: 'Occupational and social impairment with occasional decrease in work efficiency and intermittent periods of inability to perform occupational tasks (although generally functioning satisfactorily, with routine behavior, self-care, and conversation normal), due to such symptoms as: depressed mood, anxiety, suspiciousness, panic attacks (weekly or less often), chronic sleep impairment, mild memory loss.', keywords: ['occasional decrease', 'intermittent inability', 'depressed mood', 'anxiety', 'suspiciousness', 'panic attacks weekly', 'sleep impairment'] },
      { percent: 50, criteria: 'Occupational and social impairment with reduced reliability and productivity due to such symptoms as: flattened affect; circumstantial, circumlocutory, or stereotyped speech; panic attacks more than once a week; difficulty in understanding complex commands; impairment of short- and long-term memory; impaired judgment; impaired abstract thinking; disturbances of motivation and mood; difficulty in establishing and maintaining effective work and social relationships.', keywords: ['reduced reliability', 'flattened affect', 'panic attacks >1/week', 'memory impairment', 'impaired judgment', 'difficulty with relationships'] },
      { percent: 70, criteria: 'Occupational and social impairment, with deficiencies in most areas, such as work, school, family relations, judgment, thinking, or mood, due to such symptoms as: suicidal ideation; obsessional rituals which interfere with routine activities; speech intermittently illogical, obscure, or irrelevant; near-continuous panic or depression affecting the ability to function independently, appropriately, and effectively; impaired impulse control; spatial disorientation; neglect of personal appearance and hygiene; difficulty in adapting to stressful circumstances; inability to establish and maintain effective relationships.', keywords: ['deficiencies in most areas', 'suicidal ideation', 'near-continuous panic/depression', 'impaired impulse control', 'neglect of hygiene', 'inability to maintain relationships'] },
      { percent: 100, criteria: 'Total occupational and social impairment, due to such symptoms as: gross impairment in thought processes or communication; persistent delusions or hallucinations; grossly inappropriate behavior; persistent danger of hurting self or others; intermittent inability to perform activities of daily living (including maintenance of minimal personal hygiene); disorientation to time or place; memory loss for names of close relatives, own occupation, or own name.', keywords: ['total impairment', 'persistent delusions', 'hallucinations', 'danger to self/others', 'cannot perform ADLs', 'disorientation'] },
    ],
    examTips: ['Describe psychotic symptoms: hallucinations, delusions', 'Document mood episodes and their frequency', 'Report impact on work and relationships', 'Describe daily functioning limitations', 'Note all hospitalizations and crisis events'],
    commonMistakes: ['Not distinguishing schizoaffective from schizophrenia or bipolar alone', 'Not documenting both psychotic and mood symptoms'],
  },
  // Anorexia Nervosa (DC 9520)
  {
    conditionId: 'anorexia-nervosa',
    conditionName: 'Eating Disorder - Anorexia Nervosa',
    diagnosticCode: '9520',
    cfrReference: '38 CFR § 4.130, DC 9520',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'A mental condition has been formally diagnosed, but symptoms are not severe enough either to interfere with occupational and social functioning or to require continuous medication.', keywords: ['diagnosed', 'no functional impairment'] },
      { percent: 10, criteria: 'Occupational and social impairment due to mild or transient symptoms which decrease work efficiency only during periods of significant stress; or, symptoms controlled by continuous medication.', keywords: ['mild symptoms', 'stress-related'] },
      { percent: 30, criteria: 'Occupational and social impairment with occasional decrease in work efficiency and intermittent periods of inability to perform occupational tasks, due to such symptoms as: depressed mood, anxiety, chronic sleep impairment, mild memory loss.', keywords: ['occasional decrease', 'depressed mood', 'anxiety'] },
      { percent: 50, criteria: 'Occupational and social impairment with reduced reliability and productivity due to such symptoms as: flattened affect, disturbances of motivation and mood, difficulty in establishing and maintaining effective work and social relationships.', keywords: ['reduced reliability', 'flattened affect', 'motivation disturbance'] },
      { percent: 70, criteria: 'Occupational and social impairment with deficiencies in most areas due to such symptoms as: suicidal ideation, near-continuous depression affecting ability to function, neglect of personal appearance and hygiene, inability to establish and maintain effective relationships.', keywords: ['deficiencies in most areas', 'suicidal ideation', 'neglect of hygiene'] },
      { percent: 100, criteria: 'Total occupational and social impairment due to such symptoms as: gross impairment in thought processes or communication, persistent danger of hurting self, intermittent inability to perform activities of daily living, disorientation, memory loss.', keywords: ['total impairment', 'danger to self', 'cannot perform ADLs'] },
    ],
    examTips: ['Document weight history and BMI', 'Describe relationship with food and body image', 'Report medical complications from the condition', 'Note any hospitalizations for refeeding'],
    commonMistakes: ['Not documenting physical health consequences separately', 'Not reporting occupational impact'],
  },
  // Bulimia Nervosa (DC 9521)
  {
    conditionId: 'bulimia-nervosa',
    conditionName: 'Eating Disorder - Bulimia Nervosa',
    diagnosticCode: '9521',
    cfrReference: '38 CFR § 4.130, DC 9521',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'A mental condition has been formally diagnosed, but symptoms are not severe enough either to interfere with occupational and social functioning or to require continuous medication.', keywords: ['diagnosed', 'no functional impairment'] },
      { percent: 10, criteria: 'Occupational and social impairment due to mild or transient symptoms which decrease work efficiency only during periods of significant stress; or, symptoms controlled by continuous medication.', keywords: ['mild symptoms', 'stress-related'] },
      { percent: 30, criteria: 'Occupational and social impairment with occasional decrease in work efficiency and intermittent periods of inability to perform occupational tasks, due to such symptoms as: depressed mood, anxiety, chronic sleep impairment.', keywords: ['occasional decrease', 'depressed mood', 'anxiety'] },
      { percent: 50, criteria: 'Occupational and social impairment with reduced reliability and productivity due to disturbances of motivation and mood, difficulty maintaining effective work and social relationships.', keywords: ['reduced reliability', 'motivation disturbance', 'difficulty with relationships'] },
      { percent: 70, criteria: 'Occupational and social impairment with deficiencies in most areas due to such symptoms as: suicidal ideation, near-continuous depression, neglect of hygiene, inability to maintain effective relationships.', keywords: ['deficiencies in most areas', 'suicidal ideation', 'neglect of hygiene'] },
      { percent: 100, criteria: 'Total occupational and social impairment due to gross impairment in thought processes, persistent danger of hurting self, inability to perform activities of daily living.', keywords: ['total impairment', 'danger to self', 'cannot perform ADLs'] },
    ],
    examTips: ['Document binge/purge frequency', 'Report dental and GI complications', 'Describe impact on social functioning and daily activities', 'Note treatment history and compliance'],
    commonMistakes: ['Not claiming dental damage separately', 'Not documenting GI complications as secondary conditions'],
  },
  // Adjustment Disorder (DC 9440)
  {
    conditionId: 'adjustment-disorder',
    conditionName: 'Adjustment Disorder',
    diagnosticCode: '9440',
    cfrReference: '38 CFR § 4.130, DC 9440',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'A mental condition has been formally diagnosed, but symptoms are not severe enough either to interfere with occupational and social functioning or to require continuous medication.', keywords: ['diagnosed', 'no functional impairment'] },
      { percent: 10, criteria: 'Occupational and social impairment due to mild or transient symptoms which decrease work efficiency only during periods of significant stress; or, symptoms controlled by continuous medication.', keywords: ['mild symptoms', 'controlled by medication'] },
      { percent: 30, criteria: 'Occupational and social impairment with occasional decrease in work efficiency and intermittent periods of inability to perform occupational tasks, due to such symptoms as: depressed mood, anxiety, suspiciousness, panic attacks (weekly or less often), chronic sleep impairment, mild memory loss.', keywords: ['occasional decrease', 'depressed mood', 'anxiety', 'panic attacks weekly'] },
      { percent: 50, criteria: 'Occupational and social impairment with reduced reliability and productivity due to such symptoms as: flattened affect; panic attacks more than once a week; difficulty understanding complex commands; impairment of short- and long-term memory; impaired judgment; disturbances of motivation and mood; difficulty establishing and maintaining effective work and social relationships.', keywords: ['reduced reliability', 'panic attacks >1/week', 'memory impairment', 'difficulty with relationships'] },
      { percent: 70, criteria: 'Occupational and social impairment, with deficiencies in most areas, due to such symptoms as: suicidal ideation; obsessional rituals; near-continuous panic or depression affecting ability to function independently; impaired impulse control; spatial disorientation; neglect of personal appearance and hygiene; difficulty adapting to stressful circumstances; inability to establish and maintain effective relationships.', keywords: ['deficiencies in most areas', 'suicidal ideation', 'near-continuous panic/depression', 'impaired impulse control'] },
      { percent: 100, criteria: 'Total occupational and social impairment, due to such symptoms as: gross impairment in thought processes or communication; persistent delusions or hallucinations; grossly inappropriate behavior; persistent danger of hurting self or others; intermittent inability to perform activities of daily living; disorientation to time or place; memory loss for names of close relatives, own occupation, or own name.', keywords: ['total impairment', 'persistent delusions', 'danger to self/others', 'cannot perform ADLs'] },
    ],
    examTips: ['Document triggering stressors and ongoing impact', 'Describe impact on work performance', 'Report social withdrawal and relationship difficulties', 'Note sleep disturbance and anxiety symptoms'],
    commonMistakes: ['Not documenting functional impairment at work', 'Not describing symptom severity during worst periods'],
  },
  // Unspecified Trauma and Stressor-Related Disorder (DC 9413)
  {
    conditionId: 'unspecified-trauma-disorder',
    conditionName: 'Unspecified Trauma and Stressor-Related Disorder',
    diagnosticCode: '9413',
    cfrReference: '38 CFR § 4.130, DC 9413',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'A mental condition has been formally diagnosed, but symptoms are not severe enough either to interfere with occupational and social functioning or to require continuous medication.', keywords: ['diagnosed', 'no functional impairment'] },
      { percent: 10, criteria: 'Occupational and social impairment due to mild or transient symptoms which decrease work efficiency only during periods of significant stress; or, symptoms controlled by continuous medication.', keywords: ['mild symptoms', 'controlled by medication'] },
      { percent: 30, criteria: 'Occupational and social impairment with occasional decrease in work efficiency and intermittent periods of inability to perform occupational tasks, due to such symptoms as: depressed mood, anxiety, suspiciousness, panic attacks (weekly or less often), chronic sleep impairment, mild memory loss.', keywords: ['occasional decrease', 'depressed mood', 'anxiety', 'panic attacks weekly'] },
      { percent: 50, criteria: 'Occupational and social impairment with reduced reliability and productivity due to such symptoms as: flattened affect; panic attacks more than once a week; difficulty understanding complex commands; memory impairment; impaired judgment; disturbances of motivation and mood; difficulty establishing and maintaining effective work and social relationships.', keywords: ['reduced reliability', 'flattened affect', 'memory impairment', 'difficulty with relationships'] },
      { percent: 70, criteria: 'Occupational and social impairment, with deficiencies in most areas, due to such symptoms as: suicidal ideation; near-continuous panic or depression affecting ability to function independently; impaired impulse control; neglect of personal appearance and hygiene; inability to establish and maintain effective relationships.', keywords: ['deficiencies in most areas', 'suicidal ideation', 'near-continuous panic/depression', 'impaired impulse control'] },
      { percent: 100, criteria: 'Total occupational and social impairment, due to such symptoms as: gross impairment in thought processes or communication; persistent delusions or hallucinations; grossly inappropriate behavior; persistent danger of hurting self or others; intermittent inability to perform activities of daily living; disorientation to time or place; memory loss.', keywords: ['total impairment', 'persistent delusions', 'danger to self/others', 'cannot perform ADLs'] },
    ],
    examTips: ['Describe the traumatic stressor(s)', 'Document all symptoms: re-experiencing, avoidance, hyperarousal', 'Report impact on occupational and social functioning', 'Note treatment history and medication regimen'],
    commonMistakes: ['Not providing detailed description of functional impairment', 'Not documenting all symptom clusters'],
  },
  // Dissociative Disorder (DC 9416)
  {
    conditionId: 'dissociative-disorder',
    conditionName: 'Dissociative Disorder',
    diagnosticCode: '9416',
    cfrReference: '38 CFR § 4.130, DC 9416',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'A mental condition has been formally diagnosed, but symptoms are not severe enough either to interfere with occupational and social functioning or to require continuous medication.', keywords: ['diagnosed', 'no functional impairment'] },
      { percent: 10, criteria: 'Occupational and social impairment due to mild or transient symptoms which decrease work efficiency only during periods of significant stress; or, symptoms controlled by continuous medication.', keywords: ['mild symptoms', 'controlled by medication'] },
      { percent: 30, criteria: 'Occupational and social impairment with occasional decrease in work efficiency and intermittent periods of inability to perform occupational tasks, due to dissociative episodes, depressed mood, anxiety, chronic sleep impairment.', keywords: ['occasional decrease', 'dissociative episodes', 'depressed mood', 'anxiety'] },
      { percent: 50, criteria: 'Occupational and social impairment with reduced reliability and productivity due to frequent dissociative episodes, memory gaps, disturbances of motivation and mood, difficulty establishing and maintaining effective relationships.', keywords: ['reduced reliability', 'frequent dissociation', 'memory gaps', 'difficulty with relationships'] },
      { percent: 70, criteria: 'Occupational and social impairment, with deficiencies in most areas, due to severe dissociative episodes, near-continuous depression affecting ability to function, impaired impulse control, inability to establish and maintain effective relationships.', keywords: ['deficiencies in most areas', 'severe dissociation', 'near-continuous depression', 'impaired impulse control'] },
      { percent: 100, criteria: 'Total occupational and social impairment, due to persistent dissociative states, gross impairment in thought processes, persistent danger of hurting self or others, intermittent inability to perform activities of daily living.', keywords: ['total impairment', 'persistent dissociation', 'danger to self/others', 'cannot perform ADLs'] },
    ],
    examTips: ['Document frequency and duration of dissociative episodes', 'Describe memory gaps and lost time', 'Report impact on work safety and daily functioning', 'Note depersonalization and derealization symptoms'],
    commonMistakes: ['Not documenting dissociative episode frequency', 'Not describing functional impact during episodes'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL RESPIRATORY — 38 CFR § 4.97
  // ═══════════════════════════════════════════════════════════════════════════

  // Pulmonary Embolism (DC 6817)
  {
    conditionId: 'pulmonary-embolism',
    conditionName: 'Pulmonary Embolism',
    diagnosticCode: '6817',
    cfrReference: '38 CFR § 4.97, DC 6817',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 30, criteria: 'Symptomatic, following resolution of acute pulmonary embolism.', keywords: ['symptomatic', 'resolved PE', 'residual symptoms'] },
      { percent: 60, criteria: 'Chronic pulmonary thromboembolism requiring anticoagulant therapy; or, following inferior vena cava surgery without evidence of pulmonary hypertension or right ventricular dysfunction.', keywords: ['chronic', 'anticoagulant therapy', 'IVC surgery'] },
      { percent: 100, criteria: 'Primary pulmonary hypertension; or, chronic pulmonary thromboembolism with evidence of pulmonary hypertension, right ventricular hypertrophy, or cor pulmonale; or, pulmonary hypertension following other obstructive disease of pulmonary arteries or veins with evidence of right ventricular hypertrophy.', keywords: ['pulmonary hypertension', 'right ventricular hypertrophy', 'cor pulmonale'] },
    ],
    examTips: ['Document all imaging studies showing PE', 'Report current anticoagulant medication', 'Describe exercise tolerance and dyspnea on exertion', 'Note any right heart catheterization or echocardiogram results'],
    commonMistakes: ['Not documenting ongoing symptoms after acute PE resolves', 'Not claiming secondary conditions from anticoagulant therapy'],
  },
  // Restrictive Lung Disease (DC 6844)
  {
    conditionId: 'restrictive-lung-disease',
    conditionName: 'Restrictive Lung Disease',
    diagnosticCode: '6844',
    cfrReference: '38 CFR § 4.97, DC 6844',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'FEV-1 of 71 to 80 percent predicted; or, FEV-1/FVC of 71 to 80 percent; or, DLCO (SB) 66 to 80 percent predicted.', keywords: ['FEV-1 71-80%', 'FEV-1/FVC 71-80%', 'DLCO 66-80%'] },
      { percent: 30, criteria: 'FEV-1 of 56 to 70 percent predicted; or, FEV-1/FVC of 56 to 70 percent; or, DLCO (SB) 56 to 65 percent predicted.', keywords: ['FEV-1 56-70%', 'FEV-1/FVC 56-70%', 'DLCO 56-65%'] },
      { percent: 60, criteria: 'FEV-1 of 40 to 55 percent predicted; or, FEV-1/FVC of 40 to 55 percent; or, DLCO (SB) of 40 to 55 percent predicted; or, maximum oxygen consumption of 15 to 20 ml/kg/min (with cardiorespiratory limit).', keywords: ['FEV-1 40-55%', 'DLCO 40-55%', 'VO2 max 15-20'] },
      { percent: 100, criteria: 'FEV-1 less than 40 percent of predicted value; or, FEV-1/FVC less than 40 percent; or, DLCO (SB) less than 40 percent predicted; or, maximum exercise capacity less than 15 ml/kg/min oxygen consumption (with cardiac or respiratory limitation); or, cor pulmonale (right heart failure); or, right ventricular hypertrophy; or, pulmonary hypertension (shown by Echo or cardiac catheterization); or, episode(s) of acute respiratory failure; or, requires outpatient oxygen therapy.', keywords: ['FEV-1 <40%', 'DLCO <40%', 'cor pulmonale', 'oxygen therapy', 'respiratory failure'] },
    ],
    examTips: ['Obtain current PFT results (FEV-1, FVC, DLCO)', 'Report exercise tolerance and dyspnea level', 'Document any supplemental oxygen use', 'Note hospitalizations for respiratory failure'],
    commonMistakes: ['Not obtaining pre- and post-bronchodilator PFT results', 'Not documenting need for supplemental oxygen'],
  },
  // Asbestosis (DC 6833)
  {
    conditionId: 'asbestosis',
    conditionName: 'Asbestosis',
    diagnosticCode: '6833',
    cfrReference: '38 CFR § 4.97, DC 6833',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'FEV-1 of 71 to 80 percent predicted; or, FEV-1/FVC of 71 to 80 percent; or, DLCO (SB) 66 to 80 percent predicted.', keywords: ['FEV-1 71-80%', 'FEV-1/FVC 71-80%', 'DLCO 66-80%'] },
      { percent: 30, criteria: 'FEV-1 of 56 to 70 percent predicted; or, FEV-1/FVC of 56 to 70 percent; or, DLCO (SB) 56 to 65 percent predicted.', keywords: ['FEV-1 56-70%', 'DLCO 56-65%'] },
      { percent: 60, criteria: 'FEV-1 of 40 to 55 percent predicted; or, FEV-1/FVC of 40 to 55 percent; or, DLCO (SB) of 40 to 55 percent predicted; or, maximum oxygen consumption of 15 to 20 ml/kg/min.', keywords: ['FEV-1 40-55%', 'DLCO 40-55%', 'VO2 max 15-20'] },
      { percent: 100, criteria: 'FEV-1 less than 40 percent predicted; or, FEV-1/FVC less than 40 percent; or, DLCO (SB) less than 40 percent predicted; or, maximum exercise capacity less than 15 ml/kg/min oxygen consumption; or, cor pulmonale; or, right ventricular hypertrophy; or, pulmonary hypertension; or, episode(s) of acute respiratory failure; or, requires outpatient oxygen therapy.', keywords: ['FEV-1 <40%', 'DLCO <40%', 'cor pulmonale', 'oxygen therapy'] },
    ],
    examTips: ['Document military asbestos exposure history', 'Obtain current PFT with DLCO', 'Provide chest X-ray or CT showing pleural plaques', 'Report progressive dyspnea on exertion'],
    commonMistakes: ['Not documenting asbestos exposure during military service', 'Not obtaining DLCO testing'],
  },
  // Pulmonary Hypertension (DC 6817)
  {
    conditionId: 'pulmonary-hypertension',
    conditionName: 'Pulmonary Hypertension',
    diagnosticCode: '6817',
    cfrReference: '38 CFR § 4.97, DC 6817',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 30, criteria: 'Symptomatic pulmonary hypertension following resolution of acute embolism or with mild functional limitation.', keywords: ['symptomatic', 'mild limitation'] },
      { percent: 60, criteria: 'Chronic condition requiring anticoagulant therapy or chronic medication management; or, moderate functional limitation with dyspnea on moderate exertion.', keywords: ['chronic', 'anticoagulant', 'moderate limitation', 'dyspnea on exertion'] },
      { percent: 100, criteria: 'Primary pulmonary hypertension with evidence of right ventricular hypertrophy or cor pulmonale; or, requires oxygen therapy; or, severe functional limitation.', keywords: ['right ventricular hypertrophy', 'cor pulmonale', 'oxygen therapy', 'severe limitation'] },
    ],
    examTips: ['Provide right heart catheterization or echocardiogram results', 'Document functional capacity and WHO functional class', 'Report all medications including pulmonary vasodilators', 'Describe exercise limitations and dyspnea level'],
    commonMistakes: ['Not providing objective hemodynamic measurements', 'Not documenting functional class deterioration over time'],
  },
  // Chronic Sinusitis (DC 6510) - additional specific entry
  {
    conditionId: 'chronic-sinusitis',
    conditionName: 'Chronic Sinusitis (Pansinusitis/Maxillary/Frontal)',
    diagnosticCode: '6510',
    cfrReference: '38 CFR § 4.97, DC 6510',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Detected by X-ray only with no symptoms.', keywords: ['X-ray only', 'no symptoms', 'incidental finding'] },
      { percent: 10, criteria: 'One or two incapacitating episodes per year of sinusitis requiring prolonged (4-6 weeks) antibiotic treatment; or, three to six non-incapacitating episodes per year characterized by headaches, pain, and purulent discharge or crusting.', keywords: ['1-2 incapacitating episodes', 'prolonged antibiotics', '3-6 non-incapacitating', 'purulent discharge'] },
      { percent: 30, criteria: 'Three or more incapacitating episodes per year of sinusitis requiring prolonged (4-6 weeks) antibiotic treatment; or, more than six non-incapacitating episodes per year characterized by headaches, pain, and purulent discharge or crusting.', keywords: ['3+ incapacitating episodes', '6+ non-incapacitating', 'prolonged antibiotics'] },
      { percent: 50, criteria: 'Following radical surgery with chronic osteomyelitis; or, near constant sinusitis characterized by headaches, pain and tenderness of affected sinus, and purulent discharge or crusting after repeated surgeries.', keywords: ['radical surgery', 'chronic osteomyelitis', 'near constant', 'repeated surgeries'] },
    ],
    examTips: ['Keep log of sinus infections with dates and antibiotic prescriptions', 'Document incapacitating episodes requiring bed rest', 'Report CT scan findings showing chronic sinus disease', 'Describe headache frequency and purulent drainage'],
    commonMistakes: ['Not tracking episode frequency', 'Not obtaining CT scan evidence', 'Not documenting antibiotic treatment duration'],
  },
  // Allergic Rhinitis (DC 6522)
  {
    conditionId: 'allergic-rhinitis',
    conditionName: 'Allergic Rhinitis',
    diagnosticCode: '6522',
    cfrReference: '38 CFR § 4.97, DC 6522',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Without polyps, but with greater than 50-percent obstruction of nasal passage on both sides or complete obstruction on one side.', keywords: ['50% obstruction both sides', 'complete obstruction one side', 'no polyps'] },
      { percent: 30, criteria: 'With polyps.', keywords: ['nasal polyps', 'polyposis'] },
    ],
    examTips: ['Report nasal obstruction severity', 'Document polyp findings on exam or imaging', 'Describe impact on breathing, sleep, and daily life', 'Note medication usage including nasal steroids'],
    commonMistakes: ['Not documenting nasal obstruction percentage', 'Not claiming secondary sleep disturbance or sinusitis'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL CARDIOVASCULAR — 38 CFR § 4.104
  // ═══════════════════════════════════════════════════════════════════════════

  // Atrial Fibrillation (DC 7010)
  {
    conditionId: 'atrial-fibrillation',
    conditionName: 'Atrial Fibrillation',
    diagnosticCode: '7010',
    cfrReference: '38 CFR § 4.104, DC 7010',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Permanent atrial fibrillation (lone atrial fibrillation), or; one to four episodes per year of paroxysmal atrial fibrillation or other supraventricular tachycardia documented by ECG or Holter monitor.', keywords: ['permanent AFib', 'paroxysmal 1-4/year', 'ECG documented'] },
      { percent: 30, criteria: 'Paroxysmal atrial fibrillation or other supraventricular tachycardia, with more than four episodes per year documented by ECG or Holter monitor.', keywords: ['paroxysmal >4/year', 'ECG documented', 'frequent episodes'] },
      { percent: 100, criteria: 'Rate under DC 7011 (ventricular arrhythmias) when there is sustained ventricular arrhythmia, or under the General Rating Formula for Heart Disease when workload capacity is reduced.', keywords: ['sustained arrhythmia', 'workload reduction', 'heart failure'] },
    ],
    examTips: ['Provide ECG and Holter monitor documentation of episodes', 'Report exercise tolerance in METs', 'Document anticoagulant and rate/rhythm control medications', 'Describe symptoms: palpitations, dizziness, syncope, fatigue'],
    commonMistakes: ['Not having ECG documentation of AFib episodes', 'Not claiming secondary conditions from anticoagulant therapy', 'Not reporting functional capacity in METs'],
  },
  // Deep Vein Thrombosis (DC 7121)
  {
    conditionId: 'deep-vein-thrombosis',
    conditionName: 'Deep Vein Thrombosis (DVT)',
    diagnosticCode: '7121',
    cfrReference: '38 CFR § 4.104, DC 7121',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Intermittent edema of extremity or aching and fatigue in leg after prolonged standing or walking, with symptoms relieved by elevation of extremity or compression hosiery.', keywords: ['intermittent edema', 'aching', 'fatigue', 'relieved by elevation'] },
      { percent: 20, criteria: 'Persistent edema, incompletely relieved by elevation of extremity, with or without beginning stasis pigmentation or eczema.', keywords: ['persistent edema', 'incompletely relieved', 'stasis pigmentation'] },
      { percent: 40, criteria: 'Persistent edema and stasis pigmentation or eczema, with or without intermittent ulceration.', keywords: ['persistent edema', 'stasis pigmentation', 'eczema', 'intermittent ulceration'] },
      { percent: 60, criteria: 'Persistent edema or subcutaneous induration, stasis pigmentation or eczema, and persistent ulceration.', keywords: ['persistent edema', 'subcutaneous induration', 'persistent ulceration'] },
      { percent: 100, criteria: 'Massive board-like edema with constant pain at rest; or, ischemic limb pain at rest, and; either deep ischemic ulcers or ankle/brachial index of 0.4 or less.', keywords: ['massive edema', 'constant pain at rest', 'deep ischemic ulcers', 'ABI 0.4 or less'] },
    ],
    examTips: ['Document edema measurements and location', 'Photograph stasis changes and ulcerations', 'Report use of compression stockings', 'Describe impact on standing and walking tolerance'],
    commonMistakes: ['Not documenting post-thrombotic syndrome symptoms', 'Not claiming bilateral DVT separately for each extremity'],
  },
  // Aortic Aneurysm (DC 7110)
  {
    conditionId: 'aortic-aneurysm',
    conditionName: 'Aortic Aneurysm',
    diagnosticCode: '7110',
    cfrReference: '38 CFR § 4.104, DC 7110',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 60, criteria: 'Precluding exertion; or, if repaired, residuals of surgical repair (e.g., bypass graft) with exercise workload of 4-7 METs.', keywords: ['precluding exertion', 'surgical repair', '4-7 METs'] },
      { percent: 100, criteria: 'If 5 cm or larger in diameter; or, if symptomatic; or, for an indefinite period from date of hospital admission for surgical correction (including any type of graft insertion). Evaluate residuals separately, under the appropriate DC, 6 months or more following discharge from the hospital.', keywords: ['5 cm+', 'symptomatic', 'surgical correction', 'graft'] },
    ],
    examTips: ['Document aneurysm size on imaging', 'Report surgical history and type of repair', 'Provide exercise tolerance in METs', 'Describe any residual symptoms'],
    commonMistakes: ['Not providing current imaging measurements', 'Not claiming surgical scar or residuals separately'],
  },
  // Cardiomyopathy (DC 7020)
  {
    conditionId: 'cardiomyopathy',
    conditionName: 'Cardiomyopathy',
    diagnosticCode: '7020',
    cfrReference: '38 CFR § 4.104, DC 7020',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Workload of greater than 7 METs but not greater than 10 METs results in dyspnea, fatigue, angina, dizziness, or syncope; or, continuous medication required.', keywords: ['7-10 METs', 'continuous medication', 'dyspnea on exertion'] },
      { percent: 30, criteria: 'Workload of greater than 5 METs but not greater than 7 METs results in dyspnea, fatigue, angina, dizziness, or syncope; or, evidence of cardiac hypertrophy or dilatation on ECG, echocardiogram, or X-ray.', keywords: ['5-7 METs', 'cardiac hypertrophy', 'cardiac dilatation'] },
      { percent: 60, criteria: 'More than one episode of acute congestive heart failure in the past year; or, workload of greater than 3 METs but not greater than 5 METs results in dyspnea, fatigue, angina, dizziness, or syncope; or, left ventricular dysfunction with an ejection fraction of 30 to 50 percent.', keywords: ['CHF episodes', '3-5 METs', 'EF 30-50%'] },
      { percent: 100, criteria: 'Chronic congestive heart failure; or, workload of 3 METs or less results in dyspnea, fatigue, angina, dizziness, or syncope; or, left ventricular dysfunction with an ejection fraction of less than 30 percent.', keywords: ['chronic CHF', '≤3 METs', 'EF <30%'] },
    ],
    examTips: ['Provide echocardiogram with ejection fraction', 'Report exercise tolerance in METs (stress test)', 'Document all cardiac medications', 'Describe daily activity limitations'],
    commonMistakes: ['Not providing ejection fraction measurement', 'Not obtaining METs testing', 'Not documenting CHF episodes'],
  },
  // Pericarditis (DC 7002)
  {
    conditionId: 'pericarditis',
    conditionName: 'Pericarditis',
    diagnosticCode: '7002',
    cfrReference: '38 CFR § 4.104, DC 7002',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Workload of greater than 7 METs but not greater than 10 METs results in dyspnea, fatigue, angina, dizziness, or syncope; or, continuous medication required.', keywords: ['7-10 METs', 'continuous medication'] },
      { percent: 30, criteria: 'Workload of greater than 5 METs but not greater than 7 METs results in dyspnea, fatigue, angina, dizziness, or syncope; or, evidence of cardiac hypertrophy or dilatation on ECG, echocardiogram, or X-ray.', keywords: ['5-7 METs', 'cardiac hypertrophy'] },
      { percent: 60, criteria: 'More than one episode of acute congestive heart failure in the past year; or, workload of greater than 3 METs but not greater than 5 METs results in dyspnea, fatigue, angina, dizziness, or syncope; or, left ventricular dysfunction with an ejection fraction of 30 to 50 percent.', keywords: ['CHF episodes', '3-5 METs', 'EF 30-50%'] },
      { percent: 100, criteria: 'During and for 3 months following active infection with cardiac involvement; or, chronic congestive heart failure; or, workload of 3 METs or less; or, left ventricular dysfunction with an ejection fraction of less than 30 percent.', keywords: ['active infection', 'chronic CHF', '≤3 METs', 'EF <30%'] },
    ],
    examTips: ['Document episodes of pericarditis and recurrence', 'Provide echocardiogram results', 'Report METs from stress testing', 'Describe chest pain episodes and triggers'],
    commonMistakes: ['Not documenting recurrent episodes', 'Not obtaining stress test for METs evaluation'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL DIGESTIVE — 38 CFR § 4.114
  // ═══════════════════════════════════════════════════════════════════════════

  // Ulcerative Colitis (DC 7323)
  {
    conditionId: 'ulcerative-colitis',
    conditionName: 'Ulcerative Colitis',
    diagnosticCode: '7323',
    cfrReference: '38 CFR § 4.114, DC 7323',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Moderate; with infrequent exacerbations.', keywords: ['moderate', 'infrequent exacerbations'] },
      { percent: 30, criteria: 'Moderately severe; with frequent exacerbations.', keywords: ['moderately severe', 'frequent exacerbations'] },
      { percent: 60, criteria: 'Severe; with numerous attacks a year and malnutrition, the health only fair during remissions.', keywords: ['severe', 'numerous attacks', 'malnutrition', 'fair health in remission'] },
      { percent: 100, criteria: 'Pronounced; resulting in marked malnutrition, anemia, and general debility, or with serious complication as liver abscess.', keywords: ['pronounced', 'marked malnutrition', 'anemia', 'general debility', 'liver abscess'] },
    ],
    examTips: ['Document flare frequency and duration', 'Report colonoscopy findings', 'Describe dietary restrictions and weight changes', 'Note all medications including biologics and immunosuppressants', 'Report any hospitalizations'],
    commonMistakes: ['Not documenting flare frequency', 'Not reporting weight loss and nutritional deficiency', 'Not claiming medication side effects separately'],
  },
  // Cirrhosis (DC 7312)
  {
    conditionId: 'cirrhosis',
    conditionName: 'Cirrhosis of the Liver',
    diagnosticCode: '7312',
    cfrReference: '38 CFR § 4.114, DC 7312',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Symptoms such as weakness, anorexia, abdominal pain, and malaise that are intermittent, occurring several times a year but of relatively brief duration; or, minor weight loss and hepatomegaly; or, for a period of incapacity (with symptoms described above) of at least 1 week, but less than 2 weeks, during the past 12-month period.', keywords: ['intermittent symptoms', 'minor weight loss', 'hepatomegaly'] },
      { percent: 30, criteria: 'Symptoms described above occurring daily; or, weight loss and hepatomegaly; or, incapacity having a total duration of at least 2 weeks, but less than 4 weeks, during the past 12 months.', keywords: ['daily symptoms', 'weight loss', 'hepatomegaly', '2-4 weeks incapacity'] },
      { percent: 50, criteria: 'Symptoms described above that are nearly constant; or, substantial weight loss and hepatomegaly; or, incapacity having a total duration of at least 4 weeks, but less than 6 weeks, during the past 12 months.', keywords: ['nearly constant', 'substantial weight loss', '4-6 weeks incapacity'] },
      { percent: 70, criteria: 'History of one episode of ascites, hepatic encephalopathy, or hemorrhage from varices or portal gastropathy (erosive gastritis); or, incapacity having a total duration of at least 6 weeks during the past 12 months (but not occurring constantly).', keywords: ['ascites episode', 'hepatic encephalopathy', 'variceal hemorrhage', '6+ weeks incapacity'] },
      { percent: 100, criteria: 'Generalized weakness, substantial weight loss, and persistent jaundice; or, with one of the following refractory to treatment: ascites, hepatic encephalopathy, hemorrhage from varices or portal gastropathy.', keywords: ['generalized weakness', 'persistent jaundice', 'refractory ascites', 'refractory encephalopathy'] },
    ],
    examTips: ['Document liver function test trends', 'Report imaging showing cirrhotic changes', 'Describe complications: ascites, encephalopathy, varices', 'Note all medications and dietary restrictions'],
    commonMistakes: ['Not documenting episodes of decompensation', 'Not tracking weight loss over time'],
  },
  // Chronic Pancreatitis (DC 7347)
  {
    conditionId: 'chronic-pancreatitis',
    conditionName: 'Chronic Pancreatitis',
    diagnosticCode: '7347',
    cfrReference: '38 CFR § 4.114, DC 7347',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'With at least one recurring episode of typical severe abdominal pain in the past year.', keywords: ['recurring episode', 'severe abdominal pain', 'at least 1/year'] },
      { percent: 30, criteria: 'With 2 or more recurring episodes of typical severe abdominal pain in the past year, or with steatorrhea with or without diarrhea.', keywords: ['2+ episodes', 'severe pain', 'steatorrhea', 'diarrhea'] },
      { percent: 60, criteria: 'Frequent attacks of abdominal pain, loss of normal body weight and other findings showing continuing pancreatic insufficiency between acute attacks.', keywords: ['frequent attacks', 'weight loss', 'pancreatic insufficiency', 'enzyme deficiency'] },
      { percent: 100, criteria: 'Frequently recurrent disabling attacks of abdominal pain with few pain-free intermissions and with steatorrhea, malabsorption, diarrhea, and severe malnutrition.', keywords: ['disabling attacks', 'few pain-free periods', 'severe malnutrition', 'malabsorption'] },
    ],
    examTips: ['Document episodes of pancreatitis requiring hospitalization', 'Report enzyme replacement therapy usage', 'Describe weight loss and nutritional status', 'Note imaging showing chronic pancreatic changes'],
    commonMistakes: ['Not documenting episode frequency and severity', 'Not reporting steatorrhea or malabsorption symptoms'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL ENTRIES — Remaining Conditions
  // ═══════════════════════════════════════════════════════════════════════════

  // Cervical Radiculopathy - lateralized (DC 8510)
  {
    conditionId: 'cervical-radiculopathy-right',
    conditionName: 'Cervical Radiculopathy - Right Upper Extremity',
    diagnosticCode: '8510',
    cfrReference: '38 CFR § 4.124a, DC 8510',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'Mild incomplete paralysis of the upper radicular group (5th and 6th cervicals).', keywords: ['mild', 'incomplete paralysis', 'C5-C6', 'intermittent symptoms'] },
      { percent: 40, criteria: 'Moderate incomplete paralysis of the upper radicular group - major extremity.', keywords: ['moderate', 'major', 'frequent numbness', 'weakness'] },
      { percent: 50, criteria: 'Severe incomplete paralysis of the upper radicular group - major extremity.', keywords: ['severe', 'major', 'significant weakness', 'muscle atrophy'] },
      { percent: 70, criteria: 'Complete paralysis of the upper radicular group - major extremity. All shoulder and elbow movements lost or severely affected, hand and wrist movements not affected.', keywords: ['complete paralysis', 'major', 'shoulder/elbow movements lost'] },
    ],
    examTips: ['Specify dominant arm', 'Document dermatomal distribution of symptoms', 'Provide EMG/NCS results', 'Report muscle strength grading by nerve root level'],
    commonMistakes: ['Not specifying dominant extremity', 'Not obtaining EMG/NCS documentation', 'Not distinguishing from peripheral neuropathy'],
  },
  {
    conditionId: 'cervical-radiculopathy-left',
    conditionName: 'Cervical Radiculopathy - Left Upper Extremity',
    diagnosticCode: '8510',
    cfrReference: '38 CFR § 4.124a, DC 8510',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'Mild incomplete paralysis of the upper radicular group (5th and 6th cervicals).', keywords: ['mild', 'incomplete paralysis', 'C5-C6'] },
      { percent: 30, criteria: 'Moderate incomplete paralysis of the upper radicular group - minor extremity.', keywords: ['moderate', 'minor', 'frequent numbness'] },
      { percent: 40, criteria: 'Severe incomplete paralysis of the upper radicular group - minor extremity.', keywords: ['severe', 'minor', 'significant weakness'] },
      { percent: 60, criteria: 'Complete paralysis of the upper radicular group - minor extremity.', keywords: ['complete paralysis', 'minor', 'shoulder/elbow movements lost'] },
    ],
    examTips: ['Specify dominant arm', 'Document dermatomal distribution of symptoms', 'Provide EMG/NCS results'],
    commonMistakes: ['Not specifying dominant extremity', 'Not obtaining EMG/NCS documentation'],
  },
  // Lumbar Radiculopathy - lateralized (DC 8520)
  {
    conditionId: 'lumbar-radiculopathy-right',
    conditionName: 'Lumbar Radiculopathy - Right Lower Extremity',
    diagnosticCode: '8520',
    cfrReference: '38 CFR § 4.124a, DC 8520',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the sciatic nerve.', keywords: ['mild', 'incomplete paralysis', 'intermittent shooting pain'] },
      { percent: 20, criteria: 'Moderate incomplete paralysis of the sciatic nerve.', keywords: ['moderate', 'incomplete paralysis', 'frequent numbness', 'reduced reflexes'] },
      { percent: 40, criteria: 'Moderately severe incomplete paralysis of the sciatic nerve.', keywords: ['moderately severe', 'muscle weakness', 'significant sensory loss'] },
      { percent: 60, criteria: 'Severe incomplete paralysis with marked muscular atrophy.', keywords: ['severe', 'marked atrophy', 'foot drop'] },
      { percent: 80, criteria: 'Complete paralysis: foot dangles and drops, no active movement below knee, flexion of knee weakened or lost.', keywords: ['complete paralysis', 'foot drop', 'no movement below knee'] },
    ],
    examTips: ['Document specific dermatome affected (L4, L5, S1)', 'Report muscle strength testing results', 'Describe shooting/radiating pain pattern', 'Provide EMG/NCS results'],
    commonMistakes: ['Not claiming separately from spinal condition', 'Not providing EMG/NCS results'],
  },
  {
    conditionId: 'lumbar-radiculopathy-left',
    conditionName: 'Lumbar Radiculopathy - Left Lower Extremity',
    diagnosticCode: '8520',
    cfrReference: '38 CFR § 4.124a, DC 8520',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the sciatic nerve.', keywords: ['mild', 'incomplete paralysis', 'intermittent shooting pain'] },
      { percent: 20, criteria: 'Moderate incomplete paralysis of the sciatic nerve.', keywords: ['moderate', 'incomplete paralysis', 'frequent numbness'] },
      { percent: 40, criteria: 'Moderately severe incomplete paralysis of the sciatic nerve.', keywords: ['moderately severe', 'muscle weakness', 'significant sensory loss'] },
      { percent: 60, criteria: 'Severe incomplete paralysis with marked muscular atrophy.', keywords: ['severe', 'marked atrophy', 'foot drop'] },
      { percent: 80, criteria: 'Complete paralysis: foot dangles and drops, no active movement below knee, flexion of knee weakened or lost.', keywords: ['complete paralysis', 'foot drop', 'no movement below knee'] },
    ],
    examTips: ['Document specific dermatome affected', 'Report muscle strength testing results', 'Describe shooting/radiating pain pattern', 'Provide EMG/NCS results'],
    commonMistakes: ['Not claiming separately from spinal condition', 'Not providing EMG/NCS results'],
  },
  // Parkinson's Disease (DC 8004) - more detailed entry
  {
    conditionId: 'parkinsons-disease',
    conditionName: "Parkinson's Disease",
    diagnosticCode: '8004',
    cfrReference: '38 CFR § 4.124a, DC 8004',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 30, criteria: 'Minimum rating for ascertainable residuals of Parkinson\'s disease.', keywords: ['minimum rating', 'ascertainable residuals', 'tremor', 'rigidity'] },
      { percent: 60, criteria: 'Moderately severe disability with significant motor impairment, balance problems, and functional limitations.', keywords: ['moderately severe', 'motor impairment', 'balance problems', 'gait disturbance'] },
      { percent: 100, criteria: 'Complete paralysis or severe disability with pronounced motor impairment affecting multiple extremities, significant cognitive decline, or inability to perform activities of daily living.', keywords: ['severe disability', 'multiple extremities', 'cognitive decline', 'cannot perform ADLs'] },
    ],
    examTips: ['Document tremor severity and distribution', 'Report rigidity and bradykinesia findings', 'Describe gait and balance problems', 'Note cognitive changes and speech difficulties', 'Rate each affected extremity separately for additional compensation'],
    commonMistakes: ['Not claiming separate ratings for each affected extremity', 'Not documenting cognitive and speech symptoms', 'Not rating secondary depression or anxiety separately'],
  },
  // Multiple Sclerosis - detailed entry (DC 8018)
  {
    conditionId: 'multiple-sclerosis-detailed',
    conditionName: 'Multiple Sclerosis (MS)',
    diagnosticCode: '8018',
    cfrReference: '38 CFR § 4.124a, DC 8018',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 30, criteria: 'Minimum rating for multiple sclerosis.', keywords: ['minimum rating', 'diagnosed MS'] },
      { percent: 60, criteria: 'Moderately severe disability with significant neurological deficits affecting mobility, coordination, or vision.', keywords: ['moderately severe', 'neurological deficits', 'mobility affected', 'coordination problems'] },
      { percent: 100, criteria: 'Pronounced disability; or, where there are special monthly compensation considerations.', keywords: ['pronounced', 'severe disability', 'wheelchair dependent', 'significant cognitive decline'] },
    ],
    examTips: ['Document all neurological deficits by body system', 'Report MRI findings showing lesion burden', 'Describe relapse frequency and recovery', 'Note disease-modifying therapy and side effects', 'Rate each manifestation separately: vision, bladder, bowel, extremities'],
    commonMistakes: ['Not claiming separate ratings for each MS manifestation', 'Not documenting cognitive fatigue and its functional impact', 'Not rating bladder and bowel dysfunction separately'],
  },
  // Vertigo/Vestibular Disorder (DC 6204)
  {
    conditionId: 'vertigo',
    conditionName: 'Vertigo / Peripheral Vestibular Disorder',
    diagnosticCode: '6204',
    cfrReference: '38 CFR § 4.87, DC 6204',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Occasional dizziness.', keywords: ['occasional dizziness', 'intermittent vertigo'] },
      { percent: 30, criteria: 'Dizziness and occasional staggering.', keywords: ['dizziness', 'occasional staggering', 'balance problems', 'unsteady gait'] },
    ],
    examTips: ['Document vertigo episode frequency and duration', 'Describe impact on driving and work', 'Report associated nausea and vomiting', 'Note fall history due to dizziness', 'Provide vestibular function test results'],
    commonMistakes: ['Not documenting staggering or fall episodes', 'Not connecting to secondary anxiety or depression from vertigo'],
  },
  // Trigeminal Neuralgia - detailed (DC 8205)
  {
    conditionId: 'trigeminal-neuralgia-detailed',
    conditionName: 'Trigeminal Neuralgia (Tic Douloureux)',
    diagnosticCode: '8205',
    cfrReference: '38 CFR § 4.124a, DC 8205',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Moderate incomplete paralysis of the fifth (trigeminal) cranial nerve.', keywords: ['moderate', 'incomplete paralysis', 'intermittent pain', 'trigeminal'] },
      { percent: 30, criteria: 'Severe incomplete paralysis of the fifth cranial nerve.', keywords: ['severe', 'incomplete paralysis', 'frequent severe pain'] },
      { percent: 50, criteria: 'Complete paralysis of the fifth cranial nerve.', keywords: ['complete paralysis', 'constant pain', 'sensory loss'] },
    ],
    examTips: ['Document pain frequency, intensity, and triggers', 'Describe which trigeminal branch is affected (V1, V2, V3)', 'Report medication regimen and effectiveness', 'Note impact on eating, speaking, and daily activities'],
    commonMistakes: ['Not documenting pain triggers', 'Not reporting impact on eating and nutrition'],
  },
  // Chronic Fatigue Syndrome (DC 6354) - additional entry
  {
    conditionId: 'chronic-fatigue-syndrome',
    conditionName: 'Chronic Fatigue Syndrome (CFS/ME)',
    diagnosticCode: '6354',
    cfrReference: '38 CFR § 4.88b, DC 6354',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Signs and symptoms of CFS that wax and wane but result in periods of incapacitation of at least one but less than two weeks total duration per year, or; symptoms controlled by continuous medication.', keywords: ['wax and wane', '1-2 weeks incapacity/year', 'controlled by medication'] },
      { percent: 20, criteria: 'Signs and symptoms of CFS that are nearly constant and restrict routine daily activities by less than 25 percent of the pre-illness level, or; which wax and wane, resulting in periods of incapacitation of at least two but less than four weeks total duration per year.', keywords: ['nearly constant', '<25% restriction', '2-4 weeks incapacity'] },
      { percent: 40, criteria: 'Signs and symptoms of CFS that are nearly constant and restrict routine daily activities to 50 to 75 percent of the pre-illness level, or; which wax and wane, resulting in periods of incapacitation of at least four but less than six weeks total duration per year.', keywords: ['50-75% restriction', '4-6 weeks incapacity'] },
      { percent: 60, criteria: 'Signs and symptoms of CFS that are nearly constant and restrict routine daily activities to less than 50 percent of the pre-illness level, or; which wax and wane, resulting in periods of incapacitation of at least six weeks total duration per year.', keywords: ['<50% restriction', '6+ weeks incapacity', 'nearly constant'] },
      { percent: 100, criteria: 'Signs and symptoms of CFS that are nearly constant and so severe as to restrict routine daily activities almost completely and which may occasionally preclude self-care.', keywords: ['almost completely restricted', 'nearly constant', 'precludes self-care'] },
    ],
    examTips: ['Document pre-illness activity level for comparison', 'Keep a daily activity log showing limitations', 'Report all symptoms: fatigue, cognitive issues, post-exertional malaise, unrefreshing sleep', 'Note periods of incapacitation with dates'],
    commonMistakes: ['Not documenting pre-illness baseline activity level', 'Not tracking incapacitation periods', 'Not describing post-exertional malaise specifically'],
  },
  // Fibromyalgia - detailed (DC 5025)
  {
    conditionId: 'fibromyalgia-detailed',
    conditionName: 'Fibromyalgia',
    diagnosticCode: '5025',
    cfrReference: '38 CFR § 4.71a, DC 5025',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Fibromyalgia that requires continuous medication for control.', keywords: ['continuous medication', 'controlled symptoms'] },
      { percent: 20, criteria: 'Fibromyalgia that is episodic, with exacerbations often precipitated by environmental or emotional stress or by overexertion, but that are present more than one-third of the time.', keywords: ['episodic', 'exacerbations >1/3 of time', 'stress-precipitated'] },
      { percent: 40, criteria: 'Fibromyalgia that is constant, or nearly so, and refractory to therapy.', keywords: ['constant', 'refractory to therapy', 'widespread pain', 'fatigue'] },
    ],
    examTips: ['Document widespread pain in all four quadrants', 'Report tender point examination findings', 'Describe sleep disturbance, fatigue, and cognitive issues ("fibro fog")', 'Note all medications tried and their effectiveness'],
    commonMistakes: ['Not documenting that condition is refractory to treatment', 'Not reporting cognitive symptoms', 'Not claiming secondary conditions like depression or sleep disturbance'],
  },
  // Gout - detailed (DC 5017)
  {
    conditionId: 'gout-detailed',
    conditionName: 'Gout',
    diagnosticCode: '5017',
    cfrReference: '38 CFR § 4.71a, DC 5017',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'One or two exacerbations a year in a well-established diagnosis.', keywords: ['1-2 exacerbations/year', 'well-established diagnosis'] },
      { percent: 40, criteria: 'Symptom combinations productive of definite impairment of health objectively supported by examination findings or incapacitating exacerbations occurring 3 or more times a year.', keywords: ['definite impairment', '3+ exacerbations/year', 'examination findings'] },
      { percent: 60, criteria: 'Constitutional manifestations associated with active joint involvement that are totally incapacitating.', keywords: ['constitutional manifestations', 'totally incapacitating', 'active joint involvement'] },
      { percent: 100, criteria: 'Constitutional manifestations associated with active joint involvement; totally incapacitating.', keywords: ['totally incapacitating', 'constitutional manifestations'] },
    ],
    examTips: ['Document uric acid levels over time', 'Report frequency and joints affected during flares', 'Describe tophi if present', 'Note medications including allopurinol or colchicine', 'Photograph joint swelling during acute attacks'],
    commonMistakes: ['Not documenting flare frequency', 'Not claiming individual joint limitations during acute attacks'],
  },
  // Rheumatoid Arthritis - detailed (DC 5002)
  {
    conditionId: 'rheumatoid-arthritis-detailed',
    conditionName: 'Rheumatoid Arthritis',
    diagnosticCode: '5002',
    cfrReference: '38 CFR § 4.71a, DC 5002',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'One or two exacerbations a year in a well-established diagnosis.', keywords: ['1-2 exacerbations/year', 'well-established diagnosis'] },
      { percent: 40, criteria: 'Symptom combinations productive of definite impairment of health objectively supported by examination findings or incapacitating exacerbations occurring 3 or more times a year.', keywords: ['definite impairment', '3+ exacerbations/year'] },
      { percent: 60, criteria: 'Less than criteria for 100% but with weight loss and anemia productive of severe impairment of health or severely incapacitating exacerbations occurring 4 or more times a year or a lesser number over prolonged periods.', keywords: ['weight loss', 'anemia', 'severe impairment', '4+ exacerbations/year'] },
      { percent: 100, criteria: 'Constitutional manifestations associated with active joint involvement, totally incapacitating.', keywords: ['totally incapacitating', 'constitutional manifestations', 'active joint involvement'] },
    ],
    examTips: ['Document all joints affected', 'Report rheumatoid factor and inflammatory markers (ESR, CRP)', 'Describe joint deformity and functional limitations', 'Note medication regimen including DMARDs and biologics'],
    commonMistakes: ['Not claiming individual joint limitations separately where appropriate', 'Not documenting medication side effects'],
  },
  // TMJ Disorder - detailed (DC 9905)
  {
    conditionId: 'tmj',
    conditionName: 'Temporomandibular Joint Disorder (TMJ/TMD)',
    diagnosticCode: '9905',
    cfrReference: '38 CFR § 4.150, DC 9905',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Inter-incisal range limited to 31 to 40 mm; or, lateral excursion limited to 0 to 4 mm.', keywords: ['inter-incisal 31-40mm', 'lateral excursion 0-4mm'] },
      { percent: 20, criteria: 'Inter-incisal range limited to 21 to 30 mm.', keywords: ['inter-incisal 21-30mm'] },
      { percent: 30, criteria: 'Inter-incisal range limited to 11 to 20 mm.', keywords: ['inter-incisal 11-20mm'] },
      { percent: 40, criteria: 'Inter-incisal range limited to 0 to 10 mm.', keywords: ['inter-incisal 0-10mm', 'severely limited'] },
    ],
    examTips: ['Measure inter-incisal range in millimeters', 'Report lateral excursion measurements', 'Describe clicking, popping, and locking episodes', 'Document pain with chewing and impact on eating', 'Note any bruxism or night guard use'],
    commonMistakes: ['Not having inter-incisal measurements documented', 'Not reporting pain with chewing and dietary limitations'],
  },
  // Diabetes Type 1 - additional entry (DC 7913)
  {
    conditionId: 'diabetes-type-1-detailed',
    conditionName: 'Diabetes Mellitus Type 1',
    diagnosticCode: '7913',
    cfrReference: '38 CFR § 4.119, DC 7913',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Manageable by restricted diet only.', keywords: ['restricted diet', 'diet-controlled'] },
      { percent: 20, criteria: 'Requiring insulin and restricted diet, or; oral hypoglycemic agent and restricted diet.', keywords: ['insulin', 'restricted diet', 'oral hypoglycemic'] },
      { percent: 40, criteria: 'Requiring insulin, restricted diet, and regulation of activities.', keywords: ['insulin', 'restricted diet', 'regulation of activities'] },
      { percent: 60, criteria: 'Requiring insulin, restricted diet, and regulation of activities with episodes of ketoacidosis or hypoglycemic reactions requiring one or two hospitalizations per year or twice a month visits to a diabetic care provider, plus complications that would not be compensable if separately evaluated.', keywords: ['insulin', 'regulation of activities', 'ketoacidosis', 'hypoglycemic reactions', '1-2 hospitalizations/year'] },
      { percent: 100, criteria: 'Requiring more than one daily injection of insulin, restricted diet, and regulation of activities (avoidance of strenuous occupational and recreational activities) with episodes of ketoacidosis or hypoglycemic reactions requiring at least three hospitalizations per year or weekly visits to a diabetic care provider, plus either progressive loss of weight and strength or complications that would be compensable if separately evaluated.', keywords: ['multiple daily injections', '3+ hospitalizations/year', 'progressive weight loss', 'weekly provider visits'] },
    ],
    examTips: ['Document insulin regimen and dosing', 'Report A1C levels over time', 'Describe regulation of activities - what activities you must avoid', 'Note all diabetic complications: neuropathy, retinopathy, nephropathy', 'Report hypoglycemic episodes and hospitalizations'],
    commonMistakes: ['Not documenting regulation of activities clearly', 'Not claiming diabetic complications as secondary conditions separately', 'Not reporting hypoglycemic episodes'],
  },
  // Hypothyroidism - detailed (DC 7903)
  {
    conditionId: 'hypothyroidism-detailed',
    conditionName: 'Hypothyroidism',
    diagnosticCode: '7903',
    cfrReference: '38 CFR § 4.119, DC 7903',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Fatigability, or; continuous medication required for control.', keywords: ['fatigability', 'continuous medication', 'levothyroxine'] },
      { percent: 30, criteria: 'Fatigability, constipation, and mental sluggishness.', keywords: ['fatigability', 'constipation', 'mental sluggishness', 'cognitive slowing'] },
      { percent: 60, criteria: 'Muscular weakness, mental disturbance, and weight gain.', keywords: ['muscular weakness', 'mental disturbance', 'weight gain'] },
      { percent: 100, criteria: 'Cold intolerance, muscular weakness, cardiovascular involvement, mental disturbance (dementia, slowing of thought, depression), bradycardia (less than 60 beats per minute), and sleepiness.', keywords: ['cold intolerance', 'cardiovascular involvement', 'bradycardia', 'dementia', 'sleepiness'] },
    ],
    examTips: ['Report TSH and T4 levels over time', 'Document medication dosage and adjustments', 'Describe fatigue, weight gain, and cognitive symptoms', 'Note cold intolerance and constipation'],
    commonMistakes: ['Not documenting all symptoms beyond fatigue', 'Not claiming secondary depression or cognitive issues'],
  },
  // Hyperthyroidism - detailed (DC 7900)
  {
    conditionId: 'hyperthyroidism-detailed',
    conditionName: 'Hyperthyroidism (Graves Disease)',
    diagnosticCode: '7900',
    cfrReference: '38 CFR § 4.119, DC 7900',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Tachycardia, which may be intermittent, and tremor, or; continuous medication required for control.', keywords: ['tachycardia', 'tremor', 'continuous medication'] },
      { percent: 30, criteria: 'Tachycardia, tremor, and increased pulse pressure or blood pressure.', keywords: ['tachycardia', 'tremor', 'increased pulse pressure', 'elevated blood pressure'] },
      { percent: 60, criteria: 'Emotional instability, tachycardia, fatigability, and increased pulse pressure or blood pressure.', keywords: ['emotional instability', 'tachycardia', 'fatigability', 'increased pulse pressure'] },
      { percent: 100, criteria: 'Thyroid enlargement, tachycardia (more than 100 beats per minute), eye involvement, muscular weakness, loss of weight, and sympathetic nervous system, cardiovascular, or gastrointestinal symptoms.', keywords: ['thyroid enlargement', 'tachycardia >100', 'eye involvement', 'weight loss', 'muscular weakness'] },
    ],
    examTips: ['Report TSH, T3, and T4 levels', 'Document resting heart rate', 'Describe tremor, weight loss, and heat intolerance', 'Note eye symptoms (Graves ophthalmopathy) if present'],
    commonMistakes: ['Not documenting resting tachycardia', 'Not claiming eye involvement separately'],
  },
  // Dermatitis/Eczema - additional (DC 7806)
  {
    conditionId: 'eczema',
    conditionName: 'Dermatitis / Eczema',
    diagnosticCode: '7806',
    cfrReference: '38 CFR § 4.118, DC 7806',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Less than 5 percent of the entire body, or less than 5 percent of exposed areas affected, and; no more than topical therapy required during the past 12-month period.', keywords: ['<5% body', '<5% exposed', 'topical therapy only'] },
      { percent: 10, criteria: 'At least 5 percent, but less than 20 percent, of the entire body, or at least 5 percent, but less than 20 percent, of exposed areas affected, or; intermittent systemic therapy such as corticosteroids or other immunosuppressive drugs required for a total duration of less than six weeks during the past 12-month period.', keywords: ['5-20% body', '5-20% exposed', 'intermittent systemic therapy', '<6 weeks'] },
      { percent: 30, criteria: '20 to 40 percent of the entire body, or 20 to 40 percent of exposed areas affected, or; systemic therapy such as corticosteroids or other immunosuppressive drugs required for a total duration of six weeks or more, but not constantly, during the past 12-month period.', keywords: ['20-40% body', '20-40% exposed', 'systemic therapy 6+ weeks'] },
      { percent: 60, criteria: 'More than 40 percent of the entire body, or more than 40 percent of exposed areas affected, or; constant or near-constant systemic therapy such as corticosteroids or other immunosuppressive drugs required during the past 12-month period.', keywords: ['>40% body', '>40% exposed', 'constant systemic therapy'] },
    ],
    examTips: ['Document percentage of body and exposed areas affected', 'Photograph skin during active flares', 'Report all medications including topical and systemic', 'Note duration of systemic therapy courses'],
    commonMistakes: ['Not documenting body surface area percentage', 'Not photographing skin during flares for evidence', 'Not tracking systemic medication usage duration'],
  },
  // Psoriasis - additional (DC 7816)
  {
    conditionId: 'psoriasis-detailed',
    conditionName: 'Psoriasis',
    diagnosticCode: '7816',
    cfrReference: '38 CFR § 4.118, DC 7816',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Less than 5 percent of the entire body, or less than 5 percent of exposed areas affected, and; no more than topical therapy required during the past 12-month period.', keywords: ['<5% body', '<5% exposed', 'topical therapy only'] },
      { percent: 10, criteria: 'At least 5 percent, but less than 20 percent, of the entire body, or at least 5 percent, but less than 20 percent, of exposed areas affected, or; intermittent systemic therapy such as corticosteroids or other immunosuppressive drugs required for less than six weeks during the past 12-month period.', keywords: ['5-20% body', '5-20% exposed', 'intermittent systemic therapy'] },
      { percent: 30, criteria: '20 to 40 percent of the entire body, or 20 to 40 percent of exposed areas affected, or; systemic therapy required for six weeks or more, but not constantly, during the past 12-month period.', keywords: ['20-40% body', '20-40% exposed', 'systemic therapy 6+ weeks'] },
      { percent: 60, criteria: 'More than 40 percent of the entire body, or more than 40 percent of exposed areas affected, or; constant or near-constant systemic therapy required during the past 12-month period.', keywords: ['>40% body', '>40% exposed', 'constant systemic therapy'] },
    ],
    examTips: ['Document body surface area percentage affected', 'Photograph plaques during active flares', 'Report all treatments including biologics, methotrexate, phototherapy', 'Note psoriatic arthritis if present for separate rating'],
    commonMistakes: ['Not documenting body surface area percentage', 'Not claiming psoriatic arthritis separately'],
  },
  // Burn Scars - additional (DC 7801)
  {
    conditionId: 'burn-scars-detailed',
    conditionName: 'Burn Scars (Deep/Nonlinear)',
    diagnosticCode: '7801',
    cfrReference: '38 CFR § 4.118, DC 7801',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Burn scar(s) or scar(s) due to other causes, not of the head, face, or neck, that are deep and nonlinear, with area or areas of at least 6 square inches (39 sq. cm.) but less than 12 square inches (77 sq. cm.).', keywords: ['deep', 'nonlinear', '6-12 sq in', '39-77 sq cm'] },
      { percent: 20, criteria: 'Area or areas of at least 12 square inches (77 sq. cm.) but less than 72 square inches (465 sq. cm.).', keywords: ['12-72 sq in', '77-465 sq cm'] },
      { percent: 30, criteria: 'Area or areas of at least 72 square inches (465 sq. cm.) but less than 144 square inches (929 sq. cm.).', keywords: ['72-144 sq in', '465-929 sq cm'] },
      { percent: 40, criteria: 'Area or areas of 144 square inches (929 sq. cm.) or greater.', keywords: ['144+ sq in', '929+ sq cm'] },
    ],
    examTips: ['Document scar measurements in square inches or centimeters', 'Describe whether scars are deep (associated with underlying soft tissue damage) or superficial', 'Report pain and instability of scars', 'Note any functional limitation caused by scar contracture'],
    commonMistakes: ['Not measuring scar area accurately', 'Not claiming painful or unstable scars under DC 7804 separately', 'Not claiming functional limitation from scar contracture under DC 7805'],
  },
  // Coronary Artery Disease - additional (DC 7005)
  {
    conditionId: 'coronary-artery-disease-detailed',
    conditionName: 'Coronary Artery Disease (CAD)',
    diagnosticCode: '7005',
    cfrReference: '38 CFR § 4.104, DC 7005',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Workload of greater than 7 METs but not greater than 10 METs results in dyspnea, fatigue, angina, dizziness, or syncope; or, continuous medication required.', keywords: ['7-10 METs', 'continuous medication', 'dyspnea on exertion'] },
      { percent: 30, criteria: 'Workload of greater than 5 METs but not greater than 7 METs results in dyspnea, fatigue, angina, dizziness, or syncope; or, evidence of cardiac hypertrophy or dilatation on ECG, echocardiogram, or X-ray.', keywords: ['5-7 METs', 'cardiac hypertrophy', 'dilatation'] },
      { percent: 60, criteria: 'More than one episode of acute congestive heart failure in the past year; or, workload of greater than 3 METs but not greater than 5 METs results in dyspnea, fatigue, angina, dizziness, or syncope; or, left ventricular dysfunction with an ejection fraction of 30 to 50 percent.', keywords: ['CHF episodes', '3-5 METs', 'EF 30-50%'] },
      { percent: 100, criteria: 'Chronic congestive heart failure; or, workload of 3 METs or less results in dyspnea, fatigue, angina, dizziness, or syncope; or, left ventricular dysfunction with an ejection fraction of less than 30 percent.', keywords: ['chronic CHF', '≤3 METs', 'EF <30%'] },
    ],
    examTips: ['Provide stress test results with METs', 'Report echocardiogram with ejection fraction', 'Document all cardiac medications and stents/bypasses', 'Describe angina frequency and activity limitations'],
    commonMistakes: ['Not obtaining METs from stress testing', 'Not providing ejection fraction', 'Not claiming surgical scars separately'],
  },
  // Valvular Heart Disease - additional (DC 7000)
  {
    conditionId: 'valvular-heart-disease-detailed',
    conditionName: 'Valvular Heart Disease',
    diagnosticCode: '7000',
    cfrReference: '38 CFR § 4.104, DC 7000',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Workload of greater than 7 METs but not greater than 10 METs results in dyspnea, fatigue, angina, dizziness, or syncope; or, continuous medication required.', keywords: ['7-10 METs', 'continuous medication'] },
      { percent: 30, criteria: 'Workload of greater than 5 METs but not greater than 7 METs results in dyspnea, fatigue, angina, dizziness, or syncope; or, evidence of cardiac hypertrophy or dilatation on ECG, echocardiogram, or X-ray.', keywords: ['5-7 METs', 'cardiac hypertrophy'] },
      { percent: 60, criteria: 'More than one episode of congestive heart failure in the past year; or, workload of greater than 3 METs but not greater than 5 METs resulting in dyspnea, fatigue, angina, dizziness, or syncope; or, left ventricular dysfunction with EF of 30 to 50 percent.', keywords: ['CHF episodes', '3-5 METs', 'EF 30-50%'] },
      { percent: 100, criteria: 'During active infection with valvular heart damage and for three months following cessation of therapy for active infection; or, chronic congestive heart failure; or, workload of 3 METs or less; or, left ventricular dysfunction with EF less than 30 percent.', keywords: ['active infection', 'chronic CHF', '≤3 METs', 'EF <30%'] },
    ],
    examTips: ['Provide echocardiogram showing valve pathology', 'Report exercise tolerance in METs', 'Document valve replacement or repair history', 'Describe symptoms: dyspnea, fatigue, edema'],
    commonMistakes: ['Not obtaining stress test for METs', 'Not documenting valve surgery separately', 'Not providing ejection fraction'],
  },
  // Varicose Veins - additional (DC 7120)
  {
    conditionId: 'varicose-veins-detailed',
    conditionName: 'Varicose Veins',
    diagnosticCode: '7120',
    cfrReference: '38 CFR § 4.104, DC 7120',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Asymptomatic palpable or visible varicose veins.', keywords: ['asymptomatic', 'palpable', 'visible'] },
      { percent: 10, criteria: 'Intermittent edema of extremity or aching and fatigue in leg after prolonged standing or walking, with symptoms relieved by elevation of extremity or compression hosiery.', keywords: ['intermittent edema', 'aching', 'fatigue', 'relieved by elevation'] },
      { percent: 20, criteria: 'Persistent edema, incompletely relieved by elevation of extremity, with or without beginning stasis pigmentation or eczema.', keywords: ['persistent edema', 'incompletely relieved', 'stasis pigmentation'] },
      { percent: 40, criteria: 'Persistent edema and stasis pigmentation or eczema, with or without intermittent ulceration.', keywords: ['persistent edema', 'stasis pigmentation', 'eczema', 'intermittent ulceration'] },
      { percent: 60, criteria: 'Persistent edema or subcutaneous induration, stasis pigmentation or eczema, and persistent ulceration.', keywords: ['persistent ulceration', 'subcutaneous induration', 'stasis changes'] },
      { percent: 100, criteria: 'Massive board-like edema with constant pain at rest; or, ischemic limb pain at rest with deep ischemic ulcers or ankle/brachial index of 0.4 or less.', keywords: ['massive edema', 'constant pain at rest', 'deep ischemic ulcers'] },
    ],
    examTips: ['Document each extremity separately for separate ratings', 'Photograph varicose veins and skin changes', 'Report edema measurements', 'Describe use of compression stockings'],
    commonMistakes: ['Not claiming each extremity separately', 'Not documenting skin changes and ulceration'],
  },
  // Peripheral Vascular Disease - additional (DC 7114)
  {
    conditionId: 'peripheral-vascular-disease-detailed',
    conditionName: 'Peripheral Vascular Disease (Arterial)',
    diagnosticCode: '7114',
    cfrReference: '38 CFR § 4.104, DC 7114',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 20, criteria: 'Claudication on walking more than 100 yards, and; diminished peripheral pulses or ankle/brachial index of 0.9 or less.', keywords: ['claudication >100 yards', 'diminished pulses', 'ABI 0.9 or less'] },
      { percent: 40, criteria: 'Claudication on walking between 25 and 100 yards on a level grade at 2 miles per hour, and; trophic changes (thin skin, absence of hair, dystrophic nails) or ankle/brachial index of 0.7 or less.', keywords: ['claudication 25-100 yards', 'trophic changes', 'ABI 0.7 or less'] },
      { percent: 60, criteria: 'Claudication on walking less than 25 yards on a level grade at 2 miles per hour, and; either persistent coldness of the extremity or ankle/brachial index of 0.5 or less.', keywords: ['claudication <25 yards', 'persistent coldness', 'ABI 0.5 or less'] },
      { percent: 100, criteria: 'Ischemic limb pain at rest, and; either deep ischemic ulcers or ankle/brachial index of 0.4 or less.', keywords: ['ischemic pain at rest', 'deep ischemic ulcers', 'ABI 0.4 or less'] },
    ],
    examTips: ['Document ankle/brachial index (ABI) results', 'Report walking distance before claudication onset', 'Describe trophic changes: skin, hair, nails', 'Note any revascularization procedures'],
    commonMistakes: ['Not providing ABI measurements', 'Not claiming each extremity separately', 'Not documenting claudication distance accurately'],
  },
  // Raynaud's Disease - additional (DC 7117)
  {
    conditionId: 'raynauds-disease',
    conditionName: "Raynaud's Disease",
    diagnosticCode: '7117',
    cfrReference: '38 CFR § 4.104, DC 7117',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Characteristic attacks occurring one to three times a week.', keywords: ['1-3 attacks/week', 'characteristic attacks'] },
      { percent: 20, criteria: 'Characteristic attacks occurring four to six times a week.', keywords: ['4-6 attacks/week'] },
      { percent: 40, criteria: 'Characteristic attacks occurring at least daily.', keywords: ['daily attacks', 'at least daily'] },
      { percent: 60, criteria: 'Two or more digital ulcers plus autoamputation of one or more digits and history of characteristic attacks.', keywords: ['digital ulcers', 'autoamputation', 'characteristic attacks'] },
      { percent: 100, criteria: 'Two or more digital ulcers and autoamputation of two or more digits and history of characteristic attacks.', keywords: ['digital ulcers', 'autoamputation 2+ digits'] },
    ],
    examTips: ['Keep a diary of Raynaud attacks with frequency', 'Photograph color changes during attacks', 'Document triggers: cold, stress', 'Note any digital ulcers or tissue loss'],
    commonMistakes: ['Not tracking attack frequency', 'Not photographing attacks for evidence'],
  },
  // COPD - additional (DC 6604)
  {
    conditionId: 'copd-detailed',
    conditionName: 'Chronic Obstructive Pulmonary Disease (COPD)',
    diagnosticCode: '6604',
    cfrReference: '38 CFR § 4.97, DC 6604',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'FEV-1 of 71 to 80 percent predicted; or, FEV-1/FVC of 71 to 80 percent; or, DLCO (SB) 66 to 80 percent predicted.', keywords: ['FEV-1 71-80%', 'FEV-1/FVC 71-80%', 'DLCO 66-80%'] },
      { percent: 30, criteria: 'FEV-1 of 56 to 70 percent predicted; or, FEV-1/FVC of 56 to 70 percent; or, DLCO (SB) 56 to 65 percent predicted.', keywords: ['FEV-1 56-70%', 'FEV-1/FVC 56-70%', 'DLCO 56-65%'] },
      { percent: 60, criteria: 'FEV-1 of 40 to 55 percent predicted; or, FEV-1/FVC of 40 to 55 percent; or, DLCO (SB) of 40 to 55 percent predicted; or, maximum oxygen consumption of 15 to 20 ml/kg/min (with cardiorespiratory limit).', keywords: ['FEV-1 40-55%', 'DLCO 40-55%', 'VO2 max 15-20'] },
      { percent: 100, criteria: 'FEV-1 less than 40 percent predicted; or, FEV-1/FVC less than 40 percent; or, DLCO (SB) less than 40 percent predicted; or, maximum exercise capacity less than 15 ml/kg/min oxygen consumption; or, cor pulmonale; or, right ventricular hypertrophy; or, pulmonary hypertension; or, episode(s) of acute respiratory failure; or, requires outpatient oxygen therapy.', keywords: ['FEV-1 <40%', 'DLCO <40%', 'cor pulmonale', 'oxygen therapy', 'respiratory failure'] },
    ],
    examTips: ['Obtain current PFT results with pre- and post-bronchodilator values', 'Report exercise tolerance and dyspnea level', 'Document supplemental oxygen use', 'Note exacerbation frequency and hospitalizations', 'Report smoking history and in-service exposure to toxins'],
    commonMistakes: ['Not obtaining post-bronchodilator PFT values', 'Not documenting oxygen requirements', 'Not connecting to in-service toxic exposure'],
  },
  // Sarcoidosis - additional (DC 6846)
  {
    conditionId: 'sarcoidosis-detailed',
    conditionName: 'Sarcoidosis',
    diagnosticCode: '6846',
    cfrReference: '38 CFR § 4.97, DC 6846',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Chronic hilar adenopathy or stable lung infiltrates without symptoms or physiologic impairment.', keywords: ['chronic hilar adenopathy', 'stable infiltrates', 'asymptomatic'] },
      { percent: 30, criteria: 'Pulmonary involvement with persistent symptoms requiring chronic low dose (maintenance) or intermittent corticosteroids.', keywords: ['persistent symptoms', 'chronic corticosteroids', 'maintenance therapy'] },
      { percent: 60, criteria: 'Pulmonary involvement requiring systemic high dose (therapeutic) corticosteroids for control.', keywords: ['high dose corticosteroids', 'therapeutic doses', 'systemic therapy'] },
      { percent: 100, criteria: 'Cor pulmonale; or, cardiac involvement with congestive heart failure; or, progressive pulmonary disease with fever, night sweats, and weight loss despite treatment.', keywords: ['cor pulmonale', 'cardiac involvement', 'CHF', 'progressive disease', 'weight loss'] },
    ],
    examTips: ['Document all organ systems involved', 'Report PFT results if pulmonary involvement', 'Describe corticosteroid regimen and duration', 'Note biopsy-confirmed diagnosis'],
    commonMistakes: ['Not claiming separate ratings for each organ system affected', 'Not documenting corticosteroid therapy duration and dosage'],
  },
  // Bronchiectasis - additional (DC 6601)
  {
    conditionId: 'bronchiectasis-detailed',
    conditionName: 'Bronchiectasis',
    diagnosticCode: '6601',
    cfrReference: '38 CFR § 4.97, DC 6601',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Intermittent productive cough with acute infection requiring a course of antibiotics at least twice a year.', keywords: ['intermittent cough', 'antibiotics 2x/year', 'productive cough'] },
      { percent: 30, criteria: 'Daily productive cough with intermittently blood-tinged sputum and incapacitating episodes of infection of 2-4 weeks total duration per year, or; daily productive cough with sputum that is at times purulent or blood-tinged and that requires prolonged (4-6 weeks) antibiotic usage more than twice a year.', keywords: ['daily cough', 'blood-tinged sputum', '2-4 weeks incapacity', 'prolonged antibiotics'] },
      { percent: 60, criteria: 'Near-constant findings of cough with purulent sputum associated with anorexia, weight loss, and frank hemoptysis requiring antibiotic usage almost continuously; and incapacitating episodes of infection of at least 4-6 weeks total duration per year.', keywords: ['near-constant cough', 'purulent sputum', 'weight loss', 'hemoptysis', '4-6 weeks incapacity'] },
      { percent: 100, criteria: 'Incapacitating episodes of infection of at least 6 weeks total duration per year; or, near constant findings of cough with purulent sputum and associated with anorexia, weight loss, frank hemoptysis, and one or more of: cor pulmonale, right ventricular hypertrophy, pulmonary hypertension, episodes of acute respiratory failure, or outpatient oxygen therapy.', keywords: ['6+ weeks incapacity', 'cor pulmonale', 'respiratory failure', 'oxygen therapy'] },
    ],
    examTips: ['Document frequency and duration of infections', 'Report antibiotic usage history', 'Provide CT scan showing bronchiectasis', 'Describe sputum production and hemoptysis'],
    commonMistakes: ['Not tracking infection episodes and antibiotic courses', 'Not documenting incapacitating episodes'],
  },
  // Hepatitis C - additional (DC 7354)
  {
    conditionId: 'hepatitis-c-detailed',
    conditionName: 'Hepatitis C',
    diagnosticCode: '7354',
    cfrReference: '38 CFR § 4.114, DC 7354',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Nonsymptomatic.', keywords: ['nonsymptomatic', 'no symptoms'] },
      { percent: 10, criteria: 'Intermittent fatigue, malaise, and anorexia; or, incapacitating episodes (with symptoms such as fatigue, malaise, nausea, vomiting, anorexia, arthralgia, and right upper quadrant pain) having a total duration of at least one week, but less than two weeks, during the past 12-month period.', keywords: ['intermittent fatigue', 'malaise', 'anorexia', '1-2 weeks incapacity'] },
      { percent: 20, criteria: 'Daily fatigue, malaise, and anorexia (without weight loss or hepatomegaly), requiring dietary restriction or continuous medication; or, incapacitating episodes having a total duration of at least two weeks, but less than four weeks, during the past 12-month period.', keywords: ['daily fatigue', 'dietary restriction', 'continuous medication', '2-4 weeks incapacity'] },
      { percent: 40, criteria: 'Daily fatigue, malaise, and anorexia, with minor weight loss and hepatomegaly; or, incapacitating episodes having a total duration of at least four weeks, but less than six weeks, during the past 12-month period.', keywords: ['daily fatigue', 'minor weight loss', 'hepatomegaly', '4-6 weeks incapacity'] },
      { percent: 60, criteria: 'Daily fatigue, malaise, and anorexia, with substantial weight loss (or other indication of malnutrition), and hepatomegaly; or, incapacitating episodes having a total duration of at least six weeks during the past 12-month period, but not occurring constantly.', keywords: ['substantial weight loss', 'malnutrition', 'hepatomegaly', '6+ weeks incapacity'] },
      { percent: 100, criteria: 'Near-constant debilitating symptoms (such as fatigue, malaise, nausea, vomiting, anorexia, arthralgia, and right upper quadrant pain); or, serologic evidence of hepatitis C infection and currently assigned a diagnosis of cirrhosis of the liver.', keywords: ['near-constant symptoms', 'debilitating', 'cirrhosis'] },
    ],
    examTips: ['Document viral load and liver function tests', 'Report treatment history including antiviral therapy', 'Describe fatigue severity and impact on daily activities', 'Note any liver biopsy or FibroScan results'],
    commonMistakes: ['Not documenting daily symptom burden', 'Not claiming cirrhosis separately if present', 'Not reporting treatment side effects'],
  },
  // Crohn's Disease - additional (DC 7323)
  {
    conditionId: 'crohns-disease-detailed',
    conditionName: "Crohn's Disease",
    diagnosticCode: '7323',
    cfrReference: '38 CFR § 4.114, DC 7323',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Moderate; with infrequent exacerbations.', keywords: ['moderate', 'infrequent exacerbations'] },
      { percent: 30, criteria: 'Moderately severe; with frequent exacerbations.', keywords: ['moderately severe', 'frequent exacerbations'] },
      { percent: 60, criteria: 'Severe; with numerous attacks a year and malnutrition, the health only fair during remissions.', keywords: ['severe', 'numerous attacks', 'malnutrition', 'fair health in remission'] },
      { percent: 100, criteria: 'Pronounced; resulting in marked malnutrition, anemia, and general debility, or with serious complication as liver abscess.', keywords: ['pronounced', 'marked malnutrition', 'anemia', 'general debility'] },
    ],
    examTips: ['Document flare frequency, severity, and duration', 'Report colonoscopy/endoscopy findings', 'Describe weight loss, anemia, and nutritional deficiencies', 'Note all medications including biologics, immunomodulators, and steroids', 'Report any surgical interventions (resections, ostomy)'],
    commonMistakes: ['Not documenting flare frequency', 'Not reporting surgical history', 'Not claiming fistula or abscess complications separately'],
  },
  // Deviated Septum - additional (DC 6502)
  {
    conditionId: 'deviated-septum-detailed',
    conditionName: 'Deviated Nasal Septum',
    diagnosticCode: '6502',
    cfrReference: '38 CFR § 4.97, DC 6502',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 0, criteria: 'Traumatic only, without obstruction of nasal passage on either side.', keywords: ['no obstruction', 'traumatic deviation'] },
      { percent: 10, criteria: '50-percent obstruction of the nasal passage on both sides or complete obstruction on one side.', keywords: ['50% obstruction both sides', 'complete obstruction one side'] },
    ],
    examTips: ['Document nasal obstruction percentage', 'Report history of nasal trauma in service', 'Describe breathing difficulty and impact on sleep', 'Note surgical history (septoplasty)'],
    commonMistakes: ['Not documenting obstruction percentage', 'Not claiming secondary sleep apnea or sinusitis'],
  },
  // Deep Vein Thrombosis - Left (DC 7121) - separate for bilateral claims
  {
    conditionId: 'deep-vein-thrombosis-left',
    conditionName: 'Deep Vein Thrombosis (DVT) - Left Lower Extremity',
    diagnosticCode: '7121',
    cfrReference: '38 CFR § 4.104, DC 7121',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Intermittent edema of extremity or aching and fatigue in leg after prolonged standing or walking, with symptoms relieved by elevation of extremity or compression hosiery.', keywords: ['intermittent edema', 'aching', 'fatigue', 'relieved by elevation'] },
      { percent: 20, criteria: 'Persistent edema, incompletely relieved by elevation of extremity, with or without beginning stasis pigmentation or eczema.', keywords: ['persistent edema', 'incompletely relieved', 'stasis pigmentation'] },
      { percent: 40, criteria: 'Persistent edema and stasis pigmentation or eczema, with or without intermittent ulceration.', keywords: ['persistent edema', 'stasis pigmentation', 'intermittent ulceration'] },
      { percent: 60, criteria: 'Persistent edema or subcutaneous induration, stasis pigmentation or eczema, and persistent ulceration.', keywords: ['persistent edema', 'subcutaneous induration', 'persistent ulceration'] },
      { percent: 100, criteria: 'Massive board-like edema with constant pain at rest.', keywords: ['massive edema', 'constant pain at rest'] },
    ],
    examTips: ['Document edema measurements', 'Photograph stasis changes', 'Report compression stocking use', 'Describe standing and walking tolerance'],
    commonMistakes: ['Not claiming each extremity separately', 'Not documenting post-thrombotic syndrome'],
  },
  // Deep Vein Thrombosis - Right (DC 7121)
  {
    conditionId: 'deep-vein-thrombosis-right',
    conditionName: 'Deep Vein Thrombosis (DVT) - Right Lower Extremity',
    diagnosticCode: '7121',
    cfrReference: '38 CFR § 4.104, DC 7121',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Intermittent edema of extremity or aching and fatigue in leg after prolonged standing or walking, with symptoms relieved by elevation of extremity or compression hosiery.', keywords: ['intermittent edema', 'aching', 'fatigue', 'relieved by elevation'] },
      { percent: 20, criteria: 'Persistent edema, incompletely relieved by elevation of extremity, with or without beginning stasis pigmentation or eczema.', keywords: ['persistent edema', 'incompletely relieved', 'stasis pigmentation'] },
      { percent: 40, criteria: 'Persistent edema and stasis pigmentation or eczema, with or without intermittent ulceration.', keywords: ['persistent edema', 'stasis pigmentation', 'intermittent ulceration'] },
      { percent: 60, criteria: 'Persistent edema or subcutaneous induration, stasis pigmentation or eczema, and persistent ulceration.', keywords: ['persistent edema', 'subcutaneous induration', 'persistent ulceration'] },
      { percent: 100, criteria: 'Massive board-like edema with constant pain at rest.', keywords: ['massive edema', 'constant pain at rest'] },
    ],
    examTips: ['Document edema measurements', 'Photograph stasis changes', 'Report compression stocking use'],
    commonMistakes: ['Not claiming each extremity separately', 'Not documenting post-thrombotic syndrome'],
  },
  // Peripheral Neuropathy - Right Lower (DC 8520)
  {
    conditionId: 'peripheral-neuropathy-right-lower',
    conditionName: 'Peripheral Neuropathy - Right Lower Extremity',
    diagnosticCode: '8520',
    cfrReference: '38 CFR § 4.124a, DC 8520',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the sciatic nerve.', keywords: ['mild', 'incomplete paralysis', 'numbness', 'tingling'] },
      { percent: 20, criteria: 'Moderate incomplete paralysis of the sciatic nerve.', keywords: ['moderate', 'frequent numbness', 'burning pain'] },
      { percent: 40, criteria: 'Moderately severe incomplete paralysis of the sciatic nerve.', keywords: ['moderately severe', 'muscle weakness', 'significant sensory loss'] },
      { percent: 60, criteria: 'Severe incomplete paralysis with marked muscular atrophy.', keywords: ['severe', 'marked atrophy', 'foot drop'] },
      { percent: 80, criteria: 'Complete paralysis: foot dangles and drops, no active movement below knee.', keywords: ['complete paralysis', 'foot drop'] },
    ],
    examTips: ['Document sensory deficit distribution', 'Report EMG/NCS results', 'Describe burning, tingling, numbness pattern', 'Note impact on balance and walking'],
    commonMistakes: ['Not providing EMG/NCS results', 'Not documenting functional impact on mobility'],
  },
  // Peripheral Neuropathy - Left Lower (DC 8520)
  {
    conditionId: 'peripheral-neuropathy-left-lower',
    conditionName: 'Peripheral Neuropathy - Left Lower Extremity',
    diagnosticCode: '8520',
    cfrReference: '38 CFR § 4.124a, DC 8520',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the sciatic nerve.', keywords: ['mild', 'incomplete paralysis', 'numbness', 'tingling'] },
      { percent: 20, criteria: 'Moderate incomplete paralysis of the sciatic nerve.', keywords: ['moderate', 'frequent numbness', 'burning pain'] },
      { percent: 40, criteria: 'Moderately severe incomplete paralysis of the sciatic nerve.', keywords: ['moderately severe', 'muscle weakness', 'significant sensory loss'] },
      { percent: 60, criteria: 'Severe incomplete paralysis with marked muscular atrophy.', keywords: ['severe', 'marked atrophy', 'foot drop'] },
      { percent: 80, criteria: 'Complete paralysis: foot dangles and drops, no active movement below knee.', keywords: ['complete paralysis', 'foot drop'] },
    ],
    examTips: ['Document sensory deficit distribution', 'Report EMG/NCS results', 'Describe burning, tingling, numbness pattern'],
    commonMistakes: ['Not providing EMG/NCS results', 'Not documenting functional impact on mobility'],
  },
  // Peripheral Neuropathy - Right Upper (DC 8515)
  {
    conditionId: 'peripheral-neuropathy-right-upper',
    conditionName: 'Peripheral Neuropathy - Right Upper Extremity',
    diagnosticCode: '8515',
    cfrReference: '38 CFR § 4.124a, DC 8515',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the median nerve.', keywords: ['mild', 'incomplete paralysis', 'intermittent numbness'] },
      { percent: 30, criteria: 'Moderate incomplete paralysis of the median nerve - major extremity.', keywords: ['moderate', 'major', 'grip weakness'] },
      { percent: 50, criteria: 'Severe incomplete paralysis of the median nerve - major extremity.', keywords: ['severe', 'major', 'significant grip loss'] },
      { percent: 70, criteria: 'Complete paralysis of the median nerve - major extremity.', keywords: ['complete paralysis', 'major'] },
    ],
    examTips: ['Specify dominant hand', 'Document grip and pinch strength', 'Report EMG/NCS results', 'Describe numbness pattern in hands/fingers'],
    commonMistakes: ['Not specifying dominant extremity', 'Not providing EMG/NCS results'],
  },
  // Peripheral Neuropathy - Left Upper (DC 8515)
  {
    conditionId: 'peripheral-neuropathy-left-upper',
    conditionName: 'Peripheral Neuropathy - Left Upper Extremity',
    diagnosticCode: '8515',
    cfrReference: '38 CFR § 4.124a, DC 8515',
    scheduleUrl: ECFR_BASE,
    ratingLevels: [
      { percent: 10, criteria: 'Mild incomplete paralysis of the median nerve.', keywords: ['mild', 'incomplete paralysis', 'intermittent numbness'] },
      { percent: 20, criteria: 'Moderate incomplete paralysis of the median nerve - minor extremity.', keywords: ['moderate', 'minor', 'grip weakness'] },
      { percent: 40, criteria: 'Severe incomplete paralysis of the median nerve - minor extremity.', keywords: ['severe', 'minor', 'significant grip loss'] },
      { percent: 60, criteria: 'Complete paralysis of the median nerve - minor extremity.', keywords: ['complete paralysis', 'minor'] },
    ],
    examTips: ['Specify dominant hand', 'Document grip and pinch strength', 'Report EMG/NCS results'],
    commonMistakes: ['Not specifying dominant extremity', 'Not providing EMG/NCS results'],
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
 * Range-aware: handles compound codes like "5260/5261" and range codes like "6600-6847".
 */
export function getRatingCriteriaByDC(
  diagnosticCode: string,
): ConditionRatingCriteria | undefined {
  return conditionRatingCriteria.find((c) => {
    const storedCodes = c.diagnosticCode.split('/');
    const inputCodes = diagnosticCode.split('/');
    return storedCodes.some(sc => inputCodes.some(ic => dcMatches(sc.trim(), ic.trim())));
  });
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
