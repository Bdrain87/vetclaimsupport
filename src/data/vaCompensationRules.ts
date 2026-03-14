// ========================================================================
// VA Compensation Rules — Comprehensive Reference Data
// Covers effective dates, rates, SMC, TDIU, P&T, back pay, VA math
// 2024 rates (effective December 1, 2023)
// Source: 38 U.S.C. and 38 C.F.R. Parts 3 & 4
// ========================================================================

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface EffectiveDateRule {
  id: string;
  name: string;
  description: string;
  legalBasis: string;
  /** Practical guidance for veterans/advocates */
  practicalNote: string;
}

export interface CompensationRate {
  ratingPercent: number;
  veteranAlone: number;
  withSpouse: number;
  withSpouseAndChild: number;
  withChild: number;
  additionalChild: number;
  additionalSchoolChild: number;
  dependentParent: number;
  dependentParents: number;
}

export interface SMCLevel {
  level: string;
  monthlyRate: number;
  description: string;
  criteria: string;
  legalBasis: string;
}

export interface TDIURules {
  schedularCriteria: string;
  extraschedularCriteria: string;
  incomeThreshold: number;
  marginalEmployment: string;
  combinedWithSMC: string;
  protectedWorkEnvironment: string;
}

export interface ProtectionRule {
  name: string;
  yearsRequired: number;
  description: string;
  exceptions: string;
  legalBasis: string;
}

export interface BackPayRule {
  id: string;
  name: string;
  description: string;
  formula: string;
}

export interface VAMathStep {
  step: number;
  instruction: string;
  example: string;
}

// ---------------------------------------------------------------------------
// 1. Effective Date Rules
// ---------------------------------------------------------------------------

export const effectiveDateRules: EffectiveDateRule[] = [
  {
    id: 'itf',
    name: 'Intent to File (ITF)',
    description:
      'An Intent to File preserves the earliest possible effective date for up to one year. If the veteran files a formal claim within 12 months, the effective date is the ITF date rather than the formal filing date.',
    legalBasis: '38 C.F.R. § 3.155',
    practicalNote:
      'Always file an ITF immediately — even before gathering evidence. It can be submitted online, by phone (1-800-827-1000), or in person. The ITF expires exactly 1 year from the date VA receives it.',
  },
  {
    id: 'date_of_claim',
    name: 'Date of Claim',
    description:
      'When no ITF exists, the effective date is generally the date VA receives the complete claim (VA Form 21-526EZ or equivalent).',
    legalBasis: '38 U.S.C. § 5110(a); 38 C.F.R. § 3.400',
    practicalNote:
      'Filing online via VA.gov automatically creates a timestamp. Paper claims use the postmark date or VA receipt date.',
  },
  {
    id: 'day_after_discharge',
    name: 'Day After Discharge',
    description:
      'If a veteran files a disability claim within one year of separation from active duty, the effective date is the day after discharge — not the filing date. This can result in significant back pay.',
    legalBasis: '38 C.F.R. § 3.400(b)(2)(i)',
    practicalNote:
      'Veterans separating from service should file a Benefits Delivery at Discharge (BDD) claim 180-90 days before separation to lock in this date.',
  },
  {
    id: 'liberalizing_law',
    name: 'Liberalizing Law Effective Date',
    description:
      'When Congress passes a law that creates a new presumptive condition or expands eligibility (e.g., PACT Act), the effective date can be the date the law takes effect — provided the veteran files or has a pending claim within one year of the law.',
    legalBasis: '38 C.F.R. § 3.114',
    practicalNote:
      'The PACT Act (Aug 10, 2022) is the most significant recent liberalizing law. Veterans with toxic exposure conditions should check if their effective date can be tied to the law\'s enactment.',
  },
  {
    id: 'increased_rating',
    name: 'Increased Rating Effective Date',
    description:
      'For claims for increased rating, the effective date is the date of claim OR the date entitlement arose (whichever is later). However, if an increase in disability is shown within one year prior to the claim, the effective date can be the date the increase is factually ascertainable.',
    legalBasis: '38 U.S.C. § 5110(b)(3); 38 C.F.R. § 3.400(o)(2)',
    practicalNote:
      'Medical records showing worsening within the year before filing can push the effective date back. Get treatment records documenting the worsening.',
  },
  {
    id: 'reopened_claim',
    name: 'Reopened Claim',
    description:
      'When a previously denied claim is reopened with new and material evidence, the effective date is generally the date the request to reopen was received — not the original claim date.',
    legalBasis: '38 C.F.R. § 3.400(q)(2), (r)',
    practicalNote:
      'A reopened claim cannot go back to the original filing date unless CUE is established in the prior decision. Supplemental claims under AMA follow similar rules.',
  },
  {
    id: 'cue',
    name: 'Clear and Unmistakable Error (CUE)',
    description:
      'If a prior VA decision contained clear and unmistakable error, the effective date reverts to what it would have been had the correct decision been made originally. This can produce decades of retroactive benefits.',
    legalBasis: '38 U.S.C. § 5109A; 38 C.F.R. § 3.105(a)',
    practicalNote:
      'CUE is extremely difficult to prove. The error must be undebatable, outcome-determinative, and based on the evidence and law that existed at the time. A mere difference of opinion is not CUE.',
  },
  {
    id: 'presumptive_service_connection',
    name: 'Presumptive Service Connection',
    description:
      'For chronic diseases (38 C.F.R. § 3.309) that manifest within the applicable presumptive period after service (usually 1 year, 7 years for certain diseases), the effective date follows standard rules but the service-connection analysis is simplified.',
    legalBasis: '38 C.F.R. §§ 3.307, 3.309',
    practicalNote:
      'Presumptive conditions do not require a nexus letter. If the condition manifests within the presumptive window and is documented, service connection should be granted.',
  },
  {
    id: 'ama_supplemental',
    name: 'AMA Supplemental Claim',
    description:
      'Under the Appeals Modernization Act, filing a supplemental claim with new and relevant evidence within one year of a prior decision can preserve the original effective date from the prior claim.',
    legalBasis: '38 C.F.R. § 3.2501',
    practicalNote:
      'Continuously filing within each one-year window preserves the earliest effective date in the chain. This is the "continuous pursuit" doctrine under AMA.',
  },
];

// ---------------------------------------------------------------------------
// 2. Compensation Rate Table (2024 — Effective December 1, 2023)
// ---------------------------------------------------------------------------

export const compensationRates2024: CompensationRate[] = [
  {
    ratingPercent: 10,
    veteranAlone: 171.23,
    withSpouse: 171.23, // No dependent additions below 30%
    withSpouseAndChild: 171.23,
    withChild: 171.23,
    additionalChild: 0,
    additionalSchoolChild: 0,
    dependentParent: 0,
    dependentParents: 0,
  },
  {
    ratingPercent: 20,
    veteranAlone: 338.49,
    withSpouse: 338.49,
    withSpouseAndChild: 338.49,
    withChild: 338.49,
    additionalChild: 0,
    additionalSchoolChild: 0,
    dependentParent: 0,
    dependentParents: 0,
  },
  {
    ratingPercent: 30,
    veteranAlone: 524.31,
    withSpouse: 586.31,
    withSpouseAndChild: 617.31,
    withChild: 555.31,
    additionalChild: 31,
    additionalSchoolChild: 100,
    dependentParent: 57,
    dependentParents: 114,
  },
  {
    ratingPercent: 40,
    veteranAlone: 755.28,
    withSpouse: 837.28,
    withSpouseAndChild: 878.28,
    withChild: 796.28,
    additionalChild: 41,
    additionalSchoolChild: 133,
    dependentParent: 76,
    dependentParents: 152,
  },
  {
    ratingPercent: 50,
    veteranAlone: 1075.16,
    withSpouse: 1179.16,
    withSpouseAndChild: 1230.16,
    withChild: 1126.16,
    additionalChild: 51,
    additionalSchoolChild: 167,
    dependentParent: 95,
    dependentParents: 190,
  },
  {
    ratingPercent: 60,
    veteranAlone: 1361.88,
    withSpouse: 1486.88,
    withSpouseAndChild: 1548.88,
    withChild: 1423.88,
    additionalChild: 62,
    additionalSchoolChild: 200,
    dependentParent: 114,
    dependentParents: 228,
  },
  {
    ratingPercent: 70,
    veteranAlone: 1716.28,
    withSpouse: 1861.21,
    withSpouseAndChild: 1933.21,
    withChild: 1788.28,
    additionalChild: 72,
    additionalSchoolChild: 234,
    dependentParent: 134,
    dependentParents: 268,
  },
  {
    ratingPercent: 80,
    veteranAlone: 1995.01,
    withSpouse: 2161.01,
    withSpouseAndChild: 2243.01,
    withChild: 2077.01,
    additionalChild: 82,
    additionalSchoolChild: 267,
    dependentParent: 153,
    dependentParents: 306,
  },
  {
    ratingPercent: 90,
    veteranAlone: 2241.91,
    withSpouse: 2428.91,
    withSpouseAndChild: 2521.91,
    withChild: 2334.91,
    additionalChild: 93,
    additionalSchoolChild: 301,
    dependentParent: 172,
    dependentParents: 344,
  },
  {
    ratingPercent: 100,
    veteranAlone: 3737.85,
    withSpouse: 3946.25,
    withSpouseAndChild: 4049.80,
    withChild: 3841.40,
    additionalChild: 103.55,
    additionalSchoolChild: 334.49,
    dependentParent: 191.14,
    dependentParents: 382.28,
  },
];

/** Quick lookup: base veteran-alone rate by percentage */
export const baseRateByPercent: Record<number, number> = {
  10: 171.23,
  20: 338.49,
  30: 524.31,
  40: 755.28,
  50: 1075.16,
  60: 1361.88,
  70: 1716.28,
  80: 1995.01,
  90: 2241.91,
  100: 3737.85,
};

// ---------------------------------------------------------------------------
// 3. Special Monthly Compensation (SMC) Rates — 2024
// ---------------------------------------------------------------------------

export const smcLevels: SMCLevel[] = [
  {
    level: 'SMC-K',
    monthlyRate: 131.44,
    description: 'Loss or loss of use of a creative organ, one eye, one foot, one hand, or certain paired organs.',
    criteria:
      'Anatomical loss or loss of use of one hand, one foot, both buttocks, one or more creative organs, blindness of one eye (light perception only), deafness of both ears with absence of air and bone conduction, or complete organic aphonia.',
    legalBasis: '38 U.S.C. § 1114(k)',
  },
  {
    level: 'SMC-L',
    monthlyRate: 4841.44,
    description: 'Need for Aid and Attendance (A&A) or anatomical loss/loss of use of both feet, one hand and one foot, or blindness in both eyes.',
    criteria:
      'Veteran is so helpless as to need regular aid and attendance; OR anatomical loss/loss of use of both feet, one hand and one foot, blindness in both eyes with visual acuity of 5/200 or less, or being permanently bedridden.',
    legalBasis: '38 U.S.C. § 1114(l)',
  },
  {
    level: 'SMC-L 1/2',
    monthlyRate: 5093.62,
    description: 'Intermediate rate between SMC-L and SMC-M.',
    criteria:
      'Entitled to SMC-L and has additional disability or disabilities independently ratable at 50% or more.',
    legalBasis: '38 U.S.C. § 1114(p)',
  },
  {
    level: 'SMC-M',
    monthlyRate: 5345.79,
    description: 'Loss of use of both hands, anatomical loss of both legs at or above the knee, or certain combinations.',
    criteria:
      'Anatomical loss or loss of use of both hands; anatomical loss of both legs so near the hip as to prevent use of prosthetics; blindness in both eyes rendering veteran so helpless as to need regular A&A; or anatomical loss of one arm and one leg so near shoulder/hip as to prevent prosthetic use.',
    legalBasis: '38 U.S.C. § 1114(m)',
  },
  {
    level: 'SMC-N',
    monthlyRate: 5837.41,
    description: 'Anatomical loss of both arms at or above the elbow, or combination of bilateral anatomical loss of both arms and both legs.',
    criteria:
      'Anatomical loss or loss of use of both arms so near the shoulder as to prevent use of prosthetics; anatomical loss of both legs so near the hip as to prevent prosthetics combined with anatomical loss of one arm so near the shoulder as to prevent prosthetics; or anatomical loss of both eyes.',
    legalBasis: '38 U.S.C. § 1114(n)',
  },
  {
    level: 'SMC-O',
    monthlyRate: 6310.88,
    description: 'Highest anatomical losses or paralysis combinations.',
    criteria:
      'Anatomical loss of both arms so near the shoulder as to prevent prosthetics combined with bilateral leg loss; paraplegia with complete loss of bowel and bladder control; or other severe combinations as determined by VA.',
    legalBasis: '38 U.S.C. § 1114(o)',
  },
  {
    level: 'SMC-R.1',
    monthlyRate: 9557.32,
    description: 'Higher-level Aid and Attendance for veterans needing daily skilled care.',
    criteria:
      'Veteran is entitled to compensation at the SMC-O rate or has service-connected disability rated as total AND has additional service-connected disabilities independently ratable at 100%, AND is in need of regular aid and attendance.',
    legalBasis: '38 U.S.C. § 1114(r)(1)',
  },
  {
    level: 'SMC-R.2',
    monthlyRate: 10966.15,
    description: 'Highest level of Aid and Attendance.',
    criteria:
      'Veteran is entitled to SMC-R.1 and needs a higher level of care — essentially requires hospitalization, nursing home, or equivalent in-home skilled care on a daily basis.',
    legalBasis: '38 U.S.C. § 1114(r)(2)',
  },
  {
    level: 'SMC-S',
    monthlyRate: 4143.60,
    description: 'Housebound rate for veterans who are substantially confined to their dwelling.',
    criteria:
      'Veteran has a single service-connected disability rated 100% AND is either permanently housebound by reason of service-connected disabilities OR has additional service-connected disability or disabilities independently ratable at 60% or more.',
    legalBasis: '38 U.S.C. § 1114(s)',
  },
  {
    level: 'SMC-T',
    monthlyRate: 0, // Rate varies; paid at SMC-L rate or higher depending on individual circumstances
    description: 'TBI residuals requiring aid and attendance.',
    criteria:
      'Veteran has residuals of traumatic brain injury (TBI) that are severe enough to require the regular aid and attendance of another person. This is adjudicated on a case-by-case basis and may include cognitive, behavioral, and physical impairments from TBI.',
    legalBasis: '38 U.S.C. § 1114(t)',
  },
];

// ---------------------------------------------------------------------------
// 4. TDIU Rules
// ---------------------------------------------------------------------------

export const tdiuRules: TDIURules = {
  schedularCriteria:
    'The veteran must have ONE service-connected disability rated at 60% or more; OR a combined rating of 70% or more with at least one disability rated at 40% or more. Disabilities of a common etiology or from a single accident can be combined to meet the single-disability threshold.',
  extraschedularCriteria:
    'When the schedular criteria are not met, the case may be referred to the Director of Compensation Service for extraschedular consideration under 38 C.F.R. § 4.16(b). The veteran must demonstrate inability to secure or follow substantially gainful employment solely due to service-connected disabilities.',
  incomeThreshold: 15060,
  marginalEmployment:
    'Marginal employment is not considered substantially gainful employment. Marginal employment generally exists when annual income does not exceed the federal poverty level for one person ($15,060 for 2024). Employment in a sheltered workshop or family business where the veteran is given special consideration may also be considered marginal regardless of income.',
  combinedWithSMC:
    'TDIU can be combined with SMC-S (housebound) if the veteran has a separate service-connected disability independently rated at 60% or more, apart from the disability (or disabilities) forming the basis of the TDIU grant. This is often referred to as "Bradley v. Peake" entitlement.',
  protectedWorkEnvironment:
    'Employment in a protected work environment — such as a family business, sheltered workshop, or position where the employer accommodates the veteran\'s disabilities beyond what would normally occur — may be deemed marginal employment even if earnings exceed the poverty threshold.',
};

/** Additional TDIU guidance for claims processing */
export const tdiuGuidance = {
  formRequired: 'VA Form 21-8940 (Application for Increased Compensation Based on Unemployability)',
  employerVerification: 'VA Form 21-4192 (Request for Employment Information in Connection with Claim for Disability Benefits) — sent to former employers',
  evidenceNeeded: [
    'Complete work history for the past 5 years',
    'Education and training history',
    'Medical evidence showing functional impairment prevents substantially gainful employment',
    'Lay statements from family, friends, or former coworkers describing occupational limitations',
    'Vocational expert opinion (optional but persuasive)',
  ],
  commonMistakes: [
    'Failing to report all service-connected disabilities on the 21-8940',
    'Not accounting for the combined effect of multiple service-connected disabilities',
    'Ignoring marginal employment exceptions when the veteran earns above poverty level',
    'Not requesting extraschedular referral when schedular criteria are not met',
    'Overlooking entitlement to SMC-S when TDIU is granted with separate 60% disability',
  ],
};

// ---------------------------------------------------------------------------
// 5. Permanent & Total (P&T) and Protection Rules
// ---------------------------------------------------------------------------

export const protectionRules: ProtectionRule[] = [
  {
    name: '5-Year Rule',
    yearsRequired: 5,
    description:
      'Disability ratings in effect for 5 or more years cannot be reduced unless the VA demonstrates sustained material improvement under the ordinary conditions of life — not just temporary improvement during a single examination.',
    exceptions:
      'Reduction is possible if improvement is clearly shown to be sustained, material, and demonstrated under ordinary conditions of daily life — not just during a single VA exam.',
    legalBasis: '38 C.F.R. § 3.344(a)',
  },
  {
    name: '10-Year Rule',
    yearsRequired: 10,
    description:
      'Service connection that has been in effect for 10 or more years cannot be severed except upon a showing that the original grant was based on fraud or CUE in the original decision.',
    exceptions: 'Only fraud or clear and unmistakable error (CUE) in the original rating decision.',
    legalBasis: '38 U.S.C. § 1159',
  },
  {
    name: '20-Year Rule',
    yearsRequired: 20,
    description:
      'A disability rating that has been continuously in effect for 20 or more years cannot be reduced below the level it has been rated — it is considered a "protected" rating — unless VA proves fraud.',
    exceptions: 'Only fraud.',
    legalBasis: '38 U.S.C. § 110',
  },
  {
    name: '100% for 20+ Years (P&T Protection)',
    yearsRequired: 20,
    description:
      'A veteran rated at 100% (either schedular or TDIU) for 20 continuous years is considered permanently and totally disabled. The total rating cannot be reduced.',
    exceptions: 'Only fraud.',
    legalBasis: '38 U.S.C. § 110; 38 C.F.R. § 3.951(b)',
  },
];

export const permanentAndTotalCriteria = {
  definition:
    'Permanent and Total (P&T) status means the VA has determined the veteran\'s service-connected disabilities are total (100% or TDIU) and permanent (not expected to improve). This is indicated by "No" in the "future examinations" field of the rating decision.',
  indicators: [
    'Rating codesheet or decision letter states "no future examinations are scheduled"',
    'Static disabilities that are by nature permanent (amputation, certain neurological conditions)',
    'Age and medical prognosis indicating improvement is not reasonably expected',
    'Veteran has been rated at 100% or TDIU for an extended period without improvement',
  ],
  benefitsUnlocked: [
    {
      benefit: 'Dependents Education Assistance (DEA / Chapter 35)',
      description: 'Eligible dependents receive up to 36 months of education benefits.',
    },
    {
      benefit: 'CHAMPVA',
      description:
        'Health care coverage for the veteran\'s spouse and dependents who are not eligible for TRICARE.',
    },
    {
      benefit: 'Property Tax Exemptions',
      description: 'Most states provide partial or full property tax exemptions for P&T veterans.',
    },
    {
      benefit: 'Commissary & Exchange Access',
      description: 'P&T veterans retain full commissary and exchange privileges.',
    },
    {
      benefit: 'No Future Reexaminations',
      description: 'The VA will not schedule routine future exams to reconsider the rating.',
    },
    {
      benefit: 'State Benefits',
      description: 'Many states offer additional benefits (free license plates, hunting/fishing licenses, state park passes, tuition waivers) specifically for P&T veterans.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 6. Back Pay Calculation Rules
// ---------------------------------------------------------------------------

export const backPayRules: BackPayRule[] = [
  {
    id: 'retroactive_to_effective_date',
    name: 'Retroactive to Effective Date',
    description:
      'VA back pay is calculated from the effective date of the award to the date of the rating decision. The effective date is typically the ITF date, date of claim, or day after discharge (if filed within 1 year of separation).',
    formula: '(Monthly rate at granted rating - Previous monthly rate) × Number of months from effective date to decision date',
  },
  {
    id: 'combined_rating_steps',
    name: 'Staged Ratings',
    description:
      'If the veteran\'s condition worsened over time, VA may assign "staged ratings" — different percentages for different periods. Back pay is calculated separately for each stage.',
    formula: 'Sum of [(Rate for each stage) × (Months in that stage)] minus any amounts already paid',
  },
  {
    id: 'separation_pay_offset',
    name: 'Separation Pay / Severance Pay Offset',
    description:
      'Veterans who received military separation pay or disability severance pay will have their VA compensation withheld until the gross (pre-tax) amount of separation pay is recouped. The veteran may be entitled to a tax refund for the taxes paid on the severance.',
    formula: 'VA compensation withheld until total withheld = gross separation pay received',
  },
  {
    id: 'crdp_crsc',
    name: 'CRDP / CRSC Offsets',
    description:
      'Military retirees with 20+ years of service and a VA rating of 50%+ may receive Concurrent Retirement and Disability Pay (CRDP), eliminating the VA offset from retirement pay. Combat-Related Special Compensation (CRSC) is an alternative for combat-related disabilities at any rating percentage.',
    formula: 'CRDP: Full VA compensation + Full retirement pay (no offset). CRSC: Tax-free compensation for combat-related portion, may exceed or replace CRDP depending on amounts.',
  },
  {
    id: 'drill_pay_offset',
    name: 'Drill Pay Offset',
    description:
      'Guard and Reserve members receiving VA compensation must waive drill pay for training days, or their VA compensation will be offset. This applies on a day-for-day basis.',
    formula: 'VA monthly compensation reduced by (daily VA rate × number of drill days in that month)',
  },
  {
    id: 'attorney_fees',
    name: 'Attorney / Agent Fees from Retro Pay',
    description:
      'If the veteran used an accredited attorney or claims agent, fees (typically 20-33.3% of past-due benefits) are withheld directly from the retroactive payment by VA and paid to the representative.',
    formula: 'Attorney fee = Agreed percentage (max 33.3%) × total past-due benefits awarded',
  },
];

// ---------------------------------------------------------------------------
// 7. VA Math — Combined Ratings Calculator Logic
// ---------------------------------------------------------------------------

export const vaMathSteps: VAMathStep[] = [
  {
    step: 1,
    instruction: 'List all service-connected disability ratings from highest to lowest.',
    example: 'Disabilities: 50%, 30%, 20%',
  },
  {
    step: 2,
    instruction:
      'Start with the highest rating. Calculate the remaining "efficient" body — what percentage of the body is NOT disabled.',
    example: '50% disability → 50% efficient (remaining).',
  },
  {
    step: 3,
    instruction:
      'Apply the next highest rating to the REMAINING efficient body, not the whole body.',
    example: '30% of the remaining 50% = 15%. Combined so far: 50% + 15% = 65% disabled.',
  },
  {
    step: 4,
    instruction: 'Continue applying each subsequent rating to the remaining efficient percentage.',
    example: '20% of the remaining 35% = 7%. Combined: 65% + 7% = 72% disabled.',
  },
  {
    step: 5,
    instruction:
      'After combining all ratings, round to the nearest 10%. VA rounds 0.5 and above UP (e.g., 72% rounds to 70%, 75% rounds to 80%).',
    example: '72% rounds to 70% combined rating.',
  },
];

/**
 * The bilateral factor: when a veteran has disabilities affecting both paired
 * extremities (both arms, both legs, both eyes, both ears), a 10% bonus is
 * added to the combined value of those bilateral disabilities before combining
 * with other disabilities.
 */
export const bilateralFactor = {
  description:
    'When a veteran has compensable disabilities affecting paired extremities (both arms, both legs, both eyes, or both ears), the combined rating of those bilateral disabilities receives a 10% bonus (of the combined bilateral value) before being combined with non-bilateral disabilities.',
  legalBasis: '38 C.F.R. § 4.26',
  example:
    'Left knee 20% + right knee 10% = combined bilateral value of 28%. Bilateral factor: 28% × 10% = 2.8%. Adjusted bilateral value: 28% + 2.8% = 30.8% (use 31% for combining with other disabilities).',
  pairedExtremities: [
    'Both upper extremities (arms/hands/shoulders/elbows/wrists)',
    'Both lower extremities (legs/feet/hips/knees/ankles)',
    'Both eyes',
    'Both ears',
  ],
};

/**
 * Calculate combined VA disability rating using VA math.
 * This is the pure mathematical calculation — rounding happens at the end.
 */
export function calculateCombinedRating(ratings: number[]): {
  exactCombined: number;
  roundedCombined: number;
  steps: string[];
} {
  if (ratings.length === 0) {
    return { exactCombined: 0, roundedCombined: 0, steps: [] };
  }

  // Sort descending
  const sorted = [...ratings].sort((a, b) => b - a);
  const steps: string[] = [];

  let combined = sorted[0] / 100;
  steps.push(`Start with highest rating: ${sorted[0]}% → ${(combined * 100).toFixed(2)}% disabled, ${((1 - combined) * 100).toFixed(2)}% efficient`);

  for (let i = 1; i < sorted.length; i++) {
    const nextRating = sorted[i] / 100;
    const remaining = 1 - combined;
    const addition = remaining * nextRating;
    combined = combined + addition;
    steps.push(
      `Apply ${sorted[i]}% to remaining ${(remaining * 100).toFixed(2)}% = ${(addition * 100).toFixed(2)}%. Combined: ${(combined * 100).toFixed(2)}%`
    );
  }

  const exactCombined = Math.round(combined * 10000) / 100; // Keep two decimals
  const roundedCombined = Math.round(exactCombined / 10) * 10;

  steps.push(`Exact combined: ${exactCombined}% → Rounded to nearest 10%: ${roundedCombined}%`);

  return { exactCombined, roundedCombined, steps };
}

/**
 * Calculate combined rating with bilateral factor applied.
 */
export function calculateCombinedWithBilateral(
  bilateralRatings: number[],
  otherRatings: number[]
): {
  bilateralCombined: number;
  bilateralFactorBonus: number;
  adjustedBilateral: number;
  finalExact: number;
  finalRounded: number;
  steps: string[];
} {
  const steps: string[] = [];

  // Step 1: Combine bilateral ratings
  const bilateralResult = calculateCombinedRating(bilateralRatings);
  const bilateralCombined = bilateralResult.exactCombined;
  steps.push(`Bilateral disabilities combined: ${bilateralCombined}%`);

  // Step 2: Apply 10% bilateral factor
  const bilateralFactorBonus = bilateralCombined * 0.1;
  const adjustedBilateral = bilateralCombined + bilateralFactorBonus;
  steps.push(
    `Bilateral factor (10%): ${bilateralCombined}% × 10% = ${bilateralFactorBonus.toFixed(2)}%`
  );
  steps.push(`Adjusted bilateral value: ${adjustedBilateral.toFixed(2)}%`);

  // Step 3: Combine adjusted bilateral with other ratings
  const allRatings = [adjustedBilateral, ...otherRatings];
  const finalResult = calculateCombinedRating(allRatings);

  steps.push(`Final combined: ${finalResult.exactCombined}% → Rounded: ${finalResult.roundedCombined}%`);

  return {
    bilateralCombined,
    bilateralFactorBonus,
    adjustedBilateral,
    finalExact: finalResult.exactCombined,
    finalRounded: finalResult.roundedCombined,
    steps,
  };
}

// ---------------------------------------------------------------------------
// Aggregate Export
// ---------------------------------------------------------------------------

export const vaCompensationRules = {
  effectiveDateRules,
  compensationRates2024,
  baseRateByPercent,
  smcLevels,
  tdiuRules,
  tdiuGuidance,
  protectionRules,
  permanentAndTotalCriteria,
  backPayRules,
  vaMathSteps,
  bilateralFactor,
};

export default vaCompensationRules;
