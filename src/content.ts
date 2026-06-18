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
      `What makes me lose track of time is the moment a stubborn problem finally clicks — when every piece comes together into something that actually works. I've chased that feeling since I rebalanced a Lego Technic motorcycle everyone said couldn't stand on its own, and since my uncle — a mechanical engineer in Germany — taught me to solder over Skype and shipped me a rough little 3D printer at eleven. I've been designing and building real hardware ever since.`,
      `Today I'm a mechanical engineering student at WPI on a combined B.S./M.S. in Mechanical Engineering, with a second B.S. major in Robotics Engineering — all in four years. I design and build robotic systems, embedded electronics, and CAD assemblies, and I direct AI to write the software and automation around them. I'm an engineering intern at Microboard Processing, and a dual US/German citizen, bilingual in English and German. Long-term, I want to point that same problem-solving at eco-friendly, high-performance vehicles.`,
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
          `Authored a 459-record membership cancellation analysis (13 charts, 15-page report) that surfaced retention signals.`,
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
         `note` is the optional blue line under a card (leave `` to hide). ---- */
  projects: {
    heading: `Projects`,
    items: [
      {
        title: `SCARA Robot Arm`,
        blurb: `I'm turning salvaged Anet A8 3D-printer parts into a working 4-axis SCARA arm. AS5600 magnetic encoders give each joint closed-loop feedback, the segments are my own 3D-printed designs, and a Tr8x2 lead screw with closed-loop GT2 belts drives it. The J1 base is assembled and in motion testing.`,
        tags: [`SolidWorks / Onshape`, `Mechatronics`, `Closed-loop control`, `3D printing`],
        note: `Shown spinning above ↑`,
      },
      {
        title: `ESP32-P4 AI Camera Pen`,
        blurb: `A 12 mm-wide handwriting-capture pen I'm designing on a dual-PCB stack — an OV5640 camera and a 0.95" AMOLED display. It captures your handwriting, runs it through cloud AI over WiFi, and shows the result on-device. KiCad schematic is done; PCBs are ~65% laid out.`,
        tags: [`KiCad`, `ESP32`, `PCB design`, `Embedded`],
        note: ``,
      },
      {
        title: `CT Used-Car Scraper`,
        blurb: `I scoped and directed (built with AI) a Python + Playwright scraper that pulls used-car listings from Connecticut dealership sites and filters them by make, model, price, and mileage to surface the best candidates.`,
        tags: [`AI-directed`, `Automation`, `Python / Playwright`],
        note: ``,
      },
      {
        title: `FRC Robotics — Captain & Lead Driver`,
        blurb: `1000+ hours as captain and lead driver. I led CAD, mechanical build, and electrical integration across subteams and designed subsystems in Onshape / SolidWorks — and behind the wheel, I drove us to the team's first New England District Championship qualification in 10 years and its first CT State Championship.`,
        tags: [`Leadership`, `CAD`, `Robotics`],
        note: ``,
      },
    ],
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
