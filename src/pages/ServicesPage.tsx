import React from 'react'
import { motion } from 'framer-motion'
import { Service } from '../App'

type Props = { services: Service[] }

export default function ServicesPage({ services }: Props) {
  const serviceCategories = [
    { 
      title: 'Photography', 
      desc: 'From corporate events to intimate portraits, we capture moments with clarity and emotion. Our photography services include headshots, commercial product shoots, travel, and lifestyle imaging.',
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200'
    },
    { 
      title: 'Videography', 
      desc: 'We produce cinematic documentaries, corporate videos, promotional films, and event coverage. We tell brand stories that move audiences.',
      img: 'https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?auto=format&fit=crop&q=80&w=1000'
    },
    { 
      title: 'Aerial / Drone', 
      desc: 'Breathtaking aerial perspectives for real estate, tourism, and large-scale events. We use top-tier drone technology to elevate your visual storytelling.',
      img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=1000'
    },
    { 
      title: 'Graphic Design & Animation', 
      desc: 'Striking visuals and motion graphics that amplify your message. From full branding suites to animated explainers, we bring static concepts to life.',
      img: 'https://images.unsplash.com/photo-1626785774573-4b7993143d2d?auto=format&fit=crop&q=80&w=1000'
    },
    { 
      title: 'Web Design & Development', 
      desc: 'Elegant, responsive, and fully functional websites crafted to showcase your brand. We focus on user experience and seamless digital journeys.',
      img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=1000'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ paddingTop: 0, minHeight: '100vh', background: '#fff' }}
    >
      {/* Hero */}
      <section style={{ height: '50vh', background: '#111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="serif" 
            style={{ fontSize: 'clamp(48px, 6vw, 96px)', margin: 0 }}
          >
            Our Expertise
          </motion.h1>
          <p style={{ maxWidth: 600, margin: '24px auto', color: '#999', fontSize: 18 }}>
             Tailored creative services for brands, non-profits, and individuals.
          </p>
        </div>
      </section>

      {/* Services List - Alternating Layout */}
      <section className="section responsive-padding">
        <div className="container">
          {serviceCategories.map((s, i) => (
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
                   <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                <p style={{ lineHeight: 1.8, fontSize: 18, color: '#555' }}>{s.desc}</p>
                <ul style={{ marginTop: 32, paddingLeft: 20, color: '#666', lineHeight: 2 }}>
                  {s.title === 'Photography' && ['Corporate Events', 'Portraits & Headshots', 'Commercial Product', 'Lifestyle'].map(i => <li key={i}>{i}</li>)}
                  {s.title === 'Videography' && ['Documentaries', 'Corporate Video', 'Event Coverage', 'Brand Stories'].map(i => <li key={i}>{i}</li>)}
                  {s.title === 'Aerial / Drone' && ['Real Estate', 'Tourism', 'Large Events', 'Site Surveys'].map(i => <li key={i}>{i}</li>)}
                  {s.title === 'Graphic Design & Animation' && ['Visual Branding', 'Motion Graphics', 'Social Media Assets', 'Print Design'].map(i => <li key={i}>{i}</li>)}
                  {s.title === 'Web Design & Development' && ['Responsive Websites', 'UI/UX Design', 'CMS Integration', 'E-commerce'].map(i => <li key={i}>{i}</li>)}
                </ul>
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
            {[
              { step: '01', title: 'Discovery', desc: 'We begin by understanding your vision, goals, audience, and core message.' },
              { step: '02', title: 'Planning', desc: 'Storyboarding, mood-boards, logistics, and scheduling to ensure smooth execution.' },
              { step: '03', title: 'Production', desc: 'On-site or in-studio shooting handled with professional gear and crew.' },
              { step: '04', title: 'Post-Production', desc: 'Editing, color grading, and sound design to bring the raw footage to life.' },
              { step: '05', title: 'Delivery', desc: 'High-resolution files delivered in your preferred formats, ready for the world.' },
              { step: '06', title: 'Refinement', desc: 'We value your feedback and refine the work until it meets your exact standards.' },
            ].map((s, i) => (
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
                <p style={{ color: '#666', lineHeight: 1.7 }}>{s.desc}</p>
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
