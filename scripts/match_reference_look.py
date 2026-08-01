"""Match the look of the turntable render that is currently on the site.

WHAT THE REFERENCE ACTUALLY SHOWS (1:1 crop of frame_0030, 1280x1600 -- essentially our
resolution, so this is NOT a resolution problem):

  * a COARSE, HIGH-CONTRAST pebble on EVERY surface, walls included -- not a fine stipple
    masked to top faces, which is what this material does
  * parts bright enough to have tonal room for that pebble to live in

The second point is the one that matters, and it is why three passes of texture work
produced nothing visible. Bump does not emit light; it redistributes it. On a surface
sitting at luminance 11 out of 255, a 0.6 mm relief moves shading by two or three levels
and is crushed to nothing. The same material at luminance 90 shows the same relief plainly.

So the "bland texture" and the dark exposure are ONE defect, not two, and the texture
cannot be fixed without fixing the exposure. That is why this script does both.

Albedo is deliberately NOT touched -- (0.048, 0.050, 0.053) was measured, and brightening a
surface by lying about its reflectance is how you get a render that looks like plastic
pretending to be paper. The brightness comes from the lights, where it physically belongs.

Usage:  blender -b Untitled.blend -P scripts/match_reference_look.py -- [--gain 4.0]
SAVES the .blend.
"""
import bpy, sys

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
GAIN = float(argv[argv.index('--gain') + 1]) if '--gain' in argv else 4.0

# ---------------------------------------------------------------- texture ----
m = bpy.data.materials['MattePLA_Black']
nt = m.node_tree
N = nt.nodes

mix_h = next(n for n in N if n.name == 'Mix.001')
noise = next(n for n in N if n.type == 'TEX_NOISE')
bump = next(n for n in N if n.type == 'BUMP')

# The Factor was driven by the |Normal.Z| ramp, so the pebble only ever appeared on top
# faces while every wall got the 0.28 mm layer wave -- which is 0.8 px and unresolvable.
# The reference has pebble everywhere. Unlink and hold it mostly on the noise.
for l in list(mix_h.inputs['Factor'].links):
    nt.links.remove(l)
mix_h.inputs['Factor'].default_value = 0.72
print(f"  pebble now on ALL faces (Mix.001 factor unlinked from |Normal.Z| -> 0.72)")

noise.inputs['Scale'].default_value = 620.0      # ~1.6 mm pebble, coarse like the reference
noise.inputs['Detail'].default_value = 6.0
noise.inputs['Roughness'].default_value = 0.72   # more contrast between pebble peaks
bump.inputs['Distance'].default_value = 0.0016
bump.inputs['Strength'].default_value = 0.85
print(f"  noise scale 620 (~1.6 mm), detail 6.0, roughness 0.72")
print(f"  bump distance 0.0016 m, strength 0.85")

# --------------------------------------------------------------- lighting ----
# Scale the SUBJECT lights only. The scrims are background/rim shaping and are already
# doing their job; multiplying them too would just re-blow the thing we removed from frame.
SUBJECT = ('RIG_Key', 'RIG_RimL', 'RIG_RimR', 'RIG_Rods', 'RIG_BrassMirror')
print()
for nm in SUBJECT:
    ob = bpy.data.objects.get(nm)
    if not ob:
        continue
    before = ob.data.energy
    ob.data.energy = before * GAIN
    print(f"  {nm:18} {before:7.3f} W -> {ob.data.energy:7.3f} W")

bpy.ops.wm.save_mainfile()
print(f"\nBLEND SAVED - reference look, subject lights x{GAIN}")
