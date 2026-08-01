"""Many more lines, but sharp only in a few places -- soft and diffuse everywhere else.

THE KEY IDEA: SHARPNESS BECOMES A PROPERTY OF PLACE, NOT A CONSTANT
Until now one number set the line window for the whole machine, so every line was equally
crisp. That is the giveaway -- a real part has a couple of places where something went
briefly wrong and left a hard edge, and a lot of places where the same defect is smeared
into a soft tonal shift you can barely resolve.

So the window width is DRIVEN by a noise instead of being a constant. Map Range's `From Max`
is a socket, so it can be linked like anything else:

    soft regions -> window 1/45   broad, gradual, reads as a smudge
    sharp spots  -> window 1/320  narrow, crisp, reads as a scar

The driving noise is mapped from 0.55..0.74, so only its upper tail reaches the sharp end --
which is what makes crisp spots RARE rather than half the surface.

Strength rides along with it. A soft line that is also full-depth looks like a dent, not a
smear, so the same noise scales LineSigned from 0.3 to 1.0. That modulates bump AND albedo
together, because it is applied to the signed signal upstream of both.

Line count roughly doubles-and-then-some: spacing ~11 mm -> ~4.5 mm.

Usage:
  blender -b Untitled.blend -P scripts/vary_line_sharpness.py --
      [--scale 230] [--patch 22] [--soft 45] [--sharp 320] [--minstr 0.30]
SAVES the .blend.
"""
import bpy, sys

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return float(argv[argv.index(name) + 1]) if name in argv else default


SCALE = opt('--scale', 230.0)     # line noise scale -> ~1/scale metres spacing
PATCH = opt('--patch', 22.0)      # how big the soft/sharp regions are (~45 mm)
SOFT = opt('--soft', 45.0)        # window denominator in soft regions (wide)
SHARP = opt('--sharp', 320.0)     # window denominator in the rare sharp spots (narrow)
MINSTR = opt('--minstr', 0.30)    # strength floor in soft regions

m = bpy.data.materials['MattePLA_Black']
nt = m.node_tree
N = nt.nodes

texco = next(n for n in N if n.type == 'TEX_COORD')
ln = next(n for n in N if n.name == 'SparseLineNoise')
sharpen = next(n for n in N if n.name == 'SparseLineSharpen')
signed = next(n for n in N if n.name == 'LineSigned')
amt = next(n for n in N if n.name == 'SparseLineAmount')
pn = next(n for n in N if n.name == 'LinePolarityNoise')


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


# ---- 1. many more lines -----------------------------------------------------------
ln.inputs['Scale'].default_value = SCALE
pn.inputs['Scale'].default_value = SCALE * 0.9      # polarity keeps pace, else lines pair up
print(f"  line spacing ~{1000/SCALE:.1f} mm (was ~11 mm)")

# ---- 2. sharpness varies by region ------------------------------------------------
sv = mk('ShaderNodeTexNoise', 'SharpVarNoise')
sv.inputs['Scale'].default_value = PATCH
sv.inputs['Detail'].default_value = 3.0
sv.inputs['Roughness'].default_value = 0.55
nt.links.new(texco.outputs['Object'], sv.inputs['Vector'])

win = mk('ShaderNodeMapRange', 'SharpVarWindow')
win.inputs['From Min'].default_value = 0.55         # only the upper tail goes crisp
win.inputs['From Max'].default_value = 0.74
win.inputs['To Min'].default_value = 1.0 / SOFT     # wide  = soft smudge
win.inputs['To Max'].default_value = 1.0 / SHARP    # narrow = crisp scar
win.clamp = True
nt.links.new(sv.outputs['Factor'], win.inputs['Value'])
nt.links.new(win.outputs['Result'], sharpen.inputs['From Max'])
print(f"  window driven by ~{1000/PATCH:.0f} mm noise: 1/{SOFT:.0f} soft -> 1/{SHARP:.0f} sharp")

# ---- 3. strength rides with sharpness ---------------------------------------------
st = mk('ShaderNodeMapRange', 'SharpVarStrength')
st.inputs['From Min'].default_value = 0.42
st.inputs['From Max'].default_value = 0.74
st.inputs['To Min'].default_value = MINSTR
st.inputs['To Max'].default_value = 1.0
st.clamp = True
nt.links.new(sv.outputs['Factor'], st.inputs['Value'])

soft = mk('ShaderNodeMath', 'LineSignedSoft', operation='MULTIPLY')
nt.links.new(signed.outputs['Value'], soft.inputs[0])
nt.links.new(st.outputs['Result'], soft.inputs[1])

# Re-point every consumer of LineSigned at the softened version, so bump AND albedo follow.
for consumer in ('SparseLineAmount', 'LineNegPart', 'LinePosPart'):
    node = next((n for n in N if n.name == consumer), None)
    if not node:
        continue
    for l in list(node.inputs[0].links):
        if l.from_node.name == 'LineSigned':
            nt.links.remove(l)
            nt.links.new(soft.outputs['Value'], node.inputs[0])
print(f"  strength {MINSTR:.2f} in soft regions -> 1.00 in sharp ones (bump + albedo both)")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - dense lines, crisp only in a few places")
