import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'farmer' | 'buyer' | 'admin';
  profileImage?: string;
  location?: {
    county: string;
    subCounty: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  verified: boolean;
  rating?: number;
  totalSales?: number;
  totalPurchases?: number;
  mpesaNumber?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  // IDs of farmers this buyer has interacted with / saved
  savedFarmers?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    role: {
      type: String,
      enum: ['farmer', 'buyer', 'admin'],
      default: 'buyer',
    },
    profileImage: String,
    location: {
      county: String,
      subCounty: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalPurchases: {
      type: Number,
      default: 0,
    },
    mpesaNumber: String,
    bankDetails: {
      bankName: String,
      accountNumber: String,
      accountName: String,
    },
    // List of farmers this buyer has interacted with / saved
    savedFarmers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
// Hash password before saving
userSchema.pre('save', async function (this: any, next: any) {
  const user: any = this;
  if (typeof user.isModified !== 'function' || !user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Compare password method
// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as any;
  return await bcrypt.compare(candidatePassword, user.password);
};

export default mongoose.model<IUser>('User', userSchema);
