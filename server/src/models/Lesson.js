import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    lessonNumber: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    title: {
      en: { type: String, required: true, trim: true },
      rw: { type: String, default: '', trim: true },
    },
    summary: {
      en: { type: String, default: '', trim: true },
      rw: { type: String, default: '', trim: true },
    },
    vimeoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    vimeoVideoId: {
      type: String,
      required: true,
      trim: true,
    },
    durationSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    thumbnailUrl: {
      type: String,
      default: '',
      trim: true,
    },
    moduleNumber: {
      type: Number,
      default: 1,
    },
    moduleTitle: {
      en: { type: String, default: 'General Traffic Rules & Highway Code' },
      rw: { type: String, default: 'Amategeko Rusange n’Iby’ibanze by’Umuhanda' },
    },
    objectives: {
      en: [{ type: String }],
      rw: [{ type: String }],
    },
    notes: {
      en: { type: String, default: '' },
      rw: { type: String, default: '' },
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Prepared for Phase 3: Connected Exercise
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method or virtual for duration formatting
lessonSchema.virtual('durationFormatted').get(function () {
  if (!this.durationSeconds) return '0 min';
  const mins = Math.floor(this.durationSeconds / 60);
  const secs = this.durationSeconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
});

lessonSchema.set('toJSON', { virtuals: true });
lessonSchema.set('toObject', { virtuals: true });

export const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
