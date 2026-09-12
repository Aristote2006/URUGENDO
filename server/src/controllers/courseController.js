/**
 * Course and Lesson Controller Stubs
 */

export const getCourses = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Courses listing endpoint ready.',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json({
      success: true,
      message: `Course details endpoint ready for ID: ${id}`,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
