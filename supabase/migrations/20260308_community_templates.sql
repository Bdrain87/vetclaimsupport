-- Community Templates — anonymous, moderated statement templates
-- submitted by veterans for the community.

create table if not exists community_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  title text not null,
  category text not null check (category in (
    'Personal Statement', 'Buddy Statement', 'Nexus Letter',
    'Stressor Statement', 'Impact Statement'
  )),
  content text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  upvotes integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_community_templates_status on community_templates(status);
create index if not exists idx_community_templates_category on community_templates(category);

-- RLS
alter table community_templates enable row level security;

-- Anyone authenticated can read approved templates
create policy "read approved templates"
  on community_templates for select
  using (status = 'approved');

-- Users can submit their own templates
create policy "submit own templates"
  on community_templates for insert
  with check (user_id = auth.uid());

-- Users can update/delete only their own pending templates
create policy "manage own pending templates"
  on community_templates for update
  using (user_id = auth.uid() and status = 'pending');

create policy "delete own pending templates"
  on community_templates for delete
  using (user_id = auth.uid() and status = 'pending');

-- Upvote RPC (atomic increment, one per user per template)
create or replace function upvote_template(template_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update community_templates
  set upvotes = upvotes + 1
  where id = template_id and status = 'approved';
end;
$$;
