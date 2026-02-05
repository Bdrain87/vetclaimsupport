/**
 * PACT Act Presumptive Condition Mapping (2026 Update)
 * Maps service locations to presumptive conditions for Discovery engine.
 */
export interface PactRegion {
  region: string;
  conditions: string[];
  dates: string;
  description: string;
}

export const PACT_ACT_DATA: PactRegion[] = [
  {
    region: "Southwest Asia / Burn Pits",
    dates: "Aug 2, 1990 – Present",
    conditions: ["Asthma", "Rhinitis", "Sinusitis", "COPD", "Emphysema", "Respiratory Cancers"],
    description: "Applies to service in Iraq, Kuwait, Saudi Arabia, UAE, Bahrain, Qatar, Oman, and airspace."
  },
  {
    region: "Camp Lejeune",
    dates: "Aug 1, 1953 – Dec 31, 1987",
    conditions: ["Bladder Cancer", "Kidney Cancer", "Leukemia", "Parkinson's", "Multiple Myeloma"],
    description: "Requires at least 30 days of residency or service at Camp Lejeune or MCAS New River."
  },
  {
    region: "Agent Orange / Vietnam",
    dates: "Jan 9, 1962 – May 7, 1975",
    conditions: ["Type 2 Diabetes", "Ischemic Heart Disease", "Parkinsonism", "AL Amyloidosis", "Hypertension"],
    description: "Includes Blue Water Navy and specific Thai air bases."
  }
];
