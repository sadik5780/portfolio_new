import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminGuard } from '@/lib/auth/guard';
import { seedBlogPosts } from '@/lib/content/admin-blog';

export const runtime = 'nodejs';

/**
 * Idempotent: upserts the 10 bundled starter posts into the blog_posts table.
 * Safe to re-run — existing posts matched by slug are refreshed, not duplicated.
 */
export async function POST() {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    const result = await seedBlogPosts();
    revalidatePath('/blog');
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Seed failed' },
      { status: 500 },
    );
  }
}
