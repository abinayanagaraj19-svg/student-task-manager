import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('student_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('student_token'));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize and verify stored token
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('student_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('student_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen to unauthorized event dispatched from api interceptor
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await authService.login({ email, password });
      const { token: newToken, user: newUser } = res.data;

      localStorage.setItem('student_token', newToken);
      localStorage.setItem('student_user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await authService.register(userData);
      const { token: newToken, user: newUser } = res.data;

      localStorage.setItem('student_token', newToken);
      localStorage.setItem('student_user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authService.updateProfile(profileData);
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('student_user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_user');
    setToken(null);
    setUser(null);
    setAuthError(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    authError,
    setAuthError,
    login,
    register,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
