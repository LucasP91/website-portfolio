// Turns the rendered master in preview/master into the web frame set in public/frames.
//
// The master is 288 frames at 1800x865. Three reductions make it shippable, and this
// script prints the arithmetic for each rather than hiding it.
//
//   CROP       to the region the arm ever occupies. The master is mastered wide so nothing
//              clips in the render, but measured across all 288 frames the arm never leaves
//              a ~740x797 box near the centre: ~59% of every frame's width is transparent
//              margin that holds nothing, ever. Shipping that margin cost the phone layout
//              dearly -- a 2.08:1 frame on a portrait screen can only be scaled to the
//              width, so the arm drew at about a fifth of the screen. The crop box is
//              MEASURED from the master's alpha here, not hard-coded, so a re-render with a
//              different camera path still crops correctly. It is one box for the whole film,
//              never per frame: a per-frame crop would make the arm jump around as it moves.
//
//   SUBSAMPLE  picks COUNT frames evenly across the master. Scrubbing is driven by scroll
//              position, not by a clock, so the delivered set only has to be dense enough
//              that a scroll step does not visibly jump. The full master stays on disk.
//
//   WEBP       not PNG. The frames need alpha, and WebP carries it at a fraction of PNG's
//              bytes on this material. Decoded memory is identical either way.
//
// The binding constraint is DECODED memory, not download size -- the page holds every
// frame it loads as a bitmap: width x height x 4 bytes each. Phones load every other frame.
//
// Run: node scripts/import-robot-frames.mjs
import sharp from 'sharp'
import { readdir, mkdir, readFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const SRC = join(HERE, '..', 'preview', 'master')
const DST = join(HERE, '..', 'public', 'frames')

const COUNT = 120       // delivered frames; must match frameCount in Home.tsx
const QUALITY = 82      // WebP quality
const PAD = 20          // master px kept around the measured subject box
const ALPHA_MIN = 8     // alpha above this counts as subject; below is denoiser haze

const src = (await readdir(SRC)).filter(f => /^f_\d+\.png$/.test(f)).sort()
if (!src.length) {
  console.error(`no master frames in ${SRC} - render them first:\n` +
    `  blender -b Untitled.blend -P scripts/render_frames.py -- --res 1800x865 ` +
    `--samples 256 --out preview/master`)
  process.exit(1)
}

// ---- pass 1: the union of the subject's bounds over EVERY master frame ----------------
// Every frame, not just the delivered subset, so a frame that is skipped today can never
// turn out to hold the widest pose after COUNT changes.
let W = 0, H = 0
const box = { l: Infinity, t: Infinity, r: -1, b: -1 }
for (const f of src) {
  const { data, info } = await sharp(join(SRC, f)).extractChannel(3).raw()
    .toBuffer({ resolveWithObject: true })
  W = info.width; H = info.height
  for (let y = 0; y < H; y++) {
    const row = y * W
    for (let x = 0; x < W; x++) {
      if (data[row + x] > ALPHA_MIN) {
        if (x < box.l) box.l = x
        if (x > box.r) box.r = x
        if (y < box.t) box.t = y
        if (y > box.b) box.b = y
      }
    }
  }
}
if (box.r < 0) {
  console.error('every master frame is fully transparent - nothing to crop to')
  process.exit(1)
}
const left = Math.max(0, box.l - PAD)
const top = Math.max(0, box.t - PAD)
const crop = {
  left,
  top,
  width: Math.min(W, box.r + PAD + 1) - left,
  height: Math.min(H, box.b + PAD + 1) - top,
}

// ---- pass 2: crop, subsample, encode ---------------------------------------------------
// Evenly spaced across the master, first and last always included.
const pick = Array.from({ length: COUNT }, (_, i) =>
  src[Math.round(i * (src.length - 1) / (COUNT - 1))])

await mkdir(DST, { recursive: true })
// Leftovers from an older set (other format, other count) would ship verbatim via public/.
for (const f of await readdir(DST)) {
  if (/^frame-\d+\.(png|webp|jpg)$/.test(f)) await rm(join(DST, f))
}

let total = 0
for (let i = 0; i < pick.length; i++) {
  const out = join(DST, `frame-${String(i + 1).padStart(4, '0')}.webp`)
  await sharp(join(SRC, pick[i]))
    .extract(crop)
    .webp({ quality: QUALITY, alphaQuality: 100, effort: 5 })
    .toFile(out)
  total += (await readFile(out)).length
}

const perFrame = crop.width * crop.height * 4
const mb = n => (n / 1e6).toFixed(0)
const keptPct = ((crop.width * crop.height) / (W * H) * 100).toFixed(0)
console.log(
  `${pick.length} of ${src.length} master frames -> ${DST}\n` +
  `  subject box  x ${box.l}-${box.r}  y ${box.t}-${box.b}  (master ${W}x${H})\n` +
  `  crop         ${crop.width}x${crop.height} at ${crop.left},${crop.top}  ` +
  `(${PAD}px pad, keeps ${keptPct}% of the master's pixels)\n` +
  `  wire         ${(total / 1e6).toFixed(2)} MB total, ${(total / COUNT / 1e3).toFixed(0)} KB/frame, webp q${QUALITY}\n` +
  `  decoded      desktop ${mb(perFrame * COUNT)} MB (all ${COUNT}), ` +
  `phone ${mb(perFrame * Math.ceil(COUNT / 2))} MB (every other frame)\n` +
  `  set frameCount={${COUNT}} to match.`)
