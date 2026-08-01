"""Make the print texture actually resolvable, and fix a scale that was simply wrong.

THE ARITHMETIC THAT DECIDES THIS
At 1200 px across a ~400 mm machine, one pixel is 0.33 mm. So:

    layer pitch       0.28 mm  ->  0.85 px      below Nyquist. Cannot resolve. Ever.
    build-plate noise 0.38 mm  ->  1.15 px      below Nyquist. Cannot resolve.

Both features are finer than the sampler can carry, which is why 4.5x exposure showed
glassy walls. Raising Bump Strength does not help -- it makes the renderer average a
steeper wiggle over the same sub-pixel footprint. That IS the locked BRDF rule biting.

WHAT IS ACTUALLY WRONG, AS OPPOSED TO MERELY SMALL
Noise Scale 2600 gives ~0.38 mm features. A real textured-PEI sheet has a pebble on the
order of 1-2 mm -- you can see it by eye from across a room. 0.38 mm was too fine to be
correct in the first place, so coarsening it to ~1.3 mm is a CORRECTION, not a cheat, and
it lands at ~4 px where it reads.

The 0.28 mm layer pitch is NOT adjustable -- it is the real layer height, and faking it
coarser would be inventing a machine that does not exist. Layer lines resolve at roughly
2400 px for this framing, or in any genuine close-up. Left honest and left small.

Bump distance goes up because relief that survives averaging has to be deeper: 0.0002 m
over a 1.3 mm pebble is a mirror-smooth dimple.

SAVES the .blend.
"""
import bpy

m = bpy.data.materials['MattePLA_Black']
N = m.node_tree.nodes

noise = next(n for n in N if n.type == 'TEX_NOISE')
bump = next(n for n in N if n.type == 'BUMP')

before_scale = noise.inputs['Scale'].default_value
before_dist = bump.inputs['Distance'].default_value
before_str = bump.inputs['Strength'].default_value

# Object space is metres, so Scale N gives features of roughly 1/N metres.
noise.inputs['Scale'].default_value = 750.0        # ~1.33 mm pebble -> ~4 px at 1200 px
noise.inputs['Detail'].default_value = 4.0         # finer structure riding the pebble
noise.inputs['Roughness'].default_value = 0.6

bump.inputs['Distance'].default_value = 0.0006     # 0.6 mm of relief across the pebble
bump.inputs['Strength'].default_value = 0.5

px_at = lambda mm, w: mm / (400.0 / w)
print(f"  noise scale   {before_scale:.0f} -> 750   "
      f"({1000/before_scale:.2f} mm -> 1.33 mm feature)")
print(f"  bump distance {before_dist:.4f} -> 0.0006 m,  strength {before_str:.2f} -> 0.50")
print()
print(f"  RESOLVABILITY at 400 mm subject width:")
for w in (1200, 1800, 2400):
    print(f"    {w:5} px  ({400.0/w:.3f} mm/px)   "
          f"pebble 1.33 mm = {px_at(1.33, w):4.1f} px   "
          f"layer 0.28 mm = {px_at(0.28, w):4.1f} px")
print("  (a feature needs >= ~2 px to read as itself rather than as haze)")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - build-plate pebble corrected to a real PEI scale and made resolvable")
