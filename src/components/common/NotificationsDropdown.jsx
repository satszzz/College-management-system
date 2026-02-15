import { useState, useRef, useEffect } from 'react';
import { FiBell, FiCheck, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import './Notifications.css';

const NotificationsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifs, setNotifs] = useState([
        { id: 1, title: 'Welcome', message: 'Welcome to the College Management System!', type: 'info', time: 'Just now', read: false }
    ]);
    const dropdownRef = useRef(null);

    const unreadCount = notifs.filter(n => !n.read).length;

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = (id) => {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = () => {
        setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <FiCheckCircle />;
            case 'warning': return <FiAlertTriangle />;
            default: return <FiInfo />;
        }
    };

    return (
        <div className="notifications-wrapper" ref={dropdownRef}>
            <button className="notification-btn" onClick={() => setIsOpen(!isOpen)}>
                <FiBell size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notifications-dropdown">
                    <div className="notif-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button className="mark-all-btn" onClick={markAllRead}>
                                <FiCheck size={14} /> Mark all read
                            </button>
                        )}
                    </div>
                    <div className="notif-list">
                        {notifs.length === 0 ? (
                            <div className="notif-empty">No notifications</div>
                        ) : notifs.map(n => (
                            <div
                                key={n.id}
                                className={`notif-item ${n.read ? 'read' : 'unread'}`}
                                onClick={() => markAsRead(n.id)}
                            >
                                <div className={`notif-icon ${n.type}`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="notif-content">
                                    <div className="notif-title">{n.title}</div>
                                    <div className="notif-message">{n.message}</div>
                                    <div className="notif-time">{n.time}</div>
                                </div>
                                {!n.read && <div className="notif-dot" />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;
