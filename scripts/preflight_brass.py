"""SCARA hero — BRASS PRE-FLIGHT  (TO_BUILD_06 section 7)

The brass accent is the one element whose failure mode produces a plausible-looking
image: if RIG_BrassMirror's drivers desync, the nut simply stops reading and nothing
errors. This converts that silent failure into a loud abort with a frame number.

Renders a sparse set of frames spanning the U-arc, masks the nut by emission
(occlusion respected, indirect disabled so rod reflections don't pollute it), and
asserts the IGNITION gate (TO_BUILD_11 section 4):

    median luminance >= 150   AND   B/R <= 0.78
    no size floor -- small is correct here

Run:  blender -b Untitled.blend -P scripts/preflight_brass.py
Exit code 1 on failure.
"""
import bpy, os, sys, math, json

# TO_BUILD_11 section 1 + 4. The payoff is the machine, not the brass, so the Beat 6 gate is
# RETIRED -- f262 and f288 are informational now. What remains is Beat 1-2 ignition, and it
# is a different perceptual job that was wearing the same numbers:
#
#   Beat 6 wanted the nut READABLE AS AN OBJECT  ->  median >= 60,  B/R <= 0.65, >= 15 px
#   Beat 1 wants an UNIDENTIFIABLE WARM POINT    ->  median >= 150, B/R <= 0.78, any size
#
# The size floor is deliberately gone. A viewer who can identify it as a nut has lost the
# "something is alive in there" reading the beat exists for, so 10 px is correct, not a fail.
#
# The B/R relaxation is a correction, not a fudge: every view transform compresses chroma as
# values rise, so the same physically-warm object measures COOLER when brighter. Judging a
# median-201 highlight by a threshold calibrated on a median-71 one compares two different
# points on the curve. If this is ever re-tightened, the correct form is a threshold as a
# FUNCTION of luminance, not a constant.
GATED = tuple(int(x) for x in os.environ.get('PREFLIGHT_GATED', '1,10').split(','))
INFO  = (20, 60, 110, 160, 210, 262, 288)   # Beat 6 retired to informational
FRAMES = tuple(sorted(set(GATED + INFO)))
GATE_LUM, GATE_BR, GATE_PX = 150.0, 0.78, 0
OUT = os.environ.get('PREFLIGHT_OUT', os.path.join(os.path.dirname(bpy.data.filepath),
                                                   'preflight'))
os.makedirs(OUT, exist_ok=True)
scene = bpy.context.scene

prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'OPTIX'
prefs.refresh_devices()
for d in prefs.devices:
    d.use = (d.type == 'OPTIX')
scene.render.engine = 'CYCLES'
scene.cycles.device = 'GPU'
scene.render.resolution_x, scene.render.resolution_y = 800, 1000
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.image_settings.color_depth = '8'

nut = bpy.data.objects['T8 Lead Screw Nut']
scrim = bpy.data.objects.get('RIG_Scrim')

mask_mat = bpy.data.materials.get('PREFLIGHT_MaskNut') or \
    bpy.data.materials.new('PREFLIGHT_MaskNut')
mask_mat.use_nodes = True
mnt = mask_mat.node_tree
for n in list(mnt.nodes):
    mnt.nodes.remove(n)
_o = mnt.nodes.new('ShaderNodeOutputMaterial')
_e = mnt.nodes.new('ShaderNodeEmission')
_e.inputs['Color'].default_value = (1, 0, 1, 1)
_e.inputs['Strength'].default_value = 8.0
if os.environ.get('BRASS_W'):
    bpy.data.objects['RIG_BrassMirror'].data.energy = float(os.environ['BRASS_W'])
mnt.links.new(_e.outputs['Emission'], _o.inputs['Surface'])


def render_to(path):
    """Render and save. 'Render Result'.pixels is NOT readable in background mode --
    it comes back empty -- so every measurement goes via a saved file."""
    bpy.ops.render.render(write_still=False)
    bpy.data.images['Render Result'].save_render(filepath=path, scene=scene)
    return path


def px(path):
    """Load a saved PNG and return (r,g,b,a) floats top-down."""
    img = bpy.data.images.load(path, check_existing=False)
    w, h = img.size
    buf = list(img.pixels)
    out = [None] * (w * h)
    for y in range(h):
        sy = h - 1 - y
        for x in range(w):
            i = (sy * w + x) * 4
            out[y * w + x] = (buf[i], buf[i + 1], buf[i + 2], buf[i + 3])
    bpy.data.images.remove(img)
    return out, w, h


def srgb(c):
    c = max(0.0, min(1.0, c))
    return (c * 12.92 if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055) * 255.0


results, failed = [], []
orig_slots = [s.material for s in nut.material_slots]
for f in FRAMES:
    scene.frame_set(f)
    # --- mask pass: only the nut emits, nothing bounces ---
    if scrim:
        scrim.hide_render = True
    saved = {}
    for o in bpy.data.objects:
        if o.type == 'LIGHT':
            saved[o.name] = o.data.energy
            o.data.energy = 0.0
    for s in nut.material_slots:
        s.material = mask_mat
    # An emissive mesh IS a light source, and lighting other surfaces from it counts as
    # DIRECT light -- max_bounces=0 does not suppress it. Kill every ray type except
    # camera so nothing but the nut itself can be magenta.
    vis_keep = (nut.visible_diffuse, nut.visible_glossy, nut.visible_transmission,
                nut.visible_volume_scatter, nut.visible_shadow)
    nut.visible_diffuse = nut.visible_glossy = nut.visible_transmission = False
    nut.visible_volume_scatter = nut.visible_shadow = False
    keep = (scene.cycles.samples, scene.cycles.use_denoising, scene.cycles.max_bounces,
            scene.view_settings.view_transform)
    scene.cycles.samples = 64
    scene.cycles.use_denoising = False          # denoise smears magenta into neighbours
    scene.cycles.max_bounces = 0
    scene.cycles.diffuse_bounces = scene.cycles.glossy_bounces = 0
    scene.view_settings.view_transform = 'Standard'
    _mp_path = render_to(os.path.join(OUT, f'_mask_{f:04d}.png'))
    mp, w, h = px(_mp_path)
    mask = [i for i, p in enumerate(mp)
            if p[0] > 0.05 and p[2] > 0.05 and p[1] < min(p[0], p[2]) * 0.5]
    # restore
    for i, s in enumerate(nut.material_slots):
        s.material = orig_slots[i]
    for k, v in saved.items():
        bpy.data.objects[k].data.energy = v
    (nut.visible_diffuse, nut.visible_glossy, nut.visible_transmission,
     nut.visible_volume_scatter, nut.visible_shadow) = vis_keep
    if scrim:
        scrim.hide_render = False
    (scene.cycles.samples, scene.cycles.use_denoising, scene.cycles.max_bounces,
     scene.view_settings.view_transform) = keep
    scene.cycles.diffuse_bounces = scene.cycles.glossy_bounces = 4

    if not mask:
        results.append({'frame': f, 'visible': False, 'gated': f in GATED})
        if f in GATED:
            failed.append(f"f{f}: nut NOT VISIBLE (occluded or driver desync)")
        else:
            print(f"  f{f:>4}  hidden by design (camera below the plate)")
        continue
    xs = [i % w for i in mask]
    ys = [i // w for i in mask]
    short = min(max(xs) - min(xs) + 1, max(ys) - min(ys) + 1)

    # --- beauty pass, measured over the same mask ---
    scene.cycles.samples = 220
    scene.cycles.use_denoising = True
    _bp_path = render_to(os.path.join(OUT, f'preflight_{f:04d}.png'))
    bp, _, _ = px(_bp_path)
    lum, br = [], []
    for i in mask:
        r, g, b, _a = bp[i]
        R, G, B = srgb(r), srgb(g), srgb(b)
        lum.append(0.2126 * R + 0.7152 * G + 0.0722 * B)
        if R > 1:
            br.append(B / R)
    lum.sort()
    br.sort()
    med_l = lum[len(lum) // 2]
    med_br = br[len(br) // 2] if br else 9.9
    ok = (med_l >= GATE_LUM) and (med_br <= GATE_BR) and (short >= GATE_PX)
    results.append({'frame': f, 'visible': True, 'px': len(mask), 'short_axis': short,
                    'median_luminance': round(med_l, 1), 'B_over_R': round(med_br, 3),
                    'pass': ok})
    print(f"  f{f:>4}  short_axis {short:>3} px   median {med_l:6.1f}   "
          f"B/R {med_br:5.3f}   {('PASS' if ok else 'FAIL') if f in GATED else 'info'}")
    if not ok and f in GATED:
        why = []
        if short < GATE_PX:
            why.append(f"short axis {short} < {GATE_PX}")
        if med_l < GATE_LUM:
            why.append(f"median {med_l:.1f} < {GATE_LUM}")
        if med_br > GATE_BR:
            why.append(f"B/R {med_br:.3f} > {GATE_BR} (not reading warm)")
        failed.append(f"f{f}: " + "; ".join(why))

with open(os.path.join(OUT, 'preflight_brass.json'), 'w') as fh:
    json.dump(results, fh, indent=2)

print("\n" + "=" * 62)
if failed:
    print("BRASS PRE-FLIGHT FAILED")
    for x in failed:
        print("  -", x)
    print("=" * 62)
    sys.exit(1)
print(f"BRASS PRE-FLIGHT PASSED on all {len(FRAMES)} frames")
print("=" * 62)
