import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlogPostForm from '@/components/admin/BlogPostForm';
import DeleteButton from '@/components/admin/DeleteButton';
import { getAdminBlogPost } from '@/lib/content/admin-blog';
import styles from '@/components/admin/admin-shared.module.scss';

interface Params {
  params: { id: string };
}

export default async function EditBlogPostPage({ params }: Params) {
  let post;
  try {
    post = await getAdminBlogPost(params.id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isMissingTable = /schema cache|does not exist|relation .* does not exist/i.test(msg);
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Edit blog post</h1>
        </div>
        <div className={`${styles.alert} ${styles.alertInfo}`}>
          {isMissingTable
            ? 'blog_posts table not created yet — run supabase/migrations/002_blog_posts.sql.'
            : `Could not load post: ${msg}`}
        </div>
      </div>
    );
  }

  if (!post) notFound();

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
            Edit post
          </h1>
          <p className={styles.pageSub}>
            <code>{post.slug}</code>
          </p>
        </div>

        <DeleteButton
          url={`/api/admin/blog/${post.id}`}
          confirmText={`Delete "${post.title}"? This cannot be undone.`}
          redirectTo="/admin/blog"
          label="Delete post"
        />
      </div>

      <BlogPostForm mode="edit" post={post} />
    </div>
  );
}
