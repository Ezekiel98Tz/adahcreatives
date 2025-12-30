const VITE_API_URL = String(import.meta.env.VITE_API_URL || '').trim();
const VITE_PAYLOAD_URL = String(import.meta.env.VITE_PAYLOAD_URL || '').trim();
const API_URL_FALLBACK =
  VITE_API_URL ||
  (VITE_PAYLOAD_URL ? `${VITE_PAYLOAD_URL.replace(/\/$/, '')}/api` : '') ||
  'http://localhost:3000/api';

function getApiUrl() {
  const raw = API_URL_FALLBACK;
  try {
    const parsed = new URL(raw);
    const isLoopback = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    const windowHost = typeof window !== 'undefined' ? window.location.hostname : '';
    const useWindowHost =
      isLoopback &&
      windowHost &&
      windowHost !== 'localhost' &&
      windowHost !== '127.0.0.1';
    if (!useWindowHost) return raw;
    parsed.hostname = windowHost;
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return raw;
  }
}

function getApiOrigin() {
  try {
    const parsed = new URL(getApiUrl());
    const isLoopback = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    const windowHost = typeof window !== 'undefined' ? window.location.hostname : '';
    const useWindowHost =
      isLoopback &&
      windowHost &&
      windowHost !== 'localhost' &&
      windowHost !== '127.0.0.1';
    const host = useWindowHost ? windowHost : parsed.hostname;
    const portPart = parsed.port ? `:${parsed.port}` : '';
    return `${parsed.protocol}//${host}${portPart}`;
  } catch {
    return '';
  }
}

function normalizeMediaUrl(value: any) {
  const raw = typeof value === 'string' ? value : value == null ? '' : String(value);
  const url = raw.trim();
  if (!url) return '';
  if (/^data:/i.test(url)) return url;

  const origin = getApiOrigin();
  if (!origin) return url;

  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url);
      const isLoopback = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
      const preferred = new URL(origin);
      const shouldRewrite =
        isLoopback &&
        (preferred.hostname !== 'localhost' && preferred.hostname !== '127.0.0.1') &&
        preferred.port === parsed.port &&
        preferred.protocol === parsed.protocol;
      if (!shouldRewrite) return url;
      return `${origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return url;
    }
  }

  if (url.startsWith('/uploads/')) return `${origin}${url}`;
  if (url.startsWith('uploads/')) return `${origin}/${url}`;
  if (url.startsWith('/')) return `${origin}${url}`;
  return `${origin}/uploads/${url}`;
}

async function fetchJson(url: string, init?: RequestInit) {
  const response = await fetch(url, { cache: 'no-store', ...(init || {}) });
  return { response, json: await response.json().catch(() => ({})) };
}

function notifyContentUpdated(slug: string) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('content-updated', { detail: { slug } }));
  } catch {}
}

async function readErrorMessage(response: Response) {
  const text = await response.text().catch(() => '');
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && 'error' in parsed) {
      const base = String((parsed as any).error || '');
      const missing = (parsed as any).missing;
      const missingList = Array.isArray(missing) ? missing.map((m) => String(m || '').trim()).filter(Boolean) : [];
      if (missingList.length === 0) return base;
      return `${base} (missing: ${missingList.join(', ')})`;
    }
  } catch {}
  return text || `Request failed (${response.status})`;
}

// --- MOCK DATA ---
const MOCK_HOME = {
  hero: {
    headline: 'Every Vision Deserves a Beautiful Story.',
    cta: 'Explore Our Work',
    tagline: 'From concept to delivery, we craft photography and film experiences that are immersive, emotive, and timeless.',
    subhead: 'We are a purpose-driven, luxury creative studio that blends artistic vision, technical excellence, and powerful storytelling.',
    image: { url: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=2560&auto=format&fit=crop' }
  },
  servicesTeaser: {
    titleLine1: 'We Craft',
    titleLine2: 'Timeless Media.',
    description: 'From high-end photography to cinematic video production, we help brands and individuals tell stories that resonate and endure.',
    cards: [
      { title: 'Photography', image: { url: 'https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&q=80&w=800' } },
      { title: 'Cinematography', image: { url: 'https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?auto=format&fit=crop&q=80&w=800' } },
      { title: 'Creative Strategy', image: { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800' } },
    ],
  },
  visualStories: {
    title: 'Crafting a Legacy of Light.',
    description: 'We don\'t just take photos; we build narratives. Our approach combines technical precision with artistic intuition.',
    cta: 'Read Our Philosophy',
    image: { url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000' },
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
  {
    id: '1',
    author: 'Haingo Rakotomalala - ADVOCACY OFFICER (AAN)',
    quote: 'We have been consistently impressed with the exceptional services provided by Adah creatives. Their professionalism have made them a valuable partner for the AAN Organization. The team always goes above and beyond to deliver outstanding results, and their expertise has greatly contributed to our success. We highly recommend Adah creatives for their top-notch services.',
    image: '/images/client-stories/Haingo-Rakotomalala.jpg',
  },
  {
    id: '2',
    author: 'Mr Felix - HR (AGAKHAN UNIVERSITY TANZANIA)',
    quote: "Our experience with Adah creatives has been nothing short of excellent. They have consistently delivered outstanding results for us. The team's creativity, attention to detail, and commitment to customer satisfaction are truly commendable.",
    image: '/images/client-stories/Mr-Felix.jpg',
  },
  {
    id: '3',
    author: 'Ikponwosa Ero - Executive officer (AAN)',
    quote: 'Outstanding service, highly recommend!',
    image: '/images/client-stories/Ikponwosa-Ero.jpg',
  },
  {
    id: '4',
    author: 'Happiness Daudi - COMMUNICATION SPECIALIST',
    quote: 'Working with Adah Creatives is a breath of fresh air. They bring innovative ideas to the table while maintaining a strong sense of reliability and commitment. Their ability to adapt and exceed our creative needs is truly impressive. Chears!!!',
    image: '/images/client-stories/Happiness-Daudi.jpg',
  },
  {
    id: '5',
    author: 'Lulu Lwavu - EXECUTIVE ASSISTANT TO CEO (CITI BANK)',
    quote: 'Working with you was an absolute pleasure! Your attention to detail and creative approach to our project was remarkable, Job well done.',
    image: '/images/client-stories/Lulu-Lwavu.jpg',
  },
  {
    id: '6',
    author: 'Ian Metili - ENTERPRENEUR / DIGITAL MARKET EXPERT',
    quote: 'Mhh! You guys are good, you are the best!',
    image: '/images/client-stories/Ian Metili.jpg',
  },
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
    const { response, json } = await fetchJson(`${getApiUrl()}/pages/home`);
    if (!response.ok) throw new Error('Failed');
    return (json as any).data;
  } catch (err) {
    if (import.meta.env.DEV) return MOCK_HOME;
    throw err;
  }
}

export async function getAbout() {
  try {
    const { response, json } = await fetchJson(`${getApiUrl()}/pages/about`);
    if (!response.ok) throw new Error('Failed');
    return (json as any).data;
  } catch (err) {
    if (import.meta.env.DEV) return MOCK_ABOUT;
    throw err;
  }
}

export async function updatePageData(slug: string, data: any) {
  try {
    const response = await fetch(`${getApiUrl()}/pages/${slug}`, {
      method: 'PUT',
      headers: getHeaders(),
      cache: 'no-store',
      body: JSON.stringify({ data })
    });
    if (!response.ok) throw new Error('Failed to update page');
    const result = await response.json();
    notifyContentUpdated(slug);
    return result;
  } catch (error) {

    throw error;
  }
}

export async function createProject(project: any) {
  const response = await fetch(`${getApiUrl()}/projects`, {
    method: 'POST',
    headers: getHeaders(),
    cache: 'no-store',
    body: JSON.stringify(project)
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const created = await response.json();
  notifyContentUpdated('projects');
  return created;
}

export async function updateProject(id: number, project: any) {
  const response = await fetch(`${getApiUrl()}/projects/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    cache: 'no-store',
    body: JSON.stringify(project)
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const updated = await response.json();
  notifyContentUpdated('projects');
  return updated;
}

export async function deleteProject(id: number) {
  const response = await fetch(`${getApiUrl()}/projects/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const result = await response.json().catch(() => ({}));
  notifyContentUpdated('projects');
  return result;
}

export async function getPhotos() {
  // Try to fetch from backend, fallback to mock
  try {
    const res = await fetch(`${getApiUrl()}/gallery`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    if (data.length === 0) return MOCK_PHOTOS;
    return data.map((p: any) => ({
      id: String(p.id),
      title: p.caption, // Mapping caption to title for now
      category: p.category,
      image: { url: normalizeMediaUrl(p.url) }
    }));
  } catch (err) {
    if (import.meta.env.DEV) return MOCK_PHOTOS;
    throw err;
  }
}

export async function getGalleryAdmin(opts?: { category?: string }) {
  const url = new URL(`${getApiUrl()}/gallery`);
  if (opts?.category) url.searchParams.set('category', opts.category);
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load gallery');
  const data = await res.json();
  return data as Array<{ id: number; url: string; caption?: string | null; category: string }>;
}

export async function getServicesPage() {
  try {
    const { response, json } = await fetchJson(`${getApiUrl()}/pages/services`);
    if (!response.ok) throw new Error('Failed');
    return (json as any).data;
  } catch (err) {
    if (import.meta.env.DEV) return MOCK_SERVICES_PAGE;
    throw err;
  }
}

export async function getServices() {
  try {
    const res = await fetch(`${getApiUrl()}/services`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    if (data.length === 0) return MOCK_SERVICES;
    return data.map((s: any) => ({
      id: String(s.id),
      title: s.title,
      description: s.description,
      price: 'Contact for price' // Backend doesn't have price yet
    }));
  } catch (err) {
    if (import.meta.env.DEV) return MOCK_SERVICES;
    throw err;
  }
}

export async function getServicesAdmin() {
  const res = await fetch(`${getApiUrl()}/services`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load services');
  const data = await res.json();
  return data as Array<{ id: number; title: string; description: string; icon?: string | null }>;
}

export async function getTestimonials() {
  return MOCK_TESTIMONIALS;
}

export async function getProjects() {
  try {
    const res = await fetch(`${getApiUrl()}/projects`, { cache: 'no-store' });
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
      heroImage: { url: normalizeMediaUrl(p.imageUrl) },
      gallery: [], // Placeholder until we have gallery table
      story: p.description,
      credits: [], // Placeholder
    }));
  } catch (err) {
    if (import.meta.env.DEV) return MOCK_PROJECTS;
    throw err;
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const res = await fetch(`${getApiUrl()}/projects/${slug}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed');
    const p = await res.json();
    return {
      id: String(p.id),
      slug: p.slug,
      title: p.title,
      category: p.category,
      client: 'Adah Client',
      location: 'Tanzania',
      heroImage: { url: normalizeMediaUrl(p.imageUrl) },
      gallery: [],
      story: p.description,
      credits: [],
    };
  } catch (err) {
    if (import.meta.env.DEV) return MOCK_PROJECTS.find(p => p.slug === slug);
    throw err;
  }
}

export async function submitBooking(data: any) {
  console.log('Booking submitted:', data);
  return new Promise(resolve => setTimeout(resolve, 1000));
}

export async function submitContact(data: { name: string; email: string; message: string }) {
  const response = await fetch(`${getApiUrl()}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json().catch(() => ({}));
}

export async function uploadImage(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

  const response = await fetch(`${getApiUrl()}/uploads`, {
    method: 'POST',
    headers: getHeaders(),
    cache: 'no-store',
    body: JSON.stringify({ dataUrl, filename: file.name }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const data = await response.json().catch(() => ({}));
  return { url: normalizeMediaUrl((data as any)?.url) };
}

export async function createService(service: { title: string; description: string; icon?: string | null }) {
  const response = await fetch(`${getApiUrl()}/services`, {
    method: 'POST',
    headers: getHeaders(),
    cache: 'no-store',
    body: JSON.stringify(service),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const created = await response.json();
  notifyContentUpdated('services');
  return created;
}

export async function updateService(id: number, service: { title: string; description: string; icon?: string | null }) {
  const response = await fetch(`${getApiUrl()}/services/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    cache: 'no-store',
    body: JSON.stringify(service),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const updated = await response.json();
  notifyContentUpdated('services');
  return updated;
}

export async function deleteService(id: number) {
  const response = await fetch(`${getApiUrl()}/services/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const result = await response.json().catch(() => ({}));
  notifyContentUpdated('services');
  return result;
}

export async function createGalleryPhoto(photo: { url: string; caption?: string | null; category: string }) {
  const response = await fetch(`${getApiUrl()}/gallery`, {
    method: 'POST',
    headers: getHeaders(),
    cache: 'no-store',
    body: JSON.stringify(photo),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const created = await response.json();
  notifyContentUpdated('gallery');
  return created;
}

export async function updateGalleryPhoto(id: number, photo: { url: string; caption?: string | null; category: string }) {
  const response = await fetch(`${getApiUrl()}/gallery/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    cache: 'no-store',
    body: JSON.stringify(photo),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const updated = await response.json();
  notifyContentUpdated('gallery');
  return updated;
}

export async function deleteGalleryPhoto(id: number) {
  const response = await fetch(`${getApiUrl()}/gallery/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(await readErrorMessage(response));
  const result = await response.json().catch(() => ({}));
  notifyContentUpdated('gallery');
  return result;
}

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function login(credentials: any) {
  const response = await fetch(`${getApiUrl()}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(credentials)
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json();
}
