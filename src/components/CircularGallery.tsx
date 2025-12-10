import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useAnimation, PanInfo, useAnimationFrame } from 'framer-motion'
import { Photo } from '../App'
import { optimize } from '../lib/image'

type Props = {
  items: Photo[]
}

const CARD_WIDTH = 260
const CARD_HEIGHT = 360
const GAP = 20

export default function CircularGallery({ items }: Props) {
  const [width, setWidth] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  // Use a subset if too many items, or duplicate if too few to make a nice circle
  // For a good circle we need at least 5-6 items.
  const displayItems = items.length < 5 ? [...items, ...items, ...items] : items
  const count = displayItems.length
  
  // Circumference
  const circumference = count * (CARD_WIDTH + GAP)
  const radius = Math.max(circumference / (2 * Math.PI), 350) 

  const rotation = useTransform(x, (value) => (value / circumference) * 360)

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.offsetWidth)
    }
  }, [])

  // Auto-rotate
  useAnimationFrame((time, delta) => {
    if (!isDragging && !isHovered) {
      // Adjust speed here. Higher number = faster.
      // 0.05 is slow and elegant.
      const moveBy = -0.5 * (delta / 16) 
      x.set(x.get() + moveBy)
    }
  })

  return (
    <div 
      style={{ 
        perspective: 2000, 
        overflow: 'hidden', 
        padding: '100px 0', 
        background: '#050505',
        display: 'flex',
        justifyContent: 'center'
      }} 
      ref={carouselRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        style={{
          width: 0, // Center point
          height: CARD_HEIGHT,
          position: 'relative',
          transformStyle: 'preserve-3d',
          rotateY: rotation,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        whileTap={{ cursor: 'grabbing' }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onDrag={(e, info) => {
           x.set(x.get() + info.delta.x)
        }}
      >
        {displayItems.map((item, index) => {
          const angle = (index / count) * 360
          return (
            <div
              key={`${item.id}-${index}`}
              style={{
                position: 'absolute',
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                left: -CARD_WIDTH / 2,
                top: 0,
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                backfaceVisibility: 'visible', 
              }}
            >
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: '#fff', 
                borderRadius: 12, 
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <img 
                  src={optimize(item.image.url, { w: 400 })} 
                  alt={item.title || ''} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} 
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 20,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  color: 'white'
                }}>
                  <div className="serif" style={{ fontSize: 18 }}>{item.title}</div>
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
