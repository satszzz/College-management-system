import { Link } from 'react-router-dom';
import { FiHome, FiSearch } from 'react-icons/fi';

const NotFound = () => {
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-primary)', padding: '2rem'
        }}>
            <div style={{
                textAlign: 'center', maxWidth: '500px',
                background: 'var(--bg-secondary)', borderRadius: '24px',
                padding: '3rem', boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
            }}>
                <div style={{
                    fontSize: '6rem', fontWeight: 800,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    lineHeight: 1, marginBottom: '0.5rem'
                }}>
                    404
                </div>
                <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                    Page Not Found
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                    The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/dashboard" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white', borderRadius: '12px', textDecoration: 'none',
                        fontWeight: 600, transition: 'all 0.3s'
                    }}>
                        <FiHome size={18} /> Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
