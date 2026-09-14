// Post-build step: publish the open-source credits at /credits.txt.
//
// WHY. The site ships React, React Router and Motion. Their MIT licenses ask that the
// copyright and permission notice travel with copies of the code, and the minified bundle
// strips those comments. Vite's build.license option collects every bundled package's
// license into dist/credits.txt; this step puts a readable header on top, including the
// design credit for the aurora background, which is not an npm package.
//
// Run automatically by `npm run build`, after vite build.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const FILE = 'dist/credits.txt'
if (!existsSync(FILE)) {
  console.error('credits-notice: dist/credits.txt is missing. Is build.license still set in vite.config.ts?')
  process.exit(1)
}

const header = `Open-source credits for lucasp91.github.io/website-portfolio

This site is built with the open-source software listed below. Each package's
license and copyright notice is reproduced in full as its authors require.

Design credit
  The animated aurora background is a plain-CSS adaptation of the Aurora
  Background component from Aceternity UI (https://ui.aceternity.com),
  as published on 21st.dev.

Photos, renders, schematics and written content on this site are
(c) Lucas Picard unless stated otherwise, and are not covered by the
licenses below.

--------------------------------------------------------------------------------

`

const body = readFileSync(FILE, 'utf8')
if (!body.includes('MIT')) {
  console.error('credits-notice: dist/credits.txt contains no license text. Refusing to publish an empty notice.')
  process.exit(1)
}
writeFileSync(FILE, header + body)
const packages = (body.match(/^## /gm) || []).length
console.log(`credits-notice: dist/credits.txt written (${packages} packages)`)
