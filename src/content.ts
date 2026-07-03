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
        blurb: `I'm turning salvaged Anet A8 3D-printer parts into a working 4-axis SCARA arm. AS5600 magnetic encoders give each joint closed-loop feedback, the segments are my own 3D-printed designs, and a Tr8x2 lead screw with closed-loop GT2 belts drives it. The J1 base is assembled and in motion testing.`,
        tags: [`SolidWorks / Onshape`, `Mechatronics`, `Closed-loop control`, `3D printing`],
        note: `Shown spinning above ↑`,
        image: `${import.meta.env.BASE_URL}projects/scara-card.png`,
        imageAlt: `Rendered CAD model of the SCARA robot arm`,
        imageFit: `contain`,
        page: {
          tagline: `A 4-axis robot arm built from the bones of a salvaged 3D printer — my own CAD, my own prints, closed-loop control on every joint.`,
          sections: [
            {
              heading: `Overview`,
              paragraphs: [
                `A SCARA (Selective Compliance Articulated Robot Arm) moves like a human arm flattened onto a plane: two rotating joints sweep the workspace while a vertical axis raises and lowers the tool. It's the architecture behind a huge share of industrial pick-and-place robots — fast, rigid, and precise.`,
                `Mine started as a broken Anet A8 3D printer. Instead of letting the NEMA 17 steppers, rods, and hardware collect dust, I'm turning them into a working 4-axis SCARA arm — every structural part designed by me in CAD and 3D-printed.`,
              ],
            },
            {
              heading: `Engineering`,
              paragraphs: [
                `Each joint carries an AS5600 magnetic encoder for closed-loop position feedback, housed in dedicated mounts I designed into the printed arm segments. The Z-axis rides a Tr8x2 lead screw; the rotary joints are driven through closed-loop GT2 belt reductions.`,
                `The spinning model at the top of this site is the real assembly — exported from Onshape and rendered in Blender into the scroll-driven sequence you see.`,
              ],
            },
          ],
          highlights: [
            `4-axis SCARA kinematics with closed-loop feedback on every joint`,
            `Custom 3D-printed structure with integrated encoder mounts`,
            `Tr8x2 lead-screw Z-axis + GT2 belt-driven rotary joints`,
            `Salvaged Anet A8 donor parts — steppers, rods, and hardware`,
          ],
          status: `J1 base assembled · motion testing underway`,
        },
      },
      {
        slug: `esp32-ai-camera-pen`,
        title: `ESP32-P4 AI Camera Pen`,
        blurb: `A 12 mm-wide handwriting-capture pen I'm designing on a dual-PCB stack — an OV5640 camera and a 0.95" AMOLED display. It captures your handwriting, runs it through cloud AI over WiFi, and shows the result on-device. KiCad schematic is done; PCBs are ~65% laid out.`,
        tags: [`KiCad`, `ESP32`, `PCB design`, `Embedded`],
        note: ``,
        image: ``,
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
            },
            {
              heading: `Hardware`,
              paragraphs: [
                `An ESP32-P4 runs the show, paired with an OV5640 camera watching the pen tip and a 0.95" AMOLED for output. WiFi carries captures to a cloud AI service and brings results back to the display.`,
                `The full schematic is done in KiCad, and board layout is roughly 65% complete across the two PCBs.`,
              ],
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
            },
            {
              heading: `How I built it`,
              paragraphs: [
                `This one is AI-directed by design: I defined the requirements, the filtering rules, and what "a good candidate" means, then directed AI tools to write and iterate on the code while I reviewed results and steered. It's the same engineering loop I use on hardware — spec, build, test, refine — applied to software I don't hand-write.`,
                `The scraper runs on a schedule and posts matching cars to a private Discord channel, so new candidates show up as notifications instead of another browser tab.`,
              ],
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
            },
            {
              heading: `What I did`,
              paragraphs: [
                `I led CAD, mechanical build, and electrical integration across subteams, designing robot subsystems in Onshape and SolidWorks and troubleshooting fast in the pit between matches, where a broken mechanism has minutes to get fixed, not days.`,
                `As primary driver I put the design to the test on the field — driving us to the team's first New England District Championship qualification in 10 years, and its first CT State Championship at an off-season event.`,
              ],
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
      { group: `AI-Assisted Development`, items: `Directing AI tools to scope, build, and ship working software — automation scripts, web scrapers, and data/reporting pipelines` },
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
