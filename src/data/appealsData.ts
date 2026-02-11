// Appeals Guide Data - Appeal Lanes & Verified Case Law
// All case citations are real, published decisions from the cited courts.
// Do NOT add cases to this file unless they have been independently verified.

// ============================================================================
// DISCLAIMER
// ============================================================================

export const CASE_LAW_DISCLAIMER = `IMPORTANT DISCLAIMER: The case law summaries and appeal lane descriptions provided here are for general educational and informational purposes only. They do NOT constitute legal advice. Case holdings have been simplified and may not capture every nuance of the court's ruling. Laws, regulations, and case interpretations can change over time.

You should ALWAYS:
1. Verify any case citation independently using official sources (Google Scholar, the Court of Appeals for Veterans Claims website, Westlaw, or the VA's digital library).
2. Consult with a VA-accredited attorney, claims agent, or Veterans Service Organization (VSO) representative before making legal decisions about your claim or appeal.
3. Read the full text of any case before relying on it in a filing or brief.

This information is not a substitute for professional legal counsel. The developers of this tool are not attorneys and are not affiliated with the Department of Veterans Affairs or any court.`;

// ============================================================================
// INTERFACES
// ============================================================================

export interface AppealLane {
  id: string;
  name: string;
  description: string;
  timeLimit: string;
  bestFor: string[];
  process: string[];
  officialUrl: string;
  formNumber: string;
}

export interface VerifiedCase {
  id: string;
  caseName: string;
  citation: string;
  court: 'BVA' | 'CAVC' | 'FedCir' | 'SupCt';
  year: number;
  holding: string;
  relevantConditions: string[];
  relevantTopics: string[];
  keywords: string[];
  sourceUrl: string;
  verified: boolean;
}

// ============================================================================
// APPEAL LANES
// ============================================================================

export const appealLanes: AppealLane[] = [
  {
    id: 'supplemental-claim',
    name: 'Supplemental Claim',
    description:
      'A Supplemental Claim allows you to have your previously denied claim reviewed again by submitting new and relevant evidence that was not part of the original decision. This is often the fastest appeal path and keeps your case at the regional office level. You can file a Supplemental Claim at any time, but filing within one year of the decision preserves your original effective date.',
    timeLimit:
      'No strict deadline, but file within 1 year of the decision to preserve your effective date. Can be filed at any time with new and relevant evidence.',
    bestFor: [
      'You have new medical evidence (nexus letter, diagnosis, treatment records) not previously considered',
      'You received a new diagnosis or medical opinion since the denial',
      'You obtained buddy statements or service records that were missing from your original claim',
      'Your condition has worsened and you have documentation showing the change',
      'You want the fastest possible resolution without going to the Board',
    ],
    process: [
      'Gather new and relevant evidence that was not part of the prior decision (new medical records, nexus letters, lay statements, etc.)',
      'Complete VA Form 20-0995 (Decision Review Request: Supplemental Claim)',
      'Submit the form along with your new evidence, or identify evidence you want VA to help obtain',
      'VA will review the new evidence combined with the existing record',
      'A regional office reviewer will issue a new decision — this is a de novo (fresh) review of the entire claim',
      'If granted, benefits are typically effective from the date of the Supplemental Claim filing (or the original claim date if filed within 1 year)',
    ],
    officialUrl: 'https://www.va.gov/decision-reviews/supplemental-claim/',
    formNumber: 'VA Form 20-0995',
  },
  {
    id: 'higher-level-review',
    name: 'Higher-Level Review',
    description:
      'A Higher-Level Review asks a more senior claims adjudicator to take a fresh look at your existing evidence to determine if there was an error in the original decision. No new evidence can be submitted — the reviewer only looks at what was already in your file. This lane is best when you believe the evidence already supports your claim but was misinterpreted or overlooked.',
    timeLimit:
      '1 year from the date of the decision you are appealing. Filing within this window preserves your effective date.',
    bestFor: [
      'You believe the original rater made an error in applying the law or rating criteria',
      'The evidence in your file already supports your claim but was overlooked or misweighed',
      'You want a quick decision without submitting new evidence',
      'The denial cited incorrect facts or misread your medical records',
      'You want to request an informal conference with the reviewer to highlight the error',
    ],
    process: [
      'Complete VA Form 20-0996 (Decision Review Request: Higher-Level Review)',
      'Indicate whether you want an informal conference (a phone call with the senior reviewer to point out the error)',
      'Submit the form — do NOT include new evidence (it will not be considered)',
      'A senior reviewer will conduct a de novo review of the existing evidence in your claims file',
      'If the reviewer identifies a duty-to-assist error, they may return the claim for correction rather than deciding it',
      'You will receive a new decision, typically within 125 days on average',
    ],
    officialUrl: 'https://www.va.gov/decision-reviews/higher-level-review/',
    formNumber: 'VA Form 20-0996',
  },
  {
    id: 'board-appeal-direct',
    name: 'Board Appeal — Direct Review',
    description:
      'A Board Appeal sends your case to the Board of Veterans\' Appeals (BVA) where a Veterans Law Judge will review it. The Direct Review docket is the fastest Board option — the judge reviews only the evidence already in your file with no hearing and no new evidence. Choose this when you believe the record is complete and a judge will see what the regional office missed.',
    timeLimit:
      '1 year from the date of the decision you are appealing. Filing within this window preserves your effective date.',
    bestFor: [
      'You believe a Veterans Law Judge will interpret the existing evidence more favorably than the regional office',
      'You do not have new evidence to submit and do not want a hearing',
      'You want the fastest possible Board decision',
      'The regional office clearly misapplied the rating criteria or law',
    ],
    process: [
      'Complete VA Form 10182 (Decision Review Request: Board Appeal / Notice of Disagreement)',
      'Select the "Direct Review" docket on the form',
      'Submit the form — do NOT include new evidence',
      'Your case is placed on the Direct Review docket at the BVA',
      'A Veterans Law Judge reviews your complete claims file and issues a decision',
      'Average wait time varies but Direct Review is typically the shortest Board docket',
    ],
    officialUrl: 'https://www.va.gov/decision-reviews/board-appeal/',
    formNumber: 'VA Form 10182',
  },
  {
    id: 'board-appeal-evidence',
    name: 'Board Appeal — Evidence Submission',
    description:
      'This Board Appeal option allows you to submit new evidence for a Veterans Law Judge to consider along with the existing record, but without a hearing. You have 90 days after filing to submit additional evidence. Choose this when you have strong new evidence (like a nexus letter) and want a judge to see it, but do not need to testify.',
    timeLimit:
      '1 year from the date of the decision to file the appeal. Then 90 days after filing to submit new evidence.',
    bestFor: [
      'You have new evidence to submit but do not need or want a personal hearing',
      'You obtained a nexus letter, independent medical opinion, or new records after the regional office decision',
      'You want a judge to consider new evidence without the longer wait of the hearing docket',
    ],
    process: [
      'Complete VA Form 10182 (Decision Review Request: Board Appeal / Notice of Disagreement)',
      'Select the "Evidence Submission" docket on the form',
      'Submit the form to the BVA',
      'You have 90 days from the date the Board receives your form to submit additional evidence',
      'After the 90-day evidence window closes, a Veterans Law Judge reviews your case with all evidence',
      'The judge issues a decision based on the full record including your new submissions',
    ],
    officialUrl: 'https://www.va.gov/decision-reviews/board-appeal/',
    formNumber: 'VA Form 10182',
  },
  {
    id: 'board-appeal-hearing',
    name: 'Board Appeal — Hearing Request',
    description:
      'This Board Appeal option gives you a personal hearing before a Veterans Law Judge, either in person or by video conference. You can also submit new evidence within 90 days of the hearing. This is the most thorough Board option but has the longest wait time. Choose this when your case benefits from personal testimony — especially for conditions with subjective symptoms like PTSD, chronic pain, or TBI.',
    timeLimit:
      '1 year from the date of the decision to file the appeal. Then 90 days after the hearing to submit additional evidence.',
    bestFor: [
      'Your case benefits from personal testimony explaining how your condition affects your daily life',
      'You have a condition with subjective symptoms (PTSD, chronic pain, migraines, TBI) that records alone may not fully convey',
      'You want to respond to questions from the judge and clarify the record',
      'You have a representative who can present your case effectively at a hearing',
      'You want the fullest possible review of your claim',
    ],
    process: [
      'Complete VA Form 10182 (Decision Review Request: Board Appeal / Notice of Disagreement)',
      'Select the "Hearing Request" docket on the form',
      'Choose your hearing type preference: video conference (most common), virtual, or in-person at the BVA in Washington, DC',
      'Wait for your hearing to be scheduled — this docket has the longest wait times',
      'Attend your hearing before a Veterans Law Judge and present testimony',
      'You have 90 days after the hearing to submit additional evidence',
      'The judge reviews the full record including hearing testimony and issues a decision',
    ],
    officialUrl: 'https://www.va.gov/decision-reviews/board-appeal/',
    formNumber: 'VA Form 10182',
  },
  {
    id: 'cavc-appeal',
    name: 'Court of Appeals for Veterans Claims (CAVC)',
    description:
      'The U.S. Court of Appeals for Veterans Claims is an Article I federal court that reviews BVA decisions. This is a judicial appeal — you are asking a federal judge to determine whether the BVA made a legal error. The CAVC does not re-weigh evidence or make new factual findings; it reviews whether the BVA correctly applied the law. You typically need an attorney for this stage.',
    timeLimit:
      '120 days from the date the BVA mails its decision. This deadline is strict and jurisdictional — missing it means you cannot appeal to the CAVC.',
    bestFor: [
      'The BVA denied your claim and you believe the decision contained legal error',
      'The BVA failed to provide adequate reasons and bases for its denial',
      'The BVA misapplied a statute, regulation, or binding precedent',
      'You have exhausted your administrative appeal options at the VA',
      'You are willing to retain an attorney (many veterans law attorneys work on contingency)',
    ],
    process: [
      'Obtain the BVA decision letter and note the mailing date carefully',
      'Retain a veterans law attorney — many work on contingency for CAVC appeals',
      'File a Notice of Appeal with the CAVC within 120 days of the BVA decision mailing date',
      'The court may offer mediation through its Appellate Mediation Program, which resolves many cases',
      'If no mediation resolution, your attorney files a brief arguing the BVA committed legal error',
      'The VA\'s Office of General Counsel responds with a brief',
      'The CAVC issues a decision: it may affirm, reverse, remand, or vacate the BVA decision',
      'If dissatisfied with the CAVC outcome, you can appeal to the U.S. Court of Appeals for the Federal Circuit on questions of law',
    ],
    officialUrl: 'https://www.uscourts.cavc.gov/',
    formNumber: 'CAVC Form 1 (Notice of Appeal)',
  },
];

// ============================================================================
// VERIFIED CASE LAW
// ============================================================================
// Every case below is a real, published decision from the cited court.
// Citations have been checked against known legal references. Holdings are
// simplified summaries — always read the full opinion before relying on
// any case in a legal filing.
// ============================================================================

export const verifiedCases: VerifiedCase[] = [
  // =========================================================================
  // BENEFIT OF THE DOUBT
  // =========================================================================
  {
    id: 'gilbert-v-derwinski',
    caseName: 'Gilbert v. Derwinski',
    citation: '1 Vet. App. 49 (1990)',
    court: 'CAVC',
    year: 1990,
    holding:
      'Established the standard for applying the benefit-of-the-doubt doctrine under 38 U.S.C. \u00A7 5107(b). When the evidence is in approximate balance (roughly equal for and against the claim), the doubt is resolved in the veteran\'s favor. The Board must clearly state whether the evidence is in equipoise and explain its reasoning.',
    relevantConditions: ['all'],
    relevantTopics: ['benefit-of-the-doubt', 'standard-of-proof', 'equipoise'],
    keywords: [
      'benefit of the doubt',
      'equipoise',
      'approximate balance',
      '38 USC 5107',
      'standard of proof',
      'reasonable doubt',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },
  {
    id: 'alemany-v-brown',
    caseName: 'Alemany v. Brown',
    citation: '9 Vet. App. 518 (1996)',
    court: 'CAVC',
    year: 1996,
    holding:
      'Clarified that the benefit-of-the-doubt rule applies when the evidence is in approximate balance. The relevant inquiry is not that the veteran must prove the claim by a preponderance, but rather that the veteran need only demonstrate approximate balance for the benefit of the doubt to apply in his or her favor.',
    relevantConditions: ['all'],
    relevantTopics: ['benefit-of-the-doubt', 'standard-of-proof'],
    keywords: [
      'benefit of the doubt',
      'preponderance',
      'approximate balance',
      'standard of proof',
      'slight preponderance',
      'close case',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },

  // =========================================================================
  // SERVICE CONNECTION / NEXUS ELEMENTS
  // =========================================================================
  {
    id: 'caluza-v-brown',
    caseName: 'Caluza v. Brown',
    citation: '7 Vet. App. 498 (1995)',
    court: 'CAVC',
    year: 1995,
    holding:
      'Established the three elements required for direct service connection: (1) a current disability, (2) in-service incurrence or aggravation of a disease or injury, and (3) a medical nexus linking the current disability to the in-service event or injury. All three elements must be established by competent evidence.',
    relevantConditions: ['all'],
    relevantTopics: ['service-connection', 'nexus', 'elements-of-claim'],
    keywords: [
      'service connection',
      'nexus',
      'three elements',
      'current disability',
      'in-service event',
      'medical nexus',
      'Caluza elements',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },
  {
    id: 'shedden-v-principi',
    caseName: 'Shedden v. Principi',
    citation: '381 F.3d 1163 (Fed. Cir. 2004)',
    court: 'FedCir',
    year: 2004,
    holding:
      'Affirmed the three-element framework for service connection at the Federal Circuit level: (1) the existence of a present disability, (2) in-service incurrence or aggravation of a disease or injury, and (3) a causal relationship between the present disability and the disease or injury incurred or aggravated during service.',
    relevantConditions: ['all'],
    relevantTopics: ['service-connection', 'nexus', 'elements-of-claim'],
    keywords: [
      'service connection',
      'three elements',
      'present disability',
      'causal relationship',
      'nexus',
      'more likely than not',
    ],
    sourceUrl: 'https://cafc.uscourts.gov/opinions-orders/',
    verified: true,
  },
  {
    id: 'hickson-v-west',
    caseName: 'Hickson v. West',
    citation: '12 Vet. App. 247 (1999)',
    court: 'CAVC',
    year: 1999,
    holding:
      'Reiterated the three elements required for service connection: (1) medical evidence of a current disability, (2) medical or lay evidence of in-service incurrence or aggravation of a disease or injury, and (3) medical evidence of a nexus between the claimed in-service disease or injury and the current disability. Each element must be established by competent evidence.',
    relevantConditions: ['all'],
    relevantTopics: ['service-connection', 'nexus', 'elements-of-claim', 'competent-evidence'],
    keywords: [
      'service connection',
      'Hickson elements',
      'current disability',
      'in-service incurrence',
      'nexus',
      'competent evidence',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },

  // =========================================================================
  // LAY EVIDENCE — COMPETENCY AND CREDIBILITY
  // =========================================================================
  {
    id: 'jandreau-v-nicholson',
    caseName: 'Jandreau v. Nicholson',
    citation: '492 F.3d 1372 (Fed. Cir. 2007)',
    court: 'FedCir',
    year: 2007,
    holding:
      'Held that lay persons are competent to testify about matters within their personal observation and experience, including symptoms they have directly observed. A layperson can provide competent evidence of a diagnosis when (1) the condition is simple enough to be identified through lay observation (e.g., a broken leg, varicose veins, tinnitus), (2) the person is reporting a diagnosis provided by a medical professional, or (3) lay testimony describing symptoms supports a later medical diagnosis.',
    relevantConditions: ['all'],
    relevantTopics: ['lay-evidence', 'competency', 'diagnosis'],
    keywords: [
      'lay evidence',
      'competent',
      'lay testimony',
      'personal observation',
      'lay diagnosis',
      'observable symptoms',
      'personal knowledge',
    ],
    sourceUrl: 'https://cafc.uscourts.gov/opinions-orders/',
    verified: true,
  },
  {
    id: 'buchanan-v-nicholson',
    caseName: 'Buchanan v. Nicholson',
    citation: '451 F.3d 1331 (Fed. Cir. 2006)',
    court: 'FedCir',
    year: 2006,
    holding:
      'Held that the Board cannot reject lay evidence solely because it is not corroborated by contemporaneous medical records. The absence of contemporaneous medical documentation does not automatically render lay evidence not credible. The Board must evaluate lay evidence on its own merits, considering factors like internal consistency, relationship to other evidence, and any interest or bias.',
    relevantConditions: ['all'],
    relevantTopics: ['lay-evidence', 'credibility', 'service-records'],
    keywords: [
      'lay evidence',
      'credibility',
      'corroboration',
      'contemporaneous medical records',
      'absence of records',
      'not credible',
    ],
    sourceUrl: 'https://cafc.uscourts.gov/opinions-orders/',
    verified: true,
  },
  {
    id: 'layno-v-brown',
    caseName: 'Layno v. Brown',
    citation: '6 Vet. App. 465 (1994)',
    court: 'CAVC',
    year: 1994,
    holding:
      'Established that lay testimony is competent to establish the occurrence of an observable event or the presence of a disability that is capable of lay observation. A lay person is competent to testify about what they personally experienced or witnessed, even without medical training.',
    relevantConditions: ['all'],
    relevantTopics: ['lay-evidence', 'competency', 'observable-conditions'],
    keywords: [
      'lay testimony',
      'competent',
      'observable',
      'lay observation',
      'personal experience',
      'witness',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },

  // =========================================================================
  // REASONS AND BASES / BOARD DUTIES
  // =========================================================================
  {
    id: 'gabrielson-v-brown',
    caseName: 'Gabrielson v. Brown',
    citation: '7 Vet. App. 36 (1994)',
    court: 'CAVC',
    year: 1994,
    holding:
      'Held that the BVA must provide adequate reasons and bases for its findings and conclusions on all material issues of fact and law. The Board must analyze the credibility and probative value of all evidence, account for evidence it finds persuasive or unpersuasive, and provide reasons for rejecting any material evidence favorable to the veteran.',
    relevantConditions: ['all'],
    relevantTopics: ['reasons-and-bases', 'board-duties', 'evidence-analysis'],
    keywords: [
      'reasons and bases',
      'adequate statement',
      'material issues',
      'credibility',
      'probative value',
      'favorable evidence',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },

  // =========================================================================
  // DUTY TO ASSIST
  // =========================================================================
  {
    id: 'stegall-v-west',
    caseName: 'Stegall v. West',
    citation: '11 Vet. App. 268 (1998)',
    court: 'CAVC',
    year: 1998,
    holding:
      'Held that a remand by the BVA or the CAVC confers on the veteran the right to compliance with the remand instructions, as a matter of law. Where the BVA remands a case with specific instructions and the agency of original jurisdiction fails to substantially comply, the Board errs when it fails to ensure compliance. The veteran is entitled to a new remand for corrective action.',
    relevantConditions: ['all'],
    relevantTopics: ['duty-to-assist', 'remand-compliance', 'board-duties'],
    keywords: [
      'remand',
      'compliance',
      'Stegall violation',
      'remand instructions',
      'duty to assist',
      'substantial compliance',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },
  {
    id: 'barr-v-nicholson',
    caseName: 'Barr v. Nicholson',
    citation: '21 Vet. App. 303 (2007)',
    court: 'CAVC',
    year: 2007,
    holding:
      'Held that once VA undertakes the effort to provide an examination or obtain a medical opinion, it must ensure that the examination or opinion is adequate. An inadequate examination frustrates the duty to assist and requires a new examination. An examination is inadequate if it does not provide sufficient detail to rate the disability.',
    relevantConditions: ['all'],
    relevantTopics: ['duty-to-assist', 'c-and-p-exam', 'adequate-examination'],
    keywords: [
      'adequate examination',
      'C&P exam',
      'duty to assist',
      'inadequate exam',
      'medical opinion',
      'insufficient detail',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },
  {
    id: 'mclendon-v-nicholson',
    caseName: 'McLendon v. Nicholson',
    citation: '20 Vet. App. 79 (2006)',
    court: 'CAVC',
    year: 2006,
    holding:
      'Established the four-part test for when VA must provide a medical examination or obtain a medical opinion under 38 U.S.C. \u00A7 5103A(d): (1) there is competent evidence of a current disability or recurrent symptoms, (2) evidence establishing an in-service event, injury, or disease, (3) an indication that the disability or symptoms may be associated with service, and (4) insufficient competent medical evidence to make a decision. The "indication" threshold is a low bar.',
    relevantConditions: ['all'],
    relevantTopics: ['duty-to-assist', 'c-and-p-exam', 'medical-examination'],
    keywords: [
      'medical examination',
      'duty to assist',
      'McLendon test',
      'four elements',
      'indication',
      'low threshold',
      'competent evidence',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },

  // =========================================================================
  // TDIU (TOTAL DISABILITY INDIVIDUAL UNEMPLOYABILITY)
  // =========================================================================
  {
    id: 'rice-v-shinseki',
    caseName: 'Rice v. Shinseki',
    citation: '22 Vet. App. 447 (2009)',
    court: 'CAVC',
    year: 2009,
    holding:
      'Held that a claim for Total Disability based on Individual Unemployability (TDIU) is part of an increased rating claim when evidence of unemployability is raised by the record during the appeal. The Board must address TDIU when the issue is reasonably raised, even if the veteran did not formally file a separate TDIU claim.',
    relevantConditions: ['all'],
    relevantTopics: ['TDIU', 'unemployability', 'increased-rating'],
    keywords: [
      'TDIU',
      'total disability',
      'individual unemployability',
      'increased rating',
      'raised by the record',
      'unable to work',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },
  {
    id: 'roberson-v-principi',
    caseName: 'Roberson v. Principi',
    citation: '251 F.3d 1378 (Fed. Cir. 2001)',
    court: 'FedCir',
    year: 2001,
    holding:
      'Held that the VA must consider all reasonably raised claims, including TDIU, when the evidence of record shows that a veteran is unable to secure or follow a substantially gainful occupation due to service-connected disabilities. A formal TDIU application is not required when the evidence raises the issue.',
    relevantConditions: ['all'],
    relevantTopics: ['TDIU', 'unemployability', 'duty-to-assist'],
    keywords: [
      'TDIU',
      'unemployability',
      'gainful occupation',
      'reasonably raised',
      'formal application not required',
    ],
    sourceUrl: 'https://cafc.uscourts.gov/opinions-orders/',
    verified: true,
  },

  // =========================================================================
  // SECONDARY SERVICE CONNECTION / AGGRAVATION
  // =========================================================================
  {
    id: 'allen-v-brown',
    caseName: 'Allen v. Brown',
    citation: '7 Vet. App. 439 (1995)',
    court: 'CAVC',
    year: 1995,
    holding:
      'Established the standard for secondary service connection based on aggravation under 38 C.F.R. \u00A7 3.310. A veteran is entitled to service connection for a disability that is proximately due to or the result of a service-connected condition (secondary service connection), AND for any additional disability resulting from aggravation of a non-service-connected condition by a service-connected condition. Compensation is limited to the degree of disability over and above the baseline severity of the non-service-connected condition.',
    relevantConditions: ['all'],
    relevantTopics: ['secondary-service-connection', 'aggravation', 'baseline-severity'],
    keywords: [
      'secondary service connection',
      'aggravation',
      'proximately due to',
      '38 CFR 3.310',
      'baseline severity',
      'additional disability',
      'secondary condition',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },
  {
    id: 'el-amin-v-shinseki',
    caseName: 'El-Amin v. Shinseki',
    citation: '26 Vet. App. 136 (2013)',
    court: 'CAVC',
    year: 2013,
    holding:
      'Held that a medical opinion stating a condition is "not caused by" a service-connected disability is inadequate to address secondary service connection because it fails to address the question of aggravation. The VA must obtain opinions that address both causation and aggravation when evaluating secondary service connection claims.',
    relevantConditions: ['all'],
    relevantTopics: ['secondary-service-connection', 'aggravation', 'adequate-examination'],
    keywords: [
      'secondary',
      'aggravation',
      'not caused by',
      'inadequate opinion',
      'causation and aggravation',
      'El-Amin',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },

  // =========================================================================
  // INCREASED RATINGS / STAGED RATINGS
  // =========================================================================
  {
    id: 'hart-v-mansfield',
    caseName: 'Hart v. Mansfield',
    citation: '21 Vet. App. 505 (2007)',
    court: 'CAVC',
    year: 2007,
    holding:
      'Extended the concept of staged ratings to claims for increased ratings (not just initial ratings). The Board must consider whether the severity of the veteran\'s disability varied over the appeal period, and if so, assign separate (staged) ratings for distinct periods where the disability demonstrated different levels of severity.',
    relevantConditions: ['all'],
    relevantTopics: ['increased-rating', 'staged-ratings'],
    keywords: [
      'staged ratings',
      'increased rating',
      'varying severity',
      'appeal period',
      'separate ratings',
      'distinct periods',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },
  {
    id: 'fenderson-v-west',
    caseName: 'Fenderson v. West',
    citation: '12 Vet. App. 119 (1999)',
    court: 'CAVC',
    year: 1999,
    holding:
      'Established that when a veteran appeals the initial disability rating assigned with the grant of service connection, the Board must consider the entire period from the effective date of the grant and assign staged ratings if the evidence shows varying levels of disability over time. Distinguished initial rating appeals from claims for increased ratings of already service-connected conditions.',
    relevantConditions: ['all'],
    relevantTopics: ['initial-rating', 'staged-ratings', 'effective-date'],
    keywords: [
      'initial rating',
      'staged ratings',
      'effective date',
      'grant of service connection',
      'varying levels',
      'Fenderson',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },

  // =========================================================================
  // MENTAL HEALTH RATINGS
  // =========================================================================
  {
    id: 'mauerhan-v-principi',
    caseName: 'Mauerhan v. Principi',
    citation: '16 Vet. App. 436 (2002)',
    court: 'CAVC',
    year: 2002,
    holding:
      'Held that the symptoms listed in the General Rating Formula for Mental Disorders (38 C.F.R. \u00A7 4.130) are not an exhaustive list but are examples of the type and degree of symptoms that would justify a particular rating. A veteran may qualify for a given rating by demonstrating the particular symptoms associated with that percentage, or other symptoms of similar severity, frequency, and duration. The Board must consider ALL symptoms and their effect on occupational and social functioning.',
    relevantConditions: ['mental-health', 'ptsd', 'depression', 'anxiety'],
    relevantTopics: ['mental-health-rating', 'symptoms-not-exhaustive', 'rating-criteria'],
    keywords: [
      'mental health rating',
      'symptoms not exhaustive',
      'General Rating Formula',
      '38 CFR 4.130',
      'occupational and social impairment',
      'similar severity',
      'frequency and duration',
      'PTSD rating',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },
  {
    id: 'mittleider-v-west',
    caseName: 'Mittleider v. West',
    citation: '11 Vet. App. 181 (1998)',
    court: 'CAVC',
    year: 1998,
    holding:
      'Held that when symptoms of a service-connected mental health disability cannot be distinguished from symptoms of a non-service-connected mental health disability, the Board must attribute all such symptoms to the service-connected disability. The VA may not penalize a veteran by separating out symptoms it cannot medically distinguish.',
    relevantConditions: ['mental-health', 'ptsd', 'depression', 'anxiety', 'all'],
    relevantTopics: ['mental-health-rating', 'symptoms', 'benefit-of-the-doubt', 'rating-criteria'],
    keywords: [
      'Mittleider',
      'symptoms',
      'indistinguishable',
      'attribute to service-connected',
      'cannot distinguish',
      'mental health',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },

  // =========================================================================
  // PRESUMPTION OF SOUNDNESS
  // =========================================================================
  {
    id: 'wagner-v-principi',
    caseName: 'Wagner v. Principi',
    citation: '370 F.3d 1089 (Fed. Cir. 2004)',
    court: 'FedCir',
    year: 2004,
    holding:
      'Clarified the presumption of soundness under 38 U.S.C. \u00A7 1111. Every veteran is presumed to have been in sound condition at entry into service, except for conditions noted on the entrance examination. To rebut this presumption, the government must show by clear and unmistakable evidence BOTH that (1) the condition preexisted service AND (2) the preexisting condition was not aggravated by service. If the government fails to meet this burden on either prong, the presumption is not rebutted.',
    relevantConditions: ['all'],
    relevantTopics: ['presumption-of-soundness', 'preexisting-condition', 'aggravation'],
    keywords: [
      'presumption of soundness',
      'preexisting condition',
      'clear and unmistakable evidence',
      '38 USC 1111',
      'entrance examination',
      'aggravation',
      'rebuttal',
    ],
    sourceUrl: 'https://cafc.uscourts.gov/opinions-orders/',
    verified: true,
  },

  // =========================================================================
  // MEDICAL EXAMINATION / OPINION ADEQUACY
  // =========================================================================
  {
    id: 'nieves-rodriguez-v-peake',
    caseName: 'Nieves-Rodriguez v. Peake',
    citation: '22 Vet. App. 295 (2008)',
    court: 'CAVC',
    year: 2008,
    holding:
      'Held that the probative value of a medical opinion comes from its reasoning, not merely from who provided it. A medical opinion must contain not only clear conclusions with supporting data, but also a reasoned medical explanation connecting the two. An opinion that is factually accurate, fully articulated, and supported by sound reasoning carries significant weight, regardless of whether it comes from a VA examiner or a private physician.',
    relevantConditions: ['all'],
    relevantTopics: ['medical-opinion', 'nexus', 'probative-value'],
    keywords: [
      'medical opinion',
      'probative value',
      'reasoned explanation',
      'nexus letter',
      'supporting data',
      'sound reasoning',
      'adequate opinion',
      'informed opinion',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },
  {
    id: 'stefl-v-nicholson',
    caseName: 'Stefl v. Nicholson',
    citation: '21 Vet. App. 120 (2007)',
    court: 'CAVC',
    year: 2007,
    holding:
      'Held that an adequate medical opinion must support its conclusion with an analysis the Board can consider and weigh against contrary opinions. A medical examination report must contain clear conclusions with supporting data and a reasoned medical explanation connecting the conclusions to the data. A mere conclusion without rationale is insufficient.',
    relevantConditions: ['all'],
    relevantTopics: ['medical-opinion', 'c-and-p-exam', 'adequate-examination'],
    keywords: [
      'adequate medical opinion',
      'reasoned explanation',
      'supporting data',
      'C&P exam',
      'medical examination',
      'mere conclusion',
      'sufficient detail',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },

  // =========================================================================
  // MUSCULOSKELETAL / FUNCTIONAL LOSS / RANGE OF MOTION
  // =========================================================================
  {
    id: 'deluca-v-brown',
    caseName: 'DeLuca v. Brown',
    citation: '8 Vet. App. 202 (1995)',
    court: 'CAVC',
    year: 1995,
    holding:
      'Held that when evaluating musculoskeletal disabilities, the Board must consider functional loss due to pain, weakened movement, excess fatigability, and incoordination, in addition to the criteria in the Rating Schedule, pursuant to 38 C.F.R. \u00A7\u00A7 4.40 and 4.45. An examination that does not address additional functional loss during flare-ups is inadequate for rating purposes.',
    relevantConditions: [
      'musculoskeletal',
      'back-condition',
      'knee-condition',
      'shoulder-condition',
      'joint-conditions',
    ],
    relevantTopics: ['increased-rating', 'functional-loss', 'pain', 'flare-ups', 'musculoskeletal'],
    keywords: [
      'DeLuca factors',
      'functional loss',
      'pain on motion',
      'flare-ups',
      'weakened movement',
      'fatigability',
      'incoordination',
      '38 CFR 4.40',
      '38 CFR 4.45',
      'musculoskeletal',
      'musculoskeletal rating',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },
  {
    id: 'mitchell-v-shinseki',
    caseName: 'Mitchell v. Shinseki',
    citation: '25 Vet. App. 32 (2011)',
    court: 'CAVC',
    year: 2011,
    holding:
      'Reinforced DeLuca and held that a C&P examiner must test for pain throughout the range of motion and not just at the endpoint. Pain that causes functional loss, not just pain itself, is the relevant consideration for rating purposes. The examiner must also address functional impairment during flare-ups or with repeated use over time.',
    relevantConditions: [
      'musculoskeletal',
      'back-condition',
      'knee-condition',
      'shoulder-condition',
      'joint-conditions',
    ],
    relevantTopics: ['increased-rating', 'functional-loss', 'pain', 'c-and-p-exam'],
    keywords: [
      'pain on motion',
      'range of motion',
      'functional loss',
      'flare-ups',
      'repeated use',
      'DeLuca',
      'musculoskeletal exam',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },
  {
    id: 'correia-v-mcdonald',
    caseName: 'Correia v. McDonald',
    citation: '28 Vet. App. 158 (2016)',
    court: 'CAVC',
    year: 2016,
    holding:
      'Held that VA joint examinations must include range-of-motion testing in active motion, passive motion, weight-bearing, and non-weight-bearing conditions to be considered adequate under 38 C.F.R. \u00A7 4.59. An examination that fails to include all four types of testing is inadequate and warrants remand.',
    relevantConditions: ['musculoskeletal', 'joint-conditions', 'knee-condition', 'shoulder-condition'],
    relevantTopics: ['c-and-p-exam', 'adequate-examination', 'range-of-motion', 'musculoskeletal'],
    keywords: [
      'range of motion',
      'Correia',
      'passive',
      'active',
      'weight-bearing',
      'non-weight-bearing',
      'joint exam',
      '38 CFR 4.59',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },
  {
    id: 'sharp-v-shulkin',
    caseName: 'Sharp v. Shulkin',
    citation: '29 Vet. App. 26 (2017)',
    court: 'CAVC',
    year: 2017,
    holding:
      'Held that VA examiners must attempt to estimate the additional functional loss during flare-ups based on all available information, even if the veteran is not currently experiencing a flare-up during the examination. The examiner cannot simply state an inability to provide an opinion without first considering the veteran\'s lay statements about flare-up severity, frequency, and duration.',
    relevantConditions: ['musculoskeletal', 'joint-conditions'],
    relevantTopics: ['c-and-p-exam', 'adequate-examination', 'flare-ups', 'musculoskeletal'],
    keywords: [
      'flare-up',
      'Sharp',
      'examination',
      'functional loss',
      'DeLuca',
      'estimate',
      'additional functional loss',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },

  // =========================================================================
  // PRESUMPTIVE SERVICE CONNECTION
  // =========================================================================
  {
    id: 'combee-v-brown',
    caseName: 'Combee v. Brown',
    citation: '34 F.3d 1039 (Fed. Cir. 1994)',
    court: 'FedCir',
    year: 1994,
    holding:
      'Held that even if a veteran does not qualify for presumptive service connection (such as under the radiation-exposure presumptions), the veteran is not precluded from establishing direct service connection by showing that the disease was actually caused by in-service exposure. Failure to meet presumptive requirements does not bar a direct service connection claim.',
    relevantConditions: ['all'],
    relevantTopics: ['presumptive-service-connection', 'direct-service-connection', 'toxic-exposure'],
    keywords: [
      'presumptive',
      'direct service connection',
      'radiation',
      'toxic exposure',
      'not precluded',
      'Combee',
      'alternative theory',
    ],
    sourceUrl: 'https://cafc.uscourts.gov/opinions-orders/',
    verified: true,
  },

  // =========================================================================
  // CUE (CLEAR AND UNMISTAKABLE ERROR)
  // =========================================================================
  {
    id: 'russell-v-principi',
    caseName: 'Russell v. Principi',
    citation: '3 Vet. App. 310 (1992)',
    court: 'CAVC',
    year: 1992,
    holding:
      'Established the standard for clear and unmistakable error (CUE) in prior VA decisions. CUE exists when: (1) either the correct facts, as they were known at the time, were not before the adjudicator or the statutory or regulatory provisions extant at the time were incorrectly applied, (2) the error must be undebatable, and (3) the error must have manifestly changed the outcome of the decision. A disagreement with how the evidence was weighed is not CUE.',
    relevantConditions: ['all'],
    relevantTopics: ['CUE', 'prior-decisions', 'finality'],
    keywords: [
      'clear and unmistakable error',
      'CUE',
      'prior decision',
      'undebatable',
      'manifestly changed',
      'finality',
      'revision',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },

  // =========================================================================
  // HEARING LOSS
  // =========================================================================
  {
    id: 'hensley-v-brown',
    caseName: 'Hensley v. Brown',
    citation: '5 Vet. App. 155 (1993)',
    court: 'CAVC',
    year: 1993,
    holding:
      'Held that 38 C.F.R. \u00A7 3.385 does not preclude service connection for a current hearing disability where hearing was within normal limits at separation from service. Service connection for hearing loss can be established if the evidence shows that hearing loss is nonetheless attributable to in-service noise exposure. A veteran does not have to demonstrate hearing loss at the time of separation to establish service connection.',
    relevantConditions: ['hearing-loss', 'tinnitus'],
    relevantTopics: ['hearing-loss', 'service-connection', 'normal-at-separation'],
    keywords: [
      'hearing loss',
      'normal at separation',
      'noise exposure',
      '38 CFR 3.385',
      'auditory threshold',
      'current disability',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },

  // =========================================================================
  // FAVORABLE EVIDENCE / BOARD ERROR
  // =========================================================================
  {
    id: 'horn-v-shinseki',
    caseName: 'Horn v. Shinseki',
    citation: '25 Vet. App. 231 (2012)',
    court: 'CAVC',
    year: 2012,
    holding:
      'Held that the Board must discuss all evidence that is favorable to the veteran. Failure to address material favorable evidence in the record constitutes a failure to provide adequate reasons and bases and requires remand.',
    relevantConditions: ['all'],
    relevantTopics: ['reasons-and-bases', 'favorable-evidence', 'board-duties'],
    keywords: [
      'favorable evidence',
      'Board error',
      'must address',
      'remand',
      'reasons and bases',
      'material evidence',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },

  // =========================================================================
  // PRESUMPTION OF REGULARITY
  // =========================================================================
  {
    id: 'ashley-v-derwinski',
    caseName: 'Ashley v. Derwinski',
    citation: '2 Vet. App. 307 (1992)',
    court: 'CAVC',
    year: 1992,
    holding:
      'Established the presumption of regularity in government actions. Public officials are presumed to have properly discharged their official duties, including mailing notices and decisions. This presumption can be rebutted by clear evidence to the contrary, such as evidence that a notice was not sent or was sent to the wrong address.',
    relevantConditions: ['all'],
    relevantTopics: ['presumption-of-regularity', 'mailing', 'due-process'],
    keywords: [
      'presumption of regularity',
      'mailing',
      'notice',
      'due process',
      'official duties',
      'rebuttal',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },

  // =========================================================================
  // EFFECTIVE DATES
  // =========================================================================
  {
    id: 'mcgrath-v-gober',
    caseName: 'McGrath v. Gober',
    citation: '14 Vet. App. 28 (2000)',
    court: 'CAVC',
    year: 2000,
    holding:
      'Addressed effective date principles under 38 U.S.C. \u00A7 5110. When a claim is reopened with new and material evidence, the effective date is generally the date of receipt of the new claim or the date entitlement arose, whichever is later. The original claim date may be preserved only if the claim was continuously prosecuted.',
    relevantConditions: ['all'],
    relevantTopics: ['effective-date', 'reopened-claim'],
    keywords: [
      'effective date',
      'date of claim',
      'reopened claim',
      'new and material evidence',
      '38 USC 5110',
      'entitlement arose',
    ],
    sourceUrl: 'https://www.uscourts.cavc.gov/opinions.php',
    verified: true,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Search case law by a free-text query string and optional filters.
 *
 * The search is case-insensitive and matches against the case name, holding,
 * citation, keywords, relevant topics, and relevant conditions. When filters
 * are provided, results are narrowed to cases matching at least one of the
 * specified conditions or topics.
 */
export function searchCaseLaw(
  query: string,
  filters?: { conditions?: string[]; topics?: string[] }
): VerifiedCase[] {
  const normalizedQuery = query.toLowerCase().trim();

  return verifiedCases.filter((c) => {
    // Text matching: search across multiple fields
    const searchableText = [
      c.caseName,
      c.holding,
      c.citation,
      ...c.keywords,
      ...c.relevantTopics,
      ...c.relevantConditions,
    ]
      .join(' ')
      .toLowerCase();

    const queryTerms = normalizedQuery.split(/\s+/);
    const matchesQuery =
      normalizedQuery === '' ||
      queryTerms.every((term) => searchableText.includes(term));

    if (!matchesQuery) return false;

    // Apply condition filter if provided
    if (filters?.conditions && filters.conditions.length > 0) {
      const hasMatchingCondition =
        c.relevantConditions.includes('all') ||
        c.relevantConditions.some((cond) =>
          filters.conditions!.some(
            (filterCond) => cond.toLowerCase() === filterCond.toLowerCase()
          )
        );
      if (!hasMatchingCondition) return false;
    }

    // Apply topic filter if provided
    if (filters?.topics && filters.topics.length > 0) {
      const hasMatchingTopic = c.relevantTopics.some((topic) =>
        filters.topics!.some(
          (filterTopic) => topic.toLowerCase() === filterTopic.toLowerCase()
        )
      );
      if (!hasMatchingTopic) return false;
    }

    return true;
  });
}

/**
 * Retrieve all verified cases relevant to a specific legal topic.
 *
 * Topic matching is case-insensitive and checks both relevantTopics (exact match)
 * and keywords (substring match). Common topics include:
 * - 'benefit-of-the-doubt'
 * - 'service-connection' / 'nexus'
 * - 'lay-evidence' / 'credibility'
 * - 'duty-to-assist' / 'c-and-p-exam'
 * - 'TDIU' / 'unemployability'
 * - 'secondary-service-connection' / 'aggravation'
 * - 'increased-rating' / 'staged-ratings'
 * - 'mental-health-rating'
 * - 'presumption-of-soundness'
 * - 'CUE' (clear and unmistakable error)
 * - 'effective-date'
 * - 'functional-loss' / 'pain' / 'flare-ups'
 * - 'musculoskeletal'
 * - 'hearing-loss'
 */
export function getCasesByTopic(topic: string): VerifiedCase[] {
  const normalizedTopic = topic.toLowerCase().trim();

  return verifiedCases.filter(
    (c) =>
      c.relevantTopics.some((t) => t.toLowerCase() === normalizedTopic) ||
      c.keywords.some((k) => k.toLowerCase().includes(normalizedTopic))
  );
}

/**
 * Retrieve a single case by its ID.
 */
export function getCaseById(id: string): VerifiedCase | undefined {
  return verifiedCases.find((c) => c.id === id);
}

/**
 * Retrieve all appeal lane options, optionally filtered to a specific lane ID.
 */
export function getAppealLane(laneId: string): AppealLane | undefined {
  return appealLanes.find((lane) => lane.id === laneId);
}

/**
 * Get cases relevant to a specific condition category.
 * Returns cases tagged with 'all' plus cases specifically tagged for that condition.
 */
export function getCasesByCondition(condition: string): VerifiedCase[] {
  const normalizedCondition = condition.toLowerCase().trim();

  return verifiedCases.filter(
    (c) =>
      c.relevantConditions.includes('all') ||
      c.relevantConditions.some(
        (rc) => rc.toLowerCase() === normalizedCondition
      )
  );
}
