import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
