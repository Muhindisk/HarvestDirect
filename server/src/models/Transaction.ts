import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  wallet: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: 'credit' | 'debit';
  category: 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'payout' | 'transfer';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference: string;
  description: string;
  metadata?: {
    orderId?: mongoose.Types.ObjectId;
    paymentMethod?: string;
    transactionId?: string;
    recipientId?: mongoose.Types.ObjectId;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    wallet: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    category: {
      type: String,
      enum: ['deposit', 'withdrawal', 'payment', 'refund', 'payout', 'transfer'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'KES',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'completed',
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
transactionSchema.index({ wallet: 1, createdAt: -1 });
transactionSchema.index({ user: 1, createdAt: -1 });

// Generate unique reference before validation
transactionSchema.pre('validate', function (next) {
  if (!this.reference) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    this.reference = `TXN-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
