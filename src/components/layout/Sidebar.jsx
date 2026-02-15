import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import {
    FiHome, FiUsers, FiBook, FiAward, FiDollarSign,
    FiSettings, FiBarChart2, FiCalendar, FiCheckSquare
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    const getMenuItems = () => {
        const commonItems = [
            { path: '/dashboard', icon: FiHome, label: 'Dashboard' }
        ];

        const roleBasedItems = {
            ADMIN: [
                { path: '/users', icon: FiUsers, label: 'User Management' },
                { path: '/students', icon: FiUsers, label: 'Students' },
                { path: '/courses', icon: FiBook, label: 'Courses' },
                { path: '/marks', icon: FiAward, label: 'Marks' },
                { path: '/fees', icon: FiDollarSign, label: 'Fees' },
                { path: '/attendance', icon: FiCheckSquare, label: 'Attendance' },
                { path: '/reports', icon: FiBarChart2, label: 'Reports' },
                { path: '/settings', icon: FiSettings, label: 'Settings' }
            ],
            FACULTY: [
                { path: '/my-courses', icon: FiBook, label: 'My Courses' },
                { path: '/students', icon: FiUsers, label: 'Students' },
                { path: '/marks', icon: FiAward, label: 'Marks' },
                { path: '/attendance', icon: FiCheckSquare, label: 'Attendance' },
                { path: '/reports', icon: FiBarChart2, label: 'Reports' },
                { path: '/schedule', icon: FiCalendar, label: 'Schedule' },
                { path: '/settings', icon: FiSettings, label: 'Settings' }
            ],
            STUDENT: [
                { path: '/my-courses', icon: FiBook, label: 'My Courses' },
                { path: '/my-marks', icon: FiAward, label: 'My Marks' },
                { path: '/my-fees', icon: FiDollarSign, label: 'My Fees' },
                { path: '/my-attendance', icon: FiCheckSquare, label: 'My Attendance' },
                { path: '/schedule', icon: FiCalendar, label: 'Schedule' },
                { path: '/settings', icon: FiSettings, label: 'Settings' }
            ],
            PARENT: [
                { path: '/student-performance', icon: FiBarChart2, label: 'Performance' },
                { path: '/fee-status', icon: FiDollarSign, label: 'Fee Status' },
                { path: '/settings', icon: FiSettings, label: 'Settings' }
            ]
        };

        return [...commonItems, ...(roleBasedItems[user?.role] || [])];
    };

    const menuItems = getMenuItems();

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {menuItems.map(item => (
                        <li key={item.path} className="nav-item">
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <item.icon className="nav-icon" size={20} />
                                <span className="nav-label">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <div className="sidebar-info">
                    <span className="info-label">College Management System</span>
                    <span className="info-version">v3.0.0</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
