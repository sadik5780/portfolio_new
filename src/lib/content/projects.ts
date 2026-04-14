import 'server-only';
import { getSupabaseServer } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/client';
import { rowToProject, type Project, type ProjectRow } from './types';
import { DEFAULT_PROJECTS } from './defaults';

/**
 * Fetch all projects ordered by sort_order then created_at.
 * Falls back to an empty array (or DEFAULT_PROJECTS in dev) if Supabase fails.
 */
export async function getProjects(): Promise<Project[]> {
  if (!hasSupabaseEnv()) return DEFAULT_PROJECTS;

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[projects] fetch error', error.message);
    return DEFAULT_PROJECTS;
  }

  return (data ?? []).map((row) => rowToProject(row as ProjectRow));
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
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('[projects] getBySlug error', error.message);
    return null;
  }

  return data ? rowToProject(data as ProjectRow) : null;
}

export async function getAllProjectSlugs(): Promise<string[]> {
  if (!hasSupabaseEnv()) return DEFAULT_PROJECTS.map((p) => p.slug);

  const supabase = getSupabaseServer();
  const { data, error } = await supabase.from('projects').select('slug');
  if (error) {
    console.error('[projects] slugs error', error.message);
    return [];
  }
  return (data ?? []).map((r: { slug: string }) => r.slug);
}
