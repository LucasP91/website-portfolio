// Generates placeholder frames for the scroll image sequence demo.
// Real product frames would replace these in public/frames/.
// Usage: node scripts/generate-frames.mjs
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const FRAME_COUNT = 150
const W = 1200
const H = 675
const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'frames')

await mkdir(outDir, { recursive: true })

const pad = (n) => String(n).padStart(4, '0')

for (let i = 1; i <= FRAME_COUNT; i++) {
  const t = (i - 1) / (FRAME_COUNT - 1) // 0..1
  const hue = Math.round(t * 320)
  const angle = t * Math.PI * 4 // two full rotations across the sequence
  const cx = W / 2, cy = H / 2
  const r = 180
  const dotX = cx + Math.cos(angle) * r
  const dotY = cy + Math.sin(angle) * r
  const sweep = Math.round(t * 360)

  const svg = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="hsl(${hue} 70% 22%)"/>
        <stop offset="100%" stop-color="hsl(${(hue + 60) % 360} 65% 42%)"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
    <path d="M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${cx + Math.cos(angle) * r} ${cy + Math.sin(angle) * r} Z"
          fill="rgba(255,255,255,0.10)"/>
    <circle cx="${dotX.toFixed(1)}" cy="${dotY.toFixed(1)}" r="28" fill="white"/>
    <text x="${cx}" y="${cy + 30}" font-family="Arial, sans-serif" font-size="160" font-weight="700"
          fill="rgba(255,255,255,0.92)" text-anchor="middle">${i}</text>
    <text x="${cx}" y="${H - 48}" font-family="Arial, sans-serif" font-size="34"
          fill="rgba(255,255,255,0.7)" text-anchor="middle">frame ${pad(i)} / ${pad(FRAME_COUNT)} — ${(t * 100).toFixed(0)}%</text>
  </svg>`

  await sharp(Buffer.from(svg)).jpeg({ quality: 78, mozjpeg: true }).toFile(join(outDir, `frame-${pad(i)}.jpg`))
}

console.log(`Generated ${FRAME_COUNT} frames (${W}x${H}) in ${outDir}`)
