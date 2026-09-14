import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// On `build` we serve from the GitHub Pages project path; dev stays at root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/website-portfolio/' : '/',
  plugins: [react()],
  // Collect every bundled package's license into dist/credits.txt; the MIT licenses ask that
  // their notices ship with the code. scripts/credits-notice.mjs adds the header.
  build: { license: { fileName: 'credits.txt' } },
}))
