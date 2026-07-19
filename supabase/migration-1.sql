-- Migration 1: question packs, player suggestions, draw statistics
-- Run once in the Supabase SQL Editor (after schema.sql).

-- ============================================================
-- 1. Question packs (optional theme tag, e.g. 'Christmas', 'Retreat')
-- ============================================================
alter table public.questions add column if not exists pack text;

-- ============================================================
-- 2. Player suggestions → approved in /#/admin
-- ============================================================
create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in (
    'getting_to_know', 'ideals_reals', 'heart_to_heart', 'memories', 'matters_of_soul'
  )),
  en text not null default '',
  zh text not null default '',
  name text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);
alter table public.suggestions enable row level security;

create policy "anyone can suggest"
  on public.suggestions for insert with check (status = 'pending');

create policy "admins read suggestions"
  on public.suggestions for select to authenticated
  using (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')));

create policy "admins update suggestions"
  on public.suggestions for update to authenticated
  using (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')));

create policy "admins delete suggestions"
  on public.suggestions for delete to authenticated
  using (exists (select 1 from public.admins a where a.email = (auth.jwt() ->> 'email')));

-- ============================================================
-- 3. Draw/skip statistics (anonymous counters, no personal data)
-- ============================================================
create table if not exists public.question_stats (
  question_id text primary key,
  draws integer not null default 0,
  skips integer not null default 0
);
alter table public.question_stats enable row level security;

create policy "stats readable by everyone"
  on public.question_stats for select using (true);

-- Counters are bumped through this function only (no direct writes)
create or replace function public.bump_stat(qid text, kind text)
returns void
language plpgsql security definer as $$
begin
  if kind not in ('draw', 'skip') then return; end if;
  insert into public.question_stats as s (question_id, draws, skips)
  values (qid,
          case when kind = 'draw' then 1 else 0 end,
          case when kind = 'skip' then 1 else 0 end)
  on conflict (question_id) do update
    set draws = s.draws + case when kind = 'draw' then 1 else 0 end,
        skips = s.skips + case when kind = 'skip' then 1 else 0 end;
end $$;

grant execute on function public.bump_stat(text, text) to anon, authenticated;
