"""Put the print texture in OBJECT space and make it legible.

TWO BUGS, ONE OF THEM ANIMATION-BREAKING

1. WORLD SPACE. The layer wave is driven by `Geometry.Position.Z` and the top/wall mask by
   `Geometry.Normal.Z`. Both are WORLD space in Cycles. A part that rotates or translates
   therefore slides through a stationary field of stripes -- the texture swims across the
   surface instead of being printed into it, and the "top" mask drifts onto walls as the
   part turns. On a still frame this is invisible. In an animation it is the artifacting.
   Layer lines are laid down in the part's own frame at print time, so they must be driven
   from OBJECT coordinates. Fixed by feeding Texture Coordinate > Object, and by
   transforming the normal World -> Object before taking its Z.

2. INVISIBLE AT THIS SCALE. Bump Strength 0.12 over Distance 0.0002 m is ~0.024 mm of
   relief. That is physically right for a 0.28 mm layer, and it is why nothing reads: at
   1200 px across a 400 mm machine one pixel is 0.33 mm, so the 0.28 mm layer pitch is
   0.85 px. STATE's own BRDF rule says a repeating feature under ~2 px must live in the
   BRDF, not in geometry -- so the LINES come from anisotropy, and the bump is only there
   to break up the specular. Raising bump alone would just alias.

SAVES the .blend.
"""
import bpy

m = bpy.data.materials['MattePLA_Black']
nt = m.node_tree
N = nt.nodes

print("=== Principled BSDF, full input list ===")
bsdf = next(n for n in N if n.type == 'BSDF_PRINCIPLED')
for i in bsdf.inputs:
    if i.is_linked:
        print(f"  {i.name:24} <- {i.links[0].from_node.name}.{i.links[0].from_socket.name}")
    elif hasattr(i, 'default_value'):
        v = i.default_value
        try:
            v = tuple(round(x, 3) for x in v)
        except TypeError:
            v = round(v, 4) if isinstance(v, float) else v
        print(f"  {i.name:24} =  {v}")

geo = next(n for n in N if n.type == 'NEW_GEOMETRY')
sep_norm = next(n for n in N if n.type == 'SEPXYZ' and n.name == 'Separate XYZ')
sep_pos = next(n for n in N if n.type == 'SEPXYZ' and n.name == 'Separate XYZ.001')

# ---- 1a. position -> object space ------------------------------------------------
texco = next((n for n in N if n.type == 'TEX_COORD'), None) or N.new('ShaderNodeTexCoord')
texco.name = 'ObjectCoords'
texco.location = (geo.location.x, geo.location.y - 300)
for l in list(sep_pos.inputs['Vector'].links):
    nt.links.remove(l)
nt.links.new(texco.outputs['Object'], sep_pos.inputs['Vector'])
print("\n  position  Geometry.Position -> TextureCoordinate.Object")

# ---- 1b. normal -> object space ---------------------------------------------------
vt = next((n for n in N if n.type == 'VECT_TRANSFORM'), None) or N.new('ShaderNodeVectorTransform')
vt.name = 'NormalToObject'
vt.vector_type = 'NORMAL'
vt.convert_from = 'WORLD'
vt.convert_to = 'OBJECT'
vt.location = (geo.location.x + 160, geo.location.y)
nt.links.new(geo.outputs['Normal'], vt.inputs['Vector'])
for l in list(sep_norm.inputs['Vector'].links):
    nt.links.remove(l)
nt.links.new(vt.outputs['Vector'], sep_norm.inputs['Vector'])
print("  normal    Geometry.Normal   -> VectorTransform(World->Object, NORMAL)")

# The wall/top mask compares |Normal.Z|, so keep the abs() the graph already applies.
mth = next(n for n in N if n.name == 'Math' and n.type == 'MATH')
print(f"  wall/top mask node '{mth.name}' operation = {mth.operation}")

# ---- 2. legibility ----------------------------------------------------------------
bump = next(n for n in N if n.type == 'BUMP')
bump.inputs['Strength'].default_value = 0.30
print(f"  bump strength 0.12 -> 0.30  (still only breaking up the specular; the LINES "
      f"come from anisotropy)")

aniso = bsdf.inputs.get('Anisotropic')
if aniso is not None and not aniso.is_linked:
    mr2 = next((n for n in N if n.name == 'Map Range.002'), None)
    if mr2:
        nt.links.new(mr2.outputs['Result'], aniso)
        print("  Anisotropic was UNLINKED -> connected to Map Range.002 (0.4 walls / 0.1 tops)")
    else:
        aniso.default_value = 0.4
        print("  Anisotropic was UNLINKED -> set 0.4 flat (no ramp node found)")
elif aniso is not None:
    print(f"  Anisotropic already linked from {aniso.links[0].from_node.name}")

tan = next((n for n in N if n.type == 'TANGENT'), None)
rot = bsdf.inputs.get('Anisotropic Rotation')
if tan is not None:
    print(f"  Tangent node present: direction_type={tan.direction_type} axis={tan.axis}")
    if bsdf.inputs.get('Tangent') is not None and not bsdf.inputs['Tangent'].is_linked:
        nt.links.new(tan.outputs['Tangent'], bsdf.inputs['Tangent'])
        print("  Tangent was UNLINKED -> connected to Principled.Tangent")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - print texture is now object-space and legible")
