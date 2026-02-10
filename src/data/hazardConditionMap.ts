/**
 * Maps military hazard categories to VA-ratable conditions.
 * Used by ClaimIntelligence.getJobCodeConditions() to suggest conditions
 * based on a veteran's military job code and its associated hazards.
 * Works for ALL branches: Army MOS, Marine MOS, Air Force AFSC,
 * Space Force AFSC, Navy Rating/NEC, Coast Guard Rating, and officer designators.
 */

export interface HazardCondition {
  conditionName: string;
  diagnosticCode: string;
  category: string;
  prevalence: 'very_common' | 'common' | 'moderate' | 'less_common';
  description: string;
}

export interface HazardCategory {
  name: string;
  description: string;
  conditions: HazardCondition[];
}

export const hazardConditionMap: Record<string, HazardCategory> = {
  noise_exposure: {
    name: 'Noise Exposure',
    description: 'Prolonged exposure to loud environments: weapons fire, engines, aircraft, heavy machinery',
    conditions: [
      { conditionName: 'Tinnitus', diagnosticCode: '6260', category: 'Ear', prevalence: 'very_common', description: 'Ringing or buzzing in the ears' },
      { conditionName: 'Bilateral Hearing Loss', diagnosticCode: '6100', category: 'Ear', prevalence: 'very_common', description: 'Decreased ability to hear in both ears' },
    ],
  },

  heavy_physical_load: {
    name: 'Heavy Physical Load',
    description: 'Carrying heavy gear, ruck marches, repetitive lifting, prolonged standing',
    conditions: [
      { conditionName: 'Lumbosacral Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'very_common', description: 'Lower back pain and strain' },
      { conditionName: 'Cervical Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'common', description: 'Neck pain and strain' },
      { conditionName: 'Knee Strain (Bilateral)', diagnosticCode: '5260', category: 'Musculoskeletal', prevalence: 'very_common', description: 'Knee pain and limited range of motion' },
      { conditionName: 'Plantar Fasciitis', diagnosticCode: '5276', category: 'Musculoskeletal', prevalence: 'common', description: 'Heel and foot pain' },
      { conditionName: 'Shoulder Strain', diagnosticCode: '5201', category: 'Musculoskeletal', prevalence: 'common', description: 'Shoulder pain and limited range of motion' },
      { conditionName: 'Ankle Strain', diagnosticCode: '5271', category: 'Musculoskeletal', prevalence: 'common', description: 'Ankle pain and instability' },
      { conditionName: 'Hip Strain', diagnosticCode: '5252', category: 'Musculoskeletal', prevalence: 'moderate', description: 'Hip pain and limited range of motion' },
      { conditionName: 'Degenerative Disc Disease', diagnosticCode: '5243', category: 'Musculoskeletal', prevalence: 'moderate', description: 'Disc deterioration in the spine' },
    ],
  },

  blast_concussive: {
    name: 'Blast / Concussive Events',
    description: 'IED blasts, mortar fire, breaching operations, artillery exposure',
    conditions: [
      { conditionName: 'Traumatic Brain Injury (TBI)', diagnosticCode: '8045', category: 'Neurological', prevalence: 'common', description: 'Brain injury from blast or impact' },
      { conditionName: 'Post-Traumatic Headaches', diagnosticCode: '8100', category: 'Neurological', prevalence: 'common', description: 'Chronic headaches following TBI or blast exposure' },
      { conditionName: 'Tinnitus', diagnosticCode: '6260', category: 'Ear', prevalence: 'very_common', description: 'Ringing or buzzing in the ears' },
      { conditionName: 'Bilateral Hearing Loss', diagnosticCode: '6100', category: 'Ear', prevalence: 'common', description: 'Decreased ability to hear in both ears' },
    ],
  },

  combat_trauma: {
    name: 'Combat / Operational Trauma',
    description: 'Direct combat, witnessing casualties, hostile fire, prisoner handling, grave registration',
    conditions: [
      { conditionName: 'PTSD', diagnosticCode: '9411', category: 'Mental Health', prevalence: 'very_common', description: 'Post-traumatic stress disorder from combat or operational trauma' },
      { conditionName: 'Major Depressive Disorder', diagnosticCode: '9434', category: 'Mental Health', prevalence: 'common', description: 'Persistent depressive episodes' },
      { conditionName: 'Generalized Anxiety Disorder', diagnosticCode: '9400', category: 'Mental Health', prevalence: 'common', description: 'Chronic excessive anxiety and worry' },
      { conditionName: 'Insomnia', diagnosticCode: '6847', category: 'Sleep', prevalence: 'common', description: 'Difficulty falling or staying asleep' },
    ],
  },

  chemical_exposure: {
    name: 'Chemical / Toxic Exposure',
    description: 'Burn pits, Agent Orange, contaminated water (Camp Lejeune), JP-8 fuel, solvents, pesticides',
    conditions: [
      { conditionName: 'Sinusitis (Chronic)', diagnosticCode: '6513', category: 'Respiratory', prevalence: 'common', description: 'Chronic sinus inflammation' },
      { conditionName: 'Rhinitis (Allergic)', diagnosticCode: '6522', category: 'Respiratory', prevalence: 'common', description: 'Chronic nasal inflammation' },
      { conditionName: 'Asthma', diagnosticCode: '6602', category: 'Respiratory', prevalence: 'moderate', description: 'Chronic inflammatory airway disease' },
      { conditionName: 'Skin Conditions (Dermatitis)', diagnosticCode: '7806', category: 'Skin', prevalence: 'moderate', description: 'Chronic skin irritation or rashes' },
      { conditionName: 'Migraines', diagnosticCode: '8100', category: 'Neurological', prevalence: 'moderate', description: 'Chronic severe headaches' },
    ],
  },

  extreme_temperatures: {
    name: 'Extreme Temperature Exposure',
    description: 'Desert heat, arctic cold, engine rooms, flight line operations',
    conditions: [
      { conditionName: 'Skin Conditions (Dermatitis)', diagnosticCode: '7806', category: 'Skin', prevalence: 'moderate', description: 'Chronic skin irritation from temperature extremes' },
      { conditionName: 'Raynaud\'s Syndrome', diagnosticCode: '7117', category: 'Vascular', prevalence: 'less_common', description: 'Reduced blood flow to extremities in cold' },
      { conditionName: 'Heat Injury Residuals', diagnosticCode: '7913', category: 'Systemic', prevalence: 'less_common', description: 'Long-term effects of heat stroke or heat exhaustion' },
    ],
  },

  prolonged_standing_marching: {
    name: 'Prolonged Standing / Marching',
    description: 'Guard duty, formations, ruck marches, foot patrols',
    conditions: [
      { conditionName: 'Plantar Fasciitis', diagnosticCode: '5276', category: 'Musculoskeletal', prevalence: 'very_common', description: 'Heel and foot pain' },
      { conditionName: 'Flat Feet (Pes Planus)', diagnosticCode: '5276', category: 'Musculoskeletal', prevalence: 'common', description: 'Fallen arches causing foot pain' },
      { conditionName: 'Knee Strain (Bilateral)', diagnosticCode: '5260', category: 'Musculoskeletal', prevalence: 'very_common', description: 'Knee pain and limited range of motion' },
      { conditionName: 'Varicose Veins', diagnosticCode: '7120', category: 'Vascular', prevalence: 'less_common', description: 'Enlarged veins typically in the legs' },
    ],
  },

  repetitive_motion: {
    name: 'Repetitive Motion / Vibration',
    description: 'Typing, vehicle operation, aircraft vibration, tool use, weapons handling',
    conditions: [
      { conditionName: 'Carpal Tunnel Syndrome', diagnosticCode: '8515', category: 'Neurological', prevalence: 'moderate', description: 'Nerve compression in the wrist' },
      { conditionName: 'Tendonitis', diagnosticCode: '5024', category: 'Musculoskeletal', prevalence: 'common', description: 'Inflammation of tendons' },
      { conditionName: 'Thoracic Outlet Syndrome', diagnosticCode: '8510', category: 'Neurological', prevalence: 'less_common', description: 'Nerve compression in neck/shoulder area' },
    ],
  },

  sleep_disruption: {
    name: 'Chronic Sleep Disruption',
    description: 'Shift work, 24-hour operations, combat alerts, irregular schedules, submarine/ship duty',
    conditions: [
      { conditionName: 'Insomnia', diagnosticCode: '6847', category: 'Sleep', prevalence: 'very_common', description: 'Difficulty falling or staying asleep' },
      { conditionName: 'Sleep Apnea', diagnosticCode: '6847', category: 'Sleep', prevalence: 'common', description: 'Breathing interruptions during sleep' },
      { conditionName: 'Major Depressive Disorder', diagnosticCode: '9434', category: 'Mental Health', prevalence: 'moderate', description: 'Depression linked to chronic sleep loss' },
    ],
  },

  vehicle_operations: {
    name: 'Vehicle / Equipment Operations',
    description: 'Driving military vehicles, operating heavy equipment, convoy operations',
    conditions: [
      { conditionName: 'Lumbosacral Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'very_common', description: 'Lower back pain from vehicle vibration and jolting' },
      { conditionName: 'Cervical Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'common', description: 'Neck strain from vehicle operations' },
      { conditionName: 'Bilateral Hearing Loss', diagnosticCode: '6100', category: 'Ear', prevalence: 'common', description: 'Hearing loss from engine noise' },
      { conditionName: 'Hemorrhoids', diagnosticCode: '7336', category: 'Digestive', prevalence: 'moderate', description: 'From prolonged sitting and vibration' },
    ],
  },

  airborne_jump: {
    name: 'Airborne / Parachute Operations',
    description: 'Static line jumps, HALO/HAHO, parachute landing falls',
    conditions: [
      { conditionName: 'Knee Strain (Bilateral)', diagnosticCode: '5260', category: 'Musculoskeletal', prevalence: 'very_common', description: 'Knee injuries from parachute landing falls' },
      { conditionName: 'Ankle Strain', diagnosticCode: '5271', category: 'Musculoskeletal', prevalence: 'very_common', description: 'Ankle injuries from landing impacts' },
      { conditionName: 'Lumbosacral Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'very_common', description: 'Back injuries from jump impacts' },
      { conditionName: 'Cervical Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'common', description: 'Neck injuries from opening shock' },
      { conditionName: 'Tinnitus', diagnosticCode: '6260', category: 'Ear', prevalence: 'common', description: 'From aircraft noise during jump operations' },
    ],
  },

  aviation: {
    name: 'Aviation Operations',
    description: 'Flight crew, maintenance on flight line, air traffic control, helicopter operations',
    conditions: [
      { conditionName: 'Tinnitus', diagnosticCode: '6260', category: 'Ear', prevalence: 'very_common', description: 'From aircraft engine noise' },
      { conditionName: 'Bilateral Hearing Loss', diagnosticCode: '6100', category: 'Ear', prevalence: 'very_common', description: 'From prolonged aircraft noise exposure' },
      { conditionName: 'Cervical Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'common', description: 'From wearing heavy helmets and head-mounted displays' },
      { conditionName: 'Lumbosacral Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'common', description: 'From vibration and seating posture in aircraft' },
      { conditionName: 'Vision Problems', diagnosticCode: '6066', category: 'Eye', prevalence: 'moderate', description: 'From NVG use, altitude changes, sun exposure' },
    ],
  },

  naval_maritime: {
    name: 'Naval / Maritime Operations',
    description: 'Shipboard duty, submarine operations, diving, deck operations, engine room work',
    conditions: [
      { conditionName: 'Bilateral Hearing Loss', diagnosticCode: '6100', category: 'Ear', prevalence: 'very_common', description: 'From engine rooms and shipboard machinery' },
      { conditionName: 'Tinnitus', diagnosticCode: '6260', category: 'Ear', prevalence: 'very_common', description: 'From shipboard noise exposure' },
      { conditionName: 'Insomnia', diagnosticCode: '6847', category: 'Sleep', prevalence: 'common', description: 'From watch rotations and berthing conditions' },
      { conditionName: 'Lumbosacral Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'common', description: 'From shipboard work and confined spaces' },
      { conditionName: 'Sinusitis (Chronic)', diagnosticCode: '6513', category: 'Respiratory', prevalence: 'moderate', description: 'From air quality in enclosed ship/submarine spaces' },
    ],
  },

  medical_healthcare: {
    name: 'Medical / Healthcare Operations',
    description: 'Combat medic, hospital corps, veterinary, dental, lab technician, nurse',
    conditions: [
      { conditionName: 'PTSD', diagnosticCode: '9411', category: 'Mental Health', prevalence: 'common', description: 'From trauma exposure in medical settings' },
      { conditionName: 'Major Depressive Disorder', diagnosticCode: '9434', category: 'Mental Health', prevalence: 'common', description: 'From cumulative stress of patient care' },
      { conditionName: 'Lumbosacral Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'common', description: 'From lifting and moving patients' },
      { conditionName: 'Skin Conditions (Dermatitis)', diagnosticCode: '7806', category: 'Skin', prevalence: 'moderate', description: 'From chemical and cleaning agent exposure' },
      { conditionName: 'Bloodborne Pathogen Exposure', diagnosticCode: '7354', category: 'Infectious', prevalence: 'less_common', description: 'Hepatitis or other infection risks' },
    ],
  },

  intelligence_desk: {
    name: 'Intelligence / Desk Operations',
    description: 'SIGINT, imagery analysis, cyber operations, administrative work, long screen time',
    conditions: [
      { conditionName: 'Migraines', diagnosticCode: '8100', category: 'Neurological', prevalence: 'common', description: 'From prolonged screen time and eye strain' },
      { conditionName: 'Cervical Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'common', description: 'From sustained posture at workstations' },
      { conditionName: 'Carpal Tunnel Syndrome', diagnosticCode: '8515', category: 'Neurological', prevalence: 'moderate', description: 'From prolonged keyboard use' },
      { conditionName: 'Lumbosacral Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'moderate', description: 'From prolonged sitting' },
      { conditionName: 'PTSD', diagnosticCode: '9411', category: 'Mental Health', prevalence: 'moderate', description: 'From exposure to disturbing imagery or intelligence content' },
    ],
  },

  military_police_security: {
    name: 'Military Police / Security Operations',
    description: 'Law enforcement, detainee operations, gate security, patrols, riot control',
    conditions: [
      { conditionName: 'PTSD', diagnosticCode: '9411', category: 'Mental Health', prevalence: 'common', description: 'From law enforcement trauma and high-threat situations' },
      { conditionName: 'Knee Strain (Bilateral)', diagnosticCode: '5260', category: 'Musculoskeletal', prevalence: 'common', description: 'From body armor weight and patrol duties' },
      { conditionName: 'Lumbosacral Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'common', description: 'From body armor and equipment weight' },
      { conditionName: 'Tinnitus', diagnosticCode: '6260', category: 'Ear', prevalence: 'common', description: 'From weapons qualification and range duty' },
      { conditionName: 'Insomnia', diagnosticCode: '6847', category: 'Sleep', prevalence: 'moderate', description: 'From rotating shift work' },
    ],
  },

  communications_electronics: {
    name: 'Communications / Electronics',
    description: 'Radio operations, satellite comms, electronic maintenance, signal work',
    conditions: [
      { conditionName: 'Tinnitus', diagnosticCode: '6260', category: 'Ear', prevalence: 'common', description: 'From headset and radio noise' },
      { conditionName: 'Bilateral Hearing Loss', diagnosticCode: '6100', category: 'Ear', prevalence: 'moderate', description: 'From headset use and generator noise' },
      { conditionName: 'Carpal Tunnel Syndrome', diagnosticCode: '8515', category: 'Neurological', prevalence: 'moderate', description: 'From repetitive keyboard and equipment use' },
      { conditionName: 'Cervical Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'moderate', description: 'From carrying heavy comms equipment' },
    ],
  },

  engineering_construction: {
    name: 'Engineering / Construction',
    description: 'Combat engineer, construction, demolition, route clearance, HVAC, plumbing, electrical',
    conditions: [
      { conditionName: 'Bilateral Hearing Loss', diagnosticCode: '6100', category: 'Ear', prevalence: 'very_common', description: 'From heavy machinery and demolition' },
      { conditionName: 'Tinnitus', diagnosticCode: '6260', category: 'Ear', prevalence: 'very_common', description: 'From noise exposure during construction/demolition' },
      { conditionName: 'Lumbosacral Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'very_common', description: 'From heavy lifting and construction labor' },
      { conditionName: 'Knee Strain (Bilateral)', diagnosticCode: '5260', category: 'Musculoskeletal', prevalence: 'common', description: 'From physical labor and impact' },
      { conditionName: 'Sinusitis (Chronic)', diagnosticCode: '6513', category: 'Respiratory', prevalence: 'moderate', description: 'From dust and particulate exposure' },
    ],
  },

  food_service: {
    name: 'Food Service / Supply',
    description: 'Military cook, mess hall, supply handling, warehouse operations',
    conditions: [
      { conditionName: 'Lumbosacral Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'common', description: 'From lifting heavy supplies and standing' },
      { conditionName: 'Plantar Fasciitis', diagnosticCode: '5276', category: 'Musculoskeletal', prevalence: 'common', description: 'From prolonged standing on hard surfaces' },
      { conditionName: 'Skin Conditions (Dermatitis)', diagnosticCode: '7806', category: 'Skin', prevalence: 'moderate', description: 'From cleaning chemicals and heat exposure' },
      { conditionName: 'Knee Strain (Bilateral)', diagnosticCode: '5260', category: 'Musculoskeletal', prevalence: 'moderate', description: 'From lifting and standing' },
    ],
  },

  nuclear_biological_chemical: {
    name: 'NBC / CBRN Operations',
    description: 'CBRN defense, nuclear operations, radiation monitoring, decontamination',
    conditions: [
      { conditionName: 'Sinusitis (Chronic)', diagnosticCode: '6513', category: 'Respiratory', prevalence: 'common', description: 'From chemical agent exposure and mask use' },
      { conditionName: 'Skin Conditions (Dermatitis)', diagnosticCode: '7806', category: 'Skin', prevalence: 'common', description: 'From decontamination chemicals and protective gear' },
      { conditionName: 'Rhinitis (Allergic)', diagnosticCode: '6522', category: 'Respiratory', prevalence: 'common', description: 'From chemical irritant exposure' },
      { conditionName: 'Migraines', diagnosticCode: '8100', category: 'Neurological', prevalence: 'moderate', description: 'From chemical exposure residuals' },
    ],
  },

  special_operations: {
    name: 'Special Operations',
    description: 'Rangers, Special Forces, SEALs, MARSOC, PJs, CCT — extreme physical demands, high-risk missions',
    conditions: [
      { conditionName: 'Tinnitus', diagnosticCode: '6260', category: 'Ear', prevalence: 'very_common', description: 'From weapons fire and breaching operations' },
      { conditionName: 'Bilateral Hearing Loss', diagnosticCode: '6100', category: 'Ear', prevalence: 'very_common', description: 'From prolonged high-noise operations' },
      { conditionName: 'Knee Strain (Bilateral)', diagnosticCode: '5260', category: 'Musculoskeletal', prevalence: 'very_common', description: 'From extreme physical demands' },
      { conditionName: 'Lumbosacral Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'very_common', description: 'From heavy load carriage and extreme exertion' },
      { conditionName: 'PTSD', diagnosticCode: '9411', category: 'Mental Health', prevalence: 'very_common', description: 'From combat and high-risk operations' },
      { conditionName: 'Traumatic Brain Injury (TBI)', diagnosticCode: '8045', category: 'Neurological', prevalence: 'common', description: 'From blast exposure and combat impacts' },
      { conditionName: 'Shoulder Strain', diagnosticCode: '5201', category: 'Musculoskeletal', prevalence: 'common', description: 'From climbing, rappelling, and combat' },
      { conditionName: 'Sleep Apnea', diagnosticCode: '6847', category: 'Sleep', prevalence: 'common', description: 'From chronic sleep deprivation and TBI' },
    ],
  },

  drill_instructor_training: {
    name: 'Drill Instructor / Training Cadre',
    description: 'Drill sergeants, instructors, physical training leaders — high voice strain, physical demonstration load',
    conditions: [
      { conditionName: 'Vocal Cord Dysfunction', diagnosticCode: '6516', category: 'Respiratory', prevalence: 'moderate', description: 'From chronic voice strain and yelling' },
      { conditionName: 'Knee Strain (Bilateral)', diagnosticCode: '5260', category: 'Musculoskeletal', prevalence: 'common', description: 'From constant physical training demonstrations' },
      { conditionName: 'Lumbosacral Strain', diagnosticCode: '5237', category: 'Musculoskeletal', prevalence: 'common', description: 'From physical training and demonstration load' },
      { conditionName: 'Insomnia', diagnosticCode: '6847', category: 'Sleep', prevalence: 'common', description: 'From early morning schedules and stress' },
    ],
  },
};

/**
 * Given an array of hazard category keys (from a job code entry's `hazards` field),
 * returns all matching VA-ratable conditions, deduplicated and sorted by prevalence.
 * Works for any branch — Army MOS, AFSC, Rating, NEC, officer designator.
 */
export function getConditionsForHazards(hazardKeys: string[]): HazardCondition[] {
  const seen = new Set<string>();
  const results: HazardCondition[] = [];

  for (const key of hazardKeys) {
    const category = hazardConditionMap[key];
    if (!category) continue;
    for (const condition of category.conditions) {
      const dedupeKey = `${condition.conditionName}-${condition.diagnosticCode}`;
      if (!seen.has(dedupeKey)) {
        seen.add(dedupeKey);
        results.push(condition);
      }
    }
  }

  const prevalenceOrder: Record<HazardCondition['prevalence'], number> = {
    very_common: 0,
    common: 1,
    moderate: 2,
    less_common: 3,
  };
  results.sort((a, b) => prevalenceOrder[a.prevalence] - prevalenceOrder[b.prevalence]);

  return results;
}
