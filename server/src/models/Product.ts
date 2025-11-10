import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  unit: 'kg' | 'g' | 'lbs' | 'pieces' | 'bunches' | 'bag' | 'bags' | 'crate' | 'crates' | 'liters' | 'piece';
  quantity: number;
  images: string[];
  farmer: mongoose.Types.ObjectId;
  location: {
    county: string;
    subCounty: string;
  };
  harvestDate?: Date;
  organic: boolean;
  certified: boolean;
  status: 'available' | 'sold' | 'pending';
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['vegetables', 'fruits', 'grains', 'dairy', 'livestock', 'legumes', 'herbs', 'poultry', 'other'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'g', 'lbs', 'pieces', 'bunches', 'bag', 'bags', 'crate', 'crates', 'liters', 'piece'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 0,
    },
    images: [String],
    farmer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      county: {
        type: String,
        required: false,
      },
      subCounty: String,
    },
    harvestDate: Date,
    organic: {
      type: Boolean,
      default: false,
    },
    certified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'pending'],
      default: 'available',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
