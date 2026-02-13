-- Pivot foundation schema: auth-backed entitlements, AI usage caps, and sync metadata.
-- Safe to run multiple times.

create extension if not exists pgcrypto;

create table if not exists public.user_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  entitled boolean not null default false,
  source text not null default 'unknown',
  purchased_at timestamptz,
  revoked_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  identity_key text not null,
  route text not null default 'analyze-disabilities',
  model text,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_usage_events_user_time
  on public.ai_usage_events (user_id, created_at desc);

create index if not exists idx_ai_usage_events_identity_time
  on public.ai_usage_events (identity_key, created_at desc);

create table if not exists public.secure_sync_vault_metadata (
  user_id uuid primary key references auth.users(id) on delete cascade,
  storage_path text not null,
  schema_version text not null default 'v1',
  updated_at timestamptz not null default now(),
  last_restored_at timestamptz,
  checksum text
);

alter table public.user_entitlements enable row level security;
alter table public.ai_usage_events enable row level security;
alter table public.secure_sync_vault_metadata enable row level security;

-- Users can read their own entitlement/sync metadata.
drop policy if exists "user_entitlements_select_self" on public.user_entitlements;
create policy "user_entitlements_select_self"
  on public.user_entitlements
  for select
  using (auth.uid() = user_id);

drop policy if exists "secure_sync_vault_metadata_select_self" on public.secure_sync_vault_metadata;
create policy "secure_sync_vault_metadata_select_self"
  on public.secure_sync_vault_metadata
  for select
  using (auth.uid() = user_id);

-- AI usage table is service-only for inserts; user can read own history.
drop policy if exists "ai_usage_events_select_self" on public.ai_usage_events;
create policy "ai_usage_events_select_self"
  on public.ai_usage_events
  for select
  using (auth.uid() = user_id);
