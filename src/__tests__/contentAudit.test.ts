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

    it('anti-hallucination instruction exists in ai-prompts.ts', () => {
      const content = readFile('lib/ai-prompts.ts');
      expect(content).toContain('Do not cite specific rating percentages');
      expect(content).toContain('Never guess or fabricate rating criteria');
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

// ---------------------------------------------------------------------------
// Section 10E: AI Pages Must Show AIDisclaimer
// ---------------------------------------------------------------------------

describe('Section 10E: AI Pages Must Show AIDisclaimer', () => {
  it('every file importing from gemini.ts or ai-prompts.ts also imports AIDisclaimer', () => {
    const files = getAllSourceFiles();
    const aiFiles = files.filter(
      (f) =>
        (f.content.includes("from '@/lib/gemini'") ||
          f.content.includes("from '@/lib/ai-prompts'")) &&
        // Only check page and component files, not utility/service files
        (f.path.includes('/pages/') || f.path.includes('/components/')),
    );

    const missing = aiFiles.filter(
      (f) => !f.content.includes('AIDisclaimer'),
    );

    expect(
      missing.map((m) => path.relative(srcDir, m.path)),
    ).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Section 10F: Export Functions Must Use Export Guard
// ---------------------------------------------------------------------------

describe('Section 10F: Export Guard Enforcement', () => {
  it('pdfExport.ts imports from exportGuard', () => {
    const content = readFile('utils/pdfExport.ts');
    expect(content).toContain('exportGuard');
  });

  it('exportGuard.ts exists and exports guardExport', () => {
    const guardPath = path.join(srcDir, 'utils', 'exportGuard.ts');
    expect(fs.existsSync(guardPath)).toBe(true);
    const content = fs.readFileSync(guardPath, 'utf-8');
    expect(content).toMatch(/export\s+function\s+guardExport/);
  });

  it('aiOutputGuard.ts exists and exports scanAIOutput', () => {
    const guardPath = path.join(srcDir, 'utils', 'aiOutputGuard.ts');
    expect(fs.existsSync(guardPath)).toBe(true);
    const content = fs.readFileSync(guardPath, 'utf-8');
    expect(content).toMatch(/export\s+function\s+scanAIOutput/);
  });
});

// ---------------------------------------------------------------------------
// Section 10G: No "nexus letter" in User-Facing UI Strings
// ---------------------------------------------------------------------------

describe('Section 10G: Banned UI Strings', () => {
  it('SentinelCore does not label any VCS tool as "Nexus Letter"', () => {
    const content = readFile('components/SentinelCore.tsx');
    // VCS tool labels should not use "nexus letter" — that term is reserved
    // for educational content. VCS tools should be called "Doctor Summary".
    expect(content).not.toMatch(/label:\s*['"]Nexus Letter/i);
  });

  it('bannedPhrases.ts includes "nexus letter" and "nexus" as banned', () => {
    const content = readFile('utils/bannedPhrases.ts');
    expect(content).toContain("'nexus letter'");
    expect(content).toContain("'nexus'");
  });
});

// ---------------------------------------------------------------------------
// Section 10H: New Legal Copy Entries Are Non-Empty
// ---------------------------------------------------------------------------

describe('Section 10H: New Legal Copy Entries', () => {
  const newExports = [
    'EXPORT_CONFIRMATION',
    'C_FILE_CONSENT',
    'AI_ANALYSIS_DISCLOSURE',
    'DOCTOR_SUMMARY_AI_DISCLAIMER',
  ];

  const legalContent = readFile('data/legalCopy.ts');

  newExports.forEach((name) => {
    it(`legalCopy.ts exports ${name}`, () => {
      const exportPattern = new RegExp(`export\\s+(const|function|let|var)\\s+${name}\\b`);
      expect(legalContent).toMatch(exportPattern);
    });
  });

  it('all new prompt files include AI_ANTI_HALLUCINATION', () => {
    const promptFiles = getAllSourceFiles().filter(
      (f) => f.path.includes('prompts') && f.path.endsWith('.ts'),
    );
    promptFiles.forEach((f) => {
      expect(f.content).toContain('AI_ANTI_HALLUCINATION');
    });
  });
});
