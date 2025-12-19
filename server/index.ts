import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-me';

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use('/uploads', express.static(path.resolve('uploads')));

// --- Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Auth API ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) return res.status(400).json({ error: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

app.get('/api/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

// --- Public API ---
app.get('/api/projects', async (req, res) => {
  const projects = await prisma.project.findMany();
  res.json(projects);
});

app.get('/api/projects/:slug', async (req, res) => {
  const { slug } = req.params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

app.get('/api/services', async (req, res) => {
  const services = await prisma.service.findMany();
  res.json(services);
});

app.get('/api/gallery', async (req, res) => {
  const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
  const photos = await prisma.photo.findMany({
    where: category ? { category } : undefined,
    orderBy: { id: 'desc' },
  });
  res.json(photos);
});

app.get('/api/pages/:slug', async (req, res) => {
  const { slug } = req.params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return res.status(404).json({ error: "Page not found" });
  res.json({ ...page, data: JSON.parse(page.data) });
});

// --- Protected Admin API ---
app.put('/api/pages/:slug', authenticateToken, async (req, res) => {
  const { slug } = req.params;
  const { data } = req.body;
  
  try {
    const page = await prisma.page.upsert({
      where: { slug },
      update: { data: JSON.stringify(data) },
      create: { slug, data: JSON.stringify(data) }
    });
    res.json({ ...page, data: JSON.parse(page.data) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update page" });
  }
});

app.post('/api/uploads', authenticateToken, async (req, res) => {
  try {
    const { dataUrl, filename } = req.body || {};
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      return res.status(400).json({ error: 'Invalid dataUrl' });
    }

    const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
    if (!match) return res.status(400).json({ error: 'Invalid dataUrl format' });

    const mime = match[1];
    const base64 = match[2];
    const buffer = Buffer.from(base64, 'base64');

    if (!mime.startsWith('image/')) {
      return res.status(400).json({ error: 'Only image uploads are supported' });
    }

    const extFromMime = (() => {
      if (mime === 'image/jpeg') return 'jpg';
      if (mime === 'image/png') return 'png';
      if (mime === 'image/webp') return 'webp';
      if (mime === 'image/gif') return 'gif';
      return 'bin';
    })();

    const safeBase =
      typeof filename === 'string' && filename.trim().length > 0
        ? filename.replace(/[^a-zA-Z0-9._-]/g, '_')
        : 'upload';

    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const finalName = `${safeBase.replace(/\.[^/.]+$/, '')}_${Date.now()}_${uniqueSuffix}.${extFromMime}`;
    const uploadDir = path.resolve('uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, finalName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(finalName)}`;
    res.json({ url: publicUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

app.post('/api/services', authenticateToken, async (req, res) => {
  try {
    const { title, description, icon } = req.body || {};
    if (!title || !description) return res.status(400).json({ error: 'Missing fields' });
    const service = await prisma.service.create({ data: { title, description, icon: icon || null } });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

app.put('/api/services/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const { title, description, icon } = req.body || {};
    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: { title, description, icon: icon ?? null },
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

app.delete('/api/services/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.service.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

app.post('/api/gallery', authenticateToken, async (req, res) => {
  try {
    const { url, caption, category } = req.body || {};
    if (!url || !category) return res.status(400).json({ error: 'Missing fields' });
    const photo = await prisma.photo.create({ data: { url, caption: caption || null, category } });
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create photo' });
  }
});

app.put('/api/gallery/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const { url, caption, category } = req.body || {};
    const photo = await prisma.photo.update({
      where: { id: parseInt(id) },
      data: { url, caption: caption ?? null, category },
    });
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update photo' });
  }
});

app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.photo.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.create({ data: req.body });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
