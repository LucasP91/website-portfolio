import { Link } from 'react-router-dom'

/* Shown for any URL that is not a real page.
   It deliberately does NOT redirect. GitHub Pages already answers unknown URLs with a 404
   status, and bouncing the visitor to the home page on top of that makes Google see a
   redirect from a 404, which Search Console reports as a redirect error. A plain page that
   says what happened is both honest to the visitor and clean for crawlers. */
export default function NotFound() {
  return (
    <main id="main">
      <section className="section container">
        <h1>Page not found</h1>
        <p className="text-muted">
          That page isn't on this site. It may have moved, or the link may be wrong.
        </p>
        <p>
          <Link className="btn btn--ghost" to="/">Go to the home page</Link>
        </p>
      </section>
    </main>
  )
}
