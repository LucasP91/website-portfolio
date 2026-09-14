"""Re-key JNT_J2 alone, and refuse any path through a region the machine cannot occupy.

WHY THIS EXISTS SEPARATELY FROM rekey_motion.py
rekey_motion.py clears and rebuilds the animation on every object it touches, including the
camera. The accepted overhead ending was arrived at through CLI overrides that were never
written down, so re-running the full re-key would lose it. This touches J2 and nothing else.

WHERE J2 CANNOT GO (pose degrees, i.e. the angle folded into -180..180)
  (-20, +20)   The encoder topper fouls the stage-1 arm near the fold, from either side.
               Recorded by Lucas on the real machine. The topper is not in the CAD, so a
               mesh check cannot see this one.
  (+68, +174)  The forearm sweeps through the Z tower: rods, lead screw, top plate and their
               screws. MEASURED by BVH overlap of the forearm meshes against the rest of the
               assembly over the full range at both carriage heights -- blocked +72..+170 at
               2 deg steps, widened by 4 deg each side.

From the -170 rest the one reachable band is about [-186, -20]. The mirror stop at +20
cannot be reached at all: the short way crosses the fold, and the long way crosses the
tower. A previous version of this script went the long way and put the forearm through the
rods for ~50 frames (f103-f149, then again on the way back, f191-f203).

THE MOVE
Out to the -20 stop, arriving by contact -- the 2nd-order ring meets the stop and is held
by it -- then reversing back out to -60, the pose the overhead ending was composed around.

Usage:
    blender -b Untitled.blend -P scripts/rekey_j2.py -- [--travel 150] [--rev -40]
                                                        [--start 91] [--rev-frame 175]
                                                        [--vmax 100] [--rev-vmax 0]
                                                        [--dry-run]
--dry-run checks and reports without writing keys or saving.
SAVES the .blend unless --dry-run.
"""
import bpy, sys, os, math

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import motion as M

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return float(argv[argv.index(name) + 1]) if name in argv else default


DRY = '--dry-run' in argv

TS = 2.0            # time scale: film runs at 2x slow motion
FPS = 24.0
CTRL_HZ = 25.0      # the host's real control loop
D2R = math.radians

# ---- MACHINE FACTS. Not derived from the shot, and not negotiable by a CLI flag. --------
J2_BLOCKED = ((-20.0, 20.0), (68.0, 174.0))   # open intervals, pose degrees -- see docstring
J2_REST = opt('--rest', -170.0)
J2_TRAVEL = opt('--travel', 150.0)        # out to the -20 stop
J2_REV = opt('--rev', -40.0)              # back out to -60, applied at --rev-frame
J2_START = opt('--start', 91.0)
REV_F = opt('--rev-frame', 175.0)
VMAX = opt('--vmax', 100.0)               # deg/s, coordinated feed for the sweep
REV_VMAX = opt('--rev-vmax', 0.0) or VMAX
AMAX = 1400.0
F0, ZETA = 16.0, 0.10


def pose(deg):
    """Angle folded into (-180, 180]. Two commands 360 deg apart are the same pose."""
    p = (deg + 180.0) % 360.0 - 180.0
    return 180.0 if p == -180.0 else p


def blocked(deg):
    p = pose(deg)
    return any(lo < p < hi for lo, hi in J2_BLOCKED)


def reachable_band(rest):
    """The contiguous run of legal angles containing the rest pose, in 0.25 deg steps."""
    if blocked(rest):
        raise SystemExit(f"REFUSED: the rest pose {rest:+.1f} is itself inside a blocked region")
    lo = hi = rest
    while not blocked(lo - 0.25) and lo > rest - 360:
        lo -= 0.25
    while not blocked(hi + 0.25) and hi < rest + 360:
        hi += 0.25
    return lo, hi


SEGS = [(J2_START, J2_TRAVEL, VMAX), (REV_F, J2_REV, REV_VMAX)]
BAND = reachable_band(J2_REST)
print(f"machine: blocked poses {', '.join(f'({a:+.0f},{b:+.0f})' for a, b in J2_BLOCKED)}; "
      f"rest {J2_REST:+.0f} -> reachable band [{BAND[0]:+.2f}, {BAND[1]:+.2f}]")

# ---- check the COMMANDED path before building anything -------------------------------
# The whole swept interval of every segment, not just its endpoints -- a collision is
# something a move passes through.
cursor, bad = J2_REST, []
for i, (fs, d, v) in enumerate(SEGS):
    target = cursor + d
    steps = max(2, int(abs(d) * 4) + 1)
    for k in range(steps + 1):
        a = cursor + d * (k / steps)
        if blocked(a):
            bad.append((i, a))
    print(f"  seg {i}: f{fs:.0f}  {cursor:+.1f} -> {target:+.1f}  "
          f"({d:+.0f} deg @ {v:.0f} deg/s)   pose {pose(cursor):+.0f} -> {pose(target):+.0f}")
    cursor = target

if bad:
    i, a = bad[0]
    raise SystemExit(
        f"\nREFUSED: segment {i} passes through a blocked region at {a:+.1f} deg "
        f"(pose {pose(a):+.1f}).\n  From this rest J2 can only move within "
        f"[{BAND[0]:+.1f}, {BAND[1]:+.1f}] -- the fold and the Z tower bound it on each side.")
print("  commanded path stays inside the reachable band")

# ---- build the curve ------------------------------------------------------------------
J2 = bpy.data.objects['JNT_J2']


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


dt = 1.0 / (FPS * TS)
n = 289
u = [D2R(J2_REST)] * n
x_cmd = D2R(J2_REST)
for (fs, D_deg, v_deg) in SEGS:
    D, vmax = D2R(D_deg), D2R(v_deg)
    T = M.duration(abs(D), vmax, D2R(AMAX))
    step = 1.0 / CTRL_HZ
    acc = 0.0
    for i in range(n):
        t = (i + 1 - fs) * dt
        if t <= 0:
            continue
        tq = math.floor(t / step) * step
        vv = M.vel(min(tq, T), abs(D), vmax, D2R(AMAX)) * (1 if D >= 0 else -1)
        acc = min(abs(acc + vv * dt), abs(D)) * (1 if D >= 0 else -1)
        u[i] = x_cmd + acc
    x_cmd = x_cmd + D
    print(f"  seg f{fs:.0f}: {abs(D_deg):.0f} deg @ {v_deg:.0f} deg/s -> T {T:.3f}s "
          f"= {T * TS * FPS:.1f} frames")

x = M.ring_response(u, dt, F0, ZETA)

# THE RESPONSE IS CLAMPED, THE COMMAND IS REFUSED. A command through a blocked region is an
# authoring error. A rung response past a stop is contact: the link rings past its setpoint,
# meets the stop, and is held there -- which is what arriving on the -20 stop means.
lo_r, hi_r = D2R(BAND[0]), D2R(BAND[1])
contact = [(i + 1, math.degrees(v)) for i, v in enumerate(x) if v < lo_r or v > hi_r]
x = [max(lo_r, min(hi_r, v)) for v in x]
if contact:
    deepest = max(max(t[1] - BAND[1], BAND[0] - t[1]) for t in contact)
    print(f"  CONTACT: the ring meets a stop on {len(contact)} frames "
          f"(f{contact[0][0]}-f{contact[-1][0]}), deepest {deepest:.2f} deg -- held by the stop")
if any(blocked(math.degrees(v)) for v in x):
    raise SystemExit("REFUSED: the clamped curve still enters a blocked region")
print("  keyed curve verified: no frame enters a blocked region")

if DRY:
    print("\nDRY RUN - no keys written, blend not saved")
    sys.exit(0)

fc = fcurve(J2, 'rotation_euler', 2)
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
print(f"\nBLEND SAVED - J2 re-keyed: {J2_REST:+.0f} -> {J2_REST + J2_TRAVEL:+.0f} -> "
      f"{J2_REST + J2_TRAVEL + J2_REV:+.0f}")
