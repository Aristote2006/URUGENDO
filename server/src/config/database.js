import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // In development without active MongoDB daemon, log clear notice rather than exiting
    if (config.nodeEnv === 'development') {
      console.warn('[MongoDB] Running without active database connection. Connect MongoDB when implementing full data persistence in Phase 2.');
    } else {
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('[MongoDB] Disconnected');
});
