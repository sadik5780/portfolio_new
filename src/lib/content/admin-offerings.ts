import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { rowToOffering, type Offering } from './offerings';

export interface OfferingInput {
  slug: string;
  category: Offering['category'];
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  audience: string[];
  features: string[];
  techStack: string[];
  timeline?: string;
  startingInr: number;
  startingUsd: number;
  pricingKey: Offering['pricingKey'];
  seoKeywords: string[];
  icon?: string;
  sortOrder?: number;
}

export interface AdminOffering extends Offering {
  id: string;
  sortOrder: number;
}

interface AdminOfferingRow {
  id: string;
  slug: string;
  category: Offering['category'];
  name: string;
  tagline: string;
  description: string;
  long_description: string | null;
  audience: string[];
  features: string[];
  tech_stack: string[];
  timeline: string | null;
  starting_inr: number;
  starting_usd: number;
  pricing_key: Offering['pricingKey'];
  seo_keywords: string[];
  icon: string | null;
  sort_order: number;
}

function rowToAdminOffering(row: AdminOfferingRow): AdminOffering {
  return {
    ...rowToOffering(row),
    id: row.id,
    sortOrder: row.sort_order,
  };
}

function inputToRow(input: OfferingInput) {
  return {
    slug: input.slug,
    category: input.category,
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    long_description: input.longDescription ?? '',
    audience: input.audience,
    features: input.features,
    tech_stack: input.techStack,
    timeline: input.timeline ?? '',
    starting_inr: input.startingInr,
    starting_usd: input.startingUsd,
    pricing_key: input.pricingKey,
    seo_keywords: input.seoKeywords,
    icon: input.icon ?? '',
    sort_order: input.sortOrder ?? 0,
  };
}

export async function listAdminOfferings(): Promise<AdminOffering[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('offerings')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => rowToAdminOffering(r as AdminOfferingRow));
}

export async function getAdminOffering(id: string): Promise<AdminOffering | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('offerings')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToAdminOffering(data as AdminOfferingRow) : null;
}

export async function createOffering(input: OfferingInput): Promise<AdminOffering> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('offerings')
    .insert(inputToRow(input))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToAdminOffering(data as AdminOfferingRow);
}

export async function updateOffering(
  id: string,
  input: OfferingInput,
): Promise<AdminOffering> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('offerings')
    .update(inputToRow(input))
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToAdminOffering(data as AdminOfferingRow);
}

export async function deleteOffering(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('offerings').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
