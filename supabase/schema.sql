-- Retro Clothing production Supabase schema
-- Run this file once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  product_code text not null default '',
  category text not null default 'shirts' check (category in ('shirts','tees','pants')),
  description text not null default '',
  was_price numeric(12,2),
  now_price numeric(12,2) not null default 0,
  fabric text not null default '',
  colour text not null default '',
  occasion text not null default '',
  care_instruction text not null default '',
  images jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  stock_status text not null default 'in_stock' check (stock_status in ('in_stock','out_of_stock')),
  is_new_arrival boolean not null default false,
  is_offer boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category);
create index if not exists products_featured_idx on public.products(is_featured) where is_featured = true;
create index if not exists products_offer_idx on public.products(is_offer) where is_offer = true;
create index if not exists products_new_idx on public.products(is_new_arrival) where is_new_arrival = true;
create index if not exists products_created_at_idx on public.products(created_at desc);

create table if not exists public.announcements (
  id text primary key,
  title text not null default '',
  image text not null default '',
  timing text not null default '',
  location text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists announcements_created_at_idx on public.announcements(created_at desc);

create table if not exists public.company_settings (
  id integer primary key check (id = 1),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id text primary key default gen_random_uuid()::text,
  name text not null default '',
  rating integer not null default 5 check (rating between 1 and 5),
  text text not null default '',
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists reviews_featured_idx on public.reviews(is_featured) where is_featured = true;
create index if not exists reviews_created_at_idx on public.reviews(created_at desc);

create table if not exists public.contact_messages (
  id text primary key,
  name text not null,
  email text not null,
  mobile text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','read')),
  created_at timestamptz not null default now()
);
create index if not exists contact_messages_created_at_idx on public.contact_messages(created_at desc);
create index if not exists contact_messages_status_idx on public.contact_messages(status);

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Enable RLS everywhere.
alter table public.products enable row level security;
alter table public.announcements enable row level security;
alter table public.company_settings enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_messages enable row level security;
alter table public.app_admins enable row level security;

-- Helper: current user is an admin.
create or replace function public.is_retro_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.app_admins where user_id = auth.uid());
$$;

-- Drop/recreate policies so this script is safe to re-run.
drop policy if exists products_public_read on public.products;
drop policy if exists products_admin_write on public.products;
create policy products_public_read on public.products for select using (true);
create policy products_admin_write on public.products for all using (public.is_retro_admin()) with check (public.is_retro_admin());

drop policy if exists announcements_public_read on public.announcements;
drop policy if exists announcements_admin_write on public.announcements;
create policy announcements_public_read on public.announcements for select using (true);
create policy announcements_admin_write on public.announcements for all using (public.is_retro_admin()) with check (public.is_retro_admin());

drop policy if exists settings_public_read on public.company_settings;
drop policy if exists settings_admin_write on public.company_settings;
create policy settings_public_read on public.company_settings for select using (true);
create policy settings_admin_write on public.company_settings for all using (public.is_retro_admin()) with check (public.is_retro_admin());

drop policy if exists reviews_public_read on public.reviews;
drop policy if exists reviews_admin_write on public.reviews;
create policy reviews_public_read on public.reviews for select using (true);
create policy reviews_admin_write on public.reviews for all using (public.is_retro_admin()) with check (public.is_retro_admin());

drop policy if exists messages_public_insert on public.contact_messages;
drop policy if exists messages_admin_read on public.contact_messages;
drop policy if exists messages_admin_update on public.contact_messages;
create policy messages_public_insert on public.contact_messages for insert with check (true);
create policy messages_admin_read on public.contact_messages for select using (public.is_retro_admin());
create policy messages_admin_update on public.contact_messages for update using (public.is_retro_admin()) with check (public.is_retro_admin());

-- Only admins can see/manage the admin allow-list.
drop policy if exists admins_self_read on public.app_admins;
drop policy if exists admins_admin_write on public.app_admins;
create policy admins_self_read on public.app_admins for select using (user_id = auth.uid());
create policy admins_admin_write on public.app_admins for all using (public.is_retro_admin()) with check (public.is_retro_admin());

-- Public product/announcement images. Writes are restricted to admins.
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = true;

drop policy if exists retro_storage_public_read on storage.objects;
drop policy if exists retro_storage_admin_insert on storage.objects;
drop policy if exists retro_storage_admin_update on storage.objects;
drop policy if exists retro_storage_admin_delete on storage.objects;
create policy retro_storage_public_read on storage.objects for select using (bucket_id = 'products');
create policy retro_storage_admin_insert on storage.objects for insert with check (bucket_id = 'products' and public.is_retro_admin());
create policy retro_storage_admin_update on storage.objects for update using (bucket_id = 'products' and public.is_retro_admin()) with check (bucket_id = 'products' and public.is_retro_admin());
create policy retro_storage_admin_delete on storage.objects for delete using (bucket_id = 'products' and public.is_retro_admin());

-- Seed settings only if empty. Product/review demo content remains in the app's fallback cache
-- until you choose to import it into Supabase.
insert into public.company_settings (id, data)
select 1, '{}'::jsonb
where not exists (select 1 from public.company_settings where id = 1);
