import express from 'express';
import User from '../models/User.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Admin: list users (no passwordHash)
router.get('/', requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).limit(500);
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// Admin: update user role
router.put('/:id/role', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    console.log('Updating user role:', { id, role }); // Debug log
    
    if (!['buyer', 'seller', 'both'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be buyer, seller, or both' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { role }, 
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('Updated user:', updatedUser); // Debug log
    
    res.json(updatedUser);
  } catch (e) {
    console.error('Error updating user role:', e); // Debug log
    next(e);
  }
});

// Admin: delete user
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
