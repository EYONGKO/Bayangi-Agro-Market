// Theme Provider and Hooks for Bayangi Agro Market
import React, { createContext, useContext, type ReactNode } from 'react';
import { theme } from './colors';

// Create theme context
const ThemeContext = createContext(theme);

// Define props type
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme Provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper hooks for common theme properties
export const useColors = () => useTheme().colors;
export const useSpacing = () => useTheme().spacing;
export const useFontSizes = () => useTheme().fontSizes;
export const useBorderRadius = () => useTheme().borderRadius;
export const useBreakpoints = () => useTheme().breakpoints;

// Export default theme for direct import
export default theme;
