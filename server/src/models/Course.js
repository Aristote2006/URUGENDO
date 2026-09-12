import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      rw: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      rw: { type: String, required: true },
    },
    category: {
      type: String,
      enum: ['general_rules', 'road_signs', 'priority_rules', 'road_safety', 'penalties'],
      default: 'general_rules',
    },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model('Course', courseSchema);
