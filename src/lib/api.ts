const API_URL = 'http://localhost:3000/api';

// --- MOCK DATA ---
const MOCK_HOME = {
  hero: {
    headline: 'Every Vision Deserves a Beautiful Story.',
    cta: 'Explore Our Work',
    tagline: 'From concept to delivery, we craft photography and film experiences that are immersive, emotive, and timeless.',
    subhead: 'We are a purpose-driven, luxury creative studio that blends artistic vision, technical excellence, and powerful storytelling.',
    image: { url: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=2560&auto=format&fit=crop' }
  },
  visualStories: {
    title: 'Crafting a Legacy of Light.',
    description: 'We don\'t just take photos; we build narratives. Our approach combines technical precision with artistic intuition.',
    cta: 'Read Our Philosophy',
    carousel: []
  },
  trustedBy: [
    { name: 'UNICEF' }, { name: 'USAID' }, { name: 'Vodacom' }, { name: 'CRDB' }
  ]
};

const MOCK_PHOTOS = [
  { id: '1', title: 'Ethereal Gaze', category: 'Editorial', image: { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop' } },
  { id: '2', title: 'Vows in Venice', category: 'Wedding', image: { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop' } },
  { id: '3', title: 'Urban Solitude', category: 'Portrait', image: { url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop' } },
  { id: '4', title: 'Modern Lines', category: 'Architecture', image: { url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1000&auto=format&fit=crop' } },
  { id: '5', title: 'Golden Hour', category: 'Lifestyle', image: { url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop' } },
  { id: '6', title: 'Velvet Night', category: 'Fashion', image: { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop' } },
  { id: '7', title: 'Raw Emotion', category: 'Portrait', image: { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop' } },
  { id: '8', title: 'Desert Silence', category: 'Landscape', image: { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop' } },
];

const MOCK_ABOUT = {
  hero: {
    title: 'About Us',
    subtitle: 'We are a purpose-driven creative studio blending artistic vision with technical excellence.',
    image: { url: 'https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=1000&auto=format&fit=crop' }
  },
  intro: {
    title: 'Who We Are',
    content: 'We are a full-service creative media house with deep expertise in photography, videography, aerial drone footage, web design, and animation.',
    philosophyTitle: 'Our Philosophy',
    philosophyContent: '"Every project begins with your vision. We immerse ourselves in your story, your brand, or your event — then meticulously craft visuals that reflect your identity."',
    philosophyQuote: '— The Adah Team'
  },
  features: [
    { title: 'Creative Excellence', description: 'Our team unites seasoned professionals with refined artistic sensibilities.', image: { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000' } },
    { title: 'Comprehensive Production', description: 'From pre-production to final edit, we handle it all.', image: { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000' } },
    { title: 'Cutting-Edge Technology', description: 'We utilize top-tier gear and advanced techniques.', image: { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000' } }
  ],
  stats: [
    { label: 'Clients', value: '60+' },
    { label: 'Projects', value: '150+' },
    { label: 'Deliverables', value: '300+' },
    { label: 'Regions', value: 'Tanzania' }
  ],
  founder: {
    portrait: { url: 'https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=1000&auto=format&fit=crop' },
    bio: 'I am a visual storyteller obsessed with the fleeting moments that define our humanity.'
  }
};

const MOCK_SERVICES = [
  { id: '1', title: 'The Wedding Collection', description: 'Full day coverage, 2 photographers, fine art prints, and a digital gallery.', price: '$4,500' },
  { id: '2', title: 'Editorial Session', description: 'Creative direction, styling assistance, and high-end retouching for brands and models.', price: '$1,200' },
  { id: '3', title: 'Portrait Studio', description: 'Intimate studio sessions focusing on personality and raw expression.', price: '$650' }
];

const MOCK_SERVICES_PAGE = {
  hero: {
    title: 'Our Expertise',
    subtitle: 'Tailored creative services for brands, non-profits, and individuals.',
    image: { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600' }
  },
  categories: [
    { 
      title: 'Photography', 
      description: 'From corporate events to intimate portraits, we capture moments with clarity and emotion. Our photography services include headshots, commercial product shoots, travel, and lifestyle imaging.',
      image: { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200' },
      items: ['Corporate Events', 'Portraits & Headshots', 'Commercial Product', 'Lifestyle']
    },
    { 
      title: 'Videography', 
      description: 'We produce cinematic documentaries, corporate videos, promotional films, and event coverage. We tell brand stories that move audiences.',
      image: { url: 'https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?auto=format&fit=crop&q=80&w=1000' },
      items: ['Documentaries', 'Corporate Video', 'Event Coverage', 'Brand Stories']
    },
    { 
      title: 'Aerial / Drone', 
      description: 'Breathtaking aerial perspectives for real estate, tourism, and large-scale events. We use top-tier drone technology to elevate your visual storytelling.',
      image: { url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=1000' },
      items: ['Real Estate', 'Tourism', 'Large Events', 'Site Surveys']
    },
    { 
      title: 'Graphic Design & Animation', 
      description: 'Striking visuals and motion graphics that amplify your message. From full branding suites to animated explainers, we bring static concepts to life.',
      image: { url: 'https://images.unsplash.com/photo-1626785774573-4b7993143d2d?auto=format&fit=crop&q=80&w=1000' },
      items: ['Visual Branding', 'Motion Graphics', 'Social Media Assets', 'Print Design']
    },
    { 
      title: 'Web Design & Development', 
      description: 'Elegant, responsive, and fully functional websites crafted to showcase your brand. We focus on user experience and seamless digital journeys.',
      image: { url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=1000' },
      items: ['Responsive Websites', 'UI/UX Design', 'CMS Integration', 'E-commerce']
    }
  ],
  process: [
    { step: '01', title: 'Discovery', description: 'We begin by understanding your vision, goals, audience, and core message.' },
    { step: '02', title: 'Planning', description: 'Storyboarding, mood-boards, logistics, and scheduling to ensure smooth execution.' },
    { step: '03', title: 'Production', description: 'On-site filming, photography, or design work using high-end equipment.' },
    { step: '04', title: 'Post-Production', description: 'Editing, color grading, sound design, and polishing the final output.' },
    { step: '05', title: 'Delivery', description: 'High-resolution files delivered in your preferred formats, ready for the world.' },
    { step: '06', title: 'Refinement', description: 'We value your feedback and refine the work until it meets your exact standards.' }
  ]
};

const MOCK_TESTIMONIALS = [
  { id: '1', author: 'Advocacy Officer, AAN', quote: 'Their professionalism and creativity make them a valuable partner. Their work contributed significantly to our success.' },
  { id: '2', author: 'HR, Institutional Client', quote: 'Their attention to detail and dedication delivered an excellent result. We highly recommend them.' },
  { id: '3', author: 'Executive Assistant to CEO, Corporate Client', quote: 'Working with this team was a breath of fresh air. They brought innovative ideas and exceeded our expectations.' },
  { id: '4', author: 'Entrepreneur & Digital Marketing Expert', quote: 'They deliver outstanding service — creative, reliable and committed.' }
];

const MOCK_PROJECTS = [
  {
    id: 'proj-ethereal',
    slug: 'ethereal-gaze',
    title: 'Ethereal Gaze',
    category: 'Commercial & Brand Shoots',
    client: 'Independent',
    location: 'New York, USA',
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
    heroImage: { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop' },
    gallery: [
      { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop' }
    ],
    story: 'A timeless elopement on Venetian canals captured in golden light.',
    credits: ['Photographer: Adah', 'Planner: L. Rossi'],
  }
];

// --- API FUNCTIONS ---

export async function getHome() {
  try {
    const res = await fetch(`${API_URL}/pages/home`);
    if (!res.ok) throw new Error('Failed');
    const page = await res.json();
    return page.data;
  } catch {
    return MOCK_HOME;
  }
}

export async function getAbout() {
  try {
    const res = await fetch(`${API_URL}/pages/about`);
    if (!res.ok) throw new Error('Failed');
    const page = await res.json();
    return page.data;
  } catch {
    return MOCK_ABOUT;
  }
}

export async function updatePageData(slug: string, data: any) {
  try {
    const response = await fetch(`${API_URL}/pages/${slug}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ data })
    });
    if (!response.ok) throw new Error('Failed to update page');
    return await response.json();
  } catch (error) {
    console.error(`Error updating page ${slug}:`, error);
    throw error;
  }
}

export async function createProject(project: any) {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(project)
  });
  if (!response.ok) throw new Error('Failed to create project');
  return response.json();
}

export async function updateProject(id: number, project: any) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(project)
  });
  if (!response.ok) throw new Error('Failed to update project');
  return response.json();
}

export async function deleteProject(id: number) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Failed to delete project');
  return response.json();
}

export async function getPhotos() {
  // Try to fetch from backend, fallback to mock
  try {
    const res = await fetch(`${API_URL}/gallery`);
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    if (data.length === 0) return MOCK_PHOTOS;
    return data.map((p: any) => ({
      id: String(p.id),
      title: p.caption, // Mapping caption to title for now
      category: p.category,
      image: { url: p.url }
    }));
  } catch {
    return MOCK_PHOTOS;
  }
}

export async function getGalleryAdmin(opts?: { category?: string }) {
  const url = new URL(`${API_URL}/gallery`);
  if (opts?.category) url.searchParams.set('category', opts.category);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to load gallery');
  const data = await res.json();
  return data as Array<{ id: number; url: string; caption?: string | null; category: string }>;
}

export async function getServicesPage() {
  try {
    const res = await fetch(`${API_URL}/pages/services`);
    if (!res.ok) throw new Error('Failed');
    const page = await res.json();
    return page.data;
  } catch {
    return MOCK_SERVICES_PAGE;
  }
}

export async function getServices() {
  try {
    const res = await fetch(`${API_URL}/services`);
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    if (data.length === 0) return MOCK_SERVICES;
    return data.map((s: any) => ({
      id: String(s.id),
      title: s.title,
      description: s.description,
      price: 'Contact for price' // Backend doesn't have price yet
    }));
  } catch {
    return MOCK_SERVICES;
  }
}

export async function getServicesAdmin() {
  const res = await fetch(`${API_URL}/services`);
  if (!res.ok) throw new Error('Failed to load services');
  const data = await res.json();
  return data as Array<{ id: number; title: string; description: string; icon?: string | null }>;
}

export async function getTestimonials() {
  return MOCK_TESTIMONIALS;
}

export async function getProjects() {
  try {
    const res = await fetch(`${API_URL}/projects`);
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    if (data.length === 0) return MOCK_PROJECTS;
    return data.map((p: any) => ({
      id: String(p.id),
      slug: p.slug,
      title: p.title,
      category: p.category,
      client: 'Adah Client', // Placeholder
      location: 'Tanzania', // Placeholder
      heroImage: { url: p.imageUrl },
      gallery: [], // Placeholder until we have gallery table
      story: p.description,
      credits: [], // Placeholder
    }));
  } catch {
    return MOCK_PROJECTS;
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/projects/${slug}`);
    if (!res.ok) throw new Error('Failed');
    const p = await res.json();
    return {
      id: String(p.id),
      slug: p.slug,
      title: p.title,
      category: p.category,
      client: 'Adah Client',
      location: 'Tanzania',
      heroImage: { url: p.imageUrl },
      gallery: [],
      story: p.description,
      credits: [],
    };
  } catch {
    return MOCK_PROJECTS.find(p => p.slug === slug);
  }
}

export async function submitBooking(data: any) {
  console.log('Booking submitted:', data);
  return new Promise(resolve => setTimeout(resolve, 1000));
}

export async function uploadImage(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

  const response = await fetch(`${API_URL}/uploads`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ dataUrl, filename: file.name }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to upload image');
  }

  return response.json() as Promise<{ url: string }>;
}

export async function createService(service: { title: string; description: string; icon?: string | null }) {
  const response = await fetch(`${API_URL}/services`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(service),
  });
  if (!response.ok) throw new Error('Failed to create service');
  return response.json();
}

export async function updateService(id: number, service: { title: string; description: string; icon?: string | null }) {
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(service),
  });
  if (!response.ok) throw new Error('Failed to update service');
  return response.json();
}

export async function deleteService(id: number) {
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete service');
  return response.json();
}

export async function createGalleryPhoto(photo: { url: string; caption?: string | null; category: string }) {
  const response = await fetch(`${API_URL}/gallery`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(photo),
  });
  if (!response.ok) throw new Error('Failed to create photo');
  return response.json();
}

export async function updateGalleryPhoto(id: number, photo: { url: string; caption?: string | null; category: string }) {
  const response = await fetch(`${API_URL}/gallery/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(photo),
  });
  if (!response.ok) throw new Error('Failed to update photo');
  return response.json();
}

export async function deleteGalleryPhoto(id: number) {
  const response = await fetch(`${API_URL}/gallery/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete photo');
  return response.json();
}

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function login(credentials: any) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  return response.json();
}
