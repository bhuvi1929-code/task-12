import { useState } from 'react';
import { Settings, RefreshCcw, Save, ShieldAlert, Bell, Lock, Database } from 'lucide-react';
import { usePlatform } from '../../contexts/PlatformContext';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminSettings() {
  const { resetToDefaults, addAuditLog } = usePlatform();
  const { expireSession } = useAuth();
  
  const [settings, setSettings] = useState({
    sessionTimeout: '30',
    mfaRequired: true,
    emailNotifications: true,
    weeklyDigest: true,
    auditRetentionDays: '365',
    maxFailedLogins: '5',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    addAuditLog('Updated global application settings', 'System Config');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings size={26} color="#6366f1" /> Application Configuration & Governance
        </h1>
        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
          Manage security policies, alert channels, database retention, and session simulations.
        </p>
      </div>

      {saved && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '12px 16px', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: 600 }}>
          ✓ Global system configuration preferences saved successfully!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Security & Authentication */}
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: 700, color: '#6366f1', marginBottom: '1.2rem' }}>
            <Lock size={22} /> Security & Authentication
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
              <span>Enforce Multi-Factor Auth (MFA):</span>
              <input
                type="checkbox"
                checked={settings.mfaRequired}
                onChange={e => setSettings({ ...settings, mfaRequired: e.target.checked })}
                style={{ transform: 'scale(1.3)', accentColor: '#6366f1' }}
              />
            </label>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Idle Session Timeout (Minutes):</label>
              <select
                value={settings.sessionTimeout}
                onChange={e => setSettings({ ...settings, sessionTimeout: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              >
                <option value="15">15 Minutes (Strict Security)</option>
                <option value="30">30 Minutes (Standard)</option>
                <option value="60">1 Hour (Relaxed)</option>
                <option value="480">8 Hours (Work Day)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Max Failed Login Attempts:</label>
              <input
                type="number"
                value={settings.maxFailedLogins}
                onChange={e => setSettings({ ...settings, maxFailedLogins: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>

        {/* Telemetry & Notifications */}
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: 700, color: '#10b981', marginBottom: '1.2rem' }}>
            <Bell size={22} /> System Notifications & Telemetry
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
              <span>Instant Leave Approval Alerts:</span>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={e => setSettings({ ...settings, emailNotifications: e.target.checked })}
                style={{ transform: 'scale(1.3)', accentColor: '#10b981' }}
              />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600 }}>
              <span>Weekly Executive Analytics Digest:</span>
              <input
                type="checkbox"
                checked={settings.weeklyDigest}
                onChange={e => setSettings({ ...settings, weeklyDigest: e.target.checked })}
                style={{ transform: 'scale(1.3)', accentColor: '#10b981' }}
              />
            </label>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Audit Log Retention Window:</label>
              <select
                value={settings.auditRetentionDays}
                onChange={e => setSettings({ ...settings, auditRetentionDays: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              >
                <option value="90">90 Days</option>
                <option value="365">1 Year (Compliance Standard)</option>
                <option value="1825">5 Years (Long Term)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
        <button
          onClick={handleSave}
          style={{ background: '#6366f1', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)' }}
        >
          <Save size={20} /> Save System Configurations
        </button>
      </div>

      {/* Danger & Demo Evaluation Area */}
      <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.15rem', fontWeight: 700, color: '#ef4444', marginBottom: '1rem' }}>
          <ShieldAlert size={24} /> Demo & Evaluation Governance Controls
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          These tools allow project evaluators to test edge-case system workflows such as session expiration redirects and complete database factory reset.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={expireSession}
            style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Lock size={18} /> Simulate Session Expiry (/session-expired)
          </button>

          <button
            onClick={() => { if (confirm("Reset all mock data modifications in localStorage back to original seed?")) resetToDefaults(); }}
            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCcw size={18} /> Factory Reset Database Seed
          </button>
        </div>
      </div>
    </div>
  );
}
