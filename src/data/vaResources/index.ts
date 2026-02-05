// VA Official Resources Data
// Sources: Public domain - VA.gov, eCFR, Cornell Law

export interface VAResource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'reference' | 'forms' | 'benefits' | 'search' | 'tools';
  icon?: string;
}

export const vaOfficialResources: VAResource[] = [
  // Reference Materials
  {
    id: 'vasrd-ecfr',
    name: 'VASRD - eCFR',
    description: 'VA Schedule for Rating Disabilities - Official Code of Federal Regulations',
    url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4',
    category: 'reference',
  },
  {
    id: 'vasrd-cornell',
    name: 'VASRD - Cornell Law',
    description: 'VA Schedule for Rating Disabilities - Cornell Law School Legal Information Institute',
    url: 'https://www.law.cornell.edu/cfr/text/38/part-4',
    category: 'reference',
  },
  {
    id: 'm21-1',
    name: 'M21-1 Adjudication Manual',
    description: 'VA\'s official adjudication procedures manual for claims processing',
    url: 'https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018',
    category: 'reference',
  },

  // Search Tools
  {
    id: 'bva-decisions-search',
    name: 'BVA Decisions Search',
    description: 'Search Board of Veterans Appeals decisions for precedent cases',
    url: 'https://www.index.va.gov/search/va/bva.jsp',
    category: 'search',
  },
  {
    id: 'bva-decisions-dataset',
    name: 'BVA Decisions Dataset',
    description: 'Bulk download of BVA decisions for research',
    url: 'https://www.va.gov/about_va/bva-decisions.asp',
    category: 'search',
  },

  // Forms
  {
    id: 'dbq-forms',
    name: 'Public DBQ Forms',
    description: 'Disability Benefit Questionnaires for private medical evaluations',
    url: 'https://www.va.gov/health-care/get-medical-records/dbq-medical-evidence/',
    category: 'forms',
  },
  {
    id: 'va-forms',
    name: 'VA Forms Library',
    description: 'All official VA forms for claims, appeals, and benefits',
    url: 'https://www.va.gov/find-forms/',
    category: 'forms',
  },

  // Benefits Information
  {
    id: 'compensation-rates-2026',
    name: '2026 Compensation Rates',
    description: 'Current VA disability compensation rates by rating percentage',
    url: 'https://www.va.gov/disability/compensation-rates/',
    category: 'benefits',
  },
  {
    id: 'pact-act-benefits',
    name: 'PACT Act Benefits',
    description: 'Toxic exposure and burn pit presumptive conditions under the PACT Act',
    url: 'https://www.va.gov/resources/the-pact-act-and-your-va-benefits/',
    category: 'benefits',
  },

  // Tools
  {
    id: 'va-locator',
    name: 'VA Facility Locator',
    description: 'Find VA hospitals, clinics, and regional offices near you',
    url: 'https://www.va.gov/find-locations/',
    category: 'tools',
  },
  {
    id: 'claim-status',
    name: 'Claim Status Checker',
    description: 'Check the status of your pending VA disability claim',
    url: 'https://www.va.gov/claim-or-appeal-status/',
    category: 'tools',
  },
];

export function getResourcesByCategory(category: VAResource['category']): VAResource[] {
  return vaOfficialResources.filter(r => r.category === category);
}

export function getResourceById(id: string): VAResource | undefined {
  return vaOfficialResources.find(r => r.id === id);
}
