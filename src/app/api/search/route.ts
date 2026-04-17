import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/content/projects';
import { getBlogPosts } from '@/lib/content/blog';
import { services } from '@/data/services';

export const runtime = 'nodejs';

export interface SearchResult {
  type: 'project' | 'blog' | 'service';
  title: string;
  description: string;
  href: string;
  tag?: string;
}

function matches(query: string, ...fields: (string | string[] | undefined)[]): boolean {
  const q = query.toLowerCase();
  for (const field of fields) {
    if (!field) continue;
    if (Array.isArray(field)) {
      if (field.some((f) => f.toLowerCase().includes(q))) return true;
    } else {
      if (field.toLowerCase().includes(q)) return true;
    }
  }
  return false;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').trim();

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const [projects, blogPosts] = await Promise.all([
    getProjects(),
    getBlogPosts(),
  ]);

  const results: SearchResult[] = [];

  for (const p of projects) {
    if (matches(q, p.title, p.description, p.tags, p.category, p.client)) {
      results.push({
        type: 'project',
        title: p.title,
        description: p.description,
        href: `/projects/${p.slug}`,
        tag: p.category,
      });
    }
  }

  for (const post of blogPosts) {
    if (matches(q, post.title, post.description, post.keywords, post.tags, post.category)) {
      results.push({
        type: 'blog',
        title: post.title,
        description: post.description,
        href: `/blog/${post.slug}`,
        tag: post.category,
      });
    }
  }

  for (const s of services) {
    if (matches(q, s.name, s.tagline, s.description, s.tech, s.useCases)) {
      results.push({
        type: 'service',
        title: s.name,
        description: s.tagline,
        href: `/services/${s.slug}/usa`,
        tag: 'Service',
      });
    }
  }

  return NextResponse.json({ results: results.slice(0, 12) });
}
