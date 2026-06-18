import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react'
import './ScrollImageSequence.css'

/**
 * Scroll-driven canvas image sequence (Apple-style).
 *
 * Memory note: all frames are preloaded and decoded up front, so peak memory is
 * roughly frameCount × frameWidth × frameHeight × 4 bytes of decoded bitmap
 * (e.g. 150 × 1200 × 675 ≈ ~485 MB). Bound it by right-sizing the source frames
 * to the largest size they'll display at and/or reducing frameCount — not by
 * raising the count. The backing canvas is also DPR-capped at 2 to limit fill cost.
 */
export interface ScrollImageSequenceProps {
  /** Number of frames in the sequence. */
  frameCount?: number
  /** Maps a 1-based frame number to its URL. Override to change path/format. */
  frameSrc?: (frame: number) => string
  /** Scroll distance of the section, in viewport heights. Taller = slower scrub. */
  heightVh?: number
  /** Frame shown for the reduced-motion fallback and before scroll (1-based). */
  posterFrame?: number
  /** Accessible description of what the sequence depicts. */
  label?: string
  /** Optional caption shown over the pinned canvas (title). */
  caption?: string
  /** Optional smaller note under the caption title. */
  captionNote?: string
}

const defaultFrameSrc = (frame: number) =>
  `${import.meta.env.BASE_URL}frames/frame-${String(frame).padStart(4, '0')}.png`

export default function ScrollImageSequence({
  frameCount = 120,
  frameSrc = defaultFrameSrc,
  heightVh = 300,
  posterFrame = 1,
  label = 'Product animation sequence',
  caption,
  captionNote,
}: ScrollImageSequenceProps) {
  const prefersReduced = useReducedMotion()

  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const rafRef = useRef<number | null>(null)
  const pendingFrame = useRef(0)
  const drawnFrame = useRef(-1)

  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  // scrollYProgress: 0 when the section's top hits the viewport top,
  // 1 when its bottom hits the viewport bottom.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Map progress (0–1) to a 0-based frame index.
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1])

  // Caption eases away (fade + slight lift) near the end of the scroll so it
  // doesn't sit misaligned over the section below. (motion-and-animation:
  // opacity/transform only; disabled under reduced motion.)
  // Caption fade is driven by a manually-computed, guaranteed-monotonic section
  // progress (the section's own scroll offset), not the pinned scrollYProgress —
  // which measured non-monotonic at depth and let the caption creep back. This
  // can't reverse, so once it clears it stays cleared. Fades out over the first
  // ~half of the orbit.
  const capProgress = useMotionValue(0)
  useEffect(() => {
    const sec = sectionRef.current
    if (!sec) return
    let raf: number | null = null
    const update = () => {
      raf = null
      const rect = sec.getBoundingClientRect()
      const dist = rect.height - window.innerHeight
      const p = dist > 0 ? Math.min(1, Math.max(0, -rect.top / dist)) : 0
      capProgress.set(p)
    }
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf != null) cancelAnimationFrame(raf)
    }
  }, [capProgress])
  const captionOpacity = useTransform(capProgress, [0, 0.3, 0.5], [1, 1, 0])
  const captionY = useTransform(capProgress, [0.3, 0.5], [0, -30])
  const Caption = caption ? (
    <motion.div
      className="sis__caption"
      style={prefersReduced ? undefined : { opacity: captionOpacity, y: captionY }}
    >
      <h2 className="sis__caption-title">{caption}</h2>
      {captionNote && <p className="sis__caption-note">{captionNote}</p>}
    </motion.div>
  ) : null

  // --- Preload every frame into an Image before we start ---
  useEffect(() => {
    let cancelled = false
    let loadedCount = 0
    const images: HTMLImageElement[] = []

    const onOne = () => {
      if (cancelled) return
      loadedCount += 1
      setProgress(loadedCount / frameCount)
      if (loadedCount === frameCount) setLoaded(true)
    }

    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.src = frameSrc(i + 1)
      images[i] = img
      // Decode ahead of time so the first scrub doesn't hitch on lazy,
      // draw-time decoding. Fall back to load events if decode() rejects
      // (and count errors too, so one missing frame can't hang the loader).
      if (typeof img.decode === 'function') {
        img.decode().then(onOne, () => {
          if (img.complete && img.naturalWidth) onOne()
          else { img.onload = onOne; img.onerror = onOne }
        })
      } else {
        img.onload = onOne
        img.onerror = onOne
      }
    }
    imagesRef.current = images

    return () => {
      cancelled = true
      for (const img of images) {
        img.onload = null
        img.onerror = null
        img.src = '' // release decode / let GC reclaim
      }
      imagesRef.current = []
    }
  }, [frameCount, frameSrc])

  // --- Canvas draw (cover fit), in CSS pixels; context is DPR-scaled ---
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const clamped = Math.max(0, Math.min(frameCount - 1, Math.round(index)))
    const img = imagesRef.current[clamped]
    if (!img || !img.complete || img.naturalWidth === 0) return

    const cw = canvas.clientWidth
    const ch = canvas.clientHeight
    // "contain" fit (+8% padding) so the whole subject is always visible,
    // letterboxed/centered, rather than cropped to fill (which cut the base off).
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight) * 0.92
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, dw, dh)
    drawnFrame.current = clamped
  }

  // Size the backing store to the display size × devicePixelRatio (capped at 2
  // to bound memory/fill cost), then redraw the current frame.
  const sizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const cw = canvas.clientWidth
    const ch = canvas.clientHeight
    const bw = Math.round(cw * dpr)
    const bh = Math.round(ch * dpr)
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw
      canvas.height = bh
    }
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawFrame(drawnFrame.current >= 0 ? drawnFrame.current : posterFrame - 1)
  }

  // Observe size changes (resize, DPR shifts) and keep the canvas crisp.
  useEffect(() => {
    if (!loaded) return
    const canvas = canvasRef.current
    if (!canvas) return
    sizeCanvas()
    const ro = new ResizeObserver(() => sizeCanvas())
    ro.observe(canvas)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  // Drive the canvas from the frameIndex MotionValue, coalescing rapid scroll
  // events into a single draw per animation frame (no React re-render).
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (!loaded || prefersReduced) return
    pendingFrame.current = latest
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        drawFrame(pendingFrame.current)
      })
    }
  })

  // Initial / reduced-motion draw once loaded.
  useEffect(() => {
    if (!loaded) return
    if (prefersReduced) {
      drawFrame(posterFrame - 1)
    } else {
      drawFrame(frameIndex.get())
    }
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, prefersReduced])

  // --- Reduced motion: a single static frame, normal-height block. ---
  if (prefersReduced) {
    return (
      <section className="sis sis--static" aria-label={label}>
        <div className="sis__sticky">
          <canvas ref={canvasRef} className="sis__canvas" role="img" aria-label={label} />
          {Caption}
          {!loaded && <Loader progress={progress} />}
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="sis"
      style={{ height: `${heightVh}vh` }}
      aria-label={label}
    >
      <div className="sis__sticky">
        <canvas ref={canvasRef} className="sis__canvas" role="img" aria-label={label} />
        {Caption}
        {!loaded && <Loader progress={progress} />}
      </div>
    </section>
  )
}

function Loader({ progress }: { progress: number }) {
  return (
    <div className="sis__loader" role="status" aria-live="polite">
      <div className="sis__spinner" aria-hidden="true" />
      <p>Loading sequence… {Math.round(progress * 100)}%</p>
    </div>
  )
}
