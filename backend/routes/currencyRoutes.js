
import express from 'express';
import { getSupportedCurrencies } from '../controllers/currencyController.js';

const router = express.Router();

router.get('/', getSupportedCurrencies);

export default router;
