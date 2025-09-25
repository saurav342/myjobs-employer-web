import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('authToken');
    const u = localStorage.getItem('userData');
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
    setBootstrapping(false);
  }, []);

  const loginWithToken = (t, u) => {
    localStorage.setItem('authToken', t);
    localStorage.setItem('userData', JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, loginWithToken, logout, bootstrapping };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

