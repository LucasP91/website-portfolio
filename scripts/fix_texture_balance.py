"""Rebalance which texture dominates. The pebble should lead; the layer wave should not alias.

WHAT THE REFERENCE ACTUALLY SHOWS, RE-READ
The black arm bar in the site render is covered in COARSE PEBBLE, not lines. That is
correct for the part: a SCARA link is printed flat, so its two large faces sit against the
build plate and carry the plate's texture. Only the narrow side walls get layer lines.
I had that inverted in emphasis -- faint pebble on tops, aggressive lines on walls.

AND THE LINES WERE ALIASING, NOT READING
The 0.28 mm layer wave is ~1 px at 1800 px across a 400 mm machine. A repeating feature at
1 px does not render as a feature, it renders as moire -- which is exactly the fine brushed
shimmer on the arm. This is the locked BRDF rule: sub-2 px periodics must not live in bump.

So the layer wave's AMPLITUDE is cut right down. It stays in the graph (honest, and it
resolves in any close-up) but it stops driving visible relief at film resolution. Wall
striping is carried by the 8 mm Z-wobble banding, which is ~36 px here and resolves cleanly.

Meanwhile the plate pebble gets real depth, because on this machine it is the texture you
actually see.

SAVES the .blend.
"""
import bpy

m = bpy.data.materials['MattePLA_Black']
N = m.node_tree.nodes

# ---- layer wave amplitude down: stop the sub-pixel moire ---------------------------
lw = next(n for n in N if n.name == 'Map Range.003')     # normalises sin() to 0..1
before = (lw.inputs['To Min'].default_value, lw.inputs['To Max'].default_value)
lw.inputs['To Min'].default_value = 0.46
lw.inputs['To Max'].default_value = 0.54                 # amplitude 1.0 -> 0.08
print(f"  layer wave amplitude {before[1]-before[0]:.2f} -> 0.08  "
      f"(0.28 mm = ~1 px here; it was aliasing, not resolving)")

# ---- plate pebble gets the depth, since it is what reads --------------------------
noise = next(n for n in N if n.type == 'TEX_NOISE')
noise.inputs['Scale'].default_value = 540.0              # ~1.85 mm, matches the reference
noise.inputs['Detail'].default_value = 8.0
noise.inputs['Roughness'].default_value = 0.78
print("  pebble scale 540 (~1.85 mm), detail 8.0, roughness 0.78")

bump = next(n for n in N if n.type == 'BUMP')
bump.inputs['Distance'].default_value = 0.0030
bump.inputs['Strength'].default_value = 1.0
print("  bump distance 0.0030 m, strength 1.0")

# ---- Z-wobble now carries the WALLS on its own -----------------------------------
add = next((n for n in N if n.name == 'ZWobble_Add'), None)
if add:
    add.inputs['Factor'].default_value = 0.42
    print("  Z-wobble mix 0.55 -> 0.42 (it is the wall striping now, not a garnish)")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - pebble leads, layer wave no longer aliases")
