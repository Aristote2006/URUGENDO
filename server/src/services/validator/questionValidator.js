/**
 * Urugendo Question & Exercise Validation Engine
 * Enforces strict data integrity and publishing safety rules.
 */

/**
 * Validates a single question object.
 * @param {object} question - Question object to validate
 * @returns {{ isValid: boolean, importStatus: 'valid'|'needs_review'|'approved', reviewNotes: string, errors: string[] }}
 */
export const validateQuestion = (question) => {
  const errors = [];

  if (!question) {
    return {
      isValid: false,
      importStatus: 'needs_review',
      reviewNotes: 'Question data is missing.',
      errors: ['Question data is missing.'],
    };
  }

  // 1. Question Number
  if (
    question.questionNumber === undefined ||
    question.questionNumber === null ||
    isNaN(Number(question.questionNumber)) ||
    Number(question.questionNumber) <= 0
  ) {
    errors.push('Valid question number is required.');
  }

  // 2. Question Text
  if (!question.questionText || typeof question.questionText !== 'string' || question.questionText.trim().length === 0) {
    errors.push('Question text cannot be empty.');
  }

  // 3. Options
  const options = Array.isArray(question.options) ? question.options : [];
  if (options.length < 2) {
    errors.push(`At least 2 options are required (found ${options.length}).`);
  }

  const seenLabels = new Set();
  const optionLabels = [];

  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    const label = (opt.label || '').trim().toUpperCase();
    const text = (opt.text || '').trim();

    if (!label) {
      errors.push(`Option at index ${i + 1} is missing a label.`);
    } else {
      if (seenLabels.has(label)) {
        errors.push(`Duplicate option label "${label}" detected.`);
      }
      seenLabels.add(label);
      optionLabels.push(label);
    }

    if (!text) {
      errors.push(`Option "${label || i + 1}" text cannot be empty.`);
    }
  }

  // 4. Correct Answer
  const correctOption = (question.correctOption || '').trim().toUpperCase();
  if (!correctOption) {
    errors.push('Correct answer is required.');
  } else if (!optionLabels.includes(correctOption)) {
    errors.push(
      `Correct answer "${correctOption}" does not match any available option [${optionLabels.join(', ')}].`
    );
  }

  const isValid = errors.length === 0;

  let importStatus = 'needs_review';
  if (isValid) {
    importStatus = question.approved ? 'approved' : 'valid';
  }

  return {
    isValid,
    importStatus,
    reviewNotes: errors.join(' '),
    errors,
  };
};

/**
 * Validates whether an exercise can be published.
 * An exercise can ONLY be published when:
 * 1. At least 1 question exists.
 * 2. Every question passes validation.
 * 3. Every question is approved (approved === true).
 * 4. Exercise has a valid lessonId.
 *
 * @param {object} exercise - Full Exercise document
 * @returns {{ canPublish: boolean, errors: string[] }}
 */
export const validateExerciseForPublishing = (exercise) => {
  const errors = [];

  if (!exercise) {
    return { canPublish: false, errors: ['Exercise not found.'] };
  }

  if (!exercise.lessonId) {
    errors.push('Exercise must be associated with a valid Lesson.');
  }

  const questions = Array.isArray(exercise.questions) ? exercise.questions : [];
  if (questions.length === 0) {
    errors.push('Exercise must contain at least 1 question to be published.');
  }

  let unapprovedCount = 0;
  let invalidCount = 0;

  for (const q of questions) {
    const validation = validateQuestion(q);
    if (!validation.isValid) {
      invalidCount++;
    }
    if (!q.approved) {
      unapprovedCount++;
    }
  }

  if (invalidCount > 0) {
    errors.push(`${invalidCount} question(s) still have validation errors and need review.`);
  }

  if (unapprovedCount > 0) {
    errors.push(`${unapprovedCount} question(s) have not been approved yet. All questions must be approved.`);
  }

  return {
    canPublish: errors.length === 0,
    errors,
    stats: {
      total: questions.length,
      invalidCount,
      unapprovedCount,
      approvedCount: questions.length - unapprovedCount,
    },
  };
};

export default {
  validateQuestion,
  validateExerciseForPublishing,
};

