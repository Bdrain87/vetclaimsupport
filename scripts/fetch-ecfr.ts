#!/usr/bin/env npx tsx
/**
 * eCFR Data Pipeline — Fetch 38 CFR Part 4 from the eCFR public API
 *
 * Parses diagnostic codes, condition names, and rating criteria from the
 * official electronic Code of Federal Regulations, then cross-references
 * against our existing condition data to produce a diff report.
 *
 * Usage:
 *   npx tsx scripts/fetch-ecfr.ts
 *   npm run fetch:ecfr
 *
 * Output:
 *   - Prints a diff report showing new/missing/changed codes
 *   - Exits 0 if no issues, 1 if discrepancies found
 */

import * as fs from 'fs';
import * as path from 'path';

const ECFR_API = 'https://www.ecfr.gov/api/versioner/v1/full/current/title-38.xml?part=4';
const OUTPUT_DIR = path.resolve(__dirname, '../src/data/conditions');

interface ECFRDiagnosticCode {
  code: string;
  name: string;
  bodySystem: string;
}

interface DiffEntry {
  type: 'new' | 'missing' | 'name-mismatch';
  code: string;
  ecfrName?: string;
  localName?: string;
  bodySystem?: string;
}

async function fetchECFR(): Promise<string> {
  console.log('Fetching 38 CFR Part 4 from eCFR...');
  const response = await fetch(ECFR_API);
  if (!response.ok) {
    throw new Error(`eCFR API returned ${response.status}: ${response.statusText}`);
  }
  return response.text();
}

function parseDiagnosticCodes(xml: string): ECFRDiagnosticCode[] {
  const codes: ECFRDiagnosticCode[] = [];

  // eCFR XML uses <SECTNO> for DC numbers and <SUBJECT> for condition names
  // Pattern: sections under Subpart B+ contain the schedule of ratings
  const dcPattern = /(?:DC|Diagnostic [Cc]ode)\s*(\d{4})/g;
  let match: RegExpExecArray | null;

  while ((match = dcPattern.exec(xml)) !== null) {
    const code = match[1];
    // Extract surrounding context for the name
    const start = Math.max(0, match.index - 200);
    const end = Math.min(xml.length, match.index + 200);
    const context = xml.substring(start, end);

    // Try to extract the condition name from nearby tags
    const subjectMatch = context.match(/<SUBJECT>([^<]+)<\/SUBJECT>/);
    const name = subjectMatch ? subjectMatch[1].trim() : `Unknown (DC ${code})`;

    // Try to determine body system from section context
    const systemMatch = context.match(/<HD[^>]*>([^<]+)<\/HD>/);
    const bodySystem = systemMatch ? systemMatch[1].trim() : 'Unknown';

    if (!codes.some(c => c.code === code)) {
      codes.push({ code, name, bodySystem });
    }
  }

  return codes;
}

function loadLocalConditions(): Map<string, { name: string; id: string }> {
  const localMap = new Map<string, { name: string; id: string }>();

  // Dynamically import all condition files
  const conditionFiles = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.ts') && !['types.ts', 'index.ts', 'VERSION.ts'].includes(f));

  for (const file of conditionFiles) {
    const content = fs.readFileSync(path.join(OUTPUT_DIR, file), 'utf-8');
    // Extract diagnosticCode and name from the TypeScript objects
    const entries = content.matchAll(/diagnosticCode:\s*['"](\d+)['"][\s\S]*?name:\s*['"]([^'"]+)['"]/g);
    for (const entry of entries) {
      localMap.set(entry[1], { name: entry[2], id: entry[1] });
    }
    // Also try reversed order (name before diagnosticCode)
    const entriesRev = content.matchAll(/name:\s*['"]([^'"]+)['"][\s\S]*?diagnosticCode:\s*['"](\d+)['"]/g);
    for (const entry of entriesRev) {
      if (!localMap.has(entry[2])) {
        localMap.set(entry[2], { name: entry[1], id: entry[2] });
      }
    }
  }

  return localMap;
}

function generateDiff(
  ecfrCodes: ECFRDiagnosticCode[],
  localCodes: Map<string, { name: string; id: string }>,
): DiffEntry[] {
  const diff: DiffEntry[] = [];
  const ecfrSet = new Set(ecfrCodes.map(c => c.code));

  // Codes in eCFR but not in local data
  for (const ecfr of ecfrCodes) {
    if (!localCodes.has(ecfr.code)) {
      diff.push({
        type: 'new',
        code: ecfr.code,
        ecfrName: ecfr.name,
        bodySystem: ecfr.bodySystem,
      });
    } else {
      // Check for name mismatches
      const local = localCodes.get(ecfr.code)!;
      if (local.name.toLowerCase() !== ecfr.name.toLowerCase()) {
        diff.push({
          type: 'name-mismatch',
          code: ecfr.code,
          ecfrName: ecfr.name,
          localName: local.name,
        });
      }
    }
  }

  // Codes in local data but not in eCFR (might be deprecated)
  for (const [code, local] of localCodes) {
    if (!ecfrSet.has(code)) {
      diff.push({
        type: 'missing',
        code,
        localName: local.name,
      });
    }
  }

  return diff;
}

async function main() {
  try {
    const xml = await fetchECFR();
    console.log(`Received ${(xml.length / 1024).toFixed(0)}KB of XML data`);

    const ecfrCodes = parseDiagnosticCodes(xml);
    console.log(`Parsed ${ecfrCodes.length} diagnostic codes from eCFR`);

    const localCodes = loadLocalConditions();
    console.log(`Loaded ${localCodes.size} local diagnostic codes`);

    const diff = generateDiff(ecfrCodes, localCodes);

    if (diff.length === 0) {
      console.log('\nAll local codes match eCFR. No discrepancies found.');
      process.exit(0);
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('DIFF REPORT');
    console.log('='.repeat(60));

    const newCodes = diff.filter(d => d.type === 'new');
    const missing = diff.filter(d => d.type === 'missing');
    const mismatches = diff.filter(d => d.type === 'name-mismatch');

    if (newCodes.length > 0) {
      console.log(`\nNEW in eCFR (not in local data): ${newCodes.length}`);
      for (const d of newCodes.slice(0, 20)) {
        console.log(`  DC ${d.code}: ${d.ecfrName} [${d.bodySystem}]`);
      }
      if (newCodes.length > 20) console.log(`  ... and ${newCodes.length - 20} more`);
    }

    if (missing.length > 0) {
      console.log(`\nMISSING from eCFR (may be deprecated): ${missing.length}`);
      for (const d of missing.slice(0, 20)) {
        console.log(`  DC ${d.code}: ${d.localName}`);
      }
      if (missing.length > 20) console.log(`  ... and ${missing.length - 20} more`);
    }

    if (mismatches.length > 0) {
      console.log(`\nNAME MISMATCHES: ${mismatches.length}`);
      for (const d of mismatches.slice(0, 20)) {
        console.log(`  DC ${d.code}:`);
        console.log(`    eCFR:  ${d.ecfrName}`);
        console.log(`    Local: ${d.localName}`);
      }
      if (mismatches.length > 20) console.log(`  ... and ${mismatches.length - 20} more`);
    }

    // Update VERSION.ts with fetch timestamp
    const versionPath = path.join(OUTPUT_DIR, 'VERSION.ts');
    const versionContent = `/**
 * VA Condition Data Version Tracking
 * Auto-updated by scripts/fetch-ecfr.ts
 */

export const CONDITION_DATA_VERSION = {
  version: '${new Date().toISOString().split('T')[0]}',
  ecfrFetchDate: '${new Date().toISOString()}',
  localConditionCount: ${localCodes.size},
  ecfrDiagnosticCodeCount: ${ecfrCodes.length},
  discrepancies: ${diff.length},
} as const;
`;
    fs.writeFileSync(versionPath, versionContent);
    console.log(`\nUpdated ${versionPath}`);

    process.exit(diff.length > 0 ? 1 : 0);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(2);
  }
}

main();
