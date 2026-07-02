import { motion, useScroll, useReducedMotion } from 'motion/react'

/* Thin page-scroll progress bar pinned above the header (status indicator).
   Driven directly by scroll position — transform-only, no layout work.
   Hidden entirely under prefers-reduced-motion. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  )
}
