import { Router } from 'express';
import { protect } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import walletService from '../services/wallet.service';
import intasendService from '../services/intasend.service';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';
import Order from '../models/Order';

const router = Router();

// All routes require authentication
router.use(protect);

// Get wallet balance
router.get('/balance', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const wallet = await walletService.getOrCreateWallet(userId as any);

    res.json({
      success: true,
      balance: wallet.balance,
      currency: wallet.currency,
      status: wallet.status,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get wallet details
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const wallet = await walletService.getOrCreateWallet(userId as any);

    res.json({
      success: true,
      wallet,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Deposit money to wallet
router.post('/deposit', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { amount, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const wallet = await walletService.getOrCreateWallet(userId as any);
    const user = req.user!;

    // Initiate payment via IntaSend
    let paymentResult;
    
    if (paymentMethod === 'mpesa-stk') {
      const nameParts = user.name.split(' ');
      paymentResult = await intasendService.initiateMpesaSTKPush({
        first_name: nameParts[0] || 'Customer',
        last_name: nameParts[1] || '',
        email: user.email,
        host: process.env.CLIENT_URL || 'http://localhost:5173',
        amount,
        phone_number: user.phone,
        api_ref: `WALLET-DEP-${Date.now()}`,
      });
    } else {
      const nameParts = user.name.split(' ');
      paymentResult = await intasendService.initiateCharge({
        first_name: nameParts[0] || 'Customer',
        last_name: nameParts[1] || '',
        email: user.email,
        phone_number: user.phone,
        amount,
        currency: 'KES',
        api_ref: `WALLET-DEP-${Date.now()}`,
        redirect_url: `${process.env.CLIENT_URL}/wallet/deposit-success`,
        host: process.env.CLIENT_URL || 'http://localhost:5173',
      });
    }

    // Create pending transaction
    const transaction = new Transaction({
      wallet: wallet._id,
      user: userId,
      type: 'credit',
      category: 'deposit',
      amount,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance, // Will be updated when payment completes
      currency: wallet.currency,
      status: 'pending',
      description: 'Wallet deposit',
      metadata: {
        paymentMethod,
        paymentData: paymentResult,
      },
    });
    await transaction.save();

    res.json({
      success: true,
      message: 'Payment initiated',
      paymentMethod,
      data: paymentResult,
      transactionId: transaction._id,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Withdraw money from wallet
router.post('/withdraw', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { amount, account, accountName } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!account || !accountName) {
      return res.status(400).json({ message: 'Account details required' });
    }

    const wallet = await walletService.getOrCreateWallet(userId as any);

    if (wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Debit wallet
    const { transaction } = await walletService.debitWallet({
      walletId: wallet._id as any,
      userId: userId as any,
      type: 'debit',
      category: 'withdrawal',
      amount,
      description: 'Wallet withdrawal',
      metadata: { account, accountName },
    });

    // Initiate payout via IntaSend
    try {
      const payoutResult = await intasendService.initiatePayout({
        account,
        account_name: accountName,
        amount,
        narrative: 'Wallet withdrawal',
      });

      // Update transaction with payout details
      transaction.metadata = {
        ...transaction.metadata,
        payoutId: payoutResult.id,
        payoutData: payoutResult,
      };
      await transaction.save();

      res.json({
        success: true,
        message: 'Withdrawal initiated successfully',
        transaction,
        payout: payoutResult,
      });
    } catch (error: any) {
      // If payout fails, reverse the debit
      await walletService.creditWallet({
        walletId: wallet._id as any,
        userId: userId as any,
        type: 'credit',
        category: 'refund',
        amount,
        description: 'Withdrawal reversal - payout failed',
        metadata: { originalTransactionId: transaction._id },
      });

      throw new Error(`Withdrawal failed: ${error.message}`);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Pay for order using wallet
router.post('/pay-order', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if ((order.buyer as any).toString() !== (userId as any).toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.paymentStatus !== 'pending') {
      return res.status(400).json({ message: 'Order payment already processed' });
    }

    const wallet = await walletService.getOrCreateWallet(userId as any);

    if (wallet.balance < order.totalAmount) {
      return res.status(400).json({ 
        message: 'Insufficient wallet balance',
        required: order.totalAmount,
        available: wallet.balance,
      });
    }

    // Debit wallet for order payment
    const { transaction } = await walletService.debitWallet({
      walletId: wallet._id as any,
      userId: userId as any,
      type: 'debit',
      category: 'payment',
      amount: order.totalAmount,
      description: `Payment for order ${order.orderNumber}`,
      metadata: { orderId: order._id },
    });

    // Update order payment status
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    await order.save();

    res.json({
      success: true,
      message: 'Payment successful',
      transaction,
      order,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get transaction history
router.get('/transactions', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { page = '1', limit = '20', type, category } = req.query;

    const wallet = await walletService.getOrCreateWallet(userId as any);
    
    const result = await walletService.getTransactionHistory(wallet._id as any, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      type: type as string,
      category: category as string,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Webhook for wallet deposit completion
router.post('/deposit/callback', async (req, res) => {
  try {
    const { invoice_id, state, api_ref, value, failed_reason } = req.body;

    console.log('Wallet deposit callback:', req.body);

    if (api_ref && api_ref.startsWith('WALLET-DEP-')) {
      const transaction = await Transaction.findOne({
        'metadata.paymentData.invoice_id': invoice_id,
      });

      if (transaction) {
        const wallet = await Wallet.findById(transaction.wallet);
        
        if (state === 'COMPLETE') {
          // Update wallet balance
          if (wallet) {
            wallet.balance += transaction.amount;
            await wallet.save();
          }

          // Update transaction status
          transaction.status = 'completed';
          transaction.balanceAfter = wallet ? wallet.balance : transaction.balanceAfter;
          await transaction.save();
        } else if (state === 'FAILED') {
          transaction.status = 'failed';
          transaction.metadata = {
            ...transaction.metadata,
            failedReason: failed_reason,
          };
          await transaction.save();
        }
      }
    }

    res.json({ message: 'Callback processed', success: true });
  } catch (error: any) {
    console.error('Wallet deposit callback error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
