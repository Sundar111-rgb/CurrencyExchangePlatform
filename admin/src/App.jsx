
import {
  LayoutDashboard,
  Users,
  History,
  Settings,
  Bell,
  Search,
  TrendingUp,
  CircleDollarSign,
} from 'lucide-react';

import { useState } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen.jsx';
import Dashboard from './components/Dashboard.jsx';
import UserScreen from './components/UserScreen.jsx';
import ExchangeRates from './components/ExchangeRates.jsx';
import ConversionHistory from './components/ConversionHistory.jsx';
import SettingPage from './components/SettingPage.jsx';

import { logoutAdmin } from './api/authApi';

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
          {activeMenu === 'Users' && <UserScreen />}

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
