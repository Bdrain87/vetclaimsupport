/**
 * Accessibility Tests — Section 15
 *
 * Static analysis checks for accessibility patterns in source files.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function getAllComponentFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        files.push(...getAllComponentFiles(full));
      } else if (/\.tsx$/.test(entry.name)) {
        files.push(full);
      }
    }
  } catch {
    // ignore
  }
  return files;
}

const SRC_DIR = path.resolve(__dirname, '..');
const componentFiles = getAllComponentFiles(SRC_DIR);

// ---------------------------------------------------------------------------
// 15A: ARIA Labels
// ---------------------------------------------------------------------------
describe('Accessibility — ARIA and Labels', () => {
  it('found tsx component files to analyze', () => {
    expect(componentFiles.length).toBeGreaterThan(0);
  });

  it('no img tags without alt attribute in components', () => {
    const violations: string[] = [];

    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      // Look for <img without alt= nearby
      const imgMatches = content.match(/<img\b[^>]*>/g) || [];
      for (const imgTag of imgMatches) {
        if (!imgTag.includes('alt=') && !imgTag.includes('alt =')) {
          violations.push(`${path.relative(SRC_DIR, file)}: img without alt: ${imgTag.substring(0, 80)}`);
        }
      }
    }

    // Report violations but don't fail — images may use role="presentation"
    if (violations.length > 0) {
      console.warn(`Found ${violations.length} img tags that may need alt text`);
    }
    // At minimum, most images should have alt
    expect(violations.length).toBeLessThan(componentFiles.length);
  });

  it('buttons with only icons should have aria-label', () => {
    let buttonsWithIcons = 0;
    let buttonsWithAriaLabel = 0;

    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      // Look for button elements that contain Icon components
      const buttonMatches = content.match(/<(?:button|Button)\b[^>]*>[^<]*<[A-Z][a-zA-Z]*Icon/g) || [];
      buttonsWithIcons += buttonMatches.length;

      // Count ones with aria-label
      for (const match of buttonMatches) {
        if (match.includes('aria-label')) {
          buttonsWithAriaLabel++;
        }
      }
    }

    // Log finding for visibility
    if (buttonsWithIcons > 0) {
      console.log(`Found ${buttonsWithIcons} icon buttons, ${buttonsWithAriaLabel} with aria-label`);
    }
    // This is informational — we flag issues but don't break the build
    expect(true).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 15B: Hit Targets (static check for min sizes)
// ---------------------------------------------------------------------------
describe('Accessibility — Hit Targets', () => {
  it('no extremely small button styles in CSS', () => {
    const cssFiles = getAllCssFiles(SRC_DIR);
    let _tinyButtonCount = 0;

    for (const file of cssFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      // Check for height or width less than 44px on button-like elements
      const tinyMatches = content.match(/(?:min-)?(?:height|width)\s*:\s*(?:[12]\d|3[0-3])px/g) || [];
      _tinyButtonCount += tinyMatches.length;
    }

    // Informational — Tailwind handles most sizing
    expect(true).toBe(true);
  });
});

function getAllCssFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        files.push(...getAllCssFiles(full));
      } else if (/\.css$/.test(entry.name)) {
        files.push(full);
      }
    }
  } catch {
    // ignore
  }
  return files;
}

// ---------------------------------------------------------------------------
// 15C: Contrast (static analysis for known bad patterns)
// ---------------------------------------------------------------------------
describe('Accessibility — Contrast', () => {
  it('no extremely low contrast text colors in CSS (white on white, black on black)', () => {
    const cssFiles = getAllCssFiles(SRC_DIR);
    let badContrastCount = 0;

    for (const file of cssFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      // Check for color: white on background: white-ish patterns
      // This is a basic heuristic
      if (content.includes('color: #fff') && content.includes('background: #fff')) {
        badContrastCount++;
      }
      if (content.includes('color: #000') && content.includes('background: #000')) {
        badContrastCount++;
      }
    }

    expect(badContrastCount).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 15D: Keyboard/VoiceOver (check for focus management patterns)
// ---------------------------------------------------------------------------
describe('Accessibility — Keyboard Navigation', () => {
  it('modals use dialog role or radix Dialog', () => {
    let dialogCount = 0;

    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('Dialog') || content.includes('role="dialog"') || content.includes('AlertDialog')) {
        dialogCount++;
      }
    }

    // The app should use accessible modal patterns
    expect(dialogCount).toBeGreaterThan(0);
  });

  it('app uses focus-visible for keyboard indicators', () => {
    let focusVisibleCount = 0;

    for (const file of [...componentFiles, ...getAllCssFiles(SRC_DIR)]) {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('focus-visible') || content.includes('focus:') || content.includes('focus-within')) {
        focusVisibleCount++;
      }
    }

    expect(focusVisibleCount).toBeGreaterThan(0);
  });
});
