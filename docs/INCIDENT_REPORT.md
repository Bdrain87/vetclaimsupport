# Incident Report — Black Screen on iOS Launch

**Date:** 2026-02-26
**Duration:** Builds 240-252 affected (~3 hours)
**Severity:** Critical — complete app failure on iOS/TestFlight
**Resolution:** Build 253, commit `cadfd94`

---

## Timeline

| Time | Event |
|------|-------|
| 09:04 | Version bumped to 1.3.0 (package.json, legalCopy) |
| 09:13 | iOS build 240 uploaded — worked because `server.url` pointed to vetclaimsupport.com |
| 09:19 | MOS dropdown color fix, build 241 |
| 09:21 | Deployment locations added |
| 09:32 | Stale chunk crash fix (lazyWithRetry) |
| 09:50 | iOS version chaos fix (Info.plist hardcoded vs variable), build 250 |
| ~10:00 | User reports build 250 still missing updates |
| 10:10 | **ROOT CAUSE 1 found:** `server.url: 'https://vetclaimsupport.com'` in capacitor.config.ts made iOS load from remote site, not bundled files. Removed it. Build 251 uploaded. |
| 10:13 | 6 audit fixes committed (migrations, auth, localStorage, etc.) |
| 10:19 | Build 252 uploaded |
| ~10:25 | **User reports black screen** — app completely dead |
| 10:31 | **ROOT CAUSE 2 found:** No `.env.local` on build machine. `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` were empty strings. `supabase.ts` throws at module load when these are missing, killing React before mount. |
| 10:35 | Pulled env vars from Vercel via `vercel env pull .env.local` |
| 10:37 | Build 253 uploaded with Supabase credentials baked into bundle |

---

## Root Cause Analysis

### The Cascade of Failures

**Phase 1 — `server.url` hiding the real problem (builds 240-250):**
`capacitor.config.ts` had `server: { url: 'https://vetclaimsupport.com' }` which made the iOS app a WebView wrapper loading the live website. This meant:
- `cap sync ios` copied dist/ files but they were NEVER USED
- The app appeared to "work" because it loaded from Vercel (which has env vars)
- But it never showed latest code — only whatever was deployed to Vercel

**Phase 2 — Removing `server.url` exposed missing env vars (builds 251-252):**
Removing `server.url` correctly made iOS load from bundled local files. But those files were built on this machine without `.env.local`. Vite replaces `import.meta.env.VITE_*` at build time. With no env file:
- `VITE_SUPABASE_URL` compiled to `''` (empty string)
- `VITE_SUPABASE_PUBLISHABLE_KEY` compiled to `''`
- `supabase.ts` line 9-12 throws: "Supabase configuration missing"
- This throw happens at module import time, before React renders
- Result: black screen (no error UI because the error happens before ErrorBoundary mounts)

**Phase 3 — Fix (build 253):**
- Ran `vercel env pull .env.local` to get credentials
- Rebuilt with credentials baked into JS bundles
- Verified `https://hazttoarliqhlghuctyc.supabase.co` present in bundled JS
- Synced to iOS, archived, uploaded

---

## What Was NOT Wrong

- **Git history:** Clean linear sequence on `main`. No branch collisions, no merge conflicts, no lost commits.
- **No lost work:** Every commit from every session is present and accounted for.
- **No conflicting branches:** Only `main` exists locally and remotely.
- **No stashes:** Nothing stashed.
- **Code quality:** TypeScript 0 errors, ESLint clean, 60 test files / 1,274 tests all passing.
- **Build system:** Vite builds successfully, produces correct output.

---

## Files Affected

| File | Change | Build |
|------|--------|-------|
| `capacitor.config.ts` | Removed `server.url` | 251 |
| `.env.local` | Created via `vercel env pull` | 253 |
| `ios/App/App.xcodeproj/project.pbxproj` | Build numbers 240→253 | All |

---

## Prevention

1. **`.env.local` must exist before any iOS build.** Added to CI script as a check.
2. **Xcode Cloud must have env vars set** as Environment Variables in the Xcode Cloud workflow settings, or the CI script must write them.
3. **Never build for TestFlight without verifying** the Supabase URL is in the bundled JS: `grep -o 'supabase\.co' ios/App/App/public/assets/index-*.js`
4. **The `server.url` config should never be re-added** to capacitor.config.ts. It defeats the entire purpose of bundling.
