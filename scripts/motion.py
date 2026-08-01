"""Machine-motion primitives for the SCARA hero film.  (TO_BUILD_08)

Two facts drive everything here:

1. A Blender Bezier ease with default handles is EXACTLY smoothstep,
   x = D(3t^2 - 2t^3), whose velocity is a parabola with a permanent 1.5x hump.
   A cubic's derivative is a quadratic, so no handle setting can hold a constant
   velocity. That hump is "floaty".

2. A constant-acceleration parabola IS a cubic Bezier (a degree-elevated
   quadratic), so a trapezoidal profile is representable EXACTLY:
       handle length = segment duration / 3        (in frames)
       handle slope  = instantaneous velocity at that key

Ringing is a damped 2nd-order response to the commanded profile, NOT backlash.
Backlash is a flat hold on reversal; ringing is an overshoot at every stop.
"""
import math

FPS = 24.0


# ----------------------------------------------------------------- profiles --
def plan(D, vmax, amax):
    """Trapezoid or triangle. Returns (shape, vpk, Ta, Tc, Td, T) in REAL seconds."""
    s = 1.0 if D >= 0 else -1.0
    D = abs(D)
    if D == 0:
        return ('none', 0.0, 0.0, 0.0, 0.0, 0.0, s)
    d_star = vmax * vmax / amax          # distance needed to reach vmax and stop
    if D <= d_star:
        vpk = math.sqrt(D * amax)        # never reaches commanded speed
        Ta = Td = vpk / amax
        Tc = 0.0
        shape = 'triangle'
    else:
        vpk = vmax
        Ta = Td = vmax / amax            # ramp time is CONSTANT once past d_star
        Tc = D / vmax - vmax / amax
        shape = 'trapezoid'
    return (shape, vpk, Ta, Tc, Td, Ta + Tc + Td, s)


def duration(D, vmax, amax):
    return plan(D, vmax, amax)[5]


def pos(t, D, vmax, amax):
    """Commanded position at REAL time t."""
    shape, vpk, Ta, Tc, Td, T, s = plan(D, vmax, amax)
    if shape == 'none':
        return 0.0
    A = vpk / Ta if Ta > 0 else 0.0
    if t <= 0:
        x = 0.0
    elif t < Ta:
        x = 0.5 * A * t * t
    elif t < Ta + Tc:
        x = 0.5 * A * Ta * Ta + vpk * (t - Ta)
    elif t < T:
        td = t - Ta - Tc
        x = 0.5 * A * Ta * Ta + vpk * Tc + vpk * td - 0.5 * A * td * td
    else:
        x = abs(D)
    return s * x


# ------------------------------------------------------------------ ringing --
def ring_response(u_samples, dt, f0, zeta):
    """Drive a damped 2nd-order system with the commanded signal u.

    x'' + 2*zeta*wn*x' + wn^2 x = wn^2 u

    Returns the LINK position, which overshoots and rings at every stop without
    any discontinuity -- the ring emerges from the deceleration rather than
    being pasted on afterwards.
    """
    wn = 2.0 * math.pi * f0
    x, v = u_samples[0], 0.0
    out = []
    sub = 8                                   # substeps for stability
    h = dt / sub
    for u in u_samples:
        for _ in range(sub):
            a = wn * wn * (u - x) - 2.0 * zeta * wn * v
            v += a * h
            x += v * h
        out.append(x)
    return out


# ----------------------------------------------------- exact Bezier handles --
def write_trapezoid(fc, f_start, x0, D, vmax, amax, time_scale=2.0):
    """Four keys with exact handles -> a true constant-velocity cruise.

    Editable in the Graph Editor, unlike a baked curve. Used where there is no
    ringing to represent (Z, camera).
    """
    shape, vpk, Ta, Tc, Td, T, s = plan(D, vmax, amax)
    if shape == 'none':
        return f_start
    # real seconds -> film frames
    fa, fc_, fd = (Ta * time_scale * FPS, Tc * time_scale * FPS, Td * time_scale * FPS)
    # on-screen velocity, in value-units per FRAME
    v_scr = s * vpk / (time_scale * FPS)
    xa = x0 + pos(Ta, D, vmax, amax)
    xb = x0 + pos(Ta + Tc, D, vmax, amax)
    x1 = x0 + D
    keys = [
        (f_start,                x0, 0.0,   fa / 3.0, 0.0,   fa / 3.0),
        (f_start + fa,           xa, v_scr, fa / 3.0, v_scr, max(fc_, 1e-6) / 3.0),
        (f_start + fa + fc_,     xb, v_scr, max(fc_, 1e-6) / 3.0, v_scr, fd / 3.0),
        (f_start + fa + fc_ + fd, x1, 0.0,  fd / 3.0, 0.0,   fd / 3.0),
    ]
    base = len(fc.keyframe_points)
    fc.keyframe_points.add(len(keys))
    for i, (f, val, sl_l, len_l, sl_r, len_r) in enumerate(keys):
        kp = fc.keyframe_points[base + i]
        # CRITICAL: type must be FREE *before* positions are written, or Blender
        # silently recomputes and discards them.
        kp.handle_left_type = kp.handle_right_type = 'FREE'
        kp.interpolation = 'BEZIER'
        kp.co = (f, val)
        kp.handle_left = (f - len_l, val - sl_l * len_l)
        kp.handle_right = (f + len_r, val + sl_r * len_r)
    return f_start + fa + fc_ + fd


def write_baked(fc, f_start, f_end, samples):
    """Per-frame LINEAR keys. Used where the curve is not Bezier-representable
    (the 2nd-order ring)."""
    n = int(round(f_end - f_start)) + 1
    base = len(fc.keyframe_points)
    fc.keyframe_points.add(n)
    for i in range(n):
        kp = fc.keyframe_points[base + i]
        kp.interpolation = 'LINEAR'
        kp.handle_left_type = kp.handle_right_type = 'FREE'
        kp.co = (f_start + i, samples[i])
    return f_end


def move_with_ring(fc, f_start, x0, D, vmax, amax, f0, zeta,
                   time_scale=2.0, ring_film_frames=40):
    """Commanded trapezoid + link ringing, baked per film frame.

    Returns (f_move_end, f_settled_end, shape, vpk, real_T).
    """
    shape, vpk, Ta, Tc, Td, T, s = plan(D, vmax, amax)
    if shape == 'none':
        return f_start, f_start, shape, 0.0, 0.0
    f_move = T * time_scale * FPS
    total_f = int(math.ceil(f_move)) + ring_film_frames
    dt_real = 1.0 / (FPS * time_scale)        # real seconds per film frame
    u = [x0 + pos(i * dt_real, D, vmax, amax) for i in range(total_f + 1)]
    x = ring_response(u, dt_real, f0, zeta)
    write_baked(fc, f_start, f_start + total_f, x)
    return f_start + f_move, f_start + total_f, shape, vpk, T


def vel(t, D, vmax, amax):
    """Commanded velocity at REAL time t."""
    shape, vpk, Ta, Tc, Td, T, s = plan(D, vmax, amax)
    if shape == 'none' or t <= 0 or t >= T:
        return 0.0
    A = vpk / Ta if Ta > 0 else 0.0
    if t < Ta:
        v = A * t
    elif t < Ta + Tc:
        v = vpk
    else:
        v = vpk - A * (t - Ta - Tc)
    return s * v
