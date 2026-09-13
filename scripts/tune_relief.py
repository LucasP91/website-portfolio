"""Global relief controls: the Z-wobble mix and the Bump depth.

WHY THE BASE LOOKED LIKE A ZEBRA
The 8 mm Z-wobble is a pure periodic ridge, and it was mixed in at 0.42 with Bump Distance
0.0026 m. On a small part that reads as subtle banding; on the BASE -- a large, smoothly
curved, brightly-lit body -- the same signal becomes a regular stripe pattern with nothing
to break it up. Two things make it worse there specifically:

  * curvature sweeps the surface normal through the light, so every ridge crest catches a
    highlight and every trough goes dark -- maximum contrast per unit of relief
  * the base is one of the few parts big enough to show many periods at once, which is what
    turns "banding" into "stripes"

The sparse defect lines were not the cause; softening those changed almost nothing. The fix
is the wobble mix and the global bump depth.

Usage:  blender -b Untitled.blend -P scripts/tune_relief.py -- [--wobble 0.12] [--bump 0.0018]
                                                              [--strength 0.9]
SAVES the .blend.
"""
import bpy, sys

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return float(argv[argv.index(name) + 1]) if name in argv else default


WOBBLE = opt('--wobble', 0.12)
BUMP = opt('--bump', 0.0018)
STRENGTH = opt('--strength', 0.90)

m = bpy.data.materials['MattePLA_Black']
N = m.node_tree.nodes

add = next((n for n in N if n.name == 'ZWobble_Add'), None)
if add:
    before = add.inputs['Factor'].default_value
    add.inputs['Factor'].default_value = WOBBLE
    print(f"  Z-wobble mix   {before:.2f} -> {WOBBLE:.2f}")

bump = next(n for n in N if n.type == 'BUMP')
b0, s0 = bump.inputs['Distance'].default_value, bump.inputs['Strength'].default_value
bump.inputs['Distance'].default_value = BUMP
bump.inputs['Strength'].default_value = STRENGTH
print(f"  bump distance  {b0:.4f} -> {BUMP:.4f} m   strength {s0:.2f} -> {STRENGTH:.2f}")
print(f"  effective peak relief ~{BUMP * STRENGTH * 1000:.2f} mm "
      f"(fuzzy skin is ~0.3 mm on a real print)")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - relief retuned")

# Fuzzy skin is the finest feature in the material, so it is the first thing to alias when
# the delivery resolution drops. At 900 px it is 1.6 px and shimmers; coarsening it buys
# headroom without changing the character.
FUZZ = opt('--fuzz-mm', 0.0)
if FUZZ > 0:
    fz = next((n for n in N if n.name == 'FuzzySkin'), None)
    if fz:
        b = fz.inputs['Scale'].default_value
        fz.inputs['Scale'].default_value = 1000.0 / FUZZ
        print(f"  fuzzy skin {1000/b:.2f} mm -> {FUZZ:.2f} mm")
        bpy.ops.wm.save_mainfile()
