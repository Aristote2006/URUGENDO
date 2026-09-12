import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const AdminAuthContext = createContext(null);

const ADMIN_TOKEN_KEY = 'urugendo_admin_token';
const ADMIN_USER_KEY = 'urugendo_admin_user';

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true);

  // Validate admin session on mount
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await adminService.getMe();
        if (res.success && res.user && res.user.role === 'admin') {
          setAdminUser(res.user);
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(res.user));
        } else {
          adminLogout();
        }
      } catch (err) {
        console.warn('[AdminAuth] Session verification failed:', err.message);
        adminLogout();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const adminLogin = async (email, password) => {
    const res = await adminService.login(email, password);
    if (res.success && res.token && res.user?.role === 'admin') {
      localStorage.setItem(ADMIN_TOKEN_KEY, res.token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(res.user));
      setToken(res.token);
      setAdminUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Invalid administrator credentials');
  };

  const adminLogout = async () => {
    try {
      await adminService.logout();
    } catch {
      // Clean up local session regardless of network response
    } finally {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      setToken(null);
      setAdminUser(null);
    }
  };

  const isAdminAuthenticated = !!token && !!adminUser && adminUser.role === 'admin';

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        isAdminAuthenticated,
        loading,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

