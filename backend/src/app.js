
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import exchangeRoutes from '../routes/exchangeRoutes.js';
import currencyRoutes from '../routes/currencyRoutes.js';
import conversionRoutes from '../routes/conversionRoutes.js';
import historyRoutes from '../routes/historyRoutes.js';
import adminRoutes from '../routes/adminRoutes.js';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGINS
      ? process.env.CLIENT_ORIGINS
          .split(',')
          .map((origin) => origin.trim())
      : [],
  })
);

app.use(express.json({ limit: '10kb' }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

// Register all routes before the 404 handler
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/currencies', currencyRoutes);
app.use('/api/conversions', conversionRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);
// Keep this last
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;
