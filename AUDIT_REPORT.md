# Code Audit Report

**Project:** Vet Claim Support
**Audit Date:** February 3, 2026
**Auditor:** Automated Code Audit

---

## Executive Summary

Vet Claim Support is a Progressive Web App (PWA) designed to help U.S. veterans track medical visits, exposures, symptoms, medications, and documentation for VA disability claims. The codebase demonstrates good React patterns and a privacy-first architecture, with all user data stored locally on the device. However, several security and code quality issues were identified that should be addressed.

### Risk Summary

| Severity | Count | Description |
|----------|-------|-------------|
| Critical | 0 | None identified |
| High | 2 | CORS configuration, TypeScript lax settings |
| Medium | 4 | Unencrypted storage, exposed credentials, data sensitivity, API abuse potential |
| Low | 3 | Missing CSP, minimal tests, error boundaries |

---

## 1. Project Overview

### Tech Stack
- **Frontend:** React 18.3.1, TypeScript 5.8.3, Vite 5.4.19
- **Styling:** Tailwind CSS 3.4.17, shadcn/ui components
- **State Management:** React Context API, TanStack Query 5.83.0
- **Storage:** localStorage, IndexedDB (browser-based)
- **Backend:** Supabase (optional), Google Gemini API (optional)
- **PWA:** vite-plugin-pwa with Workbox caching

### Architecture
- 100% client-side data storage (privacy-first design)
- Optional AI-powered features via Google Gemini API
- Offline-capable PWA with 5MiB cache limit
- No user tracking or analytics

---

## 2. Security Findings

### 2.1 HIGH: Overly Permissive CORS Configuration

**Location:** `supabase/functions/analyze-disabilities/index.ts:4`

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  ...
};
```

**Issue:** The wildcard `*` origin allows any website to call this API endpoint.

**Risk:**
- API abuse from unauthorized sources
- Potential for credential stuffing or data harvesting

**Recommendation:**
- Restrict to specific production domains
- Implement request signing/validation
- Add rate limiting

---

### 2.2 HIGH: Permissive TypeScript Configuration

**Location:** `tsconfig.json:9-14`

```json
{
  "noImplicitAny": false,
  "noUnusedParameters": false,
  "noUnusedLocals": false,
  "strictNullChecks": false
}
```

**Issue:** Strict type checking is disabled, allowing potential runtime errors.

**Risk:**
- Null/undefined reference errors at runtime
- Untyped variables may cause unexpected behavior
- Dead code accumulation

**Recommendation:**
- Enable `strict: true` incrementally
- Enable `strictNullChecks` to catch null reference bugs
- Enable `noImplicitAny` to enforce type annotations

---

### 2.3 MEDIUM: Unencrypted Local Storage

**Location:** `src/hooks/useClaimsData.ts:45-46`, `src/lib/indexedDB.ts`

```typescript
const stored = localStorage.getItem(STORAGE_KEY);
// and
const request = store.put({ id, dataUrl, storedAt: ... });
```

**Issue:** All veteran medical/claim data is stored unencrypted in browser storage.

**Risk:**
- Anyone with device access can read sensitive medical data
- Malicious browser extensions could access data
- Data exposure if device is compromised

**Recommendation:**
- Implement client-side encryption (e.g., TweetNaCl.js, WebCrypto API)
- Consider user-provided encryption key
- Warn users about device security responsibility (currently done in privacy policy)

---

### 2.4 MEDIUM: Exposed Supabase Credentials

**Location:** `.env:1-3`

```
VITE_SUPABASE_PROJECT_ID="jkyrmgtaqbdcddlvqtuq"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
```

**Issue:** Supabase credentials in .env file (tracked in git or exposed in bundle).

**Note:** VITE_ prefixed variables are intentionally exposed in client-side code - this is by design for Vite apps. The `anon` role key is meant to be public.

**Risk:**
- If Row Level Security (RLS) policies are misconfigured, data could be exposed
- API abuse if rate limiting is not configured

**Recommendation:**
- Verify Supabase RLS policies are correctly configured
- Ensure the `anon` role has minimal permissions
- Consider adding rate limiting at Supabase level

---

### 2.5 MEDIUM: Sensitive Data Sent to External API

**Location:** `supabase/functions/analyze-disabilities/index.ts:37`

```typescript
const prompt = "You are an expert VA disability claims analyst..." + JSON.stringify(userData);
```

**Issue:** User medical data is sent to Google Gemini API for analysis.

**Mitigating Factors:**
- Feature is opt-in (user must explicitly request AI analysis)
- Privacy policy discloses this clearly
- Google's Privacy Policy governs the data

**Recommendation:**
- Add client-side confirmation before sending sensitive data
- Implement data sanitization to remove PII before sending
- Consider local AI alternatives for sensitive processing

---

### 2.6 MEDIUM: API Key Exposed in URL

**Location:** `supabase/functions/analyze-disabilities/index.ts:40`

```typescript
const response = await fetch(
  "https://generativelanguage.googleapis.com/.../generateContent?key=" + GEMINI_API_KEY,
```

**Issue:** API key passed as URL query parameter instead of header.

**Risk:**
- API keys in URLs can be logged in server access logs
- May appear in browser history if called client-side

**Note:** This is server-side (Supabase Edge Function), so risk is reduced.

**Recommendation:**
- Use Authorization header instead of URL parameter where supported

---

### 2.7 LOW: Missing Content Security Policy

**Location:** `index.html`

**Issue:** No Content Security Policy (CSP) headers defined.

**Risk:**
- XSS attacks could inject malicious scripts
- Data exfiltration through injected code

**Recommendation:**
- Add CSP meta tag or configure CSP headers on hosting platform
- Restrict script sources to 'self' and trusted CDNs

---

### 2.8 LOW: Minimal Test Coverage

**Location:** `src/test/example.test.ts`

**Issue:** Only example test file exists; no comprehensive test suite.

**Risk:**
- Regressions may go undetected
- Difficult to refactor safely

**Recommendation:**
- Add unit tests for critical hooks (useClaimsData, useEvidenceDocuments)
- Add integration tests for data flow
- Set up CI/CD test automation

---

## 3. Positive Security Practices

The codebase demonstrates several security-conscious design choices:

| Practice | Implementation |
|----------|---------------|
| Privacy-first architecture | All data stored locally on device |
| No tracking/analytics | No third-party tracking scripts |
| Explicit consent | AI features require user action |
| Clear disclosures | Privacy policy explains data handling |
| Liability protection | Acceptance screen on first use |
| Input validation | React Hook Form + Zod validation |
| File size limits | 10MB per file, 500KB payload limit |
| Secure ID generation | Uses crypto.randomUUID() |

---

## 4. Code Quality Findings

### 4.1 Inconsistent Optional Chaining

**Location:** `src/hooks/useClaimsData.ts` (multiple locations)

Some array accesses use defensive patterns:
```typescript
combatHistory: [...(prev.combatHistory || []), ...]
```

While others assume arrays exist:
```typescript
medicalVisits: [...prev.medicalVisits, ...]
```

**Recommendation:** Use consistent patterns throughout.

---

### 4.2 Large Hook File

**Location:** `src/hooks/useClaimsData.ts` (550 lines)

**Issue:** Single hook handles all 20+ data types with CRUD operations.

**Recommendation:**
- Consider splitting into domain-specific hooks
- Use a reducer pattern for complex state updates
- Extract common patterns into utility functions

---

### 4.3 Error Handling Gaps

**Location:** `supabase/functions/analyze-disabilities/index.ts:64`

```typescript
} catch (error) {
  return new Response(JSON.stringify({ error: 'Analysis failed' }), ...);
}
```

**Issue:** Generic error message loses debugging information.

**Recommendation:**
- Log detailed errors server-side
- Return error codes for client-side handling
- Consider structured error responses

---

## 5. Dependency Analysis

### Direct Dependencies: 31 production packages

| Category | Notable Packages | Status |
|----------|-----------------|--------|
| UI Framework | react 18.3.1 | Current |
| Build Tool | vite 5.4.19 | Current |
| Type System | typescript 5.8.3 | Current |
| Validation | zod 3.25.76 | Current |
| PDF Export | jspdf 4.0.0 | Current |
| OCR | tesseract.js 5.1.1 | Current |

### Security Recommendations
- Run `npm audit` regularly
- Consider adding Dependabot or Renovate for automated updates
- Pin exact versions in production

---

## 6. Recommendations Summary

### Immediate Actions (High Priority)
1. Restrict CORS to specific domains in Supabase function
2. Review and verify Supabase RLS policies
3. Enable stricter TypeScript compiler options incrementally

### Short-term Improvements (Medium Priority)
4. Implement client-side encryption for sensitive data
5. Add rate limiting to AI endpoint
6. Add Content Security Policy headers
7. Add request validation between frontend and Supabase

### Long-term Enhancements (Low Priority)
8. Expand test coverage to critical paths
9. Add error boundary components
10. Implement audit logging for data exports
11. Consider accessibility audit (WCAG 2.1 AA)

---

## 7. File Statistics

| Metric | Value |
|--------|-------|
| Source Files | 180+ TypeScript/TSX |
| Total Source Size | ~2.2 MB |
| Pages | 18 route components |
| Components | 180+ total |
| Custom Hooks | 7 |
| Type Definitions | 4 files |
| Reference Data | 9 files |
| Dependencies | 31 production + 13 dev |

---

## 8. Conclusion

Vet Claim Support demonstrates a thoughtful, privacy-focused architecture that keeps veteran data on their devices. The codebase follows modern React patterns and includes appropriate legal disclosures. The main areas for improvement are:

1. **Security hardening** - CORS restrictions, encryption at rest
2. **Type safety** - Stricter TypeScript configuration
3. **Testing** - Expanded test coverage
4. **Monitoring** - Error tracking and audit logging

Overall, the application provides good baseline security for a client-side tool handling sensitive medical information, with clear opportunities for hardening.

---

*This audit report was generated as part of an automated code review process.*
