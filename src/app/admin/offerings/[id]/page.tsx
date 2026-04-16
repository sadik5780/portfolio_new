import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminOffering } from '@/lib/content/admin-offerings';
import OfferingForm from '@/components/admin/OfferingForm';
import styles from '@/components/admin/admin-shared.module.scss';

interface Params {
  params: { id: string };
}

export default async function EditOfferingPage({ params }: Params) {
  const offering = await getAdminOffering(params.id);
  if (!offering) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Edit offering</h1>
          <p className={styles.pageSub}>
            Editing <strong>{offering.name}</strong> · slug <code>{offering.slug}</code>
          </p>
        </div>
        <Link href="/admin/offerings" className={styles.btn}>
          ← Back
        </Link>
      </div>

      <div className={styles.card}>
        <OfferingForm mode="edit" offering={offering} />
      </div>
    </div>
  );
}
