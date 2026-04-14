-- ═══════════════════════════════════════════════════════════════════
-- Sadik portfolio — Supabase schema
-- Paste this entire file into Supabase Dashboard → SQL Editor → Run
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT).
-- ═══════════════════════════════════════════════════════════════════

-- ── Extensions ─────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ═══════════════════════════════════════════════════════════════════
-- 1. PROJECTS
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.projects (
    id              uuid primary key default gen_random_uuid(),
    slug            text unique not null,
    title           text not null,
    category        text not null check (category in ('SaaS', 'Shopify', 'Web Apps')),
    description     text not null,
    long_description text default '',
    problem         text default '',
    solution        text default '',
    features        jsonb default '[]'::jsonb,
    screenshots     jsonb default '[]'::jsonb,
    tags            jsonb default '[]'::jsonb,
    image           text default '',
    live_url        text,
    github_url      text,
    featured        boolean default false,
    year            text default '',
    client          text default '',
    sort_order      int default 0,
    created_at      timestamptz default now(),
    updated_at      timestamptz default now()
);

create index if not exists projects_slug_idx       on public.projects (slug);
create index if not exists projects_category_idx   on public.projects (category);
create index if not exists projects_featured_idx   on public.projects (featured);
create index if not exists projects_sort_order_idx on public.projects (sort_order);

-- ═══════════════════════════════════════════════════════════════════
-- 1b. TESTIMONIALS
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.testimonials (
    id              uuid primary key default gen_random_uuid(),
    name            text not null,
    role            text not null,
    company         text not null,
    country         text not null,
    country_flag    text default '',
    quote           text not null,
    rating          int  default 5 check (rating between 1 and 5),
    project_type    text default '',
    featured        boolean default true,
    sort_order      int default 0,
    created_at      timestamptz default now(),
    updated_at      timestamptz default now()
);

create index if not exists testimonials_featured_idx   on public.testimonials (featured);
create index if not exists testimonials_sort_order_idx on public.testimonials (sort_order);

-- ═══════════════════════════════════════════════════════════════════
-- 2. LEADS (contact form submissions)
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.leads (
    id            uuid primary key default gen_random_uuid(),
    name          text not null,
    email         text not null,
    project_type  text,
    budget        text,
    message       text not null,
    currency      text default 'inr',
    created_at    timestamptz default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- ═══════════════════════════════════════════════════════════════════
-- 3. SETTINGS (site content + pricing, key/value JSON)
-- Keys: hero, about, services, skills, stats, pricing
-- ═══════════════════════════════════════════════════════════════════
create table if not exists public.settings (
    key         text primary key,
    value       jsonb not null,
    updated_at  timestamptz default now()
);

-- ═══════════════════════════════════════════════════════════════════
-- updated_at trigger
-- ═══════════════════════════════════════════════════════════════════
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end$$;

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

drop trigger if exists testimonials_touch on public.testimonials;
create trigger testimonials_touch before update on public.testimonials
  for each row execute function public.touch_updated_at();

drop trigger if exists settings_touch on public.settings;
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- RLS  (Row Level Security)
-- ═══════════════════════════════════════════════════════════════════
alter table public.projects     enable row level security;
alter table public.testimonials enable row level security;
alter table public.leads        enable row level security;
alter table public.settings     enable row level security;

-- Public reads for site content
drop policy if exists "public read projects" on public.projects;
create policy "public read projects"
    on public.projects for select
    using (true);

drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials"
    on public.testimonials for select
    using (true);

drop policy if exists "public read settings" on public.settings;
create policy "public read settings"
    on public.settings for select
    using (true);

-- Public can submit the contact form (insert-only; no reads)
drop policy if exists "public insert leads" on public.leads;
create policy "public insert leads"
    on public.leads for insert
    with check (true);

-- Admin writes bypass RLS via the service_role key (used server-side only).
-- No explicit policies needed for admin — service_role always bypasses RLS.

-- ═══════════════════════════════════════════════════════════════════
-- SEED DATA (projects + settings)  — safe to re-run
-- ═══════════════════════════════════════════════════════════════════

insert into public.projects (
    slug, title, category, description, long_description, problem, solution,
    features, screenshots, tags, image, live_url, github_url, featured, year, client, sort_order
) values
(
    'aurora-saas', 'Aurora SaaS Platform', 'SaaS',
    'Full-stack SaaS platform with real-time analytics, team collaboration, and automated reporting.',
    'A comprehensive SaaS platform built from the ground up featuring real-time data analytics dashboards, multi-tenant architecture, role-based access control, and automated PDF report generation. Handles 10K+ concurrent users with sub-100ms response times.',
    'The client ran a fast-growing analytics agency where three separate tools (spreadsheets, a BI dashboard, and a reporting service) were glued together with manual processes. This caused data drift, slow client onboarding, and lost billable hours each week reconciling numbers.',
    'I designed a single multi-tenant SaaS platform that unified data ingestion, analysis, and reporting. A Next.js frontend talks to a typed tRPC API with Redis-cached queries on top of PostgreSQL. Teams get workspace-scoped access control, Stripe-metered billing, and one-click PDF exports — replacing all three legacy tools.',
    '["Multi-tenant architecture with workspace isolation","Real-time analytics dashboards with sub-100ms query times","Role-based access control (RBAC) for teams","Automated PDF report generation and email delivery","Stripe-powered usage metering and subscription billing","Audit logs and SOC-2 compliant activity tracking","REST + webhook API for customer integrations"]',
    '["/projects/aurora-dashboard.jpg","/projects/aurora-reports.jpg","/projects/aurora-billing.jpg","/projects/aurora-team.jpg"]',
    '["Next.js","TypeScript","PostgreSQL","Redis","Stripe"]',
    '/projects/aurora.jpg', 'https://aurora-demo.dev', null,
    true, '2024', 'Aurora Labs Inc.', 10
),
(
    'neural-ui', 'Neural UI Design System', 'Web Apps',
    'Accessible component library with 50+ components, theming engine, and Figma integration.',
    'An enterprise-grade design system featuring 50+ fully accessible React components, a powerful theming engine supporting dark/light modes and custom brand colors, comprehensive Storybook documentation, and seamless Figma-to-code workflows.',
    'A 40-engineer product org had four different button components across three apps, inconsistent spacing, and accessibility violations flagged on every audit.',
    'I led the build of a single React design system versioned on npm, token-driven via CSS variables, and round-trip synchronized with Figma. Every component ships WCAG AA compliant with automated axe-core tests in CI.',
    '["50+ fully accessible (WCAG AA) React components","Token-based theming with dark/light + brand color support","Figma plugin for two-way design token sync","Comprehensive Storybook documentation site","Automated accessibility testing with axe-core","Zero-runtime CSS via vanilla-extract","Semantic versioning with automated changelogs"]',
    '["/projects/neural-components.jpg","/projects/neural-theming.jpg","/projects/neural-storybook.jpg"]',
    '["React","Storybook","Figma API","Radix UI","SCSS"]',
    '/projects/neural.jpg', 'https://neural-ui.dev', null,
    true, '2024', 'Internal Platform Team', 20
),
(
    'cryptoflow', 'CryptoFlow Trading Engine', 'Web Apps',
    'High-performance crypto trading dashboard with real-time WebSocket feeds and charting.',
    'A real-time cryptocurrency trading interface featuring live WebSocket market data feeds, interactive TradingView-style charts, portfolio tracking, automated trading bot integration, and multi-exchange support with unified order management.',
    'Active traders had to juggle three exchange UIs, each with different order flows, to execute simple arbitrage strategies. Latency between signal and order was over 600ms.',
    'I built a unified trading dashboard connecting to Binance, Coinbase, and Kraken WebSockets simultaneously. End-to-end signal-to-order latency dropped to 80ms.',
    '["Real-time WebSocket market data from 3+ exchanges","TradingView-style interactive candlestick charts (D3.js)","Unified order ticket across exchanges","Custom trading bot API with backtesting UI","Portfolio P&L tracking with cost-basis accounting","Price alerts via SMS, email, and desktop push"]',
    '["/projects/crypto-dashboard.jpg","/projects/crypto-chart.jpg","/projects/crypto-portfolio.jpg"]',
    '["React","Node.js","WebSocket","D3.js","MongoDB"]',
    '/projects/cryptoflow.jpg', null, null,
    true, '2023', 'FinTech Studio', 30
),
(
    'bloom-shopify', 'Bloom & Co Shopify Store', 'Shopify',
    'Custom Shopify theme with headless product pages, subscription billing, and Instagram shop integration.',
    'A fully custom Shopify 2.0 theme for a DTC flower subscription brand, featuring a headless product configurator, native subscription billing via Shopify Subscriptions API, Instagram shopping integration, and a custom gift-message checkout extension.',
    'The brand was losing 22% of subscription carts at checkout because the default Shopify flow did not support gift messages or delivery scheduling. Mobile PageSpeed sat at 38.',
    'I rebuilt the storefront as a custom Shopify 2.0 theme with a lightweight headless product configurator, migrated subscriptions to native Shopify Subscriptions, and shipped a checkout extension. Mobile PageSpeed jumped to 94 and checkout abandonment dropped to 9%.',
    '["Custom Shopify 2.0 theme with section-based editor","Headless product configurator with live previews","Shopify Subscriptions API integration","Gift message + delivery date checkout extension","Instagram Shop and TikTok Shop sync","Mobile PageSpeed score of 94+","Klaviyo email flow integrations"]',
    '["/projects/bloom-home.jpg","/projects/bloom-product.jpg","/projects/bloom-checkout.jpg"]',
    '["Shopify","Liquid","JavaScript","Hydrogen","Klaviyo"]',
    '/projects/bloom.jpg', 'https://bloomandco-demo.dev', null,
    true, '2024', 'Bloom & Co', 40
),
(
    'northwear-shopify', 'Northwear Apparel', 'Shopify',
    'Headless Shopify + Hydrogen build with AR try-on, size recommender, and multi-currency checkout.',
    'A headless Shopify storefront on Hydrogen/Remix for a premium apparel brand shipping to India, USA, and Australia.',
    'Return rate on fit-sensitive SKUs was 31%, and the single-currency store was losing international traffic on checkout.',
    'I migrated the brand to a Hydrogen headless storefront with Shopify Markets, added a WebAR try-on using 8th Wall, and trained a simple size recommender from historical order + return data.',
    '["Hydrogen/Remix headless storefront","Shopify Markets multi-currency + multi-language","WebAR try-on with 8th Wall integration","ML-backed size recommender trained on return data","Shop Pay + Apple Pay + Google Pay","ISR product pages for sub-second navigation"]',
    '["/projects/northwear-home.jpg","/projects/northwear-ar.jpg","/projects/northwear-size.jpg"]',
    '["Shopify","Hydrogen","Remix","8th Wall","GraphQL"]',
    '/projects/northwear.jpg', 'https://northwear-demo.dev', null,
    false, '2023', 'Northwear Apparel', 50
),
(
    'cloudpipe', 'CloudPipe CI/CD', 'SaaS',
    'Custom CI/CD pipeline manager with Docker orchestration and GitHub integration.',
    'A self-hosted CI/CD platform that integrates with GitHub webhooks, manages Docker-based build environments, supports parallel test execution, and provides detailed build analytics.',
    'A mid-sized engineering team was spending $8K/month on a hosted CI service and still hit build queue times of 20+ minutes during peak hours.',
    'I built a self-hosted CI/CD platform on a small Kubernetes cluster with dynamic worker scaling, a visual pipeline editor, and drop-in YAML compatibility with their existing config.',
    '["Self-hosted Kubernetes build runners","Visual drag-and-drop pipeline editor","GitHub webhook integration","Parallel test execution with auto-sharding","Build analytics + flaky test detection","Slack / Discord notifications"]',
    '["/projects/cloudpipe-builds.jpg","/projects/cloudpipe-editor.jpg","/projects/cloudpipe-analytics.jpg"]',
    '["Go","Docker","GitHub API","React","gRPC"]',
    '/projects/cloudpipe.jpg', 'https://cloudpipe.dev', null,
    false, '2023', 'Internal DevEx Team', 60
),
(
    'markdownly', 'Markdownly Editor', 'Web Apps',
    'Collaborative markdown editor with live preview, version history, and export options.',
    'A real-time collaborative markdown editor supporting multiple cursors, conflict-free replicated data types (CRDTs) for synchronization, GitHub-flavored markdown rendering, version history with diff views, and export to PDF/HTML/DOCX.',
    'Documentation teams using Google Docs for engineering RFCs lost formatting when pasting code and had no proper version diffing.',
    'I built a real-time collaborative markdown editor using Yjs CRDTs over WebRTC, with a diff-style version history and one-click export to PDF, HTML, and DOCX.',
    '["Real-time multi-cursor collaboration (Yjs CRDTs)","GitHub-flavored markdown rendering","Version history with side-by-side diff view","Export to PDF, HTML, DOCX","Offline-first with local-first sync","Slash-command inserts for tables, code, diagrams"]',
    '["/projects/markdownly-editor.jpg","/projects/markdownly-history.jpg"]',
    '["Next.js","Yjs","WebRTC","Prisma","Vercel"]',
    '/projects/markdownly.jpg', 'https://markdownly.app', null,
    false, '2023', 'Open Source', 70
)
on conflict (slug) do nothing;

-- Seed testimonials (safe to re-run — duplicates are avoided by matching quote text)
insert into public.testimonials (name, role, company, country, country_flag, quote, rating, project_type, featured, sort_order)
select * from (values
  ('Aarav Sharma', 'Founder', 'BoltShip Logistics', 'India', '🇮🇳',
   'Sadik rebuilt our dispatch dashboard from a 6-second LCP to under 400ms and shipped a new driver mobile web app in four weeks. Most importantly, he understood the business logic — we did not have to explain it twice.',
   5, 'SaaS Platform', true, 10),
  ('Jessica Liu', 'Head of Engineering', 'Aperture Analytics', 'USA', '🇺🇸',
   'We needed a Next.js 14 App Router specialist for a 12-week retainer. Sadik stepped in on day one, owned the full auth + billing slice, and wrote the cleanest code our team has shipped all year. Fully remote from India with morning EST overlap.',
   5, 'Next.js Retainer', true, 20),
  ('Tom Jenkins', 'DTC Founder', 'Northwear Apparel', 'Australia', '🇦🇺',
   'Our Shopify store was averaging a 38 mobile PageSpeed score. Sadik rebuilt it as a headless Hydrogen storefront — 94 PageSpeed, 3× faster checkout, and revenue up 22% in the first month. Handled AEST mornings without complaint.',
   5, 'Headless Shopify', true, 30),
  ('Priya Raghavan', 'COO', 'LedgerLoop (YC S24)', 'USA', '🇺🇸',
   'Hiring senior React talent in SF is either expensive or unavailable. Sadik delivered both speed and quality at a fraction of the cost. He architected our multi-tenant SaaS from scratch — Stripe, RBAC, admin tools, the lot.',
   5, 'SaaS MVP', true, 40),
  ('Rohan Mehta', 'Product Lead', 'Kiran Fintech', 'India', '🇮🇳',
   'We went from a buggy Django admin to a clean Next.js dashboard serving 20k users in a month. Sadik wrote every line of the frontend and worked alongside our backend team. Communication was sharp — daily standups, clear PRs, no ambiguity.',
   5, 'Frontend Rebuild', true, 50),
  ('Ellie Park', 'Solo Founder', 'StudyBuddy', 'Australia', '🇦🇺',
   'As a solo founder I needed a fractional tech lead, not just a coder. Sadik helped me scope the MVP, cut 40% of the feature list, and shipped a real product in 10 weeks. The pricing builder on his site gave me a fixed quote upfront — no surprises.',
   5, 'MVP + Fractional CTO', true, 60)
) as t(name, role, company, country, country_flag, quote, rating, project_type, featured, sort_order)
where not exists (
  select 1 from public.testimonials where public.testimonials.quote = t.quote
);

-- Default site content (fallback values used by admin CMS)
insert into public.settings (key, value) values
('hero', '{
  "badge": "Available for new projects",
  "heading_line1": "I craft digital",
  "heading_highlight": "experiences",
  "heading_line2": "that stand out.",
  "subtitle": "Full-stack developer specializing in building exceptional digital products with modern web technologies. Focused on performance, accessibility, and clean code."
}'::jsonb),
('stats', '{
  "items": [
    {"value": "5+", "label": "Years Experience"},
    {"value": "30+", "label": "Projects Delivered"},
    {"value": "15+", "label": "Happy Clients"}
  ]
}'::jsonb),
('about', '{
  "label": "About",
  "title": "A bit about me",
  "description": "I am a passionate developer who loves turning complex problems into simple, beautiful, and intuitive solutions.",
  "experiences": [
    {"role": "Senior Frontend Engineer", "company": "TechCorp", "period": "2022 — Present", "description": "Leading the frontend architecture for a SaaS platform serving 50K+ users."},
    {"role": "Full-Stack Developer", "company": "StartupXYZ", "period": "2020 — 2022", "description": "Built and shipped 3 products from concept to production in an early-stage startup."},
    {"role": "Frontend Developer", "company": "AgencyPro", "period": "2019 — 2020", "description": "Developed high-performance websites and web apps for enterprise clients."}
  ]
}'::jsonb),
('skills', '{
  "groups": [
    {"category": "Frontend", "items": ["React", "Next.js", "TypeScript", "SCSS", "Framer Motion"]},
    {"category": "Backend", "items": ["Node.js", "Python", "PostgreSQL", "Redis", "GraphQL"]},
    {"category": "Tools", "items": ["Git", "Docker", "AWS", "Figma", "CI/CD"]}
  ]
}'::jsonb),
('services', '{
  "label": "Services",
  "title": "What I build",
  "items": [
    {"title": "Custom SaaS Platforms", "description": "Multi-tenant web apps with billing, RBAC, and admin tooling. Built to scale."},
    {"title": "Shopify Stores", "description": "Custom Shopify 2.0 themes and headless Hydrogen storefronts with checkout extensions."},
    {"title": "Marketing Websites", "description": "High-conversion, SEO-optimized landing pages and multi-page marketing sites."},
    {"title": "Design Systems", "description": "Typed, accessible React component libraries with Figma integration."}
  ]
}'::jsonb),
('pricing', '{
  "shopify": {"inr": 50000, "usd": 2000},
  "static_tiers": [
    {"id": "starter", "name": "Starter", "description": "Up to 5 pages — ideal for landing sites and portfolios.", "inr": 15000, "usd": 200, "includes": ["Up to 5 responsive pages","Dark/light theme support","Contact form wired to email","Basic on-page SEO","2 rounds of revisions"]},
    {"id": "standard", "name": "Standard", "description": "Up to 10 pages — for growing brands and agencies.", "inr": 30000, "usd": 500, "includes": ["Up to 10 responsive pages","Blog/CMS integration","Advanced SEO with sitemap + schema","Analytics + performance monitoring","Contact form + newsletter integration","3 rounds of revisions"]},
    {"id": "premium", "name": "Premium", "description": "10-30 pages — full marketing sites with rich animation.", "inr": 50000, "usd": 800, "includes": ["10-30 responsive pages","Custom animations (Framer Motion)","Headless CMS (Sanity / Contentful)","Full SEO + sitemap + schema + OG","Multi-language ready","Unlimited revisions (scoped)"]}
  ],
  "app": {
    "base": {"inr": 100000, "usd": 10000},
    "feature_price": {"inr": 5000, "usd": 100},
    "features": [
      {"id": "auth", "name": "Authentication (Login/Register)", "description": "Secure email, OAuth (Google/GitHub), password reset, MFA."},
      {"id": "admin", "name": "Admin Dashboard", "description": "CRUD-enabled admin panel with filters, search, and exports."},
      {"id": "payments", "name": "Payment Integration (Razorpay/Stripe)", "description": "Checkout, subscriptions, refunds, webhook verification."},
      {"id": "rbac", "name": "Role-based Access Control", "description": "Granular permissions with roles, groups, and audit logs."},
      {"id": "api", "name": "API Integration", "description": "Typed third-party REST/GraphQL integrations with retries."},
      {"id": "realtime", "name": "Real-time Updates (WebSockets)", "description": "Live data feeds, presence, and collaborative editing."},
      {"id": "notifications", "name": "Notifications System", "description": "In-app, email, and push notifications with preferences."},
      {"id": "uploads", "name": "File Upload System", "description": "Chunked uploads, S3/CDN, image processing, virus scanning."},
      {"id": "analytics", "name": "Analytics Dashboard", "description": "Self-serve charts, cohort analysis, CSV/PDF exports."},
      {"id": "i18n", "name": "Multi-language Support", "description": "Full i18n with locale routing and RTL support."},
      {"id": "seo", "name": "SEO Optimization", "description": "Sitemaps, schema.org JSON-LD, OG tags, Core Web Vitals."},
      {"id": "performance", "name": "Performance Optimization", "description": "Bundle analysis, caching strategy, sub-100ms server times."},
      {"id": "mobile", "name": "Advanced Mobile Responsiveness", "description": "Device-tested UX, touch gestures, native share integrations."},
      {"id": "integrations", "name": "Third-party Integrations", "description": "Slack, Zapier, HubSpot, Salesforce, or custom endpoints."},
      {"id": "animations", "name": "Custom UI Animations", "description": "Framer Motion micro-interactions and page transitions."}
    ]
  },
  "mobile": {
    "base": {"inr": 150000, "usd": 12000},
    "feature_price": {"inr": 8000, "usd": 150},
    "features": [
      {"id": "auth", "name": "Authentication (Email + Social)", "description": "Email/password, Google, Apple sign-in with secure token storage."},
      {"id": "push", "name": "Push Notifications", "description": "Expo Notifications or OneSignal with topic targeting."},
      {"id": "offline", "name": "Offline-First Sync", "description": "Local DB (SQLite) with conflict-free sync to your backend."},
      {"id": "iap", "name": "In-App Purchases / Subscriptions", "description": "RevenueCat-managed subscriptions across iOS + Android."},
      {"id": "maps", "name": "Maps + Geolocation", "description": "Mapbox / Google Maps with custom markers and routes."},
      {"id": "camera", "name": "Camera + Image Upload", "description": "Camera capture, image picker, S3 upload pipeline."},
      {"id": "realtime", "name": "Real-time Chat / Updates", "description": "WebSocket-powered chat or live data feeds."},
      {"id": "analytics", "name": "Analytics + Crash Reporting", "description": "Sentry crash reporting + Mixpanel / PostHog events."},
      {"id": "i18n", "name": "Multi-language Support", "description": "i18n with RTL support for Arabic / Hebrew where needed."},
      {"id": "biometric", "name": "Biometric Auth (Face ID / Touch ID)", "description": "Native biometric prompts for sensitive actions."},
      {"id": "deeplinks", "name": "Universal Links + Deep Linking", "description": "iOS Universal Links + Android App Links for share flows."},
      {"id": "ota", "name": "OTA Updates via Expo", "description": "Push code updates without resubmitting to the stores."}
    ]
  }
}'::jsonb)
on conflict (key) do nothing;
