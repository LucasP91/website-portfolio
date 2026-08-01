"""Make each line run longer before it breaks, by stretching the break noise sideways.

WHY THE SEGMENTS WERE SHORT
`LineBreakNoise` was sampled on plain object coordinates, so its features are ISOTROPIC --
roughly spherical blobs about 26 mm across. A line crossing a field of 26 mm blobs gets
chopped into ~26 mm segments, which is why they read as dashes rather than as a scar that
runs round part of the drum and fades.

A line is a 1D feature living in a horizontal plane, so the gate that breaks it should vary
SLOWLY along the line and QUICKLY between lines. That is an anisotropic noise: squash the
horizontal coordinates before sampling, leave Z alone.

    vector = Object * (stretch, stretch, 1.0)      stretch < 1  ->  longer features in X/Y

At stretch 0.22 the break features become ~4.5x longer horizontally (~120 mm arcs) while
staying ~26 mm tall, so consecutive lines still break in different places.

SAVES the .blend.
"""
import bpy, sys

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return float(argv[argv.index(name) + 1]) if name in argv else default


STRETCH = opt('--stretch', 0.22)

m = bpy.data.materials['MattePLA_Black']
nt = m.node_tree
N = nt.nodes

texco = next(n for n in N if n.type == 'TEX_COORD')
brk = next(n for n in N if n.name == 'LineBreakNoise')


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


sq = mk('ShaderNodeVectorMath', 'BreakStretch', operation='MULTIPLY')
nt.links.new(texco.outputs['Object'], sq.inputs[0])
sq.inputs[1].default_value = (STRETCH, STRETCH, 1.0)

for l in list(brk.inputs['Vector'].links):
    nt.links.remove(l)
nt.links.new(sq.outputs['Vector'], brk.inputs['Vector'])

scale = brk.inputs['Scale'].default_value
print(f"  break noise stretched ({STRETCH}, {STRETCH}, 1.0)")
print(f"  features: ~{1000/scale/STRETCH:.0f} mm along the line, "
      f"~{1000/scale:.0f} mm between lines")
print(f"  -> lines run in long arcs and fade, instead of dashing every ~{1000/scale:.0f} mm")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - longer line segments")
