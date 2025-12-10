import React, { useEffect, useMemo, useState } from 'react'
import { Route } from 'react-router-dom'
import { getHome, getPhotos, getAbout, getServices, getTestimonials, getProjects, submitBooking } from './lib/payloadClient'
import Layout from './components/Layout'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import WorkPage from './pages/WorkPage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'
import ProjectPage from './pages/ProjectPage'
import NotFoundPage from './pages/NotFoundPage'
import GalleryPage from './pages/GalleryPage'

export type ImageAsset = {
  url: string
  width?: number
  height?: number
  blurDataURL?: string
  sizes?: Record<string, { url: string; width: number; height: number }>
}

export type Home = { heroHeadline?: string; heroCTA?: string; heroImage?: ImageAsset; tagline?: string; subhead?: string }
export type Photo = { id: string; title?: string; category?: string; image: ImageAsset }
export type Project = { id: string; slug: string; title: string; category?: string; client?: string; location?: string; heroImage?: ImageAsset; gallery?: ImageAsset[]; story?: string; credits?: string[] }
export type AboutData = { portrait: ImageAsset; bio: string }
export type Service = { id: string; title: string; description?: string; price?: string }
export type Testimonial = { id: string; author?: string; quote: string }

import Footer from './components/Footer'
import SocialWidgets from './components/SocialWidgets'

export default function App() {
  const [home, setHome] = useState<Home | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [about, setAbout] = useState<AboutData | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    Promise.all([getHome(), getProjects(), getPhotos(), getAbout(), getServices(), getTestimonials()])
      .then(([h, pr, p, a, s, t]) => {
        if (!mounted) return
        setHome(h)
        setProjects(pr)
        setPhotos(p)
        setAbout(a)
        setServices(s)
        setTestimonials(t)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const onSubmitContact = async (data: { name: string; email: string; message?: string }) => {
    await submitBooking(data)
  }

  const contentReady = useMemo(() => !loading, [loading])

  if (!contentReady) {
    return (
      <div className="page-shell">
        <div className="loading">Loading</div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <Navigation />
      <Layout>
        <Route path="/" element={<HomePage home={home} photos={photos} />} />
        <Route path="/work" element={<WorkPage projects={projects} />} />
        <Route path="/gallery" element={<GalleryPage photos={photos} />} />
        <Route path="/work/:slug" element={<ProjectPage />} />
        <Route path="/about" element={<AboutPage about={about} testimonials={testimonials} />} />
        <Route path="/services" element={<ServicesPage services={services} />} />
        <Route path="/contact" element={<ContactPage onSubmit={onSubmitContact} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Layout>
      <Footer />
      <SocialWidgets />
    </div>
  )
}
