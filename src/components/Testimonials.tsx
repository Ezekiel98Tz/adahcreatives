import React, { useMemo, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Testimonial } from '../App'

type Props = { items: Testimonial[] }

export default function Testimonials({ items }: Props) {
  const testimonials = useMemo(() => items.map((item, i) => {
    const rawAuthor = typeof item.author === 'string' ? item.author.trim() : ''
    const [name, ...rest] = rawAuthor.split(' - ')
    const meta = rest.join(' - ').trim()
    const fallbackImage =
      `https://images.unsplash.com/photo-${
        [
          '1560250097-0b93528c311a',
          '1573496359142-b8d87734a5a2',
          '1472099645785-5658abf4ff4e',
          '1580489944761-15a19d654956',
        ][i % 4]
      }?auto=format&fit=crop&q=80&w=300&h=300`

    return {
      ...item,
      name: name || rawAuthor || 'Client',
      meta,
      image: encodeURI(item.image || fallbackImage),
    }
  }), [items])

  if (!testimonials.length) return null

  return (
    <section className="section" style={{ background: '#F0EFE9', color: 'black', padding: '70px 0', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 className="serif" style={{ fontSize: 48, marginBottom: 14 }}>Client Stories</h2>
          <div style={{ width: 60, height: 2, background: 'rgba(0,0,0,0.2)', margin: '0 auto' }} />
        </div>

        <Carousel testimonials={testimonials} />
      </div>
    </section>
  )
}

function Carousel({ testimonials }: { testimonials: Array<Testimonial & { image: string; name: string; meta: string }> }) {
  const [index, setIndex] = React.useState(0)
  const timerRef = useRef<number | null>(null)

  const start = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % testimonials.length)
    }, 6000)
  }

  const stop = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  useEffect(() => { start(); return stop }, [testimonials])
  const active = testimonials[index] ?? testimonials[0]
  if (!active) return null

  return (
    <div id="carousel-testimonials" style={{ position: 'relative', maxWidth: 1100, margin: '0 auto' }} onMouseEnter={stop} onMouseLeave={start}>
      <div style={{ position: 'relative', padding: 12 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 64 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -64 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{
              background: 'white',
              borderRadius: 18,
              boxShadow: '0 14px 50px rgba(0,0,0,0.12)',
              border: '1px solid rgba(0,0,0,0.08)',
              padding: 30,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 140px) minmax(0, 1fr)', gap: 22, alignItems: 'center' }}>
              <motion.div
                initial={{ opacity: 0, x: -34 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                style={{ width: 128, height: 128, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(0,0,0,0.12)', margin: '0 auto' }}
              >
                <img src={active.image} alt={active.author} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 34 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                style={{ minWidth: 0 }}
              >
                <div className="serif" style={{ fontSize: 44, lineHeight: 1, color: 'rgba(0,0,0,0.25)', marginBottom: 10 }}>“</div>
                <p style={{ margin: 0, fontSize: 18, lineHeight: 1.9, color: '#333' }}>{active.quote}</p>
                <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontSize: 14, color: '#111', fontWeight: 800, letterSpacing: '0.02em' }}>{active.name}</div>
                  {active.meta ? (
                    <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{active.meta}</div>
                  ) : null}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={() => setIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)}
        style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 42, height: 42, borderRadius: '50%', background: 'black', color: 'white', border: 'none', cursor: 'pointer' }}
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        onClick={() => setIndex(prev => (prev + 1) % testimonials.length)}
        style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 42, height: 42, borderRadius: '50%', background: 'black', color: 'white', border: 'none', cursor: 'pointer' }}
        aria-label="Next"
      >
        ›
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
        {testimonials.map((t, i) => (
          <button
            key={t.id || String(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
            style={{
              width: 42,
              height: 42,
              borderRadius: 999,
              border: i === index ? '2px solid black' : '1px solid rgba(0,0,0,0.18)',
              background: 'white',
              cursor: 'pointer',
              padding: 0,
              overflow: 'hidden',
            }}
          >
            <img src={t.image} alt={t.author} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: i === index ? 1 : 0.65 }} />
          </button>
        ))}
      </div>
    </div>
  )
}
