
import { getExchangeRates } from './services/exchangeRateService.js';

try {
  const result = await getExchangeRates('USD');

  console.log('Base currency:', result.base);
  console.log('USD to INR:', result.rates.INR);
  console.log('Last updated:', result.lastUpdated);
} catch (error) {
  console.error('Exchange rate test failed:', error.message);
}
