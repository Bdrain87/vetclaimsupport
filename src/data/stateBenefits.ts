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
