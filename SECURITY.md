# Security Model — Vet Claim Support

## Architecture Overview

Vet Claim Support uses a **local-first, encrypted-by-default** security model.
All veteran data is encrypted at rest on the device and optionally synced to
Supabase with row-level security. No third-party analytics, tracking, or data
sharing is implemented.

## Encryption

### Layer 1 — Mandatory Device Key (Zero Friction)
- **Algorithm:** AES-256-GCM via the Web Crypto API
- **Key:** 256-bit random key auto-generated on first launch
- **Storage:** iOS Keychain (native) or localStorage (web)
- **Performance:** ~5ms per write (raw-key path)
- **Scope:** All Zustand store data encrypted at rest

### Layer 2 — Optional Vault Passcode (User Opt-In)
- **Key Derivation:** PBKDF2-SHA-256 with 600,000 iterations (OWASP 2023)
- **Salt:** 16 random bytes per derivation
- **IV:** 12 random bytes per encryption (unique per operation)
- **Session:** Password held in memory only; never persisted to disk

### Fail-Closed Policy
If the encryption key is not available during a write, the write is **dropped**
rather than falling back to plaintext storage. Data integrity is preferred over
data availability.

## Authentication

- **Providers:** Apple OAuth, Google OAuth, email/password
- **Backend:** Supabase Auth with JWT tokens
- **Password Policy:** Minimum 12 characters with complexity requirements
- **Session Timeout:** Automatic logout after 15–30 minutes of inactivity
- **Error Sanitization:** Auth errors never expose internal details

## API Security

### Supabase Edge Functions
- **JWT Verification:** Enforced on all edge functions
- **Rate Limiting:** 10 requests per 60 seconds per user (AI endpoints)
- **Payload Limits:** 500KB maximum per request
- **Timeout:** 30 seconds (client and server)
- **CORS:** Whitelist-only (production origins, no wildcards)

### Row-Level Security
- All Supabase tables enforce RLS: users can only access their own data
- Service role key used only in server-side edge functions

## PHI/PII Protection

### Data Sanitization
All data sent to external services (AI, cloud sync) is sanitized:
- SSN (all formats: dashed, spaced, dotted, plain 9-digit)
- Phone numbers (all US formats)
- Email addresses
- Dates of birth (label-aware redaction)
- Street addresses
- Medical record numbers (MRN)
- Service numbers / DOD ID numbers
- VA claim/file numbers

### AI Integration
- User input wrapped in `<USER_INPUT>` delimiters to prevent injection
- Anti-hallucination instructions on all AI prompts
- Input length limited to 20,000 characters
- PHI sanitized before any AI API call
- AI responses marked with `AIContentBadge` in the UI

## Premium Access (Entitlements)

- **Fail Closed:** If entitlement check fails or times out, access is denied
- **Server Verification:** All premium checks verified against Supabase
- **TTL:** Entitlement cache refreshed every 5 minutes
- **Payments:** Stripe (web) with webhook signature verification

## Input Validation

- **Forms:** Zod schema validation on all user inputs
- **File Uploads:** MIME type validation, size limits
- **Content Filtering:** Banned phrases filter for generated content

## Secrets Management

- All secrets loaded from environment variables only
- No hardcoded API keys, tokens, or passwords in source code
- `.env.example` documents all required variables with placeholder values

## Vulnerability Management

- `npm audit` run on every CI build
- Zero tolerance for high/critical vulnerabilities
- Dependency updates tracked and tested before deployment

## Incident Response

If you discover a security vulnerability, please report it to the
repository maintainers. Do not open a public issue for security concerns.
