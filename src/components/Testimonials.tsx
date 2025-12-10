import React, { useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Testimonial } from '../App'

type Props = { items: Testimonial[] }

export default function Testimonials({ items }: Props) {
  const testimonials = useMemo(() => items.map((item, i) => ({
    ...item,
    image: `https://images.unsplash.com/photo-${
      [
        '1560250097-0b93528c311a',
        '1573496359142-b8d87734a5a2',
        '1472099645785-5658abf4ff4e',
        '1580489944761-15a19d654956',
      ][i % 4]
    }?auto=format&fit=crop&q=80&w=300&h=300`
  })), [items])

  if (!testimonials.length) return null

  return (
    <section className="section" style={{ background: '#F0EFE9', color: 'black', padding: '60px 0', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 className="serif" style={{ fontSize: 48, marginBottom: 16 }}>Client Stories</h2>
          <div style={{ width: 60, height: 2, background: 'rgba(0,0,0,0.2)', margin: '0 auto' }} />
        </div>

        <Carousel testimonials={testimonials} />
      </div>
    </section>
  )
}

function Carousel({ testimonials }: { testimonials: Array<Testimonial & { image: string }> }) {
  const [index, setIndex] = React.useState(0)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const timerRef = useRef<number | null>(null)

  const start = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % testimonials.length)
    }, 3000)
  }

  const stop = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  useEffect(() => { start(); return stop }, [testimonials])
  return (
    <div style={{ position: 'relative', maxWidth: 420, margin: '0 auto' }}>
      <div 
        ref={trackRef}
        style={{ 
          width: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
        onMouseEnter={stop}
        onMouseLeave={start}
      >
        <div style={{ display: 'flex', width: '100%', transform: `translateX(-${index * 100}%)`, transition: 'transform 500ms ease' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ flex: '0 0 100%', padding: 8 }}>
              <motion.div 
                whileHover={{ y: -2 }}
                style={{ 
                  background: 'white', 
                  padding: 24, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 16,
                  borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  border: '1px solid #eee'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.2)', flexShrink: 0, aspectRatio: '1' }}>
                    <img src={t.image} alt={t.author} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 'inherit' }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t.author}</div>
                </div>
                <div style={{ fontSize: 16, lineHeight: 1.7, color: '#444', fontStyle: 'italic' }}>“{t.quote}”</div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={() => setIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)}
        style={{ position: 'absolute', left: -12, top: '50%', transform: 'translateY(-50%)', background: 'black', color: 'white', border: 'none', padding: '10px 14px', cursor: 'pointer' }}
        aria-label="Previous"
      >
        ◀
      </button>
      <button 
        onClick={() => setIndex(prev => (prev + 1) % testimonials.length)}
        style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', background: 'black', color: 'white', border: 'none', padding: '10px 14px', cursor: 'pointer' }}
        aria-label="Next"
      >
        ▶
      </button>
    </div>
  )
}

