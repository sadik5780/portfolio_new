'use client';

import { motion } from 'framer-motion';
import type { ProjectCategory } from '@/data/projects';
import styles from './CategoryFilter.module.scss';

type Filter = ProjectCategory | 'All';

interface CategoryFilterProps {
  categories: Filter[];
  active: Filter;
  onChange: (c: Filter) => void;
  counts: Record<string, number>;
}

export default function CategoryFilter({
  categories,
  active,
  onChange,
  counts,
}: CategoryFilterProps) {
  return (
    <div className={styles.filters} role="tablist" aria-label="Filter projects by category">
      {categories.map((category) => {
        const isActive = active === category;
        return (
          <button
            key={category}
            className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
            onClick={() => onChange(category)}
            role="tab"
            aria-selected={isActive}
          >
            {isActive && (
              <motion.span
                className={styles.chipBackground}
                layoutId="category-chip-bg"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className={styles.chipText}>
              {category}
              <span className={styles.chipCount}>{counts[category] ?? 0}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
