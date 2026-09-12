import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { config } from '../config/env.js';

/**
 * Seeds the single Urugendo Administrator account if it does not exist.
 * Uses environment variables ADMIN_EMAIL and ADMIN_PASSWORD.
 */
export const seedAdmin = async () => {
  try {
    const adminEmail = (config.adminEmail || 'admin@urugendo.com').trim().toLowerCase();
    const adminPassword = config.adminPassword || 'Admin@2026';

    // Check if an admin with this email or role already exists
    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { role: 'admin' }],
    });

    if (existingAdmin) {
      console.log(`[Admin Seed] Administrator account already initialized: ${existingAdmin.email}`);
      return existingAdmin;
    }

    // Hash the administrator password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const admin = await User.create({
      name: 'Urugendo Administrator',
      email: adminEmail,
      phone: '0784227283',
      passwordHash,
      role: 'admin',
      isActive: true,
      subscription: {
        status: 'active',
        plan: 'monthly',
      },
    });

    console.log(`[Admin Seed] Successfully created single administrator account: ${admin.email}`);
    return admin;
  } catch (error) {
    console.error(`[Admin Seed] Error seeding administrator account: ${error.message}`);
    throw error;
  }
};

