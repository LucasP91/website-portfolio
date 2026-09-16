/* ============================================================================
 *  SITE CONTENT  -  ALL website text lives here. Edit this file to rewrite copy.
 * ============================================================================
 *
 *  HOW TO EDIT (safe rules):
 *  • Only change the words *between the backticks* ` ... `.
 *      e.g.  title: `I build the things I'm told can't be built.`
 *                   ^^^^^^^^^^^^^^ change this, keep the backticks ^^^^^^^^^^^^
 *  • Backticks let you type apostrophes (') and quotes (") freely - no escaping.
 *  • Keep the commas, the [ ] brackets, and the { } braces as they are.
 *  • To add a bullet/tag/item, copy an existing line (with its quotes + comma)
 *    and edit it. To remove one, delete the whole line.
 *  • Don't rename the labels on the left (title:, heading:, etc.).
 *
 *  Symbols you can paste:  ·  (dot)   -  (en dash)   ↓ ↑ →   ✓
 * ============================================================================ */

const resumeUrl = `${import.meta.env.BASE_URL}resume.pdf`

export const content = {
  /* Name shown top-left and in the footer. */
  brand: `Lucas Picard`,

  /* Top navigation. `label` is the text; `href` jumps to that section - leave
     the # hrefs alone unless you also rename a section. */
  nav: [
    { label: `About`, href: `#about` },
    { label: `Experience`, href: `#experience` },
    { label: `Projects`, href: `#projects` },
    { label: `Contact`, href: `#contact` },
  ],

  /* ---- Hero (the big opening) ---- */
  hero: {
    /* Portrait shown above the title. Replace public/portrait.webp to swap the photo. */
    portrait: { src: `${import.meta.env.BASE_URL}portrait.webp`, alt: `Portrait of Lucas Picard` },
    eyebrow: `Mechanical & Robotics Engineering · WPI`,
    title: `From Dreams To Reality`,
    lede: `I'm Lucas Picard - a mechanical & robotics engineer, happiest the moment a hard problem finally clicks into hardware that actually works.`,
    primaryCta: { label: `View projects`, href: `#projects` },
    secondaryCta: { label: `Get in touch`, href: `#contact` },
    resumeCta: { label: `Resume ↓`, href: resumeUrl },
  },

  /* ---- The scroll-driven SCARA animation caption ---- */
  showcase: {
    // screen-reader description - says what the motion IS, since the visual carries it
    label: `SCARA robot arm running a coordinated move: the base sweeps, the forearm swings out to its stop, the carriage descends the lead screw, and the arm reverses back out`,
    caption: `SCARA Robot Arm`,
    captionNote: `Designed in CAD & 3D-printed - repurposed from salvaged Anet A8 parts. Scroll to run the move.`,
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
      { term: `WPI`, detail: `- Combined B.S./M.S. in Mechanical Engineering + B.S. major in Robotics Engineering, 4-year track, expected 2029` },
      { term: `3.75 GPA`, detail: `· Dean's List` },
      { term: `Now`, detail: `- Back at WPI for the fall 2026 semester` },
    ],
  },

  /* ---- Experience (the timeline). One { } block per job. ---- */
  experience: {
    heading: `Experience`,
    jobs: [
      {
        role: `Engineering Intern - Document & Controls`,
        org: `Microboard Processing`,
        place: `Seymour, CT · ITAR-regulated electronics mfr.`,
        dates: `Jun - Aug 2026`,
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
        dates: `Feb 2020 - Present`,
        bullets: [
          `Built and maintained KPI dashboards tracking MRR, ARPU, retention, churn, and acquisition to drive decisions.`,
          `Automated monthly metrics reporting through the Kajabi API and GitHub Actions, piping data into Google Sheets.`,
          `Analyzed membership cancellation data, surfacing renewal-window and engagement-based retention signals.`,
          `Delivered freelance CAD - designed, prototyped, and invoiced a wall-mount equipment cradle.`,
        ],
      },
      {
        role: `Service Staff (Seasonal)`,
        org: `Aquila's Nest Vineyards`,
        place: ``, // leave empty to hide
        dates: `Jul - Nov 2024`,
        bullets: [], // empty = no bullet points
      },
      {
        role: `Grocery Clerk`,
        org: `New Morning Market`,
        place: ``,
        dates: `Aug - Nov 2023`,
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
        meta: `Sophomore standing · 3.75 / 4.00 GPA · Dean's List. Entered with 21 AP transfer credits (Calculus I-II, Physics C: Mechanics & E&M, CS A, Art, U.S. Government).`,
        completed: [`Statics`, `Dynamics`, `Thermodynamics`, `Manufacturing Science & CNC`, `Intro to Robotics`, `Intro to ECE`, `Calculus III-IV`, `Differential Equations`, `Linear Algebra`],
        upcoming: [`Unified Robotics I-IV`, `Fluid Mechanics`, `Heat Transfer`, `Stress Analysis`, `Control Engineering`, `Materials Science`, `Software Engineering`],
        activities: `Combat Robotics · Club Badminton · Intramural Soccer`,
      },
      {
        school: `Pomperaug High School`,
        degree: `Southbury, CT`,
        place: ``,
        dates: `2021 - 2025`,
        meta: `4.06 / 4.5 GPA · Honor Roll all years · German Seal of Biliteracy.`,
        completed: [],
        upcoming: [],
        activities: ``,
      },
    ],
  },

  /* ---- Projects. One { } block per card. `tags` are the little chips.
         `note` is the optional blue line under a card (leave `` to hide).
         `slug` is the page URL (/projects/<slug>) - lowercase-with-dashes.
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
        blurb: `I turned a dead $150 3D printer into a teleoperated SCARA arm: a Python host solves the inverse kinematics live while an Xbox controller drives the end effector through Cartesian space, and absolute magnetic encoders give the rotary joints switch-free homing. About $120 in new parts - the rest is salvage, my own printed designs, and software I directed AI to build.`,
        tags: [`Onshape CAD`, `Mechatronics`, `Absolute encoders`, `3D printing`],
        note: `Shown spinning above ↑`,
        image: `${import.meta.env.BASE_URL}projects/scara-card.webp`,
        /* Wide screens use this variant on the project page - padded so the
           arm's column (elevator) is the horizontal center. Phones keep the
           tight `image` above. Leave `` to always use `image`. */
        pageImage: `${import.meta.env.BASE_URL}projects/scara-page.webp`,
        imageAlt: `Rendered CAD model of the SCARA robot arm`,
        imageFit: `contain`,
        page: {
          tagline: `A teleoperated SCARA arm built from a salvaged $150 3D printer. It's driven with an Xbox controller through live inverse kinematics and homes itself with absolute magnetic encoders. I calculated every gear ratio, diagnosed every failure, and reprinted every part at least once.`,
          sections: [
            {
              heading: `Overview`,
              paragraphs: [
                `The donor was a broken Anet A8, a $150 3D printer. Its NEMA 17 steppers, smooth rods, lead screw, endstop, and power supply all live on in this arm. Every structural part, including the arm segments, tower, carriage, and even the driven pulleys, is my own design in Onshape, printed on a Bambu Lab P1S. The total new spend was about $120, and most of that was one control board.`,
                `Today it's a working teleoperated robot. I drive the end effector in straight lines with an Xbox controller while a Python host solves the inverse kinematics live at 25 Hz and streams the motion to the board. A 160 mm upper arm and 138.5 mm forearm give it a 298.5 mm reach, and homing is just a sensor read at startup. The spinning model at the top of this site is the real assembly, exported from Onshape and rendered in Blender.`,
              ],
              bullets: [],
              image: `${import.meta.env.BASE_URL}projects/scara-real.webp`,
              imageAlt: `The finished SCARA arm standing on the floor: a 3D-printed black base, a three-rod vertical tower with the lead screw between the rods, and the upper arm and forearm reaching out to the right, with the motor wiring looped around the base`,
              imageCaption: `The arm as it stands today. The base, tower, carriage, arm segments and pulleys are all my own designs, printed at home; the rods, lead screw and steppers came out of the donor printer.`,
            },
            {
              heading: `Why a SCARA`,
              paragraphs: [
                `The salvaged motors turned out to be the weak 0.5 A variant. After decoding their labels, I found they had about a third of the torque of the NEMA 17s normally used in robotics. That killed my original 6-axis plan, since the elbow alone would have needed a 15-25:1 reduction. Instead of buying better motors, I changed the design. In a SCARA the arm joints sweep horizontally and never fight gravity, which means the same motors work fine with modest 2-5:1 belt reductions. The big thing is that a hardware limitation ended up deciding the whole architecture.`,
              ],
              bullets: [],
            },
            {
              heading: `Mechanical design`,
              paragraphs: [
                `The base joint rotates the entire three-rod Z tower. Two 60 mm bore bearings wrap around the stepper body itself. This shortened the tower by 80 mm and spread the bearings farther apart, which is what actually keeps the tower from tilting. The bearings' load rating is barely touched.`,
                `The vertical axis rides the printer's original T8×2 lead screw on three smooth rods. The screw is self-locking, so the arm holds its height with the power off, and I measured its practical top speed at around 12 mm/s. Soft limits on joint travel are set to protect the cable wrap rather than the mechanics. The encoders on the joint outputs measured the drivetrain's real backlash at about 1-1.5°.`,
              ],
              table: {
                headers: [`Parameter`, `Value`],
                rows: [
                  [`Upper arm (L1)`, `160 mm`],
                  [`Forearm (L2)`, `138.5 mm`],
                  [`Max reach`, `298.5 mm · 21.5 mm inner dead zone`],
                  [`J1 / J2 travel`, `±180° / ±150° (soft limits that protect the cables)`],
                  [`Z travel`, `280 mm, soft-capped · ~12 mm/s practical top speed`],
                  [`Measured rotary backlash`, `~1-1.5° at the joint outputs`],
                ],
              },
              image: `${import.meta.env.BASE_URL}projects/scara-workspace.svg`,
              imageAlt: `To-scale top-down plot of the reachable workspace: a 298.5 mm annulus with a 21.5 mm dead zone and the ±180° base seam marked`,
              imageCaption: `The workspace, drawn to scale from the kinematics constants. These are the same numbers the IK solver uses as its limits.`,
              bullets: [],
            },
            {
              heading: `Drivetrain`,
              paragraphs: [
                `Every reduction runs stock GT2 belts on driven pulleys I print myself: 5:1 on the base through a 100-tooth wheel and 2:1 on the elbow and wrist, with off-the-shelf aluminum pulleys on the motors. Timing belts work off tooth count, so printing error can affect how well the belt fits, but it can never change the ratio.`,
                `The printed pulleys taught me a real lesson about tolerances. A 40-tooth pulley sized by trial and error ran fine, but pitch error adds up tooth by tooth, and on a 100-tooth pulley it would have made the belt skip. Because of this, the big pulleys are built to corrected theoretical geometry (64.16 mm tip diameter) and tested with printed wedges first. The finished 100-tooth pulley drives the whole rotating tower without missing a tooth. When the belt length I originally measured turned out to be almost impossible to buy, I resized the pulleys and mounts around belt sizes that actually ship, so the final drivetrain runs stock belts with no idlers.`,
              ],
              table: {
                headers: [`Joint`, `Reduction`, `Ratio`, `Resolution`],
                rows: [
                  [`J1 · base`, `20T → 100T printed pulley`, `5:1`, `44.444 steps/°`],
                  [`J2 · elbow`, `20T → 40T printed pulley`, `2:1`, `17.778 steps/°`],
                  [`J4 · wrist`, `20T → 40T printed pulley`, `2:1`, `17.778 steps/° (wiring next)`],
                  [`Z · lift`, `T8×2 lead screw, direct`, `-`, `1600 steps/mm`],
                ],
              },
              bullets: [],
            },
            {
              heading: `Electronics`,
              paragraphs: [
                `A 32-bit SKR V1.4 Turbo runs Marlin with TMC2209 drivers in UART mode. It replaced the printer's original board, which died after shorting against the power supply housing and catching fire. The forced upgrade brought quieter drivers and native 3.3 V logic for the encoders. It also gave me a permanent habit: boards live on standoffs, and nothing gets handled while it's powered.`,
                `The weak motors caused another problem. At their rated 500 mA they couldn't reliably get the drivetrain moving, and Z stalled under the arm's weight. I fixed this by measuring instead of guessing. The run currents went up to 800 mA by default with tuning up to 1000-1200 mA, the Z driver switched from silent StealthChop to SpreadCycle for more starting torque, and I checked the thermals through the drivers' diagnostics.`,
              ],
              bullets: [],
            },
            {
              heading: `Sensing & switch-free homing`,
              paragraphs: [
                `Each rotary joint has an AS5600 12-bit absolute magnetic encoder mounted after the reduction, so it reads the true joint angle directly. This means homing is a read instead of a motion. A one-time calibration stores each joint's zero offset, and at startup the host reads the encoders and tells the firmware exactly where the arm is. There's no homing routine, and it survives power cycles.`,
                `Getting three identical sensors to talk was a project of its own. Every AS5600 has the same fixed I²C address, so the plan was to use a multiplexer, until the multiplexer turned out to be defective on the bench. The redesign skipped extra hardware entirely and used three separate I²C buses, one on the controller's hardware peripheral and two run in software on spare GPIO pins at about 80 kHz. Along the way I had to work around a broken I²C read in the platform framework by combining the write and read into one transfer. I also added custom Marlin G-codes (M970/M971) that report each encoder's angle, gain, and magnet strength, which is how I tuned the sensors' air gaps.`,
              ],
              image: `${import.meta.env.BASE_URL}projects/scara-homing.svg`,
              imageAlt: `Four-step diagram of switch-free homing: calibrate once, power on anywhere, read the encoders and sync the firmware, no homing motion required`,
              imageCaption: `Switch-free homing: calibrate once, and every power-up already knows where the arm is.`,
              bullets: [],
            },
            {
              heading: `Software - kinematics & teleop`,
              paragraphs: [
                `The PC does the thinking and the board does the moving. A lightweight Python host, with the kinematics written in plain standard-library math, handles the SCARA forward and inverse kinematics. It prefers one elbow solution and automatically falls back to the other, and round-trip self-tests check the math. The host also runs the workspace analysis and the operator interface. Stock Marlin handles what a motion controller is actually good at: step timing, acceleration, and coordinated multi-axis moves. The two talk in plain G-code over USB.`,
                `Teleop runs at 25 Hz from a wired Xbox controller read directly through the XInput API. The left stick moves the end effector, the bumpers move Z, the right stick will turn the wrist once it's wired, and the triggers will run the gripper. Two details make it feel solid. Each segment's feed rate is matched to the control loop so Marlin's planner never runs out of moves, which fixed a real stall-and-whine bug. Flow control also reads the planner's buffer reports to keep just enough motion queued.`,
                `The safety layer runs on the host and is always on. Every move is clamped to the reachable workspace, Z and wrist limits are enforced, and a base soft stop refuses any path that would wrap the base across the ±180° seam and twist the tower's cable harness. On-screen status flags show when a safety hold is active, so it doesn't look like a stall.`,
                `The firmware module and host software were built with AI. I direct the architecture, review every decision, and test everything on the real hardware.`,
              ],
              image: `${import.meta.env.BASE_URL}projects/scara-architecture.svg`,
              imageAlt: `Control architecture diagram: Xbox controller into the Python kinematics host, G-code over USB to Marlin and TMC2209 drivers, absolute encoders reporting back over three I²C buses`,
              imageCaption: `The host handles kinematics and safety, the controller handles step timing, and the encoders report the real joint angles back.`,
              bullets: [],
            },
            {
              heading: `Things that broke (and what they taught me)`,
              paragraphs: [
                `Nearly every subsystem got its final design from a failure I had to diagnose:`,
              ],
              bullets: [
                `Months of Z-axis wobble and grinding came down to one cause. An M8 threaded rod from the printer's frame had been mistaken for the lead screw, and the real T8×2 was in the salvage pile the whole time. Once it was swapped in, rotation was instantly smooth.`,
                `The original control board burned after shorting against the power supply housing. I contained it, figured out why it happened, and replaced it with a better board and a new habit for handling electronics.`,
                `The I²C multiplexer I bought to fix the encoders' shared address was itself defective, so I replaced it with a three-bus design that needed no extra hardware.`,
                `In the first bench tests, Z drove up when commanded down, and the endstop read as triggered while open. Every direction and polarity is now set from measurement instead of assumption.`,
                `The Marlin configuration branch I started from ships with an intentional compile error, so the firmware wouldn't build until I rebased the config onto the matching release branch.`,
                `Every printed part was reprinted at least once, and each revision fixed a problem I measured. That's just the cost of designing hardware by iterating.`,
              ],
            },
            {
              heading: `By the numbers`,
              paragraphs: [],
              bullets: [
                `298.5 mm reach · 21.5 mm inner dead zone · 280 mm of Z travel`,
                `~$120 in new parts, with the rest salvaged from the donor printer or already on hand`,
                `25 Hz teleop loop · up to 135 mm/s in XY · 44.444 steps per degree on the base`,
                `12-bit absolute encoders on three separate I²C buses · measured backlash ~1-1.5°`,
                `100-tooth printed pulley, tested driving the full rotating tower under load`,
                `0 limit switches on the rotary joints, since homing is a read instead of a search`,
              ],
            },
            {
              heading: `What's next`,
              paragraphs: [
                `Right now the arm is a working teleoperated system with three joints, and the base, elbow, and Z all run from the controller. The remaining wiring is for the wrist, which already has its motor mapping, encoder bus, and software, and for the gripper servo, whose commands already stream. The end effector's mechanical design comes last, based on how the arm actually behaves. After that I plan to build an electronics enclosure, save the driver tuning into the firmware, use the encoders live to catch missed steps, and measure the arm's accuracy and repeatability.`,
              ],
              bullets: [],
            },
          ],
          highlights: [
            `Xbox controller teleoperation at 25 Hz through live inverse kinematics`,
            `Switch-free absolute homing that needs one calibration and survives power cycles`,
            `Three-bus I²C encoder design, built after the multiplexer turned out to be defective`,
            `Custom Marlin G-codes (M970/M971) for encoder and magnet diagnostics`,
            `Self-printed GT2 pulleys up to 100 teeth, corrected for geometry and tested under load`,
            `~$120 in new parts on the frame of a salvaged printer`,
          ],
          status: `Teleoperated and driving · base, elbow & Z live · wrist + gripper wiring next`,
        },
      },
      {
        slug: `pengpt-ai-smart-pen`,
        title: `PenGPT - AI Smart Pen`,
        blurb: `A pen that turns handwriting on ordinary paper into text. Two motion sensors and a magnetometer track how the pen moves, and a Linux processor inside the pen is meant to do the reading itself, with no special paper and no phone in the loop. It's mainly a two-person project, with the work shared between us: a verified 268-part schematic and a 4-layer bring-up board now in layout.`,
        tags: [`KiCad`, `Schematic & PCB`, `Embedded hardware`, `Power design`],
        note: ``,
        image: `${import.meta.env.BASE_URL}projects/pengpt-board.webp`,
        pageImage: `${import.meta.env.BASE_URL}projects/pengpt-board-page.webp`,
        imageAlt: `3D render of the PenGPT rev-1 bring-up board in KiCad: the SG2002 processor, WiFi chip, flash, camera and display connectors, microSD and USB-C placed on a square green 4-layer board`,
        imageFit: `contain`,
        page: {
          tagline: `A pen that reads its own handwriting using motion sensors, a camera, and a Linux processor, with the recognition designed to run inside the pen itself.`,
          sections: [
            {
              heading: `Overview`,
              paragraphs: [
                `The idea is simple. You write normally on any paper, and the pen turns what you wrote into text on your phone or laptop. You don't need a dot-pattern notebook or a tablet, and you don't have to take a picture of the page afterward.`,
                `Instead of looking at the ink, the pen tracks its own motion. Two 6-axis IMUs, one at the tip and one at the rear, plus a 3-axis magnetometer give nine degrees of freedom. The IMUs sit at opposite ends because the farther apart they are, the more clearly a rotation shows up as a difference between them. A Sophgo SG2002 processor running Linux combines that motion data and is designed to run the handwriting model on the pen, so recognition works without a phone or the internet.`,
                `It's mainly a two-person project that started in March 2026. My teammate and I have shared a lot of the work, from the schematic to the design verification and the board layout.`,
              ],
              bullets: [],
              image: `${import.meta.env.BASE_URL}projects/pengpt-prototype.webp`,
              imageAlt: `An early PenGPT prototype held in a hand: a white tapered pen body with a small screen reading "Ready! Press button." and a camera near the back end`,
              imageCaption: `An early prototype from before the current design, with a status screen on the barrel. The rev-1 electronics on this page are a newer design that hasn't been built yet. Photo courtesy of my teammate.`,
            },
            {
              heading: `How it's meant to work`,
              paragraphs: [
                `Every step of this loop is wired in the schematic. The firmware and the recognition model don't exist yet, so this is how it's designed to behave, not a demo.`,
              ],
              bullets: [
                `You start writing and a tip switch closes, waking the processor.`,
                `The two IMUs and the magnetometer stream the pen's motion to the SG2002, which combines them and runs the recognition model.`,
                `When the model is unsure of a letter, a 5 MP autofocus camera can look at the page to settle it. Its power rail switches off when it isn't needed.`,
                `A 0.95" AMOLED strip on the barrel previews the text, and a haptic motor buzzes to confirm a word was caught.`,
                `The text goes to a phone or laptop over WiFi or Bluetooth.`,
              ],
            },
            {
              heading: `The hardware`,
              paragraphs: [
                `The SG2002 is the big thing that makes on-pen recognition realistic. It has a dual-core processor, 256 MB of DDR3 memory inside the package, and a built-in neural accelerator rated at about 1 TOPS. Turning a slow stream of motion data into letters only takes a small model, so that's plenty. It isn't enough for a conversational AI, since 256 MB is a hard limit, so the pen is designed to read handwriting rather than answer questions on its own.`,
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
              image: `${import.meta.env.BASE_URL}projects/pengpt-schematic.webp`,
              imageAlt: `The complete PenGPT schematic exported from KiCad, with the power tree, the SG2002 processor, the RTL8723DS radio, camera and display connectors, sensors, microphone and storage laid out on one sheet`,
              imageCaption: `The complete rev-1 schematic in KiCad, on one sheet: 268 parts and 208 nets.`,
            },
            {
              heading: `Power architecture`,
              paragraphs: [
                `USB-C or the battery feeds a charger that combines both onto one system rail. Three small buck converters make the processor's always-on rails: 0.95 V for the core, 1.35 V for the memory, and 1.8 V for I/O. A buck-boost converter makes 3.3 V, and a 2.8 V regulator runs off that for the camera and display.`,
                `The 3.3 V rail only turns on after the processor's boot ROM sets a power-sequencing pin. That meets Sophgo's sequencing rule, and it gives bring-up a clean first test: if 3.3 V shows up, the processor is alive. Separate load switches let the firmware cut power to the sensors, the camera, the display, and the whole radio. The radio needs that because Realtek's datasheet requires it to be power-cycled.`,
                `A pen has almost no room for a battery, so how much power it draws while idle decides whether it's usable. The team's target is about 10 hours on a charge, which is why every section that isn't needed can be switched fully off.`,
              ],
              bullets: [],
            },
            {
              heading: `Faults caught before a board was made`,
              paragraphs: [
                `Before starting layout, I checked the schematic against the manufacturers' own documents pin by pin, including all 24 camera connector pins and all 15 display pins. That turned up three faults that would each have cost a board:`,
              ],
              bullets: [
                `A boot strap was pulled the wrong way. It told the processor to boot from eMMC memory, and the board has no eMMC, so it would never have started. One resistor now pulls it the other way.`,
                `A pin the processor reads at power-up as a "firmware upgrade" key was wired to a sensor output that idles low. The board would have dropped into USB recovery mode on every cold start instead of running its software. The sensor signal moved to a free pin, and the key pin got a pull-up.`,
                `The radio's power switch had a control pin that its datasheet says can't be left floating, so it could never reliably hold the radio off. A pull-down now keeps it off until the firmware turns it on.`,
              ],
            },
            {
              heading: `A clean ERC isn't proof`,
              paragraphs: [
                `None of those faults showed up in KiCad's electrical rule check, and the first one was actually introduced by an earlier review. The schematic now passes ERC with no real errors, but I treat that as the bare minimum. Questions about connections get answered from a generated netlist and the manufacturer's datasheet, never from a summary document.`,
              ],
              bullets: [],
            },
            {
              heading: `Rev 1: a bring-up board, not a pen`,
              paragraphs: [
                `The first board is intentionally not shaped like a pen. It's a 100 × 100 mm, 4-layer test board with a ground plane and a power plane inside, so every section can be probed and fixed. It's built to be reworked: 16 series jumpers isolate sections, and a bodge area leaves room for fixes, so a wiring mistake costs an afternoon instead of a new board.`,
                `The fab specs come from measured pad sizes rather than guesses. There are no BGAs, and the processor's 0.35 mm pitch pins escape in a single row, meaning the board can be made at standard 4-layer pricing. All 268 parts are on the board, with the major ones placed by script, and routing is next.`,
              ],
              image: `${import.meta.env.BASE_URL}projects/pengpt-board-angle.webp`,
              imageAlt: `Angled 3D render of the rev-1 board in KiCad: major chips and connectors placed on the board, with rows of small passive parts staged beside it`,
              imageCaption: `The rev-1 board in layout. The major parts are placed, and the small passives wait beside the board to be placed next to the chips they support. Nothing is routed yet.`,
            },
            {
              heading: `What's next`,
              paragraphs: [
                `Routing the board comes first, with the goal of having boards back around November 2026. Before it's ordered, two open questions have to be settled, and then the board gets built and brought up one rail at a time:`,
              ],
              bullets: [
                `Confirm the battery has its own protection circuit, since the board has no protection IC.`,
                `Fix a crystal whose value and footprint disagree in the schematic, so the parts order is right.`,
                `Fabricate, assemble, and bring up the board, then write the firmware and train the recognition model.`,
                `Shrink the proven design into a pen-shaped board.`,
              ],
            },
          ],
          highlights: [
            `Writes on ordinary paper by tracking the pen's own motion in 9 degrees of freedom`,
            `Linux-class SG2002 processor chosen so recognition can run inside the pen`,
            `268-part schematic checked pin by pin against manufacturer documents`,
            `Caught three faults that ERC missed, two of which would have stopped the board from booting`,
            `4-layer bring-up board designed for rework at standard fab pricing`,
          ],
          status: `Schematic verified · rev-1 board placed, routing next · boards targeted for November 2026 · rev-1 not built yet`,
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
          tagline: `A used-car search system that watches 36 Connecticut dealer sites around the clock, prices every car against the local market, and pings Discord when the right one shows up. It costs $0 a month, and I built it by directing AI.`,
          sections: [
            {
              heading: `Overview`,
              paragraphs: [
                `Shopping for a reliable used car means refreshing a dozen dealer websites every day for weeks. I scoped a system to do that for me. One Python process scrapes about 36 Connecticut dealer sites every 6 hours, stores every listing in SQLite with its full price and mileage history, scores each car against the local market, and sends Discord alerts for new matches and price drops. Each alert also includes reliability warnings for that model, right when I'm deciding whether to go look at it.`,
                `The search it runs for is specific:`,
              ],
              bullets: [
                `Volkswagen · Hyundai · Mazda · Kia · Ford · Honda · Toyota`,
                `$7,000-$11,500 cash · 135k miles or less · 2015 or newer`,
                `Within 50 miles of Southbury, CT`,
                `Nissan and Chevrolet left out on purpose (CVT and Cruze reliability)`,
              ],
            },
            {
              heading: `Architecture`,
              paragraphs: [
                `The whole system is one Python process and one SQLite file, with no services, no queues, and no paid APIs. GitHub Actions starts it every 6 hours, five scraper engines pull listings from 36 sites, and an ingest layer removes duplicates by VIN and records every change. The database then feeds deal scoring, Discord alerts, a command-line tool, and a local dashboard.`,
              ],
              image: `${import.meta.env.BASE_URL}projects/car-scraper-architecture.svg`,
              imageAlt: `Architecture diagram: GitHub Actions cron drives five scraper engines over 36 dealer sites into SQLite, feeding deal scoring, Discord alerts, and a dashboard`,
              imageCaption: `The pipeline: scrape → dedup & track changes → score → alert. The database snapshot is saved between CI runs on an orphan git branch.`,
            },
            {
              heading: `Scraping sites that don't have an API`,
              paragraphs: [
                `Dealer inventory pages are JavaScript shells behind bot walls, and there's no public API to call. The trick that makes the whole system work is intercept and replay. Playwright drives the real page in Chromium so the Akamai bot wall sees a real browser, captures the exact inventory request the page sends for its own data, and then sends that request again with a larger page size to get the entire inventory in one JSON response. One parser per platform covers every store on it.`,
                `Not every source needs that much work. The platform most independent lots use serves plain JSON to a normal request, so no browser is needed at all. CarGurus sits behind a stricter anti-bot service, so I handle it the honest way with a manual-only mode that drives a real Chrome profile and lets a person solve the occasional CAPTCHA. It never runs in CI.`,
              ],
              image: `${import.meta.env.BASE_URL}projects/car-scraper-intercept.svg`,
              imageAlt: `Four-step diagram of the intercept-and-replay scraping pattern`,
              imageCaption: `Intercept and replay is the pattern behind the dealer.com engine, where one Playwright page load gets a whole store's inventory.`,
            },
            {
              heading: `Going where the cheap cars are`,
              paragraphs: [
                `The first few weeks of data showed a real fact about the market. The big franchise dealers with scrape-friendly websites rarely stock $7-10k cars, and the budget inventory is at independent lots. Instead of adding more franchise dealers, I changed direction. I added a new engine for the platform most CT independents use, registered about 35 independent dealers at once through a YAML file, and built an auto-discovery command. It searches for nearby used-car lots, checks each site's platform by probing for known inventory APIs, and safely adds confirmed dealers to the registry.`,
              ],
              bullets: [],
            },
            {
              heading: `Honest pricing`,
              paragraphs: [
                `Every car gets a Deal Score, which is how far its asking price sits below the market price. The market price is the median of close comparables, meaning the same make, model, and year within a 25,000-mile band, taken from the scraper's own data instead of a paid valuation API. If there are fewer than three comparables, it says "insufficient data" instead of making up a number. An earlier, looser fallback was removed on purpose after it gave misleading scores when there wasn't much data.`,
                `Real listings also forced me to clean up the prices. Independent lots love advertising a "finance special" price, so cash and finance prices are split, doc fees are recorded, and every price from the verify-by-phone platform gets a lower confidence rating so the ranking can tell solid prices from optimistic ones. Each alert also marks the car IN BUDGET or STRETCH compared to my price ceiling.`,
              ],
              bullets: [],
            },
            {
              heading: `Stateful automation on a stateless CI`,
              paragraphs: [
                `The scraper has no server. It runs on GitHub Actions' free tier, which forgets everything between runs. I solved this with a git trick, where the SQLite database is saved on an orphan branch as a single force-pushed commit. This lasts where caches get cleared and artifacts expire, and it never builds up binary history because the change history lives inside the database itself.`,
                `The reliability details are what make it trustworthy. Listings that disappear are only marked sold if their source was actually scraped that run, so one failed dealer never falsely "sells" its whole inventory. Alerts go through a notification log that allows one alert per VIN per state change, so another price drop alerts again but a re-scrape at the same price never does, and failed sends retry on the next run. If everything fails, it automatically opens a GitHub issue with the end of the log. A dry-run mode also runs the full pipeline inside a transaction, shows exactly what would happen, and then rolls it back.`,
              ],
              bullets: [],
            },
            {
              heading: `Alerts with a mechanic's memory`,
              paragraphs: [
                `A cheap car with a transmission that's about to fail isn't a deal. The system includes mechanic-level reliability rules that show up as a caution on the alert itself, right when I'm deciding:`,
              ],
              bullets: [
                `Ford Focus and Fiesta 2012-18 automatics, which use the failure-prone DPS6 "PowerShift" dual-clutch`,
                `Hyundai and Kia: avoid the Theta II GDI (2.0/2.4) and 1.6T engines, since the 2.0 MPI is the safe pick`,
                `VW EA888 1.8T/2.0T: check that the timing-chain tensioner has been serviced before buying`,
                `Structured engine and trim excludes with year ranges, plus per-VIN manual excludes so a car with a bad CarFax stays gone`,
              ],
            },
            {
              heading: `Discord as the control panel`,
              paragraphs: [
                `Changing filters shouldn't need a laptop and a git commit. A bot reads a private #bot-config channel at the start of each scheduled scrape and applies typed commands like set max-price 12000, add-make Subaru, exclude-vin, and show config, then replies with a check or a warning for each one.`,
                `Because it runs without anyone watching, each way it could fail is closed off. Only my messages are accepted, and the filters file stays the single source of truth that I can still edit by hand. Writes are atomic, with a last-good snapshot and a validation check before anything is saved, and a message cursor in the database makes sure each command applies exactly once, so old messages never run again.`,
              ],
              bullets: [],
            },
            {
              heading: `The dashboard`,
              paragraphs: [
                `For browsing instead of alerts, a single-file FastAPI + HTMX dashboard with no build step shows live filtering and sorting of active listings, price history for each VIN, and a top-deals view, all from the same SQLite file.`,
              ],
              image: `${import.meta.env.BASE_URL}projects/car-scraper-dashboard.webp`,
              imageAlt: `Screenshot of the local dashboard listing real cars with deal scores, mileage, prices, reliability warnings, and distances`,
              imageCaption: `The live dashboard on real data, showing deal scores where there are enough comparables, "insufficient data" where there aren't, reliability warnings, and verify-by-phone price markers.`,
            },
            {
              heading: `Built by directing AI`,
              paragraphs: [
                `This is the project where I proved my AI-directed development process on something real. I wrote the specs and made the judgment calls, like what counts as a duplicate, when a score is honest, and which failures matter. I directed AI to write the code, then reviewed and stress-tested each phase before moving on. Five phases over about two and a half weeks took it from a proof of concept on a single site to the full system, with a 175-test suite that keeps every rule in place.`,
              ],
              bullets: [],
            },
            {
              heading: `The outcome`,
              paragraphs: [
                `The search ran for about two weeks: 45 alerts, around ten cars I seriously looked into, and five I checked out in person. The checks the data can't do happened at the dealership, and they rejected more cars than they approved. One failed its cold start with the exact timing-chain rattle the engine excludes are there for, one drove fine until its history report showed two accidents and three trips through auction, one had an airbag deployment in its history, and the best-driving car of the whole search had an excluded engine and a past repossession. Every rejected car went on the exclude list so it stayed gone.`,
                `The frontrunner was a low-mileage Elantra the system found on its very first scrape, from the proof-of-concept dealer, with a brand-new factory engine and two careful owners. The database recorded the moment I lost it: its status flipped to inactive on June 3 after someone else bought it first.`,
                `The car I actually bought is the interesting part. It was a 2016 Mazda CX-3 Touring AWD from Modern Mazda, scraped on day two with its price drop to $10,397 saved in the history table. It never sent an alert, because at 140,181 miles it was over my own 135,000-mile limit and the filter did exactly what I told it to. When the Elantra sold, I raised the dashboard's mileage filter and there it was, already tracked with its full price history. After a pre-purchase inspection and a look through 28 service records, it was in my driveway.`,
                `The system didn't pick the car. The big thing is that it kept the whole market on file, so when my requirements changed, the right car was already there, priced, tracked, and one search away.`,
              ],
              bullets: [],
            },
            {
              heading: `By the numbers`,
              paragraphs: [],
              bullets: [
                `36 dealer sites · 5 scraper engines · scrape every 6 hours`,
                `3,001 listings tracked · 481 recorded price/mileage/status changes`,
                `Search: ~2 weeks · 45 alerts · ~10 cars pursued · 5 checked in person · 1 bought`,
                `~5,300 lines of Python across 33 modules · ~2,600 lines of tests (175 tests)`,
                `Built May 27 - June 14, 2026 in 5 phases · 20 commits`,
                `$0/month, with no paid APIs and the free CI tier`,
              ],
            },
          ],
          highlights: [
            `It worked: the car it tracked is in my driveway (2016 Mazda CX-3)`,
            `36 CT dealer sites on a 6-hour schedule for $0/month with no paid APIs`,
            `Intercept-and-replay scraping, where the engine reuses the page's own API call`,
            `Deal Score from its own data that won't guess with fewer than 3 comparables`,
            `Full price/mileage history in SQLite, saved on an orphan git branch`,
            `Discord both ways, with alerts going out and owner-only config commands coming in`,
          ],
          status: `Search complete · bought a car the system tracked · still running at $0/month`,
        },
      },
      {
        slug: `frc-robotics`,
        title: `FRC Robotics - Captain & Lead Driver`,
        blurb: `1000+ hours as captain and lead driver. I led CAD, mechanical build, and electrical integration across subteams and designed subsystems in Onshape / SolidWorks - and behind the wheel, I drove us to the team's first New England District Championship qualification in 10 years and its first CT State Championship.`,
        tags: [`Leadership`, `CAD`, `Robotics`],
        note: ``,
        image: `${import.meta.env.BASE_URL}projects/frc-team.jpg`,
        pageImage: ``,
        imageAlt: `Lucas and a teammate holding the district event finalist plaque and trophy at a New England FIRST competition`,
        imageFit: `cover`,
        page: {
          tagline: `Three seasons and 1000+ hours, captaining the team for two of them and driving the robot on match day.`,
          sections: [
            {
              heading: `Overview`,
              paragraphs: [
                `FIRST Robotics Competition gives you six weeks to design, build, and program a competition robot, then puts it on a field against the best teams in the region. I spent three seasons on my high school team, two of them as captain, and finished as captain and lead driver with 1000+ hours in the shop and behind the wheel.`,
              ],
              bullets: [],
            },
            {
              heading: `What I did`,
              paragraphs: [
                `As captain I was responsible for the whole team, not just the build side. I did not run the marketing and outreach subteams myself. I worked with their leads, guided them, and kept every subteam pointed the same way. My own hands-on work was CAD, mechanical build, and electrical integration, designing robot subsystems in Onshape and SolidWorks and troubleshooting in the pit between matches, where a broken mechanism has minutes to get fixed instead of days.`,
                `Build season ran Monday through Sunday. I put in 60-80 hour weeks on the robot while carrying a full course load.`,
                `As primary driver I got to test the design on the field. I drove the team to its first New England District Championship qualification in 10 years and its first CT State Championship at an off-season event.`,
              ],
              bullets: [],
              video: `${import.meta.env.BASE_URL}projects/frc-robotics.mp4`,
              videoPoster: `${import.meta.env.BASE_URL}projects/frc-video-poster.webp`,
              videoCaption: `Five minutes from three seasons on the team: the shop during build season, the robot on the field, and presenting our work.`,
            },
            {
              heading: `Bringing CAD to the team`,
              paragraphs: [
                `The first year I joined, nothing was planned. There was no real CAD, and the robot was scrap parts held together with tape and our hopes. I pushed for a fully developed CAD model over the next two years, and I was the only student on the CAD team. I spent a lot of time studying robots from past seasons to understand what made a design good or bad, so we could stop repeating other teams mistakes and our own.`,
                `That changed how the team designed. My junior year we committed to the first design we drew, and it was never adapted through prototypes. The next season we ran four robot iterations plus subsystem prototypes, which made the design adaptable and let programming start early instead of waiting for final hardware.`,
              ],
              bullets: [],
            },
            {
              heading: `Strategy before parts`,
              paragraphs: [
                `We started the season by studying the game in a way we never had before. We played it ourselves with students standing in for robots and took detailed notes on every part of it. That gave us our priorities, and the priorities gave the design team a robot it could actually finish: mechanically simple, focused on ranking points, and easy for alliance partners to work with.`,
              ],
              bullets: [],
            },
            {
              heading: `The wiring that kept costing us matches`,
              paragraphs: [
                `My sophomore year we had faulty electrical connections, with wires disconnecting in every single match of a competition. The big thing is that this was not a driving problem or a design problem, it was a connector problem. The next year we stopped using WAGO connectors and switched to JST and bullet connectors, and I spent my entire February vacation soldering bullet connectors onto every motor and controller. After that the robot was modular and it stayed connected.`,
                `Manufacturing taught a similar lesson. A new CNC router in our woodshop let us make parts quickly and accurately, but it also showed that not every part should be custom, because CNC work takes time. We started machining only the parts that needed it and buying the rest, which is how we built quickly enough to iterate.`,
              ],
              bullets: [],
            },
            {
              heading: `Training the team and speaking for it`,
              paragraphs: [
                `We are a small team working out of the school woodshop, so time is the resource we have least of. Preseason starts with new students of different ages and very little knowledge, so I built a system of lessons and assignments that taught the skills they would need. Once the season started we needed a way to keep track of who was doing what, so we moved onto project-management software to assign roles and tasks.`,
                `I also started the team presenting to people outside the shop. We present to our district Board of Education, to middle schoolers and to high schoolers at school events, and to community groups around town, including Heritage Village here in Southbury. Speaking for the team turned out to be as much a part of captaining it as the build was.`,
              ],
              bullets: [],
            },
          ],
          highlights: [
            `Team captain for two of three seasons · lead driver · 1000+ hours`,
            `Captained the whole team, guiding the subteam leads, including marketing and outreach`,
            `60-80 hour weeks through build season, Monday through Sunday, alongside a full course load`,
            `Introduced CAD to a team that had none, as its only CAD student`,
            `Four robot iterations and subsystem prototypes in one season, up from one`,
            `Rewired the robot with JST and bullet connectors, ending per-match disconnections`,
            `Built the preseason training system and moved the team onto project-management software`,
            `Presents for the team to the district Board of Education, schools and community groups`,
            `First New England District Championship qualification in 10 years`,
            `First CT State Championship (off-season event)`,
          ],
          status: `2022 - 2025 · alumni`,
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
      { group: `AI-Assisted Development`, items: `Directing AI tools to scope, build, and ship working software - robot firmware and control hosts, automation scripts, web scrapers, and data/reporting pipelines` },
    ],
    facts: [
      { label: `Awards`, text: `Dean's List (WPI, Fall 2025 & Spring 2026) · Honor Roll (Pomperaug, all years)` },
      { label: `Languages`, text: `English (native) · German (Seal of Biliteracy) - dual US/German citizen` },
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
  footerCredits: { label: `Open-source credits`, href: `${import.meta.env.BASE_URL}credits.txt` },
}
