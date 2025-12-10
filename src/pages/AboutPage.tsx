import React from 'react'
import { motion } from 'framer-motion'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import { AboutData, Testimonial } from '../App'

type Props = { about: AboutData | null; testimonials?: Testimonial[] }

export default function AboutPage({ about, testimonials = [] }: Props) {
  if (!about) return null
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ paddingTop: 0, minHeight: '100vh', background: '#fff' }}
    >
      {/* Hero Section */}
      <section style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
           <img 
             src="https://images.unsplash.com/photo-1542038784424-48ed2d46wd93?auto=format&fit=crop&q=80&w=2000" 
             alt="Studio" 
             style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
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
            Our Story
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
            We are a purpose-driven creative studio blending artistic vision with technical excellence.
          </motion.p>
        </div>
      </section>

      {/* Intro & Philosophy */}
      <section className="section responsive-padding">
        <div className="container">
          <div className="grid-2">
            <div>
              <h2 className="serif" style={{ fontSize: 40, marginBottom: 32 }}>Who We Are</h2>
              <p style={{ lineHeight: 1.8, color: '#666', fontSize: 18, marginBottom: 32 }}>
                We are a full-service creative media house with deep expertise in photography, videography, aerial drone footage, web design, and animation. 
              </p>
              <p style={{ lineHeight: 1.8, color: '#666', fontSize: 18 }}>
                Our core strength lies in combining high-end technical skills with rich storytelling — delivering media content that not only looks beautiful, but resonates emotionally.
              </p>
            </div>
            <div style={{ background: '#f8f8f8', padding: 48 }}>
              <h3 className="serif" style={{ fontSize: 32, marginBottom: 24 }}>Our Philosophy</h3>
              <p style={{ lineHeight: 1.8, color: '#555', fontSize: 18, fontStyle: 'italic' }}>
                "Every project begins with your vision. We immerse ourselves in your story, your brand, or your event — then meticulously craft visuals that reflect your identity."
              </p>
              <div style={{ marginTop: 32, fontWeight: 600 }}>— The Adah Team</div>
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
            {[
              { 
                title: 'Creative Excellence & Professionalism', 
                desc: 'Our team unites seasoned professionals with refined artistic sensibilities and strategic insight. We approach every project with precision, creativity, and a commitment to exceeding expectations.',
                img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000'
              },
              { 
                title: 'Comprehensive Production & Creative Services', 
                desc: 'From pre-production, storyboarding, and filming, to photography, drone cinematography, graphic design, animation, web design, and web development, we handle every stage so you can focus on your vision without the typical agency stress.',
                img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000'
              },
              { 
                title: 'Cutting-Edge Technology & Techniques', 
                desc: 'We utilize top-tier camera gear, drones, editing suites, animation tools, and advanced web technologies to ensure every piece of content is cinematic, crisp, and polished to perfection.',
                img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000'
              },
              { 
                title: 'Impact-Driven Track Record', 
                desc: 'We’ve collaborated with brands, corporate clients, international organizations, NGOs, development agencies, and private clients — delivering powerful visuals and digital solutions that inform, inspire, and create lasting impact.',
                img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000'
              }
            ].map((item, i) => (
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
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ padding: 24 }}>
                  <h3 className="serif" style={{ fontSize: 22, marginBottom: 12, color: 'var(--accent)' }}>{item.title}</h3>
                  <p style={{ opacity: 0.8, lineHeight: 1.7 }}>{item.desc}</p>
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
            {[
              { k: 'Clients', v: '60+' },
              { k: 'Projects', v: '150+' },
              { k: 'Deliverables', v: '300+' },
              { k: 'Regions', v: 'Tanzania' },
            ].map(x => (
              <div key={x.k}>
                <div className="serif" style={{ fontSize: 56, color: 'var(--accent)', lineHeight: 1 }}>{x.v}</div>
                <div style={{ color: '#999', letterSpacing: '0.08em', marginTop: 16, fontSize: 14, textTransform: 'uppercase' }}>{x.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder / About Component */}
      <About portrait={about.portrait} bio={about.bio} />

      {testimonials.length > 0 && <Testimonials items={testimonials} />}
    </motion.div>
  )
}
