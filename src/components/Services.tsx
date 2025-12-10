import React from 'react'
import { motion } from 'framer-motion'
import { Service } from '../App'

type Props = { services: Service[] }

export default function Services({ services }: Props) {
  return (
    <section className="section" style={{ background: 'black', padding: '120px 0', color: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16, fontSize: 14 }}>Packages</div>
          <h2 className="serif" style={{ fontSize: 48, margin: 0, color: 'white' }}>Investment</h2>
        </div>
        
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              className="service-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              style={{ 
                padding: 24, 
                background: 'white', 
                borderTop: '2px solid var(--accent)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 320,
                cursor: 'default'
              }}
            >
              <div>
                <h3 className="serif" style={{ fontSize: 28, margin: '0 0 16px 0' }}>{s.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.7, marginBottom: 32 }}>{s.description}</p>
              </div>
              <div>
                <div style={{ height: 1, background: '#eee', width: '100%', marginBottom: 24 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, letterSpacing: '0.05em', color: '#999' }}>STARTING AT</span>
                  <span className="serif" style={{ fontSize: 24, color: 'var(--black)' }}>{s.price}</span>
                </div>
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                  <a href="/contact" className="cta" style={{ background: 'black', color: 'white' }}>Choose Package</a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
       <style>{`
         .service-card { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.12); border: 1px solid #222 }
         .service-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.2); border-color: #333 }
       `}</style>
    </section>
  )
}
