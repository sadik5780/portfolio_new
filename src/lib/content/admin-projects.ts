import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import {
  rowToProject,
  type Project,
  type ProjectCategory,
  type ProjectRow,
} from './types';

// ── Slug helper (used if admin leaves slug blank) ──
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export interface ProjectInput {
  slug?: string;
  title: string;
  category: ProjectCategory;
  description: string;
  longDescription?: string;
  problem?: string;
  solution?: string;
  features?: string[];
  screenshots?: string[];
  tags?: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  year?: string;
  client?: string;
  sortOrder?: number;
}

function inputToRow(input: ProjectInput) {
  const slug = (input.slug && input.slug.trim()) || slugify(input.title);
  return {
    slug,
    title: input.title,
    category: input.category,
    description: input.description,
    long_description: input.longDescription ?? '',
    problem: input.problem ?? '',
    solution: input.solution ?? '',
    features: input.features ?? [],
    screenshots: input.screenshots ?? [],
    tags: input.tags ?? [],
    image: input.image ?? '',
    live_url: input.liveUrl || null,
    github_url: input.githubUrl || null,
    featured: Boolean(input.featured),
    year: input.year ?? '',
    client: input.client ?? '',
    sort_order: input.sortOrder ?? 0,
  };
}

export async function listAdminProjects(): Promise<Project[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => rowToProject(r as ProjectRow));
}

export async function getAdminProject(id: string): Promise<Project | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToProject(data as ProjectRow) : null;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('projects')
    .insert(inputToRow(input))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToProject(data as ProjectRow);
}

export async function updateProject(
  id: string,
  input: ProjectInput,
): Promise<Project> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('projects')
    .update(inputToRow(input))
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToProject(data as ProjectRow);
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
