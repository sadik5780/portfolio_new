-- Run this in Supabase Dashboard → SQL Editor
-- Run AFTER quotes and invoices tables exist

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  company text,
  address text,
  country text,
  currency text not null default 'USD',
  status text not null default 'active' check (status in ('lead', 'active', 'completed', 'inactive')),
  source text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Link existing tables to clients
alter table public.quotes add column if not exists client_id uuid references public.clients(id) on delete set null;
alter table public.invoices add column if not exists client_id uuid references public.clients(id) on delete set null;
alter table public.leads add column if not exists client_id uuid references public.clients(id) on delete set null;

create or replace function update_clients_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger clients_updated_at
  before update on public.clients
  for each row execute function update_clients_updated_at();

alter table public.clients enable row level security;

-- ── Seed test client ──────────────────────────────
insert into public.clients (name, email, phone, company, address, country, currency, status, source, notes)
values (
  'Simon Bishop',
  'simon@bishopventures.com',
  '+1 415 555 0192',
  'Bishop Ventures',
  'San Francisco, CA',
  'United States',
  'USD',
  'active',
  'Referral',
  'Test client. Building a SaaS analytics dashboard. Budget $12K-$15K. Prefers weekly demos over Zoom.'
);
