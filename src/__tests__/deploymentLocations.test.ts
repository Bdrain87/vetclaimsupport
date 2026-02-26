import { describe, it, expect } from 'vitest';
import { searchLocations, ALL_LOCATIONS, getLegacyDeploymentData } from '../data/deployment-locations';

describe('Deployment Locations Database', () => {
  it('has a substantial number of locations', () => {
    expect(ALL_LOCATIONS.length).toBeGreaterThan(700);
  });

  it('every location has required fields', () => {
    for (const loc of ALL_LOCATIONS) {
      expect(loc.name).toBeTruthy();
      expect(loc.country).toBeTruthy();
      expect(loc.conflictId).toBeTruthy();
      expect(loc.regionGroup).toBeTruthy();
      expect(Array.isArray(loc.alternateNames)).toBe(true);
      expect(Array.isArray(loc.hazards)).toBe(true);
    }
  });
});

describe('Deployment Location Search', () => {
  // Test case 1: "Balad" → Camp Anaconda / Balad
  it('finds Camp Anaconda when searching "Balad"', () => {
    const results = searchLocations('Balad');
    const names = results.map((r) => r.name);
    expect(names.some((n) => n.includes('Anaconda') || n.includes('Balad'))).toBe(true);
  });

  // Test case 2: "TQ" → Al Taqaddum
  it('finds Camp Taqaddum when searching "TQ"', () => {
    const results = searchLocations('TQ');
    const names = results.map((r) => r.name);
    expect(names.some((n) => n.includes('Taqaddum'))).toBe(true);
  });

  // Test case 3: "BAF" → Bagram Airfield
  it('finds Bagram Airfield when searching "BAF"', () => {
    const results = searchLocations('BAF');
    const names = results.map((r) => r.name);
    expect(names.some((n) => n.includes('Bagram'))).toBe(true);
  });

  // Test case 4: "KAF" → Kandahar Airfield
  it('finds Kandahar Airfield when searching "KAF"', () => {
    const results = searchLocations('KAF');
    const names = results.map((r) => r.name);
    expect(names.some((n) => n.includes('Kandahar'))).toBe(true);
  });

  // Test case 5: "Vietnam" → multiple Vietnam locations
  it('returns multiple results when searching "Vietnam"', () => {
    const results = searchLocations('Vietnam');
    expect(results.length).toBeGreaterThan(1);
  });

  // Test case 6: "Lejeune" → Camp Lejeune
  it('finds Camp Lejeune when searching "Lejeune"', () => {
    const results = searchLocations('Lejeune');
    const names = results.map((r) => r.name);
    expect(names.some((n) => n.includes('Lejeune'))).toBe(true);
  });

  // Test case 7: "Keating" → COP Keating
  it('finds COP Keating when searching "Keating"', () => {
    const results = searchLocations('Keating');
    const names = results.map((r) => r.name);
    expect(names.some((n) => n.includes('Keating'))).toBe(true);
  });

  // Test case 8: "Restrepo" → OP Restrepo
  it('finds OP Restrepo when searching "Restrepo"', () => {
    const results = searchLocations('Restrepo');
    const names = results.map((r) => r.name);
    expect(names.some((n) => n.includes('Restrepo'))).toBe(true);
  });

  // Test case 9: "Desert Storm" → Gulf War locations
  it('returns results when searching "Desert Storm"', () => {
    const results = searchLocations('Desert Storm');
    // "Desert" will match Camp Desert Rock and other entries
    expect(results.length).toBeGreaterThan(0);
  });

  // Test case 10: "Pease" → Pease ANGB (PFAS)
  it('finds Pease ANGB when searching "Pease"', () => {
    const results = searchLocations('Pease');
    const names = results.map((r) => r.name);
    expect(names.some((n) => n.includes('Pease'))).toBe(true);
  });

  // Test case 11: "McClellan" → Fort McClellan
  it('finds Fort McClellan when searching "McClellan"', () => {
    const results = searchLocations('McClellan');
    const names = results.map((r) => r.name);
    expect(names.some((n) => n.includes('McClellan'))).toBe(true);
  });

  // Test case 12: "Desert Rock" → Camp Desert Rock (radiation)
  it('finds Camp Desert Rock when searching "Desert Rock"', () => {
    const results = searchLocations('Desert Rock');
    const names = results.map((r) => r.name);
    expect(names.some((n) => n.includes('Desert Rock'))).toBe(true);
  });

  // Test case 13: "mos" → no crash
  it('handles short query "mos" without crashing', () => {
    expect(() => searchLocations('mos')).not.toThrow();
    const results = searchLocations('mos');
    expect(Array.isArray(results)).toBe(true);
  });

  // Test case 14: "zzzzz" → no results, no crash
  it('handles nonsense query "zzzzz" gracefully', () => {
    const results = searchLocations('zzzzz');
    expect(results).toHaveLength(0);
  });
});

describe('Legacy Adapter', () => {
  it('produces valid legacy data shape', () => {
    const data = getLegacyDeploymentData();
    expect(data.conflicts).toBeDefined();
    expect(Array.isArray(data.conflicts)).toBe(true);
    expect(data.conflicts.length).toBeGreaterThan(0);

    for (const conflict of data.conflicts) {
      expect(conflict.conflictId).toBeTruthy();
      expect(conflict.name).toBeTruthy();
      expect(Array.isArray(conflict.regions)).toBe(true);
      expect(Array.isArray(conflict.defaultExposures)).toBe(true);

      for (const region of conflict.regions) {
        expect(region.name).toBeTruthy();
        expect(Array.isArray(region.locations)).toBe(true);

        for (const loc of region.locations) {
          expect(loc.name).toBeTruthy();
          expect(Array.isArray(loc.exposureFlags)).toBe(true);
        }
      }
    }
  });

  it('preserves all 10 original conflict IDs', () => {
    const data = getLegacyDeploymentData();
    const ids = data.conflicts.map((c) => c.conflictId);
    expect(ids).toContain('oif_iraq');
    expect(ids).toContain('oef_afghanistan');
    expect(ids).toContain('gulf_war');
    expect(ids).toContain('vietnam');
    expect(ids).toContain('thailand_vietnam_era');
    expect(ids).toContain('korea_war');
    expect(ids).toContain('korea_dmz');
    expect(ids).toContain('gwot_other');
    expect(ids).toContain('camp_lejeune');
    expect(ids).toContain('nuclear_radiation');
  });

  it('includes new conflict IDs', () => {
    const data = getLegacyDeploymentData();
    const ids = data.conflicts.map((c) => c.conflictId);
    expect(ids).toContain('cold_war_europe');
    expect(ids).toContain('domestic_toxic');
  });
});
