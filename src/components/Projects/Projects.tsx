'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Project } from '@/lib/content/types';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import styles from './Projects.module.scss';

interface ProjectsProps {
  featured: Project[];
}

export default function Projects({ featured }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (featured.length === 0) return null;

  return (
    <section className={styles.section} id="projects">
      <div className={styles.container}>
        <SectionHeading
          label="Projects"
          title="Featured Work"
          description="A selection of projects that showcase my expertise in building modern, performant web applications."
        />

        <div className={styles.grid}>
          {featured.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpen={setSelectedProject}
            />
          ))}
        </div>

        <motion.div
          className={styles.viewAllWrap}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/projects" className={styles.viewAllBtn}>
            View all projects
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </motion.div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
