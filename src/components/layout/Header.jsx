import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import { useToast } from '../common/Toast';
import NotificationsDropdown from '../common/NotificationsDropdown';
import './Header.css';

const Header = ({ onMenuToggle }) => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogout = () => {
        logout();
        toast.info('You have been logged out');
        navigate('/login');
    };

    const getRoleBadgeClass = (role) => {
        const classes = {
            ADMIN: 'badge-admin',
            FACULTY: 'badge-faculty',
            STUDENT: 'badge-student',
            PARENT: 'badge-parent'
        };
        return classes[role] || 'badge-default';
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
                    <FiMenu size={22} />
                </button>
                <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                    <span className="logo-icon">🎓</span>
                    <span className="logo-text">CMIS</span>
                </div>
            </div>

            <div className="header-right">
                {/* Dark Mode Toggle */}
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    title={isDark ? 'Light Mode' : 'Dark Mode'}
                >
                    {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>

                {/* Notifications */}
                <NotificationsDropdown />

                <div className="user-menu" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }} role="button" tabIndex={0} aria-label="View profile">
                    <div className="user-avatar">
                        <FiUser size={20} />
                    </div>
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                        <span className={`user-role ${getRoleBadgeClass(user?.role)}`}>
                            {user?.role}
                        </span>
                    </div>
                </div>

                <button className="logout-btn" onClick={handleLogout} title="Logout" aria-label="Logout">
                    <FiLogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;
