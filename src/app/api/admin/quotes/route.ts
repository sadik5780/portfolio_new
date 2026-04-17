import { NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guard';
import { listQuotes, createQuote, type QuoteInput } from '@/lib/content/quotes';

export const runtime = 'nodejs';

export async function GET() {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    const quotes = await listQuotes();
    return NextResponse.json({ quotes });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to list quotes' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  const body = await request.json().catch(() => null);
  if (!body?.quoteNumber || !body?.clientName) {
    return NextResponse.json({ error: 'Quote number and client name required' }, { status: 422 });
  }

  try {
    const quote = await createQuote(body as QuoteInput);
    return NextResponse.json({ quote });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create quote' },
      { status: 500 },
    );
  }
}
