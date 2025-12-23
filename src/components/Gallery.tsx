import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Photo } from '../App'
import { srcSetFromImage, optimize } from '../lib/image'
import Lightbox from './Lightbox'

type Props = { photos: Photo[] }

export default function Gallery({ photos }: Props) {
  const [open, setOpen] = useState<{ src?: string; title?: string } | null>(null)
  const items = useMemo(() => photos, [photos])

  return (
    <section className="section" style={{ paddingBottom: 120 }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 64 }}
        >
          <h2 className="serif" style={{ fontSize: 48, margin: 0 }}>Selected Works</h2>
          <div style={{ fontSize: 14, letterSpacing: '0.05em', color: 'var(--muted)' }}>{photos.length} PROJECTS</div>
        </motion.div>

        <div className="gallery">
          {items.map((p, i) => (
            <motion.figure
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => setOpen({ src: p.image.url, title: p.title })}
            >
              <div style={{ overflow: 'hidden', background: '#eee' }}>
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  src={optimize(p.image.url, { w: 800 })}
                  srcSet={srcSetFromImage(p.image)}
                  sizes="(max-width: 900px) 100vw, 33vw"
                  alt={p.title || ''}
                  loading="lazy"
                />
              </div>
              <div className="caption-overlay">
                <div style={{ transform: 'translateY(0)' }}>
                  <span className="serif" style={{ fontSize: 20, display: 'block', marginBottom: 4 }}>{p.title || 'Untitled'}</span>
                  <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>{p.category}</span>
                </div>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
      
      <Lightbox open={!!open} src={open?.src} title={open?.title} onClose={() => setOpen(null)} />

      <style>{`
        .gallery { column-count: 3; column-gap: 24px; }
        @media(max-width: 900px) { .gallery { column-count: 2; } }
        @media(max-width: 600px) { .gallery { column-count: 1; } }
        
        .gallery figure { 
          position: relative; 
          break-inside: avoid; 
          margin: 0 0 24px 0; 
          cursor: pointer; 
        }
        .gallery img { 
          width: 100%; 
          display: block; 
          filter: none; 
          transform: scale(1); 
        }
        
        .caption-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          opacity: 0;
          transition: opacity 0.4s ease;
          display: flex;
          align-items: flex-end;
          padding: 24px;
          color: white;
        }
        .gallery figure:hover .caption-overlay { opacity: 1; }
      `}</style>
    </section>
  )
}
