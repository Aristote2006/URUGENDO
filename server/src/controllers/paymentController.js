import { Payment } from '../models/Payment.js';
import { User } from '../models/User.js';

const PLAN_PRICES = {
  daily: 500,
  weekly: 1500,
  monthly: 3000,
};

/**
 * Submit payment proof by authenticated customer
 */
export const submitPaymentProof = async (req, res, next) => {
  try {
    const { plan, paymentPhone, paymentMethod, proofNote } = req.body;
    const user = req.user;

    const selectedPlan = plan || user.subscription?.plan || 'monthly';
    const amount = PLAN_PRICES[selectedPlan] || 3000;

    const payment = await Payment.create({
      user: user._id,
      plan: selectedPlan,
      amount,
      currency: 'RWF',
      paymentMethod: paymentMethod || 'mtn_momo',
      paymentPhoneNumber: paymentPhone || user.phone || '',
      proofNote: proofNote || '',
      status: 'pending',
      submittedAt: new Date(),
    });

    // Update user subscription state to awaiting_verification
    if (!user.subscription) user.subscription = {};
    user.subscription.status = 'awaiting_verification';
    user.subscription.plan = selectedPlan;
    user.subscription.rejectionReason = '';
    user.subscription.paymentDetails = {
      phone: paymentPhone || user.phone || '',
      method: paymentMethod || 'mtn_momo',
      submittedAt: new Date(),
      proofNote: proofNote || '',
    };
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Payment proof submitted. Awaiting administrator verification.',
      data: {
        payment,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user's payment and subscription status
 */
export const getMyPaymentStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const latestPayment = await Payment.findOne({ user: user._id }).sort({ createdAt: -1 });

    const subscriptionStatus = user.subscription?.status || 'pending_payment';
    const isVerified = subscriptionStatus === 'active';
    const isRejected = subscriptionStatus === 'rejected' || latestPayment?.status === 'rejected';
    const isAwaiting = subscriptionStatus === 'awaiting_verification';

    const rejectionReason =
      user.subscription?.rejectionReason ||
      latestPayment?.rejectionReason ||
      'Payment has not been received yet. Please check your transaction to confirm if it was successful.';

    res.status(200).json({
      success: true,
      data: {
        status: subscriptionStatus,
        plan: user.subscription?.plan,
        isVerified,
        isRejected,
        isAwaiting,
        rejectionReason: isRejected ? rejectionReason : '',
        payment: latestPayment,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          subscription: user.subscription,
          progress: user.progress,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const initiatePayment = async (req, res, next) => {
  try {
    const { packageType, provider, phone } = req.body;
    res.status(200).json({
      success: true,
      message: 'Payment initiation architecture prepared for Phase 2 integration.',
      data: {
        packageType,
        provider,
        phone,
        status: 'pending',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;
    const payment = await Payment.findOne({ reference });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment reference not found' });
    }
    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};
