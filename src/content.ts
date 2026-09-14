/* ============================================================================
 *  SITE CONTENT  —  ALL website text lives here. Edit this file to rewrite copy.
 * ============================================================================
 *
 *  HOW TO EDIT (safe rules):
 *  • Only change the words *between the backticks* ` ... `.
 *      e.g.  title: `I build the things I'm told can't be built.`
 *                   ^^^^^^^^^^^^^^ change this, keep the backticks ^^^^^^^^^^^^
 *  • Backticks let you type apostrophes (') and quotes (") freely — no escaping.
 *  • Keep the commas, the [ ] brackets, and the { } braces as they are.
 *  • To add a bullet/tag/item, copy an existing line (with its quotes + comma)
 *    and edit it. To remove one, delete the whole line.
 *  • Don't rename the labels on the left (title:, heading:, etc.).
 *
 *  Symbols you can paste:  ·  (dot)   —  (em dash)   ↓ ↑ →   ✓
 * ============================================================================ */

const resumeUrl = `${import.meta.env.BASE_URL}resume.pdf`

export const content = {
  /* Name shown top-left and in the footer. */
  brand: `Lucas Picard`,

  /* Top navigation. `label` is the text; `href` jumps to that section — leave
     the # hrefs alone unless you also rename a section. */
  nav: [
    { label: `About`, href: `#about` },
    { label: `Experience`, href: `#experience` },
    { label: `Projects`, href: `#projects` },
    { label: `Contact`, href: `#contact` },
  ],

  /* ---- Hero (the big opening) ---- */
  hero: {
    eyebrow: `Mechanical & Robotics Engineering · WPI`,
    title: `From Dreams To Reality`,
    lede: `I'm Lucas Picard — a mechanical & robotics engineer, happiest the moment a hard problem finally clicks into hardware that actually works.`,
    primaryCta: { label: `View projects`, href: `#projects` },
    secondaryCta: { label: `Get in touch`, href: `#contact` },
    resumeCta: { label: `Resume ↓`, href: resumeUrl },
  },

  /* ---- The scroll-driven SCARA animation caption ---- */
  showcase: {
    // screen-reader description — says what the motion IS, since the visual carries it
    label: `SCARA robot arm running a coordinated move: the base sweeps, the forearm swings out to its stop, the carriage descends the lead screw, and the arm reverses back out`,
    caption: `SCARA Robot Arm`,
    captionNote: `Designed in CAD & 3D-printed — repurposed from salvaged Anet A8 parts. Scroll to run the move.`,
  },

  /* ---- About ---- */
  about: {
    heading: `About`,
    /* One entry per paragraph. */
    paragraphs: [
      `What makes me lose track of time is the moment a stubborn problem finally clicks, when every piece comes together into something that actually works. I've chased that feeling since I rebalanced a Lego Technic motorcycle everyone said couldn't stand on its own, and since my uncle, a mechanical engineer in Germany, taught me to solder over Skype and shipped me a rough little 3D printer at eleven. I've been designing and building real hardware ever since.`,
      `Today I'm a mechanical engineering student at WPI on a combined B.S./M.S. in Mechanical Engineering, with a second B.S. major in Robotics Engineering. I design and build robotic systems, embedded electronics, and CAD assemblies, and I direct AI to write the software and automation around them. This past summer I was an engineering intern at Microboard Processing, and I'm a dual US/German citizen, bilingual in English and German.`,
    ],
    /* Quick-facts list. `term` shows in bold, then `detail`. */
    meta: [
      { term: `WPI`, detail: `— Combined B.S./M.S. in Mechanical Engineering + B.S. major in Robotics Engineering, 4-year track, expected 2029` },
      { term: `3.75 GPA`, detail: `· Dean's List` },
      { term: `Now`, detail: `— Back at WPI for the fall 2026 semester` },
    ],
  },

  /* ---- Experience (the timeline). One { } block per job. ---- */
  experience: {
    heading: `Experience`,
    jobs: [
      {
        role: `Engineering Intern — Document & Controls`,
        org: `Microboard Processing`,
        place: `Seymour, CT · ITAR-regulated electronics mfr.`,
        dates: `Jun – Aug 2026`,
        bullets: [
          `Automated digital engineering and documentation processes alongside an industrial engineer to streamline manufacturing workflows.`,
          `Built standardized SMT/PCB assembly process-flow documentation that sharpened consistency across the production line.`,
          `Applied disciplined data-handling within a regulated, compliance-sensitive environment.`,
        ],
      },
      {
        role: `Studio Assistant & Operations`,
        org: `Picard Studio`,
        place: `Southbury, CT · art-education business`,
        dates: `Feb 2020 – Present`,
        bullets: [
          `Built and maintained KPI dashboards tracking MRR, ARPU, retention, churn, and acquisition to drive decisions.`,
          `Automated monthly metrics reporting through the Kajabi API and GitHub Actions, piping data into Google Sheets.`,
          `Analyzed membership cancellation data, surfacing renewal-window and engagement-based retention signals.`,
          `Delivered freelance CAD — designed, prototyped, and invoiced a wall-mount equipment cradle.`,
        ],
      },
      {
        role: `Service Staff (Seasonal)`,
        org: `Aquila's Nest Vineyards`,
        place: ``, // leave empty to hide
        dates: `Jul – Nov 2024`,
        bullets: [], // empty = no bullet points
      },
      {
        role: `Grocery Clerk`,
        org: `New Morning Market`,
        place: ``,
        dates: `Aug – Nov 2023`,
        bullets: [],
      },
    ],
  },

  /* ---- Education. `completed`/`upcoming` are the chip lists; empty [] hides them. ---- */
  education: {
    heading: `Education`,
    completedLabel: `Completed coursework`,
    upcomingLabel: `Upcoming`,
    schools: [
      {
        school: `Worcester Polytechnic Institute`,
        degree: `Combined B.S./M.S. Mechanical Engineering · B.S. Robotics Engineering (double major)`,
        place: `Worcester, MA`,
        dates: `Expected 2029`,
        meta: `Sophomore standing · 3.75 / 4.00 GPA · Dean's List. Entered with 21 AP transfer credits (Calculus I–II, Physics C: Mechanics & E&M, CS A, Art, U.S. Government).`,
        completed: [`Statics`, `Dynamics`, `Thermodynamics`, `Manufacturing Science & CNC`, `Intro to Robotics`, `Intro to ECE`, `Calculus III–IV`, `Differential Equations`, `Linear Algebra`],
        upcoming: [`Unified Robotics I–IV`, `Fluid Mechanics`, `Heat Transfer`, `Stress Analysis`, `Control Engineering`, `Materials Science`, `Software Engineering`],
        activities: `Combat Robotics · Club Badminton · Intramural Soccer`,
      },
      {
        school: `Pomperaug High School`,
        degree: `Southbury, CT`,
        place: ``,
        dates: `2021 – 2025`,
        meta: `4.06 / 4.5 GPA · Honor Roll all years · German Seal of Biliteracy.`,
        completed: [],
        upcoming: [],
        activities: ``,
      },
    ],
  },

  /* ---- Projects. One { } block per card. `tags` are the little chips.
         `note` is the optional blue line under a card (leave `` to hide).
         `slug` is the page URL (/projects/<slug>) — lowercase-with-dashes.
         `image`/`imageAlt` show on the card and page (`` = placeholder).
         `page` is that project's detail page: a tagline, sections of
         paragraphs, a highlights list, and a status line. ---- */
  projects: {
    heading: `Projects`,
    readMore: `Read more →`,
    items: [
      {
        slug: `scara-robot-arm`,
        title: `SCARA Robot Arm`,
        blurb: `I turned a dead $150 3D printer into a teleoperated SCARA arm: a Python host solves the inverse kinematics live while an Xbox controller drives the end effector through Cartesian space, and absolute magnetic encoders give the rotary joints switch-free homing. About $120 in new parts — the rest is salvage, my own printed designs, and software I directed AI to build.`,
        tags: [`Onshape CAD`, `Mechatronics`, `Absolute encoders`, `3D printing`],
        note: `Shown spinning above ↑`,
        image: `${import.meta.env.BASE_URL}projects/scara-card.webp`,
        /* Wide screens use this variant on the project page — padded so the
           arm's column (elevator) is the horizontal center. Phones keep the
           tight `image` above. Leave `` to always use `image`. */
        pageImage: `${import.meta.env.BASE_URL}projects/scara-page.webp`,
        imageAlt: `Rendered CAD model of the SCARA robot arm`,
        imageFit: `contain`,
        page: {
          tagline: `A teleoperated SCARA arm salvaged from a $150 3D printer — driven through live inverse kinematics with an Xbox controller, homed switch-free by absolute magnetic encoders, with every gear ratio calculated, every failure diagnosed, and every part iterated.`,
          sections: [
            {
              heading: `Overview`,
              paragraphs: [
                `The donor was a broken Anet A8, a $150 3D printer. Its NEMA 17 steppers, smooth rods, lead screw, endstop, and power supply all live on in this arm; every structural part — arm segments, tower, carriage, even the driven pulleys — is my own design in Onshape, printed on a Bambu Lab P1S. Total new spend: about $120, most of it one control board.`,
                `Today it's a working teleoperated robot: I drive the end effector in straight Cartesian lines with an Xbox controller while a Python host solves the inverse kinematics live at 25 Hz and streams motion to the board. A 160 mm upper arm and 138.5 mm forearm give it a 298.5 mm reach, and homing is just a sensor read at startup. The spinning model at the top of this site is the real assembly, exported from Onshape and rendered in Blender.`,
              ],
              bullets: [],
            },
            {
              heading: `Why a SCARA`,
              paragraphs: [
                `The salvaged motors turned out to be the weak 0.5 A variant — decoding their labels revealed about a third the torque of robotics-standard NEMA 17s. That killed the original 6-axis plan; the elbow alone would have needed a 15–25:1 reduction. Instead of buying better motors, I changed the architecture: in a SCARA the arm joints sweep horizontally and never fight gravity, so the same motors became adequate with modest 2–5:1 belt reductions. A hardware limitation became the architecture decision.`,
              ],
              bullets: [],
            },
            {
              heading: `Mechanical design`,
              paragraphs: [
                `The base joint rotates the entire three-rod Z-tower. Two 60 mm-bore bearings wrap around the stepper body itself — a packaging trick that shortened the tower by 80 mm and widened the bearing spacing, which is what actually drives tilt stiffness (the bearings' load rating is barely touched).`,
                `The vertical axis rides the printer's original T8×2 lead screw on three smooth rods — self-locking, so the arm holds its height unpowered, with a measured practical ceiling around 12 mm/s. Joint travel is protected by soft limits chosen to guard the cable wrap rather than the mechanics, and the output-side encoders measured the drivetrain's real rotary backlash at about 1–1.5°.`,
              ],
              table: {
                headers: [`Parameter`, `Value`],
                rows: [
                  [`Upper arm (L1)`, `160 mm`],
                  [`Forearm (L2)`, `138.5 mm`],
                  [`Max reach`, `298.5 mm · 21.5 mm inner dead zone`],
                  [`J1 / J2 travel`, `±180° / ±150° (cable-protecting soft limits)`],
                  [`Z travel`, `280 mm, soft-capped · ~12 mm/s practical ceiling`],
                  [`Measured rotary backlash`, `~1–1.5° at the joint outputs`],
                ],
              },
              image: `${import.meta.env.BASE_URL}projects/scara-workspace.svg`,
              imageAlt: `To-scale top-down plot of the reachable workspace: a 298.5 mm annulus with a 21.5 mm dead zone and the ±180° base seam marked`,
              imageCaption: `The workspace, drawn to scale from the kinematics constants — the same numbers the IK solver clamps against.`,
              bullets: [],
            },
            {
              heading: `Drivetrain`,
              paragraphs: [
                `Every reduction runs stock GT2 belts on driven pulleys I print myself — 5:1 on the base through a 100-tooth wheel, 2:1 on the elbow and wrist, with off-the-shelf aluminum pulleys on the motor side. Synchronous belts key on tooth count, so printing error can affect belt fit — but never the ratio.`,
                `The printed pulleys taught me a real tolerance lesson. An empirically sized 40T ran fine, but pitch error accumulates tooth by tooth, and on a 100T it would guarantee skipping — so the big pulleys are built to corrected theoretical geometry (64.16 mm tip diameter) and proven with printed test wedges first. The finished 100T drives the whole rotating tower without missing a tooth. And when the originally measured belt length turned out to be essentially unbuyable, I resized the pulleys and mounts around belt sizes that actually ship — the final drivetrain runs stock belts with no idlers.`,
              ],
              table: {
                headers: [`Joint`, `Reduction`, `Ratio`, `Resolution`],
                rows: [
                  [`J1 · base`, `20T → 100T printed pulley`, `5:1`, `44.444 steps/°`],
                  [`J2 · elbow`, `20T → 40T printed pulley`, `2:1`, `17.778 steps/°`],
                  [`J4 · wrist`, `20T → 40T printed pulley`, `2:1`, `17.778 steps/° (wiring next)`],
                  [`Z · lift`, `T8×2 lead screw, direct`, `—`, `1600 steps/mm`],
                ],
              },
              bullets: [],
            },
            {
              heading: `Electronics`,
              paragraphs: [
                `A 32-bit SKR V1.4 Turbo runs Marlin with TMC2209 drivers in UART mode. It replaced the printer's original board, which died in a short against the power-supply housing — smoke, fire, gone. The forced upgrade brought quiet drivers and native 3.3 V logic for the encoders, plus a permanent habit: boards live on standoffs, and nothing gets handled powered.`,
                `The weak-motor story had a sequel: at their rated 500 mA the motors couldn't reliably break the drivetrain loose, and Z stalled under the arm's weight. The fix was measured, not guessed — run currents raised to 800 mA defaults with session tuning up to 1000–1200 mA, the Z driver switched from silent StealthChop to SpreadCycle for its starting torque, and thermals verified clean through the drivers' diagnostics.`,
              ],
              bullets: [],
            },
            {
              heading: `Sensing & switch-free homing`,
              paragraphs: [
                `Each rotary joint carries an AS5600 12-bit absolute magnetic encoder mounted on the joint output — after the reduction — so it reads the true joint angle directly. Homing is a read, not a motion: a one-time calibration stores each joint's zero offset, and at startup the host reads the encoders and tells the firmware exactly where the arm is. No homing dance, and it survives power cycles.`,
                `Getting three identical sensors talking was its own saga. Every AS5600 shares one fixed I²C address, so the plan was a multiplexer — until the multiplexer itself proved defective on the bench. The redesign skipped extra hardware entirely: three private I²C buses, one on the controller's hardware peripheral and two bit-banged in software on spare GPIO at ~80 kHz. Along the way, a broken I²C read path in the platform framework had to be worked around with a combined write-then-read transfer, and the firmware gained custom Marlin G-codes (M970/M971) that report each encoder's angle, gain, and magnet-strength flags — which is how I tuned the wired sensors' air gaps empirically.`,
              ],
              image: `${import.meta.env.BASE_URL}projects/scara-homing.svg`,
              imageAlt: `Four-step diagram of switch-free homing: calibrate once, power on anywhere, read the encoders and sync the firmware, no homing motion required`,
              imageCaption: `Switch-free homing: calibrate once, then every power-up starts already knowing where it is.`,
              bullets: [],
            },
            {
              heading: `Software — kinematics & teleop`,
              paragraphs: [
                `The control split is "PC is the brain, board is the muscle." A lightweight Python host — the kinematics itself is pure-stdlib math — owns the SCARA forward and inverse kinematics, with elbow-preference solving that automatically falls back to the other elbow solution, verified by round-trip self-tests, plus workspace analysis and the operator interface. Stock Marlin owns what a motion controller is genuinely good at: step timing, acceleration, coordinated multi-axis moves. They speak plain G-code over USB.`,
                `Teleop runs at 25 Hz from a wired Xbox controller, read through the XInput API directly: the left stick drives the end effector through Cartesian space, the bumpers move Z, the right stick will turn the wrist once it's wired, and the triggers will run the gripper. Two details make it feel solid. Each streamed segment's feedrate is paced to the control tick so Marlin's planner never starves — the fix for a real stall-and-whine bug — and flow control parses the planner's buffer reports to keep just enough motion queued.`,
                `The safety layer is host-side and always on: every move is clamped to the reachable workspace, Z and wrist limits are enforced, and a base soft-stop refuses any path that would wrap the base joint across the ±180° seam and wind up the tower's cable harness — with on-screen status flags so a protective hold never reads as a stall.`,
                `The firmware module and host software were built AI-assisted — I direct the architecture, review every decision, and test everything on the real hardware.`,
              ],
              image: `${import.meta.env.BASE_URL}projects/scara-architecture.svg`,
              imageAlt: `Control architecture diagram: Xbox controller into the Python kinematics host, G-code over USB to Marlin and TMC2209 drivers, absolute encoders reporting back over three I²C buses`,
              imageCaption: `PC is the brain, board is the muscle — kinematics and safety host-side, step timing on the controller, encoders reporting truth back.`,
              bullets: [],
            },
            {
              heading: `Things that broke (and what they taught me)`,
              paragraphs: [
                `Nearly every subsystem earned its final design through a diagnosed failure:`,
              ],
              bullets: [
                `Months of Z-axis wobble and grinding traced to one root cause: an M8 threaded rod from the printer's frame had been mistaken for the lead screw. The real T8×2 was in the salvage pile all along — rotation was instantly smooth.`,
                `The original control board burned in a short against the PSU housing. Contained, diagnosed, replaced with a better board — and a new handling discipline.`,
                `The I²C multiplexer bought to solve the encoders' shared-address problem was itself defective — replaced by a three-bus architecture that needed zero extra hardware.`,
                `First bench tests: Z drove up when commanded down, and the endstop read as triggered while open. Every direction and polarity is now set from measurement, not assumption.`,
                `The Marlin configuration branch I started from ships an intentional compile error — firmware builds failed until the config was rebased onto the matching release branch.`,
                `Every printed part was reprinted at least once, each revision driven by a measured problem. That's not failure — that's the budget for iterative hardware design.`,
              ],
            },
            {
              heading: `By the numbers`,
              paragraphs: [],
              bullets: [
                `298.5 mm reach · 21.5 mm inner dead zone · 280 mm of Z travel`,
                `~$120 in new parts — the rest salvaged from the donor printer or already on hand`,
                `25 Hz teleop loop · up to 135 mm/s in XY · 44.444 steps per degree on the base`,
                `12-bit absolute encoders on three private I²C buses · measured backlash ~1–1.5°`,
                `100-tooth printed pulley, validated driving the full rotating tower under load`,
                `0 limit switches on the rotary joints — homing is a read, not a search`,
              ],
            },
            {
              heading: `What's next`,
              paragraphs: [
                `The arm is a working three-joint teleoperated system today — base, elbow, and Z live under the controller. The remaining wiring is for the wrist, whose motor mapping, encoder bus, and software path already exist, and for the gripper servo, whose commands already stream. The end effector's mechanical design comes last, shaped by the arm's measured behavior. After that: an electronics enclosure, baking the proven driver tuning into firmware, using the encoders live for missed-step detection, and formally characterizing accuracy and repeatability.`,
              ],
              bullets: [],
            },
          ],
          highlights: [
            `Xbox-controller teleoperation at 25 Hz through live inverse kinematics`,
            `Switch-free absolute homing — calibrate once, survives power cycles`,
            `Three-bus I²C encoder architecture, designed after the multiplexer proved defective`,
            `Custom Marlin G-codes (M970/M971) for encoder and magnet diagnostics`,
            `Self-printed GT2 driven pulleys up to 100 teeth, geometry-corrected and load-proven`,
            `~$120 in new parts on a salvaged-printer skeleton`,
          ],
          status: `Teleoperated & driving — base, elbow & Z live · wrist + gripper wiring next`,
        },
      },
      {
        slug: `pengpt-ai-smart-pen`,
        title: `PenGPT — AI Smart Pen`,
        blurb: `A pen that turns handwriting on ordinary paper into text. Two motion sensors and a magnetometer track how the pen moves, and a Linux processor inside the pen is meant to do the reading itself, with no special paper and no phone in the loop. I lead the hardware on a two-person team: a verified 268-part schematic and a 4-layer bring-up board now in layout.`,
        tags: [`KiCad`, `Schematic & PCB`, `Embedded hardware`, `Power design`],
        note: ``,
        image: `${import.meta.env.BASE_URL}projects/pengpt-board.webp`,
        pageImage: `${import.meta.env.BASE_URL}projects/pengpt-board-page.webp`,
        imageAlt: `3D render of the PenGPT rev-1 bring-up board in KiCad: the SG2002 processor, WiFi chip, flash, camera and display connectors, microSD and USB-C placed on a square green 4-layer board`,
        imageFit: `contain`,
        page: {
          tagline: `A pen that reads its own handwriting — motion sensors, a camera and a Linux processor, with the recognition designed to run inside the pen itself.`,
          sections: [
            {
              heading: `Overview`,
              paragraphs: [
                `The idea is simple to say: write normally on any paper, and the pen turns what you wrote into text on your phone or laptop. No dot-pattern notebook, no tablet, and no photographing the page afterwards.`,
                `Instead of looking at the ink, the pen tracks its own motion. Two 6-axis IMUs, one at the tip and one at the rear, plus a 3-axis magnetometer give nine degrees of freedom. A Sophgo SG2002 processor running Linux fuses that motion and is designed to run the handwriting model on the pen, so recognition works with no phone and no internet.`,
                `It's a two-person project that started in March 2026. I lead the hardware: most of the recent schematic work, the design verification, and all of the board layout so far.`,
              ],
              bullets: [],
            },
            {
              heading: `How it's meant to work`,
              paragraphs: [
                `Every step of this loop is wired in the schematic. The firmware and the recognition model don't exist yet, so this is the designed behaviour, not a demo.`,
              ],
              bullets: [
                `You start writing and a tip switch closes, waking the processor.`,
                `The two IMUs and the magnetometer stream the pen's motion to the SG2002, which fuses them and runs the recognition model.`,
                `When the model is unsure of a letter, a 5 MP autofocus camera can look at the page to settle it. Its power rail switches off when it isn't needed.`,
                `A 0.95" AMOLED strip on the barrel previews the text, and a haptic motor buzzes to confirm a word was caught.`,
                `The text goes to a phone or laptop over WiFi or Bluetooth.`,
              ],
            },
            {
              heading: `The hardware`,
              paragraphs: [
                `The SG2002 is what makes on-pen recognition realistic. It has a dual-core processor, 256 MB of DDR3 memory inside the package, and a built-in neural accelerator rated at about 1 TOPS. Turning a low-rate stream of motion data into characters takes a small model, so that's plenty. It isn't enough for a conversational AI, where the 256 MB is the hard limit, so the pen is designed to read handwriting rather than answer questions on its own.`,
              ],
              table: {
                headers: [`Job`, `Part`, `Notes`],
                rows: [
                  [`Processor`, `Sophgo SG2002`, `Runs Linux. ARM or RISC-V cores selected by a strap pin, 256 MB DDR3 in package, ~1 TOPS accelerator`],
                  [`Wireless`, `Realtek RTL8723DS`, `WiFi b/g/n and Bluetooth as a bare chip, not a module. WiFi over SDIO, Bluetooth over UART and PCM audio`],
                  [`Motion`, `2× LSM6DSO32 + IIS2MDC`, `Tip and rear IMUs for a rotation baseline, with the magnetometer on the tip IMU's sensor hub`],
                  [`Camera`, `OV5648 module`, `5 MP autofocus on a 2-lane MIPI CSI-2 link through a 24-pin board-to-board connector`],
                  [`Display`, `0.95" AMOLED`, `120 × 240, SH8501B driver, 15-pin FPC`],
                  [`Feedback & input`, `DRV2605L, AT42QT1070, VEML7700, ICS-40720`, `Haptics, 7-channel capacitive touch, ambient light and an analog microphone`],
                  [`Storage`, `16 MB SPI-NOR + microSD`, `The flash is the boot device; the card is extra storage`],
                  [`Power`, `BQ25186 + NCP360`, `USB-C charging with over-voltage protection, single Li-ion cell`],
                ],
              },
            },
            {
              heading: `Power architecture`,
              paragraphs: [
                `USB-C or the battery feeds a charger that merges both onto one system rail. Three small buck converters make the processor's always-on rails: 0.95 V for the core, 1.35 V for the memory and 1.8 V for I/O. A buck-boost converter makes 3.3 V, and a 2.8 V regulator runs off that for the camera and display.`,
                `The 3.3 V rail only turns on after the processor's boot ROM asserts a power-sequencing pin. That satisfies Sophgo's sequencing rule, and it gives bring-up a clean first test: if 3.3 V appears, the processor is alive. Separate load switches let firmware cut power to the sensors, the camera, the display and the whole radio. The radio needs that, because Realtek's datasheet requires it to be power-cycled.`,
              ],
              bullets: [],
            },
            {
              heading: `Faults caught before a board was made`,
              paragraphs: [
                `Before starting layout, I audited the schematic against the manufacturers' own documents, pin by pin, including all 24 camera connector pins and all 15 display pins. That turned up three faults that would each have cost a board:`,
              ],
              bullets: [
                `A boot strap was pulled the wrong way. It told the processor to boot from eMMC memory, and the board has no eMMC, so it would never have started. One resistor now pulls it the other way.`,
                `A pin the processor reads at power-up as a "firmware upgrade" key was wired to a sensor output that idles low. The board would have dropped into USB recovery mode on every cold start instead of running its software. The sensor signal moved to a free pin, and the key pin got a pull-up.`,
                `The radio's power switch had a control pin that its datasheet says can't be left floating, so it could never reliably hold the radio off. A pull-down now keeps it off until firmware turns it on.`,
              ],
            },
            {
              heading: `A clean ERC isn't proof`,
              paragraphs: [
                `None of those faults showed up in KiCad's electrical rule check, and the first had been introduced by an earlier review. The schematic now passes ERC with no real errors, but I treat that as the minimum. Connectivity questions get answered from a generated netlist and the manufacturer's datasheet, never from a summary document.`,
              ],
              bullets: [],
            },
            {
              heading: `Rev 1: a bring-up board, not a pen`,
              paragraphs: [
                `The first board is deliberately not pen-shaped. It's a 100 × 100 mm, 4-layer test board with a ground plane and a power plane inside, so every subsystem can be probed and fixed. It's built for rework: 16 series jumpers isolate sections, and a bodge area leaves room for fixes, so a wiring mistake costs an afternoon instead of a new board.`,
                `The fab spec comes from measured pad geometry rather than guesswork. There are no BGAs, and the processor's 0.35 mm-pitch pins escape in a single row, so the board can be made at standard 4-layer pricing. All 268 parts are on the board, with the major ones placed by script; routing is next.`,
              ],
              image: `${import.meta.env.BASE_URL}projects/pengpt-board-angle.webp`,
              imageAlt: `Angled 3D render of the rev-1 board in KiCad: major chips and connectors placed on the board, with rows of small passive parts staged beside it`,
              imageCaption: `The rev-1 board in layout. The major parts are placed; the small passives wait beside the board to be placed next to the chips they support. Nothing is routed yet.`,
            },
            {
              heading: `What's next`,
              paragraphs: [
                `Routing the board comes first. Before it's ordered, two open questions have to be settled, and then the board gets built and brought up rail by rail:`,
              ],
              bullets: [
                `Confirm the battery carries its own protection circuit, since the board has no protection IC.`,
                `Resolve a crystal whose value and footprint disagree in the schematic, so the parts order is right.`,
                `Fabricate, assemble and bring up the board, then write the firmware and train the recognition model.`,
                `Shrink the proven design into a pen-shaped board.`,
              ],
            },
          ],
          highlights: [
            `Writes on ordinary paper by tracking the pen's own motion in 9 degrees of freedom`,
            `Linux-class SG2002 processor chosen so recognition can run inside the pen`,
            `268-part schematic verified pin by pin against manufacturer documents`,
            `Caught three faults that ERC missed, two of which would have stopped the board from booting`,
            `4-layer bring-up board designed for rework, at standard fab pricing`,
          ],
          status: `Schematic verified · rev-1 board placed, routing next · no hardware or firmware yet`,
        },
      },
      {
        slug: `ct-used-car-scraper`,
        title: `CT Used-Car Scraper`,
        blurb: `I scoped and directed (built with AI) a used-car-hunting system: every 6 hours it scrapes ~36 Connecticut dealer sites, tracks full price history in SQLite, scores each car against the local market, and sends Discord alerts with per-model reliability warnings. Filters are edited by typing commands into a Discord channel. The search ended with keys in hand.`,
        tags: [`AI-directed`, `Automation`, `Python / Playwright`, `Discord bot`],
        note: ``,
        image: `${import.meta.env.BASE_URL}projects/car-scraper-keys.webp`,
        pageImage: `${import.meta.env.BASE_URL}projects/car-scraper-keys-wide.webp`,
        imageAlt: `Lucas standing beside the grey Mazda CX-3 the search found, outside a Mazda dealership`,
        imageFit: `cover`,
        page: {
          tagline: `A used-car-hunting system that watches 36 Connecticut dealer sites around the clock, prices every car against the local market, and pings Discord when the right one shows up — built for $0 a month by directing AI.`,
          sections: [
            {
              heading: `Overview`,
              paragraphs: [
                `Shopping for a reliable used car means refreshing a dozen dealer websites, every day, for weeks. I scoped a system to do it for me: one Python process scrapes ~36 Connecticut dealer sites every 6 hours, stores every listing in SQLite with full price and mileage history, scores each car against the local market, and pushes Discord alerts for new matches and price drops — with per-model reliability warnings attached at exactly the moment of decision.`,
                `The search brief it serves is specific:`,
              ],
              bullets: [
                `Volkswagen · Hyundai · Mazda · Kia · Ford · Honda · Toyota`,
                `$7,000–$11,500 cash · 135k miles or less · 2015 or newer`,
                `Within 50 miles of Southbury, CT`,
                `Nissan and Chevrolet deliberately excluded (CVT and Cruze reliability)`,
              ],
            },
            {
              heading: `Architecture`,
              paragraphs: [
                `The whole system is one Python process and one SQLite file — no services, no queues, no paid APIs. GitHub Actions wakes it every 6 hours; five scraper engines pull listings from 36 sites; an ingest layer dedupes by VIN and records every change; and the database feeds deal scoring, Discord alerts, a CLI, and a local dashboard.`,
              ],
              image: `${import.meta.env.BASE_URL}projects/car-scraper-architecture.svg`,
              imageAlt: `Architecture diagram: GitHub Actions cron drives five scraper engines over 36 dealer sites into SQLite, feeding deal scoring, Discord alerts, and a dashboard`,
              imageCaption: `The pipeline: scrape → dedup & track changes → score → alert. The database snapshot persists between CI runs on an orphan git branch.`,
            },
            {
              heading: `Scraping sites that don't have an API`,
              paragraphs: [
                `Dealer inventory pages are JavaScript shells behind bot walls — there's no public API to call. The trick that makes the whole system work is intercept-and-replay: drive the real page in Playwright Chromium so the Akamai bot wall sees a real browser, capture the exact inventory request the page fires for its own data, then re-issue that request with a larger page size and take the entire inventory in one JSON response. One parser per platform covers every store on it.`,
                `Not every source needs the heavy machinery. The platform most independent lots use serves plain JSON to a plain request — no browser at all — and CarGurus, which sits behind a stricter anti-bot service, is handled the honest way: a deliberately manual-only mode drives a real Chrome profile so a human can solve the occasional CAPTCHA. It never runs in CI.`,
              ],
              image: `${import.meta.env.BASE_URL}projects/car-scraper-intercept.svg`,
              imageAlt: `Four-step diagram of the intercept-and-replay scraping pattern`,
              imageCaption: `Intercept-and-replay, the pattern behind the dealer.com engine — one Playwright page load yields a whole store's inventory.`,
            },
            {
              heading: `Going where the cheap cars are`,
              paragraphs: [
                `The first weeks of data exposed a real market fact: the big franchise dealers with scrape-friendly websites rarely stock $7–10k cars. The budget inventory lives at independent lots. Instead of adding more franchise dealers, the system pivoted — a new engine for the platform most CT independents use, ~35 independent dealers bulk-registered through a YAML registry, and an auto-discovery command that searches for nearby used-car lots, verifies each site's platform by probing for known inventory APIs, and safely merges confirmed finds into the registry.`,
              ],
              bullets: [],
            },
            {
              heading: `Honest pricing`,
              paragraphs: [
                `Every car gets a Deal Score: how far its asking price sits below the market reference, where "market" is the median price of tight comparables — same make, model, and year within a 25,000-mile band — drawn from the scraper's own corpus rather than a paid valuation API. If fewer than three comparables exist, it reports "insufficient data" instead of a made-up number; an earlier looser fallback was deliberately removed after it produced misleading scores on thin data.`,
                `Real listings also forced price-quality hardening: independents love advertising a "finance special" price, so cash and finance prices are split, doc fees are captured, and every price from the verify-by-phone platform carries a lower confidence rating so ranking can tell solid prices from optimistic ones. Each alert also tags the car IN BUDGET or STRETCH against the ceiling.`,
              ],
              bullets: [],
            },
            {
              heading: `Stateful automation on a stateless CI`,
              paragraphs: [
                `The scraper has no server — it runs on GitHub Actions' free tier, which forgets everything between runs. The state problem is solved with a git trick: the SQLite database persists on an orphan branch as a single force-pushed commit — durable where caches get evicted and artifacts expire, and never accumulating binary history because change history lives inside the database itself.`,
                `The reliability details are where it earns trust: vanished listings are only marked sold for sources actually scraped that run, so one failed dealer never falsely "sells" its inventory; alerts dedupe through a notification ledger — one alert per VIN per state change, so a further price drop alerts again but a re-scrape of the same price never does — and failed sends self-heal on the next run. A total failure automatically opens a GitHub issue with the log tail, and a dry-run mode executes the full pipeline inside a transaction, shows exactly what would happen, then rolls back.`,
              ],
              bullets: [],
            },
            {
              heading: `Alerts with a mechanic's memory`,
              paragraphs: [
                `A cheap car with a doomed transmission is not a deal. The system encodes mechanic-grade reliability rules that surface as a caution on the alert itself — at exactly the moment of decision:`,
              ],
              bullets: [
                `Ford Focus and Fiesta 2012–18 automatics — failure-prone DPS6 "PowerShift" dual-clutch`,
                `Hyundai and Kia — avoid the Theta II GDI (2.0/2.4) and 1.6T engines; the 2.0 MPI is the safe pick`,
                `VW EA888 1.8T/2.0T — verify timing-chain tensioner service before buying`,
                `Structured engine and trim excludes with year ranges, plus per-VIN manual excludes so a bad-CarFax car stays gone`,
              ],
            },
            {
              heading: `Discord as the control panel`,
              paragraphs: [
                `Changing filters shouldn't require a laptop and a git commit. A bot reads a private #bot-config channel at the start of each scheduled scrape and applies typed commands — set max-price 12000, add-make Subaru, exclude-vin, show config — then replies with a check or warning per command.`,
                `Because it runs unattended, the failure modes are each explicitly closed off: only the owner's messages are accepted, the filters file stays the single source of truth (and stays hand-editable), writes are atomic with a last-good snapshot and round-trip validation before commit, and a message cursor in the database guarantees each command applies exactly once — old history is never re-executed.`,
              ],
              bullets: [],
            },
            {
              heading: `The dashboard`,
              paragraphs: [
                `For browsing rather than alerts, a single-file FastAPI + HTMX dashboard (no build step) serves live filter and sort over active listings, per-VIN price history, and a top-deals view straight from the same SQLite file.`,
              ],
              image: `${import.meta.env.BASE_URL}projects/car-scraper-dashboard.webp`,
              imageAlt: `Screenshot of the local dashboard listing real cars with deal scores, mileage, prices, reliability warnings, and distances`,
              imageCaption: `The live dashboard on real data — deal scores where enough comparables exist, "insufficient data" where they don't, reliability warnings, and verify-by-phone price markers.`,
            },
            {
              heading: `Built by directing AI`,
              paragraphs: [
                `This is the project where I proved out my AI-directed development loop on something real. I wrote the specs, made the judgment calls — what counts as a duplicate, when a score is honest, which failure modes matter — and directed AI to write the code, then reviewed and stress-tested each phase before moving on. Five spec-driven phases over about two and a half weeks took it from a single-site proof of concept to the full system, backed by a 175-test suite that keeps every rule pinned down.`,
              ],
              bullets: [],
            },
            {
              heading: `The outcome`,
              paragraphs: [
                `The search ran about two weeks in earnest: 45 alerts, roughly ten cars seriously pursued, five vetted in person. The vetting the data can't do happened at the curb, and it rejected more cars than it approved — one failed its cold start with the exact timing-chain rattle the engine excludes encode, one drove fine until its history report revealed two accidents and three auction trips, one had airbag-deployment history, and the best-driving car of the search sat on an excluded engine with a repossession in its past. Every rejection went into the per-VIN exclude list, so it stayed gone.`,
                `The frontrunner was a low-mileage Elantra the system had surfaced on its very first scrape — day one, from the proof-of-concept dealer — with a brand-new factory engine and two gentle owners. The database recorded the moment it got away: status flipped to inactive on June 3, sold to someone else first.`,
                `The car I actually bought is the honest twist. A 2016 Mazda CX-3 Touring AWD from Modern Mazda — scraped on day two, its price drop to $10,397 recorded in the history table — that never sent an alert, because at 140,181 miles it sat over my own 135,000-mile ceiling and the filter did exactly what it was told. When the Elantra sold, I widened the dashboard's mileage filter, and there it was: already tracked, price history and all. A pre-purchase inspection and 28 service records later, it was in the driveway.`,
                `The system didn't pick the car. It kept the whole market on file, so when my requirements bent, the right car was already there — priced, tracked, and one query away.`,
              ],
              bullets: [],
            },
            {
              heading: `By the numbers`,
              paragraphs: [],
              bullets: [
                `36 dealer sites · 5 scraper engines · scrape every 6 hours`,
                `3,001 listings tracked · 481 recorded price/mileage/status changes`,
                `Search: ~2 weeks · 45 alerts · ~10 cars pursued · 5 vetted in person · 1 bought`,
                `~5,300 lines of Python across 33 modules · ~2,600 lines of tests (175 tests)`,
                `Built May 27 – June 14, 2026 in 5 phases · 20 commits`,
                `$0/month — no paid APIs, free CI tier`,
              ],
            },
          ],
          highlights: [
            `It worked — the car it tracked is in the driveway (2016 Mazda CX-3)`,
            `36 CT dealer sites on a 6-hour cron — $0/month, no paid APIs`,
            `Intercept-and-replay scraping: the page authenticates itself, the engine reuses its own API call`,
            `Deal Score from its own corpus — refuses to guess below 3 comparables`,
            `Full price/mileage history in SQLite, persisted on an orphan git branch`,
            `Discord both ways: alert embeds out, owner-only typed config commands in`,
          ],
          status: `Search complete — bought a car the system tracked · cron still running at $0/month`,
        },
      },
      {
        slug: `frc-robotics`,
        title: `FRC Robotics — Captain & Lead Driver`,
        blurb: `1000+ hours as captain and lead driver. I led CAD, mechanical build, and electrical integration across subteams and designed subsystems in Onshape / SolidWorks — and behind the wheel, I drove us to the team's first New England District Championship qualification in 10 years and its first CT State Championship.`,
        tags: [`Leadership`, `CAD`, `Robotics`],
        note: ``,
        image: `${import.meta.env.BASE_URL}projects/frc-team.jpg`,
        pageImage: ``,
        imageAlt: `Lucas and a teammate holding the district event finalist plaque and trophy at a New England FIRST competition`,
        imageFit: `cover`,
        page: {
          tagline: `Four seasons, 1000+ hours — leading the build during the week and driving the robot on match day.`,
          sections: [
            {
              heading: `Overview`,
              paragraphs: [
                `FIRST Robotics Competition gives you six weeks to design, build, and program a competition robot — then puts it on a field against the best teams in the region. I spent four seasons on my high-school team, finishing as captain and lead driver with 1000+ hours in the shop and behind the wheel.`,
              ],
              bullets: [],
            },
            {
              heading: `What I did`,
              paragraphs: [
                `I led CAD, mechanical build, and electrical integration across subteams, designing robot subsystems in Onshape and SolidWorks and troubleshooting fast in the pit between matches, where a broken mechanism has minutes to get fixed, not days.`,
                `As primary driver I put the design to the test on the field — driving us to the team's first New England District Championship qualification in 10 years, and its first CT State Championship at an off-season event.`,
              ],
              bullets: [],
            },
          ],
          highlights: [
            `Team captain & lead driver · 1000+ hours over four seasons`,
            `Subsystem design in Onshape / SolidWorks across subteams`,
            `First New England District Championship qualification in 10 years`,
            `First CT State Championship (off-season event)`,
          ],
          status: `2021 – 2025 · alumni`,
        },
      },
    ],
  },

  /* ---- Labels used on the project detail pages ---- */
  projectPage: {
    back: `← All projects`,
    highlightsLabel: `Highlights`,
    statusLabel: `Status`,
  },

  /* ---- Skills + the Awards/Languages/Interests strip below them ---- */
  skills: {
    heading: `Skills`,
    groups: [
      { group: `CAD & Design`, items: `SolidWorks, Onshape, GD&T, design for manufacturability` },
      { group: `Electronics`, items: `KiCad PCB design, soldering, ESP32 / Arduino, closed-loop control, sensors & encoders` },
      { group: `Prototyping`, items: `3D printing, manual milling, laser cutting, CAM` },
      { group: `AI-Assisted Development`, items: `Directing AI tools to scope, build, and ship working software — robot firmware and control hosts, automation scripts, web scrapers, and data/reporting pipelines` },
    ],
    facts: [
      { label: `Awards`, text: `Dean's List (WPI, Fall 2025) · Honor Roll (Pomperaug, all years)` },
      { label: `Languages`, text: `English (native) · German (Seal of Biliteracy) — dual US/German citizen` },
      { label: `Interests`, text: `Acrylic painting · drawing · music performance · robotics` },
    ],
  },

  /* ---- Contact. Each link: `label` is the text; `href` is where it goes.
         A line with no `href` shows as plain text (like the location). ---- */
  contact: {
    heading: `Contact`,
    intro: `Building something, hiring, or want to talk hardware? Reach out.`,
    links: [
      { label: `lucassamuelpicard@gmail.com`, href: `mailto:lucassamuelpicard@gmail.com` },
      { label: `475.281.1281`, href: `tel:+14752811281` },
      { label: `github.com/LucasP91`, href: `https://github.com/LucasP91` },
      { label: `Resume (PDF)`, href: resumeUrl },
      { label: `Southbury, CT`, href: `` }, // empty href = plain text (not a link)
    ],
  },

  /* Footer. {year} is replaced automatically with the current year. */
  footer: `© {year} Lucas Picard.`,
}
