'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin-shared.module.scss';

interface BackupResponse {
  ok?: boolean;
  path?: string;
  url?: string | null;
  sizeBytes?: number;
  tableCounts?: Record<string, number>;
  generatedAt?: string;
  error?: string;
}

export default function BackupControls() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<BackupResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runBackup = async () => {
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/admin/backup', { method: 'POST' });
      const body = (await res.json().catch(() => ({}))) as BackupResponse;
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? 'Backup failed');
      }
      setResult(body);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Backup failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.card} style={{ marginBottom: 16 }}>
      <h3 className={styles.sectionTitle} style={{ marginBottom: 8 }}>
        Run backup now
      </h3>
      <p className={styles.sectionDesc} style={{ marginBottom: 16 }}>
        Exports every content table to a single JSON file in private Supabase
        Storage. Takes 2-5 seconds on the current dataset.
      </p>

      <button
        type="button"
        className={`${styles.btn} ${styles.btnPrimary}`}
        onClick={runBackup}
        disabled={busy}
      >
        {busy ? 'Running backup…' : 'Run backup now'}
      </button>

      {error && (
        <div className={`${styles.alert} ${styles.alertError}`} style={{ marginTop: 12 }}>
          <strong>Backup failed:</strong> {error}
        </div>
      )}

      {result && result.ok && (
        <div
          className={`${styles.alert} ${styles.alertSuccess}`}
          style={{ marginTop: 12 }}
        >
          <strong>Backup complete.</strong> Stored as{' '}
          <code style={{ fontSize: 12 }}>{result.path}</code>.{' '}
          {result.url && (
            <>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#86efac', textDecoration: 'underline' }}
              >
                Download JSON
              </a>{' '}
              (link valid 7 days).
            </>
          )}
          {result.tableCounts && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#a1a1aa' }}>
              Rows:{' '}
              {Object.entries(result.tableCounts)
                .map(([t, n]) => `${t}=${n}`)
                .join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
