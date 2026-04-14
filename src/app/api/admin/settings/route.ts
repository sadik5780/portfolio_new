import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminGuard } from '@/lib/auth/guard';
import { upsertSetting } from '@/lib/content/admin-settings';
import type { SettingsKey } from '@/lib/content/settings';

export const runtime = 'nodejs';

const ALLOWED_KEYS: SettingsKey[] = [
  'hero',
  'stats',
  'about',
  'skills',
  'services',
  'pricing',
];

export async function PUT(request: Request) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  let body: { key?: string; value?: unknown };
  try {
    body = (await request.json()) as { key?: string; value?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const key = body.key as SettingsKey | undefined;
  if (!key || !ALLOWED_KEYS.includes(key)) {
    return NextResponse.json(
      { error: `Key must be one of: ${ALLOWED_KEYS.join(', ')}` },
      { status: 400 },
    );
  }
  if (typeof body.value !== 'object' || body.value === null) {
    return NextResponse.json({ error: 'Value must be an object' }, { status: 422 });
  }

  try {
    await upsertSetting(key, body.value);

    // Invalidate the public pages that consume this content
    revalidatePath('/');
    if (key === 'pricing') revalidatePath('/contact');

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save' },
      { status: 500 },
    );
  }
}
