export interface AppealLane {
  id: string;
  name: string;
  shortName: string;
  form: string;
  description: string;
  timeline: string;
  averageDays: number;
  newEvidenceAllowed: boolean;
  hearingAvailable: boolean;
  reviewerType: string;
  bestFor: string[];
  process: string[];
  tips: string[];
  commonMistakes: string[];
}

export interface AppealDeadline {
  situation: string;
  deadline: string;
  form: string;
  notes: string;
}

export interface AppealForm {
  number: string;
  name: string;
  purpose: string;
  url: string;
}

export const appealLanes: AppealLane[] = [
  {
    id: 'supplemental',
    name: 'Supplemental Claim',
    shortName: 'Supplemental',
    form: 'VA Form 20-0995',
    description: 'File new and relevant evidence to support your claim. The VA will review the claim with the additional evidence.',
    timeline: '4-5 months average',
    averageDays: 125,
    newEvidenceAllowed: true,
    hearingAvailable: false,
    reviewerType: 'Regional Office claims processor',
    bestFor: [
      'You have new medical evidence (nexus letter, DBQ, treatment records)',
      'You obtained a new diagnosis or medical opinion',
      'You have new service records or buddy statements',
      'Your condition has worsened since the denial'
    ],
    process: [
      'Obtain new and relevant evidence',
      'Complete VA Form 20-0995',
      'Submit form with or identify new evidence',
      'VA issues duty to assist for identified evidence',
      'Claims processor reviews entire file with new evidence',
      'Decision issued'
    ],
    tips: [
      'The single most important thing is a strong nexus letter from a qualified medical professional',
      'New and relevant means evidence not previously in the file that relates to the reason for denial',
      'You can submit multiple supplemental claims — there is no limit',
      'If denied for lack of diagnosis, get a current diagnosis. If denied for lack of nexus, get a nexus letter. If denied for lack of in-service event, get buddy statements.'
    ],
    commonMistakes: [
      'Filing without actually new evidence (resubmitting same records)',
      'Not addressing the specific reason for the previous denial',
      'Missing the connection between new evidence and the denial reason'
    ]
  },
  {
    id: 'hlr',
    name: 'Higher-Level Review',
    shortName: 'HLR',
    form: 'VA Form 20-0996',
    description: 'A senior reviewer takes a fresh look at your existing evidence. No new evidence is allowed, but the reviewer checks for clear and obvious errors.',
    timeline: '4-5 months average',
    averageDays: 125,
    newEvidenceAllowed: false,
    hearingAvailable: true, // informal conference
    reviewerType: 'Senior reviewer (Decision Review Officer)',
    bestFor: [
      'You believe the VA made a clear error in applying the rating criteria',
      'The evidence already in your file supports a higher rating',
      'You want to request an informal conference to explain your case',
      'The denial seems based on a misreading of your medical records'
    ],
    process: [
      'Complete VA Form 20-0996',
      'Optionally request an informal conference',
      'Senior reviewer examines entire claims file',
      'If informal conference requested, phone call scheduled',
      'Reviewer may identify duty-to-assist errors (returns to regional office)',
      'Decision issued'
    ],
    tips: [
      'Request the informal conference — it gives you a chance to point out specific errors',
      'Prepare talking points for the conference focusing on where VA went wrong',
      'The reviewer can only look at evidence already in the file',
      'If the reviewer finds a duty-to-assist error, the claim returns to the regional office which is favorable'
    ],
    commonMistakes: [
      'Choosing HLR when you actually need new evidence (should use Supplemental)',
      'Not requesting the informal conference',
      'Not being specific about what error was made during the conference'
    ]
  },
  {
    id: 'board',
    name: 'Board Appeal (BVA)',
    shortName: 'Board Appeal',
    form: 'VA Form 10182',
    description: 'Appeal to the Board of Veterans\' Appeals for a decision by a Veterans Law Judge. Three docket options available.',
    timeline: 'Direct Review: ~1 year, Evidence: ~1.5 years, Hearing: ~2+ years',
    averageDays: 550, // average across dockets
    newEvidenceAllowed: true, // on evidence and hearing dockets
    hearingAvailable: true, // on hearing docket
    reviewerType: 'Veterans Law Judge',
    bestFor: [
      'Your case involves complex legal or medical issues',
      'You have been denied at the regional office level multiple times',
      'You want a formal hearing with a judge',
      'You have a VSO or attorney who recommends Board appeal'
    ],
    process: [
      'Complete VA Form 10182',
      'Select docket: Direct Review, Evidence Submission, or Hearing',
      'Wait for case to reach front of docket',
      'Judge reviews (Direct), accepts evidence (Evidence), or holds hearing (Hearing)',
      'Board decision issued — Grant, Deny, or Remand'
    ],
    tips: [
      'Direct Review docket is fastest but no new evidence allowed',
      'Evidence Submission docket allows 90 days to submit new evidence after filing',
      'Hearing docket is slowest but allows you to testify and submit evidence',
      'Board remands are common and send the case back for further development — this is often positive',
      'Consider hiring an accredited attorney for Board appeals'
    ],
    commonMistakes: [
      'Choosing the hearing docket without strong testimony to offer (adds years of wait)',
      'Not submitting evidence within the 90-day window on the evidence docket',
      'Going to the Board without first trying Supplemental or HLR'
    ]
  }
];

// Appeal deadlines
export const appealDeadlines: AppealDeadline[] = [
  {
    situation: 'After initial claim decision',
    deadline: '1 year from decision date',
    form: 'Any (20-0995, 20-0996, or 10182)',
    notes: 'Filing within 1 year preserves your effective date. After 1 year, effective date resets to new filing date.'
  },
  {
    situation: 'After Higher-Level Review decision',
    deadline: '1 year from HLR decision',
    form: 'VA Form 20-0995 (Supplemental) or VA Form 10182 (Board)',
    notes: 'Cannot file another HLR after HLR. Must choose Supplemental or Board.'
  },
  {
    situation: 'After Board decision',
    deadline: '120 days for CAVC appeal, or file Supplemental at any time',
    form: 'Notice of Appeal to CAVC or VA Form 20-0995',
    notes: 'CAVC appeal requires filing at Court of Appeals for Veterans Claims. Supplemental claim with new evidence has no deadline.'
  },
  {
    situation: 'After Supplemental Claim decision',
    deadline: '1 year from decision',
    form: 'Any lane',
    notes: 'Can file another Supplemental, HLR, or Board appeal.'
  }
];

// Required forms
export const appealForms: AppealForm[] = [
  {
    number: '20-0995',
    name: 'Decision Review Request: Supplemental Claim',
    purpose: 'Filing a supplemental claim with new and relevant evidence',
    url: 'https://www.va.gov/find-forms/about-form-20-0995/'
  },
  {
    number: '20-0996',
    name: 'Decision Review Request: Higher-Level Review',
    purpose: 'Requesting a senior reviewer re-examine existing evidence',
    url: 'https://www.va.gov/find-forms/about-form-20-0996/'
  },
  {
    number: '10182',
    name: 'Decision Review Request: Board Appeal',
    purpose: 'Appealing to the Board of Veterans\' Appeals',
    url: 'https://www.va.gov/find-forms/about-form-10182/'
  },
  {
    number: '21-0966',
    name: 'Intent to File',
    purpose: 'Establishing an effective date while gathering evidence (gives 1 year to file)',
    url: 'https://www.va.gov/find-forms/about-form-21-0966/'
  }
];

// General appeal strategy guidance
export const appealStrategyGuidance = {
  deniedForNoNexus: 'File a Supplemental Claim with a strong nexus letter from an independent medical professional. The nexus letter should address the specific reason for denial and provide a medical rationale.',
  deniedForNoDiagnosis: 'Obtain a current diagnosis through a private provider or VA treatment, then file a Supplemental Claim with the new diagnosis documentation.',
  deniedForNoInServiceEvent: 'Gather buddy statements, service records, or personnel records that document the in-service event, then file a Supplemental Claim.',
  lowRating: 'If your condition has worsened, file for an increase. If the rating was wrong based on existing evidence, file an HLR. If you have new medical evidence showing severity, file a Supplemental.',
  multipleConditions: 'Each condition can be on a different appeal lane simultaneously. Consider which lane is best for each individual condition.',
  preserveEffectiveDate: 'Always file within 1 year of a decision to preserve your effective date. If you need more time to gather evidence, file an Intent to File (VA Form 21-0966).',
};
