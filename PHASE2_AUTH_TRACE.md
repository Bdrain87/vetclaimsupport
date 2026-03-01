# PHASE 2 — Authentication Flow Forensic Trace

## Complete Login Flow (file-by-file, line-by-line)

### Entry Point: User navigates to `/auth`
1. `src/App.tsx:596` — `App()` renders, `useHydration()` starts (10s safety timeout)
2. `src/App.tsx:686` — Once hydrated, `<AppContent />` renders
3. `src/App.tsx:526-531` — `AppContent` checks `location.pathname === '/auth'` → renders `<AuthPage />`
4. AuthPage is NOT wrapped in AuthGuard — renders directly

### AuthPage Mount: `src/pages/AuthPage.tsx:35-51`
- Calls `supabase.auth.getSession()` to check for existing session
- Subscribes to `onAuthStateChange` for OAuth deep-link completions
- **getSession() at line 1101 of GoTrueClient.js: `await this.initializePromise`** — waits for client initialization
- If initialization hangs, getSession hangs, but this is a non-blocking `.then()` chain — user still sees form

### User Clicks Sign In: `src/pages/AuthPage.tsx:67-108`
1. Line 85: `setLoading(true)` — spinner appears
2. Line 88: `await signInWithEmail(email, password)` — calls auth service

### Auth Service: `src/services/auth.ts:73-79`
1. Line 74: `supabase.auth.signInWithPassword({ email, password })`
2. This calls GoTrueClient.signInWithPassword (line 444 of GoTrueClient.js)
3. **signInWithPassword does NOT await initializePromise** — goes directly to HTTP request
4. Line 449: Makes POST to `${this.url}/token?grant_type=password`
5. Uses `window.fetch` with **NO timeout and NO AbortController**

### Fetch layer: `node_modules/@supabase/auth-js/dist/main/lib/fetch.js:97-120`
- Line 101: `result = await fetcher(url, requestParams)` — raw window.fetch
- Line 103-106: If fetch throws (network error), catches and throws `AuthRetryableFetchError`
- **NO timeout configured on the fetch**

### Error return path:
- `signInWithPassword` catches `AuthError`, returns `{ data: null, error }`
- `signInWithEmail` sees `error`, throws via `sanitizeAuthError()`
- `handleEmailAuth` catch block shows toast, `finally` resets `setLoading(false)`

## Files Read (complete list)
- `src/App.tsx` — routing, AuthGuard, AppContent, App
- `src/pages/Login.tsx` — login page with email/password + OAuth
- `src/pages/AuthPage.tsx` — alternative auth page with same functionality
- `src/services/auth.ts` — auth service wrapping Supabase calls
- `src/lib/supabase.ts` — Supabase client initialization
- `src/lib/secureAuthStorage.ts` — storage adapter (localStorage on web, Keychain on native)
- `src/lib/platform.ts` — platform detection
- `src/lib/nativeOAuth.ts` — native OAuth callback handling
- `src/hooks/useHydration.ts` — encryption + store rehydration
- `src/main.tsx` — app entry point, service worker registration
- `node_modules/@supabase/auth-js/dist/main/GoTrueClient.js` — Supabase auth client
- `node_modules/@supabase/auth-js/dist/main/lib/fetch.js` — Supabase fetch layer
- `node_modules/@supabase/auth-js/dist/main/lib/locks.js` — Supabase lock mechanism

## Answers to Diagnostic Questions

### Login Component Analysis (both Login.tsx and AuthPage.tsx)
1. **Form submission handler**: `handleSubmit` (Login.tsx:62) / `handleEmailAuth` (AuthPage.tsx:67)
2. **Loading state**: `useState(false)` — initialized correctly
3. **Loading set to true**: Login.tsx:83 / AuthPage.tsx:85
4. **Loading set to false**: Login.tsx:96 / AuthPage.tsx:106 — both in `finally` blocks
5. **finally block?**: YES, both have `finally { setLoading(false) }`
6. **catch resets loading?**: `finally` handles it (covers both success and error)
7. **Network error handling?**: Supabase client catches, returns as `AuthRetryableFetchError`, then caught by auth service
8. **Non-200 status?**: Supabase client handles, returns error
9. **Timeout?**: **NO** — no timeout on email/password auth. OAuth has 30s timeout only.

### API/Service Analysis
1. **URL**: `${VITE_SUPABASE_URL}/auth/v1/token?grant_type=password` — from env var
2. **Method**: POST
3. **Base URL correct?**: Depends on Vercel env vars (can't verify from code alone)

### Supabase Lock Mechanism
- Uses `navigator.locks` API with 5s acquire timeout
- On timeout, steals the lock (recovery mechanism)
- `signInWithPassword` does NOT await `initializePromise`
- `getSession` DOES await `initializePromise`

## Suspicious Findings

### ⚠️ CRITICAL: No fetch timeout on auth requests
`src/lib/supabase.ts` creates the Supabase client without a custom `fetch` wrapper. The default `window.fetch` has NO timeout. If the Supabase server doesn't respond (wrong URL, network issue, DNS blackhole), the fetch will hang FOREVER. The loading spinner will never reset.

### ⚠️ CRITICAL: No loading safety timeout for email auth
Both Login.tsx and AuthPage.tsx have safety timeouts for OAuth loading (30s) but NO safety timeout for email/password loading. If `signInWithPassword()` hangs, the spinner hangs forever.

### ⚠️ MEDIUM: Commit 5c2cf2b was incomplete fix
The commit claimed to fix the Supabase URL but only changed `supabase/config.toml` (CLI-only, not runtime). The actual runtime URL comes from `VITE_SUPABASE_URL` env var in Vercel's dashboard.

## PRELIMINARY DIAGNOSIS

**Primary root cause**: The Supabase auth calls have no fetch timeout. If the network request hangs (wrong URL, DNS timeout, proxy issue, server unresponsive), the Promise never resolves or rejects, and `setLoading(false)` never fires.

**Contributing factor**: No safety timeout on the email/password loading state (unlike OAuth which has one).

**Likely trigger**: The Vercel environment variables may still point to the wrong/old Supabase project, causing fetch requests to hang rather than fail fast. This cannot be confirmed from code alone — but the code MUST handle this case defensively regardless.
