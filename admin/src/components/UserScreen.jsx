
import { useEffect, useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { getAllUsers } from '../api/userApi';

export default function UserScreen() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAllUsers();

      if (!data.success || !Array.isArray(data.users)) {
        throw new Error('Invalid users response from server.');
      }

      setUsers(data.users);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load users.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const term = search.trim().toLowerCase();

    const matchesSearch =
      (user.name || '').toLowerCase().includes(term) ||
      (user.email || '').toLowerCase().includes(term);

    const matchesRole =
      roleFilter === 'All' || user.role === roleFilter;

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active'
        ? user.isActive === true
        : user.isActive === false);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (date) => {
    if (!date) return '—';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return '—';

    return parsedDate.toLocaleDateString();
  };

  return (
    <section className="table-card">
      <div className="table-heading">
        <div>
          <h2>User Management</h2>
          <p>Registered users retrieved from MongoDB.</p>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={fetchUsers}
          disabled={loading}
          aria-label="Refresh users"
          title="Refresh users"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="rate-filters">
        <div className="users-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search users"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          aria-label="Filter by role"
        >
          <option value="All">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by status"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="users-summary">
        <span>Total users: <strong>{users.length}</strong></span>
        <span>Showing: <strong>{filteredUsers.length}</strong></span>
      </div>

      {error && (
        <div className="users-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={fetchUsers}>
            Try again
          </button>
        </div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Registered</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>Loading users...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5}>Unable to load users.</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5}>No users found.</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name || '—'}</td>
                  <td>{user.email || '—'}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.role === 'admin' ? 'completed' : 'pending'
                      }`}
                    >
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.isActive === true
                          ? 'completed'
                          : 'pending'
                      }`}
                    >
                      {user.isActive === true ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
