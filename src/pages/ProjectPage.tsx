import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { content } from '../content'

// Project detail page (/projects/<slug>). All copy comes from content.ts.
export default function ProjectPage() {
  const { slug } = useParams()
  const project = content.projects.items.find((p) => p.slug === slug)
  const labels = content.projectPage

  useEffect(() => {
    if (project) document.title = `${project.title} — Lucas Picard`
    window.scrollTo(0, 0)
  }, [project])

  if (!project) return <Navigate to="/" replace />
  const { page } = project

  return (
    <main id="main">
      <article className="section container ppage" aria-labelledby="ppage-title">
        <Link className="ppage__back" to="/#projects">{labels.back}</Link>

        <header className="ppage__header">
          <h1 id="ppage-title">{project.title}</h1>
          <p className="ppage__tagline">{page.tagline}</p>
          <ul role="list" className="tags">
            {project.tags.map((t) => <li key={t} className="tag">{t}</li>)}
          </ul>
        </header>

        {project.image && (
          <Reveal>
            <figure className={`ppage__media${project.imageFit === 'contain' ? ' ppage__media--contain' : ''}`}>
              <img src={project.image} alt={project.imageAlt} />
            </figure>
          </Reveal>
        )}

        <div className="ppage__body">
          {page.sections.map((s) => (
            <Reveal key={s.heading}>
              <section className="ppage__section">
                <h2>{s.heading}</h2>
                {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </section>
            </Reveal>
          ))}

          {page.highlights.length > 0 && (
            <Reveal>
              <section className="ppage__section">
                <h2>{labels.highlightsLabel}</h2>
                <ul className="ppage__highlights">
                  {page.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </section>
            </Reveal>
          )}

          {page.status && (
            <p className="ppage__status">
              <span className="ppage__status-label">{labels.statusLabel}</span> {page.status}
            </p>
          )}
        </div>
      </article>
    </main>
  )
}
