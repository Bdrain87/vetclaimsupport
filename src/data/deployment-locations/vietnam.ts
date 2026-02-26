import type { EnrichedLocation } from './types';

/** Vietnam War deployment locations — expanded from 61 to 100+ */
export const VIETNAM_LOCATIONS: EnrichedLocation[] = [
  // USAF Air Bases (existing)
  { name: 'Tan Son Nhut', alternateNames: ['TSN', 'Saigon Air Base'], country: 'Vietnam', region: 'Saigon', coordinates: [10.82, 106.66], hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'USAF Air Bases', pactActEligible: true },
  { name: 'Da Nang', alternateNames: ['Da Nang Air Base'], country: 'Vietnam', region: 'I Corps', coordinates: [16.04, 108.20], hazards: ['agent_orange', 'high_dioxin'], conflictId: 'vietnam', regionGroup: 'USAF Air Bases', pactActEligible: true },
  { name: 'Bien Hoa', alternateNames: ['Bien Hoa Air Base'], country: 'Vietnam', region: 'III Corps', coordinates: [10.97, 106.82], hazards: ['agent_orange', 'high_dioxin'], conflictId: 'vietnam', regionGroup: 'USAF Air Bases', pactActEligible: true },
  { name: 'Cam Ranh Bay', alternateNames: ['CRB', 'Cam Ranh'], country: 'Vietnam', region: 'II Corps', coordinates: [11.99, 109.22], hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'USAF Air Bases', pactActEligible: true },
  { name: 'Phu Bai', alternateNames: ['Phu Bai Combat Base'], country: 'Vietnam', region: 'I Corps', coordinates: [16.40, 107.70], hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'USAF Air Bases', pactActEligible: true },
  { name: 'Phan Rang', alternateNames: ['Phan Rang Air Base'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'USAF Air Bases', pactActEligible: true },
  { name: 'Tuy Hoa', alternateNames: ['Tuy Hoa Air Base'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'USAF Air Bases', pactActEligible: true },
  { name: 'Nha Trang', alternateNames: ['Nha Trang Air Base'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'USAF Air Bases', pactActEligible: true },
  { name: 'Phu Cat', alternateNames: ['Phu Cat Air Base'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange', 'high_dioxin'], conflictId: 'vietnam', regionGroup: 'USAF Air Bases', pactActEligible: true },
  { name: 'Marble Mountain Air Facility', alternateNames: ['Marble Mountain', 'MMAF'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'USAF Air Bases', pactActEligible: true },
  { name: 'Vung Tau Air Base', alternateNames: ['Vung Tau'], country: 'Vietnam', region: 'III Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'USAF Air Bases', pactActEligible: true },
  { name: 'Ban Me Thuot East Airfield', alternateNames: ['Ban Me Thuot', 'Buon Ma Thuot'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'USAF Air Bases', pactActEligible: true },

  // Army Bases (existing)
  { name: 'Cu Chi', alternateNames: ['Cu Chi Base Camp', '25th Infantry Division'], country: 'Vietnam', region: 'III Corps', coordinates: [11.00, 106.51], hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Long Binh', alternateNames: ['Long Binh Post', 'LBJ'], country: 'Vietnam', region: 'III Corps', coordinates: [10.95, 106.83], hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Chu Lai', alternateNames: ['Chu Lai Base'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Pleiku', alternateNames: ['Camp Holloway/Pleiku'], country: 'Vietnam', region: 'II Corps', coordinates: [13.98, 108.00], hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'An Khe', alternateNames: ['Camp Radcliff', 'Golf Course'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Qui Nhon', alternateNames: ['Qui Nhon Port'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Dak To', alternateNames: ['Dak To Special Forces Camp'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Lai Khe', alternateNames: ['Lai Khe Base Camp', '1st Infantry Division'], country: 'Vietnam', region: 'III Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Camp Enari', alternateNames: ['Dragon Mountain', '4th Infantry Division'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Camp Holloway', alternateNames: ['Holloway'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Camp Evans', alternateNames: ['Evans'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Camp Eagle', alternateNames: ['101st Airborne Base'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Camp Carroll', alternateNames: ['Carroll'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Camp Reasoner', alternateNames: [], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Camp Atterbury', alternateNames: [], country: 'Vietnam', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Firebase Bastogne', alternateNames: ['FSB Bastogne'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'LZ Sally', alternateNames: ['Landing Zone Sally'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'LZ English', alternateNames: ['Landing Zone English'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'LZ Baldy', alternateNames: ['Landing Zone Baldy'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Phu Loi', alternateNames: ['Phu Loi Base Camp'], country: 'Vietnam', region: 'III Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Dong Ba Thin', alternateNames: [], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Dong Tam', alternateNames: ['9th Infantry Division'], country: 'Vietnam', region: 'IV Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Bear Cat', alternateNames: ['Bearcat', 'Long Thanh'], country: 'Vietnam', region: 'III Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Tay Ninh', alternateNames: ['Tay Ninh Base Camp', '25th Infantry'], country: 'Vietnam', region: 'III Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Dau Tieng', alternateNames: ['Dau Tieng Base Camp'], country: 'Vietnam', region: 'III Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Ben Het', alternateNames: ['Ben Het Special Forces Camp'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Kontum', alternateNames: ['Kontum Province'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Duc Pho', alternateNames: ['LZ Bronco'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Landing Zone Dot', alternateNames: ['LZ Dot'], country: 'Vietnam', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },
  { name: 'Landing Zone Margo', alternateNames: ['LZ Margo'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Army Bases', pactActEligible: true },

  // Marine Bases (existing)
  { name: 'Da Nang Marine HQ', alternateNames: ['III MAF'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Marine Bases', pactActEligible: true },
  { name: 'Marble Mountain', alternateNames: [], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Marine Bases', pactActEligible: true },
  { name: 'Chu Lai Marine', alternateNames: [], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Marine Bases', pactActEligible: true },
  { name: 'Camp Hague', alternateNames: [], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Marine Bases', pactActEligible: true },
  { name: 'Camp Haskins', alternateNames: [], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Marine Bases', pactActEligible: true },
  { name: 'Camp Reasoner', alternateNames: [], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Marine Bases', pactActEligible: true },
  { name: 'Camp Pendleton Vietnam', alternateNames: [], country: 'Vietnam', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Marine Bases', pactActEligible: true },
  { name: 'Red Beach', alternateNames: [], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Marine Bases', pactActEligible: true },

  // Navy (existing)
  { name: 'Naval Support Activity Da Nang', alternateNames: ['NSA Da Nang'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Navy', pactActEligible: true },
  { name: 'Naval Support Activity Saigon', alternateNames: ['NSA Saigon'], country: 'Vietnam', region: 'Saigon', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Navy', pactActEligible: true },
  { name: 'An Thoi Naval Base', alternateNames: [], country: 'Vietnam', region: 'IV Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Navy', pactActEligible: true },
  { name: 'Cat Lo Naval Base', alternateNames: [], country: 'Vietnam', region: 'III Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Navy', pactActEligible: true },
  { name: 'Nam Can Naval Base', alternateNames: [], country: 'Vietnam', region: 'IV Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Navy', pactActEligible: true },
  { name: 'Nha Be Base', alternateNames: [], country: 'Vietnam', region: 'III Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Navy', pactActEligible: true },
  { name: 'Sa Dec Base', alternateNames: [], country: 'Vietnam', region: 'IV Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Navy', pactActEligible: true },
  { name: 'Cam Ranh Bay Naval', alternateNames: [], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Navy', pactActEligible: true },
  { name: 'Cua Viet Naval', alternateNames: [], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Navy', pactActEligible: true },
  { name: 'Brown Water Navy', alternateNames: ['River Patrol', 'PBR', 'Mobile Riverine Force'], country: 'Vietnam', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Navy', pactActEligible: true },
  { name: 'Blue Water Navy', alternateNames: ['Offshore Navy', 'USS Vietnam'], country: 'Vietnam', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Navy', pactActEligible: true },

  // NEW — Fire Support Bases (expanded)
  { name: 'Firebase Ripcord', alternateNames: ['FSB Ripcord'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Fire Support Bases', pactActEligible: true, notes: 'Major battle July 1970' },
  { name: 'Firebase Tomahawk', alternateNames: ['FSB Tomahawk'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Fire Support Bases', pactActEligible: true },
  { name: 'Firebase Birmingham', alternateNames: ['FSB Birmingham'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Fire Support Bases', pactActEligible: true },
  { name: 'Firebase Henderson', alternateNames: ['FSB Henderson'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Fire Support Bases', pactActEligible: true },
  { name: 'Firebase Kathryn', alternateNames: ['FSB Kathryn'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Fire Support Bases', pactActEligible: true },
  { name: 'Firebase Mary Ann', alternateNames: ['FSB Mary Ann'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Fire Support Bases', pactActEligible: true },
  { name: 'Firebase Pace', alternateNames: ['FSB Pace'], country: 'Vietnam', region: 'III Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Fire Support Bases', pactActEligible: true },

  // NEW — Landing Zones (expanded)
  { name: 'LZ X-Ray', alternateNames: ['Landing Zone X-Ray', 'Ia Drang'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Landing Zones', pactActEligible: true, notes: 'Battle of Ia Drang, Nov 1965' },
  { name: 'LZ Albany', alternateNames: ['Landing Zone Albany'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Landing Zones', pactActEligible: true },
  { name: 'LZ Stud', alternateNames: ['Vandegrift Combat Base'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Landing Zones', pactActEligible: true },
  { name: 'LZ Betty', alternateNames: ['Landing Zone Betty'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Landing Zones', pactActEligible: true },
  { name: 'LZ Uplift', alternateNames: ['Landing Zone Uplift'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Landing Zones', pactActEligible: true },

  // NEW — Mekong Delta bases (expanded)
  { name: 'Can Tho', alternateNames: ['Can Tho Army Airfield', 'Binh Thuy'], country: 'Vietnam', region: 'IV Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Mekong Delta', pactActEligible: true },
  { name: 'Soc Trang', alternateNames: ['Soc Trang Army Airfield'], country: 'Vietnam', region: 'IV Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Mekong Delta', pactActEligible: true },
  { name: 'Vinh Long', alternateNames: ['Vinh Long Army Airfield'], country: 'Vietnam', region: 'IV Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Mekong Delta', pactActEligible: true },
  { name: 'My Tho', alternateNames: [], country: 'Vietnam', region: 'IV Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Mekong Delta', pactActEligible: true },
  { name: 'Ben Tre', alternateNames: [], country: 'Vietnam', region: 'IV Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Mekong Delta', pactActEligible: true },

  // NEW — Key battle sites (expanded)
  { name: 'Khe Sanh Combat Base', alternateNames: ['Khe Sanh', 'KSCB'], country: 'Vietnam', region: 'I Corps', coordinates: [16.63, 106.73], hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Battle Sites', pactActEligible: true, notes: 'Siege of Khe Sanh, Jan–Jul 1968' },
  { name: 'Con Thien', alternateNames: ['Con Thien Fire Support Base'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Battle Sites', pactActEligible: true },
  { name: 'Hue City', alternateNames: ['Hue', 'Battle of Hue'], country: 'Vietnam', region: 'I Corps', coordinates: [16.46, 107.60], hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Battle Sites', pactActEligible: true, notes: 'Tet Offensive 1968' },
  { name: 'A Shau Valley', alternateNames: ['A Shau', 'Hamburger Hill area'], country: 'Vietnam', region: 'I Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Battle Sites', pactActEligible: true },
  { name: 'Ia Drang Valley', alternateNames: ['Ia Drang'], country: 'Vietnam', region: 'II Corps', hazards: ['agent_orange'], conflictId: 'vietnam', regionGroup: 'Battle Sites', pactActEligible: true },
];
