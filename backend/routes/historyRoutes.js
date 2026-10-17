
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getConversionHistory } from '../controllers/historyController.js';

const router = express.Router();

router.get('/', authMiddleware, getConversionHistory);

export default router;
