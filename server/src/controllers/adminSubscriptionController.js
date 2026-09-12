import { Subscription } from '../models/Subscription.js';
import { User } from '../models/User.js';

/**
 * Get Paginated Subscriptions List
 */
export const getSubscriptions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, plan } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (plan && plan !== 'all') {
      query.plan = plan;
    }

    const total = await Subscription.countDocuments(query);
    const subscriptions = await Subscription.find(query)
      .populate('user', 'name email phone subscription')
      .populate('payment', 'amount currency paymentMethod paymentPhoneNumber status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        subscriptions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

