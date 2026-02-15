import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import './Breadcrumb.css';

const routeLabels = {
    dashboard: 'Dashboard',
    marks: 'Marks',
    courses: 'Courses',
    'my-courses': 'My Courses',
    fees: 'Fees',
    students: 'Students',
    users: 'User Management',
    reports: 'Reports',
    settings: 'Settings',
    schedule: 'Schedule',
    profile: 'Profile',
    'student-performance': 'Student Performance'
};

const Breadcrumb = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);

    if (pathSegments.length === 0) return null;

    return (
        <nav className="breadcrumb">
            <Link to="/dashboard" className="breadcrumb-item breadcrumb-home">
                <FiHome size={14} />
                <span>Home</span>
            </Link>
            {pathSegments.map((segment, idx) => {
                const path = '/' + pathSegments.slice(0, idx + 1).join('/');
                const isLast = idx === pathSegments.length - 1;
                const label = routeLabels[segment] || segment;

                return (
                    <span key={path} className="breadcrumb-segment">
                        <FiChevronRight size={14} className="breadcrumb-separator" />
                        {isLast ? (
                            <span className="breadcrumb-item active">{label}</span>
                        ) : (
                            <Link to={path} className="breadcrumb-item">{label}</Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;
