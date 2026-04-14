import type { TestimonialCountry } from './types';

const COUNTRIES: TestimonialCountry[] = [
  'India',
  'USA',
  'Australia',
  'UK',
  'Singapore',
  'Other',
];

export interface TestimonialBody {
  name?: string;
  role?: string;
  company?: string;
  country?: string;
  countryFlag?: string;
  quote?: string;
  rating?: number;
  projectType?: string;
  featured?: boolean;
  sortOrder?: number;
}

export type ValidatedTestimonialBody = Required<
  Pick<TestimonialBody, 'name' | 'role' | 'company' | 'country' | 'quote'>
> &
  TestimonialBody;

export function validateTestimonialBody(
  body: unknown,
):
  | { ok: true; data: ValidatedTestimonialBody }
  | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid request body' };
  }
  const b = body as TestimonialBody;

  if (!b.name || typeof b.name !== 'string' || b.name.trim().length < 2) {
    return { ok: false, error: 'Name is required' };
  }
  if (!b.role || typeof b.role !== 'string' || b.role.trim().length < 2) {
    return { ok: false, error: 'Role is required' };
  }
  if (!b.company || typeof b.company !== 'string' || b.company.trim().length < 2) {
    return { ok: false, error: 'Company is required' };
  }
  if (!b.country || !COUNTRIES.includes(b.country as TestimonialCountry)) {
    return {
      ok: false,
      error: `Country must be one of: ${COUNTRIES.join(', ')}`,
    };
  }
  if (!b.quote || typeof b.quote !== 'string' || b.quote.trim().length < 20) {
    return { ok: false, error: 'Quote is required (min 20 characters)' };
  }
  if (b.quote.length > 2000) {
    return { ok: false, error: 'Quote is too long (max 2000 characters)' };
  }
  if (typeof b.rating === 'number' && (b.rating < 1 || b.rating > 5)) {
    return { ok: false, error: 'Rating must be between 1 and 5' };
  }

  return {
    ok: true,
    data: {
      ...b,
      name: b.name.trim(),
      role: b.role.trim(),
      company: b.company.trim(),
      country: b.country,
      quote: b.quote.trim(),
    } as ValidatedTestimonialBody,
  };
}
