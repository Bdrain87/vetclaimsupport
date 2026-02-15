-- Stripe subscription support: subscriptions table, stripe_customer_id on profiles,
-- updated entitlement CHECK constraint.

-- 1. Add stripe_customer_id to profiles
alter table public.profiles
  add column if not exists stripe_customer_id text;

-- 2. Update entitlement CHECK to include 'premium'
--    Drop old constraint and recreate with the new value set.
alter table public.profiles drop constraint if exists profiles_entitlement_check;
alter table public.profiles
  add constraint profiles_entitlement_check
  check (entitlement in ('preview', 'premium', 'lifetime'));

-- 3. Subscriptions table
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  status text not null default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_subscriptions_user_id
  on public.subscriptions (user_id);

create index if not exists idx_subscriptions_stripe_customer_id
  on public.subscriptions (stripe_customer_id);

create index if not exists idx_subscriptions_stripe_subscription_id
  on public.subscriptions (stripe_subscription_id);

create index if not exists idx_profiles_stripe_customer_id
  on public.profiles (stripe_customer_id);

-- RLS
alter table public.subscriptions enable row level security;

-- Users can read their own subscriptions
drop policy if exists "subscriptions_select_self" on public.subscriptions;
create policy "subscriptions_select_self"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

-- Only service role can insert/update (webhook writes via service key)
-- No insert/update/delete policies for authenticated users.
