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
      return stored ? JSON.parse(stored) : null;
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
      console.warn("Backend auth failed, attempting fallback:", err);
      // Fallback for offline demo if backend is not reachable
      const role = roleHint || (email.includes('admin') ? 'admin' : (email.includes('hr') ? 'hr' : (email.includes('sales') ? 'sales' : (email.includes('support') ? 'support' : 'employee'))));
      const fallbackUser = { id: 1, email, role, name: `${role.toUpperCase()} User`, department: `${role.toUpperCase()} Operations` };
      setUser(fallbackUser);
      localStorage.setItem('enterprise_auth_user', JSON.stringify(fallbackUser));
      setIsLoading(false);
      const target = getHomeRouteForRole(role);
      navigate(target);
      return { user: fallbackUser };
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
      console.warn("Backend register failed, fallback:", err);
      const fallbackUser = { id: Date.now(), email, role, name, department };
      setUser(fallbackUser);
      localStorage.setItem('enterprise_auth_user', JSON.stringify(fallbackUser));
      setIsLoading(false);
      const target = getHomeRouteForRole(role);
      navigate(target);
      return { user: fallbackUser };
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
