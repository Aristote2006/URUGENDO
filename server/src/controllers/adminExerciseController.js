import multer from 'multer';
import { Exercise } from '../models/Exercise.js';
import { Lesson } from '../models/Lesson.js';
import { extractTextFromPdf } from '../services/documentParser/pdfParser.js';
import { parseQuestions } from '../services/questionParser/questionParser.js';
import { parseAnswers } from '../services/answerParser/answerParser.js';
import { matchQuestionsAndAnswers } from '../services/matcher/questionAnswerMatcher.js';
import {
  validateQuestion,
  validateExerciseForPublishing,
} from '../services/validator/questionValidator.js';

// Multer memory storage configuration (keeps uploaded files in memory buffers)
const storage = multer.memoryStorage();

export const uploadExerciseDocs = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === 'application/pdf' ||
      file.originalname.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: "${file.originalname}". Please upload PDF documents only.`));
    }
  },
}).fields([
  { name: 'questionFile', maxCount: 1 },
  { name: 'answerFile', maxCount: 1 },
]);

/**
 * GET /api/admin/exercises
 * Returns all exercises with lesson details and curriculum stats.
 */
export const getExercises = async (req, res, next) => {
  try {
    const { status, lessonId, search } = req.query;

    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (lessonId) {
      filter.lessonId = lessonId;
    }
    if (search) {
      filter.title = { $regex: search.trim(), $options: 'i' };
    }

    const exercises = await Exercise.find(filter)
      .populate('lessonId', 'lessonNumber title')
      .sort({ createdAt: -1 });

    // Aggregate Bank Metrics
    const allExercises = await Exercise.find().select('status questions questionCount approvedQuestionCount');
    const totalExercises = allExercises.length;
    const publishedExercises = allExercises.filter((e) => e.status === 'published').length;
    const reviewExercises = allExercises.filter((e) => e.status === 'review').length;
    const totalQuestionsInBank = allExercises.reduce((acc, e) => acc + (e.questionCount || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalExercises,
        publishedExercises,
        reviewExercises,
        totalQuestionsInBank,
        exercises,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/exercises
 * Creates a new exercise associated with a lesson.
 */
export const createExercise = async (req, res, next) => {
  try {
    const { title, description, lessonId } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Exercise title is required.' });
    }

    if (!lessonId) {
      return res.status(400).json({ success: false, message: 'Please select an associated lesson.' });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Associated lesson not found.' });
    }

    const exercise = await Exercise.create({
      title: title.trim(),
      description: (description || '').trim(),
      lessonId: lesson._id,
      status: 'draft',
      questions: [],
      createdBy: req.user?._id || null,
    });

    res.status(201).json({
      success: true,
      message: 'Exercise created successfully.',
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/exercises/:id
 * Returns single exercise details and validation overview.
 */
export const getExerciseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id).populate('lessonId', 'lessonNumber title moduleNumber');

    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found.' });
    }

    const publishingCheck = validateExerciseForPublishing(exercise);

    const validCount = exercise.questions.filter((q) => q.importStatus === 'valid').length;
    const needsReviewCount = exercise.questions.filter((q) => q.importStatus === 'needs_review').length;
    const approvedCount = exercise.questions.filter((q) => q.approved === true).length;

    res.status(200).json({
      success: true,
      data: {
        exercise,
        stats: {
          totalQuestions: exercise.questions.length,
          validCount,
          needsReviewCount,
          approvedCount,
          canPublish: publishingCheck.canPublish,
          publishBlockers: publishingCheck.errors,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/exercises/:id
 * Updates exercise title, description, or associated lesson.
 */
export const updateExercise = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, lessonId } = req.body;

    const exercise = await Exercise.findById(id);
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found.' });
    }

    if (title !== undefined) exercise.title = title.trim();
    if (description !== undefined) exercise.description = description.trim();

    if (lessonId && lessonId !== exercise.lessonId?.toString()) {
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        return res.status(404).json({ success: false, message: 'Specified lesson does not exist.' });
      }
      exercise.lessonId = lesson._id;
    }

    await exercise.save();

    res.status(200).json({
      success: true,
      message: 'Exercise updated successfully.',
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/exercises/:id
 * Deletes an exercise and unlinks it from the lesson.
 */
export const deleteExercise = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found.' });
    }

    // Unlink from lesson if this exercise was linked
    await Lesson.updateMany({ exerciseId: id }, { exerciseId: null });
    await Exercise.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Exercise deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/exercises/:id/import
 * Uploads question & answer PDFs, extracts, parses, matches, validates, and stores questions.
 */
export const importExerciseDocuments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found.' });
    }

    const questionFile = req.files?.['questionFile']?.[0];
    const answerFile = req.files?.['answerFile']?.[0];

    if (!questionFile) {
      return res.status(400).json({
        success: false,
        message: 'Question document (PDF) is required. Please upload the question file.',
      });
    }

    if (!answerFile) {
      return res.status(400).json({
        success: false,
        message: 'Answer document (PDF) is required. Please upload the corresponding answer key.',
      });
    }

    // 1. Extract text from both PDF documents
    const [questionDoc, answerDoc] = await Promise.all([
      extractTextFromPdf(questionFile.buffer),
      extractTextFromPdf(answerFile.buffer),
    ]);

    if (!questionDoc.text || questionDoc.text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'The question document contains no selectable text (e.g. scanned image or empty PDF). Please upload a text-based PDF.',
      });
    }

    if (!answerDoc.text || answerDoc.text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'The answer document contains no selectable text (e.g. scanned image or empty PDF). Please upload a text-based PDF.',
      });
    }

    // 2. Parse questions
    const rawQuestions = parseQuestions(questionDoc.text);
    if (rawQuestions.length === 0) {
      console.warn('[Question Import] 0 questions detected. Extracted text sample (first 400 chars):\n', questionDoc.text.slice(0, 400));
      return res.status(400).json({
        success: false,
        message: 'No questions could be detected in the question document. Please check question formatting (e.g. 1. Question text, A. Option).',
        preview: questionDoc.text.slice(0, 150),
      });
    }

    // 3. Parse answers
    const { answerMap, rawCount: answerCount } = parseAnswers(answerDoc.text);
    if (answerMap.size === 0) {
      console.warn('[Answer Import] 0 answers detected. Extracted text sample (first 400 chars):\n', answerDoc.text.slice(0, 400));
      return res.status(400).json({
        success: false,
        message: 'No answers could be detected in the answer document. Please check answer formatting (e.g. 1. B, 2. C).',
        preview: answerDoc.text.slice(0, 150),
      });
    }

    // 4. Match questions with answers
    const { matchedQuestions, stats } = matchQuestionsAndAnswers(rawQuestions, answerMap);

    // 5. Run validation on each matched question
    const validatedQuestions = matchedQuestions.map((q) => {
      const v = validateQuestion(q);
      return {
        ...q,
        importStatus: v.importStatus,
        reviewNotes: v.reviewNotes,
        approved: false, // Must be approved by admin
      };
    });

    // 6. Update exercise atomically
    exercise.questions = validatedQuestions;
    exercise.status = 'review';
    exercise.sourceFiles = {
      questionFileName: questionFile.originalname,
      answerFileName: answerFile.originalname,
      uploadedAt: new Date(),
    };
    exercise.questionCount = validatedQuestions.length;
    exercise.approvedQuestionCount = 0;

    await exercise.save();

    const validCount = validatedQuestions.filter((q) => q.importStatus === 'valid').length;
    const needsReviewCount = validatedQuestions.filter((q) => q.importStatus === 'needs_review').length;

    res.status(200).json({
      success: true,
      message: `Successfully imported ${validatedQuestions.length} questions (${validCount} valid, ${needsReviewCount} need review).`,
      data: {
        exerciseId: exercise._id,
        totalQuestions: validatedQuestions.length,
        validCount,
        needsReviewCount,
        approvedCount: 0,
        answerCount,
        stats,
        questions: validatedQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/exercises/:id/questions
 * Returns questions for review.
 */
export const getExerciseQuestions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id).select('title status questions questionCount approvedQuestionCount');

    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found.' });
    }

    const validCount = exercise.questions.filter((q) => q.importStatus === 'valid').length;
    const needsReviewCount = exercise.questions.filter((q) => q.importStatus === 'needs_review').length;
    const approvedCount = exercise.questions.filter((q) => q.approved === true).length;

    res.status(200).json({
      success: true,
      data: {
        exerciseId: exercise._id,
        exerciseTitle: exercise.title,
        status: exercise.status,
        summary: {
          total: exercise.questions.length,
          validCount,
          needsReviewCount,
          approvedCount,
        },
        questions: exercise.questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/exercises/:id/questions/:questionId
 * Edits an individual question and re-runs validation.
 */
export const updateExerciseQuestion = async (req, res, next) => {
  try {
    const { id, questionId } = req.params;
    const { questionNumber, questionText, options, correctOption, explanation, reviewNotes } = req.body;

    const exercise = await Exercise.findById(id);
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found.' });
    }

    const question = exercise.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    if (questionNumber !== undefined) question.questionNumber = Number(questionNumber);
    if (questionText !== undefined) question.questionText = questionText.trim();
    if (options !== undefined && Array.isArray(options)) {
      question.options = options.map((o) => ({
        label: (o.label || '').toUpperCase().trim(),
        text: (o.text || '').trim(),
      }));
    }
    if (correctOption !== undefined) question.correctOption = correctOption.toUpperCase().trim();
    if (explanation !== undefined) question.explanation = explanation.trim();

    // Re-run validation on edited question
    const validation = validateQuestion(question);
    question.importStatus = validation.importStatus;
    question.reviewNotes = reviewNotes !== undefined ? reviewNotes.trim() : validation.reviewNotes;

    // If validation fails, force approved to false
    if (!validation.isValid) {
      question.approved = false;
    }

    await exercise.save();

    res.status(200).json({
      success: true,
      message: 'Question updated and re-validated successfully.',
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/exercises/:id/questions/:questionId/approve
 * Approves a single valid question. Blocks approval if question still has validation errors.
 */
export const approveExerciseQuestion = async (req, res, next) => {
  try {
    const { id, questionId } = req.params;
    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found.' });
    }

    const question = exercise.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    // Enforce validation before approving
    const validation = validateQuestion(question);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: `Cannot approve question: ${validation.errors.join(' ')} Please edit and fix errors before approving.`,
        errors: validation.errors,
      });
    }

    question.approved = true;
    question.importStatus = 'approved';
    question.reviewNotes = '';

    await exercise.save();

    res.status(200).json({
      success: true,
      message: `Question ${question.questionNumber} approved successfully.`,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/exercises/:id/approve-valid
 * Bulk approves all questions currently marked as 'valid'.
 * Never approves questions with 'needs_review'.
 */
export const approveAllValidQuestions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found.' });
    }

    let newlyApprovedCount = 0;

    for (const q of exercise.questions) {
      if (q.importStatus === 'valid' && !q.approved) {
        const v = validateQuestion(q);
        if (v.isValid) {
          q.approved = true;
          q.importStatus = 'approved';
          q.reviewNotes = '';
          newlyApprovedCount++;
        }
      }
    }

    await exercise.save();

    res.status(200).json({
      success: true,
      message: `Approved ${newlyApprovedCount} valid question(s).`,
      data: {
        newlyApprovedCount,
        approvedQuestionCount: exercise.approvedQuestionCount,
        totalQuestions: exercise.questions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/exercises/:id/publish
 * Publishes an exercise under strict conditions:
 * - At least 1 question exists.
 * - All questions pass validation.
 * - All questions are approved.
 * - Exercise has a valid lessonId.
 */
export const publishExercise = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found.' });
    }

    const { canPublish, errors, stats } = validateExerciseForPublishing(exercise);

    if (!canPublish) {
      return res.status(400).json({
        success: false,
        message: 'This exercise cannot be published until all questions have been reviewed and approved.',
        errors,
        stats,
      });
    }

    exercise.status = 'published';
    exercise.publishedAt = new Date();
    await exercise.save();

    // Link this exercise to the associated Lesson
    await Lesson.findByIdAndUpdate(exercise.lessonId, { exerciseId: exercise._id });

    res.status(200).json({
      success: true,
      message: 'Exercise published successfully and linked to lesson!',
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/exercises/:id/unpublish
 * Unpublishes an exercise (sets status to 'unpublished').
 */
export const unpublishExercise = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found.' });
    }

    exercise.status = 'unpublished';
    await exercise.save();

    res.status(200).json({
      success: true,
      message: 'Exercise unpublished.',
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

