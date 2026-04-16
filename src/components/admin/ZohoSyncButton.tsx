'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin-shared.module.scss';

interface ZohoSyncButtonProps {
  paymentId: string;
}

export default function ZohoSyncButton({ paymentId }: ZohoSyncButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const onClick = async () => {
    setBusy(true);
    setErr(null);
    setOk(false);

    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/sync-zoho`, {
        method: 'POST',
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? 'Sync failed');
      }
      setOk(true);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ marginTop: 12 }}>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnSmall}`}
        onClick={onClick}
        disabled={busy}
      >
        {busy ? 'Syncing…' : ok ? 'Synced ✓' : 'Create Zoho invoice'}
      </button>
      {err && (
        <div
          className={`${styles.alert} ${styles.alertError}`}
          style={{ marginTop: 8, fontSize: 12 }}
        >
          {err}
        </div>
      )}
    </div>
  );
}
