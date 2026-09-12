import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config/env.js';

/**
 * Generate Admin JWT Token
 */
const generateAdminToken = (adminUser) => {
  return jwt.sign(
    {
      id: adminUser._id,
      email: adminUser.email,
      role: 'admin',
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

/**
 * Administrator Login
 * Dedicated route for administrators only.
 */
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide administrator email and password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query user with admin role
    const admin = await User.findOne({ email: normalizedEmail, role: 'admin' });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.',
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Administrator account is currently deactivated.',
      });
    }

    // Compare bcrypt password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.',
      });
    }

    const token = generateAdminToken(admin);

    res.status(200).json({
      success: true,
      message: 'Administrator authentication successful.',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current Admin profile
 */
export const getAdminMe = async (req, res, next) => {
  try {
    const admin = req.user;
    res.status(200).json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Administrator Logout
 */
export const adminLogout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Administrator logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

