
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
import LoginScreen from './components/LoginScreen.jsx';
import { logoutAdmin } from './api/authApi';
import Dashboard from './components/Dashboard.jsx';
import UserScreen from './components/UserScreen.jsx';
import ExchangeRates from './components/ExchangeRates.jsx';
import ConversionHistory from './components/ConversionHistory.jsx';
import SettingPage from './components/SettingPage.jsx';
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
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('adminToken'))
  );


  const handleLogin = () => {
    setIsAuthenticated(true);
  };



  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };
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



  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

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
                className={`nav-item ${activeMenu === item.label ? 'active' : ''
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
                <span>Admin</span>
              </div>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>

          </div>
        </header>

        <section className="dashboard-body">
          {/* Dashboard */}
          {activeMenu === 'Dashboard' && <Dashboard />}

          {/* Users */}
          {/* Users */}
          {activeMenu === 'Users' && <UserScreen />}

          {/* Exchange Rates */}
          {/* Exchange Rates */}
          {activeMenu === 'Exchange Rates' && <ExchangeRates />}

          {/* Conversion History */}
          {activeMenu === 'Conversion History' && <ConversionHistory />}

          {/* Settings */}
          {activeMenu === 'Settings' && <SettingPage />}
        </section>
      </main>
    </div>
  );
}

export default App;
