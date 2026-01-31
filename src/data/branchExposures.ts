export type MilitaryBranch = 'Army' | 'Navy' | 'Air Force' | 'Marines' | 'Coast Guard' | 'Space Force';

export interface BranchExposure {
  name: string;
  description: string;
}

export const branchExposures: Record<MilitaryBranch, BranchExposure[]> = {
  'Army': [
    { name: 'Burn pits', description: 'Open-air burning of waste at forward operating bases' },
    { name: 'Diesel exhaust', description: 'Vehicle and generator exhaust exposure' },
    { name: 'Depleted uranium', description: 'Exposure from armor and munitions' },
    { name: 'Sand/dust', description: 'Particulate matter from desert deployments' },
    { name: 'Contaminated water (Camp Lejeune)', description: 'Toxic water exposure at Camp Lejeune' },
    { name: 'Noise', description: 'Weapons fire, explosions, heavy machinery' },
    { name: 'Herbicides', description: 'Agent Orange and other defoliants' },
  ],
  'Navy': [
    { name: 'Asbestos', description: 'Ship insulation and construction materials' },
    { name: 'Jet fuel', description: 'JP-5/JP-8 fuel handling and exposure' },
    { name: 'Paint fumes', description: 'Ship maintenance and painting operations' },
    { name: 'Noise', description: 'Engine rooms, flight deck operations' },
    { name: 'Contaminated water', description: 'Shipboard water system contamination' },
    { name: 'Radiation', description: 'Nuclear vessel operations' },
  ],
  'Air Force': [
    { name: 'Jet fuel', description: 'JP-8 fuel exposure during aircraft operations' },
    { name: 'Hydraulic fluid', description: 'Aircraft maintenance chemical exposure' },
    { name: 'PFAS chemicals', description: 'Firefighting foam and chemicals' },
    { name: 'Burn pits', description: 'Open-air burning at deployed locations' },
    { name: 'Noise', description: 'Aircraft engine noise, flight line operations' },
    { name: 'Radiation', description: 'Radar systems, nuclear weapons handling' },
  ],
  'Marines': [
    { name: 'Burn pits', description: 'Open-air burning of waste at forward operating bases' },
    { name: 'Sand/dust', description: 'Particulate matter from desert deployments' },
    { name: 'Contaminated water (Camp Lejeune)', description: 'Toxic water exposure at Camp Lejeune' },
    { name: 'Noise', description: 'Weapons fire, explosions, aircraft' },
    { name: 'Asbestos', description: 'Ship and building materials exposure' },
  ],
  'Coast Guard': [
    { name: 'Diesel exhaust', description: 'Cutter and small boat engine exhaust' },
    { name: 'Paint fumes', description: 'Ship and facility maintenance' },
    { name: 'Asbestos', description: 'Older vessel insulation materials' },
    { name: 'PFAS chemicals', description: 'Firefighting foam exposure' },
  ],
  'Space Force': [
    { name: 'Jet fuel', description: 'JP-8 fuel exposure (similar to Air Force)' },
    { name: 'Hydraulic fluid', description: 'Equipment maintenance chemicals' },
    { name: 'PFAS chemicals', description: 'Firefighting foam and chemicals' },
    { name: 'Noise', description: 'Launch operations, equipment' },
    { name: 'Radiation', description: 'Space systems, radar operations' },
  ],
};

export const militaryBranches: MilitaryBranch[] = [
  'Army',
  'Navy',
  'Air Force',
  'Marines',
  'Coast Guard',
  'Space Force',
];
