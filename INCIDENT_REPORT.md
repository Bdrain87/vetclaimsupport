# VetClaimSupport Incident Report — Infinite Login Spinner
## Date: 2026-03-01
## Duration: 2+ days (reported), ongoing until this fix is deployed

## Root Cause

The Supabase JS client (`@supabase/supabase-js` v2.98.0) was configured WITHOUT a fetch timeout. When the Supabase auth endpoint failed to respond in a timely manner (due to incorrect environment variables, network issues, or server-side delays), `window.fetch()` would hang indefinitely — it has NO default timeout. This caused:

1. `supabase.auth.signInWithPassword()` to return a Promise that never resolved or rejected
2. The `try/catch/finally` block in Login.tsx / AuthPage.tsx never reached the `finally` clause
3. `setLoading(false)` never fired
4. The login spinner ran forever with no recovery mechanism

The Login/AuthPage error handling (try/catch/finally) was structurally correct but insufficient because it could not handle a Promise that never settles. The OAuth login paths had a 30-second safety timeout, but the email/password paths had none.

### Contributing Factor
Commit `5c2cf2b` claimed to fix the Supabase URL but only changed `supabase/config.toml` (Supabase CLI config, NOT used at runtime). The runtime Supabase URL comes from `VITE_SUPABASE_URL` which is set in Vercel's environment variables and baked into the JS bundle at build time. The code itself had no way to verify the URL was correct, and had no timeout to recover from a wrong URL.

## What Changed

### File: `src/lib/supabase.ts`
**Lines changed:** Added `fetchWithTimeout` wrapper and `global.fetch` config to `createClient`

- Added `AUTH_FETCH_TIMEOUT_MS = 15_000` constant
- Added `fetchWithTimeout()` function that wraps `window.fetch` with a 15-second `AbortController` timeout
- Properly composes with any existing AbortSignal from callers
- Configured Supabase client to use `fetchWithTimeout` via `global.fetch` option
- **Why:** Without this, any Supabase request that hangs (wrong URL, DNS blackhole, proxy timeout) would hang forever. This is the PRIMARY fix.

### File: `src/pages/Login.tsx`
**Lines changed:** Added safety timeout useEffect (after OAuth timeout useEffect)

- Added 20-second safety timeout for the `loading` state
- If `loading` stays true for 20s (which means the fetch timeout + error handling chain somehow failed), force-clears loading and shows "Request timed out" error
- Matches the existing pattern used for OAuth loading safety timeout
- **Why:** Belt-and-suspenders. Even if the fetch timeout works correctly, this ensures the user NEVER sees an infinite spinner.

### File: `src/pages/AuthPage.tsx`
**Lines changed:** Added safety timeout useEffect (after OAuth timeout useEffect)

- Same 20-second safety timeout as Login.tsx
- Shows toast notification on timeout
- **Why:** Same defense-in-depth as Login.tsx.

### File: `src/services/auth.ts`
**Lines changed:** Added timeout/network error detection to `sanitizeAuthError()`

- Added detection for `abort`, `timed out`, `timeout` → "Request timed out. Please check your internet connection and try again."
- Added detection for `fetch`, `network`, `failed to fetch` → "Network error. Please check your internet connection and try again."
- **Why:** When the fetch aborts after 15s, the error message should tell the user what happened, not show a generic "Authentication failed."

## Timeline
- 2026-02-27 — `supabase/config.toml` created with old project ID `jkyrmgtaqbdcddlvqtuq`
- 2026-02-28 — Sign-in stalling issue first addressed (commit `d995575`)
- 2026-03-01 — OAuth spinning fix (commit `73ce1fc`) — addressed native OAuth only
- 2026-03-01 — Incomplete Supabase URL fix (commit `5c2cf2b`) — only fixed CLI config, not runtime
- 2026-03-01 — This fix: added fetch timeout, loading safety timeouts, improved error messages

## Prevention

### Defenses added by this fix:
1. **Fetch timeout (15s)** — All Supabase HTTP requests now abort after 15 seconds if no response
2. **Loading safety timeout (20s)** — Both auth pages force-clear loading state after 20 seconds
3. **User-friendly timeout messages** — Users see "Request timed out" instead of infinite spinner
4. **Signal composition** — Fetch timeout properly composes with any existing AbortSignal

### Pre-existing defenses (confirmed working):
5. **AuthGuard timeout (8s)** — Falls through to login if session check hangs
6. **Hydration timeout (10s)** — Prevents permanent loading screen on boot
7. **OAuth loading timeout (30s)** — Clears OAuth spinner if deep-link never arrives
8. **ErrorBoundary** — Global error boundary catches render crashes
9. **unhandledrejection handler** — Logs unhandled Promise rejections

## Remaining Risks

1. **Vercel environment variables** — Cannot verify from code alone that `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Vercel's dashboard are correct. If they point to a wrong/dead project, the app will now show a timeout error instead of spinning forever, but login will still fail. **Action needed:** Verify in Vercel dashboard that these point to `https://hazttoarliqhlghuctyc.supabase.co` and the correct anon key.

2. **Pre-existing test failure** — `full-render.test.tsx` "should render the header brand text" has been failing before these changes. Not related to auth.

## Test Results
- TypeScript: 0 errors
- Build: Success (28s)
- Tests: 1305 passed, 1 failed (pre-existing, unrelated)
- No regressions introduced
