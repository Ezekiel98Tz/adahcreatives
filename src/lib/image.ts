import { ImageAsset } from '../App'

export function srcSetFromImage(image?: ImageAsset) {
  if (!image) return undefined
  const sizes = image.sizes || {}
  const entries = Object.values(sizes)
  if (!entries.length) return undefined
  return entries.sort((a, b) => a.width - b.width).map(s => `${s.url} ${s.width}w`).join(', ')
}

export function blurStyle(image?: ImageAsset) {
  const b = image?.blurDataURL
  if (!b) return {}
  return { backgroundImage: `url(${b})`, filter: 'blur(20px)', transform: 'scale(1.05)' }
}

export function optimize(url: string, opts?: { w?: number; q?: number }) {
  return url
}

