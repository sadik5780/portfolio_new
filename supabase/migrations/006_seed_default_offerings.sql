-- ═══════════════════════════════════════════════════════════════════
-- Migration 006: seed the 5 default offerings into public.offerings
-- Paste into Supabase Dashboard → SQL Editor → Run.
-- Safe to re-run (upsert on slug).
-- Use this when the DB has been wiped or when you added a test offering
-- and the bundled defaults disappeared from /services + /pricing.
-- ═══════════════════════════════════════════════════════════════════

insert into public.offerings (
  slug, category, name, tagline, description, long_description,
  audience, features, tech_stack, timeline,
  starting_inr, starting_usd, pricing_key, seo_keywords, icon, sort_order
) values
-- ── 1. Static Website ─────────────────────────────────────────────
(
  'static-website', 'website',
  'Static Website',
  'Marketing sites, portfolios, and brand pages — built fast, ranked high.',
  'Static website development for founders, agencies, and small businesses who need a modern brand site that ranks. Built on Next.js, mobile-perfect, with Core Web Vitals scores in the 95+ range.',
  'A production-grade marketing site or portfolio in 2–3 weeks. Built with Next.js + SCSS, deployed to Vercel or Netlify, with on-page SEO baked in.',
  '["SaaS founders launching a marketing site","Agencies needing a fast brand refresh","Independent professionals and consultants","Small businesses replacing a slow Wix/Squarespace site"]'::jsonb,
  '["Next.js 14 + SCSS / Tailwind","Mobile-perfect responsive design","Core Web Vitals 95+ on mobile and desktop","On-page SEO + sitemap + schema.org JSON-LD","Contact form wired to email (Resend / SendGrid)","Analytics (Plausible / GA4) + Search Console","Optional CMS: Sanity, Contentful, or Supabase","Vercel / Netlify deployment with custom domain + SSL"]'::jsonb,
  '["Next.js 14","TypeScript","SCSS / Tailwind","Sanity / Contentful","Vercel"]'::jsonb,
  '2–4 weeks',
  15000, 200, 'static_tiers',
  '["static website development india","marketing website design","business website cost india","portfolio website builder","multi-page website india usa","nextjs marketing site developer","fast loading website builder"]'::jsonb,
  'M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c-2.5 3-4 6.5-4 10s1.5 7 4 10c2.5-3 4-6.5 4-10s-1.5-7-4-10zM2 12h20',
  10
),
-- ── 2. Shopify Store ──────────────────────────────────────────────
(
  'shopify-store', 'ecommerce',
  'Shopify Store',
  'Custom Shopify themes and headless Hydrogen storefronts that convert.',
  'Custom Shopify development for DTC brands serious about commerce. From a fresh Shopify 2.0 theme build to a full headless Hydrogen storefront with subscriptions, AR try-on, and multi-currency checkout.',
  'Most "custom" Shopify work on the marketplace is a modified free theme. I build from Dawn or ship a headless Hydrogen storefront on React + GraphQL.',
  '["DTC brands above $500K ARR ready for a real storefront","Fashion, beauty, supplements, food/beverage","Subscription brands (native or Recharge)","Multi-region brands using Shopify Markets"]'::jsonb,
  '["Custom Shopify 2.0 theme OR headless Hydrogen storefront","Mobile PageSpeed score 90+ guaranteed","Section-based theme editor for non-technical merchandising","Checkout extensions (Shopify Plus)","Subscriptions (native Shopify Subscriptions or Recharge)","Multi-currency + multi-language via Shopify Markets","Klaviyo / Yotpo / Judge.me integrations wired properly","GA4 server-side + Meta Conversions API"]'::jsonb,
  '["Shopify 2.0","Liquid","Hydrogen / Remix","GraphQL Storefront API","Klaviyo"]'::jsonb,
  '3–8 weeks',
  50000, 2000, 'shopify',
  '["shopify developer india","custom shopify theme development","headless shopify hydrogen","shopify plus expert india","shopify store setup india usa","ecommerce store development india","dtc brand shopify builder","shopify subscription store","shopify expert australia"]'::jsonb,
  'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0',
  20
),
-- ── 3. SaaS Platform ──────────────────────────────────────────────
(
  'saas-platform', 'saas',
  'SaaS Platform',
  'B2B SaaS MVPs in 8–12 weeks with the boring infra paying customers expect.',
  'Custom SaaS development for B2B founders. Multi-tenant architecture, Stripe billing, RBAC, admin dashboards, and audit logs — production-ready in 8–12 weeks.',
  'Shipping a SaaS MVP fast means cutting scope, not quality. Built on Next.js + Postgres + Stripe, deployed to Vercel + Supabase or your own AWS.',
  '["YC / Antler / 500 founders shipping their first MVP","Bootstrapped founders ready for first paying customers","Agencies productising an internal tool","Vertical SaaS for a specific industry (legal, fitness, logistics)"]'::jsonb,
  '["Multi-tenant Postgres with workspace isolation","Stripe subscriptions + customer portal + webhook verification","NextAuth / Clerk / Supabase auth","Role-based access control (RBAC) with audit logs","Admin dashboard so support resolves issues without engineering","Email (transactional + lifecycle) via Resend","CI/CD on Vercel / Railway / AWS","30 days post-launch support included"]'::jsonb,
  '["Next.js 14","TypeScript","PostgreSQL","Prisma / Drizzle","Stripe","Redis"]'::jsonb,
  '8–12 weeks',
  100000, 10000, 'app',
  '["saas mvp development india","b2b saas builder india","multi tenant saas platform","custom saas with stripe billing","hire saas developer india","saas mvp cost india","startup saas developer","product-market-fit mvp builder"]'::jsonb,
  'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  30
),
-- ── 4. Custom Web App ─────────────────────────────────────────────
(
  'custom-web-app', 'webapp',
  'Custom Web App',
  'Bespoke web applications — internal tools, portals, dashboards, marketplaces.',
  'Custom web application development for companies needing more than a website but different from a SaaS product. Internal tools, customer portals, B2B dashboards, marketplaces.',
  'When a SaaS product off the shelf does not fit, a custom web app does. Built on the same modern React + Postgres stack as the SaaS offering, but scoped to your specific business workflow.',
  '["Mid-size companies replacing legacy internal tools","B2B companies building partner/customer portals","Founders launching niche marketplaces","Teams that need a custom dashboard on top of an existing API"]'::jsonb,
  '["React + Next.js frontend with your design system","Typed API layer (REST or tRPC)","Auth + RBAC with multiple roles","File uploads with S3 + image processing","Real-time updates via WebSockets","Third-party integrations (Slack, Zapier, Salesforce, etc.)","Custom UI animations with Framer Motion","Performance + SEO optimization included"]'::jsonb,
  '["React","Next.js","TypeScript","PostgreSQL","Redis","AWS S3"]'::jsonb,
  '6–14 weeks',
  100000, 10000, 'app',
  '["custom web app development india","bespoke web application","react web app developer india","internal tool development","dashboard application india usa","custom portal developer","b2b web app india","marketplace developer india"]'::jsonb,
  'M4 17l6-6-6-6M12 19h8M3 3h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z',
  40
),
-- ── 5. Mobile App ─────────────────────────────────────────────────
(
  'mobile-app', 'mobile',
  'Mobile App',
  'Cross-platform iOS + Android apps with React Native + Expo.',
  'Mobile app development for iOS and Android from a single codebase with React Native + Expo. Native-feel UX, push notifications, offline support, in-app purchases, and App Store + Play Store deployment.',
  'A real native-quality mobile app in 8–14 weeks. Built with React Native + Expo so you maintain one codebase across iOS and Android.',
  '["Founders adding mobile to a SaaS product","Brands extending DTC commerce to iOS / Android","Content / community apps (creators, fitness, learning)","Marketplaces with on-the-go workflows (drivers, partners)"]'::jsonb,
  '["React Native + Expo (single codebase, iOS + Android)","Native-feel animations and gestures","Push notifications (Expo Notifications / OneSignal)","Offline-first with local sync","Stripe in-app purchases (or RevenueCat for subscriptions)","App Store + Play Store deployment included","Over-the-air updates via Expo","Sentry crash reporting + analytics"]'::jsonb,
  '["React Native","Expo","TypeScript","Supabase","Stripe / RevenueCat"]'::jsonb,
  '8–14 weeks',
  150000, 12000, 'mobile',
  '["react native developer india","cross platform mobile app development","ios android app developer india","mobile app development india usa","hybrid app developer india","expo react native expert","mobile app builder india","app development cost india"]'::jsonb,
  'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  50
)
on conflict (slug) do update set
  category         = excluded.category,
  name             = excluded.name,
  tagline          = excluded.tagline,
  description      = excluded.description,
  long_description = excluded.long_description,
  audience         = excluded.audience,
  features         = excluded.features,
  tech_stack       = excluded.tech_stack,
  timeline         = excluded.timeline,
  starting_inr     = excluded.starting_inr,
  starting_usd     = excluded.starting_usd,
  pricing_key      = excluded.pricing_key,
  seo_keywords     = excluded.seo_keywords,
  icon             = excluded.icon,
  sort_order       = excluded.sort_order;
