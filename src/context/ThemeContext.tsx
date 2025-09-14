'use client';
import React, { createContext, useContext, ReactNode } from 'react';

// Theme colors
const colors = {
  carrotOrange: '#FF8B02',
  milkWhite: '#FFFFFF',
  heavyMetal: '#262626',
};

// Typography settings
const typography = {
  fontFamily: {
    regular: 'Lexend',
    bold: 'Lexend',
    light: 'Lexend',
  },
  fontWeight: {
    regular: 400,
    bold: 700,
    light: 300,
  },
  fontSize: {
    h1: '2.5rem',
    h2: '2rem',
    h3: '1.75rem',
    h4: '1.5rem',
    h5: '1.25rem',
    h6: '1rem',
    body: '1rem',
    small: '0.875rem',
  },
};

// Theme type
type Theme = {
  colors: typeof colors;
  typography: typeof typography;
};

// Theme object
const defaultTheme: Theme = {
  colors,
  typography,
};

// Create context with proper typing
const ThemeContext = createContext<Theme>(defaultTheme);

// Provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  return useContext(ThemeContext);
}; 