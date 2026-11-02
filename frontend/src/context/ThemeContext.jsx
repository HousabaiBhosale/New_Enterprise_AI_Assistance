import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('enterprise_theme');
      if (saved) return saved;
      // Default to dark or user preference
      return 'dark';
    }
    return 'dark';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('enterprise_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('enterprise_theme', theme);
  }, [theme]);

  const isLight = theme === 'light';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isLight }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if rendered outside provider
    const isClient = typeof document !== 'undefined';
    const curTheme = isClient ? (document.documentElement.getAttribute('data-theme') || 'dark') : 'dark';
    return {
      theme: curTheme,
      setTheme: () => {},
      toggleTheme: () => {},
      isLight: curTheme === 'light'
    };
  }
  return context;
}
