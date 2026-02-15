// Authentication service — uses real API
import api from './api';

// Login function
export const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
};

// Register function
export const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
};

// Logout function
export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }
    return null;
};

// Check if token is valid
export const isTokenValid = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
        // JWT tokens have 3 parts separated by dots
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now(); // JWT exp is in seconds
    } catch {
        return false;
    }
};

// Save auth data to localStorage
export const saveAuthData = (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
};
