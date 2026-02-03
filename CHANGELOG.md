# Changelog

All notable changes to Vet Claim Support will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- TypeScript strict mode enabled across the codebase
- ErrorBoundary component for graceful error handling
- Data backup and restore functionality in Settings
- Content Security Policy headers via vercel.json
- Comprehensive test suite for validation and components
- Request ID tracking in API responses
- Timeout handling for AI analysis requests

### Changed
- CORS restricted to vetclaimsupport.com domain only
- Landing page condition count now uses dynamic value from database
- Improved API error messages with error codes
- Updated Privacy-First messaging on landing page
- Offline indicator now mentions AI features unavailable

### Fixed
- Syntax error in PWAInstallPrompt.tsx
- Privacy and Terms links now work from landing page
- Type errors with strictNullChecks enabled
- Duplicate catch-all route removed from App.tsx

### Security
- Added CSP, X-Frame-Options, X-Content-Type-Options headers
- Improved Supabase Edge Function error handling
- Added request validation and size limits

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

### Security
- All data stored locally on device
- No user tracking or analytics
- Optional AI features with clear disclosure
- Liability acceptance screen

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-02-03 | Initial release |
