import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";

serve(async (req: Request) => {
  // Webhook endpoint — only POST from Stripe, no CORS needed
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables:', {
        STRIPE_SECRET_KEY: !!stripeSecretKey,
        STRIPE_WEBHOOK_SECRET: !!webhookSecret,
        SUPABASE_URL: !!supabaseUrl,
        SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceKey,
      });
      return new Response(JSON.stringify({ error: 'Service not configured' }), {
        status: 503, headers: { 'Content-Type': 'application/json' },
      });
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify Stripe signature
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('Missing stripe-signature header', { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response('Invalid signature', { status: 400 });
    }

    // Handle one-time payment completion
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;

        if (!userId) {
          console.error('No supabase_user_id in checkout session metadata');
          break;
        }

        // For one-time payments, session.payment_status should be 'paid'
        if (session.payment_status !== 'paid') {
          console.log('Payment not yet complete, waiting for async payment');
          break;
        }

        // Grant permanent premium access — no subscription, no expiry
        const { error: entErr } = await adminClient.from('user_entitlements').upsert({
          user_id: userId,
          entitled: true,
          source: 'stripe',
          purchased_at: new Date().toISOString(),
          revoked_at: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

        if (entErr) {
          console.error('Failed to upsert entitlement for user:', userId, entErr);
          return new Response(JSON.stringify({ error: 'Entitlement write failed' }), {
            status: 500, headers: { 'Content-Type': 'application/json' },
          });
        }

        // Set profiles.entitlement = 'premium' (permanent)
        const { error: profErr } = await adminClient
          .from('profiles')
          .update({
            entitlement: 'premium',
            ...(typeof session.customer === 'string' ? { stripe_customer_id: session.customer } : {}),
          })
          .eq('id', userId);

        if (profErr) {
          console.error('Failed to update profile for user:', userId, profErr);
          return new Response(JSON.stringify({ error: 'Profile update failed' }), {
            status: 500, headers: { 'Content-Type': 'application/json' },
          });
        }

        console.log('Premium access granted for user:', userId);
        break;
      }

      // Handle async payment completion (e.g., bank transfers)
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        if (!userId) break;

        const { error: asyncEntErr } = await adminClient.from('user_entitlements').upsert({
          user_id: userId,
          entitled: true,
          source: 'stripe',
          purchased_at: new Date().toISOString(),
          revoked_at: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

        if (asyncEntErr) {
          console.error('Failed to upsert entitlement (async) for user:', userId, asyncEntErr);
          return new Response(JSON.stringify({ error: 'Entitlement write failed' }), {
            status: 500, headers: { 'Content-Type': 'application/json' },
          });
        }

        const { error: asyncProfErr } = await adminClient
          .from('profiles')
          .update({ entitlement: 'premium' })
          .eq('id', userId);

        if (asyncProfErr) {
          console.error('Failed to update profile (async) for user:', userId, asyncProfErr);
          return new Response(JSON.stringify({ error: 'Profile update failed' }), {
            status: 500, headers: { 'Content-Type': 'application/json' },
          });
        }

        break;
      }

      // Handle failed async payment
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        if (!userId) break;
        console.log('Async payment failed for user:', userId);
        // Do not grant access — user can retry
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
