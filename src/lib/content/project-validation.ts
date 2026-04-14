import type { ProjectCategory } from './types';

const CATEGORIES: ProjectCategory[] = ['SaaS', 'Shopify', 'Web Apps'];

export interface ProjectBody {
  slug?: string;
  title?: string;
  category?: string;
  description?: string;
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

export type ValidatedBody = Required<
  Pick<ProjectBody, 'title' | 'description' | 'category'>
> & ProjectBody;

export function validateProjectBody(
  body: unknown,
):
  | { ok: true; data: ValidatedBody }
  | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid request body' };
  }
  const b = body as ProjectBody;
  if (!b.title || typeof b.title !== 'string' || b.title.trim().length < 2) {
    return { ok: false, error: 'Title is required' };
  }
  if (!b.description || typeof b.description !== 'string') {
    return { ok: false, error: 'Description is required' };
  }
  if (!b.category || !CATEGORIES.includes(b.category as ProjectCategory)) {
    return {
      ok: false,
      error: `Category must be one of: ${CATEGORIES.join(', ')}`,
    };
  }
  return {
    ok: true,
    data: {
      ...b,
      title: b.title,
      description: b.description,
      category: b.category,
    } as ValidatedBody,
  };
}
