import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  
  return (
    <Routes location={location} key={location.pathname}>
      {children}
    </Routes>
  )
}
