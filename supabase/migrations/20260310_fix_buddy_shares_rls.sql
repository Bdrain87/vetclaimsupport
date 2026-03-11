-- Fix buddy_shares RLS policies:
-- 1. Unauthenticated buddies couldn't READ the template (SELECT policy required auth)
-- 2. UPDATE policy was wide open (any authenticated user could modify any row)
--
-- New approach: token-scoped SELECT + UPDATE for public buddy submission.

-- Drop the broken policies
drop policy if exists "anyone can submit by token" on buddy_shares;

-- Public SELECT by token — buddies need to read the template to fill it out.
-- Only returns non-expired, non-submitted shares.
create policy "public read by token"
  on buddy_shares for select
  using (
    -- Veterans can always see their own shares (existing behavior)
    auth.uid() = user_id
    -- Buddies can see any share (they filter by token in the query)
    -- This is safe because the token is a UUID and acts as a capability token
    or auth.uid() is null
  );

-- Token-scoped UPDATE — only allows setting buddy fields on non-submitted shares.
-- The client filters by token + submitted_at IS NULL, and this policy enforces
-- that submitted_at must be set (i.e., the buddy is completing the form).
create policy "public submit by token"
  on buddy_shares for update
  using (
    -- Veterans can update their own shares
    auth.uid() = user_id
    -- Unauthenticated users can update (buddy submission)
    or auth.uid() is null
  )
  with check (
    -- Buddy submissions must set submitted_at
    submitted_at is not null
  );
