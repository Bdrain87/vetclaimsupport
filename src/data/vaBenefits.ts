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

  // ─── Healthcare (additional) ────────────────────────────────────────
  {
    id: 'vet-centers',
    name: 'Vet Centers (Readjustment Counseling)',
    description:
      'Community-based counseling centers providing readjustment counseling, bereavement counseling, military sexual trauma counseling, and referral services. Over 300 locations nationwide with extended hours and a welcoming, non-clinical environment.',
    eligibilityCriteria:
      'Veterans who served in a combat zone or area of hostility, experienced military sexual trauma, provided direct emergency medical or mental health care to casualties of war, or served as drone crew members. Active-duty service members and their families are also eligible.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/vet-center/',
    category: 'healthcare',
  },
  {
    id: 'community-care',
    name: 'Community Care (MISSION Act)',
    description:
      'Allows eligible veterans to receive health care from community providers outside the VA system when VA care is not feasible. Covers situations where VA wait times exceed access standards, the veteran lives too far from a VA facility, or the needed service is not available at VA.',
    eligibilityCriteria:
      'Veterans enrolled in VA health care who meet one or more eligibility criteria: drive time or wait time access standards not met, the needed service is not available at VA, the veteran\'s state has no full-service VA medical facility, or the veteran qualifies under the grandfather provision from the Veterans Choice Program.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/communitycare/',
    category: 'healthcare',
  },
  {
    id: 'va-telehealth',
    name: 'VA Telehealth',
    description:
      'Virtual health care services including video visits, phone appointments, secure messaging, and remote patient monitoring. Includes VA Video Connect for real-time video appointments from home and access through the VA Health Chat app.',
    eligibilityCriteria:
      'Available to all veterans enrolled in VA health care. No minimum disability rating required. Veterans need a smartphone, tablet, or computer with internet access for video visits.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/health-care/get-medical-records/share-health-information/',
    category: 'healthcare',
  },
  {
    id: 'prosthetics-sensory-aids',
    name: 'Prosthetics & Sensory Aids',
    description:
      'Comprehensive prosthetic and orthotic services, hearing aids, eyeglasses, and other assistive devices. Includes custom prosthetic limbs, wheelchairs, artificial eyes, communication devices, and home medical equipment.',
    eligibilityCriteria:
      'Available to veterans with a service-connected disability requiring prosthetic or sensory aid devices. Also available to veterans enrolled in VA health care who have a clinical need for these devices as part of their treatment plan.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/health-care/about-va-health-benefits/vision-care/',
    category: 'healthcare',
  },

  // ─── Financial & Compensation (additional) ──────────────────────────
  {
    id: 'crsc',
    name: 'Combat-Related Special Compensation (CRSC)',
    description:
      'Tax-free monthly compensation for military retirees with combat-related disabilities. Restores the VA disability offset from military retired pay for disabilities directly caused by combat, hazardous duty, instrumentality of war, or armed conflict.',
    eligibilityCriteria:
      'Military retirees with at least 20 years of service (or medically retired) who have VA-rated disabilities that are combat-related. The disability must be the direct result of armed conflict, hazardous duty, conditions simulating war, or an instrumentality of war.',
    ratingThreshold: 10,
    url: 'https://www.va.gov/disability/',
    category: 'financial',
  },
  {
    id: 'crdp',
    name: 'Concurrent Retirement and Disability Pay (CRDP)',
    description:
      'Allows military retirees with 50% or higher VA disability rating to receive both full military retirement pay and VA disability compensation without offset. CRDP is phased in and is taxable as military retirement pay.',
    eligibilityCriteria:
      'Military retirees with 20+ years of service (or medical retirees under Chapter 61) who have a VA disability rating of 50% or higher. CRDP is automatically applied — no application needed. Cannot receive both CRDP and CRSC; the higher amount is paid.',
    ratingThreshold: 50,
    url: 'https://www.va.gov/disability/',
    category: 'financial',
  },
  {
    id: 'va-pension',
    name: 'VA Pension (Non-Service-Connected)',
    description:
      'Needs-based monthly benefit for wartime veterans who are 65 or older, or permanently and totally disabled (not due to service). Provides supplemental income to bring the veteran\'s total income up to the Maximum Annual Pension Rate (MAPR).',
    eligibilityCriteria:
      'Veterans with at least 90 days of active-duty service (at least one day during a wartime period) who are 65+ or permanently and totally disabled, and whose countable income and net worth fall below VA thresholds. Must have been discharged under other than dishonorable conditions.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/pension/',
    category: 'financial',
  },
  {
    id: 'survivors-pension',
    name: 'Survivors Pension (Death Pension)',
    description:
      'Tax-free monthly benefit for the surviving spouse or unmarried dependent child of a deceased wartime veteran. Provides supplemental income based on the difference between the survivor\'s countable income and the annual pension limit.',
    eligibilityCriteria:
      'Unremarried surviving spouse or unmarried dependent child of a deceased veteran who served during a wartime period, had at least 90 days of active-duty service, and was discharged under other than dishonorable conditions. Income and net worth limits apply.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/pension/survivors-pension/',
    category: 'financial',
  },

  // ─── Family & Survivor Benefits (additional) ────────────────────────
  {
    id: 'burial-benefits',
    name: 'Burial Benefits',
    description:
      'Burial allowances to help cover burial, funeral, and transportation costs. Also includes government headstones, markers, and medallions for any deceased veteran, and Presidential Memorial Certificates and burial flags.',
    eligibilityCriteria:
      'Available to any veteran who was discharged under other than dishonorable conditions. Burial allowance amounts vary based on whether the death was service-connected. National cemetery burial is available to veterans, their spouses, and dependent children.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/burials-memorials/',
    category: 'family',
  },
  {
    id: 'sgli-vgli',
    name: 'SGLI / VGLI Life Insurance',
    description:
      'Servicemembers\' Group Life Insurance (SGLI) provides low-cost group life insurance up to $500,000 for active-duty members. Veterans\' Group Life Insurance (VGLI) allows separated veterans to convert SGLI coverage to renewable term insurance without medical underwriting if applied for within 240 days of separation.',
    eligibilityCriteria:
      'SGLI is available to active-duty service members, Ready Reserve/National Guard members, cadets, and midshipmen. VGLI is available to veterans within 1 year and 120 days of separation from service. No disability rating required.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/life-insurance/',
    category: 'family',
  },
  {
    id: 'fry-scholarship',
    name: 'Fry Scholarship (Chapter 33 for Survivors)',
    description:
      'Provides Post-9/11 GI Bill benefits to children and surviving spouses of service members who died in the line of duty after September 10, 2001. Covers tuition, fees, a monthly housing allowance, and a books and supplies stipend for up to 36 months.',
    eligibilityCriteria:
      'Children and surviving spouses of an active-duty member of the Armed Forces who died in the line of duty on or after September 11, 2001. Children may use the benefit between ages 18 and 33. Surviving spouses lose eligibility upon remarriage.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/education/survivor-dependent-benefits/fry-scholarship/',
    category: 'family',
  },
  {
    id: 'camp-lejeune',
    name: 'Camp Lejeune Family Member Program',
    description:
      'Provides health care benefits to family members of veterans who served at Camp Lejeune between August 1, 1953, and December 31, 1987, and were exposed to contaminated drinking water. Covers treatment for 15 specified medical conditions.',
    eligibilityCriteria:
      'Family members who resided at Camp Lejeune for at least 30 cumulative days between August 1953 and December 1987 and have one of the 15 covered conditions (including cancers, birth defects, and other illnesses). The veteran must have served at Camp Lejeune during the same period.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/disability/eligibility/hazardous-materials-exposure/camp-lejeune-water-contamination/',
    category: 'family',
  },

  // ─── Housing (additional) ───────────────────────────────────────────
  {
    id: 'sha-grant',
    name: 'Special Housing Adaptation (SHA) Grant',
    description:
      'Grants to help veterans with certain service-connected disabilities adapt an existing home to meet their needs. Can be used to modify an existing home owned by the veteran or a family member. Maximum grant amount is approximately $22,036 (adjusted annually).',
    eligibilityCriteria:
      'Veterans with service-connected disabilities including blindness in both eyes (with 20/200 acuity or less), loss or loss of use of both hands, certain severe burns, or certain severe respiratory injuries.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/housing-assistance/disability-housing-grants/',
    category: 'housing',
  },
  {
    id: 'tra-grant',
    name: 'Temporary Residence Adaptation (TRA) Grant',
    description:
      'A grant for veterans who are temporarily living in a family member\'s home and need to adapt it for their disability-related needs. The TRA grant provides a portion of the SAH or SHA grant amount for use on a family member\'s home.',
    eligibilityCriteria:
      'Veterans who qualify for SAH or SHA grants and are temporarily residing in a family member\'s home. The adaptation must be to the family member\'s residence. Veterans can use this while deciding on a permanent home.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/housing-assistance/disability-housing-grants/',
    category: 'housing',
  },
  {
    id: 'homeless-veteran-programs',
    name: 'Homeless Veteran Programs (HUD-VASH, SSVF, GPD)',
    description:
      'Comprehensive programs for homeless and at-risk veterans. HUD-VASH combines housing vouchers with VA case management. Supportive Services for Veteran Families (SSVF) provides rapid re-housing and homelessness prevention. Grant and Per Diem (GPD) funds community organizations providing transitional housing.',
    eligibilityCriteria:
      'Veterans who are homeless or at imminent risk of homelessness. HUD-VASH requires VA health care eligibility and chronic homelessness or other risk factors. SSVF serves very low-income veteran families. Contact the National Call Center for Homeless Veterans at 1-877-4AID-VET.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/homeless/',
    category: 'housing',
  },

  // ─── Employment (additional) ────────────────────────────────────────
  {
    id: 'vosb-certification',
    name: 'Veteran-Owned Small Business (VOSB) Certification',
    description:
      'Federal certification for businesses owned and controlled by veterans. Provides access to sole-source and set-aside contracting opportunities with the federal government. Service-Disabled Veteran-Owned Small Businesses (SDVOSB) receive additional contracting preferences.',
    eligibilityCriteria:
      'The veteran must own at least 51% of the business, control day-to-day management and decision-making, and hold the highest officer position. For SDVOSB, the veteran must also have a service-connected disability rating. Business must be small per SBA size standards.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/careers-employment/veteran-owned-business-support/',
    category: 'employment',
  },
  {
    id: 'tap',
    name: 'Transition Assistance Program (TAP)',
    description:
      'Mandatory program for separating service members providing employment workshops, benefits briefings, financial planning, and career counseling. Includes the VA Benefits Briefing, Department of Labor Employment Workshop, and optional tracks for education, entrepreneurship, and career technical training.',
    eligibilityCriteria:
      'Required for all separating active-duty service members. Must begin no later than 365 days before separation. Available to National Guard and Reserve members upon demobilization. Spouses and caregivers may attend select modules.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/careers-employment/education-and-career-counseling/',
    category: 'employment',
  },
  {
    id: 'compensated-work-therapy',
    name: 'Compensated Work Therapy (CWT)',
    description:
      'Vocational rehabilitation program that provides competitive work opportunities for veterans with disabilities who are receiving VA treatment. Includes Sheltered Workshop, Transitional Work, and Supported Employment components to help veterans build skills and reintegrate into the workforce.',
    eligibilityCriteria:
      'Veterans with physical or mental disabilities who are enrolled in VA treatment programs. Participants are matched to work assignments based on their abilities, interests, and treatment goals. Referral from a VA treatment team is required.',
    ratingThreshold: 0,
    url: 'https://www.va.gov/careers-employment/vocational-rehabilitation/',
    category: 'employment',
  },
];
