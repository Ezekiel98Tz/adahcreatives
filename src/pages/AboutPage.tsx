import React from 'react'
import { motion } from 'framer-motion'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import { AboutData, Testimonial } from '../App'
import SEO from '../components/SEO';

type Props = { about: AboutData | null; testimonials?: Testimonial[] }

export default function AboutPage({ about, testimonials = [] }: Props) {
  if (!about) return null
  
  const { hero, intro, features, stats, founder } = about

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ paddingTop: 0, minHeight: '100vh', background: '#fff' }}
    >
      <SEO 
        title={hero?.title || 'Our Story'}
        description={hero?.subtitle || 'We are a purpose-driven creative studio blending artistic vision with technical excellence.'}
        imageUrl={hero?.image?.url}
      />
      {/* Hero Section */}
      <section style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
           <img 
             src={hero?.image?.url || 'https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&q=80&w=1600'} 
             alt={hero?.title || 'Studio'} 
             style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
             onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&q=80&w=1600' }}
           />
        </div>
        <div className="container" style={{ position: 'relative', textAlign: 'center', zIndex: 10 }}>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="serif" 
            style={{ fontSize: 'clamp(48px, 6vw, 96px)', margin: 0 }}
          >
            {hero?.title || 'Our Story'}
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ width: 60, height: 2, background: 'white', margin: '24px auto' }}
          />
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontSize: 20, maxWidth: 600, margin: '0 auto', opacity: 0.9 }}
          >
            {hero?.subtitle || 'We are a purpose-driven creative studio blending artistic vision with technical excellence.'}
          </motion.p>
        </div>
      </section>

      {/* Intro & Philosophy */}
      <section className="section responsive-padding">
        <div className="container">
          <div className="grid-2">
            <div>
              <h2 className="serif" style={{ fontSize: 40, marginBottom: 32 }}>{intro?.title || 'Who We Are'}</h2>
              <div style={{ lineHeight: 1.8, color: '#666', fontSize: 18, marginBottom: 32 }}>
                {intro?.content ? (
                  <p>{intro.content}</p>
                ) : (
                  <>
                    <p style={{ marginBottom: 32 }}>We are a full-service creative media house with deep expertise in photography, videography, aerial drone footage, web design, and animation.</p>
                    <p>Our core strength lies in combining high-end technical skills with rich storytelling — delivering media content that not only looks beautiful, but resonates emotionally.</p>
                  </>
                )}
              </div>
            </div>
            <div style={{ background: '#f8f8f8', padding: 48 }}>
              <h3 className="serif" style={{ fontSize: 32, marginBottom: 24 }}>{intro?.philosophyTitle || 'Our Philosophy'}</h3>
              <p style={{ lineHeight: 1.8, color: '#555', fontSize: 18, fontStyle: 'italic' }}>
                "{intro?.philosophyContent || 'Every project begins with your vision. We immerse ourselves in your story, your brand, or your event — then meticulously craft visuals that reflect your identity.'}"
              </p>
              <div style={{ marginTop: 32, fontWeight: 600 }}>{intro?.philosophyQuote || '— The Adah Team'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Stand Out */}
      <section className="section responsive-padding" style={{ background: 'linear-gradient(to bottom, #f8f8f8 0%, #ffffff 12%, #ffffff 88%, #f8f8f8 100%)', color: 'black' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="serif" style={{ fontSize: 'clamp(28px, 6vw, 48px)', marginBottom: 12 }}>Why We Stand Out</h2>
            <p style={{ opacity: 0.75, maxWidth: 640, margin: '0 auto' }}>Excellence in every pixel, purpose in every frame.</p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {features?.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ 
                  background: 'white', 
                  border: '1px solid #eee',
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.06)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                  {item.image?.url && (
                    <img src={item.image.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  )}
                </div>
                <div style={{ padding: 24 }}>
                  <h3 className="serif" style={{ fontSize: 22, marginBottom: 12, color: 'var(--accent)' }}>{item.title}</h3>
                  <p style={{ opacity: 0.8, lineHeight: 1.7 }}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{ background: 'var(--offwhite)', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 24, textAlign: 'center' }}>
            {stats?.map(x => (
              <div key={x.label}>
                <div className="serif" style={{ fontSize: 56, color: 'var(--accent)', lineHeight: 1 }}>{x.value}</div>
                <div style={{ color: '#999', letterSpacing: '0.08em', marginTop: 16, fontSize: 14, textTransform: 'uppercase' }}>{x.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder / About Component */}
      {founder && (
        <About
          portrait={founder.portrait || { url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000' }}
          bio={founder.bio || 'I am a visual storyteller obsessed with the fleeting moments that define our humanity.'}
        />
      )}

      {testimonials.length > 0 && <Testimonials items={testimonials} />}
    </motion.div>
  )
}
