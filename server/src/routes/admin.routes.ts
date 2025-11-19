import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import Review from '../models/Review';
import Escrow from '../models/Escrow';

const router = Router();

// All routes are protected and require admin role
router.use(protect, authorize('admin'));

// Dashboard statistics
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const [
      totalUsers,
      totalFarmers,
      totalBuyers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'buyer' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: { $in: ['paid', 'held-in-escrow', 'released'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'delivered' }),
    ]);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          farmers: totalFarmers,
          buyers: totalBuyers,
        },
        products: totalProducts,
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
        },
        revenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users with filtering
router.get('/users', async (req: AuthRequest, res) => {
  try {
    const { role, verified, page = '1', limit = '20', search } = req.query;

    const query: Record<string, unknown> = {};
    if (role) query.role = role;
    if (verified !== undefined) query.verified = verified === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single user
router.get('/users/:userId', async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's orders and products
    const [orders, products] = await Promise.all([
      Order.find({
        $or: [{ buyer: user._id }, { farmer: user._id }],
      }).populate('product buyer farmer'),
      Product.find({ farmer: user._id }),
    ]);

    res.json({
      success: true,
      user,
      orders,
      products,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update user
router.put('/users/:userId', async (req: AuthRequest, res) => {
  try {
    const { verified, role } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (verified !== undefined) user.verified = verified;
    if (role) user.role = role;

    await user.save();

    res.json({
      success: true,
      user,
      message: 'User updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:userId', async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's products, orders, etc.
    await Promise.all([
      Product.deleteMany({ farmer: user._id }),
      Order.deleteMany({ $or: [{ buyer: user._id }, { farmer: user._id }] }),
      Review.deleteMany({ $or: [{ buyer: user._id }, { farmer: user._id }] }),
    ]);

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User and related data deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products with filtering
router.get('/products', async (req: AuthRequest, res) => {
  try {
    const { category, status, page = '1', limit = '20', search } = req.query;

    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('farmer', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/products/:productId', async (req: AuthRequest, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders with filtering
router.get('/orders', async (req: AuthRequest, res) => {
  try {
    const { status, paymentStatus, page = '1', limit = '20' } = req.query;

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('buyer', 'name email phone')
        .populate('farmer', 'name email phone')
        .populate('product', 'name price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/orders/:orderId', async (req: AuthRequest, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.json({
      success: true,
      order,
      message: 'Order updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get reports
router.get('/reports', async (req: AuthRequest, res) => {
  try {
    const { type = 'revenue', startDate, endDate } = req.query;

    const dateFilter: Record<string, unknown> = {};
    if (startDate) dateFilter.$gte = new Date(startDate as string);
    if (endDate) dateFilter.$lte = new Date(endDate as string);

    const matchStage: Record<string, unknown> = {};
    if (Object.keys(dateFilter).length > 0) {
      matchStage.createdAt = dateFilter;
    }

    let report;

    if (type === 'revenue') {
      report = await Order.aggregate([
        { $match: { ...matchStage, paymentStatus: { $in: ['paid', 'held-in-escrow', 'released'] } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            totalRevenue: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
    } else if (type === 'products') {
      report = await Product.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          },
        },
        { $sort: { count: -1 } },
      ]);
    } else if (type === 'users') {
      report = await User.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
          },
        },
      ]);
    }

    res.json({
      success: true,
      report,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
