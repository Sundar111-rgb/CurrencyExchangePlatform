
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

import {
  getAdminDashboard,
  getDashboardStats,
  getAdminConversionHistory,
} from '../controllers/adminController.js';

const router = express.Router();

// Main dashboard: admin details, live statistics, recent conversions.
router.get(
  '/dashboard',
  authMiddleware,
  adminMiddleware,
  getAdminDashboard
);

// Existing dashboard statistics endpoint.
router.get(
  '/stats',
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

// All users' conversion history with pagination.
router.get(
  '/conversions',
  authMiddleware,
  adminMiddleware,
  getAdminConversionHistory
);

export default router;
