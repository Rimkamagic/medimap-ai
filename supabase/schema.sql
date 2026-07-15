create extension if not exists pgcrypto;

create table if not exists public.medimap_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  display_name text,
  preferred_region text not null,
  preferred_place_name text not null,
  preferred_latitude numeric(10, 7) not null,
  preferred_longitude numeric(10, 7) not null
);

alter table public.medimap_profiles enable row level security;

drop policy if exists "Users can read own medimap profile" on public.medimap_profiles;
create policy "Users can read own medimap profile"
  on public.medimap_profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own medimap profile" on public.medimap_profiles;
create policy "Users can create own medimap profile"
  on public.medimap_profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own medimap profile" on public.medimap_profiles;
create policy "Users can update own medimap profile"
  on public.medimap_profiles
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

comment on table public.medimap_profiles is
  'MediMap AI user profile location. Stores a chosen region/landmark, not exact live geolocation.';

create table if not exists public.medimap_analysis_history (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  device_id text not null,
  summary text not null,
  urgency text not null check (urgency in ('EMERGENCY', 'URGENT', 'ROUTINE', 'SELF_CARE')),
  departments text[] not null default '{}',
  symptom_input jsonb not null,
  analysis_result jsonb not null
);

create index if not exists medimap_analysis_history_device_created_idx
  on public.medimap_analysis_history (device_id, created_at desc);

alter table public.medimap_analysis_history enable row level security;

drop policy if exists "No direct client access" on public.medimap_analysis_history;
create policy "No direct client access"
  on public.medimap_analysis_history
  for all
  using (false)
  with check (false);

comment on table public.medimap_analysis_history is
  'MediMap AI saved analysis history. Access through Next.js Route Handlers with service role only.';
