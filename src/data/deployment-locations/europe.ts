import type { EnrichedLocation } from './types';

/** NEW — Cold War European bases with toxic exposure history */
export const EUROPE_LOCATIONS: EnrichedLocation[] = [
  { name: 'Ramstein Air Base (Cold War)', alternateNames: ['Ramstein CW'], country: 'Germany', region: 'Rhineland-Palatinate', coordinates: [49.44, 7.60], hazards: ['jet_fuel', 'asbestos'], conflictId: 'cold_war_europe', regionGroup: 'Germany — Air Bases', pactActEligible: true },
  { name: 'Spangdahlem Air Base', alternateNames: ['Spangdahlem', 'Spang'], country: 'Germany', region: 'Rhineland-Palatinate', coordinates: [49.97, 6.69], hazards: ['jet_fuel', 'pfas'], conflictId: 'cold_war_europe', regionGroup: 'Germany — Air Bases', pactActEligible: true },
  { name: 'Bitburg Air Base', alternateNames: ['Bitburg'], country: 'Germany', region: 'Rhineland-Palatinate', hazards: ['jet_fuel', 'asbestos'], conflictId: 'cold_war_europe', regionGroup: 'Germany — Air Bases', pactActEligible: true, notes: 'Closed 1994, significant fuel spill contamination' },
  { name: 'Hahn Air Base', alternateNames: ['Hahn'], country: 'Germany', region: 'Rhineland-Palatinate', hazards: ['jet_fuel', 'asbestos'], conflictId: 'cold_war_europe', regionGroup: 'Germany — Air Bases', pactActEligible: true, notes: 'Closed 1993' },
  { name: 'Zweibrücken Air Base', alternateNames: ['Zweibrucken'], country: 'Germany', region: 'Rhineland-Palatinate', hazards: ['jet_fuel'], conflictId: 'cold_war_europe', regionGroup: 'Germany — Air Bases', pactActEligible: true },
  { name: 'Rhein-Main Air Base', alternateNames: ['Rhein-Main', 'Frankfurt AB'], country: 'Germany', region: 'Hesse', hazards: ['jet_fuel', 'asbestos'], conflictId: 'cold_war_europe', regionGroup: 'Germany — Air Bases', pactActEligible: true, notes: 'Closed 2005, Berlin Airlift hub' },
  { name: 'Tempelhof Air Base', alternateNames: ['Tempelhof', 'Berlin Tempelhof'], country: 'Germany', region: 'Berlin', hazards: ['asbestos'], conflictId: 'cold_war_europe', regionGroup: 'Germany — Air Bases', pactActEligible: true },
  { name: 'Sembach Air Base', alternateNames: ['Sembach'], country: 'Germany', region: 'Rhineland-Palatinate', hazards: ['jet_fuel'], conflictId: 'cold_war_europe', regionGroup: 'Germany — Air Bases', pactActEligible: true },

  // Germany — Army
  { name: 'Grafenwöhr Training Area', alternateNames: ['Grafenwoehr', 'Graf'], country: 'Germany', region: 'Bavaria', coordinates: [49.69, 11.94], hazards: ['lead', 'munitions'], conflictId: 'cold_war_europe', regionGroup: 'Germany — Army', pactActEligible: true },
  { name: 'Hohenfels Training Area', alternateNames: ['Hohenfels', 'CMTC'], country: 'Germany', region: 'Bavaria', hazards: ['munitions'], conflictId: 'cold_war_europe', regionGroup: 'Germany — Army', pactActEligible: true },
  { name: 'Baumholder', alternateNames: ['Smith Barracks'], country: 'Germany', region: 'Rhineland-Palatinate', hazards: ['lead'], conflictId: 'cold_war_europe', regionGroup: 'Germany — Army', pactActEligible: true },
  { name: 'Kaiserslautern Military Community', alternateNames: ['K-Town', 'KMC'], country: 'Germany', region: 'Rhineland-Palatinate', hazards: ['jet_fuel'], conflictId: 'cold_war_europe', regionGroup: 'Germany — Army', pactActEligible: true },
  { name: 'Mannheim — Coleman Barracks', alternateNames: ['Coleman Barracks', 'Mannheim'], country: 'Germany', region: 'Baden-Württemberg', hazards: ['jet_fuel'], conflictId: 'cold_war_europe', regionGroup: 'Germany — Army', pactActEligible: true },
  { name: 'Heidelberg — Campbell Barracks', alternateNames: ['Campbell Barracks', 'Heidelberg'], country: 'Germany', region: 'Baden-Württemberg', hazards: ['asbestos'], conflictId: 'cold_war_europe', regionGroup: 'Germany — Army', pactActEligible: true },

  // UK
  { name: 'RAF Lakenheath', alternateNames: ['Lakenheath'], country: 'United Kingdom', region: 'Suffolk', coordinates: [52.41, 0.56], hazards: ['jet_fuel', 'pfas'], conflictId: 'cold_war_europe', regionGroup: 'United Kingdom', pactActEligible: true },
  { name: 'RAF Mildenhall', alternateNames: ['Mildenhall'], country: 'United Kingdom', region: 'Suffolk', hazards: ['jet_fuel', 'pfas'], conflictId: 'cold_war_europe', regionGroup: 'United Kingdom', pactActEligible: true },
  { name: 'RAF Upper Heyford', alternateNames: ['Upper Heyford'], country: 'United Kingdom', region: 'Oxfordshire', hazards: ['jet_fuel'], conflictId: 'cold_war_europe', regionGroup: 'United Kingdom', pactActEligible: true, notes: 'Closed 1994' },
  { name: 'RAF Greenham Common', alternateNames: ['Greenham Common'], country: 'United Kingdom', region: 'Berkshire', hazards: ['jet_fuel'], conflictId: 'cold_war_europe', regionGroup: 'United Kingdom', pactActEligible: true, notes: 'Cruise missile base, closed 1992' },
  { name: 'RAF Bentwaters/Woodbridge', alternateNames: ['Bentwaters', 'Woodbridge'], country: 'United Kingdom', region: 'Suffolk', hazards: ['jet_fuel'], conflictId: 'cold_war_europe', regionGroup: 'United Kingdom', pactActEligible: true },
  { name: 'Holy Loch Naval Base', alternateNames: ['Holy Loch', 'SSBN Refit Site One'], country: 'United Kingdom', region: 'Scotland', hazards: ['radiation', 'asbestos'], conflictId: 'cold_war_europe', regionGroup: 'United Kingdom', pactActEligible: true, notes: 'Nuclear submarine base' },

  // Italy
  { name: 'Aviano Air Base (Cold War)', alternateNames: ['Aviano CW'], country: 'Italy', region: 'Friuli-Venezia Giulia', hazards: ['jet_fuel'], conflictId: 'cold_war_europe', regionGroup: 'Italy', pactActEligible: true },
  { name: 'NAS Sigonella (Cold War)', alternateNames: ['Sigonella CW'], country: 'Italy', region: 'Sicily', hazards: ['jet_fuel'], conflictId: 'cold_war_europe', regionGroup: 'Italy', pactActEligible: true },
  { name: 'Camp Darby', alternateNames: ['Darby'], country: 'Italy', region: 'Tuscany', hazards: ['munitions'], conflictId: 'cold_war_europe', regionGroup: 'Italy', pactActEligible: true },
  { name: 'La Maddalena Naval Base', alternateNames: ['La Maddalena'], country: 'Italy', region: 'Sardinia', hazards: ['radiation', 'asbestos'], conflictId: 'cold_war_europe', regionGroup: 'Italy', pactActEligible: true, notes: 'Nuclear submarine support' },

  // Spain
  { name: 'Torrejón Air Base', alternateNames: ['Torrejon'], country: 'Spain', region: 'Madrid', hazards: ['jet_fuel'], conflictId: 'cold_war_europe', regionGroup: 'Spain', pactActEligible: true, notes: 'Closed 1992' },
  { name: 'Zaragoza Air Base (Cold War)', alternateNames: ['Zaragoza CW'], country: 'Spain', region: 'Aragon', hazards: ['jet_fuel'], conflictId: 'cold_war_europe', regionGroup: 'Spain', pactActEligible: true },
  { name: 'Rota Naval Station (Cold War)', alternateNames: ['Rota CW'], country: 'Spain', region: 'Andalusia', hazards: ['jet_fuel', 'asbestos'], conflictId: 'cold_war_europe', regionGroup: 'Spain', pactActEligible: true },

  // Iceland/Greenland
  { name: 'NAS Keflavik', alternateNames: ['Keflavik', 'KEF'], country: 'Iceland', coordinates: [63.97, -22.61], hazards: ['jet_fuel', 'pfas'], conflictId: 'cold_war_europe', regionGroup: 'Iceland/Greenland', pactActEligible: true },
  { name: 'Thule Air Base (Cold War)', alternateNames: ['Thule CW'], country: 'Greenland', hazards: ['jet_fuel', 'radiation'], conflictId: 'cold_war_europe', regionGroup: 'Iceland/Greenland', pactActEligible: true, notes: 'BMEWS site, 1968 B-52 crash with nuclear weapons' },
];
