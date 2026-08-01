"""Put a tolerance gap between mating printed parts.

WHY THEY LOOK FAKE RIGHT NOW
The parts are CAD solids assembled at nominal dimensions, so mating faces are COINCIDENT --
zero gap, perfectly flush. Nothing in the physical world assembles like that. An FDM part
comes off the plate with elephant's foot, a bit of shrinkage, and a printed tolerance the
designer had to allow for; two printed parts bolted together always show a seam you can see
and usually one you can catch a fingernail in.

TWO CONTRIBUTIONS, BOTH REAL
1. A GAP. Each part is shrunk 0.15 mm along its normals via a Displace modifier. That is a
   realistic clearance for FDM -- you cannot print mating parts to nominal and have them go
   together. Uniform shrink means every interface in the assembly opens up by ~0.3 mm total
   without having to identify which faces mate, which would be hopeless across 19 parts.
2. A GROOVE. The fillet goes 0.35 -> 0.55 mm. Two rounded edges meeting across a gap form a
   V-groove that catches shadow -- which is what actually makes a seam READ, more than the
   gap width itself. 0.55 mm is above the ~0.2 mm a 0.4 mm nozzle strictly gives, and is a
   deliberate legibility choice: at 0.22 mm/px a 0.2 mm fillet is under a pixel.

MODIFIER ORDER MATTERS: Displace must precede Bevel, or the bevel is computed on the
un-shrunk mesh and then moved, which rounds the wrong geometry. The stack is rebuilt in
order rather than appended to, so this is safe to re-run.

Usage:  blender -b Untitled.blend -P scripts/add_part_gaps.py -- [--gap 0.00015] [--fillet 0.00055]
SAVES the .blend.
"""
import bpy, sys, math

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return float(argv[argv.index(name) + 1]) if name in argv else default


GAP = opt('--gap', 0.00015)          # 0.15 mm inset per part -> ~0.3 mm per interface
FILLET = opt('--fillet', 0.00055)    # 0.55 mm
SEGMENTS = int(opt('--segments', 3))
ANGLE = math.radians(30.0)
PRINTED = 'MattePLA_Black'

targets = [o for o in bpy.data.objects
           if o.type == 'MESH' and any(sl.material and sl.material.name == PRINTED
                                       for sl in o.material_slots)]
print(f"  {len(targets)} printed parts | gap {GAP*1000:.2f} mm inset | fillet {FILLET*1000:.2f} mm")

for o in targets:
    for md in list(o.modifiers):
        if md.type in ('DISPLACE', 'BEVEL', 'WEIGHTED_NORMAL'):
            o.modifiers.remove(md)
    for p in o.data.polygons:
        p.use_smooth = True

    # 1. shrink along normals. displacement = (tex_value - midlevel) * strength, and with no
    #    texture tex_value is 1.0, so midlevel 0.5 with a negative strength insets the shell.
    dsp = o.modifiers.new('PartGap', 'DISPLACE')
    dsp.mid_level = 0.5
    dsp.strength = -GAP * 2.0
    dsp.direction = 'NORMAL'

    # 2. then round the (already inset) edges
    bev = o.modifiers.new('Fillet', 'BEVEL')
    bev.width = FILLET
    bev.segments = SEGMENTS
    bev.limit_method = 'ANGLE'
    bev.angle_limit = ANGLE
    bev.miter_outer = 'MITER_ARC'
    bev.harden_normals = True

    wn = o.modifiers.new('WeightedNormal', 'WEIGHTED_NORMAL')
    wn.keep_sharp = True

print(f"  stack per part: Displace(-{GAP*1000:.2f} mm) -> Bevel({FILLET*1000:.2f} mm x{SEGMENTS}) -> WeightedNormal")
print(f"  at 1800 px across 400 mm (0.222 mm/px): gap ~{2*GAP*1000/0.2222:.1f} px, "
      f"fillet ~{FILLET*1000/0.2222:.1f} px")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - printed parts no longer mate perfectly")
