import { getQuote } from '@/lib/content/quotes';
import { redirect } from 'next/navigation';
import QuoteGenerator from '@/components/admin/QuoteGenerator';
import styles from '@/components/admin/admin-shared.module.scss';
import Link from 'next/link';

interface Params {
  params: { id: string };
}

export default async function EditQuotePage({ params }: Params) {
  const quote = await getQuote(params.id);
  if (!quote) redirect('/admin/quotes');

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Edit Quote — {quote.quoteNumber}</h1>
          <p className={styles.pageSub}>
            {quote.clientName} · {quote.status}
          </p>
        </div>
        <Link href="/admin/quotes" className={styles.btn}>
          Back to quotes
        </Link>
      </div>
      <QuoteGenerator existingQuote={quote} />
    </div>
  );
}
