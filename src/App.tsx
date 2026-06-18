import './App.css'
import ScrollImageSequence from './components/ScrollImageSequence'
import AuroraBackground from './components/AuroraBackground'
import Reveal from './components/Reveal'

const resumeUrl = `${import.meta.env.BASE_URL}resume.pdf`

const experience = [
  {
    role: 'Engineering Intern — Document & Controls',
    org: 'Microboard Processing',
    place: 'Seymour, CT · ITAR-regulated electronics mfr.',
    dates: 'Jun 2026 – Present',
    bullets: [
      'Automating digital engineering and documentation processes alongside an industrial engineer to streamline manufacturing workflows.',
      'Built standardized SMT/PCB assembly process-flow documentation that sharpened consistency across the production line.',
      'Applying disciplined data-handling within a regulated, compliance-sensitive environment.',
    ],
  },
  {
    role: 'Studio Assistant & Operations',
    org: 'Picard Studio',
    place: 'Southbury, CT · art-education business',
    dates: 'Feb 2020 – Present',
    bullets: [
      'Built and maintained KPI dashboards tracking MRR, ARPU, retention, churn, and acquisition to drive decisions.',
      'Automated monthly metrics reporting through the Kajabi API and GitHub Actions, piping data into Google Sheets.',
      'Authored a 459-record membership cancellation analysis (13 charts, 15-page report) that surfaced retention signals.',
      'Delivered freelance CAD — designed, prototyped, and invoiced a wall-mount equipment cradle.',
    ],
  },
  {
    role: 'Service Staff (Seasonal)',
    org: "Aquila's Nest Vineyards",
    place: '',
    dates: 'Jul – Nov 2024',
    bullets: [],
  },
  {
    role: 'Grocery Clerk',
    org: 'New Morning Market',
    place: '',
    dates: 'Aug – Nov 2023',
    bullets: [],
  },
]

const education = [
  {
    school: 'Worcester Polytechnic Institute',
    degree: 'Combined B.S./M.S. Mechanical Engineering · B.S. Robotics Engineering (double major)',
    place: 'Worcester, MA',
    dates: 'Expected 2029',
    meta: "Sophomore standing · 3.75 / 4.00 GPA · Dean's List. Entered with 21 AP transfer credits (Calculus I–II, Physics C: Mechanics & E&M, CS A, Art, U.S. Government).",
    completed: ['Statics', 'Dynamics', 'Thermodynamics', 'Manufacturing Science & CNC', 'Intro to Robotics', 'Intro to ECE', 'Calculus III–IV', 'Differential Equations', 'Linear Algebra'],
    upcoming: ['Unified Robotics I–IV', 'Fluid Mechanics', 'Heat Transfer', 'Stress Analysis', 'Control Engineering', 'Materials Science', 'Software Engineering'],
    activities: 'Combat Robotics · Club Badminton · Intramural Soccer',
  },
  {
    school: 'Pomperaug High School',
    degree: 'Southbury, CT',
    place: '',
    dates: '2021 – 2025',
    meta: '4.06 / 4.5 GPA · Honor Roll all years · German Seal of Biliteracy.',
    completed: [],
    upcoming: [],
    activities: '',
  },
]

const facts = [
  { label: 'Awards', text: "Dean's List (WPI, Fall 2025) · Honor Roll (Pomperaug, all years)" },
  { label: 'Languages', text: 'English (native) · German (Seal of Biliteracy) — dual US/German citizen' },
  { label: 'Interests', text: 'Acrylic painting · drawing · music performance · robotics' },
]

const projects = [
  {
    title: 'SCARA Robot Arm',
    blurb:
      "I'm turning salvaged Anet A8 3D-printer parts into a working 4-axis SCARA arm. AS5600 magnetic encoders give each joint closed-loop feedback, the segments are my own 3D-printed designs, and a Tr8x2 lead screw with closed-loop GT2 belts drives it. The J1 base is assembled and in motion testing.",
    tags: ['SolidWorks / Onshape', 'Mechatronics', 'Closed-loop control', '3D printing'],
    note: 'Shown spinning above ↑',
  },
  {
    title: 'ESP32-P4 AI Camera Pen',
    blurb:
      'A 12 mm-wide handwriting-capture pen I\'m designing on a dual-PCB stack — an OV5640 camera and a 0.95" AMOLED display. It captures your handwriting, runs it through cloud AI over WiFi, and shows the result on-device. KiCad schematic is done; PCBs are ~65% laid out.',
    tags: ['KiCad', 'ESP32', 'PCB design', 'Embedded'],
  },
  {
    title: 'CT Used-Car Scraper',
    blurb:
      'I scoped and directed (built with AI) a Python + Playwright scraper that pulls used-car listings from Connecticut dealership sites and filters them by make, model, price, and mileage to surface the best candidates.',
    tags: ['AI-directed', 'Automation', 'Python / Playwright'],
  },
  {
    title: 'FRC Robotics — Captain & Lead Driver',
    blurb:
      "1000+ hours as captain and lead driver. I led CAD, mechanical build, and electrical integration across subteams and designed subsystems in Onshape / SolidWorks — and behind the wheel, I drove us to the team's first New England District Championship qualification in 10 years and its first CT State Championship.",
    tags: ['Leadership', 'CAD', 'Robotics'],
  },
]

const skills = [
  { group: 'CAD & Design', items: 'SolidWorks, Onshape, GD&T, design for manufacturability' },
  { group: 'Electronics', items: 'KiCad PCB design, soldering, ESP32 / Arduino, closed-loop control, sensors & encoders' },
  { group: 'Prototyping', items: '3D printing, manual milling, laser cutting, CAM' },
  { group: 'AI-Assisted Development', items: 'Directing AI tools to scope, build, and ship working software — automation scripts, web scrapers, and data/reporting pipelines' },
]

function App() {
  return (
    <>
      <AuroraBackground />
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <div className="container site-header__inner">
          <a className="brand" href="#main">Lucas Picard</a>
          <nav aria-label="Primary">
            <ul role="list" className="nav">
              <li><a href="#about">About</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="hero container" aria-labelledby="hero-title">
          <p className="eyebrow">Mechanical &amp; Robotics Engineering · WPI</p>
          <h1 id="hero-title">I build the things I&apos;m told can&apos;t be built.</h1>
          <p className="hero__lede">
            I&apos;m Lucas Picard — a mechanical &amp; robotics engineer, happiest the moment a hard
            problem finally clicks into hardware that actually works.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#projects">View projects</a>
            <a className="btn btn--ghost" href="#contact">Get in touch</a>
            <a className="btn btn--ghost" href={resumeUrl} target="_blank" rel="noreferrer">Resume ↓</a>
          </div>
        </section>

        {/* Showcase — scroll-driven SCARA arm turntable */}
        <ScrollImageSequence
          frameCount={120}
          heightVh={300}
          label="SCARA robot arm, 360-degree turntable"
          caption="SCARA Robot Arm"
          captionNote="Designed in CAD & 3D-printed — repurposed from salvaged Anet A8 parts. Scroll to orbit."
        />

        {/* About */}
        <section id="about" className="section container section--split" aria-labelledby="about-title">
          <div className="section__head"><h2 id="about-title">About</h2></div>
          <div className="section__body">
            <p>
              What makes me lose track of time is the moment a stubborn problem finally clicks — when
              every piece comes together into something that actually works. I&apos;ve chased that feeling
              since I rebalanced a Lego Technic motorcycle everyone said couldn&apos;t stand on its own, and
              since my uncle — a mechanical engineer in Germany — taught me to solder over Skype and shipped
              me a rough little 3D printer at eleven. I&apos;ve been designing and building real hardware ever since.
            </p>
            <p>
              Today I&apos;m a mechanical engineering student at WPI on a combined B.S./M.S. in Mechanical
              Engineering, with a second B.S. major in Robotics Engineering — all in four years. I design and
              build robotic systems, embedded electronics, and CAD assemblies, and I direct AI to write the
              software and automation around them. I&apos;m an engineering intern at Microboard Processing, and
              a dual US/German citizen, bilingual in English and German. Long-term, I want to point that same
              problem-solving at eco-friendly, high-performance vehicles.
            </p>
            <ul role="list" className="meta">
              <li><strong>WPI</strong> — Combined B.S./M.S. in Mechanical Engineering + B.S. major in Robotics Engineering, 4-year track, expected 2029</li>
              <li><strong>3.75 GPA</strong> · Dean&apos;s List</li>
              <li><strong>Now</strong> — Engineering Intern, Microboard Processing (Seymour, CT)</li>
            </ul>
          </div>
        </section>

        {/* Experience — timeline */}
        <section id="experience" className="section container section--split" aria-labelledby="experience-title">
          <div className="section__head"><h2 id="experience-title">Experience</h2></div>
          <div className="section__body">
          <ol className="timeline" role="list">
            {experience.map((job, i) => (
              <li className="timeline__item" key={job.org}>
                <Reveal className="timeline__card" delay={Math.min(i * 0.05, 0.15)}>
                  <div className="timeline__head">
                    <h3 className="timeline__role">{job.role}</h3>
                    <span className="timeline__dates">{job.dates}</span>
                  </div>
                  <p className="timeline__org">
                    {job.org}
                    {job.place && <span className="text-muted"> · {job.place}</span>}
                  </p>
                  {job.bullets.length > 0 && (
                    <ul className="timeline__bullets">
                      {job.bullets.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
          </div>
        </section>

        {/* Education */}
        <section id="education" className="section container section--split" aria-labelledby="education-title">
          <div className="section__head"><h2 id="education-title">Education</h2></div>
          <div className="section__body">
          <div className="edu">
            {education.map((e, i) => (
              <Reveal key={e.school} delay={Math.min(i * 0.06, 0.12)}>
                <article className="edu__item">
                  <div className="edu__head">
                    <h3 className="edu__school">{e.school}</h3>
                    <span className="timeline__dates">{e.dates}{e.place && ` · ${e.place}`}</span>
                  </div>
                  <p className="edu__degree">{e.degree}</p>
                  <p className="edu__meta">{e.meta}</p>
                  {e.completed.length > 0 && (
                    <>
                      <p className="edu__label">Completed coursework</p>
                      <ul role="list" className="coursework">
                        {e.completed.map((c) => <li key={c} className="tag">{c}</li>)}
                      </ul>
                      <p className="edu__label">Upcoming</p>
                      <ul role="list" className="coursework">
                        {e.upcoming.map((c) => <li key={c} className="tag tag--ghost">{c}</li>)}
                      </ul>
                      <p className="edu__activities text-muted">{e.activities}</p>
                    </>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="section container" aria-labelledby="projects-title">
          <Reveal><h2 id="projects-title">Projects</h2></Reveal>
          <ul role="list" className="project-grid">
            {projects.map((p, i) => (
              <li key={p.title}>
                <Reveal delay={Math.min(i * 0.05, 0.15)}>
                  <article className="card">
                    <div className="card__media" aria-hidden="true" />
                    <div className="card__body">
                      <h3 className="card__title">{p.title}</h3>
                      <p className="card__blurb">{p.blurb}</p>
                      <ul role="list" className="tags">
                        {p.tags.map((t) => <li key={t} className="tag">{t}</li>)}
                      </ul>
                      {p.note && <p className="card__note">{p.note}</p>}
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* Skills */}
        <section id="skills" className="section container" aria-labelledby="skills-title">
          <Reveal><h2 id="skills-title">Skills</h2></Reveal>
          <ul role="list" className="skills-grid">
            {skills.map((s) => (
              <li key={s.group} className="skill">
                <h3 className="skill__group">{s.group}</h3>
                <p className="skill__items">{s.items}</p>
              </li>
            ))}
          </ul>
          <ul role="list" className="facts">
            {facts.map((f) => (
              <li key={f.label} className="fact">
                <h3>{f.label}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section id="contact" className="section container section--split" aria-labelledby="contact-title">
          <div className="section__head"><h2 id="contact-title">Contact</h2></div>
          <div className="section__body">
            <p>Building something, hiring, or want to talk hardware? Reach out.</p>
            <ul role="list" className="contact-list">
              <li><a href="mailto:lucassamuelpicard@gmail.com">lucassamuelpicard@gmail.com</a></li>
              <li><a href="tel:+14752811281">475.281.1281</a></li>
              <li><a href="https://github.com/LucasP91" target="_blank" rel="noreferrer">github.com/LucasP91</a></li>
              <li><a href={resumeUrl} target="_blank" rel="noreferrer">Resume (PDF)</a></li>
              <li><span className="text-muted">Southbury, CT</span></li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p className="text-muted">© {new Date().getFullYear()} Lucas Picard.</p>
        </div>
      </footer>
    </>
  )
}

export default App
