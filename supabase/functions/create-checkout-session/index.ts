import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";

const ALLOWED_ORIGINS = [
  'https://vetclaimsupport.com',
  'https://www.vetclaimsupport.com',
  'https://vetclaimsupport.vercel.app',
];

const getAllowedOrigin = (origin: string | null): string => {
  if (origin && ALLOWED_ORIGINS.includes(origin)) return origin;
  return ALLOWED_ORIGINS[0];
};

const getCorsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': getAllowedOrigin(origin),
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Max-Age': '86400',
});

// ---------------------------------------------------------------------------
// In-memory rate limiting (max 5 checkout sessions per user per minute)
// ---------------------------------------------------------------------------
const CHECKOUT_RATE_LIMIT_WINDOW_MS = 60_000;
const CHECKOUT_RATE_LIMIT_MAX = 5;
const checkoutRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkCheckoutRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = checkoutRateLimitMap.get(userId);
  if (!entry || now >= entry.resetAt) {
    checkoutRateLimitMap.set(userId, { count: 1, resetAt: now + CHECKOUT_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= CHECKOUT_RATE_LIMIT_MAX) {
    return false;
  }
  entry.count++;
  return true;
}

serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripePriceId = Deno.env.get('STRIPE_PRICE_ID');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey || !stripeSecretKey || !stripePriceId) {
      console.error('Missing required environment variables for checkout');
      return new Response(
        JSON.stringify({ error: 'Service not configured. Please contact support.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting: max 5 checkout sessions per user per minute
    if (!checkCheckoutRateLimit(user.id)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a moment and try again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Look up existing Stripe customer ID from profiles
    const { data: profile } = await adminClient
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let stripeCustomerId = profile?.stripe_customer_id;

    if (!stripeCustomerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      stripeCustomerId = customer.id;
      // Store customer ID on profile
      const { error: profileError } = await adminClient
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id);
      if (profileError) {
        console.error('Failed to save stripe_customer_id to profile:', profileError);
      }
    }

    // Determine origin for redirect URLs
    const requestOrigin = origin && ALLOWED_ORIGINS.includes(origin)
      ? origin
      : ALLOWED_ORIGINS[0];

    // Create ONE-TIME payment Checkout Session (not subscription)
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'payment',
      line_items: [{ price: stripePriceId, quantity: 1 }],
      success_url: `${requestOrigin}/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${requestOrigin}/settings`,
      metadata: { supabase_user_id: user.id },
      payment_intent_data: {
        metadata: { supabase_user_id: user.id },
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('create-checkout-session error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
