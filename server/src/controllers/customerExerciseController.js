import { Exercise } from '../models/Exercise.js';
import { Lesson } from '../models/Lesson.js';
import { LessonProgress } from '../models/LessonProgress.js';
import { ExerciseAttempt } from '../models/ExerciseAttempt.js';
import { User } from '../models/User.js';

/**
 * GET /api/exercises/lesson/:lessonId
 * Returns the published exercise associated with a lesson (sanitized for customer use).
 * Also returns user's video completion and latest attempt status.
 */
export const getExerciseByLessonId = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user?._id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    // Query published exercise for this lesson
    const exercise = await Exercise.findOne({
      lessonId: lesson._id,
      status: 'published',
    });

    if (!exercise) {
      return res.status(200).json({
        success: true,
        data: {
          hasExercise: false,
          lesson: {
            _id: lesson._id,
            lessonNumber: lesson.lessonNumber,
            title: lesson.title,
            moduleNumber: lesson.moduleNumber,
          },
          message: 'The exercise for this lesson has not been published yet. Please check back later.',
        },
      });
    }

    // Check user's lesson video progress
    const progress = await LessonProgress.findOne({ user: userId, lesson: lesson._id });
    const isVideoCompleted = Boolean(progress?.videoCompleted);
    const isExerciseCompleted = Boolean(progress?.exerciseCompleted);
    const isLessonCompleted = Boolean(progress?.lessonCompleted);

    // Only approved questions are exposed to the customer
    const approvedQuestions = (exercise.questions || []).filter((q) => q.approved === true);

    if (approvedQuestions.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          hasExercise: false,
          lesson: {
            _id: lesson._id,
            lessonNumber: lesson.lessonNumber,
            title: lesson.title,
            moduleNumber: lesson.moduleNumber,
          },
          message: 'This exercise is currently unavailable because it contains no questions.',
        },
      });
    }

    // Customer-safe sanitized questions (NEVER send correctOption or administrative metadata)
    const sanitizedQuestions = approvedQuestions
      .sort((a, b) => a.questionNumber - b.questionNumber)
      .map((q) => ({
        _id: q._id,
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        options: q.options.map((o) => ({
          label: o.label,
          text: o.text,
        })),
        explanation: q.explanation || '',
      }));

    // Find latest attempt for this user and exercise
    const latestAttempt = await ExerciseAttempt.findOne({
      userId,
      exerciseId: exercise._id,
    }).sort({ createdAt: -1 });

    let attemptStatus = 'not_started';
    let activeAttemptData = null;

    if (latestAttempt) {
      if (latestAttempt.completed) {
        attemptStatus = 'completed';
        activeAttemptData = {
          _id: latestAttempt._id,
          completed: true,
          percentage: latestAttempt.percentage,
          correctCount: latestAttempt.correctCount,
          incorrectCount: latestAttempt.incorrectCount,
          totalQuestions: latestAttempt.totalQuestions,
          completedAt: latestAttempt.completedAt,
        };
      } else {
        attemptStatus = 'in_progress';
        activeAttemptData = {
          _id: latestAttempt._id,
          completed: false,
          answeredQuestionIds: latestAttempt.answers.map((a) => a.questionId.toString()),
          answeredCount: latestAttempt.answers.length,
          totalQuestions: sanitizedQuestions.length,
          startedAt: latestAttempt.startedAt,
        };
      }
    }

    res.status(200).json({
      success: true,
      data: {
        hasExercise: true,
        exercise: {
          _id: exercise._id,
          title: exercise.title,
          description: exercise.description,
          questionCount: sanitizedQuestions.length,
          questions: sanitizedQuestions,
        },
        lesson: {
          _id: lesson._id,
          lessonNumber: lesson.lessonNumber,
          title: lesson.title,
          moduleNumber: lesson.moduleNumber,
          moduleTitle: lesson.moduleTitle,
        },
        progress: {
          videoCompleted: isVideoCompleted,
          exerciseCompleted: isExerciseCompleted,
          lessonCompleted: isLessonCompleted,
        },
        attemptStatus,
        latestAttempt: activeAttemptData,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/exercises/:exerciseId/start
 * Starts a new exercise attempt or resumes an existing in-progress attempt.
 */
export const startOrResumeAttempt = async (req, res, next) => {
  try {
    const { exerciseId } = req.params;
    const { retake } = req.body || {};
    const userId = req.user?._id;

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise || exercise.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found or is currently not published.',
      });
    }

    // Verify video completion rule
    const progress = await LessonProgress.findOne({ user: userId, lesson: exercise.lessonId });
    if (!progress || !progress.videoCompleted) {
      return res.status(403).json({
        success: false,
        message: 'Please complete the lesson video first before starting this exercise.',
      });
    }

    const approvedQuestions = exercise.questions.filter((q) => q.approved === true);
    if (approvedQuestions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'This exercise contains no approved questions.',
      });
    }

    // Check if there is an in-progress uncompleted attempt
    let attempt = await ExerciseAttempt.findOne({
      userId,
      exerciseId: exercise._id,
      completed: false,
    });

    if (attempt && !retake) {
      // Resume existing attempt
      return res.status(200).json({
        success: true,
        message: 'Resuming existing exercise attempt.',
        data: {
          attempt: {
            _id: attempt._id,
            exerciseId: attempt.exerciseId,
            lessonId: attempt.lessonId,
            completed: attempt.completed,
            answeredCount: attempt.answers.length,
            totalQuestions: approvedQuestions.length,
            answers: attempt.answers.map((a) => ({
              questionId: a.questionId,
              questionNumber: a.questionNumber,
              selectedOption: a.selectedOption,
              correct: a.correct,
            })),
          },
          isResume: true,
        },
      });
    }

    // Create a new attempt
    attempt = await ExerciseAttempt.create({
      userId,
      exerciseId: exercise._id,
      lessonId: exercise.lessonId,
      answers: [],
      correctCount: 0,
      incorrectCount: 0,
      totalQuestions: approvedQuestions.length,
      percentage: 0,
      completed: false,
      startedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Exercise attempt started.',
      data: {
        attempt: {
          _id: attempt._id,
          exerciseId: attempt.exerciseId,
          lessonId: attempt.lessonId,
          completed: false,
          answeredCount: 0,
          totalQuestions: approvedQuestions.length,
          answers: [],
        },
        isResume: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/exercises/:exerciseId/attempts/:attemptId/answer
 * Submits an answer for a question in an active attempt.
 * Evaluates correctness server-side and immediately returns feedback.
 */
export const submitAnswer = async (req, res, next) => {
  try {
    const { exerciseId, attemptId } = req.params;
    const { questionId, selectedOption } = req.body;
    const userId = req.user?._id;

    if (!questionId || !selectedOption) {
      return res.status(400).json({
        success: false,
        message: 'Question ID and selected option are required.',
      });
    }

    // Verify exercise
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise || exercise.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found or is currently not published.',
      });
    }

    // Verify attempt ownership and state
    const attempt = await ExerciseAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Exercise attempt not found.' });
    }

    if (attempt.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to access this exercise attempt.',
      });
    }

    if (attempt.completed) {
      return res.status(400).json({
        success: false,
        message: 'This exercise attempt has already been completed.',
      });
    }

    // Verify question belongs to exercise and is approved
    const question = exercise.questions.find(
      (q) => q._id.toString() === questionId && q.approved === true
    );
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found in this exercise or is not approved.',
      });
    }

    // Verify selected option is valid for this question
    const cleanOption = selectedOption.trim().toUpperCase();
    const validOption = question.options.some((o) => o.label.toUpperCase() === cleanOption);
    if (!validOption) {
      return res.status(400).json({
        success: false,
        message: `Invalid option '${cleanOption}'. Please choose a valid option label.`,
      });
    }

    // Anti-cheating: Prevent duplicate submission of the same question
    const alreadyAnswered = attempt.answers.some(
      (a) => a.questionId.toString() === question._id.toString()
    );
    if (alreadyAnswered) {
      return res.status(400).json({
        success: false,
        message: 'This question has already been answered in this attempt.',
      });
    }

    // Evaluate correctness strictly on server
    const isCorrect = cleanOption === question.correctOption.toUpperCase();

    // Record answer in attempt
    attempt.answers.push({
      questionId: question._id,
      questionNumber: question.questionNumber,
      selectedOption: cleanOption,
      correctOption: question.correctOption.toUpperCase(),
      correct: isCorrect,
      explanation: question.explanation || '',
      answeredAt: new Date(),
    });

    // Update running metrics
    const totalApproved = exercise.questions.filter((q) => q.approved === true).length;
    attempt.correctCount = attempt.answers.filter((a) => a.correct === true).length;
    attempt.incorrectCount = attempt.answers.length - attempt.correctCount;

    // Check if final question was answered
    const isFinished = attempt.answers.length >= totalApproved;

    if (isFinished) {
      attempt.totalQuestions = totalApproved;
      attempt.percentage = totalApproved > 0
        ? Math.round((attempt.correctCount / totalApproved) * 100)
        : 0;
      attempt.completed = true;
      attempt.completedAt = new Date();

      // Sync completion to LessonProgress
      let progress = await LessonProgress.findOne({ user: userId, lesson: exercise.lessonId });
      if (!progress) {
        progress = new LessonProgress({ user: userId, lesson: exercise.lessonId });
      }

      progress.exerciseCompleted = true;

      // When both video and exercise are completed, mark lesson completed
      if (progress.videoCompleted) {
        progress.lessonCompleted = true;
        progress.completedAt = progress.completedAt || new Date();
      }

      await progress.save();

      // Update User progress completedExercises count
      await User.findByIdAndUpdate(userId, {
        $inc: { 'progress.completedExercises': 1 },
      });
    }

    await attempt.save();

    res.status(200).json({
      success: true,
      message: isCorrect ? 'Correct answer!' : 'Incorrect answer.',
      data: {
        correct: isCorrect,
        selectedOption: cleanOption,
        correctOption: question.correctOption.toUpperCase(),
        explanation: question.explanation || '',
        isCompleted: attempt.completed,
        summary: attempt.completed
          ? {
              correctCount: attempt.correctCount,
              incorrectCount: attempt.incorrectCount,
              totalQuestions: attempt.totalQuestions,
              percentage: attempt.percentage,
              completedAt: attempt.completedAt,
            }
          : null,
        attempt: {
          _id: attempt._id,
          answeredCount: attempt.answers.length,
          totalQuestions: totalApproved,
          completed: attempt.completed,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/exercises/:exerciseId/attempts/:attemptId
 * Retrieves attempt details. If completed, returns full question-by-question review data.
 */
export const getAttemptById = async (req, res, next) => {
  try {
    const { exerciseId, attemptId } = req.params;
    const userId = req.user?._id;

    const attempt = await ExerciseAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Exercise attempt not found.' });
    }

    if (attempt.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to view this attempt.',
      });
    }

    const exercise = await Exercise.findById(exerciseId).populate('lessonId', 'lessonNumber title moduleNumber');
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found.' });
    }

    // Build question map for full review
    const questionMap = new Map();
    exercise.questions.forEach((q) => {
      questionMap.set(q._id.toString(), q);
    });

    const reviewQuestions = attempt.answers.map((ans) => {
      const q = questionMap.get(ans.questionId.toString());
      return {
        questionId: ans.questionId,
        questionNumber: ans.questionNumber,
        questionText: q?.questionText || '',
        options: q?.options?.map((o) => ({ label: o.label, text: o.text })) || [],
        selectedOption: ans.selectedOption,
        correctOption: ans.correctOption,
        correct: ans.correct,
        explanation: ans.explanation || q?.explanation || '',
        answeredAt: ans.answeredAt,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        attempt: {
          _id: attempt._id,
          exerciseId: attempt.exerciseId,
          lessonId: attempt.lessonId,
          correctCount: attempt.correctCount,
          incorrectCount: attempt.incorrectCount,
          totalQuestions: attempt.totalQuestions,
          percentage: attempt.percentage,
          completed: attempt.completed,
          startedAt: attempt.startedAt,
          completedAt: attempt.completedAt,
        },
        exerciseTitle: exercise.title,
        lesson: exercise.lessonId,
        reviewQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/exercises
 * Returns all published exercises with the student's progress and attempt status.
 */
export const getAllPublishedExercises = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    const exercises = await Exercise.find({ status: 'published' })
      .populate('lessonId', 'lessonNumber title moduleNumber moduleTitle')
      .sort({ createdAt: 1 });

    // Fetch attempts for current user
    const attempts = userId ? await ExerciseAttempt.find({ userId }) : [];

    const attemptsMap = new Map();
    attempts.forEach((a) => {
      const exIdStr = a.exerciseId.toString();
      if (!attemptsMap.has(exIdStr) || a.completed) {
        attemptsMap.set(exIdStr, a);
      }
    });

    const data = exercises.map((ex) => {
      const latestAttempt = attemptsMap.get(ex._id.toString());
      const approvedCount = (ex.questions || []).filter((q) => q.approved === true).length;

      return {
        _id: ex._id,
        title: ex.title,
        description: ex.description,
        totalQuestions: approvedCount,
        passingScore: ex.passingScore,
        lesson: ex.lessonId,
        latestAttempt: latestAttempt
          ? {
              _id: latestAttempt._id,
              completed: latestAttempt.completed,
              percentage: latestAttempt.percentage,
              correctCount: latestAttempt.correctCount,
              totalQuestions: latestAttempt.totalQuestions,
            }
          : null,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        total: data.length,
        exercises: data,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllPublishedExercises,
  getExerciseByLessonId,
  startOrResumeAttempt,
  submitAnswer,
  getAttemptById,
};

