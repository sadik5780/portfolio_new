import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminGuard } from '@/lib/auth/guard';
import {
  deleteTestimonial,
  getAdminTestimonial,
  updateTestimonial,
} from '@/lib/content/admin-testimonials';
import type { TestimonialCountry } from '@/lib/content/types';
import { validateTestimonialBody } from '@/lib/content/testimonial-validation';
import { isAllowedOrigin } from '@/lib/security/origin';

export const runtime = 'nodejs';

interface Params {
  params: { id: string };
}

export async function GET(_: Request, { params }: Params) {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    const testimonial = await getAdminTestimonial(params.id);
    if (!testimonial) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ testimonial });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }

  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  const body = await request.json().catch(() => null);
  const validated = validateTestimonialBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 422 });
  }

  try {
    const testimonial = await updateTestimonial(params.id, {
      name: validated.data.name,
      role: validated.data.role,
      company: validated.data.company,
      country: validated.data.country as TestimonialCountry,
      countryFlag: validated.data.countryFlag,
      quote: validated.data.quote,
      rating: validated.data.rating,
      projectType: validated.data.projectType,
      featured: validated.data.featured,
      sortOrder: validated.data.sortOrder,
    });

    revalidatePath('/');

    return NextResponse.json({ testimonial });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }

  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    await deleteTestimonial(params.id);
    revalidatePath('/');
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete' },
      { status: 500 },
    );
  }
}
