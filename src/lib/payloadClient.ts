const API_URL = import.meta.env.VITE_PAYLOAD_URL || ''

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API_URL + path, { headers: { 'Accept': 'application/json' }, ...init })
  if (!res.ok) throw new Error('Request failed')
  return res.json() as Promise<T>
}

// Mock Data for Demo
const MOCK_HERO = {
  heroHeadline: 'Every Vision Deserves a Beautiful Story.',
  heroCTA: 'Explore Our Work',
  tagline: 'From concept to delivery, we craft photography and film experiences that are immersive, emotive, and timeless.',
  subhead: 'We are a purpose-driven, luxury creative studio that blends artistic vision, technical excellence, and powerful storytelling. Whether you’re a brand, a non-profit, an event planner, or an individual, we deliver evocative visuals that captivate, inspire, and endure.',
  heroImage: { url: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=2560&auto=format&fit=crop' }
}

const MOCK_PHOTOS = [
  { id: '1', title: 'Ethereal Gaze', category: 'Editorial', image: { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop' } },
  { id: '2', title: 'Vows in Venice', category: 'Wedding', image: { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop' } },
  { id: '3', title: 'Urban Solitude', category: 'Portrait', image: { url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop' } },
  { id: '4', title: 'Modern Lines', category: 'Architecture', image: { url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1000&auto=format&fit=crop' } },
  { id: '5', title: 'Golden Hour', category: 'Lifestyle', image: { url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop' } },
  { id: '6', title: 'Velvet Night', category: 'Fashion', image: { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop' } },
  { id: '7', title: 'Raw Emotion', category: 'Portrait', image: { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop' } },
  { id: '8', title: 'Desert Silence', category: 'Landscape', image: { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop' } },
]

const MOCK_ABOUT = {
  portrait: { url: 'https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=1000&auto=format&fit=crop' },
  bio: `I am a visual storyteller obsessed with the fleeting moments that define our humanity. My work is an exploration of light, shadow, and the raw emotion that exists in the spaces between.

With over a decade of experience behind the lens, I have cultivated a style that blends editorial precision with documentary authenticity. Whether capturing the intimacy of a wedding or the boldness of a fashion campaign, my goal remains the same: to create images that are not just seen, but felt.

Based in New York, but available worldwide.`
}

const MOCK_SERVICES = [
  { id: '1', title: 'The Wedding Collection', description: 'Full day coverage, 2 photographers, fine art prints, and a digital gallery.', price: '$4,500' },
  { id: '2', title: 'Editorial Session', description: 'Creative direction, styling assistance, and high-end retouching for brands and models.', price: '$1,200' },
  { id: '3', title: 'Portrait Studio', description: 'Intimate studio sessions focusing on personality and raw expression.', price: '$650' }
]

const MOCK_TESTIMONIALS = [
  { id: '1', author: 'Advocacy Officer, AAN', quote: 'Their professionalism and creativity make them a valuable partner. Their work contributed significantly to our success.' },
  { id: '2', author: 'HR, Institutional Client', quote: 'Their attention to detail and dedication delivered an excellent result. We highly recommend them.' },
  { id: '3', author: 'Executive Assistant to CEO, Corporate Client', quote: 'Working with this team was a breath of fresh air. They brought innovative ideas and exceeded our expectations.' },
  { id: '4', author: 'Entrepreneur & Digital Marketing Expert', quote: 'They deliver outstanding service — creative, reliable and committed.' }
]

const MOCK_PROJECTS = [
  {
    id: 'proj-ethereal',
    slug: 'ethereal-gaze',
    title: 'Ethereal Gaze',
    category: 'Commercial & Brand Shoots',
    client: 'Independent',
    location: 'New York, USA',
    shootDate: '2024-09-12',
    heroImage: { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1920&auto=format&fit=crop' },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop' }
    ],
    story: 'An exploration of softness and strength. Editorial study of expression.',
    credits: ['Photographer: Adah', 'Styling: M. Lane', 'Hair & Makeup: Team'],
  },
  {
    id: 'proj-vows',
    slug: 'vows-in-venice',
    title: 'Vows in Venice',
    category: 'Events & Official Ceremonies',
    client: 'Sarah & James',
    location: 'Venice, Italy',
    shootDate: '2023-05-22',
    heroImage: { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop' },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop' }
    ],
    story: 'A timeless elopement on Venetian canals captured in golden light.',
    credits: ['Photographer: Adah', 'Planner: L. Rossi'],
  }
]

const MOCK_POSTS = [
  { id: 'post-bts-venice', slug: 'behind-the-scenes-venice', title: 'Behind the Scenes: Venice Elopement', cover: { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop' }, tags: ['BTS', 'Wedding'], content: 'Notes from the canal shoot. Weather, timing, and route planning.' },
  { id: 'post-color-grading', slug: 'color-grading-warm-tones', title: 'Color Grading with Warm Tones', cover: { url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop' }, tags: ['Technique'], content: 'A look at film-inspired grading to achieve timeless warmth.' }
]

const MOCK_PRESS = [
  { id: 'press-vogue', title: 'Vogue Italia', logo: { url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Vogue_logo.svg' }, link: 'https://www.vogue.it/' },
  { id: 'press-nyt', title: 'NYT Magazine', logo: { url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/The_New_York_Times_logo.png' }, link: 'https://www.nytimes.com/' }
]

const MOCK_PRINTS = [
  { id: 'print-velvet', title: 'Velvet Night', image: { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop' }, series: 'Nocturne', sizes: ['A3', 'A2'], paperType: 'Hahnemühle Photo Rag', price: '$180' },
  { id: 'print-desert', title: 'Desert Silence', image: { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop' }, series: 'Solitudes', sizes: ['A3', 'A2'], paperType: 'Hahnemühle Photo Rag', price: '$220' }
]

export async function getHome() {
  if (!API_URL) {
    return MOCK_HERO
  }
  try {
    const d = await fetchJSON<any>('/api/globals/home')
    return d
  } catch {
    return MOCK_HERO
  }
}

export async function getPhotos() {
  if (!API_URL) {
    return MOCK_PHOTOS
  }
  try {
    const d = await fetchJSON<any>('/api/photos')
    const docs = d.docs || []
    return docs.map((p: any) => ({ id: p.id || p._id, title: p.title, category: p.category, image: p.image }))
  } catch {
    return MOCK_PHOTOS
  }
}

export async function getAbout() {
  if (!API_URL) {
    return MOCK_ABOUT
  }
  try {
    const d = await fetchJSON<any>('/api/globals/about')
    return d
  } catch {
    return MOCK_ABOUT
  }
}

export async function getServices() {
  if (!API_URL) {
    return MOCK_SERVICES
  }
  try {
    const d = await fetchJSON<any>('/api/services')
    const docs = d.docs || []
    return docs.map((s: any) => ({ id: s.id || s._id, title: s.title, description: s.description, price: s.price }))
  } catch {
    return MOCK_SERVICES
  }
}

export async function getTestimonials() {
  if (!API_URL) {
    return MOCK_TESTIMONIALS
  }
  try {
    const d = await fetchJSON<any>('/api/testimonials')
    const docs = d.docs || []
    return docs.map((t: any) => ({ id: t.id || t._id, author: t.author, quote: t.quote }))
  } catch {
    return MOCK_TESTIMONIALS
  }
}

export async function submitBooking(data: { name: string; email: string; message?: string }) {
  if (!API_URL) return
  try {
    await fetchJSON('/api/contact-submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  } catch {}
}

export async function getProjects() {
  if (!API_URL) return MOCK_PROJECTS
  try {
    const d = await fetchJSON<any>('/api/projects')
    return (d.docs || [])
  } catch {
    return MOCK_PROJECTS
  }
}

export async function getProjectBySlug(slug: string) {
  if (!API_URL) return MOCK_PROJECTS.find(p => p.slug === slug)
  try {
    const d = await fetchJSON<any>(`/api/projects?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`)
    return (d.docs || [])[0]
  } catch {
    return MOCK_PROJECTS.find(p => p.slug === slug)
  }
}

export async function getPosts() {
  if (!API_URL) return MOCK_POSTS
  try {
    const d = await fetchJSON<any>('/api/posts')
    return (d.docs || [])
  } catch {
    return MOCK_POSTS
  }
}

export async function getPostBySlug(slug: string) {
  if (!API_URL) return MOCK_POSTS.find(p => p.slug === slug)
  try {
    const d = await fetchJSON<any>(`/api/posts?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`)
    return (d.docs || [])[0]
  } catch {
    return MOCK_POSTS.find(p => p.slug === slug)
  }
}

export async function getPress() {
  if (!API_URL) return MOCK_PRESS
  try {
    const d = await fetchJSON<any>('/api/press')
    return (d.docs || [])
  } catch {
    return MOCK_PRESS
  }
}

export async function getPrints() {
  if (!API_URL) return MOCK_PRINTS
  try {
    const d = await fetchJSON<any>('/api/prints')
    return (d.docs || [])
  } catch {
    return MOCK_PRINTS
  }
}

export async function submitLicensingRequest(data: { name: string; email: string; usage: string; territory?: string; duration?: string }) {
  if (!API_URL) return
  try {
    await fetchJSON('/api/licensing-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  } catch {}
}

