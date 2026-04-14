import 'server-only';
import { getSupabaseServer } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/client';
import { withTimeout, SUPABASE_READ_TIMEOUT_MS } from './with-timeout';
import {
  rowToTestimonial,
  type Testimonial,
  type TestimonialRow,
} from './types';
import { testimonials as STATIC_TESTIMONIALS } from '@/data/testimonials';

type TimeoutResult<T> = { data: T | null; error: { message: string } | null };

function staticFallback(): Testimonial[] {
  // The static file's shape matches the public Testimonial interface except it
  // doesn't carry `featured` / `sortOrder` — default both to sensible values.
  return STATIC_TESTIMONIALS.map((t, i) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    company: t.company,
    country: t.country,
    countryFlag: t.countryFlag,
    quote: t.quote,
    rating: t.rating,
    projectType: t.projectType,
    featured: true,
    sortOrder: (i + 1) * 10,
  }));
}

/**
 * Fetch all testimonials ordered by sort_order then created_at.
 * Falls back to the static file if Supabase is unreachable / timing out.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!hasSupabaseEnv()) return staticFallback();

  const supabase = getSupabaseServer();
  const query = supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  const { data, error } = await withTimeout(
    query as unknown as Promise<TimeoutResult<TestimonialRow[]>>,
    SUPABASE_READ_TIMEOUT_MS,
    { data: null, error: { message: 'timeout' } },
    'testimonials:list',
  );

  if (error) {
    if (!/schema cache|does not exist|timeout/i.test(error.message)) {
      console.error('[testimonials] fetch error', error.message);
    }
    return staticFallback();
  }

  const rows = (data ?? []).map(rowToTestimonial);
  return rows.length > 0 ? rows : staticFallback();
}

export async function getFeaturedTestimonials(limit = 6): Promise<Testimonial[]> {
  const all = await getTestimonials();
  return all.filter((t) => t.featured).slice(0, limit);
}

export function aggregateTestimonialRating(
  testimonials: Testimonial[],
): { value: number; count: number } {
  if (testimonials.length === 0) return { value: 0, count: 0 };
  const total = testimonials.reduce((s, t) => s + t.rating, 0);
  return {
    value: Number((total / testimonials.length).toFixed(2)),
    count: testimonials.length,
  };
}
