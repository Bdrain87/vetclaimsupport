// C&P Exam Preparation Data - Condition-Specific Guidance
// This data helps veterans prepare for their Compensation & Pension exams

export interface ExamPrepCategory {
  id: string;
  name: string;
  conditions: string[];
}

export interface ExamPrepData {
  category: string;
  whatToExpect: string[];
  symptomTips: string[];
  documentsTouring: string[];
  mistakesToAvoid: string[];
  examinerQuestions: string[];
}

// Categories for grouping conditions
export const examCategories: ExamPrepCategory[] = [
  {
    id: 'mental-health',
    name: 'Mental Health',
    conditions: ['PTSD', 'Depression', 'Anxiety', 'Bipolar Disorder', 'Insomnia', 'Adjustment Disorder'],
  },
  {
    id: 'musculoskeletal',
    name: 'Musculoskeletal',
    conditions: ['Lower Back Pain', 'Neck Pain', 'Knee Condition', 'Shoulder Condition', 'Hip Condition', 'Ankle Condition', 'Degenerative Disc Disease', 'Arthritis'],
  },
  {
    id: 'hearing',
    name: 'Hearing',
    conditions: ['Tinnitus', 'Hearing Loss', 'Meniere\'s Disease'],
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    conditions: ['Sleep Apnea', 'Asthma', 'Sinusitis', 'COPD'],
  },
  {
    id: 'neurological',
    name: 'Neurological',
    conditions: ['Migraines', 'TBI', 'Radiculopathy', 'Peripheral Neuropathy', 'Vertigo'],
  },
  {
    id: 'digestive',
    name: 'Digestive',
    conditions: ['GERD', 'IBS', 'Hiatal Hernia'],
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    conditions: ['Hypertension', 'Heart Condition', 'CAD'],
  },
  {
    id: 'skin',
    name: 'Skin',
    conditions: ['Eczema', 'Psoriasis', 'Scars', 'Chloracne'],
  },
];

// Condition-specific exam prep data
export const examPrepData: Record<string, ExamPrepData> = {
  // ===== MENTAL HEALTH =====
  'PTSD': {
    category: 'Mental Health',
    whatToExpect: [
      'The examiner will ask about your stressor event(s) and when they occurred',
      'Expect questions about symptoms like flashbacks, nightmares, and hypervigilance',
      'The exam typically lasts 30-60 minutes with a mental health professional',
      'You may be asked to complete questionnaires (PCL-5) before or during the exam',
      'The examiner will assess social and occupational impairment',
    ],
    symptomTips: [
      'Describe your WORST episodes, not your average days',
      'Be specific about frequency: "I have nightmares 4-5 times per week"',
      'Explain how symptoms affect work: missed days, conflicts, difficulty concentrating',
      'Mention avoidance behaviors: places, people, or situations you avoid',
      'Describe relationship impacts: isolation, irritability with family',
      'Include physical symptoms: sleep problems, startle response, hypervigilance',
    ],
    documentsTouring: [
      'Service treatment records documenting the stressor event',
      'Buddy statements from those who witnessed changes in you',
      'Mental health treatment records and therapy notes',
      'List of all medications and dosages for mental health',
      'Personal statement describing your stressor and its impact',
      'Any civilian treatment records post-service',
    ],
    mistakesToAvoid: [
      'Don\'t minimize symptoms by saying "I\'m fine" or "I deal with it"',
      'Don\'t just describe good days - the VA rates on your worst days',
      'Avoid saying you "used to" have symptoms if they still occur',
      'Don\'t leave out symptoms you find embarrassing (anger, nightmares, etc.)',
      'Don\'t skip the exam - it will result in a denial',
      'Don\'t pretend to be worse than you are - be honest but thorough',
    ],
    examinerQuestions: [
      'Tell me about the traumatic event(s) you experienced',
      'How often do you have nightmares or flashbacks?',
      'Do you avoid certain places, people, or activities? Why?',
      'How would you describe your relationships with family and friends?',
      'Have you had thoughts of hurting yourself or others?',
      'How does PTSD affect your ability to work?',
      'Do you startle easily? Give examples',
      'How many hours of sleep do you get? What interrupts it?',
      'Do you feel constantly on guard or hypervigilant?',
      'How often do you feel detached or emotionally numb?',
    ],
  },
  'Depression': {
    category: 'Mental Health',
    whatToExpect: [
      'A mental health professional will conduct a clinical interview',
      'Expect questionnaires like PHQ-9 to assess severity',
      'The examiner will evaluate functional impairment at work and home',
      'Questions about suicidal ideation are standard - answer honestly',
      'The exam typically lasts 30-45 minutes',
    ],
    symptomTips: [
      'Be specific about duration: "I\'ve felt this way for 3+ years"',
      'Describe impact on daily activities: hygiene, eating, leaving the house',
      'Mention cognitive symptoms: concentration problems, memory issues',
      'Include physical symptoms: fatigue, sleep changes, appetite changes',
      'Explain occupational impact: missed work, reduced performance',
      'Describe social withdrawal and isolation patterns',
    ],
    documentsTouring: [
      'Mental health treatment records and therapy notes',
      'Prescription history for antidepressants',
      'Buddy statements describing changes they\'ve observed',
      'Any hospitalization records for mental health',
      'Work records showing missed days or performance issues',
    ],
    mistakesToAvoid: [
      'Don\'t say you\'re "doing better" if symptoms persist',
      'Don\'t minimize symptoms to appear strong',
      'Avoid one-word answers - explain and give examples',
      'Don\'t forget to mention how medication side effects impact you',
      'Don\'t hide suicidal thoughts from the examiner',
    ],
    examinerQuestions: [
      'How long have you experienced depressive symptoms?',
      'Describe a typical day for you',
      'How often do you feel sad, hopeless, or empty?',
      'Have you had thoughts of suicide or self-harm?',
      'How is your sleep? Appetite?',
      'Do you have difficulty concentrating or making decisions?',
      'How does depression affect your work performance?',
      'Have you lost interest in activities you once enjoyed?',
      'How are your relationships with family and friends?',
    ],
  },
  'Anxiety': {
    category: 'Mental Health',
    whatToExpect: [
      'Clinical interview with a mental health professional',
      'May complete anxiety assessment questionnaires (GAD-7)',
      'Questions about panic attacks, worry patterns, and avoidance',
      'Physical symptoms of anxiety will be assessed',
      'Exam typically lasts 30-45 minutes',
    ],
    symptomTips: [
      'Describe panic attack frequency and symptoms in detail',
      'Explain constant worry: what you worry about, how often',
      'Include physical symptoms: racing heart, sweating, trembling',
      'Mention avoidance behaviors: situations, places, activities',
      'Describe impact on sleep and concentration',
      'Explain how anxiety affects work and relationships',
    ],
    documentsTouring: [
      'Mental health treatment records',
      'Prescription history for anti-anxiety medications',
      'Records of panic attacks or ER visits',
      'Buddy statements about observable anxiety symptoms',
    ],
    mistakesToAvoid: [
      'Don\'t downplay panic attacks or anxiety episodes',
      'Don\'t say "I manage it" without explaining the struggle',
      'Avoid hiding avoidance behaviors - they\'re important symptoms',
      'Don\'t forget physical symptoms like GI issues, headaches',
    ],
    examinerQuestions: [
      'What triggers your anxiety?',
      'How often do you experience anxiety symptoms?',
      'Have you had panic attacks? Describe them',
      'Do you avoid certain situations due to anxiety?',
      'How does anxiety affect your sleep?',
      'Does anxiety impact your ability to work?',
      'What physical symptoms do you experience?',
      'How do you cope with anxiety episodes?',
    ],
  },

  // ===== MUSCULOSKELETAL =====
  'Lower Back Pain': {
    category: 'Musculoskeletal',
    whatToExpect: [
      'Range of motion testing with a goniometer (measures angles)',
      'You\'ll be asked to bend forward, backward, and side-to-side',
      'The examiner will check for muscle spasms and tenderness',
      'Neurological tests for radiculopathy (leg symptoms)',
      'Questions about flare-ups, their frequency and duration',
      'The exam typically lasts 20-40 minutes',
    ],
    symptomTips: [
      'DON\'T push through pain during range of motion tests - stop when it hurts',
      'Describe pain on your WORST days, not average days',
      'Be specific: "My flare-ups happen 3-4 times per month and last 2-3 days"',
      'Mention if pain radiates to legs (radiculopathy = additional rating)',
      'Describe impact on activities: standing, sitting, walking, lifting',
      'Include secondary symptoms: muscle spasms, numbness, tingling',
      'Mention if you use assistive devices (cane, brace, lumbar support)',
    ],
    documentsTouring: [
      'MRI or X-ray reports showing disc/spine issues',
      'Physical therapy records',
      'Chiropractic treatment records',
      'Prescription history for pain medications',
      'Records of any back surgeries or injections',
      'Buddy statements about limitations they\'ve witnessed',
    ],
    mistakesToAvoid: [
      'DON\'T try to show you can still do things - demonstrate limitations',
      'Don\'t take extra pain medication before the exam',
      'Don\'t say "I can usually bend" - describe your worst capability',
      'Avoid hiding the use of assistive devices',
      'Don\'t forget to mention incapacitating episodes (bed rest)',
      'Don\'t mask pain - wince, stop when it hurts',
    ],
    examinerQuestions: [
      'When did your back pain start?',
      'What makes it better or worse?',
      'How far can you walk before needing to stop?',
      'How long can you sit or stand?',
      'Do you have pain, numbness, or tingling in your legs?',
      'How many flare-ups do you have per month?',
      'Have you had any incapacitating episodes requiring bed rest?',
      'What activities can you no longer do because of your back?',
      'Do you use any assistive devices?',
    ],
  },
  'Knee Condition': {
    category: 'Musculoskeletal',
    whatToExpect: [
      'Range of motion testing (flexion and extension)',
      'Stability testing for ligament damage',
      'You may be asked to walk, squat, or climb stairs',
      'The examiner will check for swelling, tenderness, and crepitus',
      'Questions about instability, giving way, and locking',
    ],
    symptomTips: [
      'Stop movement when pain begins - don\'t push through',
      'Describe instability: "My knee gives out about 2 times per week"',
      'Mention if you use a brace and how often',
      'Include impact on daily activities: stairs, kneeling, walking',
      'Describe flare-up frequency and what triggers them',
      'Mention any locking or clicking of the knee',
    ],
    documentsTouring: [
      'MRI reports showing ligament or cartilage damage',
      'X-rays showing arthritis or bone spurs',
      'Surgical records if applicable',
      'Physical therapy records',
      'Records of knee injections',
    ],
    mistakesToAvoid: [
      'Don\'t pretend you can walk farther than you can',
      'Avoid saying the brace is "just for support"',
      'Don\'t forget to mention episodes of giving way',
      'Don\'t hide your limp or altered gait',
    ],
    examinerQuestions: [
      'How did your knee condition begin?',
      'Does your knee lock or give way?',
      'Can you go up and down stairs normally?',
      'How far can you walk without pain?',
      'Do you wear a brace? How often?',
      'Have you had any falls due to your knee?',
      'What activities have you had to stop doing?',
    ],
  },
  'Shoulder Condition': {
    category: 'Musculoskeletal',
    whatToExpect: [
      'Range of motion testing in multiple directions',
      'Strength testing of the shoulder',
      'The examiner will check for impingement and instability',
      'You may be asked to reach overhead and behind your back',
      'Questions about dislocation history and flare-ups',
    ],
    symptomTips: [
      'Stop movement at the point of pain',
      'Describe activities you can\'t do: reaching overhead, lifting',
      'Mention sleep disturbances due to shoulder pain',
      'Include any dislocation or subluxation history',
      'Describe impact on work duties and daily activities',
    ],
    documentsTouring: [
      'MRI or X-ray reports',
      'Surgical records (rotator cuff repair, etc.)',
      'Physical therapy records',
      'Injection records',
    ],
    mistakesToAvoid: [
      'Don\'t force your arm to move farther than comfortable',
      'Don\'t minimize sleep disruption from shoulder pain',
      'Avoid saying you "manage" with modifications',
    ],
    examinerQuestions: [
      'When did your shoulder problems begin?',
      'Have you had any dislocations?',
      'Can you reach overhead? Behind your back?',
      'Does the pain wake you at night?',
      'What activities are limited by your shoulder?',
      'Have you had any surgeries on this shoulder?',
    ],
  },

  // ===== HEARING =====
  'Tinnitus': {
    category: 'Hearing',
    whatToExpect: [
      'The examiner will ask about the nature and history of your tinnitus',
      'No special equipment is typically needed for tinnitus alone',
      'Often combined with a hearing test (audiogram)',
      'Questions about onset, consistency, and impact',
      'The exam is usually brief (15-20 minutes)',
    ],
    symptomTips: [
      'Describe the sound: ringing, buzzing, hissing, roaring',
      'Specify if it\'s constant or intermittent',
      'Explain impact on concentration and sleep',
      'Mention if it affects your ability to hear conversations',
      'Describe any related headaches or dizziness',
      'Connect it to noise exposure during service',
    ],
    documentsTouring: [
      'Service records showing noise exposure (MOS, weapon qualification)',
      'Audiograms from during and after service',
      'Buddy statements confirming noise exposure',
      'Any treatment records for tinnitus',
    ],
    mistakesToAvoid: [
      'Don\'t say it\'s "not that bad" - describe the full impact',
      'Don\'t forget to mention if it\'s in one or both ears',
      'Avoid minimizing how it affects sleep and concentration',
      'Don\'t underestimate when asked about frequency',
    ],
    examinerQuestions: [
      'When did you first notice the ringing?',
      'Is it constant or does it come and go?',
      'Which ear(s) is affected?',
      'What does it sound like?',
      'What noise exposure did you have in service?',
      'Does it affect your sleep or concentration?',
      'Have you tried any treatments?',
    ],
  },
  'Hearing Loss': {
    category: 'Hearing',
    whatToExpect: [
      'Full audiological examination in a soundproof booth',
      'You\'ll wear headphones and respond to various tones',
      'Speech recognition testing',
      'The audiologist will measure hearing at different frequencies',
      'Exam takes about 30-45 minutes',
    ],
    symptomTips: [
      'Don\'t guess if you don\'t hear the tone - only respond when you\'re sure',
      'Mention difficulty hearing in crowds or background noise',
      'Describe if you need to ask people to repeat themselves',
      'Include any use of hearing aids',
      'Explain impact on work and social situations',
    ],
    documentsTouring: [
      'Service audiograms (entrance and exit)',
      'Records of noise exposure during service',
      'Current audiograms',
      'Hearing aid prescription if applicable',
    ],
    mistakesToAvoid: [
      'Don\'t respond to tones you\'re not sure you heard',
      'Don\'t try to lip-read during speech testing',
      'Avoid saying hearing loss doesn\'t bother you',
    ],
    examinerQuestions: [
      'What type of noise were you exposed to in service?',
      'Did you wear hearing protection?',
      'When did you first notice hearing difficulty?',
      'Do you wear hearing aids?',
      'Do you have trouble hearing in crowds?',
      'Does anyone complain that you have the TV too loud?',
    ],
  },

  // ===== RESPIRATORY =====
  'Sleep Apnea': {
    category: 'Respiratory',
    whatToExpect: [
      'The examiner will review your sleep study results',
      'Questions about CPAP use, compliance, and effectiveness',
      'Discussion of symptoms before and after treatment',
      'The exam is primarily interview-based (20-30 minutes)',
      'You may be asked about daytime sleepiness and fatigue',
    ],
    symptomTips: [
      'Bring your CPAP compliance report (download from machine or app)',
      'Describe symptoms BEFORE treatment: severe fatigue, falling asleep driving',
      'Explain ongoing issues DESPITE treatment',
      'Mention any secondary conditions: hypertension, depression',
      'Describe impact on work and daily life when untreated or non-compliant',
      'Include witness statements about snoring/breathing cessation',
    ],
    documentsTouring: [
      'Sleep study (polysomnography) report showing AHI',
      'CPAP prescription and compliance data',
      'Treatment records from sleep specialist',
      'Buddy statement from spouse/partner about symptoms',
      'Records of any related conditions (hypertension, fatigue)',
    ],
    mistakesToAvoid: [
      'Don\'t say CPAP "fixed everything" - describe ongoing limitations',
      'Don\'t forget to bring CPAP compliance data',
      'Avoid minimizing pre-treatment symptoms',
      'Don\'t hide CPAP non-compliance - explain the reasons',
    ],
    examinerQuestions: [
      'When were you diagnosed with sleep apnea?',
      'What was your AHI on the sleep study?',
      'Do you use a CPAP? How many hours per night?',
      'What symptoms did you have before treatment?',
      'Do you still have symptoms despite CPAP use?',
      'Does sleep apnea affect your work or driving?',
      'Have you ever fallen asleep while driving?',
      'Who witnessed your snoring or breathing pauses?',
    ],
  },
  'Asthma': {
    category: 'Respiratory',
    whatToExpect: [
      'Pulmonary function testing (PFT) - you\'ll breathe into a machine',
      'Questions about frequency of attacks and medication use',
      'The examiner will listen to your lungs',
      'Discussion about triggers and hospitalization history',
    ],
    symptomTips: [
      'Describe attack frequency and severity',
      'List all inhalers and how often you use them',
      'Mention any ER visits or hospitalizations',
      'Explain triggers and how they limit activities',
      'Include impact on exercise and physical activities',
    ],
    documentsTouring: [
      'Pulmonary function test results',
      'Prescription history for inhalers and steroids',
      'ER or hospital records for asthma attacks',
      'Allergy testing results if applicable',
    ],
    mistakesToAvoid: [
      'Don\'t take extra bronchodilator before PFT',
      'Don\'t understate frequency of rescue inhaler use',
      'Avoid saying asthma is "well controlled" if you have limitations',
    ],
    examinerQuestions: [
      'How often do you have asthma attacks?',
      'What medications do you use daily?',
      'How often do you use your rescue inhaler?',
      'Have you been hospitalized for asthma?',
      'What triggers your asthma?',
      'How does asthma limit your activities?',
    ],
  },

  // ===== NEUROLOGICAL =====
  'Migraines': {
    category: 'Neurological',
    whatToExpect: [
      'Primarily an interview about migraine frequency and severity',
      'Questions about prostrating attacks and their duration',
      'The examiner will ask about treatment effectiveness',
      'Discussion of impact on work and daily activities',
      'Exam typically lasts 20-30 minutes',
    ],
    symptomTips: [
      'Track migraines for 2-3 months before the exam',
      'Use the VA term "prostrating" - unable to function, must lie down',
      'Be specific: "I have 4-5 prostrating migraines per month lasting 6-8 hours"',
      'Describe associated symptoms: nausea, vomiting, light sensitivity',
      'Explain work impact: missed days, reduced productivity',
      'Mention if you\'ve had to leave work during attacks',
    ],
    documentsTouring: [
      'Migraine diary/log showing frequency and severity',
      'Prescription history for migraine medications',
      'Treatment records from neurologist',
      'Work records showing missed days',
      'ER visit records for severe migraines',
    ],
    mistakesToAvoid: [
      'Don\'t call headaches "migraines" unless diagnosed',
      'Avoid underestimating frequency - use your tracking log',
      'Don\'t say medications "work well" if attacks still occur',
      'Don\'t forget to mention if you\'ve missed work',
    ],
    examinerQuestions: [
      'How often do you get migraines?',
      'How long do your migraines typically last?',
      'Are your migraines prostrating (completely debilitating)?',
      'What symptoms accompany your migraines?',
      'What triggers your migraines?',
      'What medications have you tried?',
      'How many work days have you missed due to migraines?',
      'Can you function during a migraine attack?',
    ],
  },
  'TBI': {
    category: 'Neurological',
    whatToExpect: [
      'Cognitive testing may be performed',
      'Questions about the injury event and immediate symptoms',
      'Assessment of current cognitive, emotional, and physical symptoms',
      'Multiple facets evaluated: memory, mood, headaches, etc.',
      'May be combined with mental health and headache exams',
    ],
    symptomTips: [
      'Describe the injury event in detail',
      'Explain cognitive issues: memory, concentration, word-finding',
      'Include emotional changes: irritability, mood swings',
      'Mention physical symptoms: headaches, dizziness, light sensitivity',
      'Describe impact on work and relationships',
    ],
    documentsTouring: [
      'Service records documenting the TBI event',
      'Any imaging (CT, MRI) of the brain',
      'Neuropsychological testing results',
      'Buddy statements about changes after injury',
      'Treatment records from neurologist',
    ],
    mistakesToAvoid: [
      'Don\'t minimize cognitive difficulties',
      'Avoid saying symptoms "come and go" without explaining severity',
      'Don\'t forget to connect current symptoms to the injury',
    ],
    examinerQuestions: [
      'Describe the event that caused your TBI',
      'Did you lose consciousness? For how long?',
      'What symptoms did you have immediately after?',
      'Do you have memory problems now?',
      'How is your concentration?',
      'Do you get headaches? How often?',
      'Have you noticed personality or mood changes?',
      'How does TBI affect your work?',
    ],
  },

  // ===== DIGESTIVE =====
  'GERD': {
    category: 'Digestive',
    whatToExpect: [
      'Interview about symptoms and treatment',
      'Questions about frequency and severity',
      'Discussion of dietary restrictions and lifestyle modifications',
      'Physical exam may include abdominal palpation',
    ],
    symptomTips: [
      'Describe frequency: daily, multiple times per week',
      'Include all symptoms: heartburn, regurgitation, chest pain, cough',
      'Mention sleep disturbances from reflux',
      'Explain dietary restrictions you follow',
      'Describe impact of symptoms on daily life',
    ],
    documentsTouring: [
      'Endoscopy or pH study results',
      'Prescription history for PPIs and other medications',
      'GI specialist treatment records',
    ],
    mistakesToAvoid: [
      'Don\'t say medications "control it" if symptoms persist',
      'Avoid minimizing dietary restrictions',
      'Don\'t forget to mention secondary symptoms like cough or voice changes',
    ],
    examinerQuestions: [
      'How often do you experience reflux symptoms?',
      'What medications are you taking?',
      'Does reflux wake you at night?',
      'What foods do you have to avoid?',
      'Have you had any complications like strictures?',
      'Do you have difficulty swallowing?',
    ],
  },
  'IBS': {
    category: 'Digestive',
    whatToExpect: [
      'Interview about bowel habits and symptoms',
      'Questions about frequency of episodes',
      'Discussion of dietary triggers and restrictions',
      'Impact on work and daily activities',
    ],
    symptomTips: [
      'Be specific about frequency: "3-4 episodes per week"',
      'Describe all symptoms: pain, bloating, diarrhea, constipation',
      'Explain how it impacts work (leaving meetings, missing work)',
      'Mention dietary restrictions and their limitations',
      'Include stress/anxiety connection if applicable',
    ],
    documentsTouring: [
      'GI specialist records and colonoscopy results',
      'Prescription history',
      'Diet logs showing restrictions',
      'Work records showing missed time',
    ],
    mistakesToAvoid: [
      'Don\'t be embarrassed to describe symptoms in detail',
      'Avoid saying it\'s "manageable" if it significantly impacts life',
      'Don\'t forget to mention psychological impact',
    ],
    examinerQuestions: [
      'How often do you have IBS episodes?',
      'Describe your typical symptoms',
      'What foods trigger your symptoms?',
      'How does IBS affect your work?',
      'Do you have to be near a bathroom at all times?',
      'Have you had accidents due to IBS?',
    ],
  },

  // ===== CARDIOVASCULAR =====
  'Hypertension': {
    category: 'Cardiovascular',
    whatToExpect: [
      'Blood pressure measurement (may be multiple readings)',
      'Questions about medication history and dosages',
      'Discussion of any complications',
      'Brief physical exam',
    ],
    symptomTips: [
      'Know your typical blood pressure readings',
      'List all blood pressure medications and dosages',
      'Mention any complications: kidney issues, heart problems',
      'Describe side effects from medications',
    ],
    documentsTouring: [
      'Blood pressure logs',
      'Prescription history showing medication progression',
      'Lab results (kidney function, etc.)',
      'Cardiology records if applicable',
    ],
    mistakesToAvoid: [
      'Don\'t skip medication before the exam to get higher reading',
      'Avoid forgetting to list all medications tried',
      'Don\'t minimize medication side effects',
    ],
    examinerQuestions: [
      'When were you diagnosed with hypertension?',
      'What medications are you taking?',
      'What are your typical blood pressure readings?',
      'Have you had any complications?',
      'Any side effects from medications?',
    ],
  },
};

// General exam tips that apply to all conditions
export const generalExamTips = {
  whatToExpect: [
    'Arrive 15 minutes early with all required documents',
    'C&P exams are conducted by VA doctors OR contracted examiners (QTC, VES, LHI) - both are qualified medical professionals',
    'The exam is to document your current condition, not to treat you',
    'Be honest but thorough - don\'t minimize symptoms',
    'The examiner may not have read your entire file',
    'You can bring someone for support but they usually can\'t speak for you',
  ],
  documentsTouring: [
    'Government-issued ID',
    'List of all current medications with dosages',
    'Copies of relevant medical records',
    'Personal statement describing your condition',
    'Buddy statements from witnesses',
    'Any imaging reports (X-rays, MRIs, etc.)',
    'Symptom tracking logs if you have them',
  ],
  mistakesToAvoid: [
    'Don\'t describe your best days - describe your worst',
    'Never say "I\'m fine" or "I manage okay"',
    'Don\'t push through pain during physical exams',
    'Avoid downplaying symptoms to appear tough',
    'Don\'t skip the exam - it results in denial',
    'Don\'t lie or exaggerate - be honest but thorough',
    'Don\'t forget to mention secondary conditions',
    'Don\'t say a condition doesn\'t bother you if it does',
  ],
  proTips: [
    'Describe symptoms on your worst days, not average days',
    'Be specific: use numbers, frequencies, and durations',
    'If a condition causes other issues, mention ALL of them',
    'The examiner may not read your file - be ready to summarize',
    'Request a copy of the DBQ after your exam',
    'You can file for an increase if your condition worsens',
  ],
};
