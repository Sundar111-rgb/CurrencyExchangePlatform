
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  History,
  Settings,
  Bell,
  Search,
  TrendingUp,
  Wallet,
  Activity,
  CircleDollarSign,
} from 'lucide-react';

import { useState } from 'react';
import './App.css';
import api from './services/api';

const stats = [
  {
    title: 'Total Users',
    value: '1,248',
    change: '+12.5%',
    icon: Users,
  },
  {
    title: 'Total Conversions',
    value: '8,542',
    change: '+8.2%',
    icon: ArrowLeftRight,
  },
  {
    title: 'Exchange Volume',
    value: '$245,890',
    change: '+15.3%',
    icon: Wallet,
  },
  {
    title: 'Active Currencies',
    value: '25',
    change: '+2 new',
    icon: CircleDollarSign,
  },
];

const recentConversions = [
  {
    id: 'CNV-1001',
    user: 'Rahul Sharma',
    from: 'USD',
    to: 'INR',
    amount: '100.00',
    status: 'Completed',
  },
  {
    id: 'CNV-1002',
    user: 'Priya Singh',
    from: 'EUR',
    to: 'INR',
    amount: '250.00',
    status: 'Completed',
  },
  {
    id: 'CNV-1003',
    user: 'Amit Kumar',
    from: 'GBP',
    to: 'USD',
    amount: '75.00',
    status: 'Pending',
  },
  {
    id: 'CNV-1004',
    user: 'Neha Verma',
    from: 'USD',
    to: 'EUR',
    amount: '500.00',
    status: 'Completed',
  },
];

// Sample data for the Exchange Rates page.
// We will connect this to the backend API later.
const exchangeRates = [
  {
    base: 'USD',
    target: 'INR',
    rate: 83.5,
    status: 'Active',
  },
  {
    base: 'EUR',
    target: 'INR',
    rate: 90.2,
    status: 'Active',
  },
  {
    base: 'GBP',
    target: 'USD',
    rate: 1.27,
    status: 'Active',
  },
];

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Users', icon: Users },
  { label: 'Exchange Rates', icon: TrendingUp },
  { label: 'Conversion History', icon: History },
  { label: 'Settings', icon: Settings },
];

function App() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  // Exchange Rates search and filter state
  const [searchCurrency, setSearchCurrency] = useState('');
  const [rateStatus, setRateStatus] = useState('All');
   
  const pageContent = {
    Dashboard: {
      title: 'Dashboard',
      description: "Welcome back! Here's your platform overview.",
    },
    Users: {
      title: 'User Management',
      description: 'View and manage registered users.',
    },
    'Exchange Rates': {
      title: 'Exchange Rates',
      description: 'Manage currency exchange rates.',
    },
    'Conversion History': {
      title: 'Conversion History',
      description: 'Review currency conversion activity.',
    },
    Settings: {
      title: 'Settings',
      description: 'Manage your admin dashboard settings.',
    },
  };

  const currentPage = pageContent[activeMenu];

  // Filter exchange rates by currency and status
  const filteredRates = exchangeRates.filter((item) => {
    const searchTerm = searchCurrency.trim().toLowerCase();

    const matchesSearch =
      item.base.toLowerCase().includes(searchTerm) ||
      item.target.toLowerCase().includes(searchTerm);

    const matchesStatus =
      rateStatus === 'All' || item.status === rateStatus;

    return matchesSearch && matchesStatus;
  });

  const testApi = async () => {
  try {
    const response = await api.get('/health');
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('API Error:', error.message);
  }
};

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <CircleDollarSign size={27} />
          </div>

          <div>
            <h2>CurrencyX</h2>
            <span>Admin Console</span>
          </div>
        </div>

        <div className="nav-heading">MAIN MENU</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`nav-item ${
                  activeMenu === item.label ? 'active' : ''
                }`}
                onClick={() => setActiveMenu(item.label)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot" />

            <div>
              <strong>System Status</strong>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="topbar">
          <div>
            <h1>{currentPage.title}</h1>
            <p>{currentPage.description}</p>
          </div>

          <div className="topbar-actions">
            <button
              className="icon-button"
              aria-label="Search"
              type="button"
            >
              <Search size={20} />
            </button>

            <button
              className="icon-button notification"
              aria-label="Notifications"
              type="button"
            >
              <Bell size={20} />
              <span />
            </button>

            <div className="admin-profile">
              <div className="avatar">A</div>

              <div className="profile-details">
                <strong>Administrator</strong>
                <span>Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <section className="dashboard-body">
          {/* Dashboard */}
          {activeMenu === 'Dashboard' && (
            <>
              <div className="section-heading">
                <div>
                  <h2>Overview</h2>
                  <p>
                    Monitor your currency exchange platform.
                  </p>
                </div>

                <span className="date-label">
                  <Activity size={16} />
                  Dashboard overview
                </span>
              </div>

              <div className="stats-grid">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <article
                      className="stat-card"
                      key={stat.title}
                    >
                      <div className="stat-top">
                        <div className="stat-icon">
                          <Icon size={21} />
                        </div>

                        <span className="stat-change">
                          {stat.change}
                        </span>
                      </div>

                      <p>{stat.title}</p>
                      <h3>{stat.value}</h3>
                    </article>
                  );
                })}
              </div>

              <section className="table-card">
                <div className="table-heading">
                  <div>
                    <h2>Recent Conversions</h2>
                    <p>
                      Latest currency conversion activity
                    </p>
                  </div>

                  <button
                    className="view-all"
                    type="button"
                    onClick={() =>
                      setActiveMenu('Conversion History')
                    }
                  >
                    View all <span>→</span>
                  </button>
                </div>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>User</th>
                        <th>Currency Pair</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentConversions.map((conversion) => (
                        <tr key={conversion.id}>
                          <td className="transaction-id">
                            {conversion.id}
                          </td>

                          <td>{conversion.user}</td>

                          <td>
                            <span className="currency-pair">
                              {conversion.from}{' '}
                              <span>→</span>{' '}
                              {conversion.to}
                            </span>
                          </td>

                          <td>
                            {conversion.amount} {conversion.from}
                          </td>

                          <td>
                            <span
                              className={`status-badge ${
                                conversion.status === 'Completed'
                                  ? 'completed'
                                  : 'pending'
                              }`}
                            >
                              {conversion.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* Users */}
          {activeMenu === 'Users' && (
            <section className="table-card">
              <div className="table-heading">
                <div>
                  <h2>User Management</h2>
                  <p>Manage registered platform users.</p>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td colSpan={4}>
                        User data integration is pending.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Exchange Rates */}
          {activeMenu === 'Exchange Rates' && (
            <section className="table-card">
              <div className="table-heading">
                <div>
                  <h2>Exchange Rates</h2>
                  <p>
                    View and manage currency exchange rates.
                  </p>
                </div>
              </div>

              {/* Search and Status Filter */}
              <div className="rate-filters">
                <input
                  type="text"
                  placeholder="Search currency (USD, INR...)"
                  value={searchCurrency}
                  onChange={(event) =>
                    setSearchCurrency(event.target.value)
                  }
                  aria-label="Search currencies"
                />

                <select
                  value={rateStatus}
                  onChange={(event) =>
                    setRateStatus(event.target.value)
                  }
                  aria-label="Filter exchange rates by status"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Base Currency</th>
                      <th>Target Currency</th>
                      <th>Exchange Rate</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRates.length > 0 ? (
                      filteredRates.map((item) => (
                        <tr
                          key={`${item.base}-${item.target}`}
                        >
                          <td>{item.base}</td>
                          <td>{item.target}</td>
                          <td>{item.rate.toFixed(2)}</td>
                          <td>
                            <span
                              className={`status-badge ${
                                item.status === 'Active'
                                  ? 'completed'
                                  : 'pending'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4}>
                          No exchange rates found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Conversion History */}
          {activeMenu === 'Conversion History' && (
            <section className="table-card">
              <div className="table-heading">
                <div>
                  <h2>Conversion History</h2>
                  <p>
                    Review currency conversion activity.
                  </p>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>User</th>
                      <th>Currency Pair</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentConversions.map((conversion) => (
                      <tr key={conversion.id}>
                        <td className="transaction-id">
                          {conversion.id}
                        </td>

                        <td>{conversion.user}</td>

                        <td>
                          <span className="currency-pair">
                            {conversion.from}{' '}
                            <span>→</span>{' '}
                            {conversion.to}
                          </span>
                        </td>

                        <td>
                          {conversion.amount} {conversion.from}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${
                              conversion.status === 'Completed'
                                ? 'completed'
                                : 'pending'
                            }`}
                          >
                            {conversion.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Settings */}
          {activeMenu === 'Settings' && (
            <section className="table-card">
              <div className="table-heading">
                <div>
                  <h2>Settings</h2>
                  <p>
                    Manage your admin dashboard settings.
                  </p>
                </div>
              </div>

              <div className="table-wrapper">
                <p>
                  Settings configuration will be implemented
                  in a later step.
                </p>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
