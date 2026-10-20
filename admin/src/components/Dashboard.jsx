
import { useCallback, useEffect, useState } from 'react';
import { getAdminDashboard } from '../api/adminApi';

export default function Dashboard() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentConversions, setRecentConversions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAdminDashboard();

      console.log('Dashboard API response:', data);

      if (!data?.success) {
        throw new Error(
          data?.message || 'Failed to load dashboard'
        );
      }

      setAdmin(data.admin ?? null);
      setStats(data.stats ?? null);
      setRecentConversions(data.recentConversions ?? []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to load dashboard'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <h2>Dashboard Error</h2>
        <p>{error}</p>
        <button type="button" onClick={fetchDashboard}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Admin Information</h3>
        <p>Name: {admin?.name ?? 'Not available'}</p>
        <p>Email: {admin?.email ?? 'Not available'}</p>
        <p>Role: {admin?.role ?? 'Not available'}</p>
      </section>

      <hr />

      <section>
        <h3>Live Statistics</h3>

        <p>Total Users: {stats?.totalUsers ?? 'Not available'}</p>
        <p>Total Admins: {stats?.totalAdmins ?? 'Not available'}</p>
        <p>
          Regular Users:{' '}
          {stats?.totalRegularUsers ?? 'Not available'}
        </p>
        <p>
          Total Conversions:{' '}
          {stats?.totalConversions ?? 'Not available'}
        </p>
        <p>
          Conversions Today:{' '}
          {stats?.conversionsToday ?? 'Not available'}
        </p>
        <p>
          Conversions This Month:{' '}
          {stats?.monthlyConversions ?? 'Not available'}
        </p>
      </section>

      <hr />

      <section>
        <h3>Recent Conversions</h3>

        {recentConversions.length === 0 ? (
          <p>No conversions found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Converted Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {recentConversions.map((conversion) => (
                <tr key={conversion._id}>
                  <td>{conversion.fromCurrency}</td>
                  <td>{conversion.toCurrency}</td>
                  <td>{conversion.amount}</td>
                  <td>{conversion.convertedAmount}</td>
                  <td>
                    {conversion.createdAt
                      ? new Date(
                          conversion.createdAt
                        ).toLocaleString()
                      : 'Not available'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <button
        type="button"
        onClick={fetchDashboard}
        style={{ marginTop: '20px' }}
      >
        Refresh Dashboard
      </button>
    </div>
  );
}
