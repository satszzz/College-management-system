import { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser, isTokenValid, saveAuthData } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);

    // Check auth on mount
    useEffect(() => {
        const initAuth = () => {
            if (isTokenValid()) {
                const savedUser = getCurrentUser();
                if (savedUser) {
                    setUser(savedUser);
                }
            } else {
                logoutService();
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    // Token expiry auto-logout — check every 30 seconds
    useEffect(() => {
        if (user) {
            intervalRef.current = setInterval(() => {
                if (!isTokenValid()) {
                    setUser(null);
                    logoutService();
                }
            }, 30000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [user]);

    const login = useCallback(async (email, password) => {
        try {
            setError(null);
            const response = await loginService(email, password);
            // Save to localStorage so isTokenValid() works on next check
            saveAuthData(response.token, response.user);
            setUser(response.user);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const logout = useCallback(() => {
        logoutService();
        setUser(null);
    }, []);

    const hasRole = useCallback((role) => {
        return user?.role === role;
    }, [user]);

    const isAuthenticated = !!user && isTokenValid();

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated,
        hasRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
