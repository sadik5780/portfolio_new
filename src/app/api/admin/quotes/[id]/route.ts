import { NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guard';
import { getQuote, updateQuote, deleteQuote, type QuoteInput } from '@/lib/content/quotes';

export const runtime = 'nodejs';

interface Params {
  params: { id: string };
}

export async function GET(_: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    const quote = await getQuote(params.id);
    if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ quote });
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
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  try {
    const quote = await updateQuote(params.id, body as Partial<QuoteInput>);
    return NextResponse.json({ quote });
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
    await deleteQuote(params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete' },
      { status: 500 },
    );
  }
}
