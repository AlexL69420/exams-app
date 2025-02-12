// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

import { LOCAL_API_URL } from "../enviroment.ts";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (
    tokenAccess: string,
    tokenRefresh: string,
    email: string,
    password: string,
  ) => void;
  logout: () => void;
  refresh(): void;
  userEmail: string | null;
  userPassword: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  refresh: () => {},
  userEmail: null,
  userPassword: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPassword, setUserPassword] = useState<string | null>(null);

  const login = (
    tokenAccess: string,
    tokenRefresh: string,
    email: string,
    password: string,
  ) => {
    // localStorage.setItem("accessToken", tokenAccess);
    // localStorage.setItem("refreshToken", tokenRefresh);
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserPassword(password);
  };

  const refresh = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await fetch(`${LOCAL_API_URL}auth/jwt/refresh/`, {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      console.error("Failed to refresh token");
      logout();
      return;
    }
    const data = await response.json();
    const newAccessToken = data.access_token;
    localStorage.setItem("accessToken", newAccessToken);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserPassword(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        refresh,
        userEmail,
        userPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
