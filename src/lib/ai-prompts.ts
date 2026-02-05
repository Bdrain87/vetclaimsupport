/**
 * AI Prompt Templates
 *
 * Centralized prompt templates for all AI operations.
 * Uses consistent structure and VA-specific terminology.
 */

/**
 * AI_CONFIG — Persona-based configuration for the AI Examiner,
 * VA-Speak Translator, and Nexus Letter Generator.
 */
export const AI_CONFIG = {
  EXAMINER_PERSONA: `
    Role: Board-Certified VA Medical Examiner (C&P).
    Objective: Conduct a mock exam for 38 CFR Part 4 (VASRD) preparation.
    Logic: Ask one targeted question at a time. Focus on 'Frequency, Severity, and Duration.'
    Terminology: Explain 'prostrating attacks' and 'functional loss' if user is vague.
    Footer: "Educational Mapping based on 38 CFR Part 4. Not medical or legal advice."
  `,
  VA_SPEAK_TRANSLATOR: `
    Role: VA Claims Clinical Specialist.
    Objective: Translate 'Plain English' into 38 CFR terminology for Form 21-4138.
    Mapping:
    - "Knees pop/hurt" -> "Bilateral patellofemoral crepitus with mechanical instability."
    - "Ringing stops sleep" -> "Chronic tinnitus with secondary insomnia."
    Instruction: Maintain veteran's intent but use professional clinical nomenclature.
  `
};

/**
 * NEXUS_PROMPT — Structured Nexus Letter drafting prompt with
 * required VA medical-legal phraseology and C-File review template.
 */
export const NEXUS_PROMPT = {
  STRENGTHEN_CLAIM: `
    Role: VA Medical-Legal Consultant.
    Task: Draft a Nexus Letter outline for a service-connected disability.
    Required Phraseology: Use "At least as likely as not" (50% or greater probability).
    Structure:
    1. Veteran Service History Summary (Dates/MOS).
    2. Current Clinical Diagnosis (ICD-10/DSM-5).
    3. The 'Nexus' (Scientific link between service event and current diagnosis).
    4. Supporting Medical Literature citation placeholders.
    5. Closing: "Based on my review of the Veteran's C-File and clinical presentation..."
    Legal Footer: "This is a draft outline for a qualified medical professional to review and sign. Not legal or medical advice."
  `
};

/**
 * System prompts for different AI roles
 */
export const SYSTEM_PROMPTS = {
  /**
   * VA Disability Claims Analyst
   */
  claimsAnalyst: `You are an expert VA disability claims analyst with extensive knowledge of:
- 38 CFR Part 4 (VA Schedule for Rating Disabilities)
- VA claims process and requirements
- Service connection principles
- Secondary service connection criteria
- Nexus letter requirements
- C&P examination procedures

Your role is to help veterans understand their potential claims based on their evidence.

IMPORTANT GUIDELINES:
1. Always use proper VA terminology
2. Never provide medical diagnoses - suggest conditions for discussion with healthcare providers
3. Always mention the importance of nexus letters for secondary claims
4. Reference relevant diagnostic codes when applicable
5. Be encouraging but realistic about evidence requirements
6. Always recommend consulting with a VSO (Veterans Service Organization)`,

  /**
   * Nexus Letter Template Generator
   */
  nexusLetterGenerator: `You are a medical documentation specialist helping veterans prepare nexus letter templates for their doctors.

GUIDELINES:
1. Use proper medical terminology
2. Include the key phrase "at least as likely as not" (50% probability or greater)
3. Structure letters with: patient history, current diagnosis, medical opinion, rationale
4. Reference relevant medical literature and VA diagnostic codes
5. Leave placeholders for doctor-specific information
6. Always include disclaimer that doctor must review and sign`,

  /**
   * Personal Statement Generator
   */
  personalStatementGenerator: `You are helping a veteran write a personal statement for their VA disability claim.

GUIDELINES:
1. Write in first-person perspective
2. Focus on specific incidents, symptoms, and impacts
3. Include dates and locations when possible
4. Describe how the condition affects daily life and work
5. Mention any lay evidence or buddy statements available
6. Be honest and specific - avoid exaggeration
7. Connect current symptoms to service events`,

  /**
   * C&P Exam Prep Guide
   */
  cpExamPrep: `You are preparing a veteran for their Compensation & Pension (C&P) examination.

GUIDELINES:
1. Explain what to expect during the exam
2. Provide condition-specific questions the examiner may ask
3. Remind veteran to describe their WORST day symptoms
4. Advise on documentation to bring
5. Explain the importance of being honest but thorough
6. Cover functional impact and limitations
7. Never coach veteran to exaggerate or lie`,
};

/**
 * Format user data for disability analysis
 */
export function formatDisabilityAnalysisPrompt(userData: {
  medicalVisits?: Array<{ date?: string; provider?: string; reason?: string; notes?: string }>;
  exposures?: Array<{ type?: string; location?: string; duration?: string; description?: string }>;
  symptoms?: Array<{ symptom?: string; severity?: number; frequency?: string; startDate?: string }>;
  medications?: Array<{ name?: string; dosage?: string; reason?: string }>;
  serviceHistory?: Array<{ branch?: string; startDate?: string; endDate?: string; mos?: string }>;
}): string {
  const sections: string[] = [];

  // Service History
  if (userData.serviceHistory?.length) {
    sections.push('SERVICE HISTORY:');
    userData.serviceHistory.forEach(s => {
      const parts = [s.branch, s.mos, s.startDate && s.endDate ? `${s.startDate} to ${s.endDate}` : null]
        .filter(Boolean);
      sections.push(`- ${parts.join(', ')}`);
    });
    sections.push('');
  }

  // Medical Visits
  if (userData.medicalVisits?.length) {
    sections.push('MEDICAL VISITS:');
    userData.medicalVisits.slice(0, 20).forEach(v => {
      sections.push(`- ${v.date || 'Unknown date'}: ${v.reason || 'Unknown reason'}${v.provider ? ` (${v.provider})` : ''}`);
      if (v.notes) sections.push(`  Notes: ${v.notes.substring(0, 200)}`);
    });
    sections.push('');
  }

  // Symptoms
  if (userData.symptoms?.length) {
    sections.push('CURRENT SYMPTOMS:');
    userData.symptoms.slice(0, 20).forEach(s => {
      const severity = s.severity ? ` (severity: ${s.severity}/10)` : '';
      const freq = s.frequency ? `, ${s.frequency}` : '';
      sections.push(`- ${s.symptom}${severity}${freq}`);
    });
    sections.push('');
  }

  // Medications
  if (userData.medications?.length) {
    sections.push('MEDICATIONS:');
    userData.medications.slice(0, 15).forEach(m => {
      sections.push(`- ${m.name}${m.dosage ? ` ${m.dosage}` : ''}${m.reason ? ` for ${m.reason}` : ''}`);
    });
    sections.push('');
  }

  // Exposures
  if (userData.exposures?.length) {
    sections.push('EXPOSURES:');
    userData.exposures.slice(0, 10).forEach(e => {
      sections.push(`- ${e.type}${e.location ? ` at ${e.location}` : ''}${e.duration ? ` (${e.duration})` : ''}`);
      if (e.description) sections.push(`  Details: ${e.description.substring(0, 150)}`);
    });
    sections.push('');
  }

  return sections.join('\n');
}

/**
 * Generate disability analysis prompt
 */
export function createDisabilityAnalysisPrompt(formattedData: string): string {
  return `Based on the following veteran evidence, suggest VA disabilities they may qualify for.

${formattedData}

Analyze this evidence and provide:
1. Suggested conditions with evidence strength (Strong/Moderate/Needs More Evidence)
2. Supporting evidence from the data provided
3. Additional evidence needed
4. Typical VA rating range
5. Brief reasoning for each suggestion

Format as a structured analysis focusing on service-connectable conditions.
Only suggest conditions supported by the evidence provided.
Always recommend consulting healthcare providers for diagnosis.`;
}

/**
 * Generate nexus letter prompt
 */
export function createNexusLetterPrompt(params: {
  veteranName: string;
  conditionName: string;
  primaryCondition?: string;
  serviceStart: string;
  serviceEnd: string;
  symptoms: string[];
  medicalHistory: string;
}): string {
  const isSecondary = Boolean(params.primaryCondition);

  return `Generate a nexus letter template for:

VETERAN: ${params.veteranName}
CONDITION: ${params.conditionName}
${isSecondary ? `PRIMARY CONDITION (for secondary claim): ${params.primaryCondition}` : ''}
SERVICE DATES: ${params.serviceStart} to ${params.serviceEnd}

RELEVANT SYMPTOMS:
${params.symptoms.map(s => `- ${s}`).join('\n')}

MEDICAL HISTORY:
${params.medicalHistory}

Generate a professional nexus letter template with:
1. Proper header with date and RE: line
2. Doctor introduction section
3. Patient history summary
4. ${isSecondary ? 'Medical opinion connecting secondary to primary condition' : 'Medical opinion connecting condition to service'}
5. The key phrase "at least as likely as not" (50% or greater probability)
6. Medical rationale citing relevant mechanisms
7. References to medical literature if applicable
8. Signature block with placeholders

Include [BRACKETS] for information the doctor must fill in.
Include a disclaimer that this is a template only.`;
}

/**
 * Generate personal statement prompt
 */
export function createPersonalStatementPrompt(params: {
  veteranName: string;
  condition: string;
  incidentDescription: string;
  currentSymptoms: string[];
  dailyImpact: string;
  serviceInfo: {
    branch: string;
    mos?: string;
    deployments?: string;
  };
}): string {
  return `Help write a personal statement for a VA disability claim:

VETERAN: ${params.veteranName}
CONDITION: ${params.condition}
BRANCH: ${params.serviceInfo.branch}
${params.serviceInfo.mos ? `MOS: ${params.serviceInfo.mos}` : ''}
${params.serviceInfo.deployments ? `DEPLOYMENTS: ${params.serviceInfo.deployments}` : ''}

IN-SERVICE EVENT/ONSET:
${params.incidentDescription}

CURRENT SYMPTOMS:
${params.currentSymptoms.map(s => `- ${s}`).join('\n')}

DAILY LIFE IMPACT:
${params.dailyImpact}

Write a compelling personal statement that:
1. Opens with service period and branch
2. Describes the in-service event or onset of symptoms
3. Details the progression of symptoms over time
4. Explains current symptoms and their frequency/severity
5. Describes specific impacts on daily activities, work, and relationships
6. Mentions any supporting evidence (buddy statements, medical records)
7. Closes with a request for service connection

Write in first person.
Be specific with dates and incidents.
Focus on facts, not emotions.
Keep it under 1000 words.`;
}

/**
 * Generate C&P exam prep prompt
 */
export function createCPExamPrepPrompt(params: {
  condition: string;
  diagnosticCode?: string;
  currentSymptoms: string[];
  currentTreatments: string[];
}): string {
  return `Create a C&P exam preparation guide for:

CONDITION: ${params.condition}
${params.diagnosticCode ? `DIAGNOSTIC CODE: ${params.diagnosticCode}` : ''}

CURRENT SYMPTOMS:
${params.currentSymptoms.map(s => `- ${s}`).join('\n')}

CURRENT TREATMENTS:
${params.currentTreatments.map(t => `- ${t}`).join('\n')}

Provide:
1. What to expect during this specific type of exam
2. Common questions the examiner will ask
3. Tests or measurements they may perform
4. What documentation to bring
5. Tips for accurately describing symptoms (focus on worst days)
6. Range of motion or functional tests to expect (if applicable)
7. Red flags to avoid (inconsistencies, exaggeration)
8. Questions you can ask the examiner

Be specific to the condition and its rating criteria.
Reference relevant sections of 38 CFR Part 4 if applicable.`;
}

/**
 * Generate claim strategy prompt
 */
export function createClaimStrategyPrompt(params: {
  serviceInfo: {
    branch: string;
    startDate: string;
    endDate: string;
    deployments: string;
    combatZones: string[];
    mos: string;
  };
  conditions: string[];
  existingRating: number;
  existingConditions: string[];
  availableEvidence: {
    hasMedicalRecords: boolean;
    hasServiceRecords: boolean;
    hasBuddyStatements: boolean;
    hasNexusLetter: boolean;
    hasPrivateMedical: boolean;
  };
}): string {
  return `Create a VA disability claim strategy for:

SERVICE INFO:
- Branch: ${params.serviceInfo.branch}
- Service: ${params.serviceInfo.startDate} to ${params.serviceInfo.endDate}
- MOS: ${params.serviceInfo.mos}
- Deployments: ${params.serviceInfo.deployments}
- Combat Zones: ${params.serviceInfo.combatZones.join(', ') || 'None listed'}

CONDITIONS TO CLAIM:
${params.conditions.map(c => `- ${c}`).join('\n')}

EXISTING VA RATING: ${params.existingRating}%
ALREADY RATED CONDITIONS:
${params.existingConditions.map(c => `- ${c}`).join('\n') || 'None'}

AVAILABLE EVIDENCE:
- Medical Records: ${params.availableEvidence.hasMedicalRecords ? 'Yes' : 'No'}
- Service Records: ${params.availableEvidence.hasServiceRecords ? 'Yes' : 'No'}
- Buddy Statements: ${params.availableEvidence.hasBuddyStatements ? 'Yes' : 'No'}
- Nexus Letters: ${params.availableEvidence.hasNexusLetter ? 'Yes' : 'No'}
- Private Medical: ${params.availableEvidence.hasPrivateMedical ? 'Yes' : 'No'}

Provide a comprehensive strategy including:
1. Summary of recommended approach
2. Filing type (new claim, increase, supplemental)
3. Priority conditions to file first (with reasons and estimated ratings)
4. Evidence gaps that need to be filled
5. Timeline recommendation
6. Next steps in order
7. Potential challenges or warnings

Consider:
- VA combined rating math
- Secondary service connection opportunities
- Presumptive conditions based on service era/location
- BDD eligibility if within 180 days of discharge`;
}
