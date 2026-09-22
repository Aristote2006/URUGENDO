/**
 * Urugendo Question + Answer Matcher
 * Matches questions and answers strictly by questionNumber with safety rules.
 */

/**
 * Matches parsed questions with parsed answers.
 * @param {Array<object>} questions - Parsed questions from question document
 * @param {Map<number, string>} answerMap - Map of questionNumber -> correctOption
 * @returns {{ matchedQuestions: Array<object>, stats: object }}
 */
export const matchQuestionsAndAnswers = (questions, answerMap) => {
  if (!Array.isArray(questions)) {
    return { matchedQuestions: [], stats: { total: 0, matched: 0, missingAnswers: 0, orphanAnswers: [] } };
  }

  const seenNumbers = new Set();
  const matchedNumbers = new Set();
  let missingAnswersCount = 0;

  const matchedQuestions = questions.map((q) => {
    const qNum = q.questionNumber;
    const notes = q.reviewNotes ? [q.reviewNotes] : [];

    // Check duplicate question number
    if (seenNumbers.has(qNum)) {
      notes.push(`Duplicate question number ${qNum} detected in question document.`);
      q.importStatus = 'needs_review';
    } else {
      seenNumbers.add(qNum);
    }

    const availableLabels = (q.options || []).map((o) => o.label.toUpperCase());
    const availableLabelsStr = availableLabels.join(', ') || 'none';

    // Look up answer by questionNumber
    if (answerMap && answerMap.has(qNum)) {
      const correctLetter = answerMap.get(qNum).toUpperCase();
      matchedNumbers.add(qNum);
      q.correctOption = correctLetter;

      // Validate option availability
      if (availableLabels.includes(correctLetter)) {
        // Valid match! Only preserve valid status if no other errors exist
        if (notes.length === 0 && q.options.length >= 2 && q.questionText) {
          q.importStatus = 'valid';
        }
      } else {
        // Answer letter is out of bounds (e.g. answer is E, but options are A-D)
        notes.push(
          `Detected answer "${correctLetter}", but available options are only [${availableLabelsStr}].`
        );
        q.importStatus = 'needs_review';
      }
    } else {
      // Missing answer in answer document
      q.correctOption = '';
      missingAnswersCount++;
      notes.push(`No matching answer found in answer document for question ${qNum}.`);
      q.importStatus = 'needs_review';
    }

    q.reviewNotes = notes.join(' ').trim();
    q.approved = false; // Always starts unapproved

    return q;
  });

  // Check for orphan answers (answers that do not belong to any question)
  const orphanAnswers = [];
  if (answerMap) {
    for (const [ansNum, letter] of answerMap.entries()) {
      if (!seenNumbers.has(ansNum)) {
        orphanAnswers.push({ questionNumber: ansNum, answer: letter });
      }
    }
  }

  return {
    matchedQuestions,
    stats: {
      totalQuestions: questions.length,
      matchedCount: matchedNumbers.size,
      missingAnswersCount,
      orphanAnswersCount: orphanAnswers.length,
      orphanAnswers,
    },
  };
};

export default {
  matchQuestionsAndAnswers,
};

