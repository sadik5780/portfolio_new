import 'server-only';
import { getSupabaseServer } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/client';
import {
  DEFAULT_HERO,
  DEFAULT_STATS,
  DEFAULT_ABOUT,
  DEFAULT_SKILLS,
  DEFAULT_SERVICES,
  DEFAULT_PRICING,
} from './defaults';
import type {
  HeroContent,
  StatsContent,
  AboutContent,
  SkillsContent,
  ServicesContent,
  PricingContent,
} from './types';

export type SettingsKey =
  | 'hero'
  | 'stats'
  | 'about'
  | 'skills'
  | 'services'
  | 'pricing';

const DEFAULTS: Record<SettingsKey, unknown> = {
  hero: DEFAULT_HERO,
  stats: DEFAULT_STATS,
  about: DEFAULT_ABOUT,
  skills: DEFAULT_SKILLS,
  services: DEFAULT_SERVICES,
  pricing: DEFAULT_PRICING,
};

/** Fetch a single setting by key, falling back to the bundled default. */
export async function getSetting<T = unknown>(key: SettingsKey): Promise<T> {
  const fallback = DEFAULTS[key] as T;
  if (!hasSupabaseEnv()) return fallback;

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  if (error) {
    console.error(`[settings] get(${key}) error`, error.message);
    return fallback;
  }
  if (!data) return fallback;

  // Merge DB value on top of defaults so missing keys don't break the UI.
  if (
    typeof fallback === 'object' &&
    fallback !== null &&
    typeof data.value === 'object' &&
    data.value !== null
  ) {
    return { ...(fallback as object), ...(data.value as object) } as T;
  }
  return data.value as T;
}

// ── Typed shortcuts ─────────────────────────────────
export const getHero = () => getSetting<HeroContent>('hero');
export const getStats = () => getSetting<StatsContent>('stats');
export const getAbout = () => getSetting<AboutContent>('about');
export const getSkills = () => getSetting<SkillsContent>('skills');
export const getServices = () => getSetting<ServicesContent>('services');
export const getPricing = () => getSetting<PricingContent>('pricing');

/**
 * Fetch every setting in a single round-trip.
 * Used by the home page so we only make one DB call.
 */
export async function getAllSettings(): Promise<{
  hero: HeroContent;
  stats: StatsContent;
  about: AboutContent;
  skills: SkillsContent;
  services: ServicesContent;
  pricing: PricingContent;
}> {
  if (!hasSupabaseEnv()) {
    return {
      hero: DEFAULT_HERO,
      stats: DEFAULT_STATS,
      about: DEFAULT_ABOUT,
      skills: DEFAULT_SKILLS,
      services: DEFAULT_SERVICES,
      pricing: DEFAULT_PRICING,
    };
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase.from('settings').select('key,value');

  if (error || !data) {
    if (error) console.error('[settings] getAll error', error.message);
    return {
      hero: DEFAULT_HERO,
      stats: DEFAULT_STATS,
      about: DEFAULT_ABOUT,
      skills: DEFAULT_SKILLS,
      services: DEFAULT_SERVICES,
      pricing: DEFAULT_PRICING,
    };
  }

  const map = new Map<string, unknown>(
    data.map((r: { key: string; value: unknown }) => [r.key, r.value]),
  );
  const merge = <T>(key: SettingsKey, fallback: T): T => {
    const v = map.get(key);
    if (v && typeof v === 'object' && typeof fallback === 'object') {
      return { ...(fallback as object), ...(v as object) } as T;
    }
    return (v as T) ?? fallback;
  };

  return {
    hero: merge('hero', DEFAULT_HERO),
    stats: merge('stats', DEFAULT_STATS),
    about: merge('about', DEFAULT_ABOUT),
    skills: merge('skills', DEFAULT_SKILLS),
    services: merge('services', DEFAULT_SERVICES),
    pricing: merge('pricing', DEFAULT_PRICING),
  };
}
