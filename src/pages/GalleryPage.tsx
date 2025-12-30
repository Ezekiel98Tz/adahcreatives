import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Gallery from '../components/Gallery'
import { Photo } from '../App'
import SEO from '../components/SEO';

type Props = { photos: Photo[] }

const CATEGORIES = [
  'All',
  'Corporate Events',
  'Portraits',
  'Headshots',
  'Family Sessions',
  'Commercial',
  'Product',
  'Travel',
  'Lifestyle',
]

function mapCategory(p: Photo): string {
  const c = (p.category || '').toLowerCase()
  if (c.includes('portrait')) return 'Portraits'
  if (c.includes('wedding')) return 'Family Sessions'
  if (c.includes('lifestyle')) return 'Lifestyle'
  if (c.includes('fashion') || c.includes('editorial')) return 'Commercial'
  if (c.includes('product')) return 'Product'
  if (c.includes('landscape') || c.includes('travel')) return 'Travel'
  if (c.includes('corporate') || c.includes('events')) return 'Corporate Events'
  return 'Commercial'
}

export default function GalleryPage({ photos }: Props) {
  const [filter, setFilter] = useState('All')
  const filtered = useMemo(() => (
    filter === 'All' ? photos : photos.filter(p => mapCategory(p) === filter)
  ), [photos, filter])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ paddingTop: 120 }}>
      <SEO 
        title="Gallery"
        description="All things related to photography — curated and comprehensive. Explore our gallery of corporate events, portraits, lifestyle, and more."
      />
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 className="serif" style={{ margin: 0 }}>Gallery</h1>
        <p style={{ color: '#666', marginTop: 8 }}>All things related to photography — curated and comprehensive.</p>
        <div style={{ marginTop: 24, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ background: 'none', border: '1px solid #ddd', padding: '8px 12px', cursor: 'pointer', color: filter === c ? 'var(--accent)' : '#555' }}>{c}</button>
          ))}
        </div>
      </div>

      <Gallery photos={filtered} />
    </motion.div>
  )
}
