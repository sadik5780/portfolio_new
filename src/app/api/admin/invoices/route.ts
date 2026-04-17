import { NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guard';
import { listInvoices, createInvoice, type InvoiceInput } from '@/lib/content/invoices';

export const runtime = 'nodejs';

export async function GET() {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;
  try {
    const invoices = await listInvoices();
    return NextResponse.json({ invoices });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;
  const body = await request.json().catch(() => null);
  if (!body?.invoiceNumber || !body?.clientName) {
    return NextResponse.json({ error: 'Invoice number and client name required' }, { status: 422 });
  }
  try {
    const invoice = await createInvoice(body as InvoiceInput);
    return NextResponse.json({ invoice });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
