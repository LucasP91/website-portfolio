// Post-build step: give every route a real HTML file, and generate the sitemap.
//
// WHY. The site is a single-page app on GitHub Pages. GitHub has no file at
// /projects/<slug>, so it served dist/404.html instead — the page rendered fine in a browser,
// but the HTTP status was 404, and search engines do not index pages that answer 404. Only the
// home page could ever show up in Google.
//
// WHAT. For each project in src/content.ts this writes dist/projects/<slug>/index.html: the same
// app shell, but with that project's own <title>, description, canonical URL and link-preview
// tags. GitHub Pages serves a directory's index.html with a 200, and the app routes normally
// once it loads. The sitemap is generated from the same list, so it cannot drift out of date.
// dist/404.html is still written for any unknown URL.
//
// Run automatically by `npm run build`.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'

const SITE = 'https://lucasp91.github.io/website-portfolio'
const DIST = 'dist'

const shell = readFileSync(`${DIST}/index.html`, 'utf8')
const content = readFileSync('src/content.ts', 'utf8').replace(/\r\n/g, '\n')

// Each project entry begins with slug, title and blurb on consecutive lines, then image.
const entry = /^ {8}slug: `([^`]+)`,\n {8}title: `([^`]+)`,\n {8}blurb: `([^`]+)`,[\s\S]*?^ {8}image: `([^`]*)`,/gm
const projects = [...content.matchAll(entry)].map(([, slug, title, blurb, image]) => ({
  slug,
  title,
  blurb,
  image: image.replace('${import.meta.env.BASE_URL}', `${SITE}/`),
}))
if (projects.length === 0) {
  console.error('prerender-routes: found no projects in src/content.ts — has its layout changed?')
  process.exit(1)
}

const attr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Cut at a word boundary so the description reads cleanly in a search result. */
function summary(text, max = 155) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—–-]\s*$/, '') + '…'
}

/** Replace one tag's value, and fail loudly if index.html no longer has that tag. */
function setTag(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    console.error(`prerender-routes: index.html has no ${label} tag to fill`)
    process.exit(1)
  }
  return html.replace(pattern, replacement)
}

function pageFor({ slug, title, blurb, image }) {
  const url = `${SITE}/projects/${slug}/`
  const fullTitle = attr(`${title} — Lucas Picard`)
  const desc = attr(summary(blurb))
  let html = shell
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${fullTitle}</title>`, 'title')
  html = setTag(html, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${desc}" />`, 'description')
  html = setTag(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`, 'canonical')
  html = setTag(html, /<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="article" />`, 'og:type')
  html = setTag(html, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${fullTitle}" />`, 'og:title')
  html = setTag(html, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${desc}" />`, 'og:description')
  html = setTag(html, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`, 'og:url')
  if (image) {
    html = setTag(html, /<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${attr(image)}" />`, 'og:image')
  }
  return html
}

for (const p of projects) {
  mkdirSync(`${DIST}/projects/${p.slug}`, { recursive: true })
  writeFileSync(`${DIST}/projects/${p.slug}/index.html`, pageFor(p))
}
copyFileSync(`${DIST}/index.html`, `${DIST}/404.html`)

const today = new Date().toISOString().slice(0, 10)
const urls = [`${SITE}/`, ...projects.map(p => `${SITE}/projects/${p.slug}/`)]
writeFileSync(
  `${DIST}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`,
)

console.log(`prerender-routes: ${projects.length} project pages, 404.html, sitemap.xml (${urls.length} URLs)`)
for (const p of projects) console.log(`  /projects/${p.slug}/  "${p.title}"`)
