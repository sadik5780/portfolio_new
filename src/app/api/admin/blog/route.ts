import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminGuard } from '@/lib/auth/guard';
import {
  createBlogPost,
  listAdminBlogPosts,
} from '@/lib/content/admin-blog';
import { validateBlogBody } from '@/lib/content/blog-validation';

export const runtime = 'nodejs';

export async function GET() {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    const posts = await listAdminBlogPosts();
    return NextResponse.json({ posts });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to list blog posts' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  const body = await request.json().catch(() => null);
  const validated = validateBlogBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 422 });
  }

  try {
    const post = await createBlogPost({
      slug: validated.data.slug,
      title: validated.data.title,
      description: validated.data.description,
      keywords: validated.data.keywords ?? [],
      tags: validated.data.tags ?? [],
      category: validated.data.category,
      author: validated.data.author,
      readTime: validated.data.readTime,
      content: validated.data.content,
      image: validated.data.image,
      published: validated.data.published,
      publishedAt: validated.data.publishedAt,
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);

    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create post' },
      { status: 500 },
    );
  }
}
