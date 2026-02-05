// Rating Criteria Data for Common VA Disabilities
// Source: 38 CFR Part 4 - Schedule for Rating Disabilities

export interface RatingLevel {
  percentage: number;
  description: string;
  keywords: string[];
  examTips: string[];
  commonMistakes?: string[];
}

export interface RatingCriteria {
  conditionId: string;
  conditionName: string;
  diagnosticCode: string;
  bodySystem: string;
  ratingLevels: RatingLevel[];
  generalTips: string[];
}

export const ratingCriteriaData: RatingCriteria[] = [
  // PTSD - DC 9411
  {
    conditionId: 'ptsd',
    conditionName: 'Post-Traumatic Stress Disorder (PTSD)',
    diagnosticCode: '9411',
    bodySystem: 'Mental Disorders',
    ratingLevels: [
      {
        percentage: 0,
        description: 'A mental condition has been formally diagnosed, but symptoms are not severe enough either to interfere with occupational and social functioning or to require continuous medication.',
        keywords: ['diagnosed', 'no medication needed', 'minimal symptoms'],
        examTips: ['If you have any symptoms, describe them clearly'],
        commonMistakes: ['Not mentioning symptoms that occur occasionally'],
      },
      {
        percentage: 10,
        description: 'Occupational and social impairment due to mild or transient symptoms which decrease work efficiency and ability to perform occupational tasks only during periods of significant stress, or symptoms controlled by continuous medication.',
        keywords: ['mild', 'transient', 'continuous medication', 'significant stress'],
        examTips: ['Mention any medications you take regularly', 'Describe how stress affects your work'],
      },
      {
        percentage: 30,
        description: 'Occupational and social impairment with occasional decrease in work efficiency and intermittent periods of inability to perform occupational tasks due to such symptoms as: depressed mood, anxiety, suspiciousness, panic attacks (weekly or less often), chronic sleep impairment, mild memory loss.',
        keywords: ['occasional decrease', 'intermittent inability', 'depressed mood', 'anxiety', 'panic attacks weekly', 'chronic sleep problems', 'mild memory loss'],
        examTips: [
          'Track and report frequency of panic attacks',
          'Document sleep issues with specifics (hours, quality, nightmares)',
          'Give examples of memory problems',
        ],
      },
      {
        percentage: 50,
        description: 'Occupational and social impairment with reduced reliability and productivity due to such symptoms as: flattened affect; circumstantial, circumlocutory, or stereotyped speech; panic attacks more than once a week; difficulty in understanding complex commands; impairment of short- and long-term memory; impaired judgment; impaired abstract thinking; disturbances of motivation and mood; difficulty in establishing and maintaining effective work and social relationships.',
        keywords: ['reduced reliability', 'flattened affect', 'panic attacks more than weekly', 'memory impairment', 'impaired judgment', 'difficulty with relationships', 'motivation problems'],
        examTips: [
          'Describe how symptoms affect your job reliability',
          'Document panic attack frequency specifically',
          'Explain difficulties maintaining relationships',
          'Give concrete examples of judgment issues',
        ],
      },
      {
        percentage: 70,
        description: 'Occupational and social impairment with deficiencies in most areas, such as work, school, family relations, judgment, thinking, or mood, due to such symptoms as: suicidal ideation; obsessional rituals which interfere with routine activities; speech intermittently illogical, obscure, or irrelevant; near-continuous panic or depression affecting the ability to function independently; impaired impulse control; spatial disorientation; neglect of personal appearance and hygiene; difficulty in adapting to stressful circumstances; inability to establish and maintain effective relationships.',
        keywords: ['deficiencies in most areas', 'suicidal ideation', 'obsessional rituals', 'near-continuous panic', 'impaired impulse control', 'neglect hygiene', 'inability to maintain relationships'],
        examTips: [
          'Be honest about suicidal thoughts - past and present',
          'Describe any rituals or compulsive behaviors',
          'Explain how depression/panic affects daily functioning',
          'Document hygiene issues if applicable',
        ],
        commonMistakes: ['Minimizing symptoms out of embarrassment', 'Not mentioning past suicidal ideation'],
      },
      {
        percentage: 100,
        description: 'Total occupational and social impairment, due to such symptoms as: gross impairment in thought processes or communication; persistent delusions or hallucinations; grossly inappropriate behavior; persistent danger of hurting self or others; intermittent inability to perform activities of daily living (including maintenance of minimal personal hygiene); disorientation to time or place; memory loss for names of close relatives, own occupation, or own name.',
        keywords: ['total impairment', 'persistent delusions', 'hallucinations', 'danger to self/others', 'cannot perform daily activities', 'disorientation', 'severe memory loss'],
        examTips: [
          'Describe worst-day symptoms',
          'Document any hallucinations or delusions',
          'Explain inability to care for yourself',
        ],
      },
    ],
    generalTips: [
      'Describe your WORST days, not your best or average days',
      'Be specific about frequency of symptoms',
      'Mention how symptoms affect work, relationships, and daily life',
      'Bring documentation of treatment history',
      'Do not minimize symptoms to appear "strong"',
    ],
  },

  // Lumbar Spine - DC 5237-5243
  {
    conditionId: 'lumbar-spine',
    conditionName: 'Lumbosacral Strain / Degenerative Disc Disease',
    diagnosticCode: '5237-5243',
    bodySystem: 'Musculoskeletal - Spine',
    ratingLevels: [
      {
        percentage: 10,
        description: 'Forward flexion of the thoracolumbar spine greater than 60 degrees but not greater than 85 degrees; OR combined range of motion of the thoracolumbar spine greater than 120 degrees but not greater than 235 degrees; OR muscle spasm, guarding, or localized tenderness not resulting in abnormal gait or abnormal spinal contour; OR vertebral body fracture with loss of 50 percent or more of the height.',
        keywords: ['flexion 60-85 degrees', 'combined ROM 120-235', 'muscle spasm', 'guarding', 'tenderness', 'no abnormal gait'],
        examTips: [
          'Do not push through pain during ROM testing',
          'Report where pain begins during movement',
          'Mention any muscle spasms you experience',
        ],
      },
      {
        percentage: 20,
        description: 'Forward flexion of the thoracolumbar spine greater than 30 degrees but not greater than 60 degrees; OR combined range of motion of the thoracolumbar spine not greater than 120 degrees; OR muscle spasm or guarding severe enough to result in an abnormal gait or abnormal spinal contour such as scoliosis, reversed lordosis, or abnormal kyphosis.',
        keywords: ['flexion 30-60 degrees', 'combined ROM up to 120', 'abnormal gait', 'abnormal spinal contour', 'scoliosis', 'kyphosis'],
        examTips: [
          'Report if you walk differently due to pain',
          'Mention any curvature issues',
          'Describe flare-ups and how they limit movement',
        ],
      },
      {
        percentage: 40,
        description: 'Forward flexion of the thoracolumbar spine 30 degrees or less; OR favorable ankylosis of the entire thoracolumbar spine.',
        keywords: ['flexion 30 degrees or less', 'favorable ankylosis', 'severely limited bending'],
        examTips: [
          'Demonstrate your actual limitation',
          'Stop at the point pain begins',
          'Describe how this affects daily activities',
        ],
      },
      {
        percentage: 50,
        description: 'Unfavorable ankylosis of the entire thoracolumbar spine.',
        keywords: ['unfavorable ankylosis', 'spine fixed in abnormal position'],
        examTips: ['Document any fixed positioning of spine'],
      },
      {
        percentage: 100,
        description: 'Unfavorable ankylosis of the entire spine.',
        keywords: ['entire spine', 'complete ankylosis', 'total fixation'],
        examTips: ['Requires complete fusion of entire spine'],
      },
    ],
    generalTips: [
      'Test on your worst day if possible (within reason)',
      'Do not push through pain - stop when pain begins',
      'Report pain at the START of movement, not end',
      'Describe flare-ups: frequency, duration, severity',
      'Mention any radiculopathy (shooting pain down legs)',
      'Bring recent imaging (MRI, X-rays) if available',
    ],
  },

  // Knee - DC 5260/5261
  {
    conditionId: 'knee',
    conditionName: 'Knee Conditions (Limited Motion)',
    diagnosticCode: '5260/5261',
    bodySystem: 'Musculoskeletal - Lower Extremities',
    ratingLevels: [
      {
        percentage: 0,
        description: 'Flexion limited to 60 degrees or more; Extension limited to 5 degrees or less.',
        keywords: ['flexion 60+', 'extension 5 or less', 'near normal motion'],
        examTips: ['Even if rated 0%, instability may warrant separate rating'],
      },
      {
        percentage: 10,
        description: 'Flexion limited to 45 degrees; OR Extension limited to 10 degrees.',
        keywords: ['flexion limited to 45', 'extension limited to 10'],
        examTips: ['Can receive separate ratings for flexion AND extension limitations'],
      },
      {
        percentage: 20,
        description: 'Flexion limited to 30 degrees; OR Extension limited to 15 degrees.',
        keywords: ['flexion limited to 30', 'extension limited to 15'],
        examTips: ['Report any giving way or locking of knee'],
      },
      {
        percentage: 30,
        description: 'Flexion limited to 15 degrees; OR Extension limited to 20 degrees.',
        keywords: ['flexion limited to 15', 'extension limited to 20', 'severely limited'],
        examTips: ['Describe impact on walking, stairs, squatting'],
      },
      {
        percentage: 40,
        description: 'Extension limited to 30 degrees.',
        keywords: ['extension limited to 30', 'cannot straighten leg'],
        examTips: ['Document inability to fully extend knee'],
      },
      {
        percentage: 50,
        description: 'Extension limited to 45 degrees.',
        keywords: ['extension limited to 45', 'severely restricted extension'],
        examTips: ['Requires significant limitation of extension'],
      },
    ],
    generalTips: [
      'You can receive SEPARATE ratings for flexion AND extension',
      'Instability (DC 5257) is rated SEPARATELY from limited motion',
      'Report any giving way, locking, or instability',
      'Describe use of braces or assistive devices',
      'Mention impact on walking, stairs, standing',
    ],
  },

  // Sleep Apnea - DC 6847
  {
    conditionId: 'sleep-apnea',
    conditionName: 'Sleep Apnea Syndromes',
    diagnosticCode: '6847',
    bodySystem: 'Respiratory',
    ratingLevels: [
      {
        percentage: 0,
        description: 'Asymptomatic but with documented sleep disorder breathing.',
        keywords: ['asymptomatic', 'documented disorder', 'no treatment needed'],
        examTips: ['Rare - most diagnosed cases have symptoms'],
      },
      {
        percentage: 30,
        description: 'Persistent day-time hypersomnolence.',
        keywords: ['daytime sleepiness', 'hypersomnolence', 'persistent fatigue'],
        examTips: [
          'Document how sleepiness affects work and driving',
          'Mention any accidents or near-accidents due to fatigue',
        ],
      },
      {
        percentage: 50,
        description: 'Requires use of breathing assistance device such as CPAP machine.',
        keywords: ['CPAP', 'BiPAP', 'breathing assistance device', 'required treatment'],
        examTips: [
          'Bring CPAP compliance records',
          'Mention if you need CPAP but cannot tolerate it',
          'Document usage statistics from machine',
        ],
      },
      {
        percentage: 100,
        description: 'Chronic respiratory failure with carbon dioxide retention or cor pulmonale, or requires tracheostomy.',
        keywords: ['respiratory failure', 'CO2 retention', 'cor pulmonale', 'tracheostomy'],
        examTips: ['Requires severe complications of sleep apnea'],
      },
    ],
    generalTips: [
      'Bring sleep study results to exam',
      'Provide CPAP compliance data if available',
      'Describe daytime symptoms: fatigue, difficulty concentrating',
      'Mention any cardiac issues related to sleep apnea',
      'If prescribed CPAP, this warrants minimum 50% rating',
    ],
  },

  // Migraines - DC 8100
  {
    conditionId: 'migraines',
    conditionName: 'Migraine Headaches',
    diagnosticCode: '8100',
    bodySystem: 'Neurological',
    ratingLevels: [
      {
        percentage: 0,
        description: 'With less frequent attacks.',
        keywords: ['infrequent', 'rare attacks', 'mild headaches'],
        examTips: ['Track frequency and severity of all headaches'],
      },
      {
        percentage: 10,
        description: 'With characteristic prostrating attacks averaging one in 2 months over the last several months.',
        keywords: ['prostrating', 'one every 2 months', 'debilitating occasionally'],
        examTips: ['Document each prostrating attack'],
      },
      {
        percentage: 30,
        description: 'With characteristic prostrating attacks occurring on an average once a month over the last several months.',
        keywords: ['monthly prostrating attacks', 'once per month', 'regular debilitating attacks'],
        examTips: [
          'Keep a headache diary',
          'Document work missed due to migraines',
        ],
      },
      {
        percentage: 50,
        description: 'With very frequent completely prostrating and prolonged attacks productive of severe economic inadaptability.',
        keywords: ['very frequent', 'prolonged attacks', 'severe economic impact', 'cannot work', 'prostrating'],
        examTips: [
          'Document economic impact - missed work, lost jobs',
          'Describe duration of attacks (hours/days)',
          'Explain what "prostrating" means for you',
          'Mention if you must lie down in dark room',
        ],
      },
    ],
    generalTips: [
      '"Prostrating" means you MUST lie down and cannot function',
      'Keep a detailed headache diary with dates, duration, severity',
      'Document medications tried and their effectiveness',
      'Track work missed and economic impact',
      'Describe associated symptoms: nausea, light/sound sensitivity',
    ],
  },

  // Tinnitus - DC 6260
  {
    conditionId: 'tinnitus',
    conditionName: 'Tinnitus',
    diagnosticCode: '6260',
    bodySystem: 'Ear',
    ratingLevels: [
      {
        percentage: 10,
        description: 'Recurrent tinnitus. This is the maximum schedular rating for tinnitus.',
        keywords: ['recurrent', 'ringing', 'buzzing', 'maximum rating'],
        examTips: [
          'Describe the sound: ringing, buzzing, hissing, etc.',
          'Explain impact on concentration and sleep',
        ],
      },
    ],
    generalTips: [
      '10% is the MAXIMUM rating for tinnitus',
      'You receive ONE rating regardless of whether in one or both ears',
      'Tinnitus is often secondary to hearing loss',
      'Describe how it affects sleep and concentration',
      'Can be rated with hearing loss as separate conditions',
    ],
  },
];

export function getRatingCriteriaByCondition(conditionId: string): RatingCriteria | undefined {
  return ratingCriteriaData.find(c => c.conditionId === conditionId);
}

export function getRatingCriteriaByDiagnosticCode(code: string): RatingCriteria | undefined {
  return ratingCriteriaData.find(c => c.diagnosticCode.includes(code));
}

export function getAllRatingCriteria(): RatingCriteria[] {
  return ratingCriteriaData;
}
