
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { getAllUsers } from '../controllers/userController.js';

const router = express.Router();

// Existing profile endpoint
router.get('/profile', authMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

// Admin-only users list
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

export default router;
