/**
 * Curated state veteran benefits data.
 *
 * Sources are official state DVA / comptroller / wildlife pages.
 * Last verified: 2026-03-09
 *
 * Coverage: top 10 states by veteran population.
 * States without curated data fall back to AI generation.
 */

export interface StateBenefit {
  category:
    | 'property_tax'
    | 'income_tax'
    | 'education'
    | 'employment'
    | 'vehicle'
    | 'recreation'
    | 'other';
  title: string;
  description: string;
  ratingRequired?: string;
}

export interface StateData {
  state: string;
  abbreviation: string;
  sourceUrl: string;
  lastVerified: string;
  benefits: StateBenefit[];
}

export const CURATED_STATES: Record<string, StateData> = {
  Texas: {
    state: 'Texas',
    abbreviation: 'TX',
    sourceUrl: 'https://tvc.texas.gov/',
    lastVerified: '2026-03-09',
    benefits: [
      {
        category: 'property_tax',
        title: '100% Property Tax Exemption',
        description:
          'Veterans rated 100% P&T or receiving Individual Unemployability are exempt from all property taxes on their homestead. Unremarried surviving spouses retain the exemption.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'property_tax',
        title: 'Partial Property Tax Exemption',
        description:
          'Partially disabled veterans receive an exemption proportional to their disability percentage. Veterans 65+ with at least 10% rating, or who are blind in one or both eyes, or have lost use of one or more limbs may receive a $12,000 exemption.',
        ratingRequired: '10%+',
      },
      {
        category: 'income_tax',
        title: 'No State Income Tax',
        description:
          'Texas has no state income tax. Military retirement pay, VA disability compensation, and TSP distributions are all state tax-free.',
        ratingRequired: 'none',
      },
      {
        category: 'education',
        title: 'Hazlewood Act — 150 Hours Free Tuition',
        description:
          'Up to 150 credit hours of tuition exemption at Texas public colleges and universities. Unused hours can be transferred to a spouse or dependent child (Legacy Act). Must have entered service in Texas or declared Texas as home of record.',
        ratingRequired: 'none',
      },
      {
        category: 'vehicle',
        title: 'Free Vehicle Registration & DV Plates',
        description:
          'Disabled Veteran specialty plates available for $3. One free vehicle registration for a personally owned vehicle. 100% disabled veterans receive free registration.',
        ratingRequired: '50%+',
      },
      {
        category: 'recreation',
        title: 'Free Hunting & Fishing License',
        description:
          'Free Super Combo Hunting and All-Water Fishing Package for veterans with 50%+ disability or loss of use of a foot or leg. Includes the State Parklands Passport for free state park access.',
        ratingRequired: '50%+',
      },
      {
        category: 'other',
        title: 'Texas Veterans Land Board Loans',
        description:
          'Below-market interest rate loans for land, homes, and home improvements exclusively for Texas veterans. Land loans up to $150,000 with 5% down.',
        ratingRequired: 'none',
      },
    ],
  },

  California: {
    state: 'California',
    abbreviation: 'CA',
    sourceUrl: 'https://www.calvet.ca.gov/',
    lastVerified: '2026-03-09',
    benefits: [
      {
        category: 'property_tax',
        title: 'Disabled Veterans Property Tax Exemption',
        description:
          'Veterans rated 100% disabled or compensated at 100% due to unemployability receive a property tax exemption on their primary residence. 2026 amounts: $175,298 (basic) or $262,950 (low-income). Unmarried surviving spouses also qualify.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'property_tax',
        title: 'Veterans Property Tax Exemption',
        description:
          'Qualified veterans who own limited property may receive an exemption of up to $4,000 on assessed value.',
        ratingRequired: 'none',
      },
      {
        category: 'income_tax',
        title: 'VA Disability Pay Exempt',
        description:
          'VA disability compensation is exempt from California state income tax. Military retirement pay is taxed as regular income.',
        ratingRequired: 'any rated',
      },
      {
        category: 'education',
        title: 'CalVet College Fee Waiver',
        description:
          'Waives mandatory tuition and fees at California community colleges, CSU, and UC campuses for dependents and spouses of deceased or 100% disabled veterans. Income limits apply for some plans.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'other',
        title: 'CalVet Home Loans',
        description:
          'Below-market-rate home loans for California veterans with at least 90 days of active service and an honorable discharge.',
        ratingRequired: 'none',
      },
      {
        category: 'vehicle',
        title: 'Disabled Veteran License Plates',
        description:
          'Free DV plates and placards for veterans with service-connected disabilities. Exempt from some vehicle fees.',
        ratingRequired: 'any rated',
      },
      {
        category: 'recreation',
        title: 'Free State Park Pass',
        description:
          'Disabled Veterans and former POWs receive a free Distinguished Veteran Pass for day-use parking at all California state parks.',
        ratingRequired: '50%+',
      },
    ],
  },

  Florida: {
    state: 'Florida',
    abbreviation: 'FL',
    sourceUrl: 'https://floridavets.org/',
    lastVerified: '2026-03-09',
    benefits: [
      {
        category: 'property_tax',
        title: 'Total Property Tax Exemption',
        description:
          'Veterans with a 100% P&T service-connected disability or who use a wheelchair due to service-connected injury receive a total homestead property tax exemption. Unremarried surviving spouses retain the exemption.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'property_tax',
        title: '$5,000 Property Tax Exemption',
        description:
          'Veterans with a 10%+ service-connected disability receive a $5,000 property tax exemption on their homestead.',
        ratingRequired: '10%+',
      },
      {
        category: 'property_tax',
        title: 'Combat-Related Discount',
        description:
          'Partially disabled veterans age 65+ with combat-related disability receive a property tax discount equal to their disability percentage.',
        ratingRequired: 'any rated',
      },
      {
        category: 'income_tax',
        title: 'No State Income Tax',
        description:
          'Florida has no state income tax. Military retirement pay, VA disability compensation, and TSP distributions are all state tax-free.',
        ratingRequired: 'none',
      },
      {
        category: 'education',
        title: 'Dependents Education — CSDDV Scholarship',
        description:
          'Children and spouses of deceased or 100% disabled veterans receive tuition assistance. Purple Heart recipients receive a full tuition waiver.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'recreation',
        title: 'Free Hunting & Fishing License',
        description:
          'Veterans with 50%+ disability get a free hunting and fishing license. 100% disabled veterans get a free five-year license. Military Gold Sportsman\'s License available for $20 (vs ~$100 standard).',
        ratingRequired: '50%+',
      },
      {
        category: 'recreation',
        title: 'Free State Park Pass',
        description:
          'Disabled veterans with service-connected disabilities receive a free lifetime entrance pass to all 175 Florida state parks. All veterans get 25% off annual passes.',
        ratingRequired: 'any rated',
      },
      {
        category: 'employment',
        title: 'State Employment Preference',
        description:
          'Veterans and spouses of disabled veterans receive preference in state government hiring.',
        ratingRequired: 'none',
      },
    ],
  },

  Virginia: {
    state: 'Virginia',
    abbreviation: 'VA',
    sourceUrl: 'https://www.dvs.virginia.gov/',
    lastVerified: '2026-03-09',
    benefits: [
      {
        category: 'property_tax',
        title: 'Full Property Tax Exemption',
        description:
          'Veterans rated 100% P&T are exempt from all property taxes on their primary residence and up to one acre. No income or net worth limits. Unremarried surviving spouses (if veteran died after 1/1/2011) retain the exemption and can move within Virginia.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'income_tax',
        title: 'Military Retirement Pay Deduction',
        description:
          'Virginia exempts up to $40,000 of military retirement pay from state income tax. VA disability compensation is fully exempt.',
        ratingRequired: 'none',
      },
      {
        category: 'vehicle',
        title: 'Vehicle Tax Exemption',
        description:
          'One personal vehicle (car or pickup, owned not leased) is exempt from local personal property tax for veterans rated 100% P&T.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'education',
        title: 'VMSDEP — Dependents Education',
        description:
          'Up to 8 semesters of tuition-free education at Virginia public institutions for children and spouses of veterans who are 90%+ disabled, KIA, MIA, or POW. All veterans and dependents get in-state tuition rates.',
        ratingRequired: '90%+',
      },
      {
        category: 'recreation',
        title: 'Free Hunting & Fishing License',
        description:
          'Free lifetime hunting and freshwater fishing license for 100% disabled veterans. Reduced fees for veterans with 70%+ disability.',
        ratingRequired: '70%+',
      },
      {
        category: 'recreation',
        title: 'State Parks Passport',
        description:
          'Free passport providing parking, admission, boat launch access, and discounts on camping for 100% disabled veterans. No Virginia residency required.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'employment',
        title: 'State Employment Preference',
        description:
          'Veterans receive hiring preference for state government positions.',
        ratingRequired: 'none',
      },
    ],
  },

  'North Carolina': {
    state: 'North Carolina',
    abbreviation: 'NC',
    sourceUrl: 'https://www.milvets.nc.gov/',
    lastVerified: '2026-03-09',
    benefits: [
      {
        category: 'property_tax',
        title: 'Homestead Exclusion',
        description:
          'First $45,000 of appraised value exempt for veterans rated 100% P&T or who receive specially adapted housing. Pending legislation may increase this to $125,000+ for 2026. Apply by June 1.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'income_tax',
        title: 'Military Pension Exempt',
        description:
          'North Carolina does not tax military retirement pay. VA disability compensation is also fully exempt from state income tax.',
        ratingRequired: 'none',
      },
      {
        category: 'education',
        title: 'Dependents Scholarship',
        description:
          'Children of deceased, disabled, or POW/MIA veterans may receive full tuition, fees, and a stipend for up to 8 semesters at NC public institutions.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'recreation',
        title: 'Reduced Lifetime Hunting & Fishing',
        description:
          'Disabled veterans with 50%+ rating can purchase lifetime hunting and fishing licenses at reduced rates ($10-$110). Veterans are exempt from licensing for Mountain Heritage Trout waters.',
        ratingRequired: '50%+',
      },
      {
        category: 'vehicle',
        title: 'Disabled Veteran License Plates',
        description:
          'Free DV plates available. Pending legislation would exempt vehicles from property tax for 100% disabled veterans.',
        ratingRequired: 'any rated',
      },
      {
        category: 'employment',
        title: 'State Employment Preference',
        description:
          'Veterans receive preference in state hiring. NC also offers the NC4ME employer network connecting veterans with jobs.',
        ratingRequired: 'none',
      },
    ],
  },

  Georgia: {
    state: 'Georgia',
    abbreviation: 'GA',
    sourceUrl: 'https://veterans.georgia.gov/',
    lastVerified: '2026-03-09',
    benefits: [
      {
        category: 'property_tax',
        title: 'Disabled Veteran Property Tax Exemption',
        description:
          'Veterans rated 100% disabled or with loss of vision/limbs, along with unremarried surviving spouses, receive an exemption of up to $121,812 of assessed value.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'income_tax',
        title: 'Military Retirement Pay Exemption',
        description:
          'Retirees of any age may receive a $65,000 exemption on military retirement pay starting in 2026. VA disability compensation is fully exempt.',
        ratingRequired: 'none',
      },
      {
        category: 'education',
        title: 'Combat Veteran Tuition Exemption',
        description:
          'Combat veterans enrolled at a University System of Georgia institution can receive an exemption from all obligatory fees (excludes housing, food, and elective fees).',
        ratingRequired: 'none',
      },
      {
        category: 'employment',
        title: 'State Employment Preference',
        description:
          'War veterans receive 5-point credit for state employment. Veterans with 10%+ disability receive 10-point credit. Disabled veterans also get a 10-year exemption from local business/occupation taxes.',
        ratingRequired: '10%+',
      },
      {
        category: 'recreation',
        title: 'One-Time Free Hunting & Fishing License',
        description:
          'Georgia resident veterans with 90+ days active service and honorable discharge receive a free one-year hunting and fishing license (one-time). Permanently disabled veterans may get a discounted three-year sportsman\'s license.',
        ratingRequired: 'none',
      },
      {
        category: 'recreation',
        title: 'State Parks Discount',
        description:
          'Disabled veterans receive 25% off state park entrance, annual passes, lodging, recreational activities, golf, and historic sites.',
        ratingRequired: 'any rated',
      },
      {
        category: 'vehicle',
        title: 'Free Driver\'s License & Vehicle Tags',
        description:
          'Disabled veterans may receive free driver\'s license and special vehicle tags.',
        ratingRequired: 'any rated',
      },
    ],
  },

  Washington: {
    state: 'Washington',
    abbreviation: 'WA',
    sourceUrl: 'https://www.dva.wa.gov/',
    lastVerified: '2026-03-09',
    benefits: [
      {
        category: 'property_tax',
        title: 'Property Tax Exemption (Income-Based)',
        description:
          'Veterans with 80%+ disability (or age 61+, or retired due to disability) with combined disposable income under $40,000 qualify for property tax reduction. VA disability pay is excluded from income calculation.',
        ratingRequired: '80%+',
      },
      {
        category: 'property_tax',
        title: 'New Tiered Property Tax Exemption (2026)',
        description:
          'New legislation (SB5398): 10-29% disability = up to $5,000 exemption; 30-49% = $7,500; 50-69% = $10,000; 70-100% = $12,000. Amounts adjusted annually for inflation.',
        ratingRequired: '10%+',
      },
      {
        category: 'income_tax',
        title: 'No State Income Tax',
        description:
          'Washington has no state income tax. All military retirement pay, VA disability compensation, and TSP distributions are state tax-free.',
        ratingRequired: 'none',
      },
      {
        category: 'education',
        title: 'Tuition Waiver — Up to 200 Credits',
        description:
          'State colleges and universities waive tuition and fees for eligible veterans, Guard/Reserve members, spouses, and dependents for up to 200 quarter credits. Includes up to $500/year textbook stipend. Dependents of 100% disabled or KIA veterans also qualify.',
        ratingRequired: 'none',
      },
      {
        category: 'recreation',
        title: 'Half-Price Hunting & Fishing',
        description:
          'Veterans rated 30%+ disabled or veterans 65+ with a VA-rated disability receive half-price hunting and fishing licenses.',
        ratingRequired: '30%+',
      },
      {
        category: 'employment',
        title: 'State Employment Preference',
        description:
          'Veterans and their spouses receive hiring preference for state government positions.',
        ratingRequired: 'none',
      },
    ],
  },

  Colorado: {
    state: 'Colorado',
    abbreviation: 'CO',
    sourceUrl: 'https://vets.colorado.gov/',
    lastVerified: '2026-03-09',
    benefits: [
      {
        category: 'property_tax',
        title: '50% Property Tax Exemption',
        description:
          'Colorado exempts 50% of the first $200,000 of actual home value for veterans rated 100% P&T and Gold Star spouses. TDIU veterans (70%+ paid at 100%) also qualify thanks to Amendment G.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'income_tax',
        title: 'Military Retirement Pay Exclusion',
        description:
          'Colorado excludes military retirement pay from state income tax for retirees age 55+. VA disability compensation is fully exempt.',
        ratingRequired: 'none',
      },
      {
        category: 'education',
        title: 'National Guard Tuition Waiver',
        description:
          '100% tuition waiver at Colorado state institutions for National Guard members (effective July 2025). No additional service obligation required.',
        ratingRequired: 'none',
      },
      {
        category: 'recreation',
        title: 'Free Lifetime Hunting & Fishing',
        description:
          'Free lifetime combination small game hunting and fishing license for Colorado residents with 50%+ disability or Purple Heart. Big game requires separate licenses through the draw process.',
        ratingRequired: '50%+',
      },
      {
        category: 'recreation',
        title: 'Free State Parks Access',
        description:
          'Vehicles with Disabled Veteran or Purple Heart plates get free admission to all Colorado state parks year-round (plate owner must be present). All veterans get free access during August.',
        ratingRequired: 'any rated',
      },
      {
        category: 'vehicle',
        title: 'Disabled Veteran License Plates',
        description:
          'DV and Purple Heart plates available with associated benefits including free state park access.',
        ratingRequired: 'any rated',
      },
    ],
  },

  Arizona: {
    state: 'Arizona',
    abbreviation: 'AZ',
    sourceUrl:
      'https://myarmybenefits.us.army.mil/Benefit-Library/State/Territory-Benefits/Arizona',
    lastVerified: '2026-03-09',
    benefits: [
      {
        category: 'property_tax',
        title: 'Full Property Tax Exemption',
        description:
          'Veterans rated 100% disabled are exempt from all property tax on their primary residence. Jointly-owned property with spouse is treated as if owned solely by the veteran.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'property_tax',
        title: 'Partial Property Tax Exemption',
        description:
          'Veterans with less than 100% rating receive an exemption of $4,873 (2026) multiplied by their disability percentage. Income limits apply: $39,865 (no children) or $47,826 (with children). VA disability pay excluded from income.',
        ratingRequired: '10%+',
      },
      {
        category: 'income_tax',
        title: 'Military Pay Exemptions',
        description:
          'VA disability compensation is exempt from Arizona state income tax. Active-duty pay earned outside Arizona is also exempt.',
        ratingRequired: 'any rated',
      },
      {
        category: 'education',
        title: 'Purple Heart Tuition Waiver',
        description:
          'Veterans who received a Purple Heart and are 50%+ disabled receive free tuition up to a bachelor\'s degree at Arizona public colleges and universities. Must have been an AZ resident or stationed in AZ at time of injury.',
        ratingRequired: '50%+',
      },
      {
        category: 'education',
        title: 'Surviving Dependents Tuition Waiver',
        description:
          'Unremarried spouse or dependent child (up to age 30) of a service member KIA who was an AZ resident may receive free tuition.',
        ratingRequired: 'none',
      },
      {
        category: 'recreation',
        title: 'Free Hunting & Fishing License',
        description:
          'Free for 100% disabled veterans and veterans 70+ with 25 years AZ residency. 25% off for any rated veteran; 50% off for Purple Heart recipients (after one year residency).',
        ratingRequired: 'any rated',
      },
      {
        category: 'vehicle',
        title: 'Disabled Veteran License Plates',
        description:
          'DV plates available with associated parking and registration benefits.',
        ratingRequired: 'any rated',
      },
    ],
  },

  Ohio: {
    state: 'Ohio',
    abbreviation: 'OH',
    sourceUrl:
      'https://myarmybenefits.us.army.mil/Benefit-Library/State/Territory-Benefits/Ohio',
    lastVerified: '2026-03-09',
    benefits: [
      {
        category: 'property_tax',
        title: 'Complete Property Tax Exemption (SB 92)',
        description:
          'Totally disabled veterans and their surviving spouses receive a complete property tax exemption on their homestead starting tax year 2025 (manufactured homes in 2026).',
        ratingRequired: '100% P&T',
      },
      {
        category: 'property_tax',
        title: 'Enhanced Homestead Exemption',
        description:
          'Veterans with 100% disability (including IU) receive a $58,000 assessed value exemption for 2026 (adjusted annually). No income limit for this exemption.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'property_tax',
        title: 'Standard Homestead Exemption',
        description:
          'Permanently and totally disabled veterans with household income at or below $41,000 receive a $29,000 assessed value exemption. Apply by December 31.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'income_tax',
        title: 'Military Pay Credits',
        description:
          'VA disability compensation is exempt from Ohio state income tax. Ohio offers a credit for military retirement pay received.',
        ratingRequired: 'none',
      },
      {
        category: 'education',
        title: 'Ohio GI Promise — Instant In-State Tuition',
        description:
          'Veterans with one year of honorable service immediately qualify for in-state tuition at all Ohio public colleges — no 12-month residency waiting period.',
        ratingRequired: 'none',
      },
      {
        category: 'education',
        title: 'War Orphan Scholarship',
        description:
          'Tuition assistance for children of deceased, severely disabled, MIA, or POW Ohio veterans. National Guard members receive 100% tuition at public institutions for up to 4 years.',
        ratingRequired: 'none',
      },
      {
        category: 'recreation',
        title: 'Free Hunting & Fishing License',
        description:
          'Permanently and totally disabled veterans and former POWs receive free five-year hunting and fishing licenses (renewable at no charge). Active-duty members on leave are exempt from licensing.',
        ratingRequired: '100% P&T',
      },
      {
        category: 'employment',
        title: 'State Employment Preference',
        description:
          'Veterans receive hiring preference for state government positions.',
        ratingRequired: 'none',
      },
    ],
  },
};

/** All states we have curated data for */
export const CURATED_STATE_NAMES = Object.keys(CURATED_STATES);

/** Category display labels */
export const CATEGORY_LABELS: Record<StateBenefit['category'], string> = {
  property_tax: 'Property Tax',
  income_tax: 'Income Tax',
  education: 'Education',
  employment: 'Employment',
  vehicle: 'Vehicle',
  recreation: 'Recreation',
  other: 'Other Benefits',
};

/** Category order for display */
export const CATEGORY_ORDER: StateBenefit['category'][] = [
  'property_tax',
  'income_tax',
  'education',
  'employment',
  'vehicle',
  'recreation',
  'other',
];

// ─── All 50 States + DC Summary Data ─────────────────────────────────────────

export interface StateBenefitSummary {
  state: string;
  stateCode: string;
  propertyTaxExemption: string;
  incomeTaxExemption: string;
  educationBenefits: string;
  otherBenefits: string[];
  stateVAWebsite: string;
}

export const stateBenefitsSummary: StateBenefitSummary[] = [
  {
    state: 'Alabama',
    stateCode: 'AL',
    propertyTaxExemption: 'Full property tax exemption for veterans rated 100% P&T. Partial exemptions available for veterans with lower ratings depending on county.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay is taxable as regular income.',
    educationBenefits: 'GI Dependent Scholarship provides up to 5 years of free tuition at Alabama public institutions for dependents of 100% P&T or deceased veterans.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 100% disabled veterans',
      'State employment preference for veterans',
      'Free admission to state parks for disabled veterans',
    ],
    stateVAWebsite: 'https://va.alabama.gov/',
  },
  {
    state: 'Alaska',
    stateCode: 'AK',
    propertyTaxExemption: 'Full property tax exemption on the first $150,000 of assessed value for veterans rated 50%+ disabled. Municipality-level exemptions may vary.',
    incomeTaxExemption: 'No state income tax. All military retirement pay and VA disability compensation are state tax-free.',
    educationBenefits: 'Free tuition at University of Alaska for spouses and dependents of veterans who died or were 100% disabled from service-connected causes.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for disabled veterans',
      'Permanent Fund Dividend eligibility for veterans stationed outside the state',
      'Veterans preference in state employment',
    ],
    stateVAWebsite: 'https://veterans.alaska.gov/',
  },
  {
    state: 'Arizona',
    stateCode: 'AZ',
    propertyTaxExemption: 'Full property tax exemption for 100% disabled veterans. Partial exemption ($4,873 multiplied by disability percentage) for lower ratings with income limits.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay up to $3,500 is exempt.',
    educationBenefits: 'Purple Heart tuition waiver for 50%+ disabled veterans at public institutions. Surviving dependents tuition waiver for KIA families.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting/fishing for 100% disabled; 25% off for any rated veteran',
      'State employment preference',
      'Property tax deferral for elderly disabled veterans',
    ],
    stateVAWebsite: 'https://dvs.az.gov/',
  },
  {
    state: 'Arkansas',
    stateCode: 'AR',
    propertyTaxExemption: 'Full property tax exemption for 100% disabled veterans on homestead. Reduced assessment for partially disabled veterans.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay fully exempt from state income tax.',
    educationBenefits: 'Dependents of deceased or disabled veterans receive free tuition at state institutions. National Guard members receive tuition assistance.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://www.veterans.arkansas.gov/',
  },
  {
    state: 'California',
    stateCode: 'CA',
    propertyTaxExemption: 'Full exemption ($175,298 basic or $262,950 low-income) for 100% disabled veterans. Basic $4,000 assessed value exemption for all qualifying veterans.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay is taxed as regular income.',
    educationBenefits: 'CalVet College Fee Waiver for dependents/spouses of 100% disabled or deceased veterans at CA public colleges and universities.',
    otherBenefits: [
      'CalVet Home Loans with below-market rates',
      'Free DV license plates',
      'Free Distinguished Veteran State Park Pass (50%+)',
      'State employment preference',
    ],
    stateVAWebsite: 'https://www.calvet.ca.gov/',
  },
  {
    state: 'Colorado',
    stateCode: 'CO',
    propertyTaxExemption: '50% exemption on first $200,000 of actual home value for 100% P&T veterans and Gold Star spouses. TDIU veterans (70%+) also qualify.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay excluded for retirees 55+.',
    educationBenefits: '100% tuition waiver at state institutions for National Guard members. Various scholarships for dependents of disabled veterans.',
    otherBenefits: [
      'Free lifetime hunting/fishing license (50%+)',
      'Free state parks for DV/PH plate holders',
      'DV and Purple Heart license plates',
      'State employment preference',
    ],
    stateVAWebsite: 'https://vets.colorado.gov/',
  },
  {
    state: 'Connecticut',
    stateCode: 'CT',
    propertyTaxExemption: 'Property tax exemption of $1,500 for veterans; $3,000 for totally disabled veterans. Municipalities may offer additional exemptions up to $10,000.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay fully exempt from state income tax.',
    educationBenefits: 'Free tuition at state colleges and universities for eligible veterans and dependents of deceased or MIA veterans.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for disabled veterans',
      'Free admission to state parks for veterans',
      'Property tax exemption for surviving spouses',
      'State employment preference',
    ],
    stateVAWebsite: 'https://portal.ct.gov/DVA',
  },
  {
    state: 'Delaware',
    stateCode: 'DE',
    propertyTaxExemption: 'Property tax credit up to $12,000 of assessed value for veterans aged 65+ or totally disabled. Additional school tax credit available.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay exclusion up to $12,500 for those under 60; fully exempt over 60.',
    educationBenefits: 'Free tuition at Delaware State University for children of deceased veterans or POW/MIA. Scholarship fund for veteran dependents.',
    otherBenefits: [
      'Free DV license plates',
      'Free fishing license for disabled veterans',
      'State employment preference',
      'Free state park admission for disabled veterans',
    ],
    stateVAWebsite: 'https://veteransaffairs.delaware.gov/',
  },
  {
    state: 'District of Columbia',
    stateCode: 'DC',
    propertyTaxExemption: 'Full property tax exemption for 100% disabled veterans on their primary residence. Reduced property tax for lower-rated disabled veterans.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay is taxable as regular income.',
    educationBenefits: 'DC Tuition Assistance Grant (DCTAG) provides up to $10,000/year for DC residents at public universities nationwide.',
    otherBenefits: [
      'Free DV license plates',
      'State employment preference for veterans',
      'Free fishing license for disabled veterans',
    ],
    stateVAWebsite: 'https://ova.dc.gov/',
  },
  {
    state: 'Florida',
    stateCode: 'FL',
    propertyTaxExemption: 'Full homestead property tax exemption for 100% P&T or wheelchair-bound veterans. $5,000 exemption for 10%+ rated. Combat-related discount for 65+ equal to disability percentage.',
    incomeTaxExemption: 'No state income tax. All military retirement pay and VA disability compensation are state tax-free.',
    educationBenefits: 'CSDDV scholarship for dependents of deceased or 100% disabled veterans. Purple Heart recipients receive full tuition waiver.',
    otherBenefits: [
      'Free hunting/fishing (50%+)',
      'Free lifetime state park pass for disabled veterans',
      'State employment preference',
      '25% off annual state park pass for all veterans',
    ],
    stateVAWebsite: 'https://floridavets.org/',
  },
  {
    state: 'Georgia',
    stateCode: 'GA',
    propertyTaxExemption: 'Exemption up to $121,812 assessed value for 100% disabled veterans. Unremarried surviving spouses also qualify.',
    incomeTaxExemption: 'VA disability compensation is exempt. $65,000 military retirement pay exemption starting 2026.',
    educationBenefits: 'Combat veteran tuition exemption at University System of Georgia. HOPE scholarship available to qualifying veterans.',
    otherBenefits: [
      'Free one-year hunting/fishing license',
      '25% off state parks for disabled veterans',
      'Free DV plates and driver\'s license',
      '5-point (10-point for disabled) state employment preference',
    ],
    stateVAWebsite: 'https://veterans.georgia.gov/',
  },
  {
    state: 'Hawaii',
    stateCode: 'HI',
    propertyTaxExemption: 'Full property tax exemption for 100% disabled veterans. Partial exemptions vary by county for lower ratings.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay is taxable as regular income.',
    educationBenefits: 'Free tuition at University of Hawaii for dependents of 100% disabled or deceased veterans.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for disabled veterans',
      'State employment preference',
      'Free state park admission for disabled veterans',
    ],
    stateVAWebsite: 'https://dod.hawaii.gov/ovs/',
  },
  {
    state: 'Idaho',
    stateCode: 'ID',
    propertyTaxExemption: 'Property tax reduction for veterans and widows/widowers who are 100% disabled or 65+ with income below $35,218.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay exempt for retirees 65+ or disabled; partial exemption ($41,110) for those 62-64.',
    educationBenefits: 'Free tuition at Idaho public institutions for children of 100% disabled or deceased veterans. Idaho National Guard receives up to $5,000/year tuition assistance.',
    otherBenefits: [
      'Free DV license plates',
      'Free fishing license for 100% disabled veterans',
      'Reduced hunting license fees for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://veterans.idaho.gov/',
  },
  {
    state: 'Illinois',
    stateCode: 'IL',
    propertyTaxExemption: 'Full property tax exemption for 70%+ rated veterans on homes up to $750,000 assessed value. Sliding scale $2,500-$5,000 reduction for 30-69%.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay fully exempt from state income tax.',
    educationBenefits: 'IVG (Illinois Veterans Grant) provides free tuition at state institutions for veterans with 1+ year of active service. MIA/POW scholarship for dependents.',
    otherBenefits: [
      'Free DV license plates and vehicle registration',
      'Free hunting and fishing license for disabled veterans',
      'Free state park camping for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://veterans.illinois.gov/',
  },
  {
    state: 'Indiana',
    stateCode: 'IN',
    propertyTaxExemption: 'Property tax deduction of $24,960 for totally disabled veterans or $14,000 for partially disabled veterans. Must apply annually.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay exempt from state income tax.',
    educationBenefits: 'Tuition and fee exemption at state schools for children of disabled veterans, Purple Heart recipients, and POW/MIA. Remission of fees for 100% disabled veterans.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for disabled veterans',
      'State employment preference',
      'Free admission to state parks and reservoirs',
    ],
    stateVAWebsite: 'https://www.in.gov/dva/',
  },
  {
    state: 'Iowa',
    stateCode: 'IA',
    propertyTaxExemption: 'Full property tax exemption for 100% disabled veterans. $1,852 exemption for all veterans on their homestead.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay fully exempt from state income tax starting 2023.',
    educationBenefits: 'War Orphan Educational Assistance for children of deceased veterans. Iowa National Guard Education Assistance program.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for disabled veterans',
      'Half-price camping at state parks for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://va.iowa.gov/',
  },
  {
    state: 'Kansas',
    stateCode: 'KS',
    propertyTaxExemption: 'Full property tax exemption for 100% disabled veterans (effective 2024). Appraised value up to median state home price.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay fully exempt from state income tax.',
    educationBenefits: 'Kansas National Guard tuition assistance. Scholarships for dependents of deceased or disabled veterans at state schools.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 30%+ disabled veterans',
      'Free state park vehicle permit for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://kcva.ks.gov/',
  },
  {
    state: 'Kentucky',
    stateCode: 'KY',
    propertyTaxExemption: 'Full property tax exemption for 100% P&T veterans. All veterans exempt on first $46,350 of assessed value for state property taxes.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay fully exempt from state income tax.',
    educationBenefits: 'Kentucky Veterans Tuition Waiver covers tuition for dependents and spouses of 100% disabled or deceased veterans at state institutions.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 100% disabled veterans',
      'Free state park admission and camping for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://veterans.ky.gov/',
  },
  {
    state: 'Louisiana',
    stateCode: 'LA',
    propertyTaxExemption: 'Full property tax exemption on the first $150,000 of assessed value for 100% disabled veterans. Standard $7,500 homestead exemption for all residents.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay exempt up to $30,000 for retirees; full exemption for 100% disabled.',
    educationBenefits: 'Free tuition at state schools for dependents of veterans who died or are 90%+ rated. Louisiana National Guard tuition exemption.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 50%+ disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://vetaffairs.la.gov/',
  },
  {
    state: 'Maine',
    stateCode: 'ME',
    propertyTaxExemption: 'Property tax exemption of $6,000 for veterans; $50,000 for paraplegic veterans. Municipalities may offer additional exemptions.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay exempt from state income tax.',
    educationBenefits: 'Free tuition at state schools for dependents of 100% disabled or deceased veterans. Maine National Guard tuition waiver.',
    otherBenefits: [
      'Free DV license plates and registration',
      'Free hunting, fishing, and trapping licenses for disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://www.maine.gov/veterans/',
  },
  {
    state: 'Maryland',
    stateCode: 'MD',
    propertyTaxExemption: 'Full property tax exemption for 100% P&T veterans. Partial exemption based on disability rating for lower ratings.',
    incomeTaxExemption: 'VA disability compensation is exempt. First $12,500 of military retirement pay exempt; full exemption for retirees 55+ after 2024.',
    educationBenefits: 'Edward T. Conroy Memorial Scholarship for dependents of disabled or deceased veterans (up to tuition at state schools). Veterans of the Afghanistan and Iraq Conflicts Scholarship.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 100% disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://veterans.maryland.gov/',
  },
  {
    state: 'Massachusetts',
    stateCode: 'MA',
    propertyTaxExemption: 'Property tax exemptions ranging from $400 (10% rated) to full exemption (100% P&T or special category). Surviving spouses and Gold Star parents eligible.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay is taxable but qualifies for a $2,000 pension exemption.',
    educationBenefits: 'Free tuition at state colleges for veterans with 180+ days active service. Children of deceased/MIA veterans also qualify.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for disabled veterans',
      'Civil service hiring preference for veterans',
      'Free state park pass for disabled veterans',
      'Annuity payments for 100% disabled veterans ($2,000/year)',
    ],
    stateVAWebsite: 'https://www.mass.gov/orgs/executive-office-of-veterans-services',
  },
  {
    state: 'Michigan',
    stateCode: 'MI',
    propertyTaxExemption: 'Full property tax exemption for 100% P&T veterans. Disabled Veterans Exemption based on income for partially disabled veterans.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay exempt from state income tax.',
    educationBenefits: 'Michigan Veterans Trust Fund tuition grants. Children of 100% disabled or deceased veterans receive tuition waiver at state institutions.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 100% disabled veterans',
      'Free state park pass (Recreation Passport) for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://www.michigan.gov/mvaa',
  },
  {
    state: 'Minnesota',
    stateCode: 'MN',
    propertyTaxExemption: 'Market value exclusion up to $300,000 for 70%+ rated veterans. Lower exclusions ($150,000-$300,000) for 10-69%. Surviving spouses qualify.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay subtraction (full exemption phased in by 2026).',
    educationBenefits: 'Minnesota GI Bill provides up to $10,000 for education and training. Surviving dependents receive free tuition at state schools.',
    otherBenefits: [
      'Free DV license plates',
      'Free fishing license for totally disabled veterans',
      'Reduced state park fees for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://mn.gov/mdva/',
  },
  {
    state: 'Mississippi',
    stateCode: 'MS',
    propertyTaxExemption: 'Full property tax exemption for 100% disabled veterans on homestead up to $7,500 assessed value (approximately $75,000 market value).',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay exempt from state income tax.',
    educationBenefits: 'Free tuition at state schools for dependents of 100% disabled or deceased veterans. Mississippi National Guard Education Assistance Program.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 100% disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://www.msva.ms.gov/',
  },
  {
    state: 'Missouri',
    stateCode: 'MO',
    propertyTaxExemption: 'Full property tax exemption for 100% P&T veterans on homestead. Partial exemption for lower ratings based on assessed value limits.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay fully exempt from state income tax.',
    educationBenefits: 'Missouri Returning Heroes Education Act provides reduced tuition at state institutions for post-9/11 veterans. Survivors Grant for dependents of deceased/disabled veterans.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 60%+ disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://mvc.dps.mo.gov/',
  },
  {
    state: 'Montana',
    stateCode: 'MT',
    propertyTaxExemption: 'Property tax reduction for 100% disabled veterans: assessed value reduced by $200,000+. Partial reductions for lower ratings.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay exempt from state income tax.',
    educationBenefits: 'Fee waiver at Montana University System for dependents of 100% disabled or deceased veterans. Montana National Guard tuition waiver.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 60%+ disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://mvad.mt.gov/',
  },
  {
    state: 'Nebraska',
    stateCode: 'NE',
    propertyTaxExemption: 'Full property tax exemption for 100% P&T veterans. Partial exemptions ($2,000-$5,000) for lower-rated veterans depending on financial need.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay fully exempt from state income tax starting 2022.',
    educationBenefits: 'Waiver of tuition at state institutions for dependents of 100% disabled or deceased veterans. Nebraska National Guard tuition credit.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing permit for disabled veterans',
      'Free state park entry for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://veterans.nebraska.gov/',
  },
  {
    state: 'Nevada',
    stateCode: 'NV',
    propertyTaxExemption: 'Property tax exemption of $30,800 assessed value for veterans with wartime service. Disabled veteran exemption up to $62,500 for 60%+ rated.',
    incomeTaxExemption: 'No state income tax. All military retirement pay and VA disability compensation are state tax-free.',
    educationBenefits: 'Free tuition at Nevada System of Higher Education for dependents of 100% disabled or deceased veterans. Nevada National Guard tuition waiver.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 50%+ disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://veterans.nv.gov/',
  },
  {
    state: 'New Hampshire',
    stateCode: 'NH',
    propertyTaxExemption: '$4,000 tax credit for totally disabled veterans. Standard $500 tax credit for all veterans. Towns may vote to increase amounts.',
    incomeTaxExemption: 'No broad-based income tax (only interest and dividends tax, repealed 2025). VA disability and military retirement are untaxed.',
    educationBenefits: 'Scholarships for children of deceased veterans through the NH Veterans Home Education program.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for totally disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://www.nh.gov/nhveterans/',
  },
  {
    state: 'New Jersey',
    stateCode: 'NJ',
    propertyTaxExemption: 'Full property tax exemption for 100% P&T veterans. $250 annual deduction for all qualifying veterans.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay and survivor benefit plan fully exempt from state income tax.',
    educationBenefits: 'Free tuition at state colleges for veterans who served after 9/11 (NJ VET Act). Dependents of deceased or 100% disabled veterans receive tuition waiver.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 100% disabled veterans',
      'Free toll transponder for disabled veterans',
      'Civil service employment preference',
    ],
    stateVAWebsite: 'https://www.nj.gov/military/veterans/',
  },
  {
    state: 'New Mexico',
    stateCode: 'NM',
    propertyTaxExemption: 'Full property tax exemption for 100% P&T veterans. $4,000 exemption for all veterans with honorable discharge.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay fully exempt from state income tax.',
    educationBenefits: 'Vietnam Veterans Scholarship and Children of Deceased Veterans Scholarship at state schools. National Guard tuition waiver.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 100% disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://www.nmdvs.org/',
  },
  {
    state: 'New York',
    stateCode: 'NY',
    propertyTaxExemption: 'Three-tier exemption: 15% of assessed value for all qualifying veterans, additional 10% for combat veterans, additional exemption for disabled veterans based on rating. Localities set dollar ceilings.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay fully exempt from state income tax.',
    educationBenefits: 'Veterans Tuition Award covers full tuition at SUNY/CUNY. Regents Award for Children of Veterans for dependents of deceased/disabled veterans. Military Enhanced Recognition Incentive and Tribute (MERIT) scholarships.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for disabled veterans',
      'Free state park admission for disabled veterans',
      'Civil service employment preference (extra points)',
      'Free E-ZPass for disabled veterans',
    ],
    stateVAWebsite: 'https://veterans.ny.gov/',
  },
  {
    state: 'North Carolina',
    stateCode: 'NC',
    propertyTaxExemption: 'First $45,000 of appraised value exempt for 100% P&T veterans. Apply by June 1.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay fully exempt from state income tax.',
    educationBenefits: 'Scholarship for dependents of deceased, disabled, or POW/MIA veterans: full tuition, fees, and stipend for up to 8 semesters at NC public institutions.',
    otherBenefits: [
      'Free DV license plates',
      'Reduced hunting/fishing licenses for 50%+ disabled',
      'NC4ME employer network for veteran job connections',
      'State employment preference',
    ],
    stateVAWebsite: 'https://www.milvets.nc.gov/',
  },
  {
    state: 'North Dakota',
    stateCode: 'ND',
    propertyTaxExemption: 'Property tax credit up to $8,100 for disabled veterans. Surviving spouses also qualify. Credit applies to the first $120,000 of true and full valuation.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay exempt from state income tax.',
    educationBenefits: 'Free tuition at state schools for dependents of deceased or 100% disabled veterans. National Guard tuition waiver.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 50%+ disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://www.nd.gov/veterans/',
  },
  {
    state: 'Ohio',
    stateCode: 'OH',
    propertyTaxExemption: 'Complete property tax exemption for 100% P&T veterans (SB 92). Enhanced $58,000 assessed value exemption for 100% disabled. Standard $29,000 exemption with income limits.',
    incomeTaxExemption: 'VA disability compensation is exempt. Credit available for military retirement pay.',
    educationBenefits: 'Ohio GI Promise: immediate in-state tuition for veterans with 1+ year service. War Orphan Scholarship for dependents. National Guard 100% tuition at public institutions.',
    otherBenefits: [
      'Free 5-year hunting/fishing for 100% P&T',
      'State employment preference',
      'Free DV license plates',
    ],
    stateVAWebsite: 'https://dvs.ohio.gov/',
  },
  {
    state: 'Oklahoma',
    stateCode: 'OK',
    propertyTaxExemption: 'Full property tax exemption for 100% disabled veterans. Standard $1,000 homestead exemption. Additional exemption based on income for disabled veterans.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay 75% exempt (100% exempt starting 2026).',
    educationBenefits: 'Free tuition at state schools for dependents of 100% disabled or deceased veterans. Oklahoma National Guard tuition waiver.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 100% disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://oklahoma.gov/odva.html',
  },
  {
    state: 'Oregon',
    stateCode: 'OR',
    propertyTaxExemption: 'Property tax exemption up to $28,045 (2026, adjusted annually) for veterans rated 40%+ or with specific disabilities. Income limits apply ($52,580 single).',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay is taxable as regular income.',
    educationBenefits: 'Oregon Veterans Education Benefit: tuition waiver at Oregon public universities for post-9/11 veterans. Dependents of deceased/disabled veterans qualify for reduced tuition.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 25%+ disabled veterans',
      'Free state park day-use for DV plate holders',
      'State employment preference',
    ],
    stateVAWebsite: 'https://www.oregon.gov/odva/',
  },
  {
    state: 'Pennsylvania',
    stateCode: 'PA',
    propertyTaxExemption: 'Full property tax exemption for 100% P&T veterans. Must meet income requirements. Surviving spouses may retain exemption.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay fully exempt from state income tax.',
    educationBenefits: 'Free tuition at state schools for children of 100% disabled or deceased veterans (Educational Gratuity). PA National Guard tuition assistance.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
      'Paralyzed Veterans Pension ($150/month)',
    ],
    stateVAWebsite: 'https://www.dmva.pa.gov/',
  },
  {
    state: 'Rhode Island',
    stateCode: 'RI',
    propertyTaxExemption: 'Property tax exemption of $400-$1,000 for veterans depending on municipality. Full exemption for 100% disabled veterans in some cities.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay exempt from state income tax.',
    educationBenefits: 'Free tuition at state institutions for dependents of deceased or totally disabled veterans.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for disabled veterans',
      'Free state park admission',
      'State employment preference',
    ],
    stateVAWebsite: 'https://www.vets.ri.gov/',
  },
  {
    state: 'South Carolina',
    stateCode: 'SC',
    propertyTaxExemption: 'Full property tax exemption for 100% P&T veterans on homestead. $50,000 exemption for all other veterans.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay deduction up to $17,500 for those under 65; fully exempt for those 65+.',
    educationBenefits: 'Free tuition at state schools for children of deceased or 100% disabled veterans. National Guard College Assistance Program.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 100% disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://scdva.sc.gov/',
  },
  {
    state: 'South Dakota',
    stateCode: 'SD',
    propertyTaxExemption: 'Full property tax exemption for paraplegic or 100% P&T veterans on homestead. Property tax reduction for lower-rated disabled veterans based on income.',
    incomeTaxExemption: 'No state income tax. All military retirement pay and VA disability compensation are state tax-free.',
    educationBenefits: 'Free tuition at state schools for dependents of veterans who died or are 100% disabled from service-connected causes.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for totally disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://vetaffairs.sd.gov/',
  },
  {
    state: 'Tennessee',
    stateCode: 'TN',
    propertyTaxExemption: 'Full property tax exemption for 100% P&T veterans. Partial exemption (first $175,000 of market value) for disabled veterans.',
    incomeTaxExemption: 'No broad-based income tax (Hall Tax on interest/dividends fully repealed 2021). VA disability and military retirement are untaxed.',
    educationBenefits: 'Free tuition at state schools for dependents of 100% disabled or deceased veterans. Helping Heroes Grant for post-9/11 veterans.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 30%+ disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://www.tn.gov/veteran.html',
  },
  {
    state: 'Texas',
    stateCode: 'TX',
    propertyTaxExemption: 'Full property tax exemption on homestead for 100% P&T or TDIU veterans. Partial exemption proportional to disability percentage for lower ratings. Unremarried surviving spouses retain exemption.',
    incomeTaxExemption: 'No state income tax. All military retirement pay and VA disability compensation are state tax-free.',
    educationBenefits: 'Hazlewood Act: up to 150 credit hours of free tuition at Texas public schools. Unused hours transferable to spouse or child (Legacy Act).',
    otherBenefits: [
      'Free vehicle registration and DV plates (50%+)',
      'Free Super Combo Hunting and Fishing Package (50%+)',
      'Texas Veterans Land Board below-market loans',
      'Free state park admission with State Parklands Passport',
    ],
    stateVAWebsite: 'https://tvc.texas.gov/',
  },
  {
    state: 'Utah',
    stateCode: 'UT',
    propertyTaxExemption: 'Property tax exemption proportional to disability percentage for disabled veterans. Surviving spouses and minor orphans qualify. Assessed on a sliding scale.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay receives a tax credit (effectively reducing tax).',
    educationBenefits: 'Purple Heart tuition waiver at state institutions. Free tuition for dependents of 100% disabled or deceased veterans.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 50%+ disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://veterans.utah.gov/',
  },
  {
    state: 'Vermont',
    stateCode: 'VT',
    propertyTaxExemption: 'Property tax exemption of $10,000 assessed value for veterans rated 50%+ disabled. Towns may vote additional exemptions up to $40,000.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay exempt from state income tax.',
    educationBenefits: 'Free tuition at Vermont state colleges for National Guard members and certain veterans. Scholarship funds for veteran dependents.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for totally disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://veterans.vermont.gov/',
  },
  {
    state: 'Virginia',
    stateCode: 'VA',
    propertyTaxExemption: 'Full property tax exemption for 100% P&T veterans on primary residence and up to one acre. No income limits. Unremarried surviving spouses retain exemption.',
    incomeTaxExemption: 'VA disability compensation is exempt. Up to $40,000 military retirement pay exempt from state income tax.',
    educationBenefits: 'VMSDEP: up to 8 semesters free tuition at Virginia public institutions for dependents of 90%+ disabled, KIA, MIA, or POW veterans.',
    otherBenefits: [
      'One vehicle exempt from personal property tax (100% P&T)',
      'Free lifetime hunting/fishing (100% P&T)',
      'Free State Parks Passport (100% P&T)',
      'State employment preference',
    ],
    stateVAWebsite: 'https://www.dvs.virginia.gov/',
  },
  {
    state: 'Washington',
    stateCode: 'WA',
    propertyTaxExemption: 'Income-based property tax reduction for 80%+ disabled veterans. New tiered exemption (SB5398): $5,000-$12,000 based on disability rating for 10%+ rated.',
    incomeTaxExemption: 'No state income tax. All military retirement pay and VA disability compensation are state tax-free.',
    educationBenefits: 'Tuition waiver up to 200 quarter credits at state schools for veterans, Guard/Reserve, spouses, and dependents. $500/year textbook stipend.',
    otherBenefits: [
      'Half-price hunting/fishing for 30%+ disabled',
      'State employment preference',
      'Veterans Innovation Partnership jobs program',
    ],
    stateVAWebsite: 'https://www.dva.wa.gov/',
  },
  {
    state: 'West Virginia',
    stateCode: 'WV',
    propertyTaxExemption: 'Full property tax exemption for 100% P&T veterans. Partial exemption based on disability percentage and income for lower-rated veterans.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay fully exempt from state income tax.',
    educationBenefits: 'Free tuition at state schools for dependents of 100% disabled or deceased veterans. West Virginia National Guard tuition waiver.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 60%+ disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://veterans.wv.gov/',
  },
  {
    state: 'Wisconsin',
    stateCode: 'WI',
    propertyTaxExemption: 'Full property tax exemption for 100% P&T veterans. Wisconsin Veterans and Surviving Spouses Property Tax Credit for eligible veterans.',
    incomeTaxExemption: 'VA disability compensation is exempt. Military retirement pay fully exempt from state income tax.',
    educationBenefits: 'Wisconsin GI Bill: free tuition and fees for 128 credits at UW System and WI Technical Colleges for veterans with 90+ days active service. Remission extended to dependents of deceased/disabled veterans.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
      'Wisconsin Veterans Home low-cost housing',
    ],
    stateVAWebsite: 'https://dva.wi.gov/',
  },
  {
    state: 'Wyoming',
    stateCode: 'WY',
    propertyTaxExemption: 'Property tax exemption of $3,000 assessed value for all veterans. Additional exemptions for disabled veterans up to $6,000.',
    incomeTaxExemption: 'No state income tax. All military retirement pay and VA disability compensation are state tax-free.',
    educationBenefits: 'Free tuition at University of Wyoming and community colleges for dependents of 100% disabled or deceased veterans.',
    otherBenefits: [
      'Free DV license plates',
      'Free hunting and fishing license for 100% disabled veterans',
      'Free state park admission for disabled veterans',
      'State employment preference',
    ],
    stateVAWebsite: 'https://www.wyomilitary.wyo.gov/veterans-commission/',
  },
];
