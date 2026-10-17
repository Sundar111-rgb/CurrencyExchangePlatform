
import express from 'express';
import {
  convertCurrency,
  getRates,
} from '../controllers/exchangeController.js';

const router = express.Router();

router.get('/convert', convertCurrency);
router.get('/rates', getRates);

export default router;
