import { Router } from 'express';
import { protect } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import intasendService from '../services/intasend.service';
import walletService from '../services/wallet.service';
import Order from '../models/Order';
import Escrow from '../models/Escrow';
import Wallet from '../models/Wallet';

const router = Router();

// Helper to safely extract an id string from an ObjectId, populated doc, or string
const idToString = (val: any): string => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (val._id) return (val._id as any).toString();
  if (typeof val.toString === 'function') return val.toString();
  return String(val);
};

// Initiate payment for an order
router.post('/initiate', protect, async (req: AuthRequest, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId).populate('buyer product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const userIdStr = (req.user!._id as any).toString();
    if (idToString(order.buyer) !== userIdStr) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }

    if (order.paymentStatus === 'paid' || order.paymentStatus === 'held-in-escrow') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    const user = order.buyer as any;

    if (paymentMethod === 'wallet') {
      // Pay with wallet
      const wallet = await walletService.getOrCreateWallet(req.user!._id as any);

      if (wallet.balance < order.totalAmount) {
        return res.status(400).json({ 
          message: 'Insufficient wallet balance',
          required: order.totalAmount,
          available: wallet.balance,
        });
      }

      // Debit wallet
      const { transaction } = await walletService.debitWallet({
        walletId: wallet._id as any,
        userId: req.user!._id as any,
        type: 'debit',
        category: 'payment',
        amount: order.totalAmount,
        description: `Payment for order ${order.orderNumber}`,
        metadata: { orderId: order._id },
      });

      // Decrease product stock now that payment is confirmed
      const product = await (await import('../models/Product')).default.findById(order.product);
      if (product) {
        product.quantity = Math.max(0, product.quantity - order.quantity);
        if (product.quantity === 0) product.status = 'sold';
        await product.save();
      }

      // Update user statistics
      await (await import('../models/User')).default.findByIdAndUpdate(
        order.buyer,
        { 
          $inc: { totalPurchases: order.totalAmount },
          $addToSet: { savedFarmers: order.farmer },
        }
      );
      await (await import('../models/User')).default.findByIdAndUpdate(
        order.farmer,
        { $inc: { totalSales: order.totalAmount } }
      );

      // Update order
      order.paymentStatus = 'held-in-escrow';
      order.status = 'confirmed';
      await order.save();

      // Create escrow
      const escrow = new Escrow({
        order: order._id,
        buyer: order.buyer,
        farmer: order.farmer,
        amount: order.totalAmount,
        status: 'held',
        transactionId: transaction.reference,
      });
      await escrow.save();

      order.escrowId = escrow._id as any;
      await order.save();

      return res.json({
        success: true,
        paymentMethod: 'wallet',
        message: 'Payment successful from wallet',
        transaction,
        order,
      });
    } else if (paymentMethod === 'mpesa-stk') {
      // M-Pesa STK Push
      const nameParts = user.name.split(' ');
      const result = await intasendService.initiateMpesaSTKPush({
        first_name: nameParts[0] || 'Customer',
        last_name: nameParts[1] || '',
        email: user.email,
        host: process.env.CLIENT_URL || 'http://localhost:5173',
        amount: order.totalAmount,
        phone_number: user.phone,
        api_ref: order.orderNumber,
      });

      res.json({
        success: true,
        paymentMethod: 'mpesa-stk',
        data: result,
        message: 'STK Push initiated. Please check your phone.',
      });
    } else {
      // Card or other payment methods
      const nameParts = user.name.split(' ');
      const result = await intasendService.initiateCharge({
        first_name: nameParts[0] || 'Customer',
        last_name: nameParts[1] || '',
        email: user.email,
        phone_number: user.phone,
        amount: order.totalAmount,
        currency: 'KES',
        api_ref: order.orderNumber,
        redirect_url: `${process.env.CLIENT_URL}/orders/${order._id}/payment-success`,
        host: process.env.CLIENT_URL || 'http://localhost:5173',
      });

      res.json({
        success: true,
        paymentMethod: 'card',
        data: result,
        message: 'Payment initiated successfully',
      });
    }
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ message: error.message || 'Payment initiation failed' });
  }
});

// M-Pesa callback (IntaSend will call this)
router.post('/mpesa/callback', async (req, res) => {
  try {
    const { invoice_id, state, api_ref, value, failed_reason } = req.body;

    console.log('M-Pesa Callback:', req.body);

    if (state === 'COMPLETE' || state === 'PENDING') {
      // Find order by orderNumber (api_ref)
      const order = await Order.findOne({ orderNumber: api_ref });
      if (order) {
        if (state === 'COMPLETE') {
          // Decrease product stock now that payment is confirmed
          const Product = (await import('../models/Product')).default;
          const product = await Product.findById(order.product);
          if (product) {
            product.quantity = Math.max(0, product.quantity - order.quantity);
            if (product.quantity === 0) product.status = 'sold';
            await product.save();
          }

          // Update user statistics
          const User = (await import('../models/User')).default;
          await User.findByIdAndUpdate(
            order.buyer,
            { 
              $inc: { totalPurchases: order.totalAmount },
              $addToSet: { savedFarmers: order.farmer },
            }
          );
          await User.findByIdAndUpdate(
            order.farmer,
            { $inc: { totalSales: order.totalAmount } }
          );

          order.paymentStatus = 'held-in-escrow';
          order.status = 'confirmed';
          await order.save();

          // Create escrow record
          const escrow = new Escrow({
            order: order._id,
            buyer: order.buyer,
            farmer: order.farmer,
            amount: order.totalAmount,
            status: 'held',
            transactionId: invoice_id,
          });
          await escrow.save();

          order.escrowId = escrow._id as any;
          await order.save();
        }
      }
    } else if (state === 'FAILED') {
      const order = await Order.findOne({ orderNumber: api_ref });
      if (order) {
        order.paymentStatus = 'pending';
        order.notes = `Payment failed: ${failed_reason || 'Unknown error'}`;
        await order.save();
      }
    }

    res.json({ message: 'Callback received', success: true });
  } catch (error: any) {
    console.error('M-Pesa callback error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Intasend webhook
router.post('/intasend/webhook', async (req, res) => {
  try {
    const { event, data } = req.body;

    console.log('IntaSend Webhook:', event, data);

    if (event === 'COMPLETE' || data?.state === 'COMPLETE') {
      const order = await Order.findOne({ orderNumber: data.api_ref });
      if (order && order.paymentStatus !== 'paid') {
        // Decrease product stock now that payment is confirmed
        const Product = (await import('../models/Product')).default;
        const product = await Product.findById(order.product);
        if (product) {
          product.quantity = Math.max(0, product.quantity - order.quantity);
          if (product.quantity === 0) product.status = 'sold';
          await product.save();
        }

        // Update user statistics
        const User = (await import('../models/User')).default;
        await User.findByIdAndUpdate(
          order.buyer,
          { 
            $inc: { totalPurchases: order.totalAmount },
            $addToSet: { savedFarmers: order.farmer },
          }
        );
        await User.findByIdAndUpdate(
          order.farmer,
          { $inc: { totalSales: order.totalAmount } }
        );

        order.paymentStatus = 'held-in-escrow';
        order.status = 'confirmed';
        await order.save();

        // Create or update escrow
        let escrow = await Escrow.findOne({ order: order._id });
        if (!escrow) {
          escrow = new Escrow({
            order: order._id,
            buyer: order.buyer,
            farmer: order.farmer,
            amount: order.totalAmount,
            status: 'held',
            transactionId: data.invoice_id || data.id,
          });
          await escrow.save();
          order.escrowId = escrow._id as any;
          await order.save();
        }
      }
    }

    res.json({ message: 'Webhook processed', success: true });
  } catch (error: any) {
    console.error('IntaSend webhook error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Verify payment
router.get('/verify/:transactionId', protect, async (req: AuthRequest, res) => {
  try {
    const { transactionId } = req.params;

    const result = await intasendService.checkPaymentStatus(transactionId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Release escrow payment to farmer (when order is delivered)
router.post('/release-escrow/:orderId', protect, async (req: AuthRequest, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('farmer');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only buyer or admin can release escrow
    const userIdStr2 = (req.user!._id as any).toString();
    if (idToString(order.buyer) !== userIdStr2 && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Order must be delivered before releasing payment' });
    }

    const escrow = await Escrow.findById(order.escrowId);
    if (!escrow) {
      return res.status(404).json({ message: 'Escrow record not found' });
    }

    if (escrow.status === 'released') {
      return res.status(400).json({ message: 'Payment already released' });
    }

    const farmer = order.farmer as any;

    // Credit farmer's internal wallet first (so funds appear in their wallet)
    try {
      const farmerWallet = await walletService.getOrCreateWallet(farmer._id);
      const { transaction: creditTransaction } = await walletService.creditWallet({
        walletId: farmerWallet._id as any,
        userId: farmer._id as any,
        type: 'credit',
        category: 'payout',
        amount: escrow.amount,
        description: `Payment for order ${order.orderNumber}`,
        metadata: { orderId: order._id, escrowId: escrow._id },
      });

      // Attempt external payout but do not block the wallet credit on failure
      let payoutResult: any = null;
      try {
        payoutResult = await intasendService.initiatePayout({
          account: farmer.mpesaNumber || farmer.phone,
          account_name: farmer.name,
          amount: escrow.amount,
          narrative: `Payment for order ${order.orderNumber}`,
          account_type: 'MPESA',
        });

        // Attach payout metadata to wallet transaction
        creditTransaction.metadata = {
          ...creditTransaction.metadata,
          payoutId: payoutResult.id,
          payoutData: payoutResult,
        };
        await creditTransaction.save();
      } catch (payoutErr: any) {
        // Record payout failure metadata on the transaction
        creditTransaction.metadata = {
          ...creditTransaction.metadata,
          payoutError: payoutErr?.message || String(payoutErr),
        };
        await creditTransaction.save();
        console.error('Payout to farmer failed:', payoutErr);
      }

      // Update escrow and order status
      escrow.status = 'released';
      escrow.releasedAt = new Date();
      await escrow.save();

      order.paymentStatus = 'released';
      await order.save();

      res.json({
        success: true,
        message: 'Payment released to farmer wallet',
        payout: payoutResult,
        creditTransaction,
      });
    } catch (err: any) {
      console.error('Error crediting farmer wallet:', err);
      return res.status(500).json({ message: 'Failed to credit farmer wallet' });
    }
  } catch (error: any) {
    console.error('Release escrow error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
