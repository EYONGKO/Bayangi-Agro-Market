// User Management endpoints for Local Roots Backend
// Add these endpoints to your server.js file after the existing routes

// Middleware to verify admin token
function verifyAdminToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Admin token required' });
  }
  
  // For now, accept a simple token. In production, use JWT verification
  if (token !== 'admin-secret-token') {
    return res.status(401).json({ error: 'Invalid admin token' });
  }
  
  next();
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
