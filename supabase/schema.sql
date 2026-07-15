create extension if not exists pgcrypto;

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
