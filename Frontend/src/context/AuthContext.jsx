import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('token');
    if (!t) return null;
    try { return jwtDecode(t); } catch { return null; }
  });

  const login = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try { setUser(jwtDecode(newToken)); } catch { setUser(null); }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  // Auto-logout on token expiry
  useEffect(() => {
    if (!user) return;
    const msUntilExpiry = user.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) { logout(); return; }
    const timer = setTimeout(logout, msUntilExpiry);
    return () => clearTimeout(timer);
  }, [user, logout]);

  // ---------- Role helpers ----------
  const hasRole    = (...roles) => !!user && roles.includes(user.role);
  const isAdmin    = () => hasRole('admin');
  const isManager  = () => hasRole('manager');
  const isMember   = () => hasRole('member');

  // Permission helpers (mirrors backend RBAC)
  const canPlaceOrder   = () => hasRole('admin', 'manager');
  const canCancelOrder  = () => hasRole('admin', 'manager');
  const canUpdatePayment = () => hasRole('admin');

  const value = {
    user,
    token,
    login,
    logout,
    hasRole,
    isAdmin,
    isManager,
    isMember,
    canPlaceOrder,
    canCancelOrder,
    canUpdatePayment,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
