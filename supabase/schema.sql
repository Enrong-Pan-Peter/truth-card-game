-- Truth Cards — Supabase schema
-- Run this once in your Supabase project's SQL Editor, then run seed_questions.sql.

-- ============================================================
-- 1. Admins (who may edit the question bank at /#/admin)
-- ============================================================
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;
-- No policies on purpose: only the Supabase dashboard (service role) can edit admins.

-- >>> CHANGE THIS if you want a different admin login email <<<
insert into public.admins (email) values ('22bm65@queensu.ca')
on conflict (email) do nothing;

-- ============================================================
-- 2. Cloud question bank
-- ============================================================
create table if not exists public.questions (
  id text primary key,
  category text not null check (category in (
    'getting_to_know', 'ideals_reals', 'heart_to_heart', 'memories', 'matters_of_soul'
  )),
  en text not null default '',
  zh text not null default '',
  enabled boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.questions enable row level security;

-- Everyone can read; only admins (magic-link login) can write.
create policy "questions readable by everyone"
  on public.questions for select using (true);

create policy "admins insert questions"
  on public.questions for insert to authenticated
  with check (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')));

create policy "admins update questions"
  on public.questions for update to authenticated
  using (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')));

create policy "admins delete questions"
  on public.questions for delete to authenticated
  using (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')));

-- ============================================================
-- 3. Live shared rooms
--    The 4-letter room code is the shared secret; rooms expire after 24h
--    (expiry is enforced client-side; stale rows are harmless and tiny).
--    State is one jsonb blob, last-write-wins — fine for a turn-based game.
-- ============================================================
create table if not exists public.rooms (
  code text primary key check (code ~ '^[A-Z0-9]{4}$'),
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.rooms enable row level security;

create policy "rooms readable by everyone"
  on public.rooms for select using (true);

create policy "anyone can create a room"
  on public.rooms for insert with check (true);

create policy "anyone in a room can update it"
  on public.rooms for update using (true);

-- Housekeeping: creating a room also purges rooms older than 24 hours.
create or replace function public.purge_old_rooms()
returns trigger
language plpgsql security definer as $$
begin
  delete from public.rooms where created_at < now() - interval '24 hours';
  return new;
end $$;

drop trigger if exists purge_old_rooms_trigger on public.rooms;
create trigger purge_old_rooms_trigger
  before insert on public.rooms
  for each row execute function public.purge_old_rooms();

-- Realtime: broadcast room row changes to subscribed players.
alter publication supabase_realtime add table public.rooms;
