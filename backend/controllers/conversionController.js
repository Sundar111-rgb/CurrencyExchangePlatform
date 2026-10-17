
import Conversion from '../models/Conversion.js';
import { getExchangeRates } from '../services/exchangeRateService.js';

export const createConversion = async (req, res) => {
  try {
    const { amount, from, to } = req.body;

    if (
      amount === undefined ||
      amount === '' ||
      typeof amount !== 'number' ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    if (
      typeof from !== 'string' ||
      typeof to !== 'string' ||
      !/^[A-Za-z]{3}$/.test(from) ||
      !/^[A-Za-z]{3}$/.test(to)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Provide valid three-letter currency codes',
      });
    }

    const fromCurrency = from.toUpperCase();
    const toCurrency = to.toUpperCase();

    let exchangeRate = 1;
    let rateTimestamp = null;

    if (fromCurrency !== toCurrency) {
      const exchangeData = await getExchangeRates(fromCurrency);
      exchangeRate = exchangeData.rates[toCurrency];
      rateTimestamp = exchangeData.lastUpdated
        ? new Date(exchangeData.lastUpdated)
        : null;

      if (
        typeof exchangeRate !== 'number' ||
        !Number.isFinite(exchangeRate) ||
        exchangeRate <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'Exchange rate unavailable for this currency',
        });
      }
    }

    const convertedAmount = Number(
      (amount * exchangeRate).toFixed(6)
    );

    const conversion = await Conversion.create({
      user: req.user.id,
      fromCurrency,
      toCurrency,
      amount,
      exchangeRate,
      convertedAmount,
      rateTimestamp,
    });

    return res.status(201).json({
      success: true,
      message: 'Conversion completed and history saved',
      conversion: {
        id: conversion._id,
        amount,
        from: fromCurrency,
        to: toCurrency,
        exchangeRate,
        convertedAmount,
        createdAt: conversion.createdAt,
      },
    });
  } catch (error) {
    console.error('Create conversion error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to complete conversion',
    });
  }
};
