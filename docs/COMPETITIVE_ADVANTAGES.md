# Competitive Advantages — Vet Claim Support vs TurboVets

_All claims verified against the codebase. Last updated: 2026-02-26._

## Platform Comparison

| Feature | Vet Claim Support | TurboVets |
|---------|-------------------|-----------|
| **Platform** | iOS + Web (PWA) | Chrome extension only |
| **Offline** | Full offline support | Requires VA.gov session |
| **New veterans** | Works from day one | Requires existing VA file |
| **Data dependency** | Self-contained | Scrapes VA.gov (fragile) |
| **Privacy** | Local-first, encrypted | Browser extension permissions |
| **Stability** | Native app + PWA | Dependent on VA.gov DOM |

## Feature-by-Feature Superiority

### 1. Compensation Ladder
**Status: IMPLEMENTED** (`src/components/UnifiedRatingCalculator.tsx`)
- Visual bar chart showing monthly pay at every 10% step (10%-100%)
- 2026 VA rates with COLA applied
- Bilateral factor automatically applied
- Dependent combinations at every level
- "Next milestone" callout with monthly/annual delta
- Lifetime benefit projection with age-based estimates

### 2. 0% Condition Optimizer
**Status: IMPLEMENTED** (`src/components/RatingGuidance.tsx`, `src/pages/ConditionDetail.tsx`)
- VA rating criteria displayed at every level (0% through 100%)
- Rating level cards with exam tips and common mistakes
- 821 conditions in database with rating criteria
- C&P exam preparation guidance per condition

### 3. Claim Phase Regression Detector
**Status: IMPLEMENTED** (`src/pages/ClaimJourney.tsx`)
- Full VA claim status tracker with 8 processing phases
- Automatic regression detection when claim moves backward
- Plain-English alerts explaining what backward movement means
- Time-in-phase tracking vs. VA average processing times
- Overdue alerts when phase exceeds 1.5x VA average
- Status history log with visual regression indicators

### 4. DBQ Form Matcher
**Status: IMPLEMENTED** (`src/data/vaResources/dbqReference.ts`, `src/pages/ConditionDetail.tsx`)
- DBQ forms mapped to conditions
- Form numbers and names
- Key questions and prep tips per DBQ
- Integrated into condition detail pages

### 5. Shareable Summary Cards
**Status: IMPLEMENTED** (`src/pages/BuildPacket.tsx`, `src/services/exportEngine.ts`)
- Comprehensive claims summary with all conditions, ratings, evidence
- PDF export via jsPDF
- Native share sheet integration (navigator.share)
- Email export support
- Evidence strength scoring (0-100%)
- Clearly labeled as NOT an official VA document

### 6. Missing Evidence Alert System
**Status: IMPLEMENTED** (`src/hooks/useSmartReminders.ts`, `src/pages/BuildPacket.tsx`)
- Document status tracking per condition (Not Started, In Progress, Obtained, Submitted)
- Smart reminders for missing documentation
- Evidence strength scoring in claim packet builder
- Reminder priorities (high/medium) for approaching deadlines

### 7. Deadline Intelligence Engine
**Status: IMPLEMENTED** (`src/pages/IntentToFile.tsx`, `src/hooks/useSmartReminders.ts`)
- ITF 1-year expiration tracking with countdown
- Color-coded status (red=expired, orange=expiring, green=active)
- BDD countdown (180-90 days before separation)
- Appeal deadline awareness
- Smart reminders for all deadline types

### 8. Bilateral Factor Engine
**Status: IMPLEMENTED** (`src/components/UnifiedRatingCalculator.tsx`, `src/utils/vaMath.ts`)
- Automatic bilateral pair detection for all paired extremities
- Correct 38 CFR 4.26 calculation (combine bilateral, add 10%, combine with non-bilateral)
- Visual "Bilateral" badges on paired conditions
- Educational tooltip explaining what the bilateral factor is and why it matters
- Gold-highlighted bilateral conditions in the UI

## Unique to Vet Claim Support (Not in TurboVets)

| Feature | Description | Files |
|---------|-------------|-------|
| **Health Tracking** | Symptom journal, sleep tracker, migraine log, medication tracker | `src/pages/Symptoms.tsx`, `Sleep.tsx`, `Migraines.tsx`, `Medications.tsx` |
| **Body Map** | Interactive SVG body mapping with severity logging | `src/pages/BodyMap.tsx` |
| **AI-Powered Analysis** | Gemini-powered claim strategy, VA Speak translator | `src/hooks/useGemini.ts`, `src/pages/VASpeakTranslator.tsx` |
| **Statement Builder** | Personal, buddy, stressor, and doctor summary generators | 4 statement pages |
| **C&P Exam Prep** | Condition-specific exam preparation with rating criteria | `src/pages/CPExamPrepEnhanced.tsx` |
| **Deployment Intelligence** | 856 locations with hazard mapping and condition linkage | `src/data/deployment-locations/` |
| **Condition Database** | 821 VA conditions with diagnostic codes and rating criteria | `src/data/conditions/` |
| **Secondary Conditions** | 708 primary-to-secondary relationships with medical nexus | `src/data/secondaryConditions.ts` |
| **Appeals Case Law** | Verified case law database with condition matching | `src/pages/AppealsGuide.tsx` |
| **Offline-First** | Full functionality without internet | PWA + Workbox |
| **AES-256 Encryption** | All data encrypted at rest on device | `src/utils/encryption.ts` |
| **Lifetime Benefit Projection** | Age-based lifetime compensation projection | `src/components/UnifiedRatingCalculator.tsx` |

## Summary

- **Mobile-first** vs Chrome-only
- **Offline** vs requires VA.gov session
- **Pre-claim veterans** vs requires existing VA file
- **Health tracking** vs none
- **Deployment intelligence** (856 locations) vs VA-only exposure data
- **Exam preparation** (condition-specific) vs placeholder FAQ
- **Statement building** (4 types) vs none
- **Condition education** (821 conditions) vs none
- **AES-256 encryption** vs browser extension storage
- **Self-contained** vs web scraper dependency on VA.gov DOM changes
