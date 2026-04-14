import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { blogPosts as staticPosts } from '@/data/blog-posts';
import type { BlogPost, BlogBlock } from '@/data/blog-posts';

// DB row → app post
interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  tags: string[];
  category: BlogPost['category'];
  author: string;
  read_time: number;
  content: BlogBlock[];
  image: string | null;
  published: boolean;
  published_at: string;
  updated_at: string;
  created_at: string;
}

export interface AdminBlogPost extends BlogPost {
  id: string;
  published: boolean;
}

function rowToAdminPost(row: BlogPostRow): AdminBlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    keywords: Array.isArray(row.keywords) ? row.keywords : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    category: row.category,
    author: row.author,
    readTime: row.read_time,
    content: Array.isArray(row.content) ? row.content : [],
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    published: Boolean(row.published),
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// ── Input shape used by API routes + admin form ──
export interface BlogPostInput {
  slug?: string;
  title: string;
  description: string;
  keywords: string[];
  tags: string[];
  category: BlogPost['category'];
  author?: string;
  readTime?: number;
  content: BlogBlock[];
  image?: string;
  published?: boolean;
  publishedAt?: string;
}

function inputToRow(input: BlogPostInput) {
  const slug = (input.slug && input.slug.trim()) || slugify(input.title);
  const row: Record<string, unknown> = {
    slug,
    title: input.title,
    description: input.description,
    keywords: input.keywords ?? [],
    tags: input.tags ?? [],
    category: input.category,
    author: input.author ?? 'Sadik Shaikh',
    read_time: Number.isFinite(input.readTime) ? input.readTime : 5,
    content: input.content ?? [],
    image: input.image?.trim() || null,
    published: input.published ?? true,
  };
  if (input.publishedAt) row.published_at = input.publishedAt;
  return row;
}

// ── CRUD ────────────────────────────────────────
export async function listAdminBlogPosts(): Promise<AdminBlogPost[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => rowToAdminPost(r as BlogPostRow));
}

export async function getAdminBlogPost(id: string): Promise<AdminBlogPost | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToAdminPost(data as BlogPostRow) : null;
}

export async function createBlogPost(input: BlogPostInput): Promise<AdminBlogPost> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(inputToRow(input))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToAdminPost(data as BlogPostRow);
}

export async function updateBlogPost(
  id: string,
  input: BlogPostInput,
): Promise<AdminBlogPost> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('blog_posts')
    .update(inputToRow(input))
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToAdminPost(data as BlogPostRow);
}

export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/**
 * Seed the DB with the 10 bundled static posts. Idempotent — upserts on slug,
 * so re-running this will only add missing posts and refresh existing ones.
 */
export async function seedBlogPosts(): Promise<{
  inserted: number;
  total: number;
}> {
  const supabase = getSupabaseAdmin();
  const rows = staticPosts.map((p) =>
    inputToRow({
      slug: p.slug,
      title: p.title,
      description: p.description,
      keywords: p.keywords,
      tags: p.tags,
      category: p.category,
      author: p.author,
      readTime: p.readTime,
      content: p.content,
      published: true,
      publishedAt: p.publishedAt,
    }),
  );

  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(rows, { onConflict: 'slug' })
    .select('id');
  if (error) throw new Error(error.message);

  return {
    inserted: data?.length ?? 0,
    total: staticPosts.length,
  };
}
