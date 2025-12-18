import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('signbuddy_theme');
    return savedTheme === 'dark' ? true : false;
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('signbuddy_theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('bg-slate-900');
      document.body.classList.remove('bg-[#eff6ff]'); // Hapus background biru muda
    } else {
      document.body.classList.add('bg-[#eff6ff]'); // PAKAI INI: Putih kebiruan (Blue-50)
      document.body.classList.remove('bg-slate-900');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);