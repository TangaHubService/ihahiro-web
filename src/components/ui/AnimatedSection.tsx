'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
}

export function AnimatedSection({
  children,
  className = '',
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] as const }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedCard({
  children,
  className = '',
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedStagger({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
