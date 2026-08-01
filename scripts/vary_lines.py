"""More line variance: per-part phase, warped wobble, and a third variance octave.

THREE SOURCES OF SAMENESS REMAINED
1. EVERY PART BANDED IN PHASE. Height is measured from each object's own origin, so all 19
   parts started their band pattern at the same offset -- as if the whole assembly were
   printed as one piece in one go. They were not; each part was printed separately, at its
   own Z start, on its own day. `Object Info > Random` gives a stable per-object value, so
   each part now gets its own phase offset and its own warp seed.
2. THE 8 mm Z-WOBBLE WAS STILL A PURE SINE. Everything else got frequency-modulated but the
   wobble kept marching. It now rides the same warped height.
3. VARIANCE HAD TWO OCTAVES, NOT THREE. Two scales still beat against each other in a way
   the eye can find. A third, very coarse one (~90 mm) makes whole regions of a part quiet
   or busy, which is what actually happens as a print heats up.

SAVES the .blend.
"""
import bpy, sys

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return float(argv[argv.index(name) + 1]) if name in argv else default


PHASE = opt('--phase', 0.004)      # metres of per-part phase spread (2.5 band pitches)
WARP = opt('--warp', 0.0016)       # +/- metres of spacing jitter

m = bpy.data.materials['MattePLA_Black']
nt = m.node_tree
N = nt.nodes

texco = next(n for n in N if n.type == 'TEX_COORD')
oinfo = next(n for n in N if n.name == 'ObjInfo')
rel = next(n for n in N if n.name == 'HeightRelToObject')
warped = next(n for n in N if n.name == 'HeightWarped')
wr = next(n for n in N if n.name == 'BandWarpRange')
bvr = next(n for n in N if n.name == 'BandVarRange')
bmix = next(n for n in N if n.name == 'BandVarMix')
zfreq = next((n for n in N if n.name == 'ZWobble_Freq'), None)


def mk(t, name, **kw):
    n = next((x for x in N if x.name == name), None) or N.new(t)
    n.name = n.label = name
    for k, v in kw.items():
        setattr(n, k, v)
    return n


# ---- 1. per-part phase offset -----------------------------------------------------
ph = mk('ShaderNodeMath', 'PerPartPhase', operation='MULTIPLY')
nt.links.new(oinfo.outputs['Random'], ph.inputs[0])
ph.inputs[1].default_value = PHASE

hp = mk('ShaderNodeMath', 'HeightPlusPhase', operation='ADD')
nt.links.new(rel.outputs['Value'], hp.inputs[0])
nt.links.new(ph.outputs['Value'], hp.inputs[1])

for l in list(warped.inputs[0].links):
    nt.links.remove(l)
nt.links.new(hp.outputs['Value'], warped.inputs[0])
print(f"  per-part phase: ObjectInfo.Random x {PHASE*1000:.1f} mm  "
      f"(each part starts its banding somewhere different)")

# ---- 2. the Z-wobble rides the warped height too ----------------------------------
if zfreq:
    for l in list(zfreq.inputs[0].links):
        nt.links.remove(l)
    nt.links.new(warped.outputs['Value'], zfreq.inputs[0])
    print("  8 mm Z-wobble now frequency-modulated as well (was a pure sine)")

# ---- 3. wider spacing jitter ------------------------------------------------------
wr.inputs['To Min'].default_value = -WARP
wr.inputs['To Max'].default_value = WARP
print(f"  spacing jitter +/-{WARP*1000:.1f} mm ({WARP/0.0016:.1f} band pitches)")

# ---- 4. third, very coarse variance octave ----------------------------------------
bv3 = mk('ShaderNodeTexNoise', 'BandVarNoise3')
bv3.inputs['Scale'].default_value = 11.0        # ~90 mm: whole regions quiet or busy
bv3.inputs['Detail'].default_value = 2.0
nt.links.new(texco.outputs['Object'], bv3.inputs['Vector'])

bmix2 = mk('ShaderNodeMix', 'BandVarMix3', data_type='FLOAT', blend_type='MULTIPLY')
bmix2.inputs['Factor'].default_value = 0.75
nt.links.new(bmix.outputs[0], bmix2.inputs[2])
nt.links.new(bv3.outputs['Factor'], bmix2.inputs[3])
for l in list(bvr.inputs['Value'].links):
    nt.links.remove(l)
nt.links.new(bmix2.outputs[0], bvr.inputs['Value'])
bvr.inputs['From Min'].default_value = 0.03
bvr.inputs['From Max'].default_value = 0.45
print("  third variance octave ~90 mm -> depth now varies on ~90 / ~37 / ~5 mm")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - lines vary per part, in spacing, and across three scales")
