export interface Service {
  slug: string;
  name: string;              // "React Developer"
  shortName: string;         // "React" — used in H1 composition
  tagline: string;           // short punchy line for cards
  description: string;       // 1 paragraph summary
  intro: string;             // longer intro for the programmatic page
  benefits: string[];
  deliverables: string[];
  useCases: string[];
  tech: string[];
  pricingNote: string;       // 1 line about pricing (no numbers — those come from locations)
  startingInr: number;
  startingUsd: number;
  startingGbp: number;
  relatedSlugs: string[];    // for cross-linking
  /** Slugs of blog posts that support this service (for internal linking on service pages) */
  relatedBlogSlugs: string[];
  /** Slugs of project case studies that demonstrate this service */
  relatedProjectSlugs: string[];
  icon: string;              // SVG path for icon
}

const ARROW = 'M5 12h14M13 5l7 7-7 7';

export const services: Service[] = [
  {
    slug: 'react-developer',
    name: 'React Developer',
    shortName: 'React',
    tagline: 'Senior React engineering for product teams that need to ship.',
    description:
      'Hire a senior React developer to design components, refactor legacy dashboards, and ship new features without stalling your roadmap.',
    intro:
      'Modern React is no longer just JSX — it is server components, suspense, data-layer choices (tRPC, React Query, RSC fetch), and a dozen rendering strategies. We help product teams pick the right ones and ship features that do not break under load.',
    benefits: [
      'Ship features weekly, not quarterly, with a tight PR-to-production loop.',
      'Reduce bundle size and time-to-interactive using RSC + streaming.',
      'Stop firefighting state — adopt Zustand / Redux Toolkit / TanStack Query with a clear contract.',
      'Type-safe APIs end-to-end with tRPC or typed REST generators.',
      'Accessibility (WCAG AA) and performance (Core Web Vitals) baked in, not bolted on.',
    ],
    deliverables: [
      'Production React / Next.js frontend',
      'Typed API integration layer',
      'Component library documented in Storybook',
      'Automated CI (lint, typecheck, unit + e2e tests)',
      'Performance audit + remediation plan',
    ],
    useCases: [
      'Migrating a CRA/Vite SPA to Next.js App Router',
      'Building a multi-tenant SaaS dashboard from scratch',
      'Refactoring a legacy Redux codebase',
      'Adding real-time / collaborative features',
    ],
    tech: ['React 18', 'Next.js 14', 'TypeScript', 'tRPC', 'TanStack Query', 'Tailwind / SCSS'],
    pricingNote: 'Fixed-scope engagements or weekly-hours retainers, milestone-billed.',
    startingInr: 100000,
    startingUsd: 1500,
    startingGbp: 1200,
    relatedSlugs: ['nextjs-developer', 'frontend-developer', 'saas-developer'],
    relatedBlogSlugs: [
      'how-to-hire-a-react-developer-2026',
      'react-vs-nextjs-for-saas-products-2026',
      'freelance-react-developer-india-hourly-rate-2026',
    ],
    relatedProjectSlugs: ['aurora-saas', 'cryptoflow', 'markdownly'],
    icon: ARROW,
  },
  {
    slug: 'nextjs-developer',
    name: 'Next.js Developer',
    shortName: 'Next.js',
    tagline: 'Next.js App Router specialists for SEO-critical and high-traffic builds.',
    description:
      'Hire a Next.js developer to build high-performance apps with the App Router, server components, and production-grade caching.',
    intro:
      'Next.js 14 with the App Router fundamentally changes how you structure a web app. We build for the new model — server components by default, client components only where needed, ISR or on-demand revalidation for content, and edge middleware for auth and geo routing.',
    benefits: [
      'Sub-second LCP and green Core Web Vitals across every page type.',
      'Proper ISR + on-demand revalidation so CMS content updates without redeploys.',
      'Edge middleware for auth, A/B tests, and geo-based routing.',
      'Vercel, AWS Amplify, or self-hosted deployments — your choice.',
      'Typed metadata + JSON-LD for every route to maximise organic search.',
    ],
    deliverables: [
      'Next.js 14 App Router application',
      'Server-side auth (NextAuth / Supabase / Clerk)',
      'API routes or server actions typed end-to-end',
      'Dynamic sitemap, robots, structured data',
      'Performance + SEO audit',
    ],
    useCases: [
      'Migrating Pages Router to App Router',
      'Headless CMS + e-commerce storefronts',
      'Marketing sites that rank in organic search',
      'Custom dashboards with server-driven data fetching',
    ],
    tech: ['Next.js 14', 'React Server Components', 'TypeScript', 'Supabase', 'Vercel', 'Edge runtime'],
    pricingNote: 'Most Next.js builds start at 4 weeks fixed-scope; retainers available.',
    startingInr: 100000,
    startingUsd: 1500,
    startingGbp: 1200,
    relatedSlugs: ['react-developer', 'saas-developer', 'ai-integration'],
    relatedBlogSlugs: [
      'react-vs-nextjs-for-saas-products-2026',
      'how-to-hire-a-react-developer-2026',
      'custom-web-app-development-cost-india-vs-usa',
    ],
    relatedProjectSlugs: ['aurora-saas', 'markdownly'],
    icon: ARROW,
  },
  {
    slug: 'shopify-developer',
    name: 'Shopify Developer',
    shortName: 'Shopify',
    tagline: 'Custom Shopify 2.0 themes and headless Hydrogen storefronts.',
    description:
      'Hire a Shopify developer to build custom 2.0 themes, headless Hydrogen storefronts, or checkout extensions — with measurable conversion lift.',
    intro:
      'Most "custom" Shopify work on the marketplace is a modified free theme. We build from Dawn or ship a headless Hydrogen storefront, customise checkout with extensions, and instrument analytics so you can see what moves AOV.',
    benefits: [
      'Mobile PageSpeed scores above 90 — not the 40-50 typical of bloated themes.',
      'Section-based Shopify 2.0 themes your merchandisers can edit without devs.',
      'Headless Hydrogen when you need React/GraphQL power + ISR.',
      'Checkout UI extensions (Plus) for gift messaging, delivery scheduling, upsells.',
      'Klaviyo / Omnisend / Yotpo integrations wired up properly.',
    ],
    deliverables: [
      'Production Shopify theme or Hydrogen storefront',
      'Custom section / block library',
      'Checkout extensions (Shopify Plus)',
      'Subscription integration (Recharge / native)',
      'Analytics + GA4 / Meta CAPI setup',
    ],
    useCases: [
      'DTC brand migrating from a bloated paid theme',
      'Multi-currency, multi-region storefront via Shopify Markets',
      'Headless Hydrogen build for a fashion or beauty brand',
      'Complex product configurators and bundle logic',
    ],
    tech: ['Shopify 2.0', 'Liquid', 'Hydrogen / Remix', 'GraphQL Storefront API', 'Klaviyo'],
    pricingNote: 'Custom themes from ₹50,000 / $2,000 / £1,600. Headless builds quoted per scope.',
    startingInr: 50000,
    startingUsd: 2000,
    startingGbp: 1600,
    relatedSlugs: ['frontend-developer', 'full-stack-developer', 'ai-integration'],
    relatedBlogSlugs: [
      'cost-of-shopify-development-india-vs-usa-2026',
      'shopify-developer-india-cost-2026',
      'why-your-startup-needs-headless-shopify',
      'shopify-vs-shopify-plus-what-you-need',
      'best-shopify-developer-australia-small-business',
    ],
    relatedProjectSlugs: ['bloom-shopify', 'northwear-shopify'],
    icon: ARROW,
  },
  {
    slug: 'saas-developer',
    name: 'SaaS Developer',
    shortName: 'SaaS',
    tagline: 'Full-stack SaaS MVP to product-market-fit in 8–16 weeks.',
    description:
      'Hire a SaaS developer to build multi-tenant platforms with auth, billing, admin dashboards, and the boring-but-critical infrastructure buyers expect.',
    intro:
      'Shipping a SaaS MVP fast means cutting scope, not quality. We build the 20% that drives 80% of customer value — auth, billing, workspace isolation, a great first-run experience — and defer the rest with a clear roadmap.',
    benefits: [
      'Multi-tenant from day one — no painful refactor at 50 customers.',
      'Stripe usage-based or subscription billing with webhook verification.',
      'RBAC, audit logs, and SSO-ready architecture.',
      'Admin dashboard so support can resolve issues without engineering.',
      'Postgres + Redis + S3 infrastructure that scales to 10K+ users.',
    ],
    deliverables: [
      'Multi-tenant Next.js + Postgres application',
      'Stripe billing + customer portal',
      'Role-based auth (roles, invites, audit logs)',
      'Internal admin dashboard',
      'Deployment on Vercel / Railway / AWS',
    ],
    useCases: [
      'B2B SaaS MVP from concept to first paying customer',
      'Internal tool that needs to become a product',
      'Vertical SaaS for a specific industry (legal, fitness, logistics)',
      'Analytics / dashboard SaaS with real-time data',
    ],
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma / Drizzle', 'Stripe', 'Redis'],
    pricingNote: 'Custom SaaS builds start at ₹8,30,000 / $10,000 / £8,000 base + features.',
    startingInr: 830000,
    startingUsd: 10000,
    startingGbp: 8000,
    relatedSlugs: ['react-developer', 'full-stack-developer', 'ai-integration'],
    relatedBlogSlugs: [
      'saas-mvp-in-8-weeks-realistic-timeline-cost',
      'cost-of-building-saas-app-india-2026',
      'react-vs-nextjs-for-saas-products-2026',
      'hire-remote-developer-india-startup-saas',
    ],
    relatedProjectSlugs: ['aurora-saas', 'cloudpipe'],
    icon: ARROW,
  },
  {
    slug: 'full-stack-developer',
    name: 'Full-Stack Developer',
    shortName: 'Full-stack',
    tagline: 'End-to-end product engineering from API to UI to ops.',
    description:
      'Hire a full-stack developer to own features end-to-end — database schema, API, frontend, auth, and deployment — without handoffs.',
    intro:
      'The fastest way to ship is when one engineer owns the slice from database to browser. We work across the stack with a strong preference for TypeScript end-to-end and opinionated choices that reduce cognitive load.',
    benefits: [
      'Ship whole features, not PRs, with fewer coordination costs.',
      'Typed contract between backend and frontend (tRPC or OpenAPI).',
      'Pragmatic infrastructure — managed Postgres, Redis, S3, Vercel.',
      'CI/CD, observability (Sentry, Axiom), and logging on day one.',
      'Small, high-performing team replacement for early-stage startups.',
    ],
    deliverables: [
      'Backend API (REST, tRPC, or GraphQL)',
      'Frontend web application',
      'Database schema + migrations',
      'Auth, billing, admin tooling',
      'CI/CD pipeline + deployment',
    ],
    useCases: [
      'Early-stage startup shipping from zero',
      'Rebuilding legacy monoliths with a modern stack',
      'Fractional tech lead for solo founders',
      'Taking a prototype to production',
    ],
    tech: ['Node.js', 'Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
    pricingNote: 'Fixed-scope builds or fractional engineering retainers.',
    startingInr: 80000,
    startingUsd: 1500,
    startingGbp: 1200,
    relatedSlugs: ['saas-developer', 'nextjs-developer', 'ai-integration'],
    relatedBlogSlugs: [
      'fullstack-developer-rates-india-usa-australia-2026',
      'hiring-remote-developers-from-india-guide',
      'freelance-vs-agency-which-is-right-for-your-project',
    ],
    relatedProjectSlugs: ['aurora-saas', 'cloudpipe', 'cryptoflow'],
    icon: ARROW,
  },
  {
    slug: 'frontend-developer',
    name: 'Frontend Developer',
    shortName: 'Frontend',
    tagline: 'Pixel-perfect, accessible, performant interfaces that convert.',
    description:
      'Hire a frontend developer to translate designs into production code that scores green on Core Web Vitals, ranks on SEO, and converts visitors.',
    intro:
      'Frontend engineering in 2026 is equal parts design fidelity, runtime performance, and accessibility. We ship interfaces that look like the Figma file, load in under a second, and work on a screen reader.',
    benefits: [
      'Pixel-perfect Figma-to-production fidelity with design tokens.',
      'WCAG AA accessibility audited with axe-core in CI.',
      '90+ Lighthouse scores across performance, SEO, and best practices.',
      'Animation that is delightful but does not regress FID.',
      'A reusable component library your team can extend.',
    ],
    deliverables: [
      'Production React / Next.js frontend',
      'Storybook-documented component library',
      'Design token system (colour, type, spacing)',
      'Accessibility + performance audit',
      'Motion / animation layer',
    ],
    useCases: [
      'Marketing site rebuild for conversion',
      'Dashboard frontend on top of an existing API',
      'Landing pages for paid campaigns',
      'Design system implementation from Figma',
    ],
    tech: ['React', 'Next.js', 'TypeScript', 'Framer Motion', 'SCSS', 'Storybook'],
    pricingNote: 'From ₹15,000 / $200 / £160 for landing pages, scaled by scope.',
    startingInr: 15000,
    startingUsd: 200,
    startingGbp: 160,
    relatedSlugs: ['react-developer', 'nextjs-developer', 'shopify-developer'],
    relatedBlogSlugs: [
      'how-to-hire-a-react-developer-2026',
      'custom-web-app-pricing-explained',
    ],
    relatedProjectSlugs: ['neural-ui'],
    icon: ARROW,
  },
  {
    slug: 'ai-integration',
    name: 'AI Integration Developer',
    shortName: 'AI',
    tagline: 'AI-powered features for web apps and SaaS — only where they move the needle.',
    description:
      'Hire an AI integration developer to wire OpenAI, Anthropic Claude, and RAG pipelines into your existing web app or SaaS — production-grade, observable, and cost-controlled.',
    intro:
      'AI features only matter if they make your product measurably more useful. We add LLM chatbots, semantic search, document Q&A, and AI-assisted workflows into your existing React, Next.js, or SaaS app — with prompt caching, streaming, per-workspace quotas, and proper evals so you can ship without runaway costs or hallucinations.',
    benefits: [
      'OpenAI, Anthropic Claude, and self-hosted (Ollama / vLLM) integrations.',
      'RAG pipelines on Pinecone, pgvector, or Weaviate with chunking and reranking that actually work.',
      'Prompt caching + streaming-first architecture to keep costs and latency down.',
      'Per-workspace quotas, rate limits, and cost dashboards so AI never bankrupts your unit economics.',
      'Eval harness (golden sets + LLM-as-judge) so you can iterate on prompts without breaking prod.',
    ],
    deliverables: [
      'Production AI feature (chatbot, search, agent, or workflow)',
      'RAG pipeline with ingestion, chunking, retrieval, reranking',
      'Prompt + tool-calling layer with typed inputs/outputs',
      'Evals + observability (LangSmith / Helicone / custom)',
      'Cost + quota dashboard for your admin panel',
    ],
    useCases: [
      'Adding a context-aware chatbot to an existing SaaS',
      'Semantic search over a knowledge base or docs site',
      'AI-assisted form filling, summarisation, or drafting features',
      'Document Q&A for legal, fintech, or healthcare verticals',
      'Agentic workflows (research, outreach, internal automation)',
    ],
    tech: ['OpenAI', 'Anthropic Claude', 'Google Gemini', 'Vercel AI SDK', 'pgvector', 'Pinecone', 'LangChain (selectively)'],
    pricingNote: 'Most AI feature builds ship in 2–4 weeks. From ₹2,00,000 / $2,500 / £2,000 fixed scope.',
    startingInr: 200000,
    startingUsd: 2500,
    startingGbp: 2000,
    relatedSlugs: ['saas-developer', 'nextjs-developer', 'full-stack-developer'],
    relatedBlogSlugs: [
      'hire-ai-developer-india-2026',
      'integrate-claude-api-web-app-tutorial',
      'claude-ai-vs-chatgpt-for-react-developers',
      'how-to-use-claude-ai-for-coding-2026',
    ],
    relatedProjectSlugs: ['aurora-saas'],
    icon: ARROW,
  },
  {
    slug: 'ai-automations',
    name: 'Custom AI Automations',
    shortName: 'AI Automations',
    tagline: 'Done-for-you AI systems that capture leads, close deals, and cut manual work.',
    description:
      'We build custom AI automation systems for businesses — lead capture chatbots, speed-to-lead agents, email/SMS follow-up sequences, document processing pipelines, and AI-powered internal tools. No templates, no monthly SaaS fees — you own the system.',
    intro:
      'Most businesses lose leads because they respond too slowly, miss follow-ups, or waste hours on tasks that AI can handle in seconds. We build custom AI automation systems — not generic chatbot subscriptions, but purpose-built tools that integrate into your existing workflow. Speed-to-lead agents that reply in under 60 seconds. Chatbots trained on your actual data. Document extraction pipelines that replace 20 hours of manual work per week. Every system is built to your spec, hosted on your infrastructure, and yours to keep.',
    benefits: [
      'Speed-to-lead agents — auto-reply to form submissions, qualify leads, and book calls within 60 seconds.',
      'AI chatbots trained on your business data — FAQs, pricing, services — that capture leads 24/7.',
      'Email and SMS follow-up automation — nurture sequences that re-engage cold leads without manual effort.',
      'Document processing — extract data from invoices, contracts, resumes, or forms using AI instead of humans.',
      'Internal workflow automation — generate reports, draft emails, categorize support tickets, summarize meetings.',
      'No monthly SaaS fees — you own the system. One-time build, full code ownership.',
    ],
    deliverables: [
      'Custom AI automation system (chatbot, agent, or pipeline)',
      'Integration with your existing tools (CRM, email, Slack, WhatsApp)',
      'Admin dashboard for monitoring and configuration',
      'Documentation and training for your team',
      'Source code and hosting setup on your infrastructure',
      '12 months post-launch maintenance included',
    ],
    useCases: [
      'Real estate agencies automating lead qualification and property matching',
      'E-commerce brands automating customer support and order tracking',
      'Law firms extracting key terms from contracts and legal documents',
      'Recruiting agencies screening resumes and scheduling interviews',
      'Service businesses automating quote generation and follow-up',
      'SaaS companies building AI-powered onboarding and support flows',
      'Agencies automating client reporting and content generation',
    ],
    tech: ['OpenAI', 'Anthropic Claude', 'Google Gemini', 'Next.js', 'n8n', 'Resend', 'Twilio', 'WhatsApp Business API', 'Supabase'],
    pricingNote: 'Setup from $2,000. Optional monthly retainer ($500–$2,000) for high-volume systems.',
    startingInr: 160000,
    startingUsd: 2000,
    startingGbp: 1600,
    relatedSlugs: ['ai-integration', 'saas-developer', 'full-stack-developer'],
    relatedBlogSlugs: [
      'how-to-build-ai-saas-product-2026',
      'hire-ai-developer-india-2026',
      'integrate-claude-api-web-app-tutorial',
    ],
    relatedProjectSlugs: ['aurora-saas'],
    icon: ARROW,
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
