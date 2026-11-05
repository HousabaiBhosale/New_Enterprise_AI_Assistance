import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function getHomeRouteForRole(role) {
  const r = (role || 'admin').toLowerCase();
  if (r === 'hr') return '/hr';
  if (r === 'sales') return '/sales';
  if (r === 'support' || r === 'staff') return '/support';
  if (r === 'employee') return '/chat';
  return '/'; // System Admin lands on executive overview
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('enterprise_auth_user');
      const token = localStorage.getItem('enterprise_auth_token');
      return (stored && token) ? JSON.parse(stored) : null;
    } catch (_) {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password, roleHint = null) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      setIsLoading(false);
      const target = getHomeRouteForRole(data.user?.role || roleHint);
      navigate(target);
      return data;
    } catch (err) {
      setIsLoading(false);
      const message = err.message || "Invalid email or password";
      setAuthError(message);
      throw err;
    }
  };

  const register = async (name, email, password, role = 'employee', department = 'General') => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const data = await authService.register(name, email, password, role, department);
      setUser(data.user);
      setIsLoading(false);
      const target = getHomeRouteForRole(data.user?.role || role);
      navigate(target);
      return data;
    } catch (err) {
      setIsLoading(false);
      const message = err.message || "Registration failed";
      setAuthError(message);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
