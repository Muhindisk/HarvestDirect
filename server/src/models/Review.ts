import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  farmer: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  images?: string[];
  response?: {
    text: string;
    createdAt: Date;
  };
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
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
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: 1000,
    },
    images: [String],
    response: {
      text: String,
      createdAt: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per buyer per order
reviewSchema.index({ buyer: 1, order: 1 }, { unique: true });

// Update product and farmer ratings after review
reviewSchema.post('save', async function () {
  try {
    const Product = mongoose.model('Product');
    const User = mongoose.model('User');
    const Review = mongoose.model('Review');

    // Update product rating
    const productReviews = await Review.find({ product: this.product });
    if (productReviews.length > 0) {
      const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      await Product.findByIdAndUpdate(this.product, { rating: avgRating });
    }

    // Update farmer rating
    const farmerReviews = await Review.find({ farmer: this.farmer });
    if (farmerReviews.length > 0) {
      const avgRating = farmerReviews.reduce((sum, r) => sum + r.rating, 0) / farmerReviews.length;
      await User.findByIdAndUpdate(this.farmer, { rating: avgRating });
    }
  } catch (error) {
    console.error('Error updating ratings:', error);
  }
});

export default mongoose.model<IReview>('Review', reviewSchema);
