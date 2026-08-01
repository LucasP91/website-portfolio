"""Sparse, thin, genuinely aperiodic lines. Replaces the periodic band as the line source.

WHY THE OLD BANDS LOOKED LIKE "A BAND WITH A LINE IN THE MIDDLE"
Because that is what a bumped sine IS. A sine is a smooth hump; run it through a Bump node
and you get a raised ridge with a bright crest down its centre and soft shoulders either
side. No amount of amplitude tuning turns that into a thin line -- the shape is wrong.

HOW THESE ARE MADE INSTEAD
1. Sample a noise using ONLY the height: Combine XYZ(0, 0, height) as the texture vector.
   With X and Y pinned to zero the noise varies along Z alone, so every iso-value is a
   perfectly horizontal plane -- a line, uniform along its length, exactly like a layer scar.
2. Raise it to a high power. `pow(n, 24)` leaves essentially nothing except where n is very
   close to 1. Noise maxima are sparse and irregularly spaced, so what survives is a handful
   of thin spikes at random heights. No phase, no period, no repeat length -- the spacing is
   whatever the noise happened to do.
3. Sharpness IS sparsity here, and they are the same knob: raising the exponent makes each
   line thinner AND makes fewer of them clear the threshold.

The old sine band is dropped to near-flat rather than deleted, so it survives as a faint
undertone and can be brought back from one value if you want it.

Usage:
  blender -b Untitled.blend -P scripts/add_sparse_lines.py --
      [--scale 55]      noise scale; ~1/scale metres average spacing (55 -> ~18 mm)
      [--sharp 24]      exponent. higher = thinner AND sparser
      [--amount 0.30]   how strongly lines cut into the surface
      [--band 0.03]     leftover sine band amplitude (0 = fully off)
SAVES the .blend.
"""
import bpy, sys

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return float(argv[argv.index(name) + 1]) if name in argv else default


SCALE = opt('--scale', 55.0)
SHARP = opt('--sharp', 24.0)
AMOUNT = opt('--amount', 0.30)
BAND = opt('--band', 0.03)

m = bpy.data.materials['MattePLA_Black']
nt = m.node_tree
N = nt.nodes

# Deliberately the PRE-warp height. `HeightWarped` has the spacing-jitter noise added, and
# that noise varies in X and Y as well as Z -- so feeding it here made the "horizontal"
# lines wander up and down across the part. Taking the height before the warp keeps every
# line dead straight while `PerPartPhase` still makes each part different.
warped = next(n for n in N if n.name == 'HeightPlusPhase')
wall = next(n for n in N if n.name == 'WallSurface')
band = next(n for n in N if n.name == 'Map Range.003')
mix_h = next(n for n in N if n.name == 'Mix.001')


def mk(t, name, **kw):
    """Reuse a node by name, but ONLY if it is the right type.

    Re-running this script after changing a node's type (Math -> Map Range here) otherwise
    hands back the old node and setting inputs raises KeyError -- and because that happens
    before save_mainfile(), the .blend is left untouched while the console still prints the
    earlier lines. Silent no-op with a plausible log.
    """
    n = next((x for x in N if x.name == name), None)
    if n is not None and n.bl_idname != t:
        N.remove(n)
        n = None
    if n is None:
        n = N.new(t)
    n.name = n.label = name
    for k, v in kw.items():
        setattr(n, k, v)
    return n


# ---- 1. height-only vector: X and Y pinned to 0 so iso-values are horizontal planes
cxyz = mk('ShaderNodeCombineXYZ', 'LineVector')
cxyz.inputs['X'].default_value = 0.0
cxyz.inputs['Y'].default_value = 0.0
nt.links.new(warped.outputs['Value'], cxyz.inputs['Z'])

ln = mk('ShaderNodeTexNoise', 'SparseLineNoise')
ln.inputs['Scale'].default_value = SCALE
ln.inputs['Detail'].default_value = 2.0
ln.inputs['Roughness'].default_value = 0.5
nt.links.new(cxyz.outputs['Vector'], ln.inputs['Vector'])

# ---- 2. LEVEL CROSSING, not peak sharpening.
#
# My first two attempts used pow(noise, k) to keep only the peaks. That failed twice, and
# measurement showed why: with only ~2 noise cells across a part's height, the noise often
# never reaches a peak inside the part at all, so there is nothing to sharpen. Measured
# signal mean was 0.1/255, then 0.8/255 -- black both times.
#
# A LEVEL CROSSING cannot fail that way. A smooth 1D noise crosses any mid-range value at
# isolated heights, always, and those crossings are irregularly spaced by construction. So:
# take |noise - LEVEL| and keep only where it is tiny. Window width sets line thickness;
# LEVEL sets which crossings you get; noise scale sets how many.
lvl = mk('ShaderNodeMath', 'SparseLineLevel', operation='SUBTRACT')
nt.links.new(ln.outputs['Factor'], lvl.inputs[0])
lvl.inputs[1].default_value = 0.52

dist = mk('ShaderNodeMath', 'SparseLineDist', operation='ABSOLUTE')
nt.links.new(lvl.outputs['Value'], dist.inputs[0])

sharp = mk('ShaderNodeMapRange', 'SparseLineSharpen')
sharp.inputs['From Min'].default_value = 0.0
sharp.inputs['From Max'].default_value = 1.0 / SHARP   # window: bigger SHARP = thinner line
sharp.inputs['To Min'].default_value = 1.0
sharp.inputs['To Max'].default_value = 0.0
sharp.clamp = True
nt.links.new(dist.outputs['Value'], sharp.inputs['Value'])

amt = mk('ShaderNodeMath', 'SparseLineAmount', operation='MULTIPLY')
nt.links.new(sharp.outputs['Result'], amt.inputs[0])
amt.inputs[1].default_value = AMOUNT

# ---- 3. cut them into the wall surface
sub = mk('ShaderNodeMath', 'WallPlusLines', operation='SUBTRACT')
nt.links.new(wall.outputs[0], sub.inputs[0])
nt.links.new(amt.outputs['Value'], sub.inputs[1])

for i in mix_h.inputs:
    for l in list(i.links):
        if l.from_node.name in ('WallSurface', 'WallPlusLines'):
            nt.links.remove(l)
            nt.links.new(sub.outputs['Value'], i)

# ---- 4. periodic band down to a whisper
band.inputs['To Min'].default_value = 0.5 - BAND
band.inputs['To Max'].default_value = 0.5 + BAND

print(f"  sparse lines: noise scale {SCALE:.0f} (~{1000/SCALE:.0f} mm avg spacing), "
      f"pow {SHARP:.0f}, depth {AMOUNT:.2f}")
print(f"  vector = CombineXYZ(0, 0, height)  -> iso-values are horizontal planes")
print(f"  periodic sine band amplitude -> {BAND*2:.3f} (was 0.190)")
print(f"  lines SUBTRACT from the surface, so they read as thin incised grooves")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - sparse aperiodic lines over fuzzy skin")
