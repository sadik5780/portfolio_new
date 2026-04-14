-- ═══════════════════════════════════════════════════════════════════
-- Migration 002: blog_posts table
-- Paste into Supabase → SQL Editor → Run.
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT).
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.blog_posts (
    id            uuid primary key default gen_random_uuid(),
    slug          text unique not null,
    title         text not null,
    description   text not null,
    keywords      jsonb default '[]'::jsonb,
    tags          jsonb default '[]'::jsonb,
    category      text not null default 'Engineering' check (
                     category in ('Pricing','Hiring','Engineering','E-commerce','SaaS')
                  ),
    author        text not null default 'Sadik Shaikh',
    read_time     int not null default 5,
    -- Content stored as a JSON array of typed blocks (see BlogBlock type)
    content       jsonb not null default '[]'::jsonb,
    image         text,
    published     boolean not null default true,
    published_at  timestamptz not null default now(),
    created_at    timestamptz default now(),
    updated_at    timestamptz default now()
);

create index if not exists blog_posts_slug_idx        on public.blog_posts (slug);
create index if not exists blog_posts_category_idx    on public.blog_posts (category);
create index if not exists blog_posts_published_idx   on public.blog_posts (published, published_at desc);

-- Reuse the touch_updated_at() from the base schema
drop trigger if exists blog_posts_touch on public.blog_posts;
create trigger blog_posts_touch before update on public.blog_posts
  for each row execute function public.touch_updated_at();

alter table public.blog_posts enable row level security;

-- Public read: anyone can read published posts (RLS-gated to published=true)
drop policy if exists "public read published blog posts" on public.blog_posts;
create policy "public read published blog posts"
    on public.blog_posts for select
    using (published = true);

-- Writes go through the service role (bypasses RLS on the server)
