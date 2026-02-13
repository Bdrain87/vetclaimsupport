/**
 * Form Guide Data — Field-by-field definitions for VA forms
 *
 * Each form contains sections and fields with plain-language explanations
 * to help veterans understand and draft their form responses.
 */

export interface FormField {
  fieldId: string;
  section: string;
  label: string;
  explanation: string;
  placeholder: string;
  aiHelpPrompt?: string;
}

export interface FormGuideDefinition {
  formId: string;
  formTitle: string;
  description: string;
  useCase: string;
  whatToGather: string[];
  fields: FormField[];
}

// ---------------------------------------------------------------------------
// 21-526EZ — Application for Disability Compensation
// ---------------------------------------------------------------------------

const form526EZ: FormGuideDefinition = {
  formId: '21-526EZ',
  formTitle: 'Application for Disability Compensation and Related Compensation Benefits',
  description: 'The main application form for filing new claims, increases, or secondary service connection with the VA.',
  useCase: 'Filing new claims or increases',
  whatToGather: [
    'DD-214 or equivalent separation document',
    'Service Treatment Records (STRs)',
    'Private medical records showing current diagnosis',
    'List of all conditions you are claiming',
    'Names and addresses of treatment providers',
    'Any doctor summaries from physicians',
    'Buddy/lay statements supporting your claim',
    'Intent to File confirmation number (if filed VA Form 21-0966)',
  ],
  fields: [
    {
      fieldId: 'sec1_name',
      section: 'Section I — Veteran Identification',
      label: "Veteran's Full Legal Name",
      explanation: 'Enter your full legal name exactly as it appears on your DD-214 or military records. Include suffix (Jr., Sr., III) if applicable.',
      placeholder: 'e.g., John Michael Smith Jr.',
    },
    {
      fieldId: 'sec1_ssn',
      section: 'Section I — Veteran Identification',
      label: 'Social Security Number',
      explanation: 'Your SSN is used to identify your VA file. If you have a VA file number that differs, include both.',
      placeholder: 'XXX-XX-XXXX',
    },
    {
      fieldId: 'sec1_dob',
      section: 'Section I — Veteran Identification',
      label: 'Date of Birth',
      explanation: 'Your date of birth as shown on official records.',
      placeholder: 'MM/DD/YYYY',
    },
    {
      fieldId: 'sec1_address',
      section: 'Section I — Veteran Identification',
      label: 'Current Mailing Address',
      explanation: 'The address where the VA will send correspondence about your claim. Make sure this is current.',
      placeholder: 'Street, City, State, ZIP',
    },
    {
      fieldId: 'sec1_phone',
      section: 'Section I — Veteran Identification',
      label: 'Phone Number and Email',
      explanation: 'A reliable phone number and email so the VA can contact you about your claim.',
      placeholder: '(555) 555-5555 / email@example.com',
    },
    {
      fieldId: 'sec2_service_branch',
      section: 'Section II — Service Information',
      label: 'Branch of Service',
      explanation: 'The military branch you served in. If you served in multiple branches, list all with dates.',
      placeholder: 'e.g., United States Army',
      aiHelpPrompt: 'Format the veteran\'s branch of service in the official format used on VA forms.',
    },
    {
      fieldId: 'sec2_service_dates',
      section: 'Section II — Service Information',
      label: 'Dates of Active Service',
      explanation: 'The exact dates of your active duty service. Use the dates from your DD-214 Block 12.',
      placeholder: 'e.g., 03/15/2005 to 09/20/2012',
    },
    {
      fieldId: 'sec2_service_number',
      section: 'Section II — Service Information',
      label: 'Service Number (if different from SSN)',
      explanation: 'Only needed if you served before the military switched to SSN. Most post-1970 veterans can leave this blank.',
      placeholder: 'Enter if applicable',
    },
    {
      fieldId: 'sec3_claimed_conditions',
      section: 'Section III — Disabilities',
      label: 'List of Disabilities Being Claimed',
      explanation: 'List EVERY condition you are claiming, one per line. Use specific medical terminology when possible. Include whether each is new, an increase, or secondary to another condition. Be thorough — anything not listed here will not be considered.',
      placeholder: 'e.g., 1. Lumbar degenerative disc disease (new claim)\n2. Left knee patellofemoral syndrome (increase)\n3. Radiculopathy, left lower extremity (secondary to lumbar DDD)',
      aiHelpPrompt: 'Format the veteran\'s conditions list using proper VA medical terminology. Include diagnostic codes if known. Ensure each condition specifies claim type (new, increase, or secondary).',
    },
    {
      fieldId: 'sec3_onset_dates',
      section: 'Section III — Disabilities',
      label: 'Date Each Disability Began or Worsened',
      explanation: 'For each condition, when did symptoms first appear or when did a previously rated condition worsen? In-service dates are strongest. If you cannot recall exact dates, estimate to the nearest month/year.',
      placeholder: 'e.g., Lumbar DDD: approx. June 2008 (during deployment to Iraq)',
      aiHelpPrompt: 'Help the veteran describe the onset of their conditions with specific dates and circumstances tied to their service history.',
    },
    {
      fieldId: 'sec3_cause',
      section: 'Section III — Disabilities',
      label: 'Cause of Each Disability',
      explanation: 'Describe how each condition is connected to your military service. Was it caused by a specific event, exposure, or duty? For secondary claims, name the primary service-connected condition that caused or aggravated this one.',
      placeholder: 'e.g., Lumbar DDD caused by repeated heavy lifting and rucking during infantry duties. Radiculopathy secondary to lumbar DDD.',
      aiHelpPrompt: 'Translate the veteran\'s description of how their condition relates to service into clear VA-appropriate language establishing service connection or secondary connection.',
    },
    {
      fieldId: 'sec4_treatment_providers',
      section: 'Section IV — Treatment Records',
      label: 'VA and Private Treatment Providers',
      explanation: 'List all doctors, hospitals, and VA facilities that have treated you for these conditions. Include names, addresses, and dates of treatment. The VA will request records from VA facilities automatically, but needs authorization for private records.',
      placeholder: 'e.g., VA Medical Center, Phoenix AZ — 2013 to present\nDr. Jane Smith, Orthopedics, 123 Main St — 2019 to present',
    },
    {
      fieldId: 'sec5_supporting_evidence',
      section: 'Section V — Supporting Evidence',
      label: 'Evidence Being Submitted',
      explanation: 'List all supporting evidence you are including with your claim: doctor summaries, buddy statements, private medical records, service records, etc. Check the box for each type you are submitting.',
      placeholder: 'e.g., Doctor summary from Dr. Smith (attached)\nBuddy statement from SGT Jones (attached)\nPrivate orthopedic records 2019-2024 (attached)',
    },
    {
      fieldId: 'sec6_remarks',
      section: 'Section VI — Remarks',
      label: 'Additional Remarks',
      explanation: 'Use this space for anything else the VA should know. Examples: PACT Act eligibility, upcoming C&P exam concerns, deployment-related exposures, or clarification about your service history.',
      placeholder: 'e.g., I deployed to Iraq/Afghanistan and was exposed to burn pits per PACT Act presumptive conditions...',
      aiHelpPrompt: 'Help the veteran compose additional remarks that strengthen their claim, referencing relevant legal frameworks like the PACT Act, 38 CFR provisions, or presumptive conditions.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 21-0781 — Statement in Support of Claim for PTSD
// ---------------------------------------------------------------------------

const form0781: FormGuideDefinition = {
  formId: '21-0781',
  formTitle: 'Statement in Support of Claim for Service Connection for PTSD',
  description: 'Documents the specific stressor events that caused or contributed to your PTSD. Required for all PTSD claims.',
  useCase: 'PTSD stressor documentation',
  whatToGather: [
    'Dates of stressor events (as precise as possible)',
    'Locations where events occurred (base, city, country)',
    'Unit assigned to at the time',
    'Names of others involved or witnesses',
    'Description of what happened',
    'Any awards or decorations related to the event (Combat Action Badge, Purple Heart, etc.)',
    'Any official records documenting the event (incident reports, after-action reviews)',
  ],
  fields: [
    {
      fieldId: 'stressor1_date',
      section: 'Stressor Event #1',
      label: 'Date of Stressor Event',
      explanation: 'When did this traumatic event happen? Be as specific as possible — exact date is ideal, but month/year works. The VA will use this to verify through unit records.',
      placeholder: 'e.g., On or about March 15, 2009',
    },
    {
      fieldId: 'stressor1_location',
      section: 'Stressor Event #1',
      label: 'Location of Event',
      explanation: 'Where did this happen? Include base name, city, province/state, and country. The more specific you are, the easier it is for the VA to verify.',
      placeholder: 'e.g., FOB Shank, Logar Province, Afghanistan',
    },
    {
      fieldId: 'stressor1_unit',
      section: 'Stressor Event #1',
      label: 'Unit Assignment at Time of Event',
      explanation: 'What unit were you assigned to? Include company, battalion, brigade. This helps the VA verify the event through unit records and morning reports.',
      placeholder: 'e.g., B Company, 2nd Battalion, 506th Infantry Regiment, 101st Airborne Division',
    },
    {
      fieldId: 'stressor1_description',
      section: 'Stressor Event #1',
      label: 'Description of What Happened',
      explanation: 'Describe the event in detail. Include: what happened, your role, what you saw/heard/felt, injuries sustained, and the immediate aftermath. Be specific but focus on facts. You do not need to relive every detail — focus on what is relevant to your PTSD.',
      placeholder: 'Describe the event...',
      aiHelpPrompt: 'Help the veteran describe their PTSD stressor event in clear, factual language appropriate for a VA Form 21-0781. Maintain their original account while ensuring it includes the key elements VA raters look for: specific details, sensory experiences, threat to life, and emotional impact.',
    },
    {
      fieldId: 'stressor1_witnesses',
      section: 'Stressor Event #1',
      label: 'Names of Others Involved or Witnesses',
      explanation: 'List anyone who was present or can verify the event. Include their rank, name, and unit. If you do not remember names, describe their role (e.g., "my team leader" or "the medic who treated me").',
      placeholder: 'e.g., SSG Robert Johnson, B Co 2-506 IN; SPC Maria Garcia, medic',
    },
    {
      fieldId: 'stressor1_awards',
      section: 'Stressor Event #1',
      label: 'Related Awards, Decorations, or Documentation',
      explanation: 'List any combat-related awards, medals, or official documents related to this event. Combat awards (CAB, CIB, Purple Heart, etc.) can serve as stressor verification.',
      placeholder: 'e.g., Combat Infantryman Badge, Army Commendation Medal with V device',
    },
    {
      fieldId: 'stressor2_date',
      section: 'Stressor Event #2 (if applicable)',
      label: 'Date of Second Stressor Event',
      explanation: 'If you have additional stressor events, list them here. You can document multiple events that contributed to your PTSD.',
      placeholder: 'e.g., On or about July 2009',
    },
    {
      fieldId: 'stressor2_description',
      section: 'Stressor Event #2 (if applicable)',
      label: 'Description of Second Event',
      explanation: 'Describe the second stressor event with the same level of detail as the first.',
      placeholder: 'Describe the event...',
      aiHelpPrompt: 'Help the veteran describe their second PTSD stressor event in clear, factual language appropriate for a VA Form 21-0781.',
    },
    {
      fieldId: 'behavior_changes',
      section: 'Behavioral Changes After Event(s)',
      label: 'Changes in Behavior After Stressor Events',
      explanation: 'Describe how your behavior changed after these events. The VA looks for markers like: increased substance use, disciplinary problems, changes in performance, relationship difficulties, withdrawal from activities, hypervigilance, nightmares, avoidance behaviors.',
      placeholder: 'e.g., After the IED attack, I began having nightmares 3-4 times per week. I became hypervigilant and started avoiding crowded areas...',
      aiHelpPrompt: 'Help the veteran articulate behavioral changes after their trauma using clinical terminology that VA raters recognize as PTSD markers under 38 CFR Part 4.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 21-4138 — Statement in Support of Claim
// ---------------------------------------------------------------------------

const form4138: FormGuideDefinition = {
  formId: '21-4138',
  formTitle: 'Statement in Support of Claim',
  description: 'A general-purpose form for providing additional information, personal statements, or arguments supporting your VA disability claim.',
  useCase: 'General supporting statements',
  whatToGather: [
    'Your claim file number or SSN',
    'Specific details about the condition or issue you are addressing',
    'Dates, locations, and names relevant to your statement',
    'Any supporting evidence references',
    'Medical terminology for your conditions (if available)',
  ],
  fields: [
    {
      fieldId: 'header_info',
      section: 'Header Information',
      label: "Veteran's Name and Claim/File Number",
      explanation: 'Your full legal name and VA claim or file number. This connects your statement to your claim.',
      placeholder: 'John M. Smith, VA File #: XXXXXXXXX',
    },
    {
      fieldId: 'statement_subject',
      section: 'Statement',
      label: 'Subject/Re: Line',
      explanation: 'Clearly state what this statement is about. Reference the specific condition, claim type, or issue you are addressing.',
      placeholder: 'e.g., RE: Supplemental claim for service connection — lumbar degenerative disc disease',
    },
    {
      fieldId: 'statement_body',
      section: 'Statement',
      label: 'Your Statement',
      explanation: 'Write your statement here. Be specific, factual, and organized. Address: (1) What condition you are claiming, (2) How it is connected to your service, (3) How it affects your daily life, (4) What evidence supports your claim. Use dates, locations, and names whenever possible.',
      placeholder: 'I am writing to provide additional information in support of my claim for service connection for...',
      aiHelpPrompt: 'Rewrite the veteran\'s personal statement using professional VA claims language. Elevate plain English to clinical terminology while maintaining the veteran\'s truthful account. Structure the statement with clear service connection, current severity, and functional impact sections.',
    },
    {
      fieldId: 'statement_functional_impact',
      section: 'Statement',
      label: 'Functional Impact on Daily Life',
      explanation: 'Describe specifically how this condition affects your ability to work, perform daily activities, maintain relationships, and function. The VA rates based on functional loss — this section is critical.',
      placeholder: 'e.g., My back condition prevents me from sitting for more than 20 minutes, lifting more than 10 pounds, and has caused me to miss approximately 30 days of work in the past year...',
      aiHelpPrompt: 'Help the veteran describe functional impact using specific, measurable terms that align with VA rating criteria. Focus on frequency, duration, and severity of limitations.',
    },
    {
      fieldId: 'statement_evidence_refs',
      section: 'Statement',
      label: 'Evidence References',
      explanation: 'Reference any documents you are submitting or that are already in your VA file. Name specific records, letters, or statements that support your claim.',
      placeholder: 'e.g., See attached doctor summary from Dr. Smith dated 01/15/2024. See STR entry dated 06/20/2008 documenting back injury during PT.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 21-8940 — TDIU Application
// ---------------------------------------------------------------------------

const form8940: FormGuideDefinition = {
  formId: '21-8940',
  formTitle: 'Veterans Application for Increased Compensation Based on Unemployability (TDIU)',
  description: 'Application for Total Disability based on Individual Unemployability. Use this if your service-connected disabilities prevent you from maintaining substantially gainful employment.',
  useCase: 'Total Disability Individual Unemployability',
  whatToGather: [
    'List of all service-connected disabilities with current ratings',
    'Complete employment history for the past 5 years',
    'Education history (highest level completed)',
    'Any vocational training or certifications',
    'Documentation from employers about accommodations or terminations related to disabilities',
    'Statements from supervisors or coworkers about your limitations',
    'Records of days missed from work due to disabilities',
    'Social Security Disability determination (if applicable)',
  ],
  fields: [
    {
      fieldId: 'sec1_sc_disabilities',
      section: 'Section I — Service-Connected Disabilities',
      label: 'List of All Service-Connected Disabilities',
      explanation: 'List every service-connected disability, its current rating percentage, and when it was rated. For TDIU, you generally need one condition rated at 60%+ OR a combined rating of 70%+ with at least one condition at 40%+.',
      placeholder: 'e.g., 1. PTSD — 70%\n2. Lumbar DDD — 40%\n3. Tinnitus — 10%',
    },
    {
      fieldId: 'sec1_prevent_work',
      section: 'Section I — Service-Connected Disabilities',
      label: 'Which Disabilities Prevent You From Working',
      explanation: 'Identify which specific service-connected conditions prevent you from maintaining substantially gainful employment. Describe HOW each condition limits your ability to work.',
      placeholder: 'e.g., My PTSD causes severe concentration difficulties, inability to work around others, and frequent panic attacks that make it impossible to maintain employment...',
      aiHelpPrompt: 'Help the veteran articulate how their service-connected disabilities prevent substantially gainful employment. Use specific functional limitations and occupational impact language.',
    },
    {
      fieldId: 'sec2_employment_history',
      section: 'Section II — Employment History',
      label: 'Employment History (Last 5 Years)',
      explanation: 'List each job you held in the past 5 years. Include: employer name, job title, dates of employment, hours per week, highest earnings, and reason for leaving. If you left due to disability, clearly state that.',
      placeholder: 'e.g., ABC Company, Warehouse Worker, 01/2020 - 06/2022, 40 hrs/week, $45,000/yr. Left because back condition prevented lifting requirements.',
    },
    {
      fieldId: 'sec2_last_full_time',
      section: 'Section II — Employment History',
      label: 'Date You Last Worked Full-Time',
      explanation: 'When was the last date you were able to work a full-time schedule? This date affects your TDIU effective date.',
      placeholder: 'e.g., June 15, 2022',
    },
    {
      fieldId: 'sec2_lost_time',
      section: 'Section II — Employment History',
      label: 'Time Lost From Work Due to Disabilities',
      explanation: 'For each job, estimate the number of days you missed or left early due to your service-connected disabilities. Include any FMLA leave, sick days, or accommodations.',
      placeholder: 'e.g., Missed approximately 45 days in 2021 due to PTSD episodes and back flare-ups. Used all FMLA leave by March 2022.',
    },
    {
      fieldId: 'sec3_education',
      section: 'Section III — Education and Training',
      label: 'Education History',
      explanation: 'Highest level of education completed, any degrees, vocational training, or certifications. This helps the VA understand your employment capabilities.',
      placeholder: 'e.g., High school diploma. Completed MOS training (11B Infantry). No college degree.',
    },
    {
      fieldId: 'sec3_additional_training',
      section: 'Section III — Education and Training',
      label: 'Additional Training or Certifications',
      explanation: 'Any post-military training, trade certifications, or skills. If your disabilities prevent you from using these skills, explain why.',
      placeholder: 'e.g., Obtained CDL in 2018 but can no longer drive commercially due to medication side effects from PTSD treatment.',
    },
    {
      fieldId: 'sec4_remarks',
      section: 'Section IV — Remarks',
      label: 'Additional Remarks',
      explanation: 'Use this section to provide any additional information about how your disabilities prevent employment. Describe a typical day, failed work attempts, or any other relevant information.',
      placeholder: 'e.g., I have attempted to return to work three times since 2022 but each attempt resulted in leaving within 2-4 weeks due to...',
      aiHelpPrompt: 'Help the veteran compose TDIU remarks that clearly establish how their service-connected disabilities in combination prevent them from securing and maintaining substantially gainful employment, using language consistent with 38 CFR 4.16.',
    },
  ],
};

// ---------------------------------------------------------------------------
// All form guide definitions
// ---------------------------------------------------------------------------

export const formGuideDefinitions: FormGuideDefinition[] = [
  form526EZ,
  form0781,
  form4138,
  form8940,
];

export function getFormGuideById(formId: string): FormGuideDefinition | undefined {
  return formGuideDefinitions.find((f) => f.formId === formId);
}

export function searchFormGuides(query: string): FormGuideDefinition[] {
  if (!query.trim()) return formGuideDefinitions;
  const lower = query.toLowerCase();
  return formGuideDefinitions.filter(
    (f) =>
      f.formId.toLowerCase().includes(lower) ||
      f.formTitle.toLowerCase().includes(lower) ||
      f.description.toLowerCase().includes(lower) ||
      f.useCase.toLowerCase().includes(lower) ||
      f.fields.some((field) => field.label.toLowerCase().includes(lower))
  );
}
