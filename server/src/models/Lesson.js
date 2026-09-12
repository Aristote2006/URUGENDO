import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      en: { type: String, required: true },
      rw: { type: String, required: true },
    },
    content: {
      en: { type: String, default: '' },
      rw: { type: String, default: '' },
    },
    order: { type: Number, default: 0 },
    isFree: { type: Boolean, default: false },
    estimatedMinutes: { type: Number, default: 10 },
  },
  {
    timestamps: true,
  }
);

export const Lesson = mongoose.model('Lesson', lessonSchema);
