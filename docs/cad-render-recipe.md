# CAD → Web Render Recipe (Blender via MCP)

Reusable settings for turning an OnShape (or any CAD) assembly into a clean,
scroll-driven hero animation for the web. This is exactly what produced the
SCARA-arm turntable on this site. Blender **5.1**, EEVEE Next, driven through
the `blender` MCP (`execute_blender_code`).

## 1. Export from CAD
- Export the **assembly** (assembled state, not a Part Studio, not exploded) as
  **glTF** (self-contained / embedded buffers, or GLB). Preserves part positions,
  per-part names, colors, and the sub-assembly hierarchy.
- Color **all printed parts one exact color** in CAD (e.g. dark grey `0.216`),
  leave hardware/motors their own colors → lets you classify by color.
- Real-world scale: OnShape glTF imports in **meters**.

## 2. Import + orient (Blender)
- `bpy.ops.import_scene.gltf(filepath=...)`.
- Parent every top-level imported object to one **Empty** ("AssemblyRoot") with
  `matrix_parent_inverse = empty.matrix_world.inverted()` → rigid control.
- glTF often imports lying down (up-axis on Y). Stand it up by rotating the empty
  ±90° about X. **Determine up/down deterministically**: find the base part (by
  color/largest footprint) and rotate so its Z-center is the lowest.
- Center XY at origin, drop the lowest point to z=0 (sits "on the ground").
- ⚠ Read-after-write: call `bpy.context.view_layer.update()` before reading
  child `matrix_world`/`bound_box`, or you get stale transforms.

## 3. Material classification (per part)
Classify by **name**, then **color**, then **geometry** (most robust combo):
- name `stepper motor*` → motor; `lead screw*` → lead-screw steel;
  `*cap screw*`/`hex socket*` → fastener steel; `limit switch*` → dark.
- else: **printed color** (the one shared by most non-hardware parts) → matte PLA.
- else / rod-shaped (sorted dims: middle `< 0.013 m` and longest `> 5×` that) → steel.
- Watch out: the same CAD name can cover **different geometries** (e.g. "Part 1"
  was both arm links *and* rods) — don't trust name alone for those.

### Matte black PLA material (the printed look)
- Principled BSDF: Base Color ≈ `(0.01, 0.01, 0.011)`, **Roughness 0.70**,
  Specular IOR Level ≈ 0.45, Metallic 0.
- **Surface texture (object-locked so it does NOT swim on rotation):**
  - `Texture Coordinate → Object` into a **Noise Texture** (Scale ~600, Detail 5)
    → **Bump** (Strength ~0.24, Distance ~0.0006).
  - Faint **brushed/print-line** echo: `Texture Coordinate → Object` → **Wave**
    (Bands, dir Z, profile SIN, Scale ~230, Distortion 0.6) → **Bump**
    (Strength ~0.11). Chain: NoiseBump.Normal → BrushBump.Normal → BSDF.Normal.
  - ❌ Do NOT drive textures from `New Geometry → Position` (world space) — the
    turntable rotates the part through a fixed field → texture swims.
  - ❌ Avoid noise→roughness "banding" — it reads as a painted-on blotchy texture.
- True displacement isn't worth it for flat CAD faces / web scale (needs dense
  subdivision, invisible at ~600px). Object-locked bump is the right tool.
- Metals: Metallic 1.0; bright rods Roughness ~0.22, lead screw darker ~0.20/0.38.

## 4. Lighting (moody, matches a dark site)
- **Single key** Area light (Energy ~85, size ≈ 0.5×subject) upper-front-side.
- **One subtle back rim** (Energy ~45, small) for edge separation on dark bg.
- Low world ambient (`(0.03,0.03,0.035)`), no fill/top.
- ⚠ Scale-sensitive: a ~0.5 m subject blows out with 300 W lights — use tens of W.

## 5. View transform + output
- **`scene.view_settings.view_transform = "Khronos PBR Neutral"`** (or Standard).
  The default **AgX lifts blacks to grey** — this is the #1 reason matte black
  looks washed out.
- EEVEE Next: `scene.eevee.taa_render_samples = 36–64`, `use_raytracing = True`.
- For web overlay: `render.film_transparent = True`, `image_settings.color_mode='RGBA'`,
  PNG. Hide the ground.

## 6. Turntable + rising camera
- Parent AssemblyRoot to a **"Turntable" Empty** at the base center; keyframe its
  Z rotation `0 → 360°` over frames `1 → N+1` (render `1..N` for a seamless loop).
- **Constant speed:** set keyframe interpolation to `LINEAR`. In Blender 5.x
  Actions are *slotted* — `action.fcurves` may be empty; walk
  `action.layers[].strips[].channelbags[].fcurves`.
- **Rising camera:** Camera + `Track To` constraint targeting a center Empty;
  keyframe only the camera's **Z** from low (below center, looking up) to high
  (above, looking down). Object spins + camera cranes = spiral reveal.
- Render in **batches** (e.g. 20–24 frames per `render(animation=True)` call) —
  frames write incrementally, so a long single call won't time out the MCP.

## 7. Encode / web frames
- This Blender build has **no FFMPEG** output (image formats only). Render a **PNG
  sequence**, then encode with a static ffmpeg: `npm i ffmpeg-static` →
  `ffmpeg -framerate 30 -i frame_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 out.mp4`.
- **For the website scroll sequence** (not video): keep transparent PNGs, **resize
  to ~600px wide** with `sharp` (full-res 1080×1350 ×120 ≈ 700 MB decoded in-browser
  — too heavy). 120 frames @ 600px ≈ ~10 MB. Component preloads + decodes all frames.
- Canvas fit: use **"contain" (+ small padding)**, NOT "cover" — cover crops a tall
  subject in a wide viewport (cuts the base off).

## Frame-count / smoothness
- 60 frames = ok; **120 @ 30 fps = smooth + slow** (90°/s). More frames = slower
  & smoother. Object spins one full 360° over the frame range.
