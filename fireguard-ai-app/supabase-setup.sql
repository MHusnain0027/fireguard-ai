-- Run this once in Supabase Dashboard > SQL Editor.
-- The website reads this table through its server-only API route. Browser users
-- do not need direct Supabase access.

alter table public.locations enable row level security;

drop policy if exists "Public can read FACP locations" on public.locations;
revoke all on table public.locations from anon, authenticated;

-- The Supabase secret/service_role key bypasses RLS on the server. Never place
-- that key in frontend code or in a NEXT_PUBLIC_ environment variable.
