import { Router } from 'express';
import { protect } from '../middleware/auth';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import Product from '../models/Product';
import Order from '../models/Order';

const router = Router();

// Get current user's profile
router.get('/profile', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update current user's profile
router.put('/profile', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { name, phone, profileImage, location, mpesaNumber, bankDetails } = req.body;
    
    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (profileImage) updateData.profileImage = profileImage;
    if (location) updateData.location = location;
    if (mpesaNumber) updateData.mpesaNumber = mpesaNumber;
    if (bankDetails) updateData.bankDetails = bankDetails;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ success: true, user, message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
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

// Public: Get user profile by ID (viewable by anyone)
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prepare public profile
    const publicProfile: any = {
      _id: user._id,
      name: user.name,
      role: user.role,
      profileImage: user.profileImage,
      location: user.location,
      rating: user.rating || 0,
      totalSales: user.totalSales || 0,
      totalPurchases: user.totalPurchases || 0,
      verified: user.verified || false,
    };

    // If farmer, include their products
    let products: any[] = [];
    let orders: any[] = [];
    if (user.role === 'farmer') {
      products = await Product.find({ farmer: user._id }).select('name price images unit status');
    } else {
      // For buyers, include recent orders placed by them
      orders = await Order.find({ buyer: user._id })
        .populate('product', 'name images price')
        .sort({ createdAt: -1 })
        .limit(20);
    }

    res.json({ success: true, user: publicProfile, products, orders });
  } catch (err) {
    console.error('Failed to fetch public user profile', err);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

export default router;
