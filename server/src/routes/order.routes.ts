import { Router } from 'express';
import { protect } from '../middleware/auth';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';

const router = Router();

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

    const order = new Order({
      buyer: buyerId,
      farmer: product.farmer,
      product: product._id,
      quantity,
      totalAmount,
      deliveryAddress,
      notes,
    } as any);

    await order.save({ session });

    // Decrease product stock
    product.quantity = Math.max(0, product.quantity - quantity);
    if (product.quantity === 0) product.status = 'sold';
    await product.save({ session });

    // Add farmer to buyer's savedFarmers (avoid duplicates)
    await User.findByIdAndUpdate(
      buyerId,
      { $addToSet: { savedFarmers: product.farmer } },
      { session }
    );

    // Increment buyer.totalPurchases and farmer.totalSales
    await User.findByIdAndUpdate(
      buyerId,
      { $inc: { totalPurchases: totalAmount } },
      { session }
    );

    await User.findByIdAndUpdate(
      product.farmer,
      { $inc: { totalSales: totalAmount } },
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({ order });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  } finally {
    session.endSession();
  }
});

// Get user orders (simple list)
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const orders = await Order.find({ buyer: userId }).populate('product').populate('farmer');
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('product').populate('farmer');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// Update order status (placeholder)
router.put('/:id/status', protect, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status || order.status;
    await order.save();
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

export default router;
