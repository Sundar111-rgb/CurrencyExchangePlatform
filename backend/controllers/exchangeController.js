
import { getExchangeRates } from '../services/exchangeRateService.js';

export const convertCurrency = async (req, res) => {
  try {
    const { amount, from, to } = req.query;

    const numericAmount = Number(amount);

    if (
      amount === undefined ||
      amount === '' ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
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

    const sourceCurrency = from.toUpperCase();
    const targetCurrency = to.toUpperCase();

    if (sourceCurrency === targetCurrency) {
      return res.status(200).json({
        success: true,
        amount: numericAmount,
        from: sourceCurrency,
        to: targetCurrency,
        rate: 1,
        convertedAmount: numericAmount,
      });
    }

    const exchangeData = await getExchangeRates(sourceCurrency);
    const rate = exchangeData.rates[targetCurrency];

    if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported currency or exchange rate unavailable',
      });
    }

    const convertedAmount = Number(
      (numericAmount * rate).toFixed(6)
    );

    return res.status(200).json({
      success: true,
      amount: numericAmount,
      from: sourceCurrency,
      to: targetCurrency,
      rate,
      convertedAmount,
      lastUpdated: exchangeData.lastUpdated,
    });
  } catch (error) {
    console.error('Currency conversion error:', error.message);

    return res.status(502).json({
      success: false,
      message: 'Unable to retrieve exchange rates',
    });
  }
};


export const getRates = async (req, res) => {
  try {
    const base = (req.query.base || 'USD').toUpperCase();

    if (!/^[A-Z]{3}$/.test(base)) {
      return res.status(400).json({
        success: false,
        message: 'Provide a valid three-letter base currency code',
      });
    }

    const exchangeData = await getExchangeRates(base);

    return res.status(200).json({
      success: true,
      base: exchangeData.base,
      rates: exchangeData.rates,
      lastUpdated: exchangeData.lastUpdated,
    });
  } catch (error) {
    console.error('Fetching exchange rates failed:', error.message);

    return res.status(502).json({
      success: false,
      message: 'Unable to retrieve exchange rates',
    });
  }
};

