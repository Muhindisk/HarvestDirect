import mongoose from 'mongoose';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';

interface CreateTransactionParams {
  walletId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: 'credit' | 'debit';
  category: 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'payout' | 'transfer';
  amount: number;
  description: string;
  metadata?: Record<string, any>;
}

interface TransferParams {
  fromWalletId: mongoose.Types.ObjectId;
  toWalletId: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  metadata?: Record<string, any>;
}

class WalletService {
  /**
   * Create or get wallet for a user
   */
  async getOrCreateWallet(userId: mongoose.Types.ObjectId) {
    let wallet = await Wallet.findOne({ user: userId });
    
    if (!wallet) {
      wallet = new Wallet({
        user: userId,
        balance: 0,
        currency: 'KES',
        status: 'active',
      });
      await wallet.save();
    }
    
    return wallet;
  }

  /**
   * Get wallet balance
   */
  async getBalance(userId: mongoose.Types.ObjectId) {
    const wallet = await this.getOrCreateWallet(userId);
    return wallet.balance;
  }

  /**
   * Credit wallet (add money)
   */
  async creditWallet(params: CreateTransactionParams) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const wallet = await Wallet.findById(params.walletId).session(session);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (wallet.status !== 'active') {
        throw new Error('Wallet is not active');
      }

      const balanceBefore = wallet.balance;
      const balanceAfter = balanceBefore + params.amount;

      // Update wallet balance
      wallet.balance = balanceAfter;
      await wallet.save({ session });

      // Create transaction record
      const transaction = new Transaction({
        wallet: params.walletId,
        user: params.userId,
        type: 'credit',
        category: params.category,
        amount: params.amount,
        balanceBefore,
        balanceAfter,
        currency: wallet.currency,
        status: 'completed',
        description: params.description,
        metadata: params.metadata || {},
      });
      await transaction.save({ session });

      await session.commitTransaction();
      return { wallet, transaction };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Debit wallet (remove money)
   */
  async debitWallet(params: CreateTransactionParams) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const wallet = await Wallet.findById(params.walletId).session(session);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (wallet.status !== 'active') {
        throw new Error('Wallet is not active');
      }

      if (wallet.balance < params.amount) {
        throw new Error('Insufficient wallet balance');
      }

      const balanceBefore = wallet.balance;
      const balanceAfter = balanceBefore - params.amount;

      // Update wallet balance
      wallet.balance = balanceAfter;
      await wallet.save({ session });

      // Create transaction record
      const transaction = new Transaction({
        wallet: params.walletId,
        user: params.userId,
        type: 'debit',
        category: params.category,
        amount: params.amount,
        balanceBefore,
        balanceAfter,
        currency: wallet.currency,
        status: 'completed',
        description: params.description,
        metadata: params.metadata || {},
      });
      await transaction.save({ session });

      await session.commitTransaction();
      return { wallet, transaction };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Transfer money between wallets
   */
  async transferBetweenWallets(params: TransferParams) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const fromWallet = await Wallet.findById(params.fromWalletId).session(session);
      const toWallet = await Wallet.findById(params.toWalletId).session(session);

      if (!fromWallet || !toWallet) {
        throw new Error('One or both wallets not found');
      }

      if (fromWallet.status !== 'active' || toWallet.status !== 'active') {
        throw new Error('One or both wallets are not active');
      }

      if (fromWallet.balance < params.amount) {
        throw new Error('Insufficient balance in source wallet');
      }

      // Debit from source wallet
      const fromBalanceBefore = fromWallet.balance;
      fromWallet.balance -= params.amount;
      await fromWallet.save({ session });

      const debitTransaction = new Transaction({
        wallet: fromWallet._id,
        user: fromWallet.user,
        type: 'debit',
        category: 'transfer',
        amount: params.amount,
        balanceBefore: fromBalanceBefore,
        balanceAfter: fromWallet.balance,
        currency: fromWallet.currency,
        status: 'completed',
        description: params.description,
        metadata: { ...params.metadata, recipientId: toWallet.user },
      });
      await debitTransaction.save({ session });

      // Credit to destination wallet
      const toBalanceBefore = toWallet.balance;
      toWallet.balance += params.amount;
      await toWallet.save({ session });

      const creditTransaction = new Transaction({
        wallet: toWallet._id,
        user: toWallet.user,
        type: 'credit',
        category: 'transfer',
        amount: params.amount,
        balanceBefore: toBalanceBefore,
        balanceAfter: toWallet.balance,
        currency: toWallet.currency,
        status: 'completed',
        description: params.description,
        metadata: { ...params.metadata, senderId: fromWallet.user },
      });
      await creditTransaction.save({ session });

      await session.commitTransaction();
      return { fromWallet, toWallet, debitTransaction, creditTransaction };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(
    walletId: mongoose.Types.ObjectId,
    options: { page?: number; limit?: number; type?: string; category?: string } = {}
  ) {
    const { page = 1, limit = 20, type, category } = options;
    const skip = (page - 1) * limit;

    const query: any = { wallet: walletId };
    if (type) query.type = type;
    if (category) query.category = category;

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email'),
      Transaction.countDocuments(query),
    ]);

    return {
      transactions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }
}

export default new WalletService();
