import mongoose, { Document, Schema } from 'mongoose';

export interface IEscrow extends Document {
  order: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  farmer: mongoose.Types.ObjectId;
  amount: number;
  status: 'held' | 'released' | 'refunded' | 'disputed';
  paymentMethod: 'mpesa' | 'card' | 'bank-transfer';
  transactionId: string;
  releasedAt?: Date;
  refundedAt?: Date;
  disputeReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const escrowSchema = new Schema<IEscrow>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['held', 'released', 'refunded', 'disputed'],
      default: 'held',
    },
    paymentMethod: {
      type: String,
      enum: ['mpesa', 'card', 'bank-transfer'],
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    releasedAt: Date,
    refundedAt: Date,
    disputeReason: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEscrow>('Escrow', escrowSchema);
