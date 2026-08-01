"""Give the plate-facing surfaces a real textured-PEI finish: crystalline, and deeper than walls.

WHY SMOOTH NOISE WAS NEVER GOING TO LOOK LIKE PEI
A powder-coated PEI sheet is not a soft dimpled surface -- it is a field of hard-edged
crystalline flakes with sharp boundaries between them. Perlin-style noise is smooth by
construction: it has continuous derivatives everywhere, so it can only ever produce rolling
dunes. That is why the "pebble" read as vague mottling rather than as the aggressive grain
the plate actually leaves in the first layer.

Voronoi is the right primitive. Its cells have discontinuous edges, which is exactly the
flake-boundary structure. Two features are combined:

  F1               per-cell distance -> each flake gets its own height, faceted not rounded
  DISTANCE_TO_EDGE crisp ridges along the cell boundaries -> the hard grain lines

MAKING IT DEEPER THAN THE WALLS
There is one Bump node for the whole material, so wall and plate signals share a Distance.
Relative depth therefore has to come from signal AMPLITUDE. The wall chain outputs roughly
0..1; scaling the plate chain to 0..GAIN (default 1.9) gives the plate that much more relief
without touching the walls. Bump is a height field, so values above 1 are fine.

BOTH FACES ALREADY QUALIFY: the mask is |world Normal.Z|, which is sign-agnostic, so
downward-facing surfaces get the same treatment as upward ones -- correct, since the first
layer against the plate is usually what ends up facing down in the assembly.

Usage:
  blender -b Untitled.blend -P scripts/pei_plate_texture.py --
      [--cell 620]   Voronoi scale; ~1/cell metres per flake (620 -> ~1.6 mm)
      [--gain 1.9]   plate relief relative to walls
      [--edge 0.45]  how much crisp edge-ridging to mix in
      [--mask 0.55]  |Normal.Z| at which a face starts counting as plate-facing
SAVES the .blend.
"""
import bpy, sys

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return float(argv[argv.index(name) + 1]) if name in argv else default


CELL = opt('--cell', 620.0)
GAIN = opt('--gain', 1.9)
EDGE = opt('--edge', 0.45)
MASK = opt('--mask', 0.55)

m = bpy.data.materials['MattePLA_Black']
nt = m.node_tree
N = nt.nodes

texco = next(n for n in N if n.type == 'TEX_COORD')
mix_h = next(n for n in N if n.name == 'Mix.001')
pebble = next(n for n in N if n.name == 'Noise Texture')
mask = next(n for n in N if n.name == 'Map Range')


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


# ---- 1. flake heights -------------------------------------------------------------
v1 = mk('ShaderNodeTexVoronoi', 'PEI_Flakes')
v1.feature = 'F1'
v1.distance = 'EUCLIDEAN'
v1.inputs['Scale'].default_value = CELL
v1.inputs['Randomness'].default_value = 1.0
nt.links.new(texco.outputs['Object'], v1.inputs['Vector'])

f1c = mk('ShaderNodeMapRange', 'PEI_FlakeContrast')
f1c.inputs['From Min'].default_value = 0.0
f1c.inputs['From Max'].default_value = 0.55
f1c.inputs['To Min'].default_value = 0.0
f1c.inputs['To Max'].default_value = 1.0
f1c.clamp = True
nt.links.new(v1.outputs['Distance'], f1c.inputs['Value'])

# ---- 2. crisp grain boundaries ----------------------------------------------------
v2 = mk('ShaderNodeTexVoronoi', 'PEI_Edges')
v2.feature = 'DISTANCE_TO_EDGE'
v2.inputs['Scale'].default_value = CELL
v2.inputs['Randomness'].default_value = 1.0
nt.links.new(texco.outputs['Object'], v2.inputs['Vector'])

e1 = mk('ShaderNodeMapRange', 'PEI_EdgeSharpen')
e1.inputs['From Min'].default_value = 0.0
e1.inputs['From Max'].default_value = 0.16          # narrow -> hard ridge, not a soft valley
e1.inputs['To Min'].default_value = 0.0
e1.inputs['To Max'].default_value = 1.0
e1.clamp = True
nt.links.new(v2.outputs['Distance'], e1.inputs['Value'])

# ---- 3. flakes + edges + a little of the old noise so it is not too regular --------
mixe = mk('ShaderNodeMix', 'PEI_Mix', data_type='FLOAT', blend_type='MIX')
mixe.inputs['Factor'].default_value = EDGE
nt.links.new(f1c.outputs['Result'], mixe.inputs[2])
nt.links.new(e1.outputs['Result'], mixe.inputs[3])

pebble.inputs['Scale'].default_value = CELL * 2.4   # fine grit riding on the flakes
pebble.inputs['Detail'].default_value = 6.0
grit = mk('ShaderNodeMix', 'PEI_Grit', data_type='FLOAT', blend_type='MIX')
grit.inputs['Factor'].default_value = 0.26
nt.links.new(mixe.outputs[0], grit.inputs[2])
nt.links.new(pebble.outputs['Factor'], grit.inputs[3])

# ---- 4. deeper than the walls -----------------------------------------------------
gain = mk('ShaderNodeMath', 'PEI_Gain', operation='MULTIPLY')
nt.links.new(grit.outputs[0], gain.inputs[0])
gain.inputs[1].default_value = GAIN

# feed it into whichever Mix.001 socket the plate texture occupied
for i in mix_h.inputs:
    for l in list(i.links):
        if l.from_node.name in ('Noise Texture', 'PEI_Gain'):
            nt.links.remove(l)
            nt.links.new(gain.outputs['Value'], i)

# ---- 5. let more near-horizontal faces count as plate-facing ----------------------
mask.inputs['From Min'].default_value = MASK
mask.inputs['From Max'].default_value = min(0.97, MASK + 0.30)

print(f"  Voronoi F1 + DISTANCE_TO_EDGE at scale {CELL:.0f} (~{1000/CELL:.2f} mm flakes)")
print(f"  edge mix {EDGE:.2f}, fine grit {CELL*2.4:.0f} at 0.26")
print(f"  plate relief x{GAIN:.2f} vs walls (shared Bump, so amplitude carries it)")
print(f"  mask |Normal.Z| {MASK:.2f} -> {min(0.97, MASK+0.30):.2f}  (top AND bottom, it is |.|)")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - crystalline PEI plate finish on plate-facing surfaces")
