# Launch Checklist — Vet Claim Support

## Pre-Launch (Before Any Store Submission)

### Code & Build
- [ ] All CI checks pass (TypeScript, ESLint, tests, build, security)
- [ ] Production build runs without errors (`npm run build`)
- [ ] Bundle size within acceptable limits
- [ ] iOS build compiles (`npm run ios:build`)
- [ ] No console.log/debug statements in production code
- [ ] Environment variables set (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_GEMINI_API_KEY)

### Security
- [ ] Supabase RLS enabled on all tables (profiles, conditions, health_logs, evidence, form_drafts, buddy_shares, subscriptions, consent_log, audit_log, community_templates)
- [ ] No API keys or secrets in client code (all via env vars)
- [ ] Encryption at rest verified (AES-256-GCM via encryptedStorage)
- [ ] PII redaction confirmed before AI calls (redactPII utility)
- [ ] CORS restricted to production domain on Supabase Edge Functions

### Legal
- [ ] Terms of Service updated (legalCopy.ts, TermsOfServicePage)
- [ ] Privacy Policy updated (legalCopy.ts, PrivacyPolicyPage, PRIVACY.md)
- [ ] Disclaimer page updated with AI content warning
- [ ] Liability acceptance screen shown on first launch
- [ ] App Store privacy nutrition label matches PRIVACY.md

## TestFlight (iOS Beta)

### Build & Upload
- [ ] Increment build number in Xcode (CURRENT_PROJECT_VERSION)
- [ ] Set marketing version (MARKETING_VERSION) to match package.json
- [ ] Archive with Release configuration
- [ ] Upload to App Store Connect via Xcode Organizer
- [ ] Wait for processing (~10-30 minutes)

### TestFlight Configuration
- [ ] Add beta testers (internal group first)
- [ ] Set "What to Test" notes for testers
- [ ] Enable automatic distribution to internal testers
- [ ] Export compliance: ITSAppUsesNonExemptEncryption = NO (already in Info.plist)

### Testing Checklist
- [ ] Fresh install flow (onboarding, account creation)
- [ ] Returning user flow (sign in, data sync)
- [ ] Offline mode (airplane mode, queue replay)
- [ ] All tab navigation works
- [ ] Health logging (symptoms, sleep, migraines, medications)
- [ ] Document upload + OCR scan
- [ ] PDF export downloads correctly
- [ ] Sentinel AI responds (Gemini API key set)
- [ ] Voice input records and transcribes
- [ ] Premium guard blocks free users from premium features
- [ ] IAP purchase flow (sandbox)
- [ ] Push notifications fire for deadlines

## App Store (iOS Production)

### App Store Connect
- [ ] App name: "Vet Claim Support"
- [ ] Subtitle: "VA Disability Claim Prep Tools"
- [ ] Category: Medical (primary), Productivity (secondary)
- [ ] Age Rating: 12+ (medical content)
- [ ] Price: Free (IAP for premium)

### Screenshots (6.7" iPhone 15 Pro Max + 6.5" iPhone)
1. Dashboard with readiness score and conditions
2. Condition detail page with evidence links
3. Symptom journal with severity chart
4. C&P Exam Prep page
5. Rating calculator with combined rating
6. PDF export preview

### App Store Description
```
Vet Claim Support helps U.S. veterans prepare strong VA disability claims.

TRACK YOUR EVIDENCE
- Log symptoms, sleep, migraines, and medications daily
- Upload and organize medical records and buddy statements
- Build a visual timeline of service events

KNOW YOUR RATINGS
- 785+ VA conditions with 38 CFR rating criteria
- Combined rating calculator with bilateral factor
- Secondary condition finder

PREPARE FOR YOUR C&P EXAM
- Condition-specific prep questions
- DBQ criteria reference
- Exam day mode with quick-access notes

BUILD YOUR PACKET
- Personal statement builder
- Doctor summary outline
- One-tap PDF evidence export

PRIVACY FIRST
- All data encrypted on your device (AES-256)
- No tracking, no ads, no data selling
- Optional cloud sync with end-to-end encryption

Built by veterans, for veterans.
```

### Keywords
`va disability, veterans benefits, va claim, disability rating, c&p exam, va rating calculator, veteran, military, service connected, ptsd`

### Review Notes for Apple
```
This app helps veterans organize their disability claim evidence.
It does not file claims with the VA or provide legal/medical advice.
AI features use Google Gemini API for generating sample text only.
Test account available upon request.
```

## Google Play (Android — Future)

- [ ] Generate signed AAB (`npx cap build android`)
- [ ] Create Play Console listing (same description/screenshots)
- [ ] Set up closed testing track first
- [ ] Content rating questionnaire (medical reference)
- [ ] Data safety section matches PRIVACY.md

## Deployment

### Vercel (Web)
```bash
# Production deploy (auto-deploys on push to main if connected)
npx vercel --prod

# Or via Git: push to main triggers auto-deploy
git push origin main

# Preview deploy (any branch)
npx vercel
```
- [ ] Set environment variables in Vercel dashboard:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `VITE_GEMINI_API_KEY`
- [ ] Verify production URL loads correctly
- [ ] Check Vercel headers (CSP, CORS) in `vercel.json`

### TestFlight (iOS)
```bash
# Build web assets and sync to iOS
npm run ios:build

# Open in Xcode
npm run ios:open

# In Xcode:
# 1. Select "Any iOS Device (arm64)" as build target
# 2. Product > Archive
# 3. Distribute App > App Store Connect > Upload
# 4. Wait for processing in App Store Connect (~10-30 min)
# 5. Add to TestFlight group for distribution
```
- [ ] Verify signing certificates and provisioning profiles
- [ ] Set correct bundle version (CURRENT_PROJECT_VERSION)
- [ ] Test on physical device before archiving

### Supabase Migrations
```bash
# Link to project (one-time)
npx supabase link --project-ref <your-project-ref>

# Push all pending migrations
npx supabase db push

# Verify RLS is active
npx supabase db lint
```

## Post-Launch

- [ ] Monitor crash reports (Xcode Organizer / Play Console)
- [ ] Monitor Supabase usage and error logs
- [ ] Respond to App Store reviews within 24 hours
- [ ] Plan first post-launch update (bug fixes from beta feedback)
