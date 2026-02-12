import { supabase } from '@/lib/supabase';
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

/**
 * Wrap Supabase auth errors so internal details (Supabase URL, table names,
 * error codes) are never surfaced to the UI. Callers receive a generic
 * user-facing message; the original error is logged for debugging.
 */
function sanitizeAuthError(error: unknown): Error {
  const msg =
    error instanceof Error ? error.message.toLowerCase() : String(error);

  if (msg.includes('invalid login'))
    return new Error('Invalid email or password.');
  if (msg.includes('email not confirmed'))
    return new Error('Please confirm your email before signing in.');
  if (msg.includes('user already registered'))
    return new Error('An account with this email already exists.');
  if (msg.includes('rate limit') || msg.includes('too many'))
    return new Error('Too many attempts. Please wait a moment and try again.');

  // Fallback: never expose the raw message
  return new Error('Authentication failed. Please try again.');
}

export async function signInWithApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) throw sanitizeAuthError(error);
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) throw sanitizeAuthError(error);
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw sanitizeAuthError(error);
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw sanitizeAuthError(error);
  return data;
}

/**
 * All localStorage keys the app may write. Kept here so sign-out and account
 * deletion both clear the same comprehensive list.
 */
export const ALL_LOCAL_STORAGE_KEYS = [
  // Zustand persisted stores
  'vcs-app-data',
  'vet-user-profile',
  'vcs-ai-cache',
  // Encryption
  'vet-claim-encryption-enabled',
  'vet-claim-password-hash',
  // First-run / onboarding
  'liabilityAccepted',
  'hasSeenOnboarding',
  'vcs_first_launch',
  'consentTimestamp',
  // UI state
  'va-claims-theme',
  'cpExamChecklist',
  'cp-exam-checklist',
  'vet-claim-unified-calculator',
  'va-claims-reminder-settings',
  'intentToFileDismissed',
  'intentToFileDismissedAt',
  'pwaPromptDismissed',
  'militaryBranch',
  // Milestones & veteran profile
  'vet-claim-milestones',
  'vet-claim-veteran-profile',
  // Data retention tracker
  '_lastActivity',
  // Legacy migration keys
  'va-claims-tracker-data',
  'user-va-conditions',
  'va-claim-documents',
  'va-claims-evidence-documents',
  'vet-evidence-vault',
] as const;

export async function signOut() {
  // Clear ALL local data before hitting the network so the UI resets even if
  // the signOut RPC fails (e.g. network error while already offline).
  for (const key of ALL_LOCAL_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    // Sign-out network failure is non-fatal: local state is already cleared
    // and the Supabase token will expire on its own.
    console.warn('[auth] signOut RPC failed (local data already cleared):', error.message);
  }
}

export async function getSession(): Promise<Session | null> {
  // Supabase JS v2 automatically refreshes the access token when it is close
  // to expiry. If the refresh token itself has expired, getSession returns
  // null (no session). There is no separate "refresh" call needed here.
  const { data, error } = await supabase.auth.getSession();
  if (error) throw sanitizeAuthError(error);
  return data.session;
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const { data } = supabase.auth.onAuthStateChange(callback);
  return data.subscription;
}

export type { Session, User };
