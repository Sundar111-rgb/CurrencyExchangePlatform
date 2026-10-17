
import { getExchangeRates } from '../services/exchangeRateService.js';

export const getSupportedCurrencies = async (req, res) => {
  try {
    const data = await getExchangeRates('USD');

    const currencies = Object.keys(data.rates)
      .sort()
      .map((code) => ({
        code,
        name: code,
      }));

    return res.status(200).json({
      success: true,
      base: data.base,
      count: currencies.length,
      currencies,
      lastUpdated: data.lastUpdated,
    });
  } catch (error) {
    console.error('Supported currencies error:', error.message);

    return res.status(502).json({
      success: false,
      message: 'Unable to retrieve supported currencies',
    });
  }
};
