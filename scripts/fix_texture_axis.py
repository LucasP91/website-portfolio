"""Point the print texture along the part's actual UP axis, and give tops the plate finish.

THE BUG
Switching to object space fixed the swimming, but I then used object-space **Z** as the
layer-stacking axis. Every one of the 19 printed parts has local +Z pointing HORIZONTALLY
(measured: 90.0 deg from world up, all of them). So the layer wave stacked sideways and the
stripes ran vertically down the parts. The same wrong axis fed the |Normal.Z| top/wall mask,
which is why top faces got wall texture instead of the build-plate finish.

THE AXIS
World up expressed in object space is exactly local **+/-Y** for all 19 parts, alignment
1.000. Nine are +Y and ten are -Y, which does not matter: the layer signal is a sine, so a
sign flip is a phase shift, and the mask takes an absolute value.

WHY IT IS STILL SAFE TO BAKE A FIXED AXIS
up_object = M^-1 . z_world. For a rotation about world Z, M = R_z(theta) . R_rest, so
M^-1 . z = R_rest^-1 . R_z(-theta) . z = R_rest^-1 . z -- the theta drops out because
R_z leaves z_world invariant. A SCARA only rotates about world Z, and the carriage only
TRANSLATES, which object coordinates ignore. So this axis is constant for the whole film.

ALSO RESTORED: tops get the PEI plate pebble, walls get layer lines. I had unlinked that
mask when chasing visibility, which put pebble on everything.

SAVES the .blend.
"""
import bpy

m = bpy.data.materials['MattePLA_Black']
nt = m.node_tree
N = nt.nodes

sep_pos = next(n for n in N if n.name == 'Separate XYZ.001')   # object-space POSITION
sep_nrm = next(n for n in N if n.name == 'Separate XYZ')       # object-space NORMAL
mix_h = next(n for n in N if n.name == 'Mix.001')
mask = next(n for n in N if n.name == 'Map Range')             # |up| -> 0 wall / 1 top

# ---- 1. layer wave + Z-wobble stack along Y, not Z --------------------------------
moved = []
for consumer, sock in (('Math.001', 0), ('ZWobble_Freq', 0)):
    node = next((n for n in N if n.name == consumer), None)
    if not node:
        continue
    for l in list(node.inputs[sock].links):
        nt.links.remove(l)
    nt.links.new(sep_pos.outputs['Y'], node.inputs[sock])
    moved.append(consumer)
print(f"  layer axis  position.Z -> position.Y   for {', '.join(moved)}")

# ---- 2. top/wall mask reads the same axis -----------------------------------------
mth = next(n for n in N if n.name == 'Math' and n.operation == 'ABSOLUTE')
for l in list(mth.inputs[0].links):
    nt.links.remove(l)
nt.links.new(sep_nrm.outputs['Y'], mth.inputs[0])
print("  mask axis   |normal.Z| -> |normal.Y|")

# ---- 3. tops = PEI plate pebble, walls = layer lines ------------------------------
for l in list(mix_h.inputs['Factor'].links):
    nt.links.remove(l)
nt.links.new(mask.outputs['Result'], mix_h.inputs['Factor'])
print("  Mix.001 Factor re-linked to the mask: TOPS get the plate pebble, WALLS get layers")

# The mask ramp was tuned when it was reading a wrong axis; widen it slightly so top faces
# resolve cleanly as tops rather than half-blending into wall texture.
mask.inputs['From Min'].default_value = 0.62
mask.inputs['From Max'].default_value = 0.90
print(f"  mask ramp   |up| 0.62 -> 0.90")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - texture now stacks along the real print axis")
