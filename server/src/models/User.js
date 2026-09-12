import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profile: {
      phone: { type: String, default: '' },
      avatar: { type: String, default: '' },
      preferredLanguage: {
        type: String,
        enum: ['en', 'rw'],
        default: 'rw',
      },
    },
    subscription: {
      status: {
        type: String,
        enum: ['pending_payment', 'awaiting_verification', 'active', 'expired', 'suspended', 'rejected'],
        default: 'pending_payment',
      },
      plan: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'free', null],
        default: null,
      },
      startedAt: { type: Date, default: null },
      expiresAt: { type: Date, default: null },
      rejectionReason: { type: String, default: '' },
      paymentDetails: {
        phone: { type: String, default: '' },
        method: { type: String, default: 'mtn_momo' },
        submittedAt: { type: Date, default: null },
        proofNote: { type: String, default: '' },
      },
    },
    progress: {
      completedLessons: [{ type: String }],
      completedExercises: { type: Number, default: 0 },
      examAttempts: [
        {
          examId: String,
          score: Number,
          total: Number,
          passed: Boolean,
          percentage: Number,
          date: { type: Date, default: Date.now },
        },
      ],
      readinessScore: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify password against bcrypt hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove passwordHash from JSON transformations
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export const User = mongoose.model('User', userSchema);
