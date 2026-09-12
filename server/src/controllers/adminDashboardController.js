import { User } from '../models/User.js';
import { Payment } from '../models/Payment.js';
import { Subscription } from '../models/Subscription.js';

/**
 * Get Real Aggregated Platform Statistics for Admin Dashboard
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    // Counts from MongoDB Atlas
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const activeSubscriptions = await User.countDocuments({
      'subscription.status': 'active',
    });
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const expiredSubscriptions = await User.countDocuments({
      'subscription.status': 'expired',
    });

    // Plan distribution
    const dailyCount = await User.countDocuments({
      'subscription.plan': 'daily',
    });
    const weeklyCount = await User.countDocuments({
      'subscription.plan': 'weekly',
    });
    const monthlyCount = await User.countDocuments({
      'subscription.plan': 'monthly',
    });

    // Recent 5 customers
    const recentUsers = await User.find({ role: 'customer' })
      .select('name email phone subscription createdAt isActive')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 payments
    const recentPayments = await Payment.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCustomers,
        activeSubscriptions,
        pendingPayments,
        expiredSubscriptions,
        planDistribution: {
          daily: dailyCount,
          weekly: weeklyCount,
          monthly: monthlyCount,
        },
        recentUsers,
        recentPayments,
      },
    });
  } catch (error) {
    next(error);
  }
};

