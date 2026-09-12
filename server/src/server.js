import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import { connectDB } from './config/database.js';
import { seedAdmin } from './seed/adminSeed.js';
import { seedInitialData } from './seed/initialDataSeed.js';
import apiRouter from './routes/api.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security middleware
app.use(helmet());

// Allowed CORS origins (Vite dev server, localhost:3000, and configured clientUrl)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  config.clientUrl,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev mode for seamless local integration
    },
    credentials: true,
  })
);

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Urugendo API - Learn Rwandan Traffic Rules',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// API Routes
app.use('/api', apiRouter);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Initialize DB, seed admin, and start server
const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();
    await seedInitialData();

    app.listen(config.port, '0.0.0.0', () => {
      console.log(
        `[Urugendo Server] Running in ${config.nodeEnv} mode on http://localhost:${config.port}`
      );
    });
  } catch (err) {
    console.error(`[Urugendo Server] Startup failure: ${err.message}`);
    process.exit(1);
  }
};

startServer();

export default app;
