import React from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('devdirectory_user')) || null; } catch { return null; }
  });
  const login = (userPayload) => {
    const nextUser = { ...userPayload, token: `devdirectory-${Date.now()}` };
    sessionStorage.setItem('devdirectory_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };
  const logout = () => { sessionStorage.removeItem('devdirectory_user'); setUser(null); };
  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user?.token), login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}