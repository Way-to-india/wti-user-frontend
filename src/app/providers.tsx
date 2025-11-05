'use client';

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { Provider } from 'react-redux';
import { store } from '../app/redux/store';
import { ThemeProvider } from '@/context/ThemeContext';
import { SearchProvider } from '@/context/SearchContext';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SearchProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </SearchProvider>
      </ThemeProvider>
    </Provider>
  );
}
