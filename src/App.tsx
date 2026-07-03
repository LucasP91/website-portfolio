import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuroraBackground from './components/AuroraBackground'
import ScrollProgress from './components/ScrollProgress'
import Home from './pages/Home'
import ProjectPage from './pages/ProjectPage'
import { content } from './content'

// App shell: background, header, routes, footer. Page content lives in
// src/pages/*; ALL text lives in src/content.ts.
function App() {
  const { brand, nav, footer } = content
  const year = new Date().getFullYear()
  // Nav links are plain same-document anchors on the home page; from a project
  // page they navigate home (full load) and land on the section.
  const base = import.meta.env.BASE_URL

  return (
    <>
      <AuroraBackground />
      <ScrollProgress />
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <div className="container site-header__inner">
          <a className="brand" href={`${base}#main`}>{brand}</a>
          <nav aria-label="Primary">
            <ul role="list" className="nav">
              {nav.map((n) => (
                <li key={n.href}><a href={`${base}${n.href}`}>{n.label}</a></li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="site-footer">
        <div className="container">
          <p className="text-muted">{footer.replace('{year}', String(year))}</p>
        </div>
      </footer>
    </>
  )
}

export default App
