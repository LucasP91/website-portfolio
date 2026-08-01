"""Soften the banding, vary it, and add fuzzy-skin roughness. Also fixes a texture-scale error.

A SCALE BUG I INTRODUCED EARLIER
The noise nodes have UNLINKED Vector inputs, so they run on GENERATED coordinates -- which
are normalised 0..1 across each object's bounding box, NOT metres. Every "millimetre" figure
I quoted for the pebble was therefore wrong by the part's own size: on a ~200 mm link,
Scale 540 gives 0.37 mm features, not 1.85 mm. Sub-pixel. That is the real reason the plate
texture never read, and no amount of bump depth was going to rescue it.

Fixed by feeding the noises from Texture Coordinate > Object, which IS metric, so Scale N
means features of roughly 1/N metres and the numbers below mean what they say.

WHAT CHANGES
1. Bands less aggressive -- amplitude 0.70 -> 0.34.
2. Bands VARY. A real print does not band uniformly; flow and temperature drift, so depth
   wanders over a few centimetres. A low-frequency noise (~12 mm) multiplies band depth
   between 0.45 and 1.0, so some stretches almost vanish and others stand out.
3. FUZZY SKIN. The slicer feature: the outer perimeter is jittered outward by a small random
   amount at a set point spacing. Real defaults are ~0.3 mm thickness at ~0.75 mm spacing,
   so it is modelled as high-frequency noise at 0.75 mm -- about 3.4 px at 1800 px wide,
   which resolves. Walls only; the plate face keeps its own pebble.

SAVES the .blend.
"""
import bpy

m = bpy.data.materials['MattePLA_Black']
nt = m.node_tree
N = nt.nodes

texco = next(n for n in N if n.type == 'TEX_COORD')
band = next(n for n in N if n.name == 'Map Range.003')     # the layer band signal
mix_h = next(n for n in N if n.name == 'Mix.001')          # wall/top selector
pebble = next(n for n in N if n.name == 'Noise Texture')   # the plate pebble


def mk(t, name, **kw):
    n = next((x for x in N if x.name == name), None) or N.new(t)
    n.name = n.label = name
    for k, v in kw.items():
        setattr(n, k, v)
    return n


# ---- 0. make every noise METRIC ---------------------------------------------------
nt.links.new(texco.outputs['Object'], pebble.inputs['Vector'])
pebble.inputs['Scale'].default_value = 620.0      # ~1.6 mm, and now that is really 1.6 mm
print("  pebble Vector -> TexCoord.Object (metric); scale 620 = ~1.6 mm for real this time")

# ---- 1. bands less aggressive ------------------------------------------------------
band.inputs['To Min'].default_value = 0.33
band.inputs['To Max'].default_value = 0.67        # amplitude 0.70 -> 0.34
print("  band amplitude 0.70 -> 0.34")

# ---- 2. band depth varies over a few cm --------------------------------------------
bvn = mk('ShaderNodeTexNoise', 'BandVarNoise')
bvn.inputs['Scale'].default_value = 85.0          # ~12 mm drift
bvn.inputs['Detail'].default_value = 2.0
nt.links.new(texco.outputs['Object'], bvn.inputs['Vector'])

bvr = mk('ShaderNodeMapRange', 'BandVarRange')
bvr.inputs['From Min'].default_value = 0.25
bvr.inputs['From Max'].default_value = 0.75
bvr.inputs['To Min'].default_value = 0.45
bvr.inputs['To Max'].default_value = 1.0
bvr.clamp = True
nt.links.new(bvn.outputs['Factor'], bvr.inputs['Value'])

bmul = mk('ShaderNodeMath', 'BandTimesVar', operation='MULTIPLY')
nt.links.new(band.outputs['Result'], bmul.inputs[0])
nt.links.new(bvr.outputs['Result'], bmul.inputs[1])
print("  band depth modulated 0.45-1.00 by ~12 mm noise (bands come and go, as on a real print)")

# ---- 3. fuzzy skin on the walls ----------------------------------------------------
fz = mk('ShaderNodeTexNoise', 'FuzzySkin')
fz.inputs['Scale'].default_value = 1330.0         # ~0.75 mm point spacing
fz.inputs['Detail'].default_value = 8.0
fz.inputs['Roughness'].default_value = 0.72
nt.links.new(texco.outputs['Object'], fz.inputs['Vector'])

wall = mk('ShaderNodeMix', 'WallSurface', data_type='FLOAT', blend_type='MIX')
wall.inputs['Factor'].default_value = 0.42
nt.links.new(bmul.outputs['Value'], wall.inputs[2])   # A = varied bands
nt.links.new(fz.outputs['Factor'], wall.inputs[3])    # B = fuzzy skin
print("  fuzzy skin: 0.75 mm spacing (~3.4 px at 1800), mixed 0.42 into the wall signal")

# Replace whatever socket on Mix.001 was fed by the raw band with the new wall signal.
for i in mix_h.inputs:
    for l in list(i.links):
        if l.from_node.name in ('Map Range.003', 'BandTimesVar'):
            nt.links.remove(l)
            nt.links.new(wall.outputs[0], i)
            print(f"  Mix.001 '{i.name}' <- WallSurface")

bump = next(n for n in N if n.type == 'BUMP')
bump.inputs['Distance'].default_value = 0.0022
bump.inputs['Strength'].default_value = 0.9
print("  bump 0.0022 m @ 0.90")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - softer varied banding + fuzzy skin, noises now metric")
