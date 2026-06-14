import './App.css'
import ScrollImageSequence from './components/ScrollImageSequence'
import AuroraBackground from './components/AuroraBackground'

/**
 * Portfolio shell — accessible, semantic foundation built per the
 * web-design-principles skill (landmarks, one h1, logical headings,
 * skip link, readable measure, responsive container).
 *
 * WORKFLOW HOOKS (do these in a session with the MCPs connected — see CLAUDE.md):
 *   - Magic /ui : generate the ProjectCard, nav, and contact form components,
 *                 then reconcile them with the tokens in src/styles/tokens.css.
 *   - Motion MCP: add scroll-reveal for sections and hover/press microinteractions,
 *                 honoring prefers-reduced-motion (already handled globally in base.css).
 */

const projects = [
  { title: 'Project One', blurb: 'Short description of what it is and the impact.', tags: ['React', 'TypeScript'] },
  { title: 'Project Two', blurb: 'Short description of what it is and the impact.', tags: ['Vite', 'CSS'] },
  { title: 'Project Three', blurb: 'Short description of what it is and the impact.', tags: ['Node', 'API'] },
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
        {/* Hero — single clear focal point + one primary action (visual-hierarchy) */}
        <section className="hero container" aria-labelledby="hero-title">
          <p className="eyebrow">Portfolio</p>
          <h1 id="hero-title">Designer &amp; developer building thoughtful web experiences.</h1>
          <p className="hero__lede">
            I make fast, accessible, and considered interfaces. Here&apos;s a selection of recent work.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#projects">View projects</a>
            <a className="btn btn--ghost" href="#contact">Get in touch</a>
          </div>
        </section>

        {/* Showcase — scroll-driven image sequence (Apple-style) */}
        <ScrollImageSequence frameCount={120} heightVh={300} label="SCARA robot arm — 360° turntable" />

        <section id="about" className="section container" aria-labelledby="about-title">
          <h2 id="about-title">About</h2>
          <p>
            A short introduction goes here — who you are, what you focus on, and what you&apos;re
            looking for. Keep it to a readable measure for legibility.
          </p>
        </section>

        {/* Projects — similarity + proximity via a consistent card grid (layout-and-grids) */}
        <section id="projects" className="section container" aria-labelledby="projects-title">
          <h2 id="projects-title">Projects</h2>
          <ul role="list" className="project-grid">
            {projects.map((p) => (
              <li key={p.title}>
                {/* TODO(Magic /ui): replace with a generated ProjectCard component */}
                <article className="card">
                  <div className="card__media" aria-hidden="true" />
                  <div className="card__body">
                    <h3 className="card__title">{p.title}</h3>
                    <p className="card__blurb">{p.blurb}</p>
                    <ul role="list" className="tags">
                      {p.tags.map((t) => <li key={t} className="tag">{t}</li>)}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className="section container" aria-labelledby="contact-title">
          <h2 id="contact-title">Contact</h2>
          <p>
            Want to work together? Reach out at{' '}
            <a href="mailto:lucassamuelpicard@gmail.com">lucassamuelpicard@gmail.com</a>.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p className="text-muted">© {new Date().getFullYear()} Lucas Picard. Built with Vite + React.</p>
        </div>
      </footer>
    </>
  )
}

export default App
