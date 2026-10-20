
import { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Save,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import './SettingPage.css';

const DEFAULT_SETTINGS = {
  notifications: true,
  emailAlerts: false,
  compactTable: false,
  theme: 'light',
  itemsPerPage: '10',
};

export default function SettingPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('currencyXSettings');

      if (storedSettings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(storedSettings),
        });
      }
    } catch {
      localStorage.removeItem('currencyXSettings');
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
    setSaved(false);
  };

  const saveSettings = () => {
    try {
      localStorage.setItem(
        'currencyXSettings',
        JSON.stringify(settings)
      );
      setSaved(true);
    } catch {
      setSaved(false);
      window.alert('Unable to save settings in this browser.');
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('currencyXSettings');
    setSaved(false);
  };

  return (
    <div className="settings-page">
      <div className="settings-page-heading">
        <div>
          <h2>Settings</h2>
          <p>Manage your CurrencyX admin dashboard preferences.</p>
        </div>

        <SettingsIcon size={28} />
      </div>

      <section className="settings-card">
        <div className="settings-card-heading">
          <Bell size={20} />
          <div>
            <h3>Notifications</h3>
            <p>Control which alerts you want to see.</p>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <strong>Dashboard notifications</strong>
            <p>Enable notifications inside the admin dashboard.</p>
          </div>

          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(event) =>
              updateSetting('notifications', event.target.checked)
            }
            aria-label="Dashboard notifications"
          />
        </div>

        <div className="settings-option">
          <div>
            <strong>Email alerts</strong>
            <p>Enable your email alert preference.</p>
          </div>

          <input
            type="checkbox"
            checked={settings.emailAlerts}
            onChange={(event) =>
              updateSetting('emailAlerts', event.target.checked)
            }
            aria-label="Email alerts"
          />
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          {settings.theme === 'dark' ? (
            <Moon size={20} />
          ) : (
            <Sun size={20} />
          )}

          <div>
            <h3>Appearance</h3>
            <p>Choose your preferred dashboard appearance.</p>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <strong>Dashboard theme</strong>
            <p>
              This saves your preference; applying a full dark theme
              will be a separate step.
            </p>
          </div>

          <select
            value={settings.theme}
            onChange={(event) =>
              updateSetting('theme', event.target.value)
            }
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="settings-option">
          <div>
            <strong>Compact tables</strong>
            <p>Save your preference for denser table layouts.</p>
          </div>

          <input
            type="checkbox"
            checked={settings.compactTable}
            onChange={(event) =>
              updateSetting('compactTable', event.target.checked)
            }
            aria-label="Compact tables"
          />
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <SettingsIcon size={20} />
          <div>
            <h3>Data display</h3>
            <p>Choose how many records to display per page.</p>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <strong>Records per page</strong>
            <p>Your preferred pagination size for future integrations.</p>
          </div>

          <select
            value={settings.itemsPerPage}
            onChange={(event) =>
              updateSetting('itemsPerPage', event.target.value)
            }
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </section>

      <div className="settings-actions">
        <button
          type="button"
          className="settings-reset-button"
          onClick={resetSettings}
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <button
          type="button"
          className="settings-save-button"
          onClick={saveSettings}
        >
          <Save size={16} />
          Save settings
        </button>
      </div>

      {saved && (
        <p className="settings-success" role="status">
          <CheckCircle2 size={17} />
          Settings saved successfully in this browser.
        </p>
      )}
    </div>
  );
}
