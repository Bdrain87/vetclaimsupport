// Military Awards and Decorations Database
// Used for autocomplete in combat zone and service history forms

export interface MilitaryAward {
  name: string;
  abbreviation: string;
  category: 'combat' | 'service' | 'unit' | 'campaign' | 'marksmanship' | 'foreign';
  branch?: 'Army' | 'Air Force' | 'Navy' | 'Marines' | 'Coast Guard' | 'All';
  description: string;
  combatRelated: boolean;
}

export const militaryAwards: MilitaryAward[] = [
  // ============ VALOR / COMBAT DECORATIONS ============
  { name: 'Medal of Honor', abbreviation: 'MOH', category: 'combat', branch: 'All', description: 'Highest US military decoration for valor', combatRelated: true },
  { name: 'Distinguished Service Cross', abbreviation: 'DSC', category: 'combat', branch: 'Army', description: 'Second highest Army valor award', combatRelated: true },
  { name: 'Navy Cross', abbreviation: 'NC', category: 'combat', branch: 'Navy', description: 'Second highest Navy/Marine valor award', combatRelated: true },
  { name: 'Air Force Cross', abbreviation: 'AFC', category: 'combat', branch: 'Air Force', description: 'Second highest Air Force valor award', combatRelated: true },
  { name: 'Silver Star', abbreviation: 'SS', category: 'combat', branch: 'All', description: 'Third highest combat valor decoration', combatRelated: true },
  { name: 'Bronze Star Medal', abbreviation: 'BSM', category: 'combat', branch: 'All', description: 'Heroic or meritorious service in combat zone', combatRelated: true },
  { name: 'Bronze Star Medal with Valor Device', abbreviation: 'BSM-V', category: 'combat', branch: 'All', description: 'Bronze Star for valor in combat', combatRelated: true },
  { name: 'Purple Heart', abbreviation: 'PH', category: 'combat', branch: 'All', description: 'Wounded or killed in combat', combatRelated: true },
  { name: 'Defense Distinguished Service Medal', abbreviation: 'DDSM', category: 'service', branch: 'All', description: 'Exceptional service to the Department of Defense', combatRelated: false },
  { name: 'Distinguished Service Medal (Army)', abbreviation: 'DSM', category: 'service', branch: 'Army', description: 'Exceptionally meritorious service in duty of great responsibility', combatRelated: false },
  { name: 'Distinguished Service Medal (Navy)', abbreviation: 'DSM', category: 'service', branch: 'Navy', description: 'Exceptionally meritorious service in duty of great responsibility', combatRelated: false },
  { name: 'Distinguished Service Medal (Air Force)', abbreviation: 'DSM', category: 'service', branch: 'Air Force', description: 'Exceptionally meritorious service in duty of great responsibility', combatRelated: false },
  { name: 'Legion of Merit', abbreviation: 'LM', category: 'service', branch: 'All', description: 'Exceptionally meritorious conduct in performance of outstanding services', combatRelated: false },
  { name: 'Distinguished Flying Cross', abbreviation: 'DFC', category: 'combat', branch: 'All', description: 'Heroism or extraordinary achievement in aerial flight', combatRelated: true },
  { name: 'Airman\'s Medal', abbreviation: 'AM', category: 'service', branch: 'Air Force', description: 'Heroism not involving actual conflict with an enemy', combatRelated: false },
  { name: 'Soldier\'s Medal', abbreviation: 'SM', category: 'service', branch: 'Army', description: 'Heroism not involving actual conflict with an enemy', combatRelated: false },
  { name: 'Navy and Marine Corps Medal', abbreviation: 'N&MCM', category: 'service', branch: 'Navy', description: 'Heroism not involving actual conflict with an enemy', combatRelated: false },
  { name: 'Air Medal', abbreviation: 'AM', category: 'combat', branch: 'All', description: 'Meritorious achievement while participating in aerial flight', combatRelated: true },
  { name: 'Joint Service Commendation Medal', abbreviation: 'JSCM', category: 'service', branch: 'All', description: 'Meritorious service or achievement in joint duty', combatRelated: false },
  { name: 'Army Commendation Medal', abbreviation: 'ARCOM', category: 'service', branch: 'Army', description: 'Meritorious service, achievement, or heroism', combatRelated: false },
  { name: 'Navy Commendation Medal', abbreviation: 'NCM', category: 'service', branch: 'Navy', description: 'Meritorious service, achievement, or heroism', combatRelated: false },
  { name: 'Air Force Commendation Medal', abbreviation: 'AFCM', category: 'service', branch: 'Air Force', description: 'Meritorious service, achievement, or heroism', combatRelated: false },
  { name: 'Joint Service Achievement Medal', abbreviation: 'JSAM', category: 'service', branch: 'All', description: 'Meritorious service or achievement in joint duty', combatRelated: false },
  { name: 'Army Achievement Medal', abbreviation: 'AAM', category: 'service', branch: 'Army', description: 'Meritorious service or achievement', combatRelated: false },
  { name: 'Navy Achievement Medal', abbreviation: 'NAM', category: 'service', branch: 'Navy', description: 'Meritorious service or achievement', combatRelated: false },
  { name: 'Air Force Achievement Medal', abbreviation: 'AFAM', category: 'service', branch: 'Air Force', description: 'Meritorious service or achievement', combatRelated: false },

  // ============ COMBAT BADGES / SPECIALTY ============
  { name: 'Combat Infantryman Badge', abbreviation: 'CIB', category: 'combat', branch: 'Army', description: 'Infantry soldiers who have engaged in active ground combat', combatRelated: true },
  { name: 'Combat Action Badge', abbreviation: 'CAB', category: 'combat', branch: 'Army', description: 'Non-infantry soldiers engaged in active ground combat', combatRelated: true },
  { name: 'Combat Medical Badge', abbreviation: 'CMB', category: 'combat', branch: 'Army', description: 'Medical personnel who have engaged in ground combat', combatRelated: true },
  { name: 'Combat Action Ribbon', abbreviation: 'CAR', category: 'combat', branch: 'Navy', description: 'Active participation in ground or surface combat', combatRelated: true },
  { name: 'Air Force Combat Action Medal', abbreviation: 'AFCAM', category: 'combat', branch: 'Air Force', description: 'Active participation in combat', combatRelated: true },
  { name: 'Fleet Marine Force Combat Operation Insignia', abbreviation: 'FMF', category: 'combat', branch: 'Navy', description: 'Navy personnel serving with Marine ground combat units', combatRelated: true },

  // ============ SERVICE MEDALS ============
  { name: 'Good Conduct Medal (Army)', abbreviation: 'AGCM', category: 'service', branch: 'Army', description: '3 years exemplary conduct', combatRelated: false },
  { name: 'Good Conduct Medal (Navy)', abbreviation: 'NGCM', category: 'service', branch: 'Navy', description: '4 years exemplary conduct', combatRelated: false },
  { name: 'Good Conduct Medal (Air Force)', abbreviation: 'AFGCM', category: 'service', branch: 'Air Force', description: '3 years exemplary conduct', combatRelated: false },
  { name: 'Good Conduct Medal (Marines)', abbreviation: 'MCGCM', category: 'service', branch: 'Marines', description: '3 years exemplary conduct', combatRelated: false },
  { name: 'National Defense Service Medal', abbreviation: 'NDSM', category: 'service', branch: 'All', description: 'Service during designated national emergency periods', combatRelated: false },
  { name: 'Armed Forces Expeditionary Medal', abbreviation: 'AFEM', category: 'campaign', branch: 'All', description: 'Participation in military operations outside US', combatRelated: true },
  { name: 'Armed Forces Service Medal', abbreviation: 'AFSM', category: 'service', branch: 'All', description: 'Significant activity for which no other service medal is authorized', combatRelated: false },
  { name: 'Humanitarian Service Medal', abbreviation: 'HSM', category: 'service', branch: 'All', description: 'Meritorious participation in humanitarian actions', combatRelated: false },
  { name: 'Military Outstanding Volunteer Service Medal', abbreviation: 'MOVSM', category: 'service', branch: 'All', description: 'Substantial volunteer community service', combatRelated: false },
  { name: 'Armed Forces Reserve Medal', abbreviation: 'AFRM', category: 'service', branch: 'All', description: '10 years honorable Reserve/Guard service', combatRelated: false },
  { name: 'Army Reserve Components Achievement Medal', abbreviation: 'ARCAM', category: 'service', branch: 'Army', description: 'Outstanding performance while serving in Army Reserve', combatRelated: false },
  { name: 'Naval Reserve Meritorious Service Medal', abbreviation: 'NRMSM', category: 'service', branch: 'Navy', description: 'Meritorious service in Naval Reserve', combatRelated: false },
  { name: 'Air Reserve Forces Meritorious Service Medal', abbreviation: 'ARFMSM', category: 'service', branch: 'Air Force', description: 'Outstanding service in Air Force Reserve', combatRelated: false },
  { name: 'NCO Professional Development Ribbon', abbreviation: 'NCOPDR', category: 'service', branch: 'Army', description: 'Completion of NCO education system courses', combatRelated: false },
  { name: 'Army Service Ribbon', abbreviation: 'ASR', category: 'service', branch: 'Army', description: 'Completion of initial entry training', combatRelated: false },
  { name: 'Air Force Training Ribbon', abbreviation: 'AFTR', category: 'service', branch: 'Air Force', description: 'Completion of initial military training', combatRelated: false },
  { name: 'Navy Recruiting Service Ribbon', abbreviation: 'NRSR', category: 'service', branch: 'Navy', description: 'Successful tour as Navy recruiter', combatRelated: false },
  { name: 'Overseas Service Ribbon (Army)', abbreviation: 'OSR', category: 'service', branch: 'Army', description: 'Permanent change of station to overseas command', combatRelated: false },
  { name: 'Sea Service Deployment Ribbon', abbreviation: 'SSDR', category: 'service', branch: 'Navy', description: '12 months cumulative sea duty', combatRelated: false },
  { name: 'Air Force Overseas Short Tour Service Ribbon', abbreviation: 'AFOSTS', category: 'service', branch: 'Air Force', description: 'Completion of overseas short tour', combatRelated: false },
  { name: 'Air Force Overseas Long Tour Service Ribbon', abbreviation: 'AFOLTS', category: 'service', branch: 'Air Force', description: 'Completion of overseas long tour', combatRelated: false },

  // ============ CAMPAIGN MEDALS ============
  { name: 'Afghanistan Campaign Medal', abbreviation: 'ACM', category: 'campaign', branch: 'All', description: 'Service in Afghanistan operations', combatRelated: true },
  { name: 'Iraq Campaign Medal', abbreviation: 'ICM', category: 'campaign', branch: 'All', description: 'Service in Iraq operations', combatRelated: true },
  { name: 'Global War on Terrorism Expeditionary Medal', abbreviation: 'GWOTEM', category: 'campaign', branch: 'All', description: 'Deployment in support of GWOT', combatRelated: true },
  { name: 'Global War on Terrorism Service Medal', abbreviation: 'GWOTSM', category: 'campaign', branch: 'All', description: 'Service in operations supporting GWOT', combatRelated: false },
  { name: 'Korean Defense Service Medal', abbreviation: 'KDSM', category: 'campaign', branch: 'All', description: 'Service in Korea after July 28, 1954', combatRelated: false },
  { name: 'Southwest Asia Service Medal', abbreviation: 'SWASM', category: 'campaign', branch: 'All', description: 'Service during Operations Desert Shield/Storm', combatRelated: true },
  { name: 'Kosovo Campaign Medal', abbreviation: 'KCM', category: 'campaign', branch: 'All', description: 'Service in Kosovo operations', combatRelated: true },
  { name: 'Inherent Resolve Campaign Medal', abbreviation: 'IRCM', category: 'campaign', branch: 'All', description: 'Service in Operation Inherent Resolve', combatRelated: true },
  { name: 'Inherent Resolve Campaign Medal (Syria)', abbreviation: 'IRCM', category: 'campaign', branch: 'All', description: 'Service in Operation Inherent Resolve - Syria', combatRelated: true },

  // ============ UNIT AWARDS ============
  { name: 'Presidential Unit Citation (Army)', abbreviation: 'PUC', category: 'unit', branch: 'Army', description: 'Unit award for extraordinary heroism in action', combatRelated: true },
  { name: 'Presidential Unit Citation (Navy)', abbreviation: 'PUC', category: 'unit', branch: 'Navy', description: 'Unit award for extraordinary heroism in action', combatRelated: true },
  { name: 'Presidential Unit Citation (Air Force)', abbreviation: 'PUC', category: 'unit', branch: 'Air Force', description: 'Outstanding Unit Award for Valor', combatRelated: true },
  { name: 'Joint Meritorious Unit Award', abbreviation: 'JMUA', category: 'unit', branch: 'All', description: 'Joint unit meritorious service', combatRelated: false },
  { name: 'Valorous Unit Award', abbreviation: 'VUA', category: 'unit', branch: 'Army', description: 'Unit citation for extraordinary heroism', combatRelated: true },
  { name: 'Meritorious Unit Commendation (Army)', abbreviation: 'MUC', category: 'unit', branch: 'Army', description: 'Unit meritorious service in combat or noncombat', combatRelated: false },
  { name: 'Navy Unit Commendation', abbreviation: 'NUC', category: 'unit', branch: 'Navy', description: 'Unit meritorious service', combatRelated: false },
  { name: 'Air Force Outstanding Unit Award', abbreviation: 'AFOUA', category: 'unit', branch: 'Air Force', description: 'Outstanding unit performance', combatRelated: false },
  { name: 'Navy Meritorious Unit Commendation', abbreviation: 'NMUC', category: 'unit', branch: 'Navy', description: 'Unit valorous or meritorious achievement', combatRelated: false },
  { name: 'Air Force Organizational Excellence Award', abbreviation: 'AFOEA', category: 'unit', branch: 'Air Force', description: 'Outstanding service by unique units', combatRelated: false },

  // ============ MARKSMANSHIP ============
  { name: 'Army Marksmanship Qualification Badge - Expert', abbreviation: 'Expert', category: 'marksmanship', branch: 'Army', description: 'Expert marksmanship with assigned weapon', combatRelated: false },
  { name: 'Army Marksmanship Qualification Badge - Sharpshooter', abbreviation: 'Sharpshooter', category: 'marksmanship', branch: 'Army', description: 'Sharpshooter marksmanship with assigned weapon', combatRelated: false },
  { name: 'Army Marksmanship Qualification Badge - Marksman', abbreviation: 'Marksman', category: 'marksmanship', branch: 'Army', description: 'Marksman qualification with assigned weapon', combatRelated: false },
  { name: 'Rifle Expert Badge', abbreviation: 'Rifle Expert', category: 'marksmanship', branch: 'Marines', description: 'Expert rifle qualification', combatRelated: false },
  { name: 'Rifle Sharpshooter Badge', abbreviation: 'Rifle SS', category: 'marksmanship', branch: 'Marines', description: 'Sharpshooter rifle qualification', combatRelated: false },
  { name: 'Rifle Marksman Badge', abbreviation: 'Rifle MM', category: 'marksmanship', branch: 'Marines', description: 'Marksman rifle qualification', combatRelated: false },
  { name: 'Pistol Expert Badge', abbreviation: 'Pistol Expert', category: 'marksmanship', branch: 'Marines', description: 'Expert pistol qualification', combatRelated: false },
  { name: 'Navy Expert Pistol Shot Medal', abbreviation: 'EPS', category: 'marksmanship', branch: 'Navy', description: 'Expert pistol qualification', combatRelated: false },
  { name: 'Navy Expert Rifleman Medal', abbreviation: 'ERM', category: 'marksmanship', branch: 'Navy', description: 'Expert rifle qualification', combatRelated: false },
  { name: 'Air Force Small Arms Expert Marksmanship Ribbon', abbreviation: 'SAEMR', category: 'marksmanship', branch: 'Air Force', description: 'Expert marksmanship with small arms', combatRelated: false },

  // ============ SKILL BADGES (Non-Marksmanship) ============
  { name: 'Parachutist Badge', abbreviation: 'Airborne', category: 'service', branch: 'All', description: 'Completion of airborne training', combatRelated: false },
  { name: 'Senior Parachutist Badge', abbreviation: 'Sr Airborne', category: 'service', branch: 'All', description: 'Senior level airborne qualification', combatRelated: false },
  { name: 'Master Parachutist Badge', abbreviation: 'Master Airborne', category: 'service', branch: 'All', description: 'Master level airborne qualification', combatRelated: false },
  { name: 'Air Assault Badge', abbreviation: 'Air Assault', category: 'service', branch: 'Army', description: 'Completion of Air Assault School', combatRelated: false },
  { name: 'Ranger Tab', abbreviation: 'Ranger', category: 'service', branch: 'Army', description: 'Completion of US Army Ranger School', combatRelated: false },
  { name: 'Special Forces Tab', abbreviation: 'SF', category: 'service', branch: 'Army', description: 'Qualified Special Forces soldier', combatRelated: false },
  { name: 'Sapper Tab', abbreviation: 'Sapper', category: 'service', branch: 'Army', description: 'Completion of Sapper Leader Course', combatRelated: false },
  { name: 'Pathfinder Badge', abbreviation: 'Pathfinder', category: 'service', branch: 'Army', description: 'Completion of Pathfinder School', combatRelated: false },
  { name: 'Diver Badge', abbreviation: 'Diver', category: 'service', branch: 'All', description: 'Military dive qualification', combatRelated: false },
  { name: 'Expert Field Medical Badge', abbreviation: 'EFMB', category: 'service', branch: 'Army', description: 'Expert level field medical proficiency', combatRelated: false },
  { name: 'Expert Infantryman Badge', abbreviation: 'EIB', category: 'service', branch: 'Army', description: 'Expert infantry skills proficiency', combatRelated: false },
  { name: 'Expert Soldier Badge', abbreviation: 'ESB', category: 'service', branch: 'Army', description: 'Expert soldier skills proficiency', combatRelated: false },
  { name: 'Explosive Ordnance Disposal Badge', abbreviation: 'EOD', category: 'service', branch: 'All', description: 'EOD qualification', combatRelated: false },
  { name: 'Flight Surgeon Badge', abbreviation: 'FS', category: 'service', branch: 'All', description: 'Qualified flight surgeon', combatRelated: false },
  { name: 'Army Aviator Badge', abbreviation: 'Aviator', category: 'service', branch: 'Army', description: 'Qualified Army aviator', combatRelated: false },
  { name: 'Army Parachute Rigger Badge', abbreviation: 'Rigger', category: 'service', branch: 'Army', description: 'Qualified parachute rigger', combatRelated: false },
  { name: 'SEAL Trident', abbreviation: 'SEAL', category: 'service', branch: 'Navy', description: 'Navy SEAL qualification', combatRelated: false },
  { name: 'Fleet Marine Force Warfare Specialist', abbreviation: 'FMF', category: 'service', branch: 'Navy', description: 'Navy personnel trained in Marine Corps operations', combatRelated: false },
  { name: 'Surface Warfare Officer', abbreviation: 'SWO', category: 'service', branch: 'Navy', description: 'Surface Warfare Officer qualification', combatRelated: false },
  { name: 'Submarine Warfare Insignia', abbreviation: 'Dolphins', category: 'service', branch: 'Navy', description: 'Qualified submarine service', combatRelated: false },
  { name: 'Enlisted Aviation Warfare Specialist', abbreviation: 'EAWS', category: 'service', branch: 'Navy', description: 'Enlisted aviation warfare qualification', combatRelated: false },
  { name: 'Basic Military Freefall', abbreviation: 'HALO', category: 'service', branch: 'All', description: 'Military freefall parachutist', combatRelated: false },
];

export function searchAwards(query: string): MilitaryAward[] {
  if (!query.trim()) return militaryAwards.slice(0, 20);

  const lowerQuery = query.toLowerCase();
  return militaryAwards.filter(award =>
    award.name.toLowerCase().includes(lowerQuery) ||
    award.abbreviation.toLowerCase().includes(lowerQuery) ||
    award.description.toLowerCase().includes(lowerQuery)
  ).slice(0, 20);
}

export function getCombatRelatedAwards(): MilitaryAward[] {
  return militaryAwards.filter(a => a.combatRelated);
}

export function formatAwardDisplay(award: MilitaryAward): string {
  return `${award.name} (${award.abbreviation})`;
}
