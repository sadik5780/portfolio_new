import type {
  HeroContent,
  StatsContent,
  AboutContent,
  SkillsContent,
  ServicesContent,
  PricingContent,
  Project,
} from './types';

// ── Fallback content used if Supabase is unreachable / empty ──

export const DEFAULT_HERO: HeroContent = {
  badge: 'Available for new projects',
  heading_line1: 'I craft digital',
  heading_highlight: 'experiences',
  heading_line2: 'that stand out.',
  subtitle:
    'Full-stack developer specializing in building exceptional digital products with modern web technologies. Focused on performance, accessibility, and clean code.',
};

export const DEFAULT_STATS: StatsContent = {
  items: [
    { value: '5+', label: 'Years Experience' },
    { value: '30+', label: 'Projects Delivered' },
    { value: '15+', label: 'Happy Clients' },
  ],
};

export const DEFAULT_ABOUT: AboutContent = {
  label: 'About',
  title: 'A bit about me',
  description:
    'I am a passionate developer who loves turning complex problems into simple, beautiful, and intuitive solutions.',
  experiences: [
    {
      role: 'Senior Frontend Engineer',
      company: 'TechCorp',
      period: '2022 — Present',
      description: 'Leading the frontend architecture for a SaaS platform serving 50K+ users.',
    },
    {
      role: 'Full-Stack Developer',
      company: 'StartupXYZ',
      period: '2020 — 2022',
      description: 'Built and shipped 3 products from concept to production in an early-stage startup.',
    },
    {
      role: 'Frontend Developer',
      company: 'AgencyPro',
      period: '2019 — 2020',
      description: 'Developed high-performance websites and web apps for enterprise clients.',
    },
  ],
};

export const DEFAULT_SKILLS: SkillsContent = {
  groups: [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'SCSS', 'Framer Motion'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'GraphQL'] },
    { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Figma', 'CI/CD'] },
  ],
};

export const DEFAULT_SERVICES: ServicesContent = {
  label: 'Services',
  title: 'What I build',
  items: [
    {
      title: 'Custom SaaS Platforms',
      description: 'Multi-tenant web apps with billing, RBAC, and admin tooling. Built to scale.',
    },
    {
      title: 'Shopify Stores',
      description:
        'Custom Shopify 2.0 themes and headless Hydrogen storefronts with checkout extensions.',
    },
    {
      title: 'Marketing Websites',
      description: 'High-conversion, SEO-optimized landing pages and multi-page marketing sites.',
    },
    {
      title: 'Design Systems',
      description: 'Typed, accessible React component libraries with Figma integration.',
    },
  ],
};

export const DEFAULT_PRICING: PricingContent = {
  shopify: { inr: 50000, usd: 2000 },
  static_tiers: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Up to 5 pages — ideal for landing sites and portfolios.',
      inr: 15000,
      usd: 200,
      includes: [
        'Up to 5 responsive pages',
        'Dark/light theme support',
        'Contact form wired to email',
        'Basic on-page SEO',
        '2 rounds of revisions',
      ],
    },
    {
      id: 'standard',
      name: 'Standard',
      description: 'Up to 10 pages — for growing brands and agencies.',
      inr: 30000,
      usd: 500,
      includes: [
        'Up to 10 responsive pages',
        'Blog/CMS integration',
        'Advanced SEO with sitemap + schema',
        'Analytics + performance monitoring',
        'Contact form + newsletter integration',
        '3 rounds of revisions',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      description: '10–30 pages — full marketing sites with rich animation.',
      inr: 50000,
      usd: 800,
      includes: [
        '10–30 responsive pages',
        'Custom animations (Framer Motion)',
        'Headless CMS (Sanity / Contentful)',
        'Full SEO + sitemap + schema + OG',
        'Multi-language ready',
        'Unlimited revisions (scoped)',
      ],
    },
  ],
  app: {
    base: { inr: 100000, usd: 10000 },
    feature_price: { inr: 5000, usd: 100 },
    features: [
      { id: 'auth', name: 'Authentication (Login/Register)', description: 'Secure email, OAuth (Google/GitHub), password reset, MFA.' },
      { id: 'admin', name: 'Admin Dashboard', description: 'CRUD-enabled admin panel with filters, search, and exports.' },
      { id: 'payments', name: 'Payment Integration (Razorpay/Stripe)', description: 'Checkout, subscriptions, refunds, webhook verification.' },
      { id: 'rbac', name: 'Role-based Access Control', description: 'Granular permissions with roles, groups, and audit logs.' },
      { id: 'api', name: 'API Integration', description: 'Typed third-party REST/GraphQL integrations with retries.' },
      { id: 'realtime', name: 'Real-time Updates (WebSockets)', description: 'Live data feeds, presence, and collaborative editing.' },
      { id: 'notifications', name: 'Notifications System', description: 'In-app, email, and push notifications with preferences.' },
      { id: 'uploads', name: 'File Upload System', description: 'Chunked uploads, S3/CDN, image processing, virus scanning.' },
      { id: 'analytics', name: 'Analytics Dashboard', description: 'Self-serve charts, cohort analysis, CSV/PDF exports.' },
      { id: 'i18n', name: 'Multi-language Support', description: 'Full i18n with locale routing and RTL support.' },
      { id: 'seo', name: 'SEO Optimization', description: 'Sitemaps, schema.org JSON-LD, OG tags, Core Web Vitals.' },
      { id: 'performance', name: 'Performance Optimization', description: 'Bundle analysis, caching strategy, sub-100ms server times.' },
      { id: 'mobile', name: 'Advanced Mobile Responsiveness', description: 'Device-tested UX, touch gestures, native share integrations.' },
      { id: 'integrations', name: 'Third-party Integrations', description: 'Slack, Zapier, HubSpot, Salesforce, or custom endpoints.' },
      { id: 'animations', name: 'Custom UI Animations', description: 'Framer Motion micro-interactions and page transitions.' },
    ],
  },
};

// Default projects (used when Supabase is unavailable)
export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'default-aurora',
    slug: 'aurora-saas',
    title: 'Aurora SaaS Platform',
    category: 'SaaS',
    description:
      'Full-stack SaaS platform with real-time analytics, team collaboration, and automated reporting.',
    longDescription:
      'A comprehensive SaaS platform built from the ground up featuring real-time data analytics dashboards, multi-tenant architecture, and automated PDF report generation.',
    problem:
      'The client ran a fast-growing analytics agency where three separate tools were glued together with manual processes.',
    solution:
      'I designed a single multi-tenant SaaS platform that unified data ingestion, analysis, and reporting.',
    features: [
      'Multi-tenant architecture with workspace isolation',
      'Real-time analytics dashboards',
      'RBAC for teams',
      'Automated PDF report generation',
      'Stripe billing',
    ],
    screenshots: [],
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Stripe'],
    image: '/projects/aurora.jpg',
    featured: true,
    year: '2024',
    client: 'Aurora Labs Inc.',
  },
];
