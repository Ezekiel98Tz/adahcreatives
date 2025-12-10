import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProjectBySlug } from '../lib/payloadClient'
import Lightbox from '../components/Lightbox'

type Project = {
  title: string
  category?: string
  client?: string
  location?: string
  heroImage?: { url: string }
  story?: string
  credits?: string[]
  gallery?: { url: string }[]
}

export default function ProjectPage() {
  const { slug } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [open, setOpen] = useState<{ src?: string; title?: string } | null>(null)

  useEffect(() => {
    if (!slug) return
    getProjectBySlug(slug).then((p: any) => setProject(p || null))
  }, [slug])

  if (!project) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {project.heroImage?.url && (
        <section className="section" style={{ padding: 0 }}>
          <div style={{ position: 'relative', height: '70vh' }}>
            <img src={project.heroImage.url} alt={project.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 100%)' }} />
            <div className="container" style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: 48 }}>
              <div style={{ color: 'white' }}>
                <div style={{ height: 2, background: 'var(--accent)', width: 96, marginBottom: 24 }} />
                <h1 className="serif" style={{ margin: 0 }}>{project.title}</h1>
                <div style={{ opacity: 0.8, marginTop: 8 }}>{project.category} · {project.location}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container two-col">
          <div>
            <h3 className="serif" style={{ fontSize: 28, margin: '0 0 12px 0' }}>Story</h3>
            <p style={{ lineHeight: 1.8 }}>{project.story}</p>
          </div>
          <div>
            <h3 className="serif" style={{ fontSize: 28, margin: '0 0 12px 0' }}>Credits</h3>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.8, color: '#555' }}>
              {(project.credits || []).map(c => <li key={c}>{c}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="serif" style={{ marginBottom: 24 }}>Gallery</h2>
          <div className="gallery">
            {(project.gallery || []).map((g, i) => (
              <figure key={i} onClick={() => setOpen({ src: g.url, title: project.title })}>
                <img src={g.url} alt={`${project.title} ${i + 1}`} style={{ width: '100%', display: 'block' }} />
                <figcaption style={{ position: 'absolute', left: 12, bottom: 12, color: 'white' }}>{project.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <Lightbox open={!!open} src={open?.src} title={open?.title} onClose={() => setOpen(null)} />
    </motion.div>
  )
}
