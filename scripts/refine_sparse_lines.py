"""Thinner, more numerous, partial-length, and lit both darker AND lighter than the base.

FOUR CHANGES, AND THE THIRD IS THE INTERESTING ONE

1. THINNER + MORE. Window narrows (sharp 70 -> 150) and the noise scale rises (32 -> 95,
   about 10 mm average spacing) so more crossings occur.

2. PARTIAL LENGTH. Until now the line vector was CombineXYZ(0, 0, height) -- a pure function
   of height -- so every line was perfectly uniform along its length and wrapped the entire
   part. But the reason you can SEE one of these is a local inconsistency: a flow hiccup, a
   momentary temperature dip, the seam where the nozzle started that layer. That does not
   happen all the way round. A 3D "break" noise now gates the line, so each one appears over
   some arcs and fades out over others.

3. SIGNED, SO LINES GO BOTH WAYS. Previously lines only SUBTRACTED -- every one was a groove,
   every one darker. Real banding does both: under-extrusion cuts a shadow line, over-
   extrusion leaves a proud ridge that catches light and reads BRIGHTER than the surface
   around it. A per-line polarity noise now maps to -1..+1, so roughly half are incised and
   half are raised.

4. ALBEDO FOLLOWS THE SIGN. Bump alone only redistributes light; to actually read as lighter
   and darker material the base colour shifts too -- toward 0.021 where the line is incised
   (shadowed, less scattering) and toward 0.115 where it is proud (catching more light).
   This is what makes it read as dispersion rather than as embossing.

Usage:
  blender -b Untitled.blend -P scripts/refine_sparse_lines.py --
      [--scale 95] [--sharp 150] [--amount 0.5] [--break-scale 38] [--colour 1.0]
SAVES the .blend.
"""
import bpy, sys

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return float(argv[argv.index(name) + 1]) if name in argv else default


SCALE = opt('--scale', 95.0)
SHARP = opt('--sharp', 150.0)
AMOUNT = opt('--amount', 0.50)
BREAK = opt('--break-scale', 38.0)
COLOUR = opt('--colour', 1.0)

m = bpy.data.materials['MattePLA_Black']
nt = m.node_tree
N = nt.nodes

texco = next(n for n in N if n.type == 'TEX_COORD')
hgt = next(n for n in N if n.name == 'HeightPlusPhase')
ln = next(n for n in N if n.name == 'SparseLineNoise')
sharp = next(n for n in N if n.name == 'SparseLineSharpen')
wall = next(n for n in N if n.name == 'WallSurface')
sub = next(n for n in N if n.name == 'WallPlusLines')
bsdf = next(n for n in N if n.type == 'BSDF_PRINCIPLED')


def mk(t, name, **kw):
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


# ---- 1. thinner + more ------------------------------------------------------------
ln.inputs['Scale'].default_value = SCALE
sharp.inputs['From Max'].default_value = 1.0 / SHARP
print(f"  {1000/SCALE:.0f} mm average spacing, window 1/{SHARP:.0f}")

# ---- 2. break the lines up around the part ----------------------------------------
brk = mk('ShaderNodeTexNoise', 'LineBreakNoise')
brk.inputs['Scale'].default_value = BREAK           # ~26 mm patches
brk.inputs['Detail'].default_value = 3.0
nt.links.new(texco.outputs['Object'], brk.inputs['Vector'])

gate = mk('ShaderNodeMapRange', 'LineBreakGate')
gate.inputs['From Min'].default_value = 0.44
gate.inputs['From Max'].default_value = 0.60
gate.inputs['To Min'].default_value = 0.0
gate.inputs['To Max'].default_value = 1.0
gate.clamp = True
nt.links.new(brk.outputs['Factor'], gate.inputs['Value'])

gated = mk('ShaderNodeMath', 'LineGated', operation='MULTIPLY')
nt.links.new(sharp.outputs['Result'], gated.inputs[0])
nt.links.new(gate.outputs['Result'], gated.inputs[1])
print(f"  break noise ~{1000/BREAK:.0f} mm -> lines appear over arcs, not the whole part")

# ---- 3. per-line polarity: some incised, some proud --------------------------------
pv = mk('ShaderNodeCombineXYZ', 'PolarityVector')
pv.inputs['X'].default_value = 7.31                 # offset to decorrelate from the line noise
pv.inputs['Y'].default_value = 0.0
nt.links.new(hgt.outputs['Value'], pv.inputs['Z'])

pn = mk('ShaderNodeTexNoise', 'LinePolarityNoise')
pn.inputs['Scale'].default_value = SCALE * 0.9
pn.inputs['Detail'].default_value = 1.0
nt.links.new(pv.outputs['Vector'], pn.inputs['Vector'])

psign = mk('ShaderNodeMapRange', 'LinePolaritySigned')
psign.inputs['From Min'].default_value = 0.35
psign.inputs['From Max'].default_value = 0.65
psign.inputs['To Min'].default_value = -1.0
psign.inputs['To Max'].default_value = 1.0
psign.clamp = True
nt.links.new(pn.outputs['Factor'], psign.inputs['Value'])

signed = mk('ShaderNodeMath', 'LineSigned', operation='MULTIPLY')
nt.links.new(gated.outputs['Value'], signed.inputs[0])
nt.links.new(psign.outputs['Result'], signed.inputs[1])

amt = mk('ShaderNodeMath', 'SparseLineAmount', operation='MULTIPLY')
nt.links.new(signed.outputs['Value'], amt.inputs[0])
amt.inputs[1].default_value = AMOUNT

# signed already carries direction, so this must ADD, not SUBTRACT
sub.operation = 'ADD'
for l in list(sub.inputs[0].links):
    nt.links.remove(l)
for l in list(sub.inputs[1].links):
    nt.links.remove(l)
nt.links.new(wall.outputs[0], sub.inputs[0])
nt.links.new(amt.outputs['Value'], sub.inputs[1])
print("  polarity -1..+1 -> roughly half incised, half proud (WallPlusLines now ADDs)")

# ---- 4. albedo follows the sign ---------------------------------------------------
#
# IDEMPOTENCY. Reading whatever currently feeds Base Color is wrong on a re-run: by then it
# is this script's own LineLighten, so the chain gets wired into itself. That produced a
# LineLighten <- LineDarken <- LineLighten cycle, orphaned the real albedo node, and rendered
# every printed part near-black. Always source from the ORIGINAL albedo mixer by name and
# never from the current link.
orig = next((n for n in N if n.name == 'Mix' and n.bl_idname == 'ShaderNodeMix'), None)
if orig is not None:
    base_src = orig.outputs[2]                      # Result (colour)
elif bsdf.inputs['Base Color'].is_linked:
    src_node = bsdf.inputs['Base Color'].links[0].from_node
    base_src = None if src_node.name in ('LineLighten', 'LineDarken') else \
        bsdf.inputs['Base Color'].links[0].from_socket
else:
    base_src = None
if base_src is not None and COLOUR > 0:
    neg = mk('ShaderNodeMath', 'LineNegPart', operation='MULTIPLY')
    nt.links.new(signed.outputs['Value'], neg.inputs[0])
    neg.inputs[1].default_value = -COLOUR
    negc = mk('ShaderNodeMath', 'LineNegClamp', operation='MAXIMUM')
    nt.links.new(neg.outputs['Value'], negc.inputs[0])
    negc.inputs[1].default_value = 0.0

    pos = mk('ShaderNodeMath', 'LinePosPart', operation='MULTIPLY')
    nt.links.new(signed.outputs['Value'], pos.inputs[0])
    pos.inputs[1].default_value = COLOUR
    posc = mk('ShaderNodeMath', 'LinePosClamp', operation='MAXIMUM')
    nt.links.new(pos.outputs['Value'], posc.inputs[0])
    posc.inputs[1].default_value = 0.0

    dk = mk('ShaderNodeMix', 'LineDarken', data_type='RGBA', blend_type='MIX')
    nt.links.new(base_src, dk.inputs[6])            # A
    dk.inputs[7].default_value = (0.021, 0.022, 0.023, 1.0)
    nt.links.new(negc.outputs['Value'], dk.inputs['Factor'])

    lt = mk('ShaderNodeMix', 'LineLighten', data_type='RGBA', blend_type='MIX')
    nt.links.new(dk.outputs[2], lt.inputs[6])
    lt.inputs[7].default_value = (0.115, 0.118, 0.124, 1.0)
    nt.links.new(posc.outputs['Value'], lt.inputs['Factor'])

    nt.links.new(lt.outputs[2], bsdf.inputs['Base Color'])
    print("  albedo: incised -> 0.021 (shadowed), proud -> 0.115 (catching light)")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - thin, numerous, partial, bidirectional lines")
