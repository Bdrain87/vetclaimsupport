/**
 * Evidence Requirements per Condition
 * Based on 38 CFR, VA DBQ forms, and standard claims filing practice.
 */

export interface EvidenceItem {
  type: 'required' | 'recommended' | 'strongly-recommended';
  description: string;
  dbqForm?: string;
  source?: string;
}

export interface RatingLevelEvidence {
  ratingPercent: number;
  keyEvidence: string[];
}

export interface ConditionEvidence {
  conditionId: string;
  conditionName: string;
  diagnosticCode: string;
  requiredEvidence: EvidenceItem[];
  recommendedEvidence: EvidenceItem[];
  commonEvidenceGaps: string[];
  ratingLevelEvidence: RatingLevelEvidence[];
  tips: string[];
}

export const evidenceRequirements: ConditionEvidence[] = [
  // ──────────────────────────────────────────────
  // MENTAL HEALTH CONDITIONS
  // ──────────────────────────────────────────────
  {
    conditionId: 'ptsd',
    conditionName: 'Post-Traumatic Stress Disorder (PTSD)',
    diagnosticCode: '9411',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of PTSD conforming to DSM-5 criteria', dbqForm: 'DBQ - PTSD Review', source: '38 CFR 4.125' },
      { type: 'required', description: 'Credible supporting evidence that the claimed in-service stressor occurred (combat records, personnel records, buddy statements, or verified stressor)', source: '38 CFR 3.304(f)' },
      { type: 'required', description: 'Medical nexus opinion linking current PTSD to verified in-service stressor', dbqForm: 'DBQ - PTSD Review' },
      { type: 'required', description: 'Service treatment records (STRs) or personnel records showing service dates and assignments' },
      { type: 'required', description: 'Completed VA Form 21-0781 (Statement in Support of Claim for PTSD) detailing stressor events' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Buddy/lay statements from fellow service members corroborating stressor events' },
      { type: 'recommended', description: 'Records of mental health treatment during or after service' },
      { type: 'strongly-recommended', description: 'Private psychologist or psychiatrist independent medical opinion (IMO) with full rationale' },
      { type: 'recommended', description: 'Documentation of occupational and social impairment (employment records, personal statements)' },
    ],
    commonEvidenceGaps: [
      'Missing or incomplete VA Form 21-0781 with stressor details',
      'No verified in-service stressor - VA requires corroboration for non-combat PTSD claims',
      'Diagnosis does not conform to DSM-5 criteria or uses outdated terminology',
      'Nexus opinion lacks adequate rationale connecting current symptoms to service',
      'Failure to document frequency and severity of symptoms such as nightmares, flashbacks, and hypervigilance',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['Diagnosis confirmed but symptoms not severe enough to interfere with occupational or social functioning', 'Symptoms controlled by continuous medication'] },
      { ratingPercent: 10, keyEvidence: ['Mild or transient symptoms under stress', 'Occupational and social impairment due to mild or transient symptoms that decrease work efficiency only during periods of significant stress'] },
      { ratingPercent: 30, keyEvidence: ['Occasional decrease in work efficiency with intermittent inability to perform tasks', 'Depressed mood, anxiety, suspiciousness, chronic sleep impairment'] },
      { ratingPercent: 50, keyEvidence: ['Reduced reliability and productivity due to symptoms like flattened affect, circumstantial speech, panic attacks more than once per week', 'Difficulty understanding complex commands, impaired judgment or abstract thinking'] },
      { ratingPercent: 70, keyEvidence: ['Deficiencies in most areas including work, school, family relations, judgment, thinking, or mood', 'Suicidal ideation, obsessional rituals, near-continuous panic or depression', 'Inability to establish and maintain effective relationships'] },
    ],
    tips: [
      'If your stressor is related to combat, fear of hostile military or terrorist activity, or military sexual trauma (MST), different verification rules apply under 38 CFR 3.304(f)',
      'Keep a symptom journal documenting nightmares, flashbacks, avoidance behaviors, and hyperarousal for at least 30 days before your C&P exam',
      'Be specific about how PTSD affects your daily life, work performance, and relationships during the C&P exam',
      'If you have comorbid conditions like depression or anxiety, ensure each is documented separately or the examiner addresses whether they overlap',
    ],
  },
  {
    conditionId: 'depression',
    conditionName: 'Major Depressive Disorder',
    diagnosticCode: '9434',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of Major Depressive Disorder per DSM-5 criteria', dbqForm: 'DBQ - Mental Disorders (other than PTSD)' },
      { type: 'required', description: 'Medical nexus opinion linking depression to military service or a service-connected condition' },
      { type: 'required', description: 'Service treatment records or evidence of onset during service' },
      { type: 'required', description: 'Documentation of current symptoms and their severity' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Continuous treatment records showing chronicity of depression since service' },
      { type: 'strongly-recommended', description: 'Independent medical opinion from a licensed psychiatrist or psychologist' },
      { type: 'recommended', description: 'Buddy or lay statements describing observable changes in mood, behavior, and functioning' },
      { type: 'recommended', description: 'Employment records showing decreased performance or job loss due to depression' },
    ],
    commonEvidenceGaps: [
      'No documented nexus between current depression and military service',
      'Gap in treatment records between service and current diagnosis',
      'Failure to differentiate depression from other mental health conditions',
      'Lack of evidence showing occupational and social impairment',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Mild or transient symptoms under stress', 'Symptoms controlled by continuous medication'] },
      { ratingPercent: 30, keyEvidence: ['Occasional decrease in work efficiency', 'Depressed mood, chronic sleep impairment, mild memory loss'] },
      { ratingPercent: 50, keyEvidence: ['Reduced reliability and productivity', 'Difficulty maintaining social and work relationships', 'Panic attacks more than once per week'] },
      { ratingPercent: 70, keyEvidence: ['Deficiencies in most areas of life', 'Suicidal ideation', 'Near-continuous depression affecting ability to function'] },
      { ratingPercent: 100, keyEvidence: ['Total occupational and social impairment', 'Persistent danger of hurting self or others', 'Gross impairment in thought processes or communication'] },
    ],
    tips: [
      'If depression is secondary to another service-connected condition (like chronic pain), file it as a secondary claim with a nexus letter explaining the connection',
      'Document how depression affects your daily routine, hygiene, motivation, and relationships',
      'Consistent treatment records strengthen your claim - seek regular mental health care',
    ],
  },
  {
    conditionId: 'anxiety',
    conditionName: 'Generalized Anxiety Disorder',
    diagnosticCode: '9400',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of Generalized Anxiety Disorder per DSM-5 criteria', dbqForm: 'DBQ - Mental Disorders (other than PTSD)' },
      { type: 'required', description: 'Medical nexus opinion linking anxiety to military service or service-connected condition' },
      { type: 'required', description: 'Service treatment records or evidence of in-service onset' },
      { type: 'required', description: 'Documentation of current symptom frequency and severity' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Treatment records showing ongoing anxiety management' },
      { type: 'strongly-recommended', description: 'Private psychiatrist or psychologist nexus letter with detailed rationale' },
      { type: 'recommended', description: 'Lay statements from family or friends describing anxiety symptoms and their impact' },
    ],
    commonEvidenceGaps: [
      'Anxiety diagnosed but no link established to military service',
      'Failure to document panic attacks, avoidance behavior, and social withdrawal',
      'No evidence of occupational impairment',
      'Symptoms attributed to a non-service-connected cause without rebuttal',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Mild symptoms under significant stress', 'Controlled with continuous medication'] },
      { ratingPercent: 30, keyEvidence: ['Occasional decrease in work efficiency', 'Anxiety, suspiciousness, chronic sleep impairment'] },
      { ratingPercent: 50, keyEvidence: ['Reduced reliability and productivity', 'Panic attacks weekly or more', 'Difficulty maintaining relationships'] },
      { ratingPercent: 70, keyEvidence: ['Deficiencies in most areas', 'Near-continuous panic or depression', 'Inability to establish effective relationships'] },
      { ratingPercent: 100, keyEvidence: ['Total occupational and social impairment', 'Persistent delusions or hallucinations', 'Danger to self or others'] },
    ],
    tips: [
      'Track panic attacks in a journal with dates, durations, and triggers',
      'If anxiety is secondary to PTSD or another condition, clearly establish that connection in your nexus letter',
      'Describe worst-day symptoms during the C&P exam rather than minimizing',
    ],
  },
  {
    conditionId: 'bipolar',
    conditionName: 'Bipolar Disorder',
    diagnosticCode: '9432',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of Bipolar Disorder per DSM-5 criteria', dbqForm: 'DBQ - Mental Disorders (other than PTSD)' },
      { type: 'required', description: 'Medical nexus opinion linking bipolar disorder to service or service-connected condition' },
      { type: 'required', description: 'Service treatment records or evidence of symptom onset during service' },
      { type: 'required', description: 'Documentation of manic and depressive episodes including frequency and severity' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Psychiatric treatment records showing longitudinal history' },
      { type: 'strongly-recommended', description: 'Independent psychiatric evaluation with full clinical rationale' },
      { type: 'recommended', description: 'Lay statements describing manic and depressive episodes observed by others' },
    ],
    commonEvidenceGaps: [
      'Bipolar disorder not differentiated from other mood disorders in the record',
      'Manic episodes not documented with sufficient detail',
      'No nexus to military service or service-connected condition',
      'Gaps in treatment history suggest condition is not chronic',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Mild or transient mood symptoms', 'Controlled with medication'] },
      { ratingPercent: 30, keyEvidence: ['Intermittent episodes causing work and social difficulty', 'Depressed mood, sleep impairment'] },
      { ratingPercent: 50, keyEvidence: ['Frequent manic or depressive episodes', 'Reduced reliability and productivity', 'Impaired judgment'] },
      { ratingPercent: 70, keyEvidence: ['Deficiencies in most areas', 'Suicidal ideation during depressive episodes', 'Inability to maintain relationships'] },
      { ratingPercent: 100, keyEvidence: ['Total occupational and social impairment', 'Persistent danger to self or others', 'Grossly inappropriate behavior'] },
    ],
    tips: [
      'Document both manic and depressive episodes separately with dates and impact on functioning',
      'Medication compliance records strengthen the claim by showing ongoing management is necessary',
      'If bipolar was first diagnosed after service, a nexus letter must explain why symptoms align with in-service onset',
    ],
  },
  {
    conditionId: 'ocd',
    conditionName: 'Obsessive-Compulsive Disorder',
    diagnosticCode: '9404',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of OCD per DSM-5 criteria', dbqForm: 'DBQ - Mental Disorders (other than PTSD)' },
      { type: 'required', description: 'Medical nexus opinion linking OCD to military service' },
      { type: 'required', description: 'Service treatment records or evidence of in-service onset' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Treatment records documenting obsessions and compulsions over time' },
      { type: 'strongly-recommended', description: 'Private psychological evaluation with nexus opinion' },
      { type: 'recommended', description: 'Lay statements describing observed rituals and their impact on daily life' },
    ],
    commonEvidenceGaps: [
      'OCD rituals not clearly documented with frequency and duration',
      'No nexus connecting OCD onset to military service',
      'Examiner attributes OCD to pre-service personality traits without adequate rationale',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Mild obsessional rituals that do not significantly interfere with functioning'] },
      { ratingPercent: 30, keyEvidence: ['Rituals that occasionally decrease work efficiency', 'Sleep impairment, anxiety'] },
      { ratingPercent: 50, keyEvidence: ['Rituals that reduce reliability and productivity', 'Time-consuming compulsions interfering with daily routine'] },
      { ratingPercent: 70, keyEvidence: ['Obsessional rituals that interfere with most areas of life', 'Near-continuous anxiety'] },
      { ratingPercent: 100, keyEvidence: ['Total occupational and social impairment due to obsessional rituals', 'Inability to perform basic self-care'] },
    ],
    tips: [
      'Describe the time spent daily on obsessions and compulsions during the C&P exam',
      'Explain how rituals affect employment, social life, and personal hygiene',
    ],
  },
  {
    conditionId: 'insomnia',
    conditionName: 'Insomnia / Sleep Disorder',
    diagnosticCode: '9499-9413',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of chronic insomnia from a qualified provider', dbqForm: 'DBQ - Mental Disorders (other than PTSD)' },
      { type: 'required', description: 'Medical nexus opinion connecting insomnia to service or a service-connected condition' },
      { type: 'required', description: 'Service treatment records or evidence of sleep problems during service' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Sleep study results if available' },
      { type: 'recommended', description: 'Pharmacy records showing prescribed sleep medications' },
      { type: 'recommended', description: 'Buddy statements describing sleep difficulties observed by spouse or roommates' },
    ],
    commonEvidenceGaps: [
      'Insomnia claimed as standalone when VA typically rates it under a mental health condition',
      'No documentation of sleep impairment frequency and duration',
      'Missing nexus to service or service-connected condition like PTSD or chronic pain',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['Diagnosed but no functional impairment', 'Controlled with medication'] },
      { ratingPercent: 10, keyEvidence: ['Mild sleep disruption under stress', 'Transient impact on daily functioning'] },
      { ratingPercent: 30, keyEvidence: ['Chronic sleep impairment causing occasional decreased work efficiency'] },
      { ratingPercent: 50, keyEvidence: ['Significant sleep disruption reducing reliability and productivity'] },
    ],
    tips: [
      'Insomnia is often best claimed as a symptom of a mental health condition (PTSD, anxiety, depression) rather than standalone',
      'If filing standalone, a sleep study and detailed symptom log strengthen the claim',
    ],
  },

  // ──────────────────────────────────────────────
  // MUSCULOSKELETAL CONDITIONS
  // ──────────────────────────────────────────────
  {
    conditionId: 'lumbar-strain',
    conditionName: 'Lumbar Spine Strain / Degenerative Disc Disease',
    diagnosticCode: '5237',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of lumbar spine condition (strain, DDD, herniation, etc.)', dbqForm: 'DBQ - Back (Thoracolumbar Spine) Conditions' },
      { type: 'required', description: 'Range of motion (ROM) measurements using a goniometer', dbqForm: 'DBQ - Back (Thoracolumbar Spine) Conditions' },
      { type: 'required', description: 'Medical nexus opinion connecting current back condition to in-service injury or activities' },
      { type: 'required', description: 'Service treatment records showing back complaints, injuries, or treatment during service' },
      { type: 'required', description: 'Documentation of pain on motion and functional loss during flare-ups per DeLuca factors' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'MRI or X-ray imaging of the lumbar spine' },
      { type: 'strongly-recommended', description: 'Independent medical opinion addressing DeLuca and Mitchell factors (pain, weakness, fatigability, incoordination)' },
      { type: 'recommended', description: 'Buddy statements describing physical limitations observed' },
      { type: 'recommended', description: 'Records of physical therapy or chiropractic treatment' },
    ],
    commonEvidenceGaps: [
      'ROM measurements taken on a good day - not reflective of flare-up limitations',
      'No documentation of painful motion, when pain begins during ROM testing',
      'Missing DeLuca/Mitchell factors analysis for functional loss during flare-ups',
      'No imaging to support degenerative changes',
      'Nexus letter does not address how military duties caused or aggravated the condition',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Forward flexion greater than 60 degrees but not greater than 85 degrees', 'Combined ROM greater than 120 degrees but not greater than 235 degrees', 'Muscle spasm or guarding not resulting in abnormal gait'] },
      { ratingPercent: 20, keyEvidence: ['Forward flexion greater than 30 degrees but not greater than 60 degrees', 'Combined ROM not greater than 120 degrees', 'Muscle spasm or guarding severe enough to result in abnormal gait or spinal contour'] },
      { ratingPercent: 40, keyEvidence: ['Forward flexion 30 degrees or less', 'Favorable ankylosis of the entire thoracolumbar spine'] },
      { ratingPercent: 50, keyEvidence: ['Unfavorable ankylosis of the entire thoracolumbar spine'] },
      { ratingPercent: 100, keyEvidence: ['Unfavorable ankylosis of the entire spine'] },
    ],
    tips: [
      'Request your C&P exam during a flare-up or ensure the examiner documents additional functional loss during flare-ups using DeLuca factors',
      'Bring recent imaging (MRI, X-ray) to your exam if the VA has not ordered any',
      'If you have radiculopathy into your legs, ensure it is evaluated separately under DC 8520',
      'Document how back pain limits daily activities like bending, lifting, sitting, and walking',
    ],
  },
  {
    conditionId: 'cervical-strain',
    conditionName: 'Cervical Spine Strain / Degenerative Disc Disease',
    diagnosticCode: '5237',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of cervical spine condition', dbqForm: 'DBQ - Neck (Cervical Spine) Conditions' },
      { type: 'required', description: 'Range of motion measurements of the cervical spine using a goniometer', dbqForm: 'DBQ - Neck (Cervical Spine) Conditions' },
      { type: 'required', description: 'Medical nexus opinion linking cervical condition to service' },
      { type: 'required', description: 'Service treatment records showing neck complaints or injuries' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'MRI or X-ray imaging of the cervical spine' },
      { type: 'strongly-recommended', description: 'Independent medical opinion with DeLuca and Mitchell factor analysis' },
      { type: 'recommended', description: 'Documentation of any associated radiculopathy in upper extremities' },
    ],
    commonEvidenceGaps: [
      'ROM measurements do not reflect flare-up limitations',
      'No imaging evidence supporting structural changes',
      'Nexus letter does not address specific in-service activities that caused neck injury',
      'Associated upper extremity radiculopathy not separately claimed',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Forward flexion greater than 30 degrees but not greater than 40 degrees', 'Combined ROM greater than 170 degrees but not greater than 335 degrees'] },
      { ratingPercent: 20, keyEvidence: ['Forward flexion greater than 15 degrees but not greater than 30 degrees', 'Combined ROM not greater than 170 degrees'] },
      { ratingPercent: 30, keyEvidence: ['Forward flexion 15 degrees or less', 'Favorable ankylosis of the entire cervical spine'] },
      { ratingPercent: 40, keyEvidence: ['Unfavorable ankylosis of the entire cervical spine'] },
      { ratingPercent: 100, keyEvidence: ['Unfavorable ankylosis of the entire spine'] },
    ],
    tips: [
      'Cervical spine conditions commonly produce secondary conditions like radiculopathy and migraines - claim those separately',
      'Ensure the examiner documents where pain begins during ROM testing',
      'If you wore heavy helmets or gear during service, document that as a contributing factor',
    ],
  },
  {
    conditionId: 'knee-strain',
    conditionName: 'Knee Strain / Degenerative Joint Disease',
    diagnosticCode: '5260',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of knee condition (strain, DJD, meniscal tear, etc.)', dbqForm: 'DBQ - Knee and Lower Leg Conditions' },
      { type: 'required', description: 'Range of motion measurements (flexion and extension) using a goniometer', dbqForm: 'DBQ - Knee and Lower Leg Conditions' },
      { type: 'required', description: 'Medical nexus opinion linking knee condition to military service' },
      { type: 'required', description: 'Service treatment records showing knee complaints or injuries' },
      { type: 'required', description: 'Joint stability testing results' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'X-ray or MRI imaging of the affected knee' },
      { type: 'recommended', description: 'Documentation of instability, locking, or giving way' },
      { type: 'strongly-recommended', description: 'Independent medical opinion addressing functional loss and DeLuca factors' },
      { type: 'recommended', description: 'Records of physical therapy or surgical treatment' },
    ],
    commonEvidenceGaps: [
      'Limitation of flexion and extension not separately documented for dual rating potential under DC 5260 and 5261',
      'Instability not tested or documented separately for potential rating under DC 5257',
      'No imaging to confirm degenerative changes',
      'ROM measurements taken without accounting for flare-ups',
      'Meniscal conditions not separately evaluated under DC 5258 or 5259',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['Flexion limited to 60 degrees (DC 5260)', 'Extension limited to 5 degrees (DC 5261)'] },
      { ratingPercent: 10, keyEvidence: ['Flexion limited to 45 degrees (DC 5260)', 'Extension limited to 10 degrees (DC 5261)', 'Slight recurrent subluxation or lateral instability (DC 5257)'] },
      { ratingPercent: 20, keyEvidence: ['Flexion limited to 30 degrees (DC 5260)', 'Extension limited to 15 degrees (DC 5261)', 'Moderate recurrent subluxation or lateral instability (DC 5257)', 'Dislocated semilunar cartilage with frequent episodes of locking, pain, and effusion (DC 5258)'] },
      { ratingPercent: 30, keyEvidence: ['Flexion limited to 15 degrees (DC 5260)', 'Extension limited to 20 degrees (DC 5261)', 'Severe recurrent subluxation or lateral instability (DC 5257)'] },
    ],
    tips: [
      'Knee conditions can be rated under multiple diagnostic codes simultaneously - limitation of flexion, limitation of extension, and instability can each receive separate ratings',
      'If you have meniscal tears, ensure they are evaluated under DC 5258 (dislocated) or DC 5259 (removal)',
      'Running, rucking, jumping, and parachute landings are all service activities that commonly cause knee injuries - document these',
      'Request bilateral knee evaluation if both knees are affected',
    ],
  },
  {
    conditionId: 'shoulder-strain',
    conditionName: 'Shoulder Strain / Rotator Cuff Injury',
    diagnosticCode: '5201',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of shoulder condition (strain, rotator cuff tear, impingement, etc.)', dbqForm: 'DBQ - Shoulder and Arm Conditions' },
      { type: 'required', description: 'Range of motion measurements (flexion, abduction, internal/external rotation)', dbqForm: 'DBQ - Shoulder and Arm Conditions' },
      { type: 'required', description: 'Medical nexus opinion linking shoulder condition to service' },
      { type: 'required', description: 'Service treatment records showing shoulder complaints or injuries' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'MRI showing rotator cuff or labral pathology' },
      { type: 'strongly-recommended', description: 'Independent medical opinion with DeLuca factor analysis' },
      { type: 'recommended', description: 'Surgical records if applicable' },
    ],
    commonEvidenceGaps: [
      'Examiner does not document whether it is the dominant (major) or non-dominant (minor) arm, which affects rating',
      'No documentation of functional loss during flare-ups',
      'ROM testing does not include where pain begins',
      'Missing imaging to confirm structural damage',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 20, keyEvidence: ['Arm motion limited at shoulder level (90 degrees) - both major and minor arm (DC 5201)'] },
      { ratingPercent: 30, keyEvidence: ['Arm motion limited midway between side and shoulder level (45-90 degrees) - major arm (DC 5201)', 'Arm motion limited midway between side and shoulder level - minor arm gets 20% (DC 5201)'] },
      { ratingPercent: 40, keyEvidence: ['Arm motion limited to 25 degrees from side - major arm (DC 5201)', 'Arm motion limited to 25 degrees from side - minor arm gets 30% (DC 5201)'] },
    ],
    tips: [
      'Identify your dominant arm in the claim - ratings differ for major vs. minor arm',
      'Heavy lifting, overhead work, and carrying rucksacks are common service-related causes of shoulder injuries',
      'If you also have numbness or tingling down the arm, claim peripheral neuropathy or radiculopathy separately',
    ],
  },
  {
    conditionId: 'hip-strain',
    conditionName: 'Hip Strain / Degenerative Joint Disease',
    diagnosticCode: '5252',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of hip condition', dbqForm: 'DBQ - Hip and Thigh Conditions' },
      { type: 'required', description: 'Range of motion measurements (flexion, extension, abduction, adduction, rotation)', dbqForm: 'DBQ - Hip and Thigh Conditions' },
      { type: 'required', description: 'Medical nexus opinion linking hip condition to service' },
      { type: 'required', description: 'Service treatment records showing hip complaints' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'X-ray or MRI imaging of the affected hip' },
      { type: 'recommended', description: 'Documentation of gait abnormality caused by hip condition' },
      { type: 'strongly-recommended', description: 'Independent medical opinion addressing functional loss' },
    ],
    commonEvidenceGaps: [
      'All planes of motion not tested during exam',
      'No documentation of flare-up impact on ROM',
      'Hip condition not evaluated for secondary effects on gait and other joints',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Flexion limited to 45 degrees (DC 5252)', 'Extension limited to 5 degrees (DC 5251)'] },
      { ratingPercent: 20, keyEvidence: ['Flexion limited to 30 degrees (DC 5252)'] },
      { ratingPercent: 30, keyEvidence: ['Flexion limited to 20 degrees (DC 5252)'] },
      { ratingPercent: 40, keyEvidence: ['Flexion limited to 10 degrees (DC 5252)'] },
    ],
    tips: [
      'Hip conditions commonly cause secondary conditions in the opposite hip, knees, and lumbar spine due to altered gait',
      'Rucking, running, and parachute landings are common military activities that damage hips',
      'Ensure all planes of motion are tested and documented during the C&P exam',
    ],
  },
  {
    conditionId: 'ankle-strain',
    conditionName: 'Ankle Strain / Instability',
    diagnosticCode: '5271',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of ankle condition', dbqForm: 'DBQ - Ankle Conditions' },
      { type: 'required', description: 'Range of motion measurements (dorsiflexion and plantar flexion)', dbqForm: 'DBQ - Ankle Conditions' },
      { type: 'required', description: 'Medical nexus opinion linking ankle condition to service' },
      { type: 'required', description: 'Service treatment records showing ankle sprains, fractures, or complaints' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Imaging (X-ray or MRI) of the ankle' },
      { type: 'recommended', description: 'Documentation of instability and use of ankle brace' },
      { type: 'strongly-recommended', description: 'Independent medical opinion with functional loss analysis' },
    ],
    commonEvidenceGaps: [
      'Instability not separately documented for potential additional rating',
      'ROM not measured during flare-up or with repetitive use testing',
      'No nexus explaining how military service caused chronic ankle problems',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Moderate limited motion of the ankle (DC 5271)'] },
      { ratingPercent: 20, keyEvidence: ['Marked limited motion of the ankle (DC 5271)'] },
      { ratingPercent: 30, keyEvidence: ['Ankylosis of the ankle in plantar flexion less than 30 degrees (DC 5270)'] },
      { ratingPercent: 40, keyEvidence: ['Ankylosis of the ankle in plantar flexion between 30 and 40 degrees, or in dorsiflexion between 0 and 10 degrees (DC 5270)'] },
    ],
    tips: [
      'Document every ankle sprain or roll during service - recurrent sprains support chronic instability',
      'If you use an ankle brace, document that and bring it to the C&P exam',
      'Ankle instability can cause secondary conditions in the knee and hip due to altered gait',
    ],
  },
  {
    conditionId: 'plantar-fasciitis',
    conditionName: 'Plantar Fasciitis',
    diagnosticCode: '5276',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of plantar fasciitis', dbqForm: 'DBQ - Flatfoot (Pes Planus) or DBQ - Foot Miscellaneous' },
      { type: 'required', description: 'Medical nexus opinion linking plantar fasciitis to service (running, marching, boots, prolonged standing)' },
      { type: 'required', description: 'Service treatment records showing foot pain or plantar fasciitis treatment' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Imaging showing heel spurs or plantar fascia thickening' },
      { type: 'recommended', description: 'Records of orthotics, insoles, or physical therapy' },
      { type: 'recommended', description: 'Buddy statements describing difficulty with prolonged standing or walking' },
    ],
    commonEvidenceGaps: [
      'Plantar fasciitis rated under a low analogous code - ensure it is rated under the most beneficial code',
      'No documentation of bilateral vs. unilateral involvement',
      'Failure to document how military boots, running, and marching caused or aggravated the condition',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Moderate symptoms with pain on use, relieved by orthotics'] },
      { ratingPercent: 20, keyEvidence: ['Severe symptoms with objective evidence of marked deformity, pain on manipulation, swelling'] },
      { ratingPercent: 30, keyEvidence: ['Pronounced bilateral symptoms with marked pronation, extreme tenderness, not improved by orthotics'] },
    ],
    tips: [
      'If bilateral, claim both feet separately or ensure both are evaluated',
      'Military boots and forced running/marching are strong service-connection arguments',
      'Bring your orthotics to the C&P exam and document how often you use them',
    ],
  },
  {
    conditionId: 'fibromyalgia',
    conditionName: 'Fibromyalgia',
    diagnosticCode: '5025',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of fibromyalgia per accepted diagnostic criteria', dbqForm: 'DBQ - Fibromyalgia' },
      { type: 'required', description: 'Documentation of widespread musculoskeletal pain and tender points' },
      { type: 'required', description: 'Medical nexus opinion linking fibromyalgia to service or service-connected condition' },
      { type: 'required', description: 'Evidence that symptoms are constant or nearly constant and refractory to therapy' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Rheumatology records and evaluation' },
      { type: 'strongly-recommended', description: 'Independent medical opinion from a rheumatologist' },
      { type: 'recommended', description: 'Documentation of associated symptoms (fatigue, sleep disturbance, cognitive difficulties)' },
    ],
    commonEvidenceGaps: [
      'Diagnosis not supported by documented tender point examination',
      'No evidence that symptoms are constant or nearly constant',
      'Fibromyalgia symptoms attributed to other conditions without proper differential diagnosis',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Symptoms that require continuous medication for control'] },
      { ratingPercent: 20, keyEvidence: ['Symptoms that are episodic with exacerbations often precipitated by stress or weather', 'Widespread musculoskeletal pain and tender points'] },
      { ratingPercent: 40, keyEvidence: ['Symptoms that are constant or nearly constant', 'Refractory to therapy', 'Widespread musculoskeletal pain, tender points, and associated symptoms (fatigue, sleep disturbance, stiffness, depression)'] },
    ],
    tips: [
      'Fibromyalgia is capped at 40% under DC 5025 but associated conditions (depression, sleep disorder, IBS) can be rated separately',
      'Gulf War veterans may qualify for presumptive service connection for fibromyalgia under 38 CFR 3.317',
      'Keep a symptom diary documenting pain levels, fatigue, and flare-up frequency',
    ],
  },
  {
    conditionId: 'tmj-disorder',
    conditionName: 'Temporomandibular Joint (TMJ) Disorder',
    diagnosticCode: '9905',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of TMJ disorder', dbqForm: 'DBQ - Temporomandibular Joint (TMJ) Conditions' },
      { type: 'required', description: 'Measurement of inter-incisal range of motion (maximum opening) in millimeters' },
      { type: 'required', description: 'Medical nexus opinion linking TMJ to service (dental trauma, clenching from stress, etc.)' },
      { type: 'required', description: 'Service treatment records or dental records showing TMJ complaints' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Dental imaging (panoramic X-ray, CT, or MRI of TMJ)' },
      { type: 'recommended', description: 'Records of night guard or splint use' },
      { type: 'recommended', description: 'Buddy statements describing jaw clicking, locking, or pain during meals' },
    ],
    commonEvidenceGaps: [
      'Inter-incisal range not measured in millimeters during exam',
      'Lateral excursion measurements not taken',
      'No nexus connecting TMJ to military service activities',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Inter-incisal range limited to 31-40mm (DC 9905)'] },
      { ratingPercent: 20, keyEvidence: ['Inter-incisal range limited to 21-30mm (DC 9905)'] },
      { ratingPercent: 30, keyEvidence: ['Inter-incisal range limited to 11-20mm (DC 9905)'] },
      { ratingPercent: 40, keyEvidence: ['Inter-incisal range limited to 0-10mm (DC 9905)'] },
    ],
    tips: [
      'TMJ can be secondary to PTSD (from teeth clenching/grinding) - file as secondary if applicable',
      'Ensure both inter-incisal and lateral excursion ranges are measured at the C&P exam',
      'If TMJ causes headaches, those can be rated separately as secondary',
    ],
  },
  {
    conditionId: 'carpal-tunnel',
    conditionName: 'Carpal Tunnel Syndrome',
    diagnosticCode: '8515',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of carpal tunnel syndrome', dbqForm: 'DBQ - Peripheral Nerves Conditions' },
      { type: 'required', description: 'Nerve conduction study (NCS) or electromyography (EMG) results confirming diagnosis' },
      { type: 'required', description: 'Medical nexus opinion linking carpal tunnel to service-related repetitive use or injury' },
      { type: 'required', description: 'Service treatment records showing hand/wrist complaints or MOS involving repetitive hand use' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Documentation of MOS duties involving repetitive hand/wrist movements (typing, equipment operation, mechanical work)' },
      { type: 'strongly-recommended', description: 'Private neurologist evaluation with nexus opinion' },
      { type: 'recommended', description: 'Records of wrist splint use or surgical treatment' },
    ],
    commonEvidenceGaps: [
      'No nerve conduction study to confirm diagnosis objectively',
      'Nexus does not explain how specific military duties caused repetitive stress to the wrists',
      'Dominant vs. non-dominant hand not documented (affects rating)',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Mild incomplete paralysis of the median nerve (DC 8515)'] },
      { ratingPercent: 30, keyEvidence: ['Moderate incomplete paralysis of the median nerve - major hand (DC 8515)', 'Minor hand gets 20%'] },
      { ratingPercent: 50, keyEvidence: ['Severe incomplete paralysis of the median nerve - major hand (DC 8515)', 'Minor hand gets 40%'] },
      { ratingPercent: 70, keyEvidence: ['Complete paralysis of the median nerve - major hand (DC 8515)', 'Minor hand gets 60%'] },
    ],
    tips: [
      'Always specify which hand is dominant in your claim',
      'Get a nerve conduction study before filing - it is the gold standard diagnostic test',
      'If both hands are affected, each should be rated separately',
    ],
  },

  // ──────────────────────────────────────────────
  // NEUROLOGICAL CONDITIONS
  // ──────────────────────────────────────────────
  {
    conditionId: 'tbi',
    conditionName: 'Traumatic Brain Injury (TBI)',
    diagnosticCode: '8045',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of TBI with residual symptoms', dbqForm: 'DBQ - Traumatic Brain Injury (TBI)' },
      { type: 'required', description: 'Documentation of the in-service head injury event (blast exposure, vehicle accident, fall, assault)' },
      { type: 'required', description: 'Medical nexus opinion connecting current residuals to the in-service TBI event' },
      { type: 'required', description: 'Service treatment records documenting the head injury or concussion' },
      { type: 'required', description: 'Assessment of 10 facets of TBI-related cognitive impairment per 38 CFR 4.124a' },
    ],
    recommendedEvidence: [
      { type: 'strongly-recommended', description: 'Neuropsychological testing results' },
      { type: 'recommended', description: 'Brain imaging (CT or MRI) results' },
      { type: 'recommended', description: 'Buddy statements describing cognitive and behavioral changes after the injury' },
      { type: 'recommended', description: 'Documentation of all TBI residuals (headaches, dizziness, memory loss, mood changes)' },
    ],
    commonEvidenceGaps: [
      'In-service head injury not documented in STRs - buddy statements and incident reports are critical',
      'TBI residuals not separately identified and evaluated (each residual can receive its own rating)',
      'Neuropsychological testing not completed to assess cognitive impairment',
      'Examiner does not evaluate all 10 facets of TBI under DC 8045',
      'Blast exposure events not documented despite combat deployment records',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['All 10 facets of TBI evaluated at level 0 (normal functioning)'] },
      { ratingPercent: 10, keyEvidence: ['Highest facet evaluated at level 1 (mild impairment)', 'At least one facet showing objective testing abnormality'] },
      { ratingPercent: 40, keyEvidence: ['Highest facet evaluated at level 2 (moderate impairment)'] },
      { ratingPercent: 70, keyEvidence: ['Highest facet evaluated at level 3 (severe impairment)'] },
      { ratingPercent: 100, keyEvidence: ['Total occupational and social impairment from TBI residuals'] },
    ],
    tips: [
      'TBI residuals such as headaches, vision problems, vertigo, and cognitive issues can each receive separate ratings',
      'Request neuropsychological testing if you have memory, concentration, or processing speed issues',
      'If you served in combat, document any blast exposure events even if you did not seek treatment at the time',
      'The 10 facets include: memory, judgment, social interaction, orientation, motor activity, visual-spatial orientation, subjective symptoms, neurobehavioral effects, communication, and consciousness',
    ],
  },
  {
    conditionId: 'migraines',
    conditionName: 'Migraine Headaches',
    diagnosticCode: '8100',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of migraine headaches', dbqForm: 'DBQ - Headaches (including Migraines)' },
      { type: 'required', description: 'Documentation of frequency, duration, and severity of attacks' },
      { type: 'required', description: 'Medical nexus opinion linking migraines to service or service-connected condition (e.g., TBI, cervical strain)' },
      { type: 'required', description: 'Service treatment records showing headache complaints during service' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Headache diary/log documenting attacks over 3-6 months with dates, duration, and prostrating nature' },
      { type: 'strongly-recommended', description: 'Independent medical opinion particularly if migraines are secondary to TBI or cervical condition' },
      { type: 'recommended', description: 'Employer documentation of work missed due to migraines' },
    ],
    commonEvidenceGaps: [
      'Frequency and prostrating nature of attacks not documented',
      'No headache log or diary to corroborate reported frequency',
      'Examiner does not determine whether attacks are prostrating vs. non-prostrating',
      'Missing nexus to service or secondary connection to TBI or other condition',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['Less frequent attacks than required for 10% rating'] },
      { ratingPercent: 10, keyEvidence: ['Characteristic prostrating attacks averaging one in two months over the last several months'] },
      { ratingPercent: 30, keyEvidence: ['Characteristic prostrating attacks occurring on average once a month over the last several months'] },
      { ratingPercent: 50, keyEvidence: ['Very frequent completely prostrating and prolonged attacks productive of severe economic inadaptability'] },
    ],
    tips: [
      'Keep a detailed headache diary for at least 3 months before filing - include date, time, duration, whether you had to lie down (prostrating), and any work missed',
      'Prostrating means you must stop what you are doing and lie down - ensure the examiner understands and documents this',
      'If migraines are secondary to TBI or a neck condition, file as a secondary claim',
      'Migraines are capped at 50% but can combine with other ratings',
    ],
  },
  {
    conditionId: 'peripheral-neuropathy',
    conditionName: 'Peripheral Neuropathy',
    diagnosticCode: '8520',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of peripheral neuropathy with affected nerve(s) identified', dbqForm: 'DBQ - Peripheral Nerves Conditions' },
      { type: 'required', description: 'Nerve conduction study (NCS) or EMG confirming neuropathy' },
      { type: 'required', description: 'Medical nexus opinion linking neuropathy to service or service-connected condition (diabetes, Agent Orange, TBI)' },
      { type: 'required', description: 'Documentation of affected extremities and severity level' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Service records showing exposure to neurotoxins, herbicides, or cold injuries' },
      { type: 'strongly-recommended', description: 'Private neurologist evaluation with nexus opinion' },
      { type: 'recommended', description: 'Documentation of functional limitations (difficulty gripping, walking, balance)' },
    ],
    commonEvidenceGaps: [
      'No NCS or EMG to objectively confirm peripheral neuropathy',
      'Specific affected nerve not identified (sciatic, peroneal, tibial, etc.)',
      'Severity level (mild, moderate, severe) not determined',
      'Each affected extremity not separately claimed and evaluated',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Mild incomplete paralysis of the sciatic nerve (DC 8520)'] },
      { ratingPercent: 20, keyEvidence: ['Moderate incomplete paralysis of the sciatic nerve (DC 8520)'] },
      { ratingPercent: 40, keyEvidence: ['Moderately severe incomplete paralysis of the sciatic nerve (DC 8520)'] },
      { ratingPercent: 60, keyEvidence: ['Severe incomplete paralysis of the sciatic nerve with marked muscular atrophy (DC 8520)'] },
      { ratingPercent: 80, keyEvidence: ['Complete paralysis of the sciatic nerve (DC 8520)'] },
    ],
    tips: [
      'Each extremity (left leg, right leg, left arm, right arm) should be rated separately',
      'Vietnam-era veterans exposed to Agent Orange may qualify for presumptive service connection',
      'Always get a nerve conduction study before your C&P exam - it provides objective evidence',
      'If neuropathy is secondary to diabetes, file it as a secondary condition',
    ],
  },
  {
    conditionId: 'radiculopathy',
    conditionName: 'Radiculopathy',
    diagnosticCode: '8520',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of radiculopathy with affected nerve root identified', dbqForm: 'DBQ - Peripheral Nerves Conditions' },
      { type: 'required', description: 'MRI or imaging showing nerve root compression or disc herniation' },
      { type: 'required', description: 'Medical nexus opinion linking radiculopathy to service-connected spine condition or service' },
      { type: 'required', description: 'Documentation of radicular pain distribution and severity' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'EMG or nerve conduction study confirming radiculopathy' },
      { type: 'strongly-recommended', description: 'Independent medical opinion from neurologist or spine specialist' },
      { type: 'recommended', description: 'Documentation of functional limitations caused by radiating pain' },
    ],
    commonEvidenceGaps: [
      'Radiculopathy not claimed separately from the underlying spine condition',
      'Specific nerve root (L4, L5, S1, C5, C6, etc.) not identified',
      'No imaging confirming disc herniation or nerve compression',
      'Severity of nerve involvement not documented',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Mild incomplete paralysis of the affected nerve (lower extremity DC 8520, upper extremity DC 8510-8516)'] },
      { ratingPercent: 20, keyEvidence: ['Moderate incomplete paralysis of the affected nerve'] },
      { ratingPercent: 40, keyEvidence: ['Moderately severe incomplete paralysis (lower extremity)'] },
      { ratingPercent: 60, keyEvidence: ['Severe incomplete paralysis with marked muscular atrophy'] },
    ],
    tips: [
      'Radiculopathy should ALWAYS be claimed separately from the spine condition that causes it',
      'Each affected extremity gets its own separate rating',
      'If you have lumbar radiculopathy into both legs, that is two separate ratings in addition to the lumbar spine rating',
      'MRI is critical to show the structural cause of nerve compression',
    ],
  },
  {
    conditionId: 'sciatic-nerve',
    conditionName: 'Sciatic Nerve Condition',
    diagnosticCode: '8520',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of sciatic nerve condition', dbqForm: 'DBQ - Peripheral Nerves Conditions' },
      { type: 'required', description: 'EMG or nerve conduction study documenting sciatic nerve involvement' },
      { type: 'required', description: 'Medical nexus opinion linking sciatic nerve condition to service-connected spine condition or direct service connection' },
      { type: 'required', description: 'Documentation of the severity of nerve paralysis (mild, moderate, moderately severe, severe, complete)' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Lumbar MRI showing disc pathology compressing the sciatic nerve' },
      { type: 'recommended', description: 'Documentation of muscle atrophy or weakness in the affected leg' },
      { type: 'strongly-recommended', description: 'Independent neurological evaluation' },
    ],
    commonEvidenceGaps: [
      'Not claimed separately from lumbar spine condition',
      'No objective testing (EMG/NCS) to confirm nerve involvement',
      'Severity not accurately assessed during C&P exam',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Mild incomplete paralysis of the sciatic nerve'] },
      { ratingPercent: 20, keyEvidence: ['Moderate incomplete paralysis of the sciatic nerve'] },
      { ratingPercent: 40, keyEvidence: ['Moderately severe incomplete paralysis of the sciatic nerve'] },
      { ratingPercent: 60, keyEvidence: ['Severe incomplete paralysis with marked muscular atrophy'] },
      { ratingPercent: 80, keyEvidence: ['Complete paralysis - foot dangles and drops, no active movement possible below knee, weakened or lost knee flexion'] },
    ],
    tips: [
      'File sciatic nerve claims as secondary to your lumbar spine condition',
      'Each leg should be rated separately if both are affected',
      'EMG/NCS provides the strongest objective evidence of severity',
    ],
  },
  {
    conditionId: 'vestibular-disorder',
    conditionName: 'Vestibular Disorder / Vertigo',
    diagnosticCode: '6204',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of peripheral vestibular disorder', dbqForm: 'DBQ - Ear Conditions' },
      { type: 'required', description: 'Documentation of vertigo episodes including frequency and duration' },
      { type: 'required', description: 'Medical nexus opinion linking vestibular disorder to service (head trauma, noise exposure, TBI)' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Vestibular function testing (ENG/VNG, rotary chair, posturography)' },
      { type: 'strongly-recommended', description: 'ENT or neurology evaluation with nexus opinion' },
      { type: 'recommended', description: 'Buddy statements describing balance problems and dizziness episodes' },
    ],
    commonEvidenceGaps: [
      'No vestibular function testing to confirm diagnosis',
      'Vertigo episodes not documented with frequency and severity',
      'No nexus connecting vestibular disorder to TBI, noise exposure, or other service event',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Occasional dizziness (DC 6204)'] },
      { ratingPercent: 30, keyEvidence: ['Dizziness and occasional staggering (DC 6204)'] },
    ],
    tips: [
      'Vestibular disorders are commonly secondary to TBI - file as secondary if applicable',
      'If you also have hearing loss or tinnitus, claim those separately as they may share the same cause',
      'Document how dizziness affects your ability to drive, work, and perform daily activities',
    ],
  },

  // ──────────────────────────────────────────────
  // ENT / AUDIOLOGICAL CONDITIONS
  // ──────────────────────────────────────────────
  {
    conditionId: 'tinnitus',
    conditionName: 'Tinnitus',
    diagnosticCode: '6260',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of tinnitus (can be based on subjective report)', dbqForm: 'DBQ - Tinnitus' },
      { type: 'required', description: 'Evidence of noise exposure during service (MOS, duty station, weapons qualification, aircraft/vehicle exposure)' },
      { type: 'required', description: 'Nexus opinion linking tinnitus to in-service noise exposure' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Service records confirming noise-exposed MOS or duty assignments' },
      { type: 'recommended', description: 'Audiogram showing hearing loss pattern consistent with noise exposure' },
      { type: 'recommended', description: 'Buddy statements confirming in-service noise exposure and ringing in ears' },
    ],
    commonEvidenceGaps: [
      'No documentation of in-service noise exposure despite combat or noise-exposed MOS',
      'Claim filed without establishing when tinnitus began',
      'No nexus opinion addressing the link between military noise exposure and current tinnitus',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Recurrent tinnitus - this is the maximum schedular rating under DC 6260', 'Tinnitus is rated at 10% regardless of whether it is unilateral or bilateral'] },
    ],
    tips: [
      'Tinnitus is one of the most commonly granted VA disabilities and has a flat 10% rating',
      'It is a subjective condition - there is no test to disprove it. Your credible lay statement is often sufficient',
      'Always file tinnitus alongside hearing loss if both are present',
      'Document the type of noise exposure: weapons fire, explosions, aircraft engines, heavy machinery, etc.',
    ],
  },
  {
    conditionId: 'hearing-loss',
    conditionName: 'Bilateral Hearing Loss',
    diagnosticCode: '6100',
    requiredEvidence: [
      { type: 'required', description: 'Current audiometric testing showing hearing loss per VA standards (38 CFR 3.385)', dbqForm: 'DBQ - Hearing Loss and Tinnitus' },
      { type: 'required', description: 'Controlled speech discrimination test (Maryland CNC) scores' },
      { type: 'required', description: 'Medical nexus opinion linking hearing loss to in-service noise exposure' },
      { type: 'required', description: 'Evidence of in-service noise exposure (MOS, duty assignments, combat records)' },
      { type: 'required', description: 'Service entrance and separation audiograms showing threshold shifts' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Private audiological evaluation using Maryland CNC word list' },
      { type: 'strongly-recommended', description: 'Independent audiologist opinion explaining how noise exposure caused hearing loss pattern' },
      { type: 'recommended', description: 'Documentation of occupational and recreational noise exposure history (to show military noise was the primary cause)' },
    ],
    commonEvidenceGaps: [
      'Audiometric results do not meet VA threshold for hearing loss disability under 38 CFR 3.385',
      'Speech discrimination test not conducted using the Maryland CNC word list (VA requires this specific test)',
      'No significant threshold shift shown between entrance and separation audiograms',
      'Post-service occupational noise exposure not addressed in the nexus opinion',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['Hearing loss confirmed but puretone averages and speech discrimination scores result in Level I designation in both ears per Table VI/VIa'] },
      { ratingPercent: 10, keyEvidence: ['Hearing levels combine to at least a 10% rating per Table VII (e.g., Level II in one ear and Level V in the other)'] },
      { ratingPercent: 20, keyEvidence: ['More severe combination per Table VII'] },
      { ratingPercent: 30, keyEvidence: ['Significant hearing loss in both ears per Table VII combinations'] },
    ],
    tips: [
      'VA hearing loss ratings are based on a mathematical formula using Tables VI, VIa, and VII in 38 CFR 4.85 - ensure your audiologist uses the Maryland CNC word list',
      'Even if you receive 0% for hearing loss, getting it service-connected opens the door to hearing aids, future increases, and secondary claims',
      'Compare your entrance and separation audiograms for threshold shifts - even small shifts support noise-induced damage',
    ],
  },

  // ──────────────────────────────────────────────
  // SLEEP & RESPIRATORY CONDITIONS
  // ──────────────────────────────────────────────
  {
    conditionId: 'sleep-apnea',
    conditionName: 'Obstructive Sleep Apnea',
    diagnosticCode: '6847',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of obstructive sleep apnea confirmed by a sleep study (polysomnography)', dbqForm: 'DBQ - Sleep Apnea' },
      { type: 'required', description: 'Medical nexus opinion linking sleep apnea to military service or a service-connected condition' },
      { type: 'required', description: 'Service treatment records or evidence of sleep issues during service' },
      { type: 'required', description: 'Documentation of current treatment (CPAP, BiPAP, etc.)' },
    ],
    recommendedEvidence: [
      { type: 'strongly-recommended', description: 'Buddy statements from bunkmates or spouse documenting snoring, gasping, or breathing cessation during sleep in service' },
      { type: 'recommended', description: 'Weight and BMI records from service to present' },
      { type: 'recommended', description: 'If secondary claim, medical literature supporting the connection (e.g., PTSD medications causing weight gain leading to sleep apnea)' },
    ],
    commonEvidenceGaps: [
      'No sleep study (polysomnography) to confirm diagnosis - VA requires this',
      'No buddy statements corroborating in-service sleep symptoms',
      'Nexus opinion does not adequately explain how military service caused or contributed to sleep apnea',
      'Weight gain link to service-connected condition (like PTSD medication side effects) not documented',
      'Sleep apnea claimed as direct but diagnosed years after service without bridging evidence',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['Asymptomatic but with documented sleep disorder breathing'] },
      { ratingPercent: 30, keyEvidence: ['Persistent daytime hypersomnolence'] },
      { ratingPercent: 50, keyEvidence: ['Requires use of breathing assistance device such as CPAP machine'] },
      { ratingPercent: 100, keyEvidence: ['Chronic respiratory failure with carbon dioxide retention', 'Requires tracheostomy', 'Cor pulmonale (right heart failure)'] },
    ],
    tips: [
      'If you use a CPAP machine, you qualify for at least 50% - bring your CPAP compliance data to the exam',
      'Buddy statements about in-service snoring and daytime sleepiness are critical for direct service connection',
      'Sleep apnea is commonly filed as secondary to PTSD, obesity from medications, or rhinitis/sinusitis causing airway obstruction',
      'Bring your sleep study results and CPAP prescription records to the C&P exam',
    ],
  },
  {
    conditionId: 'asthma',
    conditionName: 'Bronchial Asthma',
    diagnosticCode: '6602',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of asthma', dbqForm: 'DBQ - Respiratory Conditions (other than Tuberculosis and Sleep Apnea)' },
      { type: 'required', description: 'Pulmonary function test (PFT) results including FEV-1, FEV-1/FVC ratio', dbqForm: 'DBQ - Respiratory Conditions' },
      { type: 'required', description: 'Medical nexus opinion linking asthma to in-service exposures or onset' },
      { type: 'required', description: 'Documentation of current medication requirements (inhaler use, corticosteroids)' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Service records showing exposure to burn pits, chemicals, dust, or other respiratory irritants' },
      { type: 'recommended', description: 'Deployment records to areas with known airborne hazards' },
      { type: 'strongly-recommended', description: 'Pulmonologist evaluation with nexus opinion addressing specific in-service exposures' },
    ],
    commonEvidenceGaps: [
      'PFT results not obtained or not interpreted correctly',
      'Medication use (daily inhalational therapy, corticosteroids) not documented',
      'No nexus connecting asthma to in-service environmental exposures',
      'Pre-existing asthma not shown to be aggravated by service',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['FEV-1 of 71-80% predicted', 'FEV-1/FVC of 71-80%', 'Intermittent inhalational or oral bronchodilator therapy'] },
      { ratingPercent: 30, keyEvidence: ['FEV-1 of 56-70% predicted', 'FEV-1/FVC of 56-70%', 'Daily inhalational or oral bronchodilator therapy', 'Inhalational anti-inflammatory medication'] },
      { ratingPercent: 60, keyEvidence: ['FEV-1 of 40-55% predicted', 'FEV-1/FVC of 40-55%', 'At least monthly visits to physician for required care of exacerbations', 'Intermittent (at least three per year) courses of systemic corticosteroids'] },
      { ratingPercent: 100, keyEvidence: ['FEV-1 less than 40% predicted', 'FEV-1/FVC less than 40%', 'More than one attack per week with episodes of respiratory failure', 'Daily use of systemic high dose corticosteroids or immuno-suppressive medications'] },
    ],
    tips: [
      'Burn pit exposure is a strong nexus argument for post-9/11 veterans under the PACT Act',
      'Ensure PFT results are conducted both pre and post-bronchodilator',
      'Document all rescue inhaler and maintenance medication use',
    ],
  },
  {
    conditionId: 'sinusitis',
    conditionName: 'Chronic Sinusitis',
    diagnosticCode: '6513',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of chronic sinusitis', dbqForm: 'DBQ - Sinusitis, Rhinitis, and Other Conditions of the Nose, Throat, Larynx, and Pharynx' },
      { type: 'required', description: 'Documentation of frequency of incapacitating and non-incapacitating episodes per year' },
      { type: 'required', description: 'Medical nexus opinion linking sinusitis to service (environmental exposures, infections during service)' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'CT scan of sinuses showing chronic changes' },
      { type: 'recommended', description: 'Records of antibiotic courses for sinus infections over the past year' },
      { type: 'recommended', description: 'Documentation of sinus surgery if applicable' },
    ],
    commonEvidenceGaps: [
      'Number of incapacitating vs. non-incapacitating episodes not documented',
      'No imaging confirming chronic sinus disease',
      'Antibiotic treatment courses not tracked or documented',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['Detected by X-ray only with no symptoms'] },
      { ratingPercent: 10, keyEvidence: ['One or two incapacitating episodes per year of sinusitis requiring prolonged antibiotic treatment', 'Three to six non-incapacitating episodes per year with headaches, pain, and purulent discharge'] },
      { ratingPercent: 30, keyEvidence: ['Three or more incapacitating episodes per year requiring prolonged antibiotic treatment', 'More than six non-incapacitating episodes per year'] },
      { ratingPercent: 50, keyEvidence: ['Following radical surgery with chronic osteomyelitis', 'Near-constant sinusitis with headaches, pain, tenderness, and purulent discharge after repeated surgeries'] },
    ],
    tips: [
      'Track every sinus infection episode with dates and antibiotic prescriptions',
      'Sinusitis commonly leads to secondary rhinitis and sleep apnea claims',
      'Burn pit and environmental exposure during deployment is a strong nexus argument',
    ],
  },
  {
    conditionId: 'copd',
    conditionName: 'Chronic Obstructive Pulmonary Disease (COPD)',
    diagnosticCode: '6604',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of COPD', dbqForm: 'DBQ - Respiratory Conditions (other than Tuberculosis and Sleep Apnea)' },
      { type: 'required', description: 'Pulmonary function test results including FEV-1, FEV-1/FVC, and DLCO' },
      { type: 'required', description: 'Medical nexus opinion linking COPD to in-service exposures (burn pits, chemicals, dust, smoking while in service)' },
      { type: 'required', description: 'Service records showing respiratory exposure history' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Deployment records to areas with known airborne hazards' },
      { type: 'strongly-recommended', description: 'Pulmonologist evaluation with detailed exposure history and nexus opinion' },
      { type: 'recommended', description: 'Chest imaging (X-ray or CT) showing COPD changes' },
    ],
    commonEvidenceGaps: [
      'PFT not performed or results incomplete (missing DLCO)',
      'No nexus connecting COPD to specific in-service exposures',
      'Smoking history not addressed in nexus opinion (examiner may attribute COPD to smoking without considering service exposures)',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['FEV-1 of 71-80% predicted', 'FEV-1/FVC of 71-80%', 'DLCO of 66-80% predicted'] },
      { ratingPercent: 30, keyEvidence: ['FEV-1 of 56-70% predicted', 'FEV-1/FVC of 56-70%', 'DLCO of 56-65% predicted'] },
      { ratingPercent: 60, keyEvidence: ['FEV-1 of 40-55% predicted', 'FEV-1/FVC of 40-55%', 'DLCO of 40-55% predicted', 'Maximum oxygen consumption of 15-20 ml/kg/min'] },
      { ratingPercent: 100, keyEvidence: ['FEV-1 less than 40% predicted', 'FEV-1/FVC less than 40%', 'DLCO less than 40% predicted', 'Maximum exercise capacity less than 15 ml/kg/min oxygen consumption with cardiorespiratory limitation', 'Cor pulmonale or requires outpatient oxygen therapy'] },
    ],
    tips: [
      'PACT Act provides presumptive service connection for certain respiratory conditions related to burn pit exposure',
      'Even if you smoked, concurrent in-service environmental exposures can still support a claim',
      'Ensure PFTs include DLCO testing as this is often the most favorable metric for rating purposes',
    ],
  },

  // ──────────────────────────────────────────────
  // CARDIOVASCULAR CONDITIONS
  // ──────────────────────────────────────────────
  {
    conditionId: 'hypertension',
    conditionName: 'Hypertension',
    diagnosticCode: '7101',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of hypertension with blood pressure readings', dbqForm: 'DBQ - Hypertension' },
      { type: 'required', description: 'Medical nexus opinion linking hypertension to military service or service-connected condition' },
      { type: 'required', description: 'Service treatment records showing elevated blood pressure readings during service' },
      { type: 'required', description: 'Documentation of current medication requirements' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Blood pressure log over 30+ days showing readings' },
      { type: 'recommended', description: 'If secondary claim, medical literature supporting how service-connected conditions (PTSD, sleep apnea, kidney disease) cause or aggravate hypertension' },
      { type: 'strongly-recommended', description: 'Independent medical opinion with detailed rationale, especially for secondary claims' },
    ],
    commonEvidenceGaps: [
      'No elevated blood pressure readings documented during service',
      'Nexus does not explain the mechanism by which service or a service-connected condition caused hypertension',
      'Medication requirements not documented',
      'For secondary claims, no medical literature or rationale linking the primary condition to hypertension',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Diastolic pressure predominantly 100 or more', 'Systolic pressure predominantly 160 or more', 'History of diastolic pressure predominantly 100 or more requiring continuous medication for control'] },
      { ratingPercent: 20, keyEvidence: ['Diastolic pressure predominantly 110 or more', 'Systolic pressure predominantly 200 or more'] },
      { ratingPercent: 40, keyEvidence: ['Diastolic pressure predominantly 120 or more'] },
      { ratingPercent: 60, keyEvidence: ['Diastolic pressure predominantly 130 or more'] },
    ],
    tips: [
      'Hypertension is commonly filed as secondary to PTSD, sleep apnea, kidney disease, or Agent Orange exposure',
      'Keep a daily blood pressure log for at least 30 days before filing',
      'Even a 10% rating for hypertension opens the door to secondary claims for heart disease and kidney disease',
      'Agent Orange-exposed veterans may have hypertension as a presumptive condition',
    ],
  },
  {
    conditionId: 'heart-disease',
    conditionName: 'Ischemic Heart Disease',
    diagnosticCode: '7005',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of ischemic heart disease (coronary artery disease, angina, MI history)', dbqForm: 'DBQ - Heart Conditions' },
      { type: 'required', description: 'Exercise stress test or equivalent cardiac workload assessment (METs testing)' },
      { type: 'required', description: 'Medical nexus opinion linking heart disease to service or service-connected condition' },
      { type: 'required', description: 'Ejection fraction measurement if available' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Cardiac catheterization or imaging results' },
      { type: 'recommended', description: 'Documentation of surgical interventions (stents, bypass, pacemaker)' },
      { type: 'strongly-recommended', description: 'Cardiologist evaluation with nexus opinion' },
    ],
    commonEvidenceGaps: [
      'METs level not assessed during examination',
      'No stress test or estimated METs workload documented',
      'Ejection fraction not measured',
      'For Agent Orange presumptive claims, no evidence of herbicide exposure',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Workload greater than 7 METs results in dyspnea, fatigue, angina, dizziness, or syncope', 'Continuous medication required'] },
      { ratingPercent: 30, keyEvidence: ['Workload of greater than 5 METs but not greater than 7 METs', 'Evidence of cardiac hypertrophy or dilatation on ECG, echocardiogram, or X-ray'] },
      { ratingPercent: 60, keyEvidence: ['More than one episode of acute congestive heart failure in the past year', 'Workload of greater than 3 METs but not greater than 5 METs', 'Left ventricular dysfunction with ejection fraction of 30-50%'] },
      { ratingPercent: 100, keyEvidence: ['Chronic congestive heart failure', 'Workload of 3 METs or less', 'Left ventricular dysfunction with ejection fraction less than 30%'] },
    ],
    tips: [
      'Ischemic heart disease is a presumptive condition for Vietnam-era veterans exposed to Agent Orange',
      'METs testing is critical for rating - ensure your cardiologist orders this',
      'If you cannot perform exercise testing, the VA must estimate METs based on your reported limitations',
    ],
  },
  {
    conditionId: 'varicose-veins',
    conditionName: 'Varicose Veins',
    diagnosticCode: '7120',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of varicose veins', dbqForm: 'DBQ - Artery and Vein Conditions' },
      { type: 'required', description: 'Medical nexus opinion linking varicose veins to military service (prolonged standing, marching)' },
      { type: 'required', description: 'Service treatment records or evidence of prolonged standing/marching duties' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Doppler ultrasound showing venous insufficiency' },
      { type: 'recommended', description: 'Documentation of compression stocking use' },
      { type: 'recommended', description: 'Photographs of varicose veins showing severity' },
    ],
    commonEvidenceGaps: [
      'No documentation linking prolonged standing duties to development of varicose veins',
      'Severity of symptoms (edema, stasis pigmentation, ulceration) not documented',
      'Bilateral involvement not separately evaluated',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['Asymptomatic palpable or visible varicose veins'] },
      { ratingPercent: 10, keyEvidence: ['Intermittent edema of extremity or aching and fatigue after prolonged standing or walking, relieved by elevation or compression'] },
      { ratingPercent: 20, keyEvidence: ['Persistent edema incompletely relieved by elevation', 'Stasis pigmentation or eczema with or without intermittent ulceration'] },
      { ratingPercent: 40, keyEvidence: ['Persistent edema and stasis pigmentation or eczema', 'Intermittent ulceration'] },
      { ratingPercent: 60, keyEvidence: ['Persistent edema or subcutaneous induration, stasis pigmentation or eczema', 'Persistent ulceration'] },
    ],
    tips: [
      'Each leg should be rated separately',
      'Document all compression stockings prescribed and used',
      'Prolonged standing, marching, and wearing heavy gear are strong service-connection arguments',
    ],
  },

  // ──────────────────────────────────────────────
  // GASTROINTESTINAL CONDITIONS
  // ──────────────────────────────────────────────
  {
    conditionId: 'gerd',
    conditionName: 'Gastroesophageal Reflux Disease (GERD)',
    diagnosticCode: '7346',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of GERD', dbqForm: 'DBQ - Esophageal Conditions' },
      { type: 'required', description: 'Medical nexus opinion linking GERD to service or service-connected condition (medications, stress)' },
      { type: 'required', description: 'Documentation of symptoms including frequency and severity' },
      { type: 'required', description: 'Service treatment records showing GI complaints during service' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Endoscopy or upper GI series results' },
      { type: 'recommended', description: 'Pharmacy records showing long-term PPI or antacid use' },
      { type: 'recommended', description: 'If secondary, documentation of how medications (NSAIDs, psychiatric meds) cause or worsen GERD' },
    ],
    commonEvidenceGaps: [
      'GERD symptoms not documented with adequate frequency and severity',
      'No nexus to service - GERD commonly filed as secondary to medications for other service-connected conditions',
      'Weight loss or anemia due to GERD not documented',
      'No endoscopy to confirm structural changes',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Two or more of the following symptoms of less severity: epigastric distress, dysphagia, pyrosis, regurgitation, substernal or arm or shoulder pain (DC 7346)'] },
      { ratingPercent: 30, keyEvidence: ['Persistently recurrent epigastric distress with dysphagia, pyrosis, and regurgitation', 'Accompanied by substernal or arm or shoulder pain', 'Productive of considerable impairment of health'] },
      { ratingPercent: 60, keyEvidence: ['Symptoms of pain, vomiting, material weight loss and hematemesis or melena with moderate anemia', 'Other symptom combinations productive of severe impairment of health'] },
    ],
    tips: [
      'GERD is one of the most common secondary claims - link it to NSAIDs taken for pain conditions or psychiatric medication side effects',
      'Document all medication use for GERD including over-the-counter antacids',
      'Track symptoms daily including heartburn, regurgitation, and any weight changes',
    ],
  },
  {
    conditionId: 'ibs',
    conditionName: 'Irritable Bowel Syndrome (IBS)',
    diagnosticCode: '7319',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of IBS', dbqForm: 'DBQ - Intestinal Conditions (other than Surgical or Infectious)' },
      { type: 'required', description: 'Medical nexus opinion linking IBS to service or service-connected condition' },
      { type: 'required', description: 'Documentation of symptom frequency (diarrhea, constipation, alternating bowel habits, abdominal distress)' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'GI specialist evaluation and records' },
      { type: 'recommended', description: 'Documentation of dietary restrictions and medication use' },
      { type: 'recommended', description: 'If secondary to mental health condition, medical literature supporting the gut-brain connection' },
    ],
    commonEvidenceGaps: [
      'Frequency of episodes and bowel disturbance not documented',
      'No nexus to service or service-connected condition like PTSD or anxiety',
      'IBS not differentiated from other GI conditions',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['Mild disturbances of bowel function with occasional episodes of abdominal distress'] },
      { ratingPercent: 10, keyEvidence: ['Moderate IBS with frequent episodes of bowel disturbance with abdominal distress'] },
      { ratingPercent: 30, keyEvidence: ['Severe IBS with diarrhea, or alternating diarrhea and constipation, with more or less constant abdominal distress'] },
    ],
    tips: [
      'IBS is a presumptive condition for Gulf War veterans under 38 CFR 3.317',
      'IBS is commonly secondary to PTSD, anxiety, and depression - the gut-brain connection is well-established in medical literature',
      'Document how IBS affects daily activities, travel, and employment',
    ],
  },
  {
    conditionId: 'crohns-disease',
    conditionName: 'Crohn\'s Disease',
    diagnosticCode: '7323',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of Crohn\'s disease', dbqForm: 'DBQ - Intestinal Conditions (other than Surgical or Infectious)' },
      { type: 'required', description: 'Medical nexus opinion linking Crohn\'s disease to military service' },
      { type: 'required', description: 'Colonoscopy or imaging confirming diagnosis and extent' },
      { type: 'required', description: 'Documentation of exacerbation frequency and severity' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'GI specialist treatment records documenting disease course' },
      { type: 'recommended', description: 'Surgical records if applicable' },
      { type: 'strongly-recommended', description: 'Independent GI specialist nexus opinion' },
    ],
    commonEvidenceGaps: [
      'No documentation of frequency and severity of exacerbations',
      'Nutritional status and weight loss not tracked',
      'No nexus connecting onset or aggravation to military service',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Moderate ulcerative colitis with infrequent exacerbations (DC 7323)'] },
      { ratingPercent: 30, keyEvidence: ['Moderately severe with frequent exacerbations'] },
      { ratingPercent: 60, keyEvidence: ['Severe with numerous attacks a year and malnutrition', 'Health only fair during remissions'] },
      { ratingPercent: 100, keyEvidence: ['Pronounced - resulting in marked malnutrition, anemia, and general debility', 'Serious complication such as liver abscess'] },
    ],
    tips: [
      'Document every flare-up with dates, duration, and treatment required',
      'Weight loss and malnutrition are key factors in higher ratings - track your weight regularly',
      'If Crohn\'s causes secondary conditions (anemia, arthritis, skin conditions), claim those separately',
    ],
  },
  {
    conditionId: 'hepatitis-c',
    conditionName: 'Hepatitis C',
    diagnosticCode: '7354',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of Hepatitis C with lab confirmation', dbqForm: 'DBQ - Hepatitis, Cirrhosis, and Other Liver Conditions' },
      { type: 'required', description: 'Medical nexus opinion linking Hepatitis C to in-service risk factors (jet gun inoculations, blood exposure, combat wounds)' },
      { type: 'required', description: 'Documentation of risk factors during military service' },
      { type: 'required', description: 'Current liver function tests and assessment of disease activity' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Documentation of jet gun (air gun) inoculations during service (common in-service risk factor)' },
      { type: 'recommended', description: 'Records of blood transfusions, combat wounds, or occupational blood exposure during service' },
      { type: 'strongly-recommended', description: 'Hepatologist or infectious disease specialist nexus opinion' },
    ],
    commonEvidenceGaps: [
      'No documentation of specific in-service risk factors',
      'Post-service risk factors (IV drug use, tattoos) not addressed in the nexus opinion',
      'Hepatitis C treatment has cured the infection but residual liver damage not evaluated',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['Nonsymptomatic'] },
      { ratingPercent: 10, keyEvidence: ['Intermittent fatigue, malaise, and anorexia', 'Or incapacitating episodes (with symptoms requiring bed rest and treatment by physician) having a total duration of at least one week but less than two weeks during the past 12 months'] },
      { ratingPercent: 20, keyEvidence: ['Daily fatigue, malaise, and anorexia (without weight loss or hepatomegaly) requiring dietary restriction or continuous medication', 'Or incapacitating episodes having a total duration of at least two weeks but less than four weeks during the past 12 months'] },
      { ratingPercent: 40, keyEvidence: ['Daily fatigue, malaise, and anorexia with minor weight loss and hepatomegaly', 'Or incapacitating episodes having a total duration of at least four weeks but less than six weeks during the past 12 months'] },
    ],
    tips: [
      'Jet gun (air gun) inoculations are a recognized risk factor for Hepatitis C transmission during military service',
      'Even if Hepatitis C has been cured, you may still be entitled to compensation for residual liver damage',
      'Document all risk factors during service and ensure the nexus opinion addresses post-service risk factors to rule them out',
    ],
  },

  // ──────────────────────────────────────────────
  // SKIN CONDITIONS
  // ──────────────────────────────────────────────
  {
    conditionId: 'eczema',
    conditionName: 'Eczema / Dermatitis',
    diagnosticCode: '7806',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of eczema or dermatitis', dbqForm: 'DBQ - Skin Diseases' },
      { type: 'required', description: 'Documentation of percentage of body and exposed areas affected' },
      { type: 'required', description: 'Medical nexus opinion linking skin condition to service or service-connected condition' },
      { type: 'required', description: 'Documentation of treatment requirements (topical, systemic, immunosuppressive)' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Photographs of skin condition during active flare-ups' },
      { type: 'recommended', description: 'Dermatologist treatment records' },
      { type: 'recommended', description: 'Service records showing exposure to chemicals, environmental irritants, or onset during service' },
    ],
    commonEvidenceGaps: [
      'Percentage of body area and exposed area not documented during active flare',
      'C&P exam conducted during remission when skin appears clear',
      'Medication type and duration not adequately documented (topical vs. systemic makes a significant difference in rating)',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['Less than 5% of entire body or exposed areas affected', 'No more than topical therapy required during the past 12 months'] },
      { ratingPercent: 10, keyEvidence: ['At least 5% but less than 20% of entire body or exposed areas affected', 'Intermittent systemic therapy such as corticosteroids or immunosuppressive drugs required for total duration of less than 6 weeks during the past 12 months'] },
      { ratingPercent: 30, keyEvidence: ['20-40% of entire body or exposed areas affected', 'Systemic therapy such as corticosteroids or immunosuppressive drugs required for total duration of 6 weeks or more but not constantly during the past 12 months'] },
      { ratingPercent: 60, keyEvidence: ['More than 40% of entire body or exposed areas affected', 'Constant or near-constant systemic therapy such as corticosteroids or immunosuppressive drugs required during the past 12 months'] },
    ],
    tips: [
      'Schedule your C&P exam during a flare-up if possible - photos taken during flares are critical backup evidence',
      'Track all medications used including topical steroids, systemic corticosteroids, and immunosuppressive drugs with dates and durations',
      'Environmental and chemical exposures during service are common nexus arguments',
    ],
  },
  {
    conditionId: 'psoriasis',
    conditionName: 'Psoriasis',
    diagnosticCode: '7816',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of psoriasis', dbqForm: 'DBQ - Skin Diseases' },
      { type: 'required', description: 'Documentation of percentage of body and exposed areas affected' },
      { type: 'required', description: 'Medical nexus opinion linking psoriasis to service' },
      { type: 'required', description: 'Documentation of treatment requirements' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Dermatologist treatment records' },
      { type: 'recommended', description: 'Photographs of psoriasis during active flares' },
      { type: 'recommended', description: 'Documentation of psoriatic arthritis if present (rated separately)' },
    ],
    commonEvidenceGaps: [
      'Body surface area percentage not documented during active disease',
      'Exam performed during remission period',
      'Systemic medication use not documented with dates and duration',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['Less than 5% of body or exposed areas', 'Topical therapy only in past 12 months'] },
      { ratingPercent: 10, keyEvidence: ['At least 5% but less than 20% of body or exposed areas', 'Intermittent systemic therapy for less than 6 weeks in past 12 months'] },
      { ratingPercent: 30, keyEvidence: ['20-40% of body or exposed areas', 'Systemic therapy for 6+ weeks but not constant in past 12 months'] },
      { ratingPercent: 60, keyEvidence: ['More than 40% of body or exposed areas', 'Constant or near-constant systemic therapy in past 12 months'] },
    ],
    tips: [
      'If you have psoriatic arthritis, it should be rated separately from the skin condition',
      'Biologics and immunosuppressants count as systemic therapy - document all such treatments',
      'Photos during flare-ups are essential backup evidence',
    ],
  },
  {
    conditionId: 'burn-scars',
    conditionName: 'Burn Scars',
    diagnosticCode: '7801',
    requiredEvidence: [
      { type: 'required', description: 'Current documentation of burn scars with measurements', dbqForm: 'DBQ - Scars/Disfigurement' },
      { type: 'required', description: 'Documentation of total area of scarring in square inches or square centimeters' },
      { type: 'required', description: 'Medical nexus or service records documenting the in-service burn event' },
      { type: 'required', description: 'Assessment of whether scars are painful, unstable, or limit function' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Photographs of scars with measurements' },
      { type: 'recommended', description: 'Documentation of functional limitations caused by scarring (limited ROM, pain with movement)' },
      { type: 'recommended', description: 'Records from the burn event including treatment records' },
    ],
    commonEvidenceGaps: [
      'Scar measurements not precisely documented in square inches or centimeters',
      'Pain and instability of scars not assessed',
      'Functional limitations from scarring not separately evaluated',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Burn scars that are deep or cause limited motion, area of at least 6 square inches (39 sq cm) (DC 7801)', 'One or two scars that are unstable or painful (DC 7804)'] },
      { ratingPercent: 20, keyEvidence: ['Deep burn scars area of at least 12 square inches (77 sq cm) (DC 7801)', 'Three or four scars that are unstable or painful (DC 7804)'] },
      { ratingPercent: 30, keyEvidence: ['Deep burn scars area of at least 72 square inches (465 sq cm) (DC 7801)', 'Five or more scars that are unstable or painful (DC 7804)'] },
      { ratingPercent: 40, keyEvidence: ['Deep burn scars area of at least 144 square inches (929 sq cm) (DC 7801)'] },
    ],
    tips: [
      'Each painful or unstable scar can contribute to a higher rating - ensure all scars are individually assessed',
      'If scars limit joint movement, that functional limitation can be rated separately under the appropriate musculoskeletal code',
      'Head, face, and neck scars are rated under DC 7800 for disfigurement with a different (often more favorable) rating schedule',
    ],
  },

  // ──────────────────────────────────────────────
  // ENDOCRINE / METABOLIC CONDITIONS
  // ──────────────────────────────────────────────
  {
    conditionId: 'diabetes',
    conditionName: 'Diabetes Mellitus Type II',
    diagnosticCode: '7913',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of diabetes mellitus type II', dbqForm: 'DBQ - Diabetes Mellitus' },
      { type: 'required', description: 'Documentation of current treatment regimen (diet, oral medication, insulin)' },
      { type: 'required', description: 'Medical nexus opinion linking diabetes to service or herbicide exposure' },
      { type: 'required', description: 'HbA1c and blood glucose results' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'For Agent Orange claims, service records showing Vietnam or Thailand service during qualifying dates' },
      { type: 'recommended', description: 'Documentation of all diabetic complications (neuropathy, retinopathy, nephropathy, erectile dysfunction)' },
      { type: 'recommended', description: 'Records of activity restrictions prescribed by physician' },
    ],
    commonEvidenceGaps: [
      'Diabetic complications not separately identified and claimed',
      'Activity regulation by physician not documented (this is key for 40%+ ratings)',
      'Insulin use and dosing not documented',
      'For presumptive claims, no evidence of qualifying herbicide exposure location and dates',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Manageable by restricted diet only'] },
      { ratingPercent: 20, keyEvidence: ['Requiring insulin and restricted diet, or oral hypoglycemic agent and restricted diet'] },
      { ratingPercent: 40, keyEvidence: ['Requiring insulin, restricted diet, and regulation of activities'] },
      { ratingPercent: 60, keyEvidence: ['Requiring insulin, restricted diet, and regulation of activities with episodes of ketoacidosis or hypoglycemic reactions requiring one or two hospitalizations per year or twice a month visits to a diabetic care provider plus complications that would not be compensable if separately evaluated'] },
      { ratingPercent: 100, keyEvidence: ['Requiring more than one daily injection of insulin, restricted diet, and regulation of activities with episodes of ketoacidosis or hypoglycemic reactions requiring at least three hospitalizations per year or weekly visits to a diabetic care provider plus either progressive loss of weight and strength or complications that would be compensable if separately evaluated'] },
    ],
    tips: [
      'Diabetes type II is a presumptive condition for veterans exposed to Agent Orange/herbicides in Vietnam, Thailand, and other qualifying locations',
      'All diabetic complications (peripheral neuropathy, retinopathy, nephropathy, erectile dysfunction) should be claimed as secondary conditions for separate ratings',
      '"Regulation of activities" means a doctor has told you to avoid strenuous activities - get this in writing from your physician',
      'The difference between 20% and 40% is regulation of activities - this is the most commonly missed element',
    ],
  },
  {
    conditionId: 'hypothyroidism',
    conditionName: 'Hypothyroidism',
    diagnosticCode: '7903',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of hypothyroidism with lab results (TSH, T3, T4)', dbqForm: 'DBQ - Thyroid and Parathyroid Conditions' },
      { type: 'required', description: 'Medical nexus opinion linking hypothyroidism to service or service-connected condition' },
      { type: 'required', description: 'Documentation of current medication (levothyroxine) and symptoms' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Lab trend showing thyroid function over time' },
      { type: 'recommended', description: 'Documentation of symptoms (fatigue, weight gain, cold intolerance, constipation, mental sluggishness)' },
      { type: 'strongly-recommended', description: 'Endocrinologist evaluation with nexus opinion' },
    ],
    commonEvidenceGaps: [
      'Hypothyroidism symptoms attributed to other conditions without proper evaluation',
      'No nexus connecting thyroid condition to service or service-connected condition',
      'Medication use documented but residual symptoms not assessed',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Fatigability or continuous medication required for control'] },
      { ratingPercent: 30, keyEvidence: ['Fatigability, constipation, and mental sluggishness'] },
      { ratingPercent: 60, keyEvidence: ['Muscular weakness, mental disturbance, and weight gain'] },
      { ratingPercent: 100, keyEvidence: ['Cold intolerance, muscular weakness, cardiovascular involvement, mental disturbance (dementia, slowing of thought, depression), bradycardia, and sleepiness'] },
    ],
    tips: [
      'Even on medication, document any residual symptoms like fatigue, weight gain, and cognitive issues',
      'Hypothyroidism can be secondary to radiation exposure, head/neck injuries, or certain medications',
      'Track weight changes and energy levels as supporting evidence',
    ],
  },
  {
    conditionId: 'erectile-dysfunction',
    conditionName: 'Erectile Dysfunction',
    diagnosticCode: '7522',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of erectile dysfunction', dbqForm: 'DBQ - Male Reproductive System Conditions' },
      { type: 'required', description: 'Medical nexus opinion linking ED to service-connected condition (diabetes, PTSD medications, spinal condition, hypertension medications)' },
      { type: 'required', description: 'Documentation of the service-connected condition causing or contributing to ED' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Urology evaluation records' },
      { type: 'recommended', description: 'Documentation of medications that may cause ED as a side effect (SSRIs, beta blockers, etc.)' },
      { type: 'strongly-recommended', description: 'Specialist nexus opinion explaining the physiological mechanism linking the primary condition to ED' },
    ],
    commonEvidenceGaps: [
      'No nexus connecting ED to a service-connected condition or its treatment',
      'ED attributed to age rather than service-connected cause',
      'Medication side effects not identified as a contributing factor',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['Erectile dysfunction diagnosed and service-connected - qualifies for Special Monthly Compensation (SMC-K) for loss of use of a creative organ even at 0% rating'] },
      { ratingPercent: 20, keyEvidence: ['Deformity of the penis with loss of erectile power (DC 7522)'] },
    ],
    tips: [
      'ED is almost always filed as a secondary condition to diabetes, PTSD/depression medications, spinal conditions, or hypertension medications',
      'Even a 0% rating for ED qualifies you for Special Monthly Compensation (SMC-K), which is an additional monthly payment',
      'Be honest and direct during the C&P exam - this is a medical evaluation',
    ],
  },

  // ──────────────────────────────────────────────
  // OTHER CONDITIONS
  // ──────────────────────────────────────────────
  {
    conditionId: 'chronic-fatigue',
    conditionName: 'Chronic Fatigue Syndrome',
    diagnosticCode: '6354',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of chronic fatigue syndrome (CFS) meeting diagnostic criteria', dbqForm: 'DBQ - Chronic Fatigue Syndrome' },
      { type: 'required', description: 'Documentation of debilitating fatigue that is not explained by another diagnosis' },
      { type: 'required', description: 'Medical nexus opinion linking CFS to military service or service-connected condition' },
      { type: 'required', description: 'Documentation of associated symptoms (cognitive impairment, sore throat, tender lymph nodes, muscle/joint pain, headaches, sleep disturbance)' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Lab work ruling out other causes of fatigue' },
      { type: 'recommended', description: 'Documentation of how fatigue limits daily activities and employment' },
      { type: 'strongly-recommended', description: 'Specialist evaluation with nexus opinion' },
    ],
    commonEvidenceGaps: [
      'CFS not differentiated from fatigue symptoms of other conditions',
      'Six or more months of debilitating fatigue not documented',
      'Associated symptoms (at least 6 of 10 criteria) not documented',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Symptoms wax and wane but are controlled by continuous medication'] },
      { ratingPercent: 20, keyEvidence: ['Symptoms are nearly constant and restrict routine daily activities by less than 25% of pre-illness level'] },
      { ratingPercent: 40, keyEvidence: ['Symptoms are nearly constant and restrict routine daily activities to 50-75% of pre-illness level'] },
      { ratingPercent: 60, keyEvidence: ['Symptoms are nearly constant and restrict routine daily activities to less than 50% of pre-illness level'] },
      { ratingPercent: 100, keyEvidence: ['Symptoms are nearly constant and so severe as to restrict routine daily activities almost completely', 'Occasionally incapacitated'] },
    ],
    tips: [
      'CFS is a presumptive condition for Gulf War veterans under 38 CFR 3.317',
      'Document your pre-illness activity level vs. current activity level as a percentage',
      'Keep a daily activity log showing how fatigue limits your functioning',
    ],
  },
  {
    conditionId: 'flatfoot',
    conditionName: 'Flatfoot (Pes Planus)',
    diagnosticCode: '5276',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of pes planus (flatfoot)', dbqForm: 'DBQ - Flatfoot (Pes Planus)' },
      { type: 'required', description: 'Documentation of whether condition is bilateral or unilateral' },
      { type: 'required', description: 'Medical nexus opinion - if pre-existing, evidence that military service aggravated the condition beyond natural progression' },
      { type: 'required', description: 'Service treatment records or entrance/separation exams showing flatfoot or foot complaints' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Weight-bearing X-rays of both feet' },
      { type: 'recommended', description: 'Documentation of orthotic use and effectiveness' },
      { type: 'recommended', description: 'Documentation of pain on manipulation and use of the feet' },
    ],
    commonEvidenceGaps: [
      'Pre-existing flatfoot noted on entrance exam but no evidence of aggravation during service',
      'Objective evidence of marked deformity, swelling, or calluses not documented',
      'Bilateral vs. unilateral not specified',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 0, keyEvidence: ['Mild symptoms relieved by built-up shoe or arch support'] },
      { ratingPercent: 10, keyEvidence: ['Moderate bilateral or unilateral: weight-bearing line over or medial to great toe, inward bowing of the Achilles tendon, pain on manipulation and use'] },
      { ratingPercent: 20, keyEvidence: ['Severe unilateral: objective evidence of marked deformity, pain on manipulation and use, swelling on use, characteristic callosities (DC 5276)'] },
      { ratingPercent: 30, keyEvidence: ['Severe bilateral: objective evidence of marked deformity, pain on manipulation and use, swelling on use, characteristic callosities'] },
      { ratingPercent: 50, keyEvidence: ['Pronounced bilateral: marked pronation, extreme tenderness of plantar surfaces, marked inward displacement and severe spasm of the Achilles tendon, not improved by orthopedic shoes or appliances'] },
    ],
    tips: [
      'If flatfoot was noted on your entrance physical, you need evidence that it was aggravated beyond its natural progression during service',
      'Bring your orthotics to the C&P exam and explain whether they help or not',
      'Running, rucking, and prolonged standing in military boots are common aggravation arguments',
    ],
  },
  {
    conditionId: 'gout',
    conditionName: 'Gout',
    diagnosticCode: '5017',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of gout confirmed by lab results (uric acid levels) or joint aspiration', dbqForm: 'DBQ - Non-Degenerative Arthritis' },
      { type: 'required', description: 'Medical nexus opinion linking gout to service or service-connected condition' },
      { type: 'required', description: 'Documentation of frequency and severity of gout attacks' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'Lab results showing elevated uric acid levels' },
      { type: 'recommended', description: 'Rheumatology records documenting gout management' },
      { type: 'recommended', description: 'Documentation of affected joints and functional limitations during flares' },
    ],
    commonEvidenceGaps: [
      'Frequency of acute attacks not documented',
      'No lab confirmation (uric acid levels, joint aspiration)',
      'Functional impact during acute episodes not assessed',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 20, keyEvidence: ['One or two exacerbations per year in a well-established diagnosis'] },
      { ratingPercent: 40, keyEvidence: ['Symptom combinations productive of definite impairment of health objectively supported by examination findings or incapacitating exacerbations occurring 3 or more times per year'] },
      { ratingPercent: 60, keyEvidence: ['Constitutional manifestations associated with active joint involvement that are totally incapacitating'] },
      { ratingPercent: 100, keyEvidence: ['Constitutional manifestations with active joint involvement, totally incapacitating'] },
    ],
    tips: [
      'Gout is rated under the same criteria as rheumatoid arthritis (DC 5002)',
      'Track every gout flare-up with dates, affected joints, and duration',
      'If gout is secondary to medication for another service-connected condition (like diuretics for hypertension), document that connection',
    ],
  },
  {
    conditionId: 'rhinitis',
    conditionName: 'Allergic Rhinitis',
    diagnosticCode: '6522',
    requiredEvidence: [
      { type: 'required', description: 'Current diagnosis of allergic or vasomotor rhinitis', dbqForm: 'DBQ - Sinusitis, Rhinitis, and Other Conditions of the Nose, Throat, Larynx, and Pharynx' },
      { type: 'required', description: 'Medical nexus opinion linking rhinitis to service (environmental exposures, burn pits, dust)' },
      { type: 'required', description: 'Documentation of nasal obstruction or polyps' },
    ],
    recommendedEvidence: [
      { type: 'recommended', description: 'CT scan or nasal endoscopy results' },
      { type: 'recommended', description: 'Allergy testing results' },
      { type: 'recommended', description: 'Documentation of deployment locations with known airborne hazards' },
    ],
    commonEvidenceGaps: [
      'No documentation of polyps or degree of nasal obstruction',
      'Rhinitis symptoms not differentiated from sinusitis',
      'No nexus connecting rhinitis to in-service environmental exposures',
    ],
    ratingLevelEvidence: [
      { ratingPercent: 10, keyEvidence: ['Without polyps but with greater than 50% obstruction of nasal passage on both sides or complete obstruction on one side'] },
      { ratingPercent: 30, keyEvidence: ['With polyps (DC 6522)'] },
    ],
    tips: [
      'Rhinitis is commonly secondary to environmental and burn pit exposure - PACT Act veterans should consider this claim',
      'If rhinitis contributes to sleep apnea, file sleep apnea as secondary to rhinitis',
      'Rhinitis is capped at 30% but can support secondary claims for sinusitis and sleep apnea',
    ],
  },
];

export function getEvidenceRequirements(conditionId: string): ConditionEvidence | undefined {
  return evidenceRequirements.find(e => e.conditionId === conditionId);
}

export function searchEvidenceRequirements(query: string): ConditionEvidence[] {
  const lower = query.toLowerCase();
  return evidenceRequirements.filter(e =>
    e.conditionId.includes(lower) ||
    e.conditionName.toLowerCase().includes(lower)
  );
}
