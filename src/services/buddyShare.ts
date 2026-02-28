/**
 * Buddy Statement Share Service
 *
 * Generates shareable links so veterans can send buddy letter templates
 * to their buddies for completion — no app account required.
 */

import { supabase } from '@/lib/supabase';
import { isNativeApp } from '@/lib/platform';
import { logger } from '@/utils/logger';

export interface BuddySharePayload {
  /** Veteran's first name (shown to buddy for context) */
  veteranFirstName: string;
  /** The condition the buddy letter is about */
  conditionName: string;
  /** Template structure / guiding questions for the buddy */
  templateContent: string;
  /** Relationship prompt (e.g. "fellow service member", "spouse") */
  relationshipHint?: string;
}

export interface BuddyShareResult {
  success: boolean;
  token?: string;
  shareUrl?: string;
  error?: string;
}

const BASE_URL =
  import.meta.env.VITE_APP_URL || 'https://app.vetclaimsupport.com';

/**
 * Create a shareable buddy statement link.
 * Stores the template in Supabase `buddy_shares` table and returns a public URL.
 */
export async function createBuddyShareLink(
  payload: BuddySharePayload,
): Promise<BuddyShareResult> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return { success: false, error: 'You must be signed in to share.' };
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30-day expiry

    const { error } = await supabase.from('buddy_shares').insert({
      token,
      user_id: session.user.id,
      veteran_first_name: payload.veteranFirstName,
      condition_name: payload.conditionName,
      template_content: payload.templateContent,
      relationship_hint: payload.relationshipHint ?? '',
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      logger.error('Failed to create buddy share:', error);
      return { success: false, error: 'Failed to create share link.' };
    }

    const shareUrl = `${BASE_URL}/buddy/fill/${token}`;

    return { success: true, token, shareUrl };
  } catch (e) {
    logger.error('Buddy share error:', e);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Use the native Share API (or Capacitor Share) to send the link.
 */
export async function shareBuddyLink(url: string, veteranName: string): Promise<void> {
  const shareData = {
    title: 'Buddy Statement Request',
    text: `${veteranName} is requesting your help with a buddy statement for their VA disability claim. Please tap the link to fill it out:`,
    url,
  };

  if (isNativeApp && typeof navigator.share === 'function') {
    // Native + Web Share API available (Capacitor provides this)
    try {
      await navigator.share(shareData);
    } catch {
      // User cancelled or not supported — fall through to clipboard
      await navigator.clipboard?.writeText(`${shareData.text}\n${url}`);
    }
  } else if (typeof navigator.share === 'function') {
    await navigator.share(shareData);
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(`${shareData.text}\n${url}`);
  }
}

/**
 * Fetch a buddy share template by token (public — no auth required).
 */
export async function fetchBuddyShare(token: string) {
  const { data, error } = await supabase
    .from('buddy_shares')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !data) {
    return { found: false as const };
  }

  // Check expiry
  if (new Date(data.expires_at) < new Date()) {
    return { found: false as const, expired: true };
  }

  // Check if already submitted
  if (data.submitted_at) {
    return { found: false as const, alreadySubmitted: true };
  }

  return {
    found: true as const,
    share: {
      token: data.token as string,
      veteranFirstName: data.veteran_first_name as string,
      conditionName: data.condition_name as string,
      templateContent: data.template_content as string,
      relationshipHint: (data.relationship_hint as string) || '',
    },
  };
}

/**
 * Submit a completed buddy statement (public — no auth required).
 */
export async function submitBuddyStatement(
  token: string,
  submission: {
    buddyName: string;
    buddyRelationship: string;
    buddyContact: string;
    statementContent: string;
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('buddy_shares')
      .update({
        buddy_name: submission.buddyName,
        buddy_relationship: submission.buddyRelationship,
        buddy_contact: submission.buddyContact,
        completed_content: submission.statementContent,
        submitted_at: new Date().toISOString(),
      })
      .eq('token', token)
      .is('submitted_at', null); // Only if not already submitted

    if (error) {
      return { success: false, error: 'Failed to submit statement.' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
