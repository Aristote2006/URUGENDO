/**
 * Traffic Signs Controller Stubs
 */

export const getTrafficSigns = async (req, res, next) => {
  try {
    const { category } = req.query;
    res.status(200).json({
      success: true,
      message: 'Traffic signs library endpoint ready.',
      filterCategory: category || 'all',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};
