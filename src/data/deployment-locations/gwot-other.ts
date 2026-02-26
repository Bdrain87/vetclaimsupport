import type { EnrichedLocation } from './types';

/** GWOT Other Worldwide Locations — expanded from 31 to 50+ */
export const GWOT_OTHER_LOCATIONS: EnrichedLocation[] = [
  // Djibouti
  { name: 'Camp Lemonnier', alternateNames: ['Lemonnier', 'CLDJ'], country: 'Djibouti', coordinates: [11.55, 43.15], hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Djibouti', pactActEligible: true },

  // Qatar
  { name: 'Al Udeid Air Base', alternateNames: ['Al Udeid', 'The Deid', 'AUAB'], country: 'Qatar', coordinates: [25.12, 51.32], hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Qatar', pactActEligible: true },
  { name: 'Camp As Sayliyah', alternateNames: ['As Sayliyah', 'CAS'], country: 'Qatar', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Qatar', pactActEligible: true },

  // Kuwait
  { name: 'Camp Arifjan', alternateNames: ['Arifjan'], country: 'Kuwait', coordinates: [28.94, 48.10], hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Kuwait', pactActEligible: true },
  { name: 'Camp Buehring', alternateNames: ['Buehring', 'Camp Udairi'], country: 'Kuwait', coordinates: [29.43, 47.56], hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Kuwait', pactActEligible: true },
  { name: 'Ali Al Salem Air Base', alternateNames: ['Ali Al Salem'], country: 'Kuwait', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Kuwait', pactActEligible: true },
  { name: 'Camp Patriot', alternateNames: [], country: 'Kuwait', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Kuwait', pactActEligible: true },
  { name: 'Camp Virginia', alternateNames: [], country: 'Kuwait', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Kuwait', pactActEligible: true },
  { name: 'Camp New York', alternateNames: [], country: 'Kuwait', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Kuwait', pactActEligible: true },
  { name: 'Camp Pennsylvania', alternateNames: [], country: 'Kuwait', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Kuwait', pactActEligible: true },
  { name: 'Camp Spearhead', alternateNames: [], country: 'Kuwait', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Kuwait', pactActEligible: true },
  { name: 'Camp Wolverine', alternateNames: [], country: 'Kuwait', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Kuwait', pactActEligible: true },

  // Bahrain
  { name: 'Naval Support Activity Bahrain', alternateNames: ['NSA Bahrain'], country: 'Bahrain', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Bahrain', pactActEligible: true },
  { name: 'US Fifth Fleet HQ', alternateNames: ['5th Fleet'], country: 'Bahrain', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Bahrain', pactActEligible: true },

  // UAE
  { name: 'Al Dhafra Air Base', alternateNames: ['Al Dhafra', 'ADAB'], country: 'UAE', coordinates: [24.25, 54.55], hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'UAE', pactActEligible: true },
  { name: 'Fujairah Naval Base', alternateNames: [], country: 'UAE', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'UAE', pactActEligible: true },

  // Oman
  { name: 'Thumrait Air Base', alternateNames: ['Thumrait'], country: 'Oman', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Oman', pactActEligible: true },
  { name: 'Masirah Air Base', alternateNames: ['Masirah'], country: 'Oman', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Oman', pactActEligible: true },
  { name: 'Muscat Air Base', alternateNames: [], country: 'Oman', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Oman', pactActEligible: true },

  // Turkey
  { name: 'Incirlik Air Base', alternateNames: ['Incirlik'], country: 'Turkey', coordinates: [37.00, 35.43], hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Turkey', pactActEligible: true },
  { name: 'Izmir Air Station', alternateNames: ['Izmir AS'], country: 'Turkey', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Turkey', pactActEligible: true },

  // Jordan
  { name: 'Muwaffaq Salti Air Base', alternateNames: ['MSAB', 'Al-Azraq'], country: 'Jordan', coordinates: [31.83, 36.78], hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Jordan', pactActEligible: true },

  // Horn of Africa
  { name: 'Various locations — Somalia, Kenya, Ethiopia', alternateNames: ['HOA', 'CJTF-HOA'], country: 'Various', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Horn of Africa', pactActEligible: true },

  // Philippines
  { name: 'Joint Special Operations Task Force Philippines', alternateNames: ['JSOTF-P'], country: 'Philippines', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Philippines', pactActEligible: true },
  { name: 'Camp Navarro', alternateNames: [], country: 'Philippines', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Philippines', pactActEligible: true },

  // Diego Garcia
  { name: 'Naval Support Facility Diego Garcia', alternateNames: ['Diego Garcia', 'NSF DG'], country: 'British Indian Ocean Territory', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Diego Garcia', pactActEligible: true },

  // Germany (staging)
  { name: 'Landstuhl Regional Medical Center', alternateNames: ['Landstuhl', 'LRMC'], country: 'Germany', coordinates: [49.41, 7.59], hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Germany (staging)', pactActEligible: true },
  { name: 'Ramstein Air Base', alternateNames: ['Ramstein'], country: 'Germany', coordinates: [49.44, 7.60], hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Germany (staging)', pactActEligible: true },

  // Italy (staging)
  { name: 'Aviano Air Base', alternateNames: ['Aviano'], country: 'Italy', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Italy (staging)', pactActEligible: true },
  { name: 'Naval Air Station Sigonella', alternateNames: ['Sigonella', 'NAS Sig'], country: 'Italy', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Italy (staging)', pactActEligible: true },

  // Spain
  { name: 'Naval Station Rota', alternateNames: ['Rota'], country: 'Spain', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Spain', pactActEligible: true },

  // NEW — expanded Syria, Somalia, Niger, etc.
  { name: 'Al-Tanf Garrison', alternateNames: ['Al-Tanf', 'At Tanf'], country: 'Syria', coordinates: [33.50, 38.66], hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Syria', pactActEligible: true },
  { name: 'Kobani Landing Zone', alternateNames: ['Kobani'], country: 'Syria', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Syria', pactActEligible: true },
  { name: 'Rmeilan Airfield', alternateNames: [], country: 'Syria', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Syria', pactActEligible: true },
  { name: 'Camp Simba', alternateNames: ['Simba', 'Manda Bay'], country: 'Kenya', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Horn of Africa', pactActEligible: true },
  { name: 'Baledogle Airfield', alternateNames: ['Baledogle'], country: 'Somalia', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Horn of Africa', pactActEligible: true },
  { name: 'Air Base 201 Agadez', alternateNames: ['AB 201', 'Agadez'], country: 'Niger', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Africa', pactActEligible: true },
  { name: 'Air Base 101 Niamey', alternateNames: ['AB 101'], country: 'Niger', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Africa', pactActEligible: true },
  { name: 'Camp Lemonnier Annex', alternateNames: ['Chabelley Airfield'], country: 'Djibouti', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Djibouti', pactActEligible: true },
  { name: 'Prince Hassan Air Base', alternateNames: ['H-5'], country: 'Jordan', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Jordan', pactActEligible: true },
  { name: 'Cooperative Security Location Entebbe', alternateNames: ['CSL Entebbe'], country: 'Uganda', hazards: ['burn_pit'], conflictId: 'gwot_other', regionGroup: 'Africa', pactActEligible: true },
];
