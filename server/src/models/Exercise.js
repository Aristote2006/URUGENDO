import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const exerciseQuestionSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [optionSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length >= 2;
        },
        message: 'A question must contain at least 2 options.',
      },
    },
    correctOption: {
      type: String,
      uppercase: true,
      trim: true,
      default: '',
    },
    explanation: {
      type: String,
      default: '',
      trim: true,
    },
    sourceQuestionNumber: {
      type: Number,
    },
    importStatus: {
      type: String,
      enum: ['valid', 'needs_review', 'approved'],
      default: 'needs_review',
      index: true,
    },
    reviewNotes: {
      type: String,
      default: '',
      trim: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const exerciseSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: [true, 'An associated lesson is required.'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Exercise title is required.'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'importing', 'review', 'ready', 'published', 'unpublished'],
      default: 'draft',
      index: true,
    },
    questions: [exerciseQuestionSchema],
    questionCount: {
      type: Number,
      default: 0,
    },
    approvedQuestionCount: {
      type: Number,
      default: 0,
    },
    sourceFiles: {
      questionFileName: { type: String, default: '' },
      answerFileName: { type: String, default: '' },
      uploadedAt: { type: Date, default: null },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
exerciseSchema.index({ lessonId: 1, status: 1 });
exerciseSchema.index({ createdAt: -1 });

// Middleware to keep counts in sync before saving
exerciseSchema.pre('save', function (next) {
  if (this.questions) {
    this.questionCount = this.questions.length;
    this.approvedQuestionCount = this.questions.filter((q) => q.approved === true).length;
  }
  next();
});

export const Exercise = mongoose.model('Exercise', exerciseSchema);
export default Exercise;

