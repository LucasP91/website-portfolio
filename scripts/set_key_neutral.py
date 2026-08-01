"""Toggle the warm-key colour temperature.

TO_BUILD_04 locked "WARM KEY / COOL SCRIM -- key 3000 K, rims 3200 K, temperature on the
LIGHTS, never on a grade node." That is implemented with Blender 4.5+/5.x's `use_temperature`
property, which is SEPARATE from `light.color` -- so every audit that read `.color` reported
these lights as pure white while they were in fact 3000 K.

The reference render on the site measures B/R 1.029, i.e. dead neutral. This film measures
0.429. That difference is entirely this property.

Usage:  blender -b Untitled.blend -P scripts/set_key_neutral.py -- [--neutral | --warm]
SAVES the .blend.
"""
import bpy, sys
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
NEUTRAL = '--neutral' in argv
WARM = {'RIG_Key': 3000.0, 'RIG_RimL': 3200.0, 'RIG_RimR': 3200.0, 'RIG_BrassMirror': 2900.0}
for nm, t in WARM.items():
    ob = bpy.data.objects.get(nm)
    if not ob:
        continue
    # BrassMirror stays warm either way -- it is the ignition accent, and TO_BUILD_11 keeps
    # it as the one warm element. Neutralising it would delete Beat 1.
    if NEUTRAL and nm != 'RIG_BrassMirror':
        ob.data.use_temperature = False
        print(f"  {nm:18} temperature OFF (was {t:.0f} K)")
    else:
        ob.data.use_temperature = True
        ob.data.temperature = t
        print(f"  {nm:18} {t:.0f} K")
bpy.ops.wm.save_mainfile()
print(f"\nBLEND SAVED - {'NEUTRAL' if NEUTRAL else 'WARM'} key")
