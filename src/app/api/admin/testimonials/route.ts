import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminGuard } from '@/lib/auth/guard';
import {
  createTestimonial,
  listAdminTestimonials,
} from '@/lib/content/admin-testimonials';
import { validateTestimonialBody } from '@/lib/content/testimonial-validation';
import type { TestimonialCountry } from '@/lib/content/types';
import { isAllowedOrigin } from '@/lib/security/origin';

export const runtime = 'nodejs';

export async function GET() {
  const guard = await adminGuard();
  if (guard instanceof NextResponse) return guard;

  try {
    const testimonials = await listAdminTestimonials();
    return NextResponse.json({ testimonials });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to list testimonials' },
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
  const validated = validateTestimonialBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 422 });
  }

  try {
    const testimonial = await createTestimonial({
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

    // Home page shows the carousel — revalidate so the change is immediate.
    revalidatePath('/');

    return NextResponse.json({ testimonial });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create testimonial' },
      { status: 500 },
    );
  }
}
