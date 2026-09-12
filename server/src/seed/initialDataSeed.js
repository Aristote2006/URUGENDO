import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Payment } from '../models/Payment.js';
import { Subscription } from '../models/Subscription.js';

export const seedInitialData = async () => {
  try {
    const customerCount = await User.countDocuments({ role: 'customer' });
    if (customerCount > 0) {
      return; // Already populated
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Student@2026', salt);

    // Create 3 sample customers
    const user1 = await User.create({
      name: 'Eric Manzi',
      email: 'eric.manzi@gmail.com',
      phone: '0788123456',
      passwordHash,
      role: 'customer',
      isActive: true,
      subscription: {
        status: 'active',
        plan: 'monthly',
        startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        paymentDetails: {
          phone: '0788123456',
          method: 'mtn_momo',
          submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const user2 = await User.create({
      name: 'Diane Uwase',
      email: 'diane.uwase@yahoo.com',
      phone: '0733987654',
      passwordHash,
      role: 'customer',
      isActive: true,
      subscription: {
        status: 'awaiting_verification',
        plan: 'weekly',
        startedAt: null,
        expiresAt: null,
        paymentDetails: {
          phone: '0733987654',
          method: 'airtel_money',
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          proofNote: 'Sent 1,500 RWF via Airtel Money transaction ID #TX88291.',
        },
      },
    });

    const user3 = await User.create({
      name: 'Fabrice Kwizera',
      email: 'fabrice.kwizera@gmail.com',
      phone: '0781223344',
      passwordHash,
      role: 'customer',
      isActive: true,
      subscription: {
        status: 'pending_payment',
        plan: 'daily',
      },
    });

    const user4 = await User.create({
      name: 'Jeannette Mukamana',
      email: 'jeannette.muka@gmail.com',
      phone: '0785667788',
      passwordHash,
      role: 'customer',
      isActive: true,
      subscription: {
        status: 'expired',
        plan: 'daily',
        startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    });

    // Create corresponding payments
    const pay1 = await Payment.create({
      user: user1._id,
      plan: 'monthly',
      amount: 3000,
      currency: 'RWF',
      paymentMethod: 'mtn_momo',
      paymentPhoneNumber: '0788123456',
      status: 'verified',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      verifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      reference: 'PAY-MOMO-882193',
    });

    await Subscription.create({
      user: user1._id,
      plan: 'monthly',
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'active',
      payment: pay1._id,
    });

    const pay2 = await Payment.create({
      user: user2._id,
      plan: 'weekly',
      amount: 1500,
      currency: 'RWF',
      paymentMethod: 'airtel_money',
      paymentPhoneNumber: '0733987654',
      proofNote: 'Sent 1,500 RWF via Airtel Money transaction ID #TX88291.',
      status: 'pending',
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      reference: 'PAY-AIRTEL-449120',
    });

    console.log('[Initial Seed] Created sample customer data for initial dashboard demonstration.');
  } catch (error) {
    console.error(`[Initial Seed] Error: ${error.message}`);
  }
};

