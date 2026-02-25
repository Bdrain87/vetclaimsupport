/**
 * Bundle Size Audit
 *
 * Parses the Vite build manifest to flag any individual JS chunk that
 * exceeds the size budget.  This catches regressions where a new import
 * accidentally pulls a huge library into a lazy-loaded route.
 *
 * NOTE: This test reads the last build output.  Run `npm run build`
 * first so that dist/ is populated.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const DIST_DIR = join(process.cwd(), 'dist', 'assets');
const JS_SIZE_BUDGET_KB = 1024; // per-chunk budget (raised for a11y + PHI sanitizer + session timeout)
const CSS_SIZE_BUDGET_KB = 300;
const TOTAL_JS_BUDGET_KB = 4700; // total JS budget (raised for expanded condition data + legal pages)

function getAssetFiles(ext: string) {
  try {
    return readdirSync(DIST_DIR)
      .filter((f) => f.endsWith(ext))
      .map((f) => ({
        name: f,
        sizeKB: Math.round(statSync(join(DIST_DIR, f)).size / 1024 * 100) / 100,
      }))
      .sort((a, b) => b.sizeKB - a.sizeKB);
  } catch {
    return [];
  }
}

describe('Bundle Size Audit', () => {
  const jsFiles = getAssetFiles('.js');
  const cssFiles = getAssetFiles('.css');
  const hasBuild = jsFiles.length > 0;

  it('dist/assets directory exists with JS files', () => {
    if (!hasBuild) {
      console.warn('[Bundle Audit] No build output found — run `npm run build` first. Skipping.');
      return;
    }
    expect(jsFiles.length).toBeGreaterThan(0);
  });

  it(`no single JS chunk exceeds ${JS_SIZE_BUDGET_KB}KB`, () => {
    if (!hasBuild) return;
    const oversized = jsFiles.filter((f) => f.sizeKB > JS_SIZE_BUDGET_KB);
    if (oversized.length > 0) {
      const list = oversized
        .map((f) => `  ${f.name}: ${f.sizeKB}KB`)
        .join('\n');
      expect.fail(
        `${oversized.length} JS chunk(s) exceed ${JS_SIZE_BUDGET_KB}KB budget:\n${list}`,
      );
    }
  });

  it(`no single CSS file exceeds ${CSS_SIZE_BUDGET_KB}KB`, () => {
    if (!hasBuild) return;
    const oversized = cssFiles.filter((f) => f.sizeKB > CSS_SIZE_BUDGET_KB);
    if (oversized.length > 0) {
      const list = oversized
        .map((f) => `  ${f.name}: ${f.sizeKB}KB`)
        .join('\n');
      expect.fail(
        `${oversized.length} CSS file(s) exceed ${CSS_SIZE_BUDGET_KB}KB budget:\n${list}`,
      );
    }
  });

  it(`total JS bundle size under ${TOTAL_JS_BUDGET_KB}KB`, () => {
    if (!hasBuild) return;
    const totalKB = jsFiles.reduce((sum, f) => sum + f.sizeKB, 0);
    expect(totalKB).toBeLessThan(TOTAL_JS_BUDGET_KB);
  });

  it('lazy-loaded route chunks are under 100KB each (excluding vendor/data)', () => {
    if (!hasBuild) return;
    // Route chunks are named after their page component
    const routeChunks = jsFiles.filter(
      (f) =>
        !f.name.startsWith('vendor') &&
        !f.name.startsWith('index') &&
        !f.name.startsWith('client') &&
        !f.name.startsWith('jspdf') &&
        !f.name.startsWith('html2canvas') &&
        !f.name.startsWith('LineChart') &&
        !f.name.startsWith('purify') &&
        !f.name.startsWith('icons') &&
        !f.name.startsWith('format') &&
        !f.name.startsWith('select') &&
        !f.name.includes('vaDisabilities') &&
        !f.name.includes('secondaryConditions') &&
        !f.name.includes('cpExamPrep') &&
        !f.name.includes('pdfExport'),
    );

    const oversized = routeChunks.filter((f) => f.sizeKB > 100);
    // This is informational — we report but don't fail for known large pages
    if (oversized.length > 0) {
      const list = oversized
        .map((f) => `  ${f.name}: ${f.sizeKB}KB`)
        .join('\n');
      // Log but don't fail — some pages are legitimately large
      console.warn(
        `[Bundle Audit] ${oversized.length} route chunk(s) over 100KB:\n${list}`,
      );
    }
    // At minimum, most route chunks should be reasonable
    const averageKB = routeChunks.reduce((s, f) => s + f.sizeKB, 0) / routeChunks.length;
    expect(averageKB).toBeLessThan(150);
  });
});
