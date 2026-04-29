# Adah Creatives - Portfolio Website

A modern, full-stack portfolio website built with React, TypeScript, Express.js, and PostgreSQL. Features a complete CMS for managing projects, services, gallery, and contact forms.

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Express.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Email**: Nodemailer with SMTP
- **SEO**: React Helmet Async, dynamic meta tags, sitemap.xml

## 📋 Prerequisites

- Node.js 18+ (20+ recommended)
- PostgreSQL database
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Ezekiel98Tz/adahcreatives.git
cd adahcreatives
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database Connection (Required)
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT Secret (Required - generate a secure random string)
JWT_SECRET="your-super-secure-jwt-secret-key-here"

# Optional: Email Configuration (for contact form)
SMTP_HOST="your-smtp-host"
SMTP_PORT=587
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-email-password"
SMTP_SECURE="false"
CONTACT_TO="recipient@email.com"
CONTACT_FROM="sender@email.com"

# Server Port (Optional)
PORT=3000
NODE_ENV=production
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy
```

### 5. Build the Application
```bash
# Build frontend assets
npm run build

# Generate sitemap for SEO
npm run sitemap
```

### 6. Start the Application

**Development Mode:**
```bash
# Start both frontend and backend with hot reload
npm run dev
```

**Production Mode:**
```bash
# Build first, then start production server
npm run build
npm run server
```

## 📁 Project Structure

```
adah-creatives/
├── src/                    # Frontend React application
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── context/           # React context providers
│   └── App.tsx            # Main App component
├── server/                 # Backend Express API
│   └── index.ts           # Main server file
├── prisma/                 # Database schema and migrations
│   └── schema.prisma      # Prisma schema definition
├── public/                 # Static assets
├── scripts/                # Utility scripts
│   └── generate-sitemap.cjs # SEO sitemap generator
└── uploads/                # File uploads directory (created at runtime)
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - Admin users for CMS access
- `projects` - Portfolio projects with categories
- `services` - Services offered
- `photos` - Gallery images with categories
- `pages` - Dynamic page content

## 🌐 API Endpoints

### Public API
- `GET /api/projects` - List all projects
- `GET /api/projects/:slug` - Get specific project
- `GET /api/services` - List all services
- `GET /api/gallery` - List gallery photos (optional category filter)
- `GET /api/pages/:slug` - Get page content
- `POST /api/contact` - Submit contact form

### Admin API (Requires Authentication)
- `POST /api/login` - Admin login
- `GET /api/me` - Get current user
- CRUD operations for projects, services, gallery, pages
- `POST /api/uploads` - Image upload endpoint

## 🔐 Authentication

Admin authentication uses JWT tokens:

1. Login at `POST /api/login` with email/password
2. Receive JWT token in response
3. Include token in Authorization header: `Bearer <token>`
4. Token expires after 24 hours

## 📧 Contact Form

The contact form requires SMTP configuration in environment variables. It supports:
- HTML and plain text emails
- Customizable recipients
- Reply-to functionality
- Email validation and sanitization

## 📊 SEO Features

- Dynamic meta tags per page
- Open Graph and Twitter Card support
- Automatically generated sitemap.xml
- robots.txt for search engine guidance
- React Helmet Async for meta tag management

## 🚀 Deployment

### For Hosting Providers:

1. **Clone the repository** to your server
2. **Install dependencies**: `npm install`
3. **Set environment variables** (see above)
4. **Run database migrations**: `npx prisma migrate deploy`
5. **Build frontend**: `npm run build`
6. **Start production server**:
   ```bash
   NODE_ENV=production PORT=3000 node --loader ts-node/esm server/index.ts
   ```

### Alternative: Pre-built JavaScript
If your environment doesn't support TypeScript execution, build the server first:

```bash
# Build server code to JavaScript
npm run build:server

# Then run the built JavaScript
NODE_ENV=production PORT=3000 node dist-server/index.js
```

## 🐛 Troubleshooting

### Common Issues:

1. **Database connection errors**:
   - Verify `DATABASE_URL` format
   - Check PostgreSQL is running
   - Ensure database/user exists

2. **Build errors**:
   - Ensure Node.js version is 18+
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

3. **File upload issues**:
   - Ensure uploads directory is writable
   - Check file size limits

4. **Email not sending**:
   - Verify SMTP configuration
   - Check firewall settings for outgoing mail

## 📞 Support

For deployment assistance or questions, please contact:
- GitHub: [Ezekiel98Tz](https://github.com/Ezekiel98Tz)
- Repository: https://github.com/Ezekiel98Tz/adahcreatives

## 📄 License

This project is proprietary software. All rights reserved.

---

**Note for Hosting Providers**: This application requires Node.js 18+ and PostgreSQL. Please ensure these are available in your environment before deployment.