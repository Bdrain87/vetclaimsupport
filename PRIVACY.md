# Privacy Model — Vet Claim Support

## Core Privacy Principles

1. **Local-First:** All veteran data is stored locally on the device by default
2. **Encrypted at Rest:** AES-256-GCM encryption on all stored data
3. **No Third-Party Tracking:** Zero analytics, advertising, or data-sharing SDKs
4. **Opt-In Cloud Sync:** Cloud backup only if the veteran explicitly enables it
5. **Full Data Control:** Veterans can export or delete all their data at any time

## What Data Is Collected

### Stored Locally (On-Device Only)
- Service history (branch, MOS, dates, duty stations)
- Claimed conditions and ratings
- Health logs (symptoms, sleep, migraines, medications, medical visits)
- Exposure records (burn pit, chemicals, etc.)
- Documents and evidence uploaded by the veteran
- Personal statements, buddy statements, and other generated documents
- Form drafts and app preferences

### Stored in the Cloud (Only with Account + Opt-In Sync)
- User profile (name, email, branch, MOS)
- Conditions and health log summaries
- Entitlement status (premium/free)
- No uploaded documents are synced to the cloud

### Never Collected
- Location data or GPS tracking
- Browsing history or app usage analytics
- Third-party advertising identifiers
- Biometric data
- Contact lists or phone data
- Camera or microphone access (except voice input, user-initiated only)

## How Data Is Protected

### Encryption
- All local data encrypted with AES-256-GCM (Web Crypto API)
- Device encryption key auto-generated on first launch
- Optional vault passcode adds PBKDF2-derived secondary encryption
- Cloud data protected by Supabase row-level security + TLS in transit

### PHI/PII Sanitization
Before any data is sent to AI services, the following are automatically redacted:
- Social Security numbers
- Phone numbers
- Email addresses
- Dates of birth
- Street addresses
- Medical record numbers

### AI Data Handling
- AI features process data server-side via Supabase Edge Functions
- Veteran input is sanitized before reaching any AI model
- AI-generated content is clearly labeled in the UI
- No veteran data is used to train AI models

## Data Retention

- Local data persists until the veteran deletes it
- 30-day retention warning for inactive accounts (cloud data)
- Account deletion cascades to all cloud data immediately

## Data Export

Veterans can export all their data as JSON at any time:
- Navigate to Settings > Export Data
- All conditions, health logs, documents, and profile data included
- Export file is generated locally and never sent to any server

## Data Deletion

Veterans can delete all their data at any time:
- Navigate to Settings > Delete Account
- Confirmation required (irreversible operation)
- All cloud data deleted immediately (Supabase cascade delete)
- All local data cleared from device
- Stripe subscription cancelled if active

## Third-Party Services

| Service | Purpose | Data Shared |
|---------|---------|-------------|
| Supabase | Auth, cloud sync, edge functions | Email, profile, conditions (opt-in) |
| Google Gemini | AI-powered claim analysis | Sanitized prompts only (no PHI) |
| Stripe | Premium payments (web) | Email, payment info (Stripe-managed) |
| Apple | App distribution, IAP | Standard App Store data only |

No third-party analytics (Google Analytics, Mixpanel, Amplitude, etc.) are
integrated. No advertising SDKs are present. No data brokers or data-sharing
agreements exist.

## Compliance Notes

- The app does not file, submit, or communicate with the VA on behalf of veterans
- The app is not a covered entity under HIPAA but follows HIPAA technical safeguards
- All diagnostic codes and VA data are reference information only
- AI-generated content carries explicit disclaimers
