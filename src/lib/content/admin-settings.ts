import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import type { SettingsKey } from './settings';

export async function upsertSetting(
  key: SettingsKey,
  value: unknown,
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' });
  if (error) throw new Error(error.message);
}
