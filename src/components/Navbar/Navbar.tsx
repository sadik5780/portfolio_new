'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.scss';

interface NavLink {
  label: string;
  href: string;
  /** For anchor-to-section links on the home page */
  hash?: string;
}

const navLinks: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const buildHref = (link: NavLink) =>
    link.hash ? `${link.href}${link.hash}` : link.href;

  const isActive = (link: NavLink) => {
    if (link.hash) return false;
    if (link.href === '/') return pathname === '/';
    return pathname.startsWith(link.href);
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: NavLink,
  ) => {
    // Smooth scroll only if we're already on the same page as the hash target
    if (link.hash && pathname === link.href) {
      e.preventDefault();
      const el = document.querySelector(link.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  return (
    <motion.header
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      <nav className={styles.inner} aria-label="Primary">
        <Link href="/" className={styles.logo} aria-label="Sadik home">
          <span className={styles.logoIcon}>S</span>
          <span className={styles.logoText}>sadik.dev</span>
        </Link>

        <ul className={styles.links}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={buildHref(link)}
                className={`${styles.link} ${isActive(link) ? styles.linkActive : ''}`}
                onClick={(e) => handleLinkClick(e, link)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/contact" className={styles.cta}>
          Let&apos;s Talk
        </Link>

        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.active : ''}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ul className={styles.mobileLinks}>
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={buildHref(link)}
                    className={styles.mobileLink}
                    onClick={(e) => handleLinkClick(e, link)}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <Link href="/contact" className={styles.mobileCta}>
              Let&apos;s Talk
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
