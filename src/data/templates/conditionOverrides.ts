/**
 * Condition-Specific Overrides
 * Top 100 most-claimed VA conditions with specific data
 * that supplements or replaces category template fields.
 */

export interface ConditionOverride {
  conditionId: string;
  conditionName: string;
  diagnosticCode: string;
  evidence?: {
    additionalRequired?: Array<{ type: 'required' | 'recommended' | 'strongly-recommended'; description: string; dbqForm?: string; source?: string }>;
    additionalRecommended?: Array<{ type: 'required' | 'recommended' | 'strongly-recommended'; description: string; dbqForm?: string; source?: string }>;
    additionalGaps?: string[];
    ratingLevelEvidence?: Array<{ ratingPercent: number; keyEvidence: string[] }>;
    additionalTips?: string[];
  };
  exam?: {
    examType?: string;
    dbqFormNumber?: string;
    additionalTests?: Array<{ name: string; purpose: string; whatExaminerDocuments: string; ratingImpact: string }>;
    additionalRomRanges?: Array<{ movement: string; normalRange: string; ratingThresholds: { percent: number; range: string }[] }>;
    additionalRedFlags?: string[];
    additionalPitfalls?: string[];
  };
  rating?: {
    ratingLevels?: Array<{ percent: number; criteria: string; keywords: string[] }>;
    examTips?: string[];
    commonMistakes?: string[];
  };
  literature?: {
    additionalCitations?: Array<{
      studyTitle: string;
      journal: string;
      year: number;
      authors?: string;
      keyFinding: string;
      serviceConnectionRelevance: string;
      evidenceType: 'epidemiological' | 'clinical' | 'meta-analysis' | 'longitudinal' | 'cohort' | 'case-control' | 'systematic-review';
    }>;
    nexusPattern?: string;
  };
}

export const conditionOverrides: ConditionOverride[] = [
  // ============================================================
  // MENTAL HEALTH (10 conditions)
  // ============================================================
  {
    conditionId: 'ptsd',
    conditionName: 'Post-Traumatic Stress Disorder',
    diagnosticCode: '9411',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Stressor statement describing in-service traumatic event(s) with dates, locations, and unit assignments per 38 CFR 3.304(f)', source: '38 CFR 3.304(f)' },
        { type: 'required', description: 'Current PTSD diagnosis conforming to DSM-5 criteria from a licensed mental health professional', dbqForm: '21-0960P-3', source: 'M21-1, III.iv.4.H.1' },
        { type: 'required', description: 'Nexus opinion linking current PTSD to verified or conceded in-service stressor' },
      ],
      additionalRecommended: [
        { type: 'strongly-recommended', description: 'Buddy statements from fellow service members corroborating the stressor event(s)' },
        { type: 'recommended', description: 'Service personnel records showing deployment to combat zones, receipt of combat awards, or MOS consistent with claimed stressor' },
      ],
      additionalGaps: [
        'Missing stressor verification: if non-combat, VA must attempt to verify through JSRRC or service records',
        'No current diagnosis: ensure diagnosis meets DSM-5 criteria, not just symptoms',
      ],
      ratingLevelEvidence: [
        { ratingPercent: 0, keyEvidence: ['Diagnosis exists but symptoms are not severe enough to interfere with occupational or social functioning, or symptoms controlled by medication'] },
        { ratingPercent: 10, keyEvidence: ['Mild or transient symptoms that decrease work efficiency only during periods of significant stress'] },
        { ratingPercent: 30, keyEvidence: ['Occasional decrease in work efficiency with intermittent periods of inability to perform tasks due to symptoms such as depressed mood, anxiety, chronic sleep impairment'] },
        { ratingPercent: 50, keyEvidence: ['Reduced reliability and productivity due to flattened affect, circumstantial speech, panic attacks more than once per week, difficulty understanding complex commands, impaired judgment or abstract thinking'] },
        { ratingPercent: 70, keyEvidence: ['Deficiencies in most areas (work, school, family, judgment, thinking, mood) with suicidal ideation, obsessional rituals, near-continuous panic or depression, impaired impulse control, spatial disorientation, neglect of personal hygiene'] },
        { ratingPercent: 100, keyEvidence: ['Total occupational and social impairment with gross impairment in thought processes, persistent danger of hurting self or others, inability to perform ADLs, disorientation, memory loss for close relatives or own name'] },
      ],
      additionalTips: [
        'Combat veterans: stressor is conceded if consistent with circumstances of service per 38 CFR 3.304(f)(2). No need for JSRRC verification.',
        'MST claims: under 38 CFR 3.304(f)(5), VA accepts markers such as behavioral changes, requests for transfer, STI testing, or performance decline as corroboration.',
        'Fear of hostile military or terrorist activity: per 38 CFR 3.304(f)(3), a VA or contract psychiatrist/psychologist can confirm the stressor is adequate.',
        'Document frequency and severity of symptoms such as nightmares, flashbacks, hypervigilance, and avoidance behaviors with specific examples.',
      ],
    },
    exam: {
      examType: 'PTSD Review (Initial or Increase)',
      dbqFormNumber: '21-0960P-3',
      additionalTests: [
        { name: 'PCL-5 (PTSD Checklist)', purpose: 'Standardized self-report measure of PTSD symptom severity', whatExaminerDocuments: 'Total score and individual cluster scores for intrusion, avoidance, cognition/mood changes, and arousal/reactivity', ratingImpact: 'Higher scores correlate with higher rating percentages; scores above 33 suggest probable PTSD diagnosis' },
        { name: 'CAPS-5 (Clinician-Administered PTSD Scale)', purpose: 'Gold standard structured interview for PTSD diagnosis and severity', whatExaminerDocuments: 'Total severity score, individual symptom ratings, and determination of whether DSM-5 criteria are met', ratingImpact: 'Provides objective clinical measure that VA raters rely on heavily for determining symptom severity and functional impairment' },
      ],
      additionalRedFlags: [
        'Examiner fails to identify which DSM-5 criteria are met',
        'Examiner does not address occupational and social impairment level',
        'Stressor is listed as "unverified" despite combat service or qualifying MOS',
      ],
      additionalPitfalls: [
        'Examiner conflating PTSD with adjustment disorder or personality disorder',
        'Not documenting frequency of panic attacks, nightmares, or flashbacks',
        'Examiner failing to ask about MST when claimed or indicated by markers',
      ],
    },
    rating: {
      ratingLevels: [
        { percent: 0, criteria: 'Diagnosis confirmed but symptoms not severe enough to interfere with occupational or social functioning, or controlled by continuous medication', keywords: ['controlled', 'mild', 'medication managed'] },
        { percent: 10, criteria: 'Occupational and social impairment due to mild or transient symptoms which decrease work efficiency and ability to perform occupational tasks only during periods of significant stress, or symptoms controlled by continuous medication', keywords: ['transient', 'significant stress only', 'medication'] },
        { percent: 30, criteria: 'Occupational and social impairment with occasional decrease in work efficiency and intermittent periods of inability to perform occupational tasks due to such symptoms as depressed mood, anxiety, suspiciousness, panic attacks (weekly or less), chronic sleep impairment, mild memory loss', keywords: ['occasional decrease', 'depressed mood', 'anxiety', 'weekly panic', 'chronic sleep impairment'] },
        { percent: 50, criteria: 'Occupational and social impairment with reduced reliability and productivity due to symptoms such as flattened affect, circumstantial or stereotyped speech, panic attacks more than once a week, difficulty in understanding complex commands, impairment of short and long term memory, impaired judgment, impaired abstract thinking, disturbances of motivation and mood, difficulty in establishing and maintaining effective work and social relationships', keywords: ['reduced reliability', 'flattened affect', 'panic more than weekly', 'memory impairment', 'difficulty relationships'] },
        { percent: 70, criteria: 'Occupational and social impairment with deficiencies in most areas such as work, school, family relations, judgment, thinking, or mood due to symptoms such as suicidal ideation, obsessional rituals, illogical or obscure speech, near-continuous panic or depression affecting ability to function, impaired impulse control, spatial disorientation, neglect of personal appearance and hygiene, difficulty adapting to stressful circumstances, inability to establish and maintain effective relationships', keywords: ['deficiencies most areas', 'suicidal ideation', 'obsessional rituals', 'near-continuous panic', 'impaired impulse control', 'neglect hygiene'] },
        { percent: 100, criteria: 'Total occupational and social impairment due to such symptoms as gross impairment in thought processes or communication, persistent delusions or hallucinations, grossly inappropriate behavior, persistent danger of hurting self or others, intermittent inability to perform ADLs, disorientation to time or place, memory loss for names of close relatives or own occupation or name', keywords: ['total impairment', 'persistent delusions', 'danger to self/others', 'cannot perform ADLs', 'disorientation', 'memory loss names'] },
      ],
      examTips: [
        'Describe your worst days in detail, not your best days.',
        'Explain how PTSD impacts your ability to work, maintain relationships, and perform daily activities.',
        'Be specific about frequency: how many nightmares per week, how many panic attacks per month.',
        'Mention any hospitalizations, emergency room visits, or crisis line calls related to PTSD symptoms.',
      ],
      commonMistakes: [
        'Minimizing symptoms to the examiner out of pride or military culture.',
        'Not connecting symptoms to specific functional impairments at work or home.',
        'Failing to report suicidal ideation history when it has occurred.',
      ],
    },
    literature: {
      additionalCitations: [
        { studyTitle: 'Prevalence of PTSD Among Military Veterans', journal: 'JAMA Psychiatry', year: 2017, keyFinding: 'OEF/OIF veterans show PTSD prevalence rates between 13.5% and 30%, with combat exposure being the strongest predictor.', serviceConnectionRelevance: 'Supports service connection by demonstrating high prevalence directly linked to combat deployments.', evidenceType: 'epidemiological' },
        { studyTitle: 'Long-term Course of PTSD in Vietnam Veterans', journal: 'Journal of Clinical Psychology', year: 2014, keyFinding: 'PTSD symptoms persist for decades in many veterans and often worsen with aging as coping mechanisms diminish.', serviceConnectionRelevance: 'Supports claims filed years after separation by showing chronic, worsening trajectory.', evidenceType: 'longitudinal' },
        { studyTitle: 'Military Sexual Trauma and PTSD in Female Veterans', journal: 'Psychological Trauma: Theory, Research, Practice, and Policy', year: 2019, keyFinding: 'MST is a stronger predictor of PTSD than combat exposure in female veterans with prevalence rates exceeding 40% among those who experienced MST.', serviceConnectionRelevance: 'Supports MST-related PTSD claims by demonstrating causal link in military populations.', evidenceType: 'cohort' },
      ],
      nexusPattern: 'The veteran\'s current PTSD, diagnosed under DSM-5 criteria, is at least as likely as not caused by or related to the verified in-service stressor(s) experienced during [combat deployment/MST/fear of hostile activity] while serving in [unit/location].',
    },
  },
  {
    conditionId: 'depression',
    conditionName: 'Major Depressive Disorder',
    diagnosticCode: '9434',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Current diagnosis of Major Depressive Disorder per DSM-5 criteria from a qualified mental health professional', dbqForm: '21-0960P-2' },
        { type: 'required', description: 'Nexus opinion linking depression to in-service events, service-connected conditions, or military service generally' },
        { type: 'required', description: 'Documentation of symptom onset during or shortly after military service, or evidence of worsening due to service-connected conditions' },
      ],
      additionalRecommended: [
        { type: 'recommended', description: 'Treatment records showing medication management and therapy history' },
        { type: 'recommended', description: 'Employment records or statements showing functional impact on work performance' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 10, keyEvidence: ['Mild or transient symptoms decreasing work efficiency only during significant stress periods'] },
        { ratingPercent: 30, keyEvidence: ['Occasional decrease in work efficiency, depressed mood, chronic sleep impairment, mild memory loss'] },
        { ratingPercent: 50, keyEvidence: ['Reduced reliability and productivity, flattened affect, difficulty maintaining relationships, panic attacks more than weekly'] },
        { ratingPercent: 70, keyEvidence: ['Deficiencies in most areas, suicidal ideation, near-continuous depression affecting function, inability to maintain relationships'] },
        { ratingPercent: 100, keyEvidence: ['Total occupational and social impairment, persistent danger of hurting self, inability to perform ADLs'] },
      ],
      additionalTips: [
        'Depression is commonly claimed as secondary to chronic pain conditions, PTSD, or other service-connected disabilities.',
        'Document how depression affects your daily routine, motivation, concentration, and ability to maintain employment.',
        'If prescribed antidepressants during service or shortly after, obtain pharmacy records as evidence of onset.',
      ],
    },
    exam: {
      examType: 'Mental Disorders (other than PTSD)',
      dbqFormNumber: '21-0960P-2',
      additionalTests: [
        { name: 'PHQ-9 (Patient Health Questionnaire)', purpose: 'Standardized screening and severity measure for depression', whatExaminerDocuments: 'Total score indicating severity level: minimal (0-4), mild (5-9), moderate (10-14), moderately severe (15-19), severe (20-27)', ratingImpact: 'Higher PHQ-9 scores support higher disability ratings by documenting symptom severity objectively' },
      ],
      additionalPitfalls: [
        'Examiner attributing depression symptoms solely to non-service-connected life stressors',
        'Failure to consider aggravation theory when depression existed before service but worsened during service',
        'Not documenting functional impairment in occupational and social domains',
      ],
    },
    rating: {
      ratingLevels: [
        { percent: 0, criteria: 'Diagnosis present but symptoms not severe enough to interfere with functioning or controlled by medication', keywords: ['controlled', 'no impairment'] },
        { percent: 10, criteria: 'Mild or transient symptoms decreasing work efficiency only during significant stress', keywords: ['mild', 'transient', 'significant stress'] },
        { percent: 30, criteria: 'Occasional decrease in work efficiency, depressed mood, anxiety, chronic sleep impairment, mild memory loss', keywords: ['occasional decrease', 'depressed mood', 'sleep impairment'] },
        { percent: 50, criteria: 'Reduced reliability and productivity, flattened affect, panic attacks, difficulty with complex commands, impaired memory', keywords: ['reduced reliability', 'flattened affect', 'impaired memory'] },
        { percent: 70, criteria: 'Deficiencies in most areas, suicidal ideation, near-continuous depression, impaired impulse control, neglect of hygiene', keywords: ['deficiencies most areas', 'suicidal ideation', 'near-continuous'] },
        { percent: 100, criteria: 'Total occupational and social impairment, gross impairment in thought processes, persistent danger, disorientation', keywords: ['total impairment', 'persistent danger', 'disorientation'] },
      ],
      examTips: [
        'Be honest about your lowest moments, not just how you feel on better days.',
        'Describe how depression impacts specific tasks like cooking, cleaning, personal hygiene, and social interaction.',
      ],
      commonMistakes: [
        'Not mentioning suicidal ideation history when relevant.',
        'Understating symptoms because the veteran had a "good day" at the exam.',
      ],
    },
    literature: {
      additionalCitations: [
        { studyTitle: 'Depression in Military Veterans: Prevalence and Associated Factors', journal: 'Journal of Affective Disorders', year: 2016, keyFinding: 'Veterans are 2 to 5 times more likely to develop major depression compared to civilian populations, with combat exposure and physical injuries as primary risk factors.', serviceConnectionRelevance: 'Establishes that military service significantly increases depression risk, supporting direct service connection.', evidenceType: 'meta-analysis' },
      ],
      nexusPattern: 'The veteran\'s current Major Depressive Disorder is at least as likely as not caused by or proximately due to [in-service event/service-connected condition], as supported by the temporal relationship between service and symptom onset.',
    },
  },
  {
    conditionId: 'anxiety',
    conditionName: 'Generalized Anxiety Disorder',
    diagnosticCode: '9400',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Current diagnosis of Generalized Anxiety Disorder per DSM-5 from a licensed mental health provider', dbqForm: '21-0960P-2' },
        { type: 'required', description: 'Nexus linking anxiety to military service or a service-connected condition' },
        { type: 'strongly-recommended', description: 'Documentation of in-service treatment for anxiety symptoms or documented stressors during service' },
      ],
      additionalTips: [
        'GAD is rated under the General Rating Formula for Mental Disorders, same as PTSD and depression (38 CFR 4.130).',
        'If anxiety is secondary to a service-connected condition such as chronic pain or TBI, document the relationship clearly.',
        'Track panic attack frequency, as weekly or more frequent attacks support a 30% or higher rating.',
      ],
    },
    exam: {
      examType: 'Mental Disorders (other than PTSD)',
      dbqFormNumber: '21-0960P-2',
      additionalTests: [
        { name: 'GAD-7 (Generalized Anxiety Disorder Scale)', purpose: 'Standardized self-report measure of anxiety severity', whatExaminerDocuments: 'Score indicating minimal (0-4), mild (5-9), moderate (10-14), or severe (15-21) anxiety', ratingImpact: 'Objective severity measure that correlates with rating level under the General Rating Formula for Mental Disorders' },
      ],
      additionalPitfalls: [
        'Examiner may not differentiate GAD from situational or adjustment-related anxiety',
        'Failure to document the functional impact of excessive worry on daily activities and work',
      ],
    },
    rating: {
      ratingLevels: [
        { percent: 10, criteria: 'Mild or transient anxiety symptoms decreasing work efficiency only during significant stress', keywords: ['mild', 'transient', 'significant stress'] },
        { percent: 30, criteria: 'Occasional decrease in work efficiency with depressed mood, anxiety, suspiciousness, chronic sleep impairment', keywords: ['occasional decrease', 'suspiciousness', 'sleep impairment'] },
        { percent: 50, criteria: 'Reduced reliability and productivity with panic attacks more than weekly, difficulty in understanding complex commands, impaired judgment', keywords: ['reduced reliability', 'panic attacks', 'impaired judgment'] },
        { percent: 70, criteria: 'Deficiencies in most areas with near-continuous panic or depression, impaired impulse control, spatial disorientation', keywords: ['deficiencies', 'near-continuous panic', 'impaired impulse'] },
        { percent: 100, criteria: 'Total occupational and social impairment with grossly inappropriate behavior, persistent danger, inability to perform ADLs', keywords: ['total impairment', 'persistent danger', 'cannot ADLs'] },
      ],
      examTips: [
        'Describe how worry and anxiety consume your day: how many hours you spend in anxious thought.',
        'Explain avoidance behaviors, inability to relax, and physical symptoms like muscle tension or GI distress.',
      ],
      commonMistakes: [
        'Presenting as calm and composed during the exam, contradicting claimed severity.',
        'Not distinguishing GAD from other mental health conditions when filing.',
      ],
    },
  },
  {
    conditionId: 'bipolar-disorder',
    conditionName: 'Bipolar Disorder',
    diagnosticCode: '9432',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Current diagnosis of Bipolar Disorder (Type I or II) per DSM-5 criteria', dbqForm: '21-0960P-2' },
        { type: 'required', description: 'Documentation of manic, hypomanic, and depressive episodes with dates and duration' },
        { type: 'strongly-recommended', description: 'Medication history showing mood stabilizers or antipsychotics prescribed for bipolar symptoms' },
      ],
      additionalTips: [
        'Bipolar disorder is rated under the same General Rating Formula for Mental Disorders as PTSD and depression.',
        'Document the frequency and severity of both manic and depressive episodes separately.',
        'Hospitalization records for manic episodes are powerful evidence of severity.',
      ],
    },
    exam: {
      examType: 'Mental Disorders (other than PTSD)',
      dbqFormNumber: '21-0960P-2',
      additionalPitfalls: [
        'Examiner may observe a euthymic state during the exam and underrate severity',
        'Failure to document the impact of both manic and depressive phases on occupational functioning',
        'Examiner not asking about risky behaviors, spending sprees, or grandiosity during manic episodes',
      ],
    },
  },
  {
    conditionId: 'insomnia',
    conditionName: 'Insomnia',
    diagnosticCode: '9431',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Clinical diagnosis of chronic insomnia from a qualified provider' },
        { type: 'required', description: 'Sleep log or documentation showing persistent difficulty initiating or maintaining sleep for at least 3 months' },
        { type: 'strongly-recommended', description: 'Nexus opinion if claiming as secondary to PTSD, pain conditions, or medications' },
      ],
      additionalTips: [
        'Insomnia is often rated as part of a mental health condition (e.g., PTSD includes chronic sleep impairment). Consider whether a separate rating or inclusion in existing mental health rating is more beneficial.',
        'If rated separately under DC 9431, it uses the General Rating Formula for Mental Disorders.',
        'Document daytime impairment: fatigue, difficulty concentrating, irritability, impaired work performance.',
      ],
    },
    exam: {
      examType: 'Mental Disorders (other than PTSD)',
      dbqFormNumber: '21-0960P-2',
      additionalTests: [
        { name: 'Insomnia Severity Index (ISI)', purpose: 'Standardized measure of insomnia severity and functional impact', whatExaminerDocuments: 'Total score and severity classification: no insomnia (0-7), subthreshold (8-14), moderate (15-21), severe (22-28)', ratingImpact: 'Supports rating determination by providing objective severity data for the General Rating Formula' },
      ],
      additionalPitfalls: [
        'VA may consider insomnia a symptom rather than a separate disability, especially if already rated for PTSD or another mental health condition',
        'Pyramiding concerns: ensure insomnia is not being double-counted under 38 CFR 4.14',
      ],
    },
  },
  {
    conditionId: 'adjustment-disorder',
    conditionName: 'Adjustment Disorder',
    diagnosticCode: '9440',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'DSM-5 diagnosis of Adjustment Disorder with specification of subtype (with depressed mood, anxiety, mixed, etc.)', dbqForm: '21-0960P-2' },
        { type: 'required', description: 'Identification of the in-service stressor or service-connected condition that triggered the adjustment disorder' },
        { type: 'strongly-recommended', description: 'Treatment records showing ongoing symptoms beyond 6 months (to distinguish from acute adjustment reaction)' },
      ],
      additionalTips: [
        'Adjustment disorder is typically rated lower than PTSD or MDD. Consider whether a more specific diagnosis is appropriate.',
        'Rated under the General Rating Formula for Mental Disorders (38 CFR 4.130, DC 9440).',
        'If symptoms persist and worsen, request a diagnostic update to determine if the condition has evolved into MDD or another chronic disorder.',
      ],
    },
    exam: {
      examType: 'Mental Disorders (other than PTSD)',
      dbqFormNumber: '21-0960P-2',
      additionalPitfalls: [
        'Examiner may characterize the condition as resolved or temporary when symptoms persist',
        'VA may attempt to reduce the rating if the triggering stressor is no longer present, even though symptoms continue',
      ],
    },
  },
  {
    conditionId: 'panic-disorder',
    conditionName: 'Panic Disorder',
    diagnosticCode: '9412',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'DSM-5 diagnosis of Panic Disorder from a licensed mental health professional', dbqForm: '21-0960P-2' },
        { type: 'required', description: 'Documentation of panic attack frequency, duration, and severity with specific examples' },
        { type: 'strongly-recommended', description: 'Emergency room or urgent care records from panic attacks mistaken for cardiac events' },
      ],
      additionalTips: [
        'Panic attack frequency is a key differentiator in the General Rating Formula: weekly or less supports 30%, more than weekly supports 50%.',
        'Document agoraphobia or avoidance behaviors that result from panic attacks.',
        'ER visits for chest pain or cardiac symptoms that were ultimately attributed to panic attacks serve as strong objective evidence.',
      ],
    },
    exam: {
      examType: 'Mental Disorders (other than PTSD)',
      dbqFormNumber: '21-0960P-2',
      additionalPitfalls: [
        'Examiner may not witness a panic attack during the exam and therefore underestimate severity',
        'Failure to document anticipatory anxiety between attacks, which significantly impacts daily functioning',
      ],
    },
  },
  {
    conditionId: 'ocd',
    conditionName: 'Obsessive-Compulsive Disorder',
    diagnosticCode: '9404',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'DSM-5 diagnosis of OCD with specification of primary obsessions and compulsions', dbqForm: '21-0960P-2' },
        { type: 'required', description: 'Documentation of time spent on rituals and their impact on daily functioning and employment' },
        { type: 'strongly-recommended', description: 'Treatment records showing medication trials (SSRIs, clomipramine) and/or ERP therapy history' },
      ],
      additionalTips: [
        'OCD with obsessional rituals that interfere with routine activities supports a 70% rating under the General Rating Formula.',
        'Document the specific rituals: checking, counting, washing, ordering, and how much time they consume daily.',
        'Explain how OCD impacts work performance, relationships, and ability to leave the house or complete tasks.',
      ],
    },
    exam: {
      examType: 'Mental Disorders (other than PTSD)',
      dbqFormNumber: '21-0960P-2',
      additionalTests: [
        { name: 'Y-BOCS (Yale-Brown Obsessive Compulsive Scale)', purpose: 'Gold standard clinician-administered measure of OCD severity', whatExaminerDocuments: 'Total score indicating subclinical (0-7), mild (8-15), moderate (16-23), severe (24-31), or extreme (32-40) OCD', ratingImpact: 'Scores in the severe range (24+) strongly support ratings of 50% or higher based on functional impairment' },
      ],
      additionalPitfalls: [
        'Examiner may not ask about mental rituals (purely obsessional OCD) that are not visible',
        'Veterans may feel embarrassed about specific obsessions and not disclose them fully',
      ],
    },
  },
  {
    conditionId: 'somatic-symptom-disorder',
    conditionName: 'Somatic Symptom Disorder',
    diagnosticCode: '9422',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'DSM-5 diagnosis of Somatic Symptom Disorder with documentation of the predominant somatic complaints', dbqForm: '21-0960P-2' },
        { type: 'required', description: 'Medical records showing extensive medical workups that did not identify an organic cause for the symptoms' },
        { type: 'strongly-recommended', description: 'Documentation of how preoccupation with health concerns impacts daily functioning and occupational capacity' },
      ],
      additionalTips: [
        'Rated under the General Rating Formula for Mental Disorders at DC 9422.',
        'Document the degree to which health anxiety and somatic preoccupation consume daily life.',
        'If secondary to service-connected physical conditions, establish the nexus clearly showing how chronic pain or illness led to excessive health-related anxiety.',
      ],
    },
    exam: {
      examType: 'Mental Disorders (other than PTSD)',
      dbqFormNumber: '21-0960P-2',
      additionalPitfalls: [
        'Examiners may dismiss the condition as malingering rather than a legitimate psychiatric diagnosis',
        'Failure to distinguish somatic symptom disorder from factitious disorder or malingering, which have different clinical criteria',
      ],
    },
  },
  {
    conditionId: 'tbi',
    conditionName: 'Traumatic Brain Injury',
    diagnosticCode: '8045',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Documentation of in-service head injury or blast exposure event with dates and circumstances', source: '38 CFR 4.124a, DC 8045' },
        { type: 'required', description: 'Current TBI diagnosis with residuals evaluation using the TBI-specific DBQ', dbqForm: '21-0960C-1' },
        { type: 'required', description: 'Neuropsychological testing results documenting cognitive deficits attributable to TBI' },
      ],
      additionalRecommended: [
        { type: 'strongly-recommended', description: 'Brain imaging (CT or MRI) showing structural abnormalities, if available' },
        { type: 'recommended', description: 'Buddy statements describing observed cognitive, behavioral, and emotional changes after the head injury' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 0, keyEvidence: ['TBI history confirmed but no current residuals or all facets rated at level 0'] },
        { ratingPercent: 10, keyEvidence: ['At least one facet rated at level 1 (e.g., mild memory or attention complaints with normal neuropsych testing)'] },
        { ratingPercent: 40, keyEvidence: ['At least one facet rated at level 2 (e.g., moderate memory impairment, objective evidence on testing)'] },
        { ratingPercent: 70, keyEvidence: ['At least one facet rated at level 3 (e.g., severe cognitive deficits, moderately severe impairment of visual-spatial orientation)'] },
        { ratingPercent: 100, keyEvidence: ['Total occupational and social impairment from TBI residuals, or highest level on any facet warranting 100%'] },
      ],
      additionalTips: [
        'TBI uses a unique multi-facet rating system under DC 8045, NOT the General Rating Formula for Mental Disorders.',
        'The 10 facets include: memory/attention/concentration, judgment, social interaction, orientation, motor activity, visual-spatial orientation, subjective symptoms, neurobehavioral effects, communication, and consciousness.',
        'Each facet is rated on levels 0 through 3 (or "total" for the highest level). The highest facet level determines the overall TBI rating.',
        'Emotional and behavioral residuals of TBI are rated separately under the mental health General Rating Formula if they warrant a separate evaluation.',
      ],
    },
    exam: {
      examType: 'TBI Examination',
      dbqFormNumber: '21-0960C-1',
      additionalTests: [
        { name: 'Neuropsychological Battery', purpose: 'Comprehensive assessment of cognitive domains affected by TBI', whatExaminerDocuments: 'Performance across memory, attention, executive function, processing speed, language, and visuospatial domains with comparison to normative data', ratingImpact: 'Directly determines facet ratings for memory, attention, judgment, and other cognitive facets under DC 8045' },
        { name: 'Brain MRI/CT', purpose: 'Identify structural brain abnormalities from traumatic injury', whatExaminerDocuments: 'Presence or absence of lesions, atrophy, contusions, subdural hematomas, or diffuse axonal injury', ratingImpact: 'Objective imaging evidence strengthens service connection and may reveal pathology not apparent on clinical exam' },
      ],
      additionalRedFlags: [
        'Examiner uses the General Rating Formula for Mental Disorders instead of the TBI-specific facet system',
        'Neuropsych testing not ordered despite reported cognitive complaints',
        'Examiner does not assess all 10 facets required by DC 8045',
      ],
      additionalPitfalls: [
        'Confusing TBI residuals with co-occurring PTSD symptoms; both can coexist and should be rated separately',
        'Not documenting blast exposure events in theater when no direct impact occurred',
        'Failing to identify secondary conditions caused by TBI such as headaches, vertigo, or hormonal dysfunction',
      ],
    },
    rating: {
      ratingLevels: [
        { percent: 0, criteria: 'All facets at level 0. No residuals identified.', keywords: ['no residuals', 'level 0'] },
        { percent: 10, criteria: 'Highest facet at level 1. Mild impairment in one or more areas.', keywords: ['level 1', 'mild', 'subjective complaints'] },
        { percent: 40, criteria: 'Highest facet at level 2. Moderate impairment with objective evidence on testing.', keywords: ['level 2', 'moderate', 'objective evidence'] },
        { percent: 70, criteria: 'Highest facet at level 3. Severe impairment in one or more cognitive or behavioral domains.', keywords: ['level 3', 'severe', 'moderately severe'] },
        { percent: 100, criteria: 'Total impairment. Highest level on any facet or combination resulting in total occupational and social impairment.', keywords: ['total', 'highest level'] },
      ],
      examTips: [
        'Request a full neuropsychological evaluation, not just a screening.',
        'Bring documentation of all blast exposures and head impacts during service.',
        'Describe cognitive difficulties with specific real-world examples: getting lost, forgetting appointments, inability to follow conversations.',
      ],
      commonMistakes: [
        'Not claiming TBI residuals separately from PTSD.',
        'Failing to document the in-service head injury or blast exposure event.',
        'Not requesting separate ratings for TBI-related headaches, dizziness, or hormonal changes.',
      ],
    },
    literature: {
      additionalCitations: [
        { studyTitle: 'Blast-Related Traumatic Brain Injury in U.S. Military Personnel', journal: 'New England Journal of Medicine', year: 2011, keyFinding: 'Blast exposure causes diffuse axonal injury that may not appear on standard CT scans but produces lasting cognitive and behavioral deficits.', serviceConnectionRelevance: 'Supports service connection for TBI even when initial imaging was normal, as blast injuries may require advanced imaging or neuropsych testing to detect.', evidenceType: 'clinical' },
        { studyTitle: 'Chronic Effects of Mild TBI in Military Populations', journal: 'Journal of Neurotrauma', year: 2018, keyFinding: 'Even mild TBI in military populations produces chronic cognitive deficits in processing speed and executive function that persist years after injury.', serviceConnectionRelevance: 'Demonstrates that mild TBI produces lasting residuals warranting compensation, countering arguments that mild TBI fully resolves.', evidenceType: 'longitudinal' },
      ],
      nexusPattern: 'The veteran\'s current TBI residuals, including [cognitive deficits/headaches/behavioral changes], are at least as likely as not caused by the documented in-service [blast exposure/head impact] that occurred on [date] during [deployment/training].',
    },
  },
  // ============================================================
  // MUSCULOSKELETAL (25 conditions)
  // ============================================================
  {
    conditionId: 'lumbar-strain',
    conditionName: 'Lumbosacral Strain',
    diagnosticCode: '5237',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Current diagnosis of lumbosacral strain or degenerative changes of the lumbar spine', dbqForm: '21-0960M-14' },
        { type: 'required', description: 'Range of motion testing results for the thoracolumbar spine including forward flexion, extension, lateral flexion, and rotation' },
        { type: 'strongly-recommended', description: 'Imaging (X-ray or MRI) of the lumbar spine showing degenerative changes or disc pathology' },
      ],
      additionalRecommended: [
        { type: 'recommended', description: 'Service treatment records showing complaints of back pain during service' },
        { type: 'recommended', description: 'Documentation of physical demands of MOS (heavy lifting, rucking, airborne operations) establishing mechanism of injury' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 10, keyEvidence: ['Forward flexion greater than 60 degrees but not greater than 85 degrees, or combined ROM greater than 120 degrees but not greater than 235 degrees, or muscle spasm or guarding not resulting in abnormal gait or spinal contour'] },
        { ratingPercent: 20, keyEvidence: ['Forward flexion greater than 30 degrees but not greater than 60 degrees, or combined ROM not greater than 120 degrees, or muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour'] },
        { ratingPercent: 40, keyEvidence: ['Forward flexion 30 degrees or less, or favorable ankylosis of the entire thoracolumbar spine'] },
        { ratingPercent: 50, keyEvidence: ['Unfavorable ankylosis of the entire thoracolumbar spine'] },
        { ratingPercent: 100, keyEvidence: ['Unfavorable ankylosis of the entire spine'] },
      ],
      additionalTips: [
        'ROM testing must include pain on motion per 38 CFR 4.59 and DeLuca factors (pain, fatigue, weakness, incoordination, flare-ups).',
        'Ask the examiner to document where pain begins during ROM, as functional loss due to pain can support a higher rating per Mitchell v. Shinseki.',
        'If you have radiculopathy (nerve symptoms radiating to the legs), this should be rated separately under the peripheral nerve codes.',
        'Document flare-up frequency and how much additional ROM limitation occurs during flare-ups per Sharp v. Shulkin.',
      ],
    },
    exam: {
      examType: 'Back (Thoracolumbar Spine) Conditions',
      dbqFormNumber: '21-0960M-14',
      additionalTests: [
        { name: 'Thoracolumbar ROM Testing', purpose: 'Measure spinal range of motion to determine rating percentage', whatExaminerDocuments: 'Active and passive ROM for forward flexion (normal 90), extension (normal 30), right and left lateral flexion (normal 30 each), right and left rotation (normal 30 each), with notation of where pain begins', ratingImpact: 'Forward flexion is the primary determinant: 85+ degrees is 10%, 60 or less is 20%, 30 or less is 40%' },
        { name: 'Straight Leg Raise Test', purpose: 'Screen for lumbar radiculopathy and nerve root compression', whatExaminerDocuments: 'Positive or negative result, angle at which pain or radicular symptoms are reproduced, and which nerve root distribution is affected', ratingImpact: 'Positive result supports separate radiculopathy rating under DC 8520 in addition to the spine rating' },
      ],
      additionalRomRanges: [
        { movement: 'Forward Flexion', normalRange: '0 to 90 degrees', ratingThresholds: [{ percent: 10, range: 'Greater than 60 but not greater than 85 degrees' }, { percent: 20, range: 'Greater than 30 but not greater than 60 degrees' }, { percent: 40, range: '30 degrees or less' }] },
        { movement: 'Combined ROM', normalRange: '240 degrees total', ratingThresholds: [{ percent: 10, range: 'Greater than 120 but not greater than 235 degrees' }, { percent: 20, range: '120 degrees or less' }] },
      ],
      additionalRedFlags: [
        'Examiner does not test passive ROM and weight-bearing/non-weight-bearing per Correia v. McDonald',
        'Examiner fails to estimate additional ROM loss during flare-ups per Sharp v. Shulkin',
        'No documentation of where pain begins during ROM testing',
      ],
      additionalPitfalls: [
        'Examiner testing ROM only once without repetitive use testing (3 repetitions minimum)',
        'Not documenting muscle spasm, guarding, or abnormal gait pattern',
        'Failing to note incapacitating episodes if intervertebral disc syndrome is present',
      ],
    },
    rating: {
      ratingLevels: [
        { percent: 10, criteria: 'Forward flexion greater than 60 but not greater than 85 degrees; or combined ROM greater than 120 but not greater than 235 degrees; or muscle spasm, guarding, or localized tenderness not resulting in abnormal gait or spinal contour', keywords: ['flexion over 60', 'combined over 120', 'spasm no abnormal gait'] },
        { percent: 20, criteria: 'Forward flexion greater than 30 but not greater than 60 degrees; or combined ROM 120 degrees or less; or muscle spasm or guarding severe enough to result in abnormal gait or abnormal spinal contour', keywords: ['flexion 30-60', 'combined 120 or less', 'abnormal gait', 'abnormal contour'] },
        { percent: 40, criteria: 'Forward flexion 30 degrees or less; or favorable ankylosis of the entire thoracolumbar spine', keywords: ['flexion 30 or less', 'favorable ankylosis'] },
        { percent: 50, criteria: 'Unfavorable ankylosis of the entire thoracolumbar spine', keywords: ['unfavorable ankylosis thoracolumbar'] },
        { percent: 100, criteria: 'Unfavorable ankylosis of the entire spine', keywords: ['unfavorable ankylosis entire spine'] },
      ],
      examTips: [
        'Do not push through pain to demonstrate full ROM. Stop when pain begins.',
        'Describe your worst flare-up days and how they limit your motion and activity.',
        'Mention if you use assistive devices like a back brace, cane, or TENS unit.',
      ],
      commonMistakes: [
        'Not claiming radiculopathy separately when nerve symptoms exist.',
        'Failing to document flare-ups and their functional impact.',
        'Not requesting incapacitating episode evaluation when prescribed bed rest has occurred.',
      ],
    },
    literature: {
      additionalCitations: [
        { studyTitle: 'Low Back Pain in Military Service Members', journal: 'Spine', year: 2016, keyFinding: 'Military service members experience low back pain at rates 2 to 4 times higher than civilians, with rucking, airborne operations, and vehicular vibration as primary risk factors.', serviceConnectionRelevance: 'Directly supports service connection by establishing the military environment as a causative factor for lumbar conditions.', evidenceType: 'epidemiological' },
      ],
      nexusPattern: 'The veteran\'s current lumbosacral strain is at least as likely as not caused by or related to the physical demands of military service, including [specific activities such as rucking, lifting, airborne operations, or prolonged standing/sitting].',
    },
  },
  {
    conditionId: 'cervical-strain',
    conditionName: 'Cervical Strain',
    diagnosticCode: '5237',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Current diagnosis of cervical strain or degenerative changes of the cervical spine', dbqForm: '21-0960M-13' },
        { type: 'required', description: 'Range of motion testing results for the cervical spine including forward flexion, extension, lateral flexion, and rotation' },
        { type: 'strongly-recommended', description: 'Cervical spine imaging (X-ray or MRI) showing degenerative changes, disc bulging, or stenosis' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 10, keyEvidence: ['Forward flexion greater than 30 degrees but not greater than 40 degrees, or combined ROM greater than 170 degrees but not greater than 335 degrees, or muscle spasm or guarding not resulting in abnormal gait or spinal contour'] },
        { ratingPercent: 20, keyEvidence: ['Forward flexion greater than 15 degrees but not greater than 30 degrees, or combined ROM not greater than 170 degrees, or muscle spasm or guarding severe enough to result in abnormal gait or spinal contour'] },
        { ratingPercent: 30, keyEvidence: ['Forward flexion 15 degrees or less, or favorable ankylosis of the entire cervical spine'] },
        { ratingPercent: 40, keyEvidence: ['Unfavorable ankylosis of the entire cervical spine'] },
        { ratingPercent: 100, keyEvidence: ['Unfavorable ankylosis of the entire spine'] },
      ],
      additionalTips: [
        'Cervical spine uses the same General Rating Formula for Diseases and Injuries of the Spine as the thoracolumbar spine, but with different ROM thresholds.',
        'If you have upper extremity radiculopathy, this is rated separately under DC 8510 or related peripheral nerve codes.',
        'Document headaches caused by cervical strain, as these may warrant a separate rating.',
      ],
    },
    exam: {
      examType: 'Neck (Cervical Spine) Conditions',
      dbqFormNumber: '21-0960M-13',
      additionalTests: [
        { name: 'Cervical ROM Testing', purpose: 'Measure cervical spine range of motion for rating determination', whatExaminerDocuments: 'Active and passive ROM for forward flexion (normal 45), extension (normal 45), right and left lateral flexion (normal 45 each), right and left rotation (normal 80 each), with notation of where pain begins', ratingImpact: 'Forward flexion is primary: 40+ degrees is 10%, 30 or less is 20%, 15 or less is 30%' },
        { name: 'Spurling Test', purpose: 'Evaluate for cervical radiculopathy', whatExaminerDocuments: 'Positive or negative result indicating nerve root compression in the cervical spine', ratingImpact: 'Positive result supports separate upper extremity radiculopathy rating' },
      ],
      additionalPitfalls: [
        'Examiner not testing all six planes of cervical motion',
        'Not documenting upper extremity neurological symptoms as potential radiculopathy',
        'Failure to address headaches as a secondary condition of cervical strain',
      ],
    },
  },
  {
    conditionId: 'degenerative-disc-disease',
    conditionName: 'Degenerative Disc Disease',
    diagnosticCode: '5243',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'MRI or CT imaging confirming degenerative disc disease with specific disc levels identified', dbqForm: '21-0960M-14' },
        { type: 'required', description: 'ROM testing of the affected spinal segment (cervical or thoracolumbar)' },
        { type: 'strongly-recommended', description: 'Documentation of incapacitating episodes requiring physician-prescribed bed rest, if applicable, per the Formula for Rating IVDS' },
      ],
      additionalTips: [
        'DDD can be rated under the General Rating Formula for Diseases and Injuries of the Spine (based on ROM) or under the Formula for Rating Intervertebral Disc Syndrome (based on incapacitating episodes), whichever is higher per 38 CFR 4.71a.',
        'An "incapacitating episode" requires physician-prescribed bed rest. Self-imposed bed rest does not qualify.',
        'Document the total duration of incapacitating episodes over the past 12 months for the IVDS formula.',
        'Separate radiculopathy ratings should be pursued if nerve symptoms exist.',
      ],
    },
    exam: {
      examType: 'Back (Thoracolumbar Spine) Conditions',
      dbqFormNumber: '21-0960M-14',
      additionalTests: [
        { name: 'MRI of Affected Spine Segment', purpose: 'Confirm disc degeneration, herniations, and nerve impingement', whatExaminerDocuments: 'Disc levels affected, degree of degeneration, presence of herniations or bulges, foraminal or central stenosis, and nerve root compression', ratingImpact: 'Imaging findings support both the spine rating and any separate radiculopathy ratings for affected nerve roots' },
      ],
      additionalPitfalls: [
        'Examiner not asking about incapacitating episodes or their total annual duration',
        'Failing to document which formula (General Rating or IVDS) provides the higher evaluation',
        'Not testing for neurological abnormalities in the extremities',
      ],
    },
  },
  {
    conditionId: 'knee-instability',
    conditionName: 'Knee Instability',
    diagnosticCode: '5257',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Clinical examination documenting knee instability with specific ligament testing results', dbqForm: '21-0960M-9' },
        { type: 'required', description: 'MRI or surgical records confirming ligament damage (ACL, MCL, LCL, or PCL)' },
        { type: 'strongly-recommended', description: 'Documentation of use of knee brace for stabilization' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 10, keyEvidence: ['Slight recurrent subluxation or lateral instability of the knee'] },
        { ratingPercent: 20, keyEvidence: ['Moderate recurrent subluxation or lateral instability'] },
        { ratingPercent: 30, keyEvidence: ['Severe recurrent subluxation or lateral instability'] },
      ],
      additionalTips: [
        'Knee instability under DC 5257 can be rated separately from knee limitation of motion under DC 5260 or 5261 per VAOPGCPREC 23-97 and 9-98.',
        'This means you can receive separate ratings for instability AND limited flexion AND limited extension in the same knee.',
        'Request the examiner to perform Lachman test, anterior/posterior drawer tests, and varus/valgus stress testing.',
        'Document episodes of the knee giving way, buckling, or locking.',
      ],
    },
    exam: {
      examType: 'Knee and Lower Leg Conditions',
      dbqFormNumber: '21-0960M-9',
      additionalTests: [
        { name: 'Lachman Test', purpose: 'Evaluate ACL integrity', whatExaminerDocuments: 'Degree of anterior tibial translation and quality of endpoint (firm vs. soft)', ratingImpact: 'Positive Lachman with soft endpoint indicates ACL insufficiency supporting instability rating' },
        { name: 'Anterior and Posterior Drawer Tests', purpose: 'Assess ACL and PCL stability', whatExaminerDocuments: 'Amount of tibial translation relative to femur in both anterior and posterior directions', ratingImpact: 'Abnormal translation supports knee instability rating under DC 5257' },
        { name: 'Varus/Valgus Stress Test', purpose: 'Evaluate MCL and LCL stability', whatExaminerDocuments: 'Joint line opening in degrees at 0 and 30 degrees of flexion for both medial and lateral testing', ratingImpact: 'Joint line opening indicates collateral ligament laxity supporting instability rating' },
      ],
      additionalPitfalls: [
        'Examiner performing only one stability test when multiple should be done',
        'Not quantifying the degree of instability (slight, moderate, severe)',
        'Failing to note that instability is separately ratable from ROM limitation',
      ],
    },
    rating: {
      ratingLevels: [
        { percent: 10, criteria: 'Slight recurrent subluxation or lateral instability', keywords: ['slight', 'mild instability', 'trace laxity'] },
        { percent: 20, criteria: 'Moderate recurrent subluxation or lateral instability', keywords: ['moderate', 'brace required', 'frequent giving way'] },
        { percent: 30, criteria: 'Severe recurrent subluxation or lateral instability', keywords: ['severe', 'marked instability', 'frequent subluxation'] },
      ],
      examTips: [
        'Describe how often your knee gives way, buckles, or feels unstable.',
        'Mention if you wear a knee brace and how often.',
        'Explain falls or near-falls caused by knee instability.',
      ],
      commonMistakes: [
        'Not filing instability separately from ROM limitation.',
        'Not bringing the knee brace to the exam as evidence.',
      ],
    },
  },
  {
    conditionId: 'knee-limitation-flexion',
    conditionName: 'Knee Limitation of Flexion',
    diagnosticCode: '5260',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'ROM testing showing limitation of knee flexion measured with a goniometer', dbqForm: '21-0960M-9' },
        { type: 'required', description: 'Documentation of pain on flexion and where pain begins during motion' },
        { type: 'strongly-recommended', description: 'Imaging (X-ray or MRI) of the knee showing degenerative changes or internal derangement' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 0, keyEvidence: ['Flexion greater than 60 degrees (noncompensable under DC 5260)'] },
        { ratingPercent: 10, keyEvidence: ['Flexion limited to 45 degrees'] },
        { ratingPercent: 20, keyEvidence: ['Flexion limited to 30 degrees'] },
        { ratingPercent: 30, keyEvidence: ['Flexion limited to 15 degrees'] },
      ],
      additionalTips: [
        'Normal knee flexion is 0 to 140 degrees. Even mild limitation can be compensable if painful.',
        'Per 38 CFR 4.59, painful motion of a joint warrants at least the minimum compensable rating (10%) even if ROM does not meet the schedular criteria.',
        'Limitation of flexion and limitation of extension can be rated separately per VAOPGCPREC 9-04.',
        'Document pain, weakness, fatigability, and additional ROM loss after repetitive use testing.',
      ],
    },
    exam: {
      examType: 'Knee and Lower Leg Conditions',
      dbqFormNumber: '21-0960M-9',
      additionalRomRanges: [
        { movement: 'Knee Flexion', normalRange: '0 to 140 degrees', ratingThresholds: [{ percent: 10, range: 'Limited to 45 degrees' }, { percent: 20, range: 'Limited to 30 degrees' }, { percent: 30, range: 'Limited to 15 degrees' }] },
      ],
      additionalPitfalls: [
        'Examiner not recording where pain begins during flexion',
        'Not testing after repetitive use (minimum 3 repetitions)',
        'Failing to estimate additional functional loss during flare-ups',
      ],
    },
  },
  {
    conditionId: 'knee-limitation-extension',
    conditionName: 'Knee Limitation of Extension',
    diagnosticCode: '5261',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'ROM testing showing limitation of knee extension measured with a goniometer', dbqForm: '21-0960M-9' },
        { type: 'required', description: 'Documentation of pain on extension and where pain begins' },
        { type: 'strongly-recommended', description: 'Knee imaging showing degenerative changes or other pathology limiting extension' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 0, keyEvidence: ['Extension limited to 5 degrees (noncompensable)'] },
        { ratingPercent: 10, keyEvidence: ['Extension limited to 10 degrees'] },
        { ratingPercent: 20, keyEvidence: ['Extension limited to 15 degrees'] },
        { ratingPercent: 30, keyEvidence: ['Extension limited to 20 degrees'] },
        { ratingPercent: 40, keyEvidence: ['Extension limited to 30 degrees'] },
        { ratingPercent: 50, keyEvidence: ['Extension limited to 45 degrees'] },
      ],
      additionalTips: [
        'Normal knee extension is 0 degrees (full straightening). Any limitation above 5 degrees may be compensable.',
        'Extension limitation is rated separately from flexion limitation under VAOPGCPREC 9-04.',
        'Both extension limitation and instability can be rated in the same knee per VAOPGCPREC 23-97.',
        'Inability to fully extend the knee significantly impacts walking and standing, which should be documented.',
      ],
    },
    exam: {
      examType: 'Knee and Lower Leg Conditions',
      dbqFormNumber: '21-0960M-9',
      additionalRomRanges: [
        { movement: 'Knee Extension', normalRange: '0 degrees (full extension)', ratingThresholds: [{ percent: 10, range: 'Limited to 10 degrees' }, { percent: 20, range: 'Limited to 15 degrees' }, { percent: 30, range: 'Limited to 20 degrees' }, { percent: 40, range: 'Limited to 30 degrees' }, { percent: 50, range: 'Limited to 45 degrees' }] },
      ],
      additionalPitfalls: [
        'Examiner not measuring extension separately from flexion',
        'Failure to document flexion contracture (inability to fully straighten the knee)',
        'Not testing passive ROM in addition to active ROM per Correia v. McDonald',
      ],
    },
  },
  {
    conditionId: 'shoulder-limitation-of-motion',
    conditionName: 'Shoulder Limitation of Motion',
    diagnosticCode: '5201',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'ROM testing of the shoulder including flexion, abduction, internal rotation, and external rotation', dbqForm: '21-0960M-12' },
        { type: 'required', description: 'Documentation of whether the affected shoulder is the dominant (major) or non-dominant (minor) arm' },
        { type: 'strongly-recommended', description: 'Shoulder imaging (X-ray or MRI) showing rotator cuff pathology, impingement, or degenerative changes' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 20, keyEvidence: ['Arm motion limited to shoulder level (90 degrees abduction or flexion) for both major and minor arm'] },
        { ratingPercent: 30, keyEvidence: ['Arm motion limited to midway between side and shoulder level (45 degrees) for major arm; 20% for minor arm'] },
        { ratingPercent: 40, keyEvidence: ['Arm motion limited to 25 degrees from side for major arm; 30% for minor arm'] },
      ],
      additionalTips: [
        'The rating differs based on whether the dominant (major) or non-dominant (minor) arm is affected.',
        'Shoulder level means 90 degrees of abduction or forward flexion.',
        'Pain on overhead reaching even without full ROM limitation may warrant the minimum compensable rating under 38 CFR 4.59.',
        'Document inability to perform overhead activities, reaching behind the back, and carrying objects.',
      ],
    },
    exam: {
      examType: 'Shoulder and Arm Conditions',
      dbqFormNumber: '21-0960M-12',
      additionalRomRanges: [
        { movement: 'Shoulder Flexion', normalRange: '0 to 180 degrees', ratingThresholds: [{ percent: 20, range: 'Limited to 90 degrees (shoulder level)' }, { percent: 30, range: 'Limited to 45 degrees (midway, major arm)' }, { percent: 40, range: 'Limited to 25 degrees from side (major arm)' }] },
        { movement: 'Shoulder Abduction', normalRange: '0 to 180 degrees', ratingThresholds: [{ percent: 20, range: 'Limited to 90 degrees (shoulder level)' }, { percent: 30, range: 'Limited to 45 degrees (midway, major arm)' }, { percent: 40, range: 'Limited to 25 degrees from side (major arm)' }] },
      ],
      additionalPitfalls: [
        'Examiner not documenting which arm is dominant',
        'Not testing all four planes of shoulder motion (flexion, abduction, internal rotation, external rotation)',
        'Failure to note painful arc of motion or crepitus during testing',
      ],
    },
  },
  {
    conditionId: 'rotator-cuff-tear',
    conditionName: 'Rotator Cuff Tear',
    diagnosticCode: '5201',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'MRI confirming rotator cuff tear (partial or complete) with specific tendons identified', dbqForm: '21-0960M-12' },
        { type: 'required', description: 'ROM testing of the affected shoulder' },
        { type: 'strongly-recommended', description: 'Surgical records if rotator cuff repair was performed, including post-operative limitations' },
      ],
      additionalTips: [
        'Rotator cuff tears are typically rated under DC 5201 (limitation of arm motion) or DC 5203 (impairment of the clavicle or scapula).',
        'If you had rotator cuff surgery, document any residual weakness, loss of strength, or persistent ROM limitation.',
        'Consider claiming secondary conditions such as shoulder instability, arthritis, or opposite shoulder overuse injury.',
        'Empty can test, drop arm test, and Hawkins test are important clinical findings that should be documented.',
      ],
    },
    exam: {
      examType: 'Shoulder and Arm Conditions',
      dbqFormNumber: '21-0960M-12',
      additionalTests: [
        { name: 'Empty Can (Jobe) Test', purpose: 'Evaluate supraspinatus tendon integrity', whatExaminerDocuments: 'Weakness or pain with resisted abduction in the scapular plane with thumbs pointing downward', ratingImpact: 'Positive result indicates supraspinatus pathology supporting shoulder ROM limitation rating' },
        { name: 'Drop Arm Test', purpose: 'Assess for large or complete rotator cuff tear', whatExaminerDocuments: 'Inability to slowly lower the arm from 90 degrees abduction indicates significant rotator cuff deficiency', ratingImpact: 'Positive result supports severity of tear and functional limitation' },
      ],
      additionalPitfalls: [
        'Examiner not correlating MRI findings with clinical presentation',
        'Failing to document weakness in addition to ROM limitation',
        'Not assessing impairment of both the clavicle/scapula and shoulder motion for the higher rating',
      ],
    },
  },
  {
    conditionId: 'plantar-fasciitis',
    conditionName: 'Plantar Fasciitis',
    diagnosticCode: '5276',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Clinical diagnosis of plantar fasciitis with documentation of heel pain and tenderness at the plantar fascia insertion', dbqForm: '21-0960M-8' },
        { type: 'required', description: 'Documentation of whether condition is unilateral or bilateral' },
        { type: 'strongly-recommended', description: 'Imaging showing calcaneal spurs, fascial thickening, or plantar fascia tears if applicable' },
      ],
      additionalTips: [
        'Plantar fasciitis is typically rated by analogy under DC 5276 (flatfoot) or DC 5284 (other foot injuries).',
        'Document use of orthotics, night splints, cortisone injections, or other treatments.',
        'Note impact on standing, walking, running, and occupational duties.',
        'If bilateral, ensure both feet are evaluated and documented separately.',
      ],
    },
    exam: {
      examType: 'Foot Conditions including Flatfoot (Pes Planus)',
      dbqFormNumber: '21-0960M-8',
      additionalTests: [
        { name: 'Windlass Test', purpose: 'Confirm plantar fasciitis diagnosis', whatExaminerDocuments: 'Reproduction of heel pain with passive dorsiflexion of the great toe', ratingImpact: 'Positive result confirms plantar fascia involvement and supports disability rating' },
      ],
      additionalPitfalls: [
        'Examiner rating the condition as noncompensable when painful motion exists',
        'Not documenting the impact on weight-bearing tolerance and walking distance',
        'Failing to note use of orthotic inserts as evidence of ongoing treatment need',
      ],
    },
  },
  {
    conditionId: 'flat-feet',
    conditionName: 'Pes Planus (Flat Feet)',
    diagnosticCode: '5276',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Clinical diagnosis of pes planus with documentation of severity (mild, moderate, severe, pronounced)', dbqForm: '21-0960M-8' },
        { type: 'required', description: 'Documentation of whether condition is unilateral or bilateral' },
        { type: 'strongly-recommended', description: 'Weight-bearing X-rays showing arch collapse and any associated deformities' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 0, keyEvidence: ['Mild pes planus with symptoms relieved by built-up shoe or arch support'] },
        { ratingPercent: 10, keyEvidence: ['Moderate bilateral or unilateral pes planus: weight-bearing line over or medial to great toe, inward bowing of the Achilles tendon, pain on manipulation and use of feet'] },
        { ratingPercent: 30, keyEvidence: ['Severe bilateral pes planus: objective evidence of marked deformity (pronation, abduction), accentuated pain on manipulation and use, indication of swelling on use, characteristic callosities (bilateral); 20% if unilateral'] },
        { ratingPercent: 50, keyEvidence: ['Pronounced bilateral pes planus: marked pronation, extreme tenderness of plantar surfaces, marked inward displacement and severe spasm of the Achilles tendon on manipulation, not improved by orthopedic shoes or appliances (bilateral); 30% if unilateral'] },
      ],
      additionalTips: [
        'Pes planus has its own specific rating criteria under DC 5276, not the general foot injury code.',
        'Document whether orthotics or arch supports provide relief, as "not improved by orthopedic shoes or appliances" is required for the highest rating.',
        'Note the weight-bearing line position, Achilles tendon alignment, and presence of callosities.',
        'If flat feet cause secondary conditions (plantar fasciitis, knee or back problems), claim those secondarily.',
      ],
    },
    exam: {
      examType: 'Foot Conditions including Flatfoot (Pes Planus)',
      dbqFormNumber: '21-0960M-8',
      additionalPitfalls: [
        'Examiner not performing weight-bearing examination',
        'Not documenting Achilles tendon alignment and whether it can be corrected with manipulation',
        'Failing to note callosities, swelling on use, or plantar tenderness',
      ],
    },
  },
  {
    conditionId: 'ankle-limitation-of-motion',
    conditionName: 'Ankle Limitation of Motion',
    diagnosticCode: '5271',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'ROM testing of the ankle including dorsiflexion and plantar flexion measured with goniometer', dbqForm: '21-0960M-2' },
        { type: 'required', description: 'Documentation of pain on motion and functional limitations during weight-bearing activities' },
        { type: 'strongly-recommended', description: 'Ankle imaging showing degenerative changes, fracture history, or ligament damage' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 10, keyEvidence: ['Moderate limitation of ankle motion'] },
        { ratingPercent: 20, keyEvidence: ['Marked limitation of ankle motion'] },
      ],
      additionalTips: [
        'Normal ankle dorsiflexion is 0 to 20 degrees; normal plantar flexion is 0 to 45 degrees.',
        'DC 5271 provides only 10% (moderate) and 20% (marked) ratings for ROM limitation.',
        'For higher ratings, consider ankylosis (DC 5270) if the ankle is fused or fixed.',
        'Document functional impact on walking, stairs, uneven terrain, and prolonged standing.',
      ],
    },
    exam: {
      examType: 'Ankle Conditions',
      dbqFormNumber: '21-0960M-2',
      additionalRomRanges: [
        { movement: 'Ankle Dorsiflexion', normalRange: '0 to 20 degrees', ratingThresholds: [{ percent: 10, range: 'Moderate limitation' }, { percent: 20, range: 'Marked limitation (less than 5 degrees)' }] },
        { movement: 'Ankle Plantar Flexion', normalRange: '0 to 45 degrees', ratingThresholds: [{ percent: 10, range: 'Moderate limitation' }, { percent: 20, range: 'Marked limitation' }] },
      ],
      additionalPitfalls: [
        'Examiner not testing both dorsiflexion and plantar flexion',
        'Not distinguishing between moderate and marked limitation',
        'Failing to test ankle stability in addition to ROM',
      ],
    },
  },
  {
    conditionId: 'hip-limitation-flexion',
    conditionName: 'Hip Limitation of Flexion',
    diagnosticCode: '5252',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'ROM testing of the hip including flexion, extension, abduction, and adduction', dbqForm: '21-0960M-5' },
        { type: 'required', description: 'Documentation of pain onset during hip flexion and functional limitations' },
        { type: 'strongly-recommended', description: 'Hip imaging (X-ray or MRI) showing degenerative changes, labral tears, or other pathology' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 10, keyEvidence: ['Flexion limited to 45 degrees'] },
        { ratingPercent: 20, keyEvidence: ['Flexion limited to 30 degrees'] },
        { ratingPercent: 30, keyEvidence: ['Flexion limited to 20 degrees'] },
        { ratingPercent: 40, keyEvidence: ['Flexion limited to 10 degrees'] },
      ],
      additionalTips: [
        'Normal hip flexion is 0 to 125 degrees. Even with painful flexion above 45 degrees, a 10% rating is available under 38 CFR 4.59.',
        'Hip extension limitation (DC 5251) and thigh impairment (DC 5253) can be rated separately.',
        'Document difficulty with sitting, bending, climbing stairs, and entering/exiting vehicles.',
      ],
    },
    exam: {
      examType: 'Hip and Thigh Conditions',
      dbqFormNumber: '21-0960M-5',
      additionalRomRanges: [
        { movement: 'Hip Flexion', normalRange: '0 to 125 degrees', ratingThresholds: [{ percent: 10, range: 'Limited to 45 degrees' }, { percent: 20, range: 'Limited to 30 degrees' }, { percent: 30, range: 'Limited to 20 degrees' }, { percent: 40, range: 'Limited to 10 degrees' }] },
      ],
      additionalPitfalls: [
        'Examiner not testing all planes of hip motion',
        'Not documenting Trendelenburg sign or antalgic gait',
        'Failure to note crepitus or catching during ROM testing',
      ],
    },
  },
  {
    conditionId: 'carpal-tunnel',
    conditionName: 'Carpal Tunnel Syndrome',
    diagnosticCode: '8515',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Nerve conduction study (NCS) and electromyography (EMG) confirming carpal tunnel syndrome with severity grading', dbqForm: '21-0960N-3' },
        { type: 'required', description: 'Documentation of whether the affected hand is the dominant (major) or non-dominant (minor) extremity' },
        { type: 'strongly-recommended', description: 'Service records showing repetitive hand/wrist activities in MOS (typing, mechanics, weapons handling)' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 10, keyEvidence: ['Mild incomplete paralysis of the median nerve (dominant or non-dominant)'] },
        { ratingPercent: 30, keyEvidence: ['Moderate incomplete paralysis of the median nerve (major hand); 20% for minor hand'] },
        { ratingPercent: 50, keyEvidence: ['Severe incomplete paralysis of the median nerve (major hand); 40% for minor hand'] },
        { ratingPercent: 70, keyEvidence: ['Complete paralysis of the median nerve (major hand): hand inclined to ulnar side, index and middle fingers more extended than normal, cannot flex distal phalanx of thumb; 60% for minor hand'] },
      ],
      additionalTips: [
        'NCS/EMG is the gold standard test and strongly recommended. Clinical diagnosis alone (Tinel, Phalen) may not be sufficient.',
        'Ratings differ significantly based on major vs. minor hand, so always document hand dominance.',
        'If you had carpal tunnel release surgery, document any residual symptoms or limitations.',
        'Bilateral carpal tunnel should be claimed for both wrists separately.',
      ],
    },
    exam: {
      examType: 'Peripheral Nerves Conditions',
      dbqFormNumber: '21-0960N-3',
      additionalTests: [
        { name: 'Nerve Conduction Study / EMG', purpose: 'Objectively confirm median nerve compression and grade severity', whatExaminerDocuments: 'Distal motor and sensory latencies, conduction velocities, and amplitude of the median nerve at the wrist compared to normative values', ratingImpact: 'Directly determines whether incomplete paralysis is mild, moderate, or severe, which determines the rating percentage' },
        { name: 'Phalen and Tinel Tests', purpose: 'Clinical screening for carpal tunnel syndrome', whatExaminerDocuments: 'Positive or negative reproduction of tingling or numbness in the median nerve distribution', ratingImpact: 'Supports diagnosis but NCS/EMG is preferred for rating severity' },
      ],
      additionalPitfalls: [
        'Examiner not ordering NCS/EMG and relying solely on clinical tests',
        'Not documenting grip strength and fine motor dexterity deficits',
        'Failing to note hand dominance, which affects the rating percentage',
      ],
    },
    rating: {
      ratingLevels: [
        { percent: 10, criteria: 'Mild incomplete paralysis of the median nerve', keywords: ['mild', 'intermittent numbness', 'tingling'] },
        { percent: 30, criteria: 'Moderate incomplete paralysis (major hand); 20% minor hand', keywords: ['moderate', 'frequent numbness', 'grip weakness'] },
        { percent: 50, criteria: 'Severe incomplete paralysis (major hand); 40% minor hand', keywords: ['severe', 'constant numbness', 'thenar atrophy', 'significant weakness'] },
        { percent: 70, criteria: 'Complete paralysis (major hand); 60% minor hand', keywords: ['complete paralysis', 'cannot flex', 'ulnar deviation'] },
      ],
      examTips: [
        'Describe difficulty with gripping, buttoning clothes, opening jars, and typing.',
        'Mention if you drop objects frequently due to numbness or weakness.',
        'Report nighttime awakening due to hand numbness or pain.',
      ],
      commonMistakes: [
        'Not getting NCS/EMG testing before the C&P exam.',
        'Claiming only one wrist when both are affected.',
        'Not documenting hand dominance clearly.',
      ],
    },
  },
  {
    conditionId: 'gout',
    conditionName: 'Gout',
    diagnosticCode: '5017',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Diagnosis of gout confirmed by uric acid levels, joint aspiration showing urate crystals, or clinical diagnosis by a rheumatologist' },
        { type: 'required', description: 'Documentation of frequency of acute gout attacks and joints affected' },
        { type: 'strongly-recommended', description: 'Lab results showing serum uric acid levels over time' },
      ],
      additionalTips: [
        'Gout under DC 5017 is rated under the criteria for rheumatoid arthritis (DC 5002) as an active process, or based on limitation of motion of the affected joints.',
        'Document the number of exacerbations per year, as this directly impacts the rating.',
        'Keep a log of acute gout flare-ups with dates, duration, and joints affected.',
        'Medication side effects from gout treatment (allopurinol, colchicine) should also be documented.',
      ],
    },
    exam: {
      examType: 'Joint and Musculoskeletal Conditions',
      additionalPitfalls: [
        'Examiner evaluating during remission and finding no active symptoms',
        'Not documenting the number and severity of exacerbations over the past year',
        'Failing to assess all joints affected by gout, not just the primary one',
      ],
    },
  },
  {
    conditionId: 'rheumatoid-arthritis',
    conditionName: 'Rheumatoid Arthritis',
    diagnosticCode: '5002',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Diagnosis of rheumatoid arthritis confirmed by rheumatologist with supporting lab work (RF factor, anti-CCP, ESR, CRP)' },
        { type: 'required', description: 'Documentation of joints affected and frequency of exacerbations' },
        { type: 'strongly-recommended', description: 'Imaging showing erosive joint changes consistent with RA' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 20, keyEvidence: ['One or two exacerbations per year in a well-established diagnosis'] },
        { ratingPercent: 40, keyEvidence: ['Symptom combinations productive of definite impairment of health objectively supported by examination findings or incapacitating exacerbations occurring 3 or more times a year'] },
        { ratingPercent: 60, keyEvidence: ['Less than criteria for 100% but with weight loss and anemia productive of severe impairment of health, or severely incapacitating exacerbations occurring 4 or more times a year or a lesser number over prolonged periods'] },
        { ratingPercent: 100, keyEvidence: ['Constitutional manifestations associated with active joint involvement that are totally incapacitating'] },
      ],
      additionalTips: [
        'RA can be rated as an active process (based on exacerbation frequency and constitutional symptoms) or based on chronic residuals (limitation of motion of affected joints), whichever is higher.',
        'Document weight loss, anemia, fatigue, and other systemic symptoms in addition to joint problems.',
        'Keep detailed records of incapacitating exacerbations and their duration.',
      ],
    },
    exam: {
      examType: 'Rheumatoid Arthritis Conditions',
      additionalTests: [
        { name: 'Rheumatoid Factor and Anti-CCP Antibodies', purpose: 'Confirm autoimmune etiology of arthritis', whatExaminerDocuments: 'RF titer, anti-CCP levels, and seropositive vs. seronegative status', ratingImpact: 'Confirms diagnosis and differentiates RA from osteoarthritis for proper DC assignment' },
      ],
      additionalPitfalls: [
        'Examiner evaluating only during remission and understating disease severity',
        'Not counting the number of incapacitating exacerbations over the past year',
        'Failing to document systemic manifestations (fatigue, anemia, weight loss)',
      ],
    },
  },
  {
    conditionId: 'degenerative-arthritis',
    conditionName: 'Degenerative Arthritis',
    diagnosticCode: '5003',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'X-ray evidence of degenerative arthritis in the affected joint(s)', source: '38 CFR 4.71a, DC 5003' },
        { type: 'required', description: 'ROM testing of all affected joints' },
        { type: 'strongly-recommended', description: 'Documentation of painful motion in each affected joint' },
      ],
      additionalTips: [
        'DC 5003 requires X-ray confirmation of arthritis. Without X-ray evidence, the condition cannot be rated under this code.',
        'If ROM limitation is noncompensable under the specific joint code, DC 5003 provides a 10% rating for each major joint or group of minor joints affected by painful motion.',
        'With involvement of 2 or more major joints or 2 or more minor joint groups without incapacitating exacerbations, a 10% rating applies. With occasional incapacitating exacerbations, 20% applies.',
        'Degenerative arthritis established by X-ray is rated on limitation of motion under the appropriate DC for the joint involved.',
      ],
    },
    exam: {
      examType: 'Joint and Musculoskeletal Conditions',
      additionalPitfalls: [
        'No X-ray ordered or referenced to confirm degenerative changes',
        'Examiner not testing ROM for all arthritic joints claimed',
        'Not applying 38 CFR 4.59 (painful motion warranting minimum compensable rating)',
      ],
    },
  },
  {
    conditionId: 'bunion',
    conditionName: 'Hallux Valgus (Bunion)',
    diagnosticCode: '5280',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Clinical or radiographic diagnosis of hallux valgus with severity noted', dbqForm: '21-0960M-8' },
        { type: 'required', description: 'Documentation of whether condition is unilateral or bilateral' },
        { type: 'strongly-recommended', description: 'X-ray showing hallux valgus angle and presence of degenerative changes at the first MTP joint' },
      ],
      additionalTips: [
        'DC 5280 provides a maximum 10% rating for unilateral hallux valgus (operated with resection of metatarsal head, or severe equivalent to amputation of the great toe).',
        'If bilateral, each foot is rated separately for a potential combined higher rating.',
        'Consider secondary conditions caused by hallux valgus such as altered gait leading to knee, hip, or back problems.',
        'Document impact on footwear, walking tolerance, and pain with weight-bearing.',
      ],
    },
    exam: {
      examType: 'Foot Conditions',
      dbqFormNumber: '21-0960M-8',
      additionalPitfalls: [
        'Examiner not evaluating severity equivalent to great toe amputation for the 10% rating',
        'Not noting whether surgical correction was performed',
        'Failing to document impact on ambulation and footwear',
      ],
    },
  },
  {
    conditionId: 'hammer-toe',
    conditionName: 'Hammer Toe',
    diagnosticCode: '5282',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Clinical diagnosis of hammer toe(s) with identification of affected toes', dbqForm: '21-0960M-8' },
        { type: 'required', description: 'Documentation of whether condition involves single or all toes of one foot' },
        { type: 'strongly-recommended', description: 'X-ray showing PIP joint flexion contracture or deformity of affected toes' },
      ],
      additionalTips: [
        'DC 5282 provides 0% for single hammer toe and 10% for all toes of one foot affected (without claw foot).',
        'If hammer toes cause secondary conditions or functional limitation beyond the schedular criteria, consider a higher rating under DC 5284 (other foot injuries).',
        'Document pain with walking, callus formation, and difficulty with footwear.',
      ],
    },
    exam: {
      examType: 'Foot Conditions',
      dbqFormNumber: '21-0960M-8',
      additionalPitfalls: [
        'Examiner only documenting one toe when multiple toes are affected',
        'Not considering rating under DC 5284 for more severe functional impairment',
        'Failing to document secondary calluses or skin changes from hammer toes',
      ],
    },
  },
  {
    conditionId: 'shin-splints',
    conditionName: 'Shin Splints (Medial Tibial Stress Syndrome)',
    diagnosticCode: '5262',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Clinical diagnosis of chronic shin splints or medial tibial stress syndrome' },
        { type: 'required', description: 'Service treatment records showing onset during military training or physical fitness activities' },
        { type: 'strongly-recommended', description: 'Bone scan or MRI if stress fractures are suspected, to differentiate from simple periostitis' },
      ],
      additionalTips: [
        'Shin splints are typically rated under DC 5262 (impairment of the tibia and fibula) by analogy.',
        'Document the impact on running, marching, and prolonged standing.',
        'If condition has progressed to stress fractures or compartment syndrome, claim under the more appropriate code.',
        'Bilateral shin splints should be claimed for each leg separately.',
      ],
    },
    exam: {
      examType: 'Knee and Lower Leg Conditions',
      dbqFormNumber: '21-0960M-9',
      additionalPitfalls: [
        'Examiner finding no current symptoms during a non-symptomatic period',
        'Not ordering imaging to rule out stress fractures',
        'Failing to document activity-related pain pattern typical of shin splints',
      ],
    },
  },
  {
    conditionId: 'thoracolumbar-strain',
    conditionName: 'Thoracolumbar Strain',
    diagnosticCode: '5237',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Current diagnosis of thoracolumbar strain with ROM testing of the thoracolumbar spine', dbqForm: '21-0960M-14' },
        { type: 'required', description: 'Documentation of forward flexion, extension, lateral flexion, and rotation with pain notation' },
        { type: 'strongly-recommended', description: 'Thoracolumbar spine imaging showing any degenerative or structural changes' },
      ],
      additionalTips: [
        'Thoracolumbar strain uses the same rating criteria as lumbosacral strain under the General Rating Formula for Diseases and Injuries of the Spine.',
        'Forward flexion is the primary measurement: over 60 degrees is 10%, 30 to 60 degrees is 20%, 30 degrees or less is 40%.',
        'Document muscle spasm, guarding, and abnormal gait or spinal contour.',
        'Claim associated radiculopathy separately if nerve symptoms exist.',
      ],
    },
    exam: {
      examType: 'Back (Thoracolumbar Spine) Conditions',
      dbqFormNumber: '21-0960M-14',
      additionalPitfalls: [
        'Examiner not distinguishing thoracolumbar from purely lumbar pathology',
        'Not testing for thoracic spine tenderness and muscle spasm',
        'Failure to document DeLuca factors and flare-up impact on ROM',
      ],
    },
  },
  {
    conditionId: 'neck-limitation-of-motion',
    conditionName: 'Cervical Spine Limitation of Motion',
    diagnosticCode: '5237',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'ROM testing of the cervical spine in all six planes of motion', dbqForm: '21-0960M-13' },
        { type: 'required', description: 'Documentation of pain onset during cervical ROM testing' },
        { type: 'strongly-recommended', description: 'Cervical spine MRI or X-ray showing degenerative changes or disc pathology' },
      ],
      additionalTips: [
        'Cervical spine forward flexion thresholds: over 30 degrees is 10%, 15 to 30 degrees is 20%, 15 degrees or less is 30%.',
        'Combined cervical ROM of 170 degrees or less supports a 20% rating.',
        'If nerve symptoms radiate to the arms, claim upper extremity radiculopathy separately.',
        'Document impact on driving (checking mirrors, turning head), computer work, and sleeping position.',
      ],
    },
    exam: {
      examType: 'Neck (Cervical Spine) Conditions',
      dbqFormNumber: '21-0960M-13',
      additionalPitfalls: [
        'Examiner not testing all six planes of cervical motion',
        'Not documenting passive ROM and weight-bearing vs. non-weight-bearing per Correia',
        'Failing to assess upper extremity neurological symptoms during the spine exam',
      ],
    },
  },
  {
    conditionId: 'elbow-limitation-of-motion',
    conditionName: 'Elbow Limitation of Motion',
    diagnosticCode: '5206',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'ROM testing of the elbow including flexion, extension, pronation, and supination', dbqForm: '21-0960M-3' },
        { type: 'required', description: 'Documentation of whether the affected arm is the dominant (major) or non-dominant (minor) arm' },
        { type: 'strongly-recommended', description: 'Elbow imaging showing degenerative changes, loose bodies, or post-traumatic deformity' },
      ],
      additionalTips: [
        'Elbow limitation of flexion (DC 5206) and extension (DC 5207) can be rated separately.',
        'Normal elbow flexion is 0 to 145 degrees. Flexion limited to 100 degrees warrants a 10% rating.',
        'Normal extension is 0 degrees. Extension limited to 45 degrees warrants a 10% rating.',
        'Impairment of pronation and supination (DC 5213) is rated separately from flexion/extension.',
      ],
    },
    exam: {
      examType: 'Elbow and Forearm Conditions',
      dbqFormNumber: '21-0960M-3',
      additionalRomRanges: [
        { movement: 'Elbow Flexion', normalRange: '0 to 145 degrees', ratingThresholds: [{ percent: 10, range: 'Limited to 100 degrees' }, { percent: 20, range: 'Limited to 90 degrees' }, { percent: 30, range: 'Limited to 70 degrees (major), 20% minor' }, { percent: 40, range: 'Limited to 55 degrees (major), 30% minor' }] },
        { movement: 'Elbow Extension', normalRange: '0 degrees (full extension)', ratingThresholds: [{ percent: 10, range: 'Limited to 45 degrees' }, { percent: 10, range: 'Limited to 60 degrees' }, { percent: 20, range: 'Limited to 75 degrees' }, { percent: 30, range: 'Limited to 90 degrees (major), 20% minor' }] },
      ],
      additionalPitfalls: [
        'Examiner not testing forearm pronation and supination',
        'Not documenting arm dominance for proper rating percentage',
        'Failing to note if flexion and extension limitations coexist for separate ratings',
      ],
    },
  },
  {
    conditionId: 'wrist-limitation-of-motion',
    conditionName: 'Wrist Limitation of Motion',
    diagnosticCode: '5215',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'ROM testing of the wrist including dorsiflexion (extension) and palmar flexion', dbqForm: '21-0960M-16' },
        { type: 'required', description: 'Documentation of whether the affected wrist is the dominant (major) or non-dominant (minor) extremity' },
        { type: 'strongly-recommended', description: 'Wrist imaging showing degenerative changes, scaphoid nonunion, or post-traumatic deformity' },
      ],
      additionalTips: [
        'DC 5215 provides a maximum 10% rating for limitation of dorsiflexion less than 15 degrees, or palmar flexion limited in line with the forearm.',
        'For higher ratings, consider whether ankylosis (DC 5214) is present.',
        'Document impact on gripping, lifting, writing, and typing activities.',
        'If carpal tunnel syndrome coexists, the nerve condition can be rated separately.',
      ],
    },
    exam: {
      examType: 'Wrist Conditions',
      dbqFormNumber: '21-0960M-16',
      additionalRomRanges: [
        { movement: 'Wrist Dorsiflexion (Extension)', normalRange: '0 to 70 degrees', ratingThresholds: [{ percent: 10, range: 'Less than 15 degrees' }] },
        { movement: 'Wrist Palmar Flexion', normalRange: '0 to 80 degrees', ratingThresholds: [{ percent: 10, range: 'Limited in line with forearm (0 degrees)' }] },
      ],
      additionalPitfalls: [
        'Examiner not testing ulnar and radial deviation in addition to flexion and extension',
        'Not documenting hand dominance',
        'Failing to note ankylosis if the wrist is functionally fixed',
      ],
    },
  },
  {
    conditionId: 'frozen-shoulder',
    conditionName: 'Adhesive Capsulitis (Frozen Shoulder)',
    diagnosticCode: '5201',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Clinical diagnosis of adhesive capsulitis with ROM testing showing restriction in multiple planes', dbqForm: '21-0960M-12' },
        { type: 'required', description: 'Documentation of which phase (freezing, frozen, thawing) and arm dominance (major vs. minor)' },
        { type: 'strongly-recommended', description: 'MRI showing capsular thickening or arthrogram showing reduced joint capsule volume' },
      ],
      additionalTips: [
        'Frozen shoulder typically causes severe ROM limitation in all planes, which may support a high rating under DC 5201.',
        'Even in the "thawing" phase, residual ROM limitation should be documented.',
        'If the shoulder is functionally ankylosed (fixed in one position), consider DC 5200 for a potentially higher rating.',
        'Document inability to perform overhead activities, dressing, and personal hygiene tasks.',
      ],
    },
    exam: {
      examType: 'Shoulder and Arm Conditions',
      dbqFormNumber: '21-0960M-12',
      additionalPitfalls: [
        'Examiner not recognizing that adhesive capsulitis restricts passive ROM as well as active ROM',
        'Testing during the thawing phase and finding improved ROM without documenting the chronic nature',
        'Not testing external rotation, which is typically the most restricted motion in adhesive capsulitis',
      ],
    },
  },
  {
    conditionId: 'temporomandibular-disorder',
    conditionName: 'Temporomandibular Joint Disorder (TMD)',
    diagnosticCode: '9905',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Clinical diagnosis of TMJ disorder with measurement of inter-incisal range of motion', dbqForm: '21-0960M-15' },
        { type: 'required', description: 'Documentation of lateral excursion range of motion' },
        { type: 'strongly-recommended', description: 'TMJ imaging (panoramic X-ray, CT, or MRI) showing disc displacement, condylar changes, or degenerative joint disease' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 10, keyEvidence: ['Inter-incisal range of 31 to 40 mm, or lateral excursion of 0 to 4 mm'] },
        { ratingPercent: 20, keyEvidence: ['Inter-incisal range of 21 to 30 mm'] },
        { ratingPercent: 30, keyEvidence: ['Inter-incisal range of 11 to 20 mm'] },
        { ratingPercent: 40, keyEvidence: ['Inter-incisal range of 0 to 10 mm'] },
      ],
      additionalTips: [
        'DC 9905 rates TMJ based on inter-incisal ROM and lateral excursion, with separate ratings possible.',
        'Document clicking, popping, locking, pain with chewing, and headaches caused by TMJ.',
        'If TMJ causes secondary headaches or ear pain, consider separate secondary claims.',
        'Measure your own mouth opening: normal is about 40 to 50 mm (roughly three finger widths).',
      ],
    },
    exam: {
      examType: 'TMJ Conditions',
      dbqFormNumber: '21-0960M-15',
      additionalTests: [
        { name: 'Inter-incisal ROM Measurement', purpose: 'Determine jaw opening distance for rating purposes', whatExaminerDocuments: 'Maximum inter-incisal opening in millimeters, with notation of pain onset', ratingImpact: 'Directly determines rating: 31-40mm is 10%, 21-30mm is 20%, 11-20mm is 30%, 0-10mm is 40%' },
      ],
      additionalPitfalls: [
        'Examiner not measuring inter-incisal distance precisely in millimeters',
        'Not documenting lateral excursion, which can provide a separate rating',
        'Failing to note TMJ crepitus, locking, or disc dysfunction during examination',
      ],
    },
  },
  // ============================================================
  // NEUROLOGICAL (10 conditions)
  // ============================================================
  {
    conditionId: 'radiculopathy',
    conditionName: 'Radiculopathy',
    diagnosticCode: '8520',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Nerve conduction study (NCS) and/or EMG confirming radiculopathy with affected nerve root(s) identified', dbqForm: '21-0960N-3' },
        { type: 'required', description: 'MRI of the affected spine segment showing disc herniation or foraminal stenosis compressing the nerve root' },
        { type: 'strongly-recommended', description: 'Documentation of radicular symptom pattern: pain, numbness, tingling, or weakness in the specific nerve root distribution' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 10, keyEvidence: ['Mild incomplete paralysis of the sciatic nerve (lower) or affected upper extremity nerve'] },
        { ratingPercent: 20, keyEvidence: ['Moderate incomplete paralysis of the sciatic nerve; or moderate incomplete paralysis of upper extremity nerves'] },
        { ratingPercent: 40, keyEvidence: ['Moderately severe incomplete paralysis of the sciatic nerve'] },
        { ratingPercent: 60, keyEvidence: ['Severe incomplete paralysis of the sciatic nerve with marked muscular atrophy'] },
        { ratingPercent: 80, keyEvidence: ['Complete paralysis of the sciatic nerve: foot dangles, no active movement below knee, weakened or lost knee flexion'] },
      ],
      additionalTips: [
        'Radiculopathy is rated separately from the underlying spine condition. You can receive ratings for both the spine and each affected nerve root.',
        'Each extremity with radiculopathy is rated independently. Bilateral radiculopathy means separate ratings for the left and right sides.',
        'Upper extremity radiculopathy (cervical spine) is rated under DC 8510-8516 depending on the nerve. Lower extremity (lumbar) is typically under DC 8520 (sciatic) or DC 8521 (external popliteal).',
        'NCS/EMG provides objective evidence of nerve involvement and is strongly recommended.',
      ],
    },
    exam: {
      examType: 'Peripheral Nerves Conditions',
      dbqFormNumber: '21-0960N-3',
      additionalTests: [
        { name: 'NCS/EMG of Affected Extremity', purpose: 'Objectively confirm radiculopathy and determine severity', whatExaminerDocuments: 'Nerve conduction velocities, amplitudes, and EMG findings identifying the affected nerve root(s) and severity (mild, moderate, moderately severe, severe)', ratingImpact: 'Directly determines the rating percentage by establishing severity of incomplete paralysis' },
        { name: 'Straight Leg Raise / Spurling Test', purpose: 'Clinical screening for lower/upper radiculopathy', whatExaminerDocuments: 'Positive or negative result with angle of onset and distribution of radicular symptoms', ratingImpact: 'Supports diagnosis but NCS/EMG is preferred for definitive grading' },
      ],
      additionalRedFlags: [
        'Examiner not ordering NCS/EMG despite radicular symptoms',
        'Not specifying the nerve root involved (L4, L5, S1, C5, C6, etc.)',
        'Failing to document motor weakness, reflex changes, or sensory deficits in the affected distribution',
      ],
      additionalPitfalls: [
        'Rating radiculopathy within the spine rating instead of separately',
        'Not testing reflexes, muscle strength, and sensation in the affected distribution',
        'Examiner grouping bilateral radiculopathy as one condition instead of rating each side separately',
      ],
    },
    rating: {
      ratingLevels: [
        { percent: 10, criteria: 'Mild incomplete paralysis of the affected nerve', keywords: ['mild', 'intermittent radicular symptoms', 'sensory only'] },
        { percent: 20, criteria: 'Moderate incomplete paralysis', keywords: ['moderate', 'constant radicular pain', 'diminished reflexes'] },
        { percent: 40, criteria: 'Moderately severe incomplete paralysis (sciatic nerve)', keywords: ['moderately severe', 'significant weakness', 'foot drop partial'] },
        { percent: 60, criteria: 'Severe incomplete paralysis with marked muscular atrophy', keywords: ['severe', 'marked atrophy', 'significant motor loss'] },
        { percent: 80, criteria: 'Complete paralysis of the sciatic nerve', keywords: ['complete', 'foot drop', 'no active movement'] },
      ],
      examTips: [
        'Describe radiating pain pattern precisely: where it starts and where it travels.',
        'Report numbness, tingling, burning, and weakness in specific areas of the arms or legs.',
        'Mention any foot drop, tripping, or difficulty lifting the foot.',
      ],
      commonMistakes: [
        'Not filing radiculopathy separately from the spine condition.',
        'Claiming only one side when both extremities are affected.',
        'Not getting NCS/EMG testing before the exam.',
      ],
    },
    literature: {
      additionalCitations: [
        { studyTitle: 'Lumbar Radiculopathy in Active Duty Military Personnel', journal: 'Military Medicine', year: 2015, keyFinding: 'Military activities including airborne operations, heavy lifting, and prolonged vehicular exposure significantly increase the risk of lumbar disc herniation and subsequent radiculopathy.', serviceConnectionRelevance: 'Supports service connection by linking military physical demands to nerve root compression.', evidenceType: 'epidemiological' },
      ],
      nexusPattern: 'The veteran\'s current [upper/lower] extremity radiculopathy is at least as likely as not caused by or secondary to the service-connected [cervical/lumbar] spine condition, as the nerve root compression documented on MRI is the direct cause of the radicular symptoms.',
    },
  },
  {
    conditionId: 'peripheral-neuropathy',
    conditionName: 'Peripheral Neuropathy',
    diagnosticCode: '8520',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'NCS/EMG confirming peripheral neuropathy with affected nerves, pattern (axonal vs. demyelinating), and severity', dbqForm: '21-0960N-3' },
        { type: 'required', description: 'Documentation of etiology: Agent Orange exposure, diabetes, toxic exposure, or other service-related cause' },
        { type: 'strongly-recommended', description: 'Lab work including B12, folate, HbA1c, thyroid panel, and toxicology to establish or exclude contributing causes' },
      ],
      additionalTips: [
        'Peripheral neuropathy is presumptive for Agent Orange exposure under 38 CFR 3.309(e) if early-onset (within one year of exposure) and at least 10% disabling.',
        'Each affected extremity is rated separately based on the specific nerve involved.',
        'Common patterns: stocking-glove distribution (feet/hands), mononeuropathy (single nerve), or polyneuropathy (multiple nerves).',
        'If secondary to service-connected diabetes, establish the nexus through medical documentation.',
      ],
    },
    exam: {
      examType: 'Peripheral Nerves Conditions',
      dbqFormNumber: '21-0960N-3',
      additionalTests: [
        { name: 'NCS/EMG of All Affected Extremities', purpose: 'Confirm peripheral neuropathy, pattern, and severity in each extremity', whatExaminerDocuments: 'Motor and sensory nerve conduction velocities, amplitudes, and EMG findings for each tested nerve with comparison to normative data', ratingImpact: 'Determines severity (mild, moderate, moderately severe, severe) of each affected nerve, directly setting the rating percentage per extremity' },
        { name: 'Monofilament Testing', purpose: 'Assess protective sensation in the feet', whatExaminerDocuments: 'Areas of diminished or absent sensation to 10-gram monofilament testing', ratingImpact: 'Documents loss of protective sensation, supporting at least moderate incomplete paralysis' },
      ],
      additionalPitfalls: [
        'Testing only upper or lower extremities when all four may be affected',
        'Not documenting the specific nerve(s) affected in each extremity',
        'Failing to establish the etiology (diabetes, toxins, Agent Orange) needed for service connection',
      ],
    },
  },
  {
    conditionId: 'migraine',
    conditionName: 'Migraine Headaches',
    diagnosticCode: '8100',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Current diagnosis of migraine headaches from a qualified medical provider', dbqForm: '21-0960C-8' },
        { type: 'required', description: 'Headache diary or log documenting frequency, duration, severity, and prostrating nature of migraines over the past several months' },
        { type: 'strongly-recommended', description: 'Documentation from employer or self-employment records showing work days missed due to migraines' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 0, keyEvidence: ['Less frequent attacks than required for 10% rating'] },
        { ratingPercent: 10, keyEvidence: ['Characteristic prostrating attacks averaging one in 2 months over the last several months'] },
        { ratingPercent: 30, keyEvidence: ['Characteristic prostrating attacks occurring on an average once a month over the last several months'] },
        { ratingPercent: 50, keyEvidence: ['Very frequent completely prostrating and prolonged attacks productive of severe economic inadaptability'] },
      ],
      additionalTips: [
        'The key term is "prostrating," meaning the migraine forces you to stop all activity and lie down. Document this clearly.',
        '"Severe economic inadaptability" does not require total unemployability. It means migraines significantly interfere with your ability to earn a living.',
        'Keep a detailed headache diary with dates, duration, severity (1-10), symptoms (aura, nausea, photophobia), and whether the attack was prostrating.',
        'Secondary migraines from TBI or cervical spine conditions should be documented with a nexus opinion.',
      ],
    },
    exam: {
      examType: 'Headaches (including Migraines)',
      dbqFormNumber: '21-0960C-8',
      additionalTests: [
        { name: 'Headache Diary Review', purpose: 'Document migraine frequency, duration, and prostrating nature over time', whatExaminerDocuments: 'Frequency of prostrating attacks per month, duration of each attack, associated symptoms, and whether attacks prevent working', ratingImpact: 'Directly determines rating: one in 2 months is 10%, monthly is 30%, very frequent and prolonged with severe economic impact is 50%' },
      ],
      additionalRedFlags: [
        'Examiner does not ask about prostrating nature of attacks',
        'Examiner does not document frequency of attacks over the last several months',
        'No assessment of economic impact or work time missed',
      ],
      additionalPitfalls: [
        'Veteran not maintaining a headache diary prior to the exam',
        'Examiner conflating tension headaches with migraines',
        'Not documenting aura, photophobia, phonophobia, and nausea as characteristic migraine features',
      ],
    },
    rating: {
      ratingLevels: [
        { percent: 0, criteria: 'Less frequent attacks than required for 10%', keywords: ['infrequent', 'non-prostrating'] },
        { percent: 10, criteria: 'Characteristic prostrating attacks averaging one in 2 months over last several months', keywords: ['prostrating', 'one every two months'] },
        { percent: 30, criteria: 'Characteristic prostrating attacks occurring on average once a month over last several months', keywords: ['monthly prostrating', 'once a month'] },
        { percent: 50, criteria: 'Very frequent completely prostrating and prolonged attacks productive of severe economic inadaptability', keywords: ['very frequent', 'completely prostrating', 'severe economic inadaptability', 'prolonged'] },
      ],
      examTips: [
        'Bring your headache diary to the exam.',
        'Explain in detail what happens during a prostrating attack: you must lie down in a dark room, cannot function.',
        'Describe the economic impact: missed work, reduced hours, job loss, inability to maintain employment.',
      ],
      commonMistakes: [
        'Not using the word "prostrating" when describing attacks.',
        'Failing to document economic impact for the 50% rating.',
        'Not distinguishing migraines from other types of headaches.',
      ],
    },
    literature: {
      additionalCitations: [
        { studyTitle: 'Headache Disorders in Military Personnel', journal: 'Headache: The Journal of Head and Face Pain', year: 2017, keyFinding: 'Military personnel experience migraine headaches at significantly higher rates than civilians, with blast exposure, TBI, and high operational stress as primary risk factors.', serviceConnectionRelevance: 'Supports direct service connection by linking military service conditions to increased migraine prevalence.', evidenceType: 'epidemiological' },
        { studyTitle: 'Post-Traumatic Headache After Mild TBI', journal: 'Neurology', year: 2019, keyFinding: 'Post-traumatic migraines develop in approximately 50% of military TBI cases and frequently become chronic, persisting years after the initial injury.', serviceConnectionRelevance: 'Supports secondary service connection for migraines following service-connected TBI.', evidenceType: 'longitudinal' },
      ],
      nexusPattern: 'The veteran\'s current migraine headache disorder is at least as likely as not caused by or secondary to [in-service TBI/cervical spine injury/military stress], given the temporal relationship between the in-service event and onset of migraine symptoms.',
    },
  },
  {
    conditionId: 'sciatica',
    conditionName: 'Sciatic Nerve Impairment',
    diagnosticCode: '8520',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Clinical diagnosis of sciatica with documentation of pain pattern from the lower back radiating down the posterior leg', dbqForm: '21-0960N-3' },
        { type: 'required', description: 'MRI of the lumbar spine showing disc pathology or stenosis causing sciatic nerve compression' },
        { type: 'strongly-recommended', description: 'NCS/EMG confirming sciatic nerve involvement and severity grading' },
      ],
      additionalTips: [
        'Sciatica is rated under DC 8520 (paralysis of the sciatic nerve) based on severity of incomplete paralysis.',
        'Sciatica should be rated separately from the underlying lumbar spine condition.',
        'Document whether symptoms are constant or intermittent, and whether motor weakness or muscle atrophy is present.',
        'If both legs are affected, each leg should receive a separate rating.',
      ],
    },
    exam: {
      examType: 'Peripheral Nerves Conditions',
      dbqFormNumber: '21-0960N-3',
      additionalTests: [
        { name: 'Straight Leg Raise Test', purpose: 'Screen for sciatic nerve tension and irritation', whatExaminerDocuments: 'Angle at which radicular pain is reproduced, distribution of symptoms, and whether contralateral SLR is also positive', ratingImpact: 'Positive result below 60 degrees strongly suggests nerve root compression at L4-S1 levels' },
      ],
      additionalPitfalls: [
        'Examiner diagnosing "back pain" without evaluating the sciatic nerve component separately',
        'Not testing motor strength in the L4-S1 distributions (ankle dorsiflexion, plantar flexion, great toe extension)',
        'Failing to order NCS/EMG when motor or sensory deficits are present',
      ],
    },
  },
  {
    conditionId: 'trigeminal-neuralgia',
    conditionName: 'Trigeminal Neuralgia',
    diagnosticCode: '8205',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Clinical diagnosis of trigeminal neuralgia with documentation of affected branch(es) (V1, V2, V3)', dbqForm: '21-0960N-1' },
        { type: 'required', description: 'Documentation of frequency and severity of neuralgic attacks, including triggers' },
        { type: 'strongly-recommended', description: 'Brain MRI to evaluate for neurovascular compression or other structural causes' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 10, keyEvidence: ['Moderate incomplete paralysis of the fifth cranial nerve'] },
        { ratingPercent: 30, keyEvidence: ['Severe incomplete paralysis of the fifth cranial nerve'] },
        { ratingPercent: 50, keyEvidence: ['Complete paralysis of the fifth cranial nerve'] },
      ],
      additionalTips: [
        'Trigeminal neuralgia is rated under DC 8205 (paralysis of the fifth cranial nerve) or DC 8405 (neuralgia).',
        'The maximum rating for neuralgia (DC 8405) is moderate incomplete paralysis. For higher ratings, the condition must be characterized as paralysis (DC 8205).',
        'Document the impact on eating, speaking, facial hygiene, and dental care.',
        'List all medications tried (carbamazepine, gabapentin, etc.) and their effectiveness.',
      ],
    },
    exam: {
      examType: 'Cranial Nerve Conditions',
      dbqFormNumber: '21-0960N-1',
      additionalPitfalls: [
        'Examiner not specifying which branch(es) of the trigeminal nerve are affected',
        'Evaluating during a pain-free interval and underestimating severity',
        'Not documenting triggers such as chewing, speaking, or light touch to the face',
      ],
    },
  },
  {
    conditionId: 'seizure-disorder',
    conditionName: 'Epilepsy / Seizure Disorder',
    diagnosticCode: '8910',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Diagnosis of epilepsy or seizure disorder confirmed by neurologist, with seizure type classification (grand mal, petit mal, focal, etc.)' },
        { type: 'required', description: 'EEG results documenting epileptiform activity' },
        { type: 'strongly-recommended', description: 'Seizure log documenting date, type, duration, and frequency of seizures over the past year' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 10, keyEvidence: ['Grand mal: confirmed diagnosis with history of seizures (DC 8910); Petit mal: brief episodes with minor seizure characteristics (DC 8911)'] },
        { ratingPercent: 20, keyEvidence: ['Grand mal: at least 1 major seizure in the last 2 years, or at least 2 minor seizures in the last 6 months'] },
        { ratingPercent: 40, keyEvidence: ['Grand mal: at least 1 major seizure in the last 6 months, or 2 major seizures in the last year'] },
        { ratingPercent: 60, keyEvidence: ['Grand mal: averaging at least 1 major seizure in 4 months over the last year, or 9 to 10 minor seizures per week'] },
        { ratingPercent: 80, keyEvidence: ['Grand mal: averaging at least 1 major seizure in 3 months over the last year, or more than 10 minor seizures weekly'] },
        { ratingPercent: 100, keyEvidence: ['Grand mal: averaging at least 1 major seizure per month over the last year'] },
      ],
      additionalTips: [
        'Seizure frequency is the primary determinant of the rating. Maintain a detailed seizure log.',
        'A "major" seizure involves loss of consciousness and generalized tonic-clonic activity. A "minor" seizure is a brief absence or partial seizure without loss of consciousness.',
        'Document post-ictal symptoms: confusion, fatigue, headache, muscle soreness.',
        'Note impact on driving privileges, employment restrictions, and safety concerns.',
      ],
    },
    exam: {
      examType: 'Epilepsy and Narcolepsy',
      additionalTests: [
        { name: 'EEG (Electroencephalogram)', purpose: 'Document epileptiform brain activity', whatExaminerDocuments: 'Presence or absence of epileptiform discharges, focal or generalized abnormalities, and correlation with seizure type', ratingImpact: 'Confirms diagnosis and type of seizure disorder for proper DC assignment (8910, 8911, 8912, 8914)' },
      ],
      additionalPitfalls: [
        'Normal EEG does not rule out epilepsy; interictal EEGs are normal in up to 50% of epilepsy patients',
        'Not documenting seizure frequency over the past year with specific dates',
        'Examiner not classifying seizure type (major vs. minor) per VA rating criteria',
      ],
    },
  },
  {
    conditionId: 'restless-leg-syndrome',
    conditionName: 'Restless Leg Syndrome',
    diagnosticCode: '8620',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Clinical diagnosis of restless leg syndrome meeting IRLSSG diagnostic criteria' },
        { type: 'required', description: 'Documentation of symptom frequency, severity, and impact on sleep quality' },
        { type: 'strongly-recommended', description: 'Sleep study results if RLS contributes to insomnia or sleep disruption' },
      ],
      additionalTips: [
        'RLS is typically rated by analogy under DC 8620 (neuritis of the sciatic nerve) or DC 8520 (paralysis of the sciatic nerve).',
        'Document how RLS affects sleep onset, sleep maintenance, and daytime functioning.',
        'If secondary to service-connected peripheral neuropathy, iron deficiency, or medications, establish the nexus.',
        'Ferritin levels should be tested, as low iron is a common treatable cause that the examiner should note.',
      ],
    },
    exam: {
      examType: 'Peripheral Nerves Conditions',
      dbqFormNumber: '21-0960N-3',
      additionalPitfalls: [
        'Examiner not familiar with the rating criteria for RLS, as it is rated by analogy',
        'Not documenting the frequency and severity of RLS episodes (nightly vs. intermittent)',
        'Failing to assess the secondary sleep impairment caused by RLS',
      ],
    },
  },
  {
    conditionId: 'parkinsons-disease',
    conditionName: 'Parkinson\'s Disease',
    diagnosticCode: '8004',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Diagnosis of Parkinson\'s disease from a neurologist with documentation of motor and non-motor symptoms' },
        { type: 'required', description: 'Documentation of disease stage and progression over time' },
        { type: 'strongly-recommended', description: 'Evidence linking to service: Agent Orange exposure (presumptive), TBI history, or toxic exposures' },
      ],
      additionalTips: [
        'Parkinson\'s disease is presumptive for Agent Orange exposure under 38 CFR 3.309(e).',
        'The minimum rating for Parkinson\'s under DC 8004 is 30%.',
        'Individual manifestations (tremor, rigidity, gait disturbance, cognitive decline) may also be rated separately if they exceed the minimum rating.',
        'Document all functional limitations: tremor severity, difficulty with fine motor tasks, balance problems, cognitive changes, speech difficulties.',
      ],
    },
    exam: {
      examType: 'Central Nervous System Diseases',
      additionalTests: [
        { name: 'Unified Parkinson Disease Rating Scale (UPDRS)', purpose: 'Standardized assessment of Parkinson\'s disease severity across motor and non-motor domains', whatExaminerDocuments: 'Scores across all four parts: non-motor experiences, motor experiences of daily living, motor examination, and motor complications', ratingImpact: 'Comprehensive severity assessment that supports the overall disability rating and identifies specific manifestations for potential separate ratings' },
      ],
      additionalPitfalls: [
        'Examiner evaluating during "on" medication state without documenting "off" state severity',
        'Not assessing non-motor symptoms: cognitive decline, depression, autonomic dysfunction, sleep disturbance',
        'Failing to identify separately ratable manifestations of Parkinson\'s disease',
      ],
    },
  },
  {
    conditionId: 'multiple-sclerosis',
    conditionName: 'Multiple Sclerosis',
    diagnosticCode: '8018',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Diagnosis of MS confirmed by neurologist with MRI evidence of demyelinating lesions' },
        { type: 'required', description: 'Documentation of disease course type (relapsing-remitting, secondary progressive, primary progressive)' },
        { type: 'strongly-recommended', description: 'Record of relapses with dates, symptoms, and recovery over time' },
      ],
      additionalTips: [
        'The minimum rating for MS under DC 8018 is 30%.',
        'MS that manifests within 7 years of separation is presumptively service-connected under 38 CFR 3.307(a)(3).',
        'Individual manifestations of MS (vision loss, bowel or bladder dysfunction, extremity weakness) can be rated separately if they exceed the minimum rating.',
        'Document all functional limitations during relapses and residual deficits between relapses.',
      ],
    },
    exam: {
      examType: 'Central Nervous System Diseases',
      additionalPitfalls: [
        'Examiner evaluating during remission and underestimating disease severity',
        'Not documenting the cumulative neurological deficits from prior relapses',
        'Failing to assess separately ratable manifestations (vision, bladder, extremity impairment)',
      ],
    },
  },
  {
    conditionId: 'als',
    conditionName: 'Amyotrophic Lateral Sclerosis (ALS)',
    diagnosticCode: '8017',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Diagnosis of ALS confirmed by a neurologist with EMG/NCS findings consistent with motor neuron disease' },
        { type: 'required', description: 'Documentation of current functional limitations across all domains' },
        { type: 'strongly-recommended', description: 'ALSFRS-R (ALS Functional Rating Scale-Revised) scores documenting disease progression' },
      ],
      additionalTips: [
        'ALS is presumptively service-connected for all veterans with 90 or more days of continuous active service per 38 CFR 3.318.',
        'There is no minimum period of service required for ALS presumptive service connection.',
        'ALS is rated at a minimum of 100% under DC 8017 from the date of diagnosis.',
        'In addition to the 100% base rating, individual manifestations may qualify for Special Monthly Compensation (SMC).',
      ],
    },
    exam: {
      examType: 'Central Nervous System Diseases',
      additionalPitfalls: [
        'Delays in adjudication when the condition is clearly documented, as ALS is progressive and fatal',
        'Not pursuing SMC for loss of use of extremities, need for aid and attendance, or housebound status',
        'Failing to document all functional limitations for potential SMC entitlement',
      ],
    },
  },
  // ============================================================
  // RESPIRATORY (8 conditions)
  // ============================================================
  {
    conditionId: 'sleep-apnea',
    conditionName: 'Obstructive Sleep Apnea',
    diagnosticCode: '6847',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Sleep study (polysomnography) confirming diagnosis of obstructive sleep apnea with AHI (apnea-hypopnea index) results', dbqForm: '21-0960J-1' },
        { type: 'required', description: 'Documentation of current treatment: CPAP usage, oral appliance, or other prescribed therapy' },
        { type: 'strongly-recommended', description: 'CPAP compliance data from machine download showing usage patterns over 30 to 90 days' },
      ],
      additionalRecommended: [
        { type: 'recommended', description: 'Buddy statements from spouse or roommate describing witnessed apnea events, loud snoring, and daytime somnolence' },
        { type: 'recommended', description: 'Nexus opinion if claiming as secondary to weight gain from service-connected conditions, medications, or PTSD-related sleep disruption' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 0, keyEvidence: ['Asymptomatic but with documented sleep study diagnosis'] },
        { ratingPercent: 30, keyEvidence: ['Persistent daytime hypersomnolence'] },
        { ratingPercent: 50, keyEvidence: ['Requires use of a breathing assistance device such as CPAP machine'] },
        { ratingPercent: 100, keyEvidence: ['Chronic respiratory failure with carbon dioxide retention, cor pulmonale, or requires tracheostomy'] },
      ],
      additionalTips: [
        'A current CPAP prescription is the key to a 50% rating. If you were prescribed CPAP, maintain documentation.',
        'The sleep study must be from a recognized facility. Home sleep tests may be accepted but in-lab polysomnography is preferred.',
        'If claiming secondary to another condition, common nexus theories include: weight gain from limited mobility, PTSD medications causing weight gain, or nasal/sinus conditions obstructing airways.',
        'VA has been scrutinizing sleep apnea claims more closely. Strong objective evidence from the sleep study is essential.',
      ],
    },
    exam: {
      examType: 'Sleep Apnea Conditions',
      dbqFormNumber: '21-0960J-1',
      additionalTests: [
        { name: 'Polysomnography (Sleep Study)', purpose: 'Definitively diagnose OSA and determine severity', whatExaminerDocuments: 'AHI (apnea-hypopnea index), oxygen desaturation nadir, sleep efficiency, and diagnosis severity classification (mild, moderate, severe)', ratingImpact: 'Confirms diagnosis; CPAP prescription resulting from the study is the primary evidence for the 50% rating' },
        { name: 'CPAP Compliance Report', purpose: 'Verify ongoing use of breathing assistance device', whatExaminerDocuments: 'Average hours of nightly use, percentage of nights used, and average AHI with treatment', ratingImpact: 'Confirms current CPAP requirement supporting the 50% rating level' },
      ],
      additionalRedFlags: [
        'Examiner states sleep apnea is not related to service when no nexus opinion was requested',
        'Sleep study is outdated or from a non-accredited facility',
        'CPAP was prescribed but veteran is not using it (may affect rating)',
      ],
      additionalPitfalls: [
        'Not obtaining a current sleep study if the last one was many years ago',
        'Failing to document CPAP usage and compliance',
        'Not providing buddy statements about snoring and witnessed apneas for corroboration',
      ],
    },
    rating: {
      ratingLevels: [
        { percent: 0, criteria: 'Asymptomatic but documented diagnosis', keywords: ['asymptomatic', 'documented'] },
        { percent: 30, criteria: 'Persistent daytime hypersomnolence', keywords: ['daytime sleepiness', 'hypersomnolence', 'fatigue'] },
        { percent: 50, criteria: 'Requires use of breathing assistance device such as CPAP', keywords: ['CPAP', 'breathing device', 'BiPAP', 'oral appliance'] },
        { percent: 100, criteria: 'Chronic respiratory failure with CO2 retention or cor pulmonale, or requires tracheostomy', keywords: ['respiratory failure', 'CO2 retention', 'cor pulmonale', 'tracheostomy'] },
      ],
      examTips: [
        'Bring your CPAP machine or a photo of it along with a compliance report.',
        'Describe how daytime sleepiness impacts your work, driving, and daily activities.',
        'If you cannot tolerate CPAP, explain why and what alternative treatments you use.',
      ],
      commonMistakes: [
        'Not having a current sleep study on file.',
        'Failing to document CPAP prescription and compliance.',
        'Not establishing a nexus for secondary service connection.',
      ],
    },
    literature: {
      additionalCitations: [
        { studyTitle: 'Obstructive Sleep Apnea in Military Personnel and Veterans', journal: 'Chest', year: 2018, keyFinding: 'Veterans have a significantly higher prevalence of OSA (20-30%) compared to the general population (5-15%), with PTSD, obesity, and TBI as major contributing factors.', serviceConnectionRelevance: 'Supports secondary service connection by establishing the link between military service-related conditions and OSA development.', evidenceType: 'epidemiological' },
        { studyTitle: 'Association Between PTSD and Obstructive Sleep Apnea', journal: 'Journal of Clinical Sleep Medicine', year: 2015, keyFinding: 'PTSD is independently associated with a 70% increased risk of developing OSA, even after controlling for BMI and other confounders.', serviceConnectionRelevance: 'Provides strong nexus support for secondary service connection of OSA to PTSD.', evidenceType: 'cohort' },
      ],
      nexusPattern: 'The veteran\'s obstructive sleep apnea is at least as likely as not caused by or aggravated by the service-connected [PTSD/weight gain from limited mobility/medication side effects], as supported by the temporal relationship and medical literature establishing the connection.',
    },
  },
  {
    conditionId: 'asthma',
    conditionName: 'Bronchial Asthma',
    diagnosticCode: '6602',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Pulmonary function testing (PFT/spirometry) showing FEV-1 and FEV-1/FVC ratio results', dbqForm: '21-0960L-2' },
        { type: 'required', description: 'Documentation of current medication regimen including inhaled vs. oral corticosteroid use' },
        { type: 'strongly-recommended', description: 'Service records showing asthma onset or exposure to respiratory irritants (burn pits, dust, chemicals) during service' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 10, keyEvidence: ['FEV-1 of 71 to 80 percent predicted, or FEV-1/FVC of 71 to 80 percent, or intermittent inhalational or oral bronchodilator therapy'] },
        { ratingPercent: 30, keyEvidence: ['FEV-1 of 56 to 70 percent predicted, or FEV-1/FVC of 56 to 70 percent, or daily inhalational or oral bronchodilator therapy, or inhalational anti-inflammatory medication'] },
        { ratingPercent: 60, keyEvidence: ['FEV-1 of 40 to 55 percent predicted, or FEV-1/FVC of 40 to 55 percent, or at least monthly visits to a physician for required care of exacerbations, or intermittent (at least three per year) courses of systemic (oral or parenteral) corticosteroids'] },
        { ratingPercent: 100, keyEvidence: ['FEV-1 less than 40 percent predicted, or FEV-1/FVC less than 40 percent, or more than one attack per week with episodes of respiratory failure, or requires daily use of systemic high-dose corticosteroids or immuno-suppressive medications'] },
      ],
      additionalTips: [
        'PFT results (FEV-1 and FEV-1/FVC ratio) or medication requirements determine the rating, whichever yields the higher evaluation.',
        'Document all medications: rescue inhalers, daily maintenance inhalers (ICS, ICS/LABA), oral steroids (prednisone), and frequency of use.',
        'If exposed to burn pits, file under the PACT Act provisions for enhanced eligibility.',
        'Keep records of ER visits and hospitalizations for asthma exacerbations.',
      ],
    },
    exam: {
      examType: 'Respiratory Conditions',
      dbqFormNumber: '21-0960L-2',
      additionalTests: [
        { name: 'Pulmonary Function Test (Spirometry)', purpose: 'Measure airflow limitation and bronchial reactivity', whatExaminerDocuments: 'Pre and post-bronchodilator FEV-1, FVC, FEV-1/FVC ratio, and DLCO values with percent predicted for each', ratingImpact: 'FEV-1 and FEV-1/FVC ratio directly determine rating brackets: 71-80% is 10%, 56-70% is 30%, 40-55% is 60%, below 40% is 100%' },
      ],
      additionalPitfalls: [
        'PFT performed during a good period may underestimate disease severity',
        'Examiner not documenting frequency and type of corticosteroid use',
        'Post-bronchodilator values used without documenting pre-bronchodilator baseline',
      ],
    },
  },
  {
    conditionId: 'sinusitis-chronic',
    conditionName: 'Chronic Sinusitis',
    diagnosticCode: '6510',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Diagnosis of chronic sinusitis with documentation of symptom duration (12+ weeks) and frequency of episodes' },
        { type: 'required', description: 'CT scan of the sinuses showing mucosal thickening, polyps, or chronic inflammatory changes' },
        { type: 'strongly-recommended', description: 'Documentation of antibiotic courses, number of non-incapacitating episodes, and incapacitating episodes per year' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 0, keyEvidence: ['Detected by X-ray only with no symptoms'] },
        { ratingPercent: 10, keyEvidence: ['One or two incapacitating episodes per year requiring prolonged (4-6 weeks) antibiotic treatment, or three to six non-incapacitating episodes per year with headaches, pain, and purulent discharge or crusting'] },
        { ratingPercent: 30, keyEvidence: ['Three or more incapacitating episodes per year requiring prolonged antibiotic treatment, or more than six non-incapacitating episodes per year'] },
        { ratingPercent: 50, keyEvidence: ['Following radical surgery with chronic osteomyelitis, or near-constant sinusitis with headaches, pain, tenderness, and purulent discharge or crusting after repeated surgeries'] },
      ],
      additionalTips: [
        'Track antibiotic courses per year carefully, as this drives the rating.',
        'An "incapacitating episode" requires antibiotic treatment lasting 4 to 6 weeks.',
        'CT scan evidence is stronger than X-ray for documenting chronic sinusitis severity.',
        'If exposed to burn pits, dust, or chemical irritants during service, document the exposure history.',
      ],
    },
    exam: {
      examType: 'Sinusitis, Rhinitis, and Other Conditions of the Nose, Throat, Larynx, and Pharynx',
      additionalPitfalls: [
        'Examiner not counting incapacitating vs. non-incapacitating episodes over the past year',
        'No CT imaging ordered to document chronic changes objectively',
        'Failing to document the number and duration of antibiotic courses',
      ],
    },
  },
  {
    conditionId: 'rhinitis',
    conditionName: 'Allergic Rhinitis',
    diagnosticCode: '6522',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Clinical diagnosis of allergic rhinitis with documentation of symptoms (nasal congestion, rhinorrhea, sneezing)' },
        { type: 'required', description: 'Documentation of whether nasal polyps are present and whether greater than 50% obstruction exists in both nasal passages' },
        { type: 'strongly-recommended', description: 'Allergy testing results and medication history' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 10, keyEvidence: ['Without polyps but with greater than 50 percent obstruction of nasal passage on both sides, or complete obstruction on one side'] },
        { ratingPercent: 30, keyEvidence: ['With polyps'] },
      ],
      additionalTips: [
        'DC 6522 provides only 10% and 30% ratings. The 30% requires documented nasal polyps.',
        'If rhinitis causes secondary sinusitis, claim that condition separately.',
        'Document the impact on breathing, sleep quality, and sense of smell.',
        'Environmental exposures during service (burn pits, dust storms, chemical irritants) can support service connection.',
      ],
    },
    exam: {
      examType: 'Sinusitis, Rhinitis, and Other Conditions',
      additionalPitfalls: [
        'Examiner not performing anterior rhinoscopy to assess obstruction percentage',
        'Not documenting the presence or absence of nasal polyps',
        'Failing to note the degree of nasal obstruction on each side separately',
      ],
    },
  },
  {
    conditionId: 'copd',
    conditionName: 'Chronic Obstructive Pulmonary Disease',
    diagnosticCode: '6604',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Pulmonary function testing (PFT/spirometry) with FEV-1, FEV-1/FVC ratio, and DLCO results', dbqForm: '21-0960L-2' },
        { type: 'required', description: 'Documentation of oxygen therapy requirements, if applicable' },
        { type: 'strongly-recommended', description: 'Service records showing exposure to respiratory irritants: burn pits, asbestos, chemicals, dust, or in-service smoking history' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 10, keyEvidence: ['FEV-1 of 71 to 80 percent predicted, or FEV-1/FVC of 71 to 80 percent, or DLCO of 66 to 80 percent predicted'] },
        { ratingPercent: 30, keyEvidence: ['FEV-1 of 56 to 70 percent predicted, or FEV-1/FVC of 56 to 70 percent, or DLCO of 56 to 65 percent predicted'] },
        { ratingPercent: 60, keyEvidence: ['FEV-1 of 40 to 55 percent predicted, or FEV-1/FVC of 40 to 55 percent, or DLCO of 40 to 55 percent predicted, or maximum oxygen consumption of 15 to 20 ml/kg/min'] },
        { ratingPercent: 100, keyEvidence: ['FEV-1 less than 40 percent predicted, or FEV-1/FVC less than 40 percent, or DLCO less than 40 percent predicted, or maximum exercise capacity less than 15 ml/kg/min, or cor pulmonale, right ventricular hypertrophy, pulmonary hypertension, or requires outpatient oxygen therapy'] },
      ],
      additionalTips: [
        'COPD rating is based on PFT results (FEV-1, FEV-1/FVC, or DLCO), whichever produces the highest evaluation.',
        'If you require supplemental oxygen therapy, document the prescription and usage.',
        'Burn pit exposure under the PACT Act expands eligibility for toxic exposure-related respiratory conditions.',
        'Document exercise tolerance and how breathing limitation affects daily activities and employment.',
      ],
    },
    exam: {
      examType: 'Respiratory Conditions',
      dbqFormNumber: '21-0960L-2',
      additionalTests: [
        { name: 'PFT with DLCO', purpose: 'Comprehensively assess pulmonary function for rating purposes', whatExaminerDocuments: 'FEV-1, FVC, FEV-1/FVC ratio, and DLCO values as percent of predicted, both pre and post-bronchodilator', ratingImpact: 'The most favorable single PFT value (FEV-1, FEV-1/FVC, or DLCO) determines the rating percentage' },
      ],
      additionalPitfalls: [
        'PFT not including DLCO measurement, which may provide a higher rating',
        'Examiner using post-bronchodilator values when pre-bronchodilator values are more favorable',
        'Not documenting supplemental oxygen requirements',
      ],
    },
  },
  {
    conditionId: 'pulmonary-embolism',
    conditionName: 'Pulmonary Embolism',
    diagnosticCode: '6817',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Documentation of pulmonary embolism event(s) with CT pulmonary angiography or V/Q scan results' },
        { type: 'required', description: 'Current PFT results if chronic pulmonary impairment exists as a residual' },
        { type: 'strongly-recommended', description: 'Documentation of anticoagulation therapy and duration of treatment' },
      ],
      ratingLevelEvidence: [
        { ratingPercent: 0, keyEvidence: ['Resolved PE with no residual symptoms'] },
        { ratingPercent: 30, keyEvidence: ['Symptomatic following resolution of PE; chronic anticoagulation required'] },
        { ratingPercent: 60, keyEvidence: ['Chronic pulmonary thromboembolism requiring anticoagulant therapy, or following inferior vena cava surgery without evidence of pulmonary hypertension or right ventricular dysfunction'] },
        { ratingPercent: 100, keyEvidence: ['Primary pulmonary hypertension; or chronic pulmonary thromboembolism with evidence of pulmonary hypertension, right ventricular dysfunction, or risk of recurrent PE'] },
      ],
      additionalTips: [
        'If PE occurred during service or as a complication of service-connected conditions or surgery, document the timeline.',
        'Chronic residuals such as exercise intolerance, dyspnea, and right heart strain should be documented.',
        'If on lifelong anticoagulation due to PE, this supports a compensable rating.',
      ],
    },
    exam: {
      examType: 'Respiratory Conditions',
      additionalPitfalls: [
        'Examiner considers the PE resolved without assessing for chronic residuals',
        'Not ordering echocardiogram to assess for pulmonary hypertension or right ventricular dysfunction',
        'Failing to document ongoing anticoagulation therapy requirements',
      ],
    },
  },
  {
    conditionId: 'bronchitis-chronic',
    conditionName: 'Chronic Bronchitis',
    diagnosticCode: '6600',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'Diagnosis of chronic bronchitis with PFT results including FEV-1 and DLCO', dbqForm: '21-0960L-2' },
        { type: 'required', description: 'Documentation of productive cough lasting at least 3 months per year for 2 consecutive years' },
        { type: 'strongly-recommended', description: 'Chest imaging and history of respiratory irritant exposure during military service' },
      ],
      additionalTips: [
        'Chronic bronchitis is rated using the same PFT-based criteria as other restrictive/obstructive lung diseases.',
        'FEV-1, FEV-1/FVC, and DLCO values determine the rating bracket.',
        'Document all respiratory exposures during service: burn pits, diesel exhaust, dust, chemicals.',
        'If bronchitis has progressed to COPD, the claim may be filed under DC 6604 for potentially more favorable criteria.',
      ],
    },
    exam: {
      examType: 'Respiratory Conditions',
      dbqFormNumber: '21-0960L-2',
      additionalPitfalls: [
        'PFT performed during symptom-free period underestimating disease severity',
        'Not documenting the chronic nature (3+ months per year for 2+ years)',
        'Examiner not ordering DLCO testing as part of the PFT',
      ],
    },
  },
  {
    conditionId: 'interstitial-lung-disease',
    conditionName: 'Interstitial Lung Disease',
    diagnosticCode: '6825',
    evidence: {
      additionalRequired: [
        { type: 'required', description: 'High-resolution CT (HRCT) of the chest showing interstitial lung disease pattern' },
        { type: 'required', description: 'PFT results including FVC, DLCO, and oxygen saturation with exercise' },
        { type: 'strongly-recommended', description: 'Documentation of environmental or occupational exposures during military service (asbestos, silica, burn pits, chemicals)' },
      ],
      additionalTips: [
        'ILD encompasses multiple conditions including idiopathic pulmonary fibrosis, asbestosis, and hypersensitivity pneumonitis.',
        'DLCO is often the most affected PFT value in ILD and may provide the highest rating.',
        'Burn pit exposure under the PACT Act has expanded eligibility for ILD claims.',
        'Document progressive shortness of breath, exercise intolerance, and oxygen requirements.',
      ],
    },
    exam: {
      examType: 'Respiratory Conditions',
      additionalTests: [
        { name: 'HRCT Chest', purpose: 'Identify pattern and extent of interstitial lung disease', whatExaminerDocuments: 'Distribution and pattern of interstitial changes (UIP, NSIP, etc.), presence of honeycombing, ground glass opacities, and traction bronchiectasis', ratingImpact: 'Confirms diagnosis and pattern, which affects prognosis and supports service connection to specific exposures' },
      ],
      additionalPitfalls: [
        'Not ordering HRCT and relying on standard chest X-ray, which may miss early ILD',
        'PFT not including DLCO, which is the most sensitive measure of gas exchange impairment in ILD',
        'Examiner not linking ILD pattern to documented military exposures',
      ],
    },
  },

