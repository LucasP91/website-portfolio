"""Bevel the printed parts. Raw CAD edges are the single loudest CG tell in the film.

WHY THIS IS PHYSICS, NOT DECORATION
A 0.4 mm nozzle laying a bead cannot produce an edge sharper than roughly half its width.
Every external edge on an FDM part carries a ~0.2-0.4 mm radius whether you designed one
or not, and that radius is what catches a specular line when light rakes across it. A
mathematically sharp edge returns a highlight of zero width -- it vanishes. That is why
untouched CAD reads as CG even when the material is right.

WHY IT SURVIVES THE 2-PIXEL RULE
STATE's BRDF rule says features with a period under ~2 px must live in the BRDF, not in
geometry. A 0.35 mm bevel on a 400 mm machine at 900 px is ~0.8 px, which looks like a
violation. It is not: the rule governs REPEATING features, where sub-pixel period means
the samples alias into mush. A bevel is a single edge, and the renderer resolves it as a
sub-pixel-wide bright streak that antialiasing spreads into a legible highlight. One
bright line at 0.8 px reads. A grating at 0.8 px pitch does not.

Bevel (harden normals) -> Weighted Normal is the standard pairing: flat faces keep reading
flat, and only the new bevel loops pick up the light.

Usage:  blender -b Untitled.blend -P scripts/add_fillets.py -- [--width 0.00035]
                                                              [--segments 2] [--dry]
SAVES the .blend unless --dry.
"""
import bpy, sys, math

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return type(default)(argv[argv.index(name) + 1]) if name in argv else default


WIDTH = opt('--width', 0.00035)      # 0.35 mm -- a 0.4 mm nozzle's minimum external radius
SEGMENTS = opt('--segments', 2)
ANGLE = math.radians(30.0)           # only bevel real edges, not flat-face triangulation
DRY = '--dry' in argv

PRINTED = 'MattePLA_Black'

targets = [o for o in bpy.data.objects
           if o.type == 'MESH' and any(sl.material and sl.material.name == PRINTED
                                       for sl in o.material_slots)]

print(f"  {len(targets)} printed parts, bevel {WIDTH*1000:.2f} mm x {SEGMENTS} seg "
      f"@ {math.degrees(ANGLE):.0f} deg{'  [DRY RUN]' if DRY else ''}")

# Bevel width is in LOCAL units, so a non-unit object scale silently rescales the fillet.
odd = [(o.name, tuple(round(s, 4) for s in o.scale)) for o in targets
       if max(abs(s - 1.0) for s in o.scale) > 1e-4]
if odd:
    print(f"  !! {len(odd)} objects have non-unit scale -- their bevel will NOT be "
          f"{WIDTH*1000:.2f} mm:")
    for n, s in odd[:6]:
        print(f"     {n:34} scale={s}")

for o in targets:
    if DRY:
        print(f"     would bevel {o.name}")
        continue
    for md in list(o.modifiers):
        if md.type in ('BEVEL', 'WEIGHTED_NORMAL'):
            o.modifiers.remove(md)          # idempotent -- safe to re-run
    # Bevel's harden_normals needs smooth shading to write custom normals into.
    for p in o.data.polygons:
        p.use_smooth = True
    bev = o.modifiers.new('Fillet', 'BEVEL')
    bev.width = WIDTH
    bev.segments = SEGMENTS
    bev.limit_method = 'ANGLE'
    bev.angle_limit = ANGLE
    bev.miter_outer = 'MITER_ARC'           # clean 3-way corners instead of a spike
    bev.harden_normals = True
    wn = o.modifiers.new('WeightedNormal', 'WEIGHTED_NORMAL')
    wn.keep_sharp = True

if not DRY:
    bpy.ops.wm.save_mainfile()
    print(f"\nBLEND SAVED - {len(targets)} printed parts filleted")
else:
    print("\nDRY RUN - nothing written")
