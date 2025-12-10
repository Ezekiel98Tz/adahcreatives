import React from 'react'
import { motion } from 'framer-motion'

export default function SocialWidgets() {
  const socials = [
    { 
      name: 'WhatsApp', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg', 
      href: 'https://wa.me/255652493048',
      bg: '#25D366'
    },
    { 
      name: 'Instagram', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png', 
      href: 'https://www.instagram.com/adahcreatives/?hl=en',
      bg: '#E1306C'
    },
    { 
      name: 'LinkedIn', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png', 
      href: '#', // Add linkedin link if provided
      bg: '#0077b5'
    }
  ]

  return (
    <div className="social-widgets" style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {socials.map((s, i) => (
        <motion.a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1 + i * 0.1, type: 'spring' }}
          whileHover={{ scale: 1.1, x: -5 }}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          title={s.name}
        >
          <img src={s.icon} alt={s.name} style={{ width: 28, height: 28, objectFit: 'contain' }} />
        </motion.a>
      ))}
      <style>{`
        @media (max-width: 600px) {
          .social-widgets { display: none; }
        }
      `}</style>
    </div>
  )
}
