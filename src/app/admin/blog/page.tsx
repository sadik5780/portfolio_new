import Link from 'next/link';
import { listAdminBlogPosts } from '@/lib/content/admin-blog';
import { hasServiceRoleEnv } from '@/lib/supabase/server';
import DeleteButton from '@/components/admin/DeleteButton';
import SeedBlogButton from '@/components/admin/SeedBlogButton';
import styles from '@/components/admin/admin-shared.module.scss';

export default async function AdminBlogPage() {
  if (!hasServiceRoleEnv()) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Blog</h1>
        </div>
        <div className={`${styles.alert} ${styles.alertInfo}`}>
          Service role key not configured. Add{' '}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code> to manage blog posts.
        </div>
      </div>
    );
  }

  let posts;
  try {
    posts = await listAdminBlogPosts();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isMissingTable = /schema cache|does not exist|relation .* does not exist/i.test(msg);
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Blog</h1>
        </div>
        <div className={`${styles.alert} ${styles.alertInfo}`}>
          {isMissingTable ? (
            <>
              <strong>blog_posts table not created yet.</strong> Open Supabase →{' '}
              <em>SQL Editor</em> → paste{' '}
              <code>supabase/migrations/002_blog_posts.sql</code> and run it.
              Refresh this page once the migration completes.
            </>
          ) : (
            <>Could not load posts: {msg}</>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Blog</h1>
          <p className={styles.pageSub}>
            {posts.length} post{posts.length === 1 ? '' : 's'} total
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {posts.length === 0 && <SeedBlogButton />}
          <Link
            href="/admin/blog/new"
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            + New post
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className={`${styles.card} ${styles.empty}`}>
          <div className={styles.emptyTitle}>No blog posts in the database yet</div>
          <p style={{ marginBottom: '12px' }}>
            The site currently serves 10 bundled starter posts from{' '}
            <code>src/data/blog-posts.ts</code>. Click <strong>&ldquo;Import
            starter posts&rdquo;</strong> to copy them into the database so you
            can edit them here, or create a new post from scratch.
          </p>
        </div>
      ) : (
        <div className={`${styles.tableWrap} ${styles.tableScroll}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Published</th>
                <th>Date</th>
                <th>Slug</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className={styles.titleCell}>
                    {p.title}
                    <div className={styles.muted} style={{ fontSize: '12px', marginTop: '2px' }}>
                      {p.description.slice(0, 100)}
                      {p.description.length > 100 ? '…' : ''}
                    </div>
                  </td>
                  <td>
                    <span className={styles.badge}>{p.category}</span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${p.published ? styles.badgeYes : styles.badgeNo}`}
                    >
                      {p.published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className={styles.muted} style={{ whiteSpace: 'nowrap' }}>
                    {new Date(p.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className={styles.muted}>
                    <code>{p.slug}</code>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className={styles.rowActions}>
                      <Link
                        href={`/blog/${p.slug}`}
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
                        href={`/admin/blog/${p.id}`}
                        className={styles.iconBtn}
                        title="Edit"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>
                      <DeleteButton
                        url={`/api/admin/blog/${p.id}`}
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
