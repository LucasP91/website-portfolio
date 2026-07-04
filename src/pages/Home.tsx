import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import ScrollImageSequence from '../components/ScrollImageSequence'
import Reveal from '../components/Reveal'
import { content } from '../content'

// Hero entrance: children stagger in with a fade + lift (ease-out, ~500ms).
const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}
const heroItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function Home() {
  const { hero, showcase, about, experience, education, projects, skills, contact } = content
  const reduce = useReducedMotion()

  // Restore the base title and honor #section hashes (SPA nav from project
  // pages and full loads both land on the right section).
  useEffect(() => {
    document.title = 'Lucas Picard — Mechanical & Robotics Engineering'
    const hash = window.location.hash
    if (hash && hash !== '#main') {
      setTimeout(() => document.querySelector(hash)?.scrollIntoView(), 0)
    }
  }, [])

  return (
    <main id="main">
      {/* Hero — staggered entrance (fade + lift), static under reduced motion */}
      <motion.section
        className="hero container"
        aria-labelledby="hero-title"
        variants={heroContainer}
        initial={reduce ? false : 'hidden'}
        animate="show"
      >
        <motion.p variants={heroItem} className="eyebrow">{hero.eyebrow}</motion.p>
        <motion.h1 variants={heroItem} id="hero-title">{hero.title}</motion.h1>
        <motion.p variants={heroItem} className="hero__lede">{hero.lede}</motion.p>
        <motion.div variants={heroItem} className="hero__actions">
          <a className="btn btn--primary" href={hero.primaryCta.href}>{hero.primaryCta.label}</a>
          <a className="btn btn--ghost" href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
          <a className="btn btn--ghost" href={hero.resumeCta.href} target="_blank" rel="noreferrer">{hero.resumeCta.label}</a>
        </motion.div>
      </motion.section>

      {/* Showcase — scroll-driven SCARA arm turntable */}
      <ScrollImageSequence
        frameCount={120}
        heightVh={300}
        label={showcase.label}
        caption={showcase.caption}
        captionNote={showcase.captionNote}
      />

      {/* About */}
      <section id="about" className="section container section--split" aria-labelledby="about-title">
        <div className="section__head"><h2 id="about-title">{about.heading}</h2></div>
        <div className="section__body">
          {about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          <ul role="list" className="meta">
            {about.meta.map((m, i) => (
              <li key={i}><strong>{m.term}</strong> {m.detail}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Experience — timeline */}
      <section id="experience" className="section container section--split" aria-labelledby="experience-title">
        <div className="section__head"><h2 id="experience-title">{experience.heading}</h2></div>
        <div className="section__body">
          <ol className="timeline" role="list">
            {experience.jobs.map((job, i) => (
              <li className="timeline__item" key={i}>
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
                      {job.bullets.map((b, j) => <li key={j}>{b}</li>)}
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
        <div className="section__head"><h2 id="education-title">{education.heading}</h2></div>
        <div className="section__body">
          <div className="edu">
            {education.schools.map((e, i) => (
              <Reveal key={i} delay={Math.min(i * 0.06, 0.12)}>
                <article className="edu__item">
                  <div className="edu__head">
                    <h3 className="edu__school">{e.school}</h3>
                    <span className="timeline__dates">{e.dates}{e.place && ` · ${e.place}`}</span>
                  </div>
                  <p className="edu__degree">{e.degree}</p>
                  <p className="edu__meta">{e.meta}</p>
                  {e.completed.length > 0 && (
                    <>
                      <p className="edu__label">{education.completedLabel}</p>
                      <ul role="list" className="coursework">
                        {e.completed.map((c) => <li key={c} className="tag">{c}</li>)}
                      </ul>
                      <p className="edu__label">{education.upcomingLabel}</p>
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
        <Reveal><h2 id="projects-title">{projects.heading}</h2></Reveal>
        <ul role="list" className="project-grid">
          {projects.items.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={Math.min(i * 0.05, 0.15)}>
                <article className="card">
                  <div className={`card__media${p.imageFit === 'contain' ? ' card__media--contain' : ''}`} aria-hidden={p.image ? undefined : true}>
                    {p.image && <img src={p.image} alt={p.imageAlt} loading="lazy" />}
                  </div>
                  <div className="card__body">
                    <h3 className="card__title">
                      <Link className="card__title-link" to={`/projects/${p.slug}`}>{p.title}</Link>
                    </h3>
                    <p className="card__blurb">{p.blurb}</p>
                    <ul role="list" className="tags">
                      {p.tags.map((t) => <li key={t} className="tag">{t}</li>)}
                    </ul>
                    {p.note && <p className="card__note">{p.note}</p>}
                    <Link className="card__more" to={`/projects/${p.slug}`}>{projects.readMore}</Link>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Skills */}
      <section id="skills" className="section container" aria-labelledby="skills-title">
        <Reveal><h2 id="skills-title">{skills.heading}</h2></Reveal>
        <ul role="list" className="skills-grid">
          {skills.groups.map((s, i) => (
            <li key={s.group}>
              <Reveal className="skill" delay={Math.min(i * 0.05, 0.15)}>
                <h3 className="skill__group">{s.group}</h3>
                <p className="skill__items">{s.items}</p>
              </Reveal>
            </li>
          ))}
        </ul>
        <ul role="list" className="facts">
          {skills.facts.map((f, i) => (
            <li key={f.label}>
              <Reveal className="fact" delay={Math.min(i * 0.05, 0.1)}>
                <h3>{f.label}</h3>
                <p>{f.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact */}
      <section id="contact" className="section container section--split" aria-labelledby="contact-title">
        <div className="section__head"><h2 id="contact-title">{contact.heading}</h2></div>
        <div className="section__body">
          <p>{contact.intro}</p>
          <ul role="list" className="contact-list">
            {contact.links.map((l, i) => {
              const external = !!l.href && (l.href.startsWith('http') || l.href.endsWith('.pdf'))
              return (
                <li key={i}>
                  {l.href
                    ? <a href={l.href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{l.label}</a>
                    : <span className="text-muted">{l.label}</span>}
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </main>
  )
}
