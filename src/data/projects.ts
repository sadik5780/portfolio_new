/**
 * Project types + category list.
 *
 * Actual project data now lives in Supabase and is fetched via
 * `@/lib/content/projects`. Static defaults (used as a dev fallback
 * when Supabase is unreachable) live in `@/lib/content/defaults`.
 */

export type { Project, ProjectCategory } from '@/lib/content/types';

export const projectCategories = ['All', 'SaaS', 'Shopify', 'Web Apps'] as const;
