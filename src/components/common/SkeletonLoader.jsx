import './Skeleton.css';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
    const items = Array.from({ length: count }, (_, i) => i);

    if (type === 'table') {
        return (
            <div className="skeleton-table">
                <div className="skeleton-row header">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="skeleton-cell skeleton-pulse" />
                    ))}
                </div>
                {items.map(i => (
                    <div key={i} className="skeleton-row">
                        {[1, 2, 3, 4, 5].map(j => (
                            <div key={j} className="skeleton-cell skeleton-pulse" />
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'card') {
        return (
            <div className="skeleton-grid">
                {items.map(i => (
                    <div key={i} className="skeleton-card">
                        <div className="skeleton-avatar skeleton-pulse" />
                        <div className="skeleton-line skeleton-pulse" style={{ width: '70%' }} />
                        <div className="skeleton-line skeleton-pulse" style={{ width: '50%' }} />
                        <div className="skeleton-line skeleton-pulse" style={{ width: '90%' }} />
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'stats') {
        return (
            <div className="skeleton-stats">
                {items.map(i => (
                    <div key={i} className="skeleton-stat-card">
                        <div className="skeleton-icon skeleton-pulse" />
                        <div>
                            <div className="skeleton-line skeleton-pulse" style={{ width: '60px', height: '24px' }} />
                            <div className="skeleton-line skeleton-pulse" style={{ width: '80px', height: '14px', marginTop: '8px' }} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'text') {
        return (
            <div className="skeleton-text">
                {items.map(i => (
                    <div key={i} className="skeleton-line skeleton-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                ))}
            </div>
        );
    }

    return null;
};

export default SkeletonLoader;
