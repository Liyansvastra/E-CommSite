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

-- DB-1 structured editable tables.
-- These tables store page text and image/container values as separate attributes.
create table if not exists public.site_pages_current (
  page_key text primary key,
  page_name text not null,
  title text,
  subtitle text,
  body jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_site_pages_current_updated_at on public.site_pages_current;
create trigger set_site_pages_current_updated_at
before update on public.site_pages_current
for each row
execute function public.set_updated_at();

create table if not exists public.image_containers_current (
  id text primary key,
  category_id text not null,
  category_name text not null,
  group_key text not null,
  group_name text not null,
  name text not null,
  brand_name text,
  description text,
  cloth_style text,
  fabric text,
  fit text,
  rating text,
  rate text,
  front_image text,
  back_image text,
  show_on_home boolean not null default true,
  show_on_services boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists image_containers_current_category_idx
on public.image_containers_current (category_id, sort_order);

drop trigger if exists set_image_containers_current_updated_at on public.image_containers_current;
create trigger set_image_containers_current_updated_at
before update on public.image_containers_current
for each row
execute function public.set_updated_at();

-- DB-2 structured mirror/backup tables.
-- The application only inserts into these tables. It has no update/delete route for them.
create table if not exists public.site_pages_mirror (
  id uuid primary key default gen_random_uuid(),
  edit_label text not null,
  page_key text not null,
  page_name text not null,
  title text,
  subtitle text,
  body jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists site_pages_mirror_edit_label_idx
on public.site_pages_mirror (edit_label, created_at desc);

create table if not exists public.image_containers_mirror (
  id uuid primary key default gen_random_uuid(),
  edit_label text not null,
  container_id text not null,
  category_id text not null,
  category_name text not null,
  group_key text not null,
  group_name text not null,
  name text not null,
  brand_name text,
  description text,
  cloth_style text,
  fabric text,
  fit text,
  rating text,
  rate text,
  front_image text,
  back_image text,
  show_on_home boolean not null default true,
  show_on_services boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists image_containers_mirror_edit_label_idx
on public.image_containers_mirror (edit_label, created_at desc);

-- Contact/email messages submitted from the website.
-- This stores the enquiry payload and send status for reporting.
create table if not exists public.contact_email_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'received',
  provider text,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists contact_email_messages_created_at_idx
on public.contact_email_messages (created_at desc);

create index if not exists contact_email_messages_email_idx
on public.contact_email_messages (email);

-- Optional hardening if you later use non-service-role database users:
-- revoke update, delete on public.site_content_backup from anon, authenticated;
-- revoke update, delete on public.site_pages_mirror from anon, authenticated;
-- revoke update, delete on public.image_containers_mirror from anon, authenticated;
