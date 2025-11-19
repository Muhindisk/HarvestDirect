import { Router } from 'express';
import { protect } from '../middleware/auth';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to safely extract an id string from an ObjectId, populated doc, or string
const idToString = (val: any): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (val._id) return (val._id as any).toString();
  if (typeof val.toString === 'function') return val.toString();
  return String(val);
};

// Create an order with transaction
router.post('/', protect, async (req: AuthRequest, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const buyerId = req.user!._id;
    const { productId, quantity = 1, deliveryAddress, notes } = req.body;

    if (!productId) return res.status(400).json({ message: 'productId is required' });
    if (!deliveryAddress || !deliveryAddress.county || !deliveryAddress.details || !deliveryAddress.phone) {
      return res.status(400).json({ message: 'deliveryAddress (county, details, phone) is required' });
    }

    const product = await Product.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.quantity < quantity) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Insufficient product stock' });
    }

    const totalAmount = (product.price || 0) * quantity;

    // Set payment deadline to 30 minutes from now
    const paymentDeadline = new Date(Date.now() + 30 * 60 * 1000);

    const order = new Order({
      buyer: buyerId,
      farmer: product.farmer,
      product: product._id,
      quantity,
      totalAmount,
      deliveryAddress,
      notes,
      paymentDeadline,
    } as any);

    await order.save({ session });

    // Note: Stock is NOT decreased here - it will be decreased after payment confirmation

    // Note: User stats and stock updates happen after payment confirmation

    await session.commitTransaction();
    
    // Populate the order before returning
    await order.populate('product buyer farmer');
    
    res.status(201).json({ success: true, order });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  } finally {
    session.endSession();
  }
});

// Get user orders (buyer or farmer with filtering)
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const userRole = req.user!.role;
    const { status, page = '1', limit = '20', sort = 'desc' } = req.query;

    const query: Record<string, unknown> = {};
    
    // Filter by user role
    if (userRole === 'farmer') {
      query.farmer = userId;
    } else {
      query.buyer = userId;
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = sort === 'asc' ? 1 : -1;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('product', 'name images price unit')
        .populate('farmer', 'name phone location rating')
        .populate('buyer', 'name phone location')
        .sort({ createdAt: sortOrder })
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const userId = (req.user!._id as any).toString();
    const order = await Order.findById(req.params.id)
      .populate('product', 'name images price unit category')
      .populate('farmer', 'name phone location rating email')
      .populate('buyer', 'name phone location email');
    
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Check if user is authorized to view this order
    const buyerIdStr = idToString(order.buyer);
    const farmerIdStr = idToString(order.farmer);
    if (buyerIdStr !== userId && farmerIdStr !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// Update order status
router.put('/:id/status', protect, async (req: AuthRequest, res) => {
  try {
    const userId = (req.user!._id as any).toString();
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only farmer or admin can update order status
    if (idToString(order.farmer) !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Validate status transitions
    const validStatuses = ['pending', 'confirmed', 'in-transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    order.status = status;
    
    if (status === 'delivered') {
      order.deliveryDate = new Date();
    }

    await order.save();

    res.json({ success: true, order, message: 'Order status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// Cancel order
router.post('/:id/cancel', protect, async (req: AuthRequest, res) => {
  try {
    const userId = (req.user!._id as any).toString();
    const { reason } = req.body;

    const order = await Order.findById(req.params.id).populate('product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only buyer can cancel order
    if (idToString(order.buyer) !== userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Can only cancel pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel order at this stage' });
    }

    order.status = 'cancelled';
    order.notes = reason || 'Cancelled by buyer';

    // Restore product quantity
    const product = order.product as any;
    if (product) {
      product.quantity += order.quantity;
      if (product.status === 'sold') {
        product.status = 'available';
      }
      await product.save();
    }

    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
});

// Get order statistics
router.get('/stats/summary', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const userRole = req.user!.role;

    const query: Record<string, unknown> = {};
    if (userRole === 'farmer') {
      query.farmer = userId;
    } else {
      query.buyer = userId;
    }

    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      inTransitOrders,
      deliveredOrders,
      cancelledOrders,
      totalAmount,
    ] = await Promise.all([
      Order.countDocuments(query),
      Order.countDocuments({ ...query, status: 'pending' }),
      Order.countDocuments({ ...query, status: 'confirmed' }),
      Order.countDocuments({ ...query, status: 'in-transit' }),
      Order.countDocuments({ ...query, status: 'delivered' }),
      Order.countDocuments({ ...query, status: 'cancelled' }),
      Order.aggregate([
        { $match: { ...query, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        total: totalOrders,
        pending: pendingOrders,
        confirmed: confirmedOrders,
        inTransit: inTransitOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        totalAmount: totalAmount[0]?.total || 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch order statistics' });
  }
});

// Cleanup expired unpaid orders (cron job or manual trigger)
router.post('/cleanup-expired', protect, async (req: AuthRequest, res) => {
  try {
    // Only admin can trigger cleanup
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const now = new Date();
    
    // Find all orders that are awaiting payment and past their deadline
    const expiredOrders = await Order.find({
      status: 'awaiting-payment',
      paymentStatus: 'pending',
      paymentDeadline: { $lt: now },
    });

    let cancelledCount = 0;
    for (const order of expiredOrders) {
      order.status = 'cancelled';
      order.notes = (order.notes || '') + ' [Auto-cancelled: Payment deadline expired]';
      await order.save();
      cancelledCount++;
    }

    res.json({
      success: true,
      message: `Cancelled ${cancelledCount} expired unpaid orders`,
      cancelledCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to cleanup expired orders' });
  }
});

export default router;
