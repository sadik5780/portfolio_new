import type { OfferingInput } from './admin-offerings';

const CATEGORIES = ['website', 'ecommerce', 'saas', 'webapp', 'mobile', 'other'] as const;
const PRICING_KEYS = ['static_tiers', 'shopify', 'app', 'mobile'] as const;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Result =
  | { ok: true; data: OfferingInput }
  | { ok: false; error: string };

function parseStringArray(raw: unknown, field: string, max = 50): string[] | null {
  if (!Array.isArray(raw)) return null;
  const out: string[] = [];
  for (const v of raw) {
    if (typeof v !== 'string') return null;
    const trimmed = v.trim();
    if (!trimmed) continue;
    if (trimmed.length > 400) return null;
    out.push(trimmed);
  }
  if (out.length > max) {
    throw new Error(`${field} has too many items (max ${max})`);
  }
  return out;
}

export function validateOfferingBody(raw: unknown): Result {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'Body must be an object' };
  }
  const body = raw as Record<string, unknown>;

  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
  if (!slug || !SLUG_RE.test(slug) || slug.length > 80) {
    return { ok: false, error: 'Invalid slug (lowercase letters, digits, hyphens)' };
  }

  const category = typeof body.category === 'string' ? body.category : '';
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return { ok: false, error: `Category must be one of: ${CATEGORIES.join(', ')}` };
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name || name.length > 120) {
    return { ok: false, error: 'Name is required (max 120 chars)' };
  }

  const tagline = typeof body.tagline === 'string' ? body.tagline.trim() : '';
  if (tagline.length > 240) {
    return { ok: false, error: 'Tagline too long (max 240 chars)' };
  }

  const description = typeof body.description === 'string' ? body.description.trim() : '';
  if (!description || description.length > 2000) {
    return { ok: false, error: 'Description is required (max 2000 chars)' };
  }

  const longDescription =
    typeof body.longDescription === 'string' ? body.longDescription.trim() : '';
  if (longDescription.length > 4000) {
    return { ok: false, error: 'Long description too long (max 4000 chars)' };
  }

  const pricingKey = typeof body.pricingKey === 'string' ? body.pricingKey : '';
  if (!PRICING_KEYS.includes(pricingKey as (typeof PRICING_KEYS)[number])) {
    return {
      ok: false,
      error: `Pricing key must be one of: ${PRICING_KEYS.join(', ')}`,
    };
  }

  const timeline = typeof body.timeline === 'string' ? body.timeline.trim() : '';
  if (timeline.length > 60) {
    return { ok: false, error: 'Timeline too long (max 60 chars)' };
  }

  const startingInr = Number(body.startingInr);
  const startingUsd = Number(body.startingUsd);
  if (!Number.isFinite(startingInr) || startingInr < 0 || startingInr > 100_000_000) {
    return { ok: false, error: 'Starting INR must be a positive number' };
  }
  if (!Number.isFinite(startingUsd) || startingUsd < 0 || startingUsd > 10_000_000) {
    return { ok: false, error: 'Starting USD must be a positive number' };
  }

  const icon = typeof body.icon === 'string' ? body.icon.trim() : '';
  if (icon.length > 2000) {
    return { ok: false, error: 'Icon SVG path too long' };
  }

  const sortOrder = Number(body.sortOrder ?? 0);
  if (!Number.isFinite(sortOrder)) {
    return { ok: false, error: 'sortOrder must be a number' };
  }

  try {
    const audience = parseStringArray(body.audience ?? [], 'audience', 30);
    const features = parseStringArray(body.features ?? [], 'features', 60);
    const techStack = parseStringArray(body.techStack ?? [], 'techStack', 30);
    const seoKeywords = parseStringArray(body.seoKeywords ?? [], 'seoKeywords', 60);

    if (!audience || !features || !techStack || !seoKeywords) {
      return { ok: false, error: 'Invalid list field (strings only)' };
    }

    return {
      ok: true,
      data: {
        slug,
        category: category as OfferingInput['category'],
        name,
        tagline,
        description,
        longDescription,
        audience,
        features,
        techStack,
        timeline,
        startingInr: Math.round(startingInr),
        startingUsd: Math.round(startingUsd),
        pricingKey: pricingKey as OfferingInput['pricingKey'],
        seoKeywords,
        icon,
        sortOrder: Math.round(sortOrder),
      },
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Validation failed',
    };
  }
}
