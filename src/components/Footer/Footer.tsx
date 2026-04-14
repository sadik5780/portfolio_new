'use client';

import Link from 'next/link';
import Logo from '@/components/Logo/Logo';
import styles from './Footer.module.scss';

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/sadik',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/sadikdev',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* ── Main row ─────────────────────────────── */}
        <div className={styles.inner}>
          <Logo variant="full" size="md" />

          <nav className={styles.nav} aria-label="Footer">
            <Link href="/services" className={styles.navLink}>Services</Link>
            <Link href="/projects" className={styles.navLink}>Projects</Link>
            <Link href="/blog" className={styles.navLink}>Blog</Link>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
          </nav>

          <div className={styles.socials}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={social.label}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* ── Bottom row ───────────────────────────── */}
        <div className={styles.bottom}>
          <p className={styles.copy}>
            &copy; {year} Sadik Shaikh. All rights reserved.
          </p>

          <nav className={styles.legal} aria-label="Legal">
            <Link href="/privacy" className={styles.legalLink}>
              Privacy Policy
            </Link>
            <span className={styles.legalSep} aria-hidden>
              ·
            </span>
            <Link href="/terms" className={styles.legalLink}>
              Terms &amp; Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
