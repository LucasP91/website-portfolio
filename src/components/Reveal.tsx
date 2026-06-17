import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/* Scroll-reveal wrapper. Fades + lifts content into view once.
   Honors prefers-reduced-motion (motion-and-animation): no transform,
   content simply renders. Purposeful, ~450ms, eased, GPU-friendly. */
export default function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
