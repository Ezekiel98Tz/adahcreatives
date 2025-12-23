import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProjectBySlug } from '../lib/api'
import Lightbox from '../components/Lightbox'
import { Project as ProjectSummary } from '../App'

type Project = {
  id?: string
  title: string
  category?: string
  client?: string
  location?: string
  heroImage?: { url: string }
  story?: string
  credits?: string[]
  gallery?: { url: string }[]
}

export default function ProjectPage({ projects }: { projects: ProjectSummary[] }) {
  const params = useParams()
  const routeKey = typeof params.id === 'string' ? params.id : typeof params['*'] === 'string' ? params['*'] : ''
  const [project, setProject] = useState<Project | null | undefined>(undefined)
  const [open, setOpen] = useState<{ src?: string; title?: string } | null>(null)
  const [heroFailed, setHeroFailed] = useState(false)

  const related = useMemo(() => {
    if (!project) return []
    const category = typeof project.category === 'string' ? project.category.trim() : ''
    if (!category) return []
    const currentId = typeof project.id === 'string' ? project.id : routeKey
    return projects
      .filter(p => p && p.category === category && p.id !== currentId)
      .slice(0, 8)
  }, [project, projects, routeKey])

  useEffect(() => {
    if (!routeKey) return
    setProject(undefined)

    const decode = (value: string) => {
      try {
        return decodeURIComponent(value)
      } catch {
        return value
      }
    }

    const normalizeUrlish = (value: string) => {
      const v = value.trim()
      const out = new Set<string>([v])
      if (v.startsWith('http:/') && !v.startsWith('http://')) out.add(v.replace(/^http:\//, 'http://'))
      if (v.startsWith('https:/') && !v.startsWith('https://')) out.add(v.replace(/^https:\//, 'https://'))
      if (v.startsWith('/uploads/')) out.add(v)
      return Array.from(out)
    }

    const decoded = decode(routeKey)
    const candidates = normalizeUrlish(decoded)
    const byIdOrSlug = projects.find(p => p && (p.id === decoded || (typeof p.slug === 'string' && p.slug === decoded)))
    const byHero = projects.find(p => {
      const hero = typeof p?.heroImage?.url === 'string' ? p.heroImage.url.trim() : ''
      if (!hero) return false
      return candidates.some(c => hero === c || hero.endsWith(c) || c.endsWith(hero))
    })

    const localMatch = byIdOrSlug || byHero
    if (localMatch) setProject(localMatch as any)

    const idOrSlug = (typeof localMatch?.slug === 'string' && localMatch.slug) ? localMatch.slug : (localMatch?.id || decoded)
    let cancelled = false
    getProjectBySlug(idOrSlug)
      .then((p: any) => {
        if (cancelled) return
        setProject(p || localMatch || null)
      })
      .catch(() => {
        if (cancelled) return
        setProject(localMatch || null)
      })

    return () => {
      cancelled = true
    }
  }, [projects, routeKey])

  if (project === undefined) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <section className="section" style={{ paddingTop: 120, textAlign: 'center' }}>
          <div className="loading">Loading</div>
        </section>
      </motion.div>
    )
  }

  if (!project) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <section className="section" style={{ paddingTop: 120, textAlign: 'center' }}>
          <h1 className="serif">Project Not Found</h1>
          <p style={{ color: '#555' }}>Let’s take you back to the work.</p>
          <a href="/work" className="cta">View Portfolio</a>
        </section>
      </motion.div>
    )
  }

  const credits = Array.isArray(project.credits) ? project.credits.filter(Boolean) : []
  const gallery = Array.isArray(project.gallery) ? project.gallery.filter(g => g && typeof g.url === 'string' && g.url.trim().length > 0) : []
  const heroUrl = typeof project.heroImage?.url === 'string' ? project.heroImage.url.trim() : ''

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="section" style={{ padding: 0 }}>
        <div style={{ position: 'relative', height: '70vh', background: '#0A0A0A' }}>
          {!!heroUrl && !heroFailed && (
            <img
              src={heroUrl}
              alt={project.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setHeroFailed(true)}
            />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.7) 100%)' }} />
          <div className="container" style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: 48 }}>
            <div style={{ color: 'white' }}>
              <div style={{ height: 2, background: 'var(--accent)', width: 96, marginBottom: 24 }} />
              <h1 className="serif" style={{ margin: 0 }}>{project.title}</h1>
              <div style={{ opacity: 0.85, marginTop: 8 }}>{project.category} · {project.location}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div>
            <h3 className="serif" style={{ fontSize: 28, margin: '0 0 12px 0' }}>Story</h3>
            <p style={{ lineHeight: 1.8 }}>{project.story || '—'}</p>
          </div>
          {credits.length > 0 && (
            <div>
              <h3 className="serif" style={{ fontSize: 28, margin: '0 0 12px 0' }}>Credits</h3>
              <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.8, color: '#555' }}>
                {credits.map(c => <li key={c}>{c}</li>)}
              </ul>
            </div>
          )}
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="serif" style={{ marginBottom: 24 }}>Gallery</h2>
            <div className="gallery">
              {gallery.map((g, i) => (
                <figure key={i} onClick={() => setOpen({ src: g.url, title: project.title })}>
                  <img src={g.url} alt={`${project.title} ${i + 1}`} style={{ width: '100%', display: 'block' }} />
                  <figcaption style={{ position: 'absolute', left: 12, bottom: 12, color: 'white' }}>{project.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="serif" style={{ marginBottom: 24 }}>More in {project.category}</h2>
            <div className="gallery">
              {related.map((p) => (
                <figure key={p.id}>
                  <Link to={`/work/${encodeURIComponent(p.slug || p.id)}`} style={{ display: 'block' }}>
                    <img src={p.heroImage?.url} alt={p.title} style={{ width: '100%', display: 'block' }} />
                    <figcaption style={{ position: 'absolute', left: 12, bottom: 12, color: 'white' }}>{p.title}</figcaption>
                  </Link>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <Lightbox open={!!open} src={open?.src} title={open?.title} onClose={() => setOpen(null)} />
    </motion.div>
  )
}
