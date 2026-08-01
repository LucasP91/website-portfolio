"""Render the SCARA hero film to RGBA PNGs.

`film_transparent = True` is the deliverable setting: the scrim, the rim lights and the
key still LIGHT the arm, they just stop being objects in frame. The film composites onto
the page background instead of carrying its own.

One consequence worth knowing: the volumetric haze slab is not a light, it is geometry
that scatters. It therefore still accumulates ALPHA and will render as a translucent
veil over the arm unless it is excluded. HAZE controls that.

Usage:
    blender -b Untitled.blend -P scripts/render_frames.py -- [--frames 1,24,50] [--haze]
                                                             [--res 480x600] [--samples 96]
                                                             [--out preview]
Defaults: all 288 frames, no haze, 480x600, 96 samples, into preview/.
"""
import bpy, os, sys

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return argv[argv.index(name) + 1] if name in argv else default


FRAMES = opt('--frames', None)
RES = opt('--res', '480x600')
SAMPLES = int(opt('--samples', 96))
OUT = os.path.join(os.path.dirname(bpy.data.filepath), opt('--out', 'preview'))
HAZE = '--haze' in argv

scene = bpy.context.scene
os.makedirs(OUT, exist_ok=True)

prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'OPTIX'
prefs.refresh_devices()
for d in prefs.devices:
    d.use = (d.type == 'OPTIX')

scene.render.engine = 'CYCLES'
scene.cycles.device = 'GPU'
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
# Adaptive sampling, per TO_BUILD_05 §6. That note said the HAZE was the sample sink and
# surfaces converge far earlier -- now that the haze is hidden from camera rays entirely,
# that is doubly true, so a flat count would spend most of its samples on converged pixels.
# Raising the ceiling while letting quiet pixels bail early is what buys the noise
# reduction that low-sample denoising was faking: temporal flicker in a moving shot is the
# denoiser inventing different detail each frame from different noise.
scene.cycles.use_adaptive_sampling = True
scene.cycles.adaptive_threshold = 0.005
scene.cycles.adaptive_min_samples = 64
scene.cycles.use_animated_seed = False           # scroll cut -- locked, TO_BUILD_02 §6
scene.render.resolution_x, scene.render.resolution_y = (int(v) for v in RES.split('x'))

# Lock the camera to the VERTICAL axis before touching resolution. With sensor_fit='AUTO'
# Blender fits whichever image dimension is LARGER, so widening a 1200x1500 portrait past
# square silently flips the fitted axis and re-frames the whole shot. Pinning it to VERTICAL
# means height is invariant and extra width only ever ADDS horizontal field -- which is
# exactly what "widen the frame, keep the height" has to mean.
cam = bpy.data.objects['Camera'].data
if cam.sensor_fit != 'VERTICAL':
    cam.sensor_fit = 'VERTICAL'
    print(f"  camera sensor_fit -> VERTICAL (height locked, width adds field)")
scene.view_settings.view_transform = 'Khronos PBR Neutral'

scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.image_settings.color_depth = '8'

def is_volume(ob):
    """True if any slot drives the material output's Volume input.

    Detect by SHADER, not by name -- the haze object here is called `RIG_Scrim`, which no
    sensible name filter would catch.
    """
    for sl in ob.material_slots:
        m = sl.material
        if not m or not m.use_nodes:
            continue
        for n in m.node_tree.nodes:
            if n.type == 'OUTPUT_MATERIAL':
                vi = n.inputs.get('Volume')
                if vi and vi.is_linked:
                    return True
    return False


# The haze slab is geometry, not light -- it scatters into the alpha channel and would lay
# a translucent veil across the arm. Hiding it from CAMERA rays only leaves its effect on
# light transport intact, so the arm is lit exactly as before.
hidden = []
if not HAZE:
    for o in bpy.data.objects:
        if o.type == 'MESH' and is_volume(o):
            o.visible_camera = False
            hidden.append(o.name)
print(f"  haze {'KEPT' if HAZE else 'hidden from camera: ' + (', '.join(hidden) or 'none found')}")
print(f"  {scene.render.resolution_x}x{scene.render.resolution_y}  {SAMPLES} spp  RGBA  "
      f"film_transparent={scene.render.film_transparent}")

frames = ([int(f) for f in FRAMES.split(',')] if FRAMES
          else range(scene.frame_start, scene.frame_end + 1))
for f in frames:
    scene.frame_set(f)
    scene.render.filepath = os.path.join(OUT, f"f_{f:04d}")
    bpy.ops.render.render(write_still=True)

print("RENDER DONE")
