import { User } from '../models/User.js';
import { Payment } from '../models/Payment.js';
import { Subscription } from '../models/Subscription.js';

/**
 * Get Paginated Customers List
 */
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, status } = req.query;

    const query = { role: 'customer' };

    // Search filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    // Subscription status filter
    if (status && status !== 'all') {
      query['subscription.status'] = status;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        users,
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

/**
 * Get Customer Details with Subscription and Payment History
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found.',
      });
    }

    // Fetch payments for this user
    const payments = await Payment.find({ user: user._id }).sort({
      createdAt: -1,
    });

    // Fetch subscriptions history for this user
    const subscriptions = await Subscription.find({ user: user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        payments,
        subscriptions,
      },
    });
  } catch (error) {
    next(error);
  }
};

