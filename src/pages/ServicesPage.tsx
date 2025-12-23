import React from 'react'
import { motion } from 'framer-motion'
import { Service, ServicesPageData } from '../App'

type Props = { page: ServicesPageData | null; services: Service[] }

export default function ServicesPage({ page, services }: Props) {
  if (!page) return null

  const { hero, categories, process } = page

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ paddingTop: 0, minHeight: '100vh', background: '#fff' }}
    >
      <section style={{ height: '50vh', background: '#111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
          <img
            src={hero?.image?.url || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1600'}
            alt={hero?.title || 'Services'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1600' }}
          />
        </div>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="serif" 
            style={{ fontSize: 'clamp(48px, 6vw, 96px)', margin: 0 }}
          >
            {hero.title || 'Our Expertise'}
          </motion.h1>
          <p style={{ maxWidth: 600, margin: '24px auto', color: '#999', fontSize: 18 }}>
             {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Services List - Alternating Layout */}
      <section className="section responsive-padding">
        <div className="container">
          {categories?.map((s, i) => (
            <div 
              key={s.title} 
              className="grid-2"
              style={{ 
                alignItems: 'center', 
                marginBottom: 160,
                direction: i % 2 === 1 ? 'rtl' : 'ltr'
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 1 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{ direction: 'ltr' }}
              >
                 <div className="services-image">
                   {s.image?.url && <img src={s.image.url} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                 </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 1 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{ direction: 'ltr' }}
              >
                <h2 className="serif" style={{ fontSize: 48, marginBottom: 24 }}>{s.title}</h2>
                <div style={{ width: 64, height: 2, background: 'var(--accent)', marginBottom: 32 }} />
                <p style={{ lineHeight: 1.8, fontSize: 18, color: '#555' }}>{s.description}</p>
                {s.items && (
                  <ul style={{ marginTop: 32, paddingLeft: 20, color: '#666', lineHeight: 2 }}>
                    {s.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                )}
                {String(s.title || '').toLowerCase().includes('web design') && (
                  <div style={{ marginTop: 28, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <a
                      href="https://elsdigital.com/portfolio"
                      className="cta"
                      target="_blank"
                      rel="noreferrer"
                      style={{ background: 'black', color: 'white', fontSize: 14 }}
                    >
                      View Web Portfolio
                    </a>
                    <a
                      href="https://elsdigital.com"
                      className="cta"
                      target="_blank"
                      rel="noreferrer"
                      style={{ background: 'transparent', color: 'black', border: '1px solid rgba(0,0,0,0.2)', fontSize: 14 }}
                    >
                      Visit ELS Digital
                    </a>
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <div className="section" style={{ background: '#f5f5f5' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 className="serif" style={{ fontSize: 48, marginBottom: 16 }}>How We Work</h2>
            <p style={{ maxWidth: 600, margin: '0 auto', color: '#666' }}>A seamless process from concept to delivery.</p>
          </div>
          
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
            {process?.map((s, i) => (
              <motion.div 
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ background: 'white', padding: 24, borderBottom: '2px solid transparent', transition: '0.3s' }}
                whileHover={{ borderBottom: '2px solid var(--accent)', y: -5 }}
              >
                <div style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 700, marginBottom: 16 }}>STEP {s.step}</div>
                <h3 className="serif" style={{ fontSize: 24, marginBottom: 16 }}>{s.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.7 }}>{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      
      
      {/* CTA */}
      <section className="section" style={{ background: '#F0EFE9', color: 'black', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 className="serif" style={{ fontSize: 48, marginBottom: 32 }}>Have a project in mind?</h2>
          <a href="/contact" className="cta" style={{ background: 'black', color: 'white' }}>Get a Quote</a>
        </div>
      </section>
    </motion.div>
  )
}
