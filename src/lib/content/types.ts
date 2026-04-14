// ── Public Project type (used throughout the site) ──
export type ProjectCategory = 'SaaS' | 'Shopify' | 'Web Apps';

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  longDescription: string;
  problem: string;
  solution: string;
  features: string[];
  screenshots: string[];
  tags: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  year: string;
  client: string;
  sortOrder?: number;
}

// ── Settings shapes ─────────────────────────────────
export interface HeroContent {
  badge: string;
  heading_line1: string;
  heading_highlight: string;
  heading_line2: string;
  subtitle: string;
}

export interface StatsContent {
  items: Array<{ value: string; label: string }>;
}

export interface AboutContent {
  label: string;
  title: string;
  description: string;
  experiences: Array<{
    role: string;
    company: string;
    period: string;
    description: string;
  }>;
}

export interface SkillsContent {
  groups: Array<{ category: string; items: string[] }>;
}

export interface ServicesContent {
  label: string;
  title: string;
  items: Array<{ title: string; description: string }>;
}

export interface PricingContent {
  shopify: { inr: number; usd: number };
  static_tiers: Array<{
    id: string;
    name: string;
    description: string;
    inr: number;
    usd: number;
    includes: string[];
  }>;
  app: {
    base: { inr: number; usd: number };
    feature_price: { inr: number; usd: number };
    features: Array<{ id: string; name: string; description: string }>;
  };
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  project_type: string | null;
  budget: string | null;
  message: string;
  currency: string;
  created_at: string;
}

// ── DB row shapes (snake_case) ──────────────────────
export interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  long_description: string;
  problem: string;
  solution: string;
  features: string[];
  screenshots: string[];
  tags: string[];
  image: string;
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  year: string;
  client: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Map row → public type
export function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    description: row.description,
    longDescription: row.long_description ?? '',
    problem: row.problem ?? '',
    solution: row.solution ?? '',
    features: Array.isArray(row.features) ? row.features : [],
    screenshots: Array.isArray(row.screenshots) ? row.screenshots : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    image: row.image ?? '',
    liveUrl: row.live_url ?? undefined,
    githubUrl: row.github_url ?? undefined,
    featured: Boolean(row.featured),
    year: row.year ?? '',
    client: row.client ?? '',
    sortOrder: row.sort_order ?? 0,
  };
}
