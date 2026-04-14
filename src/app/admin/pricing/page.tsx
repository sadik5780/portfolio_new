import { getPricing } from '@/lib/content/settings';
import PricingEditor from '@/components/admin/PricingEditor';
import styles from '@/components/admin/admin-shared.module.scss';

export default async function AdminPricingPage() {
  const pricing = await getPricing();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Pricing</h1>
          <p className={styles.pageSub}>
            Update Shopify, static site tiers, and custom app builder pricing.
            Saved changes are reflected on the public /contact page immediately.
          </p>
        </div>
      </div>

      <PricingEditor initial={pricing} />
    </div>
  );
}
