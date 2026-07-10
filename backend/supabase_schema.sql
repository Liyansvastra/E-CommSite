-- LIYAN'S VASTRA Supabase content storage
-- Run this in the Supabase SQL Editor for the project.

create extension if not exists pgcrypto;

-- DB/table 1: editable current website content.
create table if not exists public.site_content_current (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_content_current_updated_at on public.site_content_current;
create trigger set_site_content_current_updated_at
before update on public.site_content_current
for each row
execute function public.set_updated_at();

-- DB/table 2: append-only backup/audit snapshots.
-- The application only inserts into this table. It has no update/delete API route.
create table if not exists public.site_content_backup (
  id uuid primary key default gen_random_uuid(),
  source_id text not null default 'main',
  action text not null default 'save',
  content jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists site_content_backup_created_at_idx
on public.site_content_backup (created_at desc);

-- Optional hardening if you later use non-service-role database users:
-- revoke update, delete on public.site_content_backup from anon, authenticated;
