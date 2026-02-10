export interface VAFormEntry {
  formNumber: string;
  formTitle: string;
  shortTitle: string;
  purpose: string;
  useCases: string[];
  keywords: string[];
  conditionTypes?: string[];
  revisionDate?: string;
  vaUrl?: string;
  category: 'filing' | 'evidence' | 'appeal' | 'special' | 'medical' | 'employment';
}

export const vaFormGuide: VAFormEntry[] = [
  // === CORE FILING FORMS ===
  {
    formNumber: '21-526EZ',
    formTitle: 'Application for Disability Compensation and Related Compensation Benefits',
    shortTitle: 'Disability Compensation Application',
    purpose: 'The main form for filing a disability compensation claim. Use this for your initial claim, adding new conditions, or claiming an increase.',
    useCases: ['initial claim', 'new condition', 'increase', 'first time filing', 'adding conditions', 'supplemental claim'],
    keywords: ['disability', 'compensation', 'claim', 'file', 'apply', 'initial', 'increase', 'new condition', 'rating', '526'],
    category: 'filing',
    vaUrl: 'https://www.va.gov/find-forms/about-form-21-526ez/',
  },
  {
    formNumber: '21-0966',
    formTitle: 'Intent to File a Claim for Compensation and/or Pension',
    shortTitle: 'Intent to File',
    purpose: 'Locks in your effective date up to 1 year before you submit your full claim. File this FIRST to protect your back pay.',
    useCases: ['intent to file', 'ITF', 'effective date', 'back pay', 'start claim', 'lock in date'],
    keywords: ['intent', 'file', 'effective date', 'back pay', 'ITF', 'start', 'lock', 'date', '0966'],
    category: 'filing',
    vaUrl: 'https://www.va.gov/find-forms/about-form-21-0966/',
  },
  {
    formNumber: '21-4138',
    formTitle: 'Statement in Support of Claim',
    shortTitle: 'Personal Statement / Supporting Statement',
    purpose: 'Submit a written personal statement explaining your condition, how it started in service, and how it affects your daily life.',
    useCases: ['personal statement', 'supporting statement', 'written statement', 'explain condition', 'nexus', 'service connection'],
    keywords: ['statement', 'personal', 'support', 'explain', 'nexus', 'service connection', 'narrative', '4138'],
    category: 'evidence',
    vaUrl: 'https://www.va.gov/find-forms/about-form-21-4138/',
  },
  {
    formNumber: '21-10210',
    formTitle: 'Lay Witness Statement',
    shortTitle: 'Buddy Statement / Lay Witness Statement',
    purpose: 'A statement from someone who can attest to your condition — a fellow service member, spouse, friend, or family member who witnessed your symptoms or the in-service event.',
    useCases: ['buddy statement', 'lay witness', 'witness statement', 'third party', 'fellow service member', 'spouse statement'],
    keywords: ['buddy', 'lay', 'witness', 'statement', 'third party', 'spouse', 'service member', 'attest', '10210'],
    category: 'evidence',
    vaUrl: 'https://www.va.gov/find-forms/about-form-21-10210/',
  },
  {
    formNumber: '21-4142',
    formTitle: 'Authorization to Disclose Information to the Department of Veterans Affairs',
    shortTitle: 'Medical Records Release Authorization',
    purpose: 'Authorizes private doctors and hospitals to release your medical records to the VA. Use this when you have private (non-VA) treatment records.',
    useCases: ['medical records', 'authorization', 'release records', 'private doctor', 'hospital records', 'disclosure'],
    keywords: ['authorization', 'release', 'medical records', 'private', 'doctor', 'hospital', 'disclose', '4142'],
    category: 'evidence',
    vaUrl: 'https://www.va.gov/find-forms/about-form-21-4142/',
  },
  {
    formNumber: '21-0781',
    formTitle: 'Statement in Support of Claim for Service Connection for Post-Traumatic Stress Disorder (PTSD)',
    shortTitle: 'PTSD Stressor Statement',
    purpose: 'Describes the traumatic event(s) that caused your PTSD. Required for PTSD claims. Detail what happened, when, and where.',
    useCases: ['PTSD', 'stressor', 'trauma', 'combat PTSD', 'MST', 'traumatic event'],
    keywords: ['PTSD', 'stressor', 'trauma', 'combat', 'event', 'incident', 'post-traumatic', '0781'],
    conditionTypes: ['mental-health', 'ptsd'],
    category: 'filing',
    vaUrl: 'https://www.va.gov/find-forms/about-form-21-0781/',
  },
  {
    formNumber: '21-0781a',
    formTitle: 'Statement in Support of Claim for Service Connection for PTSD Secondary to Personal Assault',
    shortTitle: 'PTSD Personal Assault Statement',
    purpose: 'For PTSD claims based on personal assault (including MST — Military Sexual Trauma). Different evidence rules apply.',
    useCases: ['personal assault', 'MST', 'military sexual trauma', 'assault PTSD', 'sexual assault'],
    keywords: ['assault', 'personal', 'MST', 'sexual trauma', 'military sexual', '0781a'],
    conditionTypes: ['mental-health', 'ptsd'],
    category: 'filing',
    vaUrl: 'https://www.va.gov/find-forms/about-form-21-0781a/',
  },
  {
    formNumber: '21-8940',
    formTitle: "Veteran's Application for Increased Compensation Based on Unemployability",
    shortTitle: 'TDIU Application',
    purpose: 'Apply for Total Disability based on Individual Unemployability (TDIU). If your service-connected conditions prevent you from working, you may qualify for compensation at the 100% rate.',
    useCases: ['TDIU', 'unemployability', 'unable to work', 'total disability', 'individual unemployability', '100 percent'],
    keywords: ['TDIU', 'unemployability', 'work', 'employment', 'total', 'individual', '100%', '8940'],
    category: 'employment',
    vaUrl: 'https://www.va.gov/find-forms/about-form-21-8940/',
  },
  {
    formNumber: '20-0995',
    formTitle: 'Decision Review Request: Supplemental Claim',
    shortTitle: 'Supplemental Claim',
    purpose: 'File a supplemental claim with new and relevant evidence after a denial. This is the most common way to re-file after a denial.',
    useCases: ['supplemental claim', 'denied claim', 'new evidence', 'resubmit', 're-file', 'denial'],
    keywords: ['supplemental', 'denied', 'new evidence', 'decision review', 'resubmit', '0995'],
    category: 'appeal',
    vaUrl: 'https://www.va.gov/find-forms/about-form-20-0995/',
  },
  {
    formNumber: '20-0996',
    formTitle: 'Decision Review Request: Higher-Level Review',
    shortTitle: 'Higher-Level Review',
    purpose: 'Request a more experienced reviewer to re-examine your denied claim based on the same evidence. No new evidence allowed.',
    useCases: ['higher level review', 'HLR', 'denied claim', 'review', 'appeal', 'reconsideration'],
    keywords: ['higher level', 'HLR', 'review', 'denied', 'appeal', 'reconsideration', '0996'],
    category: 'appeal',
    vaUrl: 'https://www.va.gov/find-forms/about-form-20-0996/',
  },
  {
    formNumber: '10182',
    formTitle: 'Decision Review Request: Board Appeal (Notice of Disagreement)',
    shortTitle: 'Board Appeal / NOD',
    purpose: 'Appeal your claim decision to the Board of Veterans Appeals. Choose direct review, evidence submission, or a hearing.',
    useCases: ['board appeal', 'NOD', 'notice of disagreement', 'BVA', 'appeal', 'hearing'],
    keywords: ['board', 'appeal', 'NOD', 'disagreement', 'BVA', 'hearing', '10182'],
    category: 'appeal',
    vaUrl: 'https://www.va.gov/find-forms/about-form-10182/',
  },
  {
    formNumber: '21-0538',
    formTitle: 'Status of Dependents Questionnaire',
    shortTitle: 'Dependent Status',
    purpose: 'Report dependents (spouse, children, dependent parents) for additional compensation. Required when rated 30% or higher.',
    useCases: ['dependents', 'spouse', 'children', 'dependent parent', 'additional compensation', 'add dependent'],
    keywords: ['dependents', 'spouse', 'children', 'family', '30 percent', 'additional', '0538'],
    category: 'special',
    vaUrl: 'https://www.va.gov/find-forms/about-form-21-0538/',
  },
  {
    formNumber: '21-686c',
    formTitle: 'Declaration of Status of Dependents',
    shortTitle: 'Add/Remove Dependents',
    purpose: 'Add or remove dependents from your benefits. Use after marriage, birth, divorce, or when a child ages out.',
    useCases: ['add dependent', 'remove dependent', 'marriage', 'birth', 'divorce', 'child'],
    keywords: ['dependent', 'add', 'remove', 'marriage', 'birth', 'divorce', 'child', '686c'],
    category: 'special',
    vaUrl: 'https://www.va.gov/find-forms/about-form-21-686c/',
  },
  {
    formNumber: '21-22',
    formTitle: 'Appointment of Veterans Service Organization as Claimant Representative',
    shortTitle: 'Appoint VSO Representative',
    purpose: 'Appoint an accredited VSO (Veterans Service Organization) to represent you in your claim. Free representation.',
    useCases: ['VSO', 'representative', 'accredited representative', 'power of attorney', 'claim help'],
    keywords: ['VSO', 'representative', 'accredited', 'power of attorney', 'DAV', 'VFW', 'American Legion', '21-22'],
    category: 'special',
    vaUrl: 'https://www.va.gov/find-forms/about-form-21-22/',
  },
  {
    formNumber: '21-22a',
    formTitle: 'Appointment of Individual as Claimant Representative',
    shortTitle: 'Appoint Individual Representative (Attorney/Agent)',
    purpose: 'Appoint an accredited attorney or claims agent as your representative. May involve fees (unlike VSOs).',
    useCases: ['attorney', 'claims agent', 'individual representative', 'lawyer', 'legal representation'],
    keywords: ['attorney', 'lawyer', 'agent', 'claims agent', 'individual', 'representative', 'legal', '21-22a'],
    category: 'special',
    vaUrl: 'https://www.va.gov/find-forms/about-form-21-22a/',
  },
];

/**
 * Search VA forms by form number, title, purpose, use cases, or keywords.
 */
export function searchVAForms(query: string): VAFormEntry[] {
  if (!query || query.trim().length < 1) return vaFormGuide;

  const terms = query.toLowerCase().trim().split(/\s+/);

  const scored = vaFormGuide.map(form => {
    let score = 0;
    const normalizedFormNumber = form.formNumber.replace(/-/g, '').toLowerCase();

    for (const term of terms) {
      const termNormalized = term.replace(/-/g, '');

      // Exact form number match (highest priority)
      if (normalizedFormNumber === termNormalized) score += 200;
      // Form number contains query
      else if (normalizedFormNumber.includes(termNormalized)) score += 150;
      // Partial form number match
      else if (form.formNumber.toLowerCase().includes(term)) score += 100;

      // Short title match
      if (form.shortTitle.toLowerCase().includes(term)) score += 60;
      // Full title match
      if (form.formTitle.toLowerCase().includes(term)) score += 50;
      // Use cases match
      if (form.useCases.some(uc => uc.toLowerCase().includes(term))) score += 40;
      // Keywords match
      if (form.keywords.some(kw => kw.toLowerCase().includes(term))) score += 30;
      // Purpose match
      if (form.purpose.toLowerCase().includes(term)) score += 20;
      // Category match
      if (form.category.toLowerCase().includes(term)) score += 15;
    }

    return { form, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.form);
}

/**
 * Get forms related to a specific condition type.
 */
export function getFormsForConditionType(conditionType: string): VAFormEntry[] {
  return vaFormGuide.filter(f =>
    f.conditionTypes?.some(ct => ct.toLowerCase() === conditionType.toLowerCase())
  );
}

/**
 * Get forms by category.
 */
export function getFormsByCategory(category: VAFormEntry['category']): VAFormEntry[] {
  return vaFormGuide.filter(f => f.category === category);
}

export const formCategoryLabels: Record<VAFormEntry['category'], string> = {
  filing: 'Filing',
  evidence: 'Evidence',
  appeal: 'Appeal',
  special: 'Special',
  medical: 'Medical',
  employment: 'Employment',
};
