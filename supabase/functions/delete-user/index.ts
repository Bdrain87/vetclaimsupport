import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";

// Production-only origins — no localhost allowed
const ALLOWED_ORIGINS = [
  'https://vetclaimsupport.com',
  'https://www.vetclaimsupport.com',
  'https://vetclaimsupport.vercel.app',
];

const getAllowedOrigin = (origin: string | null): string => {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  return ALLOWED_ORIGINS[0];
};

const getCorsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': getAllowedOrigin(origin),
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Max-Age': '86400',
});

serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify the caller is authenticated by checking the JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a client with the user's JWT to verify identity
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      console.error('Missing required environment variables for delete-user');
      return new Response(
        JSON.stringify({ error: 'Service not configured. Please contact support.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { userId } = await req.json();

    // Ensure the authenticated user can only delete their own account
    if (userId !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: can only delete your own account' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use the service role key for privileged operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // --- Cancel active Stripe subscription before deletion ---
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (stripeSecretKey) {
      try {
        const { data: profile } = await adminClient
          .from('profiles')
          .select('stripe_customer_id')
          .eq('id', userId)
          .single();

        if (profile?.stripe_customer_id) {
          const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
          const subscriptions = await stripe.subscriptions.list({
            customer: profile.stripe_customer_id,
            status: 'active',
          });
          for (const sub of subscriptions.data) {
            await stripe.subscriptions.cancel(sub.id);
          }
        }
      } catch (err) {
        console.error(`Failed to cancel Stripe subscriptions for user ${userId}:`, err);
        // Non-fatal — continue with account deletion
      }
    }

    // --- Cascade: clean up user-owned rows BEFORE deleting the auth user ---
    const tablesToClean = [
      { table: 'subscriptions', column: 'user_id' },
      { table: 'user_entitlements', column: 'user_id' },
      { table: 'entitlements', column: 'user_id' },
      { table: 'form_drafts', column: 'user_id' },
      { table: 'documents', column: 'user_id' },
      { table: 'evidence', column: 'user_id' },
      { table: 'health_logs', column: 'user_id' },
      { table: 'conditions', column: 'user_id' },
      { table: 'profiles', column: 'id' },
    ];
    for (const { table, column } of tablesToClean) {
      const { error: cleanupError } = await adminClient
        .from(table)
        .delete()
        .eq(column, userId);
      if (cleanupError) {
        console.error(`Failed to clean up ${table} for user ${userId}: ${cleanupError.message}`);
        // Non-fatal — continue with the rest; the auth deletion is the
        // critical step.  Log so we can reconcile later.
      }
    }

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);

    if (deleteError) {
      return new Response(
        JSON.stringify({ error: deleteError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
