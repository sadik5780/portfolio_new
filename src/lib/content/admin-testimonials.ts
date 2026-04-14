import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import {
  rowToTestimonial,
  type Testimonial,
  type TestimonialCountry,
  type TestimonialRow,
} from './types';

export interface TestimonialInput {
  name: string;
  role: string;
  company: string;
  country: TestimonialCountry;
  countryFlag?: string;
  quote: string;
  rating?: number;
  projectType?: string;
  featured?: boolean;
  sortOrder?: number;
}

function inputToRow(input: TestimonialInput) {
  return {
    name: input.name,
    role: input.role,
    company: input.company,
    country: input.country,
    country_flag: input.countryFlag ?? '',
    quote: input.quote,
    rating: typeof input.rating === 'number' ? input.rating : 5,
    project_type: input.projectType ?? '',
    featured: input.featured ?? true,
    sort_order: input.sortOrder ?? 0,
  };
}

export async function listAdminTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => rowToTestimonial(r as TestimonialRow));
}

export async function getAdminTestimonial(id: string): Promise<Testimonial | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToTestimonial(data as TestimonialRow) : null;
}

export async function createTestimonial(
  input: TestimonialInput,
): Promise<Testimonial> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('testimonials')
    .insert(inputToRow(input))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToTestimonial(data as TestimonialRow);
}

export async function updateTestimonial(
  id: string,
  input: TestimonialInput,
): Promise<Testimonial> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('testimonials')
    .update(inputToRow(input))
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToTestimonial(data as TestimonialRow);
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
