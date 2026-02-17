import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14?target=deno";

serve(async (req: Request) => {
  // Webhook endpoint — only POST from Stripe, no CORS needed
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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
        await adminClient.from('user_entitlements').upsert({
          user_id: userId,
          entitled: true,
          source: 'stripe',
          purchased_at: new Date().toISOString(),
          revoked_at: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

        // Set profiles.entitlement = 'premium' (permanent)
        await adminClient
          .from('profiles')
          .update({
            entitlement: 'premium',
            stripe_customer_id: session.customer as string,
          })
          .eq('id', userId);

        console.log('Premium access granted for user:', userId);
        break;
      }

      // Handle async payment completion (e.g., bank transfers)
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        if (!userId) break;

        await adminClient.from('user_entitlements').upsert({
          user_id: userId,
          entitled: true,
          source: 'stripe',
          purchased_at: new Date().toISOString(),
          revoked_at: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

        await adminClient
          .from('profiles')
          .update({ entitlement: 'premium' })
          .eq('id', userId);

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
