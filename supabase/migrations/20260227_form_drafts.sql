-- Form drafts table for cross-device sync
create table if not exists form_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  form_type text not null, -- e.g. 'tool:buddy-statement', 'tool:personal-statement'
  condition_id text, -- optional: links to a user condition
  content jsonb not null default '{}',
  updated_at timestamptz default now(),
  unique(user_id, form_type, condition_id)
);

alter table form_drafts enable row level security;

create policy "users own their drafts"
  on form_drafts for all
  using (auth.uid() = user_id);

-- Index for efficient per-user queries
create index if not exists idx_form_drafts_user_id on form_drafts (user_id);
