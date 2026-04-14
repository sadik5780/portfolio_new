import Link from 'next/link';
import BlogPostForm from '@/components/admin/BlogPostForm';
import styles from '@/components/admin/admin-shared.module.scss';

export default function NewBlogPostPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <Link
            href="/admin/blog"
            className={styles.muted}
            style={{ fontSize: '13px', textDecoration: 'none' }}
          >
            ← Back to blog
          </Link>
          <h1 className={styles.pageTitle} style={{ marginTop: '4px' }}>
            New blog post
          </h1>
          <p className={styles.pageSub}>
            Draft and publish a new article. Use the block editor to structure
            your content — paragraph, heading, list, quote, or CTA.
          </p>
        </div>
      </div>

      <BlogPostForm mode="create" />
    </div>
  );
}
