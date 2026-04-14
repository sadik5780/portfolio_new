-- ═══════════════════════════════════════════════════════════════════
-- Migration 001: payments table
-- Apply by pasting into Supabase Dashboard → SQL Editor → Run.
-- Safe to re-run (uses IF NOT EXISTS).
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.payments (
    id                   uuid primary key default gen_random_uuid(),
    -- Customer
    name                 text not null,
    email                text not null,
    phone                text,
    -- Service
    service_type         text not null,        -- e.g. 'shopify', 'static:standard', 'custom-app'
    service_label        text not null,        -- human-readable name for display
    features             jsonb default '[]'::jsonb,
    -- Amount (always stored as the display amount + smallest-unit amount)
    amount               numeric(12,2) not null,      -- display amount (e.g. 50000.00 for ₹50,000)
    amount_minor         bigint not null,             -- smallest unit sent to Razorpay (paise / cents)
    currency             text not null check (currency in ('INR', 'USD')),
    -- Razorpay
    razorpay_order_id    text not null unique,
    razorpay_payment_id  text,
    razorpay_signature   text,
    -- State
    status               text not null default 'pending' check (
                            status in ('pending','paid','failed','cancelled')
                         ),
    failure_reason       text,
    notes                jsonb,
    created_at           timestamptz default now(),
    updated_at           timestamptz default now()
);

create index if not exists payments_email_idx    on public.payments(email);
create index if not exists payments_order_idx    on public.payments(razorpay_order_id);
create index if not exists payments_status_idx   on public.payments(status);
create index if not exists payments_created_idx  on public.payments(created_at desc);

-- Reuse the touch_updated_at() function from the base schema
drop trigger if exists payments_touch on public.payments;
create trigger payments_touch before update on public.payments
  for each row execute function public.touch_updated_at();

alter table public.payments enable row level security;

-- No public policies: all payment reads/writes go through the service role
-- on the server (api/payments/*). service_role bypasses RLS, so no policy
-- is needed for admin operations.
