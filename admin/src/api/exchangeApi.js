
import api from './api';

export const getExchangeRates = async (base = 'USD') => {
  const response = await api.get('/exchange/rates', {
    params: { base },
  });

  return response.data;
};
