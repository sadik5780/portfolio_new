'use client';

import { motion } from 'framer-motion';
import type { AboutContent, SkillsContent } from '@/lib/content/types';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import styles from './About.module.scss';

interface AboutProps {
  content: AboutContent;
  skills: SkillsContent;
}

export default function About({ content, skills }: AboutProps) {
  return (
    <section className={styles.section} id="about">
      <div className={styles.container}>
        <SectionHeading
          label={content.label}
          title={content.title}
          description={content.description}
        />

        <div className={styles.grid}>
          {/* Skills */}
          <ScrollReveal delay={0.1}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Skills & Technologies</h3>
              <div className={styles.skillGroups}>
                {skills.groups.map((group) => (
                  <div key={group.category} className={styles.skillGroup}>
                    <span className={styles.skillCategory}>{group.category}</span>
                    <div className={styles.skillList}>
                      {group.items.map((skill) => (
                        <motion.span
                          key={skill}
                          className={styles.skillTag}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Experience */}
          <ScrollReveal delay={0.2}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Experience</h3>
              <div className={styles.timeline}>
                {content.experiences.map((exp) => (
                  <div key={`${exp.role}-${exp.company}`} className={styles.timelineItem}>
                    <div className={styles.timelineHeader}>
                      <div>
                        <h4 className={styles.role}>{exp.role}</h4>
                        <span className={styles.company}>{exp.company}</span>
                      </div>
                      <span className={styles.period}>{exp.period}</span>
                    </div>
                    <p className={styles.expDescription}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
