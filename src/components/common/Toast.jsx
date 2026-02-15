import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiX, FiAlertCircle } from 'react-icons/fi';
import './Toast.css';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type, duration }]);
        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
    const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);
    const warning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);
    const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const iconMap = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    warning: FiAlertTriangle,
    info: FiInfo
};

const ToastItem = ({ toast, onClose }) => {
    const [exiting, setExiting] = useState(false);
    const Icon = iconMap[toast.type] || FiInfo;

    useEffect(() => {
        const exitTimer = setTimeout(() => setExiting(true), toast.duration - 300);
        return () => clearTimeout(exitTimer);
    }, [toast.duration]);

    return (
        <div className={`toast toast-${toast.type} ${exiting ? 'toast-exit' : ''}`}>
            <Icon className="toast-icon" size={20} />
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={onClose}>
                <FiX size={16} />
            </button>
        </div>
    );
};
