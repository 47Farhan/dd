import mongoose from 'mongoose';

// 1. The Review Schema is necessary and is defined once.
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// 2. Define the Product Schema ONCE, combining all necessary fields.
const productSchema = new mongoose.Schema({
  // Fields from the FIRST version that are still needed:
  user: { // The product creator/owner
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  reviews: [reviewSchema], // Embedded reviews using the schema above
  numReviews: { // Also useful from the first version
    type: Number,
    required: true,
    default: 0,
  },

  // Fields from the SECOND/THIRD versions (more detailed):
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 1000
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  originalPrice: { // Good for sale items
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['men', 'women', 'kids']
  },
  subcategory: {
    type: String,
    required: [true, 'Subcategory is required']
  },
  images: [{ // Note: You'll want to choose a structure for images and stick to it
    url: String,
    alt: String
  }],
  sizes: [String],
  colors: [{
    name: String,
    code: String
  }],
  inventory: { // Better name than 'countInStock'
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  features: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// 3. Keep the Virtual property
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// 4. Export the Model ONCE
export default mongoose.model('Product', productSchema);