import type { BlogBlock, BlogPost } from '@/data/blog-posts';

const CATEGORIES: BlogPost['category'][] = [
  'Pricing',
  'Hiring',
  'Engineering',
  'E-commerce',
  'SaaS',
];

export interface BlogPostBody {
  slug?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  tags?: string[];
  category?: string;
  author?: string;
  readTime?: number;
  content?: unknown;
  image?: string;
  published?: boolean;
  publishedAt?: string;
}

export type ValidatedBlogBody = Required<
  Pick<BlogPostBody, 'title' | 'description'>
> & Omit<BlogPostBody, 'category' | 'content'> & {
  category: BlogPost['category'];
  content: BlogBlock[];
};

/**
 * Validate + sanitize a blog post payload. The content array is shaped
 * through — we accept only known block types and drop unknown keys.
 */
export function validateBlogBody(
  body: unknown,
):
  | { ok: true; data: ValidatedBlogBody }
  | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid request body' };
  }
  const b = body as BlogPostBody;
  if (!b.title || typeof b.title !== 'string' || b.title.trim().length < 3) {
    return { ok: false, error: 'Title is required (min 3 chars).' };
  }
  if (!b.description || typeof b.description !== 'string' || b.description.trim().length < 20) {
    return { ok: false, error: 'Description is required (min 20 chars).' };
  }
  if (!b.category || !CATEGORIES.includes(b.category as BlogPost['category'])) {
    return {
      ok: false,
      error: `Category must be one of: ${CATEGORIES.join(', ')}`,
    };
  }

  const content = sanitizeBlocks(b.content);
  if (content.length === 0) {
    return { ok: false, error: 'Content cannot be empty — add at least one block.' };
  }

  return {
    ok: true,
    data: {
      ...b,
      title: b.title,
      description: b.description,
      category: b.category as BlogPost['category'],
      keywords: Array.isArray(b.keywords) ? b.keywords.filter((k) => typeof k === 'string') : [],
      tags: Array.isArray(b.tags) ? b.tags.filter((t) => typeof t === 'string') : [],
      content,
    },
  };
}

function sanitizeBlocks(raw: unknown): BlogBlock[] {
  if (!Array.isArray(raw)) return [];
  const out: BlogBlock[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;
    const b = entry as Record<string, unknown>;
    const type = typeof b.type === 'string' ? b.type : '';

    switch (type) {
      case 'p':
        if (typeof b.text === 'string' && b.text.trim().length > 0) {
          out.push({ type: 'p', text: b.text });
        }
        break;
      case 'h2':
        if (typeof b.text === 'string' && b.text.trim().length > 0) {
          out.push({ type: 'h2', text: b.text, id: typeof b.id === 'string' ? b.id : undefined });
        }
        break;
      case 'h3':
        if (typeof b.text === 'string' && b.text.trim().length > 0) {
          out.push({ type: 'h3', text: b.text });
        }
        break;
      case 'ul':
      case 'ol': {
        const items = Array.isArray(b.items)
          ? b.items.filter((i) => typeof i === 'string' && i.trim().length > 0) as string[]
          : [];
        if (items.length > 0) {
          out.push({ type, items });
        }
        break;
      }
      case 'quote':
        if (typeof b.text === 'string' && b.text.trim().length > 0) {
          out.push({
            type: 'quote',
            text: b.text,
            cite: typeof b.cite === 'string' ? b.cite : undefined,
          });
        }
        break;
      case 'cta':
        if (
          typeof b.title === 'string' && b.title.trim().length > 0 &&
          typeof b.text === 'string' &&
          typeof b.href === 'string' && b.href.trim().length > 0 &&
          typeof b.label === 'string' && b.label.trim().length > 0
        ) {
          out.push({
            type: 'cta',
            title: b.title,
            text: b.text,
            href: b.href,
            label: b.label,
          });
        }
        break;
      default:
        // silently ignore unknown block types
        break;
    }
  }
  return out;
}
