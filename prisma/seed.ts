import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient()

const PROJECTS = [
  {
    title: 'Ethereal Gaze',
    slug: 'ethereal-gaze',
    category: 'Commercial & Brand Shoots',
    description: 'An exploration of softness and strength. Editorial study of expression.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1920&auto=format&fit=crop'
  },
  {
    title: 'Vows in Venice',
    slug: 'vows-in-venice',
    category: 'Events & Official Ceremonies',
    description: 'A timeless elopement on Venetian canals captured in golden light.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop'
  }
]

const SERVICES = [
  {
    title: 'Photography',
    description: 'From corporate events to intimate portraits, we capture moments with clarity and emotion.',
    icon: 'camera'
  },
  {
    title: 'Videography',
    description: 'We produce cinematic documentaries, corporate videos, and promotional films.',
    icon: 'video'
  }
]

const HOME_PAGE_DATA = {
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

const ABOUT_PAGE_DATA = {
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

async function main() {
  console.log('Start seeding ...')

  // Create Admin User
  const password = await bcrypt.hash('password', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@adah.com' },
    update: {},
    create: {
      email: 'admin@adah.com',
      name: 'Admin',
      password,
    },
  });
  console.log({ user });

  // Projects
  for (const p of PROJECTS) {
    const project = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
    console.log(`Created project with id: ${project.id}`)
  }
  
  // Pages
  await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: { slug: 'home', data: JSON.stringify(HOME_PAGE_DATA) }
  });
  
  await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: { slug: 'about', data: JSON.stringify(ABOUT_PAGE_DATA) }
  });

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
