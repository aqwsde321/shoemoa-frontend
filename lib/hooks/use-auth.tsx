"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getUserRole,
  setUserRole,
  removeUserRole,
} from "@/lib/auth-storage";
import { login as apiLogin } from "@/lib/api"; // Renamed to avoid conflict
import { LoginRequest, LoginResponse } from "@/lib/types";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (credentials: LoginRequest) => Promise<string | null>; // Returns role string or null
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const initialToken = typeof window !== "undefined" ? getAccessToken() : null;
  const initialRole = typeof window !== "undefined" ? getUserRole() : null;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!initialToken && !!initialRole);
  const [userRole, setUserRoleState] = useState<string | null>(initialRole);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // This useEffect is now mostly for re-evaluating if auth state changes from outside AuthProvider.
    // Initial load is handled in useState directly.
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<string | null> => { // Returns role string or null
      setIsLoading(true);
      try {
        const response = await apiLogin(credentials);
        if (response.success) {
          setAccessToken(response.data.accessToken);
          setUserRole(response.data.role);
          setIsAuthenticated(true);
          setUserRoleState(response.data.role);
          return response.data.role; // Return the role
        } else {
          // Handle login error
          console.error("Login failed:", response.message);
          return null; // Return null on failure
        }
      } catch (error) {
        console.error("Login API call failed:", error);
        return null; // Return null on failure
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setIsLoading(true);
    removeAccessToken();
    removeUserRole();
    setIsAuthenticated(false);
    setUserRoleState(null);
    router.push("/login"); // Redirect to login page on logout
    setIsLoading(false);
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
