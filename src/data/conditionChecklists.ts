// Condition-specific checklists for VA claims
// Includes required forms, recommended evidence, exam questions, and secondary conditions

export interface ChecklistItem {
  item: string;
  required: boolean;
  description?: string;
}

export interface ConditionChecklist {
  name: string;
  diagnosticCode: string;
  requiredForms: ChecklistItem[];
  recommendedEvidence: ChecklistItem[];
  examQuestions: string[];
  secondaryConditions: { name: string; connection: string }[];
  tips: string[];
}

export const conditionChecklists: Record<string, ConditionChecklist> = {
  'tinnitus': {
    name: 'Tinnitus',
    diagnosticCode: '6260',
    requiredForms: [
      { item: 'VA Form 21-526EZ (Application for Disability Compensation)', required: true },
      { item: 'VA Form 21-4138 (Statement in Support of Claim)', required: false, description: 'Personal statement about onset and symptoms' },
    ],
    recommendedEvidence: [
      { item: 'Noise exposure documentation', required: true, description: 'MOS/AFSC records showing noise exposure' },
      { item: 'Audiogram results', required: false },
      { item: 'Buddy statement about noise exposure', required: false },
      { item: 'Statement about symptom onset during service', required: true },
    ],
    examQuestions: [
      'When did the ringing start?',
      'Is it constant or intermittent?',
      'Which ear(s) are affected?',
      'Were you exposed to loud noise during service?',
      'Does it affect your sleep or concentration?',
    ],
    secondaryConditions: [
      { name: 'Hearing Loss', connection: 'Often occurs together from same noise exposure' },
      { name: 'Anxiety', connection: 'Constant ringing can cause anxiety' },
      { name: 'Insomnia', connection: 'Tinnitus commonly disrupts sleep' },
      { name: 'Depression', connection: 'Chronic tinnitus linked to depression' },
    ],
    tips: [
      'Tinnitus is often granted as a presumptive condition for combat veterans',
      'Maximum rating is 10%, but secondary conditions can add more',
      'Keep a log of how tinnitus affects your daily life',
    ],
  },

  'lumbar': {
    name: 'Lumbar Spine Conditions',
    diagnosticCode: '5237/5242/5243',
    requiredForms: [
      { item: 'VA Form 21-526EZ', required: true },
      { item: 'VA Form 21-4138 (Personal Statement)', required: false },
      { item: 'VA Form 21-0781 (for PTSD secondary claims)', required: false },
    ],
    recommendedEvidence: [
      { item: 'Service Treatment Records showing back complaints', required: true },
      { item: 'MRI or X-ray results', required: false, description: 'Shows structural abnormalities' },
      { item: 'Physical therapy records', required: false },
      { item: 'Nexus letter from doctor', required: false, description: 'Crucial for service connection' },
      { item: 'Buddy statement about injury/symptoms', required: false },
      { item: 'Documentation of physical job duties in service', required: true },
    ],
    examQuestions: [
      'When did back pain first start?',
      'What was the initial injury or cause?',
      'Can you bend forward? How far?',
      'Does pain radiate to your legs?',
      'How many flare-ups per year?',
      'Have you had incapacitating episodes requiring bed rest?',
      'What treatments have you tried?',
    ],
    secondaryConditions: [
      { name: 'Radiculopathy', connection: 'Nerve compression from spine issues' },
      { name: 'Sciatica', connection: 'Nerve pain down the leg' },
      { name: 'Erectile Dysfunction', connection: 'Can be caused by nerve damage or medications' },
      { name: 'Depression', connection: 'Chronic pain commonly causes depression' },
      { name: 'Hip Pain', connection: 'Compensating gait causes hip problems' },
    ],
    tips: [
      'You can get a separate rating for radiculopathy in EACH leg',
      "Don't stretch before the exam - show your actual limitation",
      'Describe your WORST flare-up days, not average days',
      'Incapacitating episodes (bed rest prescribed by doctor) = higher IVDS rating',
    ],
  },

  'ptsd': {
    name: 'PTSD / Mental Health',
    diagnosticCode: '9411',
    requiredForms: [
      { item: 'VA Form 21-526EZ', required: true },
      { item: 'VA Form 21-0781 (Statement in Support of Claim for PTSD)', required: true },
      { item: 'VA Form 21-0781a (for MST claims)', required: false, description: 'If related to Military Sexual Trauma' },
      { item: 'VA Form 21-4138 (Personal Statement)', required: false },
    ],
    recommendedEvidence: [
      { item: 'Mental health treatment records', required: true },
      { item: 'Stressor verification (combat, incident reports)', required: true },
      { item: 'Buddy statements about behavior changes', required: false },
      { item: 'Personal journal/diary entries', required: false },
      { item: 'Marriage/relationship records showing impact', required: false },
      { item: 'Employment records showing difficulties', required: false },
    ],
    examQuestions: [
      'What traumatic event(s) occurred?',
      'How often do you have nightmares?',
      'Do you have flashbacks? Describe them.',
      'Do you avoid crowds, places, or situations?',
      'How does this affect your relationships?',
      'How does this affect your work?',
      'Any suicidal thoughts (past or present)?',
    ],
    secondaryConditions: [
      { name: 'Depression', connection: 'Commonly co-occurs with PTSD' },
      { name: 'Anxiety', connection: 'Hypervigilance and worry' },
      { name: 'Sleep Apnea', connection: 'Studies link PTSD to sleep apnea' },
      { name: 'Hypertension', connection: 'Chronic stress affects blood pressure' },
      { name: 'GERD', connection: 'Stress and medications cause stomach issues' },
      { name: 'Substance Abuse', connection: 'Self-medicating is common' },
    ],
    tips: [
      'Be completely honest about your symptoms',
      'Describe your WORST days, not when you\'re coping well',
      'Combat veterans have relaxed stressor verification requirements',
      'MST claims have special evidence considerations',
    ],
  },

  'sleep': {
    name: 'Sleep Apnea',
    diagnosticCode: '6847',
    requiredForms: [
      { item: 'VA Form 21-526EZ', required: true },
      { item: 'VA Form 21-4138 (Personal Statement)', required: false },
    ],
    recommendedEvidence: [
      { item: 'Sleep study results showing diagnosis', required: true },
      { item: 'CPAP prescription', required: true, description: 'CPAP use = automatic 50% rating' },
      { item: 'CPAP compliance data', required: false },
      { item: 'Buddy/spouse statement about snoring/apnea episodes', required: false },
      { item: 'In-service symptoms (snoring, fatigue complaints)', required: true },
      { item: 'Nexus letter linking to service or secondary condition', required: false },
    ],
    examQuestions: [
      'When were you first diagnosed?',
      'Do you use a CPAP machine?',
      'How many hours do you use CPAP per night?',
      'Do you experience daytime sleepiness?',
      'Does your spouse/partner report that you stop breathing at night?',
    ],
    secondaryConditions: [
      { name: 'Hypertension', connection: 'Sleep apnea directly causes high blood pressure' },
      { name: 'Heart Disease', connection: 'Oxygen deprivation affects the heart' },
      { name: 'Diabetes Type 2', connection: 'Sleep apnea linked to insulin resistance' },
      { name: 'Depression', connection: 'Poor sleep affects mental health' },
      { name: 'Erectile Dysfunction', connection: 'Oxygen deprivation affects function' },
    ],
    tips: [
      'CPAP use = automatic 50% rating',
      'Keep track of CPAP compliance hours',
      'Often claimed secondary to PTSD, weight gain, or other conditions',
      'Describe daytime fatigue and how it affects daily activities',
    ],
  },

  'migraine': {
    name: 'Migraine Headaches',
    diagnosticCode: '8100',
    requiredForms: [
      { item: 'VA Form 21-526EZ', required: true },
      { item: 'VA Form 21-4138 (Personal Statement)', required: false },
    ],
    recommendedEvidence: [
      { item: 'Migraine log with dates, duration, severity', required: true },
      { item: 'Medication records', required: false },
      { item: 'ER visits for severe migraines', required: false },
      { item: 'Missed work documentation', required: false, description: 'For 50% rating' },
      { item: 'In-service treatment for headaches', required: true },
      { item: 'Buddy statements about migraine episodes', required: false },
    ],
    examQuestions: [
      'How often do you get migraines?',
      'How long do they last?',
      'Are any prostrating (must lie down, can\'t function)?',
      'What symptoms accompany them (aura, nausea, etc.)?',
      'Do you miss work due to migraines?',
      'What medications do you take?',
    ],
    secondaryConditions: [
      { name: 'Anxiety', connection: 'Chronic pain causes anxiety' },
      { name: 'Depression', connection: 'Chronic pain linked to depression' },
      { name: 'Insomnia', connection: 'Pain disrupts sleep' },
      { name: 'GERD', connection: 'Migraine medications can cause stomach issues' },
    ],
    tips: [
      'PROSTRATING means you MUST lie down and cannot function',
      'Keep a detailed migraine log - frequency is key',
      '50% requires "severe economic inadaptability" - document missed work',
      'Note all symptoms: aura, nausea, light/sound sensitivity',
    ],
  },
};

export function getConditionChecklist(conditionName: string): ConditionChecklist | null {
  const name = conditionName.toLowerCase();
  
  if (name.includes('tinnitus') || name.includes('ringing')) {
    return conditionChecklists['tinnitus'];
  }
  if (name.includes('back') || name.includes('lumbar') || name.includes('spine') || name.includes('disc')) {
    return conditionChecklists['lumbar'];
  }
  if (name.includes('ptsd') || name.includes('anxiety') || name.includes('depression') || name.includes('mental')) {
    return conditionChecklists['ptsd'];
  }
  if (name.includes('sleep') || name.includes('apnea')) {
    return conditionChecklists['sleep'];
  }
  if (name.includes('migraine') || name.includes('headache')) {
    return conditionChecklists['migraine'];
  }
  
  return null;
}
