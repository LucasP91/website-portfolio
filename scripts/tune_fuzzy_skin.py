"""More fuzz, fainter bands, and kill the ~1 cm rhythm Lucas spotted.

THE PATTERN HE SAW IS LITERALLY A PARAMETER
Band depth was modulated by ONE noise at Scale 85 -- about 12 mm. A single-scale modulator
has exactly one beat period, so the eye finds it immediately and the whole surface reads as
regular. Two independent causes of regularity were in play:

  1. DEPTH varied on one period (~12 mm)  -> stack two decorrelated scales instead
  2. SPACING did not vary at all. The band is a pure sine at a fixed 1.6 mm pitch, so even
     with depth wandering, the LINES stayed perfectly evenly spaced.

(2) is the more important one and was untouched until now. Real banding drifts in spacing as
well as depth -- screw runout is not perfectly periodic and flow lags temperature. Fixed by
warping the height signal with noise BEFORE it enters the sine, which is frequency
modulation: bands bunch up and spread out instead of marching.

Also: more fuzzy skin, less band. Fuzz mix 0.42 -> 0.64, band amplitude 0.34 -> 0.19.

SAVES the .blend.
"""
import bpy

m = bpy.data.materials['MattePLA_Black']
nt = m.node_tree
N = nt.nodes

texco = next(n for n in N if n.type == 'TEX_COORD')
rel = next(n for n in N if n.name == 'HeightRelToObject')
mul = next(n for n in N if n.name == 'Math.001')          # height -> radians
band = next(n for n in N if n.name == 'Map Range.003')
bvn = next(n for n in N if n.name == 'BandVarNoise')
bvr = next(n for n in N if n.name == 'BandVarRange')
bmul = next(n for n in N if n.name == 'BandTimesVar')
wall = next(n for n in N if n.name == 'WallSurface')
fz = next(n for n in N if n.name == 'FuzzySkin')


def mk(t, name, **kw):
    n = next((x for x in N if x.name == name), None) or N.new(t)
    n.name = n.label = name
    for k, v in kw.items():
        setattr(n, k, v)
    return n


# ---- 1. warp the height so band SPACING is irregular ------------------------------
wn = mk('ShaderNodeTexNoise', 'BandWarpNoise')
wn.inputs['Scale'].default_value = 240.0        # ~4 mm drift
wn.inputs['Detail'].default_value = 4.0
wn.inputs['Roughness'].default_value = 0.6
nt.links.new(texco.outputs['Object'], wn.inputs['Vector'])

wr = mk('ShaderNodeMapRange', 'BandWarpRange')
wr.inputs['From Min'].default_value = 0.0
wr.inputs['From Max'].default_value = 1.0
wr.inputs['To Min'].default_value = -0.0011     # +/- ~0.7 band pitches of phase jitter
wr.inputs['To Max'].default_value = 0.0011
nt.links.new(wn.outputs['Factor'], wr.inputs['Value'])

warped = mk('ShaderNodeMath', 'HeightWarped', operation='ADD')
nt.links.new(rel.outputs['Value'], warped.inputs[0])
nt.links.new(wr.outputs['Result'], warped.inputs[1])
for l in list(mul.inputs[0].links):
    nt.links.remove(l)
nt.links.new(warped.outputs['Value'], mul.inputs[0])
print("  band SPACING now frequency-modulated (+/-1.1 mm phase jitter over ~4 mm)")

# ---- 2. depth variance across two decorrelated scales -----------------------------
bvn.inputs['Scale'].default_value = 27.0        # ~37 mm, well above the old 12 mm beat
bvn.inputs['Detail'].default_value = 3.0

bvn2 = mk('ShaderNodeTexNoise', 'BandVarNoise2')
bvn2.inputs['Scale'].default_value = 195.0      # ~5 mm
bvn2.inputs['Detail'].default_value = 3.0
nt.links.new(texco.outputs['Object'], bvn2.inputs['Vector'])

bmix = mk('ShaderNodeMix', 'BandVarMix', data_type='FLOAT', blend_type='MULTIPLY')
bmix.inputs['Factor'].default_value = 1.0
nt.links.new(bvn.outputs['Factor'], bmix.inputs[2])
nt.links.new(bvn2.outputs['Factor'], bmix.inputs[3])
for l in list(bvr.inputs['Value'].links):
    nt.links.remove(l)
nt.links.new(bmix.outputs[0], bvr.inputs['Value'])
bvr.inputs['From Min'].default_value = 0.05
bvr.inputs['From Max'].default_value = 0.55
bvr.inputs['To Min'].default_value = 0.15       # bands can nearly vanish
bvr.inputs['To Max'].default_value = 1.0
print("  band DEPTH varies on two scales (~37 mm x ~5 mm) -- no single beat period")

# ---- 3. more fuzz, fainter bands --------------------------------------------------
band.inputs['To Min'].default_value = 0.405
band.inputs['To Max'].default_value = 0.595     # amplitude 0.34 -> 0.19
wall.inputs['Factor'].default_value = 0.64      # was 0.42
fz.inputs['Scale'].default_value = 1450.0       # ~0.69 mm points
fz.inputs['Detail'].default_value = 9.0
fz.inputs['Roughness'].default_value = 0.78
print("  band amplitude 0.34 -> 0.19 ; fuzzy mix 0.42 -> 0.64 ; fuzz ~0.69 mm")

bump = next(n for n in N if n.type == 'BUMP')
bump.inputs['Distance'].default_value = 0.0026
bump.inputs['Strength'].default_value = 0.95
print("  bump 0.0026 m @ 0.95")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - fuzz-led surface, bands irregular in both spacing and depth")
