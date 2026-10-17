
const API_BASE_URL = 'https://open.er-api.com/v6/latest';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const rateCache = new Map();

export const getExchangeRates = async (base = 'USD') => {
  if (typeof base !== 'string' || !/^[A-Z]{3}$/.test(base)) {
    throw new Error('Base currency must be a 3-letter uppercase code');
  }

  const cached = rateCache.get(base);

  if (cached && Date.now() < cached.expiresAt) {
    console.log(`Cache HIT: ${base}`);
    return cached.data;
  }

  console.log(`Cache MISS: ${base}`);

  const response = await fetch(`${API_BASE_URL}/${base}`, {
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error('Exchange rate provider request failed');
  }

  const data = await response.json();

  if (
    data.result !== 'success' ||
    data.base_code !== base ||
    !data.rates ||
    typeof data.rates !== 'object'
  ) {
    throw new Error('Invalid exchange rate provider response');
  }

  const result = {
    base: data.base_code,
    rates: data.rates,
    lastUpdated: data.time_last_update_utc,
  };

  rateCache.set(base, {
    data: result,
    expiresAt: Date.now() + CACHE_TTL,
  });

  return result;
};
