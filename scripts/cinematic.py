"""Cinematic SCARA showcase: blank title-card opening -> tilt onto the top cap ->
spiral descent along the column/arm with big joint motion -> pull back to the
classic hero framing. Runs headless: blender -b Untitled.blend -P cinematic.py
MODE env: PROBE (default; renders key frames, does NOT save) or FINAL
(saves .blend and renders all 120 frames to the usual output folder)."""
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
top = wc(bpy.data.objects["Part 1.007"])
elb = J2.matrix_world.translation.copy(); ex, ey = elb.x, elb.y
HERO_CAM = mu.Vector((0.135, -1.074, 0.102))
HERO_TGT = mu.Vector((0.003, -0.006, 0.307))
th = math.atan2(HERO_CAM.y - cy, HERO_CAM.x - cx)  # hero heading around column
print(f"ANCHORS column=({cx:.3f},{cy:.3f}) topcap_z={top.z:.3f} elbow=({ex:.3f},{ey:.3f},{elb.z:.3f}) hero_theta={math.degrees(th):.1f}")

def key(o, path, frame, value, index=-1):
    if path == "location.z":
        o.location.z = value; o.keyframe_insert("location", index=2, frame=frame)
    elif path == "rotation.z":
        o.rotation_euler.z = value; o.keyframe_insert("rotation_euler", index=2, frame=frame)
    elif path == "location":
        o.location = value; o.keyframe_insert("location", frame=frame)

# ---- joints: big, readable motion ----
r = math.radians
for f, v in [(1, 0), (45, r(26)), (85, r(-16)), (120, 0)]:
    key(J1, "rotation.z", f, v)
for f, v in [(1, 0.42), (30, 0.458), (70, 0.382), (120, 0.42)]:
    key(JZ, "location.z", f, v)
for f, v in [(1, 0), (55, r(45)), (90, r(-8)), (120, 0)]:
    key(J2, "rotation.z", f, v)

# ---- camera target: high above (blank) -> cap -> down the column -> elbow -> hero center ----
for f, p in [
    (1,   (cx, cy, 1.05)),
    (14,  (cx, cy, 0.52)),
    (28,  (cx, cy, 0.46)),
    (40,  (cx, cy, 0.40)),
    (55,  (ex, ey, 0.40)),
    (70,  (ex, ey, 0.37)),
    (85,  (0.02, -0.05, 0.34)),
    (105, tuple(HERO_TGT)),
    (120, tuple(HERO_TGT)),
]:
    key(ct, "location", f, p)

# ---- camera: spiral around the column, descending, then pull out to hero ----
def spiral(theta_off_deg, radius, z):
    a = th + math.radians(theta_off_deg)
    return (cx + radius * math.cos(a), cy + radius * math.sin(a), z)
for f, p in [
    (1,   spiral(30, 0.30, 0.80)),
    (14,  spiral(120, 0.33, 0.58)),
    (28,  spiral(185, 0.34, 0.44)),
    (40,  spiral(235, 0.37, 0.33)),
    (55,  spiral(285, 0.42, 0.25)),
    (70,  spiral(320, 0.50, 0.19)),
    (85,  spiral(345, 0.66, 0.14)),
    (105, tuple(HERO_CAM)),
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
    scene.render.resolution_x, scene.render.resolution_y = 700, 875
    scene.eevee.taa_render_samples = 24
    os.makedirs(SCRATCH, exist_ok=True)
    for f in (1, 8, 14, 28, 40, 55, 70, 85, 100, 120):
        scene.frame_set(f)
        scene.render.filepath = os.path.join(SCRATCH, f"probe_{f:03d}")
        bpy.ops.render.render(write_still=True)
    print("PROBES DONE")
else:
    bpy.ops.wm.save_mainfile()
    scene.render.film_transparent = True
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.resolution_x, scene.render.resolution_y = 1280, 1600
    scene.eevee.taa_render_samples = 64
    os.makedirs(FINAL_OUT, exist_ok=True)
    for f in range(1, 121):
        scene.frame_set(f)
        scene.render.filepath = os.path.join(FINAL_OUT, f"frame_{f:04d}")
        bpy.ops.render.render(write_still=True)
    print("FINAL RENDER DONE")
