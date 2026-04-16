import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import ContactForm from '@/components/ContactForm/ContactForm';
import { buildMetadata, siteConfig } from '@/lib/seo';
import styles from './page.module.scss';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Contact Sadik Studio — Get in Touch in 24 Hours',
  description:
    'Reach Sadik Studio for React, Next.js, Shopify, SaaS, and mobile app projects. Email, LinkedIn, or contact form — reply within 24 hours.',
  path: '/contact',
  keywords: [
    'contact sadik studio',
    'hire developer india usa australia',
    'freelance developer contact',
    'shopify developer contact',
    'saas developer email',
  ],
});

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: `Contact ${siteConfig.name}`,
  url: `${siteConfig.url}/contact`,
};

const channels = [
  {
    label: 'Email',
    value: 'sadik5780@gmail.com',
    href: 'mailto:sadik5780@gmail.com',
    note: 'Best for detailed briefs. Replies within 24 hours.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/sadik-shaikh',
    href: 'https://www.linkedin.com/in/sadik-shaikh',
    note: 'Connect first; pitch in a follow-up message.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    value: '@sadik5780',
    href: 'https://x.com/sadik5780',
    note: 'DMs open. Quick technical questions welcome.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />

      <Navbar />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.container}>
            <SectionHeading
              label="Contact"
              title="Let's talk about your project"
              description="Send a message, email directly, or get a tentative quote in under 60 seconds. Reply within 24 hours, every time."
            />

            <div className={styles.heroActions}>
              <Link href="/quote" className={styles.btnPrimary}>
                Get an instant quote first
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/pricing" className={styles.btnSecondary}>
                See pricing
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.body}>
          <div className={styles.container}>
            <div className={styles.layout}>
              <aside className={styles.channels}>
                <h2 className={styles.channelsTitle}>Direct channels</h2>
                <ul className={styles.channelList}>
                  {channels.map((c) => (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        target={c.href.startsWith('mailto') ? undefined : '_blank'}
                        rel={c.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                        className={styles.channelLink}
                      >
                        <span className={styles.channelIcon}>{c.icon}</span>
                        <span className={styles.channelMeta}>
                          <span className={styles.channelLabel}>{c.label}</span>
                          <span className={styles.channelValue}>{c.value}</span>
                          <span className={styles.channelNote}>{c.note}</span>
                        </span>
                        <svg className={styles.channelArrow} width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>

                <div className={styles.metaCard}>
                  <h3 className={styles.metaTitle}>Working hours</h3>
                  <p className={styles.metaCopy}>
                    Based in India (IST). Daily overlap windows:
                  </p>
                  <ul className={styles.metaList}>
                    <li>India / SE Asia — full day</li>
                    <li>USA East — morning EST</li>
                    <li>USA West — early morning PST</li>
                    <li>Australia / NZ — AEST mornings</li>
                    <li>UK / EU — afternoon</li>
                  </ul>
                </div>
              </aside>

              <div className={styles.formWrap}>
                <ContactForm currency="inr" preset={null} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
