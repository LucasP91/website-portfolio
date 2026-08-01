"""World-oriented layer planes that ride with the part. Fixes direction AND swimming.

WHY OBJECT SPACE WAS NEVER GOING TO BE RIGHT
Object coordinates rotate with the part, so the layer planes tilt whenever a part's local
frame is not perfectly upright. Measurement said world-up was exactly local +/-Y, and for
the arm links it is -- but "exactly" was measured per object origin, and any part whose
mesh sits at an angle inside its own local frame still gets tilted planes. That is the
45 degree slant: planes following the part instead of following gravity.

Layer planes are laid down by a printer against GRAVITY. They are horizontal, full stop,
and they do not care how the part is oriented in the assembly.

THE FIX
Drive the wave from WORLD Z -- which gives dead-level planes everywhere, exactly like the
original -- but subtract the object's own world Z via the Object Info node:

    height = Position.Z  -  ObjectInfo.Location.Z

Position.Z is world, so the planes stay horizontal. Subtracting the object's origin height
makes the field TRAVEL WITH the part, so the carriage descending 120 mm no longer slides
through a stationary set of stripes. Level like world space, static like object space.

The top/wall mask goes back to world Normal.Z for the same reason: a "top face" is one
pointing at the sky. Parts only rotate about world Z here, so their tops stay tops.

Layer pitch is set to 1.6 mm. That is NOT a single 0.28 mm layer -- it is the flow/banding
group that is actually visible on a print from a distance, and unlike 0.28 mm (~1 px, pure
aliasing) it resolves at ~7 px. Called out so nobody later reads it as layer height.

SAVES the .blend.
"""
import bpy, math

m = bpy.data.materials['MattePLA_Black']
nt = m.node_tree
N = nt.nodes

geo = next(n for n in N if n.type == 'NEW_GEOMETRY')
sep_pos = next(n for n in N if n.name == 'Separate XYZ.001')
sep_nrm = next(n for n in N if n.name == 'Separate XYZ')


def mk(t, name, **kw):
    n = next((x for x in N if x.name == name), None) or N.new(t)
    n.name = n.label = name
    for k, v in kw.items():
        setattr(n, k, v)
    return n


# ---- position: WORLD, so planes are level ----------------------------------------
for l in list(sep_pos.inputs['Vector'].links):
    nt.links.remove(l)
nt.links.new(geo.outputs['Position'], sep_pos.inputs['Vector'])

# ---- minus the object's own height, so the field rides with the part --------------
oinfo = mk('ShaderNodeObjectInfo', 'ObjInfo')
sep_loc = mk('ShaderNodeSeparateXYZ', 'SepObjLoc')
nt.links.new(oinfo.outputs['Location'], sep_loc.inputs['Vector'])

rel = mk('ShaderNodeMath', 'HeightRelToObject', operation='SUBTRACT')
nt.links.new(sep_pos.outputs['Z'], rel.inputs[0])
nt.links.new(sep_loc.outputs['Z'], rel.inputs[1])
print("  height = world Position.Z - ObjectInfo.Location.Z  (level planes, no swim)")

for name in ('Math.001', 'ZWobble_Freq'):
    node = next((n for n in N if n.name == name), None)
    if not node:
        continue
    for l in list(node.inputs[0].links):
        nt.links.remove(l)
    nt.links.new(rel.outputs['Value'], node.inputs[0])
print("  layer wave + Z-wobble both driven from it")

# ---- mask: world normal Z. a "top" is a face pointing at the sky ------------------
mth = next(n for n in N if n.name == 'Math' and n.operation == 'ABSOLUTE')
for l in list(sep_nrm.inputs['Vector'].links):
    nt.links.remove(l)
nt.links.new(geo.outputs['Normal'], sep_nrm.inputs['Vector'])
for l in list(mth.inputs[0].links):
    nt.links.remove(l)
nt.links.new(sep_nrm.outputs['Z'], mth.inputs[0])
print("  mask = |world Normal.Z|")

# ---- pitch that actually resolves -------------------------------------------------
PITCH_MM = 1.6
mul = next(n for n in N if n.name == 'Math.001')
mul.inputs[1].default_value = 2.0 * math.pi / (PITCH_MM / 1000.0)
lw = next(n for n in N if n.name == 'Map Range.003')
lw.inputs['To Min'].default_value = 0.15
lw.inputs['To Max'].default_value = 0.85
print(f"  layer band pitch {PITCH_MM} mm = {PITCH_MM/(400.0/1800.0):.1f} px "
      f"(banding group, NOT 0.28 mm layer height)")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - level layer planes that travel with each part")
