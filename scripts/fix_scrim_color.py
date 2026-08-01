"""RIG_ScrimR was left at pure white while the locked decision is `scrim stays #7aa2ff`.

At the old tight framing the white lobe sat mostly outside the frame, so it read as a
rim rather than a background. With the camera pulled back to 0.98 m the volumetric slab
renders its scatter cone in shot, and a white source through haze clips to a flat white
blob -- PBR Neutral desaturates on the way to clipping, so the scrim loses its colour
exactly where it is brightest.

Matching ScrimR to ScrimL's chromaticity is implementing the lock, not a new look choice.
Energy is left alone: it is a separate, director-owned decision.

SAVES the .blend.
"""
import bpy

SCRIM = (0.195, 0.361, 1.0)          # linear #7aa2ff -- same value RIG_ScrimL already holds

for name in ('RIG_ScrimL', 'RIG_ScrimR'):
    lt = bpy.data.objects[name].data
    before = tuple(round(c, 3) for c in lt.color)
    lt.color = SCRIM
    print(f"  {name:14} col {before} -> {SCRIM}  (energy {lt.energy:.1f}, untouched)")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - scrim chromaticity now matches the locked #7aa2ff")
