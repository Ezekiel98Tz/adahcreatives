import { useEffect, useRef, useState } from 'react'

export default function useFadeIn() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setVisible(true) })
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, visible }
}

