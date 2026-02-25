# Testing VetClaimSupport PWA

## Overview
VetClaimSupport is a local-first PWA for veterans' VA disability claim support. It uses React 18, TypeScript, Vite, Zustand, Supabase, and Capacitor (iOS). Testing requires special setup since the app depends on Supabase for auth.

## Devin Secrets Needed
- `VITE_SUPABASE_URL` — Supabase project URL (or use placeholder `https://example.supabase.co` for local-only testing)
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key (or use a fake JWT for local-only testing)
- Real Supabase credentials are needed to test cloud sync, auth flows with actual sign-in, and premium entitlement verification

## Local Dev Setup

1. **Install dependencies**: `npm install` in the repo root
2. **Create `.env` file** with Supabase env vars:
   ```
   VITE_SUPABASE_URL=https://example.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMTQ0NTkwMCwiZXhwIjoxOTM2OTMxOTAwfQ.test
   ```
3. **Start dev server**: `npm run dev -- --host` (Vite, typically port 5173 but may auto-increment if port is in use)
4. **Build check**: `npm run build` passes cleanly with zero TypeScript errors

## Auth Bypass for Testing

The app uses `AuthGuard` in `src/App.tsx` which requires a valid Supabase session on web. Without real credentials, you'll be redirected to `/auth`.

**Temporary bypass**: Replace the `AuthGuard` function body with `return <>{children}</>;` to skip auth checks. This allows testing all inner pages without real Supabase credentials.

**IMPORTANT**: Always revert this change after testing. The original function checks `supabase.auth.getSession()` and redirects unauthenticated users to `/auth`.

## App Flow

1. **Landing page** (`/`) — Public, no auth required
2. **Login page** (`/login` or `/auth`) — Email/password + OAuth (Google, Apple)
3. **Liability acceptance modal** — Shows on first app load, requires scrolling + 3 checkboxes
4. **Onboarding** (`/onboarding`) — 11 steps: Welcome, Name, Branch, MOS, Duty Stations, Deployments, Conditions, Existing Ratings, Claim Goal, Getting Started, Complete
5. **Dashboard** (`/app`) — Main hub with profile, rating, quick log, next steps
6. **Claims** (`/claims`) — Condition management, evidence tracking
7. **Health Hub** (`/health`) — Symptom tracking (premium-gated)
8. **Tools** (`/prep`) — VA forms, calculators, guides, document builders
9. **Settings** (`/settings`) — Profile, service history, vault, appearance, backup, legal

## Testing Strategy

### What Can Be Tested Without Real Supabase
- All UI rendering and navigation
- Form validation and input handling
- Onboarding flow (data saved to localStorage)
- Dashboard display with onboarding data
- Rating calculator (local computation)
- Travel Pay calculator (local computation)
- Premium guard behavior (UpgradeModal display)
- Data persistence (localStorage survives page reload)
- Light/dark mode toggle
- All static content pages (FAQ, Privacy, Terms, BDD Guide, etc.)

### What Requires Real Supabase Credentials
- Actual sign-in/sign-up flow
- Cloud sync (pull/push)
- AI features (VA-Speak Translator, Personal Statement generation, etc.) — these call Supabase Edge Functions
- Premium purchase flow (Stripe checkout)
- Entitlement refresh from server
- Account deletion

## Key Testing Notes

- **Splash screen**: The app shows a splash screen on every full page navigation/reload (~1.8s). Use in-app navigation (bottom tab bar, back buttons) to avoid it during testing.
- **Premium guard**: Non-premium users see an `UpgradeModal` with pricing ($9.99 one-time, launch sale from $19.99). The "Maybe Later" button navigates back. On native (iOS), the paywall is bypassed entirely.
- **Onboarding data**: Saved to localStorage via Zustand encrypted storage. The key `vcs_onboarding_progress` tracks partial progress. After completion, data moves to the main app store.
- **MOS autocomplete**: In onboarding step 3, the military job search may have brief UI delays when selecting — this is normal behavior from the autocomplete dropdown closing.
- **Bottom navigation**: 5 tabs — Home, My Claim, Track, Tools, Me. All functional.
- **Data persistence**: Profile data (name, branch, conditions) persists across page reloads via encrypted localStorage. The liability acceptance consent also persists (modal won't reappear).
- **Settings page**: Very long scrollable page with 12+ sections. Make sure to scroll through all sections when testing.

## Common Issues

- **Port conflicts**: Vite auto-increments port if default (5173) is in use. Check console output for actual port.
- **Missing env vars**: App throws on startup if `VITE_SUPABASE_URL` or `VITE_SUPABASE_PUBLISHABLE_KEY` are missing. Create `.env` file with placeholder values.
- **Full page reload clears context**: Direct URL navigation causes full reload with splash screen. Prefer using in-app navigation.
- **System reboots clear localStorage**: If the browser session is lost, you'll need to re-run through onboarding to get back to the dashboard.
