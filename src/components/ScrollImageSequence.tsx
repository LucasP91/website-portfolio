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
 * LOADING IS PROGRESSIVE, NOT ALL-OR-NOTHING.
 * This used to fetch and decode every frame before drawing any of them, so the canvas sat
 * blank behind a spinner until the last frame landed -- measured at 24.6 s on a phone over
 * Fast 4G, with the first frame's bytes already in hand far earlier. Now:
 *
 *   1. The frame for the current scroll position loads first and draws the moment it
 *      decodes, so there is a picture almost immediately.
 *   2. The rest arrive coarse-to-fine -- every 16th frame, then every 8th, 4th, 2nd, 1st --
 *      through a small request pool that keeps that order honest.
 *   3. Drawing always uses the NEAREST decoded frame, so scrubbing works from the first
 *      second and only gets smoother as frames fill in. Nothing ever waits.
 *
 * MEMORY. Every decoded frame is width x height x 4 bytes, held for the life of the page.
 * Phones and low-memory devices load every 2nd frame (every 4th under Save-Data), which
 * halves the resident bitmap -- the scrub is scroll-driven, so the gap is not visible as a
 * frame-rate drop the way it would be in a clock-driven video. Reduced motion loads only
 * the poster. The canvas backing store is DPR-capped at 2.
 */
export interface ScrollImageSequenceProps {
  /** Number of frames in the sequence. */
  frameCount?: number
  /** Maps a 1-based frame number to its URL. Override to change path/format. */
  frameSrc?: (frame: number) => string
  /** Scroll distance of the section, in viewport heights. Taller = slower scrub. */
  heightVh?: number
  /** Frame shown for the reduced-motion fallback (1-based). */
  posterFrame?: number
  /** Accessible description of what the sequence depicts. */
  label?: string
  /** Optional caption shown over the pinned canvas (title). */
  caption?: string
  /** Optional smaller note under the caption title. */
  captionNote?: string
  /**
   * 'contain' (default) always shows the whole frame. 'cover' fills the screen and crops,
   * which is only safe for a source mastered with spare transparent margin. Chosen
   * explicitly, never inferred from the frame's shape: a tightly cropped frame can be
   * wider than tall and still have no margin to spend.
   */
  fit?: 'contain' | 'cover'
}

// WebP, not PNG. The frames carry alpha, which is why they were PNG, but WebP carries it
// too at roughly a third of the bytes on this material. Decoded residency is unchanged --
// that is set by width x height x 4 x frameCount whatever the wire format is.
const defaultFrameSrc = (frame: number) =>
  `${import.meta.env.BASE_URL}frames/frame-${String(frame).padStart(4, '0')}.webp`

// Parallel requests. Enough to saturate a mobile link, few enough that the coarse-to-fine
// ORDER survives -- fire all 120 at once and they finish in whatever order the network
// likes, which throws away the point of ordering them.
const POOL = 6

/** Frames to skip on this device: 1 = load all, 2 = every other, 4 = every fourth. */
function deviceStride(): number {
  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean }
  }
  if (nav.connection?.saveData) return 4
  const small = window.matchMedia('(max-width: 48rem), (pointer: coarse)').matches
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4
  return small || lowMemory ? 2 : 1
}

/** First the frame on screen, then every 16th, 8th, 4th ... down to the stride. */
function loadOrder(count: number, first: number, stride: number): number[] {
  const seen = new Uint8Array(count)
  const order: number[] = []
  const add = (i: number) => {
    if (i >= 0 && i < count && !seen[i]) {
      seen[i] = 1
      order.push(i)
    }
  }
  add(first)
  add(0)
  add(count - 1)
  for (let step = 16; step >= stride; step /= 2) {
    for (let i = 0; i < count; i += step) add(i)
  }
  return order
}

// With fit='cover': how much of a wide source's width we are willing to crop away before we
// stop filling the height and letterbox instead. The shipped SCARA frames use 'contain' --
// they are cropped at import to the box the arm ever occupies, so there is no margin left
// for cover to spend on any screen.
const MAX_SIDE_CROP = 0.3

// Reveal: fully in once the visitor has scrolled this fraction of the way to the pin, and
// rising from this far below (as a fraction of the viewport height) while it arrives.
const REVEAL_AT = 0.7
const RISE_VH = 0.12

export default function ScrollImageSequence({
  frameCount = 120,
  frameSrc = defaultFrameSrc,
  heightVh = 300,
  posterFrame = 1,
  label = 'Product animation sequence',
  caption,
  captionNote,
  fit = 'contain',
}: ScrollImageSequenceProps) {
  // useReducedMotion() starts null and settles to a boolean; collapsing null into false
  // keeps the loader effect from restarting (and dropping in-flight requests) on that tick.
  const reduced = !!useReducedMotion()

  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const readyRef = useRef<Uint8Array>(new Uint8Array(frameCount))
  const rafRef = useRef<number | null>(null)
  const wantedFrame = useRef(0)
  const drawnFrame = useRef(-1)

  const [hasFrame, setHasFrame] = useState(false)
  const [progress, setProgress] = useState(0)

  // scrollYProgress: 0 when the section's top hits the viewport top,
  // 1 when its bottom hits the viewport bottom.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Map progress (0-1) to a 0-based frame index.
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1])

  // Caption fade is driven by a manually-computed, guaranteed-monotonic section progress
  // (the section's own scroll offset), not the pinned scrollYProgress -- which measured
  // non-monotonic at depth and let the caption creep back. Once it clears it stays cleared.
  const capProgress = useMotionValue(0)
  // REVEAL. The sequence sits right under the hero, so on a tall screen its pinned canvas is
  // already in view below the intro text on first paint -- a frame of the arm peeking in
  // under "From Dreams To Reality". It now starts fully hidden and rises + fades in as the
  // visitor scrolls toward the pin, completing at 70% of that distance so the arm is fully
  // there before it starts to animate. Eased out, so it arrives softly rather than linearly.
  // If the section is already at (or past) the top -- a jump to a later section -- it is
  // simply shown.
  const reveal = useMotionValue(0)
  const rise = useMotionValue(0)
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
      const reach = (rect.top + window.scrollY) * REVEAL_AT
      const t = reach > 1 ? Math.min(1, Math.max(0, window.scrollY / reach)) : 1
      const eased = 1 - Math.pow(1 - t, 3)
      reveal.set(eased)
      rise.set((1 - eased) * RISE_VH * window.innerHeight)
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
  }, [capProgress, reveal, rise])
  const captionOpacity = useTransform(capProgress, [0, 0.6, 0.82], [1, 1, 0])
  const captionY = useTransform(capProgress, [0.6, 0.82], [0, -30])
  // The caption arrives with the arm and still leaves on its own schedule at the end.
  const captionShown = useTransform([reveal, captionOpacity], ([r, c]: number[]) => r * c)
  const captionLift = useTransform([rise, captionY], ([a, b]: number[]) => a + b)
  const Caption = caption ? (
    <motion.div
      className="sis__caption"
      style={reduced ? undefined : { opacity: captionShown, y: captionLift }}
    >
      <h2 className="sis__caption-title">{caption}</h2>
      {captionNote && <p className="sis__caption-note">{captionNote}</p>}
    </motion.div>
  ) : null

  /** Closest decoded frame to `index`, searching outward; -1 if none yet. */
  const nearestReady = (index: number) => {
    const ready = readyRef.current
    for (let d = 0; d < frameCount; d++) {
      if (index - d >= 0 && ready[index - d]) return index - d
      if (index + d < frameCount && ready[index + d]) return index + d
    }
    return -1
  }

  // --- Canvas draw, in CSS pixels; context is DPR-scaled ---
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const target = Math.max(0, Math.min(frameCount - 1, Math.round(index)))
    wantedFrame.current = target
    const i = nearestReady(target)
    const img = i >= 0 ? imagesRef.current[i] : null
    if (!img || img.naturalWidth === 0) return

    const cw = canvas.clientWidth
    const ch = canvas.clientHeight
    if (!cw || !ch) return
    // CONTAIN by default: the whole frame, with 8% padding. The fit used to be picked from
    // the frame's aspect -- cover for anything at least as wide as tall -- which broke the
    // moment a re-render widened the import crop to 878x837: cover then cut 22% off the
    // height on a 1706x1258 window. COVER is opt-in, for sources with transparent margin to
    // spend, and its horizontal crop is capped at MAX_SIDE_CROP.
    const srcAspect = img.naturalWidth / img.naturalHeight
    let scale: number
    if (fit === 'cover' && srcAspect >= 1) {
      const cover = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const cropCap = cw / (img.naturalWidth * (1 - MAX_SIDE_CROP))
      scale = Math.min(cover, cropCap)
    } else {
      scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight) * 0.92
    }
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
    drawnFrame.current = i
  }

  // One draw per animation frame, however many scroll events or frame arrivals ask for it.
  const requestDraw = () => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      drawFrame(wantedFrame.current)
    })
  }

  // --- Progressive loader ---
  useEffect(() => {
    let cancelled = false
    const ready = new Uint8Array(frameCount)
    const images: (HTMLImageElement | null)[] = new Array(frameCount).fill(null)
    readyRef.current = ready
    imagesRef.current = images
    drawnFrame.current = -1

    const posterIdx = Math.max(0, Math.min(frameCount - 1, posterFrame - 1))
    const startIdx = reduced ? posterIdx : Math.round(frameIndex.get())
    wantedFrame.current = startIdx
    const order = reduced ? [posterIdx] : loadOrder(frameCount, startIdx, deviceStride())

    let next = 0
    let inFlight = 0
    let finished = 0
    let progressRaf: number | null = null
    const reportProgress = () => {
      if (progressRaf != null) return
      progressRaf = requestAnimationFrame(() => {
        progressRaf = null
        if (!cancelled) setProgress(finished / order.length)
      })
    }

    const onDone = (i: number, ok: boolean) => {
      if (cancelled) return
      inFlight -= 1
      finished += 1
      if (ok) {
        ready[i] = 1
        setHasFrame(true)
        // Redraw only if this frame is a closer match than what is on screen now.
        const want = wantedFrame.current
        const drawn = drawnFrame.current
        if (drawn < 0 || Math.abs(i - want) < Math.abs(drawn - want)) requestDraw()
      }
      reportProgress()
      pump()
    }

    const start = (i: number, first: boolean) => {
      inFlight += 1
      const img = new Image()
      img.decoding = 'async'
      // The frame on screen jumps the queue; the fill-in frames yield to everything else
      // on the page.
      img.fetchPriority = first ? 'high' : 'low'
      // Handlers before src, so a cached image cannot fire before we are listening. Decode
      // inside onload so the draw that follows never pays for decoding on the main thread.
      img.onload = () => {
        const decoded = typeof img.decode === 'function' ? img.decode().catch(() => {}) : null
        if (decoded) decoded.then(() => onDone(i, img.naturalWidth > 0))
        else onDone(i, img.naturalWidth > 0)
      }
      img.onerror = () => onDone(i, false)
      img.src = frameSrc(i + 1)
      images[i] = img
    }

    function pump() {
      while (!cancelled && inFlight < POOL && next < order.length) {
        start(order[next], next === 0)
        next += 1
      }
    }
    pump()

    return () => {
      cancelled = true
      if (progressRaf != null) cancelAnimationFrame(progressRaf)
      for (const img of images) {
        if (!img) continue
        img.onload = null
        img.onerror = null
        img.src = '' // release the decode, let GC reclaim it
      }
      imagesRef.current = []
    }
    // frameIndex is a stable MotionValue; drawFrame/requestDraw only read refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount, frameSrc, posterFrame, reduced])

  // Size the backing store to display size × devicePixelRatio (capped at 2), then redraw.
  // Runs from mount, not from "loaded", so the very first frame to arrive draws correctly.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const bw = Math.round(canvas.clientWidth * dpr)
      const bh = Math.round(canvas.clientHeight * dpr)
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw
        canvas.height = bh
      }
      canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawFrame(wantedFrame.current)
    }
    sizeCanvas()
    const ro = new ResizeObserver(sizeCanvas)
    ro.observe(canvas)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Scroll drives the wanted frame; drawing coalesces to one per animation frame.
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (reduced) return
    wantedFrame.current = Math.round(latest)
    requestDraw()
  })

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    },
    [],
  )

  const done = progress >= 1
  const Progress = (
    <div
      className={`sis__progress${done ? ' is-done' : ''}`}
      role="progressbar"
      aria-label="Loading animation frames"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-hidden={done || undefined}
    >
      <div className="sis__progress-fill" style={{ transform: `scaleX(${progress})` }} />
    </div>
  )

  const canvas = (
    <canvas
      ref={canvasRef}
      className={`sis__canvas${hasFrame ? ' is-ready' : ''}`}
      role="img"
      aria-label={label}
    />
  )

  if (reduced) {
    return (
      <section className="sis sis--static" aria-label={label}>
        <div className="sis__sticky">
          {canvas}
          {Caption}
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
        <motion.div className="sis__stage" style={{ opacity: reveal, y: rise }}>
          {canvas}
          {Progress}
        </motion.div>
        {Caption}
      </div>
    </section>
  )
}
