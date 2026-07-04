// Resizes the Blender turntable PNGs into web-friendly transparent frames
// for the ScrollImageSequence component. Run: node scripts/import-robot-frames.mjs
import sharp from 'sharp'
import { readdir, mkdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const SRC = 'C:/Users/Lucas/renders/turntable_web'
const DST = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'frames')
const WIDTH = 800

await mkdir(DST, { recursive: true })
const files = (await readdir(SRC)).filter(f => /^frame_\d+\.png$/.test(f)).sort()
let total = 0
for (let i = 0; i < files.length; i++) {
  const n = String(i + 1).padStart(4, '0')
  const out = join(DST, `frame-${n}.png`)
  await sharp(join(SRC, files[i])).resize({ width: WIDTH }).png({ compressionLevel: 9, palette: false }).toFile(out)
  total += (await readFile(out)).length
}
console.log(`resized ${files.length} frames -> ${DST} @ ${WIDTH}px wide; total ${(total/1048576).toFixed(1)} MB`)
