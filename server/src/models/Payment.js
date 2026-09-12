import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'RWF',
    },
    paymentMethod: {
      type: String,
      enum: ['mtn_momo', 'airtel_money', 'cash', 'card', 'other'],
      default: 'mtn_momo',
    },
    paymentPhoneNumber: {
      type: String,
      default: '',
      trim: true,
    },
    proofImage: {
      type: String,
      default: '',
    },
    proofNote: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    reference: {
      type: String,
      default: () => 'PAY-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000),
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for backward compatibility if code uses userId
paymentSchema.virtual('userId').get(function () {
  return this.user;
});

export const Payment = mongoose.model('Payment', paymentSchema);
