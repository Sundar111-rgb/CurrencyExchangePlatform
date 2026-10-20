
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeftRight, CircleAlert, RefreshCw } from 'lucide-react';
import { getAdminConversionHistory } from '../api/adminApi';
import './Dashboard.css';

function formatAmount(value) {
  const amount = Number(value);

  return value !== null && value !== undefined && value !== '' &&
    Number.isFinite(amount)
    ? amount.toLocaleString(undefined, { maximumFractionDigits: 4 })
    : '—';
}

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
}

export default function ConversionHistory() {
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = useCallback(async (page = 1, refresh = false) => {
    try {
      setLoading(true);
      setRefreshing(refresh);
      setError('');

      const data = await getAdminConversionHistory(page, 10);

      if (data?.success === false) {
        throw new Error(data.message || 'Unable to load conversion history');
      }

      // Support either a direct response or an Axios-style response.
      const result = data?.data ?? data;
      const records = result?.conversions;

      if (!Array.isArray(records)) {
        throw new Error(
          'Unexpected API response. Expected a conversions array.'
        );
      }

      const pageInfo = result.pagination ?? {};

      setHistory(records);
      setPagination({
        page: Number(pageInfo.page) || page,
        limit: Number(pageInfo.limit) || 10,
        total: Number(pageInfo.total) || 0,
        totalPages: Number(pageInfo.totalPages) || 0,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load conversion history'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(1);
  }, [fetchHistory]);

  return (
    <section className="dashboard-panel dashboard-table-panel">
      <div className="dashboard-panel-heading">
        <div>
          <h3>Conversion History</h3>
          <p>{pagination.total} total conversion records</p>
        </div>

        <button
          type="button"
          className="dashboard-refresh-button"
          onClick={() => fetchHistory(pagination.page, true)}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'refresh-spinning' : ''}
          />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="dashboard-inline-error" role="alert">
          <CircleAlert size={17} />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => fetchHistory(pagination.page)}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="dashboard-empty-state">
          <p>Loading conversion history from API...</p>
        </div>
      ) : error ? null : history.length === 0 ? (
        <div className="dashboard-empty-state">
          <ArrowLeftRight size={30} />
          <p>No conversion history found.</p>
        </div>
      ) : (
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>User</th>
                <th>Currency Pair</th>
                <th>Amount</th>
                <th>Exchange Rate</th>
                <th>Converted Amount</th>
                <th>Date &amp; Time</th>
              </tr>
            </thead>

            <tbody>
              {history.map((conversion) => (
                <tr key={conversion._id}>
                  <td className="transaction-id">
                    {conversion._id || '—'}
                  </td>

                  <td>
                    {conversion.user?.name ||
                      conversion.user?.email ||
                      'Unknown user'}
                  </td>

                  <td>
                    {conversion.fromCurrency || '—'} →{' '}
                    {conversion.toCurrency || '—'}
                  </td>

                  <td>
                    {formatAmount(conversion.amount)}{' '}
                    {conversion.fromCurrency || ''}
                  </td>

                  <td>{formatAmount(conversion.exchangeRate)}</td>

                  <td className="dashboard-converted-amount">
                    {formatAmount(conversion.convertedAmount)}{' '}
                    {conversion.toCurrency || ''}
                  </td>

                  <td>{formatDate(conversion.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="dashboard-history-pagination">
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <div>
          <button
            type="button"
            disabled={loading || pagination.page <= 1}
            onClick={() => fetchHistory(pagination.page - 1)}
          >
            Previous
          </button>

          <button
            type="button"
            disabled={
              loading ||
              pagination.totalPages === 0 ||
              pagination.page >= pagination.totalPages
            }
            onClick={() => fetchHistory(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
