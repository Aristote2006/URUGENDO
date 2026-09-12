import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    text: {
      en: { type: String, required: true },
      rw: { type: String, required: true },
    },
    imageUrl: { type: String, default: null },
    options: [
      {
        text: {
          en: { type: String, required: true },
          rw: { type: String, required: true },
        },
        isCorrect: { type: Boolean, required: true, default: false },
      },
    ],
    explanation: {
      en: { type: String, default: '' },
      rw: { type: String, default: '' },
    },
    category: {
      type: String,
      enum: ['general_rules', 'road_signs', 'priority', 'speed_limits', 'accidents_safety'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    isFreePractice: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Question = mongoose.model('Question', questionSchema);
