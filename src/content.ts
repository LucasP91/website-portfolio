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
    label: `SCARA robot arm, 360-degree turntable`, // screen-reader description
    caption: `SCARA Robot Arm`,
    captionNote: `Designed in CAD & 3D-printed — repurposed from salvaged Anet A8 parts. Scroll to orbit.`,
  },

  /* ---- About ---- */
  about: {
    heading: `About`,
    /* One entry per paragraph. */
    paragraphs: [
      `What makes me lose track of time is the moment a stubborn problem finally clicks, when every piece comes together into something that actually works. I've chased that feeling since I rebalanced a Lego Technic motorcycle everyone said couldn't stand on its own, and since my uncle, a mechanical engineer in Germany, taught me to solder over Skype and shipped me a rough little 3D printer at eleven. I've been designing and building real hardware ever since.`,
      `Today I'm a mechanical engineering student at WPI on a combined B.S./M.S. in Mechanical Engineering, with a second B.S. major in Robotics Engineering. I design and build robotic systems, embedded electronics, and CAD assemblies, and I direct AI to write the software and automation around them. I'm an engineering intern at Microboard Processing, and a dual US/German citizen, bilingual in English and German.`,
    ],
    /* Quick-facts list. `term` shows in bold, then `detail`. */
    meta: [
      { term: `WPI`, detail: `— Combined B.S./M.S. in Mechanical Engineering + B.S. major in Robotics Engineering, 4-year track, expected 2029` },
      { term: `3.75 GPA`, detail: `· Dean's List` },
      { term: `Now`, detail: `— Engineering Intern, Microboard Processing (Seymour, CT)` },
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
        dates: `Jun 2026 – Present`,
        bullets: [
          `Automating digital engineering and documentation processes alongside an industrial engineer to streamline manufacturing workflows.`,
          `Built standardized SMT/PCB assembly process-flow documentation that sharpened consistency across the production line.`,
          `Applying disciplined data-handling within a regulated, compliance-sensitive environment.`,
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
          `Analyzed 459 membership cancellations, surfacing renewal-window and engagement-based retention signals.`,
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
        image: `${import.meta.env.BASE_URL}projects/scara-card.png`,
        /* Wide screens use this variant on the project page — padded so the
           arm's column (elevator) is the horizontal center. Phones keep the
           tight `image` above. Leave `` to always use `image`. */
        pageImage: `${import.meta.env.BASE_URL}projects/scara-page.png`,
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
                `The vertical axis rides the printer's original T8×2 lead screw on three smooth rods — self-locking, so the arm holds its height unpowered, with a measured practical ceiling around 12 mm/s. Joint travel is protected by soft limits (±180° base, ±150° elbow, 280 mm of Z) chosen to guard the cable wrap rather than the mechanics, and the output-side encoders measured the drivetrain's real rotary backlash at about 1–1.5°.`,
              ],
              bullets: [],
            },
            {
              heading: `Drivetrain`,
              paragraphs: [
                `Every reduction runs stock GT2 belts on driven pulleys I print myself — 5:1 on the base through a 100-tooth wheel, 2:1 on the elbow and wrist, with off-the-shelf aluminum pulleys on the motor side. Synchronous belts key on tooth count, so printing error can affect belt fit — but never the ratio.`,
                `The printed pulleys taught me a real tolerance lesson. An empirically sized 40T ran fine, but pitch error accumulates tooth by tooth, and on a 100T it would guarantee skipping — so the big pulleys are built to corrected theoretical geometry (64.16 mm tip diameter) and proven with printed test wedges first. The finished 100T drives the whole rotating tower without missing a tooth. And when the originally measured belt length turned out to be essentially unbuyable, I resized the pulleys and mounts around belt sizes that actually ship — the final drivetrain runs stock belts with no idlers.`,
              ],
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
        slug: `esp32-ai-camera-pen`,
        title: `ESP32-P4 AI Camera Pen`,
        blurb: `A 12 mm-wide handwriting-capture pen I'm designing on a dual-PCB stack — an OV5640 camera and a 0.95" AMOLED display. It captures your handwriting, runs it through cloud AI over WiFi, and shows the result on-device. KiCad schematic is done; PCBs are ~65% laid out.`,
        tags: [`KiCad`, `ESP32`, `PCB design`, `Embedded`],
        note: ``,
        image: ``,
        pageImage: ``,
        imageAlt: ``,
        imageFit: `cover`,
        page: {
          tagline: `A pen that reads its own handwriting — camera, display, and an AI loop packed into a 12 mm barrel.`,
          sections: [
            {
              heading: `Overview`,
              paragraphs: [
                `The idea: write normally on paper, and the pen itself captures what you wrote, sends it through cloud AI, and shows the response on a tiny display built into the pen — no phone, no scanner in the loop.`,
                `The hard part is the packaging. Everything has to fit a 12 mm-diameter barrel, which drove me to a dual-PCB stack architecture with flex interconnects between the boards.`,
              ],
              bullets: [],
            },
            {
              heading: `Hardware`,
              paragraphs: [
                `An ESP32-P4 runs the show, paired with an OV5640 camera watching the pen tip and a 0.95" AMOLED for output. WiFi carries captures to a cloud AI service and brings results back to the display.`,
                `The full schematic is done in KiCad, and board layout is roughly 65% complete across the two PCBs.`,
              ],
              bullets: [],
            },
          ],
          highlights: [
            `12 mm-diameter dual-PCB stack — extreme packaging constraint`,
            `OV5640 camera + 0.95" AMOLED display on-device`,
            `ESP32-P4 with a WiFi → cloud AI → display loop`,
            `Full KiCad schematic complete; layout ~65%`,
          ],
          status: `Schematic complete · PCB layout ~65%`,
        },
      },
      {
        slug: `ct-used-car-scraper`,
        title: `CT Used-Car Scraper`,
        blurb: `I scoped and directed (built with AI) a Python + Playwright scraper that pulls used-car listings from Connecticut dealership sites and filters them by make, model, price, and mileage to surface the best candidates.`,
        tags: [`AI-directed`, `Automation`, `Python / Playwright`],
        note: ``,
        image: `${import.meta.env.BASE_URL}projects/car-scraper.svg`,
        pageImage: ``,
        imageAlt: `Illustration of a magnifying glass finding a car listing`,
        imageFit: `cover`,
        page: {
          tagline: `An automated scout that watches Connecticut's dealer lots for the right used car — so I don't have to.`,
          sections: [
            {
              heading: `Overview`,
              paragraphs: [
                `Shopping for a reliable used car means checking the same dealership sites over and over. I scoped a tool to do that for me: a Python + Playwright scraper that sweeps Connecticut dealership listings and filters them by make, model, price, and mileage to surface the best candidates.`,
              ],
              bullets: [],
            },
            {
              heading: `How I built it`,
              paragraphs: [
                `This one is AI-directed by design: I defined the requirements, the filtering rules, and what "a good candidate" means, then directed AI tools to write and iterate on the code while I reviewed results and steered. It's the same engineering loop I use on hardware — spec, build, test, refine — applied to software I don't hand-write.`,
                `The scraper runs on a schedule and posts matching cars to a private Discord channel, so new candidates show up as notifications instead of another browser tab.`,
              ],
              bullets: [],
            },
          ],
          highlights: [
            `Sweeps multiple CT dealership sites automatically`,
            `Filters by make, model, price, mileage, and reliability picks`,
            `Discord alerts for new matching listings`,
            `AI-directed build — I spec, review, and steer; AI writes the code`,
          ],
          status: `Running on a schedule · still iterating`,
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
