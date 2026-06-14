import './AuroraBackground.css'

/**
 * Aurora Background — a fixed, full-viewport galaxy backdrop (dark grey → black)
 * with soft, slowly drifting aurora gradient bands. Sits behind all content.
 * CSS-only animation (GPU-friendly background-position), honors reduced motion.
 */
export default function AuroraBackground() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora__layer" />
    </div>
  )
}
