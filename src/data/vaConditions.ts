/**
 * Unified VA Conditions Database
 * All VA-ratable conditions with abbreviations, full names, categories, and secondary conditions
 */

export type ConditionCategory =
  | 'mental-health'
  | 'musculoskeletal'
  | 'neurological'
  | 'respiratory'
  | 'cardiovascular'
  | 'digestive'
  | 'skin'
  | 'endocrine'
  | 'genitourinary'
  | 'hematologic'
  | 'infectious'
  | 'dental'
  | 'eye'
  | 'ear'
  | 'gynecological'
  | 'other';

export interface VACondition {
  id: string;
  name: string; // Full official name
  abbreviation: string; // Short display name (e.g., "PTSD")
  category: string;
  diagnosticCode: string;
  typicalRatings?: string;
  description?: string;
  commonSecondaries: string[]; // IDs of common secondary conditions
  possibleSecondaries?: string[]; // Display-friendly secondary condition names
  nexusTip?: string; // Guidance for establishing service connection nexus
  keywords: string[]; // Additional search terms
  misspellings?: string[]; // Common misspellings for search matching
  bodySystem?: string; // Body system affected (e.g., "Spine", "Mental Health", "Knee")
}

// Category labels for display
export const categoryLabels: Record<ConditionCategory, string> = {
  'mental-health': 'Mental Health',
  'musculoskeletal': 'Musculoskeletal',
  'neurological': 'Neurological',
  'respiratory': 'Respiratory',
  'cardiovascular': 'Cardiovascular',
  'digestive': 'Digestive',
  'skin': 'Skin',
  'endocrine': 'Endocrine',
  'genitourinary': 'Genitourinary',
  'hematologic': 'Hematologic',
  'infectious': 'Infectious Diseases',
  'dental': 'Dental & Oral',
  'eye': 'Eye Conditions',
  'ear': 'Ear & Hearing',
  'gynecological': 'Gynecological',
  'other': 'Other Conditions',
};

/**
 * Complete VA Conditions Database
 * Contains all commonly claimed VA disabilities with proper categorization
 */
export const vaConditions: VACondition[] = [
  // ============================================
  // MENTAL HEALTH CONDITIONS
  // ============================================
  {
    id: 'ptsd',
    name: 'Post-Traumatic Stress Disorder',
    abbreviation: 'PTSD',
    category: 'mental-health',
    diagnosticCode: '9411',
    typicalRatings: '0-100%',
    description: 'Mental health condition triggered by experiencing or witnessing traumatic events',
    commonSecondaries: ['depression', 'anxiety', 'sleep-apnea', 'migraines', 'substance-abuse', 'erectile-dysfunction'],
    keywords: ['trauma', 'nightmares', 'flashbacks', 'combat', 'mst', 'military sexual trauma', 'anxiety', 'hypervigilance', 'stressor', 'mental health', 'combat stress', 'TBI related', 'panic attacks', 'startle response'],
    misspellings: ['post traumatic', 'post-traumatic', 'pstd', 'ptds', 'p.t.s.d'],
    bodySystem: 'Mental Health',
  },
  {
    id: 'depression',
    name: 'Major Depressive Disorder',
    abbreviation: 'Depression',
    category: 'mental-health',
    diagnosticCode: '9434',
    typicalRatings: '0-100%',
    description: 'Persistent feelings of sadness and loss of interest',
    commonSecondaries: ['anxiety', 'sleep-apnea', 'substance-abuse', 'erectile-dysfunction'],
    keywords: ['sad', 'hopeless', 'mood', 'depressed', 'mental health', 'suicidal', 'low mood', 'crying', 'worthless', 'no motivation', 'MDD', 'major depression', 'clinical depression'],
    misspellings: ['depresion', 'deppression', 'depresssion', 'depresed'],
    bodySystem: 'Mental Health',
  },
  {
    id: 'anxiety',
    name: 'Generalized Anxiety Disorder',
    abbreviation: 'Anxiety',
    category: 'mental-health',
    diagnosticCode: '9400',
    typicalRatings: '0-100%',
    description: 'Excessive worry and anxiety about various aspects of life',
    commonSecondaries: ['depression', 'sleep-apnea', 'migraines', 'hypertension'],
    keywords: ['worry', 'panic', 'nervous', 'fear', 'GAD', 'mental health', 'panic attacks', 'panic disorder', 'anxious', 'restless', 'racing thoughts', 'chest tightness', 'social anxiety'],
    misspellings: ['anxeity', 'anxity', 'anixety', 'anxeiety', 'anxioty'],
    bodySystem: 'Mental Health',
  },
  {
    id: 'bipolar',
    name: 'Bipolar Disorder',
    abbreviation: 'Bipolar',
    category: 'mental-health',
    diagnosticCode: '9432',
    typicalRatings: '0-100%',
    description: 'Mood disorder with episodes of mania and depression',
    commonSecondaries: ['depression', 'anxiety', 'substance-abuse', 'sleep-apnea'],
    keywords: ['manic', 'mood swings', 'mania', 'mental health', 'bipolar disorder', 'manic depression', 'hypomania', 'bipolar I', 'bipolar II', 'mood disorder', 'cycling moods'],
    misspellings: ['bi-polar', 'bi polar', 'bipolor', 'bipoler'],
    bodySystem: 'Mental Health',
  },
  {
    id: 'schizophrenia',
    name: 'Schizophrenia',
    abbreviation: 'Schizophrenia',
    category: 'mental-health',
    diagnosticCode: '9203',
    typicalRatings: '30-100%',
    description: 'Severe mental disorder affecting thoughts, feelings, and behavior',
    commonSecondaries: ['depression', 'anxiety', 'substance-abuse'],
    keywords: ['psychosis', 'hallucinations', 'delusions', 'mental health', 'voices', 'paranoia', 'thought disorder', 'psychotic', 'schizoaffective', 'disorganized thinking'],
    misspellings: ['schizophernia', 'skizofrenia', 'schitzophrenia', 'shizophrenia'],
    bodySystem: 'Mental Health',
  },
  {
    id: 'substance-abuse',
    name: 'Substance Use Disorder',
    abbreviation: 'Substance Abuse',
    category: 'mental-health',
    diagnosticCode: '9400',
    typicalRatings: '0-100%',
    description: 'Alcohol or drug addiction secondary to service-connected condition',
    commonSecondaries: ['depression', 'anxiety', 'ptsd'],
    keywords: ['alcohol', 'drug', 'addiction', 'alcoholism', 'drinking', 'substance use', 'dependence', 'withdrawal', 'rehab', 'recovery', 'self medicating', 'opioid'],
    misspellings: ['substence', 'substanse', 'alchohol', 'alchoholism'],
    bodySystem: 'Mental Health',
  },
  {
    id: 'adjustment-disorder',
    name: 'Adjustment Disorder',
    abbreviation: 'Adjustment Disorder',
    category: 'mental-health',
    diagnosticCode: '9440',
    typicalRatings: '0-70%',
    description: 'Stress-related condition in response to life changes',
    commonSecondaries: ['depression', 'anxiety'],
    keywords: ['stress', 'coping', 'transition', 'mental health', 'life change', 'difficulty adjusting', 'emotional distress', 'stressor', 'military transition', 'separation'],
    misspellings: ['ajustment', 'adjustement', 'adjustment disoder'],
    bodySystem: 'Mental Health',
  },
  {
    id: 'insomnia',
    name: 'Primary Insomnia',
    abbreviation: 'Insomnia',
    category: 'mental-health',
    diagnosticCode: '9400',
    typicalRatings: '0-30%',
    description: 'Chronic difficulty falling or staying asleep',
    commonSecondaries: ['depression', 'anxiety', 'sleep-apnea'],
    keywords: ['sleep', 'sleepless', 'cant sleep', 'sleep problems', 'waking up', 'sleep disorder', 'sleep disturbance', 'no sleep', 'tired', 'fatigue', 'restless sleep', 'nighttime waking'],
    misspellings: ['insomina', 'insomania', 'insomia', 'insomnia'],
    bodySystem: 'Mental Health',
  },

  // ============================================
  // NEUROLOGICAL CONDITIONS
  // ============================================
  {
    id: 'tbi',
    name: 'Traumatic Brain Injury',
    abbreviation: 'TBI',
    category: 'neurological',
    diagnosticCode: '8045',
    typicalRatings: '0-100%',
    description: 'Brain injury from external force or trauma',
    commonSecondaries: ['migraines', 'ptsd', 'depression', 'tinnitus', 'vertigo', 'cognitive-disorder'],
    keywords: ['head injury', 'concussion', 'brain damage', 'blast', 'brain injury', 'head trauma', 'traumatic brain', 'blast exposure', 'IED', 'explosion', 'skull fracture', 'closed head injury', 'mTBI'],
    misspellings: ['tbi', 'tramatic brain', 'traumtic brain', 'concusion'],
    bodySystem: 'Brain',
  },
  {
    id: 'migraines',
    name: 'Migraine Headaches',
    abbreviation: 'Migraines',
    category: 'neurological',
    diagnosticCode: '8100',
    typicalRatings: '0-50%',
    description: 'Evaluated based on the frequency of prostrating attacks over the last 6 months. Rating criteria per 38 CFR § 4.124a.',
    commonSecondaries: ['depression', 'anxiety', 'insomnia'],
    keywords: ['headache', 'head pain', 'headaches', 'migraine', 'aura', 'prostrating', 'light sensitivity', 'photophobia', 'nausea', 'cluster headache', 'tension headache', 'chronic headaches', 'severe headache'],
    misspellings: ['migranes', 'migrains', 'migrane', 'migriane', 'magraine'],
    bodySystem: 'Brain',
  },
  {
    id: 'peripheral-neuropathy',
    name: 'Peripheral Neuropathy',
    abbreviation: 'Neuropathy',
    category: 'neurological',
    diagnosticCode: '8520',
    typicalRatings: '10-80%',
    description: 'Nerve damage causing numbness, tingling, or pain in extremities',
    commonSecondaries: ['diabetes', 'radiculopathy'],
    keywords: ['nerve damage', 'numbness', 'tingling', 'burning', 'neuropathy', 'nerve pain', 'pins and needles', 'feet numbness', 'hands numbness', 'diabetic neuropathy', 'extremity pain', 'loss of sensation'],
    misspellings: ['nuropathy', 'nueropathy', 'nuerapathy', 'periferal neuropathy', 'periphral'],
    bodySystem: 'Nerve',
  },
  {
    id: 'radiculopathy',
    name: 'Radiculopathy',
    abbreviation: 'Radiculopathy',
    category: 'neurological',
    diagnosticCode: '8520',
    typicalRatings: '10-60%',
    description: 'Pinched nerve causing pain radiating from spine',
    commonSecondaries: ['lumbar-ddd', 'cervical-ddd', 'sciatica'],
    keywords: ['pinched nerve', 'radiating pain', 'shooting pain', 'nerve root', 'cervical radiculopathy', 'lumbar radiculopathy', 'arm pain', 'leg pain', 'nerve compression', 'spine nerve', 'numbness down leg', 'numbness down arm'],
    misspellings: ['radiculapathy', 'radiclopathy', 'radiculopthy', 'ridiculopathy'],
    bodySystem: 'Spine',
  },
  {
    id: 'sciatica',
    name: 'Sciatica',
    abbreviation: 'Sciatica',
    category: 'neurological',
    diagnosticCode: '8520',
    typicalRatings: '10-60%',
    description: 'Pain along the sciatic nerve from lower back to legs',
    commonSecondaries: ['lumbar-ddd', 'radiculopathy'],
    keywords: ['leg pain', 'sciatic nerve', 'shooting leg pain', 'lower back to leg', 'buttock pain', 'hip pain radiating', 'nerve pain leg', 'sciatic', 'back leg pain', 'piriformis'],
    misspellings: ['siatica', 'scatica', 'sciatika', 'cyatica', 'syatica'],
    bodySystem: 'Spine',
  },
  {
    id: 'carpal-tunnel',
    name: 'Carpal Tunnel Syndrome',
    abbreviation: 'CTS',
    category: 'neurological',
    diagnosticCode: '8515',
    typicalRatings: '10-70%',
    description: 'Compression of median nerve in wrist',
    commonSecondaries: ['peripheral-neuropathy'],
    keywords: ['wrist pain', 'hand numbness', 'hand tingling', 'carpal tunnel', 'median nerve', 'wrist numbness', 'grip weakness', 'hand weakness', 'finger tingling', 'typing injury', 'repetitive strain', 'wrist brace'],
    misspellings: ['carpel tunnel', 'carple tunnel', 'carpal tunel', 'carpul tunnel'],
    bodySystem: 'Wrist',
  },
  {
    id: 'vertigo',
    name: 'Peripheral Vestibular Disorder (Vertigo)',
    abbreviation: 'Vertigo',
    category: 'neurological',
    diagnosticCode: '6204',
    typicalRatings: '10-100%',
    description: 'Dizziness and balance problems',
    commonSecondaries: ['tinnitus', 'hearing-loss', 'menieres'],
    keywords: ['dizziness', 'balance', 'spinning', 'vestibular', 'dizzy', 'unsteady', 'lightheaded', 'room spinning', 'balance problems', 'BPPV', 'positional vertigo', 'falling'],
    misspellings: ['vertago', 'vertgio', 'virtigo', 'vertio'],
    bodySystem: 'Ear',
  },
  {
    id: 'menieres',
    name: "Meniere's Disease",
    abbreviation: "Meniere's",
    category: 'neurological',
    diagnosticCode: '6205',
    typicalRatings: '30-100%',
    description: 'Inner ear disorder causing vertigo, tinnitus, and hearing loss',
    commonSecondaries: ['tinnitus', 'hearing-loss', 'vertigo'],
    keywords: ['inner ear', 'balance', 'dizziness', 'ear fullness', 'hearing fluctuation', 'ear pressure', 'vertigo attacks', 'nausea dizziness', 'endolymphatic', 'episodic vertigo'],
    misspellings: ['menieres', 'meniers', 'meneires', 'menieers', 'meniears'],
    bodySystem: 'Ear',
  },
  {
    id: 'cognitive-disorder',
    name: 'Cognitive Disorder',
    abbreviation: 'Cognitive Disorder',
    category: 'neurological',
    diagnosticCode: '9326',
    typicalRatings: '0-100%',
    description: 'Impairment of cognitive function including memory, concentration',
    commonSecondaries: ['tbi', 'depression', 'ptsd'],
    keywords: ['memory loss', 'concentration', 'thinking problems', 'brain fog', 'confusion', 'forgetful', 'cognitive impairment', 'trouble focusing', 'mental clarity', 'processing speed', 'attention deficit'],
    misspellings: ['cognative', 'congitive', 'cognetive'],
    bodySystem: 'Brain',
  },
  {
    id: 'epilepsy',
    name: 'Epilepsy',
    abbreviation: 'Epilepsy',
    category: 'neurological',
    diagnosticCode: '8910',
    typicalRatings: '10-100%',
    description: 'Seizure disorder',
    commonSecondaries: ['tbi', 'depression', 'anxiety'],
    keywords: ['seizures', 'convulsions', 'seizure disorder', 'epileptic', 'fits', 'grand mal', 'petit mal', 'absence seizure', 'tonic-clonic', 'anti-seizure medication', 'aura seizure'],
    misspellings: ['epilepsey', 'epilipsy', 'epilespy', 'epilepsi', 'epilepcy'],
    bodySystem: 'Brain',
  },
  {
    id: 'parkinsons',
    name: "Parkinson's Disease",
    abbreviation: "Parkinson's",
    category: 'neurological',
    diagnosticCode: '8004',
    typicalRatings: '30-100%',
    description: 'Progressive nervous system disorder affecting movement',
    commonSecondaries: ['depression', 'cognitive-disorder', 'sleep-apnea'],
    keywords: ['tremor', 'shaking', 'movement disorder', 'rigidity', 'bradykinesia', 'slow movement', 'balance problems', 'stiffness', 'resting tremor', 'dopamine', 'shuffling gait'],
    misspellings: ['parkinsons', 'parkinson', 'parkenson', 'parkinsen', 'parkinsins'],
    bodySystem: 'Brain',
  },
  {
    id: 'als',
    name: 'Amyotrophic Lateral Sclerosis',
    abbreviation: 'ALS',
    category: 'neurological',
    diagnosticCode: '8017',
    typicalRatings: '100%',
    description: 'Progressive neurodegenerative disease (presumptive for all veterans)',
    commonSecondaries: ['depression', 'respiratory-failure'],
    keywords: ['lou gehrigs', 'motor neuron', 'amyotrophic', 'muscle wasting', 'progressive weakness', 'motor neuron disease', 'muscle atrophy', 'difficulty swallowing', 'fasciculations', 'neurodegenerative'],
    misspellings: ['lou gehrigs', 'lou gehrig', 'amiotrophic', 'amyotrofic'],
    bodySystem: 'Brain',
  },
  {
    id: 'ms',
    name: 'Multiple Sclerosis',
    abbreviation: 'MS',
    category: 'neurological',
    diagnosticCode: '8018',
    typicalRatings: '30-100%',
    description: 'Autoimmune disease affecting the central nervous system',
    commonSecondaries: ['depression', 'fatigue', 'cognitive-disorder'],
    keywords: ['autoimmune', 'myelin', 'multiple sclerosis', 'demyelinating', 'CNS', 'central nervous system', 'relapsing remitting', 'progressive MS', 'lesions', 'optic neuritis', 'spasticity'],
    misspellings: ['mulitple sclerosis', 'mutiple sclerosis', 'multiple sclerousis'],
    bodySystem: 'Brain',
  },

  // ============================================
  // EAR & HEARING CONDITIONS
  // ============================================
  {
    id: 'tinnitus',
    name: 'Tinnitus',
    abbreviation: 'Tinnitus',
    category: 'ear',
    diagnosticCode: '6260',
    typicalRatings: '10%',
    description: 'Ringing or buzzing in the ears',
    commonSecondaries: ['hearing-loss', 'depression', 'anxiety', 'sleep-apnea', 'migraines'],
    possibleSecondaries: ['Migraines', 'Anxiety', 'Depression', 'Sleep Apnea'],
    nexusTip: 'Evidence must show how constant auditory distress triggers secondary symptoms.',
    keywords: ['ringing', 'ringing ears', 'ears ringing', 'buzzing', 'hissing', 'ear noise', 'hearing', 'ear damage', 'noise exposure', 'auditory', 'ear ringing', 'whooshing'],
    misspellings: ['tinitis', 'tinitus', 'tinnitis', 'tinnius', 'tinitius', 'tinnitus'],
    bodySystem: 'Ear',
  },
  {
    id: 'hearing-loss',
    name: 'Bilateral Hearing Loss',
    abbreviation: 'Hearing Loss',
    category: 'ear',
    diagnosticCode: '6100',
    typicalRatings: '0-100%',
    description: 'Partial or complete loss of hearing',
    commonSecondaries: ['tinnitus', 'vertigo', 'depression'],
    keywords: ['deaf', 'cant hear', 'hard of hearing', 'hearing impairment', 'hearing aid', 'hearing aids', 'sensorineural', 'noise induced', 'audiogram', 'hearing test', 'difficulty hearing', 'bilateral hearing'],
    misspellings: ['hearing lose', 'hearring loss', 'hereing loss', 'hering loss'],
    bodySystem: 'Ear',
  },

  // ============================================
  // EYE CONDITIONS
  // ============================================
  {
    id: 'vision-loss',
    name: 'Visual Impairment',
    abbreviation: 'Vision Loss',
    category: 'eye',
    diagnosticCode: '6066',
    typicalRatings: '10-100%',
    description: 'Decreased visual acuity or field of vision',
    commonSecondaries: ['depression', 'migraines'],
    keywords: ['blind', 'cant see', 'eyesight', 'vision problems', 'visual acuity', 'blurry vision', 'vision impairment', 'eye condition', 'low vision', 'field of vision', 'legally blind'],
    misspellings: ['vision lose', 'vison loss', 'visoin loss'],
    bodySystem: 'Eye',
  },
  {
    id: 'macular-degeneration',
    name: 'Macular Degeneration',
    abbreviation: 'Macular Degeneration',
    category: 'eye',
    diagnosticCode: '6006',
    typicalRatings: '10-100%',
    description: 'Progressive damage to the macula affecting central vision',
    commonSecondaries: ['depression', 'vision-loss'],
    keywords: ['amd', 'central vision', 'macular', 'eye disease', 'retina', 'wet AMD', 'dry AMD', 'age related', 'central vision loss', 'drusen', 'retinal degeneration'],
    misspellings: ['macular degenration', 'macualr degeneration', 'macular degenaration'],
    bodySystem: 'Eye',
  },
  {
    id: 'glaucoma',
    name: 'Glaucoma',
    abbreviation: 'Glaucoma',
    category: 'eye',
    diagnosticCode: '6012',
    typicalRatings: '10-100%',
    description: 'Increased eye pressure damaging optic nerve',
    commonSecondaries: ['vision-loss', 'migraines'],
    keywords: ['eye pressure', 'optic nerve', 'intraocular pressure', 'IOP', 'eye drops', 'tunnel vision', 'peripheral vision loss', 'open angle', 'closed angle', 'eye disease'],
    misspellings: ['gluacoma', 'glucoma', 'glaucma', 'glaucaoma'],
    bodySystem: 'Eye',
  },
  {
    id: 'cataracts',
    name: 'Cataracts',
    abbreviation: 'Cataracts',
    category: 'eye',
    diagnosticCode: '6027',
    typicalRatings: '10-30%',
    description: 'Clouding of the eye lens',
    commonSecondaries: ['vision-loss'],
    keywords: ['cloudy vision', 'lens', 'cataract', 'eye surgery', 'blurry vision', 'hazy vision', 'lens replacement', 'IOL', 'eye clouding', 'dim vision'],
    misspellings: ['cataracts', 'cateracts', 'cataracs', 'catarats'],
    bodySystem: 'Eye',
  },
  {
    id: 'dry-eye',
    name: 'Dry Eye Syndrome',
    abbreviation: 'Dry Eye',
    category: 'eye',
    diagnosticCode: '6025',
    typicalRatings: '10-30%',
    description: 'Insufficient tear production causing eye discomfort',
    commonSecondaries: ['vision-loss'],
    keywords: ['burning eyes', 'eye irritation', 'dry eyes', 'tear production', 'gritty eyes', 'eye drops', 'watery eyes', 'eye fatigue', 'eye strain', 'keratoconjunctivitis sicca'],
    misspellings: ['dry eyes', 'dry eye syndrom', 'dri eye'],
    bodySystem: 'Eye',
  },

  // ============================================
  // MUSCULOSKELETAL - SPINE
  // ============================================
  {
    id: 'lumbar-ddd',
    name: 'Degenerative Disc Disease (Lumbar Spine)',
    abbreviation: 'Lumbar DDD',
    category: 'musculoskeletal',
    diagnosticCode: '5242',
    typicalRatings: '10-60%',
    description: 'Disc deterioration in the lower back',
    commonSecondaries: ['radiculopathy', 'sciatica', 'lumbar-strain', 'erectile-dysfunction'],
    keywords: ['lower back', 'back pain', 'disc disease', 'lumbosacral', 'degenerative disc', 'DDD', 'lumbar spine', 'spinal degeneration', 'disc bulge', 'disc herniation', 'low back', 'spine deterioration', 'L4 L5', 'L5 S1'],
    misspellings: ['lumbar ddd', 'degenerative disk', 'degeneratve disc', 'lumber DDD'],
    bodySystem: 'Spine',
  },
  {
    id: 'cervical-ddd',
    name: 'Degenerative Disc Disease (Cervical Spine)',
    abbreviation: 'Cervical DDD',
    category: 'musculoskeletal',
    diagnosticCode: '5242',
    typicalRatings: '10-60%',
    description: 'Disc deterioration in the neck',
    commonSecondaries: ['radiculopathy', 'cervical-strain', 'migraines'],
    keywords: ['neck', 'neck pain', 'cervical spine', 'neck disc', 'cervical degeneration', 'DDD', 'neck stiffness', 'C-spine', 'neck deterioration', 'disc bulge neck', 'C5 C6', 'C6 C7', 'neck arthritis'],
    misspellings: ['cervical ddd', 'cervicle DDD', 'cervical degenerative disk', 'cervicol'],
    bodySystem: 'Spine',
  },
  {
    id: 'lumbar-strain',
    name: 'Lumbosacral Strain',
    abbreviation: 'Lumbar Strain',
    category: 'musculoskeletal',
    diagnosticCode: '5237',
    typicalRatings: '10-40%',
    description: 'Strain or sprain of lower back muscles/ligaments',
    commonSecondaries: ['lumbar-ddd', 'radiculopathy', 'sciatica'],
    possibleSecondaries: ['Sciatica', 'Radiculopathy', 'Depression', 'ED'],
    nexusTip: 'Focus on nerve compression (radiculopathy) resulting from spinal instability.',
    keywords: ['back', 'back pain', 'lower back', 'lumbar', 'spine', 'spinal', 'back injury', 'herniated disc', 'degenerative disc', 'DDD', 'sciatica', 'back strain', 'lumbago'],
    misspellings: ['lumber strain', 'lumbosacral', 'lumbar strane', 'lumbosacrel'],
    bodySystem: 'Spine',
  },
  {
    id: 'cervical-strain',
    name: 'Cervical Strain',
    abbreviation: 'Cervical Strain',
    category: 'musculoskeletal',
    diagnosticCode: '5237',
    typicalRatings: '10-30%',
    description: 'Strain or sprain of neck muscles/ligaments',
    commonSecondaries: ['cervical-ddd', 'migraines', 'radiculopathy'],
    keywords: ['neck strain', 'neck pain', 'whiplash', 'neck injury', 'stiff neck', 'neck sprain', 'cervical spine', 'neck muscle', 'neck stiffness', 'neck spasm', 'cervical sprain'],
    misspellings: ['cervical strane', 'cervicle strain', 'cervical stain', 'cervicol strain'],
    bodySystem: 'Spine',
  },
  {
    id: 'herniated-disc-lumbar',
    name: 'Herniated Disc (Lumbar)',
    abbreviation: 'Herniated Disc (L)',
    category: 'musculoskeletal',
    diagnosticCode: '5243',
    typicalRatings: '10-60%',
    description: 'Ruptured disc in the lower back',
    commonSecondaries: ['radiculopathy', 'sciatica', 'lumbar-ddd'],
    keywords: ['bulging disc', 'slipped disc', 'ruptured disc', 'herniated disc', 'disc herniation', 'back disc', 'lumbar herniation', 'disc protrusion', 'disc extrusion', 'lower back disc', 'protruding disc'],
    misspellings: ['herniated disk', 'herniated dis', 'hernated disc', 'herniaed disc', 'herniated disc lumber'],
    bodySystem: 'Spine',
  },
  {
    id: 'herniated-disc-cervical',
    name: 'Herniated Disc (Cervical)',
    abbreviation: 'Herniated Disc (C)',
    category: 'musculoskeletal',
    diagnosticCode: '5243',
    typicalRatings: '10-60%',
    description: 'Ruptured disc in the neck',
    commonSecondaries: ['radiculopathy', 'cervical-ddd', 'migraines'],
    keywords: ['neck disc', 'bulging disc neck', 'herniated disc', 'cervical herniation', 'neck disc bulge', 'slipped disc neck', 'ruptured disc neck', 'disc protrusion cervical', 'cervical disc', 'neck disc herniation'],
    misspellings: ['herniated disk cervical', 'hernated disc cervical', 'cervicle herniated disc'],
    bodySystem: 'Spine',
  },
  {
    id: 'spinal-stenosis',
    name: 'Spinal Stenosis',
    abbreviation: 'Spinal Stenosis',
    category: 'musculoskeletal',
    diagnosticCode: '5238',
    typicalRatings: '10-100%',
    description: 'Narrowing of spinal canal',
    commonSecondaries: ['radiculopathy', 'sciatica', 'lumbar-ddd'],
    keywords: ['narrow spine', 'spinal canal', 'stenosis', 'spinal narrowing', 'foraminal stenosis', 'central stenosis', 'nerve compression spine', 'back surgery', 'laminectomy', 'walking difficulty back', 'spinal cord compression'],
    misspellings: ['spinal stenois', 'spinal stenosos', 'spinal stinosis', 'spinol stenosis'],
    bodySystem: 'Spine',
  },
  {
    id: 'scoliosis',
    name: 'Scoliosis',
    abbreviation: 'Scoliosis',
    category: 'musculoskeletal',
    diagnosticCode: '5241',
    typicalRatings: '10-100%',
    description: 'Lateral curvature of the spine',
    commonSecondaries: ['lumbar-strain', 'lumbar-ddd'],
    keywords: ['curved spine', 'spine curvature', 'crooked spine', 'spinal curve', 'back deformity', 'uneven shoulders', 'spinal misalignment', 'lateral curvature', 'thoracic curve'],
    misspellings: ['skoliosis', 'scoliousis', 'scolioisis', 'scolosis'],
    bodySystem: 'Spine',
  },

  // ============================================
  // MUSCULOSKELETAL - UPPER EXTREMITIES
  // ============================================
  {
    id: 'shoulder-strain',
    name: 'Shoulder Strain/Impingement',
    abbreviation: 'Shoulder Condition',
    category: 'musculoskeletal',
    diagnosticCode: '5201',
    typicalRatings: '10-40%',
    description: 'Shoulder pain and limited motion',
    commonSecondaries: ['rotator-cuff', 'cervical-strain'],
    keywords: ['shoulder pain', 'shoulder impingement', 'shoulder injury', 'frozen shoulder', 'shoulder stiffness', 'arm pain', 'shoulder range of motion', 'shoulder bursitis', 'shoulder tendinitis', 'adhesive capsulitis', 'shoulder ROM'],
    misspellings: ['sholder', 'soulder', 'shoulder strane', 'shouldar'],
    bodySystem: 'Shoulder',
  },
  {
    id: 'rotator-cuff',
    name: 'Rotator Cuff Tear/Injury',
    abbreviation: 'Rotator Cuff',
    category: 'musculoskeletal',
    diagnosticCode: '5201',
    typicalRatings: '20-40%',
    description: 'Damage to shoulder rotator cuff tendons',
    commonSecondaries: ['shoulder-strain', 'depression'],
    keywords: ['shoulder tear', 'torn rotator cuff', 'shoulder tendon', 'rotator cuff tear', 'shoulder surgery', 'cuff injury', 'shoulder weakness', 'overhead pain', 'supraspinatus', 'infraspinatus', 'shoulder repair'],
    misspellings: ['rotatorcuff', 'rotater cuff', 'rotator cuf', 'rotator cup', 'rotater cup'],
    bodySystem: 'Shoulder',
  },
  {
    id: 'tennis-elbow',
    name: 'Lateral Epicondylitis (Tennis Elbow)',
    abbreviation: 'Tennis Elbow',
    category: 'musculoskeletal',
    diagnosticCode: '5206',
    typicalRatings: '10-20%',
    description: 'Inflammation of elbow tendons',
    commonSecondaries: ['carpal-tunnel'],
    keywords: ['elbow pain', 'forearm pain', 'lateral epicondylitis', 'elbow tendinitis', 'outer elbow', 'grip pain', 'elbow inflammation', 'elbow injury', 'arm pain lifting', 'elbow tenderness'],
    misspellings: ['tennis elbo', 'tenis elbow', 'lateral epicondilitis', 'epicondylitis'],
    bodySystem: 'Elbow',
  },
  {
    id: 'golfers-elbow',
    name: 'Medial Epicondylitis (Golfer\'s Elbow)',
    abbreviation: "Golfer's Elbow",
    category: 'musculoskeletal',
    diagnosticCode: '5206',
    typicalRatings: '10-20%',
    description: 'Inflammation of inner elbow tendons',
    commonSecondaries: ['carpal-tunnel'],
    keywords: ['elbow pain', 'inner elbow', 'medial epicondylitis', 'elbow tendinitis', 'inside elbow', 'forearm pain', 'elbow inflammation', 'grip weakness', 'wrist flexion pain'],
    misspellings: ['golfers elbo', 'golfer elbow', 'medial epicondilitis'],
    bodySystem: 'Elbow',
  },

  // ============================================
  // MUSCULOSKELETAL - LOWER EXTREMITIES
  // ============================================
  {
    id: 'knee-strain',
    name: 'Knee Strain/Instability',
    abbreviation: 'Knee Condition',
    category: 'musculoskeletal',
    diagnosticCode: '5257',
    typicalRatings: '10-30%',
    description: 'Knee pain, instability, or limited motion',
    commonSecondaries: ['knee-arthritis', 'lumbar-strain'],
    keywords: ['knee pain', 'knee instability', 'knee injury', 'knee problems', 'knee gave out', 'knee swelling', 'knee locking', 'knee buckling', 'knee weakness', 'patella', 'knee ROM', 'bilateral knee'],
    misspellings: ['nee pain', 'knee strane', 'knee condtion', 'kneee'],
    bodySystem: 'Knee',
  },
  {
    id: 'knee-arthritis',
    name: 'Knee Osteoarthritis',
    abbreviation: 'Knee Arthritis',
    category: 'musculoskeletal',
    diagnosticCode: '5003',
    typicalRatings: '10-60%',
    description: 'Degenerative joint disease of the knee',
    commonSecondaries: ['knee-strain', 'gait-abnormality'],
    keywords: ['knee degeneration', 'knee joint', 'knee arthritis', 'DJD knee', 'bone on bone knee', 'knee replacement', 'TKR', 'total knee replacement', 'knee osteoarthritis', 'knee cartilage loss', 'degenerative knee', 'knee grinding'],
    misspellings: ['knee artheritis', 'knee arthritus', 'knee arthiritis', 'osteoarthitis'],
    bodySystem: 'Knee',
  },
  {
    id: 'acl-tear',
    name: 'ACL Tear/Reconstruction',
    abbreviation: 'ACL Injury',
    category: 'musculoskeletal',
    diagnosticCode: '5257',
    typicalRatings: '10-30%',
    description: 'Anterior cruciate ligament tear',
    commonSecondaries: ['knee-strain', 'knee-arthritis'],
    keywords: ['ligament tear', 'knee ligament', 'ACL', 'anterior cruciate', 'knee surgery', 'ACL reconstruction', 'knee gave out', 'knee instability', 'torn ACL', 'knee buckling', 'sports injury knee'],
    misspellings: ['acl tare', 'ACL teer', 'anterior cruciate ligment', 'anterier cruciate'],
    bodySystem: 'Knee',
  },
  {
    id: 'meniscus-tear',
    name: 'Meniscus Tear',
    abbreviation: 'Meniscus Tear',
    category: 'musculoskeletal',
    diagnosticCode: '5259',
    typicalRatings: '10-20%',
    description: 'Torn cartilage in the knee',
    commonSecondaries: ['knee-strain', 'knee-arthritis'],
    keywords: ['knee cartilage', 'torn meniscus', 'meniscal tear', 'knee locking', 'knee clicking', 'knee surgery', 'arthroscopy', 'knee popping', 'cartilage damage knee', 'medial meniscus', 'lateral meniscus'],
    misspellings: ['meniscus tare', 'miniscus tear', 'meniskus', 'meniscas tear', 'menisus'],
    bodySystem: 'Knee',
  },
  {
    id: 'hip-strain',
    name: 'Hip Strain/Bursitis',
    abbreviation: 'Hip Condition',
    category: 'musculoskeletal',
    diagnosticCode: '5252',
    typicalRatings: '10-40%',
    description: 'Hip pain and limited motion',
    commonSecondaries: ['hip-arthritis', 'lumbar-strain', 'gait-abnormality'],
    keywords: ['hip pain', 'hip bursitis', 'hip injury', 'hip problems', 'groin pain', 'hip stiffness', 'hip ROM', 'trochanteric bursitis', 'hip inflammation', 'hip flexor', 'bilateral hip', 'hip snapping'],
    misspellings: ['hip strane', 'hip bersitis', 'hip bursistis', 'hip condtion'],
    bodySystem: 'Hip',
  },
  {
    id: 'hip-arthritis',
    name: 'Hip Osteoarthritis',
    abbreviation: 'Hip Arthritis',
    category: 'musculoskeletal',
    diagnosticCode: '5003',
    typicalRatings: '10-90%',
    description: 'Degenerative joint disease of the hip',
    commonSecondaries: ['hip-strain', 'gait-abnormality', 'lumbar-strain'],
    keywords: ['hip degeneration', 'hip joint', 'hip arthritis', 'DJD hip', 'hip replacement', 'THR', 'total hip replacement', 'bone on bone hip', 'hip osteoarthritis', 'hip grinding', 'degenerative hip'],
    misspellings: ['hip artheritis', 'hip arthritus', 'hip arthiritis', 'hip osteoarthitis'],
    bodySystem: 'Hip',
  },
  {
    id: 'ankle-strain',
    name: 'Ankle Strain/Instability',
    abbreviation: 'Ankle Condition',
    category: 'musculoskeletal',
    diagnosticCode: '5271',
    typicalRatings: '10-20%',
    description: 'Ankle pain and instability',
    commonSecondaries: ['plantar-fasciitis', 'gait-abnormality'],
    keywords: ['ankle pain', 'ankle sprain', 'ankle instability', 'ankle injury', 'twisted ankle', 'ankle swelling', 'ankle weakness', 'chronic ankle sprain', 'ankle ROM', 'lateral ankle', 'ankle giving out'],
    misspellings: ['ankel', 'ankle strane', 'ancle', 'ankle condtion'],
    bodySystem: 'Ankle',
  },
  {
    id: 'plantar-fasciitis',
    name: 'Plantar Fasciitis',
    abbreviation: 'Plantar Fasciitis',
    category: 'musculoskeletal',
    diagnosticCode: '5276',
    typicalRatings: '10-30%',
    description: 'Inflammation of foot tissue causing heel pain',
    commonSecondaries: ['flat-feet', 'gait-abnormality'],
    keywords: ['heel pain', 'foot pain', 'heel spur', 'plantar fascia', 'morning heel pain', 'foot inflammation', 'bottom of foot', 'arch pain', 'heel tenderness', 'foot soreness', 'walking pain foot', 'bilateral plantar fasciitis'],
    misspellings: ['plantar fasciitis', 'plantar fascitis', 'planter fasciitis', 'plantar faciitis', 'plantar fashiitis', 'planter fashitis'],
    bodySystem: 'Foot',
  },
  {
    id: 'flat-feet',
    name: 'Pes Planus (Flat Feet)',
    abbreviation: 'Flat Feet',
    category: 'musculoskeletal',
    diagnosticCode: '5276',
    typicalRatings: '10-50%',
    description: 'Collapsed arches of the feet',
    commonSecondaries: ['plantar-fasciitis', 'knee-strain', 'lumbar-strain'],
    keywords: ['fallen arches', 'flat foot', 'pes planus', 'no arch', 'foot arch', 'overpronation', 'flat feet pain', 'arch collapse', 'foot support', 'orthotics', 'bilateral flat feet'],
    misspellings: ['flat feat', 'pes planus', 'pes plaines', 'plat feet'],
    bodySystem: 'Foot',
  },
  {
    id: 'gait-abnormality',
    name: 'Gait Abnormality',
    abbreviation: 'Gait Abnormality',
    category: 'musculoskeletal',
    diagnosticCode: '5299',
    typicalRatings: '10-30%',
    description: 'Abnormal walking pattern due to other conditions',
    commonSecondaries: ['lumbar-strain', 'hip-strain', 'knee-strain'],
    keywords: ['walking problems', 'limp', 'limping', 'gait', 'abnormal walk', 'difficulty walking', 'uneven gait', 'antalgic gait', 'favoring leg', 'compensating walk', 'walking aid', 'cane use'],
    misspellings: ['gate abnormality', 'gait abnormalty', 'gait abnormolity'],
    bodySystem: 'Lower Extremity',
  },

  // ============================================
  // MUSCULOSKELETAL - GENERAL
  // ============================================
  {
    id: 'fibromyalgia',
    name: 'Fibromyalgia',
    abbreviation: 'Fibromyalgia',
    category: 'musculoskeletal',
    diagnosticCode: '5025',
    typicalRatings: '10-40%',
    description: 'Chronic widespread musculoskeletal pain',
    commonSecondaries: ['depression', 'anxiety', 'sleep-apnea', 'migraines', 'chronic-fatigue'],
    keywords: ['widespread pain', 'muscle pain', 'tender points', 'fibro', 'chronic pain', 'body aches', 'fatigue', 'trigger points', 'pain all over', 'joint pain', 'muscle tenderness', 'fibromyalgia flare'],
    misspellings: ['fibromialgia', 'fibromyalga', 'fibromyagia', 'firbomyalgia', 'fibromialga'],
    bodySystem: 'Whole Body',
  },
  {
    id: 'chronic-fatigue',
    name: 'Chronic Fatigue Syndrome',
    abbreviation: 'CFS',
    category: 'musculoskeletal',
    diagnosticCode: '6354',
    typicalRatings: '10-100%',
    description: 'Extreme fatigue not relieved by rest',
    commonSecondaries: ['depression', 'fibromyalgia', 'sleep-apnea'],
    keywords: ['extreme tiredness', 'exhaustion', 'CFS', 'ME', 'myalgic encephalomyelitis', 'chronic tiredness', 'always tired', 'no energy', 'fatigue syndrome', 'post-exertional malaise', 'unrefreshing sleep'],
    misspellings: ['chronic fatique', 'cronic fatigue', 'chronic fatigue syndrom', 'chronic fatiuge'],
    bodySystem: 'Whole Body',
  },
  {
    id: 'rheumatoid-arthritis',
    name: 'Rheumatoid Arthritis',
    abbreviation: 'RA',
    category: 'musculoskeletal',
    diagnosticCode: '5002',
    typicalRatings: '20-100%',
    description: 'Autoimmune inflammatory arthritis',
    commonSecondaries: ['depression', 'fatigue'],
    keywords: ['autoimmune arthritis', 'joint inflammation', 'RA', 'rheumatoid', 'swollen joints', 'morning stiffness', 'joint deformity', 'inflammatory arthritis', 'autoimmune joint', 'symmetrical arthritis', 'joint erosion'],
    misspellings: ['rheumatoid arthritus', 'rumatoid arthritis', 'rhumatoid arthritis', 'rheumatoid artheritis'],
    bodySystem: 'Whole Body',
  },

  // ============================================
  // RESPIRATORY CONDITIONS
  // ============================================
  {
    id: 'sleep-apnea',
    name: 'Obstructive Sleep Apnea',
    abbreviation: 'Sleep Apnea',
    category: 'respiratory',
    diagnosticCode: '6847',
    typicalRatings: '0-100%',
    description: 'Breathing repeatedly stops during sleep',
    commonSecondaries: ['depression', 'hypertension', 'erectile-dysfunction', 'migraines', 'gerd'],
    keywords: ['snoring', 'cpap', 'breathing stops', 'osa', 'sleep study', 'apnea', 'stop breathing', 'sleep test', 'CPAP machine', 'choking at night', 'gasping', 'obstructive sleep', 'daytime sleepiness', 'oxygen desaturation'],
    misspellings: ['sleep apena', 'sleep apnea', 'sleep apnia', 'sleep apena', 'sleep apneia'],
    bodySystem: 'Respiratory',
  },
  {
    id: 'asthma',
    name: 'Bronchial Asthma',
    abbreviation: 'Asthma',
    category: 'respiratory',
    diagnosticCode: '6602',
    typicalRatings: '10-100%',
    description: 'Chronic airway inflammation causing breathing difficulty',
    commonSecondaries: ['sinusitis', 'gerd', 'anxiety'],
    keywords: ['breathing difficulty', 'wheezing', 'inhaler', 'bronchial', 'shortness of breath', 'asthma attack', 'bronchospasm', 'airway inflammation', 'breathing treatment', 'albuterol', 'rescue inhaler', 'reactive airway'],
    misspellings: ['asma', 'athsma', 'asthema', 'asthama', 'astma'],
    bodySystem: 'Respiratory',
  },
  {
    id: 'copd',
    name: 'Chronic Obstructive Pulmonary Disease',
    abbreviation: 'COPD',
    category: 'respiratory',
    diagnosticCode: '6604',
    typicalRatings: '10-100%',
    description: 'Progressive lung disease causing airflow limitation',
    commonSecondaries: ['depression', 'anxiety', 'sleep-apnea'],
    keywords: ['emphysema', 'chronic bronchitis', 'lung disease', 'COPD', 'breathing problems', 'pulmonary disease', 'lung damage', 'oxygen therapy', 'FEV1', 'pulmonary function', 'shortness of breath', 'chronic cough'],
    misspellings: ['copd', 'COPD', 'cronic obstructive', 'chronic obstructive pulminary'],
    bodySystem: 'Respiratory',
  },
  {
    id: 'sinusitis',
    name: 'Chronic Sinusitis',
    abbreviation: 'Sinusitis',
    category: 'respiratory',
    diagnosticCode: '6510',
    typicalRatings: '0-50%',
    description: 'Chronic inflammation of the sinuses',
    commonSecondaries: ['asthma', 'migraines', 'rhinitis'],
    keywords: ['sinus infection', 'sinus problems', 'congestion', 'sinus pain', 'sinus pressure', 'facial pain', 'nasal congestion', 'sinus drainage', 'sinus headache', 'chronic sinus', 'post nasal drip', 'deviated septum'],
    misspellings: ['sinusitus', 'sinusitous', 'sinusitis', 'sinusites', 'sinisitis'],
    bodySystem: 'Respiratory',
  },
  {
    id: 'rhinitis',
    name: 'Allergic Rhinitis',
    abbreviation: 'Rhinitis',
    category: 'respiratory',
    diagnosticCode: '6522',
    typicalRatings: '10-30%',
    description: 'Nasal inflammation from allergies',
    commonSecondaries: ['sinusitis', 'asthma', 'sleep-apnea'],
    keywords: ['allergies', 'runny nose', 'hay fever', 'nasal congestion', 'sneezing', 'nasal inflammation', 'stuffy nose', 'allergy', 'nasal drip', 'post nasal drip', 'nasal polyps', 'allergic nose'],
    misspellings: ['rhinitus', 'rhinites', 'rhinittis', 'rhenitis', 'rinitis'],
    bodySystem: 'Respiratory',
  },
  {
    id: 'respiratory-failure',
    name: 'Respiratory Failure',
    abbreviation: 'Respiratory Failure',
    category: 'respiratory',
    diagnosticCode: '6699',
    typicalRatings: '60-100%',
    description: 'Inability of lungs to provide adequate oxygen',
    commonSecondaries: ['depression'],
    keywords: ['breathing failure', 'oxygen dependent', 'lung failure', 'ventilator', 'oxygen tank', 'respiratory distress', 'cant breathe', 'supplemental oxygen', 'respiratory insufficiency'],
    misspellings: ['respitory failure', 'respiratory failur', 'respiritory failure'],
    bodySystem: 'Respiratory',
  },

  // ============================================
  // CARDIOVASCULAR CONDITIONS
  // ============================================
  {
    id: 'hypertension',
    name: 'Hypertension',
    abbreviation: 'High Blood Pressure',
    category: 'cardiovascular',
    diagnosticCode: '7101',
    typicalRatings: '10-60%',
    description: 'Chronically elevated blood pressure',
    commonSecondaries: ['heart-disease', 'kidney-disease', 'erectile-dysfunction', 'stroke'],
    keywords: ['blood pressure', 'hbp', 'high blood pressure', 'hypertension', 'BP', 'elevated blood pressure', 'systolic', 'diastolic', 'blood pressure medication', 'HTN', 'chronic high BP'],
    misspellings: ['hypertention', 'hypertenshion', 'hypertension', 'hypertenion', 'hipertension'],
    bodySystem: 'Heart',
  },
  {
    id: 'heart-disease',
    name: 'Coronary Artery Disease',
    abbreviation: 'Heart Disease',
    category: 'cardiovascular',
    diagnosticCode: '7005',
    typicalRatings: '10-100%',
    description: 'Narrowing of heart arteries',
    commonSecondaries: ['hypertension', 'erectile-dysfunction', 'depression'],
    keywords: ['cad', 'heart condition', 'coronary', 'heart attack', 'chest pain', 'angina', 'heart surgery', 'bypass', 'stent', 'cardiac', 'ischemic heart', 'blocked arteries', 'MI', 'myocardial infarction'],
    misspellings: ['heart desease', 'heart diease', 'coronery artery', 'corenary'],
    bodySystem: 'Heart',
  },
  {
    id: 'heart-arrhythmia',
    name: 'Cardiac Arrhythmia',
    abbreviation: 'Arrhythmia',
    category: 'cardiovascular',
    diagnosticCode: '7010',
    typicalRatings: '10-100%',
    description: 'Irregular heartbeat',
    commonSecondaries: ['anxiety', 'heart-disease'],
    keywords: ['irregular heartbeat', 'afib', 'atrial fibrillation', 'heart rhythm', 'palpitations', 'heart flutter', 'rapid heartbeat', 'tachycardia', 'bradycardia', 'heart racing', 'skipped beats', 'pacemaker'],
    misspellings: ['arrhythmia', 'arythmia', 'arrythmia', 'arrhithmia', 'cardiac arythmia'],
    bodySystem: 'Heart',
  },
  {
    id: 'stroke',
    name: 'Cerebrovascular Accident (Stroke)',
    abbreviation: 'Stroke',
    category: 'cardiovascular',
    diagnosticCode: '8008',
    typicalRatings: '10-100%',
    description: 'Brain damage from interrupted blood supply',
    commonSecondaries: ['depression', 'cognitive-disorder', 'hypertension'],
    keywords: ['cva', 'brain attack', 'stroke', 'TIA', 'transient ischemic', 'mini stroke', 'cerebral', 'paralysis', 'speech difficulty', 'hemiplegia', 'blood clot brain', 'brain bleed'],
    misspellings: ['stoke', 'stroek', 'cerebrovascular accedent'],
    bodySystem: 'Brain',
  },
  {
    id: 'peripheral-vascular',
    name: 'Peripheral Vascular Disease',
    abbreviation: 'PVD',
    category: 'cardiovascular',
    diagnosticCode: '7114',
    typicalRatings: '20-100%',
    description: 'Reduced blood flow to limbs',
    commonSecondaries: ['hypertension', 'diabetes', 'heart-disease'],
    keywords: ['circulation problems', 'claudication', 'pad', 'peripheral artery', 'poor circulation', 'leg circulation', 'vascular disease', 'blood flow', 'cold feet', 'numbness legs', 'intermittent claudication'],
    misspellings: ['periferal vascular', 'peripheral vasculer', 'peripheral vasular'],
    bodySystem: 'Heart',
  },

  // ============================================
  // DIGESTIVE CONDITIONS
  // ============================================
  {
    id: 'gerd',
    name: 'Gastroesophageal Reflux Disease',
    abbreviation: 'GERD',
    category: 'digestive',
    diagnosticCode: '7346',
    typicalRatings: '10-60%',
    description: 'Chronic acid reflux causing heartburn',
    commonSecondaries: ['sleep-apnea', 'asthma', 'hiatal-hernia', 'barretts'],
    keywords: ['acid reflux', 'heartburn', 'reflux', 'GERD', 'stomach acid', 'esophagus', 'burning chest', 'acid regurgitation', 'indigestion', 'gastric reflux', 'reflux disease', 'esophageal'],
    misspellings: ['gurd', 'gerds', 'gastroesophageal reflux', 'gastroesophagial'],
    bodySystem: 'Digestive',
  },
  {
    id: 'ibs',
    name: 'Irritable Bowel Syndrome',
    abbreviation: 'IBS',
    category: 'digestive',
    diagnosticCode: '7319',
    typicalRatings: '0-30%',
    description: 'Chronic intestinal disorder with pain and bowel changes',
    commonSecondaries: ['anxiety', 'depression', 'gerd'],
    keywords: ['bowel problems', 'stomach pain', 'diarrhea', 'constipation', 'IBS', 'irritable bowel', 'abdominal pain', 'bloating', 'gas', 'cramping', 'bowel changes', 'intestinal problems', 'gut issues'],
    misspellings: ['iritable bowel', 'irritible bowel', 'irritable bowle', 'irratable bowel'],
    bodySystem: 'Digestive',
  },
  {
    id: 'hiatal-hernia',
    name: 'Hiatal Hernia',
    abbreviation: 'Hiatal Hernia',
    category: 'digestive',
    diagnosticCode: '7346',
    typicalRatings: '10-60%',
    description: 'Stomach pushes through diaphragm',
    commonSecondaries: ['gerd', 'sleep-apnea'],
    keywords: ['hernia', 'stomach hernia', 'hiatal', 'diaphragm hernia', 'chest pain eating', 'difficulty swallowing', 'acid reflux', 'stomach protrusion', 'paraesophageal hernia'],
    misspellings: ['hiatal herna', 'hiatal hurnia', 'hiatel hernia', 'hiatial hernia'],
    bodySystem: 'Digestive',
  },
  {
    id: 'barretts',
    name: "Barrett's Esophagus",
    abbreviation: "Barrett's",
    category: 'digestive',
    diagnosticCode: '7346',
    typicalRatings: '10-30%',
    description: 'Precancerous changes from chronic GERD',
    commonSecondaries: ['gerd'],
    keywords: ['esophagus damage', 'barrett esophagus', 'precancerous esophagus', 'esophageal changes', 'GERD complication', 'acid damage esophagus', 'metaplasia', 'esophageal cancer risk'],
    misspellings: ['barretts', 'barrets', 'baretts', 'barrett', 'barretes'],
    bodySystem: 'Digestive',
  },
  {
    id: 'crohns',
    name: "Crohn's Disease",
    abbreviation: "Crohn's",
    category: 'digestive',
    diagnosticCode: '7323',
    typicalRatings: '10-100%',
    description: 'Inflammatory bowel disease',
    commonSecondaries: ['depression', 'anxiety', 'arthritis'],
    keywords: ['ibd', 'inflammatory bowel', 'intestinal', 'crohns disease', 'bowel inflammation', 'GI tract', 'flare ups', 'abdominal pain', 'bloody stool', 'weight loss', 'chronic diarrhea', 'fistula'],
    misspellings: ['crohns', 'chrons', 'crohn', 'chronns', 'crowns disease'],
    bodySystem: 'Digestive',
  },
  {
    id: 'ulcerative-colitis',
    name: 'Ulcerative Colitis',
    abbreviation: 'Ulcerative Colitis',
    category: 'digestive',
    diagnosticCode: '7323',
    typicalRatings: '10-100%',
    description: 'Inflammatory bowel disease affecting colon',
    commonSecondaries: ['depression', 'anxiety'],
    keywords: ['ibd', 'colon inflammation', 'ulcerative', 'colitis', 'bloody diarrhea', 'colon disease', 'rectal bleeding', 'bowel urgency', 'GI tract', 'large intestine', 'inflammatory bowel'],
    misspellings: ['ulcerative colitis', 'ulcerative colitus', 'ulcerive colitis', 'uclerative colitis', 'ulcerative collitis'],
    bodySystem: 'Digestive',
  },
  {
    id: 'liver-disease',
    name: 'Chronic Liver Disease',
    abbreviation: 'Liver Disease',
    category: 'digestive',
    diagnosticCode: '7312',
    typicalRatings: '10-100%',
    description: 'Progressive liver damage',
    commonSecondaries: ['depression', 'fatigue'],
    keywords: ['cirrhosis', 'hepatic', 'liver damage', 'liver failure', 'hepatitis', 'fatty liver', 'liver fibrosis', 'jaundice', 'liver function', 'liver enzymes', 'NAFLD', 'alcoholic liver'],
    misspellings: ['liver desease', 'liver diease', 'cirrosis', 'chirrosis'],
    bodySystem: 'Digestive',
  },

  // ============================================
  // ENDOCRINE CONDITIONS
  // ============================================
  {
    id: 'diabetes',
    name: 'Diabetes Mellitus Type 2',
    abbreviation: 'Diabetes',
    category: 'endocrine',
    diagnosticCode: '7913',
    typicalRatings: '10-100%',
    description: 'Chronic metabolic disorder affecting blood sugar',
    commonSecondaries: ['peripheral-neuropathy', 'hypertension', 'erectile-dysfunction', 'kidney-disease', 'vision-loss'],
    keywords: ['type 2 diabetes', 'blood sugar', 'diabetic', 'insulin', 'diabetes mellitus', 'A1C', 'glucose', 'high blood sugar', 'insulin resistance', 'metformin', 'type II diabetes', 'DM2', 'sugar diabetes'],
    misspellings: ['diabeties', 'diabetis', 'diabeetes', 'diebetes', 'diabites'],
    bodySystem: 'Endocrine',
  },
  {
    id: 'hypothyroidism',
    name: 'Hypothyroidism',
    abbreviation: 'Hypothyroidism',
    category: 'endocrine',
    diagnosticCode: '7903',
    typicalRatings: '10-100%',
    description: 'Underactive thyroid gland',
    commonSecondaries: ['depression', 'fatigue', 'weight-gain'],
    keywords: ['low thyroid', 'underactive thyroid', 'thyroid', 'hypothyroid', 'TSH', 'levothyroxine', 'synthroid', 'hashimotos', 'thyroid gland', 'weight gain thyroid', 'cold intolerance', 'thyroid hormone'],
    misspellings: ['hypothyroidism', 'hypothyroidisim', 'hypothyriodism', 'hypothyrodism', 'hypothyroidsim'],
    bodySystem: 'Endocrine',
  },
  {
    id: 'hyperthyroidism',
    name: 'Hyperthyroidism',
    abbreviation: 'Hyperthyroidism',
    category: 'endocrine',
    diagnosticCode: '7900',
    typicalRatings: '10-100%',
    description: 'Overactive thyroid gland',
    commonSecondaries: ['anxiety', 'heart-arrhythmia'],
    keywords: ['overactive thyroid', 'graves disease', 'thyroid', 'hyperthyroid', 'TSH', 'thyrotoxicosis', 'weight loss thyroid', 'rapid heartbeat thyroid', 'thyroid storm', 'heat intolerance'],
    misspellings: ['hyperthyroidisim', 'hyperthyriodism', 'hyperthyrodism', 'hyperthoroidism'],
    bodySystem: 'Endocrine',
  },

  // ============================================
  // GENITOURINARY CONDITIONS
  // ============================================
  {
    id: 'erectile-dysfunction',
    name: 'Erectile Dysfunction',
    abbreviation: 'ED',
    category: 'genitourinary',
    diagnosticCode: '7522',
    typicalRatings: '0-20%',
    description: 'Inability to maintain erection (secondary to medications or other conditions)',
    commonSecondaries: ['depression'],
    keywords: ['impotence', 'sexual dysfunction', 'ED', 'erectile', 'erection problems', 'sexual problems', 'performance issues', 'SMC', 'special monthly compensation', 'loss of use', 'medication side effect'],
    misspellings: ['erectile disfunction', 'erectal dysfunction', 'erectile dysfuntion', 'erictile dysfunction'],
    bodySystem: 'Genitourinary',
  },
  {
    id: 'kidney-disease',
    name: 'Chronic Kidney Disease',
    abbreviation: 'CKD',
    category: 'genitourinary',
    diagnosticCode: '7530',
    typicalRatings: '0-100%',
    description: 'Progressive loss of kidney function',
    commonSecondaries: ['hypertension', 'diabetes', 'depression'],
    keywords: ['renal failure', 'kidney failure', 'CKD', 'kidney disease', 'renal disease', 'dialysis', 'kidney function', 'GFR', 'creatinine', 'kidney damage', 'end stage renal', 'kidney transplant'],
    misspellings: ['kidney desease', 'kidney diease', 'kidny disease', 'renal faliure'],
    bodySystem: 'Genitourinary',
  },
  {
    id: 'prostate-condition',
    name: 'Prostate Condition (BPH)',
    abbreviation: 'Prostate',
    category: 'genitourinary',
    diagnosticCode: '7527',
    typicalRatings: '0-60%',
    description: 'Enlarged prostate or prostate problems',
    commonSecondaries: ['erectile-dysfunction', 'urinary-incontinence'],
    keywords: ['bph', 'enlarged prostate', 'prostatitis', 'prostate problems', 'frequent urination', 'prostate enlargement', 'benign prostatic', 'PSA', 'prostate cancer', 'difficulty urinating', 'weak stream', 'nocturia'],
    misspellings: ['prostate condtion', 'prostrate', 'prostate condision', 'prosate'],
    bodySystem: 'Genitourinary',
  },
  {
    id: 'urinary-incontinence',
    name: 'Urinary Incontinence',
    abbreviation: 'Incontinence',
    category: 'genitourinary',
    diagnosticCode: '7542',
    typicalRatings: '20-60%',
    description: 'Loss of bladder control',
    commonSecondaries: ['prostate-condition', 'depression'],
    keywords: ['bladder problems', 'leakage', 'bladder control', 'urinary leakage', 'incontinence', 'urine leakage', 'overactive bladder', 'stress incontinence', 'urge incontinence', 'absorbent pads', 'voiding dysfunction'],
    misspellings: ['incontinance', 'incontinence', 'urinary incontinance', 'incotinence', 'incontenance'],
    bodySystem: 'Genitourinary',
  },

  // ============================================
  // SKIN CONDITIONS
  // ============================================
  {
    id: 'eczema',
    name: 'Eczema (Dermatitis)',
    abbreviation: 'Eczema',
    category: 'skin',
    diagnosticCode: '7806',
    typicalRatings: '0-60%',
    description: 'Chronic inflammatory skin condition',
    commonSecondaries: ['depression', 'anxiety', 'sleep-apnea'],
    keywords: ['dermatitis', 'skin rash', 'itchy skin', 'eczema', 'atopic dermatitis', 'skin inflammation', 'dry skin', 'skin irritation', 'rash', 'flaky skin', 'skin condition', 'topical steroids', 'contact dermatitis'],
    misspellings: ['exzema', 'excema', 'eczma', 'ecsema', 'eczima'],
    bodySystem: 'Skin',
  },
  {
    id: 'psoriasis',
    name: 'Psoriasis',
    abbreviation: 'Psoriasis',
    category: 'skin',
    diagnosticCode: '7816',
    typicalRatings: '0-60%',
    description: 'Autoimmune skin condition with scaly patches',
    commonSecondaries: ['psoriatic-arthritis', 'depression'],
    keywords: ['skin scales', 'plaque psoriasis', 'psoriasis', 'scaly skin', 'silvery scales', 'skin patches', 'autoimmune skin', 'scalp psoriasis', 'inverse psoriasis', 'guttate', 'skin plaques', 'biologics'],
    misspellings: ['psoriasis', 'psoriases', 'psorisis', 'psoriaus', 'psoriosis', 'sorisis'],
    bodySystem: 'Skin',
  },
  {
    id: 'psoriatic-arthritis',
    name: 'Psoriatic Arthritis',
    abbreviation: 'Psoriatic Arthritis',
    category: 'skin',
    diagnosticCode: '5009',
    typicalRatings: '20-100%',
    description: 'Arthritis associated with psoriasis',
    commonSecondaries: ['psoriasis', 'depression'],
    keywords: ['joint psoriasis', 'psoriatic arthritis', 'psoriasis joints', 'joint pain skin', 'autoimmune arthritis', 'dactylitis', 'sausage fingers', 'enthesitis', 'psoriasis and joint pain'],
    misspellings: ['psoriatic arthritus', 'psoriatic arthiritis', 'psoriatric arthritis'],
    bodySystem: 'Skin',
  },
  {
    id: 'acne',
    name: 'Chloracne/Acne',
    abbreviation: 'Acne',
    category: 'skin',
    diagnosticCode: '7829',
    typicalRatings: '0-30%',
    description: 'Severe acne, often from chemical exposure',
    commonSecondaries: ['depression'],
    keywords: ['skin condition', 'cysts', 'chloracne', 'acne vulgaris', 'cystic acne', 'severe acne', 'skin breakout', 'pimples', 'agent orange acne', 'chemical acne', 'dioxin exposure'],
    misspellings: ['chloracne', 'chloracnee', 'cloracne'],
    bodySystem: 'Skin',
  },
  {
    id: 'scars',
    name: 'Scars (Disfiguring)',
    abbreviation: 'Scars',
    category: 'skin',
    diagnosticCode: '7800',
    typicalRatings: '10-80%',
    description: 'Disfiguring scars from injury or burns',
    commonSecondaries: ['depression', 'ptsd'],
    keywords: ['disfigurement', 'burn scars', 'scarring', 'scar tissue', 'keloid', 'surgical scars', 'facial scars', 'burn injury', 'skin grafts', 'hypertrophic scar', 'painful scars', 'unstable scars'],
    misspellings: ['scares', 'scars', 'scarrs'],
    bodySystem: 'Skin',
  },

  // ============================================
  // TOXIC EXPOSURE CONDITIONS
  // ============================================
  {
    id: 'burn-pit',
    name: 'Burn Pit Exposure (Presumptive)',
    abbreviation: 'Burn Pit',
    category: 'respiratory',
    diagnosticCode: '6699',
    typicalRatings: '10-100%',
    description: 'Respiratory and other conditions from burn pit exposure (PACT Act)',
    commonSecondaries: ['asthma', 'copd', 'sinusitis', 'cancer'],
    keywords: ['toxic exposure', 'pact act', 'iraq', 'afghanistan', 'burn pit', 'airborne hazards', 'open burn pit', 'toxic smoke', 'deployment exposure', 'AHOBPR', 'airborne hazards registry', 'constrictive bronchiolitis', 'lung damage deployment'],
    misspellings: ['burn pit', 'burnpit', 'burn pits', 'burn pit exposer', 'brun pit'],
    bodySystem: 'Respiratory',
  },
  {
    id: 'agent-orange',
    name: 'Agent Orange Exposure (Presumptive)',
    abbreviation: 'Agent Orange',
    category: 'other',
    diagnosticCode: '6699',
    typicalRatings: 'Various',
    description: 'Conditions from herbicide exposure in Vietnam era',
    commonSecondaries: ['diabetes', 'cancer', 'peripheral-neuropathy', 'parkinsons'],
    keywords: ['herbicide', 'vietnam', 'dioxin', 'agent orange', 'herbicide exposure', 'presumptive', 'Vietnam veteran', 'toxic herbicide', 'defoliant', 'blue water navy', 'Thailand bases', 'C-123', 'rainbow herbicides'],
    misspellings: ['agent oragne', 'agent ornage', 'agent orage', 'agant orange'],
    bodySystem: 'Whole Body',
  },
  {
    id: 'gulf-war-syndrome',
    name: 'Gulf War Syndrome',
    abbreviation: 'Gulf War Syndrome',
    category: 'other',
    diagnosticCode: '6354',
    typicalRatings: '10-100%',
    description: 'Medically unexplained chronic multi-symptom illness',
    commonSecondaries: ['chronic-fatigue', 'fibromyalgia', 'ibs', 'migraines'],
    keywords: ['gulf war illness', 'undiagnosed illness', 'gulf war', 'southwest asia', 'persian gulf', 'multi-symptom illness', 'chronic multi-symptom', 'unexplained illness', 'presumptive gulf war', 'desert storm', 'desert shield', 'OIF OEF'],
    misspellings: ['gulf war syndrom', 'gulf war syndome', 'gulf war sindrome', 'gulf war syndrone'],
    bodySystem: 'Whole Body',
  },
  {
    id: 'cancer',
    name: 'Cancer (Various)',
    abbreviation: 'Cancer',
    category: 'other',
    diagnosticCode: 'Various',
    typicalRatings: '100% during treatment',
    description: 'Malignant neoplasms - rated 100% during active treatment',
    commonSecondaries: ['depression', 'anxiety', 'fatigue'],
    keywords: ['malignant', 'tumor', 'chemotherapy', 'cancer', 'neoplasm', 'radiation therapy', 'oncology', 'carcinoma', 'lymphoma', 'leukemia', 'metastatic', 'remission', 'biopsy', 'staging'],
    misspellings: ['cancer', 'canser', 'cancir', 'cnacer'],
    bodySystem: 'Whole Body',
  },
];

/** Canonical uppercase alias — used by exportEvidence & BodyMap */
export const VA_CONDITIONS = vaConditions;

// Alias so files looking for 'Conditions' don't crash the app
export const Conditions = VA_CONDITIONS;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get a condition by ID
 */
export function getConditionById(id: string): VACondition | undefined {
  return vaConditions.find(c => c.id === id);
}

/**
 * Get conditions by category
 */
export function getConditionsByCategory(category: string): VACondition[] {
  return vaConditions.filter(c => c.category === category);
}

/**
 * Search conditions by text (matches abbreviation, name, keywords, misspellings)
 */
export function searchConditions(query: string, excludeIds: string[] = []): VACondition[] {
  if (!query.trim()) return [];

  const searchTerms = query.toLowerCase().split(' ').filter(Boolean);

  return vaConditions
    .filter(condition => {
      // Exclude already-selected conditions
      if (excludeIds.includes(condition.id)) return false;

      // Build searchable text
      const searchText = [
        condition.abbreviation,
        condition.name,
        condition.description || '',
        ...condition.keywords,
        ...(condition.misspellings || []),
      ].join(' ').toLowerCase();

      // Match all search terms
      return searchTerms.every(term => searchText.includes(term));
    })
    .sort((a, b) => {
      // Prioritize exact abbreviation match
      const aAbbr = a.abbreviation.toLowerCase();
      const bAbbr = b.abbreviation.toLowerCase();
      const queryLower = query.toLowerCase();

      if (aAbbr === queryLower) return -1;
      if (bAbbr === queryLower) return 1;
      if (aAbbr.startsWith(queryLower)) return -1;
      if (bAbbr.startsWith(queryLower)) return 1;

      return a.name.localeCompare(b.name);
    })
    .slice(0, 20);
}

/**
 * Get secondary conditions for a primary condition
 */
export function getSecondaryConditions(primaryId: string): VACondition[] {
  const primary = getConditionById(primaryId);
  if (!primary) return [];

  return primary.commonSecondaries
    .map(id => getConditionById(id))
    .filter((c): c is VACondition => c !== undefined);
}

/**
 * Get display text for a condition (abbreviation - name)
 */
export function getConditionDisplayText(condition: VACondition): string {
  if (condition.abbreviation === condition.name) {
    return condition.name;
  }
  return `${condition.abbreviation} - ${condition.name}`;
}

/**
 * Get short display text for a condition (abbreviation only)
 */
export function getConditionShortText(condition: VACondition): string {
  return condition.abbreviation;
}
