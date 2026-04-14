import 'server-only';
import { getSupabaseServer } from '@/lib/supabase/server';
import { hasSupabaseEnv } from '@/lib/supabase/client';
import {
  blogPosts as staticPosts,
  type BlogPost,
  type BlogBlock,
} from '@/data/blog-posts';

export type { BlogPost, BlogBlock };

// ── Row shape (DB) → app shape (camel where needed) ──
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

function rowToPost(row: BlogPostRow): BlogPost {
  return {
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
  };
}

/**
 * Fetch blog posts. Prefers DB; falls back to the bundled static posts when
 * Supabase is unreachable OR when the DB has zero published posts (so the
 * site ships with content out of the box).
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!hasSupabaseEnv()) return staticPosts;

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    // schema-cache errors happen before migration is run — fall back silently
    if (!/schema cache|does not exist/i.test(error.message)) {
      console.error('[blog] list error', error.message);
    }
    return staticPosts;
  }

  if (!data || data.length === 0) return staticPosts;

  return (data as BlogPostRow[]).map(rowToPost);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!hasSupabaseEnv()) {
    return staticPosts.find((p) => p.slug === slug) ?? null;
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    if (!/schema cache|does not exist/i.test(error.message)) {
      console.error('[blog] getBySlug error', error.message);
    }
    return staticPosts.find((p) => p.slug === slug) ?? null;
  }

  if (data) return rowToPost(data as BlogPostRow);
  // Fall through to static for slugs that exist only in the bundled content
  return staticPosts.find((p) => p.slug === slug) ?? null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  if (!hasSupabaseEnv()) return staticPosts.map((p) => p.slug);

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true);

  if (error || !data || data.length === 0) {
    return staticPosts.map((p) => p.slug);
  }
  return (data as { slug: string }[]).map((r) => r.slug);
}

export async function getRelatedPosts(
  slug: string,
  count = 3,
): Promise<BlogPost[]> {
  const all = await getBlogPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];
  return all
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const sameCategory =
        Number(b.category === current.category) - Number(a.category === current.category);
      if (sameCategory !== 0) return sameCategory;
      const tagOverlapA = a.tags.filter((t) => current.tags.includes(t)).length;
      const tagOverlapB = b.tags.filter((t) => current.tags.includes(t)).length;
      return tagOverlapB - tagOverlapA;
    })
    .slice(0, count);
}
