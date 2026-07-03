import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { content } from '../content'

/* Sections may optionally carry bullets and/or a figure (image + caption);
   typed here so content.ts sections only declare the fields they use. */
type PageSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
  image?: string
  imageAlt?: string
  imageCaption?: string
}

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
              {/* Wide screens can use a page-specific framing (e.g. SCARA padded
                  so its column is centered); phones keep the tight crop. */}
              <picture>
                {project.pageImage && <source media="(min-width: 40rem)" srcSet={project.pageImage} />}
                <img src={project.image} alt={project.imageAlt} />
              </picture>
            </figure>
          </Reveal>
        )}

        <div className="ppage__body">
          {(page.sections as PageSection[]).map((s) => (
            <Reveal key={s.heading}>
              <section className="ppage__section">
                <h2>{s.heading}</h2>
                {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                {s.image && (
                  <figure className="ppage__figure">
                    <img src={s.image} alt={s.imageAlt ?? ''} loading="lazy" />
                    {s.imageCaption && <figcaption>{s.imageCaption}</figcaption>}
                  </figure>
                )}
                {Array.isArray(s.bullets) && s.bullets.length > 0 && (
                  <ul className="ppage__list">
                    {s.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
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
