# PHASE 1 RECONNAISSANCE — VetClaimSupport Login Spinner Issue

## Tech Stack
- **Frontend**: React 18.3 + Vite 7 + TypeScript 5.8
- **Auth Provider**: Supabase (`@supabase/supabase-js` v2.93.3)
- **Supabase Project ID**: `hazttoarliqhlghuctyc`
- **State Management**: Zustand 5 with encrypted localStorage persistence
- **Styling**: Tailwind CSS 3 + Framer Motion 12
- **Mobile**: Capacitor 8 (iOS)
- **Deployment**: Vercel (SPA with rewrites to index.html)
- **PWA**: vite-plugin-pwa with Workbox (runtime caching for fonts only)

## Environment Variables
- `VITE_SUPABASE_URL` — **No .env file exists locally.** Must be set in Vercel dashboard for production builds.
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Same situation.
- Both are read at build time by Vite and baked into JS bundles.
- The `.env.example` has placeholder values only.

## Auth Provider
- **Supabase Auth** with three methods: email/password, Google OAuth, Apple OAuth
- PKCE flow is the Supabase v2 default (commit 73ce1fc added PKCE handling for native)
- Custom `secureAuthStorage` adapter: uses localStorage on web, Keychain on native

## Database
- Supabase PostgreSQL (accessed via Supabase JS client, no direct DB connection from frontend)
- Edge functions for server-side operations (Stripe, AI analysis, user deletion)

## Deployment
- Vercel with `vercel.json` providing CSP headers, cache headers, and SPA rewrites
- CSP `connect-src` allows `hazttoarliqhlghuctyc.supabase.co` and `*.supabase.co`

## Last 5 Git Commits
1. `5c2cf2b` — "Fix auth: point to correct Supabase project + bump build to 303" — **ONLY changed supabase/config.toml (CLI config, NOT runtime) and iOS build number**
2. `6c6793a` — "Bump build to 302 with OAuth login fix" — Only iOS build number
3. `73ce1fc` — "Fix OAuth login spinning forever" — Added PKCE handling to nativeOAuth.ts, splash screen redesign
4. `83c007f` — "Fix black screen caused by missing .env" — iOS build number only
5. `c89af9b` — "Fix black screen on iOS" — iOS splash/SW/cache fixes

## Red Flags
1. **Commit 5c2cf2b claims to fix auth but didn't change runtime code** — only changed `supabase/config.toml` which is CLI-only, not used by the web app at runtime.
2. **No .env file exists** — if Vercel environment variables are wrong/stale, the production build would have incorrect Supabase credentials.
3. **Multiple failed fix attempts** in recent commit history (OAuth spinning, black screen, sign-in stalling) — indicates a recurring/systemic issue.
4. **The previous incident report (docs/INCIDENT_REPORT.md)** documented the same pattern: env vars missing → app broken. The pattern may be repeating.
