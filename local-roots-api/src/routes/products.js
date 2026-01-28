import express from 'express';
import Product from '../models/Product.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get products by vendor (public endpoint for sellers)
router.get('/vendor/:vendorId', async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { community, limit = 50 } = req.query;

    const filter = { vendor: String(vendorId) };
    if (community) filter.community = String(community);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    
    res.json(products);
  } catch (e) {
    next(e);
  }
});

// Public: list products
router.get('/', async (req, res, next) => {
  try {
    const { community, q } = req.query;

    const filter = {};
    if (community) filter.community = String(community);
    if (q) filter.name = { $regex: String(q), $options: 'i' };

    const products = await Product.find(filter)
      .select('_id name price description image category community vendor stock rating reviews likes')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(products);
  } catch (e) {
    next(e);
  }
});

// Public: get product
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const err = new Error('Not found');
      err.status = 404;
      throw err;
    }
    res.json(product);
  } catch (e) {
    next(e);
  }
});

// User: create product (for any authenticated user)
router.post('/user', async (req, res, next) => {
  try {
    const body = req.body || {};
    
    // Accept either Bearer token or X-User-ID for authentication
    let userId = null;
    
    // Try Bearer token first
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;
    if (token) {
      try {
        const { verifyJwt } = await import('../utils/jwt.js');
        const decoded = verifyJwt(token);
        userId = decoded.id || decoded._id;
      } catch (e) {
        // Token invalid, try X-User-ID fallback
      }
    }
    
    // Fallback to X-User-ID for development
    if (!userId && req.headers['x-user-id']) {
      userId = req.headers['x-user-id'];
    }
    
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }
    
    // Add user ID to product data
    const productData = {
      ...body,
      userId: userId,
      // Ensure required fields
      name: body.name || 'Untitled Product',
      price: Number(body.price) || 0,
      category: body.category || 'Others',
      community: body.community || 'global',
      vendor: body.vendor || 'Local Vendor',
      description: body.description || '',
      image: body.image || '',
      images: body.images || [],
      stock: Number(body.stock) || 0,
      rating: 0,
      reviews: 0,
      likes: 0
    };
    
    // Check for duplicate product based on name, vendor, and community
    const existingProduct = await Product.findOne({
      name: productData.name,
      vendor: productData.vendor,
      community: productData.community
    });
    
    if (existingProduct) {
      return res.status(409).json({ 
        error: 'A product with this name already exists for this vendor in this community',
        duplicate: true 
      });
    }
    
    const created = await Product.create(productData);
    console.log(`✅ User ${userId} created product: ${productData.name}`);
    res.status(201).json(created);
  } catch (e) {
    // Handle MongoDB duplicate key error
    if (e.code === 11000 && e.keyPattern && e.keyPattern.name && e.keyPattern.vendor && e.keyPattern.community) {
      return res.status(409).json({ 
        error: 'A product with this name already exists for this vendor in this community',
        duplicate: true 
      });
    }
    console.error('Error creating user product:', e);
    next(e);
  }
});

// Admin: create
router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const body = req.body || {};
    
    // Check for duplicate product based on name, vendor, and community
    const existingProduct = await Product.findOne({
      name: body.name,
      vendor: body.vendor,
      community: body.community
    });
    
    if (existingProduct) {
      return res.status(409).json({ 
        error: 'A product with this name already exists for this vendor in this community',
        duplicate: true 
      });
    }
    
    const created = await Product.create(body);
    res.status(201).json(created);
  } catch (e) {
    // Handle MongoDB duplicate key error
    if (e.code === 11000 && e.keyPattern && e.keyPattern.name && e.keyPattern.vendor && e.keyPattern.community) {
      return res.status(409).json({ 
        error: 'A product with this name already exists for this vendor in this community',
        duplicate: true 
      });
    }
    next(e);
  }
});

// Admin: update
router.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body || {}, { new: true, runValidators: true });
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
    const deleted = await Product.findByIdAndDelete(req.params.id);
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
