import React, { useEffect } from 'react'

type Props = { open: boolean; src?: string; title?: string; onClose: () => void }

export default function Lightbox({ open, src, title, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.8)', display: 'grid', placeItems: 'center', zIndex: 1000 }} onClick={onClose}>
      <img src={src} alt={title || ''} style={{ maxWidth: '90vw', maxHeight: '85vh', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
    </div>
  )
}

