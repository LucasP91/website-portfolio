import './App.css'
import ScrollImageSequence from './components/ScrollImageSequence'
import AuroraBackground from './components/AuroraBackground'

const projects = [
  {
    title: 'SCARA Robot Arm',
    blurb:
      'A 4-axis SCARA arm repurposed from salvaged Anet A8 3D-printer parts (NEMA 17 steppers, frame hardware). Closed-loop joint feedback via AS5600 magnetic encoders, custom 3D-printed arm segments, a Tr8x2 lead screw and closed-loop GT2 belts. J1 base assembled and in motion testing.',
    tags: ['SolidWorks / Onshape', 'Mechatronics', 'Closed-loop control', '3D printing'],
    note: 'Shown spinning above ↑',
  },
  {
    title: 'ESP32-P4 AI Camera Pen',
    blurb:
      'A 12 mm-diameter handwriting-capture pen on a dual-PCB stack with an OV5640 camera and a 0.95" AMOLED display. Captures handwriting, processes it through cloud AI over WiFi, and shows results on-device. KiCad schematic complete; PCBs ~65% laid out.',
    tags: ['KiCad', 'ESP32', 'PCB design', 'Embedded'],
  },
  {
    title: 'CT Used-Car Scraper',
    blurb:
      'A Python + Playwright scraper that aggregates used-car listings across Connecticut dealership sites, filtering by make, model, price, and mileage to surface the best candidates.',
    tags: ['Python', 'Playwright', 'Automation'],
  },
  {
    title: 'FRC Robotics — Captain & Lead Driver',
    blurb:
      '1000+ hours leading CAD, mechanical build, and electrical integration across subteams. Designed subsystems in Onshape / SolidWorks. As primary driver, earned the team its first New England District Championship qualification in 10 years.',
    tags: ['Leadership', 'CAD', 'Robotics'],
  },
]

const skills = [
  { group: 'CAD & Design', items: 'SolidWorks, Onshape, GD&T, design for manufacturability' },
  { group: 'Electronics', items: 'KiCad PCB design, ESP32 / Arduino, closed-loop control, sensors & encoders' },
  { group: 'Prototyping', items: '3D printing, manual milling, laser cutting, CAM' },
  { group: 'Software & Data', items: 'Python, Playwright, REST API automation, GitHub Actions' },
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
          <h1 id="hero-title">I design and build real hardware.</h1>
          <p className="hero__lede">
            I&apos;m Lucas Picard — a mechatronics builder who ships robotic systems, embedded
            electronics, and CAD assemblies, plus the software and automation to support them.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#projects">View projects</a>
            <a className="btn btn--ghost" href="#contact">Get in touch</a>
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
        <section id="about" className="section container" aria-labelledby="about-title">
          <h2 id="about-title">About</h2>
          <p>
            I&apos;m a mechanical engineering student at WPI pursuing a double major in Mechanical and
            Robotics Engineering. I&apos;m happiest with a hands-on build: designing and shipping real
            hardware, then writing the software and automation that make it work. I&apos;m currently an
            engineering intern at Microboard Processing, automating digital engineering and
            documentation for SMT/PCB assembly. Dual US/German citizen, bilingual in English and German.
          </p>
          <ul role="list" className="meta">
            <li><strong>WPI</strong> — B.S. Mechanical &amp; Robotics Engineering (double major), expected 2029</li>
            <li><strong>3.75 GPA</strong> · Dean&apos;s List</li>
            <li><strong>Now</strong> — Engineering Intern, Microboard Processing (Seymour, CT)</li>
          </ul>
        </section>

        {/* Projects */}
        <section id="projects" className="section container" aria-labelledby="projects-title">
          <h2 id="projects-title">Projects</h2>
          <ul role="list" className="project-grid">
            {projects.map((p) => (
              <li key={p.title}>
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
              </li>
            ))}
          </ul>
        </section>

        {/* Skills */}
        <section id="skills" className="section container" aria-labelledby="skills-title">
          <h2 id="skills-title">Skills</h2>
          <ul role="list" className="skills-grid">
            {skills.map((s) => (
              <li key={s.group} className="skill">
                <h3 className="skill__group">{s.group}</h3>
                <p className="skill__items">{s.items}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section id="contact" className="section container" aria-labelledby="contact-title">
          <h2 id="contact-title">Contact</h2>
          <p>Building something, hiring, or want to talk hardware? Reach out.</p>
          <ul role="list" className="contact-list">
            <li><a href="mailto:lucassamuelpicard@gmail.com">lucassamuelpicard@gmail.com</a></li>
            <li><a href="tel:+14752811281">475.281.1281</a></li>
            <li><a href="https://github.com/LucasP91" target="_blank" rel="noreferrer">github.com/LucasP91</a></li>
            <li><span className="text-muted">Southbury, CT</span></li>
          </ul>
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
