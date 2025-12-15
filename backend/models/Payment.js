import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cod', 'card', 'paypal', 'bank'],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR'],
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentGateway: {
      type: String,
      enum: ['stripe', 'paypal', 'razorpay', null],
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
    refundAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    refundReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ order: 1 }, { unique: true });
paymentSchema.index({ customer: 1 });
paymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);