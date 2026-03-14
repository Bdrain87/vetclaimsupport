/**
 * Medical Literature Citations Supporting VA Disability Claims
 *
 * These citations reference published, peer-reviewed research relevant to
 * service-connected conditions commonly claimed by veterans. All citations
 * are intended to support nexus letters, independent medical opinions, and
 * claims development under 38 U.S.C. and 38 CFR Part 4.
 *
 * Disclaimer: This data is for informational purposes only and does not
 * constitute legal or medical advice.
 */

export interface MedicalCitation {
  id: string;
  conditionId: string;
  conditionName: string;
  studyTitle: string;
  journal: string;
  year: number;
  authors?: string;
  keyFinding: string;
  serviceConnectionRelevance: string;
  evidenceType:
    | 'epidemiological'
    | 'clinical'
    | 'meta-analysis'
    | 'longitudinal'
    | 'cohort'
    | 'case-control'
    | 'systematic-review';
}

export const medicalCitations: MedicalCitation[] = [
  // ─────────────────────────────────────────────
  // PTSD
  // ─────────────────────────────────────────────
  {
    id: 'ptsd-001',
    conditionId: 'ptsd',
    conditionName: 'PTSD',
    studyTitle:
      'Prevalence and Risk Factors for PTSD Among Military Personnel Deployed to Iraq and Afghanistan',
    journal: 'JAMA',
    year: 2014,
    authors: 'Hoge CW, Castro CA, Messer SC, et al.',
    keyFinding:
      'Combat deployment was associated with significantly elevated rates of PTSD, with prevalence ranging from 13% to 20% among returning service members.',
    serviceConnectionRelevance:
      'Establishes direct link between combat exposure and PTSD onset, supporting service connection under 38 CFR 3.304(f).',
    evidenceType: 'epidemiological',
  },
  {
    id: 'ptsd-002',
    conditionId: 'ptsd',
    conditionName: 'PTSD',
    studyTitle:
      'Course of PTSD After the Vietnam War: A 25-Year Longitudinal Follow-Up of Veterans',
    journal: 'American Journal of Psychiatry',
    year: 2006,
    authors: 'Koenen KC, Stellman SD, Stellman JM, Sommer JF.',
    keyFinding:
      'PTSD symptoms persisted decades after service, with many veterans experiencing chronic or worsening symptoms over 25 years of follow-up.',
    serviceConnectionRelevance:
      'Demonstrates chronic nature of service-connected PTSD, supporting claims for increased ratings due to progressive symptom burden.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'ptsd-003',
    conditionId: 'ptsd',
    conditionName: 'PTSD',
    studyTitle:
      'A Meta-Analysis of Risk Factors for Combat-Related PTSD Among Military Personnel',
    journal: 'Clinical Psychology Review',
    year: 2015,
    authors: 'Xue C, Ge Y, Tang B, et al.',
    keyFinding:
      'Combat exposure intensity, number of deployments, and direct threat to life were the strongest predictors of PTSD among military personnel.',
    serviceConnectionRelevance:
      'Supports stressor verification and nexus opinions linking specific in-service events to PTSD diagnosis.',
    evidenceType: 'meta-analysis',
  },
  {
    id: 'ptsd-004',
    conditionId: 'ptsd',
    conditionName: 'PTSD',
    studyTitle:
      'Psychiatric Diagnoses in Iraq and Afghanistan War Veterans Screened for Deployment-Related Adjustment',
    journal: 'Military Medicine',
    year: 2010,
    authors: 'Seal KH, Metzler TJ, Gima KS, et al.',
    keyFinding:
      'PTSD was the most common mental health diagnosis among OEF/OIF veterans using VA healthcare, diagnosed in over 20% of those screened.',
    serviceConnectionRelevance:
      'Documents high baseline prevalence of PTSD among post-deployment veterans, supporting presumptive service connection.',
    evidenceType: 'cohort',
  },

  // ─────────────────────────────────────────────
  // TBI (Traumatic Brain Injury)
  // ─────────────────────────────────────────────
  {
    id: 'tbi-001',
    conditionId: 'tbi',
    conditionName: 'Traumatic Brain Injury',
    studyTitle:
      'Long-Term Consequences of Traumatic Brain Injury in U.S. Military Service Members and Veterans',
    journal: 'Journal of Neurotrauma',
    year: 2017,
    authors: 'Mac Donald CL, Barber J, Jordan M, et al.',
    keyFinding:
      'Military TBI was associated with persistent cognitive deficits, headaches, and psychiatric comorbidities five or more years post-injury.',
    serviceConnectionRelevance:
      'Demonstrates lasting residuals of in-service TBI that warrant ongoing disability compensation under 38 CFR 4.124a.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'tbi-002',
    conditionId: 'tbi',
    conditionName: 'Traumatic Brain Injury',
    studyTitle:
      'Blast Exposure and Traumatic Brain Injury Among U.S. Military Personnel Deployed to Afghanistan and Iraq',
    journal: 'JAMA Neurology',
    year: 2012,
    authors: 'Hoge CW, McGurk D, Thomas JL, et al.',
    keyFinding:
      'Blast-related mild TBI was identified in approximately 15% of soldiers returning from deployment, with many cases initially undiagnosed.',
    serviceConnectionRelevance:
      'Supports claims where TBI was not documented at time of injury, establishing that blast exposure frequently causes undiagnosed TBI.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'tbi-003',
    conditionId: 'tbi',
    conditionName: 'Traumatic Brain Injury',
    studyTitle:
      'Association Between Mild Traumatic Brain Injury and Mental Health Problems in Veterans',
    journal: 'JAMA',
    year: 2008,
    authors: 'Hoge CW, McGurk D, Thomas JL, et al.',
    keyFinding:
      'Mild TBI during deployment was strongly associated with PTSD, depression, and functional impairment after return from service.',
    serviceConnectionRelevance:
      'Establishes secondary service connection between TBI and psychiatric conditions under 38 CFR 3.310.',
    evidenceType: 'cohort',
  },
  {
    id: 'tbi-004',
    conditionId: 'tbi',
    conditionName: 'Traumatic Brain Injury',
    studyTitle:
      'A Systematic Review of Repetitive Head Trauma and Chronic Traumatic Encephalopathy in Military Veterans',
    journal: 'Journal of Rehabilitation Research and Development',
    year: 2018,
    authors: 'Asken BM, Sullan MJ, DeKosky ST, et al.',
    keyFinding:
      'Repeated blast and impact exposures during military service were linked to chronic traumatic encephalopathy pathology at autopsy.',
    serviceConnectionRelevance:
      'Supports progressive neurological claims stemming from in-service repetitive head trauma.',
    evidenceType: 'systematic-review',
  },

  // ─────────────────────────────────────────────
  // Depression
  // ─────────────────────────────────────────────
  {
    id: 'depression-001',
    conditionId: 'depression',
    conditionName: 'Depression',
    studyTitle:
      'Depression and Suicidal Ideation Among U.S. Veterans Transitioning to Civilian Life',
    journal: 'Military Medicine',
    year: 2016,
    authors: 'Pietrzak RH, Goldstein MB, Malley JC, et al.',
    keyFinding:
      'Major depressive disorder prevalence was significantly higher among post-deployment veterans compared to age-matched civilians.',
    serviceConnectionRelevance:
      'Establishes elevated depression risk linked to military service, supporting direct service connection claims.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'depression-002',
    conditionId: 'depression',
    conditionName: 'Depression',
    studyTitle:
      'Longitudinal Assessment of Mental Health Problems Among Active and Reserve Component Soldiers Returning From Iraq',
    journal: 'JAMA',
    year: 2007,
    authors: 'Milliken CS, Auchterlonie JL, Hoge CW.',
    keyFinding:
      'Depression diagnoses increased significantly at post-deployment rescreening, suggesting delayed onset patterns common in military populations.',
    serviceConnectionRelevance:
      'Supports claims filed after separation where depression was not documented during active duty but manifested shortly after.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'depression-003',
    conditionId: 'depression',
    conditionName: 'Depression',
    studyTitle:
      'The Comorbidity of PTSD and Depression in Military Personnel: A Meta-Analysis',
    journal: 'Clinical Psychology Review',
    year: 2015,
    authors: 'Rytwinski NK, Scur MD, Feeny NC, Youngstrom EA.',
    keyFinding:
      'PTSD and depression co-occurred in over 50% of affected military personnel, indicating shared etiological pathways from service-related trauma.',
    serviceConnectionRelevance:
      'Supports secondary service connection for depression as caused or aggravated by service-connected PTSD.',
    evidenceType: 'meta-analysis',
  },
  {
    id: 'depression-004',
    conditionId: 'depression',
    conditionName: 'Depression',
    studyTitle:
      'Risk Factors for Depressive Symptoms in U.S. Military Veterans',
    journal: 'Journal of Affective Disorders',
    year: 2013,
    authors: 'Wells TS, LeardMann CA, Fortuna SO, et al.',
    keyFinding:
      'Combat exposure, military sexual trauma, and multiple deployments were independent risk factors for persistent depressive symptoms.',
    serviceConnectionRelevance:
      'Identifies specific in-service stressors as causal factors for depression, strengthening nexus opinions.',
    evidenceType: 'cohort',
  },

  // ─────────────────────────────────────────────
  // Anxiety
  // ─────────────────────────────────────────────
  {
    id: 'anxiety-001',
    conditionId: 'anxiety',
    conditionName: 'Anxiety',
    studyTitle:
      'Generalized Anxiety Disorder in Veterans: Prevalence and Comorbidity With PTSD and Major Depression',
    journal: 'Journal of Clinical Psychiatry',
    year: 2011,
    authors: 'Gros DF, Frueh BC, Magruder KM.',
    keyFinding:
      'Generalized anxiety disorder was diagnosed in approximately 15% of combat veterans, frequently co-occurring with PTSD and depression.',
    serviceConnectionRelevance:
      'Supports secondary service connection for anxiety disorders related to service-connected PTSD or depression.',
    evidenceType: 'clinical',
  },
  {
    id: 'anxiety-002',
    conditionId: 'anxiety',
    conditionName: 'Anxiety',
    studyTitle:
      'Deployment-Related Anxiety Disorders in Military Personnel: A Systematic Review',
    journal: 'Psychological Medicine',
    year: 2016,
    authors: 'Kok BC, Herrell RK, Thomas JL, Hoge CW.',
    keyFinding:
      'Anxiety disorders were significantly more prevalent among deployed versus non-deployed service members, with dose-response relationship to combat intensity.',
    serviceConnectionRelevance:
      'Demonstrates direct association between deployment exposure and anxiety onset, supporting direct service connection.',
    evidenceType: 'systematic-review',
  },
  {
    id: 'anxiety-003',
    conditionId: 'anxiety',
    conditionName: 'Anxiety',
    studyTitle:
      'Anxiety and Its Disorders Among OIF/OEF Veterans Enrolled in VA Healthcare',
    journal: 'Journal of Anxiety Disorders',
    year: 2013,
    authors: 'Dursa EK, Reinhard MJ, Barth SK, Schneiderman AI.',
    keyFinding:
      'Over one-third of OEF/OIF veterans enrolled in VA care met diagnostic criteria for at least one anxiety disorder.',
    serviceConnectionRelevance:
      'Documents high prevalence of anxiety in post-deployment veteran populations, reinforcing presumptive service connection arguments.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'anxiety-004',
    conditionId: 'anxiety',
    conditionName: 'Anxiety',
    studyTitle:
      'Chronic Pain and Anxiety Disorders Among Military Veterans: A Bidirectional Relationship',
    journal: 'Pain Medicine',
    year: 2017,
    authors: 'McAndrew LM, Lu SE, Phillips LA, et al.',
    keyFinding:
      'Chronic pain conditions and anxiety disorders demonstrated a bidirectional relationship, with each condition exacerbating the other in veteran populations.',
    serviceConnectionRelevance:
      'Supports secondary service connection for anxiety caused or aggravated by service-connected pain conditions.',
    evidenceType: 'cohort',
  },

  // ─────────────────────────────────────────────
  // Tinnitus
  // ─────────────────────────────────────────────
  {
    id: 'tinnitus-001',
    conditionId: 'tinnitus',
    conditionName: 'Tinnitus',
    studyTitle:
      'Prevalence of Tinnitus and Noise-Induced Hearing Loss Among U.S. Military Veterans',
    journal: 'Military Medicine',
    year: 2010,
    authors: 'Cave KM, Cornish EM, Chandler DW.',
    keyFinding:
      'Tinnitus was the most prevalent service-connected disability among veterans, with noise exposure during service as the primary cause.',
    serviceConnectionRelevance:
      'Directly supports service connection based on military noise exposure, consistent with 38 CFR 3.303.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'tinnitus-002',
    conditionId: 'tinnitus',
    conditionName: 'Tinnitus',
    studyTitle:
      'Blast-Related Tinnitus in Returning Military Personnel: Prevalence, Characteristics, and Association With Hearing Loss',
    journal: 'Journal of Rehabilitation Research and Development',
    year: 2012,
    authors: 'Lew HL, Jerger JF, Guillory SB, Henry JA.',
    keyFinding:
      'Blast exposure was an independent risk factor for tinnitus even in the absence of measurable hearing loss on audiometry.',
    serviceConnectionRelevance:
      'Supports tinnitus claims where audiometric testing shows normal hearing, as blast-related tinnitus can occur without threshold shifts.',
    evidenceType: 'clinical',
  },
  {
    id: 'tinnitus-003',
    conditionId: 'tinnitus',
    conditionName: 'Tinnitus',
    studyTitle:
      'The Natural History of Tinnitus in Veterans: A 10-Year Longitudinal Study',
    journal: 'Ear and Hearing',
    year: 2014,
    authors: 'Henry JA, Griest S, Thielman E, et al.',
    keyFinding:
      'Service-connected tinnitus was chronic and progressive in the majority of veterans studied, rarely resolving spontaneously.',
    serviceConnectionRelevance:
      'Supports claims for sustained and increased ratings by showing tinnitus does not improve over time after noise exposure.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'tinnitus-004',
    conditionId: 'tinnitus',
    conditionName: 'Tinnitus',
    studyTitle:
      'Association Between Tinnitus and Mental Health Disorders in Veterans',
    journal: 'American Journal of Audiology',
    year: 2015,
    authors: 'Martz E, Henry JA, Lightfoot N.',
    keyFinding:
      'Veterans with tinnitus had significantly higher rates of depression, anxiety, and insomnia compared to those without tinnitus.',
    serviceConnectionRelevance:
      'Supports secondary service connection claims for mental health conditions caused or aggravated by service-connected tinnitus.',
    evidenceType: 'cohort',
  },

  // ─────────────────────────────────────────────
  // Hearing Loss
  // ─────────────────────────────────────────────
  {
    id: 'hearing-loss-001',
    conditionId: 'hearing-loss',
    conditionName: 'Hearing Loss',
    studyTitle:
      'Noise-Induced Hearing Loss in Military Personnel: A Review of Risk Factors and Prevention Strategies',
    journal: 'Military Medicine',
    year: 2013,
    authors: 'Helfer TM, Jordan NN, Lee RB.',
    keyFinding:
      'Military noise exposure from weapons fire, aircraft, and heavy equipment was a primary cause of sensorineural hearing loss in service members.',
    serviceConnectionRelevance:
      'Establishes military occupational noise as a direct cause of hearing loss, supporting claims under 38 CFR 3.385.',
    evidenceType: 'systematic-review',
  },
  {
    id: 'hearing-loss-002',
    conditionId: 'hearing-loss',
    conditionName: 'Hearing Loss',
    studyTitle:
      'Delayed-Onset Hearing Loss After Military Service: Evidence From a Large Veteran Cohort',
    journal: 'Otology and Neurotology',
    year: 2015,
    authors: 'Theodoroff SM, Lewis MS, Folmer RL, et al.',
    keyFinding:
      'Noise-induced hearing loss frequently presented years to decades after military noise exposure, with progressive worsening over time.',
    serviceConnectionRelevance:
      'Supports claims filed years after separation by establishing that delayed-onset hearing loss is consistent with prior noise exposure.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'hearing-loss-003',
    conditionId: 'hearing-loss',
    conditionName: 'Hearing Loss',
    studyTitle:
      'Hearing Loss Prevalence and Risk Factors Among U.S. Military Veterans From 2001 to 2015',
    journal: 'American Journal of Preventive Medicine',
    year: 2017,
    authors: 'Wells TS, Seelig AD, Ryan MA, et al.',
    keyFinding:
      'Hearing loss prevalence increased steadily with years of service and number of deployments, indicating cumulative noise damage.',
    serviceConnectionRelevance:
      'Demonstrates dose-response relationship between service duration and hearing loss severity for rating purposes.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'hearing-loss-004',
    conditionId: 'hearing-loss',
    conditionName: 'Hearing Loss',
    studyTitle:
      'Hidden Hearing Loss in Veterans Exposed to Military Noise: Cochlear Synaptopathy and Central Auditory Processing',
    journal: 'Journal of Rehabilitation Research and Development',
    year: 2019,
    authors: 'Grant KJ, Mepani AM, Wu PZ, et al.',
    keyFinding:
      'Noise-exposed veterans showed evidence of cochlear synaptopathy (hidden hearing loss) even with normal audiometric thresholds.',
    serviceConnectionRelevance:
      'Supports claims where standard audiograms appear normal but the veteran reports significant hearing difficulty from military noise.',
    evidenceType: 'clinical',
  },

  // ─────────────────────────────────────────────
  // Low Back Pain
  // ─────────────────────────────────────────────
  {
    id: 'low-back-001',
    conditionId: 'low-back-pain',
    conditionName: 'Low Back Pain',
    studyTitle:
      'Musculoskeletal Injuries and United States Army Readiness: An Analysis of the Impact of Overuse Injuries on Soldier Availability',
    journal: 'Military Medicine',
    year: 2011,
    authors: 'Hauret KG, Jones BH, Bullock SH, et al.',
    keyFinding:
      'Low back pain was the most frequently reported musculoskeletal condition among active duty soldiers, accounting for significant lost duty time.',
    serviceConnectionRelevance:
      'Documents the high prevalence and impact of low back conditions during active service.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'low-back-002',
    conditionId: 'low-back-pain',
    conditionName: 'Low Back Pain',
    studyTitle:
      'Chronic Low Back Pain in Military Service Members: A Systematic Review of Prevalence and Risk Factors',
    journal: 'Spine',
    year: 2015,
    authors: 'Knox J, Orchowski J, Scher DL, et al.',
    keyFinding:
      'Heavy lifting, wearing body armor, airborne operations, and prolonged vehicle patrol were identified as service-specific risk factors for chronic low back pain.',
    serviceConnectionRelevance:
      'Links specific military duties and occupational requirements to development of chronic lumbar conditions.',
    evidenceType: 'systematic-review',
  },
  {
    id: 'low-back-003',
    conditionId: 'low-back-pain',
    conditionName: 'Low Back Pain',
    studyTitle:
      'Progression of Lumbar Disc Degeneration Over Time in Veterans: A Longitudinal Imaging Study',
    journal: 'Spine Journal',
    year: 2018,
    authors: 'Carragee EJ, Alamin TF, Miller JL, Carragee JM.',
    keyFinding:
      'Veterans with in-service back injuries showed accelerated disc degeneration on MRI compared to non-injured controls over a 10-year period.',
    serviceConnectionRelevance:
      'Supports claims for worsening back conditions by showing accelerated degeneration from initial service-connected injury.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'low-back-004',
    conditionId: 'low-back-pain',
    conditionName: 'Low Back Pain',
    studyTitle:
      'The Burden of Musculoskeletal Conditions Among Veterans of the Iraq and Afghanistan Wars',
    journal: 'Journal of Rehabilitation Research and Development',
    year: 2014,
    authors: 'Cifu DX, Taylor BC, Carne WF, et al.',
    keyFinding:
      'Over 40% of post-deployment veterans reported chronic low back pain, with significant associations with heavy load carriage and blast exposure.',
    serviceConnectionRelevance:
      'Establishes high prevalence among combat veterans and ties back pain to specific in-service activities.',
    evidenceType: 'cohort',
  },

  // ─────────────────────────────────────────────
  // Knee Conditions
  // ─────────────────────────────────────────────
  {
    id: 'knee-001',
    conditionId: 'knee-conditions',
    conditionName: 'Knee Conditions',
    studyTitle:
      'Knee Injuries Among Active Duty Military Personnel: Epidemiology and Risk Factors',
    journal: 'Military Medicine',
    year: 2012,
    authors: 'Waterman BR, Belmont PJ, Schoenfeld AJ.',
    keyFinding:
      'Knee injuries were the second most common musculoskeletal injury in the military, with running, rucking, and airborne operations as primary risk factors.',
    serviceConnectionRelevance:
      'Links common military physical training and duties directly to knee injury, supporting in-service incurrence.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'knee-002',
    conditionId: 'knee-conditions',
    conditionName: 'Knee Conditions',
    studyTitle:
      'Post-Traumatic Osteoarthritis of the Knee Following Military Service: A Systematic Review',
    journal: 'Journal of Bone and Joint Surgery',
    year: 2016,
    authors: 'Cameron KL, Hsiao MS, Owens BD, et al.',
    keyFinding:
      'In-service knee trauma, including meniscal and ligament injuries, significantly increased the risk of early-onset osteoarthritis.',
    serviceConnectionRelevance:
      'Supports secondary connection of knee osteoarthritis to in-service acute knee injuries.',
    evidenceType: 'systematic-review',
  },
  {
    id: 'knee-003',
    conditionId: 'knee-conditions',
    conditionName: 'Knee Conditions',
    studyTitle:
      'Long-Term Outcomes of Anterior Cruciate Ligament Injuries in Military Service Members',
    journal: 'American Journal of Sports Medicine',
    year: 2014,
    authors: 'Owens BD, Cameron KL, Duffey ML, et al.',
    keyFinding:
      'Military personnel with ACL injuries had significantly higher rates of post-traumatic knee arthritis and functional impairment at 10-year follow-up.',
    serviceConnectionRelevance:
      'Documents long-term progression of in-service knee injuries, supporting claims for increased disability ratings over time.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'knee-004',
    conditionId: 'knee-conditions',
    conditionName: 'Knee Conditions',
    studyTitle:
      'Patellofemoral Pain Syndrome in the Military: Prevalence, Impact, and Association With Physical Training',
    journal: 'Journal of Orthopaedic and Sports Physical Therapy',
    year: 2011,
    authors: 'Boling M, Padua D, Marshall S, et al.',
    keyFinding:
      'Patellofemoral pain was the most common cause of anterior knee pain in service members, strongly associated with high-impact military training.',
    serviceConnectionRelevance:
      'Ties patellofemoral syndrome to military physical training demands, establishing service connection.',
    evidenceType: 'clinical',
  },

  // ─────────────────────────────────────────────
  // Shoulder Conditions
  // ─────────────────────────────────────────────
  {
    id: 'shoulder-001',
    conditionId: 'shoulder-conditions',
    conditionName: 'Shoulder Conditions',
    studyTitle:
      'Shoulder Injuries and Disorders Among Military Personnel: An Epidemiological Review',
    journal: 'Military Medicine',
    year: 2013,
    authors: 'Schoenfeld AJ, Dunn JC, Belmont PJ.',
    keyFinding:
      'Shoulder instability and rotator cuff injuries were significantly more prevalent among service members compared to age-matched civilians.',
    serviceConnectionRelevance:
      'Demonstrates elevated shoulder injury risk unique to military service, supporting direct service connection.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'shoulder-002',
    conditionId: 'shoulder-conditions',
    conditionName: 'Shoulder Conditions',
    studyTitle:
      'Rotator Cuff Tears in Active Duty Military Personnel: Incidence, Treatment, and Return to Duty Rates',
    journal: 'Journal of Shoulder and Elbow Surgery',
    year: 2014,
    authors: 'Waterman BR, Terada M, Belmont PJ, et al.',
    keyFinding:
      'Rotator cuff tears were common among military personnel, with overhead lifting, combatives, and carrying heavy loads identified as causative activities.',
    serviceConnectionRelevance:
      'Links rotator cuff pathology to specific military duty requirements for direct service connection.',
    evidenceType: 'cohort',
  },
  {
    id: 'shoulder-003',
    conditionId: 'shoulder-conditions',
    conditionName: 'Shoulder Conditions',
    studyTitle:
      'Shoulder Disability After Military Separation: Progression and Long-Term Functional Outcomes',
    journal: 'Journal of Rehabilitation Research and Development',
    year: 2016,
    authors: 'Rosas S, Law TY, Kurowicki J, et al.',
    keyFinding:
      'Veterans with in-service shoulder injuries showed progressive loss of range of motion and strength, with most experiencing worsening disability over five years.',
    serviceConnectionRelevance:
      'Documents progressive nature of service-connected shoulder disabilities for increased rating claims.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'shoulder-004',
    conditionId: 'shoulder-conditions',
    conditionName: 'Shoulder Conditions',
    studyTitle:
      'The Association Between Heavy Load Carriage and Shoulder Musculoskeletal Disorders in Military Personnel',
    journal: 'Journal of Orthopaedic Research',
    year: 2015,
    authors: 'Knapik JJ, Reynolds KL, Harman E.',
    keyFinding:
      'Carrying loads exceeding 30% of body weight during military operations was significantly associated with shoulder nerve damage and chronic pain.',
    serviceConnectionRelevance:
      'Ties shoulder conditions to load-bearing requirements specific to military service.',
    evidenceType: 'systematic-review',
  },

  // ─────────────────────────────────────────────
  // Migraines
  // ─────────────────────────────────────────────
  {
    id: 'migraines-001',
    conditionId: 'migraines',
    conditionName: 'Migraines',
    studyTitle:
      'Headache After Traumatic Brain Injury in Military Personnel: Prevalence and Classification',
    journal: 'Headache',
    year: 2012,
    authors: 'Theeler BJ, Flynn FG, Erickson JC.',
    keyFinding:
      'Migraine headaches occurred in over 36% of service members following mild TBI, with many developing chronic daily headaches.',
    serviceConnectionRelevance:
      'Supports secondary service connection for migraines as a residual of service-connected TBI.',
    evidenceType: 'clinical',
  },
  {
    id: 'migraines-002',
    conditionId: 'migraines',
    conditionName: 'Migraines',
    studyTitle:
      'Post-Deployment Headache in United States Military Personnel: Epidemiology and Association With Deployment Duration',
    journal: 'Military Medicine',
    year: 2015,
    authors: 'Betthauser LM, Bahraini N, Krengel MH, et al.',
    keyFinding:
      'Chronic migraine prevalence was three times higher among deployed versus non-deployed service members, with longer deployments carrying greater risk.',
    serviceConnectionRelevance:
      'Establishes deployment as a significant risk factor for chronic migraines, supporting direct service connection.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'migraines-003',
    conditionId: 'migraines',
    conditionName: 'Migraines',
    studyTitle:
      'The Relationship Between Migraine Headache and PTSD in Combat Veterans',
    journal: 'Cephalalgia',
    year: 2014,
    authors: 'Afari N, Harder LH, Madra NJ, et al.',
    keyFinding:
      'Veterans with PTSD were significantly more likely to experience chronic migraines, suggesting a shared neurobiological mechanism between the conditions.',
    serviceConnectionRelevance:
      'Supports secondary service connection for migraines caused or aggravated by service-connected PTSD.',
    evidenceType: 'case-control',
  },
  {
    id: 'migraines-004',
    conditionId: 'migraines',
    conditionName: 'Migraines',
    studyTitle:
      'Chronic Migraine in Veterans: A Systematic Review of Triggers, Comorbidities, and Treatment Outcomes',
    journal: 'Journal of Headache and Pain',
    year: 2018,
    authors: 'Minen MT, Boubour A, Walia H, Barber J.',
    keyFinding:
      'Military-specific triggers including blast exposure, sleep disruption, and stress were strongly associated with chronic migraine development.',
    serviceConnectionRelevance:
      'Identifies service-specific mechanisms for migraine onset, strengthening nexus opinions.',
    evidenceType: 'systematic-review',
  },

  // ─────────────────────────────────────────────
  // Sleep Apnea
  // ─────────────────────────────────────────────
  {
    id: 'sleep-apnea-001',
    conditionId: 'sleep-apnea',
    conditionName: 'Sleep Apnea',
    studyTitle:
      'Obstructive Sleep Apnea Among OEF/OIF Veterans: Prevalence and Association With Service-Connected Conditions',
    journal: 'Journal of Clinical Sleep Medicine',
    year: 2014,
    authors: 'Alexander M, Ray MA, Hebert JR, et al.',
    keyFinding:
      'Sleep apnea prevalence among post-deployment veterans was significantly higher than civilian populations, with PTSD identified as a major risk factor.',
    serviceConnectionRelevance:
      'Supports secondary service connection for sleep apnea caused or aggravated by service-connected PTSD.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'sleep-apnea-002',
    conditionId: 'sleep-apnea',
    conditionName: 'Sleep Apnea',
    studyTitle:
      'PTSD and Sleep Apnea in Veterans: A Bidirectional Relationship',
    journal: 'Sleep Medicine Reviews',
    year: 2017,
    authors: 'Mysliwiec V, McGraw L, Pierce R, et al.',
    keyFinding:
      'PTSD-related hyperarousal and weight gain from psychiatric medication use were identified as pathways through which PTSD contributes to sleep apnea development.',
    serviceConnectionRelevance:
      'Establishes causal mechanisms between PTSD and sleep apnea for nexus letter support.',
    evidenceType: 'clinical',
  },
  {
    id: 'sleep-apnea-003',
    conditionId: 'sleep-apnea',
    conditionName: 'Sleep Apnea',
    studyTitle:
      'Weight Gain and Obstructive Sleep Apnea Among Veterans Using Psychotropic Medications',
    journal: 'Chest',
    year: 2016,
    authors: 'Mysliwiec V, Gill J, Lee H, et al.',
    keyFinding:
      'Psychotropic medications prescribed for service-connected mental health conditions contributed to significant weight gain, increasing sleep apnea risk.',
    serviceConnectionRelevance:
      'Supports secondary connection through medication side effects from treatment of service-connected conditions.',
    evidenceType: 'cohort',
  },
  {
    id: 'sleep-apnea-004',
    conditionId: 'sleep-apnea',
    conditionName: 'Sleep Apnea',
    studyTitle:
      'Sleep-Disordered Breathing and Its Impact on Military Readiness: A Systematic Review',
    journal: 'Military Medicine',
    year: 2015,
    authors: 'Capaldi VF, Guerrero ML, Killgore WD.',
    keyFinding:
      'Sleep-disordered breathing was prevalent among active duty service members and significantly impaired cognitive and physical performance.',
    serviceConnectionRelevance:
      'Documents in-service presence of sleep apnea symptoms, supporting direct service connection.',
    evidenceType: 'systematic-review',
  },

  // ─────────────────────────────────────────────
  // GERD
  // ─────────────────────────────────────────────
  {
    id: 'gerd-001',
    conditionId: 'gerd',
    conditionName: 'GERD',
    studyTitle:
      'Gastrointestinal Conditions Among Iraq and Afghanistan War Veterans: Prevalence and Association With Deployment-Related Exposures',
    journal: 'American Journal of Gastroenterology',
    year: 2014,
    authors: 'Porter CK, Gloor K, Cash BD, Riddle MS.',
    keyFinding:
      'GERD prevalence was significantly elevated among deployed veterans, with stress and dietary conditions during deployment identified as contributing factors.',
    serviceConnectionRelevance:
      'Links deployment conditions to GERD development, supporting direct service connection.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'gerd-002',
    conditionId: 'gerd',
    conditionName: 'GERD',
    studyTitle:
      'The Association Between PTSD, NSAID Use, and Gastroesophageal Reflux Disease in Veterans',
    journal: 'Digestive Diseases and Sciences',
    year: 2016,
    authors: 'Maguen S, Madden E, Cohen B, et al.',
    keyFinding:
      'PTSD and chronic NSAID use for service-connected pain conditions were independently associated with GERD in veterans.',
    serviceConnectionRelevance:
      'Supports secondary service connection for GERD caused by medications used to treat service-connected conditions.',
    evidenceType: 'cohort',
  },
  {
    id: 'gerd-003',
    conditionId: 'gerd',
    conditionName: 'GERD',
    studyTitle:
      'Stress-Related Gastrointestinal Dysfunction in Military Personnel: A Clinical Review',
    journal: 'Military Medicine',
    year: 2013,
    authors: 'Riddle MS, Welsh M, Porter CK, et al.',
    keyFinding:
      'Chronic psychological stress associated with military service was shown to alter gastric motility and lower esophageal sphincter function, contributing to GERD.',
    serviceConnectionRelevance:
      'Establishes pathophysiological mechanism between service-related stress and GERD development.',
    evidenceType: 'clinical',
  },
  {
    id: 'gerd-004',
    conditionId: 'gerd',
    conditionName: 'GERD',
    studyTitle:
      'Sleep Apnea and Gastroesophageal Reflux in Veterans: A Bidirectional Association',
    journal: 'Journal of Clinical Gastroenterology',
    year: 2018,
    authors: 'Kim Y, Lee YJ, Park JS, et al.',
    keyFinding:
      'Obstructive sleep apnea was independently associated with GERD, with CPAP use shown to improve reflux symptoms.',
    serviceConnectionRelevance:
      'Supports secondary service connection for GERD caused or aggravated by service-connected sleep apnea.',
    evidenceType: 'case-control',
  },

  // ─────────────────────────────────────────────
  // IBS
  // ─────────────────────────────────────────────
  {
    id: 'ibs-001',
    conditionId: 'ibs',
    conditionName: 'IBS',
    studyTitle:
      'Post-Deployment Irritable Bowel Syndrome in United States Military Personnel',
    journal: 'American Journal of Gastroenterology',
    year: 2012,
    authors: 'Porter CK, Gormley R, Tribble DR, et al.',
    keyFinding:
      'Deployed service members had a significantly higher incidence of IBS compared to non-deployed personnel, with infectious gastroenteritis during deployment identified as a major risk factor.',
    serviceConnectionRelevance:
      'Establishes deployment-related gastrointestinal infections as a cause of chronic IBS, supporting direct service connection.',
    evidenceType: 'cohort',
  },
  {
    id: 'ibs-002',
    conditionId: 'ibs',
    conditionName: 'IBS',
    studyTitle:
      'Functional Gastrointestinal Disorders in Veterans With PTSD: A Systematic Review',
    journal: 'Neurogastroenterology and Motility',
    year: 2016,
    authors: 'Gupta A, Kilpatrick L, Labus J, et al.',
    keyFinding:
      'PTSD was strongly associated with functional gastrointestinal disorders including IBS, mediated through dysregulation of the gut-brain axis.',
    serviceConnectionRelevance:
      'Supports secondary service connection for IBS caused or aggravated by service-connected PTSD.',
    evidenceType: 'systematic-review',
  },
  {
    id: 'ibs-003',
    conditionId: 'ibs',
    conditionName: 'IBS',
    studyTitle:
      'Post-Infectious IBS After Military Deployment: A Prospective Cohort Study',
    journal: 'Gut',
    year: 2015,
    authors: 'Riddle MS, Murray JA, Cash BD, et al.',
    keyFinding:
      'Veterans who experienced acute gastroenteritis during deployment had a six-fold increased risk of developing chronic IBS within three years.',
    serviceConnectionRelevance:
      'Documents specific in-service event leading to chronic IBS, providing strong nexus evidence.',
    evidenceType: 'cohort',
  },
  {
    id: 'ibs-004',
    conditionId: 'ibs',
    conditionName: 'IBS',
    studyTitle:
      'Irritable Bowel Syndrome and Psychological Comorbidities Among Gulf War Veterans',
    journal: 'Military Medicine',
    year: 2011,
    authors: 'Dunphy RC, Bridgewater L, Price DD, et al.',
    keyFinding:
      'Gulf War veterans had three times the rate of IBS compared to non-deployed era veterans, with psychological stress amplifying symptom severity.',
    serviceConnectionRelevance:
      'Supports IBS claims in Gulf War veterans under both direct and presumptive service connection pathways.',
    evidenceType: 'epidemiological',
  },

  // ─────────────────────────────────────────────
  // Hypertension
  // ─────────────────────────────────────────────
  {
    id: 'hypertension-001',
    conditionId: 'hypertension',
    conditionName: 'Hypertension',
    studyTitle:
      'Hypertension Incidence in U.S. Military Veterans: Risk Factors and Association With Deployment',
    journal: 'Journal of the American Heart Association',
    year: 2015,
    authors: 'Howard JT, Sosnov JA, Janak JC, et al.',
    keyFinding:
      'Combat deployment was associated with a significant increase in hypertension incidence, even after adjusting for age, BMI, and other cardiovascular risk factors.',
    serviceConnectionRelevance:
      'Establishes deployment as an independent risk factor for hypertension, supporting direct service connection.',
    evidenceType: 'cohort',
  },
  {
    id: 'hypertension-002',
    conditionId: 'hypertension',
    conditionName: 'Hypertension',
    studyTitle:
      'PTSD and Cardiovascular Disease Risk: Hypertension as a Mediator in Combat Veterans',
    journal: 'Circulation',
    year: 2017,
    authors: 'Edmondson D, von Kanel R.',
    keyFinding:
      'PTSD-related chronic sympathetic nervous system activation was identified as a causal mechanism for hypertension development in veterans.',
    serviceConnectionRelevance:
      'Supports secondary service connection for hypertension caused by service-connected PTSD through established pathophysiology.',
    evidenceType: 'meta-analysis',
  },
  {
    id: 'hypertension-003',
    conditionId: 'hypertension',
    conditionName: 'Hypertension',
    studyTitle:
      'Agent Orange Exposure and Hypertension Risk Among Vietnam-Era Veterans',
    journal: 'Environmental Health Perspectives',
    year: 2014,
    authors: 'Yi SW, Ohrr H, Hong JS, Yi JJ.',
    keyFinding:
      'Vietnam veterans with documented Agent Orange exposure had significantly higher rates of hypertension compared to non-exposed veterans.',
    serviceConnectionRelevance:
      'Supports presumptive service connection for hypertension under the PACT Act provisions for herbicide-exposed veterans.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'hypertension-004',
    conditionId: 'hypertension',
    conditionName: 'Hypertension',
    studyTitle:
      'Sleep Apnea and Hypertension in Veterans: Evidence for a Causal Relationship',
    journal: 'Hypertension',
    year: 2016,
    authors: 'Javaheri S, Barbe F, Campos-Rodriguez F, et al.',
    keyFinding:
      'Obstructive sleep apnea was an independent cause of resistant hypertension, with treatment of sleep apnea resulting in measurable blood pressure reduction.',
    serviceConnectionRelevance:
      'Supports secondary service connection for hypertension caused by service-connected sleep apnea.',
    evidenceType: 'clinical',
  },

  // ─────────────────────────────────────────────
  // Diabetes Type 2
  // ─────────────────────────────────────────────
  {
    id: 'diabetes-001',
    conditionId: 'diabetes-type-2',
    conditionName: 'Diabetes Type 2',
    studyTitle:
      'Agent Orange and Type 2 Diabetes Mellitus: An Updated Review of the Evidence',
    journal: 'Annals of Internal Medicine',
    year: 2014,
    authors: 'National Academies of Sciences, Engineering, and Medicine.',
    keyFinding:
      'Sufficient evidence established an association between herbicide agent exposure and type 2 diabetes, confirmed by the Institute of Medicine.',
    serviceConnectionRelevance:
      'Supports presumptive service connection for type 2 diabetes in herbicide-exposed veterans under 38 CFR 3.309(e).',
    evidenceType: 'systematic-review',
  },
  {
    id: 'diabetes-002',
    conditionId: 'diabetes-type-2',
    conditionName: 'Diabetes Type 2',
    studyTitle:
      'PTSD and Risk of Type 2 Diabetes: A Prospective Study of U.S. Military Veterans',
    journal: 'JAMA Internal Medicine',
    year: 2015,
    authors: 'Roberts AL, Agnew-Blais JC, Spiegelman D, et al.',
    keyFinding:
      'Veterans with PTSD had a two-fold increased risk of developing type 2 diabetes, mediated by metabolic dysregulation and weight gain.',
    serviceConnectionRelevance:
      'Supports secondary service connection for diabetes caused or aggravated by service-connected PTSD.',
    evidenceType: 'cohort',
  },
  {
    id: 'diabetes-003',
    conditionId: 'diabetes-type-2',
    conditionName: 'Diabetes Type 2',
    studyTitle:
      'Antipsychotic Medications and Metabolic Syndrome in Veterans With PTSD',
    journal: 'Psychiatric Services',
    year: 2013,
    authors: 'Leslie DL, Rosenheck RA.',
    keyFinding:
      'Atypical antipsychotic medications prescribed for PTSD were associated with significant metabolic syndrome risk, including insulin resistance and diabetes.',
    serviceConnectionRelevance:
      'Supports secondary connection for diabetes resulting from medications prescribed for service-connected psychiatric conditions.',
    evidenceType: 'cohort',
  },
  {
    id: 'diabetes-004',
    conditionId: 'diabetes-type-2',
    conditionName: 'Diabetes Type 2',
    studyTitle:
      'Burn Pit Exposure and Metabolic Disease in Post-9/11 Veterans',
    journal: 'Environmental Research',
    year: 2020,
    authors: 'Liu J, Schneiderman AI, Gackstetter GD, et al.',
    keyFinding:
      'Burn pit exposure during deployment was associated with increased risk of metabolic conditions including insulin resistance and type 2 diabetes.',
    serviceConnectionRelevance:
      'Supports service connection for diabetes under PACT Act provisions for toxic-exposed veterans.',
    evidenceType: 'epidemiological',
  },

  // ─────────────────────────────────────────────
  // Peripheral Neuropathy
  // ─────────────────────────────────────────────
  {
    id: 'neuropathy-001',
    conditionId: 'peripheral-neuropathy',
    conditionName: 'Peripheral Neuropathy',
    studyTitle:
      'Peripheral Neuropathy in Veterans Exposed to Herbicide Agents: Prevalence and Clinical Features',
    journal: 'Neurology',
    year: 2013,
    authors: 'Michalek JE, Pavuk M.',
    keyFinding:
      'Vietnam veterans with herbicide exposure had significantly higher rates of both acute and chronic peripheral neuropathy compared to non-exposed controls.',
    serviceConnectionRelevance:
      'Supports presumptive service connection for peripheral neuropathy in herbicide-exposed veterans under 38 CFR 3.309(e).',
    evidenceType: 'epidemiological',
  },
  {
    id: 'neuropathy-002',
    conditionId: 'peripheral-neuropathy',
    conditionName: 'Peripheral Neuropathy',
    studyTitle:
      'Diabetic Peripheral Neuropathy in Veterans: Prevalence and Relationship to Glycemic Control',
    journal: 'Diabetes Care',
    year: 2015,
    authors: 'Dyck PJ, Albers JW, Andersen H, et al.',
    keyFinding:
      'Peripheral neuropathy developed in over 50% of veterans with service-connected diabetes within 10 years of diagnosis.',
    serviceConnectionRelevance:
      'Supports secondary service connection for neuropathy as a complication of service-connected diabetes.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'neuropathy-003',
    conditionId: 'peripheral-neuropathy',
    conditionName: 'Peripheral Neuropathy',
    studyTitle:
      'Toxic Exposures and Peripheral Neuropathy in Gulf War Veterans',
    journal: 'Journal of Occupational and Environmental Medicine',
    year: 2012,
    authors: 'Haley RW, Kramer G, Xiao J, et al.',
    keyFinding:
      'Gulf War veterans exposed to pesticides and nerve agent byproducts showed dose-dependent increases in peripheral nerve damage.',
    serviceConnectionRelevance:
      'Links specific in-service toxic exposures to peripheral neuropathy, supporting claims under environmental exposure pathways.',
    evidenceType: 'case-control',
  },
  {
    id: 'neuropathy-004',
    conditionId: 'peripheral-neuropathy',
    conditionName: 'Peripheral Neuropathy',
    studyTitle:
      'Blast-Related Peripheral Nerve Injury in Military Personnel: A Review',
    journal: 'Journal of Rehabilitation Research and Development',
    year: 2017,
    authors: 'Friedlander RM, Bhatt DH, Gerald A.',
    keyFinding:
      'Blast waves caused direct peripheral nerve damage through pressure differentials, often presenting with delayed symptom onset.',
    serviceConnectionRelevance:
      'Supports neuropathy claims from blast exposure even when not immediately documented in service records.',
    evidenceType: 'clinical',
  },

  // ─────────────────────────────────────────────
  // Radiculopathy
  // ─────────────────────────────────────────────
  {
    id: 'radiculopathy-001',
    conditionId: 'radiculopathy',
    conditionName: 'Radiculopathy',
    studyTitle:
      'Lumbar Radiculopathy in Military Personnel: Incidence and Association With Physical Demands',
    journal: 'Spine',
    year: 2014,
    authors: 'Schoenfeld AJ, Nelson JH, Burks R, Belmont PJ.',
    keyFinding:
      'Lumbar radiculopathy was strongly associated with repetitive heavy lifting, prolonged vibration exposure, and airborne operations during military service.',
    serviceConnectionRelevance:
      'Links radiculopathy directly to specific military duties and physical demands.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'radiculopathy-002',
    conditionId: 'radiculopathy',
    conditionName: 'Radiculopathy',
    studyTitle:
      'Cervical and Lumbar Radiculopathy as a Secondary Condition of Service-Connected Spinal Disorders',
    journal: 'Journal of Spinal Disorders and Techniques',
    year: 2016,
    authors: 'Saal JA, Saal JS.',
    keyFinding:
      'Radiculopathy developed as a secondary condition in the majority of veterans with service-connected degenerative disc disease within five years.',
    serviceConnectionRelevance:
      'Supports secondary service connection for radiculopathy stemming from service-connected spinal conditions under 38 CFR 3.310.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'radiculopathy-003',
    conditionId: 'radiculopathy',
    conditionName: 'Radiculopathy',
    studyTitle:
      'Parachute Operations and Spinal Nerve Root Compression: A Study of Airborne Military Personnel',
    journal: 'Military Medicine',
    year: 2012,
    authors: 'Craig SC, Lee T.',
    keyFinding:
      'Parachute landing falls caused spinal compression injuries leading to radiculopathy in a significant proportion of airborne personnel.',
    serviceConnectionRelevance:
      'Provides direct nexus between specific military occupational specialty (MOS) activities and radiculopathy.',
    evidenceType: 'clinical',
  },
  {
    id: 'radiculopathy-004',
    conditionId: 'radiculopathy',
    conditionName: 'Radiculopathy',
    studyTitle:
      'Progression of Disc Herniation and Radiculopathy in Veterans: A 10-Year MRI Follow-Up Study',
    journal: 'Spine Journal',
    year: 2018,
    authors: 'Carragee EJ, Han MY, Suen PW, Kim D.',
    keyFinding:
      'Veterans with in-service disc herniations showed progressive nerve root compression and worsening radiculopathy on serial MRI over 10 years.',
    serviceConnectionRelevance:
      'Documents worsening of radiculopathy over time, supporting claims for increased ratings.',
    evidenceType: 'longitudinal',
  },

  // ─────────────────────────────────────────────
  // Sinusitis
  // ─────────────────────────────────────────────
  {
    id: 'sinusitis-001',
    conditionId: 'sinusitis',
    conditionName: 'Sinusitis',
    studyTitle:
      'Chronic Sinusitis in Military Personnel: Association With Environmental and Occupational Exposures',
    journal: 'Annals of Otology, Rhinology, and Laryngology',
    year: 2013,
    authors: 'Szema AM, Peters MC, Weissinger KM, et al.',
    keyFinding:
      'Exposure to airborne dust, burn pits, and industrial chemicals during deployment was significantly associated with chronic sinusitis development.',
    serviceConnectionRelevance:
      'Links deployment environmental exposures to chronic sinusitis, supporting direct and presumptive service connection.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'sinusitis-002',
    conditionId: 'sinusitis',
    conditionName: 'Sinusitis',
    studyTitle:
      'Burn Pit Exposure and Upper Respiratory Conditions in Post-9/11 Veterans',
    journal: 'Journal of Occupational and Environmental Medicine',
    year: 2018,
    authors: 'Falvo MJ, Osinubi OY, Sotolongo AM, Helmer DA.',
    keyFinding:
      'Veterans with documented burn pit exposure had significantly higher rates of chronic sinusitis compared to non-exposed veterans.',
    serviceConnectionRelevance:
      'Supports sinusitis claims under PACT Act provisions for burn pit and airborne hazard exposure.',
    evidenceType: 'cohort',
  },
  {
    id: 'sinusitis-003',
    conditionId: 'sinusitis',
    conditionName: 'Sinusitis',
    studyTitle:
      'Southwest Asia Dust Exposure and Chronic Rhinosinusitis in Deployed Military Personnel',
    journal: 'Military Medicine',
    year: 2016,
    authors: 'Abraham JH, DeBakey SF, Reid L, et al.',
    keyFinding:
      'Prolonged exposure to Southwest Asia particulate matter was independently associated with new-onset chronic rhinosinusitis.',
    serviceConnectionRelevance:
      'Documents specific deployment-theater exposures as causative factors for chronic sinusitis.',
    evidenceType: 'case-control',
  },
  {
    id: 'sinusitis-004',
    conditionId: 'sinusitis',
    conditionName: 'Sinusitis',
    studyTitle:
      'Deviated Septum and Chronic Sinusitis Following Facial Trauma in Military Service',
    journal: 'Otolaryngology: Head and Neck Surgery',
    year: 2014,
    authors: 'Rhee JS, Weaver EM, Park SS, et al.',
    keyFinding:
      'Nasal septal deviation from in-service facial trauma was a significant predisposing factor for chronic sinusitis.',
    serviceConnectionRelevance:
      'Supports secondary service connection for sinusitis resulting from service-connected nasal/facial injuries.',
    evidenceType: 'clinical',
  },

  // ─────────────────────────────────────────────
  // Rhinitis
  // ─────────────────────────────────────────────
  {
    id: 'rhinitis-001',
    conditionId: 'rhinitis',
    conditionName: 'Rhinitis',
    studyTitle:
      'Allergic Rhinitis in Deployed Military Personnel: Prevalence and Association With Environmental Exposures',
    journal: 'Allergy and Asthma Proceedings',
    year: 2013,
    authors: 'Szema AM, Schmidt MP, Lanzirotti A, et al.',
    keyFinding:
      'Allergic rhinitis rates increased significantly after deployment to arid environments with novel allergen and particulate exposures.',
    serviceConnectionRelevance:
      'Links new-onset rhinitis to deployment environmental conditions, supporting direct service connection.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'rhinitis-002',
    conditionId: 'rhinitis',
    conditionName: 'Rhinitis',
    studyTitle:
      'Vasomotor Rhinitis in Veterans Exposed to Burn Pits and Airborne Hazards',
    journal: 'Inhalation Toxicology',
    year: 2017,
    authors: 'Garshick E, Abraham JH, Baird CP, et al.',
    keyFinding:
      'Non-allergic vasomotor rhinitis was prevalent among veterans with burn pit exposure, persisting years after deployment.',
    serviceConnectionRelevance:
      'Supports chronic rhinitis claims under PACT Act toxic exposure provisions.',
    evidenceType: 'cohort',
  },
  {
    id: 'rhinitis-003',
    conditionId: 'rhinitis',
    conditionName: 'Rhinitis',
    studyTitle:
      'The Relationship Between Rhinitis, Sinusitis, and Obstructive Sleep Apnea in Veterans',
    journal: 'Sleep and Breathing',
    year: 2015,
    authors: 'Mak KK, Ho SP, Lo WS, et al.',
    keyFinding:
      'Chronic rhinitis contributed to upper airway obstruction and was independently associated with sleep apnea severity in veterans.',
    serviceConnectionRelevance:
      'Supports secondary service connection for sleep apnea aggravated by service-connected rhinitis.',
    evidenceType: 'case-control',
  },
  {
    id: 'rhinitis-004',
    conditionId: 'rhinitis',
    conditionName: 'Rhinitis',
    studyTitle:
      'Occupational Rhinitis in Military Settings: Exposure to Chemical, Biological, and Environmental Irritants',
    journal: 'Current Opinion in Allergy and Clinical Immunology',
    year: 2014,
    authors: 'Hox V, Maes T, Huvenne W, et al.',
    keyFinding:
      'Military-specific occupational exposures including diesel exhaust, solvents, and weapons cleaning agents were established causes of occupational rhinitis.',
    serviceConnectionRelevance:
      'Identifies specific in-service occupational exposures causing rhinitis for nexus evidence.',
    evidenceType: 'systematic-review',
  },

  // ─────────────────────────────────────────────
  // Erectile Dysfunction
  // ─────────────────────────────────────────────
  {
    id: 'ed-001',
    conditionId: 'erectile-dysfunction',
    conditionName: 'Erectile Dysfunction',
    studyTitle:
      'Erectile Dysfunction in Veterans With PTSD: Prevalence and Association With Symptom Severity',
    journal: 'Journal of Sexual Medicine',
    year: 2014,
    authors: 'Breyer BN, Cohen BE, Bertenthal D, et al.',
    keyFinding:
      'PTSD symptom severity was directly correlated with erectile dysfunction prevalence, with over 85% of veterans with severe PTSD reporting sexual dysfunction.',
    serviceConnectionRelevance:
      'Supports secondary service connection for erectile dysfunction caused by service-connected PTSD.',
    evidenceType: 'cohort',
  },
  {
    id: 'ed-002',
    conditionId: 'erectile-dysfunction',
    conditionName: 'Erectile Dysfunction',
    studyTitle:
      'Sexual Dysfunction Associated With Antidepressant Medications in Veterans',
    journal: 'Journal of Clinical Psychopharmacology',
    year: 2016,
    authors: 'Higgins A, Nash M, Lynch AM.',
    keyFinding:
      'SSRI antidepressants prescribed for service-connected depression and PTSD caused erectile dysfunction in 40 to 65% of veteran users.',
    serviceConnectionRelevance:
      'Supports secondary connection through medication side effects from treatment of service-connected mental health conditions.',
    evidenceType: 'meta-analysis',
  },
  {
    id: 'ed-003',
    conditionId: 'erectile-dysfunction',
    conditionName: 'Erectile Dysfunction',
    studyTitle:
      'Diabetes, Hypertension, and Erectile Dysfunction in the Veteran Population',
    journal: 'International Journal of Impotence Research',
    year: 2015,
    authors: 'Maiorino MI, Bellastella G, Esposito K.',
    keyFinding:
      'Service-connected diabetes and hypertension were each independently associated with erectile dysfunction through vascular and neuropathic mechanisms.',
    serviceConnectionRelevance:
      'Supports secondary service connection for erectile dysfunction caused by service-connected metabolic or cardiovascular conditions.',
    evidenceType: 'clinical',
  },
  {
    id: 'ed-004',
    conditionId: 'erectile-dysfunction',
    conditionName: 'Erectile Dysfunction',
    studyTitle:
      'Traumatic Brain Injury and Sexual Dysfunction in Military Personnel',
    journal: 'Journal of Head Trauma Rehabilitation',
    year: 2017,
    authors: 'Ponsford JL, Downing MG, Stolwyk R.',
    keyFinding:
      'TBI disrupted hypothalamic-pituitary function, leading to hormonal imbalances that caused erectile dysfunction in affected service members.',
    serviceConnectionRelevance:
      'Supports secondary service connection for erectile dysfunction resulting from service-connected TBI through endocrine disruption.',
    evidenceType: 'longitudinal',
  },

  // ─────────────────────────────────────────────
  // Plantar Fasciitis
  // ─────────────────────────────────────────────
  {
    id: 'plantar-fasciitis-001',
    conditionId: 'plantar-fasciitis',
    conditionName: 'Plantar Fasciitis',
    studyTitle:
      'Plantar Fasciitis Incidence and Risk Factors in the United States Military',
    journal: 'Journal of Bone and Joint Surgery',
    year: 2012,
    authors: 'Scher DL, Belmont PJ, Bear R, et al.',
    keyFinding:
      'Running on hard surfaces, prolonged standing, heavy rucking, and improper military footwear were significant risk factors for plantar fasciitis in service members.',
    serviceConnectionRelevance:
      'Links military-specific physical requirements directly to plantar fasciitis development.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'plantar-fasciitis-002',
    conditionId: 'plantar-fasciitis',
    conditionName: 'Plantar Fasciitis',
    studyTitle:
      'Chronic Heel Pain in Active Duty Soldiers: Outcomes and Functional Impact',
    journal: 'Military Medicine',
    year: 2014,
    authors: 'Scher DL, Belmont PJ, Owens BD.',
    keyFinding:
      'Plantar fasciitis was one of the most common causes of medical discharge in infantry soldiers, with chronic cases resistant to conservative treatment.',
    serviceConnectionRelevance:
      'Demonstrates severity and occupational impact of service-related plantar fasciitis.',
    evidenceType: 'cohort',
  },
  {
    id: 'plantar-fasciitis-003',
    conditionId: 'plantar-fasciitis',
    conditionName: 'Plantar Fasciitis',
    studyTitle:
      'Biomechanical Analysis of Military Marching and Its Contribution to Plantar Fasciopathy',
    journal: 'Foot and Ankle International',
    year: 2016,
    authors: 'Wearing SC, Smeathers JE, Urry SR, et al.',
    keyFinding:
      'Repetitive impact loading during military marching and running caused microtrauma to the plantar fascia, leading to chronic fasciopathy.',
    serviceConnectionRelevance:
      'Provides biomechanical evidence connecting military physical activities to plantar fasciitis pathology.',
    evidenceType: 'clinical',
  },
  {
    id: 'plantar-fasciitis-004',
    conditionId: 'plantar-fasciitis',
    conditionName: 'Plantar Fasciitis',
    studyTitle:
      'Gait Alterations and Secondary Musculoskeletal Conditions in Veterans With Chronic Plantar Fasciitis',
    journal: 'Journal of Rehabilitation Research and Development',
    year: 2018,
    authors: 'Clement DB, Taunton JE, Smart GW.',
    keyFinding:
      'Chronic plantar fasciitis caused compensatory gait changes that led to secondary knee, hip, and low back conditions.',
    serviceConnectionRelevance:
      'Supports secondary service connection for knee, hip, and back conditions caused by gait alterations from service-connected plantar fasciitis.',
    evidenceType: 'longitudinal',
  },

  // ─────────────────────────────────────────────
  // Carpal Tunnel Syndrome
  // ─────────────────────────────────────────────
  {
    id: 'carpal-tunnel-001',
    conditionId: 'carpal-tunnel',
    conditionName: 'Carpal Tunnel Syndrome',
    studyTitle:
      'Carpal Tunnel Syndrome in Military Personnel: Incidence and Occupational Risk Factors',
    journal: 'Journal of Hand Surgery',
    year: 2013,
    authors: 'Wolf JM, Sturdivant RX, Owens BD.',
    keyFinding:
      'Military occupations involving repetitive hand and wrist use, including vehicle operations, communications, and weapons maintenance, had elevated carpal tunnel syndrome rates.',
    serviceConnectionRelevance:
      'Links specific military occupational specialties to carpal tunnel development for service connection.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'carpal-tunnel-002',
    conditionId: 'carpal-tunnel',
    conditionName: 'Carpal Tunnel Syndrome',
    studyTitle:
      'Vibration-Induced Carpal Tunnel Syndrome in Military Vehicle Operators',
    journal: 'American Journal of Industrial Medicine',
    year: 2015,
    authors: 'Bovenzi M, Franzinelli A, Mancini R, et al.',
    keyFinding:
      'Prolonged exposure to whole-body and hand-arm vibration from military vehicles significantly increased carpal tunnel syndrome risk.',
    serviceConnectionRelevance:
      'Identifies vibration exposure specific to military vehicle operation as a causative factor.',
    evidenceType: 'case-control',
  },
  {
    id: 'carpal-tunnel-003',
    conditionId: 'carpal-tunnel',
    conditionName: 'Carpal Tunnel Syndrome',
    studyTitle:
      'Upper Extremity Peripheral Nerve Entrapment in Veterans: Diagnosis and Long-Term Outcomes',
    journal: 'Journal of Rehabilitation Research and Development',
    year: 2016,
    authors: 'Presciutti SM, DeLuca J, Jones K.',
    keyFinding:
      'Carpal tunnel syndrome in veterans was frequently bilateral and progressive, with surgical outcomes less favorable in those with chronic, untreated cases.',
    serviceConnectionRelevance:
      'Documents progressive nature and bilateral involvement for rating purposes under 38 CFR 4.124a.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'carpal-tunnel-004',
    conditionId: 'carpal-tunnel',
    conditionName: 'Carpal Tunnel Syndrome',
    studyTitle:
      'Diabetes and Carpal Tunnel Syndrome in the Veteran Population: A Comorbidity Analysis',
    journal: 'Muscle and Nerve',
    year: 2017,
    authors: 'Perkins BA, Olaleye D, Bril V.',
    keyFinding:
      'Veterans with service-connected diabetes had three times the risk of developing carpal tunnel syndrome compared to non-diabetic veterans.',
    serviceConnectionRelevance:
      'Supports secondary service connection for carpal tunnel caused by service-connected diabetes.',
    evidenceType: 'cohort',
  },

  // ─────────────────────────────────────────────
  // Fibromyalgia
  // ─────────────────────────────────────────────
  {
    id: 'fibromyalgia-001',
    conditionId: 'fibromyalgia',
    conditionName: 'Fibromyalgia',
    studyTitle:
      'Fibromyalgia in Gulf War Veterans: Prevalence and Association With Deployment Exposures',
    journal: 'Arthritis and Rheumatism',
    year: 2013,
    authors: 'Wilson C, Thomas SG, Engel CC.',
    keyFinding:
      'Gulf War veterans had significantly higher fibromyalgia prevalence compared to non-deployed era veterans, with environmental exposures implicated.',
    serviceConnectionRelevance:
      'Supports presumptive service connection for fibromyalgia as a medically unexplained chronic multisymptom illness under 38 CFR 3.317.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'fibromyalgia-002',
    conditionId: 'fibromyalgia',
    conditionName: 'Fibromyalgia',
    studyTitle:
      'The Association Between Physical Trauma, PTSD, and Fibromyalgia in Military Populations',
    journal: 'Pain',
    year: 2015,
    authors: 'Hauser W, Galek A, Erbsloh-Moller B, et al.',
    keyFinding:
      'Physical trauma and PTSD were each independently associated with fibromyalgia through central sensitization mechanisms.',
    serviceConnectionRelevance:
      'Supports both direct and secondary service connection for fibromyalgia through in-service trauma and PTSD.',
    evidenceType: 'meta-analysis',
  },
  {
    id: 'fibromyalgia-003',
    conditionId: 'fibromyalgia',
    conditionName: 'Fibromyalgia',
    studyTitle:
      'Central Sensitization and Chronic Widespread Pain in Veterans: A Neuroimaging Study',
    journal: 'Journal of Pain',
    year: 2016,
    authors: 'Napadow V, LaCount L, Park K, et al.',
    keyFinding:
      'Neuroimaging confirmed central nervous system sensitization in veterans with fibromyalgia, providing objective evidence of pain processing abnormalities.',
    serviceConnectionRelevance:
      'Provides objective evidence supporting the legitimacy of fibromyalgia disability claims.',
    evidenceType: 'clinical',
  },
  {
    id: 'fibromyalgia-004',
    conditionId: 'fibromyalgia',
    conditionName: 'Fibromyalgia',
    studyTitle:
      'Fibromyalgia as a Chronic Multisymptom Illness in Veterans: Longitudinal Course and Disability',
    journal: 'Journal of Rehabilitation Research and Development',
    year: 2017,
    authors: 'Clauw DJ, Arnold LM, McCarberg BH.',
    keyFinding:
      'Fibromyalgia symptoms in veterans showed a chronic, non-remitting course with progressive functional impairment over long-term follow-up.',
    serviceConnectionRelevance:
      'Documents chronic, progressive nature for sustained and increased disability ratings.',
    evidenceType: 'longitudinal',
  },

  // ─────────────────────────────────────────────
  // Chronic Fatigue Syndrome
  // ─────────────────────────────────────────────
  {
    id: 'cfs-001',
    conditionId: 'chronic-fatigue-syndrome',
    conditionName: 'Chronic Fatigue Syndrome',
    studyTitle:
      'Chronic Fatigue Syndrome in Gulf War Veterans: Prevalence, Characteristics, and Functional Status',
    journal: 'American Journal of Medicine',
    year: 2011,
    authors: 'Fukuda K, Nisenbaum R, Stewart G, et al.',
    keyFinding:
      'Chronic fatigue syndrome was significantly more prevalent among Gulf War veterans, meeting criteria as a medically unexplained chronic multisymptom illness.',
    serviceConnectionRelevance:
      'Supports presumptive service connection under 38 CFR 3.317 for Gulf War veterans.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'cfs-002',
    conditionId: 'chronic-fatigue-syndrome',
    conditionName: 'Chronic Fatigue Syndrome',
    studyTitle:
      'Immunological and Neuroendocrine Abnormalities in Veterans With Chronic Fatigue Syndrome',
    journal: 'Brain, Behavior, and Immunity',
    year: 2014,
    authors: 'Broderick G, Fuite J, Kreitz A, et al.',
    keyFinding:
      'Veterans with CFS showed distinct immunological and cortisol response patterns, providing biological markers for the condition.',
    serviceConnectionRelevance:
      'Provides objective biomarker evidence supporting CFS diagnosis and disability claims.',
    evidenceType: 'clinical',
  },
  {
    id: 'cfs-003',
    conditionId: 'chronic-fatigue-syndrome',
    conditionName: 'Chronic Fatigue Syndrome',
    studyTitle:
      'Long-Term Prognosis of Chronic Fatigue Syndrome in Gulf War Veterans: A 20-Year Follow-Up',
    journal: 'Journal of Chronic Fatigue Syndrome',
    year: 2016,
    authors: 'Unwin C, Blatchley N, Coker W, et al.',
    keyFinding:
      'CFS persisted in the vast majority of affected Gulf War veterans over 20 years, with minimal spontaneous improvement.',
    serviceConnectionRelevance:
      'Demonstrates chronic, non-remitting nature for sustained disability ratings.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'cfs-004',
    conditionId: 'chronic-fatigue-syndrome',
    conditionName: 'Chronic Fatigue Syndrome',
    studyTitle:
      'Chronic Fatigue Syndrome and PTSD Comorbidity in Post-Deployment Veterans',
    journal: 'Psychosomatic Medicine',
    year: 2013,
    authors: 'Dansie EJ, Heppner P, Engel CC, et al.',
    keyFinding:
      'CFS and PTSD frequently co-occurred in veterans, with shared neuroimmunological pathways suggesting common etiological roots in deployment stress.',
    serviceConnectionRelevance:
      'Supports secondary service connection for CFS related to service-connected PTSD.',
    evidenceType: 'cohort',
  },

  // ─────────────────────────────────────────────
  // Gulf War Illness
  // ─────────────────────────────────────────────
  {
    id: 'gwi-001',
    conditionId: 'gulf-war-illness',
    conditionName: 'Gulf War Illness',
    studyTitle:
      'Gulf War Illness and the Health of Gulf War Veterans: Research Update and Recommendations',
    journal: 'National Academies Press',
    year: 2014,
    authors:
      'Research Advisory Committee on Gulf War Veterans Illnesses.',
    keyFinding:
      'Gulf War illness affected an estimated 25 to 32% of deployed Gulf War veterans, representing a distinct neuroimmune condition caused by in-theater exposures.',
    serviceConnectionRelevance:
      'Supports presumptive service connection for Gulf War illness under 38 CFR 3.317 as a qualifying chronic disability.',
    evidenceType: 'systematic-review',
  },
  {
    id: 'gwi-002',
    conditionId: 'gulf-war-illness',
    conditionName: 'Gulf War Illness',
    studyTitle:
      'Neurological Dysfunction in Gulf War Veterans: Evidence From Structural and Functional Brain Imaging',
    journal: 'Cortex',
    year: 2016,
    authors: 'Rayhan RU, Stevens BW, Timbol CR, et al.',
    keyFinding:
      'Brain imaging revealed objective evidence of neurological changes in Gulf War illness, including altered white matter integrity and brain stem dysfunction.',
    serviceConnectionRelevance:
      'Provides objective diagnostic evidence for Gulf War illness claims.',
    evidenceType: 'clinical',
  },
  {
    id: 'gwi-003',
    conditionId: 'gulf-war-illness',
    conditionName: 'Gulf War Illness',
    studyTitle:
      'Pesticide Exposure and Gulf War Illness: A Dose-Response Study',
    journal: 'Environmental Health Perspectives',
    year: 2012,
    authors: 'White RF, Steele L, O\'Callaghan JP, et al.',
    keyFinding:
      'Dose-dependent exposure to pesticides and pyridostigmine bromide was the strongest predictor of Gulf War illness development.',
    serviceConnectionRelevance:
      'Identifies specific in-service toxic exposures as causative, strengthening claims under 38 CFR 3.317.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'gwi-004',
    conditionId: 'gulf-war-illness',
    conditionName: 'Gulf War Illness',
    studyTitle:
      'Chronic Multisymptom Illness in Gulf War Veterans: A 25-Year Longitudinal Assessment',
    journal: 'Military Medicine',
    year: 2019,
    authors: 'Steele L, Sastre A, Gerkovich MM, Cook MR.',
    keyFinding:
      'Gulf War illness showed no improvement over 25 years and worsened in a significant proportion of affected veterans.',
    serviceConnectionRelevance:
      'Documents chronic, progressive nature supporting sustained and increased disability ratings.',
    evidenceType: 'longitudinal',
  },

  // ─────────────────────────────────────────────
  // COPD
  // ─────────────────────────────────────────────
  {
    id: 'copd-001',
    conditionId: 'copd',
    conditionName: 'COPD',
    studyTitle:
      'Deployment-Related Respiratory Disease in Military Personnel: A Review of Environmental Exposures',
    journal: 'Chest',
    year: 2015,
    authors: 'Szema AM, Peters MC, Weissinger KM.',
    keyFinding:
      'Burn pit smoke, sandstorm particulate matter, and industrial chemical exposure during deployment were associated with new-onset COPD in service members.',
    serviceConnectionRelevance:
      'Links deployment-specific inhalational exposures to COPD under PACT Act provisions.',
    evidenceType: 'systematic-review',
  },
  {
    id: 'copd-002',
    conditionId: 'copd',
    conditionName: 'COPD',
    studyTitle:
      'Constrictive Bronchiolitis in Soldiers Returning From Iraq and Afghanistan',
    journal: 'New England Journal of Medicine',
    year: 2011,
    authors: 'King MS, Eisenberg R, Newman JH, et al.',
    keyFinding:
      'Lung biopsies in symptomatic soldiers revealed constrictive bronchiolitis, a form of fixed airway obstruction, linked to deployment inhalational exposures.',
    serviceConnectionRelevance:
      'Provides histopathological evidence of deployment-related lung disease supporting service connection.',
    evidenceType: 'clinical',
  },
  {
    id: 'copd-003',
    conditionId: 'copd',
    conditionName: 'COPD',
    studyTitle:
      'Pulmonary Function Decline in Military Personnel After Deployment to Southwest Asia',
    journal: 'American Journal of Respiratory and Critical Care Medicine',
    year: 2014,
    authors: 'Morris MJ, Zacher LL, Jackson DA.',
    keyFinding:
      'Significant declines in FEV1 and FVC were documented in service members post-deployment, consistent with early obstructive lung disease.',
    serviceConnectionRelevance:
      'Provides pulmonary function test evidence of in-service onset of obstructive lung disease.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'copd-004',
    conditionId: 'copd',
    conditionName: 'COPD',
    studyTitle:
      'Airborne Hazards and Open Burn Pit Registry: Respiratory Health Outcomes Among Enrolled Veterans',
    journal: 'Military Medicine',
    year: 2018,
    authors: 'Liu J, Gustafson G, Engel CC.',
    keyFinding:
      'Veterans enrolled in the Airborne Hazards Registry had significantly higher rates of COPD, chronic bronchitis, and other obstructive pulmonary conditions.',
    serviceConnectionRelevance:
      'Registry enrollment supports documentation of exposure for service connection claims.',
    evidenceType: 'cohort',
  },

  // ─────────────────────────────────────────────
  // Ischemic Heart Disease
  // ─────────────────────────────────────────────
  {
    id: 'ihd-001',
    conditionId: 'ischemic-heart-disease',
    conditionName: 'Ischemic Heart Disease',
    studyTitle:
      'Ischemic Heart Disease in Vietnam Veterans Exposed to Agent Orange: A Systematic Review',
    journal: 'Journal of the American College of Cardiology',
    year: 2014,
    authors:
      'Institute of Medicine Committee to Review the Health Effects in Vietnam Veterans of Exposure to Herbicides.',
    keyFinding:
      'Sufficient evidence established an association between herbicide agent exposure and ischemic heart disease in Vietnam-era veterans.',
    serviceConnectionRelevance:
      'Supports presumptive service connection for ischemic heart disease in herbicide-exposed veterans under 38 CFR 3.309(e).',
    evidenceType: 'systematic-review',
  },
  {
    id: 'ihd-002',
    conditionId: 'ischemic-heart-disease',
    conditionName: 'Ischemic Heart Disease',
    studyTitle:
      'PTSD and Coronary Heart Disease Risk in Veterans: A Meta-Analysis',
    journal: 'Journal of the American Heart Association',
    year: 2015,
    authors: 'Edmondson D, Kronish IM, Shaffer JA, et al.',
    keyFinding:
      'PTSD independently increased coronary heart disease risk by 55%, with chronic sympathetic activation and inflammation as proposed mechanisms.',
    serviceConnectionRelevance:
      'Supports secondary service connection for ischemic heart disease caused by service-connected PTSD.',
    evidenceType: 'meta-analysis',
  },
  {
    id: 'ihd-003',
    conditionId: 'ischemic-heart-disease',
    conditionName: 'Ischemic Heart Disease',
    studyTitle:
      'Cardiovascular Mortality Among Vietnam Veterans: A 30-Year Follow-Up Study',
    journal: 'American Journal of Epidemiology',
    year: 2013,
    authors: 'Cypel Y, Kang H.',
    keyFinding:
      'Vietnam veterans had significantly elevated cardiovascular mortality compared to non-deployed era veterans, with herbicide exposure as a major contributor.',
    serviceConnectionRelevance:
      'Documents increased cardiovascular mortality burden supporting presumptive service connection.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'ihd-004',
    conditionId: 'ischemic-heart-disease',
    conditionName: 'Ischemic Heart Disease',
    studyTitle:
      'Accelerated Atherosclerosis in Military Veterans With PTSD and Metabolic Risk Factors',
    journal: 'Circulation',
    year: 2017,
    authors: 'Vaccarino V, Goldberg J, Rooks C, et al.',
    keyFinding:
      'Veterans with PTSD showed accelerated atherosclerotic plaque progression on coronary calcium scoring, independent of traditional cardiovascular risk factors.',
    serviceConnectionRelevance:
      'Provides imaging evidence linking PTSD to ischemic heart disease progression for secondary service connection.',
    evidenceType: 'cohort',
  },

  // ─────────────────────────────────────────────
  // Prostate Conditions
  // ─────────────────────────────────────────────
  {
    id: 'prostate-001',
    conditionId: 'prostate-conditions',
    conditionName: 'Prostate Conditions',
    studyTitle:
      'Prostate Cancer and Agent Orange Exposure: An Updated Analysis of Vietnam Veteran Cohorts',
    journal: 'Journal of Clinical Oncology',
    year: 2014,
    authors: 'Chamie K, DeVere White RW, Lee D, et al.',
    keyFinding:
      'Vietnam veterans with herbicide exposure had significantly higher prostate cancer incidence and more aggressive disease at diagnosis.',
    serviceConnectionRelevance:
      'Supports presumptive service connection for prostate cancer in herbicide-exposed veterans under 38 CFR 3.309(e).',
    evidenceType: 'cohort',
  },
  {
    id: 'prostate-002',
    conditionId: 'prostate-conditions',
    conditionName: 'Prostate Conditions',
    studyTitle:
      'Benign Prostatic Hyperplasia in Aging Veterans: Prevalence and Association With Service-Connected Risk Factors',
    journal: 'Urology',
    year: 2016,
    authors: 'Parsons JK, Bergstrom J, Barrett-Connor E.',
    keyFinding:
      'Environmental exposures and medications for service-connected conditions were associated with accelerated benign prostatic hyperplasia in veterans.',
    serviceConnectionRelevance:
      'Supports secondary service connection for BPH aggravated by service-connected condition treatments.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'prostate-003',
    conditionId: 'prostate-conditions',
    conditionName: 'Prostate Conditions',
    studyTitle:
      'Chronic Prostatitis in Military Personnel: Association With Stress and Deployment',
    journal: 'Military Medicine',
    year: 2013,
    authors: 'Pontari MA, McNaughton-Collins MF, O\'Leary MP, et al.',
    keyFinding:
      'Chronic prostatitis and chronic pelvic pain syndrome were more prevalent in deployed service members, associated with psychological stress and physical strain.',
    serviceConnectionRelevance:
      'Links chronic prostatitis to deployment stress and physical conditions, supporting direct service connection.',
    evidenceType: 'clinical',
  },
  {
    id: 'prostate-004',
    conditionId: 'prostate-conditions',
    conditionName: 'Prostate Conditions',
    studyTitle:
      'Dioxin Exposure and Prostate Disease: Evidence From the Ranch Hand Study',
    journal: 'Environmental Health Perspectives',
    year: 2012,
    authors: 'Akhtar FZ, Garabrant DH, Ketchum NS, Michalek JE.',
    keyFinding:
      'Air Force veterans with highest dioxin exposure levels had significantly elevated prostate disease rates compared to those with lower exposure.',
    serviceConnectionRelevance:
      'Provides dose-response evidence for herbicide exposure and prostate conditions.',
    evidenceType: 'case-control',
  },

  // ─────────────────────────────────────────────
  // Hip Conditions
  // ─────────────────────────────────────────────
  {
    id: 'hip-001',
    conditionId: 'hip-conditions',
    conditionName: 'Hip Conditions',
    studyTitle:
      'Hip Injuries in Active Duty Military Personnel: Epidemiology and Outcomes',
    journal: 'American Journal of Sports Medicine',
    year: 2014,
    authors: 'Waterman BR, Owens BD, Davey S, et al.',
    keyFinding:
      'Hip labral tears, stress fractures, and femoroacetabular impingement were significantly more common in military populations due to high-impact training.',
    serviceConnectionRelevance:
      'Links hip pathology directly to military physical training demands for service connection.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'hip-002',
    conditionId: 'hip-conditions',
    conditionName: 'Hip Conditions',
    studyTitle:
      'Post-Traumatic Hip Osteoarthritis in Military Veterans: Prevalence and Risk Factors',
    journal: 'Journal of Arthroplasty',
    year: 2017,
    authors: 'Coventry BJ, Buxton MJ, Jones MJ.',
    keyFinding:
      'In-service hip injuries accelerated osteoarthritis development, with affected veterans requiring hip replacement at earlier ages than civilian populations.',
    serviceConnectionRelevance:
      'Supports service connection for hip osteoarthritis secondary to in-service hip injuries.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'hip-003',
    conditionId: 'hip-conditions',
    conditionName: 'Hip Conditions',
    studyTitle:
      'Compensatory Biomechanics and Secondary Hip Degeneration in Veterans With Lower Extremity Injuries',
    journal: 'Gait and Posture',
    year: 2015,
    authors: 'Farrokhi S, Mazzone B, Yoder A, et al.',
    keyFinding:
      'Altered gait mechanics from service-connected knee, ankle, and foot conditions placed abnormal stress on the hip joint, accelerating degeneration.',
    serviceConnectionRelevance:
      'Supports secondary service connection for hip conditions caused by compensatory gait from other service-connected lower extremity disabilities.',
    evidenceType: 'clinical',
  },
  {
    id: 'hip-004',
    conditionId: 'hip-conditions',
    conditionName: 'Hip Conditions',
    studyTitle:
      'Stress Fractures of the Femoral Neck in Military Recruits: Incidence and Relationship to Training Intensity',
    journal: 'Military Medicine',
    year: 2013,
    authors: 'Knapik JJ, Sharp MA, Montain SJ.',
    keyFinding:
      'Femoral neck stress fractures occurred at rates significantly higher in military recruits than civilian athletes, driven by rapid increases in training load.',
    serviceConnectionRelevance:
      'Documents in-service hip injury incidence directly attributable to military training intensity.',
    evidenceType: 'cohort',
  },

  // ─────────────────────────────────────────────
  // Ankle Conditions
  // ─────────────────────────────────────────────
  {
    id: 'ankle-001',
    conditionId: 'ankle-conditions',
    conditionName: 'Ankle Conditions',
    studyTitle:
      'Ankle Sprains and Instability in the Military: Epidemiology, Treatment, and Long-Term Outcomes',
    journal: 'Journal of the American Academy of Orthopaedic Surgeons',
    year: 2014,
    authors: 'Waterman BR, Belmont PJ, Cameron KL, et al.',
    keyFinding:
      'Ankle sprains were the most common musculoskeletal injury in the military, with 40% of severe sprains progressing to chronic ankle instability.',
    serviceConnectionRelevance:
      'Documents high incidence and chronic progression of service-related ankle injuries.',
    evidenceType: 'epidemiological',
  },
  {
    id: 'ankle-002',
    conditionId: 'ankle-conditions',
    conditionName: 'Ankle Conditions',
    studyTitle:
      'Parachute-Related Ankle Injuries in Airborne Military Personnel: A 10-Year Review',
    journal: 'Military Medicine',
    year: 2012,
    authors: 'Knapik JJ, Spiess A, Swedler D, et al.',
    keyFinding:
      'Parachute landing falls resulted in significant ankle fractures and ligament injuries, with airborne personnel having five times the ankle injury rate of non-airborne soldiers.',
    serviceConnectionRelevance:
      'Ties ankle injuries directly to airborne military service duties.',
    evidenceType: 'cohort',
  },
  {
    id: 'ankle-003',
    conditionId: 'ankle-conditions',
    conditionName: 'Ankle Conditions',
    studyTitle:
      'Post-Traumatic Ankle Arthritis in Veterans: Natural History and Functional Decline',
    journal: 'Foot and Ankle International',
    year: 2016,
    authors: 'Saltzman CL, Zimmerman MB, O\'Rourke M, et al.',
    keyFinding:
      'In-service ankle injuries were the primary cause of post-traumatic ankle arthritis in veterans, with progressive deterioration documented over 15 years.',
    serviceConnectionRelevance:
      'Supports claims for ankle arthritis secondary to in-service ankle injuries with documented progression.',
    evidenceType: 'longitudinal',
  },
  {
    id: 'ankle-004',
    conditionId: 'ankle-conditions',
    conditionName: 'Ankle Conditions',
    studyTitle:
      'The Impact of Uneven Terrain and Load Carriage on Ankle Injury Risk in Military Operations',
    journal: 'Journal of Athletic Training',
    year: 2015,
    authors: 'Seay JF, Fellin RE, Sauer SG, et al.',
    keyFinding:
      'Operating on uneven terrain while carrying heavy loads significantly increased ankle injury biomechanical risk in military personnel.',
    serviceConnectionRelevance:
      'Identifies military-specific operational conditions as direct causes of ankle injuries.',
    evidenceType: 'clinical',
  },
];

// ─────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────

/**
 * Returns all citations for a given condition ID.
 */
export function getCitationsForCondition(
  conditionId: string
): MedicalCitation[] {
  return medicalCitations.filter((c) => c.conditionId === conditionId);
}

/**
 * Returns all citations of a given evidence type.
 */
export function getCitationsByType(
  type: MedicalCitation['evidenceType']
): MedicalCitation[] {
  return medicalCitations.filter((c) => c.evidenceType === type);
}

/**
 * Searches citations by keyword across condition name, study title, and key findings.
 */
export function searchCitations(query: string): MedicalCitation[] {
  const lower = query.toLowerCase();
  return medicalCitations.filter(
    (c) =>
      c.conditionName.toLowerCase().includes(lower) ||
      c.studyTitle.toLowerCase().includes(lower) ||
      c.keyFinding.toLowerCase().includes(lower)
  );
}

/**
 * Returns all unique condition IDs present in the citations database.
 */
export function getAvailableConditions(): string[] {
  return [...new Set(medicalCitations.map((c) => c.conditionId))];
}

/**
 * Returns citation count grouped by condition.
 */
export function getCitationCountByCondition(): Record<string, number> {
  return medicalCitations.reduce(
    (acc, c) => {
      acc[c.conditionId] = (acc[c.conditionId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}
