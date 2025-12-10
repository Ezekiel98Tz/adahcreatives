import React from 'react'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ paddingTop: 120, textAlign: 'center' }}>
      <h1 className="serif">Page Not Found</h1>
      <p style={{ color: '#555' }}>Let’s take you back to the work.</p>
      <a href="/work" className="cta">View Portfolio</a>
    </motion.div>
  )
}
