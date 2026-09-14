"""Re-key JNT_J1 (the base) alone: one gentle opening turn, and a slow final reversal.

WHY
Measured on the delivered web frames: for the first ~20 scroll steps only the camera moved,
then J1 snapped from 168 out to 256 and back to 150 inside ~45 master frames at 300 deg/s --
up to 18 deg per scroll step, and the frame-to-frame change jumped to ~2x the film's median.
On the page that read as a sudden jerk right after a calm start.

With that smoothed, the biggest remaining jumps (~3x the median) were the final move at
f175, where J1 turned +60 at 300 deg/s while J2 swung 40 deg back off its stop and the
camera rose to the overhead shot. Lucas (2026-09-14): that last snap to the final pose goes
too quickly by comparison with the rest of the film.

WHAT
One slow move from 168 to 150 on a gentle trapezoid. Then the final move keeps its end pose
(150 -> 210) but runs at 40 deg/s with a soft 100 deg/s^2 ramp: ~91 frames instead of ~22,
finishing about f266 together with J2, so the machine holds its final pose while the camera
finishes. --rev 0 cuts the final move entirely; --rev-vmax 300 --rev-amax 1100 restores the
original snap.

Only J1 is touched. rekey_motion.py would rebuild the camera too, whose accepted keys were
never recorded as CLI flags.

Usage:
    blender -b Untitled.blend -P scripts/rekey_j1.py -- [--start 40] [--vmax 20] [--amax 60]
                                                        [--rev 60] [--rev-vmax 40]
                                                        [--rev-amax 100] [--dry-run]
                                                        [--changed-out FILE]
--dry-run reports without writing keys or saving. --changed-out writes the comma-separated
list of frames whose J1 angle moves by more than 0.02 deg (about half a pixel at the arm's
tip in the master), i.e. the frames that need re-rendering.
SAVES the .blend unless --dry-run.
"""
import bpy, sys, os, math

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import motion as M

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return float(argv[argv.index(name) + 1]) if name in argv else default


def sopt(name, default):
    return argv[argv.index(name) + 1] if name in argv else default


DRY = '--dry-run' in argv
CHANGED_OUT = sopt('--changed-out', '')

TS, FPS, CTRL_HZ = 2.0, 24.0, 25.0
D2R = math.radians
F0, ZETA = 12.0, 0.10          # J1's 2nd-order response, as in rekey_motion.py
REST = 168.0

START = opt('--start', 40.0)
REV = opt('--rev', 60.0)                  # the final move at f175; 0 = cut
REV_VMAX = opt('--rev-vmax', 40.0)        # was 300 -- the snap
REV_AMAX = opt('--rev-amax', 100.0)       # was 1100
# (start frame, delta deg, vmax deg/s, amax deg/s^2). Zero-length moves are dropped: a
# trapezoid of zero distance is not a hold, and feeding one to the planner is asking for noise.
SEGS = [s for s in [
    (START, -18.0, opt('--vmax', 20.0), opt('--amax', 60.0)),   # the gentle settle: 168 -> 150
    (175.0, REV, REV_VMAX, REV_AMAX),                            # the final move, slowed
] if s[1] != 0.0]
THRESH_DEG = 0.02

J1 = bpy.data.objects['JNT_J1']


def fcurve(ob, path, index):
    ob.animation_data_create()
    if ob.animation_data.action is None:
        act = bpy.data.actions.new(ob.name + 'Action')
        ob.animation_data.action = act
        if hasattr(act, 'slots'):
            slot = act.slots.new(id_type='OBJECT', name=ob.name)
            ob.animation_data.action_slot = slot
    act = ob.animation_data.action
    if hasattr(act, 'fcurves'):
        fc = act.fcurves.find(path, index=index) or act.fcurves.new(path, index=index)
    else:
        layer = act.layers[0] if act.layers else act.layers.new('Layer')
        strip = layer.strips[0] if layer.strips else layer.strips.new(type='KEYFRAME')
        cb = strip.channelbag(ob.animation_data.action_slot, ensure=True)
        fc = cb.fcurves.find(path, index=index) or cb.fcurves.new(path, index=index)
    fc.extrapolation = 'CONSTANT'
    return fc


n = 289
dt = 1.0 / (FPS * TS)
u = [D2R(REST)] * n
x_cmd = D2R(REST)
for (fs, d_deg, v_deg, a_deg) in SEGS:
    D, vmax, amax = D2R(d_deg), D2R(v_deg), D2R(a_deg)
    T = M.duration(abs(D), vmax, amax)
    step = 1.0 / CTRL_HZ
    acc = 0.0
    for i in range(n):
        t = (i + 1 - fs) * dt
        if t <= 0:
            continue
        tq = math.floor(t / step) * step
        vv = M.vel(min(tq, T), abs(D), vmax, amax) * (1 if D >= 0 else -1)
        acc = min(abs(acc + vv * dt), abs(D)) * (1 if D >= 0 else -1)
        u[i] = x_cmd + acc
    x_cmd = x_cmd + D
    print(f"  seg f{fs:.0f}: {d_deg:+.0f} deg @ {v_deg:.0f} deg/s, {a_deg:.0f} deg/s^2 -> "
          f"T {T:.3f}s = {T * TS * FPS:.1f} frames (ends ~f{fs + T * TS * FPS:.0f})")
if not any(s[0] == 175.0 for s in SEGS):
    print("  final move at f175: cut")
x = M.ring_response(u, dt, F0, ZETA)

fc = fcurve(J1, 'rotation_euler', 2)
old = [math.degrees(fc.evaluate(i + 1)) for i in range(n)]
new = [math.degrees(v) for v in x]
changed = [i + 1 for i in range(288) if abs(new[i] - old[i]) > THRESH_DEG]


def max_step(seq, lo, hi):
    return max(abs(seq[i] - seq[i - 1]) for i in range(lo, hi))


print(f"  J1 max per-frame change f1-f288: old {max_step(old, 1, 288):.2f} deg, "
      f"new {max_step(new, 1, 288):.2f} deg")
print(f"  J1 range: old {min(old[:288]):.1f}..{max(old[:288]):.1f}, "
      f"new {min(new[:288]):.1f}..{max(new[:288]):.1f}")
print(f"  J1 at f175 old {old[174]:.2f} new {new[174]:.2f};  at f288 old {old[287]:.2f} new {new[287]:.2f}")
if changed:
    runs, s = [], changed[0]
    for a, b in zip(changed, changed[1:] + [None]):
        if b != a + 1:
            runs.append((s, a)); s = b
    print(f"  frames that change by > {THRESH_DEG} deg: {len(changed)} -> "
          + ", ".join(f"f{a}-f{b}" if a != b else f"f{a}" for a, b in runs))
else:
    print("  no frame changes by more than the threshold")
if CHANGED_OUT:
    with open(CHANGED_OUT, 'w') as fh:
        fh.write(",".join(str(f) for f in changed))
    print(f"  wrote changed-frame list to {CHANGED_OUT}")

if DRY:
    print("\nDRY RUN - no keys written, blend not saved")
    sys.exit(0)

for kp in list(fc.keyframe_points)[::-1]:
    fc.keyframe_points.remove(kp, fast=True)
fc.keyframe_points.add(n)
for i in range(n):
    kp = fc.keyframe_points[i]
    kp.handle_left_type = kp.handle_right_type = 'FREE'
    kp.interpolation = 'LINEAR'
    kp.co = (i + 1, x[i])
fc.keyframe_points.sort()
fc.update()
bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - J1 re-keyed")
