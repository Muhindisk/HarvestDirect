import { Router } from 'express';
import { protect } from '../middleware/auth';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Placeholder routes - implement controllers as needed
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'Get user profile' });
});

router.put('/profile', protect, (req, res) => {
  res.json({ message: 'Update user profile' });
});

// Get buyer's saved farmers
router.get('/saved-farmers', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const user = await User.findById(userId).populate('savedFarmers', 'name email location rating profileImage');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ savedFarmers: user.savedFarmers || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch saved farmers' });
  }
});

export default router;
