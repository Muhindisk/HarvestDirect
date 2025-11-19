import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
  user: mongoose.Types.ObjectId;
  balance: number;
  currency: string;
  status: 'active' | 'suspended' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'KES',
      enum: ['KES', 'USD', 'EUR'],
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'closed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IWallet>('Wallet', walletSchema);
