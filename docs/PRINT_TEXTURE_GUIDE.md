# SCARA hero film — print texture, as built

**General method lives in the reference repo:**
`~/Documents/cinematic-reference/blender/fdm-prints-stylised.md` — the reasoning, the traps,
and the arithmetic. **This file is the project record**: what was run, in what order, and
which knob to turn.

Material: **`MattePLA_Black`** in `Untitled.blend`, applied to all 19 printed parts.
All values dumped from the file on 2026-07-31.

---

## The rule that governs everything

At **1800 × 1500** across a ~400 mm machine, **1 px = 0.222 mm**. A repeating feature needs
**≥ ~2 px** or it aliases into shimmer rather than becoming subtle.

```
real layer pitch   0.28 mm   1.3 px   ✗ deliberately NOT used as geometry
fuzzy skin         0.69 mm   3.1 px   ✓
band group         1.60 mm   7.2 px   ✓   ← NOT layer height. Do not "correct" it to 0.28.
PEI flakes         1.61 mm   7.2 px   ✓
part gap           0.30 mm   1.4 px   ✓   as shadow, not shape
Z-wobble           8.00 mm  36   px   ✓
```

---

## Run order

Each script is idempotent and saves the .blend. Run against `Untitled.blend` itself —
`save_mainfile()` writes to whatever file was opened, so running against a backup silently
edits the backup.

```
scripts/fix_material_space.py     world → object space (superseded by the next, kept for history)
scripts/fix_texture_axis2.py      LEVEL PLANES: world Z − ObjectInfo.Location.Z
scripts/add_z_banding.py          8 mm T8 Z-wobble
scripts/add_fuzzy_skin.py         fuzzy skin; makes all noises metric
scripts/tune_fuzzy_skin.py        fuzz-led balance, warped spacing, 2-octave depth variance
scripts/vary_lines.py             per-part phase, warped wobble, 3rd variance octave
scripts/add_sparse_lines.py       level-crossing defect lines
scripts/refine_sparse_lines.py    partial length, both polarities, albedo follows sign
scripts/vary_line_sharpness.py    sharpness as a property of place
scripts/lengthen_lines.py         anisotropic break noise → longer arcs
scripts/pei_plate_texture.py      Voronoi crystalline plate grain
scripts/pei_flat_only.py          restrict to True-Normal flat faces
scripts/add_part_gaps.py          tolerance gaps + fillets (rebuilds the modifier stack)
scripts/set_light_rig.py          absolute light energies
scripts/set_key_neutral.py        warm ⇄ neutral key
scripts/render_frames.py          the render (sets sensor_fit VERTICAL)
```

### Current invocations

```
blender -b Untitled.blend -P scripts/vary_line_sharpness.py -- \
    --scale 235 --patch 22 --soft 60 --sharp 330 --minstr 0.60
blender -b Untitled.blend -P scripts/lengthen_lines.py   -- --stretch 0.5
blender -b Untitled.blend -P scripts/pei_plate_texture.py -- --cell 620 --gain 1.9 --edge 0.45
blender -b Untitled.blend -P scripts/pei_flat_only.py    -- --lo 0.94 --hi 0.99
blender -b Untitled.blend -P scripts/add_part_gaps.py    -- --gap 0.00015 --fillet 0.00055
blender -b Untitled.blend -P scripts/render_frames.py    -- --res 1800x1500 --samples 1024
```

---

## Knobs, most useful first

| want | node / flag | now |
|---|---|---|
| fuzz vs lines | `WallSurface` Factor | **0.64** (0.8 = near-pure fuzz) |
| overall relief depth | `Bump` Distance | **0.0026** |
| line density | `--scale` (vary_line_sharpness) | **235** → 4.3 mm |
| line thinness | `--sharp` | **330** |
| how soft the soft regions are | `--minstr` | **0.60** — *this*, not the window |
| how long each line runs | `--stretch` (lengthen_lines) | **0.5** → 53 mm arcs |
| plate grain depth | `--gain` (pei_plate_texture) | **1.9** |
| plate flake size | `--cell` | **620** → 1.6 mm |
| which faces are "flat" | `--lo/--hi` (pei_flat_only) | **0.94 / 0.99** → 8°/20° |
| seam visibility | `--gap` / `--fillet` | **0.00015 / 0.00055** |
| band strength | `Map Range.003` To Min/Max | **0.47 / 0.53** |

Full node-by-node table is in the reference doc.

---

## Five things that will bite you again

1. **`sensor_fit` must be `VERTICAL`** before changing resolution, or widening a portrait
   frame past square flips the fitted axis and silently re-frames the shot.
2. **`light.use_temperature` is separate from `light.color`.** Reading `.color` reports white
   on a 3000 K light. Cost four audits.
3. **Noise `Vector` must stay linked to `Texture Coordinate ▸ Object`.** Unlinked it uses
   Generated coords, normalised per bounding box, so every mm figure here becomes wrong and
   differs per part.
4. **The plate mask must read `Geometry ▸ True Normal`**, not `Normal` — the bevel's
   `harden_normals` contaminates the shading normal for the fillet's width around every face.
5. **Measure the signal before judging a beauty render.** Route the node under test into an
   Emission shader, lights off, `Standard` transform, and take the mean over subject pixels.
   Two line generators looked correct in the graph and produced literally nothing.

---

## Known divergence from measured physics

`~/Documents/cinematic-reference/blender/fdm-prints.md` derives roughness from measured Ra and
puts **all** layer structure in the BRDF, because a real layer line is ~0.074 px deep at this
framing. It is right — and a physically-correct print renders here as smooth plastic with a
roughness ramp.

This build deliberately exaggerates relief by roughly 1–2 orders of magnitude. Fuzzy skin runs
~9× physical, the fillet ~2.8×. **Only the 0.15 mm part gap is at a physical value.** That is
an art-direction decision for hero framing, recorded so the two documents do not silently
contradict each other.

The roughness ramp itself (0.72 walls → 0.55 tops) *does* match the values `fdm-prints.md`
derives from Ra — 0.719 and 0.509 — which was luck rather than design, but it holds.
