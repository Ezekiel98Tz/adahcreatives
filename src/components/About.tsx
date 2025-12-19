import React from 'react'
import { motion } from 'framer-motion'
import { ImageAsset } from '../App'
import { optimize } from '../lib/image'

type Props = { portrait: ImageAsset; bio: string }

export default function About({ portrait, bio }: Props) {
  return (
    <section className="section" style={{ padding: '120px 0', background: '#f8f8f8', color: 'black' }}>
      <div className="container about-grid" style={{ alignItems: 'start' }}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="portrait-shell" style={{ width: '100%', maxWidth: 520, borderRadius: 16, overflow: 'hidden', border: '1px solid #eee', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
            <img
              src={portrait?.url ? optimize(portrait.url, { w: 1000 }) : 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000'}
              alt="Portrait"
              style={{ width: '100%', objectFit: 'cover', aspectRatio: '4/5', display: 'block' }}
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000' }}
            />
          </div>
          <div style={{ fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginTop: 16 }}>The Photographer</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="about-text"
        >
          <h2 className="serif" style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginTop: 0, marginBottom: 32 }}>Capturing Life's<br />Fleeting Moments</h2>
          <p style={{ lineHeight: 1.9, fontSize: 18, color: '#444', whiteSpace: 'pre-wrap' }}>{bio}</p>
        </motion.div>
      </div>
      <style>{`
        .about-grid { display: grid; grid-template-columns: minmax(320px, 520px) 1fr; gap: 48px }
        .about-text { padding-left: 0 }
        @media (max-width: 900px) { .about-grid { grid-template-columns: 1fr } }
        @media (max-width: 900px) { .portrait-shell { max-width: 420px } }
      `}</style>
    </section>
  )
}
