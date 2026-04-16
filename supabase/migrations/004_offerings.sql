-- ═══════════════════════════════════════════════════════════════════
-- Migration 004: offerings table
-- Stores quote-builder / services page offerings so admin can add
-- new service types without code changes.
-- Paste into Supabase Dashboard → SQL Editor → Run.
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT).
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.offerings (
    id                uuid primary key default gen_random_uuid(),
    slug              text unique not null,
    category          text not null check (category in (
                          'website', 'ecommerce', 'saas', 'webapp', 'mobile', 'other'
                      )),
    name              text not null,
    tagline           text not null default '',
    description       text not null default '',
    long_description  text default '',
    audience          jsonb default '[]'::jsonb,
    features          jsonb default '[]'::jsonb,
    tech_stack        jsonb default '[]'::jsonb,
    timeline          text default '',
    starting_inr      int  not null default 0,
    starting_usd      int  not null default 0,
    -- References a slot in the `pricing` settings row. Determines how the
    -- quote builder computes the total for this offering.
    pricing_key       text not null check (pricing_key in (
                          'static_tiers', 'shopify', 'app', 'mobile'
                      )),
    seo_keywords      jsonb default '[]'::jsonb,
    -- SVG `path d` attribute for the card icon.
    icon              text default '',
    sort_order        int  default 0,
    created_at        timestamptz default now(),
    updated_at        timestamptz default now()
);

create index if not exists offerings_slug_idx       on public.offerings (slug);
create index if not exists offerings_category_idx   on public.offerings (category);
create index if not exists offerings_sort_order_idx on public.offerings (sort_order);

-- Reuse touch_updated_at() from the base schema.
drop trigger if exists offerings_touch on public.offerings;
create trigger offerings_touch before update on public.offerings
  for each row execute function public.touch_updated_at();

alter table public.offerings enable row level security;

-- Public read: anyone can read offerings (they power the marketing pages).
drop policy if exists "public read offerings" on public.offerings;
create policy "public read offerings"
    on public.offerings for select
    using (true);

-- Writes go through the service role (bypasses RLS on the server).
