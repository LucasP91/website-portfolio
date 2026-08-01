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
J1_SEG = [(46, 12.0), (70, -55.0)]
fc_j1 = fcurve(J1, 'rotation_euler', 2)
u1, x1 = joint_track(fc_j1, [(f, D2R(d)) for f, d in J1_SEG],
                     D2R(300), D2R(1100), 12.0, 0.10, D2R(168))
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
J2_REST = -170.0
J2_STOP = -20.0                                  # hard stop: encoder topper vs stage-1 arm
J2_TRAVEL = J2_STOP - J2_REST                    # 150 deg
J2_VMAX = 100.0                                  # deg/s -- coordinated feed, not full tilt
J2_LIMIT = (D2R(J2_REST), D2R(J2_STOP))
J2_SEG = [(150, J2_TRAVEL)]                      # inside the f136->f262 descent
fc_j2 = fcurve(J2, 'rotation_euler', 2)
u2, x2 = joint_track(fc_j2, [(f, D2R(d)) for f, d in J2_SEG],
                     D2R(J2_VMAX), D2R(1400), 16.0, 0.10, D2R(J2_REST), limit=J2_LIMIT)

for nm, seg, v, a in (('J1 refusal', 12.0, 300, 1100), ('J1 reach', 55.0, 300, 1100),
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


def smoothblend(a, b, t):
    t = max(0.0, min(1.0, t))
    return a + (b - a) * (t * t * (3 - 2 * t))


DIST0, DIST1 = 0.98, 0.46                        # monotonic IN; a 400 mm machine needs
                                                 # ~1 m to read whole at 45 mm
AZ0 = D2R(-100)
AZ_TOTAL = D2R(30.0)                             # <= 35 deg
ELEV_HI0, ELEV_LO, ELEV_HI1 = 0.300, -0.060, 0.260   # shallow U, metres above target
S_LOW = 0.55

fcs_cam = [fcurve(CAM, 'location', i) for i in range(3)]
fcs_ct = [fcurve(CT, 'location', i) for i in range(3)]
for fc in fcs_cam + fcs_ct:
    fc.keyframe_points.add(288)

for i in range(288):
    f = i + 1
    scene.frame_set(f)
    bpy.context.view_layer.update()
    nut = sum((NUT.matrix_world @ mu.Vector(c) for c in NUT.bound_box), mu.Vector()) / 8
    tow = JZ.matrix_world.translation
    mech = mu.Vector((tow.x, tow.y, 0.355))
    s = spine(f)
    # target: nut at both ends, mechanism through the middle
    w_nut = max(smoothblend(1.0, 0.0, s / 0.30), smoothblend(0.0, 1.0, (s - 0.62) / 0.38))
    tgt = nut * w_nut + mech * (1.0 - w_nut)
    dist = DIST0 + (DIST1 - DIST0) * s
    az = AZ0 + AZ_TOTAL * s
    dh = (smoothblend(ELEV_HI0, ELEV_LO, s / S_LOW) if s < S_LOW
          else smoothblend(ELEV_LO, ELEV_HI1, (s - S_LOW) / (1 - S_LOW)))
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
