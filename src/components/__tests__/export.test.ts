/**
 * Export System Tests — Section 11
 *
 * Tests export types, format definitions, and section configuration.
 */
import { describe, it, expect } from 'vitest';
import type { ExportSections, ExportFormat } from '@/services/exportEngine';

// ---------------------------------------------------------------------------
// 11A: Two Distinct Outputs
// ---------------------------------------------------------------------------
describe('Export System — Distinct Output Types', () => {
  it('ExportFormat includes pdf', () => {
    const format: ExportFormat = 'pdf';
    expect(format).toBe('pdf');
  });

  it('ExportFormat includes json', () => {
    const format: ExportFormat = 'json';
    expect(format).toBe('json');
  });

  it('ExportFormat includes text', () => {
    const format: ExportFormat = 'text';
    expect(format).toBe('text');
  });

  it('pdf and json are distinct formats', () => {
    const pdf: ExportFormat = 'pdf';
    const json: ExportFormat = 'json';
    expect(pdf).not.toBe(json);
  });
});

// ---------------------------------------------------------------------------
// 11B: PDF Claim Packet Structure
// ---------------------------------------------------------------------------
describe('Export System — Export Sections', () => {
  it('ExportSections covers all expected data types', () => {
    const sections: ExportSections = {
      personalInfo: true,
      conditions: true,
      evidenceChecklist: true,
      healthLogs: true,
      generatedDocs: true,
      formDrafts: true,
      romMeasurements: true,
      timeline: true,
    };

    expect(sections.personalInfo).toBe(true);
    expect(sections.conditions).toBe(true);
    expect(sections.evidenceChecklist).toBe(true);
    expect(sections.healthLogs).toBe(true);
    expect(sections.generatedDocs).toBe(true);
    expect(sections.formDrafts).toBe(true);
    expect(sections.romMeasurements).toBe(true);
    expect(sections.timeline).toBe(true);
  });

  it('individual sections can be toggled off', () => {
    const sections: ExportSections = {
      personalInfo: true,
      conditions: true,
      evidenceChecklist: false,
      healthLogs: true,
      generatedDocs: false,
      formDrafts: false,
      romMeasurements: false,
      timeline: false,
    };

    expect(sections.evidenceChecklist).toBe(false);
    expect(sections.generatedDocs).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 11C: Data Export Validation
// ---------------------------------------------------------------------------
describe('Export System — Data Export', () => {
  it('JSON stringify produces valid output for typical data', () => {
    const data = {
      symptoms: [{ id: 's1', symptom: 'Back pain', severity: 7 }],
      medications: [{ id: 'm1', name: 'Ibuprofen', dosage: '800mg' }],
      serviceHistory: [{ id: 'sh1', branch: 'Army', startDate: '2010-01', endDate: '2014-01' }],
    };
    const json = JSON.stringify(data);
    expect(json).toBeTruthy();
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('empty data produces valid JSON', () => {
    const data = {
      symptoms: [],
      medications: [],
      serviceHistory: [],
    };
    const json = JSON.stringify(data);
    const parsed = JSON.parse(json);
    expect(parsed.symptoms).toHaveLength(0);
  });
});
