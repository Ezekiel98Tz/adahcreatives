import React from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import CircularGallery from '../components/CircularGallery'
import { Home, Photo } from '../App'
import { Link } from 'react-router-dom'

type Props = { home: Home | null; photos: Photo[] }

export default function HomePage({ home, photos }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero headline={home?.heroHeadline} cta={home?.heroCTA} image={home?.heroImage} tagline={home?.tagline} sub={home?.subhead} />
      
      {/* Services Teaser */}
      <section className="section responsive-padding" style={{ background: '#fff' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'end', marginBottom: 80 }}>
             <div>
               <motion.h2 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="serif" 
                 style={{ fontSize: 'clamp(40px, 5vw, 64px)', margin: 0, lineHeight: 1.1 }}
               >
                 We Craft<br /><span style={{ color: 'var(--muted)' }}>Timeless Media.</span>
               </motion.h2>
             </div>
             <div>
               <motion.p 
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 style={{ color: '#666', lineHeight: 1.8, fontSize: 18, maxWidth: 500 }}
               >
                 From high-end photography to cinematic video production, we help brands and individuals tell stories that resonate and endure.
               </motion.p>
             </div>
          </div>

          <div className="grid-3">
            {[
              { title: 'Photography', img: 'https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&q=80&w=800' },
              { title: 'Cinematography', img: 'https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?auto=format&fit=crop&q=80&w=800' },
              { title: 'Creative Strategy', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800' }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="service-card"
              >
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  src={s.img} 
                  alt={s.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                <div style={{ position: 'absolute', bottom: 32, left: 32, color: 'white' }}>
                  <h3 className="serif" style={{ fontSize: 32, margin: 0 }}>{s.title}</h3>
                  <div style={{ marginTop: 8, height: 2, width: 40, background: 'var(--accent)' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Stories (Dark Section) */}
      <section className="section responsive-padding" style={{ background: '#050505', color: 'white', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: 64 }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="serif" 
            style={{ fontSize: 'clamp(32px, 4vw, 56px)', margin: 0 }}
          >
            Visual Stories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ color: '#888', marginTop: 16, maxWidth: 600, marginInline: 'auto' }}
          >
            A curated selection of our most impactful moments captured through the lens.
          </motion.p>
        </div>
        
        {photos.length > 0 ? (
          <CircularGallery items={photos} />
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: '#444' }}>Loading Gallery...</div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <Link to="/gallery" className="cta" style={{ background: 'white', color: 'black' }}>View Full Gallery</Link>
        </div>
      </section>

      {/* About / Stats - Crafting Legacy Redesign */}
      <section className="section responsive-padding" style={{ background: '#fff' }}>
        <div className="container">
          <div className="grid-split">
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               style={{ position: 'relative' }}
             >
               <div style={{ position: 'relative', height: 600, overflow: 'hidden' }}>
                 <img 
                   src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000" 
                   alt="Photographer at work" 
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                 />
                 <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />
               </div>
               
               {/* Floating Stats Card */}
               <motion.div 
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.3, duration: 0.8 }}
                 style={{ 
                   position: 'absolute', 
                   bottom: -40, 
                   right: -40, 
                   background: 'white', 
                   padding: 40, 
                   boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                   maxWidth: 300
                 }}
               >
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    <div>
                      <div className="serif" style={{ fontSize: 32, marginBottom: 4 }}>60+</div>
                      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>Clients</div>
                    </div>
                    <div>
                      <div className="serif" style={{ fontSize: 32, marginBottom: 4 }}>150+</div>
                      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>Projects</div>
                    </div>
                 </div>
               </motion.div>
             </motion.div>

             <motion.div
               initial={{ opacity: 0, x: 40 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               style={{ paddingLeft: 20 }}
             >
               <div style={{ width: 64, height: 2, background: 'var(--accent)', marginBottom: 32 }} />
               <h2 className="serif" style={{ fontSize: 'clamp(32px, 4vw, 56px)', marginBottom: 32, lineHeight: 1.1 }}>
                 Crafting a <br />Legacy of Light.
               </h2>
               <p style={{ lineHeight: 1.8, color: '#666', marginBottom: 32, fontSize: 18 }}>
                 We don't just take photos; we build narratives. Our approach combines technical precision with artistic intuition to deliver content that stands the test of time.
               </p>
               <p style={{ lineHeight: 1.8, color: '#666', marginBottom: 48, fontSize: 16 }}>
                 From the first concept to the final edit, every step is deliberate, every frame is chosen with purpose. We believe in the power of visual storytelling to move hearts and shape opinions.
               </p>
               <Link to="/about" className="cta" style={{ background: 'black', color: 'white', fontSize: 14 }}>
                 Read Our Philosophy
               </Link>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By / Logos */}
      <section className="section" style={{ background: '#F0EFE9', padding: '80px 0', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ textAlign: 'center', color: '#111', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 48 }}>Trusted By</div>
          
          <div style={{ display: 'flex', overflow: 'hidden', width: '100%', position: 'relative' }}>
             {/* Marquee Container */}
             <motion.div 
               animate={{ x: ['0%', '-50%'] }}
               transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
               style={{ display: 'flex', gap: 80, minWidth: '200%' }}
             >
                {[...Array(2)].map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: 80, alignItems: 'center' }}>
                    {['UNICEF', 'USAID', 'Vodacom', 'CRDB', 'Embassy', 'CocaCola', 'Toyota', 'Samsung'].map(logo => (
                       <div key={logo} style={{ fontSize: 40, fontWeight: 700, fontFamily: 'serif', color: '#222', whiteSpace: 'nowrap' }}>
                         {logo}
                       </div>
                    ))}
                  </div>
                ))}
             </motion.div>
             
             {/* Gradient Masks */}
             <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(to right, #F0EFE9, transparent)' }} />
             <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(to left, #F0EFE9, transparent)' }} />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section" style={{ background: '#F0EFE9', color: 'black', textAlign: 'center', padding: '80px 20px' }}>
        <div className="container">
          <h2 className="serif" style={{ fontSize: 'clamp(32px, 5vw, 64px)', margin: '0 auto 24px' }}>Ready to tell your story?</h2>
          <p style={{ maxWidth: 600, margin: '0 auto 40px', fontSize: 18, opacity: 0.9 }}>
            Whether it's a corporate campaign or a personal milestone, let's create something extraordinary together.
          </p>
          <Link to="/contact" style={{ display: 'inline-block', background: 'black', color: 'white', padding: '16px 32px', textDecoration: 'none', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em' }}>
            Start a Project
          </Link>
        </div>
      </section>
    </motion.div>
  )
}
