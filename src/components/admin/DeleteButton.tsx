'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin-shared.module.scss';

interface DeleteButtonProps {
  url: string;
  confirmText: string;
  redirectTo?: string;
  label?: string;
  icon?: boolean;
}

export default function DeleteButton({
  url,
  confirmText,
  redirectTo,
  label = 'Delete',
  icon = false,
}: DeleteButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(confirmText)) return;
    setBusy(true);
    try {
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Delete failed');
      }
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
      setBusy(false);
    }
  };

  if (icon) {
    return (
      <button
        type="button"
        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
        onClick={handleDelete}
        disabled={busy}
        aria-label={label}
        title={label}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.btnDanger}`}
      onClick={handleDelete}
      disabled={busy}
    >
      {busy ? 'Deleting…' : label}
    </button>
  );
}
