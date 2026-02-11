# VCS 2026 Premium Overhaul — TODO

## UI/Design: Spatial Glass + Gold Accent System
- [x] Define gold CSS tokens (--gold-hl, --gold-md, --gold-dk, gradients, glow, borders)
- [x] Wire gold tokens into Tailwind config (colors.gold.*, backgroundImage.gold)
- [x] Splash screen "The Lens" (blur-in, lens sweep, gold dots, dissolve exit)
- [x] CSS-only splash fallback for iOS WebViews
- [x] Gold focus-visible states globally
- [x] Gold nav active indicators (sidebar, bottom tab, tab bar)
- [x] Gold milestone badges and toasts
- [x] Gold rating cards (header, bilateral badge, text-shadow)
- [x] Gold progress bars and rings (variant prop)
- [x] Gold button variant (cva)
- [x] Gold onboarding (progress dots, logo glow, CTA, step icons)
- [x] Gold sidebar premium tools group
- [x] Audit and remove ALL Tailwind yellow/amber — replaced with gold tokens (11 files)
- [x] Gold person icons (onboarding + dashboard avatar)
- [x] Gold VCS header text
- [x] Gold dashboard tool grid icons
- [x] Gold combined rating ring stroke
- [x] Convert blue (#3B82F6/blue-500) to gold — 30+ primary files converted (59 remaining in secondary/landing files)
- [x] Glass surface treatment: multi-layer blur (8px, 16px, 24px tiers) — CSS classes added
- [x] Bento grid layouts with consistent gutters and radii 18-22 — CSS classes added
- [x] Replace LoadingFallback "V" box with app-icon.png (DONE in code, needs deploy)
- [ ] Hairline luminous borders (8-12% white) on cards
- [ ] Convert remaining 59 blue instances in secondary/landing files

## Functionality/QA: Full Audit
- [x] All 410 route smoke tests pass
- [x] TypeScript compiles with 0 errors
- [x] ESLint passes clean
- [x] Production build succeeds
- [x] ConditionAutocomplete fixed for light mode (was invisible)
- [ ] Verify every form submit with validations and error states
- [ ] Verify every export/output feature works (PDF, .txt downloads)
- [ ] Verify all external links open correctly
- [ ] Eliminate silent failures — all errors must show user-facing state
- [ ] Check all buttons have real effects (no stubs)

## Search + Autocomplete
- [x] ConditionAutocomplete: full search by name, code, keyword with dropdown
- [x] Deployment location autocomplete: LocationAutocomplete wired to militaryBases.ts (Onboarding, ServiceHistory, Exposures)
- [ ] Verify C&P Exam Prep search filters conditions correctly on mobile
- [ ] Ensure all search bars provide type-ahead where applicable

## Condition Rating Guidance (NEW FEATURE)
- [x] Expand rating criteria data — 51 conditions with per-percentage levels (src/data/ratingCriteria.ts, 2110 lines)
- [x] Create RatingGuidance component (bento card/accordion per condition)
- [x] Wire into ConditionDetail page — lazy-loaded, shows rating criteria when condition selected
- [x] Include CFR citation links for transparency (eCFR links on every condition)
- [x] Add educational disclaimer (not legal advice, ratings decided by VA adjudicators)

## Appeals + Case Law (NEW FEATURE)
- [x] Create curated database of 31+ verified BVA/CAVC/Fed Circuit precedent cases (src/data/appealsData.ts)
- [x] Build Appeals Guide page explaining 6 appeal lanes (HLR, Board Appeal x3, Supplemental, CAVC)
- [x] Build "Find Case Law" search UI (by condition, keywords, topic filters)
- [x] Display: case name/citation, holding, court, year, verified badge, source link
- [x] PDF export for case law results (jsPDF with formatted layout)
- [x] Hallucination prevention: retrieval-first, no LLM-invented citations
- [x] "Accuracy mode" UI note: "Only verified sources shown"
- [x] Strong disclaimers (not legal advice, verify with official sources, consult attorney)
- [x] Route added at /prep/appeals, linked from PrepHub and MobileHeader

## Exports
- [ ] Verify PDF export works end-to-end
- [x] Case law results exportable to PDF
- [ ] VSO summary export works

## Compliance + Privacy
- [x] Legal disclaimers present on rating guidance
- [x] Legal disclaimers present on case law/appeals
- [ ] Not represented as official VA tool
- [ ] No unnecessary PII collection
- [ ] Local storage behavior confirmed
- [ ] Data handling aligns with app privacy claims

## Performance + Accessibility
- [x] prefers-reduced-motion fallback on splash screen
- [x] ARIA roles on progress components
- [x] ARIA combobox on LocationAutocomplete (role=combobox, listbox, aria-activedescendant)
- [x] Keyboard navigation on LocationAutocomplete and RatingGuidance
- [ ] WCAG contrast check on gold text against dark backgrounds
- [ ] Screen reader testing on rating guidance and appeals features
