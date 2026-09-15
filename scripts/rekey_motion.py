"""Re-key on machine physics.  TO_BUILD_07 (rhythm + camera) + TO_BUILD_08 (profiles).

Joints: trapezoidal command, quantised to the real 25 Hz control loop, driven through a
damped 2nd-order system so ringing emerges rather than being pasted on. Baked per frame.
Z: exact 4-key Bezier trapezoid (no ring -- lead screw is stiff and self-locking).
Camera: push-in is the spine. Distance monotonic in, azimuth <= 35 deg total, shallow U
elevation, one trapezoidal speed profile with gentle ramps, no stop until f288.

SAVES the .blend.
"""
import bpy, sys, os, math, mathutils as mu

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import motion as M

# Overridable so framing/travel can be iterated without editing the file between renders.
_argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def _opt(name, default):
    return float(_argv[_argv.index(name) + 1]) if name in _argv else default


# The overhead rise is easier to reason about in FRAMES than in spine fraction, because the
# thing it lines up with -- the Z descent starting at f136 -- is a frame number. Declared up
# here because the spine block that converts it runs well before the other camera params.
END_FROM_FRAME = _opt('--end-from-frame', 0.0)
END_BLEND = _opt('--end-blend', 0.0)             # frames to crossfade push-in into the pan

TS = 2.0            # time scale: film runs at 2x slow motion
FPS = 24.0
CTRL_HZ = 25.0      # the host's real control loop -- quantise commands to it

scene = bpy.context.scene
scene.frame_start, scene.frame_end = 1, 288
D2R = math.radians

TT = bpy.data.objects['Turntable']
J1 = bpy.data.objects['JNT_J1']
JZ = bpy.data.objects['JNT_Z']
J2 = bpy.data.objects['JNT_J2']
CAM = bpy.data.objects['Camera']
CT = bpy.data.objects['CamTarget']
NUT = bpy.data.objects['T8 Lead Screw Nut']

for o in (TT, J1, JZ, J2, CAM, CT):
    if o.animation_data:
        o.animation_data_clear()
TT.rotation_euler.z = D2R(90)


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


def joint_track(fc, segments, vmax, amax, f0, zeta, x_rest, limit=None):
    """segments: list of (start_frame, delta). Builds one baked curve for the channel:
    commanded trapezoids at their physical durations, quantised to CTRL_HZ, run through
    the 2nd-order system so every stop rings and every hold is genuinely still.

    `limit` is (lo, hi) in RADIANS: a HARD MECHANICAL stop, not a soft software limit.
    The command is clamped to it, so a move that asks for more than the machine has simply
    arrives at the stop and holds. Encoding it here rather than trimming the segment
    numbers means no future re-key can silently key through the collision again.
    """
    dt = 1.0 / (FPS * TS)                        # real seconds per film frame
    n = 289
    u = [x_rest] * n
    x_cmd = x_rest
    for (fs, D) in segments:
        T = M.duration(abs(D), vmax, amax)
        step = 1.0 / CTRL_HZ
        # Quantise VELOCITY to the control loop, not position: the host streams
        # targets at 25 Hz and the planner interpolates, so position stays
        # continuous and only the slope steps. Quantising position would imply
        # 12 deg jumps at 300 deg/s, which is not what the machine does.
        acc = 0.0
        for i in range(n):
            t = (i + 1 - fs) * dt
            if t <= 0:
                continue
            tq = math.floor(t / step) * step
            v = M.vel(min(tq, T), abs(D), vmax, amax) * (1 if D >= 0 else -1)
            acc = min(abs(acc + v * dt), abs(D)) * (1 if D >= 0 else -1)
            u[i] = x_cmd + acc
            if limit is not None:
                u[i] = max(limit[0], min(limit[1], u[i]))
        x_cmd = x_cmd + D
        if limit is not None:
            x_cmd = max(limit[0], min(limit[1], x_cmd))
    x = M.ring_response(u, dt, f0, zeta)
    if limit is not None:
        # The LINK cannot pass the stop either -- without this the 2nd-order overshoot
        # would swing the arm straight through the collision it is ringing against.
        x = [max(limit[0], min(limit[1], v)) for v in x]
    base = len(fc.keyframe_points)
    fc.keyframe_points.add(n)
    for i in range(n):
        kp = fc.keyframe_points[base + i]
        kp.handle_left_type = kp.handle_right_type = 'FREE'
        kp.interpolation = 'LINEAR'
        kp.co = (i + 1, x[i])
    fc.keyframe_points.sort()
    fc.update()
    return u, x


# ----------------------------------------------------------------- joints ----
# J1: rests 168 deg inside the seam. Beat 3 drives it INTO the limit (12 deg), dead hold,
# then Beat 4 reaches 55 deg away from it.
# Beat 4's reach is extended, and both joints REVERSE at REV_F to swing the arm back out
# toward the camera. The reversal is a real direction change at a dead stop, not a
# continuation -- so each joint decelerates to zero, holds for the ring to settle, and
# accelerates the other way. That is what the 2nd-order response makes visible.
REV_F = _opt('--rev-frame', 175.0)
J1_REACH = _opt('--j1-reach', -105.0)            # was -55; extended by 50
J1_REV = _opt('--j1-rev', 60.0)                  # back the other way at REV_F
J1_OPEN = _opt('--j1-open', 12.0)                # the f46 move; was 12
J1_SEG = [(46, J1_OPEN), (70, J1_REACH), (REV_F, J1_REV)]
fc_j1 = fcurve(J1, 'rotation_euler', 2)
u1, x1 = joint_track(fc_j1, [(f, D2R(d)) for f, d in J1_SEG],
                     D2R(300), D2R(1100), 12.0, 0.10, D2R(168))
_p = 168.0
print("  J1 path: 168", end="")
for _f, _d in J1_SEG:
    _p += _d
    print(f" -f{_f:.0f}-> {_p:.0f}", end="")
print()
# J2: the 20 deg is the STOP ANGLE, not the travel. Clarified by Lucas 2026-07-30 -- the
# topper carrying the end-of-arm encoder fouls the side of the first-stage arm when the
# joint closes to within ~20 deg of it. So the joint has plenty of range; what it cannot do
# is fold the last 20 deg. My first reading (20 deg of total travel) was wrong and made the
# beat far too small.
#
# The move now runs 85 deg and arrives exactly ON the stop, which is the strongest version
# of this: the arm travels a long way and is halted by contact rather than by a setpoint.
# The big rotation is back, and it now happens DURING the Z descent (Lucas, 2026-07-31):
# the forearm swings back under itself while the carriage drives down. Two axes moving at
# once is what a machine executing a move actually looks like, as opposed to a machine
# demonstrating one joint at a time.
#
# 150 deg, ending exactly on the -20 deg collision stop -- so it sweeps almost the full
# fold and is halted by contact, 20 deg short of where the original 230 deg flip went.
#
# Feedrate is deliberately 100 deg/s, a third of the joint's 300 deg/s ceiling. At full
# speed this is a 34-frame snap that would be over before the descent registers; at 100 it
# runs 75 frames and reads as coordinated with the Z move rather than interrupting it.
#
# J2 cannot pass the fold (the topper fouls the stage-1 arm within ~20 deg of it) and it
# cannot swing back through the Z tower either (measured, see J2_BLOCKED below). So from
# the -170 rest it runs OUT to the -20 stop and back; the mirror stop at +20 is unreachable.
J2_REST = _opt('--j2-rest', -170.0)
J2_TRAVEL = _opt('--j2-travel', 150.0)           # out to the -20 stop
J2_VMAX = _opt('--j2-vmax', 100.0)               # deg/s -- coordinated feed, not full tilt
J2_START = _opt('--j2-start', 150.0)             # was f150; brought forward
J2_REV = _opt('--j2-rev', -80.0)                 # reverses at REV_F with J1
J2_SEG = [(J2_START, J2_TRAVEL), (REV_F, J2_REV)]

# A LIMIT DERIVED FROM THE PATH CANNOT POLICE THE PATH.
#
# The clamp used to span the commanded waypoints, which widens to admit any sweep you ask for.
# The forbidden set is a fact about the machine, so it is a constant, in POSE degrees:
#   (-20, +20)   the encoder topper fouls the stage-1 arm near the fold, from either side
#                (recorded on the real machine; the topper is not in the CAD)
#   (+68, +174)  the forearm sweeps through the Z tower -- rods, lead screw, top plate and
#                screws. Measured by BVH overlap of the forearm meshes against the assembly
#                over the full range at both carriage heights (blocked +72..+170, 4 deg margin)
# From the -170 rest the one reachable band is about [-186, -20]. An earlier "long way round"
# route to the mirror stop at +20 put the forearm through the tower rods for ~50 frames.
J2_BLOCKED = ((-20.0, 20.0), (68.0, 174.0))


def _pose(deg):
    p = (deg + 180.0) % 360.0 - 180.0
    return 180.0 if p == -180.0 else p


def _blocked(deg):
    p = _pose(deg)
    return any(lo < p < hi for lo, hi in J2_BLOCKED)


_pos, _all = J2_REST, [J2_REST]
for _f, _d in J2_SEG:
    _pos += _d
    _all.append(_pos)
print("  J2 path: " + " -> ".join(f"{p:.0f}" for p in _all) +
      f"   (starts f{J2_START:.0f}, reverses f{REV_F:.0f})")

if _blocked(J2_REST):
    raise SystemExit(f"REFUSED: J2 rest {J2_REST:+.1f} is inside a blocked region")
_lo_d = _hi_d = J2_REST
while not _blocked(_lo_d - 0.25) and _lo_d > J2_REST - 360:
    _lo_d -= 0.25
while not _blocked(_hi_d + 0.25) and _hi_d < J2_REST + 360:
    _hi_d += 0.25

_cursor = J2_REST
for _f, _d in J2_SEG:
    _steps = max(2, int(abs(_d) * 4) + 1)
    for _k in range(_steps + 1):
        _a = _cursor + _d * (_k / _steps)
        if _blocked(_a):
            raise SystemExit(
                f"REFUSED: the commanded J2 path passes through a blocked region at {_a:+.1f} deg "
                f"(pose {_pose(_a):+.1f}). From this rest J2 can only move within "
                f"[{_lo_d:+.1f}, {_hi_d:+.1f}] -- bounded by the fold and the Z tower. "
                f"scripts/rekey_j2.py re-keys J2 alone.")
    _cursor += _d

J2_LIMIT = (D2R(_lo_d), D2R(_hi_d))
print(f"  J2 reachable band: [{_lo_d:+.1f}, {_hi_d:+.1f}] deg  (blocked poses {J2_BLOCKED})")
fc_j2 = fcurve(J2, 'rotation_euler', 2)
u2, x2 = joint_track(fc_j2, [(f, D2R(d)) for f, d in J2_SEG],
                     D2R(J2_VMAX), D2R(1400), 16.0, 0.10, D2R(J2_REST), limit=J2_LIMIT)

for nm, seg, v, a in (('J1 open', abs(J1_OPEN), 300, 1100), ('J1 reach', abs(J1_REACH), 300, 1100),
                      ('J2 to its stop', J2_TRAVEL, J2_VMAX, 1400)):
    sh, vpk, Ta, Tc, Td, T, s = M.plan(seg, v, a)
    print(f"  {nm:12} {sh:9} v_pk {vpk:6.1f}  T_real {T:.3f}s  T_film {T*TS*FPS:5.1f} frames")

# ring amplitude actually achieved, in degrees
for nm, u, x in (('J1', u1, x1), ('J2', u2, x2)):
    dev = max(abs(x[i] - u[i]) for i in range(len(u)))
    print(f"  {nm} peak deviation from command: {math.degrees(dev):.2f} deg")

# ----------------------------------------------------------------------- Z ---
# Z: 20.25 mm was a nearly invisible move on a 380 mm rail. Lucas asked for far more
# travel, so it is now 120 mm -- a real stroke that reads as the machine using its axis.
# The rail supports it: the screw spans z 0.1295..0.5095 and the carriage bottom sits at
# 0.3608, so 120 mm of descent still clears the base by ~80 mm.
#
# Starting at f136 instead of f160 is what closes the dead air left when Beat 5 shrank:
# J2 now finishes at ~f130, so the descent picks up almost immediately. Speed is SOLVED
# from the requirement that it still land on f262, not chosen:
#     T = D/V + V/A = (262-136)/48 = 2.625 s,  D = 120 mm,  A = 400 mm/s^2  ->  V = 47.9
Z_TOP = 0.4255
Z_D = -0.120                                     # 120 mm stroke
Z_START = 136
Z_V, Z_A = 0.0479, 0.400                         # m/s, m/s^2 -- solved to land on f262
fc_z = fcurve(JZ, 'location', 2)
kp0 = fc_z.keyframe_points
kp0.add(1)
kp0[0].handle_left_type = kp0[0].handle_right_type = 'FREE'
kp0[0].interpolation = 'BEZIER'
kp0[0].co = (1, Z_TOP)
kp0[0].handle_left = (-5, Z_TOP)
kp0[0].handle_right = (Z_START - 1, Z_TOP)
M.write_trapezoid(fc_z, Z_START, Z_TOP, Z_D, Z_V, Z_A, TS)
fc_z.keyframe_points.sort()
fc_z.update()
sh, vpk, Ta, Tc, Td, T, s = M.plan(abs(Z_D) * 1000, Z_V * 1000, Z_A * 1000)
print(f"  Z descent    {sh:9} v_pk {vpk:6.1f} mm/s  T_real {T:.3f}s  "
      f"T_film {T*TS*FPS:5.1f} frames  f{Z_START} -> f{Z_START + T*TS*FPS:.0f}")

# -------------------------------------------------------------------- camera -
# One trapezoidal spine over the whole film: gentle ramps, long cruise, stops only at f288.
RAMP_S = 1.2                                     # film seconds
F0, F1 = 1.0, 288.0
span = F1 - F0
ramp_f = RAMP_S * FPS
cruise_f = span - 2 * ramp_f
A_s = 1.0 / (ramp_f * (ramp_f + cruise_f))       # normalised so s(F1) = 1


def spine(f):
    t = f - F0
    if t <= 0:
        return 0.0
    if t < ramp_f:
        return 0.5 * A_s * t * t
    if t < ramp_f + cruise_f:
        return 0.5 * A_s * ramp_f * ramp_f + A_s * ramp_f * (t - ramp_f)
    if t < span:
        td = t - ramp_f - cruise_f
        return (0.5 * A_s * ramp_f * ramp_f + A_s * ramp_f * cruise_f
                + A_s * ramp_f * td - 0.5 * A_s * td * td)
    return 1.0


def smootherstep(t):
    """6t^5 - 15t^4 + 10t^3. Zero first AND second derivative at both ends, where plain
    smoothstep only zeroes the first. The overhead rise reads as a gentler departure and a
    softer arrival, which is what stops a long camera move feeling like it snaps into life."""
    t = max(0.0, min(1.0, t))
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0)


def smoothblend(a, b, t):
    t = max(0.0, min(1.0, t))
    return a + (b - a) * (t * t * (3 - 2 * t))


def frame_solve(tgt, az, el, dist, v_half, aspect, fill, corners, iters=3):
    """Centre the subject IN SCREEN SPACE and set the distance so it fills the frame.

    Aiming at the subject's world-Z midpoint centres it vertically only while the camera is
    roughly level. Once the camera goes overhead the frame's vertical axis maps onto a
    HORIZONTAL world direction, so world-Z centring stops meaning anything -- which is why
    one distance filled to the top and another filled to the bottom.

    So: project the subject's corners onto the camera's own right/up axes, recentre on the
    angular midpoint of that projection, and scale distance until the larger of the two
    angular extents fills `fill` of the frame. Iterated because moving the camera changes
    the projection that decided where to move it.
    """
    h_half = math.atan(aspect * math.tan(v_half))

    # Start from the bbox centre, which is close, then correct on the PROJECTED extent so
    # the margins come out equal. Under perspective the 3D centre does not land on the
    # midpoint of the projected range, so the correction is what actually equalises them.
    #
    # SIGN, because getting it backwards is what broke the first attempt: moving the camera
    # +up makes the subject appear to move DOWN. So to bring a subject sitting above the
    # axis (cy > 0) back to centre, the camera moves UP by tan(cy)*dist. Subtracting instead
    # of adding makes every iteration worse and walks the rig off the subject entirely.
    xs = [p.x for p in corners]; ys = [p.y for p in corners]; zs = [p.z for p in corners]
    tgt = mu.Vector(((min(xs) + max(xs)) / 2.0,
                     (min(ys) + max(ys)) / 2.0,
                     (min(zs) + max(zs)) / 2.0))

    fwd = mu.Vector((-math.cos(az) * math.cos(el),
                     -math.sin(az) * math.cos(el),
                     -math.sin(el)))
    right = fwd.cross(mu.Vector((0.0, 0.0, 1.0)))
    right = right.normalized() if right.length > 1e-9 else mu.Vector((1.0, 0.0, 0.0))
    up = right.cross(fwd).normalized()

    for _ in range(iters):
        cam = tgt - fwd * dist
        ax, ay = [], []
        for p in corners:
            d = p - cam
            z = d.dot(fwd)
            if z <= 1e-6:
                continue
            ax.append(math.atan(d.dot(right) / z))
            ay.append(math.atan(d.dot(up) / z))
        if not ax:
            return tgt, dist

        cy = (min(ay) + max(ay)) / 2.0
        cx = (min(ax) + max(ax)) / 2.0
        tgt = tgt + up * (math.tan(cy) * dist) + right * (math.tan(cx) * dist)

        # Fit the VERTICAL extent -- "almost touching top and bottom" is a vertical
        # statement. Horizontal only intervenes if it would actually overflow, which on a
        # 2.08:1 frame it rarely does.
        half_v = (max(ay) - min(ay)) / 2.0
        half_h = (max(ax) - min(ax)) / 2.0
        need = math.tan(half_v) / (math.tan(v_half) * fill)
        over_h = math.tan(half_h) / (math.tan(h_half) * 0.98) / max(need, 1e-9)
        if over_h > 1.0:
            need *= over_h
        dist *= need

    # One centring-only pass AFTER the distance has settled. Inside the loop the recentre
    # runs BEFORE the final dist change, so it is stale by the time the loop exits --
    # measured as ~12 px of top/bottom drift at 770 px tall. Costs one extra projection.
    cam = tgt - fwd * dist
    ax, ay = [], []
    for p in corners:
        d = p - cam
        z = d.dot(fwd)
        if z <= 1e-6:
            continue
        ax.append(math.atan(d.dot(right) / z))
        ay.append(math.atan(d.dot(up) / z))
    if ax:
        tgt = tgt + up * (math.tan((min(ay) + max(ay)) / 2.0) * dist) \
                  + right * (math.tan((min(ax) + max(ax)) / 2.0) * dist)
    return tgt, dist


DIST0 = _opt('--dist0', 0.98)                    # pull back to show more of the machine
DIST1 = _opt('--dist1', 0.46)                    # monotonic IN; must stay < DIST0

AZ0 = D2R(-100)
AZ_TOTAL = D2R(_opt('--az-total', 30.0))         # 0 = no orbit, so no sideways drift
ELEV_HI0 = _opt('--elev0', 0.300)                # metres above target at f1; lower = flatter
ELEV_LO = _opt('--elevlo', -0.060)               # the dip through beats 2-5
ELEV_HI1 = _opt('--elev1', 0.260)                # rise into the payoff
CENTER = _opt('--center', 1.0)                   # 1 = aim at the subject's vertical midpoint

# Everything that must stay in frame. Ground is hidden; RIG_Scrim is the haze volume.
SUBJ = [o for o in bpy.data.objects
        if o.type == 'MESH' and o.name not in ('Ground', 'RIG_Scrim') and not o.hide_render]
S_LOW = 0.55

# Overhead ending. END_ELEV is the camera's elevation ANGLE in degrees at f288 (0 disables
# and keeps the original height-offset model). END_FROM is where along the spine the rise
# begins. END_ON picks what the bird's-eye centres on.
END_ELEV = _opt('--end-elev', 0.0)
END_DIST = _opt('--end-dist', 0.0)                # metres at f288; 0 keeps the plain push-in
END_FILL = _opt('--end-fill', 0.0)                # 0 disables; e.g. 0.92 = fill 92% of frame
ASPECT = _opt('--aspect', 2.08)                   # render width/height the solve assumes
# NOTE the ordering trap: this used to be a plain _opt() that ran AFTER the spine block had
# already converted --end-from-frame into a spine fraction, silently overwriting it with the
# default. The log still printed the converted value, so the re-key looked correct and
# rendered pixel-identical output. Resolve both in one place.
END_FROM = spine(END_FROM_FRAME) if END_FROM_FRAME > 0 else _opt('--end-from', 0.62)
if END_FROM_FRAME > 0:
    print(f"  overhead rise starts f{END_FROM_FRAME:.0f} (spine {END_FROM:.3f}), "
          f"running {288 - END_FROM_FRAME:.0f} frames")
END_ON = next((_argv[i + 1] for i, a in enumerate(_argv) if a == '--end-on'), 'nut')

# The second-stage link plus what it carries - the "arm body" for the overhead centring.
ARM_BODY = [o for o in bpy.data.objects
            if o.type == 'MESH' and o.parent is J2 and not o.hide_render] or \
           [o for o in bpy.data.objects
            if o.type == 'MESH' and o.name not in ('Ground', 'RIG_Scrim') and not o.hide_render]

# Sampled LOCAL vertices for the framing solve. Bounding-box corners are not good enough:
# a box contains space its object does not occupy, so fitting the box leaves the silhouette
# smaller than asked for and off-centre by however asymmetrically the object sits inside it.
# Measured on the first attempt as 93% fill instead of 98%, and margins 42 px top vs 11 px
# bottom. Real vertices fix both. Strided so the solve stays affordable per frame.
_MAX_PTS = 500
SUBJ_PTS = []
for _o in SUBJ:
    _vs = _o.data.vertices
    _step = max(1, len(_vs) // _MAX_PTS)
    SUBJ_PTS.append((_o, [_vs[i].co.copy() for i in range(0, len(_vs), _step)]))
print(f"  framing solve samples {sum(len(p) for _, p in SUBJ_PTS)} verts "
      f"across {len(SUBJ_PTS)} objects")

fcs_cam = [fcurve(CAM, 'location', i) for i in range(3)]
fcs_ct = [fcurve(CT, 'location', i) for i in range(3)]
for fc in fcs_cam + fcs_ct:
    fc.keyframe_points.add(288)

def base_cam(f):
    """The ordinary push-in camera for a frame: (target, position). No overhead logic."""
    scene.frame_set(f)
    bpy.context.view_layer.update()
    nut = sum((NUT.matrix_world @ mu.Vector(c) for c in NUT.bound_box), mu.Vector()) / 8
    tow = JZ.matrix_world.translation
    mech = mu.Vector((tow.x, tow.y, 0.355))
    s = spine(f)
    w = max(smoothblend(1.0, 0.0, s / 0.30), smoothblend(0.0, 1.0, (s - 0.62) / 0.38))
    t_ = nut * w + mech * (1.0 - w)
    if CENTER > 0.0:
        zs = [(o.matrix_world @ mu.Vector(cn)).z for o in SUBJ for cn in o.bound_box]
        zm = (min(zs) + max(zs)) * 0.5
        t_ = mu.Vector((t_.x, t_.y, t_.z + (zm - t_.z) * CENTER))
    d_ = DIST0 + (DIST1 - DIST0) * s
    a_ = AZ0 + AZ_TOTAL * s
    h_ = (smoothblend(ELEV_HI0, ELEV_LO, s / S_LOW) if s < S_LOW
          else smoothblend(ELEV_LO, ELEV_HI1, (s - S_LOW) / (1 - S_LOW)))
    return t_, mu.Vector((t_.x + d_ * math.cos(a_), t_.y + d_ * math.sin(a_), t_.z + h_))


# ---------------------------------------------------------------- overhead move --
# ONE STRAIGHT MOVE AT CONSTANT SPEED, not a per-frame solve.
#
# Re-solving the framing every frame kept the arm perfectly composed, but the arm's
# silhouette changes as it sweeps -- so the solved distance rose and fell to chase it, and
# the zoom visibly reversed direction mid-move. Consistency beats optimal framing here: the
# endpoint is solved ONCE at f288, and the camera runs to it in a straight line at constant
# velocity. Intermediate frames get whatever negative space that implies, by design.
#
# `t` is linear in FRAMES, deliberately. Easing it (smoothstep/smootherstep) is acceleration
# by definition, and a constant-rate pan is what was asked for.
LIN_START = END_FROM_FRAME if END_FROM_FRAME > 0 else 0.0
if END_ELEV > 0.0 and LIN_START > 0.0:
    A_tgt, A_cam = base_cam(int(LIN_START))
    scene.frame_set(288)
    bpy.context.view_layer.update()
    B_tgt0, _ = base_cam(288)
    az_end = AZ0 + AZ_TOTAL * 1.0
    el_end = D2R(END_ELEV)
    d_end = DIST0 + (DIST1 - DIST0) * 1.0
    if END_FILL > 0.0:
        scene.frame_set(288)
        bpy.context.view_layer.update()
        pts = [(o.matrix_world @ v) for o, vs in SUBJ_PTS for v in vs]
        vh = math.atan((CAM.data.sensor_height / 2.0) / CAM.data.lens)
        B_tgt, d_end = frame_solve(B_tgt0.copy(), az_end, el_end, d_end, vh, ASPECT,
                                   END_FILL, pts)
    else:
        B_tgt = B_tgt0
    # Interpolate the ANGLES, not the position. A straight line between two camera points
    # does not sweep elevation at a constant rate -- measured 0.28 -> 0.51 -> 0.41 deg/frame
    # across the move. Lerping (azimuth, elevation, radius) instead makes the pan rate
    # genuinely constant, which is what "don't accelerate" means for a camera move.
    dA = A_cam - A_tgt
    d_A = dA.length
    el_A = math.atan2(dA.z, math.hypot(dA.x, dA.y))
    az_A = math.atan2(dA.y, dA.x)
    # Unwrap so the azimuth takes the short way round rather than the long one.
    while az_end - az_A > math.pi:
        az_end -= 2 * math.pi
    while az_A - az_end > math.pi:
        az_end += 2 * math.pi
    SPH_A = (az_A, el_A, d_A)
    SPH_B = (az_end, el_end, d_end)
    print(f"  overhead: ONE move f{LIN_START:.0f} -> f288 ({288 - LIN_START:.0f} frames), "
          f"elevation {math.degrees(el_A):.1f} -> {math.degrees(el_end):.1f} deg "
          f"at a constant {(math.degrees(el_end - el_A)) / (288 - LIN_START):.3f} deg/frame")
    print(f"            radius {d_A:.3f} -> {d_end:.3f} m, "
          f"{'OUT' if d_end > d_A else 'IN'} throughout (no reversal)")
else:
    A_tgt = A_cam = B_tgt = B_cam = None
    SPH_A = SPH_B = None

for i in range(288):
    f = i + 1
    if A_cam is not None and f >= LIN_START:
        tl = (f - LIN_START) / max(1e-6, 288.0 - LIN_START)
        tgt = A_tgt.lerp(B_tgt, tl)
        az_l = SPH_A[0] + (SPH_B[0] - SPH_A[0]) * tl
        el_l = SPH_A[1] + (SPH_B[1] - SPH_A[1]) * tl
        d_l = SPH_A[2] + (SPH_B[2] - SPH_A[2]) * tl
        cam_v = mu.Vector((tgt.x + d_l * math.cos(az_l) * math.cos(el_l),
                           tgt.y + d_l * math.sin(az_l) * math.cos(el_l),
                           tgt.z + d_l * math.sin(el_l)))

        # MERGE THE PUSH-IN INTO THE PAN. Switching on a single frame matches POSITION but
        # not VELOCITY -- the push-in arrives with its own speed and direction, the pan
        # departs with a different one, and that mismatch is the visible kink. Crossfading
        # over a short window lets the velocities meet rather than collide. Kept short so
        # the constant-rate body of the move is left alone.
        if END_BLEND > 0.0 and f < LIN_START + END_BLEND:
            w = smoothblend(0.0, 1.0, (f - LIN_START) / END_BLEND)
            b_tgt, b_cam = base_cam(f)
            tgt = b_tgt.lerp(tgt, w)
            cam_v = b_cam.lerp(cam_v, w)
        cam_p = (cam_v.x, cam_v.y, cam_v.z)
        for c, fcl in enumerate(fcs_ct):
            kp = fcl.keyframe_points[i]
            kp.handle_left_type = kp.handle_right_type = 'FREE'
            kp.interpolation = 'LINEAR'
            kp.co = (f, tgt[c])
        for c, fcl in enumerate(fcs_cam):
            kp = fcl.keyframe_points[i]
            kp.handle_left_type = kp.handle_right_type = 'FREE'
            kp.interpolation = 'LINEAR'
            kp.co = (f, cam_p[c])
        continue
    scene.frame_set(f)
    bpy.context.view_layer.update()
    nut = sum((NUT.matrix_world @ mu.Vector(c) for c in NUT.bound_box), mu.Vector()) / 8
    tow = JZ.matrix_world.translation
    mech = mu.Vector((tow.x, tow.y, 0.355))
    s = spine(f)
    # target: nut at both ends, mechanism through the middle
    w_nut = max(smoothblend(1.0, 0.0, s / 0.30), smoothblend(0.0, 1.0, (s - 0.62) / 0.38))
    tgt = nut * w_nut + mech * (1.0 - w_nut)

    # VERTICAL CENTRING. The camera aims at CamTarget, so whatever that point is lands at the
    # centre of frame. Targeting the nut put the TOP of the machine at centre and hung the
    # rest below it -- which is the dead space above the robot. Aiming at the midpoint of the
    # subject's own vertical extent centres the machine by construction, at every frame, and
    # tracks automatically as the carriage descends and that extent changes.
    if CENTER > 0.0:
        zs = [(o.matrix_world @ mu.Vector(cn)).z for o in SUBJ for cn in o.bound_box]
        z_mid = (min(zs) + max(zs)) * 0.5
        tgt = mu.Vector((tgt.x, tgt.y, tgt.z + (z_mid - tgt.z) * CENTER))
    dist = DIST0 + (DIST1 - DIST0) * s
    if END_DIST > 0.0:
        # PULL BACK FOR THE REVEAL. At 0.46 m the arm is 2.02x the frame height once the
        # camera goes overhead, so it is cropped top and bottom -- and widening the frame
        # cannot help, because sensor_fit VERTICAL pins the vertical FOV and extra width only
        # adds side margin. Either the lens gets much wider (20.6 mm, which would restate the
        # perspective of the whole film) or the camera retreats. This retreats.
        # NOTE: this deliberately breaks TO_BUILD_07's "distance monotonic in" -- the move
        # becomes push-in through the descent, then rise-and-pull-back to reveal.
        tb = smootherstep(max(0.0, (s - END_FROM)) / max(1e-6, 1.0 - END_FROM))
        dist = dist + (END_DIST - dist) * tb
    az = AZ0 + AZ_TOTAL * s
    dh = (smoothblend(ELEV_HI0, ELEV_LO, s / S_LOW) if s < S_LOW
          else smoothblend(ELEV_LO, ELEV_HI1, (s - S_LOW) / (1 - S_LOW)))

    if END_ELEV > 0.0:
        # OVERHEAD ENDING. The default model offsets the camera vertically by `dh` while
        # keeping `dist` horizontal, so distance grows as it rises and it can never actually
        # get above the subject. A bird's-eye needs true SPHERICAL placement -- elevation as
        # an ANGLE, with dist as the real 3D radius -- or the camera just drifts up and away.
        t = smootherstep(max(0.0, (s - END_FROM)) / max(1e-6, 1.0 - END_FROM))
        el = D2R(END_ELEV) * t + math.atan2(dh, max(dist, 1e-6)) * (1.0 - t)
        r = dist
        cam_p = (tgt.x + r * math.cos(az) * math.cos(el),
                 tgt.y + r * math.sin(az) * math.cos(el),
                 tgt.z + r * math.sin(el))
        # Slide the aim point toward whatever the overhead shot is meant to be centred on.
        if END_FILL > 0.0 and t > 0.0:
            # Solve the ending framing, then blend in over the same window so the move stays
            # continuous rather than snapping to the solved pose.
            corners = [(o.matrix_world @ v) for o, vs in SUBJ_PTS for v in vs]
            v_half = math.atan((CAM.data.sensor_height / 2.0) / CAM.data.lens)
            st, sd = frame_solve(tgt.copy(), az, el, dist, v_half, ASPECT, END_FILL, corners)
            tgt = tgt.lerp(st, t)
            dist = dist + (sd - dist) * t
            r = dist
            cam_p = (tgt.x + r * math.cos(az) * math.cos(el),
                     tgt.y + r * math.sin(az) * math.cos(el),
                     tgt.z + r * math.sin(el))
        elif END_ON in ('elevator', 'arm'):
            if END_ON == 'elevator':
                p = JZ.matrix_world.translation
                aim = mu.Vector((p.x, p.y, tgt.z))
            else:
                pts = [(o.matrix_world @ mu.Vector(cn)) for o in ARM_BODY for cn in o.bound_box]
                aim = mu.Vector((sum(v.x for v in pts) / len(pts),
                                 sum(v.y for v in pts) / len(pts), tgt.z))
            tgt = tgt.lerp(aim, t)
            cam_p = (tgt.x + r * math.cos(az) * math.cos(el),
                     tgt.y + r * math.sin(az) * math.cos(el),
                     tgt.z + r * math.sin(el))
    else:
        cam_p = (tgt.x + dist * math.cos(az), tgt.y + dist * math.sin(az), tgt.z + dh)
    for c, fcl in enumerate(fcs_ct):
        kp = fcl.keyframe_points[i]
        kp.handle_left_type = kp.handle_right_type = 'FREE'
        kp.interpolation = 'LINEAR'
        kp.co = (f, tgt[c])
    for c, fcl in enumerate(fcs_cam):
        kp = fcl.keyframe_points[i]
        kp.handle_left_type = kp.handle_right_type = 'FREE'
        kp.interpolation = 'LINEAR'
        kp.co = (f, cam_p[c])
for fc in fcs_cam + fcs_ct:
    fc.keyframe_points.sort()
    fc.update()
CAM.data.lens = 45.0

# f262 elevation check against the plate plane
scene.frame_set(262)
bpy.context.view_layer.update()
plate_top = max(max((o.matrix_world @ mu.Vector(c)).z for c in o.bound_box)
                for o in bpy.data.objects
                if o.type == 'MESH' and o is not NUT and o.parent and o.parent.name == 'JNT_Z')
cw = CAM.matrix_world.translation
nutw = sum((NUT.matrix_world @ mu.Vector(c) for c in NUT.bound_box), mu.Vector()) / 8
horiz = math.hypot(cw.x - nutw.x, cw.y - nutw.y)
print(f"  camera: dist {DIST0}->{DIST1} m (monotonic in), azimuth {math.degrees(AZ_TOTAL):.0f} deg total")
print(f"  f262 elevation above plate: {math.degrees(math.atan2(cw.z - plate_top, horiz)):.1f} deg")

bpy.ops.wm.save_mainfile()
print("\nBLEND SAVED - physics re-key complete")
