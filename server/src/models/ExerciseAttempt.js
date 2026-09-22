import mongoose from 'mongoose';

const attemptAnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    questionNumber: {
      type: Number,
      required: true,
    },
    selectedOption: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    correctOption: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    correct: {
      type: Boolean,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
      trim: true,
    },
    answeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const exerciseAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for exercise attempt.'],
      index: true,
    },
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: [true, 'Exercise ID is required.'],
      index: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: [true, 'Lesson ID is required.'],
      index: true,
    },
    answers: [attemptAnswerSchema],
    correctCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    incorrectCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for performant customer queries
exerciseAttemptSchema.index({ userId: 1, exerciseId: 1, completed: 1 });
exerciseAttemptSchema.index({ userId: 1, lessonId: 1, completed: 1 });
exerciseAttemptSchema.index({ createdAt: -1 });

export const ExerciseAttempt = mongoose.model('ExerciseAttempt', exerciseAttemptSchema);
export default ExerciseAttempt;

