// Build a watchable animated WebP + a contact sheet from the rendered preview frames.
import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

const DIR = 'preview'
const files = (await readdir(DIR)).filter(f => /^f_\d+\.png$/.test(f)).sort()
if (!files.length) { console.error('no frames'); process.exit(1) }
const meta = await sharp(join(DIR, files[0])).metadata()
const W = meta.width, H = meta.height
console.log(`${files.length} frames @ ${W}x${H}`)

// ---- animated WebP (24 fps) ----
const raw = []
for (const f of files) raw.push(await sharp(join(DIR, f)).removeAlpha().raw().toBuffer())
const stacked = Buffer.concat(raw)
try {
  await sharp(stacked, {
    raw: { width: W, height: H * files.length, channels: 3 },
    pages: files.length,
    pageHeight: H,
  }).webp({ quality: 72, effort: 4, loop: 0, delay: Math.round(1000 / 24) })
    .toFile(join(DIR, 'scara_motion.webp'))
  console.log('wrote preview/scara_motion.webp  (animated, 24 fps, loops)')
} catch (e) {
  console.error('animated webp failed:', e.message)
}

// ---- contact sheet across the beats ----
const BEATS = [
  [1, 'f1 Absence'], [24, 'f24 Ignition'], [50, 'f50 Refusal'], [58, 'f58 at the seam'],
  [72, 'f72 Reach'], [92, 'f92 dead stop'], [110, 'f110 Flip'], [132, 'f132 mid-flip'],
  [155, 'f155 flip ends'], [180, 'f180 Descent'], [240, 'f240 descending'], [262, 'f262 payoff'],
]
const cw = 300, ch = Math.round(H * cw / W)
const cols = 4, rows = Math.ceil(BEATS.length / cols)
const tiles = []
for (let i = 0; i < BEATS.length; i++) {
  const [fr, label] = BEATS[i]
  const name = `f_${String(fr).padStart(4, '0')}.png`
  if (!files.includes(name)) continue
  const img = await sharp(join(DIR, name)).resize({ width: cw }).toBuffer()
  const svg = Buffer.from(
    `<svg width="${cw}" height="22"><rect width="${cw}" height="22" fill="#000" opacity="0.62"/>` +
    `<text x="8" y="15" font-family="sans-serif" font-size="13" fill="#cfe">${label}</text></svg>`)
  const tile = await sharp(img).composite([{ input: svg, top: ch - 22, left: 0 }]).toBuffer()
  tiles.push({ input: tile, left: (i % cols) * cw, top: Math.floor(i / cols) * ch })
}
await sharp({ create: { width: cols * cw, height: rows * ch, channels: 3, background: '#0e1117' } })
  .composite(tiles).png().toFile(join(DIR, 'contact_sheet.png'))
console.log(`wrote preview/contact_sheet.png  (${cols * cw}x${rows * ch})`)
