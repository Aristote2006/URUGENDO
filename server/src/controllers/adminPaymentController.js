import { Payment } from '../models/Payment.js';
import { User } from '../models/User.js';
import { Subscription } from '../models/Subscription.js';

const PLAN_DURATIONS = {
  daily: 1 * 24 * 60 * 60 * 1000, // 1 day
  weekly: 7 * 24 * 60 * 60 * 1000, // 7 days
  monthly: 30 * 24 * 60 * 60 * 1000, // 30 days
};

/**
 * Get Paginated Payments List
 */
export const getPayments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, search } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { reference: searchRegex },
        { paymentPhoneNumber: searchRegex },
      ];
    }

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('user', 'name email phone')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        payments,
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
 * Get Payment Details by ID
 */
export const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate('user', 'name email phone subscription')
      .populate('verifiedBy', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify and Approve Payment
 * Activates customer subscription based on verified plan duration.
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found.',
      });
    }

    if (payment.status === 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Payment is already verified.',
      });
    }

    // Update payment record
    payment.status = 'verified';
    payment.verifiedAt = new Date();
    payment.verifiedBy = req.user._id;
    await payment.save();

    // Compute expiration duration
    const durationMs = PLAN_DURATIONS[payment.plan] || PLAN_DURATIONS.monthly;
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + durationMs);

    // Update User account subscription state
    const user = await User.findById(payment.user);
    if (user) {
      user.subscription = {
        status: 'active',
        plan: payment.plan,
        startedAt,
        expiresAt,
        rejectionReason: '',
        paymentDetails: {
          phone: payment.paymentPhoneNumber || user.phone,
          method: payment.paymentMethod,
          submittedAt: payment.submittedAt || new Date(),
          proofNote: payment.proofNote || '',
        },
      };
      await user.save();
    }

    // Create or update subscription record
    await Subscription.create({
      user: payment.user,
      plan: payment.plan,
      startDate: startedAt,
      endDate: expiresAt,
      status: 'active',
      payment: payment._id,
    });

    const populatedPayment = await Payment.findById(id)
      .populate('user', 'name email phone subscription')
      .populate('verifiedBy', 'name email');

    res.status(200).json({
      success: true,
      message: `Payment verified successfully. Customer subscription activated for ${payment.plan} plan.`,
      data: populatedPayment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reject Payment
 */
export const rejectPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found.',
      });
    }

    const rejectionReason = reason?.trim() || 'Payment has not been received yet. Please check if your payment was successful.';
    payment.status = 'rejected';
    payment.rejectionReason = rejectionReason;
    payment.verifiedAt = new Date();
    payment.verifiedBy = req.user._id;
    await payment.save();

    // Update customer User subscription status to rejected
    const user = await User.findById(payment.user);
    if (user) {
      if (!user.subscription) user.subscription = {};
      user.subscription.status = 'rejected';
      user.subscription.rejectionReason = rejectionReason;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment has been rejected.',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

