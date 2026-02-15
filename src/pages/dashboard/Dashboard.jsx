import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import FacultyDashboard from './FacultyDashboard';
import StudentDashboard from './StudentDashboard';
import ParentDashboard from './ParentDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    // Render role-specific dashboard
    const renderDashboard = () => {
        switch (user?.role) {
            case 'ADMIN':
                return <AdminDashboard />;
            case 'FACULTY':
                return <FacultyDashboard />;
            case 'STUDENT':
                return <StudentDashboard />;
            case 'PARENT':
                return <ParentDashboard />;
            default:
                return <StudentDashboard />;
        }
    };

    return renderDashboard();
};

export default Dashboard;
