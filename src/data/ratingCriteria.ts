export interface RatingLevel {
  percentage: number;
  criteria: string[];
  keywords: string[];
}

export interface RatingCriteria {
  condition: string;
  diagnosticCode: string;
  levels: RatingLevel[];
}

export const RATING_CRITERIA: RatingCriteria[] = [
  {
    condition: 'PTSD / Mental Health',
    diagnosticCode: '9411',
    levels: [
      {
        percentage: 0,
        criteria: ['Diagnosis but no symptoms impair work/social functioning'],
        keywords: ['asymptomatic', 'no impairment', 'controlled']
      },
      {
        percentage: 10,
        criteria: ['Mild symptoms', 'Controlled with medication', 'Occupational and social impairment due to mild or transient symptoms'],
        keywords: ['mild', 'transient', 'controlled', 'medication']
      },
      {
        percentage: 30,
        criteria: ['Occasional decrease in work efficiency', 'Intermittent periods of inability to perform tasks', 'Depressed mood, anxiety, suspiciousness'],
        keywords: ['occasional', 'intermittent', 'depressed mood', 'anxiety', 'suspiciousness', 'panic']
      },
      {
        percentage: 50,
        criteria: ['Reduced reliability and productivity', 'Flattened affect', 'Circumstantial speech', 'Panic attacks more than weekly', 'Difficulty understanding complex commands', 'Impaired judgment', 'Disturbances of motivation and mood', 'Difficulty establishing work/social relationships'],
        keywords: ['reduced reliability', 'flattened affect', 'panic weekly', 'impaired judgment', 'difficulty relationships']
      },
      {
        percentage: 70,
        criteria: ['Deficiencies in most areas', 'Suicidal ideation', 'Obsessional rituals', 'Illogical or obscure speech', 'Near-continuous panic', 'Impaired impulse control', 'Spatial disorientation', 'Neglect of personal hygiene', 'Inability to establish relationships'],
        keywords: ['suicidal', 'obsessional', 'near-continuous panic', 'impulse control', 'disorientation', 'neglect hygiene', 'inability']
      },
      {
        percentage: 100,
        criteria: ['Total occupational and social impairment', 'Gross impairment of thought processes', 'Persistent delusions or hallucinations', 'Danger to self or others', 'Inability to perform basic self-care', 'Disoriented to time or place', 'Memory loss for names/occupation/own name'],
        keywords: ['total impairment', 'delusions', 'hallucinations', 'danger', 'disoriented', 'memory loss own name']
      }
    ]
  },
  {
    condition: 'Lumbar Spine',
    diagnosticCode: '5242',
    levels: [
      {
        percentage: 10,
        criteria: ['Forward flexion greater than 60 degrees but not greater than 85 degrees', 'Combined range of motion greater than 120 but not greater than 235 degrees', 'Muscle spasm, guarding, or localized tenderness not resulting in abnormal gait'],
        keywords: ['flexion 60-85', 'combined 120-235', 'spasm', 'guarding']
      },
      {
        percentage: 20,
        criteria: ['Forward flexion greater than 30 degrees but not greater than 60 degrees', 'Combined range of motion not greater than 120 degrees', 'Muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour'],
        keywords: ['flexion 30-60', 'combined 120', 'abnormal gait', 'abnormal contour']
      },
      {
        percentage: 40,
        criteria: ['Forward flexion 30 degrees or less', 'Favorable ankylosis of entire thoracolumbar spine'],
        keywords: ['flexion 30 or less', 'favorable ankylosis']
      },
      {
        percentage: 50,
        criteria: ['Unfavorable ankylosis of entire thoracolumbar spine'],
        keywords: ['unfavorable ankylosis thoracolumbar']
      },
      {
        percentage: 100,
        criteria: ['Unfavorable ankylosis of entire spine'],
        keywords: ['unfavorable ankylosis entire spine']
      }
    ]
  },
  {
    condition: 'Sleep Apnea',
    diagnosticCode: '6847',
    levels: [
      {
        percentage: 0,
        criteria: ['Asymptomatic but with documented sleep disorder breathing'],
        keywords: ['asymptomatic', 'documented']
      },
      {
        percentage: 30,
        criteria: ['Persistent day-time hypersomnolence'],
        keywords: ['hypersomnolence', 'daytime sleepiness', 'persistent']
      },
      {
        percentage: 50,
        criteria: ['Requires use of breathing assistance device such as CPAP machine'],
        keywords: ['CPAP', 'breathing device', 'BiPAP']
      },
      {
        percentage: 100,
        criteria: ['Chronic respiratory failure with carbon dioxide retention', 'Cor pulmonale', 'Requires tracheostomy'],
        keywords: ['respiratory failure', 'cor pulmonale', 'tracheostomy', 'carbon dioxide']
      }
    ]
  },
  {
    condition: 'Migraine Headaches',
    diagnosticCode: '8100',
    levels: [
      {
        percentage: 0,
        criteria: ['Less frequent attacks'],
        keywords: ['infrequent', 'rare']
      },
      {
        percentage: 10,
        criteria: ['Characteristic prostrating attacks averaging one in 2 months over last several months'],
        keywords: ['one every 2 months', 'prostrating']
      },
      {
        percentage: 30,
        criteria: ['Characteristic prostrating attacks occurring on an average once a month over last several months'],
        keywords: ['monthly', 'once a month', 'prostrating']
      },
      {
        percentage: 50,
        criteria: ['Very frequent completely prostrating and prolonged attacks productive of severe economic inadaptability'],
        keywords: ['very frequent', 'prolonged', 'economic inadaptability', 'severe']
      }
    ]
  },
  {
    condition: 'Tinnitus',
    diagnosticCode: '6260',
    levels: [
      {
        percentage: 10,
        criteria: ['Recurrent tinnitus - maximum schedular rating'],
        keywords: ['recurrent', 'ringing', 'buzzing', 'constant']
      }
    ]
  }
];
