'use client';

import { motion, type Variants } from 'framer-motion';
import { type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  width?: 'fit' | 'full';
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  blur?: boolean;
  scale?: boolean;
}

export default function ScrollReveal({
  children,
  width = 'full',
  delay = 0,
  direction = 'up',
  distance = 40,
  duration = 0.7,
  once = true,
  className,
  blur = false,
  scale = false,
}: ScrollRevealProps) {
  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      filter: blur ? 'blur(10px)' : 'blur(0px)',
      ...(scale ? { scale: 0.95 } : {}),
      ...directionMap[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      ...(scale ? { scale: 1 } : {}),
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      style={{ width: width === 'full' ? '100%' : 'fit-content' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
