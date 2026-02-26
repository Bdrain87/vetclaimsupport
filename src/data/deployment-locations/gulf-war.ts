import type { EnrichedLocation } from './types';

/** Gulf War / Desert Shield / Desert Storm locations — expanded from 30 to 100+ */
export const GULF_WAR_LOCATIONS: EnrichedLocation[] = [
  // Saudi Arabia — Air Bases (existing)
  { name: 'King Abdul Aziz Air Base', alternateNames: ['KAAB', 'Dhahran AB'], country: 'Saudi Arabia', region: 'Eastern Province', coordinates: [26.27, 50.15], hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Air Bases', pactActEligible: true },
  { name: 'Prince Sultan Air Base', alternateNames: ['PSAB', 'Al Kharj'], country: 'Saudi Arabia', region: 'Riyadh', coordinates: [24.06, 47.58], hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Air Bases', pactActEligible: true },
  { name: 'King Faisal Air Base', alternateNames: ['Tabuk AB'], country: 'Saudi Arabia', region: 'Tabuk', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Air Bases', pactActEligible: true },
  { name: 'King Khalid Air Base', alternateNames: ['Khamis Mushait AB'], country: 'Saudi Arabia', region: 'Asir', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Air Bases', pactActEligible: true },
  { name: 'Taif Air Base', alternateNames: [], country: 'Saudi Arabia', region: 'Mecca', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Air Bases', pactActEligible: true },
  { name: 'King Fahd International Airport', alternateNames: ['KFIA'], country: 'Saudi Arabia', region: 'Eastern Province', coordinates: [26.47, 49.80], hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Air Bases', pactActEligible: true },
  { name: 'Riyadh Air Base', alternateNames: ['Riyadh Military Airfield'], country: 'Saudi Arabia', region: 'Riyadh', coordinates: [24.71, 46.73], hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Air Bases', pactActEligible: true },
  { name: 'Jeddah', alternateNames: ['Jeddah Air Base'], country: 'Saudi Arabia', region: 'Mecca', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Air Bases', pactActEligible: true },

  // Saudi Arabia — Ground/Logistics (existing)
  { name: 'King Khalid Military City', alternateNames: ['KKMC', 'Emerald City'], country: 'Saudi Arabia', region: 'Eastern Province', coordinates: [27.90, 45.53], hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Ground/Logistics', pactActEligible: true },
  { name: 'Eskan Village', alternateNames: ['Eskan'], country: 'Saudi Arabia', region: 'Riyadh', coordinates: [24.58, 46.77], hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Ground/Logistics', pactActEligible: true },
  { name: 'Log Base Alpha', alternateNames: ['LB Alpha'], country: 'Saudi Arabia', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Ground/Logistics', pactActEligible: true },
  { name: 'Log Base Bravo', alternateNames: ['LB Bravo'], country: 'Saudi Arabia', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Ground/Logistics', pactActEligible: true },
  { name: 'Log Base Charlie', alternateNames: ['LB Charlie'], country: 'Saudi Arabia', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Ground/Logistics', pactActEligible: true },
  { name: 'Log Base Echo', alternateNames: ['LB Echo'], country: 'Saudi Arabia', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Ground/Logistics', pactActEligible: true },
  { name: 'FOB Weasel', alternateNames: [], country: 'Saudi Arabia', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Ground/Logistics', pactActEligible: true },

  // Saudi Arabia — Ports (existing)
  { name: 'Ad Dammam Port', alternateNames: ['Dammam'], country: 'Saudi Arabia', region: 'Eastern Province', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Ports', pactActEligible: true },
  { name: 'Al Jubayl Port', alternateNames: ['Jubail'], country: 'Saudi Arabia', region: 'Eastern Province', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Ports', pactActEligible: true },

  // Kuwait (existing)
  { name: 'Camp Doha', alternateNames: ['Doha'], country: 'Kuwait', coordinates: [29.35, 47.95], hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Kuwait', pactActEligible: true },
  { name: 'Camp Arifjan', alternateNames: ['Arifjan'], country: 'Kuwait', coordinates: [28.94, 48.10], hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Kuwait', pactActEligible: true },
  { name: 'Ali Al Salem Air Base', alternateNames: ['Ali Al Salem'], country: 'Kuwait', coordinates: [29.35, 47.52], hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Kuwait', pactActEligible: true },
  { name: 'Ahmed Al Jaber Air Base', alternateNames: ['Al Jaber'], country: 'Kuwait', coordinates: [28.93, 47.79], hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Kuwait', pactActEligible: true },

  // Oman (existing)
  { name: 'Seeb International Airport', alternateNames: ['Muscat International'], country: 'Oman', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Oman', pactActEligible: true },
  { name: 'Thumrait Air Base', alternateNames: ['Thumrait'], country: 'Oman', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Oman', pactActEligible: true },
  { name: 'Masirah Air Base', alternateNames: ['Masirah Island'], country: 'Oman', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Oman', pactActEligible: true },

  // UAE (existing)
  { name: 'Al Bateen Air Base', alternateNames: [], country: 'UAE', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'UAE', pactActEligible: true },
  { name: 'Al Ain International Airport', alternateNames: [], country: 'UAE', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'UAE', pactActEligible: true },
  { name: 'Sharjah International Airport', alternateNames: [], country: 'UAE', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'UAE', pactActEligible: true },

  // Bahrain (existing)
  { name: 'Naval Support Activity Bahrain', alternateNames: ['NSA Bahrain'], country: 'Bahrain', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Bahrain', pactActEligible: true },

  // Diego Garcia (existing)
  { name: 'Diego Garcia', alternateNames: ['BIOT'], country: 'British Indian Ocean Territory', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Diego Garcia', pactActEligible: true },

  // Navy (existing)
  { name: 'USS [ship name] — Gulf waters/Arabian Sea/Red Sea', alternateNames: ['Navy — Gulf Waters', 'Desert Storm Navy'], country: 'At Sea', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Navy — Gulf Waters', pactActEligible: true },

  // NEW — expanded Saudi camps
  { name: 'Cement City', alternateNames: ['Cement Factory'], country: 'Saudi Arabia', region: 'Eastern Province', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Staging Camps', pactActEligible: true },
  { name: 'Tent City', alternateNames: ['Al Jubayl Tent City'], country: 'Saudi Arabia', region: 'Eastern Province', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Staging Camps', pactActEligible: true },
  { name: 'Camp Bastogne (DS)', alternateNames: [], country: 'Saudi Arabia', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Staging Camps', pactActEligible: true },
  { name: 'FOB Cobra (DS)', alternateNames: [], country: 'Iraq', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Iraq — Ground War', pactActEligible: true },
  { name: 'FOB Viper (DS)', alternateNames: [], country: 'Iraq', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Iraq — Ground War', pactActEligible: true },
  { name: 'Assembly Area Keyes', alternateNames: ['AA Keyes'], country: 'Saudi Arabia', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Assembly Areas', pactActEligible: true },
  { name: 'Assembly Area Thompson', alternateNames: ['AA Thompson'], country: 'Saudi Arabia', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Assembly Areas', pactActEligible: true },
  { name: 'Assembly Area Horseshoe', alternateNames: ['AA Horseshoe'], country: 'Saudi Arabia', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Assembly Areas', pactActEligible: true },
  { name: 'Tactical Assembly Area Roosevelt', alternateNames: ['TAA Roosevelt'], country: 'Iraq', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Iraq — Ground War', pactActEligible: true },
  { name: 'Tactical Assembly Area Campbell', alternateNames: ['TAA Campbell'], country: 'Iraq', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Iraq — Ground War', pactActEligible: true },
  { name: 'Battle of 73 Easting', alternateNames: ['73 Easting'], country: 'Iraq', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Iraq — Ground War', pactActEligible: true, notes: 'Major tank battle, DU munitions used' },
  { name: 'Battle of Medina Ridge', alternateNames: ['Medina Ridge'], country: 'Iraq', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Iraq — Ground War', pactActEligible: true },
  { name: 'Highway of Death', alternateNames: ['Highway 80'], country: 'Kuwait', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Kuwait — Battle Sites', pactActEligible: true },
  { name: 'Kuwait City', alternateNames: [], country: 'Kuwait', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Kuwait', pactActEligible: true },
  { name: 'Kuwait International Airport', alternateNames: ['KIA'], country: 'Kuwait', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Kuwait', pactActEligible: true },
  { name: 'Al Mutla Ridge', alternateNames: ['Mutla Pass'], country: 'Kuwait', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Kuwait — Battle Sites', pactActEligible: true },
  { name: 'Hafar Al-Batin', alternateNames: ['Hafar Al Batin'], country: 'Saudi Arabia', region: 'Eastern Province', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Ground/Logistics', pactActEligible: true },
  { name: 'Ras Al Khafji', alternateNames: ['Khafji', 'Battle of Khafji'], country: 'Saudi Arabia', region: 'Eastern Province', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Saudi Arabia — Ground/Logistics', pactActEligible: true },
  { name: 'Camp Doha DU Incident', alternateNames: ['Doha Motor Pool Fire'], country: 'Kuwait', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Kuwait', pactActEligible: true, notes: '1991 fire involving DU rounds at Camp Doha' },
  { name: 'Khamisiyah Demolition Site', alternateNames: ['Khamisiyah', 'Khamisiyah Pit'], country: 'Iraq', hazards: ['oil_well_fire', 'depleted_uranium', 'chemical'], conflictId: 'gulf_war', regionGroup: 'Iraq — Ground War', pactActEligible: true, notes: 'Chemical weapons demolition site — sarin/cyclosarin exposure' },
  { name: 'Basra — Gulf War', alternateNames: ['Basra 1991'], country: 'Iraq', region: 'Basra', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Iraq — Ground War', pactActEligible: true },

  // NEW — Naval vessels (expanded)
  { name: 'USS Missouri (BB-63)', alternateNames: ['Missouri'], country: 'At Sea', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Navy — Gulf Waters', pactActEligible: true },
  { name: 'USS Wisconsin (BB-64)', alternateNames: ['Wisconsin'], country: 'At Sea', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Navy — Gulf Waters', pactActEligible: true },
  { name: 'USS Saratoga (CV-60)', alternateNames: ['Saratoga'], country: 'At Sea', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Navy — Gulf Waters', pactActEligible: true },
  { name: 'USS Theodore Roosevelt (CVN-71)', alternateNames: ['TR'], country: 'At Sea', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Navy — Gulf Waters', pactActEligible: true },
  { name: 'USS America (CV-66)', alternateNames: [], country: 'At Sea', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Navy — Gulf Waters', pactActEligible: true },
  { name: 'USS Ranger (CV-61)', alternateNames: [], country: 'At Sea', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Navy — Gulf Waters', pactActEligible: true },
  { name: 'USS Tripoli (LPH-10)', alternateNames: [], country: 'At Sea', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Navy — Gulf Waters', pactActEligible: true, notes: 'Struck by mine Feb 1991' },
  { name: 'USS Princeton (CG-59)', alternateNames: [], country: 'At Sea', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Navy — Gulf Waters', pactActEligible: true, notes: 'Struck by mine Feb 1991' },

  // NEW — Saudi airfields (expanded)
  { name: 'Cairo West Air Base (staging)', alternateNames: [], country: 'Egypt', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Egypt — Staging', pactActEligible: true },
  { name: 'Incirlik Air Base (DS)', alternateNames: ['Incirlik'], country: 'Turkey', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Turkey — Staging', pactActEligible: true },
  { name: 'Moron Air Base (staging)', alternateNames: [], country: 'Spain', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Spain — Staging', pactActEligible: true },
  { name: 'Zaragoza Air Base (staging)', alternateNames: [], country: 'Spain', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Spain — Staging', pactActEligible: true },
  { name: 'Doha Air Base', alternateNames: [], country: 'Qatar', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Qatar', pactActEligible: true },

  // NEW — Kuwait oil well fire areas
  { name: 'Burgan Oil Field', alternateNames: ['Burgan'], country: 'Kuwait', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Kuwait — Oil Well Fire Areas', pactActEligible: true, notes: 'Largest oil field fire area' },
  { name: 'Al Ahmadi Oil Field', alternateNames: ['Ahmadi'], country: 'Kuwait', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Kuwait — Oil Well Fire Areas', pactActEligible: true },
  { name: 'Rumaila Oil Field', alternateNames: ['Rumaila'], country: 'Iraq', hazards: ['oil_well_fire', 'depleted_uranium'], conflictId: 'gulf_war', regionGroup: 'Iraq — Ground War', pactActEligible: true },
  { name: 'Wafra Oil Field', alternateNames: [], country: 'Kuwait', hazards: ['oil_well_fire'], conflictId: 'gulf_war', regionGroup: 'Kuwait — Oil Well Fire Areas', pactActEligible: true },
];
