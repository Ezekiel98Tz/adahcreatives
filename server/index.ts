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
const nodemailer = require('nodemailer');

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./prisma/dev.db';
}

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-me';

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use('/uploads', express.static(path.resolve('uploads')));

app.use((err, req, res, next) => {
  const parseFailed =
    err &&
    typeof err === 'object' &&
    (err.name === 'SyntaxError' || err.type === 'entity.parse.failed');

  if (parseFailed && req.path?.startsWith('/api/')) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  next(err);
});

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
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
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
  const numericId = Number(slug);
  const project =
    Number.isInteger(numericId) && String(numericId) === slug
      ? await prisma.project.findUnique({ where: { id: numericId } })
      : await prisma.project.findUnique({ where: { slug } });
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
    const { title, slug, description, category, imageUrl } = req.body || {};
    const normalizedSlug = typeof slug === 'string' && slug.trim().length > 0 ? slug.trim() : null;
    const normalizedImageUrl = typeof imageUrl === 'string' && imageUrl.trim().length > 0 ? imageUrl.trim() : null;
    const normalizedDescription = typeof description === 'string' && description.trim().length > 0 ? description.trim() : null;

    const project = await prisma.project.create({
      data: {
        title,
        slug: normalizedSlug,
        description: normalizedDescription,
        category,
        imageUrl: normalizedImageUrl,
      },
    });
    res.json(project);
  } catch (error) {
    const isProd = String(process.env.NODE_ENV || '').toLowerCase() === 'production';
    const code = (error as any)?.code;
    const target = (error as any)?.meta?.target;

    if (!isProd && code === 'P2002') {
      const targetList = Array.isArray(target) ? target : typeof target === 'string' ? [target] : [];
      if (targetList.includes('slug')) return res.status(409).json({ error: 'Slug already exists' });
      return res.status(409).json({ error: 'Unique constraint failed' });
    }

    res.status(500).json({ error: isProd ? 'Failed to create project' : `Failed to create project: ${String((error as any)?.message || '')}` });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const { title, slug, description, category, imageUrl } = req.body || {};
    const normalizedSlug = typeof slug === 'string' && slug.trim().length > 0 ? slug.trim() : null;
    const normalizedImageUrl = typeof imageUrl === 'string' && imageUrl.trim().length > 0 ? imageUrl.trim() : null;
    const normalizedDescription = typeof description === 'string' && description.trim().length > 0 ? description.trim() : null;

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title,
        slug: normalizedSlug,
        description: normalizedDescription,
        category,
        imageUrl: normalizedImageUrl,
      },
    });
    res.json(project);
  } catch (error) {
    const isProd = String(process.env.NODE_ENV || '').toLowerCase() === 'production';
    const code = (error as any)?.code;
    const target = (error as any)?.meta?.target;

    if (!isProd && code === 'P2002') {
      const targetList = Array.isArray(target) ? target : typeof target === 'string' ? [target] : [];
      if (targetList.includes('slug')) return res.status(409).json({ error: 'Slug already exists' });
      return res.status(409).json({ error: 'Unique constraint failed' });
    }

    if (!isProd && code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(500).json({ error: isProd ? 'Failed to update project' : `Failed to update project: ${String((error as any)?.message || '')}` });
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

const mailTransport = (() => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  const tlsRejectUnauthorizedRaw = process.env.SMTP_TLS_REJECT_UNAUTHORIZED;
  const tls =
    typeof tlsRejectUnauthorizedRaw === 'string' && tlsRejectUnauthorizedRaw.trim().length > 0
      ? { rejectUnauthorized: tlsRejectUnauthorizedRaw.trim().toLowerCase() !== 'false' }
      : undefined;

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE
      ? String(process.env.SMTP_SECURE || '').toLowerCase() === 'true'
      : port === 465,
    auth: { user, pass },
    ...(tls ? { tls } : {}),
  });
})();

if (mailTransport && String(process.env.NODE_ENV || '').toLowerCase() !== 'production') {
  mailTransport
    .verify()
    .then(() => console.log('SMTP verify ok'))
    .catch((error) => console.error('SMTP verify failed', error));
}

function getMissingMailConfig() {
  const missing: string[] = [];
  if (!process.env.SMTP_HOST) missing.push('SMTP_HOST');
  if (!process.env.SMTP_PORT) missing.push('SMTP_PORT');
  if (!process.env.SMTP_USER) missing.push('SMTP_USER');
  if (!process.env.SMTP_PASS) missing.push('SMTP_PASS');
  return missing;
}

function parseRecipients(value) {
  if (!value || typeof value !== 'string') return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function isLikelyEmail(value) {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (v.length < 3 || v.length > 254) return false;
  if (/\s/.test(v)) return false;
  const at = v.indexOf('@');
  if (at <= 0 || at !== v.lastIndexOf('@') || at === v.length - 1) return false;
  const domain = v.slice(at + 1);
  if (!domain.includes('.')) return false;
  return true;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!isLikelyEmail(email)) {
      return res.status(400).json({ error: 'Email is invalid' });
    }
    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!mailTransport) {
      const isProd = String(process.env.NODE_ENV || '').toLowerCase() === 'production';
      return res
        .status(501)
        .json({ error: 'Email service not configured', ...(isProd ? {} : { missing: getMissingMailConfig() }) });
    }

    const toList = parseRecipients(process.env.CONTACT_TO || process.env.SMTP_USER || 'info@adahcreatives.co.tz');
    const ccList = parseRecipients(process.env.CONTACT_CC || '');
    const fromAddress = (process.env.CONTACT_FROM || process.env.SMTP_FROM || process.env.SMTP_USER || '').trim();

    if (!fromAddress) {
      return res.status(501).json({ error: 'Email sender not configured' });
    }

    const safeName = String(name).trim();
    const safeEmail = String(email).trim();
    const safeMessage = String(message).trim();
    const subject = `New contact message — ${safeName} <${safeEmail}>`;
    const htmlSafeName = escapeHtml(safeName);
    const htmlSafeEmail = escapeHtml(safeEmail);
    const htmlSafeMessage = escapeHtml(safeMessage).replace(/\n/g, '<br/>');

    const info = await mailTransport.sendMail({
      from: { name: `${safeName} (${safeEmail})`, address: fromAddress },
      sender: fromAddress,
      to: toList.join(', '),
      cc: ccList.length ? ccList.join(', ') : undefined,
      replyTo: { name: safeName, address: safeEmail },
      subject,
      text: `New contact message\n\nName: ${safeName}\nEmail: ${safeEmail}\n\nMessage:\n${safeMessage}\n`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; color: #111; line-height: 1.5;">
          <h2 style="margin: 0 0 12px 0; font-size: 18px;">New contact message</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px 12px; border: 1px solid #eee; width: 140px; background: #fafafa;"><strong>Name</strong></td>
              <td style="padding: 10px 12px; border: 1px solid #eee;">${htmlSafeName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border: 1px solid #eee; width: 140px; background: #fafafa;"><strong>Email</strong></td>
              <td style="padding: 10px 12px; border: 1px solid #eee;"><a href="mailto:${htmlSafeEmail}" style="color: #111; text-decoration: none;">${htmlSafeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border: 1px solid #eee; width: 140px; background: #fafafa;"><strong>Message</strong></td>
              <td style="padding: 10px 12px; border: 1px solid #eee;">${htmlSafeMessage}</td>
            </tr>
          </table>
          <p style="margin: 16px 0 0 0; font-size: 12px; color: #666;">Replying to this email will reply to ${htmlSafeEmail}.</p>
        </div>
      `,
      envelope: {
        from: fromAddress,
        to: [...toList, ...ccList].filter(Boolean),
      },
      headers: {
        'X-Contact-Name': safeName,
        'X-Contact-Email': safeEmail,
      },
    });

    const isProd = String(process.env.NODE_ENV || '').toLowerCase() === 'production';
    if (!isProd) {
      console.log({
        mail: {
          messageId: (info as any)?.messageId,
          accepted: (info as any)?.accepted,
          rejected: (info as any)?.rejected,
          response: (info as any)?.response,
        },
      });
      return res.json({
        success: true,
        messageId: (info as any)?.messageId,
        accepted: (info as any)?.accepted,
        rejected: (info as any)?.rejected,
        response: (info as any)?.response,
      });
    }

    res.json({ success: true, messageId: (info as any)?.messageId });
  } catch (error) {
    const isProd = String(process.env.NODE_ENV || '').toLowerCase() === 'production';
    const err = error as any;
    const message = error instanceof Error ? error.message : String(error || '');
    const code = typeof err?.code === 'string' ? err.code : '';
    const responseCode = typeof err?.responseCode === 'number' ? err.responseCode : undefined;
    const responseText = typeof err?.response === 'string' ? err.response : '';

    const authError =
      code === 'EAUTH' ||
      responseCode === 535 ||
      /auth/i.test(message) ||
      /Invalid login/i.test(message) ||
      /Incorrect authentication/i.test(message);

    const connectionError =
      code === 'ECONNECTION' ||
      code === 'ECONNREFUSED' ||
      code === 'ETIMEDOUT' ||
      code === 'ESOCKET' ||
      /connect/i.test(message) ||
      /socket/i.test(message) ||
      /timeout/i.test(message);

    const status = authError || connectionError ? 502 : 500;
    const baseError = authError
      ? 'Email service authentication failed'
      : connectionError
        ? 'Email service connection failed'
        : 'Failed to send message';

    const details = message || responseText;
    if (!isProd) console.error(error);
    res
      .status(status)
      .json({ error: isProd ? baseError : `${baseError}: ${details || 'Unknown error'}` });
  }
});

app.use((err, req, res, next) => {
  if (req.path?.startsWith('/api/')) {
    const status = typeof err?.status === 'number' ? err.status : 500;
    const message = status >= 500 ? 'Internal server error' : String(err?.message || 'Request error');
    return res.status(status).json({ error: message });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
