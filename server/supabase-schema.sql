-- Run this in the Supabase SQL editor.
create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  address text not null,
  city text not null,
  items jsonb not null default '[]'::jsonb,
  total_amount numeric(12, 2) not null,
  payment_method text not null default 'COD',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered')),
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- The backend uses the service role key. Public clients cannot read orders.
drop policy if exists "Orders are private" on public.orders;
create policy "Orders are private" on public.orders
  for select
  using (false);

-- The API endpoint creates orders through the server-side service role.
drop policy if exists "Public can insert orders" on public.orders;
create policy "Public can insert orders" on public.orders
  for insert
  with check (true);

-- Never expose the service role key to browser code.
