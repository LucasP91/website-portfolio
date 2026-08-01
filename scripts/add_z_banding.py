"""Add Z-wobble banding -- the print artifact that is actually visible at this framing.

WHY THE WALLS STAY GLASSY NO MATTER WHAT
The wall texture is the 0.28 mm layer wave. At 1200 px across a 400 mm machine that is
0.8 px. No bump strength, roughness ramp or sample count resolves a feature below Nyquist;
raising bump just makes the renderer average a steeper wiggle over the same sub-pixel
footprint. This is the locked BRDF rule, and it is not negotiable at this framing.

WHAT IS VISIBLE ON A REAL PRINT FROM A METRE AWAY
Not individual layers -- BANDING. Lead-screw Z axes produce a periodic error (Z-wobble)
from screw runout and coupler misalignment, which modulates layer thickness with a period
equal to the screw lead, typically 2-8 mm. Flow variation adds more of the same. That is
the horizontal striping you see on a printed part across a room, and it is what reads in
the reference photo -- not 0.28 mm layers.

This machine has a T8 lead screw driving Z, so the artifact is not only plausible, it is
expected. Period is set to the T8's 8 mm lead: at 1200 px that is 24 px, comfortably
resolvable, and it rides ON TOP of the honest 0.28 mm wave rather than replacing it.

Walls only. Top faces keep the build-plate pebble.

SAVES the .blend.
"""
import bpy, math

m = bpy.data.materials['MattePLA_Black']
nt = m.node_tree
N = nt.nodes

sep_pos = next(n for n in N if n.name == 'Separate XYZ.001')     # object-space position
mix_h = next(n for n in N if n.name == 'Mix.001')                # wall/top height selector
bump = next(n for n in N if n.type == 'BUMP')

LEAD_MM = 8.0                                                    # T8 lead screw -> 8 mm/rev
freq = 2.0 * math.pi / (LEAD_MM / 1000.0)                        # rad per metre

def mk(t, name, **kw):
    n = next((x for x in N if x.name == name), None) or N.new(t)
    n.name = n.label = name
    for k, v in kw.items():
        setattr(n, k, v)
    return n

# sin(Z * 2pi / lead) -> 0..1
wob = mk('ShaderNodeMath', 'ZWobble_Freq', operation='MULTIPLY')
wob.inputs[1].default_value = freq
nt.links.new(sep_pos.outputs['Z'], wob.inputs[0])

sin = mk('ShaderNodeMath', 'ZWobble_Sin', operation='SINE')
nt.links.new(wob.outputs['Value'], sin.inputs[0])

norm = mk('ShaderNodeMapRange', 'ZWobble_Norm')
norm.inputs['From Min'].default_value = -1.0
norm.inputs['From Max'].default_value = 1.0
norm.inputs['To Min'].default_value = 0.0
norm.inputs['To Max'].default_value = 1.0
nt.links.new(sin.outputs['Value'], norm.inputs['Value'])

# Ride it on top of the existing height signal rather than replacing it: the 0.28 mm wave
# stays honest and keeps doing its job in any close-up framing.
add = mk('ShaderNodeMix', 'ZWobble_Add', data_type='FLOAT', blend_type='MIX')
add.inputs['Factor'].default_value = 0.55
src = mix_h.outputs['Result']
nt.links.new(src, add.inputs[2])          # A
nt.links.new(norm.outputs['Result'], add.inputs[3])   # B
nt.links.new(add.outputs['Result'], bump.inputs['Height'])

bump.inputs['Distance'].default_value = 0.0009
bump.inputs['Strength'].default_value = 0.6

px = (LEAD_MM) / (400.0 / 1200.0)
print(f"  Z-wobble banding: period {LEAD_MM:.1f} mm (T8 lead) = {px:.0f} px at 1200 px wide")
print(f"  mixed at 0.55 over the 0.28 mm layer wave; bump 0.0009 m @ 0.60")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - walls now carry resolvable Z-wobble banding")
