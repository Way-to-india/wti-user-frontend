'use client';

import React from 'react';
import { AuthProvider } from "../context/AuthContext";
import { Provider } from "react-redux";
import { store } from "../app/redux/store";
import { ThemeProvider } from "@/context/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
} 