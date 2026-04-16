import 'server-only';
import { getSupabaseServer } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/client';
import { withTimeout, SUPABASE_READ_TIMEOUT_MS } from './with-timeout';
import { offerings as staticOfferings, type Offering } from '@/data/offerings';

export type { Offering };

interface OfferingRow {
  id: string;
  slug: string;
  category: Offering['category'];
  name: string;
  tagline: string;
  description: string;
  long_description: string | null;
  audience: string[];
  features: string[];
  tech_stack: string[];
  timeline: string | null;
  starting_inr: number;
  starting_usd: number;
  pricing_key: Offering['pricingKey'];
  seo_keywords: string[];
  icon: string | null;
  sort_order: number;
}

export function rowToOffering(row: OfferingRow): Offering {
  return {
    slug: row.slug,
    category: row.category,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    longDescription: row.long_description ?? '',
    audience: Array.isArray(row.audience) ? row.audience : [],
    features: Array.isArray(row.features) ? row.features : [],
    techStack: Array.isArray(row.tech_stack) ? row.tech_stack : [],
    timeline: row.timeline ?? '',
    startingInr: row.starting_inr,
    startingUsd: row.starting_usd,
    pricingKey: row.pricing_key,
    seoKeywords: Array.isArray(row.seo_keywords) ? row.seo_keywords : [],
    icon: row.icon ?? '',
  };
}

/**
 * Fetch offerings ordered by sort_order. Falls back to the bundled static
 * offerings when Supabase is unavailable or the table has no rows — so the
 * site ships with content out of the box.
 */
export async function getOfferings(): Promise<Offering[]> {
  if (!hasSupabaseEnv()) return staticOfferings;

  const supabase = getSupabaseServer();
  const query = supabase
    .from('offerings')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  const result = await withTimeout(
    query as unknown as Promise<{
      data: OfferingRow[] | null;
      error: { message: string } | null;
    }>,
    SUPABASE_READ_TIMEOUT_MS,
    { data: null, error: { message: 'timeout' } },
    'offerings:list',
  );

  const { data, error } = result;
  if (error) {
    if (!/schema cache|does not exist|timeout/i.test(error.message)) {
      console.error('[offerings] list error', error.message);
    }
    return staticOfferings;
  }

  if (!data || data.length === 0) return staticOfferings;
  return data.map(rowToOffering);
}

export async function getOfferingBySlug(slug: string): Promise<Offering | null> {
  const list = await getOfferings();
  return list.find((o) => o.slug === slug) ?? null;
}
