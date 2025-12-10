import path from 'path'
import { fileURLToPath } from 'url'
import { mongooseAdapter as mongoAdapter } from '@payloadcms/db-mongodb'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  serverURL: process.env.PAYLOAD_PUBLIC_URL || 'http://localhost:3000',
  admin: { user: 'users' },
  csrf: [],
  cors: ['http://localhost:5173'],
  db: mongoAdapter({ url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adah-creatives' }),
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [{ name: 'name', type: 'text' }],
    },
    {
      slug: 'photos',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      slug: 'projects',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', unique: true, required: true },
        { name: 'category', type: 'text' },
        { name: 'client', type: 'text' },
        { name: 'location', type: 'text' },
        { name: 'shootDate', type: 'date' },
        { name: 'heroImage', type: 'upload', relationTo: 'media' },
        { name: 'gallery', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
        { name: 'story', type: 'textarea' },
        { name: 'credits', type: 'array', fields: [{ name: 'line', type: 'text' }] },
      ],
    },
    {
      slug: 'services',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', unique: true },
        { name: 'description', type: 'textarea' },
        { name: 'price', type: 'text' },
      ],
    },
    {
      slug: 'testimonials',
      fields: [
        { name: 'author', type: 'text' },
        { name: 'quote', type: 'textarea' },
        { name: 'projectRef', type: 'relationship', relationTo: 'projects' },
      ],
    },
    {
      slug: 'posts',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', unique: true, required: true },
        { name: 'cover', type: 'upload', relationTo: 'media' },
        { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
        { name: 'content', type: 'textarea' },
      ],
    },
    {
      slug: 'press',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media' },
        { name: 'link', type: 'text' },
      ],
    },
    {
      slug: 'prints',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'series', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'sizes', type: 'array', fields: [{ name: 'size', type: 'text' }] },
        { name: 'paperType', type: 'text' },
        { name: 'price', type: 'text' },
      ],
    },
    {
      slug: 'licensing-requests',
      access: { create: () => true },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'usage', type: 'textarea' },
        { name: 'territory', type: 'text' },
        { name: 'duration', type: 'text' },
      ],
    },
    {
      slug: 'media',
      upload: { staticURL: '/media', staticDir: path.resolve(__dirname, 'media') },
      fields: [],
    },
  ],
  globals: [
    {
      slug: 'home',
      fields: [
        { name: 'heroHeadline', type: 'text' },
        { name: 'heroCTA', type: 'text' },
        { name: 'tagline', type: 'text' },
        { name: 'subhead', type: 'textarea' },
        { name: 'heroImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      slug: 'about',
      fields: [
        { name: 'portrait', type: 'upload', relationTo: 'media' },
        { name: 'bio', type: 'textarea' },
      ],
    },
  ],
}
