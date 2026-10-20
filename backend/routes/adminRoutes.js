
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

import {
  getAdminDashboard,
  getDashboardStats,
} from '../controllers/adminController.js';

const router = express.Router();

// Main dashboard: admin details + live statistics + recent conversions.
router.get(
  '/dashboard',
  authMiddleware,
  adminMiddleware,
  getAdminDashboard
);

// Separate endpoint: existing statistics response.
router.get(
  '/stats',
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

export default router;
