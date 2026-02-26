import type { EnrichedLocation } from './types';

/** All OEF Afghanistan deployment locations — enriched from existing data */
export const AFGHANISTAN_LOCATIONS: EnrichedLocation[] = [
  // RC-Capital
  { name: 'Camp KAIA', alternateNames: ['Kabul International', 'KAIA'], country: 'Afghanistan', region: 'Kabul', coordinates: [34.57, 69.21], hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Capital', pactActEligible: true },
  { name: 'Camp Phoenix', alternateNames: ['Phoenix'], country: 'Afghanistan', region: 'Kabul', coordinates: [34.55, 69.22], hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Capital', pactActEligible: true },
  { name: 'Camp Eggers', alternateNames: ['Eggers'], country: 'Afghanistan', region: 'Kabul', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Capital', pactActEligible: true },
  { name: 'Camp Julien', alternateNames: [], country: 'Afghanistan', region: 'Kabul', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Capital', pactActEligible: true },
  { name: 'Camp Warehouse', alternateNames: [], country: 'Afghanistan', region: 'Kabul', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Capital', pactActEligible: true },
  { name: 'Camp Souter', alternateNames: [], country: 'Afghanistan', region: 'Kabul', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Capital', pactActEligible: true },
  { name: 'Camp Dubs', alternateNames: [], country: 'Afghanistan', region: 'Kabul', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Capital', pactActEligible: true },

  // RC-East — Parwan
  { name: 'Bagram Airfield', alternateNames: ['BAF', 'Bagram', 'Bagram Air Base'], country: 'Afghanistan', region: 'Parwan', coordinates: [34.95, 69.27], hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Parwan', pactActEligible: true },

  // RC-East — Nangarhar
  { name: 'Jalalabad Airfield', alternateNames: ['J-Bad', 'JAF'], country: 'Afghanistan', region: 'Nangarhar', coordinates: [34.40, 70.50], hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Nangarhar', pactActEligible: true },
  { name: 'FOB Fenty', alternateNames: ['Fenty'], country: 'Afghanistan', region: 'Nangarhar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Nangarhar', pactActEligible: true },
  { name: 'FOB Torkham', alternateNames: [], country: 'Afghanistan', region: 'Nangarhar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Nangarhar', pactActEligible: true },
  { name: 'FOB Connolly', alternateNames: [], country: 'Afghanistan', region: 'Nangarhar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Nangarhar', pactActEligible: true },

  // RC-East — Khost
  { name: 'FOB Salerno', alternateNames: ['Salerno', 'Khost Airfield'], country: 'Afghanistan', region: 'Khost', coordinates: [33.33, 69.95], hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Khost', pactActEligible: true },
  { name: 'FOB Chapman', alternateNames: ['Chapman'], country: 'Afghanistan', region: 'Khost', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Khost', pactActEligible: true },
  { name: 'COP Sabari', alternateNames: [], country: 'Afghanistan', region: 'Khost', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Khost', pactActEligible: true },
  { name: 'COP Chamkani', alternateNames: [], country: 'Afghanistan', region: 'Khost', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Khost', pactActEligible: true },
  { name: 'COP Wilderness', alternateNames: [], country: 'Afghanistan', region: 'Khost', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Khost', pactActEligible: true },

  // RC-East — Paktika
  { name: 'FOB Sharana', alternateNames: ['Sharana'], country: 'Afghanistan', region: 'Paktika', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Paktika', pactActEligible: true },
  { name: 'FOB Orgun-E', alternateNames: ['Orgun-E'], country: 'Afghanistan', region: 'Paktika', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Paktika', pactActEligible: true },
  { name: 'FOB Bermel', alternateNames: [], country: 'Afghanistan', region: 'Paktika', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Paktika', pactActEligible: true },
  { name: 'FOB Tillman', alternateNames: [], country: 'Afghanistan', region: 'Paktika', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Paktika', pactActEligible: true },
  { name: 'FOB Zormat', alternateNames: [], country: 'Afghanistan', region: 'Paktika', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Paktika', pactActEligible: true },
  { name: 'COP Margah', alternateNames: [], country: 'Afghanistan', region: 'Paktika', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Paktika', pactActEligible: true },
  { name: 'COP Zerok', alternateNames: [], country: 'Afghanistan', region: 'Paktika', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Paktika', pactActEligible: true },

  // RC-East — Paktia
  { name: 'FOB Gardez', alternateNames: ['Gardez'], country: 'Afghanistan', region: 'Paktia', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Paktia', pactActEligible: true },
  { name: 'FOB Shank', alternateNames: ['Shank'], country: 'Afghanistan', region: 'Paktia', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Paktia', pactActEligible: true },
  { name: 'FOB Lightning', alternateNames: [], country: 'Afghanistan', region: 'Paktia', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Paktia', pactActEligible: true },
  { name: 'FOB Thunder', alternateNames: [], country: 'Afghanistan', region: 'Paktia', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Paktia', pactActEligible: true },
  { name: 'FOB Zurmat', alternateNames: [], country: 'Afghanistan', region: 'Paktia', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Paktia', pactActEligible: true },
  { name: 'COP Herrera', alternateNames: [], country: 'Afghanistan', region: 'Paktia', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Paktia', pactActEligible: true },

  // RC-East — Ghazni
  { name: 'FOB Ghazni', alternateNames: ['Ghazni'], country: 'Afghanistan', region: 'Ghazni', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Ghazni', pactActEligible: true },
  { name: 'FOB Vulcan', alternateNames: [], country: 'Afghanistan', region: 'Ghazni', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Ghazni', pactActEligible: true },
  { name: 'FOB Andar', alternateNames: [], country: 'Afghanistan', region: 'Ghazni', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Ghazni', pactActEligible: true },

  // RC-East — Kunar
  { name: 'FOB Joyce', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'FOB Blessing', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'FOB Wright', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'FOB Monti', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'FOB Asadabad', alternateNames: ['A-Bad'], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'FOB Nangalam', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'COP Able Main', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'COP Monti', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'COP Honaker-Miracle', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'COP Michigan', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'COP Penich', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'COP Fortress', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'COP Nangalam', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },

  // RC-East — Nuristan
  { name: 'FOB Kalagush', alternateNames: [], country: 'Afghanistan', region: 'Nuristan', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Nuristan', pactActEligible: true },
  { name: 'FOB Bostick', alternateNames: [], country: 'Afghanistan', region: 'Nuristan', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Nuristan', pactActEligible: true },
  { name: 'COP Keating', alternateNames: ['Keating', 'Combat Outpost Keating'], country: 'Afghanistan', region: 'Nuristan', coordinates: [35.40, 71.33], hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Nuristan', pactActEligible: true },
  { name: 'COP Lowell', alternateNames: [], country: 'Afghanistan', region: 'Nuristan', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Nuristan', pactActEligible: true },
  { name: 'COP Fritsche', alternateNames: [], country: 'Afghanistan', region: 'Nuristan', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Nuristan', pactActEligible: true },

  // RC-East — Laghman
  { name: 'FOB Mehtar Lam', alternateNames: [], country: 'Afghanistan', region: 'Laghman', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Laghman', pactActEligible: true },
  { name: 'COP Najil', alternateNames: [], country: 'Afghanistan', region: 'Laghman', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Laghman', pactActEligible: true },

  // RC-East — Kapisa
  { name: 'FOB Tagab', alternateNames: [], country: 'Afghanistan', region: 'Kapisa', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kapisa', pactActEligible: true },
  { name: 'FOB Kutschbach', alternateNames: [], country: 'Afghanistan', region: 'Kapisa', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kapisa', pactActEligible: true },

  // RC-East — Logar
  { name: 'FOB Shank', alternateNames: [], country: 'Afghanistan', region: 'Logar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Logar', pactActEligible: true },
  { name: 'FOB Altimur', alternateNames: [], country: 'Afghanistan', region: 'Logar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Logar', pactActEligible: true },
  { name: 'Camp Maiwand', alternateNames: [], country: 'Afghanistan', region: 'Logar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Logar', pactActEligible: true },
  { name: 'Camp Dahlke', alternateNames: [], country: 'Afghanistan', region: 'Logar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Logar', pactActEligible: true },

  // RC-East — Wardak
  { name: 'FOB Airborne', alternateNames: [], country: 'Afghanistan', region: 'Wardak', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Wardak', pactActEligible: true },
  { name: 'COP Nerkh', alternateNames: [], country: 'Afghanistan', region: 'Wardak', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Wardak', pactActEligible: true },
  { name: 'COP Sayedabad', alternateNames: [], country: 'Afghanistan', region: 'Wardak', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Wardak', pactActEligible: true },
  { name: 'COP Carwile', alternateNames: [], country: 'Afghanistan', region: 'Wardak', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Wardak', pactActEligible: true },
  { name: 'COP Tangi', alternateNames: [], country: 'Afghanistan', region: 'Wardak', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Wardak', pactActEligible: true },

  // RC-South — Kandahar
  { name: 'Kandahar Airfield', alternateNames: ['KAF', 'Kandahar', 'KAF Boardwalk'], country: 'Afghanistan', region: 'Kandahar', coordinates: [31.51, 65.85], hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Kandahar', pactActEligible: true },
  { name: 'FOB Wilson', alternateNames: [], country: 'Afghanistan', region: 'Kandahar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Kandahar', pactActEligible: true },
  { name: 'FOB Walton', alternateNames: [], country: 'Afghanistan', region: 'Kandahar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Kandahar', pactActEligible: true },
  { name: 'FOB Pasab', alternateNames: [], country: 'Afghanistan', region: 'Kandahar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Kandahar', pactActEligible: true },
  { name: 'FOB Sperwan Ghar', alternateNames: [], country: 'Afghanistan', region: 'Kandahar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Kandahar', pactActEligible: true },
  { name: 'COP Zhari', alternateNames: [], country: 'Afghanistan', region: 'Kandahar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Kandahar', pactActEligible: true },
  { name: 'COP Panjwai', alternateNames: [], country: 'Afghanistan', region: 'Kandahar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Kandahar', pactActEligible: true },
  { name: 'COP Mushan', alternateNames: [], country: 'Afghanistan', region: 'Kandahar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Kandahar', pactActEligible: true },
  { name: 'COP Nejat', alternateNames: [], country: 'Afghanistan', region: 'Kandahar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Kandahar', pactActEligible: true },
  { name: 'COP Talokan', alternateNames: [], country: 'Afghanistan', region: 'Kandahar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Kandahar', pactActEligible: true },
  { name: 'COP Zangabad', alternateNames: [], country: 'Afghanistan', region: 'Kandahar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Kandahar', pactActEligible: true },

  // RC-South — Uruzgan
  { name: 'Multi-National Base Tarin Kowt', alternateNames: ['TK', 'Tarin Kowt'], country: 'Afghanistan', region: 'Uruzgan', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Uruzgan', pactActEligible: true },
  { name: 'FOB Ripley', alternateNames: [], country: 'Afghanistan', region: 'Uruzgan', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Uruzgan', pactActEligible: true },
  { name: 'FOB Cobra', alternateNames: [], country: 'Afghanistan', region: 'Uruzgan', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Uruzgan', pactActEligible: true },
  { name: 'COP Hadrian', alternateNames: [], country: 'Afghanistan', region: 'Uruzgan', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Uruzgan', pactActEligible: true },

  // RC-South — Zabul
  { name: 'FOB Lagman', alternateNames: [], country: 'Afghanistan', region: 'Zabul', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Zabul', pactActEligible: true },
  { name: 'FOB Wolverine', alternateNames: [], country: 'Afghanistan', region: 'Zabul', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Zabul', pactActEligible: true },
  { name: 'COP Mizan', alternateNames: [], country: 'Afghanistan', region: 'Zabul', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Zabul', pactActEligible: true },

  // RC-Southwest — Helmand
  { name: 'Camp Leatherneck', alternateNames: ['Leatherneck'], country: 'Afghanistan', region: 'Helmand', coordinates: [31.61, 64.22], hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'Camp Bastion', alternateNames: ['Bastion'], country: 'Afghanistan', region: 'Helmand', coordinates: [31.61, 64.23], hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'Camp Shorabak', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'Camp Dwyer', alternateNames: ['Dwyer'], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'FOB Edinburgh', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'FOB Inkerman', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'FOB Robinson', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'FOB Delhi', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'FOB Nolay', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'FOB Geronimo', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'FOB Zeebrugge', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'FOB Marjah', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'FOB Jackson', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'FOB Shukvani', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'FOB White House', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'COP Sangin', alternateNames: ['Sangin'], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'COP Musa Qala', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'COP Now Zad', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'COP Garmsir', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'COP Kajaki', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'COP Nawa', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'COP Kuchinay', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'COP Ricketts', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'COP Metro', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'PB Deh Mezong', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'PB Marjah', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'PB Nad-e Ali', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },
  { name: 'PB Khan-e Shin', alternateNames: [], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Helmand', pactActEligible: true },

  // RC-Southwest — Nimruz
  { name: 'FOB Delaram', alternateNames: [], country: 'Afghanistan', region: 'Nimruz', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Nimruz', pactActEligible: true },
  { name: 'FOB Delaram II', alternateNames: [], country: 'Afghanistan', region: 'Nimruz', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-Southwest — Nimruz', pactActEligible: true },

  // RC-West — Herat
  { name: 'Camp Arena', alternateNames: [], country: 'Afghanistan', region: 'Herat', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-West — Herat', pactActEligible: true },
  { name: 'Shindand Air Base', alternateNames: ['Shindand'], country: 'Afghanistan', region: 'Herat', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-West — Herat', pactActEligible: true },
  { name: 'FOB Adraskan', alternateNames: [], country: 'Afghanistan', region: 'Herat', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-West — Herat', pactActEligible: true },
  { name: 'FOB Todd', alternateNames: [], country: 'Afghanistan', region: 'Herat', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-West — Herat', pactActEligible: true },

  // RC-West — Farah
  { name: 'FOB Farah', alternateNames: [], country: 'Afghanistan', region: 'Farah', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-West — Farah', pactActEligible: true },
  { name: 'FOB Stone', alternateNames: [], country: 'Afghanistan', region: 'Farah', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-West — Farah', pactActEligible: true },
  { name: 'FOB Dimonios', alternateNames: [], country: 'Afghanistan', region: 'Farah', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-West — Farah', pactActEligible: true },

  // RC-West — Badghis
  { name: 'PRT Qala-i-Naw', alternateNames: [], country: 'Afghanistan', region: 'Badghis', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-West — Badghis', pactActEligible: true },

  // RC-North — Balkh
  { name: 'Camp Marmal', alternateNames: ['Marmal'], country: 'Afghanistan', region: 'Balkh', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-North — Balkh', pactActEligible: true },

  // RC-North — Kunduz
  { name: 'PRT Kunduz', alternateNames: [], country: 'Afghanistan', region: 'Kunduz', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-North — Kunduz', pactActEligible: true },

  // RC-North — Badakhshan
  { name: 'PRT Feyzabad', alternateNames: [], country: 'Afghanistan', region: 'Badakhshan', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-North — Badakhshan', pactActEligible: true },

  // RC-North — Baghlan
  { name: 'PRT Pol-e Khumri', alternateNames: [], country: 'Afghanistan', region: 'Baghlan', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-North — Baghlan', pactActEligible: true },

  // RC-North — Faryab
  { name: 'PRT Maimana', alternateNames: [], country: 'Afghanistan', region: 'Faryab', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-North — Faryab', pactActEligible: true },

  // Early Operations
  { name: 'Camp Rhino', alternateNames: ['Rhino'], country: 'Afghanistan', region: 'Helmand', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'Early Operations', pactActEligible: true },

  // NEW — expanded locations
  { name: 'OP Restrepo', alternateNames: ['Restrepo', 'Outpost Restrepo'], country: 'Afghanistan', region: 'Kunar', coordinates: [35.08, 71.08], hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true, notes: 'Korengal Valley outpost, subject of documentary' },
  { name: 'OP Dallas', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'COP Pirtle-King', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'COP Lybert', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'FOB Mehtar Lam Airfield', alternateNames: ['MTL'], country: 'Afghanistan', region: 'Laghman', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Laghman', pactActEligible: true },
  { name: 'Camp Brown', alternateNames: [], country: 'Afghanistan', region: 'Wardak', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Wardak', pactActEligible: true },
  { name: 'FOB Gamberi', alternateNames: [], country: 'Afghanistan', region: 'Laghman', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Laghman', pactActEligible: true },
  { name: 'COP Able Main II', alternateNames: [], country: 'Afghanistan', region: 'Kunar', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-East — Kunar', pactActEligible: true },
  { name: 'FOB Shirana', alternateNames: [], country: 'Afghanistan', region: 'Zabul', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Zabul', pactActEligible: true },
  { name: 'FOB Apache', alternateNames: [], country: 'Afghanistan', region: 'Zabul', hazards: ['burn_pit'], conflictId: 'oef_afghanistan', regionGroup: 'RC-South — Zabul', pactActEligible: true },
];
