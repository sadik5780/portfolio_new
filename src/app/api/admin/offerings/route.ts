import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminGuard } from '@/lib/auth/guard';
import {
  createOffering,
  listAdminOfferings,
} from '@/lib/content/admin-offerings';
import { validateOfferingBody } from '@/lib/content/offering-validation';
import { isAllowedOrigin } from '@/lib/security/origin';

export const runtime = 'nodejs';

export async function GET() {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    const offerings = await listAdminOfferings();
    return NextResponse.json({ offerings });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to list offerings' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }

  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  const body = await request.json().catch(() => null);
  const validated = validateOfferingBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 422 });
  }

  try {
    const offering = await createOffering(validated.data);
    revalidatePath('/services');
    revalidatePath('/quote');
    revalidatePath('/pricing');
    return NextResponse.json({ offering });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create offering' },
      { status: 500 },
    );
  }
}
