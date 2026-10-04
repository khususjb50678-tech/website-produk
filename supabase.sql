-- Jalankan di Supabase > SQL Editor
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
  brand text not null default 'TAMA STORE',
  username text not null default 'admin'
);
insert into public.site_settings (id, brand, username) values (1, 'TAMA STORE', 'admin') on conflict (id) do nothing;

alter table public.products enable row level security;
alter table public.site_settings enable row level security;

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

drop policy if exists "public can read settings" on public.site_settings;
create policy "public can read settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "authenticated can insert settings" on public.site_settings;
create policy "authenticated can insert settings" on public.site_settings for insert to authenticated with check (true);
drop policy if exists "authenticated can update settings" on public.site_settings;
create policy "authenticated can update settings" on public.site_settings for update to authenticated using (true) with check (true);
