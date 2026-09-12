/**
 * Mock Exam and Practice Controller Stubs
 */

export const getMockExams = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Mock exams listing endpoint ready.',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

export const submitExamAttempt = async (req, res, next) => {
  try {
    const { examId, answers } = req.body;
    res.status(200).json({
      success: true,
      message: 'Exam submission endpoint ready.',
      data: { examId, score: null, passed: false },
    });
  } catch (error) {
    next(error);
  }
};
