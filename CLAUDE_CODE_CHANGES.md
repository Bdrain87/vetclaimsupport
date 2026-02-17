# VetClaimSupport — Complete Code Change Spec

Read this entire document, then execute every change in order. Do not skip anything.
Codebase location: /Users/blakedrain/service-evidence/

## PHASE 1: STRIPE — RECURRING TO ONE-TIME PAYMENT

### 1A. Verify supabase/functions/create-checkout-session/index.ts
Cowork already changed mode from subscription to payment. Verify mode is payment, subscription_data replaced with payment_intent_data.

### 1B. Verify supabase/functions/stripe-webhook/index.ts  
Cowork already rewrote. Verify it only handles checkout.session.completed (grants permanent premium), checkout.session.async_payment_succeeded, and async_payment_failed. All subscription.updated and subscription.deleted handlers should be gone.

### 1C. src/services/entitlements.ts
Remove the openBillingPortal function entirely (around line 142). Remove its JSDoc comment too.

### 1D. src/components/settings/SubscriptionCard.tsx
- Remove openBillingPortal import from @/services/entitlements
- Remove handleManage function
- Change Upgrade button text: Upgrade to Premium — $9.99/mo -> Get Premium — $9.99 One-Time
- Change CardTitle: Subscription -> Premium Access
- Change preview description: Upgrade to unlock all premium features -> One-time purchase, yours forever
- Change premium block: remove Manage Subscription button, show permanent access confirmation like the lifetime block
- Remove the openBillingPortal import at top

### 1E. Delete supabase/functions/create-portal-session/ entire directory

## PHASE 2: PRICING TEXT — /mo TO ONE-TIME EVERYWHERE

### 2A. src/components/landing/new/Pricing.tsx
- $19.99/mo -> $19.99 (crossed out, no /mo)
- The $9.99 price: remove /mo span, change to one-time
- Add Pay once, yours forever below price

### 2B. src/components/landing/new/Hero.tsx
- $19.99/mo -> $19.99
- $9.99/mo -> $9.99 one-time
- Remove all /mo text near pricing

### 2C. src/components/UpgradeModal.tsx
- $19.99/mo -> $19.99
- $9.99 /mo -> $9.99 one-time
- requires a Premium subscription -> requires Premium access
- Add: Pay once, yours forever. No subscription.

### 2D. GLOBAL SEARCH entire src/ for remaining /mo, monthly, subscription, per month near pricing. Fix all.
Check: Settings.tsx, Login.tsx, Onboarding.tsx, PrivacyPolicyPage.tsx, TermsOfServicePage.tsx, App.tsx

## PHASE 3: GOLD COLOR VERIFICATION
Cowork already changed these. Just verify:
- src/styles/design-tokens.css: --gold-gradient uses #B8860B, #D4AF37, #FFD700, #D4AF37, #B8860B
- src/theme/tokens.ts: goldLight is #FFD700, goldDark is #B8860B
- src/components/ui/button.variants.ts: default variant uses gold gradient not flat bg-primary
- Search for #E2C468 and replace with #FFD700 everywhere
- Search for #1A1A2E or RGB(26,26,46) and replace with #000000 / RGB(0,0,0)

## PHASE 4: PROJECT RENAME — service-evidence to vetclaimsupport
- package.json name: vetclaimsupport
- gh repo rename vetclaimsupport
- git remote set-url origin https://github.com/Bdrain87/vetclaimsupport.git
- Update service-evidence.vercel.app to vetclaimsupport.vercel.app in ALLOWED_ORIGINS
- Check capacitor.config.ts, index.html title/meta tags
- grep -r service-evidence across all non-node_modules files and replace

## PHASE 5: LEGAL PAGES
- TermsOfServicePage.tsx: Update payment terms for one-time $9.99. DO NOT promise future features free. Add 7-day refund policy.
- PrivacyPolicyPage.tsx: Update for one-time payment data handling, remove subscription language.
- Present legal changes to Blake before deploying.

## PHASE 6: BUILD AND VERIFY
- npm run build
- npm run lint  
- npm test (if tests exist for entitlements)

