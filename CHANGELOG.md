# Changelog

All notable changes to Vet Claim Support will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- iOS native app via Capacitor with TestFlight distribution
- Premium splash screen, welcome flow, and auth page visual overhaul
- Native OAuth deep linking for Google and Apple sign-in on iOS
- Health trends tracking with historical charts
- Work impact tracker for documenting employment effects
- Export packets for organized claim evidence
- Readiness scores to gauge claim preparedness
- Dashboard Quick Log and Feature Discovery widgets
- ExamDayMode for C&P exam preparation
- Body map overlay for symptom visualization
- Vault auto-save functionality
- Reminders and streaks system
- Zustand state management with optimized selectors
- Reduced motion and accessibility support throughout
- Cross-linking between related features
- Skeleton loading states and empty state improvements
- Haptic feedback on iOS

### Changed
- Redesigned app layout: restructured routes, streamlined Dashboard, reorganized Tools
- Metallic gold visual overhaul with consistent branding
- Visual consistency: standardized logo radius, shared gradient, text opacity
- Onboarding flow reordered with BDD step added
- Console logging gated behind dev mode
- Eliminated all "Invalid Date" display across 27 files
- Improved sync engine resilience with backoff strategy
- Build target set to Safari 15 for broader compatibility

### Fixed
- Critical: stopped wiping localStorage/IndexedDB on every iOS app launch
- Session timeout data wipe on native iOS
- Infinite useEffect loop in Settings separation date auto-save
- Keyboard blocking dropdowns during iOS onboarding
- Condition ID data integrity with migration and null-safety
- OAuth sign-in bug and auth-first welcome flow
- NaN propagation across severity calculations and date formatting
- Unhandled promise rejections and hydration crashes
- Sync engine red toast spam on sync failures
- Splash screen double-fire on launch
- iOS checkout flow and mobile Safari viewport issues
- 50+ crash bugs across multiple audit sweeps
- PDF export error handling across all 20 handlers

### Security
- Secured Supabase auth tokens on native platform
- Added privacy manifest to Xcode build
- Wrapped debug code in `#if DEBUG` blocks
- Fixed accessibility attributes throughout
- Cleaned up legal disclaimers and VA non-affiliation language

## [1.0.0] - 2026-02-03

### Added
- Initial release
- Health tracking: symptoms, migraines, sleep, medications
- Evidence building: documents, buddy statements, timeline
- Claim tools: C&P exam prep, checklists, rating calculator
- VA conditions reference database (785+ conditions)
- AI-powered disability analysis (optional)
- PWA support with offline capability
- Data export to PDF
- Privacy-first local storage
- TypeScript strict mode enabled across the codebase
- ErrorBoundary component for graceful error handling
- Data backup and restore functionality in Settings
- Content Security Policy headers via vercel.json
- Comprehensive test suite for validation and components
- Request ID tracking in API responses
- Timeout handling for AI analysis requests

### Changed
- CORS restricted to vetclaimsupport.com domain only
- Landing page condition count uses dynamic value from database
- Improved API error messages with error codes
- Updated Privacy-First messaging on landing page
- Offline indicator now mentions AI features unavailable

### Fixed
- Syntax error in PWAInstallPrompt.tsx
- Privacy and Terms links from landing page
- Type errors with strictNullChecks enabled
- Duplicate catch-all route in App.tsx

### Security
- All data stored locally on device
- No user tracking or analytics
- Optional AI features with clear disclosure
- Liability acceptance screen
- CSP, X-Frame-Options, X-Content-Type-Options headers
- Improved Supabase Edge Function error handling
- Request validation and size limits

---

## Version History

| Version | Date       | Description                          |
|---------|------------|--------------------------------------|
| 1.0.0   | 2026-02-03 | Initial release                      |
