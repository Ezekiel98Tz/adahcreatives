import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'

type Props = { onSubmit: (data: { name: string; email: string; message?: string }) => Promise<void> }

export default function ContactPage({ onSubmit }: Props) {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await onSubmit(formState)
      setIsSent(true)
    } catch (e: any) {
      setError(e?.message || 'Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactCards = [
    { 
      title: 'Email', 
      value: 'info@adahcreatives.co.tz', 
      href: 'mailto:info@adahcreatives.co.tz',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    },
    { 
      title: 'Phone / WhatsApp', 
      value: '+255 652 493 048', 
      href: 'https://wa.me/255652493048',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      )
    },
    { 
      title: 'Studio', 
      value: 'Dar es Salaam, Tanzania', 
      sub: 'Available for travel worldwide.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
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
      <SEO
        title="Contact Us"
        description="Get in touch with Adah Creatives for collaborations, inquiries, or just to say hello."
      />
      {/* Header */}
      <section className="responsive-header-padding" style={{ background: '#111', color: 'white', textAlign: 'center' }}>
        <div className="container">
           <motion.h1 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="serif" 
             style={{ fontSize: 'clamp(48px, 6vw, 96px)', margin: 0 }}
           >
             Let's Talk
           </motion.h1>
           <p style={{ maxWidth: 600, margin: '24px auto', color: '#999', fontSize: 18 }}>
             Ready to start your project? We'd love to hear from you.
           </p>
        </div>
      </section>

      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60 }}>
            
            {/* Contact Info */}
            <div>
              <h2 className="serif" style={{ fontSize: 40, marginBottom: 32 }}>Get in Touch</h2>
              <p style={{ lineHeight: 1.8, color: '#666', marginBottom: 48, fontSize: 18 }}>
                Whether you have a specific project in mind or just want to explore possibilities, we're here to help.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {contactCards.map((card, i) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 24,
                      padding: 32,
                      background: 'white',
                      border: '1px solid #eee',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      overflow: 'hidden'
                    }}
                    whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                  >
                    <div style={{ 
                      width: 48, 
                      height: 48, 
                      background: '#f5f5f5', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'black',
                      flexShrink: 0
                    }}>
                      {card.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginBottom: 8 }}>
                        {card.title}
                      </div>
                      {card.href ? (
                        <a href={card.href} style={{ fontSize: 20, color: 'black', textDecoration: 'none', fontWeight: 500, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                          {card.value}
                        </a>
                      ) : (
                        <div style={{ fontSize: 20, fontWeight: 500, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{card.value}</div>
                      )}
                      {card.sub && (
                        <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>{card.sub}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ marginTop: 60 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 24 }}>Follow Us</div>
                <div style={{ display: 'flex', gap: 24 }}>
                  <a href="https://www.instagram.com/adahcreatives/?hl=en" target="_blank" rel="noopener noreferrer" style={{ color: 'black', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none', borderBottom: '1px solid #ddd', paddingBottom: 2 }}>Instagram</a>
                  <a href="https://www.linkedin.com/company/adah-creatives/" target="_blank" rel="noopener noreferrer" style={{ color: 'black', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none', borderBottom: '1px solid #ddd', paddingBottom: 2 }}>LinkedIn</a>
                  <a href="https://wa.me/255652493048" target="_blank" rel="noopener noreferrer" style={{ color: 'black', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none', borderBottom: '1px solid #ddd', paddingBottom: 2 }}>WhatsApp</a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ background: '#f9f9f9', padding: 60, borderRadius: 0 }}>
              {isSent ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ fontSize: 48, marginBottom: 24 }}
                  >
                    ✓
                  </motion.div>
                  <h3 className="serif" style={{ fontSize: 32, marginBottom: 16 }}>Message Sent</h3>
                  <p style={{ color: '#666' }}>Thank you for reaching out. We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 32 }}>
                  {error && (
                    <div style={{ background: '#fff', border: '1px solid #f3c0c0', color: '#a61b1b', padding: '14px 16px', fontSize: 14 }}>
                      {error}
                    </div>
                  )}
                  <div>
                    <label style={{ display: 'block', marginBottom: 12, fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
                    <input 
                      required
                      value={formState.name}
                      onChange={e => setFormState({...formState, name: e.target.value})}
                      style={{ width: '100%', padding: '16px 0', border: 'none', borderBottom: '1px solid #ccc', background: 'transparent', fontSize: 18, outline: 'none' }}
                      placeholder="Jane Doe"
                      onFocus={(e) => e.target.style.borderBottomColor = 'black'}
                      onBlur={(e) => e.target.style.borderBottomColor = '#ccc'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 12, fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                    <input 
                      required
                      type="email"
                      value={formState.email}
                      onChange={e => setFormState({...formState, email: e.target.value})}
                      style={{ width: '100%', padding: '16px 0', border: 'none', borderBottom: '1px solid #ccc', background: 'transparent', fontSize: 18, outline: 'none' }}
                      placeholder="jane@example.com"
                      onFocus={(e) => e.target.style.borderBottomColor = 'black'}
                      onBlur={(e) => e.target.style.borderBottomColor = '#ccc'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 12, fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</label>
                    <textarea 
                      required
                      rows={4}
                      value={formState.message}
                      onChange={e => setFormState({...formState, message: e.target.value})}
                      style={{ width: '100%', padding: '16px 0', border: 'none', borderBottom: '1px solid #ccc', background: 'transparent', fontSize: 18, outline: 'none', resize: 'vertical' }}
                      placeholder="Tell us about your project..."
                      onFocus={(e) => e.target.style.borderBottomColor = 'black'}
                      onBlur={(e) => e.target.style.borderBottomColor = '#ccc'}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ 
                      background: 'black', 
                      color: 'white', 
                      border: 'none', 
                      padding: '20px 40px', 
                      fontSize: 16, 
                      cursor: isSubmitting ? 'wait' : 'pointer',
                      marginTop: 16,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
