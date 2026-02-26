import type { EnrichedLocation } from './types';

/** Thailand Vietnam-era military base locations */
export const THAILAND_LOCATIONS: EnrichedLocation[] = [
  { name: 'Takhli RTAFB', alternateNames: ['Takhli', 'Takhli Royal Thai AFB'], country: 'Thailand', region: 'Nakhon Sawan', coordinates: [15.28, 100.30], hazards: ['agent_orange'], conflictId: 'thailand_vietnam_era', regionGroup: 'Royal Thai Air Force Bases', pactActEligible: true },
  { name: 'Korat RTAFB', alternateNames: ['Korat', 'Nakhon Ratchasima'], country: 'Thailand', region: 'Nakhon Ratchasima', coordinates: [14.93, 102.08], hazards: ['agent_orange'], conflictId: 'thailand_vietnam_era', regionGroup: 'Royal Thai Air Force Bases', pactActEligible: true },
  { name: 'Nakhon Phanom RTAFB', alternateNames: ['NKP', 'Nakhon Phanom', 'Naked Fanny'], country: 'Thailand', region: 'Nakhon Phanom', coordinates: [17.38, 104.64], hazards: ['agent_orange'], conflictId: 'thailand_vietnam_era', regionGroup: 'Royal Thai Air Force Bases', pactActEligible: true },
  { name: 'U-Tapao RTAFB', alternateNames: ['U-Tapao', 'Utapao'], country: 'Thailand', region: 'Rayong', coordinates: [12.68, 101.01], hazards: ['agent_orange'], conflictId: 'thailand_vietnam_era', regionGroup: 'Royal Thai Air Force Bases', pactActEligible: true },
  { name: 'Udorn RTAFB', alternateNames: ['Udorn', 'Udon Thani'], country: 'Thailand', region: 'Udon Thani', coordinates: [17.39, 102.80], hazards: ['agent_orange'], conflictId: 'thailand_vietnam_era', regionGroup: 'Royal Thai Air Force Bases', pactActEligible: true },
  { name: 'Don Muang RTAFB', alternateNames: ['Don Muang', 'Bangkok AB'], country: 'Thailand', region: 'Bangkok', coordinates: [13.91, 100.61], hazards: ['agent_orange'], conflictId: 'thailand_vietnam_era', regionGroup: 'Royal Thai Air Force Bases', pactActEligible: true },
  { name: 'Nam Phong RTAFB', alternateNames: ['Nam Phong', 'Rose Garden'], country: 'Thailand', region: 'Khon Kaen', hazards: ['agent_orange'], conflictId: 'thailand_vietnam_era', regionGroup: 'Royal Thai Air Force Bases', pactActEligible: true },
  { name: 'Ubon RTAFB', alternateNames: ['Ubon', 'Ubon Ratchathani'], country: 'Thailand', region: 'Ubon Ratchathani', coordinates: [15.25, 104.87], hazards: ['agent_orange'], conflictId: 'thailand_vietnam_era', regionGroup: 'Royal Thai Air Force Bases', pactActEligible: true },
  { name: 'Ramasun Station', alternateNames: ['Ramasun', 'Camp Friendship/Ramasun'], country: 'Thailand', region: 'Udon Thani', hazards: ['agent_orange'], conflictId: 'thailand_vietnam_era', regionGroup: 'Royal Thai Air Force Bases', pactActEligible: true },
  { name: 'Camp Samae San', alternateNames: ['Samae San', 'Sattahip'], country: 'Thailand', region: 'Chonburi', hazards: ['agent_orange'], conflictId: 'thailand_vietnam_era', regionGroup: 'Royal Thai Air Force Bases', pactActEligible: true },
  { name: 'Camp Vayama', alternateNames: ['Vayama'], country: 'Thailand', hazards: ['agent_orange'], conflictId: 'thailand_vietnam_era', regionGroup: 'Royal Thai Air Force Bases', pactActEligible: true },

  // NEW — expanded
  { name: 'Camp Friendship', alternateNames: ['Friendship', 'Korat Camp Friendship'], country: 'Thailand', region: 'Nakhon Ratchasima', hazards: ['agent_orange'], conflictId: 'thailand_vietnam_era', regionGroup: 'Army/Support Bases', pactActEligible: true },
  { name: 'Sattahip Naval Base', alternateNames: ['Sattahip'], country: 'Thailand', region: 'Chonburi', hazards: ['agent_orange'], conflictId: 'thailand_vietnam_era', regionGroup: 'Army/Support Bases', pactActEligible: true },
  { name: 'Camp John Hay (transit)', alternateNames: [], country: 'Thailand', hazards: ['agent_orange'], conflictId: 'thailand_vietnam_era', regionGroup: 'Army/Support Bases', pactActEligible: true },
];
