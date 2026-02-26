import type { EnrichedLocation } from './types';

/** Korean War locations — expanded from 6 to 20+ */
export const KOREA_WAR_LOCATIONS: EnrichedLocation[] = [
  // Existing
  { name: 'Pusan Perimeter bases', alternateNames: ['Busan Perimeter', 'Pusan'], country: 'South Korea', region: 'Busan', coordinates: [35.18, 129.08], hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'Inchon', alternateNames: ['Incheon', 'Inchon Landing'], country: 'South Korea', region: 'Incheon', coordinates: [37.45, 126.70], hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'Seoul', alternateNames: ['Seoul Korea'], country: 'South Korea', region: 'Seoul', coordinates: [37.57, 126.98], hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'Chosin Reservoir area', alternateNames: ['Changjin Lake', 'Frozen Chosin'], country: 'North Korea', region: 'South Hamgyong', coordinates: [40.40, 127.25], hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'Heartbreak Ridge area', alternateNames: ['Heartbreak Ridge'], country: 'South Korea', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'Pork Chop Hill area', alternateNames: ['Pork Chop Hill'], country: 'South Korea', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },

  // NEW — expanded battle sites and bases
  { name: 'Osan', alternateNames: ['Task Force Smith', 'Battle of Osan'], country: 'South Korea', region: 'Gyeonggi', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true, notes: 'First US engagement of the war' },
  { name: 'Taejon', alternateNames: ['Daejeon', 'Battle of Taejon'], country: 'South Korea', region: 'Daejeon', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'Taegu', alternateNames: ['Daegu', 'Walker Line'], country: 'South Korea', region: 'North Gyeongsang', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'Wonsan', alternateNames: ['Battle of Wonsan'], country: 'North Korea', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'Hungnam', alternateNames: ['Hungnam evacuation'], country: 'North Korea', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'Kumhwa', alternateNames: ['Iron Triangle — Kumhwa'], country: 'South Korea', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'Chorwon', alternateNames: ['Iron Triangle — Chorwon'], country: 'South Korea', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'Pyonggang', alternateNames: ['Iron Triangle — Pyonggang'], country: 'North Korea', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'Old Baldy', alternateNames: ['Battle of Old Baldy'], country: 'South Korea', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'White Horse Hill', alternateNames: ['Battle of White Horse'], country: 'South Korea', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'Triangle Hill', alternateNames: ['Battle of Triangle Hill'], country: 'South Korea', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'Panmunjom', alternateNames: ['Truce Village'], country: 'South Korea', coordinates: [37.96, 126.68], hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'K-2 Taegu Air Base', alternateNames: ['K-2'], country: 'South Korea', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
  { name: 'K-14 Kimpo Air Base', alternateNames: ['K-14', 'Kimpo'], country: 'South Korea', hazards: [], conflictId: 'korea_war', regionGroup: 'Korean War (1950–1953)', pactActEligible: true },
];

/** Korea DMZ service locations — enriched from existing 25 */
export const KOREA_DMZ_LOCATIONS: EnrichedLocation[] = [
  { name: 'Camp Casey', alternateNames: ['Casey'], country: 'South Korea', region: 'Dongducheon', coordinates: [37.91, 127.06], hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Hovey', alternateNames: ['Hovey'], country: 'South Korea', region: 'Dongducheon', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Red Cloud', alternateNames: ['Red Cloud'], country: 'South Korea', region: 'Uijeongbu', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Howze', alternateNames: ['Howze'], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp St. Barbara', alternateNames: ['St. Barbara'], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Greaves', alternateNames: ['Greaves'], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Edwards', alternateNames: [], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Giant', alternateNames: [], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Humphreys', alternateNames: ['Humphreys'], country: 'South Korea', region: 'Pyeongtaek', coordinates: [36.96, 127.03], hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Stanley', alternateNames: ['Stanley'], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Castle', alternateNames: [], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Garry Owen', alternateNames: [], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Page', alternateNames: [], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp LaGuardia', alternateNames: [], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Long', alternateNames: [], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Market', alternateNames: [], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Henry', alternateNames: [], country: 'South Korea', region: 'Daegu', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Walker', alternateNames: ['Walker'], country: 'South Korea', region: 'Daegu', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Carroll', alternateNames: [], country: 'South Korea', region: 'North Gyeongsang', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp George', alternateNames: [], country: 'South Korea', region: 'Daegu', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Hialeah', alternateNames: [], country: 'South Korea', region: 'Busan', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Kunsan Air Base', alternateNames: ['Kunsan', 'Gunsan'], country: 'South Korea', region: 'North Jeolla', coordinates: [35.90, 126.62], hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Osan Air Base', alternateNames: ['Osan'], country: 'South Korea', region: 'Gyeonggi', coordinates: [37.09, 127.03], hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Yongsan Garrison', alternateNames: ['Yongsan', 'USAG Yongsan'], country: 'South Korea', region: 'Seoul', coordinates: [37.53, 126.97], hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'K-16 Seoul Air Base', alternateNames: ['K-16', 'Seoul AB'], country: 'South Korea', region: 'Seoul', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },

  // NEW — expanded
  { name: 'Camp Bonifas', alternateNames: ['JSA', 'Joint Security Area'], country: 'South Korea', coordinates: [37.96, 126.68], hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Pelham', alternateNames: [], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Essayons', alternateNames: [], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Nimble', alternateNames: [], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
  { name: 'Camp Stanton', alternateNames: [], country: 'South Korea', hazards: ['agent_orange'], conflictId: 'korea_dmz', regionGroup: 'DMZ Service (1967–1971)', pactActEligible: true },
];
