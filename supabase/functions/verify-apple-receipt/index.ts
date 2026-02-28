import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  'https://vetclaimsupport.com',
  'https://www.vetclaimsupport.com',
  'https://vetclaimsupport.vercel.app',
  'capacitor://localhost',
  'http://localhost',
];

const getAllowedOrigin = (origin: string | null): string => {
  if (origin && ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) return origin;
  return ALLOWED_ORIGINS[0];
};

const getCorsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': getAllowedOrigin(origin),
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
});

/**
 * Verify an Apple IAP receipt via RevenueCat's REST API.
 *
 * RevenueCat handles App Store Server API v2 validation, so we query their
 * subscriber endpoint to confirm entitlement status, then write to our
 * user_entitlements table.
 *
 * Required env vars:
 *   REVENUECAT_SECRET_KEY — RevenueCat secret API key (sk_...)
 *   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 */
serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const revenuecatKey = Deno.env.get('REVENUECAT_SECRET_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey || !revenuecatKey) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({ error: 'Service not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Verify user JWT
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Query RevenueCat for this user's subscriber info
    const rcResponse = await fetch(
      `https://api.revenuecat.com/v1/subscribers/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${revenuecatKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!rcResponse.ok) {
      console.error('RevenueCat API error:', rcResponse.status, await rcResponse.text());
      return new Response(
        JSON.stringify({ error: 'Could not verify purchase' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const rcData = await rcResponse.json();
    const entitlements = rcData?.subscriber?.entitlements ?? {};
    const premiumEntitlement = entitlements['premium'];
    const isActive = premiumEntitlement?.expires_date === null || // lifetime
      (premiumEntitlement?.expires_date && new Date(premiumEntitlement.expires_date) > new Date());

    if (!isActive) {
      return new Response(
        JSON.stringify({ valid: false, entitlement: 'preview' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Write entitlement to our database
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { error: upsertError } = await adminClient
      .from('user_entitlements')
      .upsert(
        {
          user_id: user.id,
          entitled: true,
          source: 'apple',
          purchase_id: premiumEntitlement?.product_identifier || 'vcs_lifetime',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );

    if (upsertError) {
      console.error('Failed to upsert entitlement:', upsertError);
      return new Response(
        JSON.stringify({ error: 'Failed to record entitlement' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ valid: true, entitlement: 'lifetime' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('verify-apple-receipt error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
