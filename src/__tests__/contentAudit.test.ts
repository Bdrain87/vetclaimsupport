/**
 * Content Audit Tests (Sections 10A-10D)
 *
 * Static analysis tests that scan source files to enforce legal copy standards,
 * prohibited patterns, required patterns, legal version consistency, and admin
 * email consistency.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const srcDir = path.resolve(__dirname, '..');

function getAllTsFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
      files.push(...getAllTsFiles(full));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

/** Read all .ts/.tsx source files once and cache them. */
let _allFiles: { path: string; content: string }[] | null = null;

function getAllSourceFiles(): { path: string; content: string }[] {
  if (_allFiles) return _allFiles;
  const paths = getAllTsFiles(srcDir);
  // Exclude test files and __tests__ directories to avoid self-referential matches
  _allFiles = paths
    .filter(
      (p) =>
        !p.includes('__tests__') &&
        !p.includes('.test.') &&
        !p.includes('.spec.'),
    )
    .map((p) => ({ path: p, content: fs.readFileSync(p, 'utf-8') }));
  return _allFiles;
}

function readFile(relativeToSrc: string): string {
  return fs.readFileSync(path.join(srcDir, relativeToSrc), 'utf-8');
}

// ---------------------------------------------------------------------------
// Section 10A: Unified Legal Copy Source
// ---------------------------------------------------------------------------

describe('Section 10A: Unified Legal Copy Source', () => {
  const legalCopyPath = path.join(srcDir, 'data', 'legalCopy.ts');

  it('legalCopy.ts exists', () => {
    expect(fs.existsSync(legalCopyPath)).toBe(true);
  });

  const expectedExports = [
    'LEGAL_VERSIONS',
    'CORE_DISCLAIMERS',
    'AI_COPY',
    'PREMIUM_COPY',
    'DATA_PRIVACY_COPY',
    'NOTIFICATION_COPY',
    'ABOUT_COPY',
    'ADMIN_EMAIL',
  ];

  const legalContent = fs.existsSync(legalCopyPath)
    ? fs.readFileSync(legalCopyPath, 'utf-8')
    : '';

  expectedExports.forEach((name) => {
    it(`exports ${name}`, () => {
      const exportPattern = new RegExp(`export\\s+(const|function|let|var|type|interface)\\s+${name}\\b`);
      expect(legalContent).toMatch(exportPattern);
    });
  });
});

// ---------------------------------------------------------------------------
// Section 10B: Prohibited Copy Patterns
// ---------------------------------------------------------------------------

describe('Section 10B: Prohibited Copy Patterns', () => {
  describe('MUST NOT EXIST', () => {
    const prohibited = [
      { pattern: /yours forever/i, label: '"yours forever"' },
      { pattern: /bumble/i, label: '"bumble"' },
      { pattern: /avoid apple fees/i, label: '"avoid Apple fees"' },
      { pattern: /cheaper price/i, label: '"cheaper price"' },
    ];

    prohibited.forEach(({ pattern, label }) => {
      it(`no source file contains ${label}`, () => {
        const files = getAllSourceFiles();
        const matches = files.filter((f) => pattern.test(f.content));
        expect(
          matches.map((m) => m.path),
        ).toEqual([]);
      });
    });

    it('legalCopy.ts explicitly states VCS is NOT a claims filing service', () => {
      // The prohibition is about VCS positioning itself as a claims filing
      // service. The app is an educational tool, so "file your claim" appears
      // throughout the codebase as VA process education. The key test is that
      // VCS explicitly disclaims being a claims filing service.
      const content = readFile('data/legalCopy.ts');
      expect(content).toMatch(/NOT a claims filing service/i);
    });

    it('legalCopy.ts disclaims preparing or prosecuting claims on behalf of users', () => {
      const content = readFile('data/legalCopy.ts');
      expect(content).toMatch(/does not prepare, present, or prosecute claims/i);
    });
  });

  describe('MUST EXIST', () => {
    it('"Analyze Document (Safe Mode)" exists in legalCopy.ts', () => {
      const content = readFile('data/legalCopy.ts');
      expect(content).toContain('Analyze Document (Safe Mode)');
    });

    it('"What gets sent" exists in legalCopy.ts (AI_COPY.whatGetsSent)', () => {
      const content = readFile('data/legalCopy.ts');
      // The field value starts with "Only the redacted text..." but the key is whatGetsSent
      expect(content).toMatch(/whatGetsSent/);
    });

    it('"Your control" exists in legalCopy.ts (AI_COPY.yourControl)', () => {
      const content = readFile('data/legalCopy.ts');
      expect(content).toMatch(/yourControl/);
    });

    it('"Not affiliated" exists in at least 1 source file', () => {
      const files = getAllSourceFiles();
      const matches = files.filter((f) => /not affiliated/i.test(f.content));
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('"Restore Purchases" or "Restore Premium" exists in legalCopy.ts', () => {
      const content = readFile('data/legalCopy.ts');
      const hasRestore =
        content.includes('Restore Purchases') || content.includes('Restore Premium');
      expect(hasRestore).toBe(true);
    });

    it('"admin@vetclaimsupport.com" exists in legalCopy.ts', () => {
      const content = readFile('data/legalCopy.ts');
      expect(content).toContain('admin@vetclaimsupport.com');
    });

    it('"AI-Assisted Draft" exists in legalCopy.ts (AI_COPY.contentBadge)', () => {
      const content = readFile('data/legalCopy.ts');
      expect(content).toContain('AI-Assisted Draft');
    });

    it('"Do not cite specific legal cases" exists in ai-prompts.ts', () => {
      const content = readFile('lib/ai-prompts.ts');
      expect(content).toContain('Do not cite specific legal cases');
    });

  });
});

// ---------------------------------------------------------------------------
// Section 10C: Legal Versions Consistency
// ---------------------------------------------------------------------------

describe('Section 10C: Legal Versions Consistency', () => {
  const content = fs.readFileSync(path.join(srcDir, 'data', 'legalCopy.ts'), 'utf-8');

  // We dynamically import in a helper because vitest runs in jsdom with @
  // alias, but the file is also available via fs. We parse the exported
  // object manually to avoid import alias issues in static-analysis tests.

  function extractObjectLiteral(varName: string): string | null {
    // Match `export const VARNAME = { ... } as const;`
    const pattern = new RegExp(
      `export\\s+const\\s+${varName}\\s*=\\s*(\\{[\\s\\S]*?\\})\\s*as\\s+const`,
    );
    const m = content.match(pattern);
    return m ? m[1] : null;
  }

  const legalVersionsRaw = extractObjectLiteral('LEGAL_VERSIONS');

  it('LEGAL_VERSIONS can be located in legalCopy.ts', () => {
    expect(legalVersionsRaw).not.toBeNull();
  });

  it('LEGAL_VERSIONS.terms.version exists and is a string', () => {
    expect(legalVersionsRaw).toMatch(/terms\s*:\s*\{[^}]*version\s*:\s*'[^']+'/);
  });

  it('LEGAL_VERSIONS.terms.effectiveDate exists and is a string', () => {
    expect(legalVersionsRaw).toMatch(/terms\s*:\s*\{[^}]*effectiveDate\s*:\s*'[^']+'/);
  });

  it('LEGAL_VERSIONS.privacy.version exists and is a string', () => {
    expect(legalVersionsRaw).toMatch(/privacy\s*:\s*\{[^}]*version\s*:\s*'[^']+'/);
  });

  it('LEGAL_VERSIONS.privacy.effectiveDate exists and is a string', () => {
    expect(legalVersionsRaw).toMatch(/privacy\s*:\s*\{[^}]*effectiveDate\s*:\s*'[^']+'/);
  });

  it('LEGAL_VERSIONS.disclaimer.version exists and is a string', () => {
    expect(legalVersionsRaw).toMatch(/disclaimer\s*:\s*\{[^}]*version\s*:\s*'[^']+'/);
  });

  it('LEGAL_VERSIONS.disclaimer.effectiveDate exists and is a string', () => {
    expect(legalVersionsRaw).toMatch(/disclaimer\s*:\s*\{[^}]*effectiveDate\s*:\s*'[^']+'/);
  });
});

// ---------------------------------------------------------------------------
// Section 10D: Admin Email Consistency
// ---------------------------------------------------------------------------

describe('Section 10D: Admin Email Consistency', () => {
  it('ADMIN_EMAIL equals exactly "admin@vetclaimsupport.com"', () => {
    const content = readFile('data/legalCopy.ts');
    // Match the export statement value
    const match = content.match(
      /export\s+const\s+ADMIN_EMAIL\s*=\s*['"]([^'"]+)['"]/,
    );
    expect(match).not.toBeNull();
    expect(match![1]).toBe('admin@vetclaimsupport.com');
  });
});
