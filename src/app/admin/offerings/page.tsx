import Link from 'next/link';
import { listAdminOfferings } from '@/lib/content/admin-offerings';
import { hasServiceRoleEnv } from '@/lib/supabase/server';
import DeleteButton from '@/components/admin/DeleteButton';
import styles from '@/components/admin/admin-shared.module.scss';

export default async function AdminOfferingsPage() {
  if (!hasServiceRoleEnv()) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Offerings</h1>
        </div>
        <div className={`${styles.alert} ${styles.alertInfo}`}>
          Service role key not configured. Add{' '}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> to your env to manage
          offerings.
        </div>
      </div>
    );
  }

  let offerings;
  try {
    offerings = await listAdminOfferings();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isMissingTable = /schema cache|does not exist|relation .* does not exist/i.test(msg);
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Offerings</h1>
        </div>
        <div className={`${styles.alert} ${styles.alertInfo}`}>
          {isMissingTable ? (
            <>
              <strong>Database table not created yet.</strong> Open Supabase →
              SQL Editor, paste the contents of{' '}
              <code>supabase/migrations/004_offerings.sql</code>, run it, then
              refresh this page.
            </>
          ) : (
            <>
              <strong>Could not load offerings:</strong> {msg}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Offerings</h1>
          <p className={styles.pageSub}>
            {offerings.length} offering{offerings.length === 1 ? '' : 's'} ·
            these power the /services cards and /quote builder. Changes publish
            immediately.
          </p>
        </div>
        <Link
          href="/admin/offerings/new"
          className={`${styles.btn} ${styles.btnPrimary}`}
        >
          + New offering
        </Link>
      </div>

      {offerings.length === 0 ? (
        <div className={`${styles.card} ${styles.empty}`}>
          <div className={styles.emptyTitle}>No offerings yet</div>
          Add your first service so it appears on the quote builder and /services page.
        </div>
      ) : (
        <div className={`${styles.tableWrap} ${styles.tableScroll}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Category</th>
                <th>Pricing key</th>
                <th>Starts (USD)</th>
                <th>Timeline</th>
                <th>Sort</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offerings.map((o) => (
                <tr key={o.id}>
                  <td className={styles.titleCell}>
                    {o.name}
                    <div className={styles.muted} style={{ fontSize: '12px', marginTop: '2px' }}>
                      {o.tagline.slice(0, 64)}
                      {o.tagline.length > 64 ? '…' : ''}
                    </div>
                  </td>
                  <td className={styles.muted}>
                    <code>{o.slug}</code>
                  </td>
                  <td>
                    <span className={styles.badge}>{o.category}</span>
                  </td>
                  <td>
                    <span className={styles.badge}>{o.pricingKey}</span>
                  </td>
                  <td>${o.startingUsd.toLocaleString('en-US')}</td>
                  <td className={styles.muted}>{o.timeline || '—'}</td>
                  <td className={styles.muted}>{o.sortOrder}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className={styles.rowActions}>
                      <Link
                        href={`/admin/offerings/${o.id}`}
                        className={styles.iconBtn}
                        title="Edit"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>
                      <DeleteButton
                        url={`/api/admin/offerings/${o.id}`}
                        confirmText={`Delete "${o.name}"? This cannot be undone.`}
                        icon
                        label={`Delete ${o.name}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
