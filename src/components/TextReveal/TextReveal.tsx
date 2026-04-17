'use client';

import { motion, type Variants } from 'framer-motion';
import styles from './TextReveal.module.scss';

interface TextRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  delay?: number;
  staggerSpeed?: number;
  highlight?: string;
  highlightClassName?: string;
}

const container: Variants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.07,
      delayChildren: delay,
    },
  }),
};

const wordVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function TextReveal({
  text,
  as: Tag = 'h2',
  className,
  delay = 0,
  highlight,
  highlightClassName,
}: TextRevealProps) {
  const words = text.split(' ');

  return (
    <Tag className={className}>
      <motion.span
        className={styles.wrapper}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        custom={delay}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className={`${styles.word} ${
              highlight && word.replace(/[^a-zA-Z]/g, '') === highlight
                ? highlightClassName || ''
                : ''
            }`}
            variants={wordVariant}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
