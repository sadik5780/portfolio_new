import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminGuard } from '@/lib/auth/guard';
import {
  deleteBlogPost,
  getAdminBlogPost,
  updateBlogPost,
} from '@/lib/content/admin-blog';
import { validateBlogBody } from '@/lib/content/blog-validation';

export const runtime = 'nodejs';

interface Params {
  params: { id: string };
}

export async function GET(_: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    const post = await getAdminBlogPost(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  const body = await request.json().catch(() => null);
  const validated = validateBlogBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 422 });
  }

  try {
    const post = await updateBlogPost(params.id, {
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
      { error: err instanceof Error ? err.message : 'Failed to update' },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    const existing = await getAdminBlogPost(params.id);
    await deleteBlogPost(params.id);

    revalidatePath('/blog');
    if (existing) revalidatePath(`/blog/${existing.slug}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete' },
      { status: 500 },
    );
  }
}
