import { supabase } from '@/lib/supabase';

type AuditAction =
  | 'consent_accepted'
  | 'data_export'
  | 'account_deleted'
  | 'login'
  | 'logout'
  | 'ai_analysis'
  | 'pdf_export'
  | 'cloud_sync';

export async function logAuditEvent(
  action: AuditAction,
  detail?: string,
): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.from('audit_log').insert({
      user_id: session.user.id,
      action,
      detail,
    });
  } catch {
    // Non-fatal: audit logging should never block the user
  }
}
