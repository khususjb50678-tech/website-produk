-- WITAMA STORE.ID - FINAL SUPABASE SETUP
-- Jalankan sekali di Supabase > SQL Editor.

create table if not exists public.products (
  id text primary key,
  title text not null,
  description text not null default '',
  image text not null default '',
  link text not null,
  order_num integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key check (id = 1),
  brand text not null default 'Witama Store.ID',
  username text not null default 'admin',
  logo_small text not null default '',
  logo_large text not null default ''
);

alter table public.site_settings add column if not exists logo_small text not null default '';
alter table public.site_settings add column if not exists logo_large text not null default '';

insert into public.site_settings (id,brand,username,logo_small,logo_large)
values (1,'Witama Store.ID','admin','','')
on conflict (id) do nothing;

-- Public Storage bucket untuk foto/logo.
insert into storage.buckets (id,name,public)
values ('media','media',true)
on conflict (id) do update set public=true;

alter table public.products enable row level security;
alter table public.site_settings enable row level security;

-- PRODUCTS
 drop policy if exists "public can read active products" on public.products;
create policy "public can read active products" on public.products for select to anon using (active = true);
drop policy if exists "authenticated can read products" on public.products;
create policy "authenticated can read products" on public.products for select to authenticated using (true);
drop policy if exists "authenticated can insert products" on public.products;
create policy "authenticated can insert products" on public.products for insert to authenticated with check (true);
drop policy if exists "authenticated can update products" on public.products;
create policy "authenticated can update products" on public.products for update to authenticated using (true) with check (true);
drop policy if exists "authenticated can delete products" on public.products;
create policy "authenticated can delete products" on public.products for delete to authenticated using (true);

-- SITE SETTINGS
 drop policy if exists "public can read settings" on public.site_settings;
create policy "public can read settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "authenticated can insert settings" on public.site_settings;
create policy "authenticated can insert settings" on public.site_settings for insert to authenticated with check (true);
drop policy if exists "authenticated can update settings" on public.site_settings;
create policy "authenticated can update settings" on public.site_settings for update to authenticated using (true) with check (true);

-- STORAGE: pengunjung boleh membaca file karena bucket public.
-- Admin yang login boleh upload / update / delete file.
drop policy if exists "authenticated media upload" on storage.objects;
create policy "authenticated media upload" on storage.objects for insert to authenticated with check (bucket_id = 'media');
drop policy if exists "authenticated media read" on storage.objects;
create policy "authenticated media read" on storage.objects for select to authenticated using (bucket_id = 'media');
drop policy if exists "authenticated media update" on storage.objects;
create policy "authenticated media update" on storage.objects for update to authenticated using (bucket_id = 'media') with check (bucket_id = 'media');
drop policy if exists "authenticated media delete" on storage.objects;
create policy "authenticated media delete" on storage.objects for delete to authenticated using (bucket_id = 'media');

-- Jika project Supabase kamu memakai Data API exposure manual,
-- pastikan tabel public.products dan public.site_settings sudah di-expose.
