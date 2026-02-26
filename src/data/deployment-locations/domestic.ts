import type { EnrichedLocation } from './types';

/** NEW — Domestic toxic exposure sites (Camp Lejeune, PFAS bases, Fort McClellan, radiation sites) */

export const CAMP_LEJEUNE_LOCATIONS: EnrichedLocation[] = [
  { name: 'Camp Lejeune', alternateNames: ['Lejeune', 'MCB Camp Lejeune'], country: 'United States', region: 'North Carolina', coordinates: [34.62, -77.39], hazards: ['contaminated_water'], conflictId: 'camp_lejeune', regionGroup: 'Camp Lejeune Area', pactActEligible: true, notes: 'Minimum 30 days stationed required' },
  { name: 'MCAS New River', alternateNames: ['New River'], country: 'United States', region: 'North Carolina', hazards: ['contaminated_water'], conflictId: 'camp_lejeune', regionGroup: 'Camp Lejeune Area', pactActEligible: true },
];

export const NUCLEAR_RADIATION_LOCATIONS: EnrichedLocation[] = [
  { name: 'Nevada Test Site', alternateNames: ['NTS', 'Nevada Proving Ground', 'Camp Desert Rock'], country: 'United States', region: 'Nevada', coordinates: [37.00, -116.05], hazards: ['radiation'], conflictId: 'nuclear_radiation', regionGroup: 'Nuclear Test/Exposure Sites', pactActEligible: true },
  { name: 'Marshall Islands — Bikini Atoll', alternateNames: ['Bikini Atoll', 'Bikini'], country: 'Marshall Islands', coordinates: [11.59, 165.38], hazards: ['radiation'], conflictId: 'nuclear_radiation', regionGroup: 'Nuclear Test/Exposure Sites', pactActEligible: true },
  { name: 'Marshall Islands — Enewetak Atoll', alternateNames: ['Enewetak', 'Eniwetok'], country: 'Marshall Islands', coordinates: [11.50, 162.35], hazards: ['radiation'], conflictId: 'nuclear_radiation', regionGroup: 'Nuclear Test/Exposure Sites', pactActEligible: true },
  { name: 'Hiroshima occupation zone', alternateNames: ['Hiroshima'], country: 'Japan', coordinates: [34.39, 132.45], hazards: ['radiation'], conflictId: 'nuclear_radiation', regionGroup: 'Nuclear Test/Exposure Sites', pactActEligible: true },
  { name: 'Nagasaki occupation zone', alternateNames: ['Nagasaki'], country: 'Japan', coordinates: [32.75, 129.88], hazards: ['radiation'], conflictId: 'nuclear_radiation', regionGroup: 'Nuclear Test/Exposure Sites', pactActEligible: true },
  { name: 'Palomares Spain — 1966 cleanup', alternateNames: ['Palomares'], country: 'Spain', hazards: ['radiation'], conflictId: 'nuclear_radiation', regionGroup: 'Nuclear Test/Exposure Sites', pactActEligible: true },
  { name: 'Thule Air Base Greenland — 1968 cleanup', alternateNames: ['Thule', 'Pituffik'], country: 'Greenland', coordinates: [76.53, -68.70], hazards: ['radiation'], conflictId: 'nuclear_radiation', regionGroup: 'Nuclear Test/Exposure Sites', pactActEligible: true },
  { name: 'Christmas Island', alternateNames: ['Kiritimati'], country: 'Kiribati', hazards: ['radiation'], conflictId: 'nuclear_radiation', regionGroup: 'Nuclear Test/Exposure Sites', pactActEligible: true },
  { name: 'Johnston Atoll', alternateNames: ['Johnston Island'], country: 'United States', hazards: ['radiation', 'chemical'], conflictId: 'nuclear_radiation', regionGroup: 'Nuclear Test/Exposure Sites', pactActEligible: true, notes: 'Also used for chemical weapons destruction' },

  // NEW — expanded radiation/nuclear sites
  { name: 'Camp Desert Rock', alternateNames: ['Desert Rock', 'Atomic Soldiers'], country: 'United States', region: 'Nevada', coordinates: [36.62, -116.02], hazards: ['radiation'], conflictId: 'nuclear_radiation', regionGroup: 'Nuclear Test/Exposure Sites', pactActEligible: true, notes: 'Troops observed nuclear detonations at close range' },
  { name: 'Amchitka Island', alternateNames: ['Amchitka'], country: 'United States', region: 'Alaska', hazards: ['radiation'], conflictId: 'nuclear_radiation', regionGroup: 'Nuclear Test/Exposure Sites', pactActEligible: true, notes: 'Underground nuclear tests 1965–1971' },
  { name: 'Maralinga', alternateNames: ['Maralinga Test Site'], country: 'Australia', hazards: ['radiation'], conflictId: 'nuclear_radiation', regionGroup: 'Nuclear Test/Exposure Sites', pactActEligible: true },
  { name: 'Semipalatinsk (observer)', alternateNames: ['Semipalatinsk'], country: 'Kazakhstan', hazards: ['radiation'], conflictId: 'nuclear_radiation', regionGroup: 'Nuclear Test/Exposure Sites', pactActEligible: true },
];

export const DOMESTIC_TOXIC_LOCATIONS: EnrichedLocation[] = [
  // PFAS/AFFF contamination bases
  { name: 'Pease ANGB', alternateNames: ['Pease', 'Pease Air Force Base', 'Pease International'], country: 'United States', region: 'New Hampshire', coordinates: [43.08, -70.82], hazards: ['pfas'], conflictId: 'domestic_toxic', regionGroup: 'PFAS/AFFF Contamination', pactActEligible: true, notes: 'High PFAS levels in drinking water from AFFF firefighting foam' },
  { name: 'Wurtsmith AFB', alternateNames: ['Wurtsmith', 'Oscoda'], country: 'United States', region: 'Michigan', hazards: ['pfas'], conflictId: 'domestic_toxic', regionGroup: 'PFAS/AFFF Contamination', pactActEligible: true },
  { name: 'Peterson AFB', alternateNames: ['Peterson SFB', 'Peterson'], country: 'United States', region: 'Colorado', hazards: ['pfas'], conflictId: 'domestic_toxic', regionGroup: 'PFAS/AFFF Contamination', pactActEligible: true },
  { name: 'Eielson AFB', alternateNames: ['Eielson'], country: 'United States', region: 'Alaska', hazards: ['pfas'], conflictId: 'domestic_toxic', regionGroup: 'PFAS/AFFF Contamination', pactActEligible: true },
  { name: 'Tyndall AFB', alternateNames: ['Tyndall'], country: 'United States', region: 'Florida', hazards: ['pfas'], conflictId: 'domestic_toxic', regionGroup: 'PFAS/AFFF Contamination', pactActEligible: true },
  { name: 'NAS Oceana', alternateNames: ['Oceana'], country: 'United States', region: 'Virginia', hazards: ['pfas'], conflictId: 'domestic_toxic', regionGroup: 'PFAS/AFFF Contamination', pactActEligible: true },
  { name: 'Ellsworth AFB', alternateNames: ['Ellsworth'], country: 'United States', region: 'South Dakota', hazards: ['pfas'], conflictId: 'domestic_toxic', regionGroup: 'PFAS/AFFF Contamination', pactActEligible: true },
  { name: 'Luke AFB', alternateNames: ['Luke'], country: 'United States', region: 'Arizona', hazards: ['pfas'], conflictId: 'domestic_toxic', regionGroup: 'PFAS/AFFF Contamination', pactActEligible: true },
  { name: 'Fairchild AFB', alternateNames: ['Fairchild'], country: 'United States', region: 'Washington', hazards: ['pfas'], conflictId: 'domestic_toxic', regionGroup: 'PFAS/AFFF Contamination', pactActEligible: true },
  { name: 'Langley AFB', alternateNames: ['Langley', 'JB Langley-Eustis'], country: 'United States', region: 'Virginia', hazards: ['pfas'], conflictId: 'domestic_toxic', regionGroup: 'PFAS/AFFF Contamination', pactActEligible: true },
  { name: 'Fort Bragg', alternateNames: ['Fort Liberty', 'Bragg'], country: 'United States', region: 'North Carolina', coordinates: [35.14, -79.01], hazards: ['pfas'], conflictId: 'domestic_toxic', regionGroup: 'PFAS/AFFF Contamination', pactActEligible: true },

  // Chemical/toxic exposure
  { name: 'Fort McClellan', alternateNames: ['McClellan', 'Ft McClellan'], country: 'United States', region: 'Alabama', coordinates: [33.71, -85.77], hazards: ['chemical'], conflictId: 'domestic_toxic', regionGroup: 'Chemical Exposure Sites', pactActEligible: true, notes: 'Chemical weapons training, toxic industrial exposure, Monsanto PCB contamination' },
  { name: 'Fort Detrick', alternateNames: ['Detrick'], country: 'United States', region: 'Maryland', hazards: ['chemical'], conflictId: 'domestic_toxic', regionGroup: 'Chemical Exposure Sites', pactActEligible: true },
  { name: 'Camp Garcia — Vieques', alternateNames: ['Vieques', 'Camp Garcia'], country: 'United States', region: 'Puerto Rico', hazards: ['chemical', 'munitions'], conflictId: 'domestic_toxic', regionGroup: 'Chemical Exposure Sites', pactActEligible: true, notes: 'Bombing range contamination' },
  { name: 'Dugway Proving Ground', alternateNames: ['Dugway', 'DPG'], country: 'United States', region: 'Utah', hazards: ['chemical'], conflictId: 'domestic_toxic', regionGroup: 'Chemical Exposure Sites', pactActEligible: true },
  { name: 'Rocky Mountain Arsenal', alternateNames: ['RMA'], country: 'United States', region: 'Colorado', hazards: ['chemical'], conflictId: 'domestic_toxic', regionGroup: 'Chemical Exposure Sites', pactActEligible: true },
  { name: 'Edgewood Arsenal', alternateNames: ['Edgewood', 'Aberdeen Proving Ground'], country: 'United States', region: 'Maryland', hazards: ['chemical'], conflictId: 'domestic_toxic', regionGroup: 'Chemical Exposure Sites', pactActEligible: true, notes: 'Human subjects testing program' },

  // Asbestos/lead
  { name: 'Hunters Point Naval Shipyard', alternateNames: ['Hunters Point', 'HPNS'], country: 'United States', region: 'California', hazards: ['asbestos', 'radiation', 'lead'], conflictId: 'domestic_toxic', regionGroup: 'Contaminated Shipyards/Facilities', pactActEligible: true },
  { name: 'Mare Island Naval Shipyard', alternateNames: ['Mare Island'], country: 'United States', region: 'California', hazards: ['asbestos', 'lead'], conflictId: 'domestic_toxic', regionGroup: 'Contaminated Shipyards/Facilities', pactActEligible: true },
  { name: 'Portsmouth Naval Shipyard', alternateNames: ['Portsmouth', 'Kittery'], country: 'United States', region: 'Maine', hazards: ['asbestos'], conflictId: 'domestic_toxic', regionGroup: 'Contaminated Shipyards/Facilities', pactActEligible: true },
  { name: 'Norfolk Naval Shipyard', alternateNames: ['NNSY'], country: 'United States', region: 'Virginia', hazards: ['asbestos'], conflictId: 'domestic_toxic', regionGroup: 'Contaminated Shipyards/Facilities', pactActEligible: true },
  { name: 'Puget Sound Naval Shipyard', alternateNames: ['PSNS', 'Bremerton'], country: 'United States', region: 'Washington', hazards: ['asbestos', 'radiation'], conflictId: 'domestic_toxic', regionGroup: 'Contaminated Shipyards/Facilities', pactActEligible: true },
];
