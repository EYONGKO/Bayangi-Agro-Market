const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'local_roots',
  port: process.env.DB_PORT || 3306
};

let db;

// Initialize database connection
async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Local Roots API is running' });
});

// Get all communities
app.get('/api/communities', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM communities ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
});

// Get products by community
app.get('/api/products/community/:communityId', async (req, res) => {
  try {
    const { communityId } = req.params;
    const [rows] = await db.execute(
      'SELECT * FROM products WHERE community = ? ORDER BY created_at DESC',
      [communityId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get all products (global market)
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Add new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, description, category, community, vendor, stock, image } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO products (name, price, description, category, community, vendor, stock, image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [name, price, description, category, community, vendor, stock, image]
    );
    
    res.json({ 
      success: true, 
      message: 'Product added successfully',
      productId: result.insertId 
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Get top artisans
app.get('/api/artisans', async (req, res) => {
  try {
    const { community } = req.query;
    let query = `
      SELECT 
        p.vendor,
        p.community,
        AVG(p.rating) as avg_rating,
        COUNT(p.id) as products_sold,
        p.image
      FROM products p
      WHERE p.vendor IS NOT NULL
    `;
    const params = [];

    if (community) {
      query += ' AND p.community = ?';
      params.push(community);
    }

    query += ' GROUP BY p.vendor, p.community ORDER BY avg_rating DESC, products_sold DESC LIMIT 20';

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching artisans:', error);
    res.status(500).json({ error: 'Failed to fetch artisans' });
  }
});

// Newsletter subscription
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email already exists
    const [existing] = await db.execute('SELECT id FROM subscribers WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    // Add new subscriber
    await db.execute(
      'INSERT INTO subscribers (email, created_at) VALUES (?, NOW())',
      [email]
    );
    
    res.json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Get community stories
app.get('/api/stories', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM community_stories WHERE status = "published" ORDER BY created_at DESC LIMIT 10'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Admin Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Admin credentials
    if (email === 'eyongkomatchfire@gmail.com' && password === 'admin123') {
      const token = Buffer.from(JSON.stringify({
        email: email,
        role: 'admin',
        exp: Date.now() + 24 * 60 * 60 * 1000
      })).toString('base64');
      
      return res.json({
        token: token,
        user: {
          id: 'admin',
          email: email,
          name: 'Admin',
          role: 'admin'
        }
      });
    }
    
    // Check regular users
    const [users] = await db.execute(
      'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const token = Buffer.from(JSON.stringify({
      email: user.email,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000
    })).toString('base64');
    
    res.json({
      token: token,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'buyer' } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password required' });
    }
    
    // Check if user already exists
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Insert new user
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    
    const token = Buffer.from(JSON.stringify({
      email: email,
      role: role,
      exp: Date.now() + 24 * 60 * 60 * 1000
    })).toString('base64');
    
    res.json({
      token: token,
      user: {
        id: result.insertId.toString(),
        email: email,
        name: name,
        role: role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Middleware to verify admin token
function verifyAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token required' });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (decoded.email !== 'eyongkomatchfire@gmail.com') {
      return res.status(401).json({ error: 'Admin access required' });
    }
    
    if (decoded.exp && decoded.exp < Date.now()) {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Get all users (Admin only)
app.get('/api/users', verifyAdminToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    const users = rows.map(user => ({
      _id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at
    }));
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role (Admin only)
app.put('/api/users/:id/role', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['buyer', 'seller', 'both'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be buyer, seller, or both' });
    }
    
    const [existingUser] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    
    const [updatedUser] = await db.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    
    const user = updatedUser[0];
    res.json({
      _id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Delete user (Admin only)
app.delete('/api/users/:id', verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [existingUser] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}

startServer().catch(console.error);
