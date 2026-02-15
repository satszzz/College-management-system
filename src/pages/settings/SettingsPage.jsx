import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { FiSave, FiBell, FiGlobe, FiLock, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import '../Pages.css';

const SettingsPage = () => {
    const { user } = useAuth();
    const toast = useToast();

    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        twoFactorAuth: false,
        language: 'en',
        timezone: 'IST',
        autoLogout: '30',
        theme: 'light'
    });

    const toggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        toast.success('Settings saved successfully!');
    };

    const ToggleSwitch = ({ active, onToggle }) => (
        <button
            onClick={onToggle}
            style={{
                background: active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e9ecef',
                border: 'none', borderRadius: '20px', width: '48px', height: '26px',
                cursor: 'pointer', position: 'relative', transition: 'all 0.3s'
            }}
        >
            <span style={{
                position: 'absolute', top: '3px',
                left: active ? '24px' : '3px',
                width: '20px', height: '20px', background: 'white',
                borderRadius: '50%', transition: 'left 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
            }} />
        </button>
    );

    const SettingRow = ({ icon: Icon, title, description, children }) => (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1rem 0', borderBottom: '1px solid #f1f3f4'
        }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{
                    width: 40, height: 40, borderRadius: '10px',
                    background: 'rgba(102,126,234,0.1)', color: '#667eea',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Icon size={18} />
                </div>
                <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a1a2e' }}>{title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{description}</div>
                </div>
            </div>
            {children}
        </div>
    );

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Settings</h1>
                    <p>Manage your account preferences and configuration</p>
                </div>
                <button className="btn btn-primary" style={{ border: 'none' }} onClick={handleSave}>
                    <FiSave size={16} /> Save Settings
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Notifications */}
                <div className="dashboard-card" style={{ padding: '1.5rem' }}>
                    <h2 style={{ marginBottom: '0.5rem' }}>🔔 Notifications</h2>
                    <SettingRow icon={FiBell} title="Email Notifications" description="Receive email alerts for important updates">
                        <ToggleSwitch active={settings.emailNotifications} onToggle={() => toggle('emailNotifications')} />
                    </SettingRow>
                    <SettingRow icon={FiBell} title="SMS Notifications" description="Get text message alerts on your phone">
                        <ToggleSwitch active={settings.smsNotifications} onToggle={() => toggle('smsNotifications')} />
                    </SettingRow>
                </div>

                {/* Security */}
                <div className="dashboard-card" style={{ padding: '1.5rem' }}>
                    <h2 style={{ marginBottom: '0.5rem' }}>🔒 Security</h2>
                    <SettingRow icon={FiLock} title="Two-Factor Authentication" description="Add an extra layer of security to your account">
                        <ToggleSwitch active={settings.twoFactorAuth} onToggle={() => toggle('twoFactorAuth')} />
                    </SettingRow>
                    <SettingRow icon={FiLock} title="Auto Logout" description="Automatically logout after inactivity">
                        <select
                            value={settings.autoLogout}
                            onChange={e => setSettings(prev => ({ ...prev, autoLogout: e.target.value }))}
                            style={{ padding: '0.5rem 1rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.85rem' }}
                        >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="0">Never</option>
                        </select>
                    </SettingRow>
                </div>

                {/* Preferences */}
                <div className="dashboard-card" style={{ padding: '1.5rem' }}>
                    <h2 style={{ marginBottom: '0.5rem' }}>🌐 Preferences</h2>
                    <SettingRow icon={FiGlobe} title="Language" description="Select your preferred language">
                        <select
                            value={settings.language}
                            onChange={e => setSettings(prev => ({ ...prev, language: e.target.value }))}
                            style={{ padding: '0.5rem 1rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.85rem' }}
                        >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="ta">Tamil</option>
                        </select>
                    </SettingRow>
                    <SettingRow icon={FiGlobe} title="Timezone" description="Set your local timezone">
                        <select
                            value={settings.timezone}
                            onChange={e => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                            style={{ padding: '0.5rem 1rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '0.85rem' }}
                        >
                            <option value="IST">IST (GMT+5:30)</option>
                            <option value="EST">EST (GMT-5)</option>
                            <option value="PST">PST (GMT-8)</option>
                            <option value="UTC">UTC</option>
                        </select>
                    </SettingRow>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
