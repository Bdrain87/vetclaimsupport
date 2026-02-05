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
  category: ConditionCategory;
  diagnosticCode?: string;
  typicalRatings?: string;
  description?: string;
  commonSecondaries: string[]; // IDs of common secondary conditions
  possibleSecondaries?: string[]; // Display-friendly secondary condition names
  nexusTip?: string; // Guidance for establishing service connection nexus
  keywords: string[]; // Additional search terms
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
    keywords: ['trauma', 'nightmares', 'flashbacks', 'combat', 'mst', 'military sexual trauma'],
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
    keywords: ['sad', 'hopeless', 'mood', 'depressed'],
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
    keywords: ['worry', 'panic', 'nervous', 'fear'],
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
    keywords: ['manic', 'mood swings', 'mania'],
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
    keywords: ['psychosis', 'hallucinations', 'delusions'],
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
    keywords: ['alcohol', 'drug', 'addiction', 'alcoholism'],
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
    keywords: ['stress', 'coping', 'transition'],
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
    keywords: ['sleep', 'sleepless', 'cant sleep'],
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
    keywords: ['head injury', 'concussion', 'brain damage', 'blast'],
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
    keywords: ['headache', 'head pain', 'headaches'],
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
    keywords: ['nerve damage', 'numbness', 'tingling', 'burning'],
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
    keywords: ['pinched nerve', 'radiating pain', 'shooting pain'],
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
    keywords: ['leg pain', 'sciatic nerve', 'shooting leg pain'],
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
    keywords: ['wrist pain', 'hand numbness', 'hand tingling'],
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
    keywords: ['dizziness', 'balance', 'spinning'],
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
    keywords: ['inner ear', 'balance', 'dizziness'],
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
    keywords: ['memory loss', 'concentration', 'thinking problems'],
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
    keywords: ['seizures', 'convulsions'],
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
    keywords: ['tremor', 'shaking', 'movement disorder'],
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
    keywords: ['lou gehrigs', 'motor neuron'],
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
    keywords: ['autoimmune', 'myelin'],
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
    keywords: ['ringing ears', 'buzzing', 'ear ringing'],
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
    keywords: ['deaf', 'cant hear', 'hard of hearing'],
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
    keywords: ['blind', 'cant see', 'eyesight'],
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
    keywords: ['amd', 'central vision'],
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
    keywords: ['eye pressure', 'optic nerve'],
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
    keywords: ['cloudy vision', 'lens'],
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
    keywords: ['burning eyes', 'eye irritation'],
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
    keywords: ['lower back', 'back pain', 'disc disease', 'lumbosacral'],
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
    keywords: ['neck', 'neck pain', 'cervical spine'],
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
    keywords: ['back strain', 'lower back pain', 'muscle strain'],
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
    keywords: ['neck strain', 'neck pain', 'whiplash'],
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
    keywords: ['bulging disc', 'slipped disc', 'ruptured disc'],
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
    keywords: ['neck disc', 'bulging disc neck'],
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
    keywords: ['narrow spine', 'spinal canal'],
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
    keywords: ['curved spine', 'spine curvature'],
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
    keywords: ['shoulder pain', 'shoulder impingement'],
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
    keywords: ['shoulder tear', 'torn rotator cuff', 'shoulder tendon'],
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
    keywords: ['elbow pain', 'forearm pain'],
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
    keywords: ['elbow pain', 'inner elbow'],
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
    keywords: ['knee pain', 'knee instability', 'knee injury'],
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
    keywords: ['knee degeneration', 'knee joint'],
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
    keywords: ['ligament tear', 'knee ligament'],
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
    keywords: ['knee cartilage', 'torn meniscus'],
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
    keywords: ['hip pain', 'hip bursitis'],
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
    keywords: ['hip degeneration', 'hip joint'],
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
    keywords: ['ankle pain', 'ankle sprain', 'ankle instability'],
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
    keywords: ['heel pain', 'foot pain', 'heel spur'],
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
    keywords: ['fallen arches', 'flat foot'],
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
    keywords: ['walking problems', 'limp', 'limping'],
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
    keywords: ['widespread pain', 'muscle pain', 'tender points'],
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
    keywords: ['extreme tiredness', 'exhaustion'],
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
    keywords: ['autoimmune arthritis', 'joint inflammation'],
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
    keywords: ['snoring', 'cpap', 'breathing stops', 'osa'],
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
    keywords: ['breathing difficulty', 'wheezing', 'inhaler'],
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
    keywords: ['emphysema', 'chronic bronchitis', 'lung disease'],
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
    keywords: ['sinus infection', 'sinus problems', 'congestion'],
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
    keywords: ['allergies', 'runny nose', 'hay fever', 'nasal congestion'],
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
    keywords: ['breathing failure', 'oxygen dependent'],
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
    keywords: ['blood pressure', 'hbp'],
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
    keywords: ['cad', 'heart condition', 'coronary'],
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
    keywords: ['irregular heartbeat', 'afib', 'atrial fibrillation'],
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
    keywords: ['cva', 'brain attack'],
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
    keywords: ['circulation problems', 'claudication', 'pad'],
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
    keywords: ['acid reflux', 'heartburn', 'reflux'],
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
    keywords: ['bowel problems', 'stomach pain', 'diarrhea', 'constipation'],
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
    keywords: ['hernia', 'stomach hernia'],
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
    keywords: ['esophagus damage'],
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
    keywords: ['ibd', 'inflammatory bowel', 'intestinal'],
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
    keywords: ['ibd', 'colon inflammation'],
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
    keywords: ['cirrhosis', 'hepatic'],
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
    keywords: ['type 2 diabetes', 'blood sugar', 'diabetic'],
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
    keywords: ['low thyroid', 'underactive thyroid'],
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
    keywords: ['overactive thyroid', 'graves disease'],
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
    keywords: ['impotence', 'sexual dysfunction'],
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
    keywords: ['renal failure', 'kidney failure'],
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
    keywords: ['bph', 'enlarged prostate', 'prostatitis'],
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
    keywords: ['bladder problems', 'leakage'],
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
    keywords: ['dermatitis', 'skin rash', 'itchy skin'],
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
    keywords: ['skin scales', 'plaque psoriasis'],
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
    keywords: ['joint psoriasis'],
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
    keywords: ['skin condition', 'cysts'],
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
    keywords: ['disfigurement', 'burn scars'],
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
    keywords: ['toxic exposure', 'pact act', 'iraq', 'afghanistan'],
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
    keywords: ['herbicide', 'vietnam', 'dioxin'],
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
    keywords: ['gulf war illness', 'undiagnosed illness'],
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
    keywords: ['malignant', 'tumor', 'chemotherapy'],
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
export function getConditionsByCategory(category: ConditionCategory): VACondition[] {
  return vaConditions.filter(c => c.category === category);
}

/**
 * Search conditions by text (matches abbreviation, name, keywords)
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
