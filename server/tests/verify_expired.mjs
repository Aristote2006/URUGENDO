import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const usersCol = db.collection('users');

  const testEmail = 'expired_test_customer@urugendo.rw';
  let user = await usersCol.findOne({ email: testEmail });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Test1234!', salt);

  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago

  if (!user) {
    const insertRes = await usersCol.insertOne({
      name: 'Expired Test User',
      email: testEmail,
      phone: '0788123456',
      passwordHash,
      role: 'customer',
      isActive: true,
      subscription: {
        status: 'active', // starts as active but past expiration date
        plan: 'monthly',
        startsAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
        expiresAt: pastDate,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('Created test expired customer with status active & expired date:', insertRes.insertedId);
  } else {
    await usersCol.updateOne(
      { email: testEmail },
      {
        $set: {
          'subscription.status': 'active', // reset to active to test transition
          'subscription.expiresAt': pastDate,
          'subscription.plan': 'monthly',
          isActive: true,
        },
      }
    );
    console.log('Reset test user to active with past expiration date');
  }

  // Now test login API
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'Test1234!',
    }),
  });

  const loginData = await loginRes.json();
  console.log('Login Response status:', loginRes.status);
  console.log('User subscription status after login:', loginData.user?.subscription?.status);

  if (loginData.user?.subscription?.status !== 'expired') {
    console.error('FAIL: Expected subscription.status to be "expired"');
    process.exit(1);
  }

  // Verify in DB directly
  const dbUser = await usersCol.findOne({ email: testEmail });
  console.log('DB subscription status directly from mongo:', dbUser.subscription.status);
  if (dbUser.subscription.status !== 'expired') {
    console.error('FAIL: Expected DB subscription.status to be "expired"');
    process.exit(1);
  }

  // Verify /api/auth/profile
  const profileRes = await fetch('http://localhost:5000/api/auth/profile', {
    headers: { Authorization: `Bearer ${loginData.token}` },
  });
  const profileData = await profileRes.json();
  console.log('Profile Response status:', profileRes.status);
  console.log('Profile subscription status:', profileData.user?.subscription?.status);

  if (profileData.user?.subscription?.status !== 'expired') {
    console.error('FAIL: Expected profile subscription.status to be "expired"');
    process.exit(1);
  }

  console.log('ALL TESTS PASSED: Expired subscription successfully detected and persisted!');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
