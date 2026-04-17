import { getInvoice } from '@/lib/content/invoices';
import { redirect } from 'next/navigation';
import InvoiceGenerator from '@/components/admin/InvoiceGenerator';
import styles from '@/components/admin/admin-shared.module.scss';
import Link from 'next/link';

interface Params { params: { id: string } }

export default async function EditInvoicePage({ params }: Params) {
  const invoice = await getInvoice(params.id);
  if (!invoice) redirect('/admin/invoices');

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Edit Invoice — {invoice.invoiceNumber}</h1>
          <p className={styles.pageSub}>{invoice.clientName} · {invoice.status}</p>
        </div>
        <Link href="/admin/invoices" className={styles.btn}>Back to invoices</Link>
      </div>
      <InvoiceGenerator existingInvoice={invoice} />
    </div>
  );
}
