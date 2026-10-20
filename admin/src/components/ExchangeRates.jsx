
import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { getExchangeRates } from '../api/exchangeApi';

export default function ExchangeRates() {
  const [base, setBase] = useState('USD');
  const [rates, setRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getExchangeRates(base);

      if (
        !data.success ||
        !data.rates ||
        typeof data.rates !== 'object'
      ) {
        throw new Error('Invalid exchange rates response.');
      }

      setRates(data.rates);
      setLastUpdated(data.lastUpdated ?? null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load exchange rates.'
      );
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const filteredRates = Object.entries(rates)
    .filter(([currency, rate]) => {
      return (
        currency.toLowerCase().includes(search.trim().toLowerCase()) &&
        typeof rate === 'number' &&
        Number.isFinite(rate)
      );
    })
    .sort(([a], [b]) => a.localeCompare(b));

  const formatRate = (rate) =>
    rate.toLocaleString(undefined, {
      maximumFractionDigits: 6,
    });

  return (
    <section className="table-card">
      <div className="table-heading">
        <div>
          <h2>Exchange Rates</h2>
          <p>
            Live exchange rates retrieved from your backend.
          </p>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={fetchRates}
          disabled={loading}
          aria-label="Refresh exchange rates"
          title="Refresh rates"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="rate-filters">
        <input
          type="search"
          placeholder="Search currency (INR, EUR...)"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search currencies"
        />

        <select
          value={base}
          onChange={(event) => setBase(event.target.value)}
          aria-label="Select base currency"
        >
          {['USD', 'INR', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY'].map(
            (currency) => (
              <option key={currency} value={currency}>
                Base: {currency}
              </option>
            )
          )}
        </select>
      </div>

      <div className="users-summary">
        <span>
          Base currency: <strong>{base}</strong>
        </span>
        <span>
          Currencies: <strong>{Object.keys(rates).length}</strong>
        </span>
      </div>

      {lastUpdated && (
        <p className="exchange-updated">
          Last updated: {String(lastUpdated)}
        </p>
      )}

      {error && (
        <div className="users-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={fetchRates}>
            Try again
          </button>
        </div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Base Currency</th>
              <th>Target Currency</th>
              <th>Exchange Rate</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3}>Loading exchange rates...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3}>Unable to load exchange rates.</td>
              </tr>
            ) : filteredRates.length === 0 ? (
              <tr>
                <td colSpan={3}>No matching currencies found.</td>
              </tr>
            ) : (
              filteredRates.map(([currency, rate]) => (
                <tr key={`${base}-${currency}`}>
                  <td>{base}</td>
                  <td>{currency}</td>
                  <td>{formatRate(rate)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
