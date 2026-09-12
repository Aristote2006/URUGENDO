import { User } from '../models/User.js';

export const getAdminProfile = async (req, res, next) => {
  try {
    const admin = req.user;
    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const admin = await User.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    if (name) admin.name = name.trim();
    if (phone) admin.phone = phone.trim();

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

