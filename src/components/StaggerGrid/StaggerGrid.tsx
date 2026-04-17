'use client';

import { motion, type Variants } from 'framer-motion';
import { type ReactNode } from 'react';

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

const container: Variants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.12,
      delayChildren: delay,
    },
  }),
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(6px)',
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function StaggerGrid({
  children,
  className,
  delay = 0,
}: StaggerGridProps) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}
