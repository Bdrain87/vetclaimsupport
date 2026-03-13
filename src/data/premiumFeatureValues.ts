/**
 * Contextual value propositions for the upgrade modal.
 * Each premium feature gets a tailored headline, bullets, and urgency message
 * to dramatically improve conversion vs. a generic 4-bullet list.
 *
 * IMPORTANT: Keys MUST match the `featureName` prop passed to <PremiumGuard> in App.tsx.
 */

export interface FeatureValue {
  headline: string;
  bullets: string[];
  urgency?: string;
}

const featureValues: Record<string, FeatureValue> = {
  // ── Claims tools ──────────────────────────────────────────────────────
  'Claim Strategy Wizard': {
    headline: 'Build a winning claim strategy',
    bullets: [
      'Get a step-by-step plan tailored to your conditions',
      'Identify the strongest evidence types for each condition',
      'Know exactly what the VA rater will look for',
    ],
    urgency: 'Veterans with a documented strategy win higher ratings.',
  },
  'Body Map': {
    headline: 'Map every symptom to your body',
    bullets: [
      'Visual documentation the VA can\'t ignore',
      'Track how conditions affect different body areas',
      'Export body map as part of your claim packet',
    ],
  },
  'Bilateral Calculator': {
    headline: 'Don\'t leave money on the table',
    bullets: [
      'The bilateral factor adds up to 10% to your combined rating',
      'Automatically detects qualifying paired conditions',
      'Most veterans miss this — don\'t be one of them',
    ],
    urgency: 'The bilateral factor could mean hundreds more per month.',
  },
  'Secondary Condition Finder': {
    headline: 'Find conditions you didn\'t know you could claim',
    bullets: [
      'AI-powered secondary condition finder based on your primaries',
      'Backed by VA\'s own rating criteria and medical literature',
      'Veterans average 2-3 additional conditions they weren\'t claiming',
    ],
    urgency: 'Each additional condition increases your combined rating.',
  },
  'Evidence Strength': {
    headline: 'Know how strong your claim really is',
    bullets: [
      'See a readiness score for each condition you\'re claiming',
      'Identify the weakest links in your evidence chain',
      'Get specific action items to strengthen your case',
    ],
    urgency: 'Knowing your gaps before filing prevents denials.',
  },
  'Document Vault': {
    headline: 'Secure storage for your VA documents',
    bullets: [
      'Encrypted storage for DD-214, medical records, and more',
      'OCR scanning extracts text from photos',
      'Everything organized and ready for your claim',
    ],
  },

  // ── Health tracking ───────────────────────────────────────────────────
  'Symptom Tracker': {
    headline: 'Build the evidence trail the VA requires',
    bullets: [
      'Daily logs create documented frequency for higher ratings',
      'Track severity, triggers, and impact on daily life',
      'Export months of data as supporting evidence',
    ],
    urgency: 'Consistent symptom logs are one of the strongest evidence types.',
  },
  'Sleep Tracker': {
    headline: 'Document your sleep disturbances',
    bullets: [
      'Sleep conditions are rated under DC 6847',
      'Track frequency to support higher rating brackets',
      'Log apnea events, insomnia episodes, and nightmares',
    ],
  },
  'Migraine Tracker': {
    headline: 'Prove your migraines are prostrating',
    bullets: [
      'A 50% rating requires documented prostrating attacks',
      'Track frequency, duration, and economic impact',
      'Generate reports showing attack patterns over time',
    ],
    urgency: 'The difference between 30% and 50% is $200+/month.',
  },
  'Medication Tracker': {
    headline: 'Document every medication and side effect',
    bullets: [
      'The 2026 VA medication rule requires documented treatment history',
      'Track side effects that may qualify as secondary conditions',
      'Prescription history strengthens your service connection',
    ],
  },
  'Medical Visits': {
    headline: 'Track your treatment history',
    bullets: [
      'The VA looks for ongoing treatment as evidence of severity',
      'Log visits, providers, and findings in one place',
      'Gaps in treatment can lower your rating — don\'t let that happen',
    ],
  },
  'Exposure Tracker': {
    headline: 'Document toxic exposures and hazards',
    bullets: [
      'PACT Act expanded coverage for burn pits, Agent Orange, and more',
      'Link exposures to your conditions for presumptive claims',
      'Track deployment locations and dates',
    ],
  },
  'Health Summary': {
    headline: 'See your complete health picture',
    bullets: [
      'All your tracking data in one comprehensive view',
      'Identify patterns and trends across conditions',
      'Export as evidence for your claim',
    ],
  },
  'Health Timeline': {
    headline: 'Visualize your health journey',
    bullets: [
      'See how symptoms change over time',
      'Identify flare-up patterns and triggers',
      'Show the VA a clear timeline of your condition',
    ],
  },
  'Work Impact': {
    headline: 'Document how conditions affect your work',
    bullets: [
      'Track hours lost, days missed, and accommodations needed',
      'Critical evidence for TDIU claims',
      'Build a documented history of employment impact',
    ],
    urgency: 'Work impact data is the foundation of every TDIU claim.',
  },
  'Health Trends': {
    headline: 'See the patterns in your health data',
    bullets: [
      'Visualize symptom trends across weeks and months',
      'Identify triggers and flare-up patterns',
      'Data-driven insights to support your rating level',
    ],
  },

  // ── Prep tools ────────────────────────────────────────────────────────
  'C&P Exam Prep': {
    headline: 'Walk into your exam confident',
    bullets: [
      'Know exactly what the examiner will ask for each condition',
      'Practice describing your worst days, not your best',
      'Understand the rating criteria before you sit down',
    ],
    urgency: 'One bad C&P exam can cost you thousands in lifetime benefits.',
  },
  'C&P Exam Simulator': {
    headline: 'Practice your exam before the real thing',
    bullets: [
      'AI-powered mock exam based on your actual conditions',
      'Get feedback on how to describe symptoms more effectively',
      'Reduce anxiety by knowing what to expect',
    ],
    urgency: 'Veterans who practice score higher on exam accuracy.',
  },
  'Post-Exam Debrief': {
    headline: 'Analyze how your exam went',
    bullets: [
      'AI-guided review of what was asked and what you said',
      'Identify any gaps the examiner may have missed',
      'Know your options if the exam was inadequate',
    ],
  },
  'Personal Statement Builder': {
    headline: 'Write a compelling personal statement',
    bullets: [
      'AI-guided drafting uses VA-specific language',
      'Covers the nexus elements raters look for',
      'Veterans who submit strong statements win faster',
    ],
    urgency: 'Your personal statement is often the first thing a rater reads.',
  },
  'Buddy Statement Builder': {
    headline: 'Get powerful third-party evidence',
    bullets: [
      'Guided templates help buddies write effective statements',
      'Share a link — they fill it out on their phone',
      'Third-party evidence is one of the VA\'s strongest evidence types',
    ],
  },
  'Family Statement': {
    headline: 'Capture your family\'s perspective',
    bullets: [
      'Guided templates for spouses, parents, and children',
      'Voice recording option — just speak naturally',
      'Family observations are powerful evidence for mental health claims',
    ],
  },
  'Doctor Summary Outline': {
    headline: 'Generate a doctor summary letter template',
    bullets: [
      'Pre-filled with your conditions and symptom data',
      'Uses VA-required nexus language your doctor can sign',
      'A supporting medical opinion can make or break your claim',
    ],
    urgency: 'Claims with a doctor\'s nexus letter approve at 2x the rate.',
  },
  'Doctor Packet': {
    headline: 'Give your doctor everything they need',
    bullets: [
      'Pre-built packet with your conditions, symptoms, and history',
      'Includes nexus letter template ready for their signature',
      'Saves your doctor time and ensures nothing is missed',
    ],
  },
  'Stressor Statement': {
    headline: 'Document your in-service stressors',
    bullets: [
      'Required for PTSD and mental health claims',
      'Guided format covers every element the VA needs',
      'Links stressors to verifiable service records',
    ],
  },
  'DBQ Prep Sheet': {
    headline: 'Know what should be on your DBQ',
    bullets: [
      'See the exact criteria for each rating level',
      'Verify your examiner filled out every section',
      'Spot errors before your rating decision',
    ],
  },
  'DBQ Self-Assessment': {
    headline: 'Assess your symptoms against DBQ criteria',
    bullets: [
      'See how your documented symptoms align with rating levels',
      'Identify gaps before your C&P exam',
      'Educational preparation — not a rating prediction',
    ],
  },
  'AI DBQ Analyzer': {
    headline: 'AI-powered DBQ analysis',
    bullets: [
      'Upload a completed DBQ for instant color-coded analysis',
      'See how documented findings align with rating criteria',
      'Spot documentation gaps and missing information',
    ],
    urgency: 'Catch DBQ errors before they cost you a higher rating.',
  },
  'C-File Intel': {
    headline: 'Unlock the secrets in your C-File',
    bullets: [
      'AI analyzes your VA claims file for key evidence',
      'Identifies favorable findings you may have missed',
      'Spots contradictions and gaps before the VA does',
    ],
    urgency: 'Your C-File contains evidence that could change your rating.',
  },
  'Ask Intel': {
    headline: 'Your personal VA claims advisor',
    bullets: [
      'AI-powered chat trained on VA rating criteria',
      'Ask anything about your specific conditions and evidence',
      'Get actionable next steps tailored to your claim',
    ],
  },
  'Evidence Scanner': {
    headline: 'Scan documents for key evidence',
    bullets: [
      'AI extracts relevant findings from medical records',
      'Highlights language that supports your rating level',
      'Identifies missing documentation before you file',
    ],
  },
  'Back Pay Estimator': {
    headline: 'See how much the VA may owe you',
    bullets: [
      'Calculate retroactive pay from your effective date',
      'Factor in dependents and combined rating changes',
      'Know your rights to back pay before filing',
    ],
  },
  'Claim Packet Builder': {
    headline: 'Build your complete claim packet',
    bullets: [
      'Organize all evidence into one professional package',
      'Export as PDF ready for upload to va.gov',
      'Missing documents are the #1 reason for delays',
    ],
    urgency: 'A complete packet can cut your wait time in half.',
  },
  'VSO Packet': {
    headline: 'Prepare your VSO meeting packet',
    bullets: [
      'Professional summary of your conditions and evidence',
      'Helps your VSO advocate more effectively',
      'Walk in prepared — not scrambling for paperwork',
    ],
  },
  'Appeals Guide': {
    headline: 'Fight your denial with a clear plan',
    bullets: [
      'Understand your 3 appeal lanes and which is best',
      'AI-powered decision letter analysis',
      'Know your deadlines — you have 1 year to act',
    ],
    urgency: 'Missing your appeal deadline means starting over.',
  },
  'State Benefits': {
    headline: 'Discover your state-level benefits',
    bullets: [
      'Property tax exemptions, education benefits, and more',
      'Benefits vary by state — see what you qualify for',
      'Many veterans miss thousands in state benefits every year',
    ],
  },
  'Medication Compliance': {
    headline: 'Track your medication adherence',
    bullets: [
      'Document consistent medication use for your claim',
      'The VA looks for treatment compliance as evidence',
      'Track refills, missed doses, and side effects over time',
    ],
  },
};

/** Default fallback for unknown feature names. */
const defaultValue: FeatureValue = {
  headline: 'Unlock your full claim toolkit',
  bullets: [
    'Claim strategy & body map tools',
    'Full health & symptom tracking',
    'Personal statements, buddy letters & more',
    'Build & export your complete claim packet',
  ],
};

export function getFeatureValue(featureName: string): FeatureValue {
  return featureValues[featureName] ?? defaultValue;
}
