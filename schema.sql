-- FootballHub Supabase schema
create extension if not exists pgcrypto;
create table if not exists public.news (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 summary text,
 content text,
 image_url text,
 category text default 'Football',
 author_id uuid references auth.users(id) on delete set null,
 published boolean not null default false,
 published_at timestamptz,
 created_at timestamptz not null default now()
);
create table if not exists public.videos (
 id uuid primary key default gen_random_uuid(), title text not null, description text,
 thumbnail_url text, video_url text, category text default 'Football',
 published boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.matches (
 id uuid primary key default gen_random_uuid(), competition text, home_team text not null,
 away_team text not null, home_score int, away_score int, kickoff_at timestamptz, status text default 'scheduled', created_at timestamptz not null default now()
);
alter table public.news enable row level security;
alter table public.videos enable row level security;
alter table public.matches enable row level security;
drop policy if exists "Public can read published news" on public.news;
create policy "Public can read published news" on public.news for select to anon, authenticated using (published = true);
drop policy if exists "Authenticated can insert news" on public.news;
create policy "Authenticated can insert news" on public.news for insert to authenticated with check ((select auth.uid()) = author_id or author_id is null);
drop policy if exists "Public can read published videos" on public.videos;
create policy "Public can read published videos" on public.videos for select to anon, authenticated using (published = true);
drop policy if exists "Public can read matches" on public.matches;
create policy "Public can read matches" on public.matches for select to anon, authenticated using (true);
-- After running this, create your admin user in Supabase Auth.
