export interface DBQReference {
  id: string;
  name: string;
  vaFormNumber: string;
  conditions: string[];
  keyFindings: string[];
  tips: string[];
}

export const DBQ_REFERENCES: DBQReference[] = [
  {
    id: 'ptsd',
    name: 'PTSD (Post-Traumatic Stress Disorder)',
    vaFormNumber: '21-0960P-3',
    conditions: ['PTSD', 'Anxiety', 'Depression', 'MST'],
    keyFindings: [
      'Stressor verification',
      'Frequency of symptoms',
      'Occupational impairment',
      'Social impairment',
      'GAF score (if provided)'
    ],
    tips: [
      'Document specific stressor events with dates',
      'Describe how symptoms affect daily life',
      'Note any hospitalizations or crisis events',
      'Include buddy statements if available'
    ]
  },
  {
    id: 'back',
    name: 'Back (Thoracolumbar Spine)',
    vaFormNumber: '21-0960M-14',
    conditions: ['Degenerative Disc Disease', 'Herniated Disc', 'Spinal Stenosis', 'Lumbago'],
    keyFindings: [
      'Range of motion measurements',
      'Pain on movement',
      'Flare-up frequency and duration',
      'Functional loss during flare-ups',
      'IVDS (Intervertebral Disc Syndrome) episodes'
    ],
    tips: [
      'Request testing during a flare-up if possible',
      'Document ALL activities affected (bending, lifting, sitting)',
      'Note any radiculopathy symptoms',
      'Get imaging (MRI/X-ray) before exam'
    ]
  },
  {
    id: 'knee',
    name: 'Knee and Lower Leg',
    vaFormNumber: '21-0960M-9',
    conditions: ['Knee Strain', 'Meniscus Tear', 'Arthritis', 'Instability'],
    keyFindings: [
      'Range of motion (flexion/extension)',
      'Instability tests',
      'Pain on weight bearing',
      'Meniscal conditions',
      'Surgical history'
    ],
    tips: [
      'Document clicking, popping, or giving way',
      'Note use of braces or assistive devices',
      'Describe impact on walking, stairs, standing'
    ]
  },
  {
    id: 'tinnitus',
    name: 'Tinnitus',
    vaFormNumber: '21-0960N-1',
    conditions: ['Tinnitus', 'Ringing in Ears'],
    keyFindings: [
      'Onset date and circumstances',
      'Constant vs intermittent',
      'Impact on concentration/sleep'
    ],
    tips: [
      'Rated at 10% - highest schedular rating',
      'Document noise exposure during service',
      'Note impact on sleep and concentration',
      'Can be claimed secondary to hearing loss'
    ]
  },
  {
    id: 'hearing',
    name: 'Hearing Loss',
    vaFormNumber: '21-0960N-1',
    conditions: ['Hearing Loss', 'Sensorineural Hearing Loss'],
    keyFindings: [
      'Audiometric test results',
      'Speech recognition scores',
      'Comparison to entry hearing test'
    ],
    tips: [
      'Get private audiogram before C&P exam',
      'Document MOS and noise exposure',
      'Note any ear infections or injuries in service'
    ]
  },
  {
    id: 'sleep-apnea',
    name: 'Sleep Apnea',
    vaFormNumber: '21-0960I-2',
    conditions: ['Obstructive Sleep Apnea', 'Central Sleep Apnea'],
    keyFindings: [
      'Sleep study results (AHI score)',
      'CPAP requirement',
      'Oxygen saturation levels'
    ],
    tips: [
      'Must have sleep study diagnosis',
      '50% rating requires CPAP use',
      'Often claimed secondary to PTSD, sinusitis, or weight gain',
      'Get buddy statements about snoring/gasping'
    ]
  },
  {
    id: 'migraines',
    name: 'Headaches/Migraines',
    vaFormNumber: '21-0960C-8',
    conditions: ['Migraine', 'Tension Headache', 'Cluster Headache'],
    keyFindings: [
      'Frequency of headaches',
      'Duration of each episode',
      'Prostrating attacks per month',
      'Economic inadaptability'
    ],
    tips: [
      'Keep a headache diary with dates/duration',
      'Document missed work days',
      '50% requires prostrating attacks + economic impact',
      'Note triggers and treatments tried'
    ]
  },
  {
    id: 'gerd',
    name: 'GERD/Esophageal Conditions',
    vaFormNumber: '21-0960G-2',
    conditions: ['GERD', 'Hiatal Hernia', 'Esophagitis'],
    keyFindings: [
      'Symptoms: heartburn, regurgitation, dysphagia',
      'Substernal pain',
      'Weight loss',
      'Anemia'
    ],
    tips: [
      'Often secondary to medications (NSAIDs)',
      'Document frequency and severity of symptoms',
      'Note any Barrett\'s esophagus if present'
    ]
  }
];
