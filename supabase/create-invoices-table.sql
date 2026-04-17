-- Run this in Supabase Dashboard → SQL Editor

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  status text not null default 'unpaid' check (status in ('draft', 'unpaid', 'paid', 'overdue', 'cancelled')),
  client_name text not null,
  client_email text,
  client_company text,
  client_address text,
  project_type text,
  currency text not null default 'USD',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  tax_amount numeric not null default 0,
  total numeric not null default 0,
  notes text,
  payment_method text,
  due_date date not null default (current_date + interval '14 days'),
  issue_date date not null default current_date,
  paid_date date,
  quote_id uuid references public.quotes(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function update_invoices_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger invoices_updated_at
  before update on public.invoices
  for each row execute function update_invoices_updated_at();

alter table public.invoices enable row level security;
