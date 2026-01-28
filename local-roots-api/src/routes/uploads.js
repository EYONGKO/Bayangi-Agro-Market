import crypto from 'crypto';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = express.Router();

function parseDataUrl(dataUrl) {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mime: match[1], base64: match[2] };
}

function mimeToExt(mime) {
  const safe = String(mime || '').toLowerCase();
  if (safe === 'image/jpeg') return 'jpg';
  if (safe === 'image/png') return 'png';
  if (safe === 'image/webp') return 'webp';
  if (safe === 'image/gif') return 'gif';
  return null;
}

router.post('/image', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { dataUrl, filename } = req.body || {};

    const parsed = parseDataUrl(dataUrl);
    if (!parsed) {
      const err = new Error('Invalid image data');
      err.status = 400;
      throw err;
    }

    const ext = mimeToExt(parsed.mime);
    if (!ext) {
      const err = new Error('Unsupported image type');
      err.status = 400;
      throw err;
    }

    const buf = Buffer.from(parsed.base64, 'base64');
    if (!buf.length) {
      const err = new Error('Empty image');
      err.status = 400;
      throw err;
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeName = String(filename || '').replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 50);
    const unique = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const outName = safeName ? `${unique}-${safeName}` : unique;
    const finalName = outName.toLowerCase().endsWith(`.${ext}`) ? outName : `${outName}.${ext}`;

    const outPath = path.join(uploadsDir, finalName);
    await fs.writeFile(outPath, buf);

    // Return absolute URL for mobile compatibility
    const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN 
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` 
      : `http://localhost:${process.env.PORT || 8080}`;
    
    res.json({ url: `${baseUrl}/uploads/${finalName}` });
  } catch (e) {
    next(e);
  }
});

export default router;
