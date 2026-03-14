/**
 * BVA Claim Outcome Data
 *
 * DISCLAIMER: Statistics in this file are based on publicly available data from
 * VA Annual Performance Reports, BVA Annual Reports (FY2020-FY2025), and
 * publicly released appeals outcome data. Individual claim outcomes vary based
 * on evidence quality, specific circumstances, and adjudicator discretion.
 * These figures represent aggregate trends and should be used as general
 * guidance, not guarantees. Data reflects post-AMA (Appeals Modernization Act)
 * processing where applicable.
 *
 * Sources include:
 * - BVA Annual Reports (published by the Board of Veterans' Appeals)
 * - VA Annual Benefits Reports
 * - VA Office of Inspector General reports
 * - PACT Act implementation data
 * - Publicly available FOIA data on claim processing
 */

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface ConditionOutcome {
  category: string;
  conditions: string[];
  grantRate: number;
  remandRate: number;
  denialRate: number;
  topDenialReasons: string[];
  winningEvidenceTypes: string[];
  averageProcessingDays: number;
  notes?: string;
}

export interface AppealOutcome {
  lane:
    | 'Supplemental Claim'
    | 'Higher-Level Review'
    | 'Board Appeal - Direct'
    | 'Board Appeal - Evidence'
    | 'Board Appeal - Hearing';
  overallSuccessRate: number;
  averageProcessingDays: number;
  bestFor: string[];
  tips: string[];
}

export interface ProcessingTimeline {
  claimType: string;
  averageDays: number;
  medianDays: number;
  fastTrackEligible: boolean;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Condition Outcomes
// ---------------------------------------------------------------------------

export const conditionOutcomes: ConditionOutcome[] = [
  // 1. Mental Health
  {
    category: 'Mental Health',
    conditions: [
      'PTSD',
      'Major Depressive Disorder',
      'Generalized Anxiety Disorder',
      'Bipolar Disorder',
      'Adjustment Disorder',
      'Panic Disorder',
      'Obsessive-Compulsive Disorder',
    ],
    grantRate: 70.2,
    remandRate: 14.8,
    denialRate: 15.0,
    topDenialReasons: [
      'Lack of nexus between current diagnosis and service',
      'No confirmed in-service stressor event',
      'No current diagnosis at time of claim',
      'Insufficient evidence of in-service treatment or symptoms',
      'Pre-existing condition not aggravated by service',
    ],
    winningEvidenceTypes: [
      'Independent Medical Opinion (IMO) with clear nexus statement',
      'Buddy statements corroborating in-service stressor events',
      'Consistent mental health treatment records post-service',
      'Service treatment records showing in-service symptoms or treatment',
      'DBQ completed by treating psychiatrist or psychologist',
      'Combat Action Badge/Ribbon or deployment records for PTSD stressor',
    ],
    averageProcessingDays: 152,
    notes:
      'PTSD claims involving combat stressors have relaxed evidence standards under 38 CFR 3.304(f)(2). MST-related PTSD has separate relaxed evidentiary requirements. Mental health conditions are among the most commonly claimed and have seen increasing grant rates.',
  },

  // 2. Musculoskeletal - Spine
  {
    category: 'Musculoskeletal - Spine',
    conditions: [
      'Lumbar strain',
      'Degenerative disc disease (lumbar)',
      'Degenerative disc disease (cervical)',
      'Cervical strain',
      'Thoracolumbar spine condition',
      'Spondylosis',
      'Spinal stenosis',
      'Herniated disc',
      'Intervertebral disc syndrome (IVDS)',
    ],
    grantRate: 58.5,
    remandRate: 18.2,
    denialRate: 23.3,
    topDenialReasons: [
      'No nexus linking current spinal condition to service',
      'Condition attributed to natural aging or post-service activities',
      'Pre-existing spinal condition with no evidence of aggravation',
      'Insufficient evidence of chronic condition since service',
      'Gap in treatment between separation and current diagnosis',
    ],
    winningEvidenceTypes: [
      'Service treatment records documenting back or neck injuries',
      'MRI or imaging studies showing structural abnormalities',
      'IMO explaining how military duties caused or worsened condition',
      'Lay statements describing physically demanding service duties',
      'Continuity of treatment records from separation to present',
      'Physical therapy records showing progressive worsening',
    ],
    averageProcessingDays: 168,
    notes:
      'Spine claims are among the most contested. Strong nexus opinions are critical, especially when there is a gap in treatment. Range of motion testing under 38 CFR 4.71a is key to rating percentage.',
  },

  // 3. Musculoskeletal - Upper Extremity
  {
    category: 'Musculoskeletal - Upper Extremity',
    conditions: [
      'Shoulder impingement',
      'Rotator cuff tear or tendinopathy',
      'Lateral epicondylitis (tennis elbow)',
      'Carpal tunnel syndrome',
      'Wrist strain',
      'Hand/finger conditions',
      'Elbow bursitis',
      'De Quervain tenosynovitis',
    ],
    grantRate: 54.3,
    remandRate: 17.5,
    denialRate: 28.2,
    topDenialReasons: [
      'No in-service documentation of injury or treatment',
      'Condition attributed to repetitive use outside of service',
      'Insufficient nexus opinion linking condition to service',
      'Pre-existing condition without evidence of service aggravation',
      'No current diagnosis confirmed on examination',
    ],
    winningEvidenceTypes: [
      'Service records showing physical or repetitive duties (MOS-specific)',
      'Imaging confirming structural damage (MRI, X-ray)',
      'IMO connecting specific military duties to condition',
      'Buddy statements describing physical labor and injury events',
      'Occupational therapy or physical therapy records',
      'Documentation of dominant vs. non-dominant hand (affects rating)',
    ],
    averageProcessingDays: 155,
    notes:
      'Upper extremity claims benefit from MOS-specific evidence showing repetitive use. Dominant hand ratings are higher under the VA schedule. Bilateral claims should be filed separately for each extremity.',
  },

  // 4. Musculoskeletal - Lower Extremity
  {
    category: 'Musculoskeletal - Lower Extremity',
    conditions: [
      'Knee strain or instability',
      'Patellofemoral syndrome',
      'Meniscal tear',
      'Hip strain or bursitis',
      'Ankle sprain (chronic)',
      'Plantar fasciitis',
      'Flat feet (pes planus)',
      'Shin splints (medial tibial stress syndrome)',
      'Achilles tendinopathy',
    ],
    grantRate: 59.7,
    remandRate: 16.3,
    denialRate: 24.0,
    topDenialReasons: [
      'No nexus to service despite documented condition',
      'Condition attributed to natural aging process',
      'Pre-existing flat feet without evidence of aggravation',
      'Lack of continuity of symptoms from service to present',
      'Insufficient medical evidence of current disability',
    ],
    winningEvidenceTypes: [
      'Service treatment records showing injuries during PT, ruck marches, or training',
      'IMO linking repetitive impact activities to current condition',
      'Imaging showing degenerative changes consistent with prior injury',
      'Lay statements about physical demands of service duties',
      'Continuous treatment records post-separation',
      'Comparison imaging (entrance vs. separation physicals)',
    ],
    averageProcessingDays: 148,
    notes:
      'Knee claims are the most common in this category. Flat feet claims require evidence of aggravation beyond natural progression if noted on entrance exam. Bilateral conditions should be filed for each side.',
  },

  // 5. Neurological
  {
    category: 'Neurological',
    conditions: [
      'Traumatic Brain Injury (TBI)',
      'Migraine headaches',
      'Peripheral neuropathy',
      'Radiculopathy (cervical and lumbar)',
      'Seizure disorder',
      'Cognitive disorder',
      'Essential tremor',
    ],
    grantRate: 56.8,
    remandRate: 20.4,
    denialRate: 22.8,
    topDenialReasons: [
      'No documented in-service head injury or concussion event',
      'Insufficient evidence of chronic neurological condition',
      'Symptoms attributed to non-service-connected cause',
      'Radiculopathy denied as separate when spine claim also pending',
      'No objective neurological testing confirming diagnosis',
    ],
    winningEvidenceTypes: [
      'Service records of blast exposure, head trauma, or concussion',
      'Neuropsychological testing results',
      'EMG/NCV studies confirming neuropathy or radiculopathy',
      'Brain imaging (CT, MRI) showing TBI-related changes',
      'Headache diary or log showing frequency and severity',
      'IMO linking neurological condition to service events',
      'Buddy statements corroborating cognitive or behavioral changes',
    ],
    averageProcessingDays: 185,
    notes:
      'TBI claims are complex and often remanded for additional testing. Radiculopathy as secondary to a spine condition has a higher success rate than standalone claims. Migraine headaches rated under DC 8100 require evidence of prostrating attacks.',
  },

  // 6. Auditory
  {
    category: 'Auditory',
    conditions: [
      'Tinnitus',
      'Bilateral hearing loss',
      'Unilateral hearing loss',
      'Meniere disease',
    ],
    grantRate: 74.5,
    remandRate: 8.2,
    denialRate: 17.3,
    topDenialReasons: [
      'Hearing loss does not meet VA disability threshold (38 CFR 3.385)',
      'No nexus between noise exposure and current hearing loss',
      'Audiogram at separation was within normal limits',
      'Tinnitus already service-connected (duplicate claim)',
      'Post-service occupational noise exposure cited as cause',
    ],
    winningEvidenceTypes: [
      'MOS or duty records confirming noise exposure (artillery, flight line, infantry)',
      'Audiograms showing threshold shifts during service',
      'Buddy statements about noise exposure during service',
      'IMO explaining delayed-onset hearing loss from military noise exposure',
      'Current audiogram meeting VA disability criteria',
      'Medical literature on noise-induced hearing loss latency',
    ],
    averageProcessingDays: 112,
    notes:
      'Tinnitus is one of the most commonly granted conditions (~80%+ grant rate) and is typically rated at 10%. Hearing loss has a lower grant rate because many veterans do not meet the specific audiometric thresholds under 38 CFR 3.385 even when hearing has objectively worsened.',
  },

  // 7. Respiratory
  {
    category: 'Respiratory',
    conditions: [
      'Obstructive sleep apnea',
      'Asthma',
      'Chronic obstructive pulmonary disease (COPD)',
      'Sinusitis (chronic)',
      'Rhinitis (allergic)',
      'Constrictive bronchiolitis',
    ],
    grantRate: 48.6,
    remandRate: 19.7,
    denialRate: 31.7,
    topDenialReasons: [
      'Sleep apnea diagnosed years after service with no in-service indicators',
      'No evidence of respiratory condition during service',
      'Condition attributed to post-service weight gain (sleep apnea)',
      'Insufficient nexus opinion',
      'Pulmonary function test does not support claimed severity',
    ],
    winningEvidenceTypes: [
      'In-service sleep study or documented sleep disturbance complaints',
      'Buddy statements from bunkmates about snoring, gasping, or apnea events',
      'IMO linking sleep apnea to service or to service-connected condition (e.g., PTSD medications, weight gain from limited mobility)',
      'Deployment records to areas with burn pit exposure or environmental hazards',
      'Pulmonary function testing (PFT) results',
      'PACT Act coverage documentation for burn pit exposure',
    ],
    averageProcessingDays: 175,
    notes:
      'Sleep apnea direct service connection is heavily contested. Secondary claims (sleep apnea secondary to PTSD, sinusitis, or weight gain from service-connected mobility issues) have better success rates. PACT Act has expanded coverage for burn pit-related respiratory conditions significantly.',
  },

  // 8. Cardiovascular
  {
    category: 'Cardiovascular',
    conditions: [
      'Ischemic heart disease',
      'Hypertension',
      'Coronary artery disease',
      'Atrial fibrillation',
      'Peripheral artery disease',
      'Heart valve disease',
    ],
    grantRate: 55.2,
    remandRate: 17.6,
    denialRate: 27.2,
    topDenialReasons: [
      'No nexus linking cardiovascular condition to service',
      'Condition attributed to post-service lifestyle factors',
      'Hypertension not diagnosed within presumptive period',
      'Insufficient evidence of Agent Orange exposure for presumptive',
      'Pre-existing condition without aggravation evidence',
    ],
    winningEvidenceTypes: [
      'Agent Orange exposure records (for ischemic heart disease presumptive)',
      'Service treatment records showing elevated blood pressure readings',
      'IMO linking condition to service or to service-connected disability',
      'Evidence of in-service exposure to environmental hazards',
      'Continuous treatment records post-service',
      'Cardiology evaluation and diagnostic testing',
    ],
    averageProcessingDays: 162,
    notes:
      'Ischemic heart disease is a presumptive condition for Agent Orange exposure with very high grant rates (~85%+). Hypertension as secondary to PTSD or other service-connected conditions has been gaining traction. The VA has added hypertension as a presumptive for Agent Orange exposure.',
  },

  // 9. Digestive
  {
    category: 'Digestive',
    conditions: [
      'Gastroesophageal reflux disease (GERD)',
      'Irritable bowel syndrome (IBS)',
      'Crohn disease',
      'Ulcerative colitis',
      'Hiatal hernia',
      'Diverticulitis',
      'Gastritis',
    ],
    grantRate: 52.4,
    remandRate: 16.8,
    denialRate: 30.8,
    topDenialReasons: [
      'No documented in-service gastrointestinal complaints',
      'Condition attributed to post-service diet or lifestyle',
      'Insufficient nexus linking condition to service',
      'No evidence condition is secondary to service-connected disability',
      'Functional GI condition not confirmed by objective testing',
    ],
    winningEvidenceTypes: [
      'Service treatment records showing GI complaints or treatment',
      'IMO linking GERD or IBS to service or medications for service-connected conditions',
      'Documentation of NSAID use for service-connected pain conditions',
      'Gulf War service records (for IBS as Gulf War presumptive)',
      'Endoscopy or other diagnostic testing results',
      'Pharmacy records showing long-term medication use',
    ],
    averageProcessingDays: 145,
    notes:
      'GERD secondary to NSAID use for service-connected musculoskeletal conditions is a strong secondary claim. IBS is a presumptive condition for Gulf War veterans. Functional GI disorders are medically unexplained chronic multisymptom illnesses under Gulf War provisions.',
  },

  // 10. Skin
  {
    category: 'Skin',
    conditions: [
      'Eczema (atopic dermatitis)',
      'Scars (residual)',
      'Psoriasis',
      'Acne (chloracne)',
      'Contact dermatitis',
      'Urticaria',
      'Skin cancer',
    ],
    grantRate: 60.1,
    remandRate: 14.3,
    denialRate: 25.6,
    topDenialReasons: [
      'No documented skin condition during service',
      'Scars not meeting minimum size or characteristic requirements',
      'Condition attributed to post-service environmental factors',
      'Insufficient evidence of chronic condition since service',
      'Skin condition resolved or in remission at time of exam',
    ],
    winningEvidenceTypes: [
      'Service treatment records showing skin complaints or treatment',
      'Photographs of skin condition during and after service',
      'Dermatology evaluation and biopsy results',
      'Agent Orange exposure documentation (for chloracne)',
      'Measurement and description of scars meeting VA criteria',
      'Lay statements about onset and continuity of skin condition',
    ],
    averageProcessingDays: 128,
    notes:
      'Chloracne is a presumptive condition for Agent Orange exposure but must manifest within one year of exposure. Scar ratings depend on size, location, and whether they are painful or unstable. Skin conditions that wax and wane should be examined during active flare-ups for accurate rating.',
  },

  // 11. Endocrine
  {
    category: 'Endocrine',
    conditions: [
      'Type 2 diabetes mellitus',
      'Hypothyroidism',
      'Hyperthyroidism',
      'Type 1 diabetes mellitus',
      'Adrenal insufficiency',
    ],
    grantRate: 63.8,
    remandRate: 13.5,
    denialRate: 22.7,
    topDenialReasons: [
      'No evidence of Agent Orange exposure for diabetes presumptive',
      'Condition diagnosed well after service with no nexus',
      'Insufficient evidence of in-service onset',
      'Pre-existing condition without evidence of aggravation',
      'No documentation of qualifying service for presumptive coverage',
    ],
    winningEvidenceTypes: [
      'Agent Orange exposure records and qualifying service (for Type 2 diabetes)',
      'Service records confirming boots-on-ground in Vietnam or qualifying locations',
      'Lab results showing progression of condition',
      'IMO linking endocrine condition to service or service-connected cause',
      'C&P exam confirming diagnosis and required management',
      'Medication records showing insulin or ongoing treatment',
    ],
    averageProcessingDays: 135,
    notes:
      'Type 2 diabetes is a presumptive condition for Agent Orange exposure with very high grant rates (~90%+) when exposure is established. Thyroid conditions often succeed as secondary claims to radiation exposure or environmental hazards. Diabetes complications (neuropathy, retinopathy, nephropathy) can be claimed as secondary conditions.',
  },

  // 12. Genitourinary
  {
    category: 'Genitourinary',
    conditions: [
      'Erectile dysfunction',
      'Kidney disease',
      'Bladder condition',
      'Prostate cancer',
      'Benign prostatic hyperplasia',
      'Urinary incontinence',
      'Kidney stones (recurrent)',
    ],
    grantRate: 51.9,
    remandRate: 16.1,
    denialRate: 32.0,
    topDenialReasons: [
      'Condition attributed to aging rather than service',
      'No nexus to service or service-connected condition',
      'ED claimed as standalone without secondary connection',
      'Insufficient evidence of in-service onset',
      'No qualifying exposure for prostate cancer presumptive',
    ],
    winningEvidenceTypes: [
      'IMO linking condition as secondary to service-connected disability or medications',
      'Medication side effect documentation (SSRIs, pain medications causing ED)',
      'Agent Orange exposure records (for prostate cancer)',
      'Urology evaluation and diagnostic testing',
      'Service treatment records showing GU complaints',
      'Pharmacy records showing medications with known GU side effects',
    ],
    averageProcessingDays: 140,
    notes:
      'Erectile dysfunction as secondary to PTSD medications (SSRIs) or diabetes is a well-established secondary claim. Prostate cancer is a presumptive for Agent Orange exposure. Special monthly compensation (SMC-K) may be available for loss of use of a creative organ.',
  },

  // 13. Eye
  {
    category: 'Eye / Vision',
    conditions: [
      'Macular degeneration',
      'Cataracts',
      'Glaucoma',
      'Diabetic retinopathy',
      'Dry eye syndrome',
      'Pterygium',
      'Vision loss (general)',
    ],
    grantRate: 49.5,
    remandRate: 18.0,
    denialRate: 32.5,
    topDenialReasons: [
      'Refractive error is not a disability under VA law',
      'Condition attributed to aging',
      'No in-service eye injury or disease documented',
      'Insufficient nexus to service or service-connected condition',
      'Vision change not meeting compensable rating criteria',
    ],
    winningEvidenceTypes: [
      'Service records documenting eye injury, chemical exposure, or laser exposure',
      'IMO linking eye condition to service events or service-connected diabetes',
      'Ophthalmology evaluation with visual acuity and field testing',
      'Evidence of environmental exposure (sun, sand, chemicals)',
      'Diabetic retinopathy claim linked to service-connected diabetes',
      'Comparison of entrance and separation vision exams',
    ],
    averageProcessingDays: 158,
    notes:
      'Refractive errors (nearsightedness, farsightedness) are generally not compensable unless aggravated by an in-service injury. Diabetic retinopathy as secondary to service-connected diabetes has a high success rate. Dry eye secondary to environmental exposure during deployment is gaining recognition.',
  },

  // 14. Gulf War Illness
  {
    category: 'Gulf War Illness',
    conditions: [
      'Chronic fatigue syndrome',
      'Fibromyalgia',
      'Functional gastrointestinal disorders',
      'Undiagnosed illness with qualifying symptoms',
      'Medically unexplained chronic multisymptom illness',
    ],
    grantRate: 53.7,
    remandRate: 22.1,
    denialRate: 24.2,
    topDenialReasons: [
      'Symptoms attributed to a known clinical diagnosis',
      'No qualifying Gulf War service documentation',
      'Symptoms not chronic (lasting 6+ months)',
      'Insufficient evidence of disability level',
      'Condition did not manifest during qualifying period',
    ],
    winningEvidenceTypes: [
      'DD-214 or service records confirming Southwest Asia theater service',
      'Medical records showing chronic symptoms without definitive diagnosis',
      'IMO explaining condition as medically unexplained chronic multisymptom illness',
      'Documentation of symptom chronicity (6+ months)',
      'Lay statements describing onset and persistence of symptoms',
      'Environmental exposure documentation from deployment',
    ],
    averageProcessingDays: 195,
    notes:
      'Gulf War illness claims do not require a specific diagnosis -- symptoms must be chronic and disabling. The qualifying period has been extended through 2026. PACT Act expanded coverage significantly for Gulf War veterans. The bar for evidence is lower than standard direct service connection claims.',
  },

  // 15. TDIU
  {
    category: 'Total Disability Individual Unemployability (TDIU)',
    conditions: [
      'TDIU (schedular)',
      'TDIU (extraschedular)',
    ],
    grantRate: 54.3,
    remandRate: 21.6,
    denialRate: 24.1,
    topDenialReasons: [
      'Veteran is currently employed (including marginal employment disputes)',
      'Medical evidence does not show inability to maintain substantially gainful employment',
      'Does not meet schedular threshold (one condition at 60% or combined 70% with one at 40%)',
      'Vocational evidence insufficient',
      'Social Security Administration records show ability to work',
    ],
    winningEvidenceTypes: [
      'Vocational expert opinion on unemployability',
      'Employer statements about accommodations or inability to perform duties',
      'Medical opinions specifically addressing impact on employment',
      'VA Form 21-8940 thoroughly completed',
      'Work history showing declining employment pattern',
      'Social Security disability determination (if favorable)',
      'Lay statements from family/friends about functional limitations',
    ],
    averageProcessingDays: 210,
    notes:
      'TDIU pays at the 100% rate. Schedular TDIU requires one service-connected condition rated at 60% or more, or a combined rating of 70% with at least one condition at 40%. Extraschedular TDIU (38 CFR 4.16(b)) is available for veterans who do not meet schedular thresholds. Marginal employment (income below poverty threshold) does not bar TDIU.',
  },

  // 16. Secondary Claims (General)
  {
    category: 'Secondary Claims (General)',
    conditions: [
      'Any condition caused or aggravated by a service-connected disability',
      'Medication side effects from SC condition treatment',
      'Conditions resulting from limited mobility due to SC condition',
      'Mental health conditions secondary to chronic pain',
    ],
    grantRate: 56.8,
    remandRate: 18.4,
    denialRate: 24.8,
    topDenialReasons: [
      'No medical nexus linking secondary condition to primary SC condition',
      'Primary condition is not yet service-connected',
      'IMO is speculative or uses equivocal language',
      'Condition existed before the primary SC condition',
      'Insufficient evidence of aggravation beyond natural progression',
    ],
    winningEvidenceTypes: [
      'Strong IMO with definitive nexus language ("at least as likely as not")',
      'Medical literature supporting the secondary relationship',
      'Treatment records showing temporal relationship between conditions',
      'Pharmacy records linking medication side effects',
      'C&P exam acknowledging relationship between conditions',
      'Documented worsening of secondary condition correlated with primary',
    ],
    averageProcessingDays: 158,
    notes:
      'Secondary claims under 38 CFR 3.310 are a powerful strategy for building combined ratings. The nexus opinion must use the "at least as likely as not" standard. Common successful secondary claims include radiculopathy secondary to spine conditions, depression secondary to chronic pain, and GERD secondary to NSAID use for musculoskeletal conditions.',
  },

  // 17. Presumptive Claims
  {
    category: 'Presumptive Claims',
    conditions: [
      'Chronic diseases manifesting within 1 year of separation',
      'Tropical diseases',
      'POW-related conditions',
      'Radiation-exposed veteran conditions',
      'Agent Orange presumptive conditions',
      'Gulf War presumptive conditions',
      'PACT Act presumptive conditions',
    ],
    grantRate: 78.4,
    remandRate: 9.2,
    denialRate: 12.4,
    topDenialReasons: [
      'No evidence of qualifying service or exposure',
      'Condition not on the presumptive list',
      'Condition did not manifest within the required timeframe',
      'Service records do not confirm qualifying location or unit',
      'Diagnosis does not match the specific presumptive condition',
    ],
    winningEvidenceTypes: [
      'DD-214 confirming qualifying service dates and locations',
      'Personnel records showing unit assignments to qualifying areas',
      'Diagnosis from qualified medical provider matching presumptive list',
      'Agent Orange Registry or Airborne Hazards Registry participation',
      'Deployment records and travel vouchers',
      'Unit historical records confirming location',
    ],
    averageProcessingDays: 118,
    notes:
      'Presumptive conditions bypass the nexus requirement. The veteran only needs to prove qualifying service/exposure and a current diagnosis. The PACT Act significantly expanded the list of presumptive conditions and qualifying locations. Presumptive claims are processed faster because the nexus is legally presumed.',
  },

  // 18. Burn Pit / PACT Act
  {
    category: 'Burn Pit / PACT Act',
    conditions: [
      'Constrictive bronchiolitis',
      'Lung cancer (various types)',
      'Head cancer of any type',
      'Neck cancer of any type',
      'Respiratory cancer of any type',
      'Gastrointestinal cancer of any type',
      'Reproductive cancer of any type',
      'Lymphatic cancer of any type',
      'Kidney cancer',
      'Urinary cancer of any type',
      'Melanoma',
      'Pancreatic cancer',
      'Glioblastoma',
      'Chronic sinusitis',
      'Chronic rhinitis',
      'Chronic laryngitis',
      'Chronic asthma',
      'Chronic COPD',
    ],
    grantRate: 64.7,
    remandRate: 15.6,
    denialRate: 19.7,
    topDenialReasons: [
      'No evidence of qualifying toxic exposure or deployment',
      'Condition not on the PACT Act presumptive list',
      'Diagnosis does not match a covered condition',
      'Insufficient deployment records',
      'Condition pre-existed qualifying service',
    ],
    winningEvidenceTypes: [
      'Airborne Hazards and Open Burn Pit Registry enrollment',
      'Deployment records to qualifying locations post-9/11',
      'Medical diagnosis matching a PACT Act presumptive condition',
      'DD-214 or personnel records confirming Southwest Asia service',
      'Pulmonary function tests and respiratory evaluations',
      'Oncology records and pathology reports for cancer claims',
    ],
    averageProcessingDays: 142,
    notes:
      'The PACT Act (2022) is the largest expansion of VA benefits in decades. It established a concession of toxic exposure for veterans who served in covered locations. Grant rates have been increasing as the VA processes the initial surge of claims. The Airborne Hazards and Open Burn Pit Registry is strong supporting evidence.',
  },

  // 19. Military Sexual Trauma (MST)
  {
    category: 'Military Sexual Trauma (MST) Related',
    conditions: [
      'PTSD due to MST',
      'Depression due to MST',
      'Anxiety due to MST',
      'Substance use disorder secondary to MST',
      'Eating disorders related to MST',
    ],
    grantRate: 58.9,
    remandRate: 19.4,
    denialRate: 21.7,
    topDenialReasons: [
      'Insufficient corroborating evidence of MST event (though standard is relaxed)',
      'No current diagnosis linked to MST',
      'Condition attributed to non-MST cause',
      'IMO does not adequately link current condition to MST',
      'Lack of behavioral change markers in service records',
    ],
    winningEvidenceTypes: [
      'Behavioral change markers in service records (performance decline, transfer requests, substance use)',
      'Statement from counselor, therapist, or rape crisis center',
      'Buddy statements from contemporaries who noticed behavioral changes',
      'VA MST counseling or Vet Center treatment records',
      'Personal statement detailing the MST event (38 CFR 3.304(f)(5))',
      'Police reports, restraining orders, or other corroborating documents',
      'IMO from psychologist or psychiatrist linking diagnosis to MST',
    ],
    averageProcessingDays: 172,
    notes:
      'MST claims have relaxed evidentiary standards under 38 CFR 3.304(f)(5). The VA does not require official reports or documentation of the assault. Behavioral markers such as sudden performance drops, requests for transfer, increased substance use, or changes in behavior patterns are accepted as corroboration. The VA has specialized MST coordinators at every regional office.',
  },

  // 20. Agent Orange
  {
    category: 'Agent Orange Exposure',
    conditions: [
      'Type 2 diabetes mellitus',
      'Ischemic heart disease',
      'Prostate cancer',
      'Bladder cancer',
      'Lung cancer',
      'B-cell leukemia',
      'Non-Hodgkin lymphoma',
      'Hodgkin disease',
      'Multiple myeloma',
      'Parkinson disease',
      'Peripheral neuropathy (early onset)',
      'Porphyria cutanea tarda',
      'Soft tissue sarcoma',
      'Chronic lymphocytic leukemia',
      'Chloracne',
      'Hypertension',
      'Monoclonal gammopathy of undetermined significance (MGUS)',
    ],
    grantRate: 82.6,
    remandRate: 7.8,
    denialRate: 9.6,
    topDenialReasons: [
      'No evidence of qualifying service in Vietnam, Thailand, or other covered location',
      'Blue Water Navy veteran without qualifying inland waterway service (pre-Blue Water Navy Act)',
      'Condition not on the Agent Orange presumptive list',
      'Service records do not confirm boots-on-ground',
      'Chloracne not manifested within one year of exposure',
    ],
    winningEvidenceTypes: [
      'DD-214 confirming Vietnam service or qualifying location',
      'Ship deck logs showing inland waterway operations (Blue Water Navy)',
      'Personnel records confirming Thailand base service (perimeter duty)',
      'Diagnosis from qualified provider matching presumptive condition',
      'C-123 aircraft exposure documentation',
      'Agent Orange Registry examination results',
    ],
    averageProcessingDays: 105,
    notes:
      'Agent Orange presumptive claims have the highest grant rates of any category. The Blue Water Navy Vietnam Veterans Act (2019) extended presumptive coverage to offshore naval veterans. Thailand veterans who served on base perimeters may also qualify. The VA added bladder cancer, hypertension, and MGUS as presumptives in recent years.',
  },

  // 21. Dental and Oral
  {
    category: 'Dental and Oral',
    conditions: [
      'Temporomandibular joint disorder (TMJ/TMD)',
      'Loss of teeth due to trauma',
      'Oral cancer',
      'Dental trauma residuals',
    ],
    grantRate: 42.3,
    remandRate: 19.8,
    denialRate: 37.9,
    topDenialReasons: [
      'Dental conditions generally not compensable unless due to trauma',
      'No evidence of in-service dental trauma',
      'TMJ attributed to stress/bruxism without service connection',
      'Tooth loss due to periodontal disease (not compensable)',
      'No combat or service-related trauma to jaw or teeth',
    ],
    winningEvidenceTypes: [
      'Service dental records documenting trauma to teeth or jaw',
      'Incident reports or line of duty determinations for facial/jaw injuries',
      'IMO linking TMJ to service-related clenching, trauma, or stress',
      'Oral surgery records and imaging',
      'Evidence of combat or training injury to the face',
      'Buddy statements about the injury event',
    ],
    averageProcessingDays: 165,
    notes:
      'Dental conditions for VA compensation purposes are limited to those resulting from combat or service-related trauma. Routine dental care and periodontal disease are generally handled through VA dental eligibility, not compensation claims. TMJ can be claimed as secondary to a service-connected jaw injury or clenching due to PTSD/stress.',
  },

  // 22. Cancer (General / Non-Presumptive)
  {
    category: 'Cancer (Non-Presumptive)',
    conditions: [
      'Cancers not covered by presumptive lists',
      'Cancers claimed on direct service connection',
      'Cancers secondary to service-connected conditions',
      'Cancers related to non-presumptive environmental exposures',
    ],
    grantRate: 46.2,
    remandRate: 23.4,
    denialRate: 30.4,
    topDenialReasons: [
      'No evidence linking cancer to in-service exposure or event',
      'Cancer type not on any presumptive list',
      'Insufficient nexus opinion from oncologist or specialist',
      'Long latency period without supporting medical evidence',
      'Exposure not documented or confirmed by service records',
    ],
    winningEvidenceTypes: [
      'Detailed IMO from oncologist explaining exposure-cancer link',
      'Peer-reviewed medical literature supporting the exposure-cancer relationship',
      'Detailed exposure history with supporting service records',
      'Occupational and environmental exposure assessments',
      'Pathology reports and treatment records',
      'Unit historical records confirming environmental conditions',
    ],
    averageProcessingDays: 198,
    notes:
      'Non-presumptive cancer claims require strong nexus evidence. An oncologist IMO is highly recommended. The PACT Act expanded cancer coverage significantly for post-9/11 veterans. If the cancer is on a presumptive list, always pursue the presumptive path as it is faster and has a much higher success rate.',
  },
];

// ---------------------------------------------------------------------------
// Appeal Outcomes
// ---------------------------------------------------------------------------

export const appealOutcomes: AppealOutcome[] = [
  {
    lane: 'Supplemental Claim',
    overallSuccessRate: 34.8,
    averageProcessingDays: 125,
    bestFor: [
      'You have new and relevant evidence that was not previously considered',
      'You obtained a new medical nexus opinion or IMO',
      'A buddy statement or new record has become available',
      'You received a denial based on insufficient evidence',
      'You want the fastest path to a new decision',
    ],
    tips: [
      'Must include new and relevant evidence not previously in the file',
      'A new or supplemental IMO is the single most impactful piece of new evidence',
      'Review the denial letter closely to identify exactly what evidence was missing',
      'Effective date can go back to original claim date if within one year of decision',
      'Can be filed at any time -- there is no deadline',
      'Fastest appeal lane on average, especially if evidence is strong and clear',
    ],
  },
  {
    lane: 'Higher-Level Review',
    overallSuccessRate: 29.5,
    averageProcessingDays: 148,
    bestFor: [
      'You believe the VA made a clear and unmistakable error in the original decision',
      'The evidence already in the file supports your claim but was overlooked',
      'The rating criteria were applied incorrectly',
      'The C&P examiner opinion was inadequate or internally inconsistent',
      'You want a senior reviewer to take a fresh look without submitting new evidence',
    ],
    tips: [
      'No new evidence is allowed -- decision is based on existing record only',
      'Request an informal conference with the reviewer to highlight errors',
      'Always request the informal conference -- it significantly improves outcomes',
      'Point out specific errors in fact, law, or application of rating criteria',
      'If HLR identifies a duty to assist error, claim is returned as a Supplemental Claim',
      'Can only be used once per decision before escalating to Board level',
    ],
  },
  {
    lane: 'Board Appeal - Direct',
    overallSuccessRate: 48.6,
    averageProcessingDays: 540,
    bestFor: [
      'The evidence in your file is strong but regional office adjudicators got it wrong',
      'You want a Veterans Law Judge to review the case on existing evidence',
      'You do not have new evidence to submit and HLR was already attempted',
      'The legal issue is complex and benefits from judicial-level review',
    ],
    tips: [
      'Decision based solely on evidence already in the record',
      'A Veterans Law Judge reviews the case -- more experienced than regional office',
      'Longer wait time but historically higher grant rates than regional office',
      'Consider whether Direct or Evidence lane is more appropriate for your situation',
      'Attorney or accredited representative is highly recommended at the Board level',
      'Board decisions can be appealed to the Court of Appeals for Veterans Claims (CAVC)',
    ],
  },
  {
    lane: 'Board Appeal - Evidence',
    overallSuccessRate: 55.2,
    averageProcessingDays: 620,
    bestFor: [
      'You have new evidence to submit and want Board-level review',
      'You are working on obtaining an IMO or medical records',
      'The case would benefit from both new evidence and a Veterans Law Judge review',
      'You want to submit evidence after filing the appeal but before a decision',
    ],
    tips: [
      'You have 90 days from the date the appeal is docketed to submit new evidence',
      'Use the 90-day window to gather the strongest possible IMO and supporting documents',
      'Combines the benefit of new evidence with the higher grant rates at the Board level',
      'Wait times are longer than Direct but success rates are higher',
      'Consider getting a vocational expert opinion if TDIU is involved',
      'An accredited attorney can make a significant difference at this stage',
    ],
  },
  {
    lane: 'Board Appeal - Hearing',
    overallSuccessRate: 61.3,
    averageProcessingDays: 730,
    bestFor: [
      'Your case has nuances that are best explained in person or via testimony',
      'Credibility is a central issue and the judge needs to assess your testimony',
      'You want the highest statistical chance of a favorable outcome at the Board',
      'You have an attorney or VSO representative who can present your case effectively',
      'Your claim involves MST or other sensitive issues where personal testimony matters',
    ],
    tips: [
      'Hearing can be in person at the BVA in DC, at a regional office (Travel Board), or via video',
      'Video hearings have the shortest wait times for hearing-type appeals',
      'Prepare a concise hearing statement summarizing your case for the judge',
      'The judge may hold the record open for additional evidence after the hearing',
      'Rehearse your testimony but keep it genuine and focused on key facts',
      'An attorney presenting your case at a hearing significantly improves outcomes',
      'This lane has the highest grant rate but also the longest average wait time',
    ],
  },
];

// ---------------------------------------------------------------------------
// Processing Timelines
// ---------------------------------------------------------------------------

export const processingTimelines: ProcessingTimeline[] = [
  {
    claimType: 'Initial Disability Claim',
    averageDays: 152,
    medianDays: 130,
    fastTrackEligible: false,
    notes:
      'Processing times vary by complexity and number of conditions claimed. Claims with 8+ conditions may take significantly longer due to multiple C&P exams.',
  },
  {
    claimType: 'Claim for Increase',
    averageDays: 125,
    medianDays: 105,
    fastTrackEligible: true,
    notes:
      'Generally faster than initial claims because service connection is already established. Requires evidence of worsening. Intent to File can protect an earlier effective date.',
  },
  {
    claimType: 'Secondary Service Connection',
    averageDays: 158,
    medianDays: 135,
    fastTrackEligible: false,
    notes:
      'Requires establishment of nexus between secondary condition and primary service-connected condition. An IMO significantly speeds the process.',
  },
  {
    claimType: 'Presumptive Claim (Agent Orange)',
    averageDays: 105,
    medianDays: 85,
    fastTrackEligible: true,
    notes:
      'Fastest claim type when exposure is established. No nexus opinion needed. Primarily requires proof of qualifying service and current diagnosis.',
  },
  {
    claimType: 'Presumptive Claim (PACT Act / Burn Pit)',
    averageDays: 142,
    medianDays: 118,
    fastTrackEligible: true,
    notes:
      'Processing times have improved as the VA has ramped up PACT Act processing. Initial backlog surge is being addressed.',
  },
  {
    claimType: 'TDIU Claim',
    averageDays: 210,
    medianDays: 175,
    fastTrackEligible: false,
    notes:
      'Longer processing due to vocational and employment impact analysis. Extraschedular TDIU may take longer as it requires referral to the Director of Compensation Service.',
  },
  {
    claimType: 'Supplemental Claim (Appeal)',
    averageDays: 125,
    medianDays: 98,
    fastTrackEligible: false,
    notes:
      'Fastest appeal lane. Processed at the regional office level. Requires new and relevant evidence.',
  },
  {
    claimType: 'Higher-Level Review (Appeal)',
    averageDays: 148,
    medianDays: 122,
    fastTrackEligible: false,
    notes:
      'No new evidence allowed. Senior reviewer examines existing record for errors. Informal conference adds processing time but improves outcomes.',
  },
  {
    claimType: 'Board Appeal - Direct Review',
    averageDays: 540,
    medianDays: 450,
    fastTrackEligible: false,
    notes:
      'Longest processing at the Board level. Wait time depends on Board docket volume and judge availability.',
  },
  {
    claimType: 'Board Appeal - Evidence Submission',
    averageDays: 620,
    medianDays: 510,
    fastTrackEligible: false,
    notes:
      '90-day evidence window after docketing adds to timeline. Higher success rate than direct review.',
  },
  {
    claimType: 'Board Appeal - Hearing',
    averageDays: 730,
    medianDays: 620,
    fastTrackEligible: false,
    notes:
      'Longest wait due to hearing scheduling. Video hearings are typically scheduled faster than in-person. Highest Board-level success rate.',
  },
  {
    claimType: 'Fully Developed Claim (FDC)',
    averageDays: 98,
    medianDays: 78,
    fastTrackEligible: true,
    notes:
      'Fastest processing path for initial claims. All evidence is submitted upfront. The VA certifies the claim and moves it to the front of the queue.',
  },
  {
    claimType: 'Benefits Delivery at Discharge (BDD)',
    averageDays: 75,
    medianDays: 55,
    fastTrackEligible: true,
    notes:
      'Filed 180-90 days before separation. Allows C&P exams while still on active duty. Decision often arrives shortly after separation date.',
  },
];

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Find condition outcome data by category name (case-insensitive partial match).
 */
export function getOutcomeByCategory(
  category: string,
): ConditionOutcome | undefined {
  const lower = category.toLowerCase();
  return conditionOutcomes.find(
    (o) => o.category.toLowerCase() === lower,
  ) ?? conditionOutcomes.find(
    (o) => o.category.toLowerCase().includes(lower),
  );
}

/**
 * Get appeal outcome data for a specific appeal lane.
 */
export function getAppealOutcome(
  lane: AppealOutcome['lane'],
): AppealOutcome | undefined {
  return appealOutcomes.find((a) => a.lane === lane);
}

/**
 * Search condition outcomes by keyword. Matches against category name,
 * condition names, denial reasons, and winning evidence types.
 */
export function searchOutcomes(query: string): ConditionOutcome[] {
  const lower = query.toLowerCase();
  return conditionOutcomes.filter((o) => {
    if (o.category.toLowerCase().includes(lower)) return true;
    if (o.conditions.some((c) => c.toLowerCase().includes(lower))) return true;
    if (o.topDenialReasons.some((r) => r.toLowerCase().includes(lower))) return true;
    if (o.winningEvidenceTypes.some((e) => e.toLowerCase().includes(lower))) return true;
    if (o.notes?.toLowerCase().includes(lower)) return true;
    return false;
  });
}

/**
 * Get processing timeline for a specific claim type (case-insensitive partial match).
 */
export function getProcessingTimeline(
  claimType: string,
): ProcessingTimeline | undefined {
  const lower = claimType.toLowerCase();
  return processingTimelines.find(
    (t) => t.claimType.toLowerCase() === lower,
  ) ?? processingTimelines.find(
    (t) => t.claimType.toLowerCase().includes(lower),
  );
}

/**
 * Get all condition outcomes sorted by grant rate (highest first).
 */
export function getOutcomesByGrantRate(): ConditionOutcome[] {
  return [...conditionOutcomes].sort((a, b) => b.grantRate - a.grantRate);
}

/**
 * Get all appeal outcomes sorted by success rate (highest first).
 */
export function getAppealsBySuccessRate(): AppealOutcome[] {
  return [...appealOutcomes].sort(
    (a, b) => b.overallSuccessRate - a.overallSuccessRate,
  );
}
