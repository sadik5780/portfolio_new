import {
  getHero,
  getStats,
  getAbout,
  getSkills,
  getServices,
} from '@/lib/content/settings';
import ContentEditor from '@/components/admin/ContentEditor';
import styles from '@/components/admin/admin-shared.module.scss';

export default async function AdminContentPage() {
  const [hero, stats, about, skills, services] = await Promise.all([
    getHero(),
    getStats(),
    getAbout(),
    getSkills(),
    getServices(),
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Content</h1>
          <p className={styles.pageSub}>
            Edit every section of the public site. Changes are live immediately.
          </p>
        </div>
      </div>

      <ContentEditor
        hero={hero}
        stats={stats}
        about={about}
        skills={skills}
        services={services}
      />
    </div>
  );
}
