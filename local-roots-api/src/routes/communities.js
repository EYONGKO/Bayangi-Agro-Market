import express from 'express';
import Community from '../models/Community.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = express.Router();

const slugify = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]/g, '');

// Public: list
router.get('/', async (_req, res, next) => {
  try {
    const items = await Community.find({}).sort({ name: 1 }).limit(500);
    res.json(items);
  } catch (e) {
    next(e);
  }
});

// Public: get
router.get('/:id', async (req, res, next) => {
  try {
    const item = await Community.findById(req.params.id);
    if (!item) {
      const err = new Error('Not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (e) {
    next(e);
  }
});

// Admin: create
router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const body = req.body || {};
    const name = String(body.name || '').trim();
    if (!name) {
      const err = new Error('Missing name');
      err.status = 400;
      throw err;
    }

    const created = await Community.create({
      name,
      slug: slugify(body.slug || name),
      description: String(body.description || ''),
      image: String(body.image || '')
    });

    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

// Admin: update
router.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const body = req.body || {};
    const patch = { ...body };
    if (patch.name && !patch.slug) {
      patch.slug = slugify(patch.name);
    }

    const updated = await Community.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });
    if (!updated) {
      const err = new Error('Not found');
      err.status = 404;
      throw err;
    }
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// Admin: delete
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Community.findByIdAndDelete(req.params.id);
    if (!deleted) {
      const err = new Error('Not found');
      err.status = 404;
      throw err;
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
