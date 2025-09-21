// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, logout } from "@/app/redux/authSlice";

interface AuthContextType {
  token: string | null;
  user: any;
  login: (token: string, user: any) => void;
  logoutUser: () => void;
  updateUser: (updatedUser: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUserState] = useState<any>(null);
  const dispatch = useDispatch();

  // On mount: restore from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");    

    console.log("Stored Token: ", storedToken); 
    console.log("Stored User: ", storedUser);

    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      setUserState(parsedUser);
      dispatch(setUser(parsedUser)); // updates Redux
    }
  }, [dispatch]);

  const login = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUserState(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    dispatch(setUser(newUser)); // update Redux
  };

  const updateUser = (updatedUser: any) => {
    setUserState(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    dispatch(setUser(updatedUser)); // update Redux
  };

  const logoutUser = () => {
    setToken(null);
    setUserState(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(logout()); // clear Redux
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logoutUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
