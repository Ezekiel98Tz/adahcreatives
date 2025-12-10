import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Work', href: '/work' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '24px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mixBlendMode: 'difference',
          color: 'white',
        }}
      >
        <Link to="/" className="serif" style={{ fontSize: 24, textDecoration: 'none', color: 'white', fontWeight: 600 }}>
          ADAH.
        </Link>

        {/* Desktop */}
        <div style={{ display: 'flex', gap: 40 }} className="desktop-nav">
          {links.map(l => (
            <Link
              key={l.label}
              to={l.href}
              style={{ 
                textDecoration: 'none', 
                color: 'white', 
                fontSize: 14, 
                letterSpacing: '0.05em', 
                textTransform: 'uppercase',
                opacity: location.pathname === l.href ? 1 : 0.7 
              }}
              className={`nav-link ${location.pathname === l.href ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          <div style={{ width: 24, height: 2, background: 'white', marginBottom: 6 }} />
          <div style={{ width: 24, height: 2, background: 'white' }} />
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: '#0A0A0A',
              zIndex: 40,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 32
            }}
          >
            {links.map(l => (
              <Link
                key={l.label}
                to={l.href}
                onClick={() => setMobileOpen(false)}
                className="serif"
                style={{ color: 'var(--offwhite)', fontSize: 32, textDecoration: 'none' }}
              >
                {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .desktop-nav { display: flex; }
        .mobile-toggle { display: none; cursor: pointer; }
        @media(max-width: 768px) {
          .desktop-nav { display: none; }
          .mobile-toggle { display: block; }
        }
        .nav-link { position: relative; transition: opacity 0.2s; }
        .nav-link:hover { opacity: 1; }
        .nav-link::after {
          content: ''; position: absolute; left: 0; bottom: -4px; width: 0%; height: 1px; background: var(--accent); transition: width 0.3s ease;
        }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
      `}</style>
    </>
  )
}
