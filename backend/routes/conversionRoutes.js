
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createConversion } from '../controllers/conversionController.js';

const router = express.Router();

router.post('/', authMiddleware, createConversion);

export default router;
