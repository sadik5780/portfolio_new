import Link from 'next/link';
import OfferingForm from '@/components/admin/OfferingForm';
import styles from '@/components/admin/admin-shared.module.scss';

export default function NewOfferingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>New offering</h1>
          <p className={styles.pageSub}>
            Adds a new service card on /services and a new picker option on
            /quote.
          </p>
        </div>
        <Link href="/admin/offerings" className={styles.btn}>
          ← Back
        </Link>
      </div>

      <div className={styles.card}>
        <OfferingForm mode="create" />
      </div>
    </div>
  );
}
