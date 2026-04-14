import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import DeleteButton from '@/components/admin/DeleteButton';
import { getAdminProject } from '@/lib/content/admin-projects';
import styles from '@/components/admin/admin-shared.module.scss';

interface Params {
  params: { id: string };
}

export default async function EditProjectPage({ params }: Params) {
  let project;
  try {
    project = await getAdminProject(params.id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isMissingTable = /schema cache|does not exist|relation .* does not exist/i.test(msg);
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Edit project</h1>
        </div>
        <div className={`${styles.alert} ${styles.alertInfo}`}>
          {isMissingTable ? (
            <>
              <strong>Database tables not created yet.</strong> Open Supabase →{' '}
              <em>SQL Editor</em> → paste <code>supabase/schema.sql</code> and run it.
            </>
          ) : (
            <>Could not load project: {msg}</>
          )}
        </div>
      </div>
    );
  }
  if (!project) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <Link href="/admin/projects" className={styles.muted} style={{ fontSize: '13px', textDecoration: 'none' }}>
            ← Back to projects
          </Link>
          <h1 className={styles.pageTitle} style={{ marginTop: '4px' }}>
            Edit project
          </h1>
          <p className={styles.pageSub}>
            <code>{project.slug}</code> · last updated just now
          </p>
        </div>

        <DeleteButton
          url={`/api/admin/projects/${project.id}`}
          confirmText={`Delete "${project.title}"? This cannot be undone.`}
          redirectTo="/admin/projects"
          label="Delete project"
        />
      </div>

      <ProjectForm mode="edit" project={project} />
    </div>
  );
}
