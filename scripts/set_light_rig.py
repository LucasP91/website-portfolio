"""Set absolute rig energies. Contrast, not just level.

Scaling every light by one gain got p50/p75/p90 onto the reference but left p25 at ~60
against a reference ~18. Level and CONTRAST are different controls: the key sets where the
highlights land, the fill sets where the shadows stop. One multiplier moves both together
and produces a bright FLAT image, which is the same complaint in a different direction.

The reference holds a very wide spread -- p25 ~18 with p50 ~77 -- so it is strongly keyed
with the shadow side left to fall away. That is what this sets: key and rods stay up
because they carry the highlights and the rods are the precise bright elements; the rims
and the now-offscreen scrims come down hard because all they do on an alpha render is fill
shadow that the reference deliberately leaves empty.

Usage:  blender -b Untitled.blend -P scripts/set_light_rig.py -- [--key 7.1] [--rimL 1.6] ...
SAVES the .blend.
"""
import bpy, sys

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return float(argv[argv.index(name) + 1]) if name in argv else default


ENERGY = {
    'RIG_Key':         opt('--key',    7.10),   # carries the highlights -- stays up
    'RIG_Rods':        opt('--rods',   2.66),   # the precise bright elements -- stays up
    'RIG_RimL':        opt('--rimL',   1.60),   # was 5.35 -- pure shadow fill on alpha
    'RIG_RimR':        opt('--rimR',   1.00),   # was 3.56
    'RIG_BrassMirror': opt('--brass',  1.80),   # Beat 1-2 ignition accent
    'RIG_ScrimL':      opt('--scrimL', 20.0),   # was 52 -- offscreen now, so it is fill
    'RIG_ScrimR':      opt('--scrimR', 14.0),   # was 36
}

for nm, e in ENERGY.items():
    ob = bpy.data.objects.get(nm)
    if not ob:
        print(f"  !! {nm} not found")
        continue
    before = ob.data.energy
    ob.data.energy = e
    print(f"  {nm:18} {before:8.3f} W -> {e:8.3f} W")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - rig set")
