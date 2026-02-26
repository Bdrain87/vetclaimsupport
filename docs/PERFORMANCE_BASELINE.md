# Performance Baseline — Before State

_Captured: 2026-02-26_

## Build Metrics

| Metric | Value |
|---|---|
| Build tool | Vite 7.3.1 |
| Build time | 32.48s |
| Modules transformed | 4,119 |
| PWA precache entries | 22 (998 KB) |

## Source Code Metrics

| Metric | Value |
|---|---|
| Total source files | 347 |
| TypeScript/TSX files | 339 |
| Test files | 58 |
| Total lines of code | ~107,000 |

## Quality Gates — Before

| Gate | Status |
|---|---|
| TypeScript errors | 0 |
| ESLint errors | 0 |
| ESLint warnings | 0 |
| npm vulnerabilities | 0 |
| Tests passing | 1,255 / 1,255 (100%) |
| Build | Success |

## Bundle Analysis — Before

### Critical Size Issues (>100KB)

| Chunk | Size |
|---|---|
| index-CYXUQsfn.js (main) | **895.72 KB** |
| SymptomCharts-*.js (recharts) | 386.91 KB |
| jspdf.es.min-*.js | 385.96 KB |
| vendor-*.js (React) | 264.89 KB |
| html2canvas.esm-*.js | 201.04 KB |
| supabase-*.js | 170.96 KB |
| vaDisabilities-*.js | 159.61 KB |
| index.es-*.js (DOMPurify) | 158.71 KB |
| _all-*.js (conditions) | 151.30 KB |
| secondaryConditions-*.js | 119.88 KB |
| Settings-*.js | 107.39 KB |
| militaryMOS-*.js | 103.11 KB |

### Large Page Chunks (>50KB)

| Page | Size |
|---|---|
| DoctorSummaryOutline | 94.25 KB |
| ServiceHistory | 82.67 KB |
| AppealsGuide | 75.68 KB |
| Medications | 67.59 KB |
| claimIntelligence | 55.67 KB |
| ConditionDetail | 55.01 KB |
| CPExamPrepEnhanced | 52.84 KB |

### CSS

| File | Size |
|---|---|
| index-*.css | 156.99 KB |

## Test Suite — Before

- **Test files:** 58
- **Tests:** 1,255
- **Pass rate:** 100%
- **Duration:** 30.07s
- **Known warnings:** React Router v7 future flags, act() warnings

## Dependencies — Before

| Category | Count |
|---|---|
| Production dependencies | 37 |
| Dev dependencies | 20 |
| Total installed packages | 862 |
| Vulnerabilities | 0 |

## Key Architectural Observations

1. **Single monolithic App.tsx** — entire routing tree in one file (~2700 lines)
2. **Large Zustand stores** — useAppStore holds all app data in one store
3. **895KB main chunk** — needs aggressive code splitting
4. **Recharts bundle** — 387KB, only used on one page (SymptomCharts)
5. **jsPDF** — 386KB, only used for PDF export
6. **html2canvas** — 201KB, only used for screenshots
7. **Data files** — conditions/MOS/disabilities total 500KB+, loaded eagerly
