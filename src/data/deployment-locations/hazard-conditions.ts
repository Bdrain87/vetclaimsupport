import type { HazardType } from './types';

/** Maps hazard types to presumptive condition exposure group IDs */
export const HAZARD_TO_EXPOSURE_GROUP: Record<string, string> = {
  burn_pit: 'burn_pit',
  agent_orange: 'agent_orange',
  high_dioxin: 'agent_orange',
  contaminated_water: 'contaminated_water',
  radiation: 'radiation',
  oil_well_fire: 'gulf_war_illness',
  depleted_uranium: 'gulf_war_illness',
  pfas: 'pfas',
  chemical: 'chemical_exposure',
  noise: 'noise',
  asbestos: 'burn_pit', // Respiratory conditions overlap
  lead: 'chemical_exposure',
  jet_fuel: 'chemical_exposure',
  munitions: 'chemical_exposure',
};

/** Secondary conditions commonly associated with each hazard */
export const HAZARD_SECONDARIES: Partial<Record<HazardType, string[]>> = {
  burn_pit: ['sinusitis', 'rhinitis', 'asthma', 'copd', 'sleep-apnea', 'gerd', 'migraines'],
  agent_orange: ['diabetes', 'heart-disease', 'peripheral-neuropathy', 'prostate-condition'],
  radiation: ['thyroid-condition', 'lung-cancer'],
  contaminated_water: ['kidney-cancer', 'bladder-cancer'],
  oil_well_fire: ['chronic-fatigue', 'fibromyalgia', 'ibs'],
  depleted_uranium: ['chronic-fatigue', 'kidney-condition'],
  pfas: ['thyroid-condition', 'kidney-cancer', 'testicular-cancer'],
  chemical: ['peripheral-neuropathy', 'skin-condition'],
  noise: ['tinnitus', 'hearing-loss'],
};
