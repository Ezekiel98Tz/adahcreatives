import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid footer-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 60 }}>
          
          {/* Brand */}
          <div>
            <Link to="/" className="serif footer-brand" style={{ color: 'white', textDecoration: 'none', display: 'block', marginBottom: 24 }}>
              ADAH.
            </Link>
            <p style={{ lineHeight: 1.6, fontSize: 14, maxWidth: 300 }}>
              A purpose-driven, luxury creative studio blending artistic vision with technical excellence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="footer-title" style={{ color: 'white', marginBottom: 24, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Explore</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Home', 'About', 'Services', 'Gallery', 'Work', 'Contact'].map(link => (
                <Link 
                  key={link} 
                  to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                  className="footer-link"
                  style={{ color: '#888', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-title" style={{ color: 'white', marginBottom: 24, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14 }}>
              <div>
                <div style={{ color: 'white', marginBottom: 4 }}>Phone / WhatsApp</div>
                <a href="https://wa.me/255652493048" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none' }}>
                  +255 652 493 048
                </a>
              </div>
              <div>
                <div style={{ color: 'white', marginBottom: 4 }}>Email</div>
                <a href="mailto:info@adahcreatives.co.tz" style={{ color: '#888', textDecoration: 'none' }}>
                  info@adahcreatives.co.tz
                </a>
              </div>
              <div>
                <div style={{ color: 'white', marginBottom: 4 }}>Location</div>
                <div>Dar es Salaam, Tanzania</div>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="footer-title" style={{ color: 'white', marginBottom: 24, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: 16 }}>
              <a href="https://www.instagram.com/adahcreatives/?hl=en" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none' }}>Instagram</a>
              <a href="https://www.linkedin.com/company/adah-creatives/" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none' }}>LinkedIn</a>
              <a href="https://wa.me/255652493048" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'none' }}>WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{ borderTop: '1px solid #222', paddingTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ fontSize: 12 }}>
            © {new Date().getFullYear()} Adah Creatives. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 12 }}>
            <a href="#" style={{ color: '#888', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#888', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
      <style>{`
        .footer { background: #050505; color: #888; padding: 80px 0 40px; border-top: 1px solid #222 }
        .footer-brand { font-size: 32px }
        .footer-link { font-size: 14px }
        .footer-title { font-size: 14px }
        @media (max-width: 900px) {
          .footer { padding: 60px 0 32px }
        }
        @media (max-width: 600px) {
          .footer { padding: 48px 0 32px }
          .footer-grid { gap: 24px }
          .footer-brand { font-size: 24px }
          .footer-title { font-size: 12px }
          .footer-link { font-size: 13px }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 12px }
        }
      `}</style>
    </footer>
  )
}
