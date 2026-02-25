/**
 * Design System Consistency Tests (Sections 25A-25D)
 *
 * Static analysis tests that verify design system consistency across the
 * codebase: background colors, icon library usage, and CSS/component
 * patterns.
 */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const srcDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(srcDir, '..');

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

function getAllCssFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
      files.push(...getAllCssFiles(full));
    } else if (/\.css$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// Section 25A: Background Color
// ---------------------------------------------------------------------------

describe('Section 25A: Background Color', () => {
  it('background color #000000 appears in the codebase (index.css or tailwind config)', () => {
    const indexCssPath = path.join(srcDir, 'index.css');
    const tailwindConfigPath = path.join(rootDir, 'tailwind.config.ts');

    let found = false;

    if (fs.existsSync(indexCssPath)) {
      const css = fs.readFileSync(indexCssPath, 'utf-8');
      if (css.includes('#000000') || css.includes('#000')) {
        found = true;
      }
    }

    if (!found && fs.existsSync(tailwindConfigPath)) {
      const tw = fs.readFileSync(tailwindConfigPath, 'utf-8');
      if (tw.includes('#000000') || tw.includes("'#000000'") || tw.includes('"#000000"')) {
        found = true;
      }
    }

    expect(found).toBe(true);
  });

  it('body background-color is set to #000000 in index.css', () => {
    const cssPath = path.join(srcDir, 'index.css');
    expect(fs.existsSync(cssPath)).toBe(true);

    const css = fs.readFileSync(cssPath, 'utf-8');
    // Match body { ... background-color: #000000 ... }
    const bodyBlockMatch = css.match(/body\s*\{[^}]*\}/s);
    expect(bodyBlockMatch).not.toBeNull();
    expect(bodyBlockMatch![0]).toMatch(/background-color\s*:\s*#000000/);
  });
});

// ---------------------------------------------------------------------------
// Section 25B: No Random Color Usage in Buttons
// ---------------------------------------------------------------------------

describe('Section 25B: No Random Inline Color Usage in Buttons', () => {
  it('no .tsx component uses arbitrary inline hex colors on <button> elements', () => {
    const files = getAllTsFiles(srcDir).filter((f) => f.endsWith('.tsx'));

    // Scan line-by-line for <button elements that have inline style with
    // arbitrary hex colors. We do this per-line to avoid cross-element false
    // positives. System colors (#000000, #ffffff, #000, #fff) are allowed.
    const violations: { file: string; line: number; text: string }[] = [];

    for (const filePath of files) {
      if (filePath.includes('__tests__') || filePath.includes('.test.')) continue;
      const lines = fs.readFileSync(filePath, 'utf-8').split('\n');

      let insideButton = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/<button\b/.test(line)) insideButton = true;
        if (insideButton) {
          // Check for inline style hex that is not a system color
          const hexMatch = line.match(
            /style\s*=\s*\{\s*\{[^}]*(?:background(?:Color)?|color)\s*:\s*['"]#([0-9a-fA-F]{3,8})['"]/,
          );
          if (hexMatch) {
            const hex = hexMatch[1].toLowerCase();
            const allowed = ['000000', 'ffffff', '000', 'fff'];
            if (!allowed.includes(hex)) {
              violations.push({ file: filePath, line: i + 1, text: line.trim() });
            }
          }
        }
        // Reset when the element closes (simplistic: look for > at end)
        if (insideButton && />/.test(line)) insideButton = false;
      }
    }

    expect(violations).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Section 25C: Icon Library
// ---------------------------------------------------------------------------

describe('Section 25C: Icon Library', () => {
  it('lucide-react is listed as a dependency in package.json', () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'),
    );
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
    expect(allDeps).toHaveProperty('lucide-react');
  });

  it('at least one source file imports from lucide-react', () => {
    const files = getAllTsFiles(srcDir);
    const hasImport = files.some((f) => {
      const content = fs.readFileSync(f, 'utf-8');
      return /from\s+['"]lucide-react['"]/.test(content);
    });
    expect(hasImport).toBe(true);
  });

  it('no source file imports from competing icon libraries (font-awesome, heroicons, material-icons)', () => {
    const competing = [
      /from\s+['"]@fortawesome\//,
      /from\s+['"]font-awesome/,
      /from\s+['"]@heroicons\//,
      /from\s+['"]@mui\/icons-material/,
      /from\s+['"]react-icons\//,
    ];

    const files = getAllTsFiles(srcDir);
    const violations: { file: string; lib: string }[] = [];

    for (const filePath of files) {
      if (filePath.includes('__tests__') || filePath.includes('.test.')) continue;
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const pat of competing) {
        if (pat.test(content)) {
          violations.push({ file: filePath, lib: pat.source });
        }
      }
    }

    expect(violations).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Section 25D: Design Tokens and CSS Structure
// ---------------------------------------------------------------------------

describe('Section 25D: Design Tokens and CSS Structure', () => {
  it('tailwind.config.ts exists', () => {
    expect(fs.existsSync(path.join(rootDir, 'tailwind.config.ts'))).toBe(true);
  });

  it('tailwind config uses CSS custom properties via hsl(var(--...)) for core colors', () => {
    const tw = fs.readFileSync(path.join(rootDir, 'tailwind.config.ts'), 'utf-8');
    // Verify the design system uses CSS custom properties, not hardcoded hex
    expect(tw).toMatch(/hsl\(var\(--background\)\)/);
    expect(tw).toMatch(/hsl\(var\(--foreground\)\)/);
    expect(tw).toMatch(/hsl\(var\(--primary\)\)/);
  });

  it('CSS files exist in src/', () => {
    const cssFiles = getAllCssFiles(srcDir);
    expect(cssFiles.length).toBeGreaterThan(0);
  });

  it('design-tokens.css is imported', () => {
    const indexCss = fs.readFileSync(path.join(srcDir, 'index.css'), 'utf-8');
    expect(indexCss).toMatch(/design-tokens\.css/);
  });

  it('dark mode is configured in tailwind config', () => {
    const tw = fs.readFileSync(path.join(rootDir, 'tailwind.config.ts'), 'utf-8');
    expect(tw).toMatch(/darkMode/);
  });
});
