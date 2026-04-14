import { NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guard';
import { deleteLead } from '@/lib/content/leads';

export const runtime = 'nodejs';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    await deleteLead(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete' },
      { status: 500 },
    );
  }
}
