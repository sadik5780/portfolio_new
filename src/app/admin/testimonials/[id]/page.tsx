import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdminTestimonial } from '@/lib/content/admin-testimonials';
import TestimonialForm from '@/components/admin/TestimonialForm';
import DeleteButton from '@/components/admin/DeleteButton';
import styles from '@/components/admin/admin-shared.module.scss';

interface Params {
  params: { id: string };
}

export default async function EditTestimonialPage({ params }: Params) {
  const testimonial = await getAdminTestimonial(params.id).catch(() => null);
  if (!testimonial) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <Link href="/admin/testimonials" className={styles.backLink}>
            ← Back to testimonials
          </Link>
          <h1 className={styles.pageTitle}>Edit testimonial</h1>
          <p className={styles.pageSub}>
            {testimonial.name} · {testimonial.role} · {testimonial.company}
          </p>
        </div>
        <DeleteButton
          url={`/api/admin/testimonials/${testimonial.id}`}
          confirmText={`Delete testimonial from "${testimonial.name}"? This cannot be undone.`}
          redirectTo="/admin/testimonials"
          label="Delete testimonial"
        />
      </div>

      <TestimonialForm mode="edit" testimonial={testimonial} />
    </div>
  );
}
