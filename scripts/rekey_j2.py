"""Re-key JNT_J2 alone, and refuse any path that enters the collision zone.

WHY THIS EXISTS SEPARATELY FROM rekey_motion.py
rekey_motion.py clears and rebuilds the animation on every object it touches, including the
camera. The accepted overhead ending was arrived at through CLI overrides that were never
written down, so re-running the full re-key would lose it. This touches J2 and nothing else.

THE DEFECT IT FIXES
The baked film drove J2 from its -170 deg rest to +20 deg -- a +190 deg sweep straight
THROUGH 0 deg. The encoder topper fouls the stage-1 arm within ~20 deg of the fold from
either side, so 69 frames of the film (f118-f186) sat in a pose the machine cannot reach.

rekey_motion.py's clamp did not catch it because J2_LIMIT is derived from the requested
path's own endpoints:

    _pos, _all = J2_REST, [J2_REST]
    for _f, _d in J2_SEG: _pos += _d; _all.append(_pos)
    J2_LIMIT = (D2R(min(_all)), D2R(max(_all)))

A limit computed from the move can only ever stop the move overshooting ITSELF. Ask for
+190 and the limit obligingly widens to span the collision. A mechanical stop is a fact
about the machine, so here it is a CONSTANT, and the path is checked against it.

REACHING THE FAR STOP LEGALLY
+20 deg is a legal pose -- it is the mirror stop. Only the transit through 0 is illegal. So
the far stop is reached the long way round: travelling NEGATIVE from -170 deg lands on
-340 deg, which is the same pose as +20 deg, having passed -180/-270 and never gone near
the fold. Identical silhouette, legal path.

Usage:
    blender -b Untitled.blend -P scripts/rekey_j2.py -- [--travel -170] [--rev 80]
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
# The topper carrying the end-of-arm encoder fouls the side of the stage-1 arm when the
# joint closes to within ~20 deg of the fold, from EITHER side. So the reachable set is
# every angle whose pose is outside +/-FOUL of 0 deg, and the two stops are the edges.
FOUL_DEG = 20.0
J2_REST = opt('--rest', -170.0)
J2_TRAVEL = opt('--travel', -170.0)       # negative = the long way round to the far stop
J2_REV = opt('--rev', 80.0)               # applied at --rev-frame
J2_START = opt('--start', 91.0)
REV_F = opt('--rev-frame', 175.0)
VMAX = opt('--vmax', 100.0)               # deg/s, coordinated feed for the sweep
REV_VMAX = opt('--rev-vmax', 0.0) or VMAX  # the reversal may want its own speed
AMAX = 1400.0
F0, ZETA = 16.0, 0.10


def pose(deg):
    """Angle folded into (-180, 180]. Two commands 360 deg apart are the same pose."""
    p = (deg + 180.0) % 360.0 - 180.0
    return 180.0 if p == -180.0 else p


def fouls(deg):
    return abs(pose(deg)) < FOUL_DEG


SEGS = [(J2_START, J2_TRAVEL, VMAX), (REV_F, J2_REV, REV_VMAX)]

# ---- check the COMMANDED path before building anything -------------------------------
# Sampling endpoints is not enough: the collision is something a move passes through, so
# the whole swept interval of every segment has to be walked.
print(f"machine: fold zone is +/-{FOUL_DEG:.0f} deg about 0; rest {J2_REST:.0f} "
      f"(pose {pose(J2_REST):+.0f})")
bad, cursor = [], J2_REST
for i, (fs, d, v) in enumerate(SEGS):
    target = cursor + d
    steps = max(2, int(abs(d)) + 1)
    for k in range(steps + 1):
        a = cursor + d * (k / steps)
        if fouls(a):
            bad.append((i, a))
    print(f"  seg {i}: f{fs:.0f}  {cursor:+.1f} -> {target:+.1f}  "
          f"({d:+.0f} deg @ {v:.0f} deg/s)   pose {pose(cursor):+.0f} -> {pose(target):+.0f}")
    cursor = target

if bad:
    worst = min(bad, key=lambda t: abs(pose(t[1])))
    print(f"\nREFUSED: the commanded path enters the fold zone in {len(bad)} sampled "
          f"positions.\n  closest approach {pose(worst[1]):+.2f} deg on segment {worst[0]} "
          f"(limit +/-{FOUL_DEG:.0f}).")
    print("  Reach the far stop the long way round instead: a NEGATIVE --travel from a\n"
          "  negative rest lands on the mirror stop without crossing the fold.")
    sys.exit(1)
print("  commanded path clears the fold zone")

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

# THE RESPONSE IS CLAMPED, THE COMMAND IS REFUSED. Two different failures.
#
# A command that crosses the fold is an authoring error -- nothing on the machine would
# execute it, so it is rejected above. A RESPONSE that crosses it is just contact: the link
# rings past the setpoint, meets the stop, and is held there by it. Flattening that side of
# the ring is not losing the 2nd-order model, it is what the model predicts a hard stop
# does. Refusing here instead would reject every move that arrives ON a stop, which is most
# of them, since arriving by contact rather than by setpoint is the point of the beat.
#
# The legal band is the one revolution the commanded path lives in, bounded by the two
# stops either side of it -- for a path running -170 -> -340 that is [-340, -20], because
# angles in (-380, -340) and (-20, 20) both fold to inside the zone.
lo_band = math.floor((min(u + [D2R(J2_REST)]) + D2R(FOUL_DEG)) / (2 * math.pi)) * 2 * math.pi + D2R(FOUL_DEG)
hi_band = lo_band + 2 * math.pi - 2 * D2R(FOUL_DEG)
print(f"  legal band for this revolution: [{math.degrees(lo_band):+.0f}, "
      f"{math.degrees(hi_band):+.0f}] deg")

contact = [(i + 1, math.degrees(v)) for i, v in enumerate(x) if v < lo_band or v > hi_band]
x = [max(lo_band, min(hi_band, v)) for v in x]
if contact:
    worst = max(contact, key=lambda t: max(t[1] - math.degrees(hi_band),
                                           math.degrees(lo_band) - t[1]))
    over = max(worst[1] - math.degrees(hi_band), math.degrees(lo_band) - worst[1])
    print(f"  CONTACT: the ring meets the stop on {len(contact)} frames "
          f"(f{contact[0][0]}-f{contact[-1][0]}), deepest {over:.2f} deg at f{worst[0]} "
          f"-- held by the stop, as on the machine")
print(f"  closest approach to the fold {min(abs(pose(math.degrees(v))) for v in x):.1f} deg")

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
print(f"\nBLEND SAVED - J2 re-keyed: rest {J2_REST:+.0f} -> "
      f"{J2_REST + J2_TRAVEL:+.0f} -> {J2_REST + J2_TRAVEL + J2_REV:+.0f} "
      f"(poses {pose(J2_REST):+.0f} -> {pose(J2_REST + J2_TRAVEL):+.0f} -> "
      f"{pose(J2_REST + J2_TRAVEL + J2_REV):+.0f})")
