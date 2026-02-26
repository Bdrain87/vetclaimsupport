/**
 * Deployment Location Search — 12 Required Tests
 *
 * Per Phase 4 of the engineering prompt, all 12 must pass:
 * Balad, TQ, BAF, KAF, Keating, Restrepo, Vietnam, Lejeune,
 * Pease, McClellan, Desert Rock, zzzzz (empty).
 */

import { describe, it, expect } from 'vitest';
import { searchLocations } from '@/data/deployment-locations/search';

function hazards(query: string): string[] {
  return searchLocations(query).flatMap((r) => r.hazards);
}

describe('deployment location search — 12 required tests', () => {
  it('1. "Balad" → Camp Anaconda with burn pit', () => {
    const results = searchLocations('Balad');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.name.includes('Anaconda') || r.name.includes('Balad'))).toBe(true);
    expect(hazards('Balad')).toContain('burn_pit');
  });

  it('2. "TQ" → Al Taqaddum with burn pit', () => {
    const results = searchLocations('TQ');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.name.includes('Taqaddum'))).toBe(true);
    expect(hazards('TQ')).toContain('burn_pit');
  });

  it('3. "BAF" → Bagram Airfield with burn pit', () => {
    const results = searchLocations('BAF');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.name.includes('Bagram'))).toBe(true);
    expect(hazards('BAF')).toContain('burn_pit');
  });

  it('4. "KAF" → Kandahar Airfield with burn pit', () => {
    const results = searchLocations('KAF');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.name.includes('Kandahar'))).toBe(true);
    expect(hazards('KAF')).toContain('burn_pit');
  });

  it('5. "Keating" → COP Keating', () => {
    const results = searchLocations('Keating');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.name.includes('Keating'))).toBe(true);
  });

  it('6. "Restrepo" → OP/COP Restrepo', () => {
    const results = searchLocations('Restrepo');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.name.includes('Restrepo'))).toBe(true);
  });

  it('7. "Vietnam" → multiple locations with Agent Orange', () => {
    const results = searchLocations('Vietnam');
    expect(results.length).toBeGreaterThan(1);
    expect(hazards('Vietnam')).toContain('agent_orange');
  });

  it('8. "Lejeune" → Camp Lejeune with contaminated water', () => {
    const results = searchLocations('Lejeune');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.name.includes('Lejeune'))).toBe(true);
    expect(hazards('Lejeune')).toContain('contaminated_water');
  });

  it('9. "Pease" → Pease ANGB with PFAS', () => {
    const results = searchLocations('Pease');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.name.includes('Pease'))).toBe(true);
    expect(hazards('Pease')).toContain('pfas');
  });

  it('10. "McClellan" → Fort McClellan with chemical exposure', () => {
    const results = searchLocations('McClellan');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.name.includes('McClellan'))).toBe(true);
    expect(hazards('McClellan')).toContain('chemical');
  });

  it('11. "Desert Rock" → Camp Desert Rock with radiation', () => {
    const results = searchLocations('Desert Rock');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.name.includes('Desert Rock'))).toBe(true);
    expect(hazards('Desert Rock')).toContain('radiation');
  });

  it('12. "zzzzz" → no results, no crash', () => {
    const results = searchLocations('zzzzz');
    expect(results).toHaveLength(0);
  });
});
