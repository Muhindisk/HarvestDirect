import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  buyer: mongoose.Types.ObjectId;
  farmer: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'held-in-escrow' | 'released' | 'refunded';
  deliveryAddress: {
    county: string;
    subCounty: string;
    details: string;
    phone: string;
  };
  deliveryDate?: Date;
  escrowId?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
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
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-transit', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'held-in-escrow', 'released', 'refunded'],
      default: 'pending',
    },
    deliveryAddress: {
      county: {
        type: String,
        required: true,
      },
      subCounty: String,
      details: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    deliveryDate: Date,
    escrowId: {
      type: Schema.Types.ObjectId,
      ref: 'Escrow',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    this.orderNumber = `ORD-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

export default mongoose.model<IOrder>('Order', orderSchema);
