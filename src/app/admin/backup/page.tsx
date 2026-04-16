import { listBackups } from '@/lib/content/backup';
import { hasServiceRoleEnv } from '@/lib/supabase/server';
import BackupControls from '@/components/admin/BackupControls';
import styles from '@/components/admin/admin-shared.module.scss';

export const dynamic = 'force-dynamic';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default async function AdminBackupPage() {
  if (!hasServiceRoleEnv()) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Backups</h1>
        </div>
        <div className={`${styles.alert} ${styles.alertInfo}`}>
          Service role key not configured. Add{' '}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> to your env to manage backups.
        </div>
      </div>
    );
  }

  let backups;
  try {
    backups = await listBackups();
  } catch (err) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Backups</h1>
        </div>
        <div className={`${styles.alert} ${styles.alertError}`}>
          <strong>Could not list backups:</strong>{' '}
          {err instanceof Error ? err.message : String(err)}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Backups</h1>
          <p className={styles.pageSub}>
            Manual JSON exports of every content table (settings, projects,
            testimonials, blog posts, offerings, payments, leads). Stored in a
            private Supabase Storage bucket. Run this weekly — download URLs are
            valid for 7 days.
          </p>
        </div>
      </div>

      <BackupControls />

      <div className={styles.card}>
        <h3 className={styles.sectionTitle} style={{ marginBottom: 12 }}>
          History ({backups.length})
        </h3>

        {backups.length === 0 ? (
          <div className={styles.muted}>
            No backups yet. Click <strong>Run backup now</strong> above to create
            your first one.
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>File</th>
                  <th>Size</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((b) => (
                  <tr key={b.name}>
                    <td className={styles.titleCell}>
                      <code style={{ fontSize: 12 }}>{b.name}</code>
                    </td>
                    <td className={styles.muted}>{formatBytes(b.sizeBytes)}</td>
                    <td className={styles.muted}>
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div
        className={`${styles.alert} ${styles.alertInfo}`}
        style={{ marginTop: 16 }}
      >
        <strong>Automation tip:</strong> to run this weekly without clicking,
        add a cron job using{' '}
        <a
          href="https://cron-job.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#6366f1' }}
        >
          cron-job.org
        </a>{' '}
        (free) that POSTs to{' '}
        <code>/api/admin/backup</code> with your admin session cookie. See the
        README for the exact setup.
      </div>
    </div>
  );
}
