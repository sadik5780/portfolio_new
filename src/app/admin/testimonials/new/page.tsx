import Link from 'next/link';
import TestimonialForm from '@/components/admin/TestimonialForm';
import styles from '@/components/admin/admin-shared.module.scss';

export default function NewTestimonialPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <Link href="/admin/testimonials" className={styles.backLink}>
            ← Back to testimonials
          </Link>
          <h1 className={styles.pageTitle}>New testimonial</h1>
        </div>
      </div>
      <TestimonialForm mode="create" />
    </div>
  );
}
