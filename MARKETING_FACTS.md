# Marketing Facts Foundation — Vet Claim Support

_Every claim below is verified against the codebase. Last updated: 2026-02-26._
_Rating: CAN USE = verified true in code. SOFTEN = partially true. CANNOT USE = not true._

---

## Platform Statements

| Statement | Rating | Evidence |
|-----------|--------|----------|
| "Available on iOS and web" | CAN USE | Capacitor iOS config + PWA manifest |
| "Works completely offline" | CAN USE | Workbox service worker, local-first storage |
| "No browser extension required" | CAN USE | Native app + PWA, no extension |
| "Works from day one — no existing VA file needed" | CAN USE | Onboarding works without VA account |

## Privacy Statements

| Statement | Rating | Evidence |
|-----------|--------|----------|
| "Your health data is encrypted on your device" | CAN USE | AES-256-GCM in `encryption.ts`, all stores use `encryptedStorage` |
| "No third parties can access your health information" | CAN USE | No analytics SDKs, no data sharing, local-first |
| "You can delete all your data at any time" | CAN USE | `DeleteAccountPage.tsx`, cascade delete in `delete-user` edge function |
| "We never read your VA.gov account" | CAN USE | No VA.gov integration or scraping anywhere in codebase |
| "No browser extensions required" | CAN USE | Native iOS + PWA, zero browser extension code |
| "Zero third-party tracking or analytics" | CAN USE | No GA, Mixpanel, Amplitude, or any analytics SDK in dependencies |
| "Military-grade encryption" | SOFTEN | AES-256-GCM is strong but "military-grade" is a marketing term. Use "AES-256 encryption" instead. |

## Value Statements

| Statement | Rating | Evidence |
|-----------|--------|----------|
| "821 VA conditions in the database" | CAN USE | Counted across all `src/data/conditions/` files |
| "856 deployment locations with hazard mapping" | CAN USE | Counted across all `src/data/deployment-locations/` files |
| "708 secondary condition relationships" | CAN USE | Counted in `src/data/secondaryConditions.ts` |
| "4 statement types" | CAN USE | Personal, buddy, stressor, doctor summary |
| "3 benefit calculators" | CAN USE | Combined rating, back pay, travel pay |
| "58 screens and tools" | CAN USE | Route count in `App.tsx` |
| "1,255 automated tests" | CAN USE | Vitest run output |

## Competitive Statements (vs TurboVets)

| Statement | Rating | Evidence |
|-----------|--------|----------|
| "Mobile app vs Chrome-only extension" | CAN USE | iOS Capacitor + PWA vs Chrome extension |
| "Works offline vs requires VA.gov session" | CAN USE | Workbox offline vs VA.gov scraping |
| "Works for new veterans vs requires existing VA file" | CAN USE | No VA.gov dependency |
| "Health tracking built in" | CAN USE | 6 health trackers (symptoms, sleep, migraines, meds, visits, exposures) |
| "856 deployment locations vs VA-only data" | CAN USE | Comprehensive location database |
| "Condition-specific exam prep" | CAN USE | `CPExamPrepEnhanced.tsx` with condition-specific guidance |
| "AI-powered claim analysis" | CAN USE | Gemini integration via `useGemini.ts` |
| "4 statement builders vs none" | CAN USE | Personal, buddy, stressor, doctor summary |

## Feature Claims

| Statement | Rating | Evidence |
|-----------|--------|----------|
| "Compensation Ladder showing pay at every 10% step" | CAN USE | `UnifiedRatingCalculator.tsx` compensation ladder section |
| "Automatic bilateral factor detection and calculation" | CAN USE | `UnifiedRatingCalculator.tsx` bilateral logic |
| "Claim regression detection" | CAN USE | `ClaimJourney.tsx` ClaimStatusTracker component |
| "Lifetime benefit projection" | CAN USE | `UnifiedRatingCalculator.tsx` LifetimeBenefitProjection component |
| "Interactive body map" | CAN USE | `BodyMap.tsx` with SVG regions |
| "C&P exam prep with condition-specific questions" | CAN USE | `CPExamPrepEnhanced.tsx` |
| "VA Speak translator powered by AI" | CAN USE | `VASpeakTranslator.tsx` + Gemini |
| "Appeals guide with case law" | CAN USE | `AppealsGuide.tsx` with `appealsCaseMatching.ts` |
| "Document vault with OCR" | CAN USE | `DocumentsHub.tsx` + Tesseract.js |
| "Intent to file deadline tracking" | CAN USE | `IntentToFile.tsx` with countdown |

## Statements to Avoid

| Statement | Rating | Reason |
|-----------|--------|--------|
| "Guaranteed to increase your rating" | CANNOT USE | No guarantees — this is a preparation tool |
| "Replaces a VSO or attorney" | CANNOT USE | App explicitly disclaims legal advice |
| "Medical advice for your conditions" | CANNOT USE | App explicitly disclaims medical advice |
| "Files claims directly with the VA" | CANNOT USE | App does not file or communicate with VA |
| "HIPAA compliant" | CANNOT USE | Not a covered entity; follows HIPAA principles but not certified |
| "Approved by the VA" | CANNOT USE | No VA endorsement or approval |

---

_This document is the single source of truth for all marketing claims.
No landing page, store listing, or advertisement should make claims
not listed here as "CAN USE"._
