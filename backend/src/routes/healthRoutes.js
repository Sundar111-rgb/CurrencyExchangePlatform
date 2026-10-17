import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', (req, res) => {
  const databaseConnected =
    mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected
      ? 'Currency Exchange API is healthy'
      : 'Database is not connected',
    database: databaseConnected ? 'connected' : 'disconnected',
  });
});

export default router;