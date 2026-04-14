import Link from 'next/link';
import { listAdminTestimonials } from '@/lib/content/admin-testimonials';
import { hasServiceRoleEnv } from '@/lib/supabase/server';
import DeleteButton from '@/components/admin/DeleteButton';
import styles from '@/components/admin/admin-shared.module.scss';

export default async function AdminTestimonialsPage() {
  if (!hasServiceRoleEnv()) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Testimonials</h1>
        </div>
        <div className={`${styles.alert} ${styles.alertInfo}`}>
          Service role key not configured. Add{' '}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code> to manage
          testimonials.
        </div>
      </div>
    );
  }

  let testimonials;
  try {
    testimonials = await listAdminTestimonials();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isMissingTable = /schema cache|does not exist|relation .* does not exist/i.test(msg);
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Testimonials</h1>
        </div>
        <div className={`${styles.alert} ${styles.alertInfo}`}>
          {isMissingTable ? (
            <>
              <strong>Database table not created yet.</strong> Open your
              Supabase dashboard → <em>SQL Editor</em> → paste the contents of{' '}
              <code>supabase/schema.sql</code> and run it. Then refresh this page.
            </>
          ) : (
            <>
              <strong>Could not load testimonials:</strong> {msg}
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
          <h1 className={styles.pageTitle}>Testimonials</h1>
          <p className={styles.pageSub}>
            {testimonials.length} testimonial{testimonials.length === 1 ? '' : 's'} total ·
            changes publish to the home page immediately.
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className={`${styles.btn} ${styles.btnPrimary}`}
        >
          + New testimonial
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <div className={`${styles.card} ${styles.empty}`}>
          <div className={styles.emptyTitle}>No testimonials yet</div>
          Add your first testimonial to populate the homepage carousel.
        </div>
      ) : (
        <div className={`${styles.tableWrap} ${styles.tableScroll}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Country</th>
                <th>Rating</th>
                <th>Featured</th>
                <th>Quote</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id}>
                  <td className={styles.titleCell}>
                    {t.name}
                    <div className={styles.muted} style={{ fontSize: '12px', marginTop: '2px' }}>
                      {t.role}
                    </div>
                  </td>
                  <td>{t.company}</td>
                  <td>
                    <span>
                      {t.countryFlag} {t.country}
                    </span>
                  </td>
                  <td>
                    <span className={styles.badge}>{t.rating}/5</span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        t.featured ? styles.badgeYes : styles.badgeNo
                      }`}
                    >
                      {t.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className={styles.muted} style={{ maxWidth: 320 }}>
                    {t.quote.slice(0, 80)}
                    {t.quote.length > 80 ? '…' : ''}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className={styles.rowActions}>
                      <Link
                        href={`/admin/testimonials/${t.id}`}
                        className={styles.iconBtn}
                        title="Edit"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>
                      <DeleteButton
                        url={`/api/admin/testimonials/${t.id}`}
                        confirmText={`Delete testimonial from "${t.name}"? This cannot be undone.`}
                        icon
                        label={`Delete testimonial from ${t.name}`}
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
