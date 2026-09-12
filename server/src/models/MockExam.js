import mongoose from 'mongoose';

const mockExamSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      rw: { type: String, required: true },
    },
    description: {
      en: { type: String, default: '' },
      rw: { type: String, default: '' },
    },
    timeLimitMinutes: {
      type: Number,
      default: 20,
    },
    totalQuestions: {
      type: Number,
      default: 20,
    },
    passingScorePercentage: {
      type: Number,
      default: 60, // 12/20 to pass in Rwanda
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isPremiumOnly: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MockExam = mongoose.model('MockExam', mockExamSchema);
