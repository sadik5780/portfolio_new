import DocumentGenerator from '@/components/admin/DocumentGenerator';
import styles from '@/components/admin/admin-shared.module.scss';

export default function AdminDocumentsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Client Documents</h1>
          <p className={styles.pageSub}>
            Generate SOW, NDA, and Service Agreement — export as A4 PDF.
          </p>
        </div>
      </div>
      <DocumentGenerator />
    </div>
  );
}
