import { Link } from 'react-router-dom';
import { FiShieldOff, FiArrowLeft } from 'react-icons/fi';
import '../auth/Auth.css';

const Unauthorized = () => {
    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
            <div className="auth-card" style={{ textAlign: 'center' }}>
                <div style={{
                    width: 80, height: 80,
                    background: 'linear-gradient(135deg, #e03131, #c92a2a)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 1.5rem', color: 'white'
                }}>
                    <FiShieldOff size={36} />
                </div>
                <h1 style={{ marginBottom: '0.5rem' }}>Access Denied</h1>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                    You don't have permission to access this page. Please contact your administrator if you believe this is an error.
                </p>
                <Link to="/dashboard" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white', borderRadius: '12px', textDecoration: 'none',
                    fontWeight: 600, transition: 'all 0.3s'
                }}>
                    <FiArrowLeft size={18} />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
