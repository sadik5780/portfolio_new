import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/guard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import styles from './layout.module.scss';

export const metadata: Metadata = {
  title: 'Admin — Sadik',
  robots: { index: false, follow: false, nocache: true },
};

// Admin UIs should always render on demand with fresh data.
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className={styles.shell}>
      <AdminSidebar user={session.sub} />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
