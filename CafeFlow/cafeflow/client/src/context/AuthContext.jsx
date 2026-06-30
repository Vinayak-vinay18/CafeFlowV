import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('cafeflow_admin');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('cafeflow_token');
      if (token) {
        try {
          const res = await authService.getMe();
          setAdmin(res.data.data);
        } catch {
          localStorage.removeItem('cafeflow_token');
          localStorage.removeItem('cafeflow_admin');
          setAdmin(null);
        }
      }
      setLoading(false);
    };
    verify();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const data = res.data.data;
    localStorage.setItem('cafeflow_token', data.token);
    localStorage.setItem('cafeflow_admin', JSON.stringify(data));
    setAdmin(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cafeflow_token');
    localStorage.removeItem('cafeflow_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};
