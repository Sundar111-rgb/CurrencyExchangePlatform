
import { useCallback, useEffect, useState } from 'react';
import {
  Users,
  ArrowLeftRight,
  TrendingUp,
  ShieldCheck,
  Activity,
  RefreshCw,
  CircleAlert,
} from 'lucide-react';
import './Dashboard.css';

import {
  getAdminDashboard,
  getAdminConversionHistory,
} from '../api/adminApi';

function formatNumber(value) {
  return typeof value === 'number'
    ? value.toLocaleString()
    : '—';
}

function formatAmount(value) {
  return typeof value === 'number'
    ? value.toLocaleString(undefined, {
        maximumFractionDigits: 4,
      })
    : '—';
}

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString();
}

export default function Dashboard() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentConversions, setRecentConversions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [history, setHistory] = useState([]);
const [historyPagination, setHistoryPagination] = useState({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});
const [historyLoading, setHistoryLoading] = useState(false);
const [historyError, setHistoryError] = useState('');

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const data = await getAdminDashboard();

      if (!data?.success) {
        throw new Error(
          data?.message || 'Failed to load dashboard'
        );
      }

      setAdmin(data.admin ?? null);
      setStats(data.stats ?? null);
      setRecentConversions(
        Array.isArray(data.recentConversions)
          ? data.recentConversions
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load dashboard'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);


const fetchConversionHistory = useCallback(async (page = 1) => {
  try {
    setHistoryLoading(true);
    setHistoryError('');

    const data = await getAdminConversionHistory(page, 10);

    setHistory(Array.isArray(data.conversions) ? data.conversions : []);

    setHistoryPagination({
      page: data.pagination.page,
      limit: data.pagination.limit,
      total: data.pagination.total,
      totalPages: data.pagination.totalPages,
    });
  } catch (err) {
    setHistoryError(
      err.response?.data?.message ||
        err.message ||
        'Failed to load conversion history'
    );
  } finally {
    setHistoryLoading(false);
  }
}, []);


  useEffect(() => {
    fetchDashboard();
    fetchConversionHistory(1);
  }, [fetchDashboard,fetchConversionHistory]);

  const cards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers,
      icon: Users,
      color: 'blue',
      description: 'All registered users',
    },
    {
      title: 'Total Conversions',
      value: stats?.totalConversions,
      icon: ArrowLeftRight,
      color: 'green',
      description: 'All-time transactions',
    },
    {
      title: 'Conversions Today',
      value: stats?.conversionsToday,
      icon: Activity,
      color: 'purple',
      description: 'Activity since midnight',
    },
    {
      title: 'Total Admins',
      value: stats?.totalAdmins,
      icon: ShieldCheck,
      color: 'orange',
      description: 'Administrator accounts',
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-state">
        <div className="dashboard-spinner" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error && !stats && !admin) {
    return (
      <div className="dashboard-state dashboard-error">
        <CircleAlert size={36} />
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>
        <button
          type="button"
          className="dashboard-primary-button"
          onClick={() => fetchDashboard()}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <h2>
            Welcome back, {admin?.name || 'Admin'}!
          </h2>
          <p>
            Monitor your currency exchange platform and its latest activity.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-refresh-button"
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'refresh-spinning' : ''}
          />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="dashboard-inline-error">
          <CircleAlert size={17} />
          <span>
            Refresh failed: {error}. Displaying the last successfully loaded data.
          </span>
          <button
            type="button"
            onClick={() => fetchDashboard(true)}
          >
            Retry
          </button>
        </div>
      )}

      <div className="dashboard-metrics">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article className="dashboard-metric-card" key={card.title}>
              <div className={`dashboard-metric-icon ${card.color}`}>
                <Icon size={22} />
              </div>

              <div className="dashboard-metric-content">
                <p>{card.title}</p>
                <h3>{formatNumber(card.value)}</h3>
                <span>{card.description}</span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="dashboard-content-grid">
        <article className="dashboard-panel admin-details-panel">
          <div className="dashboard-panel-heading">
            <div>
              <h3>Admin Details</h3>
              <p>Your authenticated account information</p>
            </div>
            <ShieldCheck size={21} />
          </div>

          <div className="dashboard-admin-profile">
            <div className="dashboard-admin-avatar">
              {(admin?.name || 'A').charAt(0).toUpperCase()}
            </div>

            <div>
              <h4>{admin?.name || 'Not available'}</h4>
              <span className="dashboard-role-badge">
                {admin?.role || 'Role unavailable'}
              </span>
            </div>
          </div>

          <div className="dashboard-detail-row">
            <span>Email address</span>
            <strong>{admin?.email || 'Not available'}</strong>
          </div>

          <div className="dashboard-detail-row">
            <span>Account role</span>
            <strong>{admin?.role || 'Not available'}</strong>
          </div>

          <div className="dashboard-detail-row">
            <span>Account status</span>
            <span className="dashboard-account-status">
              <span />
              Authenticated
            </span>
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div>
              <h3>Platform Overview</h3>
              <p>Live database statistics</p>
            </div>
            <TrendingUp size={21} />
          </div>

          <div className="dashboard-overview-row">
            <div>
              <span>Total regular users</span>
              <small>Accounts with the user role</small>
            </div>
            <strong>
              {formatNumber(stats?.totalRegularUsers)}
            </strong>
          </div>

          <div className="dashboard-overview-row">
            <div>
              <span>Monthly conversions</span>
              <small>Since the beginning of this month</small>
            </div>
            <strong>
              {formatNumber(stats?.monthlyConversions)}
            </strong>
          </div>

          <div className="dashboard-overview-row">
            <div>
              <span>Total administrators</span>
              <small>Accounts with the admin role</small>
            </div>
            <strong>{formatNumber(stats?.totalAdmins)}</strong>
          </div>
        </article>
      </div>

      <article className="dashboard-panel dashboard-table-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h3>Recent Conversions</h3>
            <p>
              The latest {recentConversions.length} records returned by the API
            </p>
          </div>

          <span className="dashboard-live-badge">
            <span />
            Live data
          </span>
        </div>

        {recentConversions.length === 0 ? (
          <div className="dashboard-empty-state">
            <ArrowLeftRight size={30} />
            <p>No conversions have been recorded yet.</p>
          </div>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Currency Pair</th>
                  <th>Amount</th>
                  <th>Exchange Rate</th>
                  <th>Converted Amount</th>
                  <th>Date &amp; Time</th>
                </tr>
              </thead>

              <tbody>
                {recentConversions.map((conversion) => (
                  <tr key={conversion._id}>
                    <td>
                      <div className="dashboard-currency-pair">
                        <span>{conversion.fromCurrency || '—'}</span>
                        <ArrowLeftRight size={14} />
                        <span>{conversion.toCurrency || '—'}</span>
                      </div>
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
      </article>

<article className="dashboard-panel dashboard-table-panel">
  <div className="dashboard-panel-heading">
    <div>
      <h3>All Conversion History</h3>
      <p>
        {historyPagination.total} total records across all users
      </p>
    </div>
  </div>

  {historyError && (
    <div className="dashboard-inline-error" role="alert">
      <CircleAlert size={17} />
      <span>{historyError}</span>
      <button
        type="button"
        onClick={() => fetchConversionHistory(historyPagination.page)}
      >
        Retry
      </button>
    </div>
  )}

  {historyLoading ? (
    <div className="dashboard-empty-state">
      <div className="dashboard-spinner" />
      <p>Loading conversion history...</p>
    </div>
  ) : history.length === 0 ? (
    !historyError && (
      <div className="dashboard-empty-state">
        <ArrowLeftRight size={30} />
        <p>No conversion history found.</p>
      </div>
    )
  ) : (
    <div className="dashboard-table-wrapper">
      <table className="dashboard-table">
        <thead>
          <tr>
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
              <td>
                <div>
                  <strong>
                    {conversion.user?.name || 'Unknown user'}
                  </strong>
                  <br />
                  <small>
                    {conversion.user?.email || 'Email unavailable'}
                  </small>
                </div>
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
      Page {historyPagination.page} of{' '}
      {historyPagination.totalPages}
    </span>

    <div>
      <button
        type="button"
        disabled={
          historyLoading ||
          historyPagination.page <= 1
        }
        onClick={() =>
          fetchConversionHistory(historyPagination.page - 1)
        }
      >
        Previous
      </button>

      <button
        type="button"
        disabled={
          historyLoading ||
          historyPagination.page >= historyPagination.totalPages
        }
        onClick={() =>
          fetchConversionHistory(historyPagination.page + 1)
        }
      >
        Next
      </button>
    </div>
  </div>
</article>

    </div>
  );
}
