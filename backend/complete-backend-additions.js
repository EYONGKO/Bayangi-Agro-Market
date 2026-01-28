// Complete backend additions for Local Roots
// Add these to your server.js file BEFORE the error handling middleware

// Admin Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // For now, accept hardcoded admin credentials
    // In production, use proper database authentication
    if (email === 'eyongkomatchfire@gmail.com' && password === 'admin123') {
      // Create a simple JWT-like token (in production, use proper JWT)
      const token = Buffer.from(JSON.stringify({
        email: email,
        role: 'admin',
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
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
    
    // Check regular users in database
    const [users] = await db.execute(
      'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?',
      [email, password] // In production, hash passwords!
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
      [name, email, password, role] // In production, hash passwords!
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
    // Decode the simple token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check if it's the admin email
    if (decoded.email !== 'eyongkomatchfire@gmail.com') {
      return res.status(401).json({ error: 'Admin access required' });
    }
    
    // Check if token is expired
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
    
    // Convert to match frontend format
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
    
    // Check if user exists
    const [existingUser] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user role
    await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    
    // Get updated user
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
    
    // Check if user exists
    const [existingUser] = await db.execute('SELECT id FROM users WHERE id = ?', [id]);
    
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Delete user
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});
