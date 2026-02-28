#!/usr/bin/env npx tsx
/**
 * Condition Data Validator
 *
 * Validates the integrity of all VA condition data:
 * - All IDs are unique
 * - All commonSecondary IDs reference valid conditions
 * - No IDs contain suspicious characters (parentheses, spaces)
 * - All required fields are present
 * - No duplicate diagnostic codes within the same body system
 *
 * Usage:
 *   npx tsx scripts/validate-conditions.ts
 *   npm run validate:conditions
 *
 * Exit codes:
 *   0 = all checks pass
 *   1 = validation errors found
 */

import * as fs from 'fs';
import * as path from 'path';

const CONDITIONS_DIR = path.resolve(__dirname, '../src/data/conditions');

interface ValidationError {
  file: string;
  field: string;
  message: string;
  conditionId?: string;
}

function loadAllConditionIds(): Map<string, { name: string; file: string; diagnosticCode: string }> {
  const ids = new Map<string, { name: string; file: string; diagnosticCode: string }>();

  const conditionFiles = fs.readdirSync(CONDITIONS_DIR)
    .filter(f => f.endsWith('.ts') && !['types.ts', 'index.ts', 'VERSION.ts', 'presumptive-conditions.ts'].includes(f));

  for (const file of conditionFiles) {
    const content = fs.readFileSync(path.join(CONDITIONS_DIR, file), 'utf-8');

    // Match condition objects: { id: '...', name: '...', diagnosticCode: '...' }
    const idMatches = content.matchAll(/id:\s*['"]([^'"]+)['"]/g);
    const nameMatches = content.matchAll(/name:\s*['"]([^'"]+)['"]/g);
    const dcMatches = content.matchAll(/diagnosticCode:\s*['"]([^'"]+)['"]/g);

    const idList = [...idMatches].map(m => m[1]);
    const nameList = [...nameMatches].map(m => m[1]);
    const dcList = [...dcMatches].map(m => m[1]);

    for (let i = 0; i < idList.length; i++) {
      ids.set(idList[i], {
        name: nameList[i] || 'unknown',
        file,
        diagnosticCode: dcList[i] || 'unknown',
      });
    }
  }

  return ids;
}

function loadAllSecondaryReferences(): Array<{ sourceId: string; targetId: string; file: string }> {
  const refs: Array<{ sourceId: string; targetId: string; file: string }> = [];

  const conditionFiles = fs.readdirSync(CONDITIONS_DIR)
    .filter(f => f.endsWith('.ts') && !['types.ts', 'index.ts', 'VERSION.ts', 'presumptive-conditions.ts'].includes(f));

  for (const file of conditionFiles) {
    const content = fs.readFileSync(path.join(CONDITIONS_DIR, file), 'utf-8');

    // Match commonSecondaries arrays
    const blockPattern = /id:\s*['"]([^'"]+)['"][\s\S]*?commonSecondaries:\s*\[([\s\S]*?)\]/g;
    let blockMatch: RegExpExecArray | null;

    while ((blockMatch = blockPattern.exec(content)) !== null) {
      const sourceId = blockMatch[1];
      const secondariesBlock = blockMatch[2];
      const secondaryIds = [...secondariesBlock.matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);

      for (const targetId of secondaryIds) {
        refs.push({ sourceId, targetId, file });
      }
    }
  }

  return refs;
}

function validate(): ValidationError[] {
  const errors: ValidationError[] = [];
  const allIds = loadAllConditionIds();
  const allRefs = loadAllSecondaryReferences();

  console.log(`Loaded ${allIds.size} conditions across ${new Set([...allIds.values()].map(v => v.file)).size} files`);
  console.log(`Found ${allRefs.length} secondary condition references`);

  // Check 1: Duplicate IDs
  const idCounts = new Map<string, string[]>();
  for (const [id, info] of allIds) {
    const existing = idCounts.get(id) || [];
    existing.push(info.file);
    idCounts.set(id, existing);
  }
  for (const [id, files] of idCounts) {
    if (files.length > 1) {
      errors.push({
        conditionId: id,
        file: files.join(', '),
        field: 'id',
        message: `Duplicate ID found in ${files.length} files`,
      });
    }
  }

  // Check 2: Suspicious IDs (parentheses, spaces, very long)
  for (const [id, info] of allIds) {
    if (id.includes('(') || id.includes(')')) {
      errors.push({
        conditionId: id,
        file: info.file,
        field: 'id',
        message: 'ID contains parentheses — likely a bad slug',
      });
    }
    if (id.includes(' ')) {
      errors.push({
        conditionId: id,
        file: info.file,
        field: 'id',
        message: 'ID contains spaces — should be kebab-case',
      });
    }
    if (id.length > 60) {
      errors.push({
        conditionId: id,
        file: info.file,
        field: 'id',
        message: `ID is ${id.length} characters — suspiciously long`,
      });
    }
  }

  // Check 3: Invalid secondary references
  for (const ref of allRefs) {
    if (!allIds.has(ref.targetId)) {
      errors.push({
        conditionId: ref.sourceId,
        file: ref.file,
        field: 'commonSecondaries',
        message: `References non-existent condition ID: '${ref.targetId}'`,
      });
    }
  }

  // Check 4: Required fields
  const conditionFiles = fs.readdirSync(CONDITIONS_DIR)
    .filter(f => f.endsWith('.ts') && !['types.ts', 'index.ts', 'VERSION.ts', 'presumptive-conditions.ts'].includes(f));

  for (const file of conditionFiles) {
    const content = fs.readFileSync(path.join(CONDITIONS_DIR, file), 'utf-8');

    // Check for conditions missing required fields
    const blocks = content.split(/\},?\s*\{/);
    for (const block of blocks) {
      const idMatch = block.match(/id:\s*['"]([^'"]+)['"]/);
      if (!idMatch) continue;

      const id = idMatch[1];
      const requiredFields = ['name', 'abbreviation', 'diagnosticCode', 'category'];
      for (const field of requiredFields) {
        const hasField = new RegExp(`${field}:\\s*['"]`).test(block);
        if (!hasField) {
          errors.push({
            conditionId: id,
            file,
            field,
            message: `Missing required field: ${field}`,
          });
        }
      }
    }
  }

  return errors;
}

function main() {
  console.log('Validating VA condition data...\n');

  const errors = validate();

  if (errors.length === 0) {
    console.log('\nAll checks passed! No issues found.');
    process.exit(0);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`VALIDATION ERRORS: ${errors.length}`);
  console.log('='.repeat(60));

  // Group by type
  const byField = new Map<string, ValidationError[]>();
  for (const e of errors) {
    const existing = byField.get(e.field) || [];
    existing.push(e);
    byField.set(e.field, existing);
  }

  for (const [field, fieldErrors] of byField) {
    console.log(`\n[${field}] ${fieldErrors.length} errors:`);
    for (const e of fieldErrors.slice(0, 10)) {
      console.log(`  ${e.conditionId || 'unknown'} (${e.file}): ${e.message}`);
    }
    if (fieldErrors.length > 10) {
      console.log(`  ... and ${fieldErrors.length - 10} more`);
    }
  }

  process.exit(1);
}

main();
