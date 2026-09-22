import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config/env.js';

/**
 * Verifies JWT token and attaches authenticated user to req.user.
 */
export const authenticateUser = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Fetch user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated.',
      });
    }

    // Auto-check and persist subscription expiration if past expiresAt date
    if (user.subscription?.status === 'active' && user.subscription?.expiresAt) {
      if (new Date(user.subscription.expiresAt) < new Date()) {
        user.subscription.status = 'expired';
        await user.save();
      }
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.',
      });
    }
    next(error);
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Administrator privileges required to access this resource.',
    });
  }
  next();
};

/**
 * Enforces active customer subscription.
 * Blocks expired or pending subscriptions from accessing learning resources.
 */
export const requireActiveSubscription = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  const sub = req.user?.subscription;
  if (!sub || sub.status !== 'active') {
    return res.status(403).json({
      success: false,
      code: 'SUBSCRIPTION_REQUIRED',
      message: 'An active subscription is required to access learning materials. Please renew your subscription.',
    });
  }
  next();
};

// Aliases for legacy/generic usage
export const protect = authenticateUser;
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user?.role || 'anonymous'}' cannot perform this action`,
      });
    }
    next();
  };
};
