/**
 * Project-based offerings shown on /services and /pricing.
 * Each offering targets a specific commercial-intent keyword cluster,
 * has a defined feature set, and references a pricing slot in the
 * `pricing` settings row (so admin can change prices without code).
 */

export type OfferingCategory = 'website' | 'ecommerce' | 'saas' | 'webapp' | 'mobile' | 'other';

export interface Offering {
  slug: string;
  category: OfferingCategory;
  name: string;            // Card title — short and bold
  tagline: string;         // 1-line elevator pitch
  description: string;     // 2–3 sentence pitch with primary keyword in first sentence
  longDescription: string; // 1 paragraph for detail page or quote page
  audience: string[];      // "Who it's for" bullets
  features: string[];      // What's included in the base price
  techStack: string[];
  timeline: string;        // e.g. "2–4 weeks"
  startingInr: number;     // Display only — actual prices live in pricing settings
  startingUsd: number;
  /** Which slot in the pricing settings drives this offering's quote. */
  pricingKey: 'static_tiers' | 'shopify' | 'app' | 'mobile';
  seoKeywords: string[];   // Primary keywords this offering targets
  icon: string;            // SVG path d-attribute
}

const ICON_GLOBE = 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c-2.5 3-4 6.5-4 10s1.5 7 4 10c2.5-3 4-6.5 4-10s-1.5-7-4-10zM2 12h20';
const ICON_BAG = 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0';
const ICON_LAYERS = 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5';
const ICON_TERMINAL = 'M4 17l6-6-6-6M12 19h8M3 3h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z';
const ICON_PHONE = 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z';

export const offerings: Offering[] = [
  {
    slug: 'static-website',
    category: 'website',
    name: 'Static Website',
    tagline: 'Marketing sites, portfolios, and brand pages — built fast, ranked high.',
    description:
      'Static website development for founders, agencies, and small businesses who need a modern brand site that ranks. Built on Next.js, mobile-perfect, with Core Web Vitals scores in the 95+ range.',
    longDescription:
      'A production-grade marketing site or portfolio in 2–3 weeks. Built with Next.js + SCSS, deployed to Vercel or Netlify, with on-page SEO baked in (meta tags, schema.org, sitemap, OG cards). Choose a tier based on page count: 5-page launch site, 10-page agency site, or 30-page brand site with a headless CMS.',
    audience: [
      'SaaS founders launching a marketing site',
      'Agencies needing a fast brand refresh',
      'Independent professionals and consultants',
      'Small businesses replacing a slow Wix/Squarespace site',
    ],
    features: [
      'Next.js 14 + SCSS / Tailwind (your pick)',
      'Mobile-perfect responsive design',
      'Core Web Vitals 95+ on mobile and desktop',
      'On-page SEO + sitemap + schema.org JSON-LD',
      'Contact form wired to email (Resend / SendGrid)',
      'Analytics (Plausible / GA4) + Search Console',
      'Optional CMS: Sanity, Contentful, or Supabase',
      'Vercel / Netlify deployment with custom domain + SSL',
    ],
    techStack: ['Next.js 14', 'TypeScript', 'SCSS / Tailwind', 'Sanity / Contentful', 'Vercel'],
    timeline: '2–4 weeks',
    startingInr: 15000,
    startingUsd: 200,
    pricingKey: 'static_tiers',
    seoKeywords: [
      'static website development india',
      'marketing website design',
      'business website cost india',
      'portfolio website builder',
      'multi-page website india usa',
      'nextjs marketing site developer',
      'fast loading website builder',
    ],
    icon: ICON_GLOBE,
  },

  {
    slug: 'shopify-store',
    category: 'ecommerce',
    name: 'Shopify Store',
    tagline: 'Custom Shopify themes and headless Hydrogen storefronts that convert.',
    description:
      'Custom Shopify development for DTC brands serious about commerce. From a fresh Shopify 2.0 theme build to a full headless Hydrogen storefront with subscriptions, AR try-on, and multi-currency checkout — measurably faster, measurably higher AOV.',
    longDescription:
      'Most "custom" Shopify work on the marketplace is a modified free theme. I build from Dawn or ship a headless Hydrogen storefront on React + GraphQL, customise checkout with Plus extensions, and instrument GA4 / Meta CAPI properly. Brands typically see mobile PageSpeed jump 30→90+ and conversion lift 15–30% within the first month.',
    audience: [
      'DTC brands above $500K ARR ready for a real storefront',
      'Fashion, beauty, supplements, food/beverage',
      'Subscription brands (native or Recharge)',
      'Multi-region brands using Shopify Markets',
    ],
    features: [
      'Custom Shopify 2.0 theme OR headless Hydrogen storefront',
      'Mobile PageSpeed score 90+ guaranteed',
      'Section-based theme editor for non-technical merchandising',
      'Checkout extensions (Shopify Plus): gift messages, delivery scheduling, upsells',
      'Subscriptions (native Shopify Subscriptions or Recharge)',
      'Multi-currency + multi-language via Shopify Markets',
      'Klaviyo / Yotpo / Judge.me integrations wired properly',
      'GA4 server-side + Meta Conversions API',
    ],
    techStack: ['Shopify 2.0', 'Liquid', 'Hydrogen / Remix', 'GraphQL Storefront API', 'Klaviyo'],
    timeline: '3–8 weeks',
    startingInr: 50000,
    startingUsd: 2000,
    pricingKey: 'shopify',
    seoKeywords: [
      'shopify developer india',
      'custom shopify theme development',
      'headless shopify hydrogen',
      'shopify plus expert india',
      'shopify store setup india usa',
      'ecommerce store development india',
      'dtc brand shopify builder',
      'shopify subscription store',
      'shopify expert australia',
    ],
    icon: ICON_BAG,
  },

  {
    slug: 'saas-platform',
    category: 'saas',
    name: 'SaaS Platform',
    tagline: 'B2B SaaS MVPs in 8–12 weeks with the boring infra paying customers expect.',
    description:
      'Custom SaaS development for B2B founders. Multi-tenant architecture, Stripe billing, RBAC, admin dashboards, and audit logs — production-ready in 8–12 weeks. Use the interactive quote builder to scope features and lock in a fixed price.',
    longDescription:
      'Shipping a SaaS MVP fast means cutting scope, not quality. I build the 20% that drives 80% of customer value — auth, billing, workspace isolation, a great first-run experience — and defer the rest with a clear roadmap. Built on Next.js + Postgres + Stripe, deployed to Vercel + Supabase or your own AWS.',
    audience: [
      'YC / Antler / 500 founders shipping their first MVP',
      'Bootstrapped founders ready for first paying customers',
      'Agencies productising an internal tool',
      'Vertical SaaS for a specific industry (legal, fitness, logistics)',
    ],
    features: [
      'Multi-tenant Postgres with workspace isolation',
      'Stripe subscriptions + customer portal + webhook verification',
      'NextAuth / Clerk / Supabase auth (your pick)',
      'Role-based access control (RBAC) with audit logs',
      'Admin dashboard so support resolves issues without engineering',
      'Email (transactional + lifecycle) via Resend',
      'CI/CD on Vercel / Railway / AWS',
      '30 days post-launch support included',
    ],
    techStack: ['Next.js 14', 'TypeScript', 'PostgreSQL', 'Prisma / Drizzle', 'Stripe', 'Redis'],
    timeline: '8–12 weeks',
    startingInr: 100000,
    startingUsd: 10000,
    pricingKey: 'app',
    seoKeywords: [
      'saas mvp development india',
      'b2b saas builder india',
      'multi tenant saas platform',
      'custom saas with stripe billing',
      'hire saas developer india',
      'saas mvp cost india',
      'startup saas developer',
      'product-market-fit mvp builder',
    ],
    icon: ICON_LAYERS,
  },

  {
    slug: 'custom-web-app',
    category: 'webapp',
    name: 'Custom Web App',
    tagline: 'Bespoke web applications — internal tools, portals, dashboards, marketplaces.',
    description:
      'Custom web application development for companies needing more than a website but different from a SaaS product. Internal tools, customer portals, B2B dashboards, marketplaces — anything bespoke. Use the interactive builder to pick features and get a fixed quote.',
    longDescription:
      'When a SaaS product off the shelf does not fit, a custom web app does. Built on the same modern React + Postgres stack as the SaaS offering, but scoped to your specific business workflow. Typical builds: customer onboarding portals, partner dashboards, internal admin tools, niche marketplaces, data visualization apps.',
    audience: [
      'Mid-size companies replacing legacy internal tools',
      'B2B companies building partner/customer portals',
      'Founders launching niche marketplaces',
      'Teams that need a custom dashboard on top of an existing API',
    ],
    features: [
      'React + Next.js frontend with your design system',
      'Typed API layer (REST or tRPC)',
      'Auth + RBAC with multiple roles',
      'File uploads with S3 + image processing',
      'Real-time updates via WebSockets',
      'Third-party integrations (Slack, Zapier, Salesforce, etc.)',
      'Custom UI animations with Framer Motion',
      'Performance + SEO optimization included',
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'AWS S3'],
    timeline: '6–14 weeks',
    startingInr: 100000,
    startingUsd: 10000,
    pricingKey: 'app',
    seoKeywords: [
      'custom web app development india',
      'bespoke web application',
      'react web app developer india',
      'internal tool development',
      'dashboard application india usa',
      'custom portal developer',
      'b2b web app india',
      'marketplace developer india',
    ],
    icon: ICON_TERMINAL,
  },

  {
    slug: 'mobile-app',
    category: 'mobile',
    name: 'Mobile App',
    tagline: 'Cross-platform iOS + Android apps with React Native + Expo.',
    description:
      'Mobile app development for iOS and Android from a single codebase with React Native + Expo. Native-feel UX, push notifications, offline support, in-app purchases, and App Store + Play Store deployment — a fraction of the cost of two native apps.',
    longDescription:
      'A real native-quality mobile app in 8–14 weeks. Built with React Native + Expo so you maintain one codebase across iOS and Android, with native-quality animations, gestures, and platform-specific UX where it matters. Includes deployment to both stores, OTA updates via Expo, and the analytics + crash reporting that production apps need.',
    audience: [
      'Founders adding mobile to a SaaS product',
      'Brands extending DTC commerce to iOS / Android',
      'Content / community apps (creators, fitness, learning)',
      'Marketplaces with on-the-go workflows (drivers, partners)',
    ],
    features: [
      'React Native + Expo (single codebase, iOS + Android)',
      'Native-feel animations and gestures',
      'Push notifications (Expo Notifications / OneSignal)',
      'Offline-first with local sync',
      'Stripe in-app purchases (or RevenueCat for subscriptions)',
      'App Store + Play Store deployment included',
      'Over-the-air updates via Expo (no resubmission for fixes)',
      'Sentry crash reporting + analytics',
    ],
    techStack: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Stripe / RevenueCat'],
    timeline: '8–14 weeks',
    startingInr: 150000,
    startingUsd: 12000,
    pricingKey: 'mobile',
    seoKeywords: [
      'react native developer india',
      'cross platform mobile app development',
      'ios android app developer india',
      'mobile app development india usa',
      'hybrid app developer india',
      'expo react native expert',
      'mobile app builder india',
      'app development cost india',
    ],
    icon: ICON_PHONE,
  },
];

export function getOffering(slug: string): Offering | undefined {
  return offerings.find((o) => o.slug === slug);
}
