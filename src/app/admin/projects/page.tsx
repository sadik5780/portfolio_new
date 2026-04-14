import Link from 'next/link';
import { listAdminProjects } from '@/lib/content/admin-projects';
import { hasServiceRoleEnv } from '@/lib/supabase/server';
import DeleteButton from '@/components/admin/DeleteButton';
import styles from '@/components/admin/admin-shared.module.scss';

export default async function AdminProjectsPage() {
  if (!hasServiceRoleEnv()) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Projects</h1>
        </div>
        <div className={`${styles.alert} ${styles.alertInfo}`}>
          Service role key not configured. Add{' '}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code> to manage projects.
        </div>
      </div>
    );
  }

  let projects;
  try {
    projects = await listAdminProjects();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isMissingTable = /schema cache|does not exist|relation .* does not exist/i.test(msg);
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Projects</h1>
        </div>
        <div className={`${styles.alert} ${styles.alertInfo}`}>
          {isMissingTable ? (
            <>
              <strong>Database tables not created yet.</strong> Open your
              Supabase dashboard → <em>SQL Editor</em> → paste the contents of{' '}
              <code>supabase/schema.sql</code> and run it. Then refresh this page.
            </>
          ) : (
            <>
              <strong>Could not load projects:</strong> {msg}
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
          <h1 className={styles.pageTitle}>Projects</h1>
          <p className={styles.pageSub}>
            {projects.length} project{projects.length === 1 ? '' : 's'} total
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className={`${styles.btn} ${styles.btnPrimary}`}
        >
          + New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className={`${styles.card} ${styles.empty}`}>
          <div className={styles.emptyTitle}>No projects yet</div>
          Add your first project to populate the portfolio.
        </div>
      ) : (
        <div className={`${styles.tableWrap} ${styles.tableScroll}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Year</th>
                <th>Slug</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td className={styles.titleCell}>
                    {p.title}
                    <div className={styles.muted} style={{ fontSize: '12px', marginTop: '2px' }}>
                      {p.description.slice(0, 80)}
                      {p.description.length > 80 ? '…' : ''}
                    </div>
                  </td>
                  <td>
                    <span className={styles.badge}>{p.category}</span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        p.featured ? styles.badgeYes : styles.badgeNo
                      }`}
                    >
                      {p.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>{p.year || '—'}</td>
                  <td className={styles.muted}>
                    <code>{p.slug}</code>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className={styles.rowActions}>
                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        className={styles.iconBtn}
                        title="View public page"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/projects/${p.id}`}
                        className={styles.iconBtn}
                        title="Edit"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>
                      <DeleteButton
                        url={`/api/admin/projects/${p.id}`}
                        confirmText={`Delete "${p.title}"? This cannot be undone.`}
                        icon
                        label={`Delete ${p.title}`}
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
