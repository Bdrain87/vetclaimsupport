-- Compliance hardening: consent log, audit log, and server-side data retention.

-- 1. Consent log — server-side record of terms acceptance
create table if not exists public.consent_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  terms_version text not null,
  accepted_at timestamptz not null default now(),
  ip_hash text
);

create index if not exists idx_consent_log_user_id
  on public.consent_log (user_id, accepted_at desc);

alter table public.consent_log enable row level security;

drop policy if exists "consent_log_select_self" on public.consent_log;
create policy "consent_log_select_self"
  on public.consent_log
  for select
  using (auth.uid() = user_id);

drop policy if exists "consent_log_insert_self" on public.consent_log;
create policy "consent_log_insert_self"
  on public.consent_log
  for insert
  with check (auth.uid() = user_id);

-- 2. Audit log — track key user actions for compliance
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_log_user_id
  on public.audit_log (user_id, created_at desc);

create index if not exists idx_audit_log_action
  on public.audit_log (action, created_at desc);

alter table public.audit_log enable row level security;

-- Users can read their own audit entries
drop policy if exists "audit_log_select_self" on public.audit_log;
create policy "audit_log_select_self"
  on public.audit_log
  for select
  using (auth.uid() = user_id);

-- Users can insert their own audit entries
drop policy if exists "audit_log_insert_self" on public.audit_log;
create policy "audit_log_insert_self"
  on public.audit_log
  for insert
  with check (auth.uid() = user_id);

-- 3. Server-side data retention cleanup
--    Marks profiles inactive after 365 days with no login.
--    A scheduled pg_cron job (configured separately in Supabase dashboard)
--    should call this function periodically (e.g. daily).
create or replace function public.cleanup_inactive_accounts()
returns integer
language plpgsql
security definer
as $$
declare
  deleted_count integer;
begin
  -- Delete cloud data for users inactive > 365 days.
  -- auth.users.last_sign_in_at tracks the last authentication event.
  with inactive_users as (
    select id from auth.users
    where last_sign_in_at < now() - interval '365 days'
      and last_sign_in_at is not null
  )
  delete from public.conditions
  where user_id in (select id from inactive_users);

  with inactive_users as (
    select id from auth.users
    where last_sign_in_at < now() - interval '365 days'
      and last_sign_in_at is not null
  )
  delete from public.health_logs
  where user_id in (select id from inactive_users);

  with inactive_users as (
    select id from auth.users
    where last_sign_in_at < now() - interval '365 days'
      and last_sign_in_at is not null
  )
  delete from public.evidence
  where user_id in (select id from inactive_users);

  with inactive_users as (
    select id from auth.users
    where last_sign_in_at < now() - interval '365 days'
      and last_sign_in_at is not null
  )
  delete from public.documents
  where user_id in (select id from inactive_users);

  with inactive_users as (
    select id from auth.users
    where last_sign_in_at < now() - interval '365 days'
      and last_sign_in_at is not null
  )
  delete from public.form_drafts
  where user_id in (select id from inactive_users);

  -- Log the cleanup in audit_log
  with inactive_users as (
    select id from auth.users
    where last_sign_in_at < now() - interval '365 days'
      and last_sign_in_at is not null
  )
  select count(*) into deleted_count from inactive_users;

  if deleted_count > 0 then
    insert into public.audit_log (action, detail)
    values ('data_retention_cleanup', 'Cleaned data for ' || deleted_count || ' inactive accounts');
  end if;

  return deleted_count;
end;
$$;
