"""Cinematic SCARA showcase v2: blank title-card opening -> tilt onto the top
cap -> descent along the column with an earlier, smoother pull-out -> camera
locks onto the hero framing by f90 while the arm performs big continuous
motion through the finale. Headless: blender -b Untitled.blend -P cinematic.py
CINE_MODE env: PROBE (key frames, no save) or FINAL (saves + renders 120)."""
import bpy, os, math, mathutils as mu

MODE = os.environ.get("CINE_MODE", "PROBE")
SCRATCH = r"C:\Users\Lucas\AppData\Local\Temp\claude\c--Users-Lucas-Documents-car-scraper\e488fc62-29da-421a-85af-6dff9758b264\scratchpad\cine_probe"
FINAL_OUT = r"C:\Users\Lucas\renders\turntable_web"

scene = bpy.context.scene
tt = bpy.data.objects["Turntable"]
cam = scene.camera
ct = bpy.data.objects["CamTarget"]
J1 = bpy.data.objects["JNT_J1"]
JZ = bpy.data.objects["JNT_Z"]
J2 = bpy.data.objects["JNT_J2"]

# ---- freeze the turntable at 90 deg (the classic profile heading) ----
for o in (tt, cam, ct, J1, JZ, J2):
    if o.animation_data:
        o.animation_data_clear()
tt.rotation_euler.z = math.radians(90)
bpy.context.view_layer.update()

# ---- anchors at this heading ----
def wc(o):
    return sum((o.matrix_world @ mu.Vector(c) for c in o.bound_box), mu.Vector()) / 8
col = wc(bpy.data.objects["lead screw"]); cx, cy = col.x, col.y
elb = J2.matrix_world.translation.copy(); ex, ey = elb.x, elb.y
HERO_CAM = mu.Vector((0.135, -1.074, 0.102))
HERO_TGT = mu.Vector((0.003, -0.006, 0.307))
HERO_CAM = HERO_TGT + (HERO_CAM - HERO_TGT) * 1.32  # widescreen pullback
th = math.atan2(HERO_CAM.y - cy, HERO_CAM.x - cx)

def key(o, path, frame, value):
    if path == "location.z":
        o.location.z = value; o.keyframe_insert("location", index=2, frame=frame)
    elif path == "rotation.z":
        o.rotation_euler.z = value; o.keyframe_insert("rotation_euler", index=2, frame=frame)
    elif path == "location":
        o.location = value; o.keyframe_insert("location", frame=frame)

# ---- joints: continuous, no reversals — J1 makes one full revolution (around
# the back and home to the front), Z descends once, elbow folds then extends
# continuously through the locked-off finale ----
r = math.radians
for f, v in [(1, 0), (120, r(360))]:
    key(J1, "rotation.z", f, v)
for f, v in [(1, 0.458), (120, 0.382)]:
    key(JZ, "location.z", f, v)
for f, v in [(1, 0), (70, r(50)), (120, r(-12))]:
    key(J2, "rotation.z", f, v)

# ---- camera target: cap -> column -> then TRACK the moving arm (sampled from
# the animated elbow every 8 frames) -> hero center (locked from f90) ----
def elbow_at(f):
    scene.frame_set(f)
    bpy.context.view_layer.update()
    return J2.matrix_world.translation.copy()

ct_keys = [
    (1,   (cx, cy, 1.05)),
    (14,  (cx, cy, 0.52)),
    (28,  (cx, cy, 0.46)),
]
for f in range(36, 85, 8):
    e = elbow_at(f)
    # aim 60% of the way from the column axis to the live elbow — follows the
    # sweep while keeping the tower anchored in frame
    ct_keys.append((f, (cx + 0.6 * (e.x - cx), cy + 0.6 * (e.y - cy), e.z)))
ct_keys += [(90, tuple(HERO_TGT)), (120, tuple(HERO_TGT))]
for f, pnt in ct_keys:
    key(ct, "location", f, pnt)

# ---- camera: gentler spiral, pulls out earlier, locked on hero from f90 ----
def spiral(theta_off_deg, radius, z):
    a = th + math.radians(theta_off_deg)
    return (cx + radius * math.cos(a), cy + radius * math.sin(a), z)
for f, p in [
    (1,   spiral(30, 0.30, 0.80)),
    (14,  spiral(120, 0.33, 0.58)),
    (28,  spiral(180, 0.36, 0.44)),
    (42,  spiral(225, 0.44, 0.32)),
    (58,  spiral(270, 0.60, 0.22)),
    (74,  spiral(310, 0.85, 0.15)),
    (90,  tuple(HERO_CAM)),
    (120, tuple(HERO_CAM)),
]:
    key(cam, "location", f, p)

scene.frame_start, scene.frame_end = 1, 120

# ---- render ----
scene.render.image_settings.file_format = 'PNG'
try:
    scene.eevee.use_raytracing = True
except Exception:
    pass
if MODE == "PROBE":
    scene.render.film_transparent = False
    scene.render.image_settings.color_mode = 'RGB'
    scene.render.resolution_x, scene.render.resolution_y = 640, 360
    scene.eevee.taa_render_samples = 24
    os.makedirs(SCRATCH, exist_ok=True)
    for f in list(range(1, 121, 6)) + [120]:
        scene.frame_set(f)
        scene.render.filepath = os.path.join(SCRATCH, f"probe_{f:03d}")
        bpy.ops.render.render(write_still=True)
    print("PROBES DONE")
else:
    bpy.ops.wm.save_mainfile()
    scene.render.film_transparent = True
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.resolution_x, scene.render.resolution_y = 1920, 1080
    scene.eevee.taa_render_samples = 64
    os.makedirs(FINAL_OUT, exist_ok=True)
    for f in range(1, 121):
        scene.frame_set(f)
        scene.render.filepath = os.path.join(FINAL_OUT, f"frame_{f:04d}")
        bpy.ops.render.render(write_still=True)
    print("FINAL RENDER DONE")
