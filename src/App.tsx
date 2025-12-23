import React, { useEffect, useMemo, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { getHome, getPhotos, getAbout, getServices, getServicesPage, getTestimonials, getProjects, submitContact } from './lib/api'
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
import Footer from './components/Footer'
import SocialWidgets from './components/SocialWidgets'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'

// Admin Components
import { AdminLayout } from './pages/admin/AdminLayout'
import { DashboardHome } from './pages/admin/DashboardHome'
import { ProjectsManager } from './pages/admin/ProjectsManager'
import { HomePageEditor } from './pages/admin/HomePageEditor'
import { AboutPageEditor } from './pages/admin/AboutPageEditor'
import { ServicesPageEditor } from './pages/admin/ServicesPageEditor'
import { GalleryManager } from './pages/admin/GalleryManager'

export type ImageAsset = {
  url: string
  width?: number
  height?: number
  blurDataURL?: string
  sizes?: Record<string, { url: string; width: number; height: number }>
}

export type Home = {
  hero: { headline?: string; cta?: string; image?: ImageAsset; tagline?: string; subhead?: string }
  servicesTeaser?: { titleLine1?: string; titleLine2?: string; description?: string; cards?: { title?: string; image?: ImageAsset }[] }
  visualGallery?: { title?: string; subtitle?: string; ctaText?: string }
  visualStories: { title?: string; description?: any; cta?: string; image?: ImageAsset; carousel?: { id: string; title?: string; category?: string; image: ImageAsset }[] }
  trustedBy: { name: string; logo?: ImageAsset }[]
}

export type Photo = { id: string; title?: string; category?: string; image: ImageAsset }
export type Project = { id: string; slug?: string | null; title: string; category?: string; client?: string; location?: string; heroImage?: ImageAsset; gallery?: ImageAsset[]; story?: string; credits?: string[] }

export type AboutData = {
  hero: { title?: string; subtitle?: string; image?: ImageAsset }
  intro: { title?: string; content?: any; philosophyTitle?: string; philosophyContent?: string; philosophyQuote?: string }
  features: { title?: string; description?: string; image?: ImageAsset }[]
  stats: { label: string; value: string }[]
  founder: { portrait?: ImageAsset; bio?: string }
}

export type ServicesPageData = {
  hero: { title?: string; subtitle?: string; image?: ImageAsset }
  categories: { title: string; description: string; image: ImageAsset; items?: string[] }[]
  process: { step: string; title: string; description: string }[]
}

export type Service = { id: string; title: string; description?: string; price?: string }
export type Testimonial = { id: string; author?: string; quote: string; image?: string }

export default function App() {
  const [home, setHome] = useState<Home | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [about, setAbout] = useState<AboutData | null>(null)
  const [servicesPage, setServicesPage] = useState<ServicesPageData | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    console.log('App: Fetching data...');
    let initialFetchCompleted = false
    
    const timer = setTimeout(() => {
      if (mounted && !initialFetchCompleted) {
        console.warn('Data loading timed out - forcing render');
        setLoading(false);
      }
    }, 5000);

    let requestId = 0

    const fetchAll = async (opts?: { showLoader?: boolean }) => {
      const current = ++requestId
      const showLoader = opts?.showLoader !== false
      if (showLoader && mounted) setLoading(true)
      try {
        const [h, pr, p, a, sp, s, t] = await Promise.all([
          getHome(),
          getProjects(),
          getPhotos(),
          getAbout(),
          getServicesPage(),
          getServices(),
          getTestimonials(),
        ])
        if (!mounted || current !== requestId) return
        console.log('App: Data fetched successfully', { h, pr, p, a })
        setHome(h)
        setProjects(pr)
        setPhotos(p)
        setAbout(a)
        setServicesPage(sp)
        setServices(s)
        setTestimonials(t)
      } catch (err) {
        console.error('App: Data fetch failed', err)
      } finally {
        if (opts?.showLoader !== false) initialFetchCompleted = true
        if (mounted && showLoader) setLoading(false)
      }
    }

    fetchAll({ showLoader: true })
    
    const onContentUpdated = (event: any) => {
      const slug = event?.detail?.slug
      console.log('App: content-updated', slug)
      fetchAll({ showLoader: false })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('content-updated', onContentUpdated as any)
    }
    return () => {
      mounted = false
      clearTimeout(timer)
      if (typeof window !== 'undefined') {
        window.removeEventListener('content-updated', onContentUpdated as any)
      }
    }
  }, [])

  const onSubmitContact = async (data: { name: string; email: string; message?: string }) => {
    await submitContact({ name: data.name, email: data.email, message: data.message || '' })
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
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="pages/home" element={<HomePageEditor />} />
          <Route path="pages/about" element={<AboutPageEditor />} />
          <Route path="pages/services" element={<ServicesPageEditor />} />
        </Route>

        <Route path="/*" element={
          <div className="page-shell">
            <Navigation />
            <Layout>
              <Route index element={<HomePage home={home} photos={photos} />} />
              <Route path="work" element={<WorkPage projects={projects} />} />
              <Route path="/gallery" element={<GalleryPage photos={photos} />} />
              <Route path="work/:id" element={<ProjectPage projects={projects} />} />
              <Route path="/about" element={<AboutPage about={about} testimonials={testimonials} />} />
              <Route path="/services" element={<ServicesPage page={servicesPage} services={services} />} />
              <Route path="/contact" element={<ContactPage onSubmit={onSubmitContact} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Layout>
            <Footer />
            <SocialWidgets />
          </div>
        } />
      </Routes>
    </AuthProvider>
  )
}
