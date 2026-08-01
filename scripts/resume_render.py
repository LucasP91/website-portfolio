"""Render only the frames that are missing from an output directory.

Written for resuming after an interrupted run. Two things it handles that a plain
re-render does not:

1. It DISCARDS THE LAST FILE IT FINDS unless --keep-last is passed. A process killed
   mid-write leaves a truncated PNG on disk, and a truncated PNG still counts as "present"
   to a naive existence check -- so the corrupt frame silently survives into the final
   sequence. Dropping the highest-numbered file costs one frame of render time and removes
   the failure mode entirely.
2. It reports what it will do before doing it, so a resume that thinks everything is
   missing (wrong --out, wrong frame range) is obvious rather than a two-hour surprise.

Usage:
  blender -b Untitled.blend -P scripts/resume_render.py -- \
      --out preview/final --res 3120x1500 --samples 768 [--keep-last] [--dry]

Passes everything else through to the same settings render_frames.py uses.
"""
import bpy, os, sys, re

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []


def opt(name, default):
    return argv[argv.index(name) + 1] if name in argv else default


OUT = os.path.join(os.path.dirname(bpy.data.filepath), opt('--out', 'preview/final'))
RES = opt('--res', '3120x1500')
SAMPLES = int(opt('--samples', 768))
KEEP_LAST = '--keep-last' in argv
DRY = '--dry' in argv

scene = bpy.context.scene
first, last = scene.frame_start, scene.frame_end

have = set()
if os.path.isdir(OUT):
    for f in os.listdir(OUT):
        m = re.fullmatch(r'f_(\d{4})\.png', f)
        if m:
            have.add(int(m.group(1)))

if have and not KEEP_LAST:
    doomed = max(have)
    have.discard(doomed)
    print(f"  dropping f{doomed:04d} (may have been truncated by the interrupt; "
          f"pass --keep-last to trust it)")

todo = [f for f in range(first, last + 1) if f not in have]
print(f"  output   {OUT}")
print(f"  present  {len(have)} / {last - first + 1}")
print(f"  to render {len(todo)}"
      + (f"   {todo[0]}..{todo[-1]}" if todo else "   nothing - sequence is complete"))

if DRY or not todo:
    print("\nRESUME DRY RUN" if DRY else "\nNOTHING TO DO")
else:
    sys.argv = [sys.argv[0], '--',
                '--frames', ','.join(str(f) for f in todo),
                '--res', RES, '--samples', str(SAMPLES),
                '--out', opt('--out', 'preview/final')]
    exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                           'render_frames.py')).read())
