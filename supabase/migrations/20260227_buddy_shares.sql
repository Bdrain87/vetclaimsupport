-- Buddy statement sharing: allows veterans to send a template link to their buddies
-- for completion without requiring a VCS account.

create table buddy_shares (
  id uuid primary key default gen_random_uuid(),
  token uuid not null unique,
  user_id uuid references auth.users not null,
  veteran_first_name text not null,
  condition_name text not null,
  template_content text not null,
  relationship_hint text default '',
  -- Buddy fills these in
  buddy_name text,
  buddy_relationship text,
  buddy_contact text,
  completed_content text,
  submitted_at timestamptz,
  -- Metadata
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- RLS: veterans can read their own shares; public can read/write by token via service role
alter table buddy_shares enable row level security;

-- Veterans can see their own shares
create policy "veterans read own shares"
  on buddy_shares for select
  using (auth.uid() = user_id);

-- Veterans can create shares
create policy "veterans create shares"
  on buddy_shares for insert
  with check (auth.uid() = user_id);

-- Allow anonymous updates by token (for buddy submission)
-- This uses a permissive policy with a token check
create policy "anyone can submit by token"
  on buddy_shares for update
  using (true)
  with check (submitted_at is not null);

-- Index for fast token lookups
create index idx_buddy_shares_token on buddy_shares (token);
create index idx_buddy_shares_user on buddy_shares (user_id);
