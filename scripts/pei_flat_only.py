"""Restrict the PEI finish to genuinely flat horizontal faces.

TWO CAUSES OF THE BLEED, AND THE SECOND IS THE REAL ONE

1. The threshold was loose. |Normal.Z| ramped 0.55 -> 0.85, so anything within about 56 deg
   of horizontal got some plate texture. Only a face that actually LAY on the plate should
   have it, which means |Normal.Z| essentially 1.

2. The mask was reading the SHADING normal, and that is why it crept onto the roundovers.
   `Geometry > Normal` returns the shading normal, which on these parts has been smooth-
   shaded and then rewritten by Bevel's harden_normals and the Weighted Normal modifier. Near
   a filleted edge the shading normal is deliberately blended toward the neighbouring face, so
   a flat top reads as progressively less flat as you approach its own bevel -- and the fillet
   is 0.55 mm wide, which at 0.222 mm/px is a 2.5 px band all the way round every face.

   `Geometry > True Normal` is the raw geometric normal. It ignores smooth shading, custom
   split normals and the bevel's normal hardening, so a flat face reads exactly 1.0 right up
   to where the geometry genuinely starts curving.

A hard cut is correct here rather than a soft ramp: the bevel already provides the physical
transition, and the true normal swings through it quickly, so there is no aliasing to smooth.

Usage:  blender -b Untitled.blend -P scripts/pei_flat_only.py -- [--lo 0.94] [--hi 0.99]
SAVES the .blend.
"""
import bpy, sys, math

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return float(argv[argv.index(name) + 1]) if name in argv else default


LO = opt('--lo', 0.94)
HI = opt('--hi', 0.99)

m = bpy.data.materials['MattePLA_Black']
nt = m.node_tree
N = nt.nodes

geo = next(n for n in N if n.type == 'NEW_GEOMETRY')
sep_nrm = next(n for n in N if n.name == 'Separate XYZ')
mask = next(n for n in N if n.name == 'Map Range')

# True Normal, not Normal -- see docstring.
for l in list(sep_nrm.inputs['Vector'].links):
    nt.links.remove(l)
nt.links.new(geo.outputs['True Normal'], sep_nrm.inputs['Vector'])

mask.inputs['From Min'].default_value = LO
mask.inputs['From Max'].default_value = HI
mask.clamp = True

print(f"  mask source: Geometry.Normal -> Geometry.True Normal (ignores bevel normal-hardening)")
print(f"  |True Normal.Z| {LO} -> {HI}")
print(f"  = faces within {math.degrees(math.acos(min(1.0, HI))):.1f} deg of horizontal get full PEI,")
print(f"    nothing beyond {math.degrees(math.acos(min(1.0, LO))):.1f} deg gets any")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - PEI on plate-contact faces only")
