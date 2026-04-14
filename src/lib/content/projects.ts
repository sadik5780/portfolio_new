import 'server-only';
import { getSupabaseServer } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/client';
import { withTimeout, SUPABASE_READ_TIMEOUT_MS } from './with-timeout';
import { rowToProject, type Project, type ProjectRow } from './types';
import { DEFAULT_PROJECTS } from './defaults';

type TimeoutResult<T> = { data: T | null; error: { message: string } | null };

/**
 * Fetch all projects ordered by sort_order then created_at.
 * Falls back to DEFAULT_PROJECTS if Supabase is unreachable or timing out.
 */
export async function getProjects(): Promise<Project[]> {
  if (!hasSupabaseEnv()) return DEFAULT_PROJECTS;

  const supabase = getSupabaseServer();
  const query = supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  const { data, error } = await withTimeout(
    query as unknown as Promise<TimeoutResult<ProjectRow[]>>,
    SUPABASE_READ_TIMEOUT_MS,
    { data: null, error: { message: 'timeout' } },
    'projects:list',
  );

  if (error) {
    if (!/schema cache|does not exist|timeout/i.test(error.message)) {
      console.error('[projects] fetch error', error.message);
    }
    return DEFAULT_PROJECTS;
  }
  return (data ?? []).map(rowToProject);
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const all = await getProjects();
  return all.filter((p) => p.featured).slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!hasSupabaseEnv()) {
    return DEFAULT_PROJECTS.find((p) => p.slug === slug) ?? null;
  }

  const supabase = getSupabaseServer();
  const query = supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  const { data, error } = await withTimeout(
    query as unknown as Promise<TimeoutResult<ProjectRow>>,
    SUPABASE_READ_TIMEOUT_MS,
    { data: null, error: { message: 'timeout' } },
    'projects:getBySlug',
  );

  if (error) {
    if (!/schema cache|does not exist|timeout/i.test(error.message)) {
      console.error('[projects] getBySlug error', error.message);
    }
    return DEFAULT_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
  return data ? rowToProject(data) : null;
}

export async function getAllProjectSlugs(): Promise<string[]> {
  if (!hasSupabaseEnv()) return DEFAULT_PROJECTS.map((p) => p.slug);

  const supabase = getSupabaseServer();
  const query = supabase.from('projects').select('slug');
  const { data, error } = await withTimeout(
    query as unknown as Promise<TimeoutResult<{ slug: string }[]>>,
    SUPABASE_READ_TIMEOUT_MS,
    { data: null, error: { message: 'timeout' } },
    'projects:slugs',
  );

  if (error) {
    if (!/schema cache|does not exist|timeout/i.test(error.message)) {
      console.error('[projects] slugs error', error.message);
    }
    return DEFAULT_PROJECTS.map((p) => p.slug);
  }
  return (data ?? []).map((r) => r.slug);
}
