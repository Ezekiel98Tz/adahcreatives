import React from 'react'
import { motion } from 'framer-motion'
import AccentLine from './ui/AccentLine'
import { ImageAsset } from '../App'
import { optimize } from '../lib/image'

type Props = { headline?: string; cta?: string; image?: ImageAsset; tagline?: string; sub?: string }

export default function Hero({ headline, cta, image, tagline, sub }: Props) {
  return (
    <section className="section" style={{ padding: 0, height: '100vh', minHeight: '100svh', position: 'relative', overflow: 'visible' }}>
      {image?.url && (
        <motion.img
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          src={optimize(image.url, { w: 1920, q: 85 })}
          alt={headline || ''}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
      
      <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', paddingBottom: 0 }}>
        <div style={{ maxWidth: 800, color: 'white', paddingTop: 80 }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 1, delay: 0.5, ease: 'circOut' }}
            style={{ height: 4, background: 'var(--accent)', marginBottom: 24 }}
          />
          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="serif"
              style={{ fontSize: 'clamp(36px, 8vw, 96px)', margin: 0, lineHeight: 1, fontWeight: 400 }}
            >
              {headline || 'Photography'}
            </motion.h1>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{ marginTop: 24 }}
          >
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a className="cta" href="/work" style={{ fontSize: 14, fontWeight: 600, background: 'white', color: 'black' }}>Explore Our Work</a>
              <a className="cta" href="/contact" style={{ fontSize: 14, fontWeight: 600, background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}>Get a Quote</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
