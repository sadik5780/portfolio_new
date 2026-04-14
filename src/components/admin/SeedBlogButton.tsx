'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin-shared.module.scss';

export default function SeedBlogButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleSeed = async () => {
    if (
      !window.confirm(
        'Import the 10 bundled starter posts into Supabase? Existing posts with the same slug will be refreshed.',
      )
    )
      return;

    setBusy(true);
    try {
      const res = await fetch('/api/admin/blog/seed', { method: 'POST' });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        inserted?: number;
        total?: number;
        error?: string;
      };
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? 'Seed failed');
      }
      alert(`Imported ${body.inserted} / ${body.total} starter posts.`);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Seed failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={handleSeed}
      disabled={busy}
    >
      {busy ? 'Importing…' : 'Import starter posts'}
    </button>
  );
}
