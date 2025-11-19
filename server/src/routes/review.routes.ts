import { Router } from 'express';
import { protect } from '../middleware/auth';
import Review from '../models/Review';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Create a review (buyers only, for delivered orders)
router.post('/', protect, async (req: AuthRequest, res) => {
  try {
    const buyerId = req.user!._id;
    const { orderId, rating, comment, images } = req.body;

    if (!orderId || !rating || !comment) {
      return res.status(400).json({ message: 'Order ID, rating, and comment are required' });
    }

    // Check if order exists and is delivered
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if ((order.buyer as any).toString() !== (buyerId as any).toString()) {
      return res.status(403).json({ message: 'Not authorized to review this order' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only review delivered orders' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ buyer: buyerId, order: orderId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this order' });
    }

    const review = new Review({
      product: order.product,
      buyer: buyerId,
      farmer: order.farmer,
      order: orderId,
      rating,
      comment,
      images: images || [],
      verified: true, // Verified since it's from a real order
    });

    await review.save();

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find({ product: productId })
        .populate('buyer', 'name profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Review.countDocuments({ product: productId })
    ]);

    res.json({
      success: true,
      reviews,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for a farmer
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find({ farmer: farmerId })
        .populate('buyer', 'name profileImage')
        .populate('product', 'name images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Review.countDocuments({ farmer: farmerId })
    ]);

    res.json({
      success: true,
      reviews,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Farmer responds to a review
router.post('/:reviewId/response', protect, async (req: AuthRequest, res) => {
  try {
    const farmerId = req.user!._id;
    const { reviewId } = req.params;
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({ message: 'Response text is required' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if ((review.farmer as any).toString() !== (farmerId as any).toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this review' });
    }

    review.response = {
      text: response,
      createdAt: new Date(),
    };

    await review.save();

    res.json({
      success: true,
      review,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
