import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Project } from '../App'

type Props = { projects: Project[] }

const DEFAULT_PROJECT_CATEGORIES = [
  'Commercial & Brand Shoots',
  'Corporate Events',
  'Events & Official Ceremonies',
  'Portraits',
  'Headshots',
  'Lifestyle',
  'Product',
  'Travel',
  'Weddings',
  'Documentaries',
]

export default function WorkPage({ projects }: Props) {
  const [filter, setFilter] = useState('All')
  const categories = useMemo(() => {
    const seen = new Set<string>()
    for (const c of DEFAULT_PROJECT_CATEGORIES) seen.add(c)
    for (const p of projects) {
      const c = typeof p?.category === 'string' ? p.category.trim() : ''
      if (c) seen.add(c)
    }

    const ordered = DEFAULT_PROJECT_CATEGORIES.filter(c => seen.has(c))
    const extras = Array.from(seen).filter(c => !DEFAULT_PROJECT_CATEGORIES.includes(c)).sort((a, b) => a.localeCompare(b))
    return ['All', ...ordered, ...extras]
  }, [projects])
  const items = useMemo(() => (filter === 'All' ? projects : projects.filter(p => p.category === filter)), [projects, filter])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-top-padding"
      style={{ minHeight: '100vh' }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 className="serif" style={{ margin: 0 }}>Stories We’ve Told</h1>
          <p style={{ color: '#666', marginTop: 8 }}>A curated blend of photography and film projects.</p>
        </div>
        <div style={{ marginBottom: 48, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 14,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                color: filter === c ? 'var(--accent)' : '#999',
                transition: 'color 0.2s'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="gallery">
            {items.map(p => (
              <figure key={p.id}>
                <Link to={`/work/${encodeURIComponent(p.slug || p.id)}`} style={{ display: 'block' }}>
                  <img src={p.heroImage?.url} alt={p.title} style={{ width: '100%', display: 'block' }} />
                  <figcaption className="serif" style={{ position: 'absolute', left: 12, bottom: 12, color: 'white' }}>{p.title}</figcaption>
                </Link>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  )
}
