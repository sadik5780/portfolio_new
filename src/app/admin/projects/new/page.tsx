import Link from 'next/link';
import ProjectForm from '@/components/admin/ProjectForm';
import styles from '@/components/admin/admin-shared.module.scss';

export default function NewProjectPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <Link href="/admin/projects" className={styles.muted} style={{ fontSize: '13px', textDecoration: 'none' }}>
            ← Back to projects
          </Link>
          <h1 className={styles.pageTitle} style={{ marginTop: '4px' }}>New project</h1>
          <p className={styles.pageSub}>
            Fields marked * are required. Slug and case-study fields can be
            filled later.
          </p>
        </div>
      </div>

      <ProjectForm mode="create" />
    </div>
  );
}
