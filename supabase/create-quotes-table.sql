-- Run this in Supabase Dashboard → SQL Editor

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined')),
  client_name text not null,
  client_email text,
  client_company text,
  project_type text,
  currency text not null default 'USD',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  notes text,
  delivery_days integer not null default 30,
  includes_maintenance boolean not null default true,
  issue_date date not null default current_date,
  valid_until date not null default (current_date + interval '14 days'),
  lead_id uuid references public.leads(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_quotes_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger quotes_updated_at
  before update on public.quotes
  for each row execute function update_quotes_updated_at();

-- RLS: only service role can access quotes
alter table public.quotes enable row level security;
