export interface VABenefit {
  id: string;
  name: string;
  description: string;
  eligibilityCriteria: string;
  ratingThreshold: number; // minimum combined rating (0 for no minimum)
  url: string; // official VA.gov URL
  category: 'healthcare' | 'education' | 'housing' | 'financial' | 'family' | 'employment';
}

export const benefitCategories: { key: VABenefit['category']; label: string }[] = [
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'education', label: 'Education & Training' },
  { key: 'housing', label: 'Housing' },
  { key: 'financial', label: 'Financial & Compensation' },
  { key: 'family', label: 'Family & Survivor Benefits' },
  { key: 'employment', label: 'Employment' },
];

export const vaBenefits: VABenefit[] = [
  // ─── Healthcare ──────────────────────────────────────────────────────
  {
    id: 'va-health-care',
    name: 'VA Health Care',
    description:
      'Comprehensive medical benefits including primary care, specialty care, prescriptions, and preventive health services through the VA health care system.',
    eligibilityCriteria:
      'Most veterans who served on active duty and were not dishonorably discharged are eligible. Priority groups are assigned based on service-connected disabilities and income.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/health-care/',
    category: 'healthcare',
  },
  {
    id: 'mental-health-services',
    name: 'Mental Health Services',
    description:
      'Mental health care including treatment for PTSD, depression, anxiety, substance use disorders, and other conditions. Includes individual therapy, group counseling, and crisis support.',
    eligibilityCriteria:
      'Available to all enrolled veterans. Veterans in crisis can contact the Veterans Crisis Line regardless of enrollment status.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/health-care/health-needs-conditions/mental-health/',
    category: 'healthcare',
  },
  {
    id: 'dental-care',
    name: 'VA Dental Care',
    description:
      'Dental services ranging from basic preventive care to comprehensive restorative treatment depending on eligibility class.',
    eligibilityCriteria:
      'Full dental benefits for veterans with a 100% disability rating, former POWs, and those with service-connected dental conditions. Limited one-time dental care available for recently separated veterans within 180 days of discharge.',
    ratingThreshold: 100,
    url: 'https://www.va.gov/health-care/about-va-health-benefits/dental-care/',
    category: 'healthcare',
  },
  {
    id: 'caregiver-support',
    name: 'Program of Comprehensive Assistance for Family Caregivers',
    description:
      'Support for family members caring for eligible veterans, including a monthly stipend, health insurance (if not already covered), mental health counseling, and respite care.',
    eligibilityCriteria:
      'Available to caregivers of veterans with a serious injury or illness incurred or aggravated in the line of duty. The veteran must need personal care services for a minimum of six months.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/family-member-benefits/comprehensive-assistance-for-family-caregivers/',
    category: 'healthcare',
  },

  // ─── Education & Training ───────────────────────────────────────────
  {
    id: 'gi-bill',
    name: 'Post-9/11 GI Bill (Chapter 33)',
    description:
      'Covers tuition and fees, provides a monthly housing allowance, and includes a books and supplies stipend for veterans pursuing higher education or training programs.',
    eligibilityCriteria:
      'Veterans with at least 90 aggregate days of active-duty service after September 10, 2001, or those discharged with a service-connected disability after 30 continuous days. Benefits scale from 40% to 100% based on length of service.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/education/about-gi-bill-benefits/post-9-11/',
    category: 'education',
  },
  {
    id: 'vre-chapter-31',
    name: 'Veteran Readiness and Employment (VR&E / Chapter 31)',
    description:
      'Provides vocational counseling, training, education, job-seeking skills coaching, and employment assistance to help veterans with service-connected disabilities prepare for and find suitable employment.',
    eligibilityCriteria:
      'Veterans with a service-connected disability rating of at least 10% and an employment handicap, or a rating of at least 20% with a serious employment handicap. Must not have received a dishonorable discharge.',
    ratingThreshold: 10,
    url: 'https://www.va.gov/careers-employment/vocational-rehabilitation/',
    category: 'education',
  },
  {
    id: 'dea-chapter-35',
    name: 'Survivors\' and Dependents\' Educational Assistance (DEA / Chapter 35)',
    description:
      'Provides education and training benefits to eligible dependents and survivors of veterans who are permanently and totally disabled or who died from service-connected conditions.',
    eligibilityCriteria:
      'Available to dependents and survivors of veterans who have a permanent and total (P&T) service-connected disability rating of 100%, died in service, or died from a service-connected disability.',
    ratingThreshold: 100,
    url: 'https://www.va.gov/education/survivor-dependent-benefits/dependents-education-assistance/',
    category: 'education',
  },

  // ─── Housing ─────────────────────────────────────────────────────────
  {
    id: 'va-home-loan',
    name: 'VA Home Loan Guaranty',
    description:
      'VA-backed home loans with no down payment required, no private mortgage insurance (PMI), competitive interest rates, and limited closing costs. Includes purchase, refinance, and cash-out refinance options.',
    eligibilityCriteria:
      'Available to veterans, active-duty service members, National Guard and Reserve members with qualifying service, and eligible surviving spouses. A Certificate of Eligibility (COE) is required.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/housing-assistance/home-loans/',
    category: 'housing',
  },
  {
    id: 'specially-adapted-housing',
    name: 'Specially Adapted Housing (SAH) Grant',
    description:
      'Grants to help veterans with certain severe service-connected disabilities build, remodel, or purchase an adapted home. Covers modifications like wheelchair ramps, widened doorways, and roll-in showers.',
    eligibilityCriteria:
      'Veterans with service-connected disabilities including loss or loss of use of both lower extremities, blindness in both eyes, loss or loss of use of one lower and one upper extremity, or certain severe burns.',
    ratingThreshold: 100,
    url: 'https://www.va.gov/housing-assistance/disability-housing-grants/',
    category: 'housing',
  },
  {
    id: 'property-tax-exemption',
    name: 'Property Tax Exemption',
    description:
      'Partial or full property tax exemptions for disabled veterans. The specific benefit amount and eligibility requirements vary significantly by state and local jurisdiction.',
    eligibilityCriteria:
      'Eligibility varies by state. Most states offer full property tax exemptions for veterans rated 100% disabled. Many states provide partial exemptions at lower ratings. Check your state\'s Department of Veterans Affairs for specific requirements.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/housing-assistance/',
    category: 'housing',
  },

  // ─── Financial & Compensation ────────────────────────────────────────
  {
    id: 'disability-compensation',
    name: 'VA Disability Compensation',
    description:
      'Tax-free monthly payments to veterans with service-connected disabilities. Compensation rates are based on disability rating percentage from 10% to 100% and increase with dependents.',
    eligibilityCriteria:
      'Veterans with injuries or diseases that were incurred or aggravated during active military service and who have a disability rating of 10% or higher. Must have been discharged under other than dishonorable conditions.',
    ratingThreshold: 10,
    url: 'https://www.va.gov/disability/',
    category: 'financial',
  },
  {
    id: 'tdiu',
    name: 'Total Disability Based on Individual Unemployability (TDIU)',
    description:
      'Allows veterans who cannot maintain substantially gainful employment due to service-connected disabilities to receive compensation at the 100% rate, even if their combined schedular rating is less than 100%.',
    eligibilityCriteria:
      'Schedular TDIU requires one service-connected disability rated at least 60%, or two or more disabilities with a combined rating of at least 70% (with one disability rated at least 40%). The veteran must be unable to maintain substantially gainful employment due to service-connected disabilities.',
    ratingThreshold: 60,
    url: 'https://www.va.gov/disability/eligibility/special-claims/unemployability/',
    category: 'financial',
  },
  {
    id: 'special-monthly-compensation',
    name: 'Special Monthly Compensation (SMC)',
    description:
      'Additional tax-free compensation paid to veterans with especially severe disabilities or combinations of disabilities, beyond standard disability compensation rates.',
    eligibilityCriteria:
      'Veterans with service-connected disabilities involving loss or loss of use of specific organs or extremities, being housebound, or needing regular aid and attendance. Levels range from SMC-K through SMC-T depending on severity.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/disability/compensation-rates/special-monthly-compensation-rates/',
    category: 'financial',
  },
  {
    id: 'aid-attendance',
    name: 'Aid and Attendance or Housebound Benefits',
    description:
      'Increased monthly pension or compensation for veterans and survivors who need the aid and attendance of another person for daily activities, or who are substantially confined to their home.',
    eligibilityCriteria:
      'Veterans receiving VA pension or disability compensation who require help with daily activities (bathing, dressing, eating), are bedridden, are in a nursing home, or have limited eyesight. Housebound benefits are for those substantially confined to their immediate premises.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/pension/aid-attendance-housebound/',
    category: 'financial',
  },

  // ─── Family & Survivor Benefits ──────────────────────────────────────
  {
    id: 'champva',
    name: 'Civilian Health and Medical Program of the VA (CHAMPVA)',
    description:
      'Health insurance program for the spouse, surviving spouse, and children of a veteran who is permanently and totally disabled from a service-connected condition, or who died from a service-connected disability.',
    eligibilityCriteria:
      'Available to the spouse or child of a veteran who has a permanent and total (P&T) disability rating, died from a service-connected condition, or was rated P&T at time of death. Beneficiaries must not be eligible for TRICARE.',
    ratingThreshold: 100,
    url: 'https://www.va.gov/health-care/family-caregiver-benefits/champva/',
    category: 'family',
  },
  {
    id: 'dic',
    name: 'Dependency and Indemnity Compensation (DIC)',
    description:
      'Tax-free monthly benefit paid to eligible surviving spouses, children, and parents of service members who died in the line of duty or from service-connected disabilities.',
    eligibilityCriteria:
      'Surviving spouses who were married to the veteran for at least one year (or had a child together), and the veteran died from a service-connected condition, died while receiving or entitled to receive VA compensation for a service-connected condition rated totally disabling for a continuous period of at least 10 years immediately preceding death.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/survivors/dependency-indemnity-compensation/',
    category: 'family',
  },
  {
    id: 'dependent-education',
    name: 'Dependents\' Educational Assistance (Chapter 35)',
    description:
      'Up to 45 months of education benefits for eligible dependents of veterans who are permanently and totally disabled or who died from service-connected conditions. Can be used for degree programs, certificates, apprenticeships, and on-the-job training.',
    eligibilityCriteria:
      'Spouses and children of veterans with a permanent and total (100% P&T) service-connected disability, veterans who died in service or from a service-connected disability, or service members MIA or captured in the line of duty.',
    ratingThreshold: 100,
    url: 'https://www.va.gov/education/survivor-dependent-benefits/',
    category: 'family',
  },

  // ─── Employment ──────────────────────────────────────────────────────
  {
    id: 'vocational-rehab',
    name: 'Vocational Rehabilitation & Employment',
    description:
      'Comprehensive employment services including vocational counseling, resume development, job training, employment accommodations, and up to 48 months of education or training assistance.',
    eligibilityCriteria:
      'Veterans with a service-connected disability rating of at least 10% who have an employment handicap. Veterans with a serious employment handicap may qualify with a 20% or higher rating. Active-duty service members may also apply prior to separation.',
    ratingThreshold: 10,
    url: 'https://www.va.gov/careers-employment/vocational-rehabilitation/',
    category: 'employment',
  },
  {
    id: 'va-hiring-preference',
    name: 'Veterans\' Preference in Federal Hiring',
    description:
      'Eligible veterans receive preference in hiring for federal government positions. Disabled veterans receive a 10-point preference, while non-disabled veterans receive a 5-point preference applied to their examination scores.',
    eligibilityCriteria:
      'Disabled veterans with a service-connected disability rating of 10% or higher receive 10-point preference. Veterans who served during certain periods or campaigns receive 5-point preference. Preference applies to competitive service positions.',
    ratingThreshold: 10,
    url: 'https://www.va.gov/careers-employment/',
    category: 'employment',
  },
  {
    id: 'vets-program',
    name: 'Veterans\' Employment and Training Service (VETS)',
    description:
      'Department of Labor program providing employment resources, job training, and career counseling for transitioning service members and veterans. Includes the Jobs for Veterans State Grants (JVSG) program and Homeless Veterans\' Reintegration Program.',
    eligibilityCriteria:
      'Available to all veterans and eligible spouses. Priority of service is given to veterans and eligible spouses for all DOL-funded job training programs. No minimum disability rating required.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/careers-employment/',
    category: 'employment',
  },
];
