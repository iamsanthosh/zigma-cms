'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ initialTheme, children }) {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  // Listen for page theme changes from child components
  useEffect(() => {
    const handlePageThemeChange = async (event) => {
      const pageThemeId = event.detail?.id;
      if (pageThemeId) {
        // Fetch page-specific theme data
        try {
          const response = await fetch(`/api/public/theme/${pageThemeId}`);
          if (response.ok) {
            const pageTheme = await response.json();
            setCurrentTheme(pageTheme);
          }
        } catch (error) {
          console.error('Failed to load page theme:', error);
        }
      } else {
        // Revert to global theme
        setCurrentTheme(initialTheme);
      }
    };

    window.addEventListener('pageThemeChange', handlePageThemeChange);
    return () => window.removeEventListener('pageThemeChange', handlePageThemeChange);
  }, [initialTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
