'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectCategories } from '@/data/projects';
import type { Project, ProjectCategory } from '@/lib/content/types';
import ProjectCard from '@/components/Projects/ProjectCard';
import CategoryFilter from './CategoryFilter';
import styles from './ProjectsGrid.module.scss';

type Filter = ProjectCategory | 'All';

interface ProjectsGridProps {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [filter, setFilter] = useState<Filter>('All');

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: projects.length };
    for (const project of projects) {
      c[project.category] = (c[project.category] ?? 0) + 1;
    }
    return c;
  }, [projects]);

  const filtered = useMemo(
    () =>
      filter === 'All'
        ? projects
        : projects.filter((project) => project.category === filter),
    [filter, projects],
  );

  return (
    <>
      <CategoryFilter
        categories={[...projectCategories]}
        active={filter}
        onChange={setFilter}
        counts={counts}
      />

      <motion.div className={styles.grid} layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={project} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <p>No projects in this category yet.</p>
        </div>
      )}
    </>
  );
}
