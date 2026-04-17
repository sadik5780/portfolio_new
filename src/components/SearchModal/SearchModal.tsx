'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { SearchResult } from '@/app/api/search/route';
import styles from './SearchModal.module.scss';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const TYPE_ICONS: Record<SearchResult['type'], string> = {
  project: '◆',
  blog: '◇',
  service: '→',
};

const TYPE_LABELS: Record<SearchResult['type'], string> = {
  project: 'Project',
  blog: 'Blog',
  service: 'Service',
};

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const search = useCallback((q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      .then((r) => r.json())
      .then((data: { results: SearchResult[] }) => {
        setResults(data.results);
        setActiveIndex(0);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(value), 250);
  };

  const navigate = (href: string) => {
    onClose();
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      navigate(results[activeIndex].href);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <div className={styles.inputRow}>
              <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                className={styles.input}
                type="text"
                placeholder="Search projects, blog posts, services…"
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className={styles.kbd}>ESC</kbd>
            </div>

            {(results.length > 0 || loading || query.length >= 2) && (
              <div className={styles.results}>
                {loading && (
                  <div className={styles.empty}>Searching…</div>
                )}
                {!loading && query.length >= 2 && results.length === 0 && (
                  <div className={styles.empty}>
                    No results for &ldquo;{query}&rdquo;
                  </div>
                )}
                {!loading && results.map((r, i) => (
                  <button
                    key={r.href}
                    className={`${styles.result} ${i === activeIndex ? styles.resultActive : ''}`}
                    onClick={() => navigate(r.href)}
                    onMouseEnter={() => setActiveIndex(i)}
                    type="button"
                  >
                    <span className={styles.resultIcon}>
                      {TYPE_ICONS[r.type]}
                    </span>
                    <div className={styles.resultBody}>
                      <span className={styles.resultTitle}>{r.title}</span>
                      <span className={styles.resultDesc}>
                        {r.description.length > 80
                          ? `${r.description.slice(0, 80)}…`
                          : r.description}
                      </span>
                    </div>
                    <span className={styles.resultTag}>
                      {r.tag ?? TYPE_LABELS[r.type]}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className={styles.footer}>
              <span><kbd className={styles.kbdSmall}>↑↓</kbd> Navigate</span>
              <span><kbd className={styles.kbdSmall}>↵</kbd> Open</span>
              <span><kbd className={styles.kbdSmall}>ESC</kbd> Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
